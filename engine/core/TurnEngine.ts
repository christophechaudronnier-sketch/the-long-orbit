/**
 * Turn Engine (core)
 * -----------------
 * Orchestrateur principal d’un tour de jeu.
 * Applique strictement les phases du tour et délègue
 * toute logique métier aux modules.
 */

import { GameState } from "../types/GameState";
import { Intention } from "../types/Intention";
import { Delta } from "../types/Delta";
import { LogEntry } from "../types/Log";

import { EconomyModule } from "../modules/economy/EconomyModule";
import { DeltaApplier } from "./DeltaApplier";

export class TurnEngine {
  /**
   * Phase 1 — Pré-contrôles
   */
  private preChecks(gameState: GameState): void {
    if (!gameState) {
      throw new Error("GameState is undefined");
    }

    if (!gameState.instance) {
      throw new Error("GameState.instance is missing");
    }

    if (gameState.instance.status !== "active") {
      throw new Error(
        `Cannot execute turn: instance status is ${gameState.instance.status}`
      );
    }
  }

  /**
   * Phase 2 — Validation des intentions
   * - intentions du bon tour
   * - faction existante
   * - 1 action majeure max
   */
  private validateIntentions(
    gameState: GameState,
    intentions: Intention[]
  ): { valid: Intention[]; logs: LogEntry[] } {
    const logs: LogEntry[] = [];
    const valid: Intention[] = [];

    // Vérifications de base
    for (const intention of intentions) {
      if (intention.turn !== gameState.instance.currentTurn) {
        logs.push({
          turn: gameState.instance.currentTurn,
          phase: "intentions",
          message: `Invalid intention: wrong turn (${intention.turn})`,
          visibility: "faction",
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
          phase: "intentions",
          message: `Invalid intention: unknown faction (${intention.factionId})`,
          visibility: "public",
        });
        continue;
      }

      valid.push(intention);
    }

    // Règle : 1 action majeure par tour
    const majorActions = valid.filter(
      (i) =>
        i.type === "build_mine" ||
        i.type === "explore_system" ||
        i.type === "attack_system"
    );

    if (majorActions.length > 1) {
      logs.push({
        turn: gameState.instance.currentTurn,
        phase: "intentions",
        message: "Only one major action is allowed per turn",
        visibility: "public",
      });

      return {
        valid: valid.filter(
          (i) =>
            i.type !== "build_mine" &&
            i.type !== "explore_system" &&
            i.type !== "attack_system"
        ),
        logs,
      };
    }

    return { valid, logs };
  }

  /**
   * Phase — Exploration (v1)
   * Prise de contrôle d’un système neutre
   */
  private runExploration(
    gameState: GameState
  ): { deltas: Delta[]; logs: LogEntry[] } {
    const deltas: Delta[] = [];
    const logs: LogEntry[] = [];

    const exploreIntentions = gameState.intentions.filter(
      (i) => i.type === "explore_system"
    );

    for (const intention of exploreIntentions) {
      const { factionId, payload } = intention;
      const { targetSystemId } = payload as any;

      const system = gameState.systems.find(
        (s) => s.systemId === targetSystemId
      );

      if (!system) continue;
      if (system.ownerFactionId) continue;

      deltas.push({
        type: "control",
        systemId: system.systemId,
        previousOwnerFactionId: null,
        newOwnerFactionId: factionId,
      });

      logs.push({
        turn: gameState.instance.currentTurn,
        phase: "exploration",
        message: `System ${system.systemId} explored and claimed`,
        visibility: "public",
      });
    }

    return { deltas, logs };
  }

  /**
   * Phase — Économie
   */
  private runEconomy(
    gameState: GameState
  ): { deltas: Delta[]; logs: LogEntry[] } {
    const deltas = EconomyModule.compute(gameState);

    const logs: LogEntry[] = [
      {
        turn: gameState.instance.currentTurn,
        phase: "economy",
        message: `Economy phase executed (${deltas.length} deltas)`,
        visibility: "public",
      },
    ];

    return { deltas, logs };
  }

  /**
   * Phase finale — Clôture du tour
   */
  private closeTurn(
    gameState: GameState
  ): { nextGameState: GameState; logs: LogEntry[] } {
    return {
      nextGameState: gameState,
      logs: [
        {
          turn: gameState.instance.currentTurn,
          phase: "closure",
          message: "Turn closed",
          visibility: "public",
        },
      ],
    };
  }

  /**
   * Exécution complète d’un tour
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

    // Phase 1
    this.preChecks(gameState);

    // Phase 2
    const validated = this.validateIntentions(gameState, intentions);
    gameState.intentions = validated.valid;
    allLogs.push(...validated.logs);

    // Phase exploration
    const exploration = this.runExploration(gameState);
    allLogs.push(...exploration.logs);
    allDeltas.push(...exploration.deltas);

    // Phase économie
    const economy = this.runEconomy(gameState);
    allLogs.push(...economy.logs);
    allDeltas.push(...economy.deltas);

    // Application des deltas
    const updatedGameState = DeltaApplier.apply(gameState, allDeltas);

    // Clôture
    const closure = this.closeTurn(updatedGameState);

    return {
      deltas: allDeltas,
      logs: [...allLogs, ...closure.logs],
      nextGameState: closure.nextGameState,
    };
  }
}
