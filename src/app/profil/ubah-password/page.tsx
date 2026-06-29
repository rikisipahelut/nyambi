import SubHeader from "@/components/layout/SubHeader";
import UbahPasswordClient from "./UbahPasswordClient";

export const metadata = { title: "Ubah Password - Nyambi" };

export default function UbahPasswordPage() {
  return (
    <>
      <SubHeader backHref="/profil" title="Ubah Password" />
      <main className="py-4xl px-xl md:px-5xl max-w-360 mx-auto">
        <UbahPasswordClient />
      </main>
    </>
  );
}
