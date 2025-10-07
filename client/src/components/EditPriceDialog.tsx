import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditPriceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  currentPrice: number;
  onSave: (price: number) => void;
}

export default function EditPriceDialog({
  open,
  onOpenChange,
  itemName,
  currentPrice,
  onSave,
}: EditPriceDialogProps) {
  const [price, setPrice] = useState(currentPrice.toString());

  const handleSave = () => {
    const newPrice = parseFloat(price);
    if (!isNaN(newPrice) && newPrice >= 0) {
      onSave(newPrice);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{itemName} - ధర మార్చండి</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              కొత్త ధర (కేజీకి)
            </label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              data-testid="input-edit-price"
              className="font-mono text-lg"
              step="0.5"
              min="0"
              autoFocus
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              data-testid="button-cancel-edit"
            >
              రద్దు చేయండి
            </Button>
            <Button
              className="flex-1"
              onClick={handleSave}
              data-testid="button-save-price"
            >
              సేవ్ చేయండి
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
