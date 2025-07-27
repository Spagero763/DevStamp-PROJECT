"use client";

import { useContractRead } from "wagmi";
import { DEVSTAMP_ABI, DEVSTAMP_ADDRESS } from "@/lib/contract";
import { useState } from "react";
import { isAddress } from "viem";

interface Stamp {
  stamper: `0x${string}`;
  reason: string;
  timestamp: bigint;
}

export default function StampList() {
  const [builder, setBuilder] = useState("");

  const isValidAddress = isAddress(builder);

  const { data: stamps } = useContractRead({
    address: DEVSTAMP_ADDRESS,
    abi: DEVSTAMP_ABI,
    functionName: "getStampsForBuilder",
    args: [builder as `0x${string}`],
    enabled: isValidAddress,
    watch: true,
  });

  return (
    <div className="bg-white p-4 rounded-xl shadow-md max-w-md mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">View Stamps</h2>
      <input
        className="border p-2 mb-4 w-full rounded"
        placeholder="Enter builder address"
        value={builder}
        onChange={(e) => setBuilder(e.target.value)}
      />
      {stamps && (stamps as Stamp[]).length > 0 ? (
        <ul className="space-y-2">
          {(stamps as any[]).map((stamp, idx) => (
            <li
              key={idx}
              className="border bg-purple-50 text-purple-900 px-3 py-2 rounded"
            >
              <p><b>Stamper:</b> {stamp.stamper}</p>
              <p><b>Reason:</b> {stamp.reason}</p>
              <p><b>Timestamp:</b> {new Date(Number(stamp.timestamp) * 1000).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">{isValidAddress ? 'No stamps yet for this builder.' : 'Enter a valid address to see stamps.'}</p>
      )}
    </div>
  );
}
