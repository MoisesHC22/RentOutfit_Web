import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FuncionesService } from '../../../Services/funciones.service';
import { EstadoInterface } from '../../../Interfaces/estado.interface';
import { MunicipioInterface } from '../../../Interfaces/municipios.interfaces';
import { CookieService } from 'ngx-cookie-service';

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
  selector: 'app-nuevo-vendedor',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './nuevo-vendedor.component.html',
  styleUrl: './nuevo-vendedor.component.css'
})
export class NuevoVendedorComponent implements OnInit {

  datos: any;

  constructor(private Funciones: FuncionesService, private form: FormBuilder, private rutas: Router, private cookie: CookieService) {}

  EstadosList: EstadoInterface[]=[];
  MunicipioList: MunicipioInterface[]=[];

  token: string | null = null;
  usuario: number | null = null;

  ngOnInit(): void {
    
    this.ListaEstados();

    
    this.token = this.cookie.get('token');
    
    if(this.token) {
      
      const obtener = this.Funciones.DecodificarToken(this.token);
      this.usuario = obtener?.usuario ? Number(obtener.usuario) : null;
     
    }
    else{
      this.rutas.navigate(['/Login']);
    }



    this.datos = this.form.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      codigoPostal: ['', [Validators.required, Validators.pattern('^[0-9]{5}$')]],
      colonia: ['', Validators.required],
      estado: ['', Validators.required],
      municipio: ['', Validators.required],
      calle: ['', Validators.required],
      noInt: ['', Validators.required],
      noExt: ['', Validators.required],
      imagen: [null, [Validators.required]]
    });
  }


  
  imagenPerfil: File | null = null;
  imagenPrevisualizacion: string | ArrayBuffer | null = null;
  statusImg = false;


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








  darDeAlta(usuario: number): void
  {
    const formData = new FormData();

    const noInt = this.datos.value.noInt === "0" ? "S/N" : this.datos.value.noInt;
    const noExt = this.datos.value.noExt === "0" ? "S/N" : this.datos.value.noExt;
  
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
        console.log("Se dio de alta tu establecimiento ", response);
        this.rutas.navigate(['/Cliente/home']);
      },
      error: (err) => {
        console.log('Ocurrio un error.');
      }
    });

  }
  
}
