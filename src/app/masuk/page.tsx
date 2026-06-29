import SubHeader from "@/components/layout/SubHeader";
import MasukForm from "./MasukForm";

export const metadata = {
  title: "Masuk - Nyambi",
  description: "Masuk ke akun Nyambi Anda.",
};

export default async function MasukPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;

  return (
    <>
      <SubHeader backHref="/" />

      <main className="py-4xl px-xl md:px-5xl">
        <div className="text-center mb-3xl">
          <h1 className="font-headline-lg text-headline-lg text-forest-deep">Selamat Datang</h1>
          <p className="text-text-mid font-body-md mt-xs">
            Masuk untuk melanjutkan ke akun Anda.
          </p>
        </div>

        <MasukForm from={from} />
      </main>
    </>
  );
}
