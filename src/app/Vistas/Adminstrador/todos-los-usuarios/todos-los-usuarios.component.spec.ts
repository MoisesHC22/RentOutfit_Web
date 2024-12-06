import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodosLosUsuariosComponent } from './todos-los-usuarios.component';

describe('TodosLosUsuariosComponent', () => {
  let component: TodosLosUsuariosComponent;
  let fixture: ComponentFixture<TodosLosUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodosLosUsuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodosLosUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
