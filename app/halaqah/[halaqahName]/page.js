import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import HalaqahDetails from "@/components/halaqah/Details/HalaqahDetails";
import { getHalaqahData } from "@/lib/actions/halaqahData";

export async function generateMetadata({ params }) {
  const { halaqahName } = await params;

  return {
    title: `Halaqah - ${halaqahName}`,
    description: `Join this halaqah and read the Quran with others`,
  };
}

export default async function HalaqahDetailsPage({ params, searchParams }) {
  const session = await auth();

  if (!session) {
    redirect("/halaqah");
  }

  const { halaqahName } = await params;
  const { halaqahId } = await searchParams;

  const halaqahData = await getHalaqahData(halaqahId);

  const halaqah = halaqahData?.halaqah;

  if (!halaqah || halaqah.name !== halaqahName) return notFound();

  return (
    <div className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <HalaqahDetails halaqahId={halaqahId} halaqah={halaqah} />
    </div>
  );
}
