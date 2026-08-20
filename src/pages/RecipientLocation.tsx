import { useState } from 'react'
import LocationPicker from './LocationPicker'

type RecipientLocationProps = {
  onSaved?: () => void
}

export default function RecipientLocation({
  onSaved,
}: RecipientLocationProps) {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [addressLine1, setAddressLine1] = useState('')
  const [addressLine2, setAddressLine2] = useState('')
  const [pinCode, setPinCode] = useState('')

  const [saved, setSaved] = useState(false)

  const [showLocationPicker, setShowLocationPicker] =
  useState(false)

const [locationLoading, setLocationLoading] =
  useState(false)

  const [locationError, setLocationError] = useState('')

  const [latitude, setLatitude] =
    useState<number | null>(null)
  const [longitude, setLongitude] =
    useState<number | null>(null)

  const [saveError, setSaveError] = useState('')
  const [saving, setSaving] = useState(false)

  const requestId = new URLSearchParams(
    window.location.search
  ).get('requestId')

  const isComplete =
    name.trim().length > 1 &&
    location.trim().length > 1 &&
    addressLine1.trim().length > 4 &&
    pinCode.replace(/\D/g, '').length === 6

  const reverseGeocode = async (
    selectedLatitude: number,
    selectedLongitude: number
  ) => {
    setLocation(
      `${selectedLatitude.toFixed(
        6
      )}, ${selectedLongitude.toFixed(6)}`
    )

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${selectedLatitude}&lon=${selectedLongitude}`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error('Location lookup failed')
      }

      const data = await response.json()
      const address = data.address ?? {}

      const city =
        address.city ||
        address.town ||
        address.village ||
        address.suburb ||
        address.county ||
        ''

      const state = address.state || ''
      const postcode = address.postcode || ''

      const locationText = [city, state]
        .filter(Boolean)
        .join(', ')

      if (locationText) {
        setLocation(locationText)
      }

      if (postcode) {
        setPinCode(
          postcode.replace(/\D/g, '')
        )
      }
    } catch (error) {
      console.error(
        'Reverse geocoding error:',
        error
      )

      setLocationError(
        'Location selected. Please enter the city and pincode manually.'
      )
    }
  }

const detectLocation = () => {
  if (!navigator.geolocation) {
    setLocationError(
      'Location is not supported on this device.'
    )
    return
  }

  setLocationLoading(true)
  setLocationError('')

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const {
        latitude: detectedLatitude,
        longitude: detectedLongitude,
      } = position.coords

      setLatitude(detectedLatitude)
      setLongitude(detectedLongitude)

      await reverseGeocode(
        detectedLatitude,
        detectedLongitude
      )

      setLocationLoading(false)
    },
    (error) => {
      console.error(
        'Geolocation error:',
        error
      )

      setLocationLoading(false)

      setLocationError(
        'Please allow location access to detect your location.'
      )
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    }
  )
}

const handleMapConfirm = async (
  selectedLatitude: number,
  selectedLongitude: number
) => {
  setLatitude(selectedLatitude)
  setLongitude(selectedLongitude)
  setLocationError('')

  await reverseGeocode(
    selectedLatitude,
    selectedLongitude
  )

  setShowLocationPicker(false)
}

  const handleSave = async () => {
    if (!isComplete || saving) {
      return
    }

    if (!requestId) {
      setSaveError(
        'This location link is missing its request ID.'
      )
      return
    }

    setSaving(true)
    setSaveError('')

    try {
      const response = await fetch(
        '/api/save-recipient-location',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requestId,
            name: name.trim(),
            location: location.trim(),
            addressLine1:
              addressLine1.trim(),
            addressLine2:
              addressLine2.trim(),
            pinCode:
              pinCode.replace(/\D/g, ''),
            latitude,
            longitude,
          }),
        }
      )

      const text = await response.text()

      let data: {
        success?: boolean
        location?: unknown
        error?: string
      } = {}

      try {
        data = text
          ? JSON.parse(text)
          : {}
      } catch {
        throw new Error(
          'The server returned an invalid response.'
        )
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            'Could not save the delivery location.'
        )
      }

      localStorage.setItem(
        'fruitHouseRecipientLocation',
        JSON.stringify({
          requestId,
          name: name.trim(),
          location: location.trim(),
          addressLine1:
            addressLine1.trim(),
          addressLine2:
            addressLine2.trim(),
          pinCode:
            pinCode.replace(/\D/g, ''),
          latitude,
          longitude,
        })
      )

      setSaved(true)
      onSaved?.()
    } catch (error) {
      console.error(
        'Save recipient location error:',
        error
      )

      setSaveError(
        error instanceof Error
          ? error.message
          : 'Could not save the delivery location.'
      )
    } finally {
      setSaving(false)
    }
  }

  if (saved) {
    return (
      <main className="min-h-screen bg-[#f5f3e8] text-[#17351d]">
        <div className="flex min-h-screen items-center justify-center px-5 py-10">
          <div className="w-full max-w-[560px]">
            <section className="rounded-[30px] bg-[#17351d] p-7 text-white shadow-[0_25px_80px_rgba(8,21,11,.18)] sm:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#efffb0] text-2xl text-[#17351d]">
                ✓
              </div>

              <p className="mt-7 text-[8px] font-semibold uppercase tracking-[0.28em] text-[#efffb0]">
                Location saved
              </p>

              <h1 className="mt-2 font-playfair text-4xl italic">
                You're all set
              </h1>

              <p className="mt-4 text-sm leading-6 text-white/55">
                Your delivery location has been saved.
                You can close this page now.
              </p>

              <div className="mt-7 rounded-[20px] border border-white/10 bg-white/[0.05] p-5">
                <p className="text-sm font-semibold">
                  {name}
                </p>

                <p className="mt-2 text-sm leading-6 text-white/55">
                  {addressLine1}

                  {addressLine2 && (
                    <>
                      <br />
                      {addressLine2}
                    </>
                  )}

                  <br />
                  {location}
                  <br />
                  {pinCode}
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
    )
  }

return (
   <>
   {showLocationPicker && (
  <LocationPicker
    initialLatitude={latitude}
    initialLongitude={longitude}
    onClose={() => setShowLocationPicker(false)}
    onConfirm={handleMapConfirm}
  />
)}

    <main className="min-h-screen bg-[#f5f3e8] text-[#17351d]">
      <div className="px-4 py-8 sm:px-8 sm:py-12">
        <div className="mx-auto w-full max-w-[560px]">

          {/* HEADER */}

          <div className="mb-7">
            <p className="text-[8px] font-semibold uppercase tracking-[0.3em] text-[#71864d]">
              The Fruit House
            </p>

            <h1 className="mt-2 font-playfair text-4xl italic sm:text-5xl">
              Delivery location
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#17351d]/50">
              Someone is sending you a fruit order.
              Please enter the location where you'd
              like it delivered.
            </p>
          </div>

          {/* FORM */}

          <section className="rounded-[28px] border border-[#17351d]/10 bg-white/60 p-5 shadow-[0_20px_70px_rgba(8,21,11,.06)] sm:p-7">

            {/* NAME */}

            <div>
              <label
                htmlFor="recipient-name"
                className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#17351d]/50"
              >
                Your name
              </label>

              <input
                id="recipient-name"
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Enter your name"
                autoComplete="name"
                className="h-12 w-full rounded-[14px] border border-[#17351d]/10 bg-[#faf8ef] px-4 text-base outline-none transition placeholder:text-[#17351d]/25 focus:border-[#17351d]/30 focus:bg-white"
              />
            </div>

            {/* LOCATION */}

<div className="mt-5">
  <label
    htmlFor="recipient-location"
    className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#17351d]/50"
  >
    Location / City
  </label>

  <input
    id="recipient-location"
    type="text"
    value={location}
    onChange={(event) =>
      setLocation(event.target.value)
    }
    placeholder="Chandigarh, Mohali, Panchkula..."
    className="h-12 w-full rounded-[14px] border border-[#17351d]/10 bg-[#faf8ef] px-4 text-base outline-none transition placeholder:text-[#17351d]/25 focus:border-[#17351d]/30 focus:bg-white"
  />

  {/* LOCATION ACTIONS */}

  <div className="mt-3 grid gap-3 sm:grid-cols-2">

    {/* CURRENT LOCATION */}

    <button
      type="button"
      onClick={detectLocation}
      disabled={locationLoading}
      className="
        flex
        h-12
        items-center
        justify-center
        gap-2
        rounded-[14px]
        border
        border-[#17351d]/15
        bg-[#efffb0]
        px-4
        text-sm
        font-semibold
        text-[#17351d]
        transition
        hover:bg-[#e6f59d]
        active:scale-[0.98]
        disabled:cursor-wait
        disabled:opacity-60
      "
    >
      <span className="text-base">
        ⌖
      </span>

      {locationLoading
        ? 'Detecting...'
        : 'Use my location'}
    </button>

    {/* MAP */}

    <button
      type="button"
      onClick={() =>
        setShowLocationPicker(true)
      }
      className="
        flex
        h-12
        items-center
        justify-center
        gap-2
        rounded-[14px]
        border
        border-[#17351d]/15
        bg-white
        px-4
        text-sm
        font-semibold
        text-[#17351d]
        transition
        hover:bg-[#faf8ef]
        active:scale-[0.98]
      "
    >
      <span className="text-base">
        🗺️
      </span>

      Select on map
    </button>

  </div>

{latitude !== null && longitude !== null && (
  <div className="mt-4 overflow-hidden rounded-[20px] border border-[#17351d]/10 bg-[#faf8ef] shadow-[0_10px_35px_rgba(8,21,11,.05)]">

    <div className="relative h-48 w-full overflow-hidden bg-[#dfe6dc] sm:h-56">
      <iframe
        title="Selected delivery location"
        className="pointer-events-none h-full w-full border-0"
        loading="lazy"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${
          longitude - 0.01
        },${
          latitude - 0.01
        },${
          longitude + 0.01
        },${
          latitude + 0.01
        }&layer=mapnik&marker=${
          latitude
        },${longitude}`}
      />

      <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#17351d] shadow-sm backdrop-blur">
        Selected location
      </div>
    </div>

    <div className="px-4 py-3.5">
      <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#71864d]">
        Exact delivery point
      </p>

      <p className="mt-1 text-sm font-medium text-[#17351d]">
        {location || 'Location selected'}
      </p>

      <p className="mt-1 text-[10px] text-[#17351d]/40">
        {latitude.toFixed(6)}, {longitude.toFixed(6)}
      </p>
    </div>

  </div>
)}

  {locationError && (
    <p className="mt-2 text-xs text-red-700">
      {locationError}
    </p>
  )}

  {/* SELECTED LOCATION */}

  {latitude !== null &&
    longitude !== null && (
      <div
        className="
          mt-3
          rounded-[16px]
          border
          border-[#17351d]/10
          bg-[#efffb0]/40
          px-4
          py-3
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
          Exact location selected
        </p>

        <p className="mt-1 text-sm font-medium">
          {location}
        </p>

        <p className="mt-1 text-[10px] text-[#17351d]/40">
          {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </p>

        <button
          type="button"
          onClick={() =>
            setShowLocationPicker(true)
          }
          className="
            mt-3
            text-xs
            font-semibold
            text-[#17351d]
            underline
            underline-offset-4
          "
        >
          Change location
        </button>
      </div>
    )}
</div>


            {/* ADDRESS 1 */}

            <div className="mt-5">
              <label
                htmlFor="recipient-address-1"
                className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#17351d]/50"
              >
                Address Line 1
              </label>

              <input
                id="recipient-address-1"
                type="text"
                value={addressLine1}
                onChange={(event) =>
                  setAddressLine1(event.target.value)
                }
                placeholder="House / flat / building, street"
                autoComplete="address-line1"
                className="h-12 w-full rounded-[14px] border border-[#17351d]/10 bg-[#faf8ef] px-4 text-base outline-none transition placeholder:text-[#17351d]/25 focus:border-[#17351d]/30 focus:bg-white"
              />
            </div>

            {/* ADDRESS 2 */}

            <div className="mt-5">
              <label
                htmlFor="recipient-address-2"
                className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#17351d]/50"
              >
                Address Line 2
                <span className="ml-1 normal-case tracking-normal text-[#17351d]/30">
                  (optional)
                </span>
              </label>

              <input
                id="recipient-address-2"
                type="text"
                value={addressLine2}
                onChange={(event) =>
                  setAddressLine2(event.target.value)
                }
                placeholder="Area, sector, landmark"
                autoComplete="address-line2"
                className="h-12 w-full rounded-[14px] border border-[#17351d]/10 bg-[#faf8ef] px-4 text-base outline-none transition placeholder:text-[#17351d]/25 focus:border-[#17351d]/30 focus:bg-white"
              />
            </div>

            {/* PINCODE */}

            <div className="mt-5">
              <label
                htmlFor="recipient-pincode"
                className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#17351d]/50"
              >
                Pincode
              </label>

              <input
                id="recipient-pincode"
                type="tel"
                inputMode="numeric"
                maxLength={6}
                value={pinCode}
                onChange={(event) =>
                  setPinCode(
                    event.target.value.replace(/\D/g, '')
                  )
                }
                placeholder="160001"
                autoComplete="postal-code"
                className="h-12 w-full rounded-[14px] border border-[#17351d]/10 bg-[#faf8ef] px-4 text-base outline-none transition placeholder:text-[#17351d]/25 focus:border-[#17351d]/30 focus:bg-white"
              />
            </div>

            {/* SAVE */}

            <button
              type="button"
              disabled={!isComplete || saving}
              onClick={handleSave}
              className={`mt-7 flex h-12 w-full items-center justify-center rounded-full text-sm font-semibold transition active:scale-[0.98] ${
                isComplete
                  ? 'bg-[#17351d] text-white hover:bg-[#244b2b]'
                  : 'cursor-not-allowed bg-[#17351d]/10 text-[#17351d]/30'
              }`}
            >
              {saving
                ? 'Saving location...'
                : 'Save delivery location'}
            </button>

            {saveError && (
              <p className="mt-3 text-center text-xs text-red-700">
                {saveError}
              </p>
            )}

          </section>

          <p className="mt-5 text-center text-[9px] uppercase tracking-[0.16em] text-[#17351d]/25">
            The Fruit House · Freshness delivered
          </p>

        </div>
      </div>
    </main>
  </>
)
}