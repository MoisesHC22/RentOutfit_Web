import { Component, OnInit } from '@angular/core';
import { FuncionesService } from '../../../../Services/funciones.service';
import { CookieService } from 'ngx-cookie-service';
import { EstilosInterfaces, ListaVestimenta, RequerimientosVestimentas, TallasInterfaces } from '../../../../Interfaces/Vestimenta.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EstadoInterface } from '../../../../Interfaces/estado.interface';
import { MunicipioInterface } from '../../../../Interfaces/municipios.interfaces';

@Component({
  selector: 'app-lista-vestimentas',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './lista-vestimentas.component.html',
  styleUrl: './lista-vestimentas.component.css'
})
export class ListaVestimentasComponent implements OnInit{

  constructor(private ruta: ActivatedRoute ,private Funciones: FuncionesService, private cookie: CookieService, private Rutas: Router){}
  
  token: string | null = null;
  estado: string | null = null;
  municipio: string | null = null;
  pagina: number | null = null;

  VestimentasList: ListaVestimenta[]=[];

  ngOnInit(): void {

    this.ListaCategorias();
    this.ListaTallas();
    this.ListaEstados();

    this.ruta.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
       console.log(this.searchQuery);
      this.ListaVestimentas();
    })


    const ubicacion = this.cookie.get('ubicacion');
    if (ubicacion) {
      const obtener = JSON.parse(ubicacion);
        this.estado = obtener?.estado || null;
        this.municipio = obtener?.municipio || null

        if(this.estado != null && this.municipio != null){
          this.ListaVestimentas();
        }
      }
  }


  ListaVestimentas(){

    const data: RequerimientosVestimentas = {
       estado: this.estado!,
       municipio: this.municipio!,
       pagina: this.pagina!,
       filtro: this.searchQuery!,
       categoria: this.categoriaSeleccionada!,
       talla: this.tallaSeleccionada!
    }

    this.Funciones.MostrarVestimentas(data).subscribe({
      next: (result) => {
        this.VestimentasList = result;
      },
      error: (err) =>{
        console.log("Ocurrio un error.");
      }
    });
  }

  MasInformacion(vestimenta?: number): void{
    if(vestimenta){
      this.Rutas.navigate(['/Cliente/masInformacionVestimenta', vestimenta]);
    } else {
      console.error('No se encontro la vestimenta.');
    }
  }


// #region Obtencion de listas para filtros
searchQuery: string = '';
CategoriasList: EstilosInterfaces[]=[];
TallasList: TallasInterfaces[]=[];

categoriaSeleccionada: number | null = null;
tallaSeleccionada: number | null = null;

  ListaCategorias(){
    this.Funciones.ObtenerEstilos().subscribe({
      next: (result) => {
        this.CategoriasList = result;
      },
      error: (err) => {
        console.log(err)
      }
    });
  }

  ListaTallas() {
    this.Funciones.ObtenerTallas().subscribe({
      next: (result) => {
        this.TallasList = result;
      },
      error: (err) => {
        console.log(err)
      }
    });
  }

  seleccionarCategoria(estiloID: number): void {
    this.categoriaSeleccionada = estiloID;
    this.ListaVestimentas();
  }

  ConteoDeVestimentas(): number {
    return this.VestimentasList.length;
  }

  seleccionarTalla(tallaID: number) : void {
   this.tallaSeleccionada = tallaID;
   this.ListaVestimentas();
  }
// #endregion 
  

// #region Obtencion de Listas ubicacion

EstadosList: EstadoInterface[]=[];
MunicipioList: MunicipioInterface[]=[];

estadoSeleccionado: number | null = null;
municipioSeleccionado: number | null = null;

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
// #endregion 





}
