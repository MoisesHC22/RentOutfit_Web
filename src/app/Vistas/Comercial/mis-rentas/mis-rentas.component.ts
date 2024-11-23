import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FuncionesService } from '../../../Services/funciones.service';
import { ListaDePedidoRequerimientos, ListaPedido } from '../../../Interfaces/iniciarSesion.interface';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'; 

@Component({
  selector: 'app-mis-rentas',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  templateUrl: './mis-rentas.component.html',
  styleUrl: './mis-rentas.component.css',
})
export class MisRentasComponent implements OnInit {

  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;

  usuarioID: number | null = null;
  mesActual: number = new Date().getMonth() + 1;
  anoActual: number = new Date().getFullYear();
  listaDeRentas: ListaPedido[] = [];
  diasDelMes: any[] = [];
  numeroDiasMes: number = 0;

  nombresMes: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];

  constructor(private Ruta: ActivatedRoute, private Funciones: FuncionesService) {}

  ngOnInit(): void {
    this.actualizarDiaDelMes();

    this.Ruta.paramMap.subscribe((params) => {
      const usuario = params.get('usuario');

      if (usuario) {
        this.usuarioID = +usuario;
        this.obtenerRentas();
      }
    });
  }

  actualizarDiaDelMes(): void {
    this.numeroDiasMes = new Date(this.anoActual, this.mesActual, 0).getDate();
    this.inicializarDiasDelMes();
    this.obtenerRentas();
  }

  inicializarDiasDelMes(): void {
    this.diasDelMes = Array.from({ length: this.numeroDiasMes }, (_, i) => ({
      dia: i + 1,
      vestimentas: [],
    }));
  }

  cambiarMes(delta: number): void {
    this.mesActual += delta;
    if (this.mesActual > 12) {
      this.mesActual = 1;
      this.anoActual++;
    } else if (this.mesActual < 1) {
      this.mesActual = 12;
      this.anoActual--;
    }
    this.actualizarDiaDelMes();
  }

  obtenerRentas(): void {
    const data: ListaDePedidoRequerimientos = {
      usuarioID: this.usuarioID!,
      mes: this.mesActual!,
      ano: this.anoActual!,
      pagina: 1,
    };

    this.Funciones.ListaDeRentas(data).subscribe({
      next: (rentas) => {
        this.listaDeRentas = rentas;
        this.organizarPorDia();
      },
      error: (err) => {
        console.error('Error al obtener las rentas: ', err);
      },
    });
  }

  organizarPorDia(): void {
    this.diasDelMes.forEach((d) => (d.vestimentas = []));
    this.listaDeRentas.forEach((renta) => {
      const fechaPrestamo = new Date(renta.fechaPrestamo!);

      if (!isNaN(fechaPrestamo.getTime())) {
        const dia = fechaPrestamo.getDate();
        const diaCalendario = this.diasDelMes.find((d) => d.dia === dia);

        if (diaCalendario) {
          diaCalendario.vestimentas.push(renta);
        }
      }
    });
  }
}