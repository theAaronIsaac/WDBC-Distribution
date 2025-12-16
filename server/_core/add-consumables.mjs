import { drizzle } from "drizzle-orm/mysql2";
import { products } from "./drizzle/schema.ts";

const db = drizzle(process.env.DATABASE_URL);

const consumablesProducts = [
  {
    name: "Cole-Parmer Transfer Pipette, 7.5 mL",
    description: "Economic Transfer Pipette, 7.5 mL, General Purpose; 500/Box. Model: EW-06226-11",
    category: "consumables",
    priceUsd: 1740, // $17.40
    quantityPerUnit: 500,
    unit: "box",
    inStock: true,
  },
  {
    name: "B-D Disposable Syringe, 5mL, Slip-Tip",
    description: "Non-Sterile, Slip-Tip, Bulk Pack, 5 mL; 1400/Cs. Model: EW-07945-08",
    category: "consumables",
    priceUsd: 27225, // $272.25
    quantityPerUnit: 1400,
    unit: "case",
    inStock: true,
  },
  {
    name: "B-D Disposable Syringe, 5mL, Luer-Lok",
    description: "Non-Sterile, Luer-Lok, Bulk Pack, 5 mL; 1400/Cs. Model: EW-07945-06",
    category: "consumables",
    priceUsd: 25463, // $254.63
    quantityPerUnit: 1400,
    unit: "case",
    inStock: true,
  },
];

async function addProducts() {
  try {
    console.log("Adding consumables products...");
    
    for (const product of consumablesProducts) {
      await db.insert(products).values(product);
      console.log(`✓ Added: ${product.name}`);
    }
    
    console.log("\n✅ All consumables products added successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error adding products:", error);
    process.exit(1);
  }
}

addProducts();
