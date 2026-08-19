import { useState } from 'react'
import {
  MapContainer,
  Marker,
  TileLayer,
  useMapEvents,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

type LocationPickerProps = {
  initialLatitude?: number | null
  initialLongitude?: number | null
  onConfirm: (
    latitude: number,
    longitude: number
  ) => void
  onClose: () => void
}

const defaultPosition: [number, number] = [
  30.7333,
  76.7794,
]

const markerIcon = L.divIcon({
  className: '',
  html: `
    <div
      style="
        width: 34px;
        height: 34px;
        border-radius: 50% 50% 50% 0;
        background: #17351d;
        border: 3px solid #efffb0;
        transform: rotate(-45deg);
        box-shadow: 0 6px 18px rgba(8,21,11,.25);
      "
    ></div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
})

function MapClickHandler({
  onSelect,
}: {
  onSelect: (latitude: number, longitude: number) => void
}) {
  useMapEvents({
    click(event) {
      onSelect(
        event.latlng.lat,
        event.latlng.lng
      )
    },
  })

  return null
}

export default function LocationPicker({
  initialLatitude,
  initialLongitude,
  onConfirm,
  onClose,
}: LocationPickerProps) {
  const hasInitialLocation =
    typeof initialLatitude === 'number' &&
    typeof initialLongitude === 'number'

  const [position, setPosition] =
    useState<[number, number]>(
      hasInitialLocation
        ? [
            initialLatitude!,
            initialLongitude!,
          ]
        : defaultPosition
    )

  return (
    <div className="fixed inset-0 z-[600] flex flex-col bg-[#f5f3e8]">

      {/* HEADER */}

      <header
        className="
          flex
          shrink-0
          items-center
          justify-between
          border-b
          border-[#17351d]/10
          bg-[#f5f3e8]/95
          px-5
          py-4
          backdrop-blur-xl
          sm:px-8
        "
      >
        <div>
          <p
            className="
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.28em]
              text-[#71864d]
            "
          >
            Delivery location
          </p>

          <h2
            className="
              mt-1
              font-playfair
              text-2xl
              italic
            "
          >
            Select on map
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border
            border-[#17351d]/10
            bg-white/60
            text-xl
          "
        >
          ×
        </button>
      </header>


      {/* INSTRUCTIONS */}

      <div
        className="
          shrink-0
          border-b
          border-[#17351d]/10
          bg-white/60
          px-5
          py-4
          sm:px-8
        "
      >
        <p className="text-sm font-semibold">
          Choose the delivery point
        </p>

        <p className="mt-1 text-xs text-[#17351d]/45">
          Tap anywhere on the map to place the pin.
        </p>
      </div>


      {/* MAP */}

      <div className="min-h-0 flex-1">

        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom
          className="h-full w-full"
        >

          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler
            onSelect={(latitude, longitude) =>
              setPosition([
                latitude,
                longitude,
              ])
            }
          />

          <Marker
            position={position}
            icon={markerIcon}
          />

        </MapContainer>

      </div>


      {/* BOTTOM CTA */}

      <div
        className="
          shrink-0
          border-t
          border-[#17351d]/10
          bg-[#f5f3e8]/95
          px-4
          pb-[max(16px,env(safe-area-inset-bottom))]
          pt-3
          backdrop-blur-xl
          sm:px-8
        "
      >

        <div className="mx-auto w-full max-w-[760px]">

          <button
            type="button"
            onClick={() =>
              onConfirm(
                position[0],
                position[1]
              )
            }
            className="
              flex
              h-12
              w-full
              items-center
              justify-center
              rounded-full
              bg-[#17351d]
              text-sm
              font-semibold
              text-white
              shadow-[0_12px_35px_rgba(8,21,11,.20)]
              transition
              hover:bg-[#244b2b]
              active:scale-[0.98]
            "
          >
            Confirm this location
          </button>

        </div>

      </div>

    </div>
  )
}