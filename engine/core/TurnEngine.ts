/**
 * Turn Engine (core)
 * -----------------
 * Orchestrateur principal d’un tour de jeu (v1 jouable).
 */

import type { GameState } from "../types/GameState";
import type { Intention } from "../types/Intention";
import type { Delta } from "../types/Delta";
import type { LogEntry } from "../types/Log";

import { EconomyModule } from "../modules/economy/EconomyModule";
import { DeltaApplier } from "./DeltaApplier";

export class TurnEngine {
  private preChecks(gameState: GameState): void {
    if (!gameState?.instance || gameState.instance.status !== "active") {
      throw new Error("GameState not active");
    }
  }

  private validateIntentions(
    gameState: GameState,
    intentions: Intention[]
  ): { valid: Intention[]; logs: LogEntry[] } {
    const logs: LogEntry[] = [];
    const valid: Intention[] = [];

    for (const i of intentions) {
      if (i.turn !== gameState.instance.currentTurn) continue;
      if (!gameState.factions.some((f) => f.factionId === i.factionId))
        continue;
      valid.push(i);
    }

    return { valid, logs };
  }

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

  executeTurn(
    gameState: GameState,
    intentions: Intention[]
  ): { deltas: Delta[]; logs: LogEntry[]; nextGameState: GameState } {
    this.preChecks(gameState);

    const allLogs: LogEntry[] = [];
    const allDeltas: Delta[] = [];

    const validated = this.validateIntentions(gameState, intentions);
    gameState.intentions = validated.valid;
    allLogs.push(...validated.logs);

    const economy = this.runEconomy(gameState);
    allLogs.push(...economy.logs);
    allDeltas.push(...economy.deltas);

    const updatedGameState = DeltaApplier.apply(gameState, allDeltas);

    // Phase de clôture du tour
    updatedGameState.instance.currentTurn += 1;
    updatedGameState.instance.lastTurnAt = new Date().toISOString();

    return {
      deltas: allDeltas,
      logs: allLogs,
      nextGameState: updatedGameState,
    };
  }
}
