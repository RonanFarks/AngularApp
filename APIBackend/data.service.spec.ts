import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = 'http://localhost:7000/api/data'; // Backend API URL
  private apiLogin = 'http://localhost:7000/api/login'; // Backend API URL

  constructor(private http: HttpClient) {}

  // This method first logs in and then fetches the data
  getData(username: string, password: string): Observable<any> {
    // First, attempt login using apiLogin
    return this.login(username, password).pipe(
      // If login is successful, make the API call to fetch data
      switchMap((loginResponse) => {
        // Assuming the login response includes a token
        const token = loginResponse.token;
        
        // Now, fetch data with the token as authorization
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<any>(this.apiUrl, { headers });
      }),
      catchError(error => {
        console.error('Error during data fetching', error);
        throw error;  // Handle the error accordingly
      })
    );
  }

  // Method to handle login
  private login(username: string, password: string): Observable<any> {
    const loginData = { username, password };
    return this.http.post<any>(this.apiLogin, loginData);
  }
}
