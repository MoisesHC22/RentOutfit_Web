import { Component, OnInit, OnDestroy } from '@angular/core';
import { FuncionesService } from '../../../../Services/funciones.service';
import { InformacionVestimenta } from '../../../../Interfaces/Vestimenta.interface';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-informacion-vestimenta',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './informacion-vestimenta.component.html',
  styleUrl: './informacion-vestimenta.component.css'
})
export class InformacionVestimentaComponent implements OnInit, OnDestroy {

  vestimenta: number = 0;
  informacion: InformacionVestimenta | null = null;
  private routeSub: Subscription = new Subscription();

  // Variables para el modal
  showModal: boolean = false;
  imagenSeleccionada: string | null = null;

  constructor(private funciones: FuncionesService, private rutas: ActivatedRoute) {}

  ngOnInit(): void {
    this.routeSub = this.rutas.paramMap.subscribe((params: ParamMap) => {
      const vestimentaID = params.get('vestimenta');
      
      if (vestimentaID) {
        this.vestimenta = +vestimentaID;
        this.obtenerInformacionVestimenta(this.vestimenta);
      }
    });
  }

  obtenerInformacionVestimenta(vestimentaID: number): void {
    if (vestimentaID) {
      this.funciones.InformacionVestimenta(vestimentaID).subscribe({
        next: (result: InformacionVestimenta) => {
          this.informacion = result;
          console.log('Información de vestimenta:', this.informacion);
        },
        error: (err) => {
          console.error('Error al obtener la vestimenta:', err);
        }
      });
    }
  }

  // Método para abrir el modal
  abrirModal(imagen: string | null | undefined): void {
    this.imagenSeleccionada = imagen || null;
    this.showModal = true;
  }

  // Método para cerrar el modal con animación
  cerrarModal(): void {
  this.showModal = false;
}

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }
}