import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ItemCard from "@/components/ItemCard";
import VoiceButton from "@/components/VoiceButton";
import VoiceStatus from "@/components/VoiceStatus";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Item {
  id: string;
  name: string;
  price: number;
}

export default function Inventory() {
  const [items, setItems] = useState<Item[]>([
    { id: "1", name: "టమాటా", price: 40 },
    { id: "2", name: "ఉల్లిపాయలు", price: 30 },
    { id: "3", name: "బంగాళాదుంప", price: 25 },
  ]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "listening" | "processing" | "success">("idle");
  const { toast } = useToast();

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
    onError: (error) => {
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
    const newItem: Item = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      price,
    };

    setItems([...items, newItem]);
    setNewItemName("");
    setNewItemPrice("");
    setShowAddDialog(false);
    
    toast({
      title: "విజయవంతం",
      description: `${newItem.name} జాబితాకు చేర్చబడింది`,
    });
  };

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
            <ItemCard key={item.id} name={item.name} price={item.price} />
          ))}
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
              >
                చేర్చండి
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
