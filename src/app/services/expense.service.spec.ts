import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ExpenseService } from './expense.service';
import { environment } from '../../environments/environment';

describe('ExpenseService', () => {
  let service: ExpenseService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ExpenseService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Every request issued by the service must be flushed/verified.
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('loads expenses and normalizes string ids to numbers', () => {
    service.loadExpenses();

    const request = httpTesting.expectOne(environment.apiUrl);
    request.flush([
      {
        id: '1',
        amount: 50,
        category: 'Food',
        date: '2026-09-01',
        note: 'Lunch',
      },
      { id: '2', amount: 25, category: 'Bills', date: '2026-09-02' },
    ]);

    expect(service.expenses().length).toBe(2);
    expect(service.expenses()[0].id).toBe(1);
    expect(service.expenses()[1].amount).toBe(25);
    expect(service.loading()).toBe(false);
    expect(service.error()).toBeNull();
  });

  it('tracks loading and clears the error on load', () => {
    service.error.set('Stale error');
    service.loadExpenses();

    expect(service.loading()).toBe(true);
    expect(service.error()).toBeNull();

    httpTesting.expectOne(environment.apiUrl).flush([]);
    expect(service.loading()).toBe(false);
    expect(service.expenses().length).toBe(0);
  });

  it('adds an expense via POST and refreshes the list', () => {
    service.addExpense({
      amount: 75,
      category: 'Shopping',
      date: '2026-09-05',
      note: 'T-shirt',
    });

    const postRequest = httpTesting.expectOne(environment.apiUrl);
    expect(postRequest.request.method).toBe('POST');
    expect(postRequest.request.body).toEqual({
      amount: 75,
      category: 'Shopping',
      date: '2026-09-05',
      note: 'T-shirt',
    });
    postRequest.flush({ id: 9, ...postRequest.request.body });

    // The service re-fetches the list after a successful POST.
    httpTesting.expectOne(environment.apiUrl).flush([]);
    expect(service.loading()).toBe(false);
    expect(service.error()).toBeNull();
  });

  it('sets and clears the editing expense via the helper', () => {
    const expense = {
      id: 3,
      amount: 100,
      category: 'Food' as const,
      date: '2026-09-01',
    };

    service.setEditingExpense(expense);
    expect(service.editingExpense()).toEqual(expense);

    service.setEditingExpense(null);
    expect(service.editingExpense()).toBeNull();
  });
});