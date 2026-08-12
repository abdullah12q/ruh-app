import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import HalaqahDetails from "@/components/halaqah/Details/HalaqahDetails";
import { getHalaqahData } from "@/lib/actions/halaqahData";

export async function generateMetadata({ params }) {
  const { halaqahId } = await params;

  const halaqahData = await getHalaqahData(halaqahId);

  const halaqah = halaqahData?.halaqah;

  return {
    title: `Halaqah - ${halaqah.name}`,
    description: `Join this halaqah and read the Quran with others`,
  };
}

export default async function HalaqahDetailsPage({ params }) {
  const session = await auth();

  if (!session) {
    redirect("/halaqah");
  }

  const { halaqahId } = await params;

  const halaqahData = await getHalaqahData(halaqahId);

  const halaqah = halaqahData?.halaqah;

  if (!halaqah) return notFound();

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <HalaqahDetails halaqahId={halaqahId} halaqah={halaqah} />
    </div>
  );
}
