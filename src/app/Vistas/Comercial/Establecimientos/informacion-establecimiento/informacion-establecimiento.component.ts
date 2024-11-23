import { Component, OnInit } from '@angular/core';
import { FuncionesService } from '../../../../Services/funciones.service';
import { InformacionTienda } from '../../../../Interfaces/tienda.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { ListaVestimenta, VestimentaEstablecimientos } from '../../../../Interfaces/Vestimenta.interface';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-informacion-establecimiento',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule],
  templateUrl: './informacion-establecimiento.component.html',
  styleUrl: './informacion-establecimiento.component.css'
})
export class InformacionEstablecimientoComponent implements OnInit{

  datos: any;
  establecimiento: number = 0;
  usuario: number | null = null;
  pagina: number | null = null;
  informacion: InformacionTienda | null = null;
  VestimentasList: ListaVestimenta[]=[];
  AnuncionAunNoTieneVestimentas = false;

  ngOnInit(): void {

    this.Rutas.paramMap.subscribe(params => {
      const establecimientoID = params.get('establecimiento');

      if(establecimientoID) {
        this.establecimiento = +establecimientoID;
        this.InformacionEstablecimiento(this.establecimiento);
      }
    });
  }

  constructor(private Funciones: FuncionesService, private Rutas: ActivatedRoute){}



  InformacionEstablecimiento(establecimiento: number): void {

    if(establecimiento) {
      this.Funciones.InformacionEstablecimiento(establecimiento).subscribe({
        next: (result: InformacionTienda) => {
          this.informacion = result;

          this.usuario = this.informacion.usuarioID!;

          console.log(this.usuario);

          this.ListaVestimentas(this.establecimiento, this.informacion.usuarioID!);
        },
        error: (err) => {
          console.log('Error al obtener informacion del establecimiento.')
        }
      });
    }
  }



  ListaVestimentas(establecimiento: number, usuario: number)
  {
    const data: VestimentaEstablecimientos = {
      establecimiento: this.establecimiento!,
      usuario: this.usuario!,
      pagina: this.pagina!
    }
    
    console.log(data);
    this.Funciones.VestimentasEstablecimientos(data).subscribe({
      next: (result) => {
        this.VestimentasList = result;

          if(result == null){
            this.AnuncionAunNoTieneVestimentas = true;
          } 
      }, 
      error: (err) => {
        console.log("Ocurrio un error.", err);
      }
    });
  }
  




}
