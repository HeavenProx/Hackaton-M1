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

      if (data["response"]["diagnostic"]){
          localStorage.setItem("diagnostic", data["response"]["diagnostic"]);
          const interventionResponse = await fetch("http://127.0.0.1:8000/api/interventions", {
              method: "POST",
              headers: {
                  "Content-Type": "application/ld+json",
                  Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                  "car":localStorage.getItem("car"),
                  "garage":localStorage.getItem("garage"),
                  "operations":localStorage.getItem("selectedOptions")?.split(","),
                  "diagnostic": localStorage.getItem("diagnostic"),
                  "date": formatIsoToDatetime(localStorage.getItem("date")),
              }),
          });

          const interventionData = await interventionResponse.json();

          // Stocker l'ID de l'intervention dans le localStorage
          if (interventionData.id) {
              localStorage.setItem("interventionId", interventionData.id.toString());
          }
    }

      return data.response;
    } catch (error) {
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { sendRequest, isLoading };
};

function formatIsoToDatetime(isoDate: string | null): string {
    if (!isoDate) {
        return "Invalid date";
    }
    const dateObj = new Date(isoDate);

    const year = dateObj.getFullYear();
    const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    const day = ("0" + dateObj.getDate()).slice(-2);
    const hours = ("0" + dateObj.getHours()).slice(-2);
    const minutes = ("0" + dateObj.getMinutes()).slice(-2);
    const seconds = ("0" + dateObj.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Exemple d'utilisation
const isoDate = "2025-05-22T09:00:00";
console.log(formatIsoToDatetime(isoDate));