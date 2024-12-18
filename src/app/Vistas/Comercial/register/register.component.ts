import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FuncionesService } from '../../../Services/funciones.service';
import { EstadoInterface } from '../../../Interfaces/estado.interface';
import { MunicipioInterface } from '../../../Interfaces/municipios.interfaces';
import { GeneroInterface } from '../../../Interfaces/genero.interfaces';
import { faArrowLeft, fas} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';


export function CaracteresContrasenaValidacion(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
  
    if(!value){
      return null;
    }

    const MayusculaEnCualquierParte = /[A-Z]/.test(value);
    const AlmenosDosNumeros = /\d.*\d/.test(value);
    const Caracteres = value.length >= 8;

    const valid = MayusculaEnCualquierParte && AlmenosDosNumeros && Caracteres;

    if(!valid) {
      return {
        contrasenaVal: {
          MayusculaEnCualquierParte: MayusculaEnCualquierParte,
          AlmenosDosNumeros: AlmenosDosNumeros,
          Caracteres: Caracteres
        }
      };
    }
     return null;
  };
}

export function MatchContrasenaValidacion(contrasena: string, contrasenaConfirmar: string): ValidatorFn 
{
  return (formGroup: AbstractControl): {[key: string]: any } | null => {
      const contrasenaControl = formGroup.get(contrasena);
      const contrasenaConfirmarControl = formGroup.get(contrasenaConfirmar);

      if (contrasenaControl && contrasenaConfirmarControl && contrasenaControl.value !== contrasenaConfirmarControl.value) {
        return { contrasenaNoMatch: true };
      }
      return null;
    };
}

