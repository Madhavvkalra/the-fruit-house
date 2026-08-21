import { useEffect, useState } from 'react'
import LocationPicker from './LocationPicker'

export type DeliveryDetails = {
  name: string
  mobile: string

  recipientType: 'self' | 'someoneElse'

  locationMethod:
    | 'map'
    | 'link'
    | 'recipientLink'
    | 'currentLocation'
    | null

  latitude: number | null
  longitude: number | null

  location: string

  addressLine1: string
  addressLine2: string
  pinCode: string
}

type CheckoutDeliveryProps = {
  email: string
  setEmail: (email: string) => void

  emailAuthenticated: boolean
  setEmailAuthenticated: (authenticated: boolean) => void

  delivery: DeliveryDetails

  updateDelivery: (
  field: keyof DeliveryDetails,
  value: DeliveryDetails[keyof DeliveryDetails]
) => void

  hasSavedAddress: boolean
  setHasSavedAddress: (value: boolean) => void

  savedAddressSelected: boolean
  setSavedAddressSelected: (value: boolean) => void

  onContinueToPayment: () => void
  onBackToOrder: () => void
}

export default function CheckoutDelivery({
  email,
  setEmail,
  emailAuthenticated,
  setEmailAuthenticated,
  delivery,
  updateDelivery,
  hasSavedAddress,
  setHasSavedAddress,
  savedAddressSelected,
  setSavedAddressSelected,
  onContinueToPayment,
  onBackToOrder,
}: CheckoutDeliveryProps) {
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState(false)

  const [locationLoading, setLocationLoading] =
    useState(false)

  const [locationError, setLocationError] =
    useState('')

  const [showLocationPicker, setShowLocationPicker] =
    useState(false)

const [locationRequestLoading, setLocationRequestLoading] =
  useState(false)

const [locationRequestUrl, setLocationRequestUrl] =
  useState(
    () =>
      localStorage.getItem(
        'fruitHouseLocationRequestUrl'
      ) || ''
  )

const [locationRequestId, setLocationRequestId] =
  useState(
    () =>
      localStorage.getItem(
        'fruitHouseLocationRequestId'
      ) || ''
  )

const [locationRequestError, setLocationRequestError] =
  useState('')

const [recipientLocationReceived, setRecipientLocationReceived] =
  useState(false)  

  const [locationLinkCopied, setLocationLinkCopied] =
  useState(false)

  const [locationChecking, setLocationChecking] =
  useState(false)

useEffect(() => {
  if (
    delivery.recipientType !== 'someoneElse' ||
    delivery.locationMethod !== 'recipientLink' ||
    !locationRequestId
  ) {
    return
  }

  let cancelled = false

  const applyRecipientLocation = (recipient: {
    name?: string
    location?: string
    addressLine1?: string
    addressLine2?: string
    pinCode?: string
    latitude?: number | null
    longitude?: number | null
  }) => {
    if (cancelled) return

    console.log(
      'RECIPIENT LOCATION RECEIVED',
      recipient
    )

    setRecipientLocationReceived(true)

    updateDelivery('name', recipient.name || '')
    updateDelivery('location', recipient.location || '')
    updateDelivery('addressLine1', recipient.addressLine1 || '')
    updateDelivery('addressLine2', recipient.addressLine2 || '')
    updateDelivery('pinCode', recipient.pinCode || '')
    updateDelivery('latitude', recipient.latitude ?? null)
    updateDelivery('longitude', recipient.longitude ?? null)

    localStorage.setItem(
      'fruitHouseRecipientLocation',
      JSON.stringify({
        requestId: locationRequestId,
        ...recipient,
      })
    )
  }

  const checkRecipientLocation = async () => {
    if (cancelled) return

    try {
      const response = await fetch(
        `/api/get-location-request?requestId=${encodeURIComponent(
          locationRequestId
        )}`,
        {
          method: 'GET',
          cache: 'no-store',
        }
      )

      if (!response.ok) {
        return
      }

      const data = await response.json()

      if (
        cancelled ||
        !data.success ||
        !data.saved ||
        !data.location
      ) {
        return
      }

      applyRecipientLocation(data.location)
    } catch (error) {
      if (!cancelled) {
        console.error(
          'Recipient location check error:',
          error
        )
      }
    }
  }

  try {
    const saved = localStorage.getItem(
      'fruitHouseRecipientLocation'
    )

    if (saved) {
      const parsed = JSON.parse(saved)

      if (
        parsed?.requestId === locationRequestId
      ) {
        applyRecipientLocation(parsed)
      }
    }
  } catch (error) {
    console.error(
      'Could not restore recipient location:',
      error
    )
  }

  // Check once when the request becomes active.
  checkRecipientLocation()

  return () => {
    cancelled = true
  }
}, [
  delivery.recipientType,
  delivery.locationMethod,
  locationRequestId,
  updateDelivery,
])

const handleCheckRecipientLocation = async () => {
  if (
    !locationRequestId ||
    locationChecking ||
    recipientLocationReceived
  ) {
    return
  }

  setLocationChecking(true)

  try {
    const response = await fetch(
      `/api/get-location-request?requestId=${encodeURIComponent(
        locationRequestId
      )}`,
      {
        method: 'GET',
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      throw new Error(
        'Could not check the recipient location.'
      )
    }

    const data = await response.json()

    if (
      !data.success ||
      !data.saved ||
      !data.location
    ) {
      return
    }

    const recipient = data.location

    console.log(
      'RECIPIENT LOCATION RECEIVED',
      recipient
    )

    setRecipientLocationReceived(true)

    updateDelivery(
      'name',
      recipient.name || ''
    )

    updateDelivery(
      'location',
      recipient.location || ''
    )

    updateDelivery(
      'addressLine1',
      recipient.addressLine1 || ''
    )

    updateDelivery(
      'addressLine2',
      recipient.addressLine2 || ''
    )

    updateDelivery(
      'pinCode',
      recipient.pinCode || ''
    )

    updateDelivery(
      'latitude',
      recipient.latitude ?? null
    )

    updateDelivery(
      'longitude',
      recipient.longitude ?? null
    )

    localStorage.setItem(
      'fruitHouseRecipientLocation',
      JSON.stringify({
        requestId: locationRequestId,
        ...recipient,
      })
    )
  } catch (error) {
    console.error(
      'Manual recipient location check error:',
      error
    )

    setLocationRequestError(
      error instanceof Error
        ? error.message
        : 'Could not check the recipient location.'
    )
  } finally {
    setLocationChecking(false)
  }
}

const createLocationRequest = async () => {
  setLocationRequestLoading(true)
  setLocationRequestError('')

  try {
    const response = await fetch(
      '/api/create-location-request',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      }
    )

    const text = await response.text()

    console.log(
      'CREATE LOCATION REQUEST',
      response.status,
      text
    )

    if (!response.ok) {
      let message =
        'Could not create location request.'

      try {
        const errorData = text
          ? JSON.parse(text)
          : null

        if (errorData?.error) {
          message = errorData.error
        }
      } catch {
        // Server did not return JSON.
      }

      throw new Error(message)
    }

    let data: {
      success?: boolean
      requestId?: string
      locationUrl?: string
      error?: string
    }

    try {
      data = text
        ? JSON.parse(text)
        : {}
    } catch {
      throw new Error(
        `Location server returned invalid response (${response.status}).`
      )
    }

    if (
      !data.locationUrl ||
      !data.requestId
    ) {
      throw new Error(
        data.error ||
          'The location link could not be created.'
      )
    }

    setLocationRequestUrl(
      data.locationUrl
    )

    setLocationRequestId(
      data.requestId
    )

localStorage.setItem(
  'fruitHouseLocationRequestId',
  data.requestId
)

localStorage.setItem(
  'fruitHouseLocationRequestUrl',
  data.locationUrl
)

    updateDelivery(
      'locationMethod',
      'recipientLink'
    )
  } catch (error) {
    console.error(
      'Create location request error:',
      error
    )

    setLocationRequestError(
      error instanceof Error
        ? error.message
        : 'Could not create a location link. Please try again.'
    )
  } finally {
    setLocationRequestLoading(false)
  }
}

const [locationLink, setLocationLink] =
  useState('')

const [locationLinkLoading, setLocationLinkLoading] =
  useState(false)

const [locationLinkError, setLocationLinkError] =
  useState('')

  const emailComplete =
    email.trim().length > 3 &&
    email.includes('@') &&
    email.includes('.')
const locationComplete =
  delivery.location.trim().length > 1

const recipientLocationComplete =
  delivery.recipientType === 'self'
    ? locationComplete
    : delivery.locationMethod === 'map'
    ? delivery.latitude !== null &&
      delivery.longitude !== null &&
      locationComplete
    : delivery.locationMethod === 'link'
    ? locationComplete &&
      delivery.latitude !== null &&
      delivery.longitude !== null
    : delivery.locationMethod === 'recipientLink'
    ? locationComplete &&
      delivery.latitude !== null &&
      delivery.longitude !== null
    : false

const deliveryComplete =
  delivery.name.trim().length > 1 &&
  delivery.mobile.replace(/\D/g, '').length === 10 &&
  delivery.addressLine1.trim().length > 4 &&
  delivery.pinCode.replace(/\D/g, '').length === 6 &&
  recipientLocationComplete

const canContinueFromDelivery =
  hasSavedAddress
    ? savedAddressSelected
    : deliveryComplete

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
        const { latitude, longitude } =
          position.coords
updateDelivery(
  'latitude',
  latitude
)

updateDelivery(
  'longitude',
  longitude
)

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
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

          updateDelivery(
            'location',
            locationText ||
              `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          )

        updateDelivery(
  'locationMethod',
  'currentLocation'
)

          if (postcode) {
            updateDelivery(
              'pinCode',
              postcode
            )
          }
        } catch {
          updateDelivery(
            'location',
            `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          )

          updateDelivery(
  'locationMethod',
  'currentLocation'
)

          setLocationError(
            'Location detected, but the area name could not be fetched.'
          )
        } finally {
          setLocationLoading(false)
        }
      },
      () => {
        setLocationLoading(false)

        setLocationError(
          'Please allow location access to detect your location.'
        )
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  }


