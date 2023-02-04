import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentCardComponent } from './sent-card.component';

describe('SentCardComponent', () => {
  let component: SentCardComponent;
  let fixture: ComponentFixture<SentCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SentCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SentCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
