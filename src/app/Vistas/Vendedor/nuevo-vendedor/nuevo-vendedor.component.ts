import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FuncionesService } from '../../../Services/funciones.service';
import { CookieService } from 'ngx-cookie-service';


export function SoloLetras(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const soloLetrasRagExp = /^[a-zA-ZÁ-ÿ\s]+$/;
    return !value || soloLetrasRagExp.test(value) ? null : { SoloLetras: true };
  };
}

@Component({
  selector: 'app-nuevo-vendedor',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './nuevo-vendedor.component.html',
  styleUrls: ['./nuevo-vendedor.component.css']
})
export class NuevoVendedorComponent implements OnInit {
  datos: FormGroup;  // Cambiado de 'datos!' a 'datos: FormGroup'
  token: string | null = null;
  usuario: number | null = null;
  imagenPerfil: File | null = null;
  imagenPrevisualizacion: string | ArrayBuffer | null = null;
  statusImg = false;

  constructor(
    private funciones: FuncionesService,
    private form: FormBuilder,
    private router: Router,
    private cookie: CookieService,
    
  ) {
    // Inicializa datos aquí
    this.datos = this.form.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      codigoPostal: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      asentamiento: ['', Validators.required],
      estado: [{ value: '', disabled: true }, Validators.required],
      municipio: [{ value: '', disabled: true }, Validators.required],
      calle: ['', Validators.required],
      noInt: ['', Validators.required],
      noExt: ['', Validators.required],
      imagen: [null, [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.token = this.cookie.get('token');
    if (this.token) {
      const obtener = this.funciones.DecodificarToken(this.token);
      this.usuario = obtener?.usuario ? Number(obtener.usuario) : null;
    } else {
      this.router.navigate(['/Login']);
      return;
    }
  }

  onCodigoPostalChange(): void {
    const codigoPostal = this.datos.get('codigoPostal')?.value;
    if (codigoPostal && codigoPostal.length === 5) {
      this.funciones.obtenerDatosPorCodigoPostal(codigoPostal).subscribe(
        (response) => {
          console.log('Respuesta del servicio para código postal:', response);
          if (response && response.estado && response.municipio && response.asentamiento) {
            this.datos.patchValue({
              estado: response.estado,
              municipio: response.municipio,
              asentamiento: response.asentamiento
            });
          } else {
            console.warn('No se encontraron datos para el código postal ingresado.');
            this.limpiarCampos();
          }
        },
        (error) => {
          console.error('Error al obtener datos del código postal:', error);
          this.limpiarCampos();
        }
      );
    } else {
      this.limpiarCampos();
    }
  }

  limpiarCampos(): void {
    this.datos.patchValue({
      estado: '',
      municipio: '',
      asentamiento: ''
    });
  }

  cargarImagen(): void {
    const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
    fileInput.click();
  }

  imagenSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (this.isImageSizeValid(file)) {
        this.setImagePreview(file);
      } else {
        this.datos.get('imagen')?.setErrors({ maxSize: true });
        this.limpiarImagen();
      }
    } else {
      this.limpiarImagen();
    }
  }

  isImageSizeValid(file: File): boolean {
    const tamanoMaximoMB = 2;
    const tamanoMaximoBytes = tamanoMaximoMB * 1024 * 1024;
    return file.size <= tamanoMaximoBytes;
  }

  setImagePreview(file: File): void {
    this.imagenPerfil = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagenPrevisualizacion = reader.result;
    };
    this.datos.get('imagen')?.setValue(file);
    this.statusImg = true;
    reader.readAsDataURL(file);
  }

  limpiarImagen(): void {
    this.imagenPerfil = null;
    this.imagenPrevisualizacion = null;
    this.statusImg = false;
    this.datos.get('imagen')?.setValue(null);
  }

  ValidarInputNumerosIyE(event: Event): void {
    const input = event.target as HTMLInputElement;
    const valor = input.value.replace(/[^0-9sSnN\/]/g, ''); 
    input.value = valor.match(/^[0-9]{0,3}$|^[sS][\/][nN]$/) ? valor : ''; 
  }

  darDeAlta(usuario: number): void {
    const formData = new FormData();
    const noInt = this.datos.value.noInt === '0' ? 'S/N' : this.datos.value.noInt;
    const noExt = this.datos.value.noExt === '0' ? 'S/N' : this.datos.value.noExt;

    formData.append('usuarioID', usuario.toString());
    formData.append('nombreEstablecimiento', this.datos.value.nombre);
    formData.append('codigoPostal', this.datos.value.codigoPostal);
    formData.append('colonia', this.datos.value.colonia);
    formData.append('calle', this.datos.value.calle);
    formData.append('noInt', noInt);
    formData.append('noExt', noExt);
    formData.append('estado', this.datos.value.estado);
    formData.append('municipio', this.datos.value.municipio);
    formData.append('imagen', this.imagenPerfil!);

    this.funciones.DarDeAltaEstablecimiento(formData).subscribe({
      next: (response) => {
        console.log('Establecimiento registrado con éxito', response);
        this.router.navigate(['/Cliente/home']);
      },
      error: (err) => {
        console.error('Ocurrió un error al dar de alta el establecimiento.', err);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/']);
  }
}
