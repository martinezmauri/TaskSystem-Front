import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="bg-background text-foreground min-h-screen flex font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="flex flex-col md:flex-row justify-between items-center px-8 w-full bg-slate-50 dark:bg-slate-950 py-6 border-t border-slate-200/30 dark:border-slate-800/30 text-xs uppercase tracking-widest text-slate-400 mt-auto">
          <div>© 2024 DevTask Manager. Built for Precision.</div>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a className="hover:underline hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="hover:underline hover:text-primary transition-colors" href="#">Terms of Service</a>
            <a className="hover:underline hover:text-primary transition-colors" href="#">API Docs</a>
          </div>
        </footer>
      </div>
    </div>
  );
}
