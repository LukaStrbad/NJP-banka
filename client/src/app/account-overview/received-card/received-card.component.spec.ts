import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedCardComponent } from './received-card.component';

describe('ReceivedCardComponent', () => {
  let component: ReceivedCardComponent;
  let fixture: ComponentFixture<ReceivedCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceivedCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceivedCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
