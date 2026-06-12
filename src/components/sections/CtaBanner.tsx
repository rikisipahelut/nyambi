import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="py-5xl px-xl md:px-5xl">
      <div className="max-w-360 mx-auto bg-forest-deep rounded-4xl p-2xl md:p-4xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-3xl">
        <div
          className="absolute -right-20 -top-20 w-64 h-64 bg-cta-amber/10 rounded-full blur-3xl"
          aria-hidden="true"
        />

        <div className="z-10 text-center md:text-left">
          <h2 className="font-headline-lg text-headline-lg text-surface-container-lowest mb-md">
            Punya keahlian dan ingin menambah penghasilan?
          </h2>
          <p className="text-pale-mint font-body-lg max-w-144">
            Bergabunglah dengan ribuan pekerja terpercaya di Nyambi dan temukan peluang kerja
            setiap hari.
          </p>
        </div>

        <div className="z-10 flex flex-col sm:flex-row gap-lg">
          <Link
            href="/kategori"
            className="bg-cta-amber text-forest-deep px-4xl py-xl rounded-full font-bold text-body-lg hover:scale-105 transition-all shadow-lg active:scale-95 text-center"
          >
            Mulai Cari Jasa Sekarang
          </Link>
          <Link
            href="/daftar-pekerja"
            className="border-2 border-pale-mint text-pale-mint px-4xl py-xl rounded-full font-bold text-body-lg hover:bg-pale-mint/10 transition-all text-center"
          >
            Daftar Jadi Pekerja
          </Link>
        </div>
      </div>
    </section>
  );
}
