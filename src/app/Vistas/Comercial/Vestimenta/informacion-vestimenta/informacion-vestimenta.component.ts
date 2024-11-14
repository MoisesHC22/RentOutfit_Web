import { Component, OnInit, OnDestroy } from '@angular/core';
import { FuncionesService } from '../../../../Services/funciones.service';
import { CarritoDeCompra, InformacionVestimenta, ItemsCarrito } from '../../../../Interfaces/Vestimenta.interface';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { Console } from 'node:console';

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
  usuarioID: number | null = null;
  token: string | null = null;

  stock: number = 1;

  constructor(private funciones: FuncionesService, private rutas: ActivatedRoute, private cookie: CookieService, private Ruta: Router) {}

  ngOnInit(): void {
    this.routeSub = this.rutas.paramMap.subscribe((params: ParamMap) => {
      const vestimentaID = params.get('vestimenta');
      
      if (vestimentaID) {
        this.vestimenta = +vestimentaID;
        this.obtenerInformacionVestimenta(this.vestimenta);
      }

      this.token = this.funciones.obtenerToken();
      if(this.token){
        const obtener = this.funciones.DecodificarToken(this.token);
        this.usuarioID = obtener?.usuario ? Number(obtener.usuario) : null;
      }

    });
  }

  obtenerInformacionVestimenta(vestimentaID: number): void {
    if (vestimentaID) {
      this.funciones.InformacionVestimenta(vestimentaID).subscribe({
        next: (result: InformacionVestimenta) => {
          this.informacion = result;
          this.imagenSeleccionada = this.informacion?.imagen1 || null;
          this.stock = 1;

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

  AgregarAlCarrito(vestimentaID: number): void 
  {
    if(!this.token || !this.usuarioID)
    {
      this.Ruta.navigate(['/Login']);
      return;
    }

    const nuevoItem: ItemsCarrito = {
      vestimentaID: vestimentaID,
      stock: this.stock 
    };

    this.funciones.CargarCarrito(this.usuarioID).subscribe({
      next: (carritoExistente) => {

        const carritoActualizado: CarritoDeCompra = {
          usuarioID: this.usuarioID!,
          itemsCarrito: carritoExistente.itemsCarrito || []
        };

        const itemExistente = carritoActualizado.itemsCarrito?.find(item => item.vestimentaID === vestimentaID);

        if(itemExistente){
          itemExistente.stock! += this.stock;
        } else {
          carritoActualizado.itemsCarrito?.push(nuevoItem);
        }

        this.funciones.ModificarCarrito(carritoActualizado).subscribe({
          next: () => {
              console.log("Carrito actualizado correctamente.");
            },
            error: (err) => {
              console.error("Error al actualizar el carrito:", err);
            }
          });
        },
        error: (err) => {
          console.error("Error al cargar el carrito:", err);
        }
    });

  }


  
  aumentarStock(): void {
    if(this.stock < (this.informacion?.stock || 0)) {
      this.stock += 1;
    }
  }

  disminuirStock(): void {
    if(this.stock > 1) {
      this.stock -= 1;
    }
  }


}