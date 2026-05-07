"use client";

import type { MouseEvent, ReactNode } from "react";
import { useState } from "react";

import { Card, CardContent } from "@/components/ui/card";

interface TactileCardProps {
  children: ReactNode;
}

export function TactileCard({ children }: TactileCardProps) {
  const [transform, setTransform] = useState("perspective(900px) rotateX(0deg) rotateY(0deg)");

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    setTransform(
      `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg)`,
    );
  }

  return (
    <Card
      className="group h-full border-slate-200 transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
      style={{ transform }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTransform("perspective(900px) rotateX(0deg) rotateY(0deg)")}
    >
      <CardContent className="p-5">{children}</CardContent>
    </Card>
  );
}
