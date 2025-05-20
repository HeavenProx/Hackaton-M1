import { useState } from 'react'
import UserPart from '@/components/registerFormSteps/userPart'
import CarPart from '@/components/registerFormSteps/carPart'
import { Transition } from '@headlessui/react'

export default function RegisterPage() {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({})

    const next = (data) => {
        setFormData((prev) => ({ ...prev, ...data }))
        setStep(step + 1)
    }

    const previous = () => setStep(step - 1)

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">
                {step === 1 ? 'Création de compte : Vos informations personnelles' : 'Création de compte : Votre véhicule'}
            </h1>

            <p className="text-sm text-gray-600">
                {step === 1
                    ? 'Veuillez renseigner vos informations pour créer votre compte.'
                    : 'Vous pouvez dès à présent renseigner les données de votre véhicule, ou alors vous pourrez le faire plus tard, depuis votre compte.'}
            </p>

            <Transition
                show={step === 1}
                enter="transition-opacity duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div>
                    <UserPart onNext={next} defaultValues={formData} />
                </div>
            </Transition>

            <Transition
                show={step === 2}
                enter="transition-opacity duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div>
                    <CarPart onPrevious={previous} formData={formData} />
                </div>
            </Transition>
        </div>
    )
}
