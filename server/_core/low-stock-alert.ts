import { notifyOwner } from "./_core/notification";

interface LowStockAlertData {
  productId: number;
  productName: string;
  currentStock: number;
  threshold: number;
  category: string;
}

/**
 * Send low-stock alert email to owner
 */
export async function sendLowStockAlert(data: LowStockAlertData): Promise<boolean> {
  const title = `⚠️ Low Stock Alert: ${data.productName}`;
  
  const content = `
Product: ${data.productName}
Category: ${data.category}
Current Stock: ${data.currentStock} units
Low Stock Threshold: ${data.threshold} units

Action Required: Please restock this product to avoid stockouts.

You can update the stock level in the admin panel:
- Go to Admin → Products
- Find "${data.productName}"
- Click "Stock" button to update inventory

Product ID: ${data.productId}
`;

  try {
    const success = await notifyOwner({
      title,
      content,
    });
    
    if (success) {
      console.log(`Low stock alert sent for product: ${data.productName} (${data.currentStock} remaining)`);
    } else {
      console.error(`Failed to send low stock alert for product: ${data.productName}`);
    }
    
    return success;
  } catch (error) {
    console.error("Error sending low stock alert:", error);
    return false;
  }
}
