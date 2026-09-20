import { Pipe, PipeTransform } from '@angular/core';
import { ExpenseCategory } from '../models/expense.model';

/**
 * Renders a category as an emoji prefix plus its label,
 * e.g. `Food` becomes `🍔 Food`.
 */
@Pipe({
  name: 'categoryIcon',
  standalone: true,
})
export class CategoryIconPipe implements PipeTransform {
  private readonly categoryIcons: Record<ExpenseCategory, string> = {
    Food: '🍔 Food',
    Transport: '🚗 Transport',
    Shopping: '🛍️ Shopping',
    Bills: '💡 Bills',
    Entertainment: '🎬 Entertainment',
    Other: '📦 Other',
  };

  transform(category: ExpenseCategory | null | undefined): string {
    const normalized = category ?? 'Other';
    return this.categoryIcons[normalized];
  }
}