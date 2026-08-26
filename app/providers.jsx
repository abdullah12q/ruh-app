"use client";

import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { SessionProvider } from "next-auth/react";
import PrayerNotificationManager from "@/components/PrayerNotificationManager";

export default function Providers({ children }) {
  // Create QueryClient inside state so it's not shared across requests (SSR safe)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Data stays fresh for 5 minutes by default
            staleTime: 5 * 60 * 1000,
            // Cache data for 10 minutes after component unmount
            gcTime: 10 * 60 * 1000,
            // Only retry once on failure (API calls)
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange={false}
      >
        <QueryClientProvider client={queryClient}>
          <PrayerNotificationManager />
          {children}
        </QueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
