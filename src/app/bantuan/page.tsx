import Link from "next/link";

export const metadata = {
  title: "Pusat Bantuan - Nyambi",
  description: "Temukan jawaban atas pertanyaan umum seputar layanan Nyambi.",
};

const FAQ_GROUPS = [
  {
    icon: "manage_accounts",
    group: "Akun & Pendaftaran",
    items: [
      {
        q: "Bagaimana cara membuat akun Nyambi?",
        a: "Klik tombol \"Daftar\" di sudut kanan atas halaman, isi formulir dengan nama, email, nomor telepon, dan password. Verifikasi email Anda, dan akun siap digunakan.",
      },
      {
        q: "Apakah pendaftaran di Nyambi gratis?",
        a: "Ya, pendaftaran sebagai pengguna (pencari jasa) sepenuhnya gratis. Pendaftaran sebagai pekerja juga gratis, namun Nyambi mengenakan komisi layanan untuk setiap transaksi yang berhasil.",
      },
      {
        q: "Saya lupa password, bagaimana cara mereset?",
        a: "Klik \"Lupa password?\" di halaman Masuk, masukkan email terdaftar Anda, dan kami akan mengirimkan tautan untuk membuat password baru.",
      },
      {
        q: "Bisakah saya menggunakan satu akun untuk pesan jasa sekaligus menawarkan jasa?",
        a: "Ya, satu akun Nyambi dapat digunakan untuk kedua peran. Anda dapat beralih antara mode Pengguna dan Pekerja dari halaman profil.",
      },
    ],
  },
  {
    icon: "handshake",
    group: "Pemesanan Jasa",
    items: [
      {
        q: "Bagaimana cara memesan jasa di Nyambi?",
        a: "Cari kategori atau pekerja yang Anda butuhkan, buka profil pekerja, klik \"Hubungi Sekarang\", isi detail pekerjaan (tanggal, waktu, alamat, deskripsi), lalu kirim pesanan.",
      },
      {
        q: "Berapa lama pekerja merespons pesanan?",
        a: "Rata-rata pekerja merespons dalam waktu 30 menit hingga 2 jam. Setiap profil pekerja menampilkan estimasi waktu respons mereka.",
      },
      {
        q: "Apakah saya bisa membatalkan pesanan?",
        a: "Pesanan dapat dibatalkan tanpa biaya jika dilakukan lebih dari 2 jam sebelum jadwal. Pembatalan mendadak (kurang dari 2 jam) dapat dikenakan biaya pembatalan sesuai kebijakan pekerja.",
      },
      {
        q: "Apa yang harus dilakukan jika pekerja tidak datang tepat waktu?",
        a: "Hubungi pekerja langsung melalui chat platform. Jika tidak ada respons lebih dari 30 menit dari jadwal, Anda dapat melaporkan melalui tombol \"Laporkan Masalah\" dan tim kami akan membantu menyelesaikannya.",
      },
    ],
  },
  {
    icon: "payments",
    group: "Pembayaran",
    items: [
      {
        q: "Metode pembayaran apa yang tersedia?",
        a: "Nyambi mendukung transfer bank, dompet digital (GoPay, OVO, Dana, ShopeePay), kartu kredit/debit, dan pembayaran tunai langsung kepada pekerja.",
      },
      {
        q: "Kapan saya harus membayar — sebelum atau sesudah jasa dikerjakan?",
        a: "Tergantung kesepakatan dengan pekerja. Beberapa pekerja meminta DP (uang muka), sebagian lain menerima pembayaran penuh setelah pekerjaan selesai.",
      },
      {
        q: "Bagaimana proses pengembalian dana (refund)?",
        a: "Refund dapat diajukan dalam 24 jam setelah pekerjaan selesai jika ada ketidaksesuaian layanan. Pengajuan melalui menu \"Pesanan\" > \"Ajukan Refund\". Proses pencairan 3–7 hari kerja.",
      },
    ],
  },
  {
    icon: "star",
    group: "Kualitas & Keamanan",
    items: [
      {
        q: "Bagaimana Nyambi memverifikasi pekerja?",
        a: "Setiap pekerja melalui proses verifikasi identitas (KTP), pengecekan rekam jejak, dan uji kompetensi dasar sebelum profilnya ditampilkan. Pekerja dengan badge \"Verified\" telah lulus semua tahapan.",
      },
      {
        q: "Apa yang harus dilakukan jika hasil kerja tidak memuaskan?",
        a: "Pertama, komunikasikan langsung dengan pekerja untuk perbaikan. Jika tidak terselesaikan, ajukan klaim melalui menu \"Laporkan Masalah\" dalam 24 jam setelah pekerjaan selesai.",
      },
      {
        q: "Apakah pekerjaan dilindungi asuransi?",
        a: "Nyambi sedang mengembangkan program proteksi untuk pesanan. Saat ini, kami menyarankan Anda mendiskusikan garansi pekerjaan langsung dengan pekerja sebelum memulai.",
      },
    ],
  },
  {
    icon: "work",
    group: "Untuk Pekerja",
    items: [
      {
        q: "Bagaimana cara mendaftar sebagai pekerja di Nyambi?",
        a: "Klik \"Daftar Jadi Pekerja\" di beranda, isi data identitas, pilih kategori keahlian, dan lengkapi profil Anda. Tim kami akan memverifikasi dalam 1×24 jam.",
      },
      {
        q: "Berapa komisi yang diambil Nyambi?",
        a: "Nyambi mengenakan komisi layanan sebesar 10–15% dari nilai transaksi, tergantung kategori jasa. Komisi dipotong otomatis saat pembayaran diterima.",
      },
      {
        q: "Bagaimana cara meningkatkan peringkat profil saya?",
        a: "Selesaikan pesanan tepat waktu, respons cepat terhadap permintaan, kumpulkan ulasan positif dari pelanggan, dan lengkapi semua bagian profil Anda termasuk foto dan portofolio.",
      },
    ],
  },
];

