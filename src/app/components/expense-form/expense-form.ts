import {
  Component,
  EffectRef,
  computed,
  effect,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ExpenseCategory } from '../../models/expense.model';
import { ExpenseService } from '../../services/expense.service';

/**
 * Custom validator: the selected date must not be in the future.
 */
function noFutureDateValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const rawValue = control.value as string | null;

  if (!rawValue) {
    return null;
  }

  const selectedDate = new Date(`${rawValue}T00:00:00`);

  if (Number.isNaN(selectedDate.getTime())) {
    return { invalidDate: true };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selectedDate.getTime() > today.getTime()
    ? { futureDate: true }
    : null;
}

/**
 * Reactive form used for BOTH creating and editing expenses.
 *
 * - Add mode: shows an empty form with an "Add Expense" button.
 * - Edit mode: pre-fills the form from the `editingExpense` signal and
 *   switches the button to "Update Expense" plus a "Cancel" action.
 */
@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.css',
})
export class ExpenseFormComponent {
  private readonly expenseService = inject(ExpenseService);
  private readonly fb = inject(FormBuilder);

  readonly categories: ReadonlyArray<ExpenseCategory> = [
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Entertainment',
    'Other',
  ];

  /** Native caps for the date input; prevents picking future dates via UI. */
  readonly maxDate: string = this.toISODateString(new Date());

  readonly form = this.fb.nonNullable.group({
    amount: [0, [Validators.required, Validators.min(0.01)]],
    category: ['Food' as ExpenseCategory, [Validators.required]],
    date: [this.toISODateString(new Date()), [Validators.required, noFutureDateValidator]],
    note: ['', [Validators.maxLength(200)]],
  });

  readonly isEditing = computed(
    () => this.expenseService.editingExpense() !== null,
  );

  private readonly editingWatcher: EffectRef = effect(() => {
    const editingExpense = this.expenseService.editingExpense();

    if (editingExpense) {
      this.form.patchValue({
        amount: editingExpense.amount,
        category: editingExpense.category,
        date: editingExpense.date,
        note: editingExpense.note ?? '',
      });
      return;
    }

    this.resetForm();
  });

  get amount(): AbstractControl<number> {
    return this.form.controls.amount;
  }

  get category(): AbstractControl<ExpenseCategory> {
    return this.form.controls.category;
  }

  get date(): AbstractControl<string> {
    return this.form.controls.date;
  }

  get note(): AbstractControl<string> {
    return this.form.controls.note;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { amount, category, date, note } = this.form.getRawValue();
    const trimmedNote = note.trim();
    const payload = {
      amount,
      category,
      date,
      note: trimmedNote.length > 0 ? trimmedNote : undefined,
    };

    const editingExpense = this.expenseService.editingExpense();

    if (editingExpense) {
      this.expenseService.updateExpense(editingExpense.id, payload);
    } else {
      this.expenseService.addExpense(payload);
    }
  }

  onCancelEdit(): void {
    this.expenseService.setEditingExpense(null);
    this.resetForm();
  }

  private resetForm(): void {
    this.form.reset({
      amount: 0,
      category: 'Food' as ExpenseCategory,
      date: this.toISODateString(new Date()),
      note: '',
    });
  }

  private toISODateString(date: Date): string {
    // Format in local time (not UTC) so the date picker shows the right day.
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60_000,
    );
    return localDate.toISOString().slice(0, 10);
  }
}