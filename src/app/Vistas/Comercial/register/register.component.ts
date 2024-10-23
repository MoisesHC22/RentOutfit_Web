import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FuncionesService } from '../../../Services/funciones.service';
import { EstadoInterface } from '../../../Interfaces/estado.interface';
import { MunicipioInterface } from '../../../Interfaces/municipios.interfaces';
import { GeneroInterface } from '../../../Interfaces/genero.interfaces';
import { faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    FontAwesomeModule,
    LottieComponent
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  
  constructor(private Funciones: FuncionesService, private form: FormBuilder){}
  
  EstadosList: EstadoInterface[]=[];
  MunicipioList: MunicipioInterface[]=[];
  GenerosList: GeneroInterface[]=[];
  faArrow = faArrowLeft;

  ngOnInit(): void {
    this.ListaEstados();
    this.ListaGeneros();
  }

  paso: number = 1;

  imagenPerfil: File | null = null;
  imagenPrevisualizacion: string | ArrayBuffer | null = null;

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


  onFileSelected(event: any): void {
     const file = event;
  }


}


