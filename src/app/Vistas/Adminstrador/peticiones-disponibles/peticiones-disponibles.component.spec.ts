import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeticionesDisponiblesComponent } from './peticiones-disponibles.component';

describe('PeticionesDisponiblesComponent', () => {
  let component: PeticionesDisponiblesComponent;
  let fixture: ComponentFixture<PeticionesDisponiblesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeticionesDisponiblesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeticionesDisponiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
