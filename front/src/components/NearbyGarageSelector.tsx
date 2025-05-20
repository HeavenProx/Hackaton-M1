import { Button } from "@heroui/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";

import { NearbyGarageSelectorProps } from "@/types/components";
import MapBoxContainer from "./MapBoxContainer";

export default function NearbyGarageSelector({
  disclosure,
}: NearbyGarageSelectorProps) {
  const { isOpen, onOpenChange } = disclosure;

  return (
    <>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
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
                <MapBoxContainer />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Annuler
                </Button>
                <Button color="primary" onPress={onClose}>
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
