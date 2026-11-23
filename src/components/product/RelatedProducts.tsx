import type { Product } from "@/types/home";
import { HomeCard } from "@/components/home/HomeProducts";
import ProductCarousel from "@/components/home/ProductCarousel";

// "Related Products" under a product: a centred title and a sliding row of cards.
export default function RelatedProducts({ title, products }: { title: string; products: Product[] }) {
  return (
    <div className="block w-full overflow-x-clip bg-[#f0fafe] px-[20px] pt-[40px] pb-[20px] text-[15px] leading-[28.5px] font-medium text-[#000000]">
      <div className="mx-auto max-w-[1280px]">
      <h3 className="my-[15px] text-center text-[25px] leading-[27.5px] font-medium text-[#000000]">{title}</h3>
      <div className="-mt-[7.5px] pb-[30px]">
        <ProductCarousel peek>
        {products.map((p) => (
          <HomeCard key={p.id} p={p} related />
        ))}
      </ProductCarousel>
        </div>
      </div>
    </div>
  );
}
