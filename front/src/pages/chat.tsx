import { useState } from "react";
import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

type Message = {
  from: "user" | "bot";
  text: string;
  suggestions?: string[];
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "bot",
      text: "Salut ! Comment puis-je t’aider aujourd’hui ?",
      suggestions: ["J’ai une question", "Prendre un rendez-vous", "J'ai une panne"],
    },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = (msgText?: string) => {
    const messageToSend = msgText ?? input;
    if (!messageToSend.trim()) return;

    // Ajout du message utilisateur
    setMessages((prev) => [...prev, { from: "user", text: messageToSend }]);
    setInput("");

    // Réponse du bot (à remplacer par un appel API plus tard)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Tu peux choisir une option ci-dessous :",
          suggestions: ["Voir les horaires", "Prendre RDV", "Parler à un humain"],
        },
      ]);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center py-3 h-[90vh]">
        <div className="inline-block text-center justify-center">
          <h1 className={`${title()} text-xs`}>Notre assistant va s'occuper de vous</h1>
        </div>

        <div className="flex flex-col w-full max-w-3xl h-full rounded-lg bg-30 shadow p-4 mt-6">
          {/* Zone des messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-1">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[75%] px-4 py-2 rounded-lg text-sm whitespace-pre-line ${
                  msg.from === "user"
                    ? "bg-10 text-foreground self-end ml-auto"
                    : "text-foreground bg-muted self-start"
                }`}
              >
                <div>{msg.text}</div>

                {msg.suggestions && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {msg.suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="bg-white-30 text-foreground px-3 py-1 rounded-md text-sm hover:bg-white-10 border border-2 transition"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Champ de saisie */}
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
              onClick={() => sendMessage()}
              className="bg-muted text-white px-4 py-2 rounded-lg hover:bg-30 transition"
            >
              Envoyer
            </button>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
