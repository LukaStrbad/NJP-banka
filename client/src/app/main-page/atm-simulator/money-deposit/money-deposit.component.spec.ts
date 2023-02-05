import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyDepositComponent } from './money-deposit.component';

describe('MoneyDepositComponent', () => {
  let component: MoneyDepositComponent;
  let fixture: ComponentFixture<MoneyDepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoneyDepositComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoneyDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
