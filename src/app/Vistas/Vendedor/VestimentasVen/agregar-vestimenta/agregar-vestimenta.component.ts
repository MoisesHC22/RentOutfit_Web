import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-agregar-vestimenta',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './agregar-vestimenta.component.html',
  styleUrl: './agregar-vestimenta.component.css'
})
export class AgregarVestimentaComponent {

  formPrenda: FormGroup;
  imagenesPerfil: (File | null)[] = [null, null, null, null];
  imagenesPrevisualizacion: (string | ArrayBuffer | null)[] = [null, null, null, null];

  constructor(private fb: FormBuilder) {
    this.formPrenda = this.fb.group({
      nombre: ['', Validators.required],
      precio: [null, Validators.required],
      stock: [1, Validators.required],
      descripcion: ['', Validators.required],
      talla: ['', Validators.required],
      categoria: ['', Validators.required],
      imagen1: [null, Validators.required],
      imagen2: [null, Validators.required],
      imagen3: [null, Validators.required],
      imagen4: [null, Validators.required],
    });
  }

  cargarImagen(index: number) {
    const input = document.querySelectorAll('input[type="file"]')[index] as HTMLInputElement;
    input.click();
  }

  imagenSeleccionada(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const tamanoMaximoMB = 2;
      const tamanoMaximoBytes = tamanoMaximoMB * 1024 * 1024;

      if (file.size > tamanoMaximoBytes) {
        this.formPrenda.get(`imagen${index + 1}`)?.setErrors({ maxSize: true });
        this.imagenesPerfil[index] = null;
        this.imagenesPrevisualizacion[index] = null;
        return;
      }

      this.imagenesPerfil[index] = file;
      const reader = new FileReader();

      reader.onload = () => {
        this.imagenesPrevisualizacion[index] = reader.result;
      };
      reader.readAsDataURL(this.imagenesPerfil[index]);
    }
  }

  onSubmit() {
    if (this.formPrenda.valid) {
      console.log('Formulario válido:', this.formPrenda.value);
      // Lógica para enviar los datos
    } else {
      console.log('Formulario inválido');
    }
  }
}