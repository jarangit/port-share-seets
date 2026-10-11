"use client";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* Fade — mount/unmount wrapper with a soft opacity transition.
   Fades in on appear, fades out before unmounting.
   Respects prefers-reduced-motion (appears/disappears instantly). */
export function Fade({ show, children }: { show: boolean; children: ReactNode }) {
  const [render, setRender] = useState(show);
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    let inner: ReturnType<typeof setTimeout> | undefined;
    // All state updates stay inside timeout callbacks so the effect
    // body itself never sets state synchronously.
    const outer = setTimeout(() => {
      if (show) {
        setRender(true);
        inner = setTimeout(() => setVisible(true), 20);
      } else {
        setVisible(false);
        inner = setTimeout(() => setRender(false), 200);
      }
    }, 0);
    return () => {
      clearTimeout(outer);
      if (inner) clearTimeout(inner);
    };
  }, [show]);

  if (!render) return null;
  return (
    <div
      className={cn(
        "transition-opacity duration-200 ease-out motion-reduce:transition-none",
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      {children}
    </div>
  );
}
