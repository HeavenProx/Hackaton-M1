import { useState, useEffect, useRef, createRef } from "react";
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
import LocationSearch from "./LocationSearch";

import { NearbyGarageSelectorProps } from "@/types/components";
import { Dealership } from "@/types/dealership";
import { dealerships } from "@/data/dealerships";

export default function NearbyGarageSelector({
  disclosure,
}: NearbyGarageSelectorProps) {
  const { isOpen, onOpenChange } = disclosure;
  const [selectedDealership, setSelectedDealership] =
    useState<Dealership | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    longitude: number;
    latitude: number;
  } | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef(dealerships.map(() => createRef<HTMLDivElement>()));

  const handleDealershipSelect = (dealership: Dealership) => {
    setSelectedDealership(dealership);
  };

  const handleLocationSelect = (location: {
    name: string;
    longitude: number;
    latitude: number;
  }) => {
    setSelectedLocation(location);
    // Reset selected dealership when location changes
    setSelectedDealership(null);
  };

  const handleConfirm = () => {
    // Here you would typically do something with the selected dealership
    console.log("Selected dealership:", selectedDealership);
    console.log("Selected location:", selectedLocation);
    onOpenChange();
  };

  // Scroll to selected dealership card
  useEffect(() => {
    if (selectedDealership && scrollContainerRef.current) {
      const selectedIndex = dealerships.findIndex(
        (d) => d.dealership_name === selectedDealership.dealership_name,
      );

      if (selectedIndex !== -1 && cardRefs.current[selectedIndex].current) {
        const card = cardRefs.current[selectedIndex].current;
        const scrollContainer = scrollContainerRef.current;

        if (card && scrollContainer) {
          const cardLeft = card.offsetLeft;
          const containerWidth = scrollContainer.clientWidth;
          const cardWidth = card.offsetWidth;

          // Center the card in the scroll container
          scrollContainer.scrollTo({
            left: cardLeft - containerWidth / 2 + cardWidth / 2,
            behavior: "smooth",
          });
        }
      }
    }
  }, [selectedDealership]);

  return (
    <>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        scrollBehavior="inside"
        size="5xl"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Choisir un garage proche
              </ModalHeader>
              <ModalBody>
                {/* LocationSearch added above the map */}
                <div className="mb-4">
                  <LocationSearch 
                    onLocationSelect={handleLocationSelect} 
                    className="w-full" 
                    placeholder="Recherchez une adresse"
                    label="Trouver une localisation"
                  />
                </div>

                <MapBoxContainer
                  selectedDealership={selectedDealership}
                  onDealershipSelect={handleDealershipSelect}
                  selectedLocation={selectedLocation}
                />

                <div className="mt-4">
                  <h3 className="text-md font-medium mb-2">
                    {selectedDealership
                      ? `Garage sélectionné: ${selectedDealership.dealership_name}`
                      : "Sélectionnez un garage sur la carte ou dans la liste ci-dessous"}
                  </h3>

                  <ScrollShadow
                    ref={scrollContainerRef}
                    orientation="horizontal"
                  >
                    <div className="flex gap-4 m-2">
                      {dealerships.map((dealership, index) => (
                        <GarageInfoCard
                          key={dealership.dealership_name}
                          cardRef={cardRefs.current[index]}
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
                  isDisabled={!selectedDealership}
                  onPress={handleConfirm}
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