export function SoloLetras(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const soloLetrasRagExp = /^[a-zA-ZÁ-ÿ\s]+$/;

    if(!value || soloLetrasRagExp.test(value)) {
      return null;
    }
    return { SoloLetras: true}
  }
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    FormsModule,
    CommonModule,
    FontAwesomeModule,
    LottieComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  
  datos: any;

  showTermsModal: boolean = false;
  showPrivacyModal: boolean = false;
  
  abrirModal(event: Event, tipo: string): void {
  
    if (tipo === 'terms') {
      this.showTermsModal = true;
      this.showPrivacyModal = false;
    } else if (tipo === 'privacy') {
      this.showPrivacyModal = true;
      this.showTermsModal = false;
    }
  }
  
  cerrarModal(tipo: string): void {
    if (tipo === 'terms') {
      this.showTermsModal = false;
    } else if (tipo === 'privacy') {
      this.showPrivacyModal = false;
    }
  }

  

  constructor(private Funciones: FuncionesService, private form: FormBuilder, private rutas : Router){}
  
  GenerosList: GeneroInterface[]=[];
  faArrow = faArrowLeft;


  ngOnInit(): void {
    this.ListaGeneros();
    this.datos = this.form.group({
      email: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, CaracteresContrasenaValidacion()]],
      contrasenaValidar: ['',Validators.required],
      nombre: ['', [Validators.required]],
      apellidoPaterno: ['', [Validators.required]],
      apellidoMaterno: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      genero: [0, [Validators.required]],
      terminos: [false, Validators.requiredTrue],
      imagen: [null, [Validators.required]]
    },{
      validator: MatchContrasenaValidacion('contrasena','contrasenaValidar')
    });

  }

  paso: number = 1;

  imagenPerfil: File | null = null;
  imagenPrevisualizacion: string | ArrayBuffer | null = null;
  statusImg = false;

  animationOptions: AnimationOptions = {
    path: '/Animaciones/Registro.json'
  }

  siguientePaso() 
  {
    if (this.paso < 3) {
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


  ListaGeneros(){
    this.Funciones.ObtenerGeneros().subscribe({
      next: (result) => {
        this.GenerosList = result;
      },
      error: (err) => {
        console.log(err)
      }
    })
  }


cargarImagen() {
  const file = document.getElementById('imageUpload') as HTMLInputElement;
  file.click();
}

imagenSeleccionada(event: Event): void{
  const input = event.target as HTMLInputElement;

  if(input.files && input.files.length > 0)
    {
       const file = input.files[0];
       const tamanoMaximoMB = 2;
       const tamanoMaximoBytes = tamanoMaximoMB * 1024 * 1024;

       if(file.size > tamanoMaximoBytes){
        this.datos.get('imagen')?.setErrors({maxSize: true});
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
      
       this.datos.get('imagen')?.setValue(file);
       this.statusImg = true;
       reader.readAsDataURL(this.imagenPerfil);
    }else {
      this.datos.get('imagen')?.setValue(null);
      this.statusImg = false;
    }
}


Registro(): void
{
  const formData = new FormData();

  formData.append('email', this.datos.value.email);
  formData.append('contrasena', this.datos.value.contrasena);  
  formData.append('nombreCliente',this.datos.value.nombre);
  formData.append('apellidoPaterno', this.datos.value.apellidoPaterno);
  formData.append('apellidoMaterno', this.datos.value.apellidoMaterno);
  formData.append('telefono', this.datos.value.telefono);
  formData.append('generoID', this.datos.value.genero);
  formData.append('imagen', this.imagenPerfil!);

   
  this.Funciones.RegistrarCliente(formData).subscribe({
    next: (response) => {
      console.log("Se registró la cuenta", response);
      this.rutas.navigate(['/Login']);
    },
    error: (err) => {
      console.log('Ocurrio un error.');
    }
  });
 }

  ValidarSoloLetras(event: KeyboardEvent){
   const charCode = event.charCode;
   const charStr = String.fromCharCode(charCode);

   const regex = /^[a-zA-ZÁ-ÿ\s]+$/;

   if (!regex.test(charStr)) {
    event.preventDefault();
   }
  }

  ValidarInputLetras(event: Event) {
   const input = event.target as HTMLInputElement;
   const valor = input.value;

   input.value = valor.replace(/[^a-zA-ZÁ-ÿ\s]/g, '');
  }


  ValidarNumerosIyE(event: KeyboardEvent): void {
    const charCode = event.charCode;
    const charStr = String.fromCharCode(charCode);
  
    const regex = /^[0-9sSnN\/]$/;
  
    if (!regex.test(charStr)) {
      event.preventDefault();
    }
  }

  ValidarInputNumerosIyE(event: Event): void {
    const input = event.target as HTMLInputElement;
    let valor = input.value;
  
    const regex = /^[0-9]{0,3}$|^[sS]$|^[sS][\/]$|^[sS][\/][nN]$/;
  
    if (!regex.test(valor)) {

      valor = valor.replace(/[^0-9sSnN\/]/g, '');

      if (!regex.test(valor)){
        valor = ''
      }
    }
    input.value = valor;
  }


  ValidarSoloNumero(event: KeyboardEvent){
   const charCode = event.charCode;
   const charStr = String.fromCharCode(charCode);

   const regex = /^[0-9]$/;

   if (!regex.test(charStr)) {
    event.preventDefault();
   }
  }
  
  ValidarInputNumero(event: Event): void {
   const input = event.target as HTMLInputElement;
   const valor = input.value;
    
   input.value = valor.replace(/[^0-9\/]/g, '');
  }

  ValidarCorreo(event: KeyboardEvent){
    const charCode = event.charCode || event.keyCode;
    const charStr = String.fromCharCode(charCode);

    const regex = /^[a-zA-Z0-9@._-]$/;

    if(!regex.test(charStr)) {
      event.preventDefault();
    }
  }

  ValidarInputCorreo(event: Event): void {
    const input = event.target as HTMLInputElement;
    const valor = input.value;

    input.value = valor.replace(/[^a-zA-Z0-9@._-]/g, '');
    input.value = input.value.trim();
  }

 }  

