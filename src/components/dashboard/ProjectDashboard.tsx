"use client";

import { useEffect, useState, useMemo } from "react";
import { Plus, Search, Settings, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useProject } from "@/contexts/ProjectContext";
import { api } from "@/lib/api";
import { TaskEmptyState } from "./TaskEmptyState";
import { CreateTaskDialog } from "./CreateTaskDialog";
import { TaskItem } from "./TaskItem";
import { TaskDetailSheet } from "./TaskDetailSheet";

// ─── Recursive helpers ───────────────────────────────────────────────────────

interface EffortStats {
  todo: number;
  inProgress: number;
  done: number;
  total: number;
}

function computeEffortStats(tasks: any[]): EffortStats {
  let todo = 0, inProgress = 0, done = 0;
  function traverse(node: any) {
    const e = Number(node.effort) || 0;
    if (node.status === "DONE") done += e;
    else if (node.status === "IN_PROGRESS") inProgress += e;
    else todo += e;
    if (node.children?.length) node.children.forEach(traverse);
  }
  tasks.forEach(traverse);
  return { todo, inProgress, done, total: todo + inProgress + done };
}

function nodeMatchesSearch(node: any, query: string, status: string, priority: string): boolean {
  const q = query.toLowerCase();
  const selfMatch =
    (!q || node.title?.toLowerCase().includes(q) || node.projectKey?.toLowerCase().includes(q)) &&
    (!status || node.status === status) &&
    (!priority || node.priority === priority);
  const childrenMatch = node.children?.some((c: any) => nodeMatchesSearch(c, query, status, priority));
  return selfMatch || !!childrenMatch;
}

function filterTree(tasks: any[], query: string, status: string, priority: string): any[] {
  if (!query && !status && !priority) return tasks;
  return tasks
    .filter((t) => nodeMatchesSearch(t, query, status, priority))
    .map((t) => ({ ...t, children: filterTree(t.children ?? [], query, status, priority) }));
}

// ─── GlobalEffortWidget ───────────────────────────────────────────────────────

function GlobalEffortWidget({ tasks }: { tasks: any[] }) {
  const stats = useMemo(() => computeEffortStats(tasks), [tasks]);
  if (stats.total === 0) return null;

  const donePercent = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
  const inProgressPercent = stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0;
  const fmt = (n: number) => (Number.isInteger(n) ? n.toString() : n.toFixed(1));

  return (
    <div className="mb-6 px-4 py-3 rounded-xl bg-[#171f33] flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono uppercase text-slate-500 tracking-widest font-semibold">Total Effort</span>
        <span className="text-lg font-mono font-light text-slate-200">{fmt(stats.total)}h</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden flex">
        <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${donePercent}%` }} />
        <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${inProgressPercent}%` }} />
      </div>
      <div className="flex items-center gap-5 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-slate-600 inline-block" />
          <span className="text-[10px] font-mono text-slate-500 uppercase">TODO</span>
          <span className="text-[11px] font-mono text-slate-300 font-medium">{fmt(stats.todo)}h</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
          <span className="text-[10px] font-mono text-slate-500 uppercase">In Progress</span>
          <span className="text-[11px] font-mono text-slate-300 font-medium">{fmt(stats.inProgress)}h</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          <span className="text-[10px] font-mono text-slate-500 uppercase">Done</span>
          <span className="text-[11px] font-mono text-slate-300 font-medium">{fmt(stats.done)}h</span>
        </div>
      </div>
    </div>
  );
}

// ─── ProjectSettingsDialog ────────────────────────────────────────────────────

interface ProjectSettingsProps {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  project: any;
  onProjectUpdated: () => void;
  onProjectDeleted: () => void;
}

