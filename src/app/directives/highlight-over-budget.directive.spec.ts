import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HighlightOverBudgetDirective } from './highlight-over-budget.directive';

@Component({
  standalone: true,
  imports: [HighlightOverBudgetDirective],
  template: `
    <div id="target" [appHighlightOverBudget]="amount" [threshold]="threshold">
      Spend
    </div>
  `,
})
class TestHostComponent {
  amount = 150;
  threshold = 100;
}

describe('HighlightOverBudgetDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let element: HTMLElement;
  let directive: HighlightOverBudgetDirective;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    element = fixture.nativeElement.querySelector('#target') as HTMLElement;
    directive = fixture.debugElement
      .query(By.directive(HighlightOverBudgetDirective))
      .injector.get(HighlightOverBudgetDirective);
    fixture.detectChanges();
  });

  it('applies the soft orange highlight when over budget', () => {
    // jsdom normalizes hex colors to rgb().
    expect(element.style.backgroundColor).toBe('rgb(254, 243, 199)'); // #fef3c7
  });

  it('escalates to the light red highlight when severely over budget', () => {
    directive.amount = 250;
    directive.ngOnChanges();
    expect(element.style.backgroundColor).toBe('rgb(254, 226, 226)'); // #fee2e2
  });

  it('removes the highlight when the amount returns within budget', () => {
    directive.amount = 50;
    directive.ngOnChanges();
    expect(element.style.backgroundColor).toBe('');
  });

  it('does not highlight an amount exactly at the threshold', () => {
    directive.amount = 100;
    directive.ngOnChanges();
    expect(element.style.backgroundColor).toBe('');
  });
});