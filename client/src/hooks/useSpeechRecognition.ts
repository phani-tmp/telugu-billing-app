import { useState, useCallback, useEffect, useRef } from "react";

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
}

interface UseSpeechRecognitionProps {
  language?: string;
  continuous?: boolean;
  onResult?: (result: SpeechRecognitionResult) => void;
  onError?: (error: string) => void;
}

export function useSpeechRecognition({
  language = "te-IN",
  continuous = false,
  onResult,
  onError,
}: UseSpeechRecognitionProps = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState<any>(null);
  
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onResultRef.current = onResult;
    onErrorRef.current = onError;
  }, [onResult, onError]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      onErrorRef.current?.("Speech recognition not supported");
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.lang = language;
    recognitionInstance.continuous = continuous;
    recognitionInstance.interimResults = false;

    recognitionInstance.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const transcriptText = result[0].transcript;
      const confidence = result[0].confidence;

      setTranscript(transcriptText);
      onResultRef.current?.({ transcript: transcriptText, confidence });
    };

    recognitionInstance.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      onErrorRef.current?.(event.error);
      setIsListening(false);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, [language, continuous]);

  const startListening = useCallback(() => {
    if (recognition) {
      setTranscript("");
      recognition.start();
      setIsListening(true);
      
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
      
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  }, [recognition]);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported: !!recognition,
  };
}
