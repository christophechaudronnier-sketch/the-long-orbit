import type {
  GameState,
  FactionState,
  SystemState,
  ResourceState,
  TechnologyState,
  FleetState,
} from "../types/GameState";

export function createInitialGameState(): GameState {
  const now = new Date().toISOString();

  const faction: FactionState = {
    factionId: "f1",
    type: "human",
    status: "active",
    controlledSystems: [],
    createdAt: now,
  };

  const system: SystemState = {
    systemId: "s1",
    ownerFactionId: undefined,
    position: { x: 0, y: 0 },
    structures: [],
    connectedSystems: [],
  };

  const resources: ResourceState = {
    factionId: "f1",
    resources: {
      credits: 100,
      minerals: 50,
    },
  };

  const technologies: TechnologyState = {
    factionId: "f1",
    technologies: [],
  };

  const fleet: FleetState = {
    fleetId: "fleet-1",
    ownerFactionId: "f1",
    locationSystemId: "s1",
    strength: 10,
    status: "idle",
  };

  return {
    instance: {
      instanceId: "instance-1",
      status: "active",
      currentTurn: 1,
      maxTurns: 80,
      seed: 123,
      createdAt: now,
      lastTurnAt: now,
    },
    factions: [faction],
    systems: [system],
    resources: [resources],
    technologies: [technologies],
    fleets: [fleet],
    intentions: [],
    logs: [],
  };
}
