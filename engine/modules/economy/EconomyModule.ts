// engine/modules/economy/EconomyModule.ts

import { GameState } from "../../types/GameState";
import { Delta } from "../../types/Delta";
import { Intention } from "../../types/Intention";

/**
 * EconomyModule (v1 jouable)
 *
 * Responsabilités :
 * - Calculer la production de ressources
 * - Appliquer les effets économiques des intentions
 *
 * Règles v1 :
 * - +1 metal / système contrôlé
 * - +1 energy / système contrôlé
 * - +1 metal / mine
 * - build_mine :
 *   - coûte 5 metal
 *   - ajoute une mine au système
 */
export class EconomyModule {
  static compute(gameState: GameState): Delta[] {
    const deltas: Delta[] = [];

    // --- PRODUCTION DE BASE PAR SYSTÈME ---
    for (const system of gameState.systems) {
      if (!system.ownerFactionId) continue;

      // +1 metal / système
      deltas.push({
        type: "resource",
        factionId: system.ownerFactionId,
        resourceKey: "metal",
        amount: 1,
        source: "system",
      });

      // +1 energy / système
      deltas.push({
        type: "resource",
        factionId: system.ownerFactionId,
        resourceKey: "energy",
        amount: 1,
        source: "system",
      });
    }

    // --- PRODUCTION DES MINES EXISTANTES ---
    for (const system of gameState.systems) {
      if (!system.ownerFactionId) continue;
      if (!system.structures) continue;

      const mineCount = system.structures.filter(
        (s) => s === "mine"
      ).length;

      if (mineCount > 0) {
        deltas.push({
          type: "resource",
          factionId: system.ownerFactionId,
          resourceKey: "metal",
          amount: mineCount,
          source: "mine",
        });
      }
    }

    // --- TRAITEMENT DES INTENTIONS build_mine ---
    const buildMineIntentions = gameState.intentions.filter(
      (i: Intention) => i.type === "build_mine"
    );

    for (const intention of buildMineIntentions) {
      const { factionId, payload } = intention;
      const systemId = (payload as any).systemId;

      const system = gameState.systems.find(
        (s) => s.systemId === systemId
      );

      if (!system) continue;
      if (system.ownerFactionId !== factionId) continue;

      const resources = gameState.resources.find(
        (r) => r.factionId === factionId
      );

      if (!resources) continue;

      const currentMetal = resources.resources.metal ?? 0;

      // Coût fixe v1
      if (currentMetal < 5) continue;

      // Consommation du metal
      deltas.push({
        type: "resource",
        factionId,
        resourceKey: "metal",
        amount: -5,
        source: "build_mine",
      });

      // Création de la mine
      deltas.push({
        type: "structure",
        systemId,
        structure: "mine",
      });
    }

    return deltas;
  }
}
