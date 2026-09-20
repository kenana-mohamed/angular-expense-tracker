import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
} from '@angular/core';

/**
 * Highlights the host element when `amount` exceeds `threshold`.
 *
 * - Over budget -> soft orange background (`#fef3c7`).
 * - Severely over budget (more than double the threshold) -> light red
 *   background (`#fee2e2`).
 * - Within budget  -> background is left untouched (previously applied
 *   highlight styles are removed so a row can never stay stale).
 */
@Directive({
  selector: '[appHighlightOverBudget]',
  standalone: true,
})
export class HighlightOverBudgetDirective implements OnChanges {
  @Input({ alias: 'appHighlightOverBudget', required: true }) amount!: number;
  @Input() threshold = 100;

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2,
  ) {}

  ngOnChanges(): void {
    const parsedAmount = Number(this.amount);
    const parsedThreshold = Number(this.threshold);

    if (
      !Number.isFinite(parsedAmount) ||
      !Number.isFinite(parsedThreshold) ||
      parsedAmount <= parsedThreshold
    ) {
      this.removeHighlight();
      return;
    }

    const isSeverelyOverBudget = parsedAmount > parsedThreshold * 2;
    const backgroundColor = isSeverelyOverBudget ? '#fee2e2' : '#fef3c7';
    const borderColor = isSeverelyOverBudget ? '#fca5a5' : '#fcd34d';

    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'background-color',
      backgroundColor,
    );
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'border-color',
      borderColor,
    );
  }

  private removeHighlight(): void {
    this.renderer.removeStyle(
      this.elementRef.nativeElement,
      'background-color',
    );
    this.renderer.removeStyle(this.elementRef.nativeElement, 'border-color');
  }
}