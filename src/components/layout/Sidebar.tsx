"use client";

import { useState } from "react";
import { Folder, FolderOpen, Plus } from "lucide-react"; // Añadimos FolderOpen
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useProject } from "@/contexts/ProjectContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

// ─── Shared inner content (used by both desktop aside and mobile Sheet) ───────

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const {
    projects,
    selectedProject, // Traemos el proyecto seleccionado
    setSelectedProject,
    isDialogOpen,
    setIsDialogOpen,
    fetchProjects,
  } = useProject();
  const [newProjectName, setNewProjectName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post("/projects", { name: newProjectName });
      setIsDialogOpen(false);
      setNewProjectName("");
      await fetchProjects();
      setSelectedProject(data);
      onNavigate?.();
    } catch (error) {
      console.error("Error creating project", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 bg-[#0b1326]">
      {/* Brand */}
      <div className="mb-8 px-2">
        <h1 className="text-lg font-black text-slate-100 font-display tracking-tight">
          Task System
        </h1>
        <p className="text-xs text-slate-500 font-mono">Team Workspace</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 font-mono mb-2">
          Projects
        </div>

        {projects.length === 0 ? (
          <div className="px-3 py-2 text-slate-500 text-xs italic font-mono">
            No projects found
          </div>
        ) : (
          projects.map((project) => {
            // Evaluamos si este proyecto es el activo
            const isActive = selectedProject?.id === project.id;
            const Icon = isActive ? FolderOpen : Folder;

            return (
              <button
                key={project.id || project.name}
                onClick={() => {
                  setSelectedProject(project);
                  onNavigate?.();
                }}
                className={`w-full flex items-center justify-start gap-3 px-3 py-2 transition-all duration-150 rounded-md ${
                  isActive
                    ? "bg-[#171f33] text-slate-100 font-medium"
                    : "text-slate-400 hover:bg-[#171f33] hover:text-slate-100"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${isActive ? "text-blue-500" : "text-slate-600"}`}
                />
                <span className="truncate text-sm">{project.name}</span>
                {project.status === false && (
                  <span className="ml-auto text-[9px] font-mono text-yellow-600 uppercase">
                    off
                  </span>
                )}
              </button>
            );
          })
        )}

        <div className="pt-2 px-1">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-500 hover:text-slate-100 hover:bg-[#171f33]"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#171f33] border-none text-slate-100 sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display text-xl tracking-tight">
                  Create New Project
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  Enter a name for your new project workspace.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateProject} className="space-y-4 pt-4">
                <Input
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Project Name..."
                  className="font-mono bg-slate-800 text-slate-100 placeholder:text-slate-500 border-none focus-visible:ring-0 h-11"
                  autoFocus
                />
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsDialogOpen(false)}
                    className="text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 font-bold"
                  >
                    {loading ? "Creating..." : "Create Project"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </nav>
    </div>
  );
}

// ─── Desktop aside (unchanged behavior) ──────────────────────────────────────

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col h-screen w-64 bg-[#0b1326] border-r border-white/5 sticky top-0">
      <SidebarContent />
    </aside>
  );
}
