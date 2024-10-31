import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FuncionesService } from '../../../Services/funciones.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recuperar-contrasena.component.html',
  styleUrl: './recuperar-contrasena.component.css'
})
export class RecuperarContrasenaComponent implements OnInit {
  
  datos: any;

  ngOnInit(): void {
    this.datos = this.form.group({
      token: ['', [Validators.required]]
    })
  }

  constructor(private form: FormBuilder, private Funciones: FuncionesService, private Rutas: ActivatedRoute){}

  ValidarToken(email: string, token: string) : void {
  }


}
