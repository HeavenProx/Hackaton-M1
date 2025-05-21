import { Button } from "@heroui/button";
import { useDisclosure } from "@heroui/modal";

import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import NearbyGarageSelector from "@/components/NearbyGarageSelector";
import { useUser } from "@/contexts/UserContext";

export default function IndexPage() {
  const {user} = useUser();
  const disclosure = useDisclosure();

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <span className={title()}>Make&nbsp;</span>
          <span className={title({ color: "violet" })}>beautiful&nbsp;</span>
          <br />
          <span className={title()}>
            websites regardless of your design experience.
          </span>
          <div className={subtitle({ class: "mt-4" })}>
            Beautiful, fast and modern React UI library.
          </div>
        </div>
      </section>

      <div className="flex flex-col items-center justify-center">
        <Button color="primary" onPress={disclosure.onOpen}>
          open NearbyGarageSelector
        </Button>
      </div>

      <NearbyGarageSelector disclosure={disclosure} />
    </DefaultLayout>
  );
}
