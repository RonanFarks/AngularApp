import { Component } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { HttpClientModule } from '@angular/common/http'; 
import { LoginComponent } from './login/login.component';

@Component({
  standalone: true,
  selector: 'app-root',
  template: `
    <main>
      <header class="brand-name">
      <div class="navigation">
               <a href="/home" rel="noopener noreferrer">
          <img class="brand-logo" src="assets/logo4.jpg" alt="logo" aria-hidden="true">
        </a>
          <a routerLink="/home" class="nav-item">Home</a>
          <a routerLink="/about" class="nav-item">About Us</a>
          <a routerLink="/contact" class="nav-item">Contact</a>
          </div>
          <a routerLink="/login" class="login-button">Login</a>
      </header>
      <section class="content">
      <router-outlet></router-outlet>
      </section>
    </main>
  `,
  styleUrls: ['./app.component.css'],
  imports: [HomeComponent, RouterModule, HttpClientModule],
})
export class AppComponent {
  title = 'homes';
}
//        <app-home></app-home>