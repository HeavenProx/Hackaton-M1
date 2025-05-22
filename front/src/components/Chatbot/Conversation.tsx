import {
  ScrollShadow,
  Card,
  CardBody,
  Button,
  useDisclosure,
} from "@heroui/react";
import { useEffect, useRef } from "react";

import NearbyGarageSelector from "../NearbyGarageSelector";
import GarageSlotSelector from "../GarageSlotSelector";

import { Message } from "@/hooks/useChatbot";
import { Dealership } from "@/types/dealership";
import { useUser } from "@/contexts/UserContext";

type Props = {
  messages: Message[];
  isLoading: boolean;
  onOptionSelect?: (option: string) => void;
};

const Conversation = ({ messages, isLoading, onOptionSelect }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { user } = useUser();
  const garageSelectionDisclosure = useDisclosure();
  const slotSelectionDisclosure = useDisclosure();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleOptionClick = (option: string) => {
    if (onOptionSelect) {
      onOptionSelect(option);
    }
  };

  const handleDealershipConfirm = (dealership: Dealership) => {
    if (onOptionSelect) {
      // Send the dealership name back to the conversation
      onOptionSelect(`J'ai choisi le garage: ${dealership.dealership_name}`);
    }
  };

  const handleSlotConfirm = (slotInfo: {
    day: string;
    slot: string;
    formattedDate: string;
  }) => {
    if (onOptionSelect) {
      // Send the selected slot back to the conversation
      onOptionSelect(
        `J'ai choisi le créneau: ${slotInfo.day} à ${slotInfo.slot}`
      );
    }
  };

  const handlePlateSelect = (plate: string, brand: string, model: string) => {
    if (onOptionSelect) {
      onOptionSelect(`J'ai choisi le véhicule : ${model} de chez ${brand} (${plate})`);
    }
  };

  return (
    <ScrollShadow ref={scrollRef} className="h-full p-4" hideScrollBar={false}>
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
                {message.role === "system" &&
                  message.action === "select_operations" &&
                  message.options &&
                  message.options.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 max-w-[80%]">
                      {message.options.map((option, optionIndex) => (
                        <Button
                          key={optionIndex}
                          color="primary"
                          size="sm"
                          variant="flat"
                          onPress={() => handleOptionClick(option)}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  )}

                {message.action === "ask_plate" &&
                  user?.cars?.length &&
                  user?.cars?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 max-w-[80%]">
                      {user?.cars.map((car: any, index: number) => (
                    
                    <Button
                      key={index}
                      color="primary"
                      size="sm"
                      variant="flat"
                      onPress={() => handlePlateSelect(car.registration, car.brand, car.model)}
                    >
                      🚗 {car.brand} {car.model} — {car.registration}
                    </Button>
                  
                      ))}
                    </div>
                  )}

                {message.role === "system" &&
                  message.action === "ask_location" && (
                    <div className="flex flex-wrap gap-2 mt-2 max-w-[80%]">
                      <Button
                        color="primary"
                        size="sm"
                        variant="flat"
                        onPress={garageSelectionDisclosure.onOpen}
                      >
                        Choisir un garage proche
                      </Button>
                      <NearbyGarageSelector
                        disclosure={garageSelectionDisclosure}
                        onDealershipConfirm={handleDealershipConfirm}
                      />
                    </div>
                  )}
                {message.role === "system" &&
                  message.action === "select_schedule" && (
                    <div className="flex flex-wrap gap-2 mt-2 max-w-[80%]">
                      <Button
                        color="primary"
                        size="sm"
                        variant="flat"
                        onPress={slotSelectionDisclosure.onOpen}
                      >
                        Choisir un créneau
                      </Button>
                      <GarageSlotSelector
                        disclosure={slotSelectionDisclosure}
                        onSlotConfirm={handleSlotConfirm}
                      />
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
  );
};

export default Conversation;
