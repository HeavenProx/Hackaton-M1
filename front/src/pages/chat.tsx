import { useState, useEffect, useRef } from "react";
import { useUser } from "@/contexts/UserContext";
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
import { Message, Step, useChatbot } from "@/hooks/useChatbot";
import Conversation from "@/components/Chatbot/Conversation";
import MessageForm, {
  MessageFormValues,
} from "@/components/Chatbot/MessageForm";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "Bonjour ! Comment puis-je vous aider aujourd'hui ?",
    },
  ]);
  const { user, token } = useUser();
  console.log(user);
  const [step, setStep] = useState<Step>("welcome");
  const [input, setInput] = useState("");
  const [plate, setPlate] = useState("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  type ChatbotResponse = {
    message: string;
    action?: Step;
    options?: any[];
  };

  const { sendRequest, isLoading } = useChatbot({
    onSuccess: (data: unknown) => {
      const response = data as ChatbotResponse;

      setInput("");
      setTimeout(() => inputRef.current?.focus(), 0);

      console.log("data : ", response);

      const botMessage = response.message || "Je n’ai pas compris.";

      const botReply: Message = {
        role: "system",
        content: data.message || "Je n'ai pas compris.",
        action: data.action,
        options: data.options,
      };

      setMessages((prev) => [...prev, botReply]);

      if (response.action) {
        setStep(response.action);
      }
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

  const onSubmit = (values: MessageFormValues) => {
    const updatedMessages: Message[] = [
      ...messages,
      {
        role: "user",
        content: values.message,
      },
    ];

    setMessages(updatedMessages);
    sendRequest(updatedMessages);
  };

  const handleOptionSelect = (option: string) => {
    // When an option is selected from buttons, treat it as a user message
    const userMessage: Message = {
      role: "user",
      content: option,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    sendRequest(updatedMessages);
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col min-h-[inherit]">
        <div className="flex justify-between items-center mb-4 max-w-3xl mx-auto">
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
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                <Card
                  className={`max-w-[80%] shadow-sm ${message.role === "user"
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

            {/* Animation de chargement */}
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
            {step === "ask_plate" && user?.cars?.length > 0 && (
              <div className="flex flex-col gap-2 items-start">
                {user?.cars.map((car: any, index: number) => (
                  <Button
                    key={index}
                    className="text-left w-full"
                    variant="flat"
                    onClick={() => {
                      const selectedPlate = car.registration;
                      setPlate(selectedPlate);

                      const userMessage: Message = {
                        role: "user",
                        content: `Je choisis le véhicule : ${car.brand} ${car.model} (${car.registration})`,
                      };

                      const updatedMessages = [...messages, userMessage];
                      setMessages(updatedMessages);
                      sendRequest(updatedMessages);
                    }}
                  >
                    🚗 {car.brand} {car.model} — {car.registration}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </ScrollShadow>

        {/* Input principal en bas */}
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