export default function BantuanPage() {
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
        <div className="max-w-192 mx-auto">
          {/* Header */}
          <div className="text-center mb-4xl">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-lg">
              <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                help
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-forest-deep mb-md">Pusat Bantuan</h1>
            <p className="text-text-mid font-body-md max-w-144 mx-auto">
              Temukan jawaban atas pertanyaan umum di bawah. Tidak menemukan jawabannya?{" "}
              <Link href="/kontak" className="text-primary font-bold hover:underline">
                Hubungi kami
              </Link>
              .
            </p>
          </div>

          {/* FAQ Groups */}
          <div className="space-y-3xl">
            {FAQ_GROUPS.map((group) => (
              <section key={group.group}>
                <div className="flex items-center gap-md mb-xl">
                  <span className="material-symbols-outlined text-primary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {group.icon}
                  </span>
                  <h2 className="font-headline-md text-headline-md text-forest-deep">{group.group}</h2>
                </div>
                <div className="space-y-md">
                  {group.items.map((item) => (
                    <details
                      key={item.q}
                      className="bg-surface-container-low border border-cream-dark rounded-2xl group"
                    >
                      <summary className="flex items-center justify-between px-xl py-lg cursor-pointer list-none gap-md">
                        <span className="font-body-lg text-body-lg text-on-surface">{item.q}</span>
                        <span className="material-symbols-outlined text-on-surface-variant shrink-0 transition-transform group-open:rotate-180">
                          expand_more
                        </span>
                      </summary>
                      <div className="px-xl pb-lg">
                        <div className="h-px bg-cream-dark mb-lg" />
                        <p className="text-on-surface font-body-md text-body-md leading-relaxed">{item.a}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Still need help */}
          <div className="mt-5xl bg-forest-deep rounded-4xl p-2xl md:p-4xl text-center relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-48 h-48 bg-cta-amber/10 rounded-full blur-3xl" aria-hidden="true" />
            <span className="material-symbols-outlined text-pale-mint text-[40px] mb-lg block" style={{ fontVariationSettings: "'FILL' 1" }}>
              support_agent
            </span>
            <h2 className="font-headline-md text-headline-md text-surface-container-lowest mb-md">
              Masih butuh bantuan?
            </h2>
            <p className="text-pale-mint font-body-md mb-3xl max-w-144 mx-auto">
              Tim support kami siap membantu Anda setiap hari Senin–Jumat, pukul 09.00–17.00 WIB.
            </p>
            <Link
              href="/kontak"
              className="inline-block bg-cta-amber text-forest-deep px-4xl py-md rounded-full font-bold text-body-lg hover:scale-105 transition-all shadow-lg active:scale-95"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
