import { Component, OnInit } from '@angular/core';
import { FuncionesService } from '../../../../Services/funciones.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MisEstablecimientos, RequerimientosDeMisEstablecimientos } from '../../../../Interfaces/tienda.interface';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-home-establecimientos',
  standalone: true,
  imports: [],
  templateUrl: './home-establecimientos.component.html',
  styleUrl: './home-establecimientos.component.css'
})
export class HomeEstablecimientosComponent implements OnInit{

  datos: any;
  usuario: number = 0;
  pagina: number | null = null;

  Establecimientos: MisEstablecimientos[]=[];

  constructor(private Funciones: FuncionesService, private Rutas: ActivatedRoute, private Ruta: Router){}

  ngOnInit(): void {

    this.Rutas.paramMap.subscribe(params => {
      const usuario = params.get('usuario');

      if(usuario){
        this.usuario = +usuario;

        this.MisEstablecimientos(this.usuario, this.pagina!);
      }
    });

  }


  MisEstablecimientos(usuario: number, pagina: number): void {
     
    if(usuario){
      const data: RequerimientosDeMisEstablecimientos = {
        usuario: this.usuario!,
        pagina: this.pagina!
      }

      this.Funciones.MisEstablecimientos(data).subscribe({
        next: (result) => {
          this.Establecimientos = result;
        },
        error: (err) => {
          console.log("Ocurrio un error");
        }
      });
    }
  }


  MasInformacionEstablecimiento(establecimiento?: number): void {
    if(establecimiento){
      this.Ruta.navigate(['/Vendedor/miEstablecimiento', establecimiento]);
    } else {
      console.error('No se obtuvo la informacion del establecimiento.');
    }
  }
  

}
