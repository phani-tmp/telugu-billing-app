import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  unit?: string;
}

export default function QuantityInput({ value, onChange, unit = "కేజీలు" }: QuantityInputProps) {
  const handleIncrement = (amount: number) => {
    onChange(Math.max(0, value + amount));
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <div className="text-4xl font-bold font-mono mb-2" data-testid="text-quantity-value">
          {value.toFixed(2)}
        </div>
        <div className="text-sm text-muted-foreground">{unit}</div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          size="icon"
          variant="outline"
          data-testid="button-decrease"
          onClick={() => handleIncrement(-0.25)}
          disabled={value <= 0}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(Math.max(0, parseFloat(e.target.value) || 0))}
          className="text-center text-xl font-mono"
          data-testid="input-quantity"
          step="0.25"
          min="0"
        />
        <Button
          size="icon"
          variant="outline"
          data-testid="button-increase"
          onClick={() => handleIncrement(0.25)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[0.25, 0.5, 1, 5].map((amount) => (
          <Button
            key={amount}
            variant="secondary"
            data-testid={`button-add-${amount}`}
            onClick={() => handleIncrement(amount)}
            className="h-12 font-semibold"
          >
            +{amount}
          </Button>
        ))}
      </div>
    </div>
  );
}
