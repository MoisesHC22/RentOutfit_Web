import { Component, OnInit } from '@angular/core';
import { FuncionesService } from '../../../../Services/funciones.service';
import { InformacionVestimenta } from '../../../../Interfaces/Vestimenta.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-informacion-vestimenta',
  standalone: true,
  imports: [],
  templateUrl: './informacion-vestimenta.component.html',
  styleUrl: './informacion-vestimenta.component.css'
})
export class InformacionVestimentaComponent implements OnInit {

  vestimenta: number = 0;
  informacion: InformacionVestimenta | null = null;

  ngOnInit(): void {

    this.Rutas.paramMap.subscribe(params => {
      const vestimentaID = params.get('vestimenta');
      
      if(vestimentaID) {
        this.vestimenta = +vestimentaID;
        console.log(this.vestimenta);
        this.InformacionVestimenta(this.vestimenta);
      }
    })
  }

  constructor(private Funciones: FuncionesService, private Rutas: ActivatedRoute){}

  InformacionVestimenta(Vestimenta: number): void {
    console.log(Vestimenta);
    
    if(Vestimenta) {
      this.Funciones.InformacionVestimenta(Vestimenta).subscribe({
        next: (result: InformacionVestimenta) => {
            this.informacion = result;
            console.log(this.vestimenta);
        },
        error: (err) => {
         console.log('Error al obtener la vestimenta.');
        }
      });
    }
  }



}
