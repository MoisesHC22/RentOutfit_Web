import { Component, OnInit } from '@angular/core';
import { FuncionesService } from '../../../Services/funciones.service';
import { CookieService } from 'ngx-cookie-service';
import { CarritoDeCompra, InformacionVestimenta, ItemsCarrito } from '../../../Interfaces/Vestimenta.interface';
import { error } from 'console';
import { forkJoin, map } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito-compras',
  standalone: true,
  imports: [],
  templateUrl: './carrito-compras.component.html',
  styleUrl: './carrito-compras.component.css'
})
export class CarritoComprasComponent implements OnInit{

  usuarioID: number | null = null;
  token: string | null = null;
  ListaCarritoBack: ItemsCarrito[]=[];
  ListaVestimentas: InformacionVestimenta[] = [];

  constructor(private funciones: FuncionesService, private cookie: CookieService, private Rutas: Router){}

  ngOnInit(): void {     

    this.token = this.funciones.obtenerToken();
    if(this.token){
      const obtener = this.funciones.DecodificarToken(this.token);
      this.usuarioID = obtener?.usuario ? Number(obtener.usuario) : null;

      this.cargarCarrito();
    }

  }

  cargarCarrito(): void {
    if(this.usuarioID) {
      
      this.funciones.CargarCarrito(this.usuarioID!).subscribe({
        next: (result) => {
          this.ListaCarritoBack = result
          this.ObtenerVestimentas();
        },
        error: (err) => {
          console.error('No cuenta con nada en el carrito');
        }
      });
    }
  }

  ObtenerVestimentas(): void {
    const peticiones = this.ListaCarritoBack.map((item) =>
      this.funciones.InformacionVestimenta(item.vestimentaID!).pipe(
        map((detalles: InformacionVestimenta) => {
          detalles.stockSeleccionado = item.stock;
          detalles.precioTotal = item.stock! * parseFloat(detalles.precioPorDia!);
          return detalles;
        })
      )
    );

    forkJoin(peticiones).subscribe({
      next: (detalles: InformacionVestimenta[]) => {
        this.ListaVestimentas = detalles;
        console.log('Detalles de vestimentas:', this.ListaVestimentas);
      },
      error: (err) => {
        console.error('Error al obtener detalles de vestimentas:', err);
      }
    });
  }


  aumentarStock(vestimenta: InformacionVestimenta): void { 
    if(vestimenta.stockSeleccionado! < (vestimenta.stock || 0)) {
      vestimenta.stockSeleccionado! += 1;
      this.actualizarCarrito(vestimenta);
    }
  }

  disminuirStock(vestimenta: InformacionVestimenta): void {
    if(vestimenta.stockSeleccionado! > 0){
      vestimenta.stockSeleccionado! -= 1;
      this.actualizarCarrito(vestimenta);

      if(vestimenta.stockSeleccionado == 0){
        this.Rutas.navigate(['/Cliente/carritoDeCompras']).then(() => {
          window.location.reload();
        });
      }
    }
  }

  actualizarCarrito(vestimenta: InformacionVestimenta): void {
    const carritoActualizado: CarritoDeCompra = {
      usuarioID: this.usuarioID!,
      itemsCarrito: this.ListaCarritoBack.map(item => ({
        vestimentaID: item.vestimentaID,
        stock: vestimenta.vestimentaID === item.vestimentaID ? vestimenta.stockSeleccionado : item.stock
      }))
    };

    this.funciones.ModificarCarrito(carritoActualizado).subscribe({
      next: () => {
        console.log("Carrito actualizado en Firebase");
      },
      error: (err) => {
        console.error("Error al actualizar el carrito en Firebase:", err);
      }
    });
  }





  calcularTotal(): number {
    return this.ListaVestimentas.reduce((total, item) => {
      return total + (item.precioTotal || 0);
    }, 0);
  }

  ConteoDeVestimentas(): number {
    return this.ListaCarritoBack.length;
  }


}
