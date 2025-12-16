import bcrypt from "bcryptjs";

const hashedPassword = bcrypt.hashSync("password123", 10);

const mockUsers = [
  { id: 1, email: "admin@example.com", password: hashedPassword, role: "admin", createdAt: new Date() },
  { id: 2, email: "user@example.com", password: hashedPassword, role: "user", createdAt: new Date() },
];

const mockProducts = [
  { id: 1, name: "SR17018 1g", priceUsd: 6000, weightGrams: 1, inStock: true, stockQuantity: 100, category: "chemicals", description: "" },
  { id: 2, name: "SR17018 3g", priceUsd: 18000, weightGrams: 3, inStock: true, stockQuantity: 100, category: "chemicals", description: "" },
  { id: 3, name: "SR17018 5g", priceUsd: 29000, weightGrams: 5, inStock: true, stockQuantity: 100, category: "chemicals", description: "" },
  { id: 4, name: "SR17018 10g", priceUsd: 49000, weightGrams: 10, inStock: true, stockQuantity: 100, category: "chemicals", description: "" },
];

const mockShippingRates = [
  { id: 1, carrier: "USPS", serviceName: "Priority Mail", baseRate: 900, active: true },
  { id: 2, carrier: "UPS", serviceName: "Ground", baseRate: 1200, active: true },
];

const mockOrders = [
  { id: 1, orderNumber: "ORD-001", status: "pending", paymentStatus: "pending", createdAt: new Date(), updatedAt: new Date(), customerEmail: "test@example.com", totalAmountUsd: 6000, trackingNumber: null },
];

const mockContacts = [
  { id: 1, name: "Test User", email: "test@example.com", message: "Test message", status: "new", createdAt: new Date() },
];

const getTableData = (table: any): any[] => {
  let tableName = "";
  
  if (typeof table === "string") {
    tableName = table;
  } else if (table?.name) {
    tableName = String(table.name);
  } else if (table?._?.name) {
    tableName = String(table._.name);
  }
  
  if (tableName.includes("users")) return mockUsers;
  if (tableName.includes("products")) return mockProducts;
  if (tableName.includes("shippingRates")) return mockShippingRates;
  if (tableName.includes("orders")) return mockOrders;
  if (tableName.includes("contacts")) return mockContacts;
  
  return [];
};

export const getDb = async () => {
  return {
    select: () => ({
      from: (table: any) => {
        const data = getTableData(table);
        
        // Return a thenable object that acts like a promise but also has chainable methods
        return {
          [Symbol.toStringTag]: "Promise",
          then: (onFulfilled: any, onRejected?: any) => {
            return Promise.resolve(data).then(onFulfilled, onRejected);
          },
          catch: (onRejected: any) => {
            return Promise.resolve(data).catch(onRejected);
          },
          finally: (onFinally: any) => {
            return Promise.resolve(data).finally(onFinally);
          },
          where: () => ({
            then: (onFulfilled: any, onRejected?: any) => {
              return Promise.resolve(data).then(onFulfilled, onRejected);
            },
            catch: (onRejected: any) => {
              return Promise.resolve(data).catch(onRejected);
            },
            finally: (onFinally: any) => {
              return Promise.resolve(data).finally(onFinally);
            },
            limit: () => ({
              then: (onFulfilled: any, onRejected?: any) => {
                return Promise.resolve(data).then(onFulfilled, onRejected);
              },
              catch: (onRejected: any) => {
                return Promise.resolve(data).catch(onRejected);
              },
            }),
          }),
          orderBy: () => ({
            then: (onFulfilled: any, onRejected?: any) => {
              return Promise.resolve(data).then(onFulfilled, onRejected);
            },
            catch: (onRejected: any) => {
              return Promise.resolve(data).catch(onRejected);
            },
          }),
          limit: () => ({
            then: (onFulfilled: any, onRejected?: any) => {
              return Promise.resolve(data).then(onFulfilled, onRejected);
            },
            catch: (onRejected: any) => {
              return Promise.resolve(data).catch(onRejected);
            },
          }),
        };
      },
    }),
    insert: (table: any) => ({
      values: (values: any) => Promise.resolve([{ insertId: 1 }]),
    }),
    update: (table: any) => ({
      set: (values: any) => ({
        where: (condition: any) => Promise.resolve(),
      }),
    }),
    delete: (table: any) => ({
      where: (condition: any) => Promise.resolve(),
    }),
  };
};
