"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { SidebarContent } from "./Sidebar";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="flex items-center gap-3 px-4 md:px-6 w-full sticky top-0 z-50 bg-[#0b1326] border-b border-white/5 h-14">
        {/* Hamburger — mobile only */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden flex items-center justify-center w-8 h-8 text-slate-400 hover:text-slate-100 hover:bg-white/5 rounded transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand */}
        <span className="text-base font-black text-slate-100 font-display tracking-tight">
          DevTask Manager
        </span>
      </header>

      {/* Mobile Sidebar Sheet */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent
          side="left"
          className="p-0 w-72 bg-[#0b1326] border-r border-white/5"
        >
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SidebarContent onNavigate={() => setMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
}
