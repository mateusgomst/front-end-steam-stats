import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Game } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly apiUrl = 'http://localhost:5090/wishlist';
  private readonly MAX_WISHLIST_ITEMS = 10;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) { }

  getWishlist(): Observable<Game[]> {
    const token = this.authService.getToken();
    
    if (!token) {
      this.router.navigate(['/login']);
      return throwError(() => new Error('Usuário não autenticado'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<Game[]>(this.apiUrl, { headers }).pipe(
      tap(games => {
        console.log('WishlistService: Wishlist carregada:', games);
      }),
      catchError(error => {
        console.error('WishlistService: Erro ao carregar wishlist:', error);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

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

    const body = {
      appId,
      nameGame
    };

    return this.http.post(this.apiUrl, body, { headers }).pipe(
      tap(() => {
        console.log('WishlistService: Jogo adicionado à wishlist');
      }),
      catchError(error => {
        console.error('WishlistService: Erro ao adicionar à wishlist:', error);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

  removeFromWishlist(appId: number): Observable<any> {
    const token = this.authService.getToken();
    
    if (!token) {
      this.router.navigate(['/login']);
      return throwError(() => new Error('Usuário não autenticado'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(`${this.apiUrl}/${appId}`, { headers }).pipe(
      tap(() => {
        console.log('WishlistService: Jogo removido da wishlist');
      }),
      catchError(error => {
        console.error('WishlistService: Erro ao remover da wishlist:', error);
        if (error.status === 401) {
          this.router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

  getMaxWishlistItems(): number {
    return this.MAX_WISHLIST_ITEMS;
  }
} 