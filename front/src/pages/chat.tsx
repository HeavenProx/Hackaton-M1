import { useState, useEffect, useRef } from "react";
import {
  Input,
  Button,
  ScrollShadow,
  Card,
  CardBody,
  Form,
  Chip,
} from "@heroui/react";

import { SendIcon } from "@/components/icons/ChatIcons";
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
      text: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
      suggestions: [
        "Problème moteur",
        "Problème de freins",
        "Vidange",
        "Pneus",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const sendMessage = async (msgText?: string) => {
    const messageToSend = msgText ?? input;

    if (!messageToSend.trim()) return;

    // Add user message to chat
    setMessages((prev) => [...prev, { from: "user", text: messageToSend }]);
    setInput("");
    setIsLoading(true);

    // Add a delay to simulate a longer request
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const response = await fetch("http://127.0.0.1:8000/chatbot/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/ld+json",
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NDc4MzAwNjIsImV4cCI6MTc0NzgzMzY2Miwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoiaHVnby5kdXBlcnRodXlAb3V0bG9vay5mciJ9.lnXCBHm2G2JZ1ruz_AkxDvcH5qp24SGGoIg6brCMK5GKNfw8HgHdbSY-QR41XyjsXAZ5tOhvMHgOKftuMNF384pzE4iDwWmYcfzVuo_xi29vIsJQ_P3fgQ2NWkPyAvUoFBgVL_D6zZhc36uPond9tVFXIxHpP6ujxPjdG145e8Mj9hQdEyWrv1fDzA3NAIYuMzfR2Uh7Qg5VbAXOCjecavP3P9lKYOWLiAhWSJV24ZHeo-f5U7IO7hTuikFkLcnY2pHzzxGIP067X0P4Y0_iSTDtJ53RQKCwYM0r2VqvOO9bli9qomfTG6iwYeTPwqBFZAY9QscQ_wCCbhKcnHpB_RhoWvjut3b5_ocJg-JRqrty_goDgfyi2cmf6u_8SxcoY-kRUAhoUpDagwE2XI0X_sdB7GQtN_MGALP6hD39CkrcUV2C4NfMPDtzCAL4ODKCNg-qHlVj7cbRF0bYxCxMyWNBQsvCmaSUoWoNBWP0YWJ1mkclPQ1ASqhZFIwJzcB5LWEY6052AqFN8K7nmRFVXhOIi-gBrrPMACdunRskmTA_bnOd6NCoeGSOtink3umV8Zw5rirEsu2ogoHdA80jaqyV4xSbWX1tATMdAv7K19RvMyT733lYXj7GYcbyliIWfSWJe2FxkR8EepJPjsvDWWZ8aDbVoRaPw7m-1W6ezo8",
        },
        body: JSON.stringify({
          message: messageToSend,
        }),
      });

      

      const data = await response.json();
      console.log(data);
      // const botMessage = data.parsed?.text || data.raw_response || "Je n’ai pas compris.";
      const botMessage = data.parsed?.commentaire || data.raw_response || "Je n’ai pas compris.";


      const botMessage =
        data.parsed?.text || data.raw_response || "Je n'ai pas compris.";
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
    } finally {
      setIsLoading(false);

      // Refocus input after sending
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col h-[87vh]">
        <div className="flex justify-between items-center mb-4  max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold">Assistant Garage Folie</h1>
        </div>

        {/* Chat messages area */}
        <ScrollShadow
          ref={scrollRef}
          className="h-full p-4"
          hideScrollBar={false}
        >
          <div className="flex flex-col gap-4 pb-6 max-w-3xl mx-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <Card
                  className={`max-w-[80%] shadow-sm ${
                    message.from === "user"
                      ? "bg-primary text-white"
                      : "bg-default-50"
                  }`}
                >
                  <CardBody className="py-2 px-3">
                    <p className="whitespace-pre-wrap">{message.text}</p>

                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.suggestions.map((suggestion, idx) => (
                          <Button
                            key={idx}
                            color="primary"
                            variant={message.from === "user" ? "flat" : "solid"}
                            onPress={() => sendMessage(suggestion)}
                            size="sm"
                            radius="full"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </CardBody>
                </Card>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <Card
                  className="bg-default-50 shadow-sm"
                  style={{ borderRadius: "0.5rem 0.5rem 0.5rem 0" }}
                >
                  <CardBody className="py-2 px-3">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-default-300 animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-default-300 animate-pulse delay-150" />
                      <div className="w-2 h-2 rounded-full bg-default-300 animate-pulse delay-300" />
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}
          </div>
        </ScrollShadow>

        {/* Input area with Form */}
        <Form
          className="flex flex-row gap-2 max-w-3xl w-full mx-auto"
          onSubmit={handleSubmit}
        >
          <Input
            ref={inputRef}
            fullWidth
            disabled={isLoading}
            name="message"
            placeholder="Écrivez votre message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            isIconOnly
            color="primary"
            isDisabled={!input.trim().length || isLoading}
            isLoading={isLoading}
            type="submit"
          >
            <SendIcon />
          </Button>
        </Form>
      </div>
    </DefaultLayout>
  );
}
