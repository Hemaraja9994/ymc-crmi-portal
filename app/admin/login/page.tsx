"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginValid, SESSION_KEY } from "@/lib/auth";
import { ShieldCheck, Lock, User, Eye, EyeOff } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!loginValid(u, p)) {
      setErr("Invalid credentials. Please contact the CRMI Coordination Cell for access.");
      return;
    }
    window.localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ user: u, at: Date.now() })
    );
    router.replace("/admin");
  }

  return (
    <div className="min-h-[70vh] grid place-items-center px-4">
      <div className="w-full max-w-md">
        <div className="card p-7 bg-gradient-to-br from-white via-white to-brand-50/40">
          <div className="flex items-center gap-2 text-brand-700">
            <ShieldCheck />
            <h1 className="font-semibold text-lg">Coordinator Sign-in</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Restricted access — Internship Coordinators only.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-3 text-sm">
            <label className="block">
              <span className="text-xs font-medium text-slate-600">Username</span>
              <div className="mt-1 relative">
                <User size={16} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  autoFocus
                  value={u}
                  onChange={(e) => setU(e.target.value)}
                  placeholder="Username"
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-600">Password</span>
              <div className="mt-1 relative">
                <Lock size={16} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type={show ? "text" : "password"}
                  value={p}
                  onChange={(e) => setP(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  className="absolute right-2 top-2 text-slate-400 p-1"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>
            {err && (
              <div className="text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                {err}
              </div>
            )}
            <button className="btn-primary w-full justify-center py-2.5">Sign in</button>
            <p className="text-[11px] text-slate-400 text-center">
              Demo credentials shown for prototype only. Replace with NextAuth + SSO before
              production rollout.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
