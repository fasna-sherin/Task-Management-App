
import { useRef, useState, useEffect } from "react";
import { FaMicrophone, FaStop } from "react-icons/fa";

const VoiceInput = ({ onTextChange }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      recognitionRef.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      
      recognitionRef.current.continuous = false; 
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        onTextChange(speechResult); 
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } else {
      alert("Speech recognition is not supported in this browser.");
    }
  }, [onTextChange]);

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };

  return (
    <div style={{ display: "inline-block", marginLeft: "10px" }}>
      <button 
        onClick={isListening ? stopListening : startListening} 
        className="w-6 h-6 rounded-full flex items-center justify-center bg-[#575799] hover: text-white shadow-md"
        style={{ transition: "background 0.3s" }}
      >
        {isListening ? <FaStop size={20} /> : <FaMicrophone size={20} />}  
      </button>
    </div>
  );
};

export default VoiceInput;
