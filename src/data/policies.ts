// Text of the policy pages (Terms, Privacy, Refund & Return, Delivery, EMI). Based on the OTECH pages, written for D CORE Solutions.
// Check the numbers marked "confirm" in the comments against what the shop really does before going live.
export type PolicySection = { h?: string; p?: string[]; ul?: string[] };
export type Policy = { slug: string; title: string; intro: string; sections: PolicySection[] };

const CONTACT = "info@dcores.net, +8801844600030 or +8809678800672";

export const POLICIES: Record<string, Policy> = {
  "terms-and-conditions": {
    slug: "terms-and-conditions",
    title: "Terms & Conditions",
    intro: "By visiting D CORE Solutions or placing an order on this website you agree to the terms below. Please read them together with our Refund & Return Policy, Delivery Terms and EMI Terms.",
    sections: [
      {
        h: "Product Disclaimer",
        p: [
          "Prices, specifications and the terms of offers are subject to change without prior notice. D CORE Solutions is not responsible for typographical or photographic errors. Product colour, size and texture may differ slightly from the pictures on the website.",
          "Stock availability can change at any time. A product marked \"In Stock\" may already have been sold, so please confirm the stock with us before you pay. Because of human error and other factors we cannot guarantee that every description, photograph, compatibility note, specification or price is entirely accurate, complete or current.",
        ],
      },
      {
        h: "Payment Terms",
        p: [
          "Please check the availability of a product before making any payment. Online payments are received through the SSLCOMMERZ payment gateway, and the gateway charge of the payment method you choose will apply. If a payment has to be refunded it can take 10-15 working days, and the charges deducted during the payment are not refunded. The payment terms and rights of the gateway are reserved by the gateway.",
        ],
      },
      {
        h: "Order & Delivery",
        p: [
          "Orders are normally processed within 48-72 hours, provided the items are in stock and the payment is verified. We try to ship on the same day wherever possible, but we do not guarantee it. Orders are not processed on weekends and holidays.",
          "If a product is listed with a wrong price because of a typographical, technical or other error, D CORE Solutions may refuse or cancel the order for that product and correct or remove the wrong information. We may also cancel or reverse an order without prior notice. See our Delivery Terms for the delivery time and charges.",
        ],
      },
      {
        h: "Warranty Claim Conditions",
        ul: [
          "To claim a warranty you need to show the proof of purchase (invoice or money receipt).",
          "The customer pays the return shipping charge for warranty service.",
          "D CORE Solutions cannot guarantee the compatibility of products. If you have a doubt about compatibility, please ask us before you buy or contact the manufacturer.",
          "We reserve the right to refuse service to anyone.",
        ],
      },
      { h: "Questions", p: [`If you have any question about these terms, write to us at ${CONTACT}.`] },
    ],
  },

  "privacy-policy": {
    slug: "privacy-policy",
    title: "Privacy Policy",
    intro: "D CORE Solutions respects your privacy. This policy explains what information we collect on this website, how we use it and how we protect it.",
    sections: [
      {
        h: "Information Collection and Use",
        p: [
          "D CORE Solutions is the sole owner of the information collected on this website. We do not sell, share or rent it to any outside party except as described in this policy. We collect information to process your orders, to deliver your products and to send you useful messages such as order confirmations and order status updates.",
          "The information we collect includes your name, shipping and billing address, phone number, email address and payment details. If you create an account we also keep the username and password you choose, so please do not share them with anyone. If you ask for our newsletter or special offers, we use your contact details to send them.",
        ],
      },
      {
        h: "Registration and Orders",
        p: [
          "To place an order you first fill in a registration form with your name, email, phone number and address. We use these details to give you important services such as automatic order status updates. During checkout you give the payment details we need for billing and to complete your order. If we have a problem with an order we use your contact details to reach you. We do not share your personal or financial information with any third party, apart from the delivery and payment partners that need it to complete your order.",
        ],
      },
      {
        h: "Cookies",
        p: [
          "We use cookies to customise some pages to your browser and to keep the items in your shopping cart. If you reject cookies you can still browse the store, but you will not be able to use the shopping cart to place an order. We do not share personally identifiable information from cookies with third parties. Some advertisers or partners may use their own cookies on our site, and this policy does not cover those.",
        ],
      },
      {
        h: "Log Files",
        p: ["We use IP addresses to analyse trends, to run the site, to follow how visitors move through it and to gather overall statistics. IP addresses are not linked to personally identifiable information and are not shared with third parties."],
      },
      {
        h: "Links to Other Sites",
        p: ["This website contains links to other sites. D CORE Solutions is not responsible for the privacy practices of those sites, so please read their privacy statements when you leave ours."],
      },
      {
        h: "Security",
        p: ["We take precautions to protect our customers' information. When you send sensitive information through the website it is protected both online and offline."],
      },
      {
        h: "Correcting or Updating Your Information",
        p: [`You can review or change your stored account information, such as your address or email, from the My Account page with your username and password. If you forget them, or if you want your information removed, contact us at ${CONTACT}.`],
      },
    ],
  },

  "refund-and-return-policy": {
    slug: "refund-and-return-policy",
    title: "Refund & Return Policy",
    intro: "We want you to be happy with every purchase. Please read how replacements, returns and refunds work at D CORE Solutions before you order.",
    sections: [
      {
        h: "Before You Buy",
        p: [
          "When you buy from a shop, please check the product in front of the sales person. If a problem appears later and the product has a warranty, it is handled under the warranty.",
          `For online orders, if the product has a manufacturing defect when you receive it, tell us within 24 hours at ${CONTACT}. The product must have no scratches and the box must be undamaged, otherwise it cannot be replaced. We strongly recommend that you record an unboxing video.`,
        ],
      },
      {
        h: "Replacements & Refunds",
        ul: [
          "A product that is dead on arrival or damaged is replaced with a new one. Send it back with all the original packaging and accessories and with the serial numbers undamaged.",
          "When we receive it we test it. If it is found defective we get a replacement from the brand and send it to you. Damage from misuse, burn-out or wrong handling is not covered.",
          "If no replacement is available we suggest an alternative, or you can ask for a full refund.",
          "A refund takes 7-10 working days after the return is accepted, and longer for online payments.",
          "Charges of bKash, Rocket, cards, POS or other online payments, and extra fees such as the EMI charge and the gateway charge, are not refundable.",
          "If you used a cash-back offer, it is adjusted when the product is returned.",
        ],
      },
      {
        h: "Returns",
        ul: [
          "Goods that have been sold cannot be returned or exchanged without a valid reason.",
          "For an online purchase you can return the goods if they are not the model you ordered, or if they look damaged from the outside.",
          "A used product cannot be returned.",
        ],
      },
      {
        h: "When We Do Not Accept a Return",
        ul: ["You ordered by mistake or you do not want the product now.", "You want to try the product before keeping it.", "You changed your mind.", "The product is not what you imagined."],
      },
    ],
  },

  delivery: {
    slug: "delivery",
    title: "Online Delivery",
    intro: "You can order any product on our website and receive it at home anywhere in Bangladesh. These are the delivery terms of D CORE Solutions.",
    sections: [
      {
        h: "Delivery Inside Dhaka",
        ul: [
          "Cash on Delivery (COD) is available for online orders inside Dhaka only.",
          "You receive the product within 3-5 working days after the order is confirmed.",
          "The delivery charge depends on the product and the place. Free delivery does not apply to every product.",
          "Our delivery partners (such as RedX, Pathao and eCourier) have their own terms.",
          "You cannot try the product before accepting a home delivery. If possible, record an unboxing video, and tell us at once if you receive a faulty product.",
        ],
      },
      {
        h: "Express Delivery (Dhaka only)",
        ul: [
          "Express delivery is done within 24 working hours of the order confirmation. If it takes longer, you do not pay the delivery charge (conditions apply).",
          "The charge depends on the size and weight of the product. Our agent calls you with the details before you confirm.",
          "An order confirmed before 12 noon is delivered the same day. An order confirmed after 12 noon is delivered the next day.",
        ],
      },
      {
        h: "Delivery Outside Dhaka",
        ul: [
          "Orders from outside Dhaka are sent by courier. The full or a part of the price must be paid in advance to book the product.",
          "The courier charge and the conditional payment charge are paid by the customer. The delivery time and charge depend on the courier and the product.",
          "D CORE Solutions is not responsible for damage during courier transport once the product is booked. You can ask us for the booking number and details.",
          "You collect the parcel from the courier branch nearest to you.",
        ],
      },
      {
        h: "International Card Payments",
        p: [`If you pay with an international card, send us a clear photo of the card (the first and last 4 digits must be visible) and a clear photo of the cardholder's national ID, driving licence or passport at ${CONTACT.split(",")[0]}. EMI is not available on international cards.`],
      },
    ],
  },

  emi: {
    slug: "emi",
    title: "EMI",
    intro: "Pay for your purchase in easy monthly instalments with a credit card. Here are the EMI terms and conditions of D CORE Solutions.",
    sections: [
      {
        h: "EMI Terms & Conditions",
        ul: [
          "EMI is available on any product that costs more than 5,000 BDT.",
          "You can choose an instalment period of up to 36 months.",
          "The cash price, discounts and special offer prices do not apply to EMI. The cash prices of all products are shown on our website.",
          "At the moment EMI is available with credit cards of 22 major banks.",
          "The EMI charge is taken by SSLCOMMERZ and it changes with the length of the EMI period.",
          "EMI is not available with international cards, and EMI charges are not refundable.",
          "D CORE Solutions can change or stop any EMI offer at any time.",
        ],
      },
      { h: "How to Pay with EMI", p: [`Add the product to your cart, go to the checkout and choose the EMI option of the payment gateway with your credit card. If you need help or want to know the exact charge for your bank, call us at ${CONTACT}.`] },
    ],
  },
};

export const wordCount = (p: Policy) =>
  [p.intro, ...p.sections.flatMap((s) => [s.h ?? "", ...(s.p ?? []), ...(s.ul ?? [])])].join(" ").split(/\s+/).filter(Boolean).length;
