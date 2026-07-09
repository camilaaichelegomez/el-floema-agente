import type { ReactNode } from "react";
import { RegistrarServiceWorker } from "@/components/lab/RegistrarServiceWorker";

export default function LabLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <RegistrarServiceWorker />
      {children}
    </>
  );
}
