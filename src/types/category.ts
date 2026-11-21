export type CatProduct = {
  id: string;
  name: string;
  href: string;
  image: { src: string; width: number; height: number } | null;
  imageSecond: { src: string; width: number; height: number } | null;
  price: string | null;
  oldPrice: string | null;
  label: string | null;
  requestPrice: boolean;
  brand: { name: string; href: string } | null;
  model: string | null;
  features: string[];
};
export type FilterGroup =
  | { code: "p"; title: string; type: "price"; min: number; max: number }
  | { code: string; title: string; type: "checkbox"; options: { value: string; label: string; count: number; ids: string[] }[] };
export type Category = {
  href: string;
  meta: { title: string; description: string; keywords: string; ogImage: string };
  breadcrumb: { label: string; href: string }[];
  heading: string;
  total: number;
  filters: FilterGroup[];
  products: CatProduct[];
};
export type CategoryExtra = {
  refine: { title: string; href: string; image: string | null }[];
  refineClass: string | null;
  descriptionHtml: string;
  detailsHtml: string;
};
