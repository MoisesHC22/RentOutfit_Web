import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisoEmailComponent } from './aviso-email.component';

describe('AvisoEmailComponent', () => {
  let component: AvisoEmailComponent;
  let fixture: ComponentFixture<AvisoEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvisoEmailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvisoEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
