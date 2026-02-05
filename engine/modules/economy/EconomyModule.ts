// engine/modules/economy/EconomyModule.ts

import { GameState } from "../../types/GameState";
import { ResourceDelta } from "../../types/Delta";

/**
 * EconomyModule (MVP v0)
 *
 * Responsabilité :
 * - Lire l'état du jeu (GameState)
 * - Calculer la production économique minimale
 * - Retourner des ResourceDelta
 *
 * Règles MVP v0 :
 * - Chaque système contrôlé produit +1 metal par tour
 * - Aucun entretien
 * - Aucun plafond
 * - Aucun bonus
 */
export class EconomyModule {
  static compute(gameState: GameState): ResourceDelta[] {
    const deltas: ResourceDelta[] = [];

    // Comptage des systèmes contrôlés par faction
    const systemsByFaction: Record<string, number> = {};

    for (const system of gameState.systems) {
      if (!system.ownerFactionId) continue;

      if (!systemsByFaction[system.ownerFactionId]) {
        systemsByFaction[system.ownerFactionId] = 0;
      }

      systemsByFaction[system.ownerFactionId] += 1;
    }

    // Génération des ResourceDelta
    for (const factionId of Object.keys(systemsByFaction)) {
      const controlledSystems = systemsByFaction[factionId];
      const producedMetal = controlledSystems; // +1 metal par système

      if (producedMetal <= 0) continue;

      deltas.push({
        type: "resource",
        factionId,
        resourceKey: "metal",
        amount: producedMetal,
        source: "economy",
      });
    }

    return deltas;
  }
}
