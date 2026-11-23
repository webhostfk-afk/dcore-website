"use client";
import { createPersistentStore } from "@/lib/persist";
import type { BuilderProduct } from "@/lib/pcbuilder";

// The parts chosen in the PC Builder (kept in this browser): slot id -> product and quantity.
export type Pick = { p: BuilderProduct; qty: number };
export const EMPTY_BUILD: Record<string, Pick> = {};
export const buildStore = createPersistentStore<Record<string, Pick>>("dcore:pcbuild", EMPTY_BUILD);
