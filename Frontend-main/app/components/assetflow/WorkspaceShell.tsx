"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./sidebar/Sidebar";
import Navbar from "./navbar/Navbar";
import RealtimeToaster from "./shared/RealtimeToaster";
import { useRealtime } from "@/hooks/use-realtime";
import type { AssetFlowRole } from "@/app/lib/assetflow-roles";

export default function WorkspaceShell({
  children,
  role,
}: Readonly<{
  children: React.ReactNode;
  role: AssetFlowRole;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const { toasts, dismiss, unseenCount, clearUnseen } = useRealtime();

  useEffect(() => {
    const sync = () => setSidebarOpen(window.innerWidth >= 1024);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  };

  const handleLogout = () => {
    document.cookie = "assetflow_session=; path=/; max-age=0; samesite=lax";
    document.cookie = "assetflow_role=; path=/; max-age=0; samesite=lax";
    document.cookie = "assetflow_identity=; path=/; max-age=0; samesite=lax";
    document.cookie = "assetflow_auth_method=; path=/; max-age=0; samesite=lax";
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      <Sidebar role={role} pathname={pathname} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col lg:pl-[244px]">
        <Navbar
          role={role}
          onMenuClick={() => setSidebarOpen((current) => !current)}
          onLogout={handleLogout}
          onThemeToggle={toggleTheme}
          theme={theme}
          unseenCount={unseenCount}
          onBellClick={() => {
            clearUnseen();
            router.push(`/${role}/notifications`);
          }}
        />
        <main className="flex-1 px-3 pb-8 pt-2.5 sm:px-4 lg:px-6">
          <div className="mx-auto flex w-full max-w-[1320px] flex-col gap-4">{children}</div>
        </main>
        <RealtimeToaster toasts={toasts} onDismiss={dismiss} />
      </div>
    </div>
  );
}
