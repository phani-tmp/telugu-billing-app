// import type { Express } from "express";
// import { createServer, type Server } from "http";
// import { storage } from "./storage";
// import { insertItemSchema, insertBillSchema, insertBillItemSchema } from "@shared/schema";

// export async function registerRoutes(app: Express): Promise<Server> {
//   app.get("/api/items", async (_req, res) => {
//     try {
//       const items = await storage.getItems();
//       res.json(items);
//     } catch (error) {
//       res.status(500).json({ error: "Failed to fetch items" });
//     }
//   });

//   app.post("/api/items", async (req, res) => {
//     try {
//       const data = insertItemSchema.parse(req.body);
//       const item = await storage.createItem(data);
//       res.json(item);
//     } catch (error) {
//       res.status(400).json({ error: "Invalid item data" });
//     }
//   });

//   app.patch("/api/items/:id", async (req, res) => {
//     try {
//       const { id } = req.params;
//       const data = insertItemSchema.partial().parse(req.body);
//       const item = await storage.updateItem(id, data);
//       res.json(item);
//     } catch (error) {
//       res.status(400).json({ error: "Failed to update item" });
//     }
//   });

//   app.delete("/api/items/:id", async (req, res) => {
//     try {
//       const { id } = req.params;
//       await storage.deleteItem(id);
//       res.json({ success: true });
//     } catch (error) {
//       res.status(400).json({ error: "Failed to delete item" });
//     }
//   });

//   app.get("/api/bills", async (req, res) => {
//     try {
//       const date = req.query.date as string | undefined;
//       const bills = await storage.getBills(date);
//       res.json(bills);
//     } catch (error) {
//       res.status(500).json({ error: "Failed to fetch bills" });
//     }
//   });

//   app.get("/api/bills/:id/items", async (req, res) => {
//     try {
//       const { id } = req.params;
//       const items = await storage.getBillItems(id);
//       res.json(items);
//     } catch (error) {
//       res.status(500).json({ error: "Failed to fetch bill items" });
//     }
//   });

//   app.post("/api/bills", async (req, res) => {
//     try {
//       const { bill, items } = req.body;
//       const billData = insertBillSchema.parse(bill);
//       const createdBill = await storage.createBill(billData);

//       for (const item of items) {
//         const billItemData = insertBillItemSchema.parse({
//           ...item,
//           billId: createdBill.id,
//         });
//         await storage.createBillItem(billItemData);
//       }

//       res.json(createdBill);
//     } catch (error) {
//       res.status(400).json({ error: "Failed to create bill" });
//     }
//   });

//   app.get("/api/daily-total/:date", async (req, res) => {
//     try {
//       const { date } = req.params;
//       const total = await storage.getDailyTotal(date);
//       res.json({ total });
//     } catch (error) {
//       res.status(500).json({ error: "Failed to fetch daily total" });
//     }
//   });

//   const httpServer = createServer(app);

//   return httpServer;
// }

// import type { Express } from "express";
// import { createServer, type Server } from "http";
// import { storage } from "./storage";
// import { insertItemSchema, insertBillSchema, insertBillItemSchema } from "@shared/schema";

// // This regex path handles:
// // 1. /api/items (The correct path)
// // 2. /api/api/items (The path seen in your logs)
// const ITEM_ROUTE_BASE = "/api(?:/api)?/items";
// const BILL_ROUTE_BASE = "/api/bills";

// export async function registerRoutes(app: Express): Promise<Server> {
//   // --- ITEM ROUTES ---

//   // GET /api/items or /api/api/items
//   app.get(ITEM_ROUTE_BASE, async (_req, res) => {
//     try {
//       const items = await storage.getItems();
//       res.json(items);
//     } catch (error) {
//       console.error("GET /api/items error:", error);
//       res.status(500).json({ error: "Failed to fetch items" });
//     }
//   });

//   // POST /api/items or /api/api/items (CREATE ITEM)
//   app.post(ITEM_ROUTE_BASE, async (req, res) => {
//     try {
//       // Note: We should probably add a console log here to confirm what data is received.
//       // console.log("POST /api/items received data:", req.body);
//       const data = insertItemSchema.parse(req.body);
//       const item = await storage.createItem(data);
//       res.json(item);
//     } catch (error) {
//       console.error("POST /api/items error:", error);
//       res.status(400).json({ error: "Invalid item data or failed database insert" });
//     }
//   });

