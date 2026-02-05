/**
 * Intention (type)
 * ----------------
 * Représente une intention envoyée par une faction pour un tour donné.
 * Une intention exprime un objectif, jamais une action directe.
 */

export interface Intention {
  /**
   * Tour concerné par l’intention
   */
  turn: number;

  /**
   * Faction émettrice
   */
  factionId: string;

  /**
   * Type d’intention
   */
  type: string;

  /**
   * Données minimales nécessaires à la résolution
   */
  payload: unknown;
}

/**
 * Intention spécifique — Construire une mine
 */
export interface BuildMineIntention extends Intention {
  type: "build_mine";
  payload: {
    systemId: string;
  };
}

/**
 * Intention spécifique — Explorer un système neutre
 */
export interface ExploreSystemIntention extends Intention {
  type: "explore_system";
  payload: {
    fleetId: string;
    targetSystemId: string;
  };
}
