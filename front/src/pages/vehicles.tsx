import { useEffect, useState } from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardFooter,
    addToast,
} from "@heroui/react";
import { Link } from "react-router-dom";

import { useUser } from "@/contexts/UserContext";
import DefaultLayout from "@/layouts/default";
import PDFButton from "@/components/PdfGenerate.tsx";
import { Message, useMileageChatBot } from "@/hooks/useChatbotMileage.ts";

export const VehiclesPage = () => {
    const { user, token } = useUser();
    const [vehicleList, setVehicleList] = useState<any[]>([]);
    const [carToDelete, setCarToDelete] = useState<any | null>(null);
    const [carHistory, setCarHistory] = useState<any | null>(null);
    const [carInterventions, setCarInterventions] = useState<any[]>([]);
    const [loadingInterventions, setLoadingInterventions] =
        useState<boolean>(false);
    const [editingCarId, setEditingCarId] = useState<string | null>(null);
    const [newDistance, setNewDistance] = useState<string>("");
    const [distanceErrors, setDistanceErrors] = useState<
        Record<string, string | null>
    >({});
    const [mileageResponse, setMileageResponse] = useState<string[] | null>(null);

    const { sendRequest, isLoading } = useMileageChatBot({
        onSuccess: (data) => {
            if (data.options) {
                setMileageResponse(data.options);
            }
        },
        onError: () => {
            addToast({
                title: "Erreur",
                description: "Impossible d'obtenir une réponse du chatbot.",
                color: "danger",
            });
        },
    });

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

    const extractCarId = (uri: string): string => uri.split("/").pop() ?? uri;

    const handleDelete = async () => {
        if (!carToDelete) return;

        const carToDeleteId = extractCarId(carToDelete["@id"]);

        try {
            const res = await fetch(`http://127.0.0.1:8000/cars/${carToDeleteId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
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
            setDistanceErrors((prev) => ({ ...prev, [car["@id"]]: null }));
        } catch (err) {
            console.error(err);
            addToast({
                title: "Erreur",
                description: "Échec de la mise à jour.",
                color: "danger",
            });
        }
    };

    const handleAnalyzeMileage = async (car: any) => {
        const message: Message = {
            role: "user",
            content: `Mon véhicule ${car.brand} ${car.model} affiche actuellement ${car.distance} km. Que devrais-je vérifier ou prévoir ?`,
        };
        await sendRequest([message]);
    };

    useEffect(() => {
        if (!carHistory) return;

        const fetchInterventions = async () => {
            const carId = extractCarId(carHistory["@id"]);
            setLoadingInterventions(true);

            try {
                const res = await fetch(
                    `http://localhost:8000/cars/${carId}/interventions`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (!res.ok) throw new Error("Erreur récupération interventions");

                const data = await res.json();
                setCarInterventions(data["member"][0]["interventions"] || []);
            } catch (err) {
                console.error(err);
                addToast({
                    title: "Erreur",
                    description: "Impossible de récupérer l'historique.",
                    color: "danger",
                });
            } finally {
                setLoadingInterventions(false);
            }
        };

        fetchInterventions();
    }, [carHistory]);

    return (
        <DefaultLayout>
            <div className="mt-[30px] p-4 max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Mes véhicules</h1>
                    <Button as={Link} color="primary" to="/add-vehicle">
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
                                className="bg-default-50 dark:bg-default-100"
                                shadow="sm"
                            >
                                <CardHeader className="flex justify-between items-center">
                                    <h2 className="text-lg font-semibold">
                                        {car.brand} {car.model}
                                    </h2>
                                    <Button color="danger" variant="ghost" onPress={() => setCarToDelete(car)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                             stroke-width="1.5" stroke="currentColor" className="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                  d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"/>
                                        </svg>

                                    </Button>
                                </CardHeader>
                                <CardBody className="space-y-1">
                                    <p><strong>Immatriculation :</strong> {car.registration}</p>
                                    <p><strong>VIN :</strong> {car.vin}</p>
                                    <p><strong>Mise en circulation :</strong> {formatDate(car.entryCirculationDate)}</p>
                                    <p className="flex items-center gap-2">
                                    <strong>Kilométrage :</strong>
                                        {editingCarId === car["@id"] ? (
                                            <>
                                                <input
                                                    className="border px-2 py-1 max-w-[8rem] rounded-md text-sm"
                                                    type="number"
                                                    value={newDistance}
                                                    onChange={(e) => setNewDistance(e.target.value)}
                                                />
                                                <Button size="sm" onPress={() => handleUpdateDistance(car)}>
                                                    Valider
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                {car.distance} km
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onPress={() => {
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
                                <CardFooter className="flex flex-wrap gap-2 justify-between items-center">
                                    <Button variant="light" size="sm" color="primary" onPress={() => setCarHistory(car)}>
                                        Historique des interventions
                                    </Button>
                                    <Button
                                        variant="light" color="primary" size="sm"
                                        onPress={() => handleAnalyzeMileage(car)}
                                        isLoading={isLoading}
                                    >
                                        {isLoading ? "Analyse..." : "Prévisionnel des interventions à venir"}
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
                        <p>Es-tu sûr de vouloir supprimer ce véhicule ? Cette action est irréversible.</p>
                        <div className="flex justify-end gap-3 mt-4">
                            <Button variant="ghost" onPress={() => setCarToDelete(null)}>Annuler</Button>
                            <Button color="danger" onPress={handleDelete}>Supprimer</Button>
                        </div>
                    </div>
                </div>
            )}

            {carHistory && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white dark:bg-default-100 p-8 rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col space-y-6">
                        {/* Header fixe */}
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Historique des interventions</h2>
                            <Button variant="ghost" onPress={() => setCarHistory(null)}>Fermer</Button>
                        </div>

                        {/* Contenu scrollable */}
                        <div className="overflow-y-auto flex-1">
                            <table className="w-full text-sm border rounded-md table-fixed">
                                <thead className="bg-gray-100 dark:bg-default-50 sticky top-0 z-10">
                                <tr>
                                    <th className="px-4 py-2 text-left">Date</th>
                                    <th className="px-4 py-2 text-left">Description</th>
                                    <th className="px-4 py-2 text-left">Garage</th>
                                    <th className="px-4 py-2 text-left">Compte rendu</th>
                                </tr>
                                </thead>
                                <tbody>
                                {loadingInterventions ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-4">Chargement des interventions...</td>
                                    </tr>
                                ) : carInterventions.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center text-default-500 py-4">Aucune intervention trouvée pour ce véhicule.</td>
                                    </tr>
                                ) : (
                                    carInterventions.map((intervention: any) => (
                                        <tr key={intervention["@id"]} className="border-t">
                                            <td className="px-4 py-2">{formatDate(intervention.date)}</td>
                                            <td className="px-4 py-2">{intervention.diagnostic}</td>
                                            <td className="px-4 py-2">{intervention.garage.dealership_name}</td>
                                            <td className="px-4 py-2">
                                                <PDFButton interventionId={intervention["@id"].split("/")[2]} />
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {mileageResponse && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white dark:bg-default-100 p-8 rounded-xl shadow-xl max-w-xl w-full space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Analyse Du kilométrage</h2>
                            <Button variant="ghost" onPress={() => setMileageResponse(null)}>Fermer</Button>
                        </div>
                        <table className="w-full text-sm border rounded-md">
                            <thead className="bg-gray-100 dark:bg-default-50">
                            <tr>
                                <th className="px-4 py-2 text-left">Opération</th>
                                <th className="px-4 py-2 text-left">urgence</th>
                            </tr>
                            </thead>
                            <tbody>
                            {mileageResponse.map((operation: any) => {
                                let rowClass = "";
                                if (operation.urgence === "urgent") rowClass = "bg-red-100 text-red-800";
                                else if (operation.urgence === "prochainement") rowClass = "bg-yellow-100 text-yellow-800";
                                else if (operation.urgence === "à prévoir") rowClass = "bg-green-100 text-green-800";

                                return (
                                    <tr key={operation["@id"]} className={`border-t ${rowClass}`}>
                                        <td className="px-4 py-2">{operation.operation}</td>
                                        <td className="px-4 py-2">{operation.urgence}</td>
                                    </tr>
                                );
                            })}
                            </tbody>

                        </table>
                    </div>
                </div>
            )}
        </DefaultLayout>
    );
};
