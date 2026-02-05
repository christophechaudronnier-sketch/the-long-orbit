// engine/core/DeltaApplier.ts

import { GameState } from "../types/GameState";
import { Delta } from "../types/Delta";

/**
 * DeltaApplier
 *
 * Rôle :
 * - Appliquer les deltas calculés par les modules
 * - Être le SEUL endroit autorisé à modifier le GameState
 *
 * Aucune logique métier ici.
 * Le DeltaApplier ne fait qu'appliquer ce qui est décrit.
 */
export class DeltaApplier {
  static apply(gameState: GameState, deltas: Delta[]): GameState {
    // Pour le MVP, on travaille sur une copie simple
    const nextGameState: GameState = structuredClone(gameState);

    for (const delta of deltas) {
      switch (delta.type) {
        case "resource":
          this.applyResourceDelta(nextGameState, delta);
          break;

        // Deltas futurs :
        // case "research":
        // case "movement":
        // case "combat":
        // case "control":

        default:
          throw new Error(`Unknown delta type: ${delta.type}`);
      }
    }

    return nextGameState;
  }

  /**
   * Application d'un ResourceDelta
   */
  private static applyResourceDelta(
    gameState: GameState,
    delta: any
  ): void {
    const factionResources = gameState.resources.find(
      (r) => r.factionId === delta.factionId
    );

    if (!factionResources) {
      throw new Error(
        `ResourceDelta error: faction ${delta.factionId} not found`
      );
    }

    if (!factionResources.resources[delta.resourceKey]) {
      factionResources.resources[delta.resourceKey] = 0;
    }

    factionResources.resources[delta.resourceKey] += delta.amount;
  }
}
