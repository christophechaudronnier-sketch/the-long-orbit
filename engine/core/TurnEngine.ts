/**
 * Turn Engine (core)
 * -----------------
 * Orchestrateur principal d’un tour de jeu (v1 jouable).
 */

import { GameState } from "../types/GameState";
import { Intention } from "../types/Intention";
import { Delta } from "../types/Delta";
import { LogEntry } from "../types/Log";

import { EconomyModule } from "../modules/economy/EconomyModule";
import { DeltaApplier } from "./DeltaApplier";

export class TurnEngine {
  private preChecks(gameState: GameState): void {
    if (!gameState?.instance || gameState.instance.status !== "active") {
      throw new Error("GameState not active");
    }
  }

  /**
   * Phase — Validation des intentions
   */
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

    const major = valid.filter(
      (i) =>
        i.type === "build_mine" ||
        i.type === "explore_system" ||
        i.type === "attack_system"
    );

    if (major.length > 1) {
      logs.push({
        turn: gameState.instance.currentTurn,
        phase: "intentions",
        message: "Only one major action allowed per turn",
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
   * Phase — Exploration
   */
  private runExploration(
    gameState: GameState
  ): { deltas: Delta[]; logs: LogEntry[] } {
    const deltas: Delta[] = [];
    const logs: LogEntry[] = [];

    for (const i of gameState.intentions.filter(
      (i) => i.type === "explore_system"
    )) {
      const { factionId, payload } = i;
      const { targetSystemId } = payload as any;

      const system = gameState.systems.find(
        (s) => s.systemId === targetSystemId
      );

      if (!system || system.ownerFactionId) continue;

      deltas.push({
        type: "control",
        systemId,
        previousOwnerFactionId: null,
        newOwnerFactionId: factionId,
      });

      logs.push({
        turn: gameState.instance.currentTurn,
        phase: "exploration",
        message: `System ${systemId} explored`,
        visibility: "public",
      });
    }

    return { deltas, logs };
  }

  /**
   * Phase — Combat / Attaque
   */
  private runCombat(
    gameState: GameState
  ): { deltas: Delta[]; logs: LogEntry[] } {
    const deltas: Delta[] = [];
    const logs: LogEntry[] = [];

    for (const i of gameState.intentions.filter(
      (i) => i.type === "attack_system"
    )) {
      const { factionId, payload } = i;
      const { fleetId, targetSystemId } = payload as any;

      const attackerFleet = gameState.fleets.find(
        (f) => f.fleetId === fleetId && f.ownerFactionId === factionId
      );
      if (!attackerFleet) continue;

      const system = gameState.systems.find(
        (s) => s.systemId === targetSystemId
      );
      if (!system || !system.ownerFactionId) continue;

      const defendingFactionId = system.ownerFactionId;
      const defenderFleet = gameState.fleets.find(
        (f) =>
          f.ownerFactionId === defendingFactionId &&
          f.locationSystemId === system.systemId
      );

      const attackStrength = attackerFleet.strength;
      const defenseStrength = defenderFleet?.strength ?? 0;

      const attackerWins = attackStrength > defenseStrength;

      if (attackerWins) {
        deltas.push({
          type: "control",
          systemId: system.systemId,
          previousOwnerFactionId: defendingFactionId,
          newOwnerFactionId: factionId,
        });

        if (defenderFleet) {
          deltas.push({ type: "fleet_destroyed", fleetId: defenderFleet.fleetId });
        }

        logs.push({
          turn: gameState.instance.currentTurn,
          phase: "combat",
          message: `Attack succeeded on ${system.systemId}`,
          visibility: "public",
        });
      } else {
        deltas.push({ type: "fleet_destroyed", fleetId: attackerFleet.fleetId });

        logs.push({
          turn: gameState.instance.currentTurn,
          phase: "combat",
          message: `Attack failed on ${system.systemId}`,
          visibility: "public",
        });
      }
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
    const allLogs: LogEntry[] = [];
    const allDeltas: Delta[] = [];

    this.preChecks(gameState);

    const validated = this.validateIntentions(gameState, intentions);
    gameState.intentions = validated.valid;
    allLogs.push(...validated.logs);

    const exploration = this.runExploration(gameState);
    allLogs.push(...exploration.logs);
    allDeltas.push(...exploration.deltas);

    const combat = this.runCombat(gameState);
    allLogs.push(...combat.logs);
    allDeltas.push(...combat.deltas);

    const economy = this.runEconomy(gameState);
    allLogs.push(...economy.logs);
    allDeltas.push(...economy.deltas);

    const updatedGameState = DeltaApplier.apply(gameState, allDeltas);

    return {
      deltas: allDeltas,
      logs: allLogs,
      nextGameState: updatedGameState,
    };
  }
}
