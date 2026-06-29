import SubHeader from "@/components/layout/SubHeader";
import PesananMasukClient from "./PesananMasukClient";

export const metadata = { title: "Pesanan Masuk - Nyambi" };

export default function PesananMasukPage() {
  return (
    <>
      <SubHeader backHref="/profil" />
      <main className="py-4xl px-xl md:px-5xl max-w-360 mx-auto">
        <div className="mb-3xl">
          <h1 className="font-headline-lg text-headline-lg text-forest-deep">Pesanan Masuk</h1>
          <p className="text-text-mid font-body-md mt-xs">Pesanan dari pelanggan yang ditujukan kepada Anda.</p>
        </div>
        <PesananMasukClient />
      </main>
    </>
  );
}
