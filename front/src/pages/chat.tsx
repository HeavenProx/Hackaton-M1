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
import { Message, useChatbot } from "@/hooks/useChatbot";

type FormValues = {
  message: string;
};

type Step =
  | "welcome"
  | "ask_plate"
  | "select_operations"
  | "ask_location"
  | "select_slot"
  | "confirm_appointment";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
    },
  ]);
  const [step, setStep] = useState<Step>("welcome");
  const [input, setInput] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { sendRequest, isLoading } = useChatbot({
    onSuccess: (data) => {
      setInput("");
      setTimeout(() => inputRef.current?.focus(), 0);

      console.log("data : ", data);

      const botMessage = data.message || "Je n’ai pas compris.";

      const botReply: Message = {
        role: "system",
        content: botMessage,
      };

      setMessages((prev) => [...prev, botReply]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content:
            "Une erreur est survenue lors de la communication avec le serveur.",
        },
      ]);
    },
  });

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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const formValues = Object.fromEntries(formData) as FormValues;

    setInput("");

    const updatedMessages: Message[] = [
      ...messages,
      {
        role: "user",
        content: formValues.message,
      },
    ];

    setMessages(updatedMessages);
    sendRequest(updatedMessages);
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
