import SubHeader from "@/components/layout/SubHeader";
import Link from "next/link";

export const metadata = {
  title: "Syarat dan Ketentuan - Nyambi",
  description: "Baca syarat dan ketentuan penggunaan platform Nyambi.",
};

const SECTIONS = [
  {
    title: "1. Penerimaan Syarat",
    content: `Dengan mengakses atau menggunakan platform Nyambi (situs web, aplikasi, atau layanan terkait), Anda menyatakan telah membaca, memahami, dan menyetujui Syarat dan Ketentuan ini. Jika Anda tidak menyetujui ketentuan ini, harap hentikan penggunaan platform.

Nyambi berhak mengubah Syarat dan Ketentuan ini sewaktu-waktu. Perubahan akan diberitahukan melalui platform dan berlaku sejak tanggal yang tercantum. Penggunaan platform setelah perubahan dianggap sebagai persetujuan atas ketentuan yang baru.`,
  },
  {
    title: "2. Definisi",
    content: `• **Platform** — situs web, aplikasi, dan seluruh layanan digital yang dioperasikan oleh Nyambi.
• **Pengguna** — setiap individu yang mendaftar dan menggunakan platform sebagai pencari jasa.
• **Pekerja** — individu yang mendaftar dan menawarkan jasa melalui platform.
• **Pesanan** — transaksi jasa yang terjadi antara Pengguna dan Pekerja melalui platform.
• **Konten** — teks, gambar, video, ulasan, dan informasi lain yang diunggah ke platform.`,
  },
  {
    title: "3. Pendaftaran Akun",
    content: `3.1 Untuk menggunakan layanan penuh, Anda wajib membuat akun dengan informasi yang benar, akurat, dan terkini.

3.2 Anda bertanggung jawab menjaga kerahasiaan kata sandi akun dan seluruh aktivitas yang terjadi di bawah akun Anda.

3.3 Anda wajib segera memberitahu Nyambi jika mengetahui adanya akses tidak sah ke akun Anda.

3.4 Nyambi berhak menangguhkan atau menghapus akun yang terbukti memberikan informasi palsu atau melanggar ketentuan ini.`,
  },
  {
    title: "4. Layanan Platform",
    content: `4.1 Nyambi bertindak sebagai perantara yang mempertemukan Pengguna dengan Pekerja. Nyambi bukan pihak dalam perjanjian kerja antara Pengguna dan Pekerja.

4.2 Nyambi tidak menjamin ketersediaan Pekerja pada waktu tertentu dan tidak bertanggung jawab atas keterlambatan atau pembatalan pesanan oleh Pekerja.

4.3 Nyambi berhak mengubah, menambah, atau menghentikan fitur layanan kapan pun tanpa pemberitahuan sebelumnya.`,
  },
  {
    title: "5. Ketentuan Pemesanan",
    content: `5.1 Pesanan dianggap sah setelah Pekerja mengonfirmasi kesanggupan mengerjakan jasa yang diminta.

5.2 Pengguna wajib memberikan informasi yang jelas, lengkap, dan benar terkait jenis pekerjaan, lokasi, dan waktu pelaksanaan.

5.3 Pembatalan pesanan yang dilakukan kurang dari 2 jam sebelum jadwal pelaksanaan dapat dikenakan biaya pembatalan sesuai kebijakan masing-masing Pekerja.

5.4 Perubahan lingkup pekerjaan setelah pesanan dikonfirmasi harus disepakati bersama antara Pengguna dan Pekerja.`,
  },
  {
    title: "6. Pembayaran",
    content: `6.1 Harga jasa disepakati antara Pengguna dan Pekerja sebelum pekerjaan dimulai.

6.2 Pembayaran dilakukan melalui metode yang tersedia di platform atau secara langsung sesuai kesepakatan.

6.3 Nyambi tidak bertanggung jawab atas sengketa pembayaran yang terjadi di luar sistem platform.

6.4 Pengembalian dana (refund) dapat diproses dalam kondisi tertentu sesuai Kebijakan Pengembalian Dana yang berlaku.`,
  },
  {
    title: "7. Ulasan dan Penilaian",
    content: `7.1 Pengguna dipersilakan memberikan ulasan jujur setelah pekerjaan selesai untuk membantu kualitas layanan platform.

7.2 Ulasan yang mengandung konten tidak pantas, fitnah, atau melanggar hukum akan dihapus oleh Nyambi.

7.3 Dilarang memanipulasi ulasan dalam bentuk apa pun, termasuk meminta atau membayar ulasan positif palsu.`,
  },
  {
    title: "8. Larangan Pengguna",
    content: `Pengguna dan Pekerja dilarang:
• Menggunakan platform untuk tujuan ilegal atau melanggar peraturan perundang-undangan yang berlaku.
• Menyebarkan konten yang bersifat SARA, pornografi, kekerasan, atau melanggar hak cipta pihak lain.
• Melakukan penipuan, manipulasi harga, atau praktik curang lainnya.
• Menghubungi Pekerja di luar platform untuk menghindari komisi layanan Nyambi.
• Mencoba meretas, merusak, atau mengganggu sistem dan keamanan platform.`,
  },
  {
    title: "9. Privasi dan Data",
    content: `9.1 Pengumpulan dan penggunaan data pribadi Anda diatur dalam Kebijakan Privasi Nyambi yang merupakan bagian tidak terpisahkan dari Syarat dan Ketentuan ini.

9.2 Dengan menggunakan platform, Anda menyetujui pengumpulan dan penggunaan data sesuai Kebijakan Privasi yang berlaku.

9.3 Nyambi menerapkan langkah-langkah keamanan teknis yang wajar untuk melindungi data pengguna.`,
  },
  {
    title: "10. Batasan Tanggung Jawab",
    content: `10.1 Nyambi tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, atau konsekuensial yang timbul dari penggunaan platform atau layanan Pekerja.

10.2 Nyambi tidak memberikan jaminan bahwa platform akan bebas dari gangguan, kesalahan, atau virus.

10.3 Tanggung jawab maksimal Nyambi kepada pengguna tidak melebihi nilai transaksi yang dipersengketakan.`,
  },
  {
    title: "11. Penyelesaian Sengketa",
    content: `11.1 Sengketa antara Pengguna dan Pekerja diselesaikan terlebih dahulu melalui mediasi internal Nyambi dalam waktu 14 hari kerja.

11.2 Jika mediasi tidak berhasil, sengketa diselesaikan melalui Badan Arbitrase Nasional Indonesia (BANI) atau pengadilan yang berwenang di Jakarta.

11.3 Syarat dan Ketentuan ini tunduk pada hukum Republik Indonesia.`,
  },
  {
    title: "12. Hubungi Kami",
    content: `Jika Anda memiliki pertanyaan mengenai Syarat dan Ketentuan ini, silakan hubungi kami:

• **Email:** legal@nyambi.id
• **Telepon:** (021) 1234-5678
• **Alamat:** Jl. Sudirman No. 123, Jakarta Pusat 10220
• **Jam Operasional:** Senin–Jumat, 09.00–17.00 WIB`,
  },
];

