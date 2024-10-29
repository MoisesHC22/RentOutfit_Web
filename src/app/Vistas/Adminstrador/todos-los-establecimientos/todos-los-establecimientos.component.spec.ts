import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosLosEstablecimientosComponent } from './todos-los-establecimientos.component';

describe('TodosLosEstablecimientosComponent', () => {
  let component: TodosLosEstablecimientosComponent;
  let fixture: ComponentFixture<TodosLosEstablecimientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodosLosEstablecimientosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodosLosEstablecimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
