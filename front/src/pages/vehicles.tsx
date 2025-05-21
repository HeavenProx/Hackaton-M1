import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import DefaultLayout from "@/layouts/default";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    addToast,
} from "@heroui/react";
import { Link } from "react-router-dom";

export const VehiclesPage = () => {
    const { user, token } = useUser();
    const [vehicleList, setVehicleList] = useState<any[]>([]);
    const [carToDelete, setCarToDelete] = useState<any | null>(null);
    const [editingCarId, setEditingCarId] = useState<string | null>(null);
    const [newDistance, setNewDistance] = useState<string>("");
    const [distanceErrors, setDistanceErrors] = useState<Record<string, string | null>>({});

    // Met à jour la liste locale quand le user change
    useEffect(() => {
        setVehicleList(user?.cars || []);
    }, [user]);

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const extractCarId = (uri: string): string =>
        uri.split("/").pop() ?? uri;

    const handleDelete = async () => {
        if (!carToDelete) return;

        const carToDeleteId = extractCarId(carToDelete["@id"]);

        try {
            const res = await fetch(`http://127.0.0.1:8000/cars/${carToDeleteId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Erreur à la suppression");

            addToast({
                title: "Véhicule supprimé",
                description: `${carToDelete.brand} ${carToDelete.model} a bien été supprimé.`,
                color: "success",
            });

            setVehicleList((prev) =>
                prev.filter((car) => extractCarId(car["@id"]) !== carToDeleteId)
            );

            setCarToDelete(null);
        } catch (err) {
            console.error(err);
            addToast({
                title: "Erreur",
                description: "Impossible de supprimer le véhicule.",
                color: "danger",
            });
        }
    };

    const handleUpdateDistance = async (car: any) => {
        const carId = extractCarId(car["@id"]);
        const distanceValue = parseFloat(newDistance);

        if (isNaN(distanceValue) || distanceValue < 0) {
            setDistanceErrors((prev) => ({
                ...prev,
                [car["@id"]]: "Veuillez entrer un kilométrage valide.",
            }));
            return;
        }

        try {
            const res = await fetch(`http://127.0.0.1:8000/cars/${carId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/merge-patch+json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ distance: distanceValue }),
            });

            if (!res.ok) throw new Error("Erreur API");


            setVehicleList((prev) =>
                prev.map((c) =>
                    c["@id"] === car["@id"] ? { ...c, distance: distanceValue } : c
                )
            );

            addToast({
                title: "Kilométrage mis à jour",
                description: `Votre ${car.brand} ${car.model} est maintenant à ${distanceValue} km.`,
                color: "success",
            });


            setEditingCarId(null);
            setDistanceErrors((prev) => ({
                ...prev,
                [car["@id"]]: null,
            }));
        } catch (err) {
            console.error(err);
            addToast({
                title: "Erreur",
                description: "Échec de la mise à jour.",
                color: "danger",
            });
        }
    };

    return (
        <DefaultLayout>
            <div className="mt-[30px] p-4 max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Mes véhicules</h1>
                    <Button as={Link} to="/add-vehicle" color="primary">
                        Ajouter un véhicule
                    </Button>
                </div>

                {vehicleList.length === 0 ? (
                    <p className="text-center text-default-500">
                        Aucun véhicule n'est enregistré sur votre compte...
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {vehicleList.map((car: any) => (
                            <Card
                                key={extractCarId(car["@id"])}
                                shadow="sm"
                                className="bg-default-50 dark:bg-default-100"
                            >
                                <CardHeader>
                                    <h2 className="text-lg font-semibold">
                                        {car.brand} {car.model}
                                    </h2>
                                </CardHeader>
                                <CardBody className="space-y-1">
                                    <p>
                                        <strong>Immatriculation :</strong> {car.registration}
                                    </p>
                                    <p>
                                        <strong>VIN :</strong> {car.vin}
                                    </p>
                                    <p>
                                        <strong>Mise en circulation :</strong>{" "}
                                        {formatDate(car.entryCirculationDate)}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <strong>Kilométrage :</strong>
                                        {editingCarId === car["@id"] ? (
                                            <>
                                                <input
                                                    type="number"
                                                    value={newDistance}
                                                    onChange={(e) => setNewDistance(e.target.value)}
                                                    className="border px-2 py-1 max-w-[8rem] rounded-md text-sm"
                                                />
                                                <Button className="ml-auto" size="sm" onClick={() => handleUpdateDistance(car)}>
                                                    Valider
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                {car.distance} km
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="ml-auto"
                                                    onClick={() => {
                                                        setEditingCarId(car["@id"]);
                                                        setNewDistance(String(car.distance));
                                                        setDistanceErrors((prev) => ({ ...prev, [car["@id"]]: null }));
                                                    }}
                                                >
                                                    Modifier
                                                </Button>
                                            </>
                                        )}
                                    </p>

                                    {distanceErrors[car["@id"]] && (
                                        <p className="text-sm text-red-600">{distanceErrors[car["@id"]]}</p>
                                    )}
                                </CardBody>
                                <CardFooter>
                                    <Button color="danger" onClick={() => setCarToDelete(car)}>
                                        Supprimer
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {carToDelete && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white dark:bg-default-100 p-6 rounded-xl shadow-xl max-w-sm w-full space-y-4">
                        <h2 className="text-lg font-semibold">Confirmer la suppression</h2>
                        <p>
                            Es-tu sûr de vouloir supprimer ce véhicule ? Cette action est
                            irréversible.
                        </p>
                        <div className="flex justify-end gap-3 mt-4">
                            <Button variant="ghost" onClick={() => setCarToDelete(null)}>
                                Annuler
                            </Button>
                            <Button color="danger" onClick={handleDelete}>
                                Supprimer
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </DefaultLayout>
    );
};
