import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface ItemCardProps {
  name: string;
  price?: number;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function ItemCard({ name, price, isSelected, onClick }: ItemCardProps) {
  return (
    <Card
      data-testid={`card-item-${name}`}
      className={cn(
        "p-4 cursor-pointer hover-elevate active-elevate-2 transition-all",
        isSelected && "border-l-4 border-l-primary"
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Package className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <span className="text-lg font-semibold truncate" data-testid={`text-item-name-${name}`}>
            {name}
          </span>
        </div>
        {price !== undefined && price > 0 && (
          <Badge variant="secondary" className="font-mono flex-shrink-0">
            ₹{price}
          </Badge>
        )}
      </div>
    </Card>
  );
}
