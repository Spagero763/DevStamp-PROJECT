"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { baseSepolia } from "wagmi/chains";
import { WagmiProvider, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { ReactNode } from "react";

const config = getDefaultConfig({
  appName: "DevStamp",
  projectId: "YOUR_WALLETCONNECT_PROJECT_ID", // get from https://cloud.walletconnect.com
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
