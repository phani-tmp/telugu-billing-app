// import { useState, useCallback, useEffect, useRef } from "react";

// interface SpeechRecognitionResult {
//   transcript: string;
//   confidence: number;
// }

// interface UseSpeechRecognitionProps {
//   language?: string;
//   continuous?: boolean;
//   onResult?: (result: SpeechRecognitionResult) => void;
//   onError?: (error: string) => void;
// }

// export function useSpeechRecognition({
//   language = "te-IN",
//   continuous = false,
//   onResult,
//   onError,
// }: UseSpeechRecognitionProps = {}) {
//   const [isListening, setIsListening] = useState(false);
//   const [transcript, setTranscript] = useState("");
//   const [recognition, setRecognition] = useState<any>(null);

//   const onResultRef = useRef(onResult);
//   const onErrorRef = useRef(onError);

//   useEffect(() => {
//     onResultRef.current = onResult;
//     onErrorRef.current = onError;
//   }, [onResult, onError]);

//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

//     if (!SpeechRecognition) {
//       onErrorRef.current?.("Speech recognition not supported");
//       return;
//     }

//     const recognitionInstance = new SpeechRecognition();
//     recognitionInstance.lang = language;
//     recognitionInstance.continuous = continuous;
//     recognitionInstance.interimResults = false;

//     recognitionInstance.onresult = (event: any) => {
//       const result = event.results[event.results.length - 1];
//       const transcriptText = result[0].transcript;
//       const confidence = result[0].confidence;

//       setTranscript(transcriptText);
//       onResultRef.current?.({ transcript: transcriptText, confidence });
//     };

//     recognitionInstance.onerror = (event: any) => {
//       console.error("Speech recognition error:", event.error);
//       onErrorRef.current?.(event.error);
//       setIsListening(false);
//     };

//     recognitionInstance.onend = () => {
//       setIsListening(false);
//     };

//     setRecognition(recognitionInstance);

//     return () => {
//       if (recognitionInstance) {
//         recognitionInstance.stop();
//       }
//     };
//   }, [language, continuous]);

//   const startListening = useCallback(() => {
//     if (recognition) {
//       setTranscript("");
//       recognition.start();
//       setIsListening(true);

//       if (navigator.vibrate) {
//         navigator.vibrate(50);
//       }
//     }
//   }, [recognition]);

//   const stopListening = useCallback(() => {
//     if (recognition) {
//       recognition.stop();
//       setIsListening(false);

//       if (navigator.vibrate) {
//         navigator.vibrate(50);
//       }
//     }
//   }, [recognition]);

//   return {
//     isListening,
//     transcript,
//     startListening,
//     stopListening,
//     isSupported: !!recognition,
//   };
// }
import { useState, useCallback, useEffect, useRef } from "react";

interface SpeechRecognitionResult {
  transcript: string;
  confidence: number;
  parsedQuantity?: number | null; // FIXED: Added | null to allow the return type of parseTeluguQuantity
}

interface UseSpeechRecognitionProps {
  language?: string;
  continuous?: boolean;
  onResult?: (result: SpeechRecognitionResult) => void;
  onError?: (error: string) => void;
}

// =======================================================
// NEW: Function to parse Telugu quantity phrases into numbers
// =======================================================
function parseTeluguQuantity(text: string): number | null {
  // Normalize text to lowercase and remove spaces for easier matching
  const normalizedText = text.toLowerCase().replace(/\s/g, '');

  // 1. Check for common fractional quantities (quarter, half, three-quarters)
  // 'పావు' (paavu) - 0.25
  if (normalizedText.includes('పావు') || normalizedText.includes('025')) {
    return 0.25;
  }
  // 'అర' (ara) or 'సగం' (sagam) - 0.5
  if (normalizedText.includes('అర') || normalizedText.includes('సగం') || normalizedText.includes('05')) {
    return 0.5;
  }
  // 'ముప్పావు' (muppaavu) - 0.75
  if (normalizedText.includes('ముప్పావు') || normalizedText.includes('075')) {
    return 0.75;
  }

  // 2. Check for mixed numbers (e.g., 'ఒకటిన్నర' -> one and a half)
  const mixedTerms: { [key: string]: number } = {
    'ఒకటిన్నర': 1.5,
    'రెండున్నర': 2.5,
    'మూడున్నర': 3.5,
    'నాలుగున్నర': 4.5,
    // Add more common mixed terms here as needed
  };

  for (const term in mixedTerms) {
    if (normalizedText.includes(term)) {
      return mixedTerms[term];
    }
  }

  // 3. Attempt to extract a simple numerical value (integer or decimal)
  // This helps capture digits spoken in Telugu (like 'రెండు' -> 2) or standard number inputs.

  // Mapping for single digits (Telugu phonetic to number)
  const teluguDigits: { [key: string]: string } = {
    'సున్న': '0', 'ఒక': '1', 'ఒకటి': '1', 'రెండు': '2', 'మూడు': '3',
    'నాలుగు': '4', 'ఐదు': '5', 'ఆరు': '6', 'ఏడు': '7', 'ఎనిమిది': '8',
    'తొమ్మిది': '9', 'పది': '10'
  };

  let numericalString = normalizedText;

  // Replace Telugu digits/words with actual numbers
  for (const word in teluguDigits) {
    // Only replace if the word is found
    numericalString = numericalString.replace(new RegExp(word, 'g'), teluguDigits[word]);
  }

  // Final check: extract any floating point number or integer
  const match = numericalString.match(/(\d+\.?\d*)/);
  if (match && match[1]) {
    const value = parseFloat(match[1]);
    // Apply fractional check for common case: "1/4" or "2/4" etc.
    if (numericalString.includes('/4')) {
      // This is a basic catch for common billing fractions like 3/4
      if (numericalString.includes('1/4')) return parseFloat(match[1]) + 0.25;
      if (numericalString.includes('2/4')) return parseFloat(match[1]) + 0.5;
      if (numericalString.includes('3/4')) return parseFloat(match[1]) + 0.75;
    }
    return value;
  }

  return null; // Return null if no quantity is found
}
// =======================================================

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

      // NEW: Parse the quantity from the transcript
      const parsedQuantity = parseTeluguQuantity(transcriptText);

      setTranscript(transcriptText);
      onResultRef.current?.({
        transcript: transcriptText,
        confidence,
        parsedQuantity // Send the parsed quantity to the component
      });
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
