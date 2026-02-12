// engine/core/DeltaApplier.ts

import type { GameState } from "../types/GameState";
import type { Delta } from "../types/Delta";

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
    const nextGameState: GameState = structuredClone(gameState);

    for (const delta of deltas) {
      switch (delta.type) {
        case "resource":
          this.applyResourceDelta(nextGameState, delta as any);
          break;

        case "system_control":
          this.applySystemControlDelta(nextGameState, delta as any);
          break;

        default:
          throw new Error(`Unknown delta type: ${delta.type}`);
      }
    }

    return nextGameState;
  }

  /* ======================================== */
  /* ===== RESOURCE DELTA =================== */
  /* ======================================== */

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

  /* ======================================== */
  /* ===== SYSTEM CONTROL DELTA ============= */
  /* ======================================== */

  private static applySystemControlDelta(
    gameState: GameState,
    delta: any
  ): void {
    const { factionId, systemId } = delta;

    const system = gameState.systems.find(
      (s) => s.systemId === systemId
    );

    if (!system) {
      throw new Error(`SystemControlDelta error: system ${systemId} not found`);
    }

    const faction = gameState.factions.find(
      (f) => f.factionId === factionId
    );

    if (!faction) {
      throw new Error(`SystemControlDelta error: faction ${factionId} not found`);
    }

    // Mise à jour du propriétaire du système
    system.ownerFactionId = factionId;

    // Ajout du système dans controlledSystems
    if (!faction.controlledSystems.includes(systemId)) {
      faction.controlledSystems.push(systemId);
    }
  }
}
