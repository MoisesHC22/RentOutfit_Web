import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FuncionesService } from '../../../Services/funciones.service';
import { InformacionTienda, MisEstablecimientos, RequerimientosDeMisEstablecimientos, RequerimientosDenegarEstablecimientos, TiendaInterface } from '../../../Interfaces/tienda.interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'; 


@Component({
  selector: 'app-peticiones-disponibles',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  templateUrl: './peticiones-disponibles.component.html',
  styleUrl: './peticiones-disponibles.component.css'
})
export class PeticionesDisponiblesComponent implements OnInit{

  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;

  constructor(private Rutas: ActivatedRoute, private Funciones: FuncionesService, private form: FormBuilder){}

  datos: any;
  filtro: any;

  TiendasList: MisEstablecimientos[]=[];
  usuario: number | null = null;
  pagina: number | null = 1;
  establecimientoID: number | null = null;
  nombreEstablecimiento: string | null = null;

  MostrarModal: boolean = false;
  informacion: InformacionTienda | null = null;
  MostrarInformacion = false;

  registrosPorPagina: number = 10;
  totalRegistros: number = 0;
  totalPaginas: number = 0;

  EstablecimientoSeleccionado: number | null = null;

  ngOnInit(): void {

    this.filtro = this.form.group({
      busqueda: [''],
      orden: ['reciente']
    })

    this.datos = this.form.group({
       motivo: ['', [Validators.required]]
    })

    this.Rutas.paramMap.subscribe(params => {
       const usuarioID = params.get('usuario');

       if(usuarioID) {
        this.usuario = +usuarioID;

        this.Peticiones(this.usuario, this.pagina!);
       }
    });
  }

  Peticiones(usuarioID: number, pagina: number) {

    const filtro = this.filtro.value.busqueda || '';
    const orden = this.filtro.value.orden || 'reciente';

    const data: RequerimientosDeMisEstablecimientos = 
    {
      usuario: this.usuario!,
      pagina: this.pagina!,
      filtro: filtro,
      orden: orden
    };

    this.Funciones.ListaDeEstablecimientosParaAprobar(data).subscribe({
      next: (result) => {
        this.TiendasList = result.establecimientos;
        this.totalRegistros = result.totalRegistros;
        this.totalPaginas = Math.ceil(this.totalRegistros / this.registrosPorPagina);
      },
      error: (err) => {
        console.log('Ocurrio algo inesperado.', err);
      }
    });
  }


  buscarEstablecimientos() {
    this.pagina = 1;
    this.Peticiones(this.usuario!, this.pagina!);
  }

  ordenarEstablecimientos() {
    this.pagina = 1;
    this.Peticiones(this.usuario!, this.pagina!);
  }

  paginaAnterior() {
    if (this.pagina! > 1) {
      this.pagina!--;
      this.Peticiones(this.usuario!, this.pagina!);
    }
  }
  
  paginaSiguiente() {
    if (this.pagina! < this.totalPaginas) {
      this.pagina!++;
      this.Peticiones(this.usuario!, this.pagina!);
    }
  }




  aprobar(establecimientosID: number) {
      this.Funciones.AprobarEstablecimiento(establecimientosID).subscribe({
        next: (result) => {
          this.Peticiones(this.usuario!, this.pagina!);
        },
        error: (err) => {
          console.log('Ocurrio algo inesperado.', err);
        }
      });
  }
  
// #region negar peticiones
  denegar() {

    const data: RequerimientosDenegarEstablecimientos = 
    {
      establecimientoID: this.establecimientoID!,
      motivo: this.datos.value.motivo!
    }

    this.Funciones.DenegarEstablecimiento(data).subscribe({
      next: (result) => {
        this.cerrarModal();
        this.Peticiones(this.usuario!, this.pagina!);
      },
      error: (err) => {
        console.log('Ocurrio algo inesperado.', err);
      }
    });
  }
  
  abrirModal(establecimientoID: number, nombreEstablecimiento: string) {
     this.establecimientoID = establecimientoID;
     this.nombreEstablecimiento = nombreEstablecimiento;
     this.MostrarModal = true;
  }

  cerrarModal() {
    this.MostrarModal = false;
    this.datos.reset();
  }
// #endregion 

InformacionEstablecimiento(establecimiento: number): void {

  this.EstablecimientoSeleccionado = establecimiento;

  this.Funciones.InformacionEstablecimiento(establecimiento).subscribe({
    next: (result: InformacionTienda) => {
      this.MostrarInformacion = true;
      this.informacion = result;
      this.usuario = this.informacion.usuarioID!;

    },
    error: (err) => {
      console.log('Error al obtener informacion del establecimiento.')
    }
  });
}

CerrarInfEstablecimiento(){
  this.MostrarInformacion = false;
  this.EstablecimientoSeleccionado = null;
}


}
