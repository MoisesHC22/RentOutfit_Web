import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { from } from 'rxjs';
import { FuncionesService } from '../../../Services/funciones.service';
import { EstadoInterface } from '../../../Interfaces/estado.interface';
import { MunicipioInterface } from '../../../Interfaces/municipios.interfaces';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  
  constructor(private Funciones: FuncionesService, private form: FormBuilder){}
  
  EstadosList: EstadoInterface[]=[];
  MunicipioList: MunicipioInterface[]=[];

  ngOnInit(): void {
    this.ListaEstados();
  }

  paso: number = 1;

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

}
