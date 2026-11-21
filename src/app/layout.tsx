import type { Metadata } from "next";
import { home } from "@/data/home";
import RootHtml from "@/components/layout/RootHtml";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: home.meta.title,
  description: home.meta.description,
  keywords: home.meta.keywords,
  openGraph: { title: home.meta.title, description: home.meta.description, images: [home.meta.ogImage] },
};

// One root layout for every page (so moving between pages is a client-side navigation, no reload).
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootHtml>
      {children}
    </RootHtml>
  );
}
