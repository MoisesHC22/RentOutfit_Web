import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfEstablecimientoComponent } from './inf-establecimiento.component';

describe('InfEstablecimientoComponent', () => {
  let component: InfEstablecimientoComponent;
  let fixture: ComponentFixture<InfEstablecimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfEstablecimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfEstablecimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
