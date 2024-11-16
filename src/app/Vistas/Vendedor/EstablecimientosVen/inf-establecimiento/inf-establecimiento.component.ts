import { Component, OnInit } from '@angular/core';
import { EstilosInterfaces, ListaVestimenta, TallasInterfaces, VestimentaEstablecimientos } from '../../../../Interfaces/Vestimenta.interface';
import { InformacionTienda } from '../../../../Interfaces/tienda.interface';
import { FuncionesService } from '../../../../Services/funciones.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faArrowRight, faSearch } from '@fortawesome/free-solid-svg-icons'; 

@Component({
  selector: 'app-inf-establecimiento',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './inf-establecimiento.component.html',
  styleUrl: './inf-establecimiento.component.css'
})
export class InfEstablecimientoComponent implements OnInit {
  
  datos: any;
  filtro: any;

  establecimiento: number = 0;
  usuario: number | null = null;
  pagina: number | null = null;
  informacion: InformacionTienda | null = null;
  VestimentasList: ListaVestimenta[]=[];
  AnuncionAunNoTieneVestimentas = false;
  MostrarModal = false;

  imagenesPerfil: (File | null)[] = [null, null, null, null];
  imagenesPrevisualizacion: (string | ArrayBuffer | null)[] = [null, null, null, null];

  constructor(private Funciones: FuncionesService, private Rutas: ActivatedRoute, private form: FormBuilder, private Ruta: Router){}

  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;
  faSearch = faSearch;

  registrosPorPagina: number = 10;
  totalRegistros: number = 0;
  totalPaginas: number = 0;


  ngOnInit(): void {

    this.pagina = 1;
    this.ListaTallas();
    this.ListaCategorias();

    this.filtro = this.form.group({
      busqueda: ['']
    });

    this.datos = this.form.group({
      nombre: ['', [Validators.required]],
      stock: [0, [Validators.required]],
      precio: [0, [Validators.required]],
      talla: [0, [Validators.required]],
      estilo: [0, [Validators.required]],
      descripcion: ['', [Validators.required]],
      img1: [null, [Validators.required]],
      img2: [null],
      img3: [null],
      img4: [null]
    });

    this.Rutas.paramMap.subscribe(params => {
      const establecimientoID = params.get('establecimiento');

      if(establecimientoID) {
        this.establecimiento = +establecimientoID;
        this.InformacionEstablecimiento(this.establecimiento);
      }
    });
  }


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


  ListaVestimentas(establecimiento: number, usuario: number): void {
    const data: VestimentaEstablecimientos = {
      establecimiento: this.establecimiento!,
      usuario: this.usuario!,
      pagina: this.pagina!,
      filtro: this.filtro.value.busqueda!,
    };
    
    console.log(data);
    this.Funciones.VestimentasEstablecimientos(data).subscribe({
      next: (result) => {
        this.VestimentasList = result;
        
        if(this.VestimentasList.length > 0)
        {
          this.totalRegistros = this.VestimentasList[0].totalRegistros ?? 0;
        } else {
          this.totalRegistros = 0;
        }

        this.totalPaginas = Math.ceil(this.totalRegistros / this.registrosPorPagina);

      }, 
      error: (err) => {
        console.log("Ocurrio un error.", err);
      }
    });
  }
  

  // #region listas
  CategoriasList: EstilosInterfaces[]=[];
  TallasList: TallasInterfaces[]=[];
  
    ListaCategorias(){
      this.Funciones.ObtenerEstilos().subscribe({
        next: (result) => {
          this.CategoriasList = result;
        },
        error: (err) => {
          console.log(err)
        }
      });
    }
  
    ListaTallas() {
      this.Funciones.ObtenerTallas().subscribe({
        next: (result) => {
          this.TallasList = result;
        },
        error: (err) => {
          console.log(err)
        }
      });
    }
// #endregion 


// #region funciones para las imagenes
  cargarImagen(index: number) {
    const input = document.querySelectorAll('input[type="file"]')[index] as HTMLInputElement;
    input.click();
  }

  imagenSeleccionada(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const tamanoMaximoMB = 2;
      const tamanoMaximoBytes = tamanoMaximoMB * 1024 * 1024;

      if (file.size > tamanoMaximoBytes) {
        this.datos.get(`imagen${index + 1}`)?.setErrors({ maxSize: true });
        this.imagenesPerfil[index] = null;
        this.imagenesPrevisualizacion[index] = null;
        return;
      }

      this.imagenesPerfil[index] = file;
      this.datos.get(`img${index + 1}`)?.setValue(file);

      const reader = new FileReader();
      reader.onload = () => {
        this.imagenesPrevisualizacion[index] = reader.result;
      };
    reader.readAsDataURL(file);
    }
  }
// #endregion 




  mostrarModal(): void {
    this.MostrarModal = true;
  }

  cerrarModal(): void {
    this.MostrarModal = false;
  }


  Registrar(): void {
    const formData = new FormData();

    formData.append('usuarioID', this.usuario!.toString() );
    formData.append('establecimientoID', this.establecimiento!.toString());
    formData.append('nombre', this.datos.value.nombre);
    formData.append('stock', this.datos.value.stock);
    formData.append('precio', this.datos.value.precio);
    formData.append('tallaID', this.datos.value.talla);
    formData.append('estiloID', this.datos.value.estilo);
    formData.append('descripcion', this.datos.value.descripcion);
    
    this.imagenesPerfil.forEach((imagen, index) => {
      if (imagen) {
        formData.append(`imagen${index + 1}`, imagen);
      }
    });

    this.Funciones.RegistrarVestimenta(formData).subscribe({
      next: (response) => {
        console.log("Se registro la vestimenta ", response);
        this.ListaVestimentas(this.establecimiento!, this.usuario!);
        this.MostrarModal = false;

        this.datos.reset();
        this.imagenesPerfil = [null, null, null, null];
        this.imagenesPrevisualizacion = [null, null, null, null];
      },
      error: (err) => {
        console.log('Ocurrio un error.');
      }
    });
  }


  buscarEstablecimientos() {
    this.pagina = 1;
    this.ListaVestimentas(this.establecimiento, this.usuario!);
  }


  paginaAnterior() {
    if (this.pagina! > 1) {
      this.pagina!--;
      this.ListaVestimentas(this.establecimiento, this.usuario!);
    }
  }
  
  paginaSiguiente() {
    if (this.pagina! < this.totalPaginas) {
      this.pagina!++;
      this.ListaVestimentas(this.establecimiento, this.usuario!);
    }
  }


}
