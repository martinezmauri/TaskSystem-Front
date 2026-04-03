"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskEmptyStateProps {
  onCreateTask: () => void;
}

export function TaskEmptyState({ onCreateTask }: TaskEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full bg-[#171f33] rounded-xl border border-slate-800/50 min-h-[450px]">
      <div className="bg-[#1f2937]/50 rounded-xl p-4 mb-6 ring-1 ring-slate-800">
        <ClipboardWarningIcon className="w-8 h-8 text-slate-400" />
      </div>
      
      <h3 className="text-xl font-bold text-slate-100 mb-3 font-display tracking-tight">
        This project has no tasks yet.
      </h3>
      
      <p className="text-slate-400 text-center max-w-[380px] mb-8 text-sm leading-relaxed">
        Create a root task to establish the initial project architecture. 
        Once the first task is created, you'll be able to build a deeper hierarchy by adding subtasks.
      </p>

      <div className="flex items-center gap-4">
        <Button 
          onClick={onCreateTask}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-5 rounded-lg shadow-sm"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Task
        </Button>
      </div>

      <div className="flex items-center gap-8 mt-16 text-[10px] font-mono tracking-widest text-slate-600 uppercase">
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
          ZERO OBJECTS FOUND
        </span>
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
          READY FOR SEQUENCE 001
        </span>
      </div>
    </div>
  );
}

function ClipboardWarningIcon(props: React.ComponentProps<"svg">) {
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
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="M12 9v4" />
      <circle cx="12" cy="16" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
