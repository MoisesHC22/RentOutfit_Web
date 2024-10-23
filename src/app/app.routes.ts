import { Routes } from '@angular/router';
import { HomeComponent } from './Vistas/Comercial/home/home.component';
import { LoginComponent } from './Vistas/Comercial/login/login.component';
import { MenuComponent } from './Vistas/menu/menu.component';
import { RegisterComponent } from './Vistas/Comercial/register/register.component';

export const routes: Routes = [

    {path: '', redirectTo:'/Cliente/home', pathMatch: 'full'},
    
    {
     path: 'Cliente',
     component: MenuComponent,
     children: [
        {path: 'home', component: HomeComponent},

     ],
    }, 

    {path: 'Login', component: LoginComponent},
    {path: 'Register', component: RegisterComponent}

];
