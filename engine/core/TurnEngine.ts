/**
 * Phase 2 — Validation des intentions
 */
private validateIntentions(
  gameState: GameState,
  intentions: Intention[]
): { valid: Intention[]; logs: LogEntry[] } {
  const logs: LogEntry[] = [];
  const valid: Intention[] = [];

  // 1️⃣ Vérifications de base
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

  // 2️⃣ Application de la règle "1 action majeure par tour"
  const majorActions = valid.filter(
    (i) =>
      i.type === "build_mine" ||
      i.type === "move_fleet" ||
      i.type === "attack_system"
  );

  if (majorActions.length > 1) {
    logs.push({
      turn: gameState.instance.currentTurn,
      phase: "intentions",
      message: "Only one major action is allowed per turn",
      visibility: "public",
    });

    // On invalide toutes les actions majeures
    const filtered = valid.filter(
      (i) =>
        i.type !== "build_mine" &&
        i.type !== "move_fleet" &&
        i.type !== "attack_system"
    );

    return { valid: filtered, logs };
  }

  // 3️⃣ Validation spécifique build_mine
  for (const intention of valid) {
    if (intention.type === "build_mine") {
      const payload = intention.payload as any;

      if (!payload?.systemId) {
        logs.push({
          turn: gameState.instance.currentTurn,
          phase: "intentions",
          message: "Invalid build_mine intention: missing systemId",
          visibility: "faction",
          factionId: intention.factionId,
        });

        continue;
      }
    }
  }

  return { valid, logs };
}
