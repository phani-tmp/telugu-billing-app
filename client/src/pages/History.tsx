import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { FileText, Calendar } from "lucide-react";
import BillDisplay from "@/components/BillDisplay";
import type { Bill, BillItem } from "@shared/schema";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function History() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  
  const { data: bills = [] } = useQuery<Bill[]>({
    queryKey: ["/api/bills", selectedDate],
    queryFn: async () => {
      const url = selectedDate ? `/api/bills?date=${selectedDate}` : "/api/bills";
      const response = await fetch(url);
      return response.json();
    },
  });

  const { data: billItems = [] } = useQuery<BillItem[]>({
    queryKey: ["/api/bills", selectedBill?.id, "items"],
    enabled: !!selectedBill?.id,
    queryFn: async () => {
      const response = await fetch(`/api/bills/${selectedBill?.id}/items`);
      return response.json();
    },
  });

  const { data: dailyTotalData } = useQuery<{ total: number }>({
    queryKey: ["/api/daily-total", selectedDate],
    enabled: !!selectedDate,
    queryFn: async () => {
      const response = await fetch(`/api/daily-total/${selectedDate}`);
      return response.json();
    },
  });

  const totalAmount = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">బిల్లుల చరిత్ర</h1>
          <p className="text-sm text-muted-foreground">
            మునుపటి బిల్లులను చూడండి
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              data-testid="input-date-filter"
              className="flex-1"
            />
          </div>

          {selectedDate && dailyTotalData && (
            <div className="bg-primary/10 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">రోజు మొత్తం వ్యాపారం</span>
                <span className="font-mono font-bold text-2xl text-primary">
                  ₹{dailyTotalData.total.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {!selectedDate && bills.length > 0 && (
            <div className="bg-primary/10 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">మొత్తం బిల్లులు: {bills.length}</span>
                <span className="font-mono font-bold text-lg">₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          )}
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
                      {format(new Date(bill.createdAt), "dd/MM/yyyy hh:mm a")}
                    </div>
                  </div>
                </div>
                <Badge variant="secondary" className="font-mono text-base flex-shrink-0">
                  ₹{bill.totalAmount.toFixed(2)}
                </Badge>
              </div>
            </Card>
          ))}
          {bills.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              {selectedDate ? "ఈ తేదీకి బిల్లులు లేవు" : "బిల్లులు లేవు"}
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!selectedBill} onOpenChange={() => setSelectedBill(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          {selectedBill && (
            <BillDisplay
              billNumber={selectedBill.billNumber}
              items={billItems}
              totalAmount={selectedBill.totalAmount}
              createdAt={new Date(selectedBill.createdAt)}
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
