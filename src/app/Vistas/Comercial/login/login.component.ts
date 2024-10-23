import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, RouterLink } from '@angular/router';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterModule,
    LottieComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  animationOptions: AnimationOptions = {
    path: '/Animaciones/Login.json'
  }

}
