import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import fetchDealerships from "@/data/dealerships";
import { MapBoxContainerProps } from "@/types/mapBoxContainer";
import { Dealership } from "@/types/dealership";
import { useUser } from "@/contexts/UserContext";

export default function MapBoxContainer({
  selectedDealership,
  onDealershipSelect,
  selectedLocation,
}: MapBoxContainerProps) {
  const mapRef = useRef<mapboxgl.Map | undefined>(undefined);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const locationMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [dealerships, setDealerships] =
    useState<Dealership[]>(fetchDealerships);
  const [isLoading, setIsLoading] = useState(true);

  const { token } = useUser();

  // Fetch dealerships from API
  useEffect(() => {
    const loadDealerships = async () => {
      setIsLoading(true);
      try {
        if (!token) {
          console.error("No token available");

          return;
        }
        setDealerships(fetchDealerships);
      } catch (error) {
        console.error("Error loading dealerships:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDealerships();
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) {
      return;
    }
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [2.213749, 46.227638], // Center of France
      zoom: 5,
    });

    // Add markers for each dealership once the map is loaded and dealerships are fetched
    mapRef.current.on("load", () => {
      if (!isLoading) {
        addDealershipMarkers();
      }
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [isLoading]);

  // Add markers when dealerships are loaded
  useEffect(() => {
    if (mapRef.current && mapRef.current.loaded() && !isLoading) {
      addDealershipMarkers();
    }
  }, [dealerships, isLoading]);

  const addDealershipMarkers = () => {
    if (!mapRef.current) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    dealerships.forEach((dealership) => {
      const marker = new mapboxgl.Marker({
        color:
          selectedDealership?.dealership_name === dealership.dealership_name
            ? "#0072F5"
            : "#666666",
      })
        .setLngLat([
          parseFloat(dealership.longitude),
          parseFloat(dealership.latitude),
        ])
        .addTo(mapRef.current as mapboxgl.Map);

      markersRef.current[dealership.dealership_name] = marker;

      const el = marker.getElement();

      if (el) {
        // Add click event listener to the marker element
        el.addEventListener("click", () => {
          if (onDealershipSelect) {
            onDealershipSelect(dealership);
          }
        });
      }
    });
  };

  // Update marker colors when selected dealership changes
  useEffect(() => {
    Object.keys(markersRef.current).forEach((name) => {
      const marker = markersRef.current[name];
      const color =
        selectedDealership?.dealership_name === name ? "#0072F5" : "#666666";

      if (marker) {
        // Remove the previous marker
        marker.remove();

        // Create a new marker with the updated color
        const dealership = dealerships.find((d) => d.dealership_name === name);

        if (dealership && mapRef.current) {
          const newMarker = new mapboxgl.Marker({
            color: color,
          })
            .setLngLat([
              parseFloat(dealership.longitude),
              parseFloat(dealership.latitude),
            ])
            .addTo(mapRef.current);

          // Update the reference
          markersRef.current[name] = newMarker;

          // Re-add click event
          const el = newMarker.getElement();

          if (el && onDealershipSelect) {
            el.addEventListener("click", () => {
              onDealershipSelect(dealership);
            });
          }
        }
      }
    });

    // Center map on selected dealership if one is selected
    if (selectedDealership && mapRef.current) {
      mapRef.current.flyTo({
        center: [
          parseFloat(selectedDealership.longitude),
          parseFloat(selectedDealership.latitude),
        ],
        zoom: 12,
        essential: true,
      });
    }
  }, [selectedDealership, onDealershipSelect, dealerships]);

  // Handle the selected location from LocationSearch
  useEffect(() => {
    // Remove previous location marker if it exists
    if (locationMarkerRef.current) {
      locationMarkerRef.current.remove();
      locationMarkerRef.current = null;
    }

    if (selectedLocation && mapRef.current) {
      // Create a new marker for the selected location
      locationMarkerRef.current = new mapboxgl.Marker({
        color: "#FF0000", // Red color to distinguish from dealership markers
      })
        .setLngLat([selectedLocation.longitude, selectedLocation.latitude])
        .addTo(mapRef.current);

      // Center map on the selected location
      mapRef.current.flyTo({
        center: [selectedLocation.longitude, selectedLocation.latitude],
        zoom: 14,
        essential: true,
      });
    }
  }, [selectedLocation]);

  return (
    <div
      ref={mapContainerRef}
      className="rounded-lg overflow-hidden h-[70vh]"
    />
  );
}
