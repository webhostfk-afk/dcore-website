import { redirect } from "next/navigation";

// The wish list lives in the customer account.
export default function WishlistPage() {
  redirect("/account#wishlist");
}
