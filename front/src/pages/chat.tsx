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
import { colgroup } from "framer-motion/client";

type Message = {
  role: "user" | "system";
  content: string;
  suggestions?: string[];
  message?: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
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
    setMessages((prev) => [...prev, { role: "user", content: messageToSend }]);
    setInput("");
    setIsLoading(true);

    // Add a delay to simulate a longer request
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      console.log('message : ', messages);
      const response = await fetch("http://127.0.0.1:8000/chatbot/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/ld+json",
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NDc4MzgyNTEsImV4cCI6MTc0Nzg0MTg1MSwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoiaHVnby5kdXBlcnRodXlAb3V0bG9vay5mciJ9.kEmkblRfDo7o6I1aV2abpkFoY2aUBMGaxvT7vx6083cOecqVY7Um1_r5oQdlM8uinymPk9NxDjgbsjFOYIR12h2pEOvmPA5tXAKcMjRGBXQGWPJieLMaeOL4fZcGWTalURAjZvRBxCK8gocnP-p3PKKuJ-NOvLj2-Q1ZAgHvd_LcLSWmehCXgy5SWHCyiTVrWppc7XgPmk0CuzqY349l86Lo9vqRHt9wINqpJmR1KTnePpwr4dH0WnNBiWC8923JE4GhDfNspSwubPpWPft-uBYHh_zryMz0r3Ooaf3l7tbaeYhvERIdNwYami9PCuZ-Xl5Vv9DH3AHGdqQ16yydYlVH_b7WSLbKahmx7-IAn0tH2SvI4W1Hz7bPSkkUAlpUP48dulNUrhhPKaBau8FtBwQY0xyZI4sHeQAV902hiN73LJk_MP72RJXAx2wahYL0WoK3qd4LG3GClGK2vLQJyvyeDtE74JrUnyCSyg-0MWyE7VLve6iD7qJHXfItr528EpBFU-VZghCgo1dygTskLpyI-jl-5A6zuGqYYgjHmyNme_zRYCJDu2tUiRwnvw1UaEP1HyRvVQFyHjpX1HUy2um5-B8YeSCS0HSyS6jRl4DnRD86ydrp5Oif64Z1vllXXCOeeDvRee5X0SChfHr1IPlo7uvFeuDvXF6pgf90pdA",
        },
        body: JSON.stringify({
          messages,
        }),
      });

      const data = await response.json();
      console.log('data : ', data);
      // const botMessage = data.parsed?.text || data.raw_response || "Je n’ai pas compris.";
      const botMessage = data.response.message || "Je n’ai pas compris.";

      const suggestions = data.response.option || [];

      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: botMessage,
        },
      ]);
    } catch (error) {
      console.error("Erreur lors de l'appel au chatbot :", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: "Une erreur est survenue lors de la communication avec le serveur.",
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

  console.log("message : ", messages)

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
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <Card
                  className={`max-w-[80%] shadow-sm ${
                    message.role === "user"
                      ? "bg-primary text-white"
                      : "bg-default-50"
                  }`}
                >
                  <CardBody className="py-2 px-3">
                    <p className="whitespace-pre-wrap">{message.content}</p>

                    
                  
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
