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

    const PrimeraLetraMayuscula = /^[A-Z]/.test(value);
    const AlmenosDosNumeros = /\d.*\d/.test(value);
    const Caracteres = value.length >= 8;

    const valid = PrimeraLetraMayuscula && AlmenosDosNumeros && Caracteres;

    if(!valid) {
      return {
        contrasenaVal: {
          PrimeraLetraMayuscula: PrimeraLetraMayuscula,
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

  constructor(private Funciones: FuncionesService, private form: FormBuilder, private rutas : Router){}
  
  EstadosList: EstadoInterface[]=[];
  MunicipioList: MunicipioInterface[]=[];
  GenerosList: GeneroInterface[]=[];
  faArrow = faArrowLeft;


  ngOnInit(): void {
    this.ListaEstados();
    this.ListaGeneros();
    this.datos = this.form.group({
      estado: [0, [Validators.required]],
      codigoPostal: ['', [Validators.required]],
      colonia: ['', [Validators.required]],
      calle: ['', [Validators.required]],
      noInt: ['', [Validators.required]],
      noExt: ['',  [Validators.required]],
      municipio: ['', Validators.required],
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

  ListaEstados(){
    this.Funciones.ObtenerEstados().subscribe({
      next: (result) => {
        this.EstadosList = result;
      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  ListaMunicipios(estadoID: number){
    this.Funciones.ObtenerMunicipios(estadoID).subscribe({
      next: (result) => {
        this.MunicipioList = result;
      },
      error: (err) => {
        console.log(err)
      }
    })
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

EstadoSeleccionado(event: Event)
{
  const seleccion = event.target as HTMLSelectElement;
  const estadoID = seleccion.value;
  if(estadoID) {
    const id = Number(estadoID);
    if(!isNaN(id)){
      this.ListaMunicipios(id);
    }
  }
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

  const noInt = this.datos.value.noInt === "0" ? "S/N" : this.datos.value.noInt;
  const noExt = this.datos.value.noExt === "0" ? "S/N" : this.datos.value.noExt;


  formData.append('estadoID', this.datos.value.estado);
  formData.append('codigoPostal', this.datos.value.codigoPostal);
  formData.append('colonia', this.datos.value.colonia);
  formData.append('calle', this.datos.value.calle);
  formData.append('noInt', noInt);
  formData.append('noExt', noExt);
  formData.append('municipio', this.datos.value.municipio);
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

