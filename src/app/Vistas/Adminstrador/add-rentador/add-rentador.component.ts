import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-rentador',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './add-rentador.component.html',
  styleUrl: './add-rentador.component.css'
})
export class AddRentadorComponent implements OnInit {

  rentadorForm: FormGroup;
  imagenPerfil: File | null = null;
  imagenPrevisualizacion: string | ArrayBuffer | null = null;
  statusImg = false;

  constructor(private fb: FormBuilder) {
    this.rentadorForm = this.fb.group({
      codigoPostal: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      estado: ['', Validators.required],
      municipio: ['', Validators.required],
      localidad: ['', Validators.required],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      direccion: ['', Validators.required],
      referencias: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.rentadorForm.valid) {
      // Procesar los datos del formulario
      console.log(this.rentadorForm.value);
    } else {
      // Marcar los campos como tocados para mostrar mensajes de error
      this.rentadorForm.markAllAsTouched();
    }
  }

  // Código para la carga y validación de la imagen
  cargarImagen() {
    const file = document.getElementById('imageUpload') as HTMLInputElement;
    file.click();
  }

  imagenSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const tamanoMaximoMB = 2;
      const tamanoMaximoBytes = tamanoMaximoMB * 1024 * 1024;

      if (file.size > tamanoMaximoBytes) {
        this.rentadorForm.get('imagen')?.setErrors({ maxSize: true });
        this.imagenPerfil = null;
        this.imagenPrevisualizacion = null;
        this.statusImg = false;
        return;
      }

      this.imagenPerfil = file;
      const reader = new FileReader();

      reader.onload = () => {
        this.imagenPrevisualizacion = reader.result;
      };
      this.statusImg = true;
      reader.readAsDataURL(this.imagenPerfil);
    }
    console.log(this.imagenPerfil);
  }

  // Getters para acceder fácilmente a los controles del formulario
  get codigoPostal() {
    return this.rentadorForm.get('codigoPostal');
  }

  get estado() {
    return this.rentadorForm.get('estado');
  }

  get municipio() {
    return this.rentadorForm.get('municipio');
  }

  get localidad() {
    return this.rentadorForm.get('localidad');
  }

  get nombre() {
    return this.rentadorForm.get('nombre');
  }

  get direccion() {
    return this.rentadorForm.get('direccion');
  }
}