//   // PATCH /api/items/:id or /api/api/items/:id (UPDATE ITEM)
//   app.patch(`${ITEM_ROUTE_BASE}/:id`, async (req, res) => {
//     try {
//       const { id } = req.params;
//       const data = insertItemSchema.partial().parse(req.body);
//       const item = await storage.updateItem(id, data);
//       res.json(item);
//     } catch (error) {
//       console.error("PATCH /api/items/:id error:", error);
//       res.status(400).json({ error: "Failed to update item" });
//     }
//   });

//   // DELETE /api/items/:id or /api/api/items/:id
//   app.delete(`${ITEM_ROUTE_BASE}/:id`, async (req, res) => {
//     try {
//       const { id } = req.params;
//       await storage.deleteItem(id);
//       res.json({ success: true });
//     } catch (error) {
//       console.error("DELETE /api/items/:id error:", error);
//       res.status(400).json({ error: "Failed to delete item" });
//     }
//   });

//   // --- BILL ROUTES ---

//   // GET /api/bills (FETCH BILLS)
//   app.get(BILL_ROUTE_BASE, async (req, res) => {
//     try {
//       const date = req.query.date as string | undefined;
//       const bills = await storage.getBills(date);
//       res.json(bills);
//     } catch (error) {
//       console.error("GET /api/bills error:", error);
//       res.status(500).json({ error: "Failed to fetch bills" });
//     }
//   });

//   // GET /api/bills/:id/items (FETCH BILL ITEMS)
//   app.get(`${BILL_ROUTE_BASE}/:id/items`, async (req, res) => {
//     try {
//       const { id } = req.params;
//       const items = await storage.getBillItems(id);
//       res.json(items);
//     } catch (error) {
//       console.error("GET /api/bills/:id/items error:", error);
//       res.status(500).json({ error: "Failed to fetch bill items" });
//     }
//   });

//   // POST /api/bills (CREATE BILL)
//   app.post(BILL_ROUTE_BASE, async (req, res) => {
//     try {
//       const { bill, items } = req.body;
//       const billData = insertBillSchema.parse(bill);
//       const createdBill = await storage.createBill(billData);

//       for (const item of items) {
//         const billItemData = insertBillItemSchema.parse({
//           ...item,
//           billId: createdBill.id,
//         });
//         await storage.createBillItem(billItemData);
//       }

//       res.json(createdBill);
//     } catch (error) {
//       console.error("POST /api/bills error:", error);
//       // Log the Zod validation errors more clearly if needed
//       res.status(400).json({ error: "Failed to create bill: Invalid data structure" });
//     }
//   });

//   // GET /api/daily-total/:date
//   app.get("/api/daily-total/:date", async (req, res) => {
//     try {
//       const { date } = req.params;
//       const total = await storage.getDailyTotal(date);
//       res.json({ total });
//     } catch (error) {
//       console.error("GET /api/daily-total/:date error:", error);
//       res.status(500).json({ error: "Failed to fetch daily total" });
//     }
//   });

//   const httpServer = createServer(app);

//   return httpServer;
// }


import type { Express } from "express";
import { createServer, type Server } from "http";
// Assuming 'db' is the Drizzle client and 'storage' is the wrapper service
import { db } from "./db";
import { storage } from "./storage";
import { insertItemSchema, insertBillSchema, insertBillItemSchema, items as itemsSchema, bills as billsSchema, billItems as billItemsSchema } from "@shared/schema";

// This regex path handles:
// 1. /api/items (The correct path)
// 2. /api/api/items (The path seen in your logs)
const ITEM_ROUTE_BASE = "/api(?:/api)?/items";
const BILL_ROUTE_BASE = "/api/bills";

