"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/react";
import { format, startOfWeek, addDays } from "date-fns";
import { fr } from "date-fns/locale/fr";

import { GarageSlotSelectorProps } from "@/types/components";

export default function GarageSlotSelector({
  disclosure,
  onSlotConfirm,
}: GarageSlotSelectorProps) {
  const { isOpen, onOpenChange } = disclosure;
  const [selectedSlot, setSelectedSlot] = useState<{
    day: string;
    slot: string;
    formattedDate: string;
  } | null>(null);
  const [disabledSlots, setDisabledSlots] = useState<
    { day: string; slot: string }[]
  >([]);

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

  const slots = [
    "09:00 - 10:30",
    "10:30 - 12:00",
    "13:00 - 14:30",
    "14:30 - 16:00",
    "16:00 - 17:30",
  ];

  const days = Array.from({ length: 5 }, (_, i) =>
    format(addDays(weekStart, i), "EEEE dd/MM", { locale: fr }),
  );

  useEffect(() => {
    // Créneaux désactivés aléatoirement (20% des créneaux)
    const disabled: { day: string; slot: string }[] = [];

    days.forEach((day) => {
      slots.forEach((slot) => {
        if (Math.random() < 0.2) {
          disabled.push({ day, slot });
        }
      });
    });
    setDisabledSlots(disabled);
  }, []);

  // Reset selection when modal is opened
  useEffect(() => {
    if (isOpen) {
      setSelectedSlot(null);
    }
  }, [isOpen]);

  const isDisabled = (day: string, slot: string) =>
    disabledSlots.some((s) => s.day === day && s.slot === slot);

  const handleSlotClick = (day: string, slot: string) => {
    if (isDisabled(day, slot)) return; // Prevent click if disabled

    const dayParts = day.split(" ")[1].split("/");
    const day_part = parseInt(dayParts[0]);
    const month_part = parseInt(dayParts[1]) - 1; // JS months are 0-indexed
    const year_part = new Date().getFullYear();

    const time_part = slot.split(" - ")[0];
    const hourMinute = time_part.split(":");

    const selectedDate = new Date(
      year_part,
      month_part,
      day_part,
      parseInt(hourMinute[0]),
      parseInt(hourMinute[1]),
    );

    const formattedDate = format(selectedDate, "yyyy-MM-dd'T'HH:mm:ss");

    setSelectedSlot({ day, slot, formattedDate });
  };

  const handleConfirm = () => {
    if (selectedSlot && onSlotConfirm) {
      onSlotConfirm(selectedSlot);
      onOpenChange();
    }
  };

  return (
    <Modal
      backdrop="blur"
      isOpen={isOpen}
      scrollBehavior="inside"
      size="4xl"
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Choisissez votre créneau
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                {days.map((day) => (
                  <div key={day}>
                    <h3 className="text-sm font-semibold mb-2 text-center">
                      {day}
                    </h3>
                    <div className="flex flex-col gap-2">
                      {slots.map((slot) => (
                        <Button
                          key={slot}
                          className={
                            isDisabled(day, slot)
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }
                          color={
                            isDisabled(day, slot)
                              ? "default"
                              : selectedSlot?.day === day &&
                                  selectedSlot?.slot === slot
                                ? "primary"
                                : "default"
                          }
                          disabled={isDisabled(day, slot)}
                          variant={
                            selectedSlot?.day === day &&
                            selectedSlot?.slot === slot
                              ? "solid"
                              : "light"
                          }
                          onPress={() => handleSlotClick(day, slot)}
                        >
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Annuler
              </Button>
              <Button color="secondary" variant="ghost" onPress={onClose}>
                Aucun créneau ne me convient
              </Button>
              <Button
                color="primary"
                isDisabled={!selectedSlot}
                onPress={handleConfirm}
              >
                Confirmer
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
