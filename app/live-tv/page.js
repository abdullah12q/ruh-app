import LiveTVBrowser from "@/components/streaming/live-tv/LiveTVBrowser";

export async function generateMetadata() {
  const channels = await getLiveTVChannels();
  const firstChannel = channels.length > 0 ? channels[0] : null;

  return {
    title: firstChannel ? `${firstChannel.name} - Live TV` : "Live TV",
    description:
      "Watch live Islamic TV channels including Quran Channel and Sunnah Channel, streaming 24/7.",
  };
}

async function getLiveTVChannels() {
  try {
    const res = await fetch("https://mp3quran.net/api/v3/live-tv", {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    if (!res.ok) throw new Error("Failed to fetch live TV channels");
    const data = await res.json();
    return data.livetv ?? [];
  } catch (error) {
    console.error("Live TV fetch error:", error);
    return [];
  }
}

export default async function LiveTVPage() {
  const channels = await getLiveTVChannels();
  return <LiveTVBrowser channels={channels} />;
}
