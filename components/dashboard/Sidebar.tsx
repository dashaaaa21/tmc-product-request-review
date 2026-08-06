"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Plus, History } from "lucide-react";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/requests",
    label: "New Request",
    icon: Plus,
  },
  {
    href: "/history",
    label: "History",
    icon: History,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-zinc-100 border-r-2 border-zinc-200 flex flex-col">
      <div className="p-6 border-b-2 border-zinc-200">
        <h1 className="text-2xl font-black italic text-black">
          TMC AI Product Builder
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold
                ${
                  isActive
                    ? "bg-lime-400 text-black"
                    : "text-zinc-600 hover:bg-zinc-100"
                }
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
