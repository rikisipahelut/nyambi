import SubHeader from "@/components/layout/SubHeader";
import DaftarUserForm from "./DaftarUserForm";

export const metadata = {
  title: "Daftar - Nyambi",
  description: "Buat akun Nyambi dan mulai temukan jasa terdekat.",
};

export default function DaftarPage() {
  return (
    <>
      <SubHeader backHref="/" />

      <main className="py-4xl px-xl md:px-5xl">
        <div className="text-center mb-3xl">
          <h1 className="font-headline-lg text-headline-lg text-forest-deep">Buat Akun</h1>
          <p className="text-text-mid font-body-md mt-xs">
            Temukan jasa terbaik di sekitar Anda dengan mudah dan cepat.
          </p>
        </div>

        <DaftarUserForm />
      </main>
    </>
  );
}
