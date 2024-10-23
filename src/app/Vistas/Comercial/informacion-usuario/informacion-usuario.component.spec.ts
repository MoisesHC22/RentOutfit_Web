import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionUsuarioComponent } from './informacion-usuario.component';

describe('InformacionUsuarioComponent', () => {
  let component: InformacionUsuarioComponent;
  let fixture: ComponentFixture<InformacionUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformacionUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InformacionUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
