import { persistentAtom } from "@nanostores/persistent";
import { atom } from "nanostores";
import type { z } from "zod";
import {
  addCartLines,
  createCart,
  getCart,
  removeCartLines,
  updateCartLines,
} from "../data/shopify";
import type { CartResult } from "../data/shopify/schemas";

// Cart drawer state (open or closed) with initial value (false) and no persistent state (local storage)
export const isCartDrawerOpen = atom(false);

// Cart is updating state (true or false) with initial value (false) and no persistent state (local storage)
export const isCartUpdating = atom(false);

// Cart error state for displaying errors to users
export const cartError = atom<string | null>(null);

const emptyCart = {
  id: "",
  checkoutUrl: "",
  totalQuantity: 0,
  lines: { nodes: [] },
  cost: { subtotalAmount: { amount: "0", currencyCode: "USD" } },
};

// Cart store with persistent state (local storage) and initial value
export const cart = persistentAtom<z.infer<typeof CartResult>>(
  "cart",
  emptyCart,
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
);

// Helper to clear error after a delay
function clearErrorAfterDelay(ms = 5000) {
  setTimeout(() => cartError.set(null), ms);
}

// Fetch cart data if a cart exists in local storage, this is called during session start only
// This is useful to validate if the cart still exists in Shopify and if it's not empty
// Shopify automatically deletes the cart when the customer completes the checkout or if the cart is unused or abandoned after 10 days
// https://shopify.dev/custom-storefronts/cart#considerations
export async function initCart() {
  const sessionStarted = sessionStorage.getItem("sessionStarted");
  if (!sessionStarted) {
    sessionStorage.setItem("sessionStarted", "true");
    const localCart = cart.get();
    const cartId = localCart?.id;
    if (cartId) {
      try {
        const data = await getCart(cartId);

        if (data) {
          cart.set({
            id: data.id,
            cost: data.cost,
            checkoutUrl: data.checkoutUrl,
            totalQuantity: data.totalQuantity,
            lines: data.lines,
          });
        } else {
          // If the cart doesn't exist in Shopify, reset the cart store
          cart.set(emptyCart);
        }
      } catch (error) {
        console.error("Failed to initialize cart:", error);
        // Reset to empty cart on error to allow fresh start
        cart.set(emptyCart);
      }
    }
  }
}

// Add item to cart or create a new cart if it doesn't exist yet
export async function addCartItem(item: { id: string; quantity: number }) {
  const localCart = cart.get();
  const cartId = localCart?.id;

  isCartUpdating.set(true);
  cartError.set(null);

  try {
    if (!cartId) {
      const cartData = await createCart(item.id, item.quantity);

      if (cartData) {
        cart.set({
          ...cart.get(),
          id: cartData.id,
          cost: cartData.cost,
          checkoutUrl: cartData.checkoutUrl,
          totalQuantity: cartData.totalQuantity,
          lines: cartData.lines,
        });
        isCartDrawerOpen.set(true);
      }
    } else {
      const cartData = await addCartLines(cartId, item.id, item.quantity);

      if (cartData) {
        cart.set({
          ...cart.get(),
          id: cartData.id,
          cost: cartData.cost,
          checkoutUrl: cartData.checkoutUrl,
          totalQuantity: cartData.totalQuantity,
          lines: cartData.lines,
        });
        isCartDrawerOpen.set(true);
      }
    }
  } catch (error) {
    console.error("Failed to add item to cart:", error);
    cartError.set("Failed to add item to cart. Please try again.");
    clearErrorAfterDelay();
  } finally {
    isCartUpdating.set(false);
  }
}

export async function removeCartItems(lineIds: string[]) {
  const localCart = cart.get();
  const cartId = localCart?.id;

  if (!cartId) return;

  isCartUpdating.set(true);
  cartError.set(null);

  try {
    const cartData = await removeCartLines(cartId, lineIds);

    if (cartData) {
      cart.set({
        ...cart.get(),
        id: cartData.id,
        cost: cartData.cost,
        checkoutUrl: cartData.checkoutUrl,
        totalQuantity: cartData.totalQuantity,
        lines: cartData.lines,
      });
    }
  } catch (error) {
    console.error("Failed to remove item from cart:", error);
    cartError.set("Failed to remove item. Please try again.");
    clearErrorAfterDelay();
  } finally {
    isCartUpdating.set(false);
  }
}

export async function updateCartItem(lineId: string, quantity: number) {
  const localCart = cart.get();
  const cartId = localCart?.id;

  if (!cartId) return;

  isCartUpdating.set(true);
  cartError.set(null);

  try {
    const cartData = await updateCartLines(cartId, lineId, quantity);

    if (cartData) {
      cart.set({
        ...cart.get(),
        id: cartData.id,
        cost: cartData.cost,
        checkoutUrl: cartData.checkoutUrl,
        totalQuantity: cartData.totalQuantity,
        lines: cartData.lines,
      });
    }
  } catch (error) {
    console.error("Failed to update cart:", error);
    cartError.set("Failed to update quantity. Please try again.");
    clearErrorAfterDelay();
  } finally {
    isCartUpdating.set(false);
  }
}
