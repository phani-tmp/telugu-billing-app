import { useState } from "react";
import VoiceButton from "../VoiceButton";

export default function VoiceButtonExample() {
  const [isListening, setIsListening] = useState(false);

  return (
    <div className="flex items-center justify-center p-8">
      <VoiceButton
        isListening={isListening}
        onStart={() => setIsListening(true)}
        onStop={() => setIsListening(false)}
      />
    </div>
  );
}
