/**
 * Delta (type)
 * ------------
 * Représente une modification proposée du GameState.
 * Les deltas sont calculés par les modules et appliqués
 * exclusivement par le Turn Engine.
 */

export interface Delta {
  /**
   * Type du delta (ex: resource, movement, combat, control)
   */
  type: string;
}
