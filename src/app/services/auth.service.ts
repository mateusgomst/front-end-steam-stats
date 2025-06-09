import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, tap, throwError } from 'rxjs';
import { AuthRequest, AuthResponse, User } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:5090/auth';
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    // Verificar token existente ao inicializar
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(this.TOKEN_KEY);
      if (token) {
        this.isAuthenticatedSubject.next(true);
        const user = this.getSavedUser();
        if (user) {
          this.currentUserSubject.next(user);
        }
      }
    }
  }

  login(credentials: AuthRequest): Observable<AuthResponse> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    
    console.log('Tentando login com:', credentials);

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials, { headers }).pipe(
      tap(response => {
        console.log('Resposta do login:', response);
        if (response && response.token) {
          this.setToken(response.token);
          this.setUser({
            name: credentials.name || '',
            login: credentials.login
          });
          this.isAuthenticatedSubject.next(true);
          this.currentUserSubject.next({
            name: credentials.name || '',
            login: credentials.login
          });
        } else {
          throw new Error('Token não recebido na resposta');
        }
      }),
      catchError(error => {
        console.error('Erro detalhado:', error);
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            return throwError(() => new Error('Email ou senha inválidos'));
          }
          return throwError(() => new Error(error.error?.message || 'Erro no servidor'));
        }
        return throwError(() => error);
      })
    );
  }

  register(userData: AuthRequest): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    
    console.log('Tentando registrar com:', userData);

    return this.http.post(`${this.apiUrl}/register`, userData, { headers }).pipe(
      tap(response => {
        console.log('Resposta do registro:', response);
      }),
      catchError(error => {
        console.error('Erro no registro:', error);
        if (error instanceof HttpErrorResponse) {
          return throwError(() => new Error(error.error?.message || 'Erro ao registrar usuário'));
        }
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  private setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  private getSavedUser(): User | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(this.USER_KEY);
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  }
} 