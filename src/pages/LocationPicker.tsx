import { useEffect, useRef, useState } from 'react'
import {
  LocateFixed,
  Search,
  X,
} from 'lucide-react'

import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

type LocationPickerProps = {
  initialLatitude?: number | null
  initialLongitude?: number | null
  onConfirm: (
    latitude: number,
    longitude: number,
    locationText?: string,
    pincode?: string
  ) => void
  onClose: () => void
}

const defaultPosition: [number, number] = [
  30.7333,
  76.7794,
]

/* =========================================================
   CUSTOM MARKER
========================================================= */

const markerIcon = L.divIcon({
  className: 'fruit-house-location-marker',
  html: `
    <div
      style="
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        background: #17351d;
        border: 3px solid #efffb0;
        transform: rotate(-45deg);
        box-shadow: 0 6px 18px rgba(8,21,11,.30);
      "
    ></div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
})

/* =========================================================
   MAP SIZE FIX
========================================================= */

function MapReady() {
  const map = useMap()

  useEffect(() => {
    const resizeMap = () => {
      map.invalidateSize()
    }

    resizeMap()

    const timer1 = window.setTimeout(
      resizeMap,
      100
    )

    const timer2 = window.setTimeout(
      resizeMap,
      500
    )

    window.addEventListener(
      'resize',
      resizeMap
    )

    return () => {
      window.clearTimeout(timer1)
      window.clearTimeout(timer2)
      window.removeEventListener(
        'resize',
        resizeMap
      )
    }
  }, [map])

  return null
}

/* =========================================================
   MAP CLICK
========================================================= */

function MapClickHandler({
  onSelect,
}: {
  onSelect: (
    latitude: number,
    longitude: number
  ) => void
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

/* =========================================================
   DRAGGABLE MARKER
========================================================= */

function DraggableMarker({
  position,
  onMove,
}: {
  position: [number, number]
  onMove: (
    latitude: number,
    longitude: number
  ) => void
}) {
  const [draggable] = useState(true)

  return (
    <Marker
      position={position}
      icon={markerIcon}
      draggable={draggable}
      eventHandlers={{
        dragend(event) {
          const marker =
            event.target as L.Marker

          const latLng =
            marker.getLatLng()

          onMove(
            latLng.lat,
            latLng.lng
          )
        },
      }}
    />
  )
}

/* =========================================================
   CURRENT LOCATION BUTTON
========================================================= */

function CurrentLocationButton({
  onLocation,
  loading,
  setLoading,
  setError,
}: {
  onLocation: (
    latitude: number,
    longitude: number
  ) => void
  loading: boolean
  setLoading: (
    value: boolean
  ) => void
  setError: (
    value: string
  ) => void
}) {
  const map = useMap()

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError(
        'Location is not supported on this device.'
      )
      return
    }

    setLoading(true)
    setError('')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude =
          position.coords.latitude

        const longitude =
          position.coords.longitude

        const newPosition:
          [number, number] = [
            latitude,
            longitude,
          ]

        map.setView(
          newPosition,
          17,
          {
            animate: true,
          }
        )

        onLocation(
          latitude,
          longitude
        )

        setLoading(false)
      },
      (error) => {
        console.error(
          'Geolocation error:',
          error
        )

        setLoading(false)

        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {
          setError(
            'Location permission was denied. Please allow location access in your browser.'
          )
        } else if (
          error.code ===
          error.TIMEOUT
        ) {
          setError(
            'Location detection timed out. Please try again.'
          )
        } else {
          setError(
            'Could not detect your location. Please try again.'
          )
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    )
  }

  return (
    <button
      type="button"
      onClick={detectLocation}
      disabled={loading}
      className="
        absolute
        right-4
        top-4
        z-[1000]
        flex
        h-11
        items-center
        gap-2
        rounded-full
        border
        border-[#17351d]/10
        bg-white
        px-4
        text-xs
        font-semibold
        text-[#17351d]
        shadow-[0_8px_25px_rgba(8,21,11,.15)]
        backdrop-blur-xl
        transition
        hover:bg-[#efffb0]
        active:scale-[0.97]
        disabled:cursor-wait
        disabled:opacity-60
      "
    >
      <LocateFixed
  size={16}
  strokeWidth={1.8}
  aria-hidden="true"
/>

      {loading
        ? 'Detecting...'
        : 'Use my location'}
    </button>
  )
}

function MapPositionController({
  position,
}: {
  position: [number, number]
}) {
  const map = useMap()

  useEffect(() => {
    map.flyTo(position, 17, {
      animate: true,
      duration: 0.8,
    })
  }, [map, position])

  return null
}

/* =========================================================
   LOCATION PICKER
========================================================= */

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
            initialLatitude as number,
            initialLongitude as number,
          ]
        : defaultPosition
    )

  const [locationLoading, setLocationLoading] =
    useState(false)

  const [locationError, setLocationError] =
    useState('')

  const [searchQuery, setSearchQuery] = useState('')
const [searchLoading, setSearchLoading] = useState(false)

type LocationSuggestion = {
  displayName: string
  latitude: number
  longitude: number
  pincode: string
}

const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
const [suggestionsLoading, setSuggestionsLoading] = useState(false)
const [showSuggestions, setShowSuggestions] = useState(false)
const searchBoxRef = useRef<HTMLDivElement>(null)

const [selectedLocation, setSelectedLocation] = useState('')
const [selectedPincode, setSelectedPincode] = useState('')

// Resolve an address label for the starting pin so the preview
// (and a Confirm without moving the pin) reflects the exact point,
// not a blank/placeholder value.
useEffect(() => {
  if (hasInitialLocation) {
    void reverseGeocode(
      initialLatitude as number,
      initialLongitude as number
    )
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [])

const reverseGeocode = async (
  latitude: number,
  longitude: number
) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Location lookup failed.')
    }

    const data = await response.json()
    const address = data.address ?? {}

    const locationText = [
      address.road,
      address.neighbourhood ||
        address.suburb ||
        address.city_district,
      address.city ||
        address.town ||
        address.village,
      address.state,
    ]
      .filter(Boolean)
      .join(', ')

    setSelectedLocation(
      locationText ||
        `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
    )

    setSelectedPincode(
      address.postcode || ''
    )
  } catch (error) {
    console.error(
      'Reverse geocoding error:',
      error
    )

    setSelectedLocation(
      `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
    )

    setSelectedPincode('')
  }
}

const searchLocation = async () => {
  const query = searchQuery.trim()

  if (!query) return

  setSearchLoading(true)
  setLocationError('')

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=${encodeURIComponent(
        query
      )}`,
      {
        headers: {
          Accept: 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(
        'Could not search for this location.'
      )
    }

    const results = await response.json()

    if (!results.length) {
      throw new Error(
        'We could not find that location.'
      )
    }

    const latitude = Number(results[0].lat)
    const longitude = Number(results[0].lon)

    setPosition([
      latitude,
      longitude,
    ])

    setSelectedLocation(
      results[0].display_name || query
    )

    setSelectedPincode(
      results[0].address?.postcode || ''
    )

    setShowSuggestions(false)
  } catch (error) {
    console.error(
      'Location search error:',
      error
    )

    setLocationError(
      error instanceof Error
        ? error.message
        : 'Could not search for this location.'
    )
  } finally {
    setSearchLoading(false)
  }
}

// Live suggestions as the user types, debounced so we don't
// fire a request on every keystroke.
useEffect(() => {
  const query = searchQuery.trim()

  if (query.length < 3) {
    setSuggestions([])
    setSuggestionsLoading(false)
    return
  }

  let cancelled = false
  setSuggestionsLoading(true)

  const timer = window.setTimeout(async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(
          query
        )}`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Suggestion lookup failed.')
      }

      const results = await response.json()

      if (cancelled) return

      setSuggestions(
        (results || []).map((result: any) => ({
          displayName: result.display_name,
          latitude: Number(result.lat),
          longitude: Number(result.lon),
          pincode: result.address?.postcode || '',
        }))
      )
      setShowSuggestions(true)
    } catch (error) {
      if (!cancelled) {
        console.error('Location suggestions error:', error)
        setSuggestions([])
      }
    } finally {
      if (!cancelled) setSuggestionsLoading(false)
    }
  }, 350)

  return () => {
    cancelled = true
    window.clearTimeout(timer)
  }
}, [searchQuery])

// Close the suggestions dropdown when clicking outside the search box.
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchBoxRef.current &&
      !searchBoxRef.current.contains(event.target as Node)
    ) {
      setShowSuggestions(false)
    }
  }

  document.addEventListener('mousedown', handleClickOutside)
  return () =>
    document.removeEventListener('mousedown', handleClickOutside)
}, [])

const chooseSuggestion = (suggestion: LocationSuggestion) => {
  setPosition([suggestion.latitude, suggestion.longitude])
  setSelectedLocation(suggestion.displayName)
  setSelectedPincode(suggestion.pincode)
  setSearchQuery(suggestion.displayName)
  setShowSuggestions(false)
  setLocationError('')
}

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        flex-col
        bg-[#f5f3e8]
        text-[#17351d]
      "
    >
      {/* =================================================
          HEADER
      ================================================= */}

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
              sm:text-3xl
            "
          >
            Select your location
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close map"
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-[#17351d]/10
            bg-white/70
            text-xl
            transition
            hover:bg-[#17351d]
            hover:text-white
            active:scale-90
          "
       >
  <X
    size={18}
    strokeWidth={1.8}
    aria-hidden="true"
  />
</button>
      </header>

      {/* =================================================
          INSTRUCTIONS
      ================================================= */}

      <div
        className="
          shrink-0
          border-b
          border-[#17351d]/10
          bg-white/70
          px-5
          py-3
          sm:px-8
        "
      >
        <p className="text-sm font-semibold">
          Choose the exact delivery point
        </p>

        <p
          className="
            mt-1
            text-xs
            leading-5
            text-[#17351d]/45
          "
        >
          Tap anywhere on the map or drag the
          pin to your exact location.
        </p>
      </div>

      {/* =================================================
          LOCATION SEARCH — sits directly under the
          instructions and above the map, in normal flow,
          so it never floats on top of the map itself.
      ================================================= */}

      <div
        ref={searchBoxRef}
        className="
          relative
          shrink-0
          border-b
          border-[#17351d]/10
          bg-white/70
          px-5
          py-3
          sm:px-8
        "
      >
        <form
          onSubmit={(event) => {
            event.preventDefault()
            void searchLocation()
          }}
          className="
            mx-auto
            flex
            max-w-[620px]
            items-center
            gap-2
            rounded-[16px]
            border
            border-[#17351d]/10
            bg-white
            p-1.5
            shadow-[0_6px_18px_rgba(8,21,11,.08)]
          "
        >
          <Search
            size={17}
            strokeWidth={1.8}
            className="ml-2 shrink-0 text-[#17351d]/45"
            aria-hidden="true"
          />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) => {
              setSearchQuery(event.target.value)
              setLocationError('')
            }}
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true)
            }}
            placeholder="Search for a location"
            className="
              min-w-0
              flex-1
              bg-transparent
              px-1
              py-2
              text-sm
              text-[#17351d]
              outline-none
              placeholder:text-[#17351d]/30
            "
          />

          <button
            type="submit"
            disabled={
              searchLoading ||
              !searchQuery.trim()
            }
            className="
              flex
              h-9
              shrink-0
              items-center
              justify-center
              rounded-[12px]
              bg-[#17351d]
              px-4
              text-xs
              font-semibold
              text-white
              transition
              hover:bg-[#244b2b]
              active:scale-[0.97]
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            {searchLoading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {/* SUGGESTIONS DROPDOWN */}

        {showSuggestions &&
          (suggestions.length > 0 || suggestionsLoading) && (
            <div
              className="
                absolute
                left-5
                right-5
                top-full
                z-[1100]
                mx-auto
                mt-1.5
                max-w-[620px]
                overflow-hidden
                rounded-[16px]
                border
                border-[#17351d]/10
                bg-white
                shadow-[0_16px_40px_rgba(8,21,11,.18)]
                sm:left-8
                sm:right-8
              "
            >
              {suggestionsLoading && suggestions.length === 0 ? (
                <p className="px-4 py-3 text-xs text-[#17351d]/45">
                  Searching...
                </p>
              ) : (
                <ul>
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={`${suggestion.latitude}-${suggestion.longitude}-${index}`}
                    >
                      <button
                        type="button"
                        onClick={() => chooseSuggestion(suggestion)}
                        className="
                          block
                          w-full
                          border-b
                          border-[#17351d]/5
                          px-4
                          py-3
                          text-left
                          text-sm
                          text-[#17351d]
                          transition
                          last:border-b-0
                          hover:bg-[#faf8ef]
                        "
                      >
                        {suggestion.displayName}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
      </div>


      {/* =================================================
          MAP — wrapped in its own relative, clipped
          container so the "Selected point" overlay is
          confined to the map area and can never drift
          over the footer's Confirm button.
      ================================================= */}

      <div className="relative min-h-0 flex-1 overflow-hidden">

  <MapContainer
    center={position}
    zoom={15}
    scrollWheelZoom={true}
    dragging={true}
    touchZoom={true}
    doubleClickZoom={true}
    zoomControl={true}
    className="h-full w-full"
    style={{
      height: '100%',
      width: '100%',
    }}
  >
    <TileLayer
      attribution="&copy; OpenStreetMap contributors"
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />

    <MapReady />
    <MapPositionController position={position} />

    <MapClickHandler
      onSelect={(latitude, longitude) => {
        setPosition([
          latitude,
          longitude,
        ])

        setLocationError('')

        void reverseGeocode(
          latitude,
          longitude
        )
      }}
    />

    <DraggableMarker
      position={position}
      onMove={(latitude, longitude) => {
        setPosition([
          latitude,
          longitude,
        ])

        setLocationError('')

        void reverseGeocode(
          latitude,
          longitude
        )
      }}
    />

    <CurrentLocationButton
      onLocation={(latitude, longitude) => {
        setPosition([
          latitude,
          longitude,
        ])

        setLocationError('')

        void reverseGeocode(
          latitude,
          longitude
        )
      }}
      loading={locationLoading}
      setLoading={setLocationLoading}
      setError={setLocationError}
    />
  </MapContainer>

  {/* SELECTED POINT — absolute within the map wrapper above,
      so "bottom-4" is relative to the map area, not the screen. */}

  <div
    className="
      pointer-events-none
      absolute
      bottom-4
      left-4
      right-4
      z-[1000]
    "
  >
    <div
      className="
        mx-auto
        max-w-[620px]
        rounded-[18px]
        border
        border-[#17351d]/10
        bg-white/95
        px-4
        py-3
        shadow-[0_12px_35px_rgba(8,21,11,.18)]
        backdrop-blur-xl
      "
    >
      <p
        className="
          text-[8px]
          font-semibold
          uppercase
          tracking-[0.18em]
          text-[#71864d]
        "
      >
        Selected point
      </p>

      {selectedLocation && (
        <p
          className="
            mt-1
            break-words
            text-xs
            font-semibold
            text-[#17351d]
          "
        >
          {selectedLocation}
        </p>
      )}

      <p
        className="
          mt-0.5
          text-[11px]
          font-medium
          text-[#17351d]/50
        "
      >
        {position[0].toFixed(6)}, {position[1].toFixed(6)}
      </p>
    </div>
  </div>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {locationError && (
        <div
          className="
            shrink-0
            border-t
            border-red-200
            bg-red-50
            px-5
            py-3
            text-center
            text-xs
            text-red-700
            sm:px-8
          "
        >
          {locationError}
        </div>
      )}

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer
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
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="
                h-12
                flex-1
                rounded-full
                border
                border-[#17351d]/15
                bg-white
                text-sm
                font-semibold
                text-[#17351d]
                transition
                hover:bg-[#faf8ef]
                active:scale-[0.98]
              "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() =>
                onConfirm(
                  position[0],
                  position[1],
                  selectedLocation,
                  selectedPincode
                )
              }
              className="
                h-12
                flex-[1.6]
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
      </footer>
    </div>
  )
}