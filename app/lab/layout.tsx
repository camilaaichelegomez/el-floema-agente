import type { Metadata } from "next";
import type { ReactNode } from "react";
import { RegistrarServiceWorker } from "@/components/lab/RegistrarServiceWorker";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function LabLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <RegistrarServiceWorker />
      {children}
    </>
  );
}
