
/**
 * Interface que representa a estrutura de um jogo, 
 * espelhando o modelo da sua API C#.
 */
export interface Game {
  id: number;
  nameGame: string;
  appId: number;
  positive: number;
  discount: number;
}
