import type { ReactNode } from "react";

interface GameLayoutProps {
  children: ReactNode;
}

export function GameLayout({ children }: GameLayoutProps) {
  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "2rem 1rem",
      }}
    >
      {children}
    </div>
  );
}
