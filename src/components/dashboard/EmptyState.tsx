"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProject } from "@/contexts/ProjectContext";

export function EmptyState() {
  const { setIsDialogOpen } = useProject();

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center px-4">
      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-full p-6 mb-6 inline-flex">
        <div className="bg-slate-100 dark:bg-slate-800 rounded-full p-4">
          <BookIcon className="w-12 h-12 text-slate-400 dark:text-slate-500" />
        </div>
      </div>
      <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-slate-100 mb-2">
        No Project Selected
      </h2>
      <p className="text-slate-500 max-w-sm mb-8 font-sans">
        Select a project from the sidebar or create a new one to start managing tasks
      </p>
      <Button 
        onClick={() => setIsDialogOpen(true)}
        className="bg-gradient-to-br from-primary-container to-primary text-primary-foreground px-6 py-6 rounded-lg font-bold shadow-lg flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all"
      >
        <Plus className="w-5 h-5" />
        Create New Project
      </Button>
    </div>
  );
}

// Simple BookIcon wrapper since we might want a specific layout, or we can use Book from lucide-react. 
function BookIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
