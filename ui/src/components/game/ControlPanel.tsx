interface ControlPanelProps {
  onResolveTurn: () => void;
}

export function ControlPanel({ onResolveTurn }: ControlPanelProps) {
  return (
    <div style={{ marginBottom: "2rem" }}>
      <button onClick={onResolveTurn}>
        Résoudre le tour
      </button>
    </div>
  );
}
