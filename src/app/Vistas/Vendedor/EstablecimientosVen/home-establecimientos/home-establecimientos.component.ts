import { Component, OnInit } from '@angular/core';
import { FuncionesService } from '../../../../Services/funciones.service';
import { ActivatedRoute } from '@angular/router';
import { MisEstablecimientos, RequerimientosDeMisEstablecimientos } from '../../../../Interfaces/tienda.interface';

@Component({
  selector: 'app-home-establecimientos',
  standalone: true,
  imports: [],
  templateUrl: './home-establecimientos.component.html',
  styleUrl: './home-establecimientos.component.css'
})
export class HomeEstablecimientosComponent implements OnInit{

  usuario: number = 0;
  pagina: number | null = null;

  Establecimientos: MisEstablecimientos[]=[];

  ngOnInit(): void {
  
    this.Rutas.paramMap.subscribe(params => {
      const usuario = params.get('usuario');

      if(usuario){
        this.usuario = +usuario;

        this.MisEstablecimientos(this.usuario, this.pagina!);
      }
    });
  }

  
  constructor(private Funciones: FuncionesService, private Rutas: ActivatedRoute){}


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




  


}
