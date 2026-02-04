/**
 * Turn Engine (core)
 * -----------------
 * Orchestrateur principal d’un tour de jeu.
 * Ce fichier contient la structure du moteur,
 * PAS encore la logique métier.
 */

import { GameState } from '../types/GameState';
import { Intention } from '../types/Intention';
import { Delta } from '../types/Delta';
import { LogEntry } from '../types/Log';

export class TurnEngine {
    /**
   * Pré-contrôles avant l’exécution d’un tour.
   * Aucune modification du GameState n’est autorisée ici.
   */
  private preChecks(gameState: GameState): void {
    if (!gameState) {
      throw new Error('GameState is undefined');
    }

    if (!gameState.instance) {
      throw new Error('GameState.instance is missing');
    }

    if (gameState.instance.status !== 'active') {
      throw new Error(
        `Cannot execute turn: instance status is ${gameState.instance.status}`
      );
    }
  }

  /**
   * Exécute un tour de jeu complet.
   * La logique sera ajoutée étape par étape.
   */
   executeTurn(
    gameState: GameState,
    intentions: Intention[]
  ): {
    deltas: Delta[];
    logs: LogEntry[];
    nextGameState: GameState;
  } {
    this.preChecks(gameState);
  
    // TODO:
    // 1. pré-contrôles
    // 2. validation des intentions
    // 3. économie
    // 4. recherche
    // 5. déplacements
    // 6. combats
    // 7. événements
    // 8. scoring & fin de partie
    // 9. logs
    // 10. clôture du tour

    return {
      deltas: [],
      logs: [],
      nextGameState: gameState,
    };
  }
}
