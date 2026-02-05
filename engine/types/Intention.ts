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
   * Type d’intention (ex: build_mine, move_fleet, attack_system)
   */
  type: string;

  /**
   * Données minimales nécessaires à la résolution
   * (aucun calcul, aucun résultat attendu)
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
