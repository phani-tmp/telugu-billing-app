import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ItemCard from "@/components/ItemCard";
import VoiceButton from "@/components/VoiceButton";
import VoiceStatus from "@/components/VoiceStatus";
import EditPriceDialog from "@/components/EditPriceDialog";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Item } from "@shared/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Inventory() {
  const { data: items = [], isLoading } = useQuery<Item[]>({
    queryKey: ["/api/items"],
  });
  
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "listening" | "processing" | "success">("idle");
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const { toast } = useToast();

  const addItemMutation = useMutation({
    mutationFn: async (data: { name: string; price: number }) => {
      return await apiRequest("POST", "/api/items", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      setNewItemName("");
      setNewItemPrice("");
      setShowAddDialog(false);
      toast({
        title: "విజయవంతం",
        description: "వస్తువు జాబితాకు చేర్చబడింది",
      });
    },
  });

  const updatePriceMutation = useMutation({
    mutationFn: async ({ id, price }: { id: string; price: number }) => {
      return await apiRequest("PATCH", `/api/items/${id}`, { price });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      toast({
        title: "విజయవంతం",
        description: "ధర మార్చబడింది",
      });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      toast({
        title: "తొలగించబడింది",
        description: "వస్తువు విజయవంతంగా తొలగించబడింది",
      });
    },
  });

  const { isListening, transcript, startListening, stopListening, isSupported } = useSpeechRecognition({
    language: "te-IN",
    onResult: (result) => {
      setVoiceStatus("processing");
      setNewItemName(result.transcript);
      
      setTimeout(() => {
        setVoiceStatus("success");
        setTimeout(() => setVoiceStatus("idle"), 1000);
      }, 500);
    },
    onError: () => {
      toast({
        title: "వాయిస్ లోపం",
        description: "దయచేసి మళ్ళీ ప్రయత్నించండి",
        variant: "destructive",
      });
      setVoiceStatus("idle");
    },
  });

  const handleVoiceStart = () => {
    setVoiceStatus("listening");
    startListening();
  };

  const handleVoiceStop = () => {
    stopListening();
    setVoiceStatus("idle");
  };

  const handleAddItem = () => {
    if (!newItemName.trim()) {
      toast({
        title: "పేరు అవసరం",
        description: "దయచేసి వస్తువు పేరు నమోదు చేయండి",
        variant: "destructive",
      });
      return;
    }

    const price = parseFloat(newItemPrice) || 0;
    addItemMutation.mutate({ name: newItemName.trim(), price });
  };

  const handleEditPrice = (item: Item) => {
    setEditingItem(item);
  };

  const handleSavePrice = (price: number) => {
    if (editingItem) {
      updatePriceMutation.mutate({ id: editingItem.id, price });
      setEditingItem(null);
    }
  };

  const handleDeleteItem = (item: Item) => {
    if (window.confirm(`${item.name} ను తొలగించాలా?`)) {
      deleteItemMutation.mutate(item.id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="text-muted-foreground">లోడ్ అవుతోంది...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">వస్తువుల జాబితా</h1>
          <p className="text-sm text-muted-foreground">
            మీ దుకాణంలో ఉన్న వస్తువులు
          </p>
        </div>

        <div className="space-y-3">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              name={item.name}
              price={item.price}
              onEditPrice={() => handleEditPrice(item)}
              onDelete={() => handleDeleteItem(item)}
            />
          ))}
          {items.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              వస్తువులు లేవు. కొత్త వస్తువు చేర్చండి.
            </div>
          )}
        </div>

        <Button
          className="w-full h-14 text-lg"
          data-testid="button-add-item"
          onClick={() => setShowAddDialog(true)}
        >
          కొత్త వస్తువు చేర్చండి
        </Button>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>కొత్త వస్తువు చేర్చండి</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <VoiceStatus status={isListening ? "listening" : voiceStatus} transcript={transcript} />

            {isSupported && (
              <div className="flex justify-center">
                <VoiceButton
                  isListening={isListening}
                  onStart={handleVoiceStart}
                  onStop={handleVoiceStop}
                />
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">వస్తువు పేరు</label>
                <Input
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="ఉదా: టమాటా"
                  data-testid="input-item-name"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">ధర (కేజీకి)</label>
                <Input
                  type="number"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  placeholder="0"
                  data-testid="input-item-price"
                  className="font-mono"
                />
              </div>

              <Button
                className="w-full h-12"
                onClick={handleAddItem}
                data-testid="button-confirm-add"
                disabled={addItemMutation.isPending}
              >
                {addItemMutation.isPending ? "చేర్చబడుతోంది..." : "చేర్చండి"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {editingItem && (
        <EditPriceDialog
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
          itemName={editingItem.name}
          currentPrice={editingItem.price}
          onSave={handleSavePrice}
        />
      )}
    </div>
  );
}
