"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProject } from "@/contexts/ProjectContext";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskCreated: () => void;
  parentId?: string | null;
}

export function CreateTaskDialog({ open, onOpenChange, onTaskCreated, parentId = null }: CreateTaskDialogProps) {
  const { selectedProject } = useProject();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [effort, setEffort] = useState("0");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedProject) return;

    setLoading(true);
    try {
      await api.post("/tasks", {
        projectId: selectedProject.id,
        title,
        description,
        priority,
        effort: parseFloat(effort) || 0,
        ...(parentId && { parentId }),
      });
      
      onTaskCreated();
      onOpenChange(false);
      setTitle("");
      setDescription("");
      setPriority("MEDIUM");
      setEffort("0");
    } catch (error) {
      console.error("Error creating task", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#171f33] border-slate-800 text-slate-100 sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl tracking-tight">
            {parentId ? "Create Subtask" : "Create Root Task"}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {parentId ? "Add a new subtask to the selected task." : `Add a new main task to ${selectedProject?.name}.`}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 pt-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Implement authentication flow"
              required
              className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 h-11"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context and requirements..."
              className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 min-h-[100px] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Priority</label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-slate-100 h-11">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Effort (Points)</label>
              <Input
                type="number"
                min="0"
                step="0.5"
                value={effort}
                onChange={(e) => setEffort(e.target.value)}
                placeholder="0"
                className="bg-slate-800/50 border-slate-700 text-slate-100 placeholder:text-slate-500 h-11"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-slate-400 hover:text-slate-100 hover:bg-slate-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !title.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-8 font-bold"
            >
              {loading ? "Creating..." : "Save Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
