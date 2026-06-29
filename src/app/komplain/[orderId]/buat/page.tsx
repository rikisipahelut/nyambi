import SubHeader from "@/components/layout/SubHeader";
import BuatKomplainClient from "./BuatKomplainClient";

export const metadata = { title: "Ajukan Komplain - Nyambi" };

export default async function BuatKomplainPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return (
    <>
      <SubHeader backHref={`/orders/${orderId}`} />
      <main className="py-4xl px-xl md:px-5xl max-w-144 mx-auto">
        <BuatKomplainClient orderId={orderId} />
      </main>
    </>
  );
}
