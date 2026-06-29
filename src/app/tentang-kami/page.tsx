import SubHeader from "@/components/layout/SubHeader";
import Link from "next/link";

export const metadata = {
  title: "Tentang Kami - Nyambi",
  description: "Kenali Nyambi, platform marketplace pekerja terampil terpercaya di Indonesia.",
};

const STATS = [
  { icon: "groups", value: "10.000+", label: "Pekerja Aktif" },
  { icon: "handshake", value: "50.000+", label: "Pesanan Selesai" },
  { icon: "location_on", value: "34", label: "Provinsi" },
  { icon: "star", value: "4.8", label: "Rating Rata-rata" },
];

const TEAM = [
  { name: "Andi Kusuma", role: "CEO & Co-Founder", icon: "person" },
  { name: "Rina Maharani", role: "CTO & Co-Founder", icon: "person" },
  { name: "Dedi Santoso", role: "Head of Operations", icon: "person" },
];

const VALUES = [
  {
    icon: "verified",
    title: "Terpercaya",
    desc: "Setiap pekerja terverifikasi identitas dan keahliannya sebelum bisa menerima pesanan.",
  },
  {
    icon: "speed",
    title: "Cepat & Mudah",
    desc: "Dari pencarian hingga pemesanan hanya butuh beberapa menit dari mana saja.",
  },
  {
    icon: "payments",
    title: "Harga Transparan",
    desc: "Tidak ada biaya tersembunyi. Semua harga disepakati sebelum pekerjaan dimulai.",
  },
  {
    icon: "support_agent",
    title: "Dukungan Penuh",
    desc: "Tim kami siap membantu 7 hari seminggu jika ada pertanyaan atau kendala.",
  },
];

export default function TentangKamiPage() {
  return (
    <>
      <SubHeader backHref="/" />

      <main>
        {/* Hero */}
        <section className="bg-forest-deep py-5xl px-xl md:px-5xl text-center relative overflow-hidden">
          <div
            className="absolute -left-24 -top-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
            aria-hidden="true"
          />
          <div
            className="absolute -right-24 -bottom-24 w-96 h-96 bg-cta-amber/10 rounded-full blur-3xl"
            aria-hidden="true"
          />
          <div className="relative z-10 max-w-168 mx-auto">
            <span className="inline-block px-lg py-xs rounded-full bg-primary/20 text-pale-mint text-label-sm font-label-sm uppercase mb-lg">
              Tentang Kami
            </span>
            <h1 className="font-headline-lg text-headline-lg text-surface-container-lowest mb-lg">
              Menghubungkan Keahlian dengan Kebutuhan
            </h1>
            <p className="text-pale-mint font-body-lg">
              Nyambi hadir untuk mempermudah masyarakat Indonesia menemukan pekerja terampil
              terpercaya di sekitar mereka — kapan saja, di mana saja.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-4xl px-xl md:px-5xl bg-surface-container-low">
          <div className="max-w-360 mx-auto grid grid-cols-2 md:grid-cols-4 gap-xl">
            {STATS.map(({ icon, value, label }) => (
              <div
                key={label}
                className="bg-surface-container-lowest rounded-2xl p-xl text-center border border-cream-dark"
              >
                <span
                  className="material-symbols-outlined text-primary text-[32px] mb-md block"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {icon}
                </span>
                <p className="font-headline-md text-headline-md text-forest-deep">{value}</p>
                <p className="text-on-surface-variant font-body-md text-body-md">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission */}
        <section className="py-5xl px-xl md:px-5xl">
          <div className="max-w-360 mx-auto flex flex-col md:flex-row gap-4xl items-center">
            <div className="flex-1">
              <span className="inline-block px-lg py-xs rounded-full bg-primary/10 text-primary text-label-sm font-label-sm uppercase mb-lg">
                Misi Kami
              </span>
              <h2 className="font-headline-lg text-headline-lg text-forest-deep mb-lg">
                Memberdayakan Pekerja Lokal Indonesia
              </h2>
              <p className="text-text-mid font-body-lg mb-lg">
                Kami percaya bahwa setiap orang berhak mendapatkan pekerjaan yang layak dan setiap
                rumah tangga berhak mendapat bantuan yang dapat diandalkan.
              </p>
              <p className="text-text-mid font-body-md">
                Nyambi membangun jembatan antara jutaan pekerja terampil di seluruh Indonesia
                dengan keluarga dan bisnis yang membutuhkan keahlian mereka — dengan proses yang
                aman, transparan, dan mudah.
              </p>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-md">
              {VALUES.map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="bg-surface-container-low rounded-2xl p-xl border border-cream-dark"
                >
                  <span
                    className="material-symbols-outlined text-primary text-[28px] mb-md block"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {icon}
                  </span>
                  <h3 className="font-body-lg text-body-lg text-forest-deep mb-xs">{title}</h3>
                  <p className="text-on-surface-variant font-body-md text-body-md">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-5xl px-xl md:px-5xl bg-surface-container-low">
          <div className="max-w-360 mx-auto">
            <div className="text-center mb-3xl">
              <span className="inline-block px-lg py-xs rounded-full bg-primary/10 text-primary text-label-sm font-label-sm uppercase mb-lg">
                Tim Kami
              </span>
              <h2 className="font-headline-lg text-headline-lg text-forest-deep">
                Orang-orang di Balik Nyambi
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-xl justify-center">
              {TEAM.map(({ name, role }) => (
                <div
                  key={name}
                  className="flex-1 max-w-72 mx-auto bg-surface-container-lowest rounded-2xl p-xl border border-cream-dark text-center"
                >
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-lg">
                    <span
                      className="material-symbols-outlined text-primary text-[40px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      person
                    </span>
                  </div>
                  <h3 className="font-body-lg text-body-lg text-forest-deep">{name}</h3>
                  <p className="text-on-surface-variant font-body-md text-body-md">{role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-5xl px-xl md:px-5xl">
          <div className="max-w-360 mx-auto bg-forest-deep rounded-4xl p-2xl md:p-4xl text-center relative overflow-hidden">
            <div
              className="absolute -right-16 -top-16 w-64 h-64 bg-cta-amber/10 rounded-full blur-3xl"
              aria-hidden="true"
            />
            <h2 className="font-headline-lg text-headline-lg text-surface-container-lowest mb-md relative z-10">
              Siap Bergabung dengan Nyambi?
            </h2>
            <p className="text-pale-mint font-body-lg mb-3xl relative z-10 max-w-144 mx-auto">
              Temukan pekerja terbaik atau mulai terima pesanan sebagai pekerja hari ini.
            </p>
            <div className="flex flex-col sm:flex-row gap-lg justify-center relative z-10">
              <Link
                href="/kategori"
                className="bg-cta-amber text-forest-deep px-4xl py-xl rounded-full font-bold text-body-lg hover:scale-105 transition-all shadow-lg active:scale-95"
              >
                Cari Jasa Sekarang
              </Link>
              <Link
                href="/daftar-pekerja"
                className="border-2 border-pale-mint text-pale-mint px-4xl py-xl rounded-full font-bold text-body-lg hover:bg-pale-mint/10 transition-all"
              >
                Daftar Jadi Pekerja
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
