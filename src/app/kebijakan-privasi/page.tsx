import SubHeader from "@/components/layout/SubHeader";
import Link from "next/link";

export const metadata = {
  title: "Kebijakan Privasi - Nyambi",
  description: "Pelajari cara Nyambi mengumpulkan, menggunakan, dan melindungi data pribadi Anda.",
};

const SECTIONS = [
  {
    title: "1. Informasi yang Kami Kumpulkan",
    content: `Kami mengumpulkan beberapa jenis informasi untuk menyediakan dan meningkatkan layanan kami:

**Data yang Anda berikan:**
• Nama lengkap, alamat email, nomor telepon saat pendaftaran
• Foto profil dan informasi identitas untuk verifikasi Pekerja
• Alamat lokasi yang dimasukkan saat pemesanan jasa
• Ulasan dan penilaian yang Anda tulis

**Data yang dikumpulkan otomatis:**
• Alamat IP, jenis perangkat, dan browser yang Anda gunakan
• Halaman yang dikunjungi, durasi sesi, dan interaksi dalam platform
• Data lokasi (hanya jika Anda memberikan izin)
• Cookie dan teknologi pelacak serupa`,
  },
  {
    title: "2. Cara Kami Menggunakan Data",
    content: `Nyambi menggunakan data Anda untuk keperluan berikut:

• **Operasional layanan** — memproses pendaftaran, menampilkan profil pekerja, memfasilitasi pemesanan
• **Komunikasi** — mengirimkan konfirmasi pesanan, notifikasi, dan pembaruan layanan
• **Keamanan** — mendeteksi dan mencegah penipuan atau penyalahgunaan platform
• **Peningkatan layanan** — menganalisis penggunaan platform untuk meningkatkan fitur dan pengalaman pengguna
• **Pemasaran** — mengirimkan penawaran dan informasi layanan (dapat Anda nonaktifkan kapan saja)
• **Kepatuhan hukum** — memenuhi kewajiban hukum yang berlaku di Indonesia`,
  },
  {
    title: "3. Berbagi Data dengan Pihak Ketiga",
    content: `Nyambi tidak menjual data pribadi Anda kepada pihak ketiga. Kami hanya berbagi data dalam kondisi berikut:

• **Pekerja** — nama, nomor telepon, dan alamat dibagikan kepada Pekerja yang Anda pesan untuk keperluan pelaksanaan jasa
• **Mitra pembayaran** — data transaksi diteruskan ke penyedia layanan pembayaran yang terverifikasi
• **Penyedia layanan teknologi** — mitra hosting, analitik, dan komunikasi yang terikat perjanjian kerahasiaan
• **Penegak hukum** — jika diwajibkan oleh hukum atau perintah pengadilan yang sah`,
  },
  {
    title: "4. Cookie dan Teknologi Pelacak",
    content: `Kami menggunakan cookie dan teknologi serupa untuk:

• Menjaga sesi login Anda tetap aktif
• Mengingat preferensi dan pengaturan Anda
• Menganalisis trafik dan perilaku pengguna di platform
• Menyajikan konten yang lebih relevan

Anda dapat menonaktifkan cookie melalui pengaturan browser, namun beberapa fitur platform mungkin tidak berfungsi optimal.`,
  },
  {
    title: "5. Keamanan Data",
    content: `Kami menerapkan langkah-langkah keamanan teknis dan organisasi untuk melindungi data Anda:

• Enkripsi data menggunakan protokol HTTPS/TLS
• Penyimpanan kata sandi dalam bentuk hash yang tidak dapat dibaca
• Pembatasan akses data hanya untuk karyawan yang membutuhkan
• Pemantauan sistem secara berkala untuk mendeteksi ancaman

Namun, tidak ada sistem yang sepenuhnya aman. Kami mendorong Anda untuk menggunakan kata sandi yang kuat dan tidak membagikannya kepada siapa pun.`,
  },
  {
    title: "6. Penyimpanan dan Penghapusan Data",
    content: `6.1 Data akun aktif disimpan selama akun Anda aktif dan selama diperlukan untuk keperluan layanan.

6.2 Jika Anda menghapus akun, data pribadi Anda akan dihapus dalam 30 hari, kecuali data yang wajib disimpan sesuai hukum.

6.3 Data transaksi dan log keuangan disimpan selama minimum 5 tahun sesuai ketentuan perpajakan Indonesia.

6.4 Anda dapat meminta salinan atau penghapusan data dengan menghubungi tim kami melalui email privacy@nyambi.id.`,
  },
  {
    title: "7. Hak-hak Anda",
    content: `Sebagai pengguna, Anda memiliki hak untuk:

• **Akses** — meminta salinan data pribadi yang kami miliki tentang Anda
• **Koreksi** — memperbarui data yang tidak akurat atau tidak lengkap
• **Penghapusan** — meminta penghapusan data pribadi Anda (dengan batasan hukum tertentu)
• **Pembatasan** — meminta pembatasan pemrosesan data dalam kondisi tertentu
• **Portabilitas** — menerima data Anda dalam format yang dapat dibaca mesin
• **Keberatan** — menolak pemrosesan data untuk tujuan pemasaran langsung

Untuk menggunakan hak-hak ini, hubungi kami di privacy@nyambi.id.`,
  },
  {
    title: "8. Privasi Anak-anak",
    content: `Platform Nyambi tidak ditujukan untuk individu di bawah usia 17 tahun. Kami tidak secara sengaja mengumpulkan data pribadi dari anak-anak.

Jika Anda mengetahui bahwa anak di bawah umur telah memberikan data pribadi kepada kami, segera hubungi kami agar kami dapat menghapus informasi tersebut.`,
  },
  {
    title: "9. Perubahan Kebijakan",
    content: `Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan signifikan akan diberitahukan melalui:

• Notifikasi dalam aplikasi atau email ke akun terdaftar Anda
• Pembaruan tanggal "Terakhir diperbarui" di bagian atas halaman ini

Penggunaan platform setelah perubahan berlaku dianggap sebagai persetujuan atas kebijakan yang baru.`,
  },
  {
    title: "10. Kontak Privasi",
    content: `Untuk pertanyaan, permintaan, atau keluhan terkait privasi data Anda, hubungi:

• **Email:** privacy@nyambi.id
• **Telepon:** (021) 1234-5678
• **Alamat:** Jl. Sudirman No. 123, Jakarta Pusat 10220
• **Jam Operasional:** Senin–Jumat, 09.00–17.00 WIB

Kami berkomitmen merespons setiap permintaan terkait privasi dalam 14 hari kerja.`,
  },
];

