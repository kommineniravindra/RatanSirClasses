const Assistant = {
  speak: (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel(); // Cancel any existing speech
      const utterance = new SpeechSynthesisUtterance(text);
      // Attempt to set a female voice
      let voices = window.speechSynthesis.getVoices();
      
      // If voices aren't loaded yet, we might need a retry mechanism or just perform best effort.
      // However, for simple interactions, we try to grab what's available.
      
      const femaleVoice = voices.find(
        (voice) =>
          voice.name.includes("Female") ||
          voice.name.includes("Zira") || // Windows
          voice.name.includes("Google US English") || // often female
          voice.name.includes("Samantha") // macOS
      );

      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      
      // Optional: adjust pitch slightly higher as a fallback if no specific female voice found
      // utterance.pitch = 1.1; 

      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Text-to-speech not supported in this browser.");
    }
  },
  cancel: () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  },
};

export default Assistant;
