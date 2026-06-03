"use client";

import { useSyncExternalStore } from "react";
import {
  CartItem,
  addCartItem,
  clearCart,
  getCartChangeEventName,
  getCartCount,
  getCartItems,
  getCartTotal,
  removeCartItem,
  updateCartItemQuantity,
} from "@/lib/cart";

const serverCartSnapshot = [] as CartItem[];
let browserCartSnapshot: CartItem[] | undefined;

function getBrowserSnapshot() {
  if (typeof window === "undefined") {
    return serverCartSnapshot;
  }

  if (!browserCartSnapshot) {
    browserCartSnapshot = getCartItems();
  }

  return browserCartSnapshot;
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStoreChange = () => {
    browserCartSnapshot = getCartItems();
    onStoreChange();
  };

  window.addEventListener("storage", handleStoreChange);
  window.addEventListener(getCartChangeEventName(), handleStoreChange);

  return () => {
    window.removeEventListener("storage", handleStoreChange);
    window.removeEventListener(getCartChangeEventName(), handleStoreChange);
  };
}

export function useCartState() {
  const items = useSyncExternalStore(subscribe, getBrowserSnapshot, () => serverCartSnapshot);
  const count = getCartCount(items);
  const total = getCartTotal(items);

  return {
    items,
    count,
    total,
    addItem: (item: Omit<CartItem, "id">) => addCartItem(item),
    updateQuantity: (id: string, quantity: number) => updateCartItemQuantity(id, quantity),
    removeItem: (id: string) => removeCartItem(id),
    clear: () => {
      clearCart();
    },
  };
}
