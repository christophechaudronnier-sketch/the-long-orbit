/**
 * Delta abstrait.
 * Les implémentations concrètes sont définies par les modules.
 */

export interface Delta {
  type: string;
  [key: string]: any;
}
