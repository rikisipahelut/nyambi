import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-forest-deep border-t border-on-primary-fixed-variant">
      <div className="flex flex-col md:flex-row justify-between items-center py-3xl px-xl md:px-5xl max-w-360 mx-auto w-full">
        <div className="mb-2xl md:mb-0 text-center md:text-left">
          <span className="font-headline-md text-headline-md text-surface block mb-sm">Nyambi</span>
          <p className="text-pale-mint text-body-md font-body-md">
            © 2025 Nyambi. Solusi Pekerja Terampil &amp; Terpercaya.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-xl">
          <Link href="/syarat-ketentuan" className="text-surface-variant/80 hover:text-surface transition-colors font-body-md text-body-md hover:underline">
            Syarat &amp; Ketentuan
          </Link>
          <Link href="/kebijakan-privasi" className="text-surface-variant/80 hover:text-surface transition-colors font-body-md text-body-md hover:underline">
            Kebijakan Privasi
          </Link>
          <Link href="/bantuan" className="text-surface-variant/80 hover:text-surface transition-colors font-body-md text-body-md hover:underline">
            Bantuan
          </Link>
          <Link href="/kontak" className="text-surface-variant/80 hover:text-surface transition-colors font-body-md text-body-md hover:underline">
            Kontak Kami
          </Link>
        </div>
        <div className="mt-2xl md:mt-0 flex gap-lg">
          <a
            href="#"
            className="w-10 h-10 rounded-full border border-on-primary-fixed-variant flex items-center justify-center text-pale-mint hover:bg-primary-container transition-all"
          >
            <span className="material-symbols-outlined">face_nod</span>
          </a>
          <a
            href="#"
            className="w-10 h-10 rounded-full border border-on-primary-fixed-variant flex items-center justify-center text-pale-mint hover:bg-primary-container transition-all"
          >
            <span className="material-symbols-outlined">share</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
