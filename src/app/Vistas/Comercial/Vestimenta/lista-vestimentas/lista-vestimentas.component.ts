import { Component, OnInit } from '@angular/core';
import { FuncionesService } from '../../../../Services/funciones.service';
import { CookieService } from 'ngx-cookie-service';
import { EstilosInterfaces, ListaVestimenta, RequerimientosVestimentas, TallasInterfaces } from '../../../../Interfaces/Vestimenta.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EstadoInterface } from '../../../../Interfaces/estado.interface';
import { MunicipioInterface } from '../../../../Interfaces/municipios.interfaces';
import { resolve } from 'node:path';

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

  constructor(private ruta: ActivatedRoute ,private Funciones: FuncionesService, private cookie: CookieService, private Rutas: Router, private form: FormBuilder){}
  
  ubicacion: any;
  token: string | null = null;
  estado: string | null = null;
  municipio: string | null = null;
  

  VestimentasList: ListaVestimenta[]=[];
  NoHayVestimentas = false;
  pagina: number | null = null;




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

        console.log(this.estado +", " + this.municipio);

        if(this.estado != null && this.municipio != null){
          this.ListaVestimentas();
        }
      }
  }


  ListaVestimentas(){

    const data: RequerimientosVestimentas = {
       estado: this.estado! || this.EstadosList.find(e => e.estadoID === this.estadoSeleccionado)?.nombreEstado || '',
       municipio: this.municipio! || this.municipioSeleccionado! || '',
       pagina: this.pagina!,
       filtro: this.searchQuery!,
       categoria: this.categoriaSeleccionada!,
       talla: this.tallaSeleccionada!
    }

    this.Funciones.MostrarVestimentas(data).subscribe({
      next: (result) => {
        this.VestimentasList = result ?? [];

        const estadoEncontrado = this.EstadosList.find(e => e.nombreEstado! === this.estado);
        this.estadoSeleccionado = estadoEncontrado?.estadoID ?? null;
        console.log("El estado seleccionado: " + this.estadoSeleccionado);

        if(this.estadoSeleccionado){
          this.ListaMunicipios(this.estadoSeleccionado).then(() => {
            const municipioEncontrado = this.MunicipioList.find(m => m.nombreMunicipio === this.municipio);
            this.municipioSeleccionado = municipioEncontrado?.nombreMunicipio ?? null;
            console.log("El municipio seleccionado: " + this.municipioSeleccionado);
        
          });
        }

        this.NoHayVestimentas = this.VestimentasList.length === 0;
      },
      error: (err) =>{
        console.log("Ocurrio un error.");
        this.VestimentasList = [];
        this.NoHayVestimentas = true;
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
    console.log(this.categoriaSeleccionada);
    this.ListaVestimentas();
  }

  ConteoDeVestimentas(): number {
    return this.VestimentasList.length ?? 0;
  }

  seleccionarTalla(tallaID: number) : void {
    if(this.tallaSeleccionada === tallaID){
      this.deseleccionarTalla();
    } else {
      this.tallaSeleccionada = tallaID;
      this.ListaVestimentas();
    }
  }

  deseleccionarTalla(): void {
    this.tallaSeleccionada = null;
    this.ListaVestimentas();
    console.log('Talla deseleccionada'); 
  }

  toggleCategoria(estiloID: number ): void {
    if(this.categoriaSeleccionada === estiloID){
       this.categoriaSeleccionada = null
    } else {
      this.categoriaSeleccionada = estiloID;
    }
    console.log('Categoría seleccionada:', this.categoriaSeleccionada);
    this.ListaVestimentas();
  }

// #endregion 
  

// #region Obtencion de Listas ubicacion

EstadosList: EstadoInterface[]=[];
MunicipioList: MunicipioInterface[]=[];

estadoSeleccionado: number | null = null;
municipioSeleccionado: string | null = null;

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
  
  SeleccionEstado(event: Event): void{
    const selectElement = event.target as HTMLSelectElement;
    const estado = Number(selectElement.value);

    if(estado){
      this.estadoSeleccionado = estado;
      const estadoEncontrado = this.EstadosList.find(e => e.estadoID === estado);
      this.estado = estadoEncontrado?.nombreEstado || null;

      this.ListaMunicipios(estado).then(() => {
        this.ListaMunicipios(estado);
      });
    }
  }

  SeleccionMunicipio(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.municipioSeleccionado = selectElement.value;
    this.municipio = this.municipioSeleccionado;
    this.ListaVestimentas();
  }


  ListaMunicipios(estadoID: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.Funciones.ObtenerMunicipios(estadoID).subscribe({
        next: (result) => {
          this.MunicipioList = result ?? [];
          resolve();
        },
        error: (err) => {
          console.error("Error al obtener municipios:", err);
          reject(err);
        }
      });
    }); 
  }

  usarUbicacion(): void {
    const ubicacion = this.cookie.get('ubicacion');

    if(ubicacion){
      const obtener = JSON.parse(ubicacion);
      this.estado = obtener?.estado || null;
      this.municipio = obtener?.municipio || null;
      this.ListaVestimentas();
      console.log("Usando la ubicación guardada:", this.estado, this.municipio);
    }
  }

// #endregion 

}
