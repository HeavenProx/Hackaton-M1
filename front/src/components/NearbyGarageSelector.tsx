import { useState } from "react";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { ScrollShadow } from "@heroui/scroll-shadow";

import MapBoxContainer from "./MapBoxContainer";
import GarageInfoCard from "./GarageInfoCard";

import { NearbyGarageSelectorProps } from "@/types/components";
import { Dealership } from "@/types/dealership";
import { dealerships } from "@/data/dealerships";

export default function NearbyGarageSelector({
  disclosure,
}: NearbyGarageSelectorProps) {
  const { isOpen, onOpenChange } = disclosure;
  const [selectedDealership, setSelectedDealership] =
    useState<Dealership | null>(null);

  const handleDealershipSelect = (dealership: Dealership) => {
    setSelectedDealership(dealership);
  };

  const handleConfirm = () => {
    // Here you would typically do something with the selected dealership
    console.log("Selected dealership:", selectedDealership);
    onOpenChange();
  };

  return (
    <>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        size="5xl"
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Choisir un garage proche
              </ModalHeader>
              <ModalBody>
                <MapBoxContainer
                  selectedDealership={selectedDealership}
                  onDealershipSelect={handleDealershipSelect}
                />

                <div className="mt-4">
                  <h3 className="text-md font-medium mb-2">
                    {selectedDealership
                      ? `Garage sélectionné: ${selectedDealership.dealership_name}`
                      : "Sélectionnez un garage sur la carte ou dans la liste ci-dessous"}
                  </h3>

                  <ScrollShadow orientation="horizontal">
                    <div className="flex gap-4 py-2 pb-4">
                      {dealerships.map((dealership) => (
                        <GarageInfoCard
                          key={dealership.dealership_name}
                          dealership={dealership}
                          isSelected={
                            selectedDealership?.dealership_name ===
                            dealership.dealership_name
                          }
                          onSelect={handleDealershipSelect}
                        />
                      ))}
                    </div>
                  </ScrollShadow>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Annuler
                </Button>
                <Button
                  color="primary"
                  onPress={handleConfirm}
                  isDisabled={!selectedDealership}
                >
                  Valider
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
