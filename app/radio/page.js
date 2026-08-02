import RadioBrowser from "@/components/streaming/radio/RadioBrowser";

export const metadata = {
  title: "Radio | Islamic Radio Stations",
  description:
    "Listen to 192+ live Islamic radio stations streaming Quran recitations, tafsir, and Islamic content 24/7.",
};

async function getRadioStations() {
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/uthumany/radio-api/main/client/public/api/stations.json",
      { next: { revalidate: 3600 } }, // Cache for 1 hour
    );
    if (!res.ok) throw new Error("Failed to fetch radio stations");
    const data = await res.json();
    return data.stations ?? [];
  } catch (error) {
    console.error("Radio stations fetch error:", error);
    return [];
  }
}

export default async function RadioPage() {
  const stations = await getRadioStations();
  return <RadioBrowser stations={stations} />;
}
