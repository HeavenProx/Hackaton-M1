import { useState, useEffect } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  AutocompleteSection,
} from "@heroui/autocomplete";
import { Spinner } from "@heroui/spinner";
import mapboxgl from "mapbox-gl";

type GeocodingFeature = {
  id: string;
  place_name: string;
  center: [number, number]; // [longitude, latitude]
  place_type: string[];
  text: string;
};

type GeocodingResponse = {
  features: GeocodingFeature[];
};

type CategoryGroup = {
  category: string;
  features: GeocodingFeature[];
};

type LocationSearchProps = {
  onLocationSelect?: (location: {
    name: string;
    longitude: number;
    latitude: number;
  }) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  mapboxToken?: string; // Allow token to be passed as prop or use from env
};

export default function LocationSearch({
  onLocationSelect,
  placeholder = "Rechercher une adresse",
  label = "Localisation",
  className = "max-w-xs",
  mapboxToken,
}: LocationSearchProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<CategoryGroup[]>([]);
  const [value, setValue] = useState("");

  // Set Mapbox token globally on component mount
  useEffect(() => {
    // Use the token from props or environment variable
    const token = mapboxToken || import.meta.env.VITE_MAPBOX_TOKEN;

    if (token) {
      mapboxgl.accessToken = token;
    }
  }, [mapboxToken]);

  const handleInputChange = async (value: string) => {
    setValue(value);

    if (value.trim().length < 3) {
      setSearchResults([]);

      return;
    }

    setIsLoading(true);

    try {
      // Use mapbox-gl's built-in geocoding client which handles CORS correctly
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json`;
      const params = new URLSearchParams({
        access_token: mapboxgl.accessToken as string,
        country: "fr",
        language: "fr",
        types:
          "country,region,postcode,district,place,locality,neighborhood,address,poi",
      });

      const response = await fetch(`${url}?${params}`);

      if (!response.ok) {
        throw new Error("Geocoding API request failed");
      }

      const data: GeocodingResponse = await response.json();

      // Group results by place type
      const groupedResults: Record<string, GeocodingFeature[]> = {};

      data.features.forEach((feature: GeocodingFeature) => {
        // Use the first place type as the category
        const category = mapPlaceTypeToCategory(feature.place_type[0]);

        if (!groupedResults[category]) {
          groupedResults[category] = [];
        }

        groupedResults[category].push(feature);
      });

      // Convert the grouped results to an array of category groups
      const categoryGroups = Object.keys(groupedResults).map((category) => ({
        category,
        features: groupedResults[category],
      }));

      setSearchResults(categoryGroups);
    } catch (error) {
      console.error("Error searching for locations:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectionChange = (key: React.Key | null) => {
    if (!key) return;

    // Find the selected feature across all category groups
    for (const group of searchResults) {
      const selectedFeature = group.features.find(
        (feature) => feature.id === key,
      );

      if (selectedFeature) {
        const [longitude, latitude] = selectedFeature.center;

        onLocationSelect?.({
          name: selectedFeature.place_name,
          longitude,
          latitude,
        });
        break;
      }
    }
  };

  // Map Mapbox place types to more user-friendly categories
  const mapPlaceTypeToCategory = (placeType: string): string => {
    const mapping: Record<string, string> = {
      country: "Pays",
      region: "Régions",
      postcode: "Codes Postaux",
      district: "Districts",
      place: "Villes",
      locality: "Localités",
      neighborhood: "Quartiers",
      address: "Adresses",
      poi: "Points d'intérêt",
    };

    return mapping[placeType] || "Autres";
  };

  return (
    <Autocomplete
      className={className}
      defaultItems={[]}
      inputProps={{
        classNames: {
          inputWrapper: "bg-default-100",
        },
      }}
      inputValue={value}
      isLoading={isLoading}
      items={searchResults.flatMap((group) => group.features)}
      label={label}
      placeholder={placeholder}
      onInputChange={handleInputChange}
      onSelectionChange={handleSelectionChange}
    >
      {isLoading ? (
        <AutocompleteItem key="loading" textValue="Loading">
          <div className="flex items-center justify-center p-2">
            <Spinner color="primary" size="sm" />
            <span className="ml-2">Recherche en cours...</span>
          </div>
        </AutocompleteItem>
      ) : (
        searchResults.map((group) => (
          <AutocompleteSection key={group.category} title={group.category}>
            {group.features.map((feature) => (
              <AutocompleteItem key={feature.id} textValue={feature.place_name}>
                <div className="flex flex-col">
                  <span>{feature.text}</span>
                  <span className="text-tiny text-default-400">
                    {feature.place_name}
                  </span>
                </div>
              </AutocompleteItem>
            ))}
          </AutocompleteSection>
        ))
      )}
    </Autocomplete>
  );
}
