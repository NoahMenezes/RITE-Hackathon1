const fs = require('fs');
const path = './app/dashboard/chat/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const voiceFunc = `
  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRec();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => {
      setIsListening(true);
      toast.info("Listening...");
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue((prev) => {
        const text = prev ? prev + " " + transcript : transcript;
        setTimeout(() => {
          const btn = document.getElementById("send-button");
          if (btn && !btn.hasAttribute("disabled")) btn.click();
        }, 100);
        return text;
      });
    };
    recognition.onerror = (e: any) => {
      console.error(e);
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognition.start();
  };
`;

content = content.replace('const scrollToBottom = () => {', voiceFunc + '\n  const scrollToBottom = () => {');

// Also inject the Mic button next to the input
const paperclipStr = `<motion.button
              onClick={handleFileButtonClick}`;
const micStr = `<motion.button
              onClick={toggleListening}
              whileTap={{ scale: 0.95 }}
              className={\`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 shrink-0 mr-2 \${isListening ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" : "bg-[#424242] hover:bg-[#565656] text-[#9b9b9b] hover:text-white"}\`}
              title="Voice Input"
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </motion.button>
            <motion.button
              onClick={handleFileButtonClick}`;

content = content.replace(paperclipStr, micStr);

// Also add Download Note button for bot messages.
// First, create the downloadNote function.
const downloadNoteFunc = `
  const handleDownloadNote = (text: string) => {
    const blob = new Blob([text], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'FocusFlow_Summary.md';
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Note downloaded!");
  };
`;
content = content.replace('const handleExport = () => {', downloadNoteFunc + '\n  const handleExport = () => {');

// Inject Download button for bot messages
const copyBtnStr = `<button
                        onClick={() => copyToClipboard(msg.text)}
                        className="absolute -bottom-8 left-0 p-1.5 opacity-0 group-hover:opacity-100 transition-all text-[#ececec] hover:text-white"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4" />
                      </button>`;
const actionsStr = `<div className="absolute -bottom-8 left-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => copyToClipboard(msg.text)}
                          className="p-1.5 text-[#ececec] hover:text-white"
                          title="Copy to clipboard"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDownloadNote(msg.text)}
                          className="flex items-center gap-1 p-1.5 text-xs text-[#ececec] hover:text-white rounded hover:bg-white/10"
                          title="Download Note (.md)"
                        >
                          <DownloadIcon className="w-3.5 h-3.5" />
                          Download Note
                        </button>
                      </div>`;
content = content.replace(copyBtnStr, actionsStr);

fs.writeFileSync(path, content, 'utf8');
console.log("Updated page.tsx");