function ProjectSettingsDialog({ open, onOpenChange, project, onProjectUpdated, onProjectDeleted }: ProjectSettingsProps) {
  const [name, setName] = useState(project?.name || "");
  const [status, setStatus] = useState<boolean>(project?.status ?? true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (project) { setName(project.name || ""); setStatus(project.status ?? true); }
  }, [project]);

  const hasChanges = name !== project?.name || status !== project?.status;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.patch(`/projects/${project.id}`, { name, status });
      onProjectUpdated();
      onOpenChange(false);
    } catch (e) {
      console.error("Failed to update project", e);
    } finally { setIsSaving(false); }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/projects/${project.id}`);
      onProjectDeleted();
      onOpenChange(false);
    } catch (e) {
      console.error("Failed to delete project", e);
    } finally { setIsDeleting(false); }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#171f33] border-slate-800 text-slate-100 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-display font-bold">Project Settings</DialogTitle>
          <DialogDescription className="text-slate-500 text-sm">
            Update your project details or manage its lifecycle.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 mt-2">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono uppercase text-slate-500 font-semibold tracking-wider">
              Project Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-900/50 border-white/5 text-slate-200 focus-visible:ring-1 focus-visible:ring-blue-500"
              placeholder="My Awesome Project"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono uppercase text-slate-500 font-semibold tracking-wider">
              Status
            </label>
            <div className="relative flex items-center self-start">
              <select
                value={status ? "active" : "inactive"}
                onChange={(e) => setStatus(e.target.value === "active")}
                className="appearance-none font-mono text-xs uppercase pl-3 pr-7 py-1.5 rounded cursor-pointer font-bold tracking-wider outline-none border border-white/5 bg-slate-900/50 text-slate-300 focus:ring-1 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <svg className="w-3 h-3 text-slate-500 absolute right-2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>

          {/* Save */}
          <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
            {/* Delete */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-500/10 font-medium h-9 px-4">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Project
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-[#171f33] border-slate-800 text-slate-100">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Project</AlertDialogTitle>
                  <AlertDialogDescription className="text-slate-400">
                    Are you sure? This will permanently delete the project and <strong>all its tasks</strong> in cascade. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800">Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-red-500 hover:bg-red-600 text-white">
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              onClick={handleSave}
              disabled={isSaving || !hasChanges || !name.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 h-9"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── ProjectDashboard ─────────────────────────────────────────────────────────

export function ProjectDashboard() {
  const { selectedProject, setSelectedProject, fetchProjects } = useProject();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [activeParentId, setActiveParentId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

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

  // refreshData: single source of truth for reactive updates
  const refreshData = () => {
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
    setSearchQuery("");
    setFilterStatus("");
    setFilterPriority("");
  }, [selectedProject]);

  const filteredTasks = useMemo(
    () => filterTree(tasks, searchQuery, filterStatus, filterPriority),
    [tasks, searchQuery, filterStatus, filterPriority]
  );

  const handleOpenCreateTask = (parentId: string | null = null) => {
    setActiveParentId(parentId);
    setIsCreateTaskOpen(true);
  };

  const handleProjectUpdated = async () => {
    await fetchProjects();
    // Re-fetch updated project from the server and sync selectedProject
    try {
      const { data } = await api.get(`/projects/${selectedProject.id}`);
      setSelectedProject(data);
    } catch (e) { /* ignore */ }
  };

  const handleProjectDeleted = async () => {
    await fetchProjects();
    setSelectedProject(null);
  };

  if (!selectedProject) return null;

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-2">
              <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-400">ACTIVE PROJECT</span>
              <span>ID: {selectedProject.id?.split("-")[0].toUpperCase()}</span>
              {!selectedProject.status && (
                <span className="bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded font-bold">INACTIVE</span>
              )}
            </div>
            <h2 className="text-4xl font-display font-black tracking-tight text-slate-100">
              {selectedProject.name}
            </h2>
          </div>
          {/* Settings gear */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="self-end mb-1 p-1.5 text-slate-600 hover:text-slate-300 hover:bg-white/5 rounded transition-colors"
            aria-label="Project Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase flex flex-col items-end">
            <span className="opacity-70">Last Sync</span>
            <span className="text-slate-400">
              {format(new Date(selectedProject.updatedAt || new Date()), "yyyy-MM-dd HH:mm:ss")}
            </span>
          </div>
          {tasks.length > 0 && (
            <Button onClick={() => handleOpenCreateTask()} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-sm rounded-lg">
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Button>
          )}
        </div>
      </div>

      {/* Global Effort Widget */}
      {!loading && tasks.length > 0 && <GlobalEffortWidget tasks={tasks} />}

      {/* Search & Filters */}
      {!loading && tasks.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 bg-[#171f33] border-white/5 text-slate-200 placeholder:text-slate-600 text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
            />
          </div>
          <div className="relative flex items-center">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="appearance-none h-8 bg-[#171f33] border border-white/5 text-slate-300 text-[11px] font-mono uppercase pl-3 pr-7 rounded cursor-pointer outline-none focus:ring-1 focus:ring-blue-500 tracking-wider"
            >
              <option value="">All Status</option>
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
            <svg className="w-3 h-3 text-slate-500 absolute right-2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </div>
          <div className="relative flex items-center">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="appearance-none h-8 bg-[#171f33] border border-white/5 text-slate-300 text-[11px] font-mono uppercase pl-3 pr-7 rounded cursor-pointer outline-none focus:ring-1 focus:ring-blue-500 tracking-wider"
            >
              <option value="">All Priority</option>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>
            <svg className="w-3 h-3 text-slate-500 absolute right-2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </div>
          {(searchQuery || filterStatus || filterPriority) && (
            <button
              onClick={() => { setSearchQuery(""); setFilterStatus(""); setFilterPriority(""); }}
              className="h-8 px-3 text-[11px] font-mono text-slate-500 hover:text-slate-300 transition-colors rounded hover:bg-white/5"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Task List */}
      <div className="flex-1 flex flex-col min-h-0 bg-transparent">
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-slate-700 border-t-blue-500 rounded-full" />
          </div>
        ) : tasks.length === 0 ? (
          <TaskEmptyState onCreateTask={() => handleOpenCreateTask()} />
        ) : filteredTasks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-16">
            <Search className="w-8 h-8 text-slate-600" />
            <p className="text-slate-400 font-medium">No tasks match your filters</p>
            <p className="text-slate-600 text-sm font-mono">Try adjusting your search or clearing the filters</p>
          </div>
        ) : (
          <div className="bg-transparent flex-1 pt-2 pb-20">
            <div className="flex flex-col gap-2">
              {filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onAddSubtask={handleOpenCreateTask}
                  onSelectTask={setSelectedTask}
                  onTaskDeleted={refreshData}
                  onTaskUpdated={refreshData}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <CreateTaskDialog
        open={isCreateTaskOpen}
        onOpenChange={setIsCreateTaskOpen}
        onTaskCreated={refreshData}
        parentId={activeParentId}
      />

      <TaskDetailSheet
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onTaskUpdated={refreshData}
      />

      <ProjectSettingsDialog
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
        project={selectedProject}
        onProjectUpdated={handleProjectUpdated}
        onProjectDeleted={handleProjectDeleted}
      />
    </div>
  );
}
