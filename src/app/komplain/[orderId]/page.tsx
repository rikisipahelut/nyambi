import SubHeader from "@/components/layout/SubHeader";
import KomplainClient from "./KomplainClient";

export const metadata = { title: "Komplain Pesanan - Nyambi" };

export default async function KomplainPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return (
    <>
      <SubHeader backHref={`/orders/${orderId}`} />
      <main className="py-4xl px-xl md:px-5xl max-w-144 mx-auto">
        <KomplainClient orderId={orderId} />
      </main>
    </>
  );
}
