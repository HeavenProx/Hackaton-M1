import { useState } from "react";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Salut ! Comment puis-je t’aider aujourd’hui ?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { from: "user", text: input }]);
    setInput("");

    // Réponse mock de l'IA (à remplacer plus tard par l'API)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Je suis une IA ! En quoi puis-je vous aider ?" },
      ]);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center py-8 h-[90vh]">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className="{title()} text-xl">Notre assistant va s'occuper de vous</h1>
        </div>

        <div className="flex flex-col w-full max-w-3xl h-full rounded-lg bg-white/30 bg-background shadow p-4 mt-6">
          {/* Zone messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-1">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[75%] px-4 py-2 rounded-lg text-sm whitespace-pre-line ${
                    msg.from === "user"
                    ? "bg-white/20 text-white self-end ml-auto" 
                    : "text-foreground bg-muted self-start"
                }`}
                >
                {msg.text}
            </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Écris un message..."
              className="flex-grow resize-none p-3 rounded-lg text-sm focus:outline-none"
            />
            <button
              onClick={sendMessage}
              className="bg-muted text-white px-4 py-2 rounded-lg hover:bg-white/30 transition"
            >
              Envoyer
            </button>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
