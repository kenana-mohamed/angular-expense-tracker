export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Bills'
  | 'Entertainment'
  | 'Other';

export interface Expense {
  id: number;
  amount: number;
  category: ExpenseCategory;
  date: string;
  note?: string;
}

export interface ChatbotRequest {
  message: string;
  sessionId: string;
  expenses: Expense[];
}

export interface ChatbotResponse {
  reply: string;
}