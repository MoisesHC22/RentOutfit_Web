import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FuncionesService } from '../../../../Services/funciones.service';
import { ActivatedRoute, Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { ActualizarContrasena, ValidarToken } from '../../../../Interfaces/contrasena.interface';

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule, 
    RouterLink, 
    RouterOutlet
  ],
  templateUrl: './recuperar-contrasena.component.html',
  styleUrl: './recuperar-contrasena.component.css'
})
export class RecuperarContrasenaComponent implements OnInit {
  
  datos: any;
  nuevosDatos: any;
  formContrasena = false;
  email: string | null= null;
  token: string | null = null;

  ngOnInit(): void {

    this.email = this.Rutas.snapshot.queryParamMap.get('email');
    this.token = this.Rutas.snapshot.queryParamMap.get('token');

    console.log("El correo es:", this.email);
    console.log("El token es:", this.token);   

    if(this.email && this.token) {
      this.Validar(this.email, this.token);
    }

    this.nuevosDatos = this.form.group({
      contrasena: ['', [Validators.required]]
    });
  }

  constructor(private form: FormBuilder, private Funciones: FuncionesService, private Rutas: ActivatedRoute, private redireccion: Router){}

  Validar(email: string, token: string) : void {

     console.log(this.email, this.email);

    const data: ValidarToken = {
      email: email!,
      token: token!
    }

    this.Funciones.ValidarToken(data).subscribe({
      next: (result) => {
        
        if(result.tipoError === 2 || result.tipoError === 1 || result.tipoError === 3) {
          this.formContrasena = false;
          console.log("Error", result);
        }
        else {
        this.formContrasena = true;
        }
      },
      error: (err) => {
        console.log("Ocurrio un error.", err);
      }
    });
  }



  NuevaContra() : void {

    const data: ActualizarContrasena = {
      contrasena: this.nuevosDatos.value.contrasena!,
      email: this.email!
    }

    this.Funciones.ActualizarContrasena(data).subscribe({
      next: (result) => {
        this.redireccion.navigate(['/Login']);
      },
      error: (err) => {
        console.log("Ocurrio un error.", err);
      }
    });
  }


  

}
