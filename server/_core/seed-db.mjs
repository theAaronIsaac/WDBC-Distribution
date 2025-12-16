import { drizzle } from "drizzle-orm/mysql2";
import { products, shippingRates } from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

async function seed() {
  console.log("Seeding database...");

  // Insert SR17018 products in different weights
  const productData = [
    {
      name: "SR17018 - 1 Gram",
      description: "SR17018 research compound, 1 gram quantity. For research purposes only.",
      weightGrams: 1,
      priceUsd: 4900, // $49.00
      inStock: true,
    },
    {
      name: "SR17018 - 3 Grams",
      description: "SR17018 research compound, 3 gram quantity. For research purposes only.",
      weightGrams: 3,
      priceUsd: 12900, // $129.00
      inStock: true,
    },
    {
      name: "SR17018 - 5 Grams",
      description: "SR17018 research compound, 5 gram quantity. For research purposes only.",
      weightGrams: 5,
      priceUsd: 19900, // $199.00
      inStock: true,
    },
    {
      name: "SR17018 - 10 Grams",
      description: "SR17018 research compound, 10 gram quantity. For research purposes only.",
      weightGrams: 10,
      priceUsd: 34900, // $349.00
      inStock: true,
    },
  ];

  console.log("Inserting products...");
  await db.insert(products).values(productData);

  // Insert shipping rates for USPS
  const uspsRates = [
    {
      carrier: "USPS",
      serviceName: "First Class Mail",
      description: "Economical shipping for lightweight packages",
      estimatedDays: "2-5 business days",
      baseRate: 500, // $5.00
      active: true,
      displayOrder: 1,
    },
    {
      carrier: "USPS",
      serviceName: "Priority Mail",
      description: "Fast and reliable service with tracking",
      estimatedDays: "1-3 business days",
      baseRate: 900, // $9.00
      active: true,
      displayOrder: 2,
    },
    {
      carrier: "USPS",
      serviceName: "Priority Mail Express",
      description: "Overnight to 2-day delivery with guarantee",
      estimatedDays: "1-2 business days",
      baseRate: 2500, // $25.00
      active: true,
      displayOrder: 3,
    },
  ];

  // Insert shipping rates for UPS
  const upsRates = [
    {
      carrier: "UPS",
      serviceName: "UPS Ground",
      description: "Reliable ground delivery service",
      estimatedDays: "1-5 business days",
      baseRate: 1200, // $12.00
      active: true,
      displayOrder: 4,
    },
    {
      carrier: "UPS",
      serviceName: "UPS 3 Day Select",
      description: "Guaranteed 3-day delivery",
      estimatedDays: "3 business days",
      baseRate: 1800, // $18.00
      active: true,
      displayOrder: 5,
    },
    {
      carrier: "UPS",
      serviceName: "UPS 2nd Day Air",
      description: "Second business day delivery",
      estimatedDays: "2 business days",
      baseRate: 2800, // $28.00
      active: true,
      displayOrder: 6,
    },
    {
      carrier: "UPS",
      serviceName: "UPS Next Day Air",
      description: "Next business day delivery",
      estimatedDays: "1 business day",
      baseRate: 4500, // $45.00
      active: true,
      displayOrder: 7,
    },
  ];

  console.log("Inserting shipping rates...");
  await db.insert(shippingRates).values([...uspsRates, ...upsRates]);

  console.log("Database seeded successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
