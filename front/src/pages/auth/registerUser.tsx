import { useState } from "react";
import { Transition } from "@headlessui/react";

import UserPart from "@/components/registerFormSteps/userPart";
import CarPart from "@/components/registerFormSteps/carPart";
import DefaultLayout from "@/layouts/default";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const next = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(step + 1);
  };

  const previous = () => setStep(step - 1);

  return (
    <DefaultLayout>
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-default-50 shadow-xl rounded-2xl space-y-6">
        <h1 className="text-2xl font-bold text-default-800">
          {step === 1
            ? "Création de compte : Vos informations personnelles"
            : "Création de compte : Votre véhicule"}
        </h1>

        <p className="text-sm text-default-600">
          {step === 1
            ? "Veuillez renseigner vos informations pour créer votre compte."
            : "Vous pouvez dès à présent renseigner les données de votre véhicule, ou alors vous pourrez le faire plus tard, depuis votre compte."}
        </p>

        <Transition
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          show={step === 1}
        >
          <div>
            <UserPart defaultValues={formData} onNext={next} />
          </div>
        </Transition>

        <Transition
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          show={step === 2}
        >
          <div>
            <CarPart formData={formData} onPrevious={previous} />
          </div>
        </Transition>
      </div>
    </DefaultLayout>
  );
}
