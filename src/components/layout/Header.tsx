import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="flex justify-between items-center px-6 w-full sticky top-0 z-50 bg-slate-50 dark:bg-slate-900 h-16 border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="flex items-center gap-4">
        <span className="text-xl font-bold text-slate-900 dark:text-slate-50 font-display tracking-tight">
          DevTask Manager
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            className="pl-9 pr-4 py-1.5 w-64 rounded-full bg-white dark:bg-slate-800"
            placeholder="Search tasks..."
            type="text"
          />
        </div>
      </div>
    </header>
  );
}
