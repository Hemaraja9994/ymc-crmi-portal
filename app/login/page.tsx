"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { loginValid, SESSION_KEY } from "@/lib/auth";

const T = {
  bg: "#f6f3ec",
  bg2: "#efeadf",
  ink: "#0c1f2b",
  ink2: "#3d4d5a",
  ink3: "#7a8794",
  border: "#e6dfd0",
  borderStrong: "#d7cdb8",
  primary: "#0d3b3a",
  primaryDeep: "#062825",
  coral: "#d96a4a",
};

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [role, setRole] = useState<"student" | "admin">(
    params.get("role") === "admin" ? "admin" : "student"
  );
  const [campusId, setCampusId] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  function switchRole(r: "student" | "admin") {
    setRole(r);
    setErr("");
    setCampusId("");
    setPassword("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!campusId.trim()) return;
    setErr("");
    setLoading(true);

    if (role === "admin") {
      if (!loginValid(campusId.trim(), password)) {
        setErr("Invalid username or password.");
        setLoading(false);
        return;
      }
      window.localStorage.setItem(SESSION_KEY, JSON.stringify({ user: campusId.trim(), at: Date.now() }));
      router.replace("/admin");
      return;
    }

    // Student: verify roll number exists then navigate
    try {
      const res = await fetch("/api/student-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: campusId.trim() }),
      });
      if (!res.ok) {
        setErr("No student found with that roll number.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      router.push(`/student/${encodeURIComponent(data.student.regNo)}`);
    } catch {
      setErr("Could not reach the server. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "calc(100vh - 72px)" }}>

      {/* ─── Left: brand panel ──────────────────────────────── */}
      <div style={{
        background: T.primary, color: "white",
        padding: "60px 56px", display: "flex", flexDirection: "column",
        justifyContent: "center", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -80, right: -80, width: 260, height: 260, borderRadius: 130, background: T.coral, opacity: 0.2, filter: "blur(50px)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: 11, fontFamily: "ui-monospace, monospace", letterSpacing: ".08em", opacity: 0.65, textTransform: "uppercase" as const, marginBottom: 12 }}>
            CRMI · MBBS 2021
          </div>
          <div style={{ fontSize: 44, lineHeight: 1.1, letterSpacing: "-0.025em", fontWeight: 800 }}>
            One place for<br />
            <span style={{ color: T.coral }}>your entire year.</span>
          </div>
          <p style={{ fontSize: 14, opacity: 0.75, marginTop: 18, maxWidth: 360, lineHeight: 1.6 }}>
            Postings, leave approvals, attendance records and certificates —
            all in one portal for the MBBS 2021 CBME internship.
          </p>
          <div style={{ marginTop: 36, fontSize: 11, opacity: 0.55, fontFamily: "ui-monospace, monospace" }}>
            Need help? <span style={{ borderBottom: "1px solid currentColor" }}>crmi@yenepoya.edu.in</span>
          </div>
        </div>
      </div>

      {/* ─── Right: form panel ──────────────────────────────── */}
      <div style={{ background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: 32 }}>
        <div style={{ width: 380 }}>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", color: T.ink }}>
            Sign in
          </div>
          <div style={{ fontSize: 13.5, color: T.ink2, marginTop: 6, marginBottom: 28 }}>
            {role === "student"
              ? "Enter your campus roll number to access your dashboard."
              : "Coordinator access only. Enter your credentials."}
          </div>

          {/* Role tabs */}
          <div style={{ display: "inline-flex", background: T.bg2, borderRadius: 999, padding: 3, marginBottom: 24 }}>
            {(["student", "admin"] as const).map((r) => (
              <button
                key={r}
                onClick={() => switchRole(r)}
                style={{
                  border: "none", borderRadius: 999,
                  background: role === r ? "white" : "transparent",
                  boxShadow: role === r ? "0 1px 3px rgba(0,0,0,.08)" : "none",
                  padding: "7px 18px", fontWeight: role === r ? 600 : 500,
                  color: role === r ? T.ink : T.ink2,
                  fontSize: 13, cursor: "pointer", fontFamily: "inherit",
                  transition: "all 0.15s",
                }}
              >
                {r === "student" ? "Intern" : "Coordinator"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: T.ink2, display: "block", marginBottom: 6 }}>
                {role === "student" ? "Campus Roll Number" : "Username"}
              </label>
              <input
                className="ymc-input"
                value={campusId}
                onChange={(e) => setCampusId(e.target.value)}
                placeholder={role === "student" ? "e.g. 21M001" : "admin"}
                autoFocus
                autoComplete="username"
              />
            </div>

            {role === "admin" && (
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: T.ink2, display: "block", marginBottom: 6 }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    className="ymc-input"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    autoComplete="current-password"
                    style={{ paddingRight: 44 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: T.ink3, padding: 2 }}
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {err && (
              <div style={{ fontSize: 12.5, color: T.coral, background: "#fbe6dc", border: `1px solid ${T.coral}30`, borderRadius: 8, padding: "10px 14px" }}>
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "13px 0", borderRadius: 999, border: "none",
                background: loading ? T.ink2 : T.primary, color: "white",
                fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit", transition: "background 0.15s", marginTop: 4,
              }}
            >
              {loading ? "Please wait…" : role === "student" ? "View my dashboard" : "Sign in"}
              {!loading && <ArrowRight size={14} />}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 20, fontSize: 12.5, color: T.ink3 }}>
            <Link href="/" style={{ color: T.primary, textDecoration: "none", borderBottom: `1px solid ${T.primary}40` }}>
              ← Back to portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
