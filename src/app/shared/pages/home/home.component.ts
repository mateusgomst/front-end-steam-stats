// src/app/home/home.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, catchError, finalize, tap, throwError } from 'rxjs';
import { Game } from '../../../models/game.model';
import { GameService } from '../../../services/game.service';
import { WishlistService } from '../../../services/wishlist.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  public games$!: Observable<Game[]>;
  public error: string | null = null;
  public isLoading = false;
  public wishlistError: string | null = null;
  public wishlistSuccess: string | null = null;
  public searchTerm = '';

  constructor(
    private gameService: GameService,
    private wishlistService: WishlistService
  ) {}

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

    this.games$.subscribe({
      next: (games) => {
        console.log('HomeComponent: Subscribe recebeu os jogos:', games);
      },
      error: (error) => {
        console.log('HomeComponent: Subscribe recebeu erro:', error);
      }
    });
  }

  onSearch(): void {
    if (!this.searchTerm && !this.searchTerm.trim()) {
      console.log('HomeComponent: Termo de busca vazio, carregando todos os jogos');
      this.loadGames();
      return;
    }

    console.log('HomeComponent: Iniciando busca para:', this.searchTerm);
    this.error = null;
    this.isLoading = true;

    this.games$ = this.gameService.searchGamesByName(this.searchTerm).pipe(
      tap({
        next: (games) => {
          console.log('HomeComponent: Resultados da busca recebidos:', games);
        },
        error: (error) => {
          console.log('HomeComponent: Erro na busca:', error);
        }
      }),
      catchError(error => {
        console.error('HomeComponent: Erro na busca:', error);
        this.error = 'Ocorreu um erro ao buscar os jogos. Por favor, tente novamente.';
        return throwError(() => error);
      }),
      finalize(() => {
        console.log('HomeComponent: Finalizando busca');
        this.isLoading = false;
      })
    );

    this.games$.subscribe({
      next: (games) => {
        console.log('HomeComponent: Subscribe da busca recebeu os jogos:', games?.length, 'resultados');
      },
      error: (error) => {
        console.log('HomeComponent: Subscribe da busca recebeu erro:', error);
      }
    });
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.loadGames();
  }

  addToWishlist(game: Game): void {
    this.wishlistError = null;
    this.wishlistSuccess = null;
    this.wishlistService.addToWishlist(game.appId, game.nameGame)
      .subscribe({
        next: () => {
          console.log('Jogo adicionado à wishlist com sucesso');
          this.wishlistSuccess = 'Jogo adicionado à wishlist com sucesso!';
          setTimeout(() => {
            this.wishlistSuccess = null;
          }, 3000);
        },
        error: (error) => {
          console.error('Erro ao adicionar à wishlist:', error);
          this.wishlistError = 'Erro ao adicionar o jogo à wishlist. Por favor, tente novamente.';
          if (error.message === 'Usuário não autenticado') {
            this.wishlistError = 'Você precisa estar logado para adicionar jogos à wishlist.';
          }
        }
      });
  }

  retry(): void {
    console.log('HomeComponent: Tentando carregar os jogos novamente');
    if (this.searchTerm.trim()) {
      this.onSearch();
    } else {
      this.loadGames();
    }
  }
}
