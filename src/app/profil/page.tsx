import SubHeader from "@/components/layout/SubHeader";
import ProfilClient from "./ProfilClient";

export const metadata = {
  title: "Profil Saya - Nyambi",
};

export default function ProfilPage() {
  return (
    <>
      <SubHeader backHref="/" />
      <ProfilClient />
    </>
  );
}
