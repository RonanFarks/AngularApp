import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Import Router for redirection after successful login
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [FormsModule],
  template: `
    <div class="login-container">
      <h1>Login</h1>
      <form (ngSubmit)="onLogin()">
        <label for="username">Username:</label>
        <input 
          type="text" 
          id="username" 
          name="username" 
          [(ngModel)]="username" 
          required 
        />
        
        <label for="password">Password:</label>
        <input 
          type="password" 
          id="password" 
          name="password" 
          [(ngModel)]="password" 
          required 
        />
        
        <button type="submit">Login</button>
      </form>
    </div>
  `,
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onLogin(): void {
    const loginData = { username: this.username, password: this.password };
  
    this.http.post('http://localhost:7000/api/login', loginData).subscribe({
      next: (response: any) => {
        console.log('Login successful', response);
  
        if (response.success) {
          localStorage.setItem('user', JSON.stringify(response.user));
          this.router.navigate(['/listing']); // Redirect after successful login
        } else {
          alert('Invalid username or password'); // Handle login failure
        }
      },
      error: (error) => {
        console.error('Login failed', error);
  
        // Extract a meaningful error message
        let errorMessage = 'An error occurred during login. Please try again later.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message; // Use the backend-provided message
        } else if (error.status === 0) {
          errorMessage = 'Unable to connect to the server. Please check if the backend is running.';
        } else if (error.status >= 400 && error.status < 500) {
          errorMessage = 'Invalid credentials. Please check your username and password.';
        }
  
        alert(errorMessage); // Display the error message to the user
      }
    });
  }  
}
