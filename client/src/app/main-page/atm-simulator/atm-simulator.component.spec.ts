import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtmSimulatorComponent } from './atm-simulator.component';

describe('AtmSimulatorComponent', () => {
  let component: AtmSimulatorComponent;
  let fixture: ComponentFixture<AtmSimulatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtmSimulatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtmSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
