"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useProject } from "@/contexts/ProjectContext";
import { api } from "@/lib/api";
import { TaskEmptyState } from "./TaskEmptyState";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { TaskItem } from "./TaskItem";

export function ProjectDashboard() {
  const { selectedProject } = useProject();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [activeParentId, setActiveParentId] = useState<string | null>(null);

  const fetchTasks = async () => {
    if (!selectedProject) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/tasks/project/${selectedProject.id}/tree`);
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks for project", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedProject]);

  const handleOpenCreateTask = (parentId: string | null = null) => {
    setActiveParentId(parentId);
    setIsCreateTaskOpen(true);
  };

  if (!selectedProject) return null;

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-2">
            <span className="bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-400">ACTIVE PROJECT</span>
            <span>ID: {selectedProject.id?.split('-')[0].toUpperCase() || "PRJ-992-ALPHA"}</span>
          </div>
          <h2 className="text-4xl font-display font-black tracking-tight text-slate-900 dark:text-slate-100">
            {selectedProject.name}
          </h2>
        </div>
        
        <div className="flex flex-col items-end gap-3">
          <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase flex flex-col items-end">
            <span className="opacity-70">Last Sync</span>
            <span className="text-slate-400">
              {format(new Date(selectedProject.updatedAt || new Date()), 'yyyy-MM-dd HH:mm:ss')}
            </span>
          </div>
          {tasks.length > 0 && (
            <Button 
              onClick={() => handleOpenCreateTask()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-sm rounded-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0 bg-transparent">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full" />
          </div>
        ) : tasks.length === 0 ? (
          <TaskEmptyState onCreateTask={() => handleOpenCreateTask()} />
        ) : (
          <div className="bg-transparent flex-1 pt-4 pb-20">
            <div className="flex flex-col gap-2">
              {tasks.map(task => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onAddSubtask={handleOpenCreateTask} 
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <CreateTaskDialog 
        open={isCreateTaskOpen}
        onOpenChange={setIsCreateTaskOpen}
        onTaskCreated={fetchTasks}
        parentId={activeParentId}
      />
    </div>
  );
}
