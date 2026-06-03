"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartState } from "./useCartState";

export function CartLink() {
  const { count } = useCartState();

  return (
    <Link href="/cart" className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 transition hover:border-slate-400 hover:bg-slate-50">
      <ShoppingCart className="h-4 w-4" />
      <span>Cart</span>
      {count > 0 ? (
        <span className="min-w-6 rounded-full bg-slate-950 px-2 py-0.5 text-center text-xs font-semibold text-white">
          {count}
        </span>
      ) : null}
    </Link>
  );
}
