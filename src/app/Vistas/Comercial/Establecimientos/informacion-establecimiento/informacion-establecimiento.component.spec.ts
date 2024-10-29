import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionEstablecimientoComponent } from './informacion-establecimiento.component';

describe('InformacionEstablecimientoComponent', () => {
  let component: InformacionEstablecimientoComponent;
  let fixture: ComponentFixture<InformacionEstablecimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformacionEstablecimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformacionEstablecimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
