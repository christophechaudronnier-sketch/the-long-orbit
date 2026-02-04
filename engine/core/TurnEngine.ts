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
