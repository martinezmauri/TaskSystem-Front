import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProjectDashboard } from "@/components/dashboard/ProjectDashboard";

export default function Home() {
  return (
    <DashboardLayout>
      <ProjectDashboard />
    </DashboardLayout>
  );
}
