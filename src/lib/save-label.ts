// The discount badge of a product: "-7 %" becomes "Save: 300৳" (the old price minus the price now); other labels stay as they are.
const num = (s: string | null | undefined) => (s ? Number(s.replace(/[^\d.]/g, "")) || 0 : 0);

export function saveLabel(label: string, now: string | null | undefined, old: string | null | undefined): string {
  if (!/%/.test(label)) return label;
  const diff = num(old) - num(now);
  return diff > 0 ? `Save: ${diff.toLocaleString("en-US")}৳` : label;
}
