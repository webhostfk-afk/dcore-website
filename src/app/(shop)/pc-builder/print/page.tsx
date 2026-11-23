import type { Metadata } from "next";
import PcBuildPrint from "@/components/pcbuilder/PcBuildPrint";
import { SLOTS } from "@/lib/pcbuilder";

export const metadata: Metadata = { title: "PC Builder - Print", robots: { index: false } };

export default function PcBuilderPrintPage() {
  return <PcBuildPrint slots={SLOTS} />;
}
