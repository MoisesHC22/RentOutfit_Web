import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoVendedorComponent } from './nuevo-vendedor.component';

describe('NuevoVendedorComponent', () => {
  let component: NuevoVendedorComponent;
  let fixture: ComponentFixture<NuevoVendedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoVendedorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoVendedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
