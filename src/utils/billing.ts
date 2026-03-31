import type { Product } from "../features/products/productsSlice";

export const calculateBill = (cart: Record<string, number>, products: Product[]) => {
  let subtotal = 0;

  Object.entries(cart).forEach(([item, qty]) => {
    const product = products.find(p => p.name === item);
    if (product) {
      subtotal += product.price * qty;
    }
  });

  const offers: { description: string; savings: number }[] = [];

  // Cheese 1 + 1 → 1 free
  if (cart.cheese) {
    const product = products.find(p => p.name === "cheese");
    if (product) {
      const free = Math.floor(cart.cheese / 2);
      const saving = free * product.price;
      if (saving > 0) {
        offers.push({ description: "Buy 1 Get 1 Cheese", savings: saving });
      }
    }
  }

  // Soup + Bread → half bread
  if (cart.soup && cart.bread) {
    const soup = products.find(p => p.name === "soup");
    const bread = products.find(p => p.name === "bread");
    if (soup && bread) {
      const eligible = Math.min(cart.soup, cart.bread);
      const saving = eligible * (bread.price / 2);
      if (saving > 0) {
        offers.push({ description: "Soup + Bread Discount", savings: saving });
      }
    }
  }

  // Butter → 1/3 off
  if (cart.butter) {
    const butter = products.find(p => p.name === "butter");
    if (butter) {
      const saving = cart.butter * (butter.price / 3);
      offers.push({ description: "Butter 1/3 Off", savings: saving });
    }
  }

  const totalSavings = offers.reduce((acc, o) => acc + o.savings, 0);

  return {
    subtotal,
    offers,
    total: subtotal - totalSavings,
  };
};