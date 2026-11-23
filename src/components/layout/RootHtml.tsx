import ShopProvider from "@/components/shop/ShopProvider";
import ImgFallback from "@/components/layout/ImgFallback";

export default function RootHtml({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ShopProvider>{children}</ShopProvider>
        <ImgFallback />
      </body>
    </html>
  );
}
