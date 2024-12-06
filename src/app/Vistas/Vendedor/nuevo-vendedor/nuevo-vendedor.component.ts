import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { FuncionesService } from '../../../Services/funciones.service';
import { CookieService } from 'ngx-cookie-service';
import { EstadoInterface } from '../../../Interfaces/estado.interface';
import { MunicipioInterface } from '../../../Interfaces/municipios.interfaces';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faShop, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';

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
    FontAwesomeModule,
    LottieComponent
  ],
  templateUrl: './nuevo-vendedor.component.html',
  styleUrls: ['./nuevo-vendedor.component.css']
})
export class NuevoVendedorComponent implements OnInit {
  datos: any;

  token: string | null = null;
  usuario: number | null = null;
  imagenPerfil: File | null = null;
  imagenPrevisualizacion: string | ArrayBuffer | null = null;
  statusImg = false;

  faArrow = faArrowLeft;
  faShop = faShop;
  faLocationDot = faLocationDot;


  estados: string | null = null;
  municipio: string | null = null;
  paso: number = 1;
  
  mostrarAnimacionExito = false;

  constructor( private Funciones: FuncionesService, private form: FormBuilder, private router: Router, private cookie: CookieService,) {   }

  EstadosList: EstadoInterface[]=[];
  MunicipioList: MunicipioInterface[]=[];

  ngOnInit(): void {
   
    this.ListaEstados();

    this.datos = this.form.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      codigoPostal: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      colonia: ['', Validators.required],
      estado: [0, Validators.required],
      municipio: [ '' , Validators.required],
      calle: ['', Validators.required],
      noInt: ['', Validators.required],
      noExt: ['', Validators.required],
      imagen: [null, [Validators.required]]
    });

    this.token = this.cookie.get('token');
    
    if (this.token) {
      const obtener = this.Funciones.DecodificarToken(this.token);
      this.usuario = obtener?.usuario ? Number(obtener.usuario) : null;
    } else {
      this.router.navigate(['/Login']);
      return;
    }

  }

  animationExito: AnimationOptions = {
    path: '/Animaciones/Correcto.json'
  }

  Paso1Completo(): boolean {
    return this.datos.get('nombre')?.valid && this.datos.get('imagen')?.valid;
  }

  Paso2Completo(): boolean {
    return this.datos.get('codigoPostal')?.valid &&
           this.datos.get('estado')?.valid &&
           this.datos.get('municipio')?.valid &&
           this.datos.get('colonia')?.valid &&
           this.datos.get('calle')?.valid &&
           this.datos.get('noInt')?.valid &&
           this.datos.get('noExt')?.valid;
  }


  siguientePaso() 
  {
    if (this.paso < 2) {
      this.paso++;
    }
  }

  AnteriorPaso()
  {
    if (this.paso > 1)
    {
      this.paso--;

      if(this.paso === 2 && this.imagenPerfil){
        this.statusImg = true;
      }
    }
  }




  ListaEstados(){
    this.Funciones.ObtenerEstados().subscribe({
      next: (result) => {
        this.EstadosList = result;
      },
      error: (err) => {
        console.log(err)
      }
    });
  }

  ListaMunicipios(estadoID: number){
    this.Funciones.ObtenerMunicipios(estadoID).subscribe({
      next: (result) => {
        this.MunicipioList = result;
      },
      error: (err) => {
        console.log(err)
      }
    });
  }

  EstadoSeleccionado(event: Event)
  {
  const seleccion = event.target as HTMLSelectElement;
  const estadoID = seleccion.value;
  if(estadoID) {
    const id = Number(estadoID);
    if(!isNaN(id)){
      this.datos.patchValue({ estado: id})
      this.ListaMunicipios(id);
    }
  }
}

  onCodigoPostalChange(): void {
    const codigoPostal = this.datos.get('codigoPostal')?.value;
    if (codigoPostal && codigoPostal.length === 5) {
      this.Funciones.obtenerDatosPorCodigoPostal(codigoPostal).subscribe(
        (response) => {
          console.log('Respuesta del servicio para código postal:', response);
          if (response && response.estado && response.municipio && response.asentamiento) {
            this.datos.patchValue({
              colonia: response.asentamiento
            });

           const estadoEncontrado = this.EstadosList.find(e => e.nombreEstado === response.estado);
           if(estadoEncontrado) {
            this.datos.patchValue({ estado: estadoEncontrado.estadoID});
            this.ListaMunicipios(estadoEncontrado.estadoID!);
           }


           setTimeout(() => {
            const municipioEncontrado = this.MunicipioList.find(m => m.nombreMunicipio === response.municipio);
            if (municipioEncontrado) {
              this.datos.patchValue({ municipio: municipioEncontrado.nombreMunicipio });
            }
          }, 500);
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
    formData.append('estadoID', this.datos.value.estado);
    formData.append('municipio', this.datos.value.municipio);
    formData.append('imagen', this.imagenPerfil!);

    this.Funciones.DarDeAltaEstablecimiento(formData).subscribe({
      next: (response) => {

        this.mostrarAnimacionExito = true;

        setTimeout(() => {
          this.router.navigate(['/Cliente/home']);
        }, 2500);
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
