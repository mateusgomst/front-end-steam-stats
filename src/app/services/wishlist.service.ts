import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

interface WishlistRequest {
  appId: number;
  nameGame: string;
}

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly apiUrl = 'http://localhost:5090/wishlist';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) { }

  addToWishlist(appId: number, nameGame: string): Observable<any> {
    const token = this.authService.getToken();
    
    if (!token) {
      this.router.navigate(['/login']);
      return throwError(() => new Error('Usuário não autenticado'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const body: WishlistRequest = {
      appId,
      nameGame
    };

    return this.http.post(this.apiUrl, body, { headers }).pipe(
      catchError(error => {
        console.error('Erro ao adicionar à wishlist:', error);
        return throwError(() => error);
      })
    );
  }
} 