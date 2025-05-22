import { useState } from "react";

import { useUser } from "@/contexts/UserContext";

export type Step =
  | "welcome"
  | "ask_plate"
  | "select_operations"
  | "ask_location"
  | "select_schedule"
  | "confirm_appointment";

export type Message = {
  role: "user" | "system";
  content: string;
  options?: string[];
  action?: Step;
  message?: string;
};

type Params = {
  onSuccess?: (response: Message) => void;
  onError?: (error: any) => void;
};

export const useChatbot = ({ onSuccess, onError }: Params) => {
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useUser();

  const sendRequest = async (messages: Message[]) => {
    setIsLoading(true);

    const filteredMessages = messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    try {
      const response = await fetch("http://127.0.0.1:8000/chatbot/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/ld+json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: filteredMessages,
        }),
      });

      const data = await response.json();

      onSuccess?.(data.response);

      return data.response;
    } catch (error) {
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { sendRequest, isLoading };
};
