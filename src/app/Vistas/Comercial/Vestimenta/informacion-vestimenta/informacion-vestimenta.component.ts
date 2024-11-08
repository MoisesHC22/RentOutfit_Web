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

  imagenSeleccionada: string | null = null;
  estatus: string | null = null;

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
          this.imagenSeleccionada = this.informacion?.imagen1 || null;
          
          if(this.informacion.vestimentaEstatus == true){
            this.estatus = 'Disponible';
          } 
          else{
            this.estatus = 'Ocupado';
          }

        },
        error: (err) => {
          console.error('Error al obtener la vestimenta:', err);
        }
      });
    }
  }


  cambiarImagenSeleccionada(imagen: string | null): void {
    this.imagenSeleccionada = imagen;
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }
}