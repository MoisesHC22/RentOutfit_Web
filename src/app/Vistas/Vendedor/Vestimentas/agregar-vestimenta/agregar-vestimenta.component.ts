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

  datos: any;

  // Declaramos que las imágenes pueden ser File o null
  imagenesPerfil: (File | null)[] = [null, null, null, null];
  imagenesPrevisualizacion: (string | ArrayBuffer | null)[] = [null, null, null, null];

  // Método para activar el input file de la imagen correspondiente
  cargarImagen(index: number) {
    const input = document.querySelectorAll('input[type="file"]')[index] as HTMLInputElement;
    input.click();
  }

  // Método para manejar la selección de una imagen en un cuadro específico
  imagenSeleccionada(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const tamanoMaximoMB = 2;
      const tamanoMaximoBytes = tamanoMaximoMB * 1024 * 1024;

      if (file.size > tamanoMaximoBytes) {
        this.datos.get('imagen')?.setErrors({ maxSize: true });
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

    console.log(this.imagenesPerfil[index]);
  }
}