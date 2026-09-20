import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ExpenseFormComponent } from './expense-form';

describe('ExpenseFormComponent', () => {
  let component: ExpenseFormComponent;
  let fixture: ComponentFixture<ExpenseFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseFormComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('starts with an invalid form when amount is not set', () => {
    expect(component.form.valid).toBe(false);
    expect(component.form.controls.amount.errors?.['min']).toBeTruthy();
  });

  it('accepts a valid expense payload', () => {
    component.form.patchValue({
      amount: 25,
      category: 'Food',
      date: '2026-09-01',
      note: 'Lunch with the team',
    });
    expect(component.form.valid).toBe(true);
  });

  it('rejects a future date', () => {
    component.form.patchValue({ date: '2099-01-01' });
    expect(component.form.controls.date.errors?.['futureDate']).toBeTruthy();
  });
});