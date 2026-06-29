import SubHeader from "@/components/layout/SubHeader";
import EditProfilPekerjaClient from "./EditProfilPekerjaClient";

export const metadata = {
  title: "Edit Profil Pekerja - Nyambi",
};

export default function EditProfilPekerjaPage() {
  return (
    <>
      <SubHeader backHref="/profil" title="Edit Profil Pekerja" />

      <main className="py-4xl px-xl md:px-5xl">
        <EditProfilPekerjaClient />
      </main>
    </>
  );
}
