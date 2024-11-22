import { Component, OnInit } from '@angular/core';
import { FuncionesService } from '../../../Services/funciones.service';
import { CookieService } from 'ngx-cookie-service';
import { CarritoDeCompra, InformacionVestimenta, ItemsCarrito } from '../../../Interfaces/Vestimenta.interface';
import { forkJoin, map } from 'rxjs';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

declare const MercadoPago: any;

@Component({
  selector: 'app-carrito-compras',
  standalone: true,
  imports: [
    FormsModule
  ],
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
        next: (result: ItemsCarrito[]) => {
          this.ListaCarritoBack = result.map(item => ({
            ...item,
            fechaPrestamo: item.fechaPrestamo ? new Date(item.fechaPrestamo) : null
          }));
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

    if(peticiones.length === 0)
      {
        this.Rutas.navigate(['/Cliente/vestimentas']);
        return;
      }

    forkJoin(peticiones).subscribe({
      next: (detalles: InformacionVestimenta[]) => {
        this.ListaVestimentas = detalles;
      },
      error: (err) => {
        console.error('Error al obtener detalles de vestimentas:', err);
      }
    });
  }


  fechaPrestamo: Date | null = null;
  

  actualizarCarrito(vestimenta: InformacionVestimenta): void {
    const carritoActualizado: CarritoDeCompra = {
      usuarioID: this.usuarioID!,
      itemsCarrito: this.ListaCarritoBack.map(item => ({
        vestimentaID: item.vestimentaID,
        stock: vestimenta.vestimentaID === item.vestimentaID ? vestimenta.stockSeleccionado : item.stock,
        fechaPrestamo: vestimenta.vestimentaID === item.vestimentaID ? vestimenta.fechaPrestamo : item.fechaPrestamo
      }))
    };

    this.funciones.ModificarCarrito(carritoActualizado).subscribe({
      next: () => {

          this.Rutas.navigate(['/Cliente/carritoDeCompras']).then(() => {
          window.location.reload();
        });
        
      },
      error: (err) => {
        console.error("Error al actualizar el carrito en Firebase:", err);
      }
    });
  }


  cambiarFecha( vestimenta: InformacionVestimenta): void {
      if(vestimenta.fechaPrestamo){
        this.fechaPrestamo = vestimenta.fechaPrestamo;
        this.actualizarCarrito(vestimenta);
      }
  }


// #region Funciones para modificar el stock
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
// #endregion 

// #region Funciones para Calcular
  calcularTotal(): number {
    return this.ListaVestimentas.reduce((total, item) => {
      return total + (item.precioTotal || 0);
    }, 0);
  }

  ConteoDeVestimentas(): number {
    return this.ListaCarritoBack.length;
  }
// #endregion 

// #region Funciones para realizar pago
  iniciarPago(usuario: number): void {
    this.funciones.GenerarToken(usuario).subscribe({
      next: (response) => {
        const preferenceId = response.preferenceId;
        this.redirigirMercadoPago(preferenceId);
      },
      error: (err) => {
        console.error('Error al generar la preferencia de Mercado Pago:', err);
      }
    });
  }

  redirigirMercadoPago(preferenceId: string): void {
    const mp = new MercadoPago('TEST-1226a121-de91-46b7-a16d-ce3dc0eaff06', { locale: 'es-MX' });

    console.log(preferenceId);
    
    if (mp && mp.checkout) {
      mp.checkout({
        preference: {
          id: preferenceId
        },
        autoOpen: true // Abre automáticamente el checkout
      });
    } else {
      console.error('Error al inicializar el SDK de Mercado Pago');
    }
  }
// #endregion 


}
