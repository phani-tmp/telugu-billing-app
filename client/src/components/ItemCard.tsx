import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ItemCardProps {
  name: string;
  price?: number;
  isSelected?: boolean;
  onClick?: () => void;
  onEditPrice?: () => void;
  onDelete?: () => void;
}

export default function ItemCard({ name, price, isSelected, onClick, onEditPrice, onDelete }: ItemCardProps) {
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
        <div className="flex items-center gap-2 flex-shrink-0">
          {price !== undefined && price >= 0 && (
            <Badge variant="secondary" className="font-mono">
              ₹{price}
            </Badge>
          )}
          {onEditPrice && (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              data-testid={`button-edit-price-${name}`}
              onClick={(e) => {
                e.stopPropagation();
                onEditPrice();
              }}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              data-testid={`button-delete-item-${name}`}
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
