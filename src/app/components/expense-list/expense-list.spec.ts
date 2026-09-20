import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ExpenseListComponent } from './expense-list';

describe('ExpenseListComponent', () => {
  let component: ExpenseListComponent;
  let fixture: ComponentFixture<ExpenseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseListComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filters and totals expenses reactively', () => {
    component.expenseService.expenses.set([
      { id: 1, amount: 10, category: 'Food', date: '2026-09-01', note: 'Lunch' },
      { id: 2, amount: 20, category: 'Bills', date: '2026-09-02' },
    ]);

    expect(component.filteredExpenses().length).toBe(2);
    expect(component.runningTotal()).toBe(30);

    component.selectedCategory.set('Food');
    expect(component.filteredExpenses().length).toBe(1);
    expect(component.runningTotal()).toBe(10);
  });
});