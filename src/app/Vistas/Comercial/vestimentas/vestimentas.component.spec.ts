import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VestimentasComponent } from './vestimentas.component';

describe('VestimentasComponent', () => {
  let component: VestimentasComponent;
  let fixture: ComponentFixture<VestimentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VestimentasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VestimentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
