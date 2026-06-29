import SubHeader from "@/components/layout/SubHeader";
import FavoritClient from "./FavoritClient";

export const metadata = { title: "Pekerja Favorit - Nyambi" };

export default function PekerjaFavoritPage() {
  return (
    <>
      <SubHeader backHref="/profil" />
      <main className="py-4xl px-xl md:px-5xl max-w-360 mx-auto">
        <div className="mb-3xl">
          <h1 className="font-headline-lg text-headline-lg text-forest-deep">Pekerja Favorit</h1>
          <p className="text-text-mid font-body-md mt-xs">Pekerja yang Anda simpan sebagai favorit.</p>
        </div>
        <FavoritClient />
      </main>
    </>
  );
}
