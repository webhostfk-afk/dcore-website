// The "Search Criteria" form on top of the search results, and the heading of the results.
export default function SearchForm({ search }: { search: string }) {
  return (
    <>
      <h2 className="sr-only">Search Criteria</h2>
      <form action="/search" method="get" className="text-[15px] leading-[28.5px] font-medium text-[#000000]">
        <div className="flex items-center pb-[10px] max-[761px]:flex-wrap">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Keywords"
            id="input-search"
            className="block h-[38px] min-w-0 flex-1 rounded-[3px] border border-solid border-[#0000001f] bg-white px-[12px] py-[6px] text-[14px] leading-[18.2px] text-[#000000b3] outline-none placeholder:text-[#00000080] max-[471px]:h-[32px] max-[761px]:w-full max-[761px]:flex-none"
          />
          <select
            name="category_id"
            defaultValue="0"
            className="ml-[20px] block h-[34px] w-[40%] rounded-[3px] border border-solid border-[#0000001f] bg-white px-[12px] text-[14px] text-[#000000b3] outline-none max-[761px]:mt-[10px] max-[471px]:mb-[2px] max-[761px]:ml-0 max-[761px]:w-full"
          >
            <option value="0">All Categories</option>
          </select>
        </div>
        <div className="mt-[2px] mb-0">
          <label className="relative block pl-[20px] text-[14px] leading-[26.6px] font-normal text-[#000000]">
            <input type="checkbox" name="sub_category" value="1" disabled className="absolute top-[3px] left-0 size-[13px]" /> Search in subcategories
          </label>
        </div>
        <div className="mt-[2px] mb-0">
          <label className="relative block cursor-pointer pl-[20px] text-[14px] leading-[26.6px] font-normal">
            <input type="checkbox" name="description" value="1" id="description" className="absolute top-[3px] left-0 size-[13px]" /> Search in product descriptions
          </label>
        </div>
        <button
          id="button-search"
          type="submit"
          className="mt-[20px] max-[471px]:mt-[18px] flex h-[39px] w-full cursor-pointer items-center justify-center rounded-[3px] bg-[#000000] text-[13px] leading-[13px] font-normal text-white uppercase shadow-[inset_0_0_5px_rgba(0,0,0,0.1)] hover:bg-[#01aef1]"
        >
          Search
        </button>
      </form>
      <h2 className="relative mt-[15px] mb-[15px] h-[27.8px] text-[14px] leading-[16px] font-normal text-[#000000] after:absolute after:bottom-0 after:left-0 after:h-px after:w-[50px] after:bg-[#00000099] after:content-['']">
        Products meeting the search criteria
      </h2>
    </>
  );
}
