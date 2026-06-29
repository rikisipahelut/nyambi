import SubHeader from "@/components/layout/SubHeader";
import RiwayatClient from "./RiwayatClient";

export const metadata = {
  title: "Riwayat Pesanan - Nyambi",
};

export default function RiwayatPesananPage() {
  return (
    <>
      <SubHeader backHref="/profil" />

      <main className="py-4xl px-xl md:px-5xl max-w-360 mx-auto">
        <div className="mb-3xl">
          <h1 className="font-headline-lg text-headline-lg text-forest-deep">Riwayat Pesanan</h1>
          <p className="text-text-mid font-body-md mt-xs">
            Semua pesanan yang pernah Anda buat.
          </p>
        </div>
        <RiwayatClient />
      </main>
    </>
  );
}
