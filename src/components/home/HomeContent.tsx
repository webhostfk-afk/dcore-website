import { home } from "@/data/home";
import BrandCarousel from "./BrandCarousel";
import { BannerGrid, CategoriesTitle, CategoryGrid } from "./CategoryBlocks";
import HeroSlider from "./HeroSlider";
import ProductSection from "./HomeProducts";
import NoticeTicker from "./NoticeTicker";
import SeoText from "./SeoText";


// One full-width row of the home page: a single column holding a stack of modules.
function Row({ children }: { children: React.ReactNode }) {
  return <div className="relative block">{children}</div>;
}

export default function HomeContent() {
  const sectionsByRow = (n: number) => home.productSections.filter((s) => s.row === n);
  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col text-[15px] leading-[28.5px] font-medium text-[#000000]">
      <div className="flex">
        <div className="block w-full min-[1301px]:py-[20px] max-[1301px]:px-[20px] max-[1301px]:pb-[20px] max-[471px]:p-[5px]">
          <div className="flex flex-col">
            {/* hero sliders */}
            <div className="relative -mt-[15px] block max-[1301px]:mt-[5px] max-[471px]:mt-0">
              <div className="mx-auto flex w-full max-w-[1280px] flex-wrap">
                <div className="relative block w-[70%] pr-[5px] max-[471px]:w-full max-[471px]:pr-0">
                  <HeroSlider slides={home.sliderLeft} delay={1.5} width={810} height={401} />
                </div>
                <div className="relative block w-[30%] max-[471px]:hidden">
                  <HeroSlider slides={home.sliderRight} delay={2} width={404} height={464} />
                </div>
              </div>
            </div>

            {/* notice, categories, brands, banners */}
            <div className="relative mt-[10px] block">
              <div className="mx-auto flex w-full max-w-[1280px] flex-wrap">
                <div className="relative block w-full">
                  <NoticeTicker />
                </div>
                <div className="relative block w-full bg-[#f0fafe]">
                  <CategoriesTitle title={home.categoriesTitle} subtitle={home.categoriesSubtitle} />
                  <CategoryGrid items={home.categories} />
                </div>
                <div className="relative mt-[17px] block w-full">
                  <BrandCarousel brands={home.brands} />
                </div>
                <div className="relative mt-[20px] block w-full px-[10px]">
                  <BannerGrid items={home.bannersBottom} third />
                  <BannerGrid items={home.bannersTop} second />
                </div>
              </div>
            </div>

            {[4, 5, 6, 7].map((n) => (
              <Row key={n}>
                {sectionsByRow(n).map((s) => (
                  <ProductSection key={s.moduleId} section={s} />
                ))}
              </Row>
            ))}

            <SeoText />
          </div>
        </div>
      </div>
    </div>
  );
}
