export type CartItem = {
  price: number;
  quantity: number;
  sku: string;
};

export type CheckoutInput = {
  coupon?: string;
  items: CartItem[];
};

export type CheckoutSummary = {
  discountCode: string | null;
  subtotal: number;
  total: number;
};

export function calculateCheckout(input: CheckoutInput): CheckoutSummary {
  const subtotal = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountCode = normalizeCoupon(input.coupon);
  const total = discountCode === "AGENT10" ? subtotal * 0.9 : subtotal;

  return {
    discountCode,
    subtotal,
    total,
  };
}

function normalizeCoupon(coupon: string | undefined): string | null {
  const normalized = coupon?.trim().toUpperCase() ?? "";

  return normalized.length > 0 ? normalized : null;
}
