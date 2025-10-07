import { Mic, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoiceButtonProps {
  isListening: boolean;
  onStart: () => void;
  onStop: () => void;
  className?: string;
}

export default function VoiceButton({ isListening, onStart, onStop, className }: VoiceButtonProps) {
  return (
    <Button
      size="icon"
      data-testid={isListening ? "button-stop-recording" : "button-start-recording"}
      className={cn(
        "h-24 w-24 rounded-full transition-all duration-300",
        isListening && "animate-pulse bg-destructive hover:bg-destructive",
        className
      )}
      variant={isListening ? "destructive" : "default"}
      onClick={isListening ? onStop : onStart}
    >
      {isListening ? (
        <Square className="h-8 w-8" fill="currentColor" />
      ) : (
        <Mic className="h-8 w-8" />
      )}
    </Button>
  );
}
