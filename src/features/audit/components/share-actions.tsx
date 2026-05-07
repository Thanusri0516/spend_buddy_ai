"use client";

import { Check, Copy, Linkedin, Twitter } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function ShareActions() {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="outline" onClick={copyLink}>
        {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
        {copied ? "Copied" : "Copy link"}
      </Button>
      <Button type="button" variant="outline" asChild>
        <a href="https://twitter.com/intent/tweet" target="_blank" rel="noreferrer">
          <Twitter className="size-4" aria-hidden="true" />
          Share
        </a>
      </Button>
      <Button type="button" variant="outline" asChild>
        <a href="https://www.linkedin.com/sharing/share-offsite/" target="_blank" rel="noreferrer">
          <Linkedin className="size-4" aria-hidden="true" />
          Post
        </a>
      </Button>
    </div>
  );
}
