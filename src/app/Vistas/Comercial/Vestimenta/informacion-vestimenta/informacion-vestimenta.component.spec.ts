import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionVestimentaComponent } from './informacion-vestimenta.component';

describe('InformacionVestimentaComponent', () => {
  let component: InformacionVestimentaComponent;
  let fixture: ComponentFixture<InformacionVestimentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformacionVestimentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformacionVestimentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
