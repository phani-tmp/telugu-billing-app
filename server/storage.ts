import { items, bills, billItems, type Item, type InsertItem, type Bill, type InsertBill, type BillItem, type InsertBillItem } from "@shared/schema";
import { db } from "./db";
import { eq, desc, sql } from "drizzle-orm";

export interface IStorage {
  getItems(): Promise<Item[]>;
  getItem(id: string): Promise<Item | undefined>;
  createItem(item: InsertItem): Promise<Item>;
  updateItem(id: string, item: Partial<InsertItem>): Promise<Item>;
  deleteItem(id: string): Promise<void>;
  
  getBills(date?: string): Promise<Bill[]>;
  getBill(id: string): Promise<Bill | undefined>;
  createBill(bill: InsertBill): Promise<Bill>;
  
  getBillItems(billId: string): Promise<BillItem[]>;
  createBillItem(billItem: InsertBillItem): Promise<BillItem>;
  
  getDailyTotal(date: string): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async getItems(): Promise<Item[]> {
    return await db.select().from(items).orderBy(items.name);
  }

  async getItem(id: string): Promise<Item | undefined> {
    const [item] = await db.select().from(items).where(eq(items.id, id));
    return item || undefined;
  }

  async createItem(insertItem: InsertItem): Promise<Item> {
    const [item] = await db.insert(items).values(insertItem).returning();
    return item;
  }

  async updateItem(id: string, updateData: Partial<InsertItem>): Promise<Item> {
    const [item] = await db
      .update(items)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(items.id, id))
      .returning();
    return item;
  }

  async deleteItem(id: string): Promise<void> {
    await db.delete(items).where(eq(items.id, id));
  }

  async getBills(date?: string): Promise<Bill[]> {
    if (date) {
      return await db
        .select()
        .from(bills)
        .where(eq(bills.billDate, date))
        .orderBy(desc(bills.createdAt));
    }
    return await db.select().from(bills).orderBy(desc(bills.createdAt));
  }

  async getBill(id: string): Promise<Bill | undefined> {
    const [bill] = await db.select().from(bills).where(eq(bills.id, id));
    return bill || undefined;
  }

  async createBill(insertBill: InsertBill): Promise<Bill> {
    const [bill] = await db.insert(bills).values(insertBill).returning();
    return bill;
  }

  async getBillItems(billId: string): Promise<BillItem[]> {
    return await db.select().from(billItems).where(eq(billItems.billId, billId));
  }

  async createBillItem(insertBillItem: InsertBillItem): Promise<BillItem> {
    const [billItem] = await db.insert(billItems).values(insertBillItem).returning();
    return billItem;
  }

  async getDailyTotal(date: string): Promise<number> {
    const result = await db
      .select({ total: sql<number>`COALESCE(SUM(${bills.totalAmount}), 0)` })
      .from(bills)
      .where(eq(bills.billDate, date));
    return result[0]?.total || 0;
  }
}

export const storage = new DatabaseStorage();
