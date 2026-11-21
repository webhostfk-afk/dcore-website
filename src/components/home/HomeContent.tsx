import { home } from "@/data/home";
import BrandCarousel from "./BrandCarousel";
import { BannerGrid, CategoriesTitle, CategoryGrid } from "./CategoryBlocks";
import HeroSlider from "./HeroSlider";
import ProductSection from "./HomeProducts";
import SeoText from "./SeoText";


// One full-width row of the home page: a single column holding a stack of modules.
function Row({ children }: { children: React.ReactNode }) {
  return <div className="relative block">{children}</div>;
}

export default function HomeContent() {
  const sectionsByRow = (n: number) => home.productSections.filter((s) => s.row === n);
  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col text-[15px] leading-[28.5px] font-medium text-[#333]">
      <div className="flex">
        <div className="block w-full min-[1301px]:py-[20px] max-[1301px]:px-[20px] max-[1301px]:pb-[20px] max-[471px]:p-[5px]">
          <div className="flex flex-col">
            {/* hero sliders */}
            <div className="relative -mt-[15px] block max-[471px]:mt-0">
              <div className="mx-auto flex w-full max-w-[1280px] flex-wrap">
                <div className="relative block w-[70%] pr-[5px] max-[471px]:w-full max-[471px]:pr-0">
                  <HeroSlider slides={home.sliderLeft} delay={1.5} width={810} height={401} />
                </div>
                <div className="relative block w-[30%]">
                  <HeroSlider slides={home.sliderRight} delay={2} width={404} height={464} />
                </div>
              </div>
            </div>

            {/* brands, notice, categories, banners */}
            <div className="relative mt-[30px] block">
              <div className="mx-auto flex w-full max-w-[1280px] flex-wrap">
                <div className="relative block w-full"><BrandCarousel brands={home.brands} /></div>
                <div className="relative block w-full">
                  <div className="block h-[50.37px] text-center">
                    <div className="mx-auto block w-full max-w-[1280px] rounded-[50px] bg-white px-[10px] pt-[10px] pb-[2px] mt-[5px] text-[13px] leading-[24.7px] font-medium text-[#1a202c]">
                      <div className="h-[33px]">
                        <div className="otech-marquee" style={{ width: "100%", overflow: "hidden", whiteSpace: "nowrap", height: 26, lineHeight: "26px" }}>
                          <span className="otech-marquee-track">{home.notice}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative block w-full bg-[#f2f3f7]">
                  <CategoriesTitle title={home.categoriesTitle} subtitle={home.categoriesSubtitle} />
                  <CategoryGrid items={home.categories} />
                </div>
                <div className="relative mt-[20px] block w-full px-[10px]">
                  <BannerGrid items={home.bannersTop} />
                  <BannerGrid items={home.bannersBottom} third />
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
