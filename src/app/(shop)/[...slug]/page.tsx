import type { Metadata } from "next";
import { Fragment } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SideMenu from "@/components/layout/SideMenu";
import Breadcrumb from "@/components/layout/Breadcrumb";
import CategoryBrowser from "@/components/category/CategoryBrowser";
import ProductDetail from "@/components/product/ProductDetail";
import RelatedProducts from "@/components/product/RelatedProducts";
import { allCategorySlugs, getCategory, siblingProducts } from "@/lib/categories";
import { allProductSlugs, getProduct } from "@/lib/products";
import { allBrands, brandCategory, getBrand } from "@/lib/brands";

export const instant = false;

// html classes of the category pages (the root layout carries the home page's)

export function generateStaticParams() {
  const taken = new Set([...allCategorySlugs(), ...allProductSlugs()].map((s) => s.join("/")));
  const brands = [...allBrands().keys()].filter((b) => !taken.has(b)).map((b) => [b]);
  return [...allCategorySlugs(), ...allProductSlugs(), ...brands].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCategory(slug);
  if (!c) {
    const pr = getProduct(slug);
    if (!pr) {
      const br = slug.length === 1 ? getBrand(slug[0]) : null;
      if (br) {
        const bm = brandCategory(br).meta;
        return { title: bm.title, description: bm.description, keywords: bm.keywords };
      }
      return { title: "D CORE Solutions" };
    }
    const pm = pr.meta;
    return { title: pm.title, description: pm.description, keywords: pm.keywords, openGraph: { title: pm.title, description: pm.description, images: pm.ogImage ? [pm.ogImage] : [] } };
  }
  const m = c.data.meta;
  return { title: m.title, description: m.description, keywords: m.keywords, openGraph: { title: m.title, description: m.description, images: m.ogImage ? [m.ogImage] : [] } };
}

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const cat = getCategory(slug);

  if (!cat) {
    const prod = getProduct(slug);
    if (prod) return <ProductView prod={prod} short={slug.length === 1} />;
    const brand = slug.length === 1 ? getBrand(slug[0]) : null;
    if (brand) {
      const data = brandCategory(brand);
      return (
        <>
          <Header>
            <Breadcrumb items={data.breadcrumb} />
            <h1 className="sr-only">{data.heading}</h1>
            <CategoryBrowser data={data} refine={[]} />
            <Footer />
          </Header>
          <SideMenu />
        </>
      );
    }
    // Placeholder for every inner page (product, cart ...) that is not cloned yet.
    return (
      <>
        <Header>
          <div className="container" style={{ padding: "80px 15px", textAlign: "center" }}>
            <h1>/{slug.join("/")}</h1>
            <p>This page is not cloned yet.</p>
          </div>
          <Footer />
        </Header>
        <SideMenu />
      </>
    );
  }

  const { data, extra } = cat;
  // The two text blocks under the products are scraped HTML; the .legacy-html styles give it back list / heading / table looks
  const bottom = (
    <div id="content-bottom" className="legacy-html">
      {extra?.descriptionHtml && <div className="w-full pt-[20px]" dangerouslySetInnerHTML={{ __html: extra.descriptionHtml }} />}
      {extra && <div className="mt-[10px] w-full" dangerouslySetInnerHTML={{ __html: extra.detailsHtml }} />}
    </div>
  );

  return (
    <>
      <Header>
        <Breadcrumb items={data.breadcrumb} />
        <h1 className="sr-only">{data.heading}</h1>
        <CategoryBrowser data={data} refine={extra?.refine ?? []} bottom={bottom} />
        <Footer />
      </Header>
      <SideMenu />
    </>
  );
}

function ProductView({ prod, short }: { prod: NonNullable<ReturnType<typeof getProduct>>; short: boolean }) {
  // the shop shows the category trail only when the product is opened through its category address
  // the shop picks related products at random and sometimes finds only a few; fill up with products of the same category
  const related = prod.related.map((r) => ({ ...r }));
  if (related.length === 0) related.push({ moduleId: 253, title: "Related Products", products: [] });
  if (related[0].products.length < 8) {
    const have = new Set(related[0].products.map((x) => x.id));
    for (const s of siblingProducts(prod.id, 14)) {
      if (related[0].products.length >= 10) break;
      if (!have.has(s.id) && s.image) {
        const img = (i: { src: string; width: number; height: number } | null) => (i ? { ...i, alt: s.name } : null);
        related[0].products = [...related[0].products, { id: s.id, name: s.name, href: s.href, image: img(s.image), imageSecond: img(s.imageSecond), price: s.price, oldPrice: s.oldPrice, label: s.label, requestPrice: s.requestPrice }];
      }
    }
  }
  const trail = short ? [prod.breadcrumb[0], prod.breadcrumb[prod.breadcrumb.length - 1]] : prod.breadcrumb;
  return (
    <>
      <Header>
        <Breadcrumb items={trail} />
        <h1 className="sr-only">{prod.heading}</h1>
        <ProductDetail v={prod.view} href={prod.href} />
        {related.some((r) => r.products.length > 0) && (
          <>
            {related.map((r) => (
              <RelatedProducts key={r.moduleId} title={r.title} products={r.products} />
            ))}
          </>
        )}
        <Footer />
      </Header>
      <SideMenu />
    </>
  );
}
