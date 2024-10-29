import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarVestimentaComponent } from './agregar-vestimenta.component';

describe('AgregarVestimentaComponent', () => {
  let component: AgregarVestimentaComponent;
  let fixture: ComponentFixture<AgregarVestimentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarVestimentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarVestimentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
