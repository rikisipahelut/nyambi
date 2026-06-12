import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { workers } from "@/data/workers";
import { categories } from "@/data/categories";
import BookingModal from "@/components/ui/BookingModal";

export function generateStaticParams() {
  return workers.map((w) => ({ id: w.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const worker = workers.find((w) => w.id === id);
  if (!worker) return {};
  return {
    title: `${worker.name} - ${worker.specialty} | Nyambi`,
    description: worker.bio,
  };
}

export default async function PekerjaProfilPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const worker = workers.find((w) => w.id === id);
  if (!worker) notFound();

  const category = categories.find((c) => c.id === worker.categoryId);
  const isAvailable = worker.status === "available";

  return (
    <>
      <header className="bg-surface sticky top-0 z-50 border-b border-cream-dark">
        <nav className="flex items-center h-20 px-xl md:px-5xl max-w-360 mx-auto w-full gap-lg">
          <Link
            href={`/kategori/${worker.categoryId}`}
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <span className="text-headline-md font-display font-black text-primary tracking-tight">
            Nyambi
          </span>
        </nav>
      </header>

      <main className="max-w-360 mx-auto px-xl md:px-5xl py-4xl">
        {/* Profile card */}
        <div className="bg-surface-container-lowest rounded-xl border border-cream-dark overflow-hidden mb-2xl">
          <div className="relative h-56 w-full">
            <Image src={worker.imageUrl} alt={worker.imageAlt} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-deep/60 to-transparent" />
            <div className="absolute bottom-xl left-xl right-xl flex items-end justify-between">
              <div>
                <h1 className="font-headline-lg text-headline-md text-surface-container-lowest">
                  {worker.name}
                </h1>
                <p className="text-pale-mint font-body-md">{worker.specialty}</p>
              </div>
              <span
                className={`px-md py-xs rounded-full font-bold text-label-sm flex items-center gap-xs ${
                  isAvailable
                    ? "bg-green-100 text-secondary"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isAvailable ? "bg-secondary" : "bg-orange-700"
                  }`}
                />
                {isAvailable ? "Tersedia" : "Sibuk"}
              </span>
            </div>
          </div>

          <div className="p-xl">
            {/* Location & category */}
            <div className="flex flex-wrap gap-md mb-xl">
              <span className="flex items-center gap-xs text-on-surface-variant font-body-md text-body-md">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
                {worker.location}
              </span>
              {category && (
                <span className="flex items-center gap-xs text-on-surface-variant font-body-md text-body-md">
                  <span className="material-symbols-outlined text-[18px]">{category.icon}</span>
                  {category.title}
                </span>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-sm mb-xl">
              {worker.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-md py-xs bg-cream-dark rounded-full text-label-sm font-body-md"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <BookingModal workerId={worker.id} workerName={worker.name} specialty={worker.specialty} />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-2xl">
          {/* Left column */}
          <div className="md:col-span-2 space-y-2xl">
            {/* About */}
            <section className="bg-surface-container-lowest rounded-xl border border-cream-dark p-xl">
              <h2 className="font-headline-md text-headline-md text-forest-deep mb-lg">Tentang</h2>
              <p className="text-on-surface font-body-md text-body-md leading-relaxed">{worker.bio}</p>
            </section>

            {/* Services */}
            <section className="bg-surface-container-lowest rounded-xl border border-cream-dark p-xl">
              <h2 className="font-headline-md text-headline-md text-forest-deep mb-lg">Layanan</h2>
              <ul className="space-y-md">
                {worker.services.map((service) => (
                  <li key={service} className="flex items-center gap-md text-on-surface font-body-md text-body-md">
                    <span className="material-symbols-outlined text-secondary text-[20px]">check_circle</span>
                    {service}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Right column — stats */}
          <div className="space-y-lg">
            <div className="bg-surface-container-lowest rounded-xl border border-cream-dark p-xl text-center">
              <div className="flex items-center justify-center text-cta-amber mb-xs">
                <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
              </div>
              <p className="font-headline-lg text-headline-md text-forest-deep">{worker.rating}</p>
              <p className="text-on-surface-variant text-label-sm uppercase">Rating</p>
            </div>

            <div className="bg-surface-container-lowest rounded-xl border border-cream-dark p-xl text-center">
              <span className="material-symbols-outlined text-primary text-[28px] mb-xs block">task_alt</span>
              <p className="font-headline-lg text-headline-md text-forest-deep">{worker.completedJobs}</p>
              <p className="text-on-surface-variant text-label-sm uppercase">Pekerjaan Selesai</p>
            </div>

            <div className="bg-surface-container-lowest rounded-xl border border-cream-dark p-xl text-center">
              <span className="material-symbols-outlined text-primary text-[28px] mb-xs block">work_history</span>
              <p className="font-headline-lg text-headline-md text-forest-deep">{worker.experienceYears} thn</p>
              <p className="text-on-surface-variant text-label-sm uppercase">Pengalaman</p>
            </div>

            <div className="bg-surface-container-lowest rounded-xl border border-cream-dark p-xl text-center">
              <span className="material-symbols-outlined text-primary text-[28px] mb-xs block">schedule</span>
              <p className="font-headline-lg text-headline-md text-forest-deep">{worker.responseTime}</p>
              <p className="text-on-surface-variant text-label-sm uppercase">Waktu Respons</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
