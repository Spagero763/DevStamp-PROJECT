"use client";

import { useContractRead } from "wagmi";
import { DEVSTAMP_ABI, DEVSTAMP_ADDRESS } from "@/lib/contract";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Calendar, MessageSquare, User } from "lucide-react";
import { format } from "date-fns";
import { isAddress } from "viem";

interface Stamp {
  stamper: `0x${string}`;
  reason: string;
  timestamp: bigint;
}

interface StampListProps {
  builderAddress: string;
}

export default function StampList({ builderAddress }: StampListProps) {
  const isValidAddress = isAddress(builderAddress);

  const { data: stamps, isLoading, isError, error } = useContractRead({
    address: DEVSTAMP_ADDRESS,
    abi: DEVSTAMP_ABI,
    functionName: "getStampsForBuilder",
    args: [builderAddress as `0x${string}`],
    enabled: isValidAddress,
  });

  if (!isValidAddress) {
    return (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Invalid Address</AlertTitle>
            <AlertDescription>
                Please enter a valid Ethereum wallet address.
            </AlertDescription>
        </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Fetching Stamps</AlertTitle>
        <AlertDescription>
          {error?.message.split('\n')[0] || "Could not fetch stamps for this address."}
        </AlertDescription>
      </Alert>
    );
  }

  if (!stamps || (stamps as Stamp[]).length === 0) {
    return (
      <Card className="text-center py-10">
        <CardHeader>
          <CardTitle>No Stamps Yet</CardTitle>
          <CardDescription>This builder hasn't received any stamps. Be the first!</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Stamps for {`${builderAddress.slice(0, 6)}...${builderAddress.slice(-4)}`}</h3>
      {(stamps as Stamp[]).map((stamp, index) => (
        <Card key={index}>
          <CardContent className="p-4 grid gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4"/>
                <span className="font-mono">{`${stamp.stamper.slice(0, 6)}...${stamp.stamper.slice(-4)}`}</span>
            </div>
            <p className="font-semibold flex items-start gap-2">
                <MessageSquare className="h-4 w-4 mt-1 shrink-0 text-muted-foreground"/>
                <span>{stamp.reason}</span>
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{format(new Date(Number(stamp.timestamp) * 1000), "PPP")}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
