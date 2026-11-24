"use client";
import { useSyncExternalStore } from "react";

export type Customer = { id: string; firstname: string; lastname: string; name: string; email: string; phone: string; city: string; region: string; address: string; points: number; wishlist: string[] };

// The signed-in customer, read from /api/auth/me once and kept here (undefined = not known yet, null = signed out).
let state: Customer | null | undefined;
let started = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const getCustomer = () => state;
export function setCustomer(c: Customer | null) {
  state = c;
  emit();
}
export function refreshCustomer() {
  return fetch("/api/auth/me", { cache: "no-store" })
    .then((r) => r.json())
    .then((d: { user: Customer | null }) => setCustomer(d.user))
    .catch(() => setCustomer(null));
}
export async function signOut() {
  await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
  setCustomer(null);
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  if (!started && typeof window !== "undefined") {
    started = true;
    void refreshCustomer();
  }
  return () => listeners.delete(l);
};

// undefined while the first answer is on its way (and on the server), then the customer or null.
export const useCustomer = () =>
  useSyncExternalStore<Customer | null | undefined>(
    subscribe,
    () => state,
    () => undefined,
  );

// POST/PATCH helper that returns the JSON body or throws its error message.
export async function api<T>(url: string, body?: unknown, method = body === undefined ? "GET" : "POST"): Promise<T> {
  const r = await fetch(url, { method, headers: body === undefined ? undefined : { "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body), cache: "no-store" });
  const d = (await r.json().catch(() => ({}))) as T & { error?: string };
  if (!r.ok) throw new Error(d.error ?? "Something went wrong. Please try again.");
  return d;
}

// Where to go after login / register: the ?next= page when it is a page of this shop.
export function afterAuth() {
  const n = typeof location === "undefined" ? null : new URLSearchParams(location.search).get("next");
  return n && n.startsWith("/") && !n.startsWith("//") ? n : "/account";
}
