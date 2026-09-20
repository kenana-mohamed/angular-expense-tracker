import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Expense } from '../models/expense.model';
import { environment } from '../../environments/environment';

/**
 * Central state store for expenses.
 *
 * Exposes reactive Signals for the expense list, the expense currently being
 * edited, the loading state and the last error message. All CRUD operations
 * talk to the json-server REST API defined in `environment.apiUrl`.
 */
@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  readonly expenses = signal<Expense[]>([]);
  readonly editingExpense = signal<Expense | null>(null);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  loadExpenses(): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<Expense[]>(this.apiUrl).subscribe({
      next: (expenses) => {
        this.expenses.set(
          expenses.map((expense) => ({
            ...expense,
            // json-server may return ids as strings; normalize them to numbers.
            id: Number(expense.id),
          })),
        );
        this.loading.set(false);
      },
      error: this.handleError('load expenses'),
    });
  }

  addExpense(expense: Omit<Expense, 'id'>): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.post<Expense>(this.apiUrl, expense).subscribe({
      next: () => this.loadExpenses(),
      error: this.handleError('add expense'),
    });
  }

  updateExpense(id: number, expense: Partial<Expense>): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.put<Expense>(`${this.apiUrl}/${id}`, expense).subscribe({
      next: () => {
        this.editingExpense.set(null);
        this.loadExpenses();
      },
      error: this.handleError('update expense'),
    });
  }

  deleteExpense(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => this.loadExpenses(),
      error: this.handleError('delete expense'),
    });
  }

  setEditingExpense(expense: Expense | null): void {
    this.editingExpense.set(expense);
  }

  private readonly handleError =
    (operation: string) =>
    (err: unknown): void => {
      const status =
        err instanceof HttpErrorResponse && err.status
          ? ` (${err.status} ${err.statusText ?? ''})`.trimEnd()
          : '';

      const message = `Failed to ${operation}${status}. Please try again.`;

      this.error.set(message);
      this.loading.set(false);
      console.error(message, err);
    };
}