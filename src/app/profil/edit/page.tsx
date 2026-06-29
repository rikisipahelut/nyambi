import SubHeader from "@/components/layout/SubHeader";
import EditProfilClient from "./EditProfilClient";

export const metadata = { title: "Edit Profil - Nyambi" };

export default function EditProfilPage() {
  return (
    <>
      <SubHeader backHref="/profil" title="Edit Profil" />
      <main className="py-4xl px-xl md:px-5xl max-w-360 mx-auto">
        <EditProfilClient />
      </main>
    </>
  );
}
