"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function BookSession() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleBooking = async () => {
    try {
      setIsLoading(true);
      // Simulate booking delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Session Booked!", {
        description: "Your therapy session has been confirmed.",
        duration: 3000,
      });

      // Redirect to the therapy session
      router.push("/therapy/343");
    } catch (error) {
      toast.error("Booking Failed", {
        description: "Please Try Again Later!",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Book a Session</h3>
      <p className="text-sm text-muted-foreground">30-minute therapy session</p>
      <Button onClick={handleBooking} disabled={isLoading} className="w-full">
        {isLoading ? "Processing..." : "Book Now"}
      </Button>
    </div>
  );
}