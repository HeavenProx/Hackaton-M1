import { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";

import "mapbox-gl/dist/mapbox-gl.css";
import { dealerships } from "@/data/dealerships";
import { Dealership } from "@/types/dealership";

interface MapBoxContainerProps {
  selectedDealership?: Dealership | null;
  onDealershipSelect?: (dealership: Dealership) => void;
}

export default function MapBoxContainer({
  selectedDealership,
  onDealershipSelect,
}: MapBoxContainerProps) {
  const mapRef = useRef<mapboxgl.Map | undefined>(undefined);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});

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

    // Add markers for each dealership once the map is loaded
    mapRef.current.on("load", () => {
      dealerships.forEach((dealership) => {
        const marker = new mapboxgl.Marker({
          color:
            selectedDealership?.dealership_name === dealership.dealership_name
              ? "#0072F5"
              : "#666666",
        })
          .setLngLat([dealership.longitude, dealership.latitude])
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
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

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
            .setLngLat([dealership.longitude, dealership.latitude])
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
        center: [selectedDealership.longitude, selectedDealership.latitude],
        zoom: 12,
        essential: true,
      });
    }
  }, [selectedDealership, onDealershipSelect]);

  return (
    <div
      ref={mapContainerRef}
      className="rounded-lg overflow-hidden h-[50vh]"
    />
  );
}
