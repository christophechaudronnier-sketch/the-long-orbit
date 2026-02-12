import type { GameState } from "../../../../engine/types/GameState";

interface GameHeaderProps {
  gameState: GameState;
}

export function GameHeader({ gameState }: GameHeaderProps) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <h1>The Long Orbit</h1>

      <div style={{ marginTop: "1rem" }}>
        <strong>Tour :</strong> {gameState.instance.currentTurn}
      </div>

      <div>
        <strong>Status :</strong> {gameState.instance.status}
      </div>
    </div>
  );
}
