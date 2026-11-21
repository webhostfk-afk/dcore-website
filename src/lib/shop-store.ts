"use client";
import { createPersistentStore } from "./persist";

export type CartItem = { id: string; name: string; href: string; image: string; model: string; price: number; qty: number };
export type CompareItem = { id: string; name: string; href: string; image: string; model: string; brand: string; price: string; oldPrice: string };

const EMPTY_CART: CartItem[] = [];
const EMPTY_COMPARE: CompareItem[] = [];
export const cartStore = createPersistentStore<CartItem[]>("otech:cart", EMPTY_CART);
export const compareStore = createPersistentStore<CompareItem[]>("otech:compare", EMPTY_COMPARE);

export const money = (n: number) => `${Math.round(n).toLocaleString("en-US")}৳`;
export const toNumber = (s: string | null | undefined) => (s ? Number(s.replace(/[^\d.]/g, "")) || 0 : 0);

export const cartCount = (items: CartItem[]) => items.reduce((n, i) => n + i.qty, 0);
export const cartTotal = (items: CartItem[]) => items.reduce((n, i) => n + i.qty * i.price, 0);
