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
import { Spinner } from "@heroui/react";

import MapBoxContainer from "./MapBoxContainer";
import GarageInfoCard from "./GarageInfoCard";
import LocationSearch from "./LocationSearch";

import { NearbyGarageSelectorProps } from "@/types/components";
import { Dealership } from "@/types/dealership";
import fetchDealerships from "@/data/dealerships";
import { useUser } from "@/contexts/UserContext";

export default function NearbyGarageSelector({
  disclosure,
  onDealershipConfirm,
}: NearbyGarageSelectorProps) {
  const { isOpen, onOpenChange } = disclosure;
  const [selectedDealership, setSelectedDealership] =
    useState<Dealership | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    name: string;
    longitude: number;
    latitude: number;
  } | null>(null);
  const [dealerships, setDealerships] = useState<Dealership[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<React.RefObject<HTMLDivElement>[]>([]);

  const { token } = useUser();

  // Fetch dealerships when modal opens
  useEffect(() => {
    if (isOpen) {
      const loadDealerships = async () => {
        setIsLoading(true);
        try {
          if (!token) {
            console.error("No token available");

            return;
          }

          setDealerships(fetchDealerships);
          // Initialize cardRefs with the correct number of refs
          cardRefs.current = fetchDealerships.map(() =>
            createRef<HTMLDivElement>(),
          );
        } catch (error) {
          console.error("Error loading dealerships:", error);
        } finally {
          setIsLoading(false);
        }
      };

      loadDealerships();
    }
  }, [isOpen]);

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
    if (selectedDealership && onDealershipConfirm) {
      // Call the callback with the selected dealership
      onDealershipConfirm(selectedDealership);
    }
    onOpenChange();
  };

  // Scroll to selected dealership card
  useEffect(() => {
    if (selectedDealership && scrollContainerRef.current) {
      const selectedIndex = dealerships.findIndex(
        (d) => d.dealership_name === selectedDealership.dealership_name,
      );

      if (selectedIndex !== -1 && cardRefs.current[selectedIndex]?.current) {
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
  }, [selectedDealership, dealerships]);

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
                    className="w-full"
                    label="Trouver une localisation"
                    placeholder="Recherchez une adresse"
                    onLocationSelect={handleLocationSelect}
                  />
                </div>

                <MapBoxContainer
                  selectedDealership={selectedDealership}
                  selectedLocation={selectedLocation}
                  onDealershipSelect={handleDealershipSelect}
                />

                <div className="mt-4">
                  <h3 className="text-md font-medium mb-2">
                    {selectedDealership
                      ? `Garage sélectionné: ${selectedDealership.dealership_name}`
                      : "Sélectionnez un garage sur la carte ou dans la liste ci-dessous"}
                  </h3>

                  {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <Spinner color="primary" size="lg" />
                      <span className="ml-2">Chargement des garages...</span>
                    </div>
                  ) : (
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
                  )}
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
