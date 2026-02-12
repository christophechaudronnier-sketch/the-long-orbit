/**
 * Turn Engine (core)
 * -----------------
 * Orchestrateur principal d’un tour de jeu (v1 jouable).
 */

import type { GameState } from "../types/GameState";
import type { IntentionState } from "../types/GameState";
import type { Delta } from "../types/Delta";
import type { LogEntry } from "../types/Log";

import { EconomyModule } from "../modules/economy/EconomyModule";
import { DeltaApplier } from "./DeltaApplier";

export class TurnEngine {
  /* ============================= */
  /* ===== PRE-CHECKS ============ */
  /* ============================= */

  private preChecks(gameState: GameState): void {
    if (!gameState?.instance || gameState.instance.status !== "active") {
      throw new Error("GameState not active");
    }
  }

  /* ============================= */
  /* ===== INTENTION VALIDATION == */
  /* ============================= */

  private validateIntentions(
    gameState: GameState,
    intentions: IntentionState[]
  ): { valid: IntentionState[]; logs: LogEntry[] } {
    const logs: LogEntry[] = [];
    const valid: IntentionState[] = [];

    for (const i of intentions) {
      if (i.turn !== gameState.instance.currentTurn) continue;
      if (!gameState.factions.some((f) => f.factionId === i.factionId))
        continue;

      valid.push(i);
    }

    return { valid, logs };
  }

  /* ============================= */
  /* ===== EXPLORATION =========== */
  /* ============================= */

  private runExploration(
    gameState: GameState
  ): { deltas: Delta[]; logs: LogEntry[] } {
    const deltas: Delta[] = [];
    const logs: LogEntry[] = [];

    for (const intention of gameState.intentions) {
      if (intention.type !== "explore_system") continue;

      const { factionId, payload } = intention;
      const { targetSystemId } = payload as { targetSystemId: string };

      const system = gameState.systems.find(
        (s) => s.systemId === targetSystemId
      );

      if (!system) continue;
      if (system.ownerFactionId) continue; // déjà contrôlé

      // Création d’un delta de contrôle
      deltas.push({
        type: "system_control",
        factionId,
        systemId: targetSystemId,
      } as Delta);

      logs.push({
        turn: gameState.instance.currentTurn,
        phase: "intentions",
        message: `System ${targetSystemId} explored`,
        visibility: "public",
      });
    }

    return { deltas, logs };
  }

  /* ============================= */
  /* ===== ECONOMY =============== */
  /* ============================= */

  private runEconomy(
    gameState: GameState
  ): { deltas: Delta[]; logs: LogEntry[] } {
    const deltas = EconomyModule.compute(gameState);

    return {
      deltas,
      logs: [
        {
          turn: gameState.instance.currentTurn,
          phase: "economy",
          message: "Economy resolved",
          visibility: "public",
        },
      ],
    };
  }

  /* ============================= */
  /* ===== EXECUTE TURN ========== */
  /* ============================= */

  executeTurn(
    gameState: GameState,
    intentions: IntentionState[]
  ): { deltas: Delta[]; logs: LogEntry[]; nextGameState: GameState } {
    this.preChecks(gameState);

    const allLogs: LogEntry[] = [];
    const allDeltas: Delta[] = [];

    // Validation
    const validated = this.validateIntentions(gameState, intentions);
    gameState.intentions = validated.valid;
    allLogs.push(...validated.logs);

    // Exploration
    const exploration = this.runExploration(gameState);
    allLogs.push(...exploration.logs);
    allDeltas.push(...exploration.deltas);

    // Economy
    const economy = this.runEconomy(gameState);
    allLogs.push(...economy.logs);
    allDeltas.push(...economy.deltas);

    // Application des deltas
    const updatedGameState = DeltaApplier.apply(gameState, allDeltas);

    // Clôture du tour
    updatedGameState.instance.currentTurn += 1;
    updatedGameState.instance.lastTurnAt = new Date().toISOString();

    return {
      deltas: allDeltas,
      logs: allLogs,
      nextGameState: updatedGameState,
    };
  }
}
