"use client";

import { markPayoutPaid } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";

export function PayoutAction({ payoutId }: { payoutId: string }) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      await markPayoutPaid(payoutId);
    } catch (error) {
      console.error("Failed to mark payout:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handlePay}
      disabled={loading}
      className="gap-1.5 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500/10"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <>
          <CheckCircle2 className="h-3.5 w-3.5" />
          Mark Paid
        </>
      )}
    </Button>
  );
}
