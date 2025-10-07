import { useState } from "react";
import { Button } from "@/components/ui/button";
import ItemCard from "@/components/ItemCard";
import QuantityInput from "@/components/QuantityInput";
import VoiceButton from "@/components/VoiceButton";
import VoiceStatus from "@/components/VoiceStatus";
import BillDisplay from "@/components/BillDisplay";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocation } from "wouter";

interface Item {
  id: string;
  name: string;
  price: number;
}

interface BillItem {
  itemName: string;
  quantity: number;
  price: number;
  total: number;
}

export default function NewBill() {
  const [, setLocation] = useLocation();
  const [items] = useState<Item[]>([
    { id: "1", name: "టమాటా", price: 40 },
    { id: "2", name: "ఉల్లిపాయలు", price: 30 },
    { id: "3", name: "బంగాళాదుంప", price: 25 },
  ]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [showQuantityDialog, setShowQuantityDialog] = useState(false);
  const [showBillDialog, setShowBillDialog] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<"idle" | "listening" | "processing" | "success">("idle");
  const { toast } = useToast();

  const { isListening, transcript, startListening, stopListening, isSupported } = useSpeechRecognition({
    language: "te-IN",
    onResult: (result) => {
      setVoiceStatus("processing");
      const parsedQuantity = parseFloat(result.transcript.replace(/[^0-9.]/g, ""));
      
      if (!isNaN(parsedQuantity) && parsedQuantity > 0) {
        setQuantity(parsedQuantity);
        setTimeout(() => {
          setVoiceStatus("success");
          setTimeout(() => setVoiceStatus("idle"), 1000);
        }, 500);
      } else {
        toast({
          title: "లోపం",
          description: "సరైన సంఖ్య చెప్పండి",
          variant: "destructive",
        });
        setVoiceStatus("idle");
      }
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

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
    setQuantity(1);
    setShowQuantityDialog(true);
  };

  const handleVoiceStart = () => {
    setVoiceStatus("listening");
    startListening();
  };

  const handleVoiceStop = () => {
    stopListening();
    setVoiceStatus("idle");
  };

  const handleAddToBill = () => {
    if (!selectedItem || quantity <= 0) return;

    const total = quantity * selectedItem.price;
    const newBillItem: BillItem = {
      itemName: selectedItem.name,
      quantity,
      price: selectedItem.price,
      total,
    };

    setBillItems([...billItems, newBillItem]);
    setShowQuantityDialog(false);
    setSelectedItem(null);
    setQuantity(1);

    toast({
      title: "చేర్చబడింది",
      description: `${selectedItem.name} బిల్లుకు జోడించబడింది`,
    });
  };

  const handleGenerateBill = () => {
    if (billItems.length === 0) {
      toast({
        title: "బిల్లు ఖాళీగా ఉంది",
        description: "దయచేసి వస్తువులు చేర్చండి",
        variant: "destructive",
      });
      return;
    }
    setShowBillDialog(true);
  };

  const handleSaveBill = () => {
    toast({
      title: "బిల్లు సేవ్ అయింది",
      description: "మీ బిల్లు విజయవంతంగా సేవ్ చేయబడింది",
    });
    setBillItems([]);
    setShowBillDialog(false);
    setLocation("/history");
  };

  const totalAmount = billItems.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">కొత్త బిల్లు</h1>
          <p className="text-sm text-muted-foreground">
            వస్తువులను ఎంచుకోండి మరియు పరిమాణం చెప్పండి
          </p>
        </div>

        {billItems.length > 0 && (
          <div className="bg-primary/10 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">మొత్తం వస్తువులు: {billItems.length}</span>
              <span className="font-mono font-bold text-lg">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              name={item.name}
              price={item.price}
              onClick={() => handleItemClick(item)}
            />
          ))}
        </div>

        <Button
          className="w-full h-14 text-lg"
          data-testid="button-generate-bill"
          onClick={handleGenerateBill}
          disabled={billItems.length === 0}
        >
          బిల్లు రూపొందించు
        </Button>
      </div>

      <Dialog open={showQuantityDialog} onOpenChange={setShowQuantityDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedItem?.name} - పరిమాణం</DialogTitle>
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

            <QuantityInput value={quantity} onChange={setQuantity} />

            <Button
              className="w-full h-12"
              onClick={handleAddToBill}
              data-testid="button-add-to-bill"
            >
              బిల్లుకు చేర్చండి
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showBillDialog} onOpenChange={setShowBillDialog}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <BillDisplay
            billNumber={`B${Date.now().toString().slice(-6)}`}
            items={billItems}
            totalAmount={totalAmount}
            onShare={() => console.log("Share")}
            onPrint={() => console.log("Print")}
            onSave={handleSaveBill}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
