import { describe, expect, test } from "bun:test";
import { calculateCheckout } from "./checkout";

describe("calculateCheckout", () => {
  test("allows checkout without a coupon", () => {
    expect(
      calculateCheckout({
        items: [
          {
            price: 25,
            quantity: 2,
            sku: "gem-demo-seat",
          },
        ],
      }),
    ).toEqual({
      discountCode: null,
      subtotal: 50,
      total: 50,
    });
  });

  test("applies the AGENT10 coupon", () => {
    expect(
      calculateCheckout({
        coupon: " agent10 ",
        items: [
          {
            price: 100,
            quantity: 1,
            sku: "gem-demo-plan",
          },
        ],
      }),
    ).toEqual({
      discountCode: "AGENT10",
      subtotal: 100,
      total: 90,
    });
  });
});
