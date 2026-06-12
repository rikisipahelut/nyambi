"use client";

import { useEffect, useState } from "react";

export interface AuthUser {
  nama: string;
  email: string;
  telepon?: string;
  joinedAt: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nyambi_user");
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  function login(data: AuthUser) {
    localStorage.setItem("nyambi_user", JSON.stringify(data));
    setUser(data);
  }

  function logout() {
    localStorage.removeItem("nyambi_user");
    setUser(null);
  }

  return { user, ready, login, logout };
}
