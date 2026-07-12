"use client";


import { useEffect, useState } from "react";

import LoginScreen from "../components/auth/LoginScreen";
import RegisterScreen from "../components/auth/RegisterScreen";
import IMSDashboard from "../components/ims/IMSDashboard";
import { apiMe, clearAuthToken, getAuthToken, type AuthUser } from "../lib/api";

export default function NovaAssetsIMS() {
  const [screen, setScreen] = useState<"login" | "register" | "dashboard">("login");
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      setBooting(false);
      setScreen("login");
      return;
    }

    apiMe()
      .then((user) => {
        setCurrentUser(user);
        setScreen("dashboard");
      })
      .catch(() => {
        clearAuthToken();
        setCurrentUser(null);
        setScreen("login");
      })
      .finally(() => setBooting(false));
  }, []);

  useEffect(() => {
    if (screen === "dashboard") return;

    window.scrollTo({ top: 0, left: 0 });
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [screen]);

  useEffect(() => {
    if (screen !== "dashboard") return;
    let cancelled = false;

    const refresh = () => {
      apiMe()
        .then((u) => {
          if (cancelled) return;
          setCurrentUser(u);
        })
        .catch(() => {
          // ignore: token may have expired; existing UI will handle on next action
        });
    };

    const onFocus = () => refresh();
    window.addEventListener("focus", onFocus);
    const id = window.setInterval(refresh, 60_000);
    return () => {
      cancelled = true;
      window.removeEventListener("focus", onFocus);
      window.clearInterval(id);
    };
  }, [screen]);

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    setScreen("dashboard");
  };

  const handleLogout = () => {
    clearAuthToken();
    setCurrentUser(null);
    setScreen("login");
  };

  if (booting) return null;

  if (screen === "login") {
    return (
      <div className="fixed inset-0 z-[9999] overflow-hidden bg-[#0f1629]">
        <LoginScreen onLogin={handleLogin} onGoRegister={() => setScreen("register")} />
      </div>
    );
  }
  if (screen === "register") {
    return (
      <div className="fixed inset-0 z-[9999] overflow-hidden bg-[#0f1629]">
        <RegisterScreen onGoLogin={() => setScreen("login")} />
      </div>
    );
  }
  return <IMSDashboard user={currentUser} onLogout={handleLogout} />;
}
