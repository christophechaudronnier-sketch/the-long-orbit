import { useState } from "react";

import type { GameState, IntentionState } from "@engine/types/GameState";
import { TurnEngine } from "@engine/core/TurnEngine";
import { createInitialGameState } from "@engine/core/GameStateFactory";

import { GameLayout } from "./components/layout/GameLayout";
import { GameHeader } from "./components/game/GameHeader";
import { ControlPanel } from "./components/game/ControlPanel";
import { LogsPanel } from "./components/game/LogsPanel";

function App() {
  const [gameState, setGameState] = useState<GameState>(
    createInitialGameState()
  );

  const [logs, setLogs] = useState<
    { turn: number; phase: string; message: string }[]
  >([]);

  const handleResolveTurn = () => {
    const engine = new TurnEngine();

    const intentions: IntentionState[] = [
      {
        turn: gameState.instance.currentTurn,
        factionId: "f1",
        type: "explore_system",
        payload: {
          targetSystemId: "s1",
        },
      },
    ];

    const result = engine.executeTurn(gameState, intentions);

    setGameState(result.nextGameState);
    setLogs(result.logs);
  };

  return (
    <GameLayout>
      <GameHeader gameState={gameState} />

      <ControlPanel onResolveTurn={handleResolveTurn} />

      <h3>Systems</h3>
      <ul>
        {gameState.systems.map((s) => (
          <li key={s.systemId}>
            {s.systemId} — Owner: {s.ownerFactionId ?? "Neutral"}
          </li>
        ))}
      </ul>

      <LogsPanel logs={logs} />
    </GameLayout>
  );
}

export default App;
