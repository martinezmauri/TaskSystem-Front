"use client";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { EmptyState } from "../dashboard/EmptyState";
import { ProjectProvider, useProject } from "@/contexts/ProjectContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

function DashboardInner({ children }: DashboardLayoutProps) {
  const { selectedProject } = useProject();

  return (
    <div className="bg-background text-foreground min-h-screen flex font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full">
          {selectedProject === null ? <EmptyState /> : children}
        </main>
      </div>
    </div>
  );
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ProjectProvider>
      <DashboardInner>{children}</DashboardInner>
    </ProjectProvider>
  );
}
