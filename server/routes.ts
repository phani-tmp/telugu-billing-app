import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertItemSchema, insertBillSchema, insertBillItemSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/items", async (_req, res) => {
    try {
      const items = await storage.getItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch items" });
    }
  });

  app.post("/api/items", async (req, res) => {
    try {
      const data = insertItemSchema.parse(req.body);
      const item = await storage.createItem(data);
      res.json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid item data" });
    }
  });

  app.patch("/api/items/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertItemSchema.partial().parse(req.body);
      const item = await storage.updateItem(id, data);
      res.json(item);
    } catch (error) {
      res.status(400).json({ error: "Failed to update item" });
    }
  });

  app.delete("/api/items/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteItem(id);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ error: "Failed to delete item" });
    }
  });

  app.get("/api/bills", async (req, res) => {
    try {
      const date = req.query.date as string | undefined;
      const bills = await storage.getBills(date);
      res.json(bills);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bills" });
    }
  });

  app.get("/api/bills/:id/items", async (req, res) => {
    try {
      const { id } = req.params;
      const items = await storage.getBillItems(id);
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch bill items" });
    }
  });

  app.post("/api/bills", async (req, res) => {
    try {
      const { bill, items } = req.body;
      const billData = insertBillSchema.parse(bill);
      const createdBill = await storage.createBill(billData);

      for (const item of items) {
        const billItemData = insertBillItemSchema.parse({
          ...item,
          billId: createdBill.id,
        });
        await storage.createBillItem(billItemData);
      }

      res.json(createdBill);
    } catch (error) {
      res.status(400).json({ error: "Failed to create bill" });
    }
  });

  app.get("/api/daily-total/:date", async (req, res) => {
    try {
      const { date } = req.params;
      const total = await storage.getDailyTotal(date);
      res.json({ total });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch daily total" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
