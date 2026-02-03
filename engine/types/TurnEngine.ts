/**
 * Turn Engine (types only)
 * -----------------------
 * Décrit les contrats utilisés par le Turn Engine.
 * Aucune logique, aucun calcul, uniquement des types.
 */

import { GameState } from './GameState';

/* ===== Turn Engine ===== */

export interface TurnEngineContext {
  gameState: GameState;
  turn: number;
  seed: number;
}

/**
 * Résultat d’exécution d’un tour.
 * Le Turn Engine applique ces résultats au GameState.
 */
export interface TurnExecutionResult {
  deltas: Delta[];
  logs: TurnLogEntry[];
  nextSeed: number;
}

/* ===== Phases ===== */

export type TurnPhase =
  | 'prechecks'
  | 'intentions'
  | 'economy'
  | 'research'
  | 'movement'
  | 'combat'
  | 'events'
  | 'scoring'
  | 'logs'
  | 'closure';

/* ===== Deltas (abstraits) ===== */

/**
 * Delta abstrait.
 * Les implémentations concrètes vivent dans engine/deltas.
 */
export interface Delta {
  type: string;
}

/* ===== Logs ===== */

export interface TurnLogEntry {
  phase: TurnPhase;
  message: string;
  visibility: 'public' | 'faction';
  factionId?: string;
}
