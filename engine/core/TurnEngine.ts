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
   */
  private validateIntentions(
    gameState: GameState,
    intentions: Intention[]
  ): { valid: Intention[]; logs: LogEntry[] } {
    const logs: LogEntry[] = [];
    const valid: Intention[] = [];

    for (const intention of intentions) {
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
    return {
      deltas: [],
      logs: [
        {
          turn: gameState.instance.currentTurn,
          phase: 'economy',
          message: 'Economy phase executed (no effects yet)',
          visibility: 'public',
        },
      ],
    };
  }

  /**
   * Phase 4 — Recherche
   */
  private runResearch(
    gameState: GameState
  ): { deltas: Delta[]; logs: LogEntry[] } {
    return {
      deltas: [],
      logs: [
        {
          turn: gameState.instance.currentTurn,
          phase: 'research',
          message: 'Research phase executed (no effects yet)',
          visibility: 'public',
        },
      ],
    };
  }

  /**
   * Phase 5 — Déplacements
   */
  private runMovements(
    gameState: GameState
  ): { deltas: Delta[]; logs: LogEntry[] } {
    return {
      deltas: [],
      logs: [
        {
          turn: gameState.instance.currentTurn,
          phase: 'movement',
          message: 'Movement phase executed (no effects yet)',
          visibility: 'public',
        },
      ],
    };
  }

  /**
   * Phase 6 — Combats
   */
  private runCombats(
    gameState: GameState
  ): { deltas: Delta[]; logs: LogEntry[] } {
    return {
      deltas: [],
      logs: [
        {
          turn: gameState.instance.currentTurn,
          phase: 'combat',
          message: 'Combat phase executed (no effects yet)',
          visibility: 'public',
        },
      ],
    };
  }

  /**
   * Phase 7 — Événements
   * Les événements galactiques seront implémentés plus tard.
   */
  private runEvents(
    gameState: GameState
  ): { deltas: Delta[]; logs: LogEntry[] } {
    return {
      deltas: [],
      logs: [
        {
          turn: gameState.instance.currentTurn,
          phase: 'events',
          message: 'Event phase executed (no events triggered)',
          visibility: 'public',
        },
      ],
    };
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
    const { logs: intentionLogs } =
      this.validateIntentions(gameState, intentions);
    allLogs.push(...intentionLogs);

    // Phase 3 — économie
    const economy = this.runEconomy(gameState);
    allLogs.push(...economy.logs);
    allDeltas.push(...economy.deltas);

    // Phase 4 — recherche
    const research = this.runResearch(gameState);
    allLogs.push(...research.logs);
    allDeltas.push(...research.deltas);

    // Phase 5 — déplacements
    const movement = this.runMovements(gameState);
    allLogs.push(...movement.logs);
    allDeltas.push(...movement.deltas);

    // Phase 6 — combats
    const combat = this.runCombats(gameState);
    allLogs.push(...combat.logs);
    allDeltas.push(...combat.deltas);

    // Phase 7 — événements
    const events = this.runEvents(gameState);
    allLogs.push(...events.logs);
    allDeltas.push(...events.deltas);

    // TODO:
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
