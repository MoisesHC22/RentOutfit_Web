import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestalleVestimentaComponent } from './destalle-vestimenta.component';

describe('DestalleVestimentaComponent', () => {
  let component: DestalleVestimentaComponent;
  let fixture: ComponentFixture<DestalleVestimentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestalleVestimentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DestalleVestimentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
