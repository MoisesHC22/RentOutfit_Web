import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink, RouterModule, RouterOutlet, Router } from '@angular/router';
import { FuncionesService } from '../../../Services/funciones.service';
import { CookieService } from 'ngx-cookie-service';
import { EstadoInterface } from '../../../Interfaces/estado.interface';
import { MunicipioInterface } from '../../../Interfaces/municipios.interfaces';

@Component({
  selector: 'app-menu-ven',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './menu-ven.component.html',
  styleUrl: './menu-ven.component.css'
})
export class MenuVenComponent implements OnInit{

  token: string | null = null;
  usuarioID: number | null = null
  img: string | null = null;
  nombre: string | null = null;

  datos: any;
  imagenPerfil: File | null = null;
  imagenPrevisualizacion: string | ArrayBuffer | null = null;
  statusImg = false;

  EstadosList: EstadoInterface[]=[];
  MunicipioList: MunicipioInterface[]=[];

  constructor(private Funciones: FuncionesService, private cookie: CookieService, private readonly Rutas: Router, private form: FormBuilder){}


  ngOnInit(): void {
    this.ListaEstados();

    this.token  = this.cookie.get('token');

    if(this.token)
    {
      const obtener = this.Funciones.DecodificarToken(this.token);

      this.img = obtener?.imagen || null;
      this.nombre = obtener?.nombre || null;

      this.usuarioID = obtener?.usuario ? Number(obtener.usuario) : null;
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


  regresarCliente(): void {
    this.Rutas.navigate(['/Cliente/home'])
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
      },
      error: (err) => {
        console.log('Ocurrio un error.');
      }
    });

  }



}