const fetchLocationFromLink = async () => {
  const value = locationLink.trim()

  if (!value) {
    setLocationLinkError('Please paste a Google Maps link.')
    return
  }

  setLocationLinkLoading(true)
  setLocationLinkError('')

  try {
    const response = await fetch('/api/resolve-location', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: value,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data?.error ||
          'Unable to fetch this location.'
      )
    }

    if (
      typeof data.latitude !== 'number' ||
      typeof data.longitude !== 'number'
    ) {
      throw new Error(
        'The location did not contain valid coordinates.'
      )
    }

    updateDelivery(
      'latitude',
      data.latitude
    )

    updateDelivery(
      'longitude',
      data.longitude
    )

    updateDelivery(
      'locationMethod',
      'link'
    )

    updateDelivery(
      'location',
      data.location ||
        `${data.latitude.toFixed(6)}, ${data.longitude.toFixed(6)}`
    )

    if (data.pincode) {
      updateDelivery(
        'pinCode',
        data.pincode
      )
    }
  } catch (error) {
    console.error(
      'Fetch location error:',
      error
    )

    setLocationLinkError(
      error instanceof Error
        ? error.message
        : 'We could not read this Google Maps link.'
    )
  } finally {
    setLocationLinkLoading(false)
  }
}


  /*
   * ============================================================
   * STEP 2A â€” EMAIL
   * ============================================================
   */

  if (!otpSent) {
    return (
      <div className="relative w-full pb-32">
        {/* EMAIL CONTENT */}

        <div className="w-full px-4 pt-5 sm:px-8 sm:pt-8">
          <div className="mx-auto w-full max-w-[760px]">
            <section className="w-full rounded-[26px] bg-[#17351d] p-5 text-white shadow-[0_18px_60px_rgba(8,21,11,.12)] sm:p-7">
              <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#efffb0]">
                Step 2A Â· Account
              </p>

              <h3 className="mt-2 font-playfair text-3xl italic">
                Continue with email
              </h3>

              <p className="mt-3 max-w-[520px] text-sm leading-6 text-white/50">
                Enter your email address to continue.
                We'll use it to save your details and
                make future orders faster.
              </p>

              <div className="mt-6">
                <label
                  htmlFor="checkout-email"
                  className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-white/45"
                >
                  Email address
                </label>

                <input
                  id="checkout-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    setOtpError(false)
                  }}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="h-12 w-full rounded-[14px] border border-white/10 bg-white/[0.07] px-4 text-base text-white outline-none transition placeholder:text-white/25 focus:border-[#efffb0]/40 focus:bg-white/[0.10]"
                />
              </div>
            </section>
          </div>
        </div>

        {/* FIXED CTA */}

        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#17351d]/10 bg-[#f5f3e8]/95 px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:px-8">
          <div className="mx-auto w-full max-w-[760px]">
            <button
              type="button"
              disabled={!emailComplete}
              onClick={() => {
                if (!emailComplete) return

                setOtpSent(true)
                setOtp('')
                setOtpError(false)
              }}
              className={`flex h-12 w-full items-center justify-center rounded-full text-sm font-semibold shadow-[0_12px_35px_rgba(8,21,11,.20)] transition active:scale-[0.98] ${
                emailComplete
                  ? 'bg-[#17351d] text-white hover:bg-[#244b2b]'
                  : 'cursor-not-allowed bg-[#17351d]/10 text-[#17351d]/30'
              }`}
            >
              Continue with email
            </button>
          </div>
        </div>
      </div>
    )
  }

  /*
   * ============================================================
   * STEP 2B â€” OTP + DELIVERY
   * ============================================================
   */

  return (
    <>
      {/* MAP MODAL */}

      {showLocationPicker && (
        <LocationPicker
          initialLatitude={
            delivery.latitude
              ? Number(delivery.latitude)
              : null
          }
          initialLongitude={
            delivery.longitude
              ? Number(delivery.longitude)
              : null
          }
          onClose={() =>
            setShowLocationPicker(false)
          }
         onConfirm={(latitude, longitude) => {
  updateDelivery(
    'latitude',
    latitude
  )

  updateDelivery(
    'longitude',
    longitude
  )

  updateDelivery(
    'location',
    `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
  )

  updateDelivery(
    'locationMethod',
    'map'
  )

  setShowLocationPicker(false)
}}
        />
      )}

      <div className="relative w-full pb-32">
        {/* CONTENT */}

        <div className="w-full px-4 pt-5 sm:px-8 sm:pt-8">
          <div className="mx-auto w-full max-w-[760px]">
            <section className="space-y-5">

              {/* =================================================
                  OTP
              ================================================= */}

              <div className="w-full rounded-[26px] bg-[#17351d] p-5 text-white shadow-[0_18px_60px_rgba(8,21,11,.12)] sm:p-7">
                {!emailAuthenticated ? (
                  <>
                    <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#efffb0]">
                      Step 2B Â· Email verification
                    </p>

                    <h3 className="mt-2 font-playfair text-3xl italic">
                      Check your inbox
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-white/50">
                      We sent a 6-digit verification
                      code to
                    </p>

                    <p className="mt-1 truncate text-sm font-semibold text-[#efffb0]">
                      {email}
                    </p>

                    <div className="mt-6">
                      <label
                        htmlFor="checkout-otp"
                        className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-white/45"
                      >
                        Verification code
                      </label>

                      <input
                        id="checkout-otp"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        value={otp}
                        onChange={(event) => {
                          const value =
                            event.target.value.replace(
                              /\D/g,
                              ''
                            )

                          setOtp(value)
                          setOtpError(false)
                        }}
                        placeholder="123456"
                        className={`h-14 w-full rounded-[14px] border bg-white/[0.07] px-4 text-center text-xl font-semibold tracking-[0.45em] text-white outline-none transition placeholder:text-white/20 focus:bg-white/[0.10] ${
                          otpError
                            ? 'border-red-300/60'
                            : 'border-white/10 focus:border-[#efffb0]/40'
                        }`}
                      />
                    </div>

                    {otpError && (
                      <p className="mt-3 text-xs text-red-200">
                        Incorrect code. Please try again.
                      </p>
                    )}

                    <div className="mt-5 flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false)
                          setOtp('')
                          setOtpError(false)
                        }}
                        className="text-xs text-white/40 transition hover:text-white"
                      >
                        â† Change email
                      </button>

                      <span className="text-[9px] uppercase tracking-[0.14em] text-white/25">
                        Test OTP: 123456
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#efffb0] text-lg text-[#17351d]">
                      âœ“
                    </div>

                    <div className="min-w-0">
                      <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#efffb0]/65">
                        Email verified
                      </p>

                      <p className="mt-1 truncate text-sm font-semibold">
                        {email}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* =================================================
                  DELIVERY
              ================================================= */}

  <div className="w-full rounded-[26px] border border-[#17351d]/10 bg-white/60 p-5 shadow-[0_18px_60px_rgba(8,21,11,.05)] sm:p-7">

  <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#71864d]">
    Delivery details
  </p>

  <h3 className="mt-2 font-playfair text-3xl italic">
    Where should we deliver?
  </h3>

  <p className="mt-3 text-sm leading-6 text-[#17351d]/50">
    Enter your delivery details. Your address will be saved for future orders.
  </p>

  {hasSavedAddress ? (
    <div className="mt-7">

      <div className="flex items-center justify-between gap-4">
        <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[#17351d]/40">
          Saved address
        </p>

        <button
          type="button"
          onClick={() => {
            setHasSavedAddress(false)
            setSavedAddressSelected(false)
          }}
          className="text-xs font-semibold underline underline-offset-4"
        >
          Use another address
        </button>
      </div>

      <button
        type="button"
        onClick={() => setSavedAddressSelected(true)}
        className={`mt-3 w-full rounded-[20px] border p-5 text-left transition-all ${
          savedAddressSelected
            ? 'border-[#17351d] bg-[#17351d]/5 shadow-sm'
            : 'border-[#17351d]/10 bg-[#faf8ef]'
        }`}
      >
        <div className="flex items-start gap-4">

          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
              savedAddressSelected
                ? 'bg-[#17351d] text-[#efffb0]'
                : 'bg-[#efffb0] text-[#17351d]'
            }`}
          >
            {savedAddressSelected ? 'âœ“' : 'âŒ‚'}
          </div>

          <div className="min-w-0">
            <p className="font-semibold">
              Home
            </p>

            <p className="mt-1 text-sm leading-6 text-[#17351d]/55">
              Your saved delivery address
            </p>
          </div>

        </div>
      </button>

      <button
        type="button"
        onClick={() => {
          setHasSavedAddress(false)
          setSavedAddressSelected(false)
        }}
        className="mt-4 flex h-11 w-full items-center justify-center rounded-full border border-[#17351d]/15 bg-white/60 text-sm font-semibold"
      >
        + Add new address
      </button>

    </div>
  ) : (

    <div className="mt-7 space-y-5">

      {/* NAME */}

      <div>
        <label
          htmlFor="delivery-name"
          className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#17351d]/50"
        >
          Name
        </label>

        <input
          id="delivery-name"
          type="text"
          value={delivery.name}
          onChange={(event) =>
            updateDelivery('name', event.target.value)
          }
          placeholder="Your name"
          autoComplete="name"
          className="h-12 w-full rounded-[14px] border border-[#17351d]/10 bg-[#faf8ef] px-4 text-base outline-none transition placeholder:text-[#17351d]/25 focus:border-[#17351d]/30 focus:bg-white"
        />
      </div>

      {/* MOBILE */}

      <div>
        <label
          htmlFor="delivery-mobile"
          className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#17351d]/50"
        >
          Mobile number
        </label>

        <div className="flex gap-2">

          <div className="flex h-12 shrink-0 items-center rounded-[14px] border border-[#17351d]/10 bg-[#faf8ef] px-3 text-sm font-medium">
            +91
          </div>

          <input
            id="delivery-mobile"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={delivery.mobile}
            onChange={(event) =>
              updateDelivery(
                'mobile',
                event.target.value.replace(/\D/g, '')
              )
            }
            placeholder="10-digit mobile number"
            autoComplete="tel"
            className="h-12 min-w-0 flex-1 rounded-[14px] border border-[#17351d]/10 bg-[#faf8ef] px-4 text-base outline-none transition placeholder:text-[#17351d]/25 focus:border-[#17351d]/30 focus:bg-white"
          />

        </div>
      </div>

      {/* WHO IS THIS ORDER FOR? */}

      <div className="pt-1">

        <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#17351d]/50">
          Who are you ordering for?
        </p>

        <div className="grid gap-3 sm:grid-cols-2">

          {/* MYSELF */}

          <button
            type="button"
            onClick={() =>
              updateDelivery(
                'recipientType',
                'self'
              )
            }
            className={`rounded-[18px] border p-4 text-left transition-all ${
              delivery.recipientType === 'self'
                ? 'border-[#17351d] bg-[#17351d]/5 shadow-sm'
                : 'border-[#17351d]/10 bg-[#faf8ef]'
            }`}
          >
            <div className="flex items-start gap-3">

              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm ${
                  delivery.recipientType === 'self'
                    ? 'bg-[#17351d] text-[#efffb0]'
                    : 'bg-[#efffb0] text-[#17351d]'
                }`}
              >
                {delivery.recipientType === 'self'
                  ? 'âœ“'
                  : 'â€¢'}
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Myself
                </p>

                <p className="mt-1 text-xs leading-5 text-[#17351d]/45">
                  Deliver the order to me
                </p>
              </div>

            </div>
          </button>

          {/* SOMEONE ELSE */}

          <button
            type="button"
            onClick={() =>
              updateDelivery(
                'recipientType',
                'someoneElse'
              )
            }
            className={`rounded-[18px] border p-4 text-left transition-all ${
              delivery.recipientType === 'someoneElse'
                ? 'border-[#17351d] bg-[#17351d]/5 shadow-sm'
                : 'border-[#17351d]/10 bg-[#faf8ef]'
            }`}
          >
            <div className="flex items-start gap-3">

              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm ${
                  delivery.recipientType === 'someoneElse'
                    ? 'bg-[#17351d] text-[#efffb0]'
                    : 'bg-[#efffb0] text-[#17351d]'
                }`}
              >
                {delivery.recipientType === 'someoneElse'
                  ? 'âœ“'
                  : 'â€¢'}
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Someone else
                </p>

                <p className="mt-1 text-xs leading-5 text-[#17351d]/45">
                  Send this order to someone
                </p>
              </div>

            </div>
          </button>

        </div>
      </div>

      {/* SOMEONE ELSE â€” LOCATION METHOD */}

      {delivery.recipientType === 'someoneElse' && (
        <div className="space-y-3 pt-1">

          <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#17351d]/50">
            How should we get their location?
          </p>

          {/* MAP */}

          <button
            type="button"
            onClick={() => {
  alert('RECIPIENT MAP BUTTON CLICKED')
  setShowLocationPicker(true)
}}
            className={`w-full rounded-[18px] border p-4 text-left transition-all ${
              delivery.locationMethod === 'map'
                ? 'border-[#17351d] bg-[#17351d]/5 shadow-sm'
                : 'border-[#17351d]/10 bg-[#faf8ef]'
            }`}
          >
            <div className="flex items-start gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#efffb0]">
                ðŸ“
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Select on map
                </p>

                <p className="mt-1 text-xs leading-5 text-[#17351d]/45">
                  Choose their exact delivery location
                </p>
              </div>

            </div>
          </button>

          {/* PASTE LINK */}

          <button
            type="button"
            onClick={() =>
              updateDelivery(
                'locationMethod',
                'link'
              )
            }
            className={`w-full rounded-[18px] border p-4 text-left transition-all ${
              delivery.locationMethod === 'link'
                ? 'border-[#17351d] bg-[#17351d]/5 shadow-sm'
                : 'border-[#17351d]/10 bg-[#faf8ef]'
            }`}
          >
            <div className="flex items-start gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#efffb0]">
                ðŸ”—
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Paste location link
                </p>

                <p className="mt-1 text-xs leading-5 text-[#17351d]/45">
                  Paste their Google Maps location
                </p>
              </div>

            </div>
          </button>

        {delivery.locationMethod ===
  'link' && (
  <div className="space-y-3">

    <input
      type="url"
      value={locationLink}
      placeholder="Paste Google Maps link"
      onChange={(event) => {
  setLocationLink(event.target.value)
  setLocationLinkError('')
}}
      className="
        h-12
        w-full
        rounded-[14px]
        border
        border-[#17351d]/10
        bg-[#faf8ef]
        px-4
        text-base
        outline-none
        transition
        placeholder:text-[#17351d]/25
        focus:border-[#17351d]/30
        focus:bg-white
      "
    />

    <button
      type="button"
      onClick={fetchLocationFromLink}
    disabled={
  locationLinkLoading ||
  !locationLink.trim()
}
      className="
        flex
        h-12
        w-full
        items-center
        justify-center
        gap-2
        rounded-[14px]
        bg-[#17351d]
        px-4
        text-sm
        font-semibold
        text-white
        transition
        hover:bg-[#244b2b]
        active:scale-[0.98]
        disabled:cursor-not-allowed
        disabled:opacity-40
      "
    >
      {locationLinkLoading
        ? 'Fetching location...'
        : 'Fetch location'}
    </button>

    {locationLinkError && (
      <p className="text-xs text-red-700">
        {locationLinkError}
      </p>
    )}

  </div>
)}
          {/* SEND LINK */}

        <button
  type="button"
  onClick={createLocationRequest}
  disabled={locationRequestLoading}
  className={`w-full rounded-[18px] border p-4 text-left transition-all ${
    delivery.locationMethod === 'recipientLink'
      ? 'border-[#17351d] bg-[#17351d]/5 shadow-sm'
      : 'border-[#17351d]/10 bg-[#faf8ef]'
  } ${
    locationRequestLoading
      ? 'cursor-wait opacity-60'
      : ''
  }`}
>
  <div className="flex items-start gap-3">
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm ${
        delivery.locationMethod ===
        'recipientLink'
          ? 'bg-[#17351d] text-[#efffb0]'
          : 'bg-[#efffb0] text-[#17351d]'
      }`}
    >
      â†—
    </div>

    <div>
      <p className="text-sm font-semibold">
        Send them a location link
      </p>

      <p className="mt-1 text-xs leading-5 text-[#17351d]/45">
        Create a link for them to add their own location
      </p>
    </div>
  </div>
</button>

{delivery.locationMethod ===
  'recipientLink' &&
  locationRequestUrl && (
    <div className="rounded-[18px] border border-[#17351d]/10 bg-[#faf8ef] p-4">
      <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#71864d]">
        Location request created
      </p>

      <p className="mt-2 text-xs leading-5 text-[#17351d]/50">
  Send this link to the person receiving the
  order.
</p>

<button
  type="button"
  onClick={handleCheckRecipientLocation}
  disabled={
    locationChecking ||
    recipientLocationReceived
  }
  className={`
    mt-4
    flex
    h-11
    w-full
    items-center
    justify-center
    rounded-[14px]
    border
    text-sm
    font-semibold
    transition-all
    active:scale-[0.98]

    ${
      recipientLocationReceived
        ? 'border-[#17351d]/10 bg-[#efffb0] text-[#17351d]'
        : locationChecking
          ? 'cursor-wait border-[#17351d]/10 bg-[#17351d]/5 text-[#17351d]/40'
          : 'border-[#17351d]/10 bg-white text-[#17351d] hover:bg-[#17351d] hover:text-white'
    }
  `}
>
  {recipientLocationReceived
    ? '✓ Location received'
    : locationChecking
      ? 'Checking...'
      : 'Check for location'}
</button>

{recipientLocationReceived ? (
  <div className="mt-4 overflow-hidden rounded-[20px] border border-[#17351d]/10 bg-white">
    {/* SUCCESS HEADER */}
    <div className="flex items-center gap-3 bg-[#efffb0]/50 px-4 py-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#17351d] text-sm text-[#efffb0]">
        âœ“
      </div>

      <div>
        <p className="text-sm font-semibold text-[#17351d]">
          Recipient location received
        </p>

        <p className="mt-0.5 text-xs text-[#17351d]/50">
          Delivery details have been added to this order.
        </p>
      </div>
    </div>

    {/* RECIPIENT DETAILS */}
    <div className="p-4">
      <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#71864d]">
        Delivering to
      </p>

      <p className="mt-2 text-base font-semibold text-[#17351d]">
        {delivery.name}
      </p>

      <p className="mt-2 text-sm leading-6 text-[#17351d]/60">
        {delivery.addressLine1}

        {delivery.addressLine2 && (
          <>
            <br />
            {delivery.addressLine2}
          </>
        )}

        <br />
        {delivery.location}

        <br />
        {delivery.pinCode}

        {delivery.mobile && (
          <>
            <br />
            +91 {delivery.mobile}
          </>
        )}
      </p>

      {/* MAP SNAPSHOT */}
      {delivery.latitude !== null &&
        delivery.longitude !== null && (
          <div className="mt-4 overflow-hidden rounded-[18px] border border-[#17351d]/10 bg-[#faf8ef]">
            <div className="relative h-48 w-full overflow-hidden bg-[#dfe6dc] sm:h-56">
              <iframe
                title="Recipient delivery location"
                className="pointer-events-none h-full w-full border-0"
                loading="lazy"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                  Number(delivery.longitude) - 0.01
                },${
                  Number(delivery.latitude) - 0.01
                },${
                  Number(delivery.longitude) + 0.01
                },${
                  Number(delivery.latitude) + 0.01
                }&layer=mapnik&marker=${
                  delivery.latitude
                },${delivery.longitude}`}
              />

              <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#17351d] shadow-sm backdrop-blur">
                Recipient location
              </div>
            </div>

            <div className="px-4 py-3">
              <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#71864d]">
                Exact delivery point
              </p>

              <p className="mt-1 text-xs text-[#17351d]/50">
                {Number(delivery.latitude).toFixed(6)},{' '}
                {Number(delivery.longitude).toFixed(6)}
              </p>
            </div>
          </div>
        )}
    </div>
  </div>
) : (
  <div className="mt-4 flex items-center gap-3 rounded-[16px] border border-[#17351d]/10 bg-white/70 p-4">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#17351d]/10 text-sm text-[#17351d]">
      â€¦
    </div>

    <div>
      <p className="text-sm font-semibold text-[#17351d]">
        Waiting for recipient
      </p>

      <p className="mt-1 text-xs leading-5 text-[#17351d]/50">
        We'll automatically update this page when they submit
        their location.
      </p>
    </div>
  </div>
)}

<div className="mt-3 flex gap-2">
        <input
          type="text"
          readOnly
          value={locationRequestUrl}
          className="min-w-0 flex-1 rounded-[12px] border border-[#17351d]/10 bg-white px-3 text-xs outline-none"
        />

      <button
  type="button"
  onClick={async () => {
    try {
      await navigator.clipboard.writeText(
        locationRequestUrl
      )

      setLocationLinkCopied(true)

      window.setTimeout(() => {
        setLocationLinkCopied(false)
      }, 2000)
    } catch (error) {
      console.error(
        'Copy location link error:',
        error
      )
    }
  }}
  className={`shrink-0 rounded-[12px] px-4 text-xs font-semibold transition-all active:scale-[0.97] ${
    locationLinkCopied
      ? 'bg-[#efffb0] text-[#17351d]'
      : 'bg-[#17351d] text-white hover:bg-[#244b2b]'
  }`}
>
  {locationLinkCopied ? 'âœ“ Copied' : 'Copy'}
</button>
      </div>

      {locationRequestError && (
        <p className="mt-2 text-xs text-red-700">
          {locationRequestError}
        </p>
      )}
    </div>
  )}

        </div>
      )}

      {/* LOCATION */}

      <div>

        <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#17351d]/50">
          Location
        </label>

        {delivery.recipientType === 'self' ? (
          <>
            <button
              type="button"
              onClick={detectLocation}
              disabled={locationLoading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-[14px] border border-[#17351d]/15 bg-[#efffb0] px-4 text-sm font-semibold text-[#17351d] transition hover:bg-[#e6f59d] active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
            >
              <span>âŒ–</span>

              {locationLoading
                ? 'Detecting location...'
                : 'Use my location'}
            </button>

            {locationError && (
              <p className="mt-2 text-xs text-red-700">
                {locationError}
              </p>
            )}
          </>
        ) : (
          <div className="rounded-[16px] border border-[#17351d]/10 bg-[#faf8ef] px-4 py-3">

            <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#71864d]">
              Selected location
            </p>

            <p className="mt-1 break-words text-sm font-medium">
              {delivery.location ||
                'Choose one of the location options above.'}
            </p>

          </div>
        )}


      </div>

      {/* ADDRESS LINE 1 */}

      <div>

        <label
          htmlFor="delivery-address-line-1"
          className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#17351d]/50"
        >
          Address Line 1
        </label>

        <input
          id="delivery-address-line-1"
          type="text"
          value={delivery.addressLine1}
          onChange={(event) =>
            updateDelivery(
              'addressLine1',
              event.target.value
            )
          }
          placeholder="House / flat / building, street"
          autoComplete="address-line1"
          className="h-12 w-full rounded-[14px] border border-[#17351d]/10 bg-[#faf8ef] px-4 text-base outline-none transition placeholder:text-[#17351d]/25 focus:border-[#17351d]/30 focus:bg-white"
        />

      </div>

      {/* ADDRESS LINE 2 */}

      <div>

        <label
          htmlFor="delivery-address-line-2"
          className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#17351d]/50"
        >
          Address Line 2
          <span className="ml-1 normal-case tracking-normal text-[#17351d]/30">
            (optional)
          </span>
        </label>

        <input
          id="delivery-address-line-2"
          type="text"
          value={delivery.addressLine2}
          onChange={(event) =>
            updateDelivery(
              'addressLine2',
              event.target.value
            )
          }
          placeholder="Area, sector, landmark"
          autoComplete="address-line2"
          className="h-12 w-full rounded-[14px] border border-[#17351d]/10 bg-[#faf8ef] px-4 text-base outline-none transition placeholder:text-[#17351d]/25 focus:border-[#17351d]/30 focus:bg-white"
        />

      </div>

      {/* PINCODE */}

      <div>

        <label
          htmlFor="delivery-pin"
          className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#17351d]/50"
        >
          Pincode
        </label>

        <input
          id="delivery-pin"
          type="tel"
          inputMode="numeric"
          maxLength={6}
          value={delivery.pinCode}
          onChange={(event) =>
            updateDelivery(
              'pinCode',
              event.target.value.replace(/\D/g, '')
            )
          }
          placeholder="160001"
          autoComplete="postal-code"
          className="h-12 w-full rounded-[14px] border border-[#17351d]/10 bg-[#faf8ef] px-4 text-base outline-none transition placeholder:text-[#17351d]/25 focus:border-[#17351d]/30 focus:bg-white"
        />

      </div>

    </div>
  )}

</div>

              {/* BACK */}

              <button
                type="button"
                onClick={onBackToOrder}
                className="w-full py-2 text-xs text-[#17351d]/45 transition hover:text-[#17351d]"
              >
                â† Back to order
              </button>
            </section>
          </div>
        </div>

        {/* FIXED CTA */}

        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#17351d]/10 bg-[#f5f3e8]/95 px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:px-8">
          <div className="mx-auto w-full max-w-[760px]">
            {!emailAuthenticated ? (
              <button
                type="button"
                disabled={otp.length !== 6}
                onClick={() => {
                  if (otp.length !== 6) return

                  if (otp === '123456') {
                    setEmailAuthenticated(true)
                    setOtpError(false)
                  } else {
                    setOtpError(true)
                  }
                }}
                className={`flex h-12 w-full items-center justify-center rounded-full text-sm font-semibold shadow-[0_12px_35px_rgba(8,21,11,.20)] transition active:scale-[0.98] ${
                  otp.length === 6
                    ? 'bg-[#17351d] text-white hover:bg-[#244b2b]'
                    : 'cursor-not-allowed bg-[#17351d]/10 text-[#17351d]/30'
                }`}
              >
                Verify email
              </button>
            ) : (
              <button
                type="button"
                disabled={!canContinueFromDelivery}
                onClick={() => {
                  if (canContinueFromDelivery) {
                    onContinueToPayment()
                  }
                }}
                className={`flex h-12 w-full items-center justify-center rounded-full text-sm font-semibold shadow-[0_12px_35px_rgba(8,21,11,.20)] transition active:scale-[0.98] ${
                  canContinueFromDelivery
                    ? 'bg-[#17351d] text-white hover:bg-[#244b2b]'
                    : 'cursor-not-allowed bg-[#17351d]/10 text-[#17351d]/30'
                }`}
              >
                Continue to Payment
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

