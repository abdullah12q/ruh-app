"use client";

import { useEffect, useState } from "react";
import { Tv, Signal } from "lucide-react";
import ChannelCard from "./ChannelCard";
import StreamingHeader from "../StreamingHeader";
import StreamingFooter from "../StreamingFooter";
import StreamingActivePlayer from "../StreamingActivePlayer";
import StreamingGrid from "../StreamingGrid";
import NoStreamingState from "../NoStreamingState";

export default function LiveTVBrowser({ channels }) {
  const [activeChannel, setActiveChannel] = useState(
    channels.length > 0 ? channels[0] : null,
  );

  // Update the tab title dynamically lma n8yr channels
  useEffect(() => {
    if (activeChannel) {
      document.title = `${activeChannel.name} - Live TV`;
    }
  }, [activeChannel]);

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <StreamingHeader liveChannels={channels} />

        {/* No Channels State */}
        {channels.length === 0 && (
          <NoStreamingState
            Icon={Tv}
            title="Channels"
            subTitle="live channels"
          />
        )}

        {channels.length > 0 && (
          <>
            {/* Active Player */}
            <StreamingActivePlayer
              activePlayer={activeChannel}
              setActivePlayer={setActiveChannel}
            />

            {/* Channel Grid */}
            <StreamingGrid Icon={Signal} type="Channel" count={channels.length}>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {channels.map((channel, index) => (
                  <ChannelCard
                    key={channel.id}
                    channel={channel}
                    isActive={activeChannel?.id === channel.id}
                    onClick={() => setActiveChannel(channel)}
                    index={index}
                  />
                ))}
              </div>
            </StreamingGrid>

            {/* Footer */}
            <StreamingFooter
              Icon={Tv}
              title="24/7 Islamic Broadcasting"
              subTitle="Channels stream continuously. Select any channel above to
                  start watching live."
            />
          </>
        )}
      </div>
    </div>
  );
}
