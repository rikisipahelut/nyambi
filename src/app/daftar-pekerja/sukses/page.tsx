import Link from "next/link";

export default async function DaftarSuksesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const { nama, kategori } = await searchParams;

  return (
    <main className="min-h-screen bg-surface-container-low flex items-center justify-center px-xl py-4xl">
      <div className="w-full max-w-144 text-center">
        <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-2xl">
          <span
            className="material-symbols-outlined text-secondary text-[56px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            how_to_reg
          </span>
        </div>

        <h1 className="font-headline-lg text-headline-lg text-forest-deep mb-md">
          Selamat, {nama}!
        </h1>
        <p className="text-text-mid font-body-lg max-w-168 mx-auto mb-3xl">
          Pendaftaran Anda sebagai <strong className="text-forest-deep">{kategori ? decodeURIComponent(kategori) : "pekerja"}</strong> telah
          diterima. Tim Nyambi akan memverifikasi profil Anda dalam 1×24 jam.
        </p>

        <div className="bg-surface-container-lowest rounded-xl border border-cream-dark p-xl mb-2xl text-left space-y-md">
          {[
            { icon: "mark_email_read", text: "Notifikasi verifikasi akan dikirim via WhatsApp" },
            { icon: "badge", text: "Lengkapi foto profil setelah akun aktif" },
            { icon: "payments", text: "Mulai terima pesanan dan dapatkan penghasilan" },
          ].map(({ icon, text }) => (
            <div key={icon} className="flex items-center gap-md">
              <span className="material-symbols-outlined text-secondary text-[20px]">{icon}</span>
              <p className="text-on-surface font-body-md text-body-md">{text}</p>
            </div>
          ))}
        </div>

        <Link
          href="/"
          className="inline-block px-4xl py-md rounded-full bg-primary text-on-primary font-bold text-body-lg hover:bg-primary-container transition-all"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
