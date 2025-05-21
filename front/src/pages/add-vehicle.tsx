import DefaultLayout from "@/layouts/default";
import CarPart from "@/components/registerFormSteps/carPart";

export default function AddVehiclePage() {
    const formData = {};

    return (
        <DefaultLayout>
            <div className="p-4 max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Ajouter un véhicule</h1>
                <CarPart formData={formData} onPrevious={() => { }} isStandalone />
            </div>
        </DefaultLayout>
    );
}
