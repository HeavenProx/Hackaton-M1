import { useState } from 'react'
import UserPart from '@/components/loginFormSteps/userPart'
import CarPart from '@/components/loginFormSteps/carPart'
import { Transition } from '@headlessui/react'

export default function MultiStepForm() {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({})

    const next = (data) => {
        setFormData((prev) => ({ ...prev, ...data }))
        setStep(step + 1)
    }

    const previous = () => setStep(step - 1)

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-2xl space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
                {step === 1 ? 'Vos informations personnelles' : 'Votre véhicule'}
            </h2>

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
