/**
 * Log (type)
 * ---------
 * Représente une entrée de log produite durant un tour.
 * Les logs n’ont AUCUN impact sur le gameplay.
 * Ils servent à l’historique, au debug et à l’UI.
 */

export interface LogEntry {
  /**
   * Tour auquel le log se rattache
   */
  turn: number;

  /**
   * Phase du tour concernée
   */
  phase:
    | 'prechecks'
    | 'intentions'
    | 'economy'
    | 'research'
    | 'movement'
    | 'combat'
    | 'events'
    | 'scoring'
    | 'logs'
    | 'closure';

  /**
   * Message lisible
   */
  message: string;

  /**
   * Visibilité du log
   */
  visibility: 'public' | 'faction';

  /**
   * Faction concernée (si visibilité faction)
   */
  factionId?: string;
}
