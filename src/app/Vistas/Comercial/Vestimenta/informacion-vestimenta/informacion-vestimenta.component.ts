import { Component, OnInit, OnDestroy } from '@angular/core';
import { FuncionesService } from '../../../../Services/funciones.service';
import { CarritoDeCompra, InformacionVestimenta, ItemsCarrito } from '../../../../Interfaces/Vestimenta.interface';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { faPlus, faMinus, faRotateRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { Console } from 'node:console';

@Component({
  selector: 'app-informacion-vestimenta',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './informacion-vestimenta.component.html',
  styleUrl: './informacion-vestimenta.component.css'
})
export class InformacionVestimentaComponent implements OnInit, OnDestroy {

  // #region Iconos

faPlus = faPlus;
faMinus =  faMinus;
faRotateRight = faRotateRight;

// #endregion 

  zoomLevel: number = 1;
  zoomStep: number = 0.2;
  maxZoom: number = 3;
  minZoom: number = 1;


   // Variables para el arrastre
   isDragging: boolean = false;
   startX: number = 0;
   startY: number = 0;
   scrollLeft: number = 0;
   scrollTop: number = 0;



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


  zoomIn(): void {
    if (this.zoomLevel < this.maxZoom) {
      this.zoomLevel += this.zoomStep;
    }
  }

  zoomOut(): void {
    if (this.zoomLevel > this.minZoom) {
      this.zoomLevel -= this.zoomStep;
    }
  }

  resetZoom(): void {
    this.zoomLevel = 1;
  }

  preventDrag(event: DragEvent): void {
    event.preventDefault();
  }

  startDragging(event: MouseEvent): void {
    const container = (event.target as HTMLElement).parentElement!;
    if (this.zoomLevel > 1) {
      this.isDragging = true;
      this.startX = event.pageX - container.offsetLeft;
      this.startY = event.pageY - container.offsetTop;
      this.scrollLeft = container.scrollLeft;
      this.scrollTop = container.scrollTop;
      container.style.cursor = 'grabbing';
    }
  }

  stopDragging(): void {
    this.isDragging = false;
    const container = document.querySelector('.zoom-container') as HTMLElement;
    if (container) {
      container.style.cursor = 'grab';
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;
    event.preventDefault();
    const container = document.querySelector('.zoom-container') as HTMLElement;
    const x = event.pageX - container.offsetLeft;
    const y = event.pageY - container.offsetTop;
    const walkX = (x - this.startX) * 1.5;
    const walkY = (y - this.startY) * 1.5;
    container.scrollLeft = this.scrollLeft - walkX;
    container.scrollTop = this.scrollTop - walkY;
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
      stock: this.stock,
      fechaPrestamo: null
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
                           
             this.funciones.notificarCambio(true);

             this.Ruta.navigate(['/Cliente/carritoDeCompras']);
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