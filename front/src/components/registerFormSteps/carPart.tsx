"use client";

import { Input, Button, Spacer } from "@heroui/react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Props = {
  onPrevious: () => void;
  formData: any;
};

export default function CarPart({ onPrevious, formData }: Props) {
  const [brands, setBrands] = useState<string[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<string[]>([]);
  const [brandInput, setBrandInput] = useState("");

  const [models, setModels] = useState<string[]>([]);
  const [filteredModels, setFilteredModels] = useState<string[]>([]);
  const [modelInput, setModelInput] = useState("");

  const { register, handleSubmit, setValue } = useForm({
    mode: "onSubmit",
  });

  const onSubmit = (data) => {
    const finalData = { ...formData, ...data };

    console.log("Soumission finale :", finalData);
    // Ici, requête POST vers serveur API
  };

  const skipStep = () => {
    console.log("Soumission sans véhicule :", formData);
    // TODO: POST formData vers le serveur
  };

  const dateToday = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetch(
      "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/all-vehicles-model/records?limit=100",
    )
      .then((res) => res.json())
      .then((data) => {
        const brandList = Array.from(
          new Set(data.results.map((item: any) => item.make).filter(Boolean)),
        ).sort();

        setBrands(brandList);
      })
      .catch((err) => console.error("Erreur API marques :", err));
  }, []);

  useEffect(() => {
    if (!brandInput) {
      setModels([]);

      return;
    }

    fetch(
      `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/all-vehicles-model/records?where=make%3D%22${encodeURIComponent(brandInput)}%22&limit=100`,
    )
      .then((res) => res.json())
      .then((data) => {
        const modelList = Array.from(
          new Set(data.results.map((item: any) => item.model).filter(Boolean)),
        ).sort();

        setModels(modelList);
      })
      .catch((err) => console.error("Erreur API modèles :", err));
  }, [brandInput]);

  const handleBrandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setBrandInput(value);
    setValue("carBrand", value);
    if (value.trim() === "") {
      setFilteredBrands(brands);
    } else {
      setFilteredBrands(
        brands.filter((b) => b.toLowerCase().includes(value.toLowerCase())),
      );
    }
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setModelInput(value);
    setValue("carModel", value);
    if (value.trim() === "") {
      setFilteredModels(models);
    } else {
      setFilteredModels(
        models.filter((m) => m.toLowerCase().includes(value.toLowerCase())),
      );
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`relative ${!brandInput ? "md:col-span-2" : ""}`}>
          <Input
            isRequired
            label="Marque"
            value={brandInput}
            onChange={handleBrandChange}
          />
          {filteredBrands.length > 0 && (
            <ul className="absolute z-30 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-md max-h-60 overflow-y-auto text-sm">
              {filteredBrands.map((brand, i) => (
                <li
                  key={i}
                  className="px-3 py-2 cursor-pointer hover:bg-blue-100"
                  onClick={() => {
                    setBrandInput(brand);
                    setValue("carBrand", brand);
                    setFilteredBrands([]);
                    setModelInput("");
                    setModels([]);
                  }}
                >
                  {brand}
                </li>
              ))}
            </ul>
          )}
        </div>

        {brandInput && (
          <div className="relative">
            <Input
              isRequired
              label="Modèle"
              value={modelInput}
              onChange={handleModelChange}
            />
            {filteredModels.length > 0 && (
              <ul className="absolute z-30 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-md max-h-60 overflow-y-auto text-sm">
                {filteredModels.map((model, i) => (
                  <li
                    key={i}
                    className="px-3 py-2 cursor-pointer hover:bg-blue-100"
                    onClick={() => {
                      setModelInput(model);
                      setValue("carModel", model);
                      setFilteredModels([]);
                    }}
                  >
                    {model}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input {...register("carLicence")} isRequired label="Immatriculation" />
        <Input {...register("carVin")} isRequired label="Numéro VIN" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          {...register("carCirculationDate")}
          isRequired
          label="Date de mise en circulation"
          max={dateToday}
          type="date"
        />
        <Input
          {...register("carDistance")}
          isRequired
          label="Kilométrage"
          min={0}
          type="number"
        />
      </div>

      <Spacer y={1} />

      <div className="flex justify-between pt-4">
        <Button type="button" variant="light" onClick={onPrevious}>
          Retour
        </Button>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={skipStep}>
            Passer cette étape
          </Button>
          <Button color="primary" type="submit">
            Créer mon compte
          </Button>
        </div>
      </div>

      <p className="text-sm text-center text-gray-600">
        Vous avez déja un compte ?<br />
        <Link className="text-primary hover:underline" to="/login">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
