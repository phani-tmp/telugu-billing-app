import { Badge } from "@/components/ui/badge";
import { Mic, Loader2, CheckCircle2 } from "lucide-react";

interface VoiceStatusProps {
  status: "idle" | "listening" | "processing" | "success";
  transcript?: string;
}

export default function VoiceStatus({ status, transcript }: VoiceStatusProps) {
  const statusConfig = {
    idle: {
      icon: Mic,
      text: "వస్తువు పేరు చెప్పండి",
      variant: "secondary" as const,
    },
    listening: {
      icon: Mic,
      text: "వినుతోంది...",
      variant: "destructive" as const,
    },
    processing: {
      icon: Loader2,
      text: "ప్రాసెస్ చేస్తోంది...",
      variant: "default" as const,
    },
    success: {
      icon: CheckCircle2,
      text: "చేర్చబడింది",
      variant: "outline" as const,
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="space-y-3 text-center">
      <Badge
        variant={config.variant}
        className="text-sm px-4 py-2"
        data-testid={`badge-voice-status-${status}`}
      >
        <Icon className={`h-4 w-4 mr-2 ${status === "processing" ? "animate-spin" : ""}`} />
        {config.text}
      </Badge>
      {transcript && (
        <div className="text-lg font-semibold" data-testid="text-transcript">
          {transcript}
        </div>
      )}
    </div>
  );
}
