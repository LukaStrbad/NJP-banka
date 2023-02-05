import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyWithdrawalComponent } from './money-withdrawal.component';

describe('MoneyWithdrawalComponent', () => {
  let component: MoneyWithdrawalComponent;
  let fixture: ComponentFixture<MoneyWithdrawalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoneyWithdrawalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoneyWithdrawalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
