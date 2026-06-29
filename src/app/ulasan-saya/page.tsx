import SubHeader from "@/components/layout/SubHeader";
import UlasanClient from "./UlasanClient";

export const metadata = { title: "Ulasan Saya - Nyambi" };

export default function UlasanSayaPage() {
  return (
    <>
      <SubHeader backHref="/profil" title="Ulasan Saya" />
      <main className="py-4xl px-xl md:px-5xl max-w-360 mx-auto">
        <UlasanClient />
      </main>
    </>
  );
}
