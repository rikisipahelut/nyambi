import SubHeader from "@/components/layout/SubHeader";
import NotifikasiClient from "./NotifikasiClient";

export const metadata = { title: "Notifikasi - Nyambi" };

export default function NotifikasiPage() {
  return (
    <>
      <SubHeader backHref="/profil" title="Notifikasi" />
      <main className="py-4xl px-xl md:px-5xl max-w-360 mx-auto">
        <NotifikasiClient />
      </main>
    </>
  );
}
