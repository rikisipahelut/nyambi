"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { resolveStorageUrl } from "@/lib/storage";
import BookingModal from "@/components/ui/BookingModal";

interface WorkerFull {
  id: string;
  nama: string;
  specialty: string;
  location: string | null;
  status: "available" | "busy";
  rating: number;
  completed_jobs: number;
  experience_years: number;
  response_time: string | null;
  image_url: string | null;
  bio: string | null;
  categories: { id: string; title: string }[];
  tags: string[];
  services: { name: string; price: number | null; unit: string | null }[];
}

function WorkerAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return (
    <div className="w-full h-full bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
      <span className="text-6xl font-black text-primary">{initials}</span>
    </div>
  );
}

function Skeleton() {
  return (
    <>
      <header className="bg-surface sticky top-0 z-50 border-b border-cream-dark">
        <nav className="flex items-center h-20 px-xl md:px-5xl max-w-360 mx-auto w-full gap-lg">
          <Link href="/pekerja" className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <span className="text-headline-md font-display font-black text-primary tracking-tight">Nyambi</span>
        </nav>
      </header>
      <main className="max-w-360 mx-auto px-xl md:px-5xl py-4xl animate-pulse">
        <div className="bg-cream-dark rounded-xl h-72 mb-2xl" />
        <div className="grid md:grid-cols-3 gap-2xl">
          <div className="md:col-span-2 space-y-2xl">
            <div className="bg-cream-dark rounded-xl h-40" />
          </div>
          <div className="space-y-lg">
            {[1, 2, 3].map((i) => <div key={i} className="bg-cream-dark rounded-xl h-24" />)}
          </div>
        </div>
      </main>
    </>
  );
}

export default function PekerjaAuthGate({ worker }: { worker: WorkerFull }) {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) {
      router.replace(`/masuk?from=/pekerja/${worker.id}`);
    }
  }, [ready, user, router, worker.id]);

  if (!ready || !user) return <Skeleton />;

  const isAvailable = worker.status === "available";
  const category = worker.categories?.[0] ?? null;
  const imageUrl = resolveStorageUrl(worker.image_url);

  return (
    <>
      <header className="bg-surface sticky top-0 z-50 border-b border-cream-dark">
        <nav className="flex items-center h-20 px-xl md:px-5xl max-w-360 mx-auto w-full gap-lg">
          <Link href="/pekerja" className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <span className="text-headline-md font-display font-black text-primary tracking-tight">Nyambi</span>
        </nav>
      </header>

      <main className="max-w-360 mx-auto px-xl md:px-5xl py-4xl">
        {/* Profile card */}
        <div className="bg-surface-container-lowest rounded-xl border border-cream-dark overflow-hidden mb-2xl">
          <div className="relative h-72 w-full">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt={worker.nama} className="w-full h-full object-cover object-top" />
            ) : (
              <WorkerAvatar name={worker.nama} />
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-xl left-xl right-xl flex items-end justify-between">
              <div>
                <h1 className="font-headline-lg text-headline-md text-surface-container-lowest">
                  {worker.nama}
                </h1>
                <p className="text-pale-mint font-body-md">{worker.specialty}</p>
              </div>
              <span
                className={`px-md py-xs rounded-full font-bold text-label-sm flex items-center gap-xs ${
                  isAvailable ? "bg-green-100 text-secondary" : "bg-orange-100 text-orange-700"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isAvailable ? "bg-secondary" : "bg-orange-700"}`} />
                {isAvailable ? "Tersedia" : "Sibuk"}
              </span>
            </div>
          </div>

          <div className="p-xl">
            <div className="flex flex-wrap gap-md mb-xl">
              {worker.location && (
                <span className="flex items-center gap-xs text-on-surface-variant font-body-md text-body-md">
                  <span className="material-symbols-outlined text-[18px]">location_on</span>
                  {worker.location}
                </span>
              )}
              {category && (
                <span className="flex items-center gap-xs text-on-surface-variant font-body-md text-body-md">
                  <span className="material-symbols-outlined text-[18px]">work</span>
                  {category.title}
                </span>
              )}
            </div>

            {worker.tags.length > 0 && (
              <div className="flex flex-wrap gap-sm mb-xl">
                {worker.tags.map((tag) => (
                  <span key={tag} className="px-md py-xs bg-cream-dark rounded-full text-label-sm font-body-md">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <BookingModal workerId={worker.id} workerName={worker.nama} specialty={worker.specialty} />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-2xl">
          <div className="md:col-span-2 space-y-2xl">
            {worker.bio && (
              <section className="bg-surface-container-lowest rounded-xl border border-cream-dark p-xl">
                <h2 className="font-headline-md text-headline-md text-forest-deep mb-lg">Tentang</h2>
                <p className="text-on-surface font-body-md text-body-md leading-relaxed">{worker.bio}</p>
              </section>
            )}

            {worker.services.length > 0 && (
              <section className="bg-surface-container-lowest rounded-xl border border-cream-dark p-xl">
                <h2 className="font-headline-md text-headline-md text-forest-deep mb-lg">Layanan</h2>
                <ul className="space-y-md">
                  {worker.services.map((svc) => (
                    <li key={svc.name} className="flex items-center justify-between gap-md text-on-surface font-body-md text-body-md">
                      <span className="flex items-center gap-md">
                        <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
                        {svc.name}
                      </span>
                      {svc.price != null && (
                        <span className="text-primary font-bold shrink-0">
                          Rp {svc.price.toLocaleString("id-ID")}
                          {svc.unit ? `/${svc.unit}` : ""}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <div className="space-y-lg">
            <div className="bg-surface-container-lowest rounded-xl border border-cream-dark p-xl text-center">
              <div className="flex items-center justify-center text-cta-amber mb-xs">
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
              <p className="font-headline-lg text-headline-md text-forest-deep">{worker.rating}</p>
              <p className="text-on-surface-variant text-label-sm uppercase">Rating</p>
            </div>

            <div className="bg-surface-container-lowest rounded-xl border border-cream-dark p-xl text-center">
              <span className="material-symbols-outlined text-primary text-[28px] mb-xs block">task_alt</span>
              <p className="font-headline-lg text-headline-md text-forest-deep">{worker.completed_jobs}</p>
              <p className="text-on-surface-variant text-label-sm uppercase">Pekerjaan Selesai</p>
            </div>

            <div className="bg-surface-container-lowest rounded-xl border border-cream-dark p-xl text-center">
              <span className="material-symbols-outlined text-primary text-[28px] mb-xs block">work_history</span>
              <p className="font-headline-lg text-headline-md text-forest-deep">{worker.experience_years} thn</p>
              <p className="text-on-surface-variant text-label-sm uppercase">Pengalaman</p>
            </div>

            {worker.response_time && (
              <div className="bg-surface-container-lowest rounded-xl border border-cream-dark p-xl text-center">
                <span className="material-symbols-outlined text-primary text-[28px] mb-xs block">schedule</span>
                <p className="font-headline-lg text-headline-md text-forest-deep">{worker.response_time}</p>
                <p className="text-on-surface-variant text-label-sm uppercase">Waktu Respons</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
