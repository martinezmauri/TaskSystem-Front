import { ChevronDown, PlusSquare, Edit, Trash2, CheckCircle2, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function TaskItemMock() {
  return (
    <div className="space-y-4">
      {/* Parent Task: Authentication Rewrite */}
      <div className="group">
        <div className="bg-white dark:bg-surface-container p-5 rounded-xl flex items-center justify-between gap-4 shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-surface-container-highest">
          <div className="flex items-center gap-4 flex-1">
            <button className="text-outline-variant hover:text-primary transition-colors">
              <ChevronDown className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <span className="text-xs font-mono text-outline-variant font-bold tracking-widest mb-1">
                TASK-1024
              </span>
              <h3 className="font-display font-bold text-lg text-foreground">
                Authentication Rewrite
              </h3>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Badge variant="secondary" className="text-[10px] uppercase tracking-widest bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">
                IN_PROGRESS
              </Badge>
              <Badge variant="default" className="text-[10px] uppercase tracking-widest bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                HIGH
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                EFFORT
              </span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="bg-primary h-full" style={{ width: "40%" }}></div>
                </div>
                <span className="text-xs font-mono font-bold text-foreground">8/20h</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 rounded-md">
                <PlusSquare className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 rounded-md">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-destructive rounded-md">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Subtasks Level 1 */}
        <div className="ml-10 mt-4 space-y-4 relative">
          {/* Connecting Line */}
          <div className="absolute left-[-1.5rem] top-[-1rem] bottom-[1.5rem] w-4 border-l-2 border-b-2 border-outline-variant/20 rounded-bl-xl"></div>
          
          {/* Subtask 1: JWT Implementation */}
          <div className="bg-slate-50 dark:bg-surface-container/50 p-4 rounded-xl flex items-center justify-between gap-4 group/sub relative z-10">
            <div className="flex items-center gap-4 flex-1">
              <CheckCircle2 className="text-emerald-500 w-5 h-5" />
              <div className="flex flex-col">
                <h4 className="font-semibold text-foreground">JWT Implementation</h4>
                <span className="text-[10px] font-mono text-outline-variant">TASK-1025</span>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Badge variant="outline" className="text-[9px] uppercase">DONE</Badge>
                <Badge variant="outline" className="text-[9px] uppercase">HIGH</Badge>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-xs font-mono font-bold text-slate-500">8/8h</span>
              <div className="flex items-center gap-1 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 rounded-md">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-destructive rounded-md">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Subtask 2: OAuth2 Provider Integration */}
          <div className="group/parent-sub relative z-10">
            <div className="bg-slate-50 dark:bg-surface-container/50 p-4 rounded-xl flex items-center justify-between gap-4 group/sub hover:bg-slate-100 dark:hover:bg-surface-container-highest transition-colors">
              <div className="flex items-center gap-4 flex-1">
                <button className="text-outline-variant">
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="flex flex-col">
                  <h4 className="font-semibold text-foreground">OAuth2 Provider Integration</h4>
                  <span className="text-[10px] font-mono text-outline-variant">TASK-1026</span>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge variant="secondary" className="text-[9px] uppercase text-slate-500">TODO</Badge>
                  <Badge variant="secondary" className="text-[9px] uppercase text-blue-500">MEDIUM</Badge>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-xs font-mono font-bold text-slate-500">0/12h</span>
                <div className="flex items-center gap-1 opacity-0 group-hover/sub:opacity-100 transition-opacity">
                  <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 rounded-md">
                    <PlusSquare className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 rounded-md">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Nested Subtasks Level 2 */}
            <div className="ml-10 mt-4 space-y-3 relative">
              {/* Connecting Line L2 */}
              <div className="absolute left-[-1.5rem] top-[-1rem] bottom-[1.2rem] w-4 border-l-2 border-b-2 border-outline-variant/20 rounded-bl-xl"></div>
              
              {/* Nested Subtask 2.1: Google Auth */}
              <div className="bg-white dark:bg-surface p-3 rounded-lg flex items-center justify-between gap-4 border-l-4 border-outline-variant/30 group/leaf relative z-10">
                <div className="flex items-center gap-3">
                  <Circle className="text-slate-400 w-4 h-4" />
                  <h5 className="text-sm font-medium text-foreground">Google Auth</h5>
                  <Badge variant="outline" className="text-[8px] uppercase ml-2 text-slate-500">TODO</Badge>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-slate-500">6h</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover/leaf:opacity-100 transition-opacity">
                    <button className="p-1 hover:text-primary text-slate-400">
                      <Edit className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Nested Subtask 2.2: GitHub Auth */}
              <div className="bg-white dark:bg-surface p-3 rounded-lg flex items-center justify-between gap-4 border-l-4 border-outline-variant/30 group/leaf relative z-10">
                <div className="flex items-center gap-3">
                  <Circle className="text-slate-400 w-4 h-4" />
                  <h5 className="text-sm font-medium text-foreground">GitHub Auth</h5>
                  <Badge variant="outline" className="text-[8px] uppercase ml-2 text-slate-500">TODO</Badge>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-slate-500">6h</span>
                  <div className="flex items-center gap-1 opacity-0 group-hover/leaf:opacity-100 transition-opacity">
                    <button className="p-1 hover:text-primary text-slate-400">
                      <Edit className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
