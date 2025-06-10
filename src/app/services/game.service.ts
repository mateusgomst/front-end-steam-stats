// src/app/services/game.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Game } from '../models/game.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly apiUrl = 'http://localhost:5090';

  constructor(private http: HttpClient) { }

  getGames(): Observable<Game[]> {
    console.log('GameService: Iniciando requisição para:', `${this.apiUrl}/games`);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    return this.http.get<Game[]>(`${this.apiUrl}/games`, {
      headers: headers
    }).pipe(
      tap({
        next: (response) => {
          console.log('GameService: Resposta recebida com sucesso:', response);
        },
        error: (error) => {
          console.log('GameService: Erro interceptado no tap:', error);
        }
      }),
      catchError((error) => {
        console.log('GameService: Erro interceptado no catchError:', error);
        return this.handleError(error);
      })
    );
  }

  searchGamesByName(name: string): Observable<Game[]> {
    console.log('GameService: Iniciando busca por nome:', name);

    if (!name.trim()) {
      console.log('GameService: Nome vazio, retornando todos os jogos');
      return this.getGames();
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const url = `${this.apiUrl}/games/${encodeURIComponent(name.trim())}`;
    console.log('GameService: URL da busca:', url);

    return this.http.get<Game[]>(url, {
      headers: headers
    }).pipe(
      tap({
        next: (response) => {
          console.log('GameService: Resposta da busca recebida:', response);
        },
        error: (error) => {
          console.error('GameService: Erro na busca:', error);
          console.error('GameService: Status do erro:', error.status);
          console.error('GameService: Mensagem do erro:', error.message);
          if (error.error) {
            console.error('GameService: Detalhes do erro:', error.error);
          }
        }
      }),
      catchError((error) => {
        console.log('GameService: Erro interceptado no catchError da busca:', error);
        return this.handleError(error);
      })
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.log('GameService: Detalhes completos do erro:', error);
    
    if (error.status === 0) {
      console.error('GameService: Erro de conexão:', error.error);
    } else {
      console.error(
        `GameService: Backend retornou código ${error.status}, ` +
        `corpo: ${JSON.stringify(error.error)}`);
    }
    
    return throwError(() => error);
  }
}
