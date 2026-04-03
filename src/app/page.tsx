import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { TaskListView } from "@/components/dashboard/TaskListView";

export default function Home() {
  return (
    <DashboardLayout>
      <TaskListView />
    </DashboardLayout>
  );
}
