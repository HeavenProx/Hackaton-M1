import { useState } from "react";

import { useUser } from "@/contexts/UserContext";
import {Step} from "@/hooks/useChatbot.ts";
export type Message = {
    role: "user" | "system";
    operations?: string[];
    content: string;
    options?: string[];
    message?: string;
};

type Params = {
  onSuccess?: (response: Message) => void;
  onError?: (error: any) => void;
};

export const useMileageChatBot = ({ onSuccess, onError }: Params) => {
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useUser();

    const sendRequest = async (
        messages: Message[],
        { onSuccess: localSuccess, onError: localError }: Params = {}
    ) => {
        setIsLoading(true);

        try {
            const response = await fetch("http://127.0.0.1:8000/chatbot/analyze/mileage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/ld+json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ messages }),
            });

            const data = await response.json();

            // Priorité à la callback locale, sinon celle du hook
            localSuccess?.(data.response);
            onSuccess?.(data.response);

            return data.response;
        } catch (error) {
            localError?.(error);
            onError?.(error);
        } finally {
            setIsLoading(false);
        }
    };

  return { sendRequest, isLoading };
};
