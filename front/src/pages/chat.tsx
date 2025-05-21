import { useState, useEffect, useRef } from "react";
import {
  Input,
  Button,
  ScrollShadow,
  Card,
  CardBody,
  Form,
} from "@heroui/react";

import { SendIcon } from "@/components/icons/ChatIcons";
import DefaultLayout from "@/layouts/default";

type Message = {
  role: "user" | "system";
  content: string;
  suggestions?: string[];
  message?: string;
};

type FormValues = {
  message: string;
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const sendMessage = async (msgText?: string) => {
    const messageToSend = msgText ?? input;

    if (!messageToSend.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: messageToSend,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);

    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/chatbot/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/ld+json",
          Authorization:
            "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE3NDc4NDYzNDQsImV4cCI6MTc0Nzg0OTk0NCwicm9sZXMiOlsiUk9MRV9VU0VSIl0sInVzZXJuYW1lIjoibG1pY2hhbGxvbkBwcm90b24ubWUifQ.sxFkOkgtS6Lg1G27M8kh2XnDkzxPSksrkQCwRtYS5b1OuOPal0w8ir0XSAAPBSTYcqTnwpjJrzX0ZF30z1IRCse4ZiHSlVqUdGy7y2AfRAHsupIxPDIGjWi-tU4Z6oXBdygqUCCZ-fWVOqKOzjJKClWvNE-a8PM5hDOQsCm6lSJ3D1fuUZMsRKVF-CZyyvJJgELagSQUEcPUG27N_HyA3lrEfVh3GjT8dwGUgO6gSIRjKmwJUgIYYAYd9ULVg_iR13QBqh3T5v5ro1XNEDAwEFHGLvxNxMYzmQ8fz59s_yR70FnQW87XjLWY7ibdooN5BUXSZJ4CioT20dEcmc40uA", // Ton token
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      const data = await response.json();
      const botMessage = data.response.message || "Je n’ai pas compris.";

      const botReply: Message = {
        role: "system",
        content: botMessage,
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.error("Erreur lors de l'appel au chatbot :", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content:
            "Une erreur est survenue lors de la communication avec le serveur.",
        },
      ]);
    } finally {
      setIsLoading(false);
      setInput("");
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const formValues = Object.fromEntries(formData) as FormValues;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: formValues.message },
    ]);
    setInput("");

    sendMessage(formValues.message);
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
          onSubmit={onSubmit}
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
