/**
 * Intention (type)
 * ----------------
 * Représente une intention envoyée par une faction pour un tour donné.
 * Une intention exprime un objectif, jamais une action directe.
 */

export interface Intention {
  turn: number;
  factionId: string;
  type: string;
  payload: unknown;
}

/**
 * Construire une mine
 */
export interface BuildMineIntention extends Intention {
  type: "build_mine";
  payload: {
    systemId: string;
  };
}

/**
 * Explorer un système neutre
 */
export interface ExploreSystemIntention extends Intention {
  type: "explore_system";
  payload: {
    fleetId: string;
    targetSystemId: string;
  };
}

/**
 * Attaquer un système ennemi
 */
export interface AttackSystemIntention extends Intention {
  type: "attack_system";
  payload: {
    fleetId: string;
    targetSystemId: string;
  };
}
