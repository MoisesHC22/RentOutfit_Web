import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, RouterLink } from '@angular/router';
import { faHouse, faBagShopping, faShirt, faMagnifyingGlass, faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterModule,
    FontAwesomeModule
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  faHouse = faHouse;
  faBag = faBagShopping;
  faShirt = faShirt;
  faSearch = faMagnifyingGlass;  
  faBell = faBell;
}