export default function SyaratKetentuanPage() {
  return (
    <>
      <SubHeader backHref="/" />

      <main className="py-4xl px-xl md:px-5xl">
        <div className="max-w-192 mx-auto">
          {/* Header */}
          <div className="mb-4xl">
            <div className="flex items-center gap-md mb-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                <span
                  className="material-symbols-outlined text-primary text-[24px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  gavel
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-forest-deep">
                Syarat dan Ketentuan
              </h1>
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

          {/* Intro */}
          <div className="bg-pale-mint/20 border border-pale-mint rounded-2xl px-xl py-lg mb-4xl flex gap-md">
            <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-xs">
              info
            </span>
            <p className="text-on-surface font-body-md text-body-md">
              Harap baca Syarat dan Ketentuan ini dengan seksama sebelum menggunakan layanan Nyambi.
              Dengan mendaftar atau menggunakan platform, Anda dianggap telah menyetujui seluruh
              ketentuan yang berlaku.
            </p>
          </div>

          {/* Table of Contents */}
          <div className="bg-surface-container-low rounded-2xl p-xl mb-4xl border border-cream-dark">
            <h2 className="font-body-lg text-body-lg text-forest-deep mb-md">Daftar Isi</h2>
            <ol className="space-y-xs">
              {SECTIONS.map((s) => (
                <li key={s.title}>
                  <a
                    href={`#${s.title.replace(/\s+/g, "-").toLowerCase()}`}
                    className="text-primary font-body-md text-body-md hover:underline"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>

          {/* Sections */}
          <div className="space-y-3xl">
            {SECTIONS.map((s) => (
              <section
                key={s.title}
                id={s.title.replace(/\s+/g, "-").toLowerCase()}
                className="scroll-mt-24"
              >
                <h2 className="font-headline-md text-headline-md text-forest-deep mb-lg border-b border-cream-dark pb-md">
                  {s.title}
                </h2>
                <div className="space-y-md">
                  {s.content.split("\n\n").map((para, i) => (
                    <p
                      key={i}
                      className="text-on-surface font-body-md text-body-md leading-relaxed whitespace-pre-line"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Footer CTA */}
          <div className="mt-5xl pt-4xl border-t border-cream-dark flex flex-col sm:flex-row gap-lg">
            <Link
              href="/kebijakan-privasi"
              className="flex-1 flex items-center justify-between px-xl py-lg bg-surface-container-low rounded-2xl border border-cream-dark hover:border-primary group transition-all"
            >
              <div>
                <p className="font-body-lg text-body-lg text-forest-deep">Kebijakan Privasi</p>
                <p className="text-on-surface-variant font-body-md text-body-md">
                  Cara kami mengelola data Anda
                </p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
                arrow_forward
              </span>
            </Link>
            <Link
              href="/"
              className="flex-1 flex items-center justify-between px-xl py-lg bg-surface-container-low rounded-2xl border border-cream-dark hover:border-primary group transition-all"
            >
              <div>
                <p className="font-body-lg text-body-lg text-forest-deep">Kembali ke Beranda</p>
                <p className="text-on-surface-variant font-body-md text-body-md">
                  Mulai gunakan layanan Nyambi
                </p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
