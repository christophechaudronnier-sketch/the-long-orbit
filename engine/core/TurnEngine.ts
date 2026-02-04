/**
 * Turn Engine (core)
 * -----------------
 * Orchestrateur principal d’un tour de jeu.
 * Ce fichier contient la structure du moteur,
 * PAS encore la logique métier complète.
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
   * Validation des intentions pour le tour en cours.
   * Ne modifie pas le GameState.
   * Retourne uniquement les intentions valides.
   */
  private validateIntentions(
    gameState: GameState,
    intentions: Intention[]
  ): { valid: Intention[]; logs: LogEntry[] } {
    const logs: LogEntry[] = [];
    const valid: Intention[] = [];

    for (const intention of intentions) {
      // Vérifie le tour
      if (intention.turn !== gameState.instance.currentTurn) {
        logs.push({
          turn: gameState.instance.currentTurn,
          phase: 'intentions',
          message: `Invalid intention: wrong turn (${intention.turn})`,
          visibility: 'faction',
          factionId: intention.factionId,
        });
        continue;
      }

      // Vérifie la faction
      const factionExists = gameState.factions.some(
        (f) => f.factionId === intention.factionId
      );
      if (!factionExists) {
        logs.push({
          turn: gameState.instance.currentTurn,
          phase: 'intentions',
          message: `Invalid intention: unknown faction (${intention.factionId})`,
          visibility: 'public',
        });
        continue;
      }

      // Intention valide (structurellement)
      valid.push(intention);
    }

    return { valid, logs };
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
    // Phase 1 — pré-contrôles
    this.preChecks(gameState);

    // Phase 2 — validation des intentions
    const { valid, logs } = this.validateIntentions(gameState, intentions);

    // TODO:
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
      logs,
      nextGameState: gameState,
    };
  }
}
