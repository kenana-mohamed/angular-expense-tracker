import { Component, OnInit, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ExpenseFormComponent } from './components/expense-form/expense-form';
import { ExpenseListComponent } from './components/expense-list/expense-list';
import { ChatbotComponent } from './components/chatbot/chatbot';
import { ExpenseService } from './services/expense.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ExpenseFormComponent,
    ExpenseListComponent,
    ChatbotComponent,
    CurrencyPipe,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly expenseService = inject(ExpenseService);

  readonly totalExpenses = computed(() =>
    this.expenseService
      .expenses()
      .reduce((sum, expense) => sum + Number(expense.amount), 0),
  );

  ngOnInit(): void {
    this.expenseService.loadExpenses();
  }
}