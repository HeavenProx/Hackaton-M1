import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";

import { Dealership } from "@/types/dealership";

interface GarageInfoCardProps {
  dealership: Dealership;
  onSelect?: (dealership: Dealership) => void;
  isSelected?: boolean;
  cardRef?: React.RefObject<HTMLDivElement>;
}

export default function GarageInfoCard({
  dealership,
  onSelect,
  isSelected = false,
  cardRef,
}: GarageInfoCardProps) {
  const { dealership_name, city, address, zipcode } = dealership;

  return (
    <Card
      ref={cardRef}
      className={`min-w-[250px] min-h-[200px] ${isSelected ? "border-2 border-primary" : ""}`}
      isPressable={!!onSelect}
      shadow="sm"
      onPress={() => onSelect && onSelect(dealership)}
    >
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start text-start">
        <h4 className="font-bold text-large line-clamp-1">{dealership_name}</h4>
        <p className="text-tiny text-default-500 line-clamp-1 mb-1">{city}</p>
      </CardHeader>
      <Divider />
      <CardBody className="py-2">
        <p className="text-sm">{address}</p>
        <p className="text-sm">{zipcode}</p>
      </CardBody>
      <CardFooter className="pt-0">
        <Button
          className="w-full"
          color="primary"
          size="sm"
          onPress={() => onSelect && onSelect(dealership)}
        >
          Sélectionner
        </Button>
      </CardFooter>
    </Card>
  );
}
