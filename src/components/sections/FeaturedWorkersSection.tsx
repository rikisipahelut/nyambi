import Link from "next/link";
import { workers } from "@/data/workers";
import WorkerCard from "@/components/ui/WorkerCard";

export default function FeaturedWorkersSection() {
  return (
    <section className="bg-surface-container-low py-4xl">
      <div className="px-xl md:px-5xl max-w-360 mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-4xl gap-lg">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-forest-deep">
              Pekerja Unggulan Pekan Ini
            </h2>
            <p className="text-text-mid font-body-md max-w-144">
              Kami menyeleksi pekerja dengan rating tertinggi dan rekam jejak terbaik untuk kepuasan
              Anda.
            </p>
          </div>
          <Link
            href="/pekerja"
            className="text-primary font-bold flex items-center gap-xs hover:underline transition-all shrink-0"
          >
            Lihat Semua Pekerja{" "}
            <span className="material-symbols-outlined">arrow_right_alt</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
          {workers.slice(0, 6).map((worker) => (
            <WorkerCard key={worker.id} {...worker} />
          ))}
        </div>
      </div>
    </section>
  );
}
