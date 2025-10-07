import { type Item, type InsertItem, type Bill, type InsertBill, type BillItem, type InsertBillItem } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getItems(): Promise<Item[]>;
  getItem(id: string): Promise<Item | undefined>;
  createItem(item: InsertItem): Promise<Item>;
  
  getBills(): Promise<Bill[]>;
  getBill(id: string): Promise<Bill | undefined>;
  createBill(bill: InsertBill): Promise<Bill>;
  
  getBillItems(billId: string): Promise<BillItem[]>;
  createBillItem(billItem: InsertBillItem): Promise<BillItem>;
}

export class MemStorage implements IStorage {
  private items: Map<string, Item>;
  private bills: Map<string, Bill>;
  private billItems: Map<string, BillItem>;

  constructor() {
    this.items = new Map();
    this.bills = new Map();
    this.billItems = new Map();
  }

  async getItems(): Promise<Item[]> {
    return Array.from(this.items.values());
  }

  async getItem(id: string): Promise<Item | undefined> {
    return this.items.get(id);
  }

  async createItem(insertItem: InsertItem): Promise<Item> {
    const id = randomUUID();
    const item: Item = { id, name: insertItem.name, price: insertItem.price ?? 0 };
    this.items.set(id, item);
    return item;
  }

  async getBills(): Promise<Bill[]> {
    return Array.from(this.bills.values()).sort((a, b) => 
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getBill(id: string): Promise<Bill | undefined> {
    return this.bills.get(id);
  }

  async createBill(insertBill: InsertBill): Promise<Bill> {
    const id = randomUUID();
    const bill: Bill = { ...insertBill, id, createdAt: new Date() };
    this.bills.set(id, bill);
    return bill;
  }

  async getBillItems(billId: string): Promise<BillItem[]> {
    return Array.from(this.billItems.values()).filter(
      (item) => item.billId === billId
    );
  }

  async createBillItem(insertBillItem: InsertBillItem): Promise<BillItem> {
    const id = randomUUID();
    const billItem: BillItem = { ...insertBillItem, id };
    this.billItems.set(id, billItem);
    return billItem;
  }
}

export const storage = new MemStorage();
