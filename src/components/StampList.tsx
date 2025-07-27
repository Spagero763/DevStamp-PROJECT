"use client";

import { useContractRead } from "wagmi";
import { DEVSTAMP_ABI, DEVSTAMP_ADDRESS } from "@/lib/contract";
import { useState } from "react";
import { isAddress } from "viem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Eye, Loader2, Info } from "lucide-react";

interface Stamp {
  stamper: `0x${string}`;
  reason: string;
  timestamp: bigint;
}

export default function StampList() {
  const [builder, setBuilder] = useState("");

  const isValidAddress = isAddress(builder);

  const { data: stamps, isLoading, isError, error } = useContractRead({
    address: DEVSTAMP_ADDRESS,
    abi: DEVSTAMP_ABI,
    functionName: "getStampsForBuilder",
    args: [builder as `0x${string}`],
    enabled: isValidAddress,
    watch: true,
  });

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Loading stamps...</span>
        </div>
      );
    }
    
    if (isError) {
        return <p className="text-destructive text-sm">Error fetching stamps: {error?.message.split('\n')[0]}</p>
    }

    if (!isValidAddress) {
        return (
            <div className="flex items-center text-muted-foreground text-sm">
                <Info className="h-4 w-4 mr-2 shrink-0"/>
                Enter a valid builder address to see their stamps.
            </div>
        )
    }

    if (stamps && (stamps as Stamp[]).length > 0) {
      return (
        <ul className="space-y-3">
          {(stamps as Stamp[]).map((stamp, idx) => (
            <li
              key={idx}
              className="border bg-purple-50/50 p-3 rounded-lg text-sm"
            >
              <p className="font-semibold truncate">
                <span className="font-bold text-purple-900">From:</span> {stamp.stamper}
              </p>
              <p className="text-gray-700 mt-1">
                <span className="font-bold text-purple-900">Reason:</span> {stamp.reason}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {new Date(Number(stamp.timestamp) * 1000).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      );
    }
    
    return (
        <div className="flex items-center text-muted-foreground text-sm">
            <Info className="h-4 w-4 mr-2 shrink-0"/>
            No stamps found for this builder yet.
        </div>
    )
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            View Stamps
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            <Input
              placeholder="Enter builder address to view stamps"
              value={builder}
              onChange={(e) => setBuilder(e.target.value)}
            />
            <div className="pt-2">
              {renderContent()}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
