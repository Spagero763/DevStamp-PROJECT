"use client";

import { useAccount, useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { DEVSTAMP_ABI, DEVSTAMP_ADDRESS } from "@/lib/contract";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Loader2, Stamp as StampIcon, AlertCircle } from "lucide-react";
import { isAddress } from "viem";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import React from "react";

const formSchema = z.object({
  builder: z.string().refine(isAddress, { message: "Please enter a valid wallet address." }),
  reason: z.string().min(3, "Reason must be at least 3 characters.").max(140, "Reason must be 140 characters or less."),
});

export default function StampForm() {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const { data: hash, writeContract, isPending, error: writeError } = useWriteContract();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      builder: "",
      reason: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isConnected) {
      toast({ variant: "destructive", title: "Wallet not connected", description: "Please connect your wallet to stamp a builder." });
      return;
    }
    writeContract({
      address: DEVSTAMP_ADDRESS,
      abi: DEVSTAMP_ABI,
      functionName: "stampBuilder",
      args: [values.builder, values.reason],
    });
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  React.useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "Stamp Successful!",
        description: "Your stamp has been recorded on the blockchain.",
      });
      form.reset();
    }
    if (writeError) {
        toast({
            variant: "destructive",
            title: "Error Stamping",
            description: writeError.message.split('\n')[0] || "An unexpected error occurred."
        })
    }
  }, [isConfirmed, writeError, toast, form]);


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <StampIcon className="h-5 w-5 mr-2" />
          Stamp a Builder
        </CardTitle>
        <CardDescription>
          Give a shout-out to a developer you admire by stamping them on-chain.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="builder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Builder's Address</FormLabel>
                  <FormControl>
                    <Input placeholder="0x..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Stamping</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 'Amazing open source work!'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <Button type="submit" disabled={isPending || !isConnected} className="w-full">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isConfirming ? 'Confirming...' : 'Stamping...'}
                </>
              ) : (
                "Stamp Builder"
              )}
            </Button>
            {!isConnected && (
              <p className="text-sm text-muted-foreground flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                Please connect your wallet to stamp.
              </p>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
