"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SESSION_KEY } from "@/lib/auth";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    const s = typeof window !== "undefined" && window.localStorage.getItem(SESSION_KEY);
    if (!s && path !== "/admin/login") {
      router.replace("/admin/login");
    } else {
      setOk(true);
    }
  }, [path, router]);

  if (path === "/admin/login") return <>{children}</>;
  if (!ok) {
    return (
      <div className="min-h-[40vh] grid place-items-center text-slate-500 text-sm">
        Checking session…
      </div>
    );
  }
  return <>{children}</>;
}
