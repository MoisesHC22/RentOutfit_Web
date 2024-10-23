import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeVestimentasComponent } from './home-vestimentas.component';

describe('HomeVestimentasComponent', () => {
  let component: HomeVestimentasComponent;
  let fixture: ComponentFixture<HomeVestimentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeVestimentasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeVestimentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
