import { Folder, ClipboardList, LineChart, Plus, Book, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col h-screen w-64 bg-slate-100 dark:bg-slate-950 border-r border-slate-200/50 dark:border-slate-800/50 font-sans text-sm font-medium p-4 sticky top-0">
      <div className="mb-8 px-2">
        <h1 className="text-lg font-black text-slate-900 dark:text-slate-100">
          Precision Architect
        </h1>
        <p className="text-xs text-slate-500">Developer Workspace</p>
      </div>
      <nav className="flex-1 space-y-1">
        <a
          className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900 transition-all duration-200 ease-in-out rounded-md"
          href="#"
        >
          <Folder className="w-5 h-5" />
          Projects
        </a>
        <a
          className="flex items-center gap-3 px-3 py-2 bg-white dark:bg-slate-800 text-primary dark:text-primary rounded-lg shadow-sm transition-all duration-200 ease-in-out"
          href="#"
        >
          <ClipboardList className="w-5 h-5" />
          My Tasks
        </a>
        <a
          className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900 transition-all duration-200 ease-in-out rounded-md"
          href="#"
        >
          <LineChart className="w-5 h-5" />
          Effort Analytics
        </a>
      </nav>
      <div className="mt-auto pt-4 space-y-1">
        <Button className="w-full mb-4 flex items-center justify-center gap-2 bg-gradient-to-br from-primary-container to-primary text-primary-foreground px-4 py-6 rounded-lg font-semibold shadow-sm hover:opacity-90 transition-all">
          <Plus className="w-5 h-5" />
          Create Task
        </Button>
        <a
          className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900 transition-all duration-200 ease-in-out rounded-md"
          href="#"
        >
          <Book className="w-5 h-5" />
          Documentation
        </a>
        <a
          className="flex items-center gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900 transition-all duration-200 ease-in-out rounded-md"
          href="#"
        >
          <HelpCircle className="w-5 h-5" />
          Support
        </a>
      </div>
    </aside>
  );
}
