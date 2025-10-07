import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { FileText } from "lucide-react";
import BillDisplay from "@/components/BillDisplay";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface Bill {
  id: string;
  billNumber: string;
  totalAmount: number;
  itemCount: number;
  createdAt: Date;
  items: Array<{
    itemName: string;
    quantity: number;
    price: number;
    total: number;
  }>;
}

export default function History() {
  const [bills] = useState<Bill[]>([
    {
      id: "1",
      billNumber: "B001234",
      totalAmount: 205,
      itemCount: 3,
      createdAt: new Date(2024, 0, 7, 10, 30),
      items: [
        { itemName: "టమాటా", quantity: 2.5, price: 40, total: 100 },
        { itemName: "ఉల్లిపాయలు", quantity: 1, price: 30, total: 30 },
        { itemName: "బంగాళాదుంప", quantity: 3, price: 25, total: 75 },
      ],
    },
    {
      id: "2",
      billNumber: "B001235",
      totalAmount: 120,
      itemCount: 2,
      createdAt: new Date(2024, 0, 7, 11, 45),
      items: [
        { itemName: "టమాటా", quantity: 1, price: 40, total: 40 },
        { itemName: "బంగాళాదుంప", quantity: 2, price: 40, total: 80 },
      ],
    },
  ]);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">బిల్లుల చరిత్ర</h1>
          <p className="text-sm text-muted-foreground">
            మునుపటి బిల్లులను చూడండి
          </p>
        </div>

        <div className="space-y-3">
          {bills.map((bill) => (
            <Card
              key={bill.id}
              className="p-4 cursor-pointer hover-elevate active-elevate-2"
              data-testid={`card-bill-${bill.billNumber}`}
              onClick={() => setSelectedBill(bill)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold font-mono" data-testid={`text-bill-number-${bill.id}`}>
                      #{bill.billNumber}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(bill.createdAt, "dd/MM/yyyy hh:mm a")}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {bill.itemCount} వస్తువులు
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="font-mono text-base flex-shrink-0">
                  ₹{bill.totalAmount}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedBill} onOpenChange={() => setSelectedBill(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          {selectedBill && (
            <BillDisplay
              billNumber={selectedBill.billNumber}
              items={selectedBill.items}
              totalAmount={selectedBill.totalAmount}
              createdAt={selectedBill.createdAt}
              onShare={() => console.log("Share")}
              onPrint={() => console.log("Print")}
              onSave={() => console.log("Save")}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
