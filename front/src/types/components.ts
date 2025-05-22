import { Dealership } from "./dealership";

export type ModalDisclosureProps = {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
};

export type NearbyGarageSelectorProps = {
  disclosure: ModalDisclosureProps;
  onDealershipConfirm: (dealership: Dealership) => void;
};

export type MapBoxContainerProps = {
  selectedDealership?: Dealership | null;
  onDealershipSelect?: (dealership: Dealership) => void;
  selectedLocation?: {
    name: string;
    longitude: number;
    latitude: number;
  } | null;
};

export type GarageInfoCardProps = {
  dealership: Dealership;
  onSelect?: (dealership: Dealership) => void;
  isSelected?: boolean;
  cardRef?: React.RefObject<HTMLDivElement>;
};

export type GarageSlotSelectorProps = {
  disclosure: ModalDisclosureProps;
  onSlotConfirm: (slotInfo: {
    day: string;
    slot: string;
    formattedDate: string;
  }) => void;
};
