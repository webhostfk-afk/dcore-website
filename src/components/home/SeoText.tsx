// SEO text block at the bottom of the home page, written with Tailwind (values read from the original theme).
export default function SeoText() {
  const h1 = "my-[15px] text-left text-[22px] leading-[24.2px] font-normal";
  return (
    <div className="relative block">
      <div className="relative block p-[10px]">
        <div className="relative block text-left text-[15px] leading-[28.5px] font-medium text-[#333]">
          <h1 className={h1}>
            <b className="font-bold">OTECH Technologies | Best TECH Store in Bangladesh</b>
          </h1>
          <div>
            <b className="font-bold">OTECH Technologies</b>
            {
              " is a leading ICT and Networking Products Distribution company in Bangladesh, delivering advanced networking and Data Center solutions products. Our core offerings include FTTH Solutions, Fiber Patch Cord, Fiber Optical Cable, Splicing Machines, OLT, ONU, Core Routers, Core Switches, and a comprehensive range of networking equipment, along with Server, CCTV Surveillance and Storage Solutions. As an Authorized Distributor, Reseller, and System Integration Partner of over 30+ Internationally recognized ICT brands, we are committed to providing genuine, high-performance products that meet global standards. Beyond distribution, OTECH Technologies serves as a trusted technology solutions partner, offering innovative and scalable IT services to businesses across diverse industries. Since our establishment in 2019, we have built a strong reputation for reliability, technical expertise, and customer-centric service helping organizations achieve operational efficiency and sustainable growth."
            }
          </div>
          <div>
            <br />
          </div>
          <h1 className={h1}>
            <b className="font-bold">Brands</b>
          </h1>
          <p>
            <b className="font-bold">OTECH Technologies</b>
            {
              " is one of the largest ICT distribution companies in Bangladesh, dealing with hardware, Splicing Machines, Access points, SFP Modules, Ethernet network cards, OLT, ONU, PC Components, Accessories, and Software Solutions."
            }
            <br />
            {
              "OTECH Technologies Ltd is an Authorized Distributor, Reseller, and System Integration Partner of renowned ICT brands such as Cisco, Juniper, Huawei, ECOM, V.SOL, BDCOM, C-DATA, Fujikura, Ubiquiti, NETGEAR, IP-COM, HP, JILONG, Comway, Dell, Intel, DVP, Cambium Networks, Broadcom, Brother, PC Cooler, DeepCool, Samsung, Supermicro and more."
            }
            <br />
            {
              "We ensure our customers receive high-quality products from leading international brands, combining reliability and performance. Our mission is to provide genuine, premium products at competitive prices, allowing customers to purchase with complete confidence. At OTECH Technologies, customer satisfaction is our top priority, and we are dedicated to delivering the best products and services at the most affordable prices across Bangladesh."
            }
          </p>
          <p>
            <br />
          </p>
          <h1 className={h1}>
            <b className="font-bold">Best Price &amp; Best After Sales Service</b>
          </h1>
          <p>
            <b className="font-bold">OTECH Technologies</b>
            {
              ", we have spent over 6 Years+ focusing on innovative technology, people, and exceptional after-sales service. Whether you need FTTH or networking solutions, our expert team is ready to help you find exactly what you need, providing professional guidance every step of the way. We prioritize our customers above all else, understanding their needs and delivering solutions that exceed expectations. With OTECH Technologies, you can rely on high-quality products, competitive pricing, the best warranty support, and outstanding service, ensuring complete satisfaction every time."
            }
          </p>
        </div>
      </div>
    </div>
  );
}
