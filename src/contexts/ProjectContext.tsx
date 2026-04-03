"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api";

type ProjectContextType = {
  projects: any[];
  selectedProject: any | null;
  setSelectedProject: (project: any | null) => void;
  fetchProjects: () => Promise<void>;
  isDialogOpen: boolean;
  setIsDialogOpen: (val: boolean) => void;
};

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProject,
        setSelectedProject,
        fetchProjects,
        isDialogOpen,
        setIsDialogOpen,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}
