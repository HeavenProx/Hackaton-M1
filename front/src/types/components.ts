export type ModalDisclosureProps = {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
};

export type NearbyGarageSelectorProps = {
  disclosure: ModalDisclosureProps;
};
