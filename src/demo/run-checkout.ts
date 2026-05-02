import * as Sentry from "@sentry/bun";
import { z } from "zod";
import { calculateCheckout } from "../cart/checkout";

const DemoEnvSchema = z
  .object({
    GEM_DSN: z.string().url(),
    GEM_ENVIRONMENT: z.string().trim().min(1).default("agent-e2e"),
    GEM_RELEASE: z.string().trim().min(1).default("gem-agent-lab@0.1.0"),
  })
  .passthrough();

const config = DemoEnvSchema.parse(Bun.env);

Sentry.init({
  dsn: config.GEM_DSN,
  environment: config.GEM_ENVIRONMENT,
  release: config.GEM_RELEASE,
  tracesSampleRate: 1,
});

try {
  const summary = calculateCheckout({
    items: [
      {
        price: 49,
        quantity: 1,
        sku: "agent-lab-seat",
      },
    ],
  });

  await Bun.stdout.write(`Checkout total: ${summary.total}\n`);
} catch (error) {
  const eventId = Sentry.captureException(error);
  const flushed = await Sentry.flush(5000);

  if (!flushed) {
    throw new Error("Sentry SDK did not flush the checkout exception before timeout.");
  }

  await Bun.stdout.write(`Sent Gem agent lab exception ${eventId}\n`);
  throw error;
}
