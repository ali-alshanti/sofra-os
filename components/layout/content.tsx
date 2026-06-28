import type { ReactNode } from "react";

interface ContentProps {
  children: ReactNode;
}

export function Content({ children }: ContentProps) {
  return (
    <main className="flex-1 overflow-y-auto p-6">
      {children}
    </main>
  );
}
