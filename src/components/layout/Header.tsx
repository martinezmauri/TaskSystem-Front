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
    </header>
  );
}
