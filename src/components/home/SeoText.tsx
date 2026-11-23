// The text block at the bottom of the home page (about the shop, the range and the service).
export default function SeoText() {
  const h = "my-[15px] text-left text-[22px] leading-[26px] font-bold text-[#000000]";
  const p = "mb-[12px] text-left text-[15px] leading-[28.5px] font-normal text-[#000000cc]";
  const li = "mb-[6px] flex gap-[10px] text-left text-[15px] leading-[26px] font-normal text-[#000000cc] before:mt-[10px] before:block before:size-[7px] before:flex-none before:rounded-full before:bg-[#01aef1]";
  return (
    <div className="relative block">
      <div className="relative block px-[10px] pt-[10px] pb-0">
        <div className="relative block text-[15px] leading-[28.5px] font-medium text-[#000000] [&>p:last-child]:mb-0">
          <h1 className={h}>D CORE Solutions - IT &amp; Networking Equipment Supplier in Bangladesh</h1>
          <p className={p}>
            <b className="font-bold text-[#000000]">D CORE Solutions</b> supplies the equipment that internet providers, offices, factories and growing businesses need to build and run a
            reliable network. From a single access point for a small shop to OLTs, core switches and routers for a full ISP set-up, you can find the parts in one place, compare them,
            and order online from anywhere in the country.
          </p>
          <p className={p}>
            Our shelves cover fiber optic and FTTx products (patch cords, SFP modules, splicing tools, power meters, OLT and ONU), switching and routing, Wi-Fi and wireless links, servers
            and storage, UPS and power accessories, PC components and everyday IT accessories. Everything on the site comes with a clear price or a quick price request, so you never
            have to guess.
          </p>

          <h2 className={h}>Brands we work with</h2>
          <p className={p}>
            The catalogue includes products from well-known names in networking and computing such as Cisco, Huawei, MikroTik, Ubiquiti, Ruijie, TP-Link, Juniper, Dell, HP, Intel,
            Cambium Networks, NETGEAR, Fujikura, V-SOL, BDCOM, C-DATA, Samsung and Supermicro. If you are looking for a model that is not listed, send us a message and we will check
            availability for you.
          </p>

          <h2 className={h}>Why customers choose us</h2>
          <ul className="mb-[12px]">
            <li className={li}>Genuine products with the manufacturer or supplier warranty, so you can buy with confidence.</li>
            <li className={li}>Engineers who understand the products and can suggest the right model for your link, rack or office.</li>
            <li className={li}>Fair, transparent prices, with regular offers on switches, routers, fiber items and power equipment.</li>
            <li className={li}>Quick delivery inside Dhaka and to the rest of the country, and support after the sale when you need it.</li>
          </ul>

          <h2 className={h}>Need help choosing?</h2>
          <p className={p}>
            Tell us what you are planning - an office network, a fiber link, a new ISP node or a server room - and our team will recommend a working set of products within your budget.
            Call <b className="font-bold text-[#000000]">01844600030</b> or <b className="font-bold text-[#000000]">09678800672</b>, write to{" "}
            <b className="font-bold text-[#000000]">info@dcores.net</b>, or use the PC Builder to put a custom computer together right on this site.
          </p>
        </div>
      </div>
    </div>
  );
}
