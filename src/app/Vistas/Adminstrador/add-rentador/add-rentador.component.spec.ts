import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRentadorComponent } from './add-rentador.component';

describe('AddRentadorComponent', () => {
  let component: AddRentadorComponent;
  let fixture: ComponentFixture<AddRentadorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddRentadorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRentadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
