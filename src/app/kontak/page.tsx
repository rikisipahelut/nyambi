import Link from "next/link";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Kontak Kami - Nyambi",
  description: "Hubungi tim Nyambi untuk pertanyaan, saran, atau laporan masalah.",
};

const CHANNELS = [
  {
    icon: "email",
    title: "Email",
    value: "halo@nyambi.id",
    sub: "Respons dalam 1×24 jam",
    href: "mailto:halo@nyambi.id",
  },
  {
    icon: "phone",
    title: "Telepon",
    value: "(021) 1234-5678",
    sub: "Senin–Jumat, 09.00–17.00 WIB",
    href: "tel:+622112345678",
  },
  {
    icon: "chat",
    title: "WhatsApp",
    value: "+62 812-3456-7890",
    sub: "Chat langsung dengan tim kami",
    href: "https://wa.me/6281234567890",
  },
  {
    icon: "location_on",
    title: "Kantor",
    value: "Jl. Sudirman No. 123",
    sub: "Jakarta Pusat 10220",
    href: "#",
  },
];

export default function KontakPage() {
  return (
    <>
      <header className="bg-surface sticky top-0 z-50 border-b border-cream-dark">
        <nav className="flex items-center h-20 px-xl md:px-5xl max-w-360 mx-auto w-full gap-lg">
          <Link href="/" className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">arrow_back</span>
          </Link>
          <span className="text-headline-md font-display font-black text-primary tracking-tight">
            Nyambi
          </span>
        </nav>
      </header>

      <main className="py-4xl px-xl md:px-5xl">
        <div className="max-w-360 mx-auto">
          {/* Header */}
          <div className="text-center mb-4xl">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-lg">
              <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                contact_support
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-forest-deep mb-md">Kontak Kami</h1>
            <p className="text-text-mid font-body-md max-w-144 mx-auto">
              Ada pertanyaan, saran, atau kendala? Kami dengan senang hati membantu Anda.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4xl">
            {/* Left — channels + info */}
            <div className="lg:w-80 shrink-0 space-y-xl">
              {CHANNELS.map(({ icon, title, value, sub, href }) => (
                <a
                  key={title}
                  href={href}
                  className="flex items-center gap-lg p-xl bg-surface-container-low border border-cream-dark rounded-2xl hover:border-primary group transition-all"
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {icon}
                    </span>
                  </div>
                  <div>
                    <p className="text-on-surface-variant text-label-sm font-label-sm uppercase">{title}</p>
                    <p className="font-body-lg text-body-lg text-forest-deep group-hover:text-primary transition-colors">{value}</p>
                    <p className="text-on-surface-variant font-body-md text-body-md">{sub}</p>
                  </div>
                </a>
              ))}

              {/* Jam operasional */}
              <div className="p-xl bg-pale-mint/20 border border-pale-mint rounded-2xl">
                <div className="flex items-center gap-sm mb-md">
                  <span className="material-symbols-outlined text-secondary text-[18px]">schedule</span>
                  <p className="font-body-lg text-body-lg text-forest-deep">Jam Operasional</p>
                </div>
                {[
                  { hari: "Senin – Jumat", jam: "09.00 – 17.00 WIB" },
                  { hari: "Sabtu", jam: "09.00 – 13.00 WIB" },
                  { hari: "Minggu & Hari Libur", jam: "Tutup" },
                ].map(({ hari, jam }) => (
                  <div key={hari} className="flex justify-between py-xs border-b border-pale-mint/30 last:border-0">
                    <span className="text-on-surface font-body-md text-body-md">{hari}</span>
                    <span className="text-on-surface-variant font-body-md text-body-md">{jam}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — contact form */}
            <div className="flex-1">
              <div className="bg-surface-container-low border border-cream-dark rounded-2xl p-xl md:p-2xl">
                <h2 className="font-headline-md text-headline-md text-forest-deep mb-xl">
                  Kirim Pesan
                </h2>
                <ContactForm />
              </div>
            </div>
          </div>

          {/* FAQ link */}
          <div className="mt-4xl p-xl bg-surface-container-low border border-cream-dark rounded-2xl flex items-center justify-between gap-md">
            <div className="flex items-center gap-md">
              <span className="material-symbols-outlined text-primary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>help</span>
              <div>
                <p className="font-body-lg text-body-lg text-forest-deep">Cek Pusat Bantuan dulu</p>
                <p className="text-on-surface-variant font-body-md text-body-md">Mungkin pertanyaan Anda sudah terjawab di sini</p>
              </div>
            </div>
            <Link
              href="/bantuan"
              className="shrink-0 px-xl py-sm rounded-full border border-primary text-primary font-bold text-body-md hover:bg-primary hover:text-on-primary transition-all"
            >
              Lihat FAQ
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
