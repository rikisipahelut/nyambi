import Link from "next/link";

export default async function KonfirmasiPesananPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const { orderId } = await params;
  const data = await searchParams;

  const tanggalFormatted = data.tanggal
    ? new Date(data.tanggal).toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  return (
    <main className="min-h-screen bg-surface-container-low flex items-start justify-center py-4xl px-xl">
      <div className="w-full max-w-144">
        {/* Success header */}
        <div className="text-center mb-2xl">
          <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-lg">
            <span
              className="material-symbols-outlined text-secondary text-[48px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              check_circle
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-forest-deep">Pesanan Terkirim!</h1>
          <p className="text-text-mid font-body-md mt-xs">
            {data.worker} akan segera menghubungi Anda untuk konfirmasi.
          </p>
        </div>

        {/* Order card */}
        <div className="bg-surface-container-lowest rounded-xl border border-cream-dark overflow-hidden mb-lg">
          {/* Order ID + Status */}
          <div className="flex items-center justify-between px-xl py-lg border-b border-cream-dark">
            <div>
              <p className="text-label-sm font-label-sm text-on-surface-variant uppercase">
                Nomor Pesanan
              </p>
              <p className="font-headline-md text-headline-md text-forest-deep">INV-{orderId.slice(0, 8).toUpperCase()}</p>
            </div>
            <span className="bg-cta-amber/15 text-cta-amber px-md py-xs rounded-full font-bold text-label-sm flex items-center gap-xs">
              <span className="w-2 h-2 rounded-full bg-cta-amber" />
              Menunggu Konfirmasi
            </span>
          </div>

          {/* Detail rows */}
          <div className="divide-y divide-cream-dark">
            <DetailRow
              icon="person"
              label="Pekerja"
              value={`${data.worker} · ${data.specialty}`}
            />
            <DetailRow
              icon="calendar_today"
              label="Jadwal"
              value={`${tanggalFormatted}, ${data.waktu} WIB`}
            />
            <DetailRow
              icon="description"
              label="Deskripsi Pekerjaan"
              value={data.deskripsi}
            />
            <DetailRow
              icon="location_on"
              label="Alamat"
              value={data.alamat}
            />
            <DetailRow
              icon="call"
              label="Nomor Telepon"
              value={`+62 ${data.telepon}`}
            />
          </div>
        </div>

        {/* Info box */}
        <div className="bg-pale-mint/20 border border-pale-mint rounded-xl px-xl py-lg mb-2xl flex gap-md">
          <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-xs">
            info
          </span>
          <p className="text-on-surface font-body-md text-body-md">
            Simpan nomor pesanan Anda. Pekerja biasanya merespons dalam{" "}
            <strong className="text-forest-deep">1–2 jam</strong> setelah pesanan diterima.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-lg">
          <Link
            href={`/pekerja/${data.workerId}`}
            className="flex-1 py-md rounded-full border-1.5 border-primary text-primary font-bold hover:bg-surface-container-low transition-all text-center"
          >
            Lihat Profil Pekerja
          </Link>
          <Link
            href="/"
            className="flex-1 py-md rounded-full bg-primary text-on-primary font-bold hover:bg-primary-container transition-all text-center"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex gap-lg px-xl py-lg">
      <span className="material-symbols-outlined text-on-surface-variant text-[20px] shrink-0 mt-xs">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-label-sm font-label-sm text-on-surface-variant uppercase mb-xs">{label}</p>
        <p className="text-on-surface font-body-md text-body-md break-words">{value}</p>
      </div>
    </div>
  );
}
