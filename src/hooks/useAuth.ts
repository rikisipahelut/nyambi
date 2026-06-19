"use client";

import { useEffect, useState } from "react";
import { api, setAccessToken, loadStoredToken, ApiError } from "@/lib/api";
import { resolveStorageUrl } from "@/lib/storage";

export interface AuthUser {
  id: string;
  nama: string;
  email: string;
  telepon?: string;
  is_worker: boolean;
  joinedAt: string;
  avatar?: string;
}

const USER_KEY = "nyambi_user";

function saveUser(u: AuthUser) {
  try { localStorage.setItem(USER_KEY, JSON.stringify(u)); } catch {}
}

function loadUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function clearSession() {
  try {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem("nyambi_token");
  } catch {}
}

function mapMe(raw: Record<string, unknown>): AuthUser {
  return {
    id:        raw.id as string,
    nama:      raw.nama as string,
    email:     raw.email as string,
    telepon:   raw.telepon as string | undefined,
    is_worker: Boolean(raw.is_worker),
    joinedAt:  (raw.created_at ?? new Date().toISOString()) as string,
    avatar:    resolveStorageUrl(raw.avatar_url as string | null) || undefined,
  };
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function restore() {
      // Immediately show cached user so UI doesn't flash
      const cached = loadUser();
      if (cached) setUser(cached);

      const token = loadStoredToken();
      if (token) {
        setAccessToken(token);
        try {
          // Verify token is still valid by fetching profile
          const res = await api.get<{ data: Record<string, unknown> }>("/users/me");
          const u = mapMe(res.data);
          saveUser(u);
          setUser(u);
        } catch (err) {
          if (err instanceof ApiError && err.status === 401) {
            // Token expired — api.ts already tried refresh internally
            clearSession();
            setUser(null);
          }
          // Other errors (network) — keep cached user
        }
      }

      setReady(true);
    }
    restore();
  }, []);

  async function login(email: string, password: string): Promise<void> {
    const res = await api.post<{
      access_token: string;
      expires_in: number;
      user: Record<string, unknown>;
    }>("/auth/login", { email, password });

    setAccessToken(res.access_token);

    // Login response has minimal user — fetch full profile for telepon etc.
    const me = await api.get<{ data: Record<string, unknown> }>("/users/me");
    const u = mapMe(me.data);
    saveUser(u);
    setUser(u);
  }

  async function register(data: {
    nama: string;
    email: string;
    telepon: string;
    password: string;
  }): Promise<void> {
    const res = await api.post<{
      access_token: string;
      expires_in: number;
      user: Record<string, unknown>;
    }>("/auth/register", data);

    setAccessToken(res.access_token);

    const me = await api.get<{ data: Record<string, unknown> }>("/users/me");
    const u = mapMe(me.data);
    saveUser(u);
    setUser(u);
  }

  async function logout(): Promise<void> {
    try { await api.post("/auth/logout"); } catch {}
    setAccessToken(null);
    clearSession();
    setUser(null);
  }

  async function updateProfile(data: {
    nama: string;
    email: string;
    telepon: string;
  }): Promise<void> {
    const res = await api.put<{ data: Record<string, unknown> }>("/users/me", data);
    const u = mapMe(res.data);
    saveUser(u);
    setUser(u);
  }

  async function updatePassword(data: {
    current_password: string;
    new_password: string;
  }): Promise<void> {
    await api.put("/users/me/password", data);
  }

  async function updateAvatar(file: File): Promise<void> {
    const form = new FormData();
    form.append("avatar", file);
    const res = await api.post<{ data: { avatar_url: string } }>("/users/me/avatar", form);
    if (user) {
      const updated = { ...user, avatar: resolveStorageUrl(res.data.avatar_url) || undefined };
      saveUser(updated);
      setUser(updated);
    }
  }

  return { user, ready, login, register, logout, updateProfile, updatePassword, updateAvatar };
}
