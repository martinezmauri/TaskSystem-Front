"use client";

import { useState } from "react";
import { Folder, Plus, Book, HelpCircle } from "lucide-react";
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

export function Sidebar() {
  const {
    projects,
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
    } catch (error) {
      console.error("Error creating project", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 bg-slate-100 dark:bg-slate-950 border-r border-slate-200/50 dark:border-slate-800/50 font-sans text-sm font-medium p-4 sticky top-0">
      <div className="mb-8 px-2">
        <h1 className="text-lg font-black text-slate-900 dark:text-slate-100">
          Precision Architect
        </h1>
        <p className="text-xs text-slate-500">Developer Workspace</p>
      </div>
      <nav className="flex-1 space-y-1">
        <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Projects
        </div>
        {projects.length === 0 ? (
          <div className="px-3 py-2 text-slate-500 text-xs italic">
            No projects found
          </div>
        ) : (
          projects.map((project) => (
            <button
              key={project.id || project._id || project.name}
              onClick={() => setSelectedProject(project)}
              className="w-full flex items-center justify-start gap-3 px-3 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-900 transition-all duration-200 ease-in-out rounded-md"
            >
              <Folder className="w-4 h-4" />
              {project.name}
            </button>
          ))
        )}
        <div className="pt-2 px-1">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
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
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 font-bold"
                  >
                    {loading ? "Creating..." : "Create Project"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </nav>
    </aside>
  );
}
