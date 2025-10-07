import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Share2, Printer, Save } from "lucide-react";
import { format } from "date-fns";

interface BillItem {
  itemName: string;
  quantity: number;
  price: number;
  total: number;
}

interface BillDisplayProps {
  billNumber: string;
  items: BillItem[];
  totalAmount: number;
  createdAt?: Date;
  onShare?: () => void;
  onPrint?: () => void;
  onSave?: () => void;
}

export default function BillDisplay({
  billNumber,
  items,
  totalAmount,
  createdAt = new Date(),
  onShare,
  onPrint,
  onSave,
}: BillDisplayProps) {
  return (
    <div className="space-y-4">
      <Card className="p-6 space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold">బిల్లు</h2>
          <div className="text-sm text-muted-foreground" data-testid="text-bill-number">
            #₹{billNumber}
          </div>
          <div className="text-xs text-muted-foreground">
            {format(createdAt, "dd/MM/yyyy hh:mm a")}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-semibold truncate" data-testid={`text-bill-item-${index}`}>
                  {item.itemName}
                </div>
                <div className="text-sm text-muted-foreground">
                  {item.quantity} కేజీ × ₹{item.price}
                </div>
              </div>
              <div className="font-mono font-semibold" data-testid={`text-bill-total-${index}`}>
                ₹{item.total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="bg-primary/10 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">మొత్తం</span>
            <span className="text-3xl font-bold text-primary font-mono" data-testid="text-total-amount">
              ₹{totalAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </Card>

      <div className="space-y-2">
        <Button
          className="w-full h-14"
          variant="outline"
          data-testid="button-share"
          onClick={onShare}
        >
          <Share2 className="h-5 w-5 mr-2" />
          షేర్ చేయండి
        </Button>
        <Button
          className="w-full h-14"
          variant="outline"
          data-testid="button-print"
          onClick={onPrint}
        >
          <Printer className="h-5 w-5 mr-2" />
          ప్రింట్ చేయండి
        </Button>
        <Button
          className="w-full h-14"
          data-testid="button-save"
          onClick={onSave}
        >
          <Save className="h-5 w-5 mr-2" />
          సేవ్ చేయండి
        </Button>
      </div>
    </div>
  );
}
