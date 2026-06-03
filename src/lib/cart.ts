export type CartItem = {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  venue: string;
  posterUrl?: string;
  ticketTypeId: string;
  ticketTypeName: string;
  price: number;
  quantity: number;
};

const CART_STORAGE_KEY = "nairobi-events-cart";
const CART_CHANGE_EVENT = "nairobi-events-cart-change";

function isBrowser() {
  return typeof window !== "undefined";
}

function emitCartChange() {
  if (isBrowser()) {
    window.dispatchEvent(new Event(CART_CHANGE_EVENT));
  }
}

export function getCartItems(): CartItem[] {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCartItems(items: CartItem[]) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  emitCartChange();
}

export function addCartItem(item: Omit<CartItem, "id">) {
  const items = getCartItems();
  const existingIndex = items.findIndex(
    (entry) => entry.eventId === item.eventId && entry.ticketTypeId === item.ticketTypeId
  );

  if (existingIndex >= 0) {
    items[existingIndex] = {
      ...items[existingIndex],
      quantity: items[existingIndex].quantity + item.quantity,
    };
  } else {
    items.push({
      ...item,
      id: `${item.eventId}:${item.ticketTypeId}`,
    });
  }

  saveCartItems(items);
  return items;
}

export function updateCartItemQuantity(id: string, quantity: number) {
  const items = getCartItems()
    .map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item))
    .filter((item) => item.quantity > 0);

  saveCartItems(items);
  return items;
}

export function removeCartItem(id: string) {
  const items = getCartItems().filter((item) => item.id !== id);
  saveCartItems(items);
  return items;
}

export function clearCart() {
  saveCartItems([]);
}

export function getCartCount(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function getCartTotal(items: CartItem[]) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

export function getCartChangeEventName() {
  return CART_CHANGE_EVENT;
}
