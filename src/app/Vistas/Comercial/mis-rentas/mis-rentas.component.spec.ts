import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisRentasComponent } from './mis-rentas.component';

describe('MisRentasComponent', () => {
  let component: MisRentasComponent;
  let fixture: ComponentFixture<MisRentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisRentasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisRentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
