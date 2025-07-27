"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import StampForm from "@/components/StampForm";
import StampList from "@/components/StampList";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold text-center">DevStamp 🛠️</h1>
        <p className="text-center text-gray-600">
          Stamp builders onchain for their contributions!
        </p>
        <div className="flex justify-center">
          <ConnectButton />
        </div>
        <StampForm />
        <StampList />
      </div>
    </main>
  );
}
