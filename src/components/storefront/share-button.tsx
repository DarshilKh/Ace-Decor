"use client";

/**
 * components/storefront/share-button.tsx — Share Button
 *
 * DESIGN_SYSTEM §16 item 7: "Enquire on WhatsApp (primary, full width) +
 * Share icon adjacent". Uses the Web Share API where available (mobile browsers,
 * most modern desktop browsers); falls back to copying the URL to the
 * clipboard with a toast confirmation otherwise.
 */

import { Share2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  title: string;
  url: string;
}

export function ShareButton({ title, url }: ShareButtonProps) {
  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (err) {
        // AbortError fires when the user cancels the native share sheet —
        // not an actual failure, so don't surface an error toast for it.
        if (err instanceof Error && err.name !== "AbortError") {
          toast.error("Unable to share. Please try again.");
        }
      }
      return;
    }

    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Unable to copy link. Please copy the URL manually.");
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="icon"
      onClick={handleShare}
      aria-label="Share this product"
    >
      <Share2 className="h-4 w-4" aria-hidden="true" />
    </Button>
  );
}
