import DefaultLayout from "@/layouts/default";
import CarInfo from "@/components/registerFormSteps/CarInfo";

export default function AddVehiclePage() {
  const formData = {};

  return (
    <DefaultLayout>
      <div className="p-4 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Ajouter un véhicule</h1>
        <CarInfo formData={formData} isStandalone />
      </div>
    </DefaultLayout>
  );
}
