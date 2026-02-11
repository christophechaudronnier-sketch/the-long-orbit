import { useState } from "react";
import "./App.css";

// Import moteur
import { TurnEngine } from "../../engine/core/TurnEngine";
import type { GameState } from "../../engine/types/GameState";

// GameState initial minimal compatible moteur
const initialGameState: GameState = {
  instance: {
    instanceId: "instance-1",
    status: "active",
    currentTurn: 1,
    maxTurns: 80,
    seed: 123,
    createdAt: new Date().toISOString(),
    lastTurnAt: new Date().toISOString(),
  },
  factions: [],
  systems: [],
  resources: [],
  technologies: [],
  fleets: [],
  intentions: [],
  logs: [],
};

function App() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const handleResolveTurn = () => {
    const engine = new TurnEngine();

    // Ton moteur attend (gameState, intentions)
    const result = engine.executeTurn(gameState, []);

    // Le moteur retourne un objet avec nextGameState
    setGameState(result.nextGameState);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>The Long Orbit</h1>

      <button onClick={handleResolveTurn}>
        Résoudre le tour
      </button>

      <h2>GameState</h2>
      <pre>{JSON.stringify(gameState, null, 2)}</pre>
    </div>
  );
}

export default App;
