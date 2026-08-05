import { useEffect, useRef, useState } from "react";
import L from "leaflet";

const DEFAULT_MAP_CENTER = [23, 79];

const locationIcon = L.divIcon({
  className: "",
  html: `
    <div
      style="
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 4px solid white;
        border-radius: 50% 50% 50% 0;
        background: #f45d52;
        box-shadow: 0 6px 18px rgba(0, 0, 0, 0.28);
        transform: rotate(-45deg);
      "
    >
      <div
        style="
          width: 10px;
          height: 10px;
          border-radius: 9999px;
          background: white;
        "
      ></div>
    </div>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

function normalizeCoordinates(latitude, longitude) {
  return {
    latitude: Number(latitude.toFixed(7)),
    longitude: Number(longitude.toFixed(7)),
  };
}

export default function LocationPicker({ value, onChange }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const onChangeRef = useRef(onChange);
  const placeMarkerRef = useRef(null);

  const [isLocating, setIsLocating] = useState(false);

  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (mapContainerRef.current === null || mapRef.current !== null) {
      return undefined;
    }

    const hasInitialLocation =
      Number.isFinite(value?.latitude) && Number.isFinite(value?.longitude);

    const initialCenter = hasInitialLocation
      ? [value.latitude, value.longitude]
      : DEFAULT_MAP_CENTER;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: hasInitialLocation ? 16 : 5,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    function emitLocation(latitude, longitude) {
      onChangeRef.current?.(normalizeCoordinates(latitude, longitude));
    }

    function placeMarker(latitude, longitude, shouldMoveMap = true) {
      const position = [latitude, longitude];

      if (markerRef.current === null) {
        const marker = L.marker(position, {
          draggable: true,
          icon: locationIcon,
        }).addTo(map);

        marker.on("dragend", () => {
          const markerPosition = marker.getLatLng();

          emitLocation(markerPosition.lat, markerPosition.lng);
        });

        markerRef.current = marker;
      } else {
        markerRef.current.setLatLng(position);
      }

      if (shouldMoveMap) {
        map.setView(position, 17);
      }
    }

    placeMarkerRef.current = placeMarker;

    map.on("click", (event) => {
      const { lat, lng } = event.latlng;

      placeMarker(lat, lng, false);

      emitLocation(lat, lng);
    });

    mapRef.current = map;

    window.setTimeout(() => {
      map.invalidateSize();
    }, 0);

    return () => {
      map.remove();

      mapRef.current = null;
      markerRef.current = null;
      placeMarkerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (
      !Number.isFinite(value?.latitude) ||
      !Number.isFinite(value?.longitude)
    ) {
      return;
    }

    placeMarkerRef.current?.(value.latitude, value.longitude, false);
  }, [value?.latitude, value?.longitude]);

  function handleCurrentLocation() {
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Your browser does not support location access.");

      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coordinates = normalizeCoordinates(
          position.coords.latitude,
          position.coords.longitude,
        );

        placeMarkerRef.current?.(coordinates.latitude, coordinates.longitude);

        onChangeRef.current?.(coordinates);

        setIsLocating(false);
      },
      () => {
        setLocationError(
          "Your current location could not be detected. Select the location manually on the map.",
        );

        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      },
    );
  }

  return (
    <section>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-950">
            Select your location
          </h2>

          <p className="mt-1 text-sm leading-6 text-gray-500">
            Click anywhere on the map or drag the location pin.
          </p>
        </div>

        <button
          type="button"
          onClick={handleCurrentLocation}
          disabled={isLocating}
          className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border-2 border-gray-900 px-5 py-3 text-sm font-black text-gray-900 transition-colors hover:bg-gray-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <i className="fa-solid fa-location-crosshairs" />

          {isLocating ? "Detecting..." : "Use Current Location"}
        </button>
      </div>

      {locationError && (
        <div className="mb-4 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
          <i className="fa-solid fa-circle-exclamation mt-1" />
          <p>{locationError}</p>
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border-4 border-white shadow-lg">
        <div ref={mapContainerRef} className="h-[420px] w-full bg-gray-200" />
      </div>

      <p className="mt-4 flex items-start gap-2 text-sm leading-6 text-gray-500">
        <i className="fa-solid fa-circle-info mt-1 text-[#f45d52]" />
        Place the pin precisely at the delivery entrance or building location.
      </p>
    </section>
  );
}
