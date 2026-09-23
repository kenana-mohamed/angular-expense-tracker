import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Expense, ExpenseCategory } from '../../models/expense.model';
import { ExpenseService } from '../../services/expense.service';
import { CategoryIconPipe } from '../../pipes/category-icon.pipe';
import { HighlightOverBudgetDirective } from '../../directives/highlight-over-budget.directive';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, CategoryIconPipe, HighlightOverBudgetDirective],
  templateUrl: './expense-list.html',
  styleUrl: './expense-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseListComponent {
  readonly expenseService = inject(ExpenseService);

  /** Default budget threshold consumed by the highlight directive. */
  readonly budgetThreshold = 100;

  readonly categoryOptions: ReadonlyArray<'All' | ExpenseCategory> = [
    'All',
    'Food',
    'Transport',
    'Shopping',
    'Bills',
    'Entertainment',
    'Other',
  ];

  readonly selectedCategory = signal<'All' | ExpenseCategory>('All');
  readonly searchQuery = signal('');
  readonly sortBy = signal<'date' | 'amount'>('date');
  readonly sortOrder = signal<'asc' | 'desc'>('desc');

  readonly filteredExpenses = computed<Expense[]>(() => {
    const category = this.selectedCategory();
    const query = this.searchQuery().trim().toLowerCase();
    const sortKey = this.sortBy();
    const direction = this.sortOrder() === 'asc' ? 1 : -1;

    return this.expenseService
      .expenses()
      .filter((expense) => {
        const matchesCategory =
          category === 'All' || expense.category === category;

        const matchesSearch =
          !query ||
          (expense.note ?? '').toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
      })
      .sort((first, second) => {
        const firstValue =
          sortKey === 'amount'
            ? Number(first.amount)
            : new Date(String(first.date)).getTime();

        const secondValue =
          sortKey === 'amount'
            ? Number(second.amount)
            : new Date(String(second.date)).getTime();

        const comparison = firstValue - secondValue;
        return Number.isFinite(comparison) ? comparison * direction : 0;
      });
  });

  readonly runningTotal = computed(() =>
    this.filteredExpenses().reduce(
      (total, expense) => total + Number(expense.amount),
      0,
    ),
  );

  onCategoryChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedCategory.set(
      value === 'All' ? 'All' : (value as ExpenseCategory),
    );
  }

  onSearchChange(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  onSortByChange(event: Event): void {
    this.sortBy.set(
      (event.target as HTMLSelectElement).value as 'date' | 'amount',
    );
  }

  onSortOrderChange(event: Event): void {
    this.sortOrder.set(
      (event.target as HTMLSelectElement).value as 'asc' | 'desc',
    );
  }

  editExpense(expense: Expense): void {
    this.expenseService.setEditingExpense(expense);
  }

  deleteExpense(id: string): void {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      this.expenseService.deleteExpense(id);
    }
  }

  retryLoad(): void {
    this.expenseService.loadExpenses();
  }
}