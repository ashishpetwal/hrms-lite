"use client";

import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { StoreProvider } from "@/lib/store";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="pl-64">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
    </StoreProvider>
  );
}
