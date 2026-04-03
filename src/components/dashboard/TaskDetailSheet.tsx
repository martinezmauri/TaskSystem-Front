"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Clock, Trash2, ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";

interface TaskDetailSheetProps {
  task: any | null;
  onClose: () => void;
  onTaskUpdated: () => void;
}

export function TaskDetailSheet({ task, onClose, onTaskUpdated }: TaskDetailSheetProps) {
  const [formData, setFormData] = useState({
    title: "",
    status: "TODO",
    priority: "LOW",
    effort: 0,
    description: "",
  });
  const [effortAnalytics, setEffortAnalytics] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        status: task.status || "TODO",
        priority: task.priority || "LOW",
        effort: task.effort || 0,
        description: task.description || "",
      });
      fetchEffortAnalytics(task.id);
    }
  }, [task]);

  const fetchEffortAnalytics = async (taskId: string) => {
    try {
      const { data } = await api.get(`/tasks/${taskId}/effort-analytics`);
      setEffortAnalytics(data);
    } catch (error) {
      console.error("Failed to fetch effort analytics", error);
    }
  };

  const handleSaveChanges = async () => {
    if (!task) return;
    setIsSaving(true);
    try {
      // Calculate only what has changed, or just send the full form state
      await api.patch(`/tasks/${task.id}`, {
        title: formData.title,
        status: formData.status,
        priority: formData.priority,
        effort: Number(formData.effort),
        description: formData.description,
      });
      onTaskUpdated();
    } catch (error) {
      console.error("Failed to save task", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!task) return;
    setIsDeleting(true);
    try {
      await api.delete(`/tasks/${task.id}`);
      onTaskUpdated();
      onClose();
    } catch (error) {
      console.error("Failed to delete task", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const calculateProgress = () => {
    if (!effortAnalytics || effortAnalytics.totalEffort === 0 || !effortAnalytics.statusBreakdown) return 0;
    const doneEffort = effortAnalytics.statusBreakdown.find((b: any) => b.status === "DONE")?.effort || 0;
    return Math.round((doneEffort / effortAnalytics.totalEffort) * 100);
  };

  const hasChanges = task && (
    formData.title !== task.title ||
    formData.status !== task.status ||
    formData.priority !== task.priority ||
    Number(formData.effort) !== Number(task.effort) ||
    formData.description !== (task.description || "")
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DONE": return "bg-emerald-500/10 text-emerald-500 hover:border-emerald-500/50";
      case "IN_PROGRESS": return "bg-blue-500/10 text-blue-500 hover:border-blue-500/50";
      case "TODO": default: return "bg-slate-500/10 text-slate-400 hover:border-slate-500/50";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH": return "bg-red-500/10 text-red-500 hover:border-red-500/50";
      case "MEDIUM": return "bg-orange-500/10 text-orange-500 hover:border-orange-500/50";
      case "LOW": default: return "bg-slate-500/10 text-slate-400 hover:border-slate-500/50";
    }
  };

  if (!task) return null;

  const progress = calculateProgress();

  return (
    <Sheet open={!!task} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md bg-[#171f33] border-l border-white/5 text-slate-200 overflow-y-auto flex flex-col pt-12">
        <SheetHeader className="mb-6">
          <SheetTitle className="sr-only">Task Detail</SheetTitle>
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-2">
            <span>{task.projectKey}</span>
            <span>•</span>
            <span>{format(new Date(task.createdAt || new Date()), "MMM dd, yyyy")}</span>
          </div>
          <Input 
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="text-2xl font-display font-bold text-slate-100 bg-transparent border-transparent px-0 h-auto focus-visible:ring-0 focus-visible:border-white/20 transition-colors"
            placeholder="Task Title..."
          />
        </SheetHeader>

        <div className="flex flex-col gap-8 flex-1">
          {/* Properties */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5 align-start">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold tracking-wider">Status</span>
              <div className="relative inline-flex items-center self-start">
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className={`appearance-none font-mono text-xs uppercase pl-3 pr-7 py-1.5 rounded cursor-pointer font-bold tracking-wider outline-none border border-transparent transition-colors ${getStatusColor(formData.status)}`}
                >
                  <option value="TODO" className="bg-[#171f33] text-slate-300">TODO</option>
                  <option value="IN_PROGRESS" className="bg-[#171f33] text-blue-500">IN_PROGRESS</option>
                  <option value="DONE" className="bg-[#171f33] text-emerald-500">DONE</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 opacity-60 absolute right-2 pointer-events-none stroke-[3]" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 align-start">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold tracking-wider">Priority</span>
              <div className="relative inline-flex items-center self-start">
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className={`appearance-none font-mono text-xs uppercase pl-3 pr-7 py-1.5 rounded cursor-pointer font-bold tracking-wider outline-none border border-transparent transition-colors ${getPriorityColor(formData.priority)}`}
                >
                  <option value="LOW" className="bg-[#171f33] text-slate-400">LOW</option>
                  <option value="MEDIUM" className="bg-[#171f33] text-orange-500">MEDIUM</option>
                  <option value="HIGH" className="bg-[#171f33] text-red-500">HIGH</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 opacity-60 absolute right-2 pointer-events-none stroke-[3]" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 col-span-2 sm:col-span-1 mt-2 sm:mt-0">
              <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold tracking-wider">Base Effort (h)</span>
              <div className="relative flex items-center">
                <Clock className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
                <Input 
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.effort}
                  onChange={(e) => setFormData({ ...formData, effort: Number(e.target.value) })}
                  className="pl-9 h-8 bg-slate-900/50 border-white/5 text-slate-200 font-mono focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 max-w-[120px]"
                />
              </div>
            </div>
          </div>

          {/* Effort Analytics */}
          {effortAnalytics && effortAnalytics.totalEffort > 0 && (
            <div className="flex flex-col gap-3 bg-slate-900/50 p-4 rounded-lg border border-white/5">
               <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold tracking-wider flex items-center gap-2">
                 Effort Analytics (Tree)
               </span>
               <div className="flex items-end justify-between mb-1">
                 <span className="text-2xl font-light text-slate-300 font-mono">{effortAnalytics.totalEffort}h</span>
                 <span className="text-sm text-slate-500 font-mono">{progress}% DONE</span>
               </div>
               <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                 <div 
                   className="h-full bg-emerald-500 transition-all duration-500" 
                   style={{ width: `${progress}%` }} 
                 />
               </div>
               <div className="flex items-center justify-between mt-2">
                 {effortAnalytics.statusBreakdown?.map((breakdown: any) => (
                   <div key={breakdown.status} className="flex flex-col">
                     <span className="text-[9px] font-mono text-slate-500 uppercase">{breakdown.status}</span>
                     <span className="text-xs font-mono font-medium text-slate-400">{breakdown.effort}h</span>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {/* Description */}
          <div className="flex flex-col gap-2 flex-1">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold tracking-wider">Description</span>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add a more detailed description..."
              className="flex-1 min-h-[150px] font-mono text-sm bg-slate-900/50 border-white/5 text-slate-200 placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500 resize-none"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5 pb-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="text-red-500 hover:text-red-400 hover:bg-red-500/10 font-medium h-9 px-4">
                <Trash2 className="w-4 h-4 mr-2" />
                 Delete Task
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-[#171f33] border-slate-800 text-slate-100">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Task</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  Are you sure? This action cannot be undone. Deleting this task will also permanently delete all its subtasks.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-100">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteTask} disabled={isDeleting} className="bg-red-500 hover:bg-red-600 text-white">
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button 
            onClick={handleSaveChanges} 
            disabled={isSaving || !hasChanges}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 w-full sm:w-auto h-9"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