export async function registerRoutes(app: Express): Promise<Server> {
  // --- ITEM ROUTES ---

  // GET /api/items or /api/api/items
  app.get(ITEM_ROUTE_BASE, async (_req, res) => {
    try {
      const items = await storage.getItems();
      res.json(items);
    } catch (error) {
      console.error("GET /api/items error:", error);
      res.status(500).json({ error: "Failed to fetch items" });
    }
  });

  // POST /api/items or /api/api/items (CREATE ITEM)
  app.post(ITEM_ROUTE_BASE, async (req, res) => {
    try {
      const data = insertItemSchema.parse(req.body);
      const item = await storage.createItem(data);
      res.json(item);
    } catch (error) {
      console.error("POST /api/items error:", error);
      res.status(400).json({ error: "Invalid item data or failed database insert" });
    }
  });

  // PATCH /api/items/:id or /api/api/items/:id (UPDATE ITEM)
  app.patch(`${ITEM_ROUTE_BASE}/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertItemSchema.partial().parse(req.body);
      const item = await storage.updateItem(id, data);
      res.json(item);
    } catch (error) {
      console.error("PATCH /api/items/:id error:", error);
      res.status(400).json({ error: "Failed to update item" });
    }
  });

  // DELETE /api/items/:id or /api/api/items/:id
  app.delete(`${ITEM_ROUTE_BASE}/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteItem(id);
      res.json({ success: true });
    } catch (error) {
      console.error("DELETE /api/items/:id error:", error);
      res.status(400).json({ error: "Failed to delete item" });
    }
  });

  // --- BILL ROUTES ---

  // GET /api/bills (FETCH BILLS)
  app.get(BILL_ROUTE_BASE, async (req, res) => {
    try {
      const date = req.query.date as string | undefined;
      const bills = await storage.getBills(date);
      res.json(bills);
    } catch (error) {
      console.error("GET /api/bills error:", error);
      res.status(500).json({ error: "Failed to fetch bills" });
    }
  });

  // GET /api/bills/:id/items (FETCH BILL ITEMS)
  app.get(`${BILL_ROUTE_BASE}/:id/items`, async (req, res) => {
    try {
      const { id } = req.params;
      const items = await storage.getBillItems(id);
      res.json(items);
    } catch (error) {
      console.error("GET /api/bills/:id/items error:", error);
      res.status(500).json({ error: "Failed to fetch bill items" });
    }
  });

  // POST /api/bills (CREATE BILL - CRITICAL FIX: TRANSACTION LOGIC)
  app.post(BILL_ROUTE_BASE, async (req, res) => {
    try {
      const { bill, items } = req.body;

      // 1. Validate all parts before attempting any DB write
      const billData = insertBillSchema.parse(bill);
      const billItemsData = items.map((item: unknown) => insertBillItemSchema.partial().parse(item));

      // 2. Execute the entire save operation atomically using Drizzle's transaction method
      const createdBill = await db.transaction(async (tx) => {

        // NOTE: Fix is applied here by importing billsSchema/billItemsSchema directly.
        const [createdBillRecord] = await tx
          .insert(billsSchema)
          .values(billData)
          .returning();

        if (!createdBillRecord) {
          // This should only happen if the DB is truly broken
          throw new Error("Transaction: Failed to return bill ID.");
        }

        // 2b. Create all bill item records
        for (const item of billItemsData) {
          await tx
            .insert(billItemsSchema)
            .values({
              ...item,
              billId: createdBillRecord.id, // Link items to the new bill ID
            });
        }

        return createdBillRecord;
      });

      console.log(`POST /api/bills: SUCCESS - Bill ID: ${createdBill.id} created.`);
      res.json(createdBill);

    } catch (error) {
      // If we reach this, the error occurred during validation, DB transaction, or commit.
      console.error("POST /api/bills ERROR: Database or Validation Failure:", error);
      // We return a 500 error since the failure is likely internal (database/schema logic)
      res.status(500).json({ error: "Failed to save bill: Internal database transaction failure." });
    }
  });

  app.get("/api/daily-total/:date", async (req, res) => {
    try {
      const { date } = req.params;
      const total = await storage.getDailyTotal(date);
      res.json({ total });
    } catch (error) {
      console.error("GET /api/daily-total/:date error:", error);
      res.status(500).json({ error: "Failed to fetch daily total" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
