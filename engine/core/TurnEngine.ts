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
   * Phase 1 — Pré-contrôles
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
   * Phase 2 — Validation des intentions
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

      valid.push(intention);
    }

    return { valid, logs };
  }

  /**
   * Phase 3 — Économie
   */
  private runEconomy(
    gameState: GameState
  ): { deltas: Delta[]; logs: LogEntry[] } {
    const logs: LogEntry[] = [];

    logs.push({
      turn: gameState.instance.currentTurn,
      phase: 'economy',
      message: 'Economy phase executed (no effects yet)',
      visibility: 'public',
    });

    return { deltas: [], logs };
  }

  /**
   * Phase 4 — Recherche
   */
  private runResearch(
    gameState: GameState
  ): { deltas: Delta[]; logs: LogEntry[] } {
    const logs: LogEntry[] = [];

    logs.push({
      turn: gameState.instance.currentTurn,
      phase: 'research',
      message: 'Research phase executed (no effects yet)',
      visibility: 'public',
    });

    return { deltas: [], logs };
  }

  /**
   * Phase 5 — Déplacements
   * Aucun combat n’est résolu ici.
   */
  private runMovements(
    gameState: GameState
  ): { deltas: Delta[]; logs: LogEntry[] } {
    const logs: LogEntry[] = [];

    logs.push({
      turn: gameState.instance.currentTurn,
      phase: 'movement',
      message: 'Movement phase executed (no effects yet)',
      visibility: 'public',
    });

    return { deltas: [], logs };
  }

  /**
   * Exécute un tour de jeu complet.
   */
  executeTurn(
    gameState: GameState,
    intentions: Intention[]
  ): {
    deltas: Delta[];
    logs: LogEntry[];
    nextGameState: GameState;
  } {
    const allLogs: LogEntry[] = [];
    const allDeltas: Delta[] = [];

    // Phase 1 — pré-contrôles
    this.preChecks(gameState);

    // Phase 2 — validation des intentions
    const { valid, logs: intentionLogs } =
      this.validateIntentions(gameState, intentions);
    allLogs.push(...intentionLogs);

    // Phase 3 — économie
    const { deltas: economyDeltas, logs: economyLogs } =
      this.runEconomy(gameState);
    allLogs.push(...economyLogs);
    allDeltas.push(...economyDeltas);

    // Phase 4 — recherche
    const { deltas: researchDeltas, logs: researchLogs } =
      this.runResearch(gameState);
    allLogs.push(...researchLogs);
    allDeltas.push(...researchDeltas);

    // Phase 5 — déplacements
    const { deltas: movementDeltas, logs: movementLogs } =
      this.runMovements(gameState);
    allLogs.push(...movementLogs);
    allDeltas.push(...movementDeltas);

    // TODO:
    // 6. combats
    // 7. événements
    // 8. scoring & fin de partie
    // 9. logs finaux
    // 10. clôture du tour

    return {
      deltas: allDeltas,
      logs: allLogs,
      nextGameState: gameState,
    };
  }
}
