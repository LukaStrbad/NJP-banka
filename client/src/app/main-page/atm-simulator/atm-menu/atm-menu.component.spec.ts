import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtmMenuComponent } from './atm-menu.component';

describe('AtmMenuComponent', () => {
  let component: AtmMenuComponent;
  let fixture: ComponentFixture<AtmMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtmMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtmMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
