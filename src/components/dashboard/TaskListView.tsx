import { ChevronRight, PlusCircle, ArrowDownUp, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskItemMock } from "./TaskItemMock";

export function TaskListView() {
  return (
    <>
      {/* Breadcrumbs & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-2">
            <span>Global Projects</span>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-foreground font-semibold">Backend API Refactor</span>
          </nav>
          <h2 className="text-4xl font-display font-extrabold tracking-tight text-foreground">
            Precision Task Matrix
          </h2>
        </div>
        <Button className="bg-gradient-to-br from-primary-container to-primary text-primary-foreground px-6 py-6 rounded-lg font-bold shadow-lg flex items-center gap-2 active:scale-95 transition-transform hover:opacity-90">
          <PlusCircle className="w-5 h-5" />
          Create New Task
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-slate-50 dark:bg-surface-container/30 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-tighter text-outline-variant mr-2">
            Filter by:
          </span>
          <select className="bg-white dark:bg-surface border-none text-sm font-medium rounded-lg px-4 py-2 focus:ring-2 focus:ring-outline cursor-pointer text-foreground shadow-sm">
            <option>Status: All</option>
            <option>Status: Todo</option>
            <option>Status: In Progress</option>
            <option>Status: Done</option>
          </select>
          <select className="bg-white dark:bg-surface border-none text-sm font-medium rounded-lg px-4 py-2 focus:ring-2 focus:ring-outline cursor-pointer text-foreground shadow-sm">
            <option>Priority: All</option>
            <option>Priority: High</option>
            <option>Priority: Medium</option>
            <option>Priority: Low</option>
          </select>
        </div>
        
        <div className="hidden sm:block h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>
        
        <div className="flex items-center gap-2 ml-auto">
          <button className="p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors shadow-sm bg-white dark:bg-surface">
            <ArrowDownUp className="w-4 h-4" />
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md transition-colors shadow-sm bg-white dark:bg-surface">
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Task Tree Hierarchy */}
      <div className="space-y-4">
        <TaskItemMock />
      </div>
    </>
  );
}
