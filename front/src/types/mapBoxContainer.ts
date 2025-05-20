import { Dealership } from "./dealership";

export interface MapBoxContainerProps {
  selectedDealership: Dealership | null;
  onDealershipSelect: (dealership: Dealership) => void;
  selectedLocation?: {
    name: string;
    longitude: number;
    latitude: number;
  } | null;
}
