"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, Plus, Clock, Trash2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { api } from "@/lib/api";

interface TaskItemProps {
  task: any;
  depth?: number;
  onAddSubtask: (parentId: string) => void;
  onSelectTask: (task: any) => void;
  onTaskDeleted?: () => void;
  onTaskUpdated?: () => void;
}

export function TaskItem({
  task: initialTask,
  depth = 0,
  onAddSubtask,
  onSelectTask,
  onTaskDeleted,
  onTaskUpdated,
}: TaskItemProps) {
  const [task, setTask] = useState(initialTask);
  const hasChildren = task.children && task.children.length > 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-500/10 text-red-500";
      case "MEDIUM":
        return "bg-orange-500/10 text-orange-500";
      case "LOW":
        return "bg-slate-500/10 text-slate-400";
      default:
        return "bg-slate-500/10 text-slate-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DONE":
        return "bg-emerald-500/10 text-emerald-500";
      case "IN_PROGRESS":
        return "bg-blue-500/10 text-blue-500";
      case "TODO":
      default:
        return "bg-slate-500/10 text-slate-400";
    }
  };

  const handleUpdateTask = async (field: string, value: string) => {
    try {
      setTask((prev: any) => ({ ...prev, [field]: value }));
      await api.patch(`/tasks/${task.id}`, { [field]: value });
      if (onTaskUpdated) onTaskUpdated();
    } catch (error) {
      console.error("Failed to update task", error);
      setTask(initialTask); // Revert on failure
    }
  };

  const handleDeleteTask = async () => {
    try {
      await api.delete(`/tasks/${task.id}`);
      if (onTaskDeleted) onTaskDeleted();
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  };

  const TaskRowContent = () => (
    <div
      className="flex-1 flex items-center justify-between min-w-0 pr-4 cursor-pointer"
      onClick={() => onSelectTask(task)}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <span className="text-[10px] sm:text-xs font-mono text-slate-500 uppercase flex-shrink-0">
          {depth > 0 && <span className="text-slate-700 mr-1">↳</span>}
          {task.projectKey}
        </span>
        <span className="text-sm font-medium text-slate-200 truncate">
          {task.title}
        </span>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0 ml-4 hidden sm:flex h-full">
        {/* Status Native Select Badge */}
        <div className="relative flex items-center">
          <select
            value={task.status || "TODO"}
            onChange={(e) => handleUpdateTask("status", e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className={`appearance-none font-mono text-[10px] uppercase pl-2 pr-5 py-0.5 rounded cursor-pointer font-semibold tracking-wider outline-none border border-transparent hover:border-slate-600 transition-colors ${getStatusColor(task.status)} text-center`}
          >
            <option value="TODO" className="bg-[#171f33] text-slate-300">
              TODO
            </option>
            <option value="IN_PROGRESS" className="bg-[#171f33] text-blue-500">
              IN_PROGRESS
            </option>
            <option value="DONE" className="bg-[#171f33] text-emerald-500">
              DONE
            </option>
          </select>
          <ChevronDown className="w-3 h-3 opacity-50 absolute right-1 pointer-events-none text-slate-400" />
        </div>

        {/* Priority Native Select Badge */}
        <div className="relative flex items-center">
          <select
            value={task.priority || "LOW"}
            onChange={(e) => handleUpdateTask("priority", e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className={`appearance-none font-mono text-[10px] uppercase pl-2 pr-5 py-0.5 rounded cursor-pointer font-semibold tracking-wider outline-none border border-transparent hover:border-slate-600 transition-colors ${getPriorityColor(task.priority)} text-center`}
          >
            <option value="LOW" className="bg-[#171f33] text-slate-400">
              LOW
            </option>
            <option value="MEDIUM" className="bg-[#171f33] text-orange-500">
              MEDIUM
            </option>
            <option value="HIGH" className="bg-[#171f33] text-red-500">
              HIGH
            </option>
          </select>
          <ChevronDown className="w-3 h-3 opacity-50 absolute right-1 pointer-events-none text-slate-400" />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-500 w-16 justify-end">
          <Clock className="w-3 h-3 text-slate-500" />
          {task.effort || 0}h
        </div>

        {/* ADD SUBTASK ON HOVER INLINE */}
        <div
          role="button"
          tabIndex={0}
          className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-bold uppercase text-blue-500 hover:text-blue-400 bg-[#171f33] hover:bg-blue-500/10 px-2 py-1 rounded"
          onClick={(e) => {
            e.stopPropagation();
            onAddSubtask(task.id);
          }}
        >
          <Plus className="w-3 h-3" />
          Add Subtask
        </div>

        {/* DELETE TASK */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div
              role="button"
              tabIndex={0}
              className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center w-6 h-6 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded"
              onClick={(e) => e.stopPropagation()}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-[#171f33] border-slate-800 text-slate-100">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Task</AlertDialogTitle>
              <AlertDialogDescription className="text-slate-400">
                Are you sure? This action cannot be undone. Deleting this task
                will also permanently delete all its subtasks.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={(e) => e.stopPropagation()}
                className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-slate-100"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTask();
                }}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );

  if (!hasChildren) {
    return (
      <div className="group border-b border-white/5 bg-[#1a2235] hover:bg-[#1e293b] transition-colors">
        <div
          className="flex items-center w-full py-3 h-14 pl-1"
          style={{ paddingLeft: `${Math.max(1, Math.min(depth, 6) * 1.5)}rem` }}
        >
          <div className="w-6 shrink-0" />{" "}
          {/* Spacer for visual alignment with chevron */}
          <TaskRowContent />
        </div>
      </div>
    );
  }

  return (
    <Accordion type="multiple" className="w-full">
      <AccordionItem
        value={task.id}
        className="border-b border-white/5 bg-[#171f33] overflow-hidden"
      >
        <div
          className="group flex items-center w-full h-14 hover:bg-[#1e293b] transition-colors"
          style={{
            paddingLeft: `${Math.max(1, Math.min(depth, 6) * 1.5 - 0.5)}rem`,
          }}
        >
          <AccordionTrigger className="p-2 -ml-2 rounded hover:bg-white/5 hover:no-underline [&>svg:last-child]:hidden [&[data-state=open]>svg]:rotate-90 transition-colors flex shrink-0">
            <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 text-slate-500" />
          </AccordionTrigger>
          <div className="flex-1 ml-1 h-full flex items-center min-w-0">
            <TaskRowContent />
          </div>
        </div>
        <AccordionContent className="pb-0 pt-0">
          <div
            className={`${depth < 6 ? "ml-6" : "ml-0"} pl-2 border-l border-white/10 flex flex-col gap-1`}
          >
            {task.children.map((child: any) => (
              <TaskItem
                key={child.id}
                task={child}
                depth={depth + 1}
                onAddSubtask={onAddSubtask}
                onSelectTask={onSelectTask}
                onTaskDeleted={onTaskDeleted}
                onTaskUpdated={onTaskUpdated}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
