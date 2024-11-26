import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FuncionesService } from '../../../../Services/funciones.service';
import { ConsultarPedidos, RequerimientosConsultarPedidos } from '../../../../Interfaces/tienda.interface';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'; 

@Component({
  selector: 'app-home-ventas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  templateUrl: './home-ventas.component.html',
  styleUrl: './home-ventas.component.css'
})
export class HomeVentasComponent implements OnInit {
   

  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;

  constructor(private Ruta: ActivatedRoute, private Funciones: FuncionesService, private form: FormBuilder){}

  usuario: number | null = null;
  filtro: any;
  PedidosList: ConsultarPedidos[] = [];

  pagina: number | null = null;
  registrosPorPagina: number = 10;
  totalRegistros: number = 0;
  totalPaginas: number = 0;

  ngOnInit(): void {
   this.pagina = 1;

    this.filtro = this.form.group({
      orden: ['reciente']
    })

    
    this.Ruta.paramMap.subscribe(params => {
      const usuarioID = params.get('usuario');

      if(usuarioID) {
       this.usuario = +usuarioID;

       this.pedidos();

      }
   });

  }


  pedidos() {
    const orden = this.filtro.value.orden || 'reciente';

    const data: RequerimientosConsultarPedidos = 
    {
      usuarioID: this.usuario!,
      pagina: this.pagina!,
      orden: orden 
    }

    this.Funciones.ConsultarPedidos(data).subscribe({
      next: (result) => {
        this.PedidosList = result;
        
        if(this.PedidosList.length > 0)
        {
          this.totalRegistros = this.PedidosList[0].totalRegistros ?? 0;
        }else {
          this.totalRegistros = 0;
        }

        this.totalPaginas = Math.ceil(this.totalRegistros / this.registrosPorPagina);
      },
      error: (err) => {
        console.log('Ocurrio algo inesperado.', err);
      }
    });
  }

  ordenarEstablecimientos() {
    this.pagina = 1;
    this.pedidos();
  }

  paginaAnterior() {
    if (this.pagina! > 1) {
      this.pagina!--;
    this.pedidos();
    }
  }
  
  paginaSiguiente() {
    if (this.pagina! < this.totalPaginas) {
      this.pagina!++;
      this.pedidos();
    }
  }


}
