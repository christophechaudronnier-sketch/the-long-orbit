interface LogsPanelProps {
  logs: {
    turn: number;
    phase: string;
    message: string;
  }[];
}

export function LogsPanel({ logs }: LogsPanelProps) {
  return (
    <div>
      <h2>Logs</h2>

      {logs.length === 0 && <div>Aucun log pour ce tour.</div>}

      {logs.map((log, index) => (
        <div key={index} style={{ marginBottom: "0.5rem" }}>
          <strong>[{log.phase}]</strong> {log.message}
        </div>
      ))}
    </div>
  );
}
