import { notFound } from "next/navigation";
import PekerjaAuthGate from "./PekerjaAuthGate";

interface ApiWorkerFull {
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

async function fetchWorker(id: string): Promise<ApiWorkerFull | null> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/workers/${id}`, {
    next: { revalidate: 60 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json.data;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const worker = await fetchWorker(id);
    if (!worker) return {};
    return {
      title: `${worker.nama} - ${worker.specialty} | Nyambi`,
      description: worker.bio ?? undefined,
    };
  } catch {
    return {};
  }
}

export default async function PekerjaProfilPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let worker: ApiWorkerFull | null = null;
  try {
    worker = await fetchWorker(id);
  } catch {
    notFound();
  }
  if (!worker) notFound();

  return <PekerjaAuthGate worker={worker} />;
}