export default function KebijakanPrivasiPage() {
  return (
    <>
      <SubHeader backHref="/" />

      <main className="py-4xl px-xl md:px-5xl">
        <div className="max-w-192 mx-auto">
          <div className="mb-4xl">
            <div className="flex items-center gap-md mb-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  shield
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-forest-deep">Kebijakan Privasi</h1>
            </div>
            <div className="flex flex-wrap gap-lg text-on-surface-variant font-body-md text-body-md">
              <span className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                Berlaku sejak: 1 Januari 2025
              </span>
              <span className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-[16px]">update</span>
                Terakhir diperbarui: 1 Juni 2025
              </span>
            </div>
          </div>

          <div className="bg-pale-mint/20 border border-pale-mint rounded-2xl px-xl py-lg mb-4xl flex gap-md">
            <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-xs">info</span>
            <p className="text-on-surface font-body-md text-body-md">
              Nyambi berkomitmen melindungi privasi Anda. Kebijakan ini menjelaskan data apa yang
              kami kumpulkan, bagaimana kami menggunakannya, dan hak-hak Anda atas data tersebut.
            </p>
          </div>

          <div className="bg-surface-container-low rounded-2xl p-xl mb-4xl border border-cream-dark">
            <h2 className="font-body-lg text-body-lg text-forest-deep mb-md">Daftar Isi</h2>
            <ol className="space-y-xs">
              {SECTIONS.map((s) => (
                <li key={s.title}>
                  <a href={`#${s.title.replace(/\s+/g, "-").toLowerCase()}`} className="text-primary font-body-md text-body-md hover:underline">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-3xl">
            {SECTIONS.map((s) => (
              <section key={s.title} id={s.title.replace(/\s+/g, "-").toLowerCase()} className="scroll-mt-24">
                <h2 className="font-headline-md text-headline-md text-forest-deep mb-lg border-b border-cream-dark pb-md">
                  {s.title}
                </h2>
                <div className="space-y-md">
                  {s.content.split("\n\n").map((para, i) => (
                    <p key={i} className="text-on-surface font-body-md text-body-md leading-relaxed whitespace-pre-line">
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-5xl pt-4xl border-t border-cream-dark flex flex-col sm:flex-row gap-lg">
            <Link href="/syarat-ketentuan" className="flex-1 flex items-center justify-between px-xl py-lg bg-surface-container-low rounded-2xl border border-cream-dark hover:border-primary group transition-all">
              <div>
                <p className="font-body-lg text-body-lg text-forest-deep">Syarat dan Ketentuan</p>
                <p className="text-on-surface-variant font-body-md text-body-md">Aturan penggunaan platform</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">arrow_forward</span>
            </Link>
            <Link href="/bantuan" className="flex-1 flex items-center justify-between px-xl py-lg bg-surface-container-low rounded-2xl border border-cream-dark hover:border-primary group transition-all">
              <div>
                <p className="font-body-lg text-body-lg text-forest-deep">Pusat Bantuan</p>
                <p className="text-on-surface-variant font-body-md text-body-md">Pertanyaan yang sering diajukan</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">arrow_forward</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
