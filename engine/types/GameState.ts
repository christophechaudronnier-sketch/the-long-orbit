/**
 * GameState
 * ----------
 * Représente l’état global d’une instance de jeu à un instant donné.
 * Ce fichier ne contient AUCUNE logique métier.
 */

export interface GameState {
  instance: InstanceState;
  factions: FactionState[];
  systems: SystemState[];
  resources: ResourceState[];
  technologies: TechnologyState[];
  fleets: FleetState[];
  intentions: IntentionState[];
  logs: LogState[];
}

/* ===== Instance ===== */

export interface InstanceState {
  instanceId: string;
  status: 'active' | 'paused' | 'finished';
  currentTurn: number;
  maxTurns: number;
  seed: number;
  createdAt: string;
  lastTurnAt: string;
}

/* ===== Factions ===== */

export interface FactionState {
  factionId: string;
  type: 'human' | 'ai';
  status: 'active' | 'inactive' | 'eliminated';
  playerId?: string;
  controlledSystems: string[];
  createdAt: string;
}

/* ===== Systems ===== */

export interface SystemState {
  systemId: string;
  ownerFactionId?: string;
  position: unknown;
  structures: unknown[];
  connectedSystems: string[];
}

/* ===== Resources ===== */

export interface ResourceState {
  factionId: string;
  resources: Record<string, number>;
}

/* ===== Technologies ===== */

export interface TechnologyState {
  factionId: string;
  technologies: {
    techId: string;
    level: number;
    progress: number;
  }[];
}

/* ===== Fleets ===== */

export interface FleetState {
  fleetId: string;
  ownerFactionId: string;
  locationSystemId: string;
  strength: number;
  status: 'idle' | 'moving' | 'destroyed';
}

/* ===== Intentions ===== */

export interface IntentionState {
  turn: number;
  factionId: string;
  type: string;
  payload: unknown;
}

/* ===== Logs ===== */

export interface LogState {
  turn: number;
  entries: unknown[];
  visibility: 'public' | 'faction';
}
