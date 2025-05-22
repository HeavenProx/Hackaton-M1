"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { format, startOfWeek, addDays } from "date-fns";
import fr from "date-fns/locale/fr";

export default function PlanningModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ day: string; slot: string } | null>(null);
    const [disabledSlots, setDisabledSlots] = useState<{ day: string; slot: string }[]>([]);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

    const slots = ["09:00 - 10:30", "10:30 - 12:00", "13:00 - 14:30", "14:30 - 16:00", "16:00 - 17:30"];

    const days = Array.from({ length: 5 }, (_, i) =>
        format(addDays(weekStart, i), "EEEE dd/MM", { locale: fr })
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

    const isDisabled = (day: string, slot: string) =>
        disabledSlots.some((s) => s.day === day && s.slot === slot);

    const handleSlotClick = (day: string, slot: string) => {
        if (isDisabled(day, slot)) return; // Prevent click if disabled

        const [startTime] = slot.split(" - "); // Extract the start time
        const selectedDate = new Date(`${day.split(" ")[1]}T${startTime}:00`); // Combine day and time

        const formattedDate = format(selectedDate, "yyyy-MM-dd HH:mm:ss"); // Format the date
        console.log("Selected DateTime:", formattedDate); // Log the formatted date

        setSelectedSlot({ day, slot });
    };

    return (
        <>
            <Button onClick={openModal} color="primary">
                Ouvrir le planning
            </Button>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-40" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-90"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-90"
                        >
                            <Dialog.Panel className="w-full max-w-4xl p-6 bg-white rounded-2xl shadow-xl">
                                <Dialog.Title className="text-xl font-bold mb-4">
                                    Choisissez votre créneau
                                </Dialog.Title>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                                    {days.map((day) => (
                                        <div key={day}>
                                            <h3 className="text-sm font-semibold mb-2 text-center">{day}</h3>
                                            <div className="flex flex-col gap-2">
                                                {slots.map((slot) => (
                                                    <Button
                                                        key={slot}
                                                        variant={
                                                            selectedSlot?.day === day && selectedSlot?.slot === slot
                                                                ? "solid"
                                                                : "light"
                                                        }
                                                        color={
                                                            isDisabled(day, slot)
                                                                ? "default"
                                                                : selectedSlot?.day === day && selectedSlot?.slot === slot
                                                                    ? "primary"
                                                                    : "default"
                                                        }
                                                        onClick={() => handleSlotClick(day, slot)}
                                                        disabled={isDisabled(day, slot)}
                                                        className={isDisabled(day, slot) ? "opacity-50 cursor-not-allowed" : ""}
                                                    >
                                                        {slot}
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 flex justify-end gap-2">
                                    <Button variant="ghost" onClick={closeModal}>
                                        Annuler
                                    </Button>
                                    <Button color="secondary" variant="ghost" onClick={closeModal}>
                                        Aucun créneau ne me convient
                                    </Button>
                                    <Button color="primary" onClick={closeModal} disabled={!selectedSlot}>
                                        Confirmer
                                    </Button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
