import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, catchError, finalize, tap, throwError } from 'rxjs';
import { Game } from '../../../models/game.model';
import { WishlistService } from '../../../services/wishlist.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent implements OnInit {
  public games$!: Observable<Game[]>;
  public error: string | null = null;
  public isLoading = false;
  public maxItems: number;

  constructor(
    private wishlistService: WishlistService,
    private router: Router
  ) {
    this.maxItems = this.wishlistService.getMaxWishlistItems();
  }

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist(): void {
    console.log('WishlistComponent: Carregando wishlist');
    this.error = null;
    this.isLoading = true;

    this.games$ = this.wishlistService.getWishlist().pipe(
      tap(games => {
        console.log('WishlistComponent: Wishlist carregada:', games);
      }),
      catchError(error => {
        console.error('WishlistComponent: Erro ao carregar wishlist:', error);
        this.error = 'Ocorreu um erro ao carregar sua wishlist. Por favor, tente novamente.';
        if (error.message === 'Usuário não autenticado') {
          this.error = 'Você precisa estar logado para ver sua wishlist.';
        }
        return throwError(() => error);
      }),
      finalize(() => {
        this.isLoading = false;
      })
    );

    this.games$.subscribe({
      next: (games) => {
        console.log('WishlistComponent: Wishlist atualizada:', games);
      },
      error: (error) => {
        console.log('WishlistComponent: Erro ao atualizar wishlist:', error);
      }
    });
  }

  removeGame(game: Game): void {
    console.log('WishlistComponent: Removendo jogo:', game);
    this.isLoading = true;

    this.wishlistService.removeFromWishlist(game.appId).subscribe({
      next: () => {
        console.log('WishlistComponent: Jogo removido com sucesso');
        this.loadWishlist(); // Recarrega a lista após remover
      },
      error: (error) => {
        console.error('WishlistComponent: Erro ao remover jogo:', error);
        this.error = 'Ocorreu um erro ao remover o jogo da wishlist. Por favor, tente novamente.';
        this.isLoading = false;
      }
    });
  }

  retry(): void {
    this.loadWishlist();
  }
} 