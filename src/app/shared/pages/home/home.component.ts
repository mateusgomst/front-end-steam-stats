// src/app/home/home.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, catchError, finalize, tap, throwError } from 'rxjs';
import { Game } from '../../../models/game.model';
import { GameService } from '../../../services/game.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  public games$!: Observable<Game[]>;
  public error: string | null = null;
  public isLoading = false;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    console.log('HomeComponent: ngOnInit chamado');
    this.loadGames();
  }

  loadGames(): void {
    console.log('HomeComponent: Iniciando carregamento dos jogos');
    this.error = null;
    this.isLoading = true;
    
    this.games$ = this.gameService.getGames().pipe(
      tap({
        next: (games) => {
          console.log('HomeComponent: Jogos recebidos com sucesso:', games);
        },
        error: (error) => {
          console.log('HomeComponent: Erro interceptado no tap:', error);
        }
      }),
      catchError(error => {
        console.error('HomeComponent: Erro capturado no componente:', error);
        this.error = 'Ocorreu um erro ao carregar os jogos. Por favor, tente novamente.';
        return throwError(() => error);
      }),
      finalize(() => {
        console.log('HomeComponent: Finalizando requisição');
        this.isLoading = false;
      })
    );

    // Adicionando subscribe para garantir que o Observable seja executado
    this.games$.subscribe({
      next: (games) => {
        console.log('HomeComponent: Subscribe recebeu os jogos:', games);
      },
      error: (error) => {
        console.log('HomeComponent: Subscribe recebeu erro:', error);
      }
    });
  }

  retry(): void {
    console.log('HomeComponent: Tentando carregar os jogos novamente');
    this.loadGames();
  }
}
