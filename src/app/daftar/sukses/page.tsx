import Link from "next/link";

export default async function DaftarSuksesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const { nama } = await searchParams;

  return (
    <main className="min-h-screen bg-surface-container-low flex items-center justify-center px-xl py-4xl">
      <div className="w-full max-w-144 text-center">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2xl">
          <span
            className="material-symbols-outlined text-primary text-[56px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            verified_user
          </span>
        </div>

        <h1 className="font-headline-lg text-headline-lg text-forest-deep mb-md">
          Selamat Datang, {nama}!
        </h1>
        <p className="text-text-mid font-body-lg max-w-168 mx-auto mb-3xl">
          Akun Anda berhasil dibuat. Sekarang Anda bisa langsung mencari dan memesan jasa
          terpercaya di sekitar Anda.
        </p>

        <div className="bg-surface-container-lowest rounded-xl border border-cream-dark p-xl mb-2xl text-left space-y-md">
          {[
            { icon: "search", text: "Cari pekerja berdasarkan kategori dan lokasi" },
            { icon: "handshake", text: "Pesan jasa dengan mudah langsung dari profil pekerja" },
            { icon: "star", text: "Beri ulasan setelah pekerjaan selesai" },
          ].map(({ icon, text }) => (
            <div key={icon} className="flex items-center gap-md">
              <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
              <p className="text-on-surface font-body-md text-body-md">{text}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-lg justify-center">
          <Link
            href="/kategori"
            className="px-4xl py-md rounded-full bg-primary text-on-primary font-bold text-body-lg hover:bg-primary-container transition-all"
          >
            Mulai Cari Jasa
          </Link>
          <Link
            href="/"
            className="px-4xl py-md rounded-full border-1.5 border-primary text-primary font-bold text-body-lg hover:bg-surface-container-low transition-all"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
