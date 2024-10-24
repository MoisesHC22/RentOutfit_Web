import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaVestimentasComponent } from './lista-vestimentas.component';

describe('ListaVestimentasComponent', () => {
  let component: ListaVestimentasComponent;
  let fixture: ComponentFixture<ListaVestimentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaVestimentasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaVestimentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
