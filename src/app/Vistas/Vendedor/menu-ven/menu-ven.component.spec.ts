import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuVenComponent } from './menu-ven.component';

describe('MenuVenComponent', () => {
  let component: MenuVenComponent;
  let fixture: ComponentFixture<MenuVenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuVenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuVenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
