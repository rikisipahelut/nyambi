"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { api, ApiError } from "@/lib/api";

export default function PekerjaSayaPage() {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    if (!user) { router.replace("/masuk?from=/pekerja/saya"); return; }
    if (!user.is_worker) { router.replace("/daftar-pekerja"); return; }

    api.get<{ data: { id: string } }>("/workers/me")
      .then((res) => router.replace(`/pekerja/${res.data.id}`))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 404) {
          router.replace("/daftar-pekerja");
        } else {
          router.replace("/profil");
        }
      });
  }, [ready, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="material-symbols-outlined text-[48px] text-primary animate-spin">
        progress_activity
      </span>
    </div>
  );
}
