import { useState } from "react";

import DefaultLayout from "@/layouts/default";
import { Message, useChatbot } from "@/hooks/useChatbot";
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

  const { sendRequest, isLoading } = useChatbot({
    onSuccess: (data) => {
      const reply: Message = {
        role: "system",
        content: data.message || "Je n'ai pas compris.",
        action: data.action,
        options: data.options,
      };

      setMessages((prev) => [...prev, reply]);
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

        <Conversation
          isLoading={isLoading}
          messages={messages}
          onOptionSelect={handleOptionSelect}
        />
        <MessageForm isLoading={isLoading} onSubmit={onSubmit} />
      </div>
    </DefaultLayout>
  );
}
