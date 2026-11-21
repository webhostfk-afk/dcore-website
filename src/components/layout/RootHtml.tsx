import ShopProvider from "@/components/shop/ShopProvider";

export default function RootHtml({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ShopProvider>{children}</ShopProvider>
      </body>
    </html>
  );
}
