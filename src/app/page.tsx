"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import StampForm from "@/components/StampForm";
import StampList from "@/components/StampList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Stamp } from "lucide-react";

export default function Home() {
  const [builderAddress, setBuilderAddress] = useState("");
  const [addressToSearch, setAddressToSearch] = useState("");

  const handleSearch = () => {
    setAddressToSearch(builderAddress);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex items-center">
            <Stamp className="h-6 w-6 mr-2" />
            <span className="font-bold text-lg">DevStamp</span>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <ConnectButton />
          </div>
        </div>
      </header>
      
      <main className="flex-1 container py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-8">
            <StampForm />
          </div>
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  View Builder Stamps
                </CardTitle>
                <CardDescription>
                  Enter a builder's wallet address to see all their stamps.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="0x..."
                    value={builderAddress}
                    onChange={(e) => setBuilderAddress(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <Button onClick={handleSearch}>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {addressToSearch && <StampList builderAddress={addressToSearch} />}
          </div>
        </div>
      </main>
    </div>
  );
}
