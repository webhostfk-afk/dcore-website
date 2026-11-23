// The big page heading with the short orange line under it ("Product Comparison", "Search - switch" ...).
export default function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="relative my-[30px] border-b border-[#0000001f] text-[30px] leading-[36px] font-medium text-[#000000] max-[1301px]:mx-[20px] max-[1301px]:mb-[20px] max-[761px]:text-[25px] max-[761px]:leading-[30px] max-[359px]:text-[13px] max-[359px]:leading-[15.6px]">
      <span className="mx-auto block max-w-[1280px] after:mt-[10px] after:block after:h-px after:w-[100px] after:bg-[#01aef1] after:content-['']">{children}</span>
    </h1>
  );
}
