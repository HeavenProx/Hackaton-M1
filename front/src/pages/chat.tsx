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
      suggestions: [
        "J’ai une question",
        "Prendre un rendez-vous",
        "J'ai une panne",
      ],
    },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async (msgText?: string) => {
    const messageToSend = msgText ?? input;

    if (!messageToSend.trim()) return;
  
    // Ajoute le message de l'utilisateur dans le chat
    setMessages((prev) => [...prev, { from: "user", text: messageToSend }]);
    setInput("");
  
    try {
      const response = await fetch("http://127.0.0.1:8000/chatbot/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/ld+json",
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NDc4MTQ1NDcsImV4cCI6MTc0NzgxODE0Nywicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoiaHVnby5kdXBlcnRodXlAb3V0bG9vay5mciJ9.pNwABoEHZrPLlm3SuHQri-qbOZaAaB3hRsurvncxaGsj2_UkirvrXcx9LbABSG0_6fohQwDfEZXbaZoI-7Ec-j2JGUm7qSPb6xBQeO2d7e5YdMUbtJL4i8MWh7MSCjD61oYcrZJcy3arPVyZvgsoJYrvSbvKslhAMMEC4R3m_cfO_qSnF99ddddhe3UDSeykhVvKhifgKuDSAMsYDiKnQebKWWviWr-xKzcEonPmOE78qlkmyhsL7yefDvzNz9vV5_nl985y2Wq2nZ01YPWq3wO2aHa3IM1V_yYCzq6wv6LZHX0BS-G4pznax5yNtRLr04YWwlsDpS8ZHtHFx-rJhn8gJhmyUZbxKw_DJt2zyrV-ol3y0xRZJVzdUQ35l7o_KyK17pmUV7MISeziAap1aUKkQ1X08maJ4zCHhQ7SVOJMUtgNa6zIKz_KsJPOercBE0jhZvqAC5e1AjOfwMGGS81sgbM1mN2dz80sFxZDX4g4h9_NOAGtygJ3oyiA2w2N9vIJftr4skWeTgn85Um0JGmdwrASUpS-Pzm9KnFu4xuGgnzxZYPh-tTMNyRxwLLdTuEkYC3fluiUGUnCYmNZfX1lt0EzI188pgDivvcVOqnsMDFYUKOs-TpGtBWHXveMFhd1AVVyuHvrykIfcHZjXfCL7uthxftwpwEiqPGMNFU",
        },
        body: JSON.stringify({
          message: messageToSend,
        }),
      });

      
      const data = await response.json();
      
      // const botMessage = data.parsed?.text || data.raw_response || "Je n’ai pas compris.";
      const botMessage = data.parsed?.commentaire || data.raw_response || "Je n’ai pas compris.";

      const suggestions = data.parsed?.suggestions || [];
  
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: botMessage,
          suggestions: suggestions.length > 0 ? suggestions : undefined,
        },
      ]);
    } catch (error) {
      console.error("Erreur lors de l'appel au chatbot :", error);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Une erreur est survenue lors de la communication avec le serveur.",
        },
      ]);
    }
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
          <h1 className={`${title()} !text-3xl`}>Notre assistant va s'occuper de vous</h1>
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
                        className="bg-white-30 text-foreground px-3 py-1 rounded-md text-sm hover:bg-white-10 border border-2 transition"
                        onClick={() => handleSuggestionClick(suggestion)}
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
              className="flex-grow resize-none p-3 rounded-lg text-sm focus:outline-none"
              placeholder="Écris un message..."
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="bg-muted text-white px-4 py-2 rounded-lg hover:bg-30 transition"
              onClick={() => sendMessage()}
            >
              Envoyer
            </button>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
