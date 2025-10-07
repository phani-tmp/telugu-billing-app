import { useState, useEffect } from "react";
import VoiceStatus from "../VoiceStatus";

export default function VoiceStatusExample() {
  const [status, setStatus] = useState<"idle" | "listening" | "processing" | "success">("idle");

  useEffect(() => {
    const sequence = ["listening", "processing", "success", "idle"] as const;
    let index = 0;
    
    const interval = setInterval(() => {
      index = (index + 1) % sequence.length;
      setStatus(sequence[index]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <VoiceStatus status={status} transcript={status === "success" ? "టమాటా" : undefined} />
    </div>
  );
}
