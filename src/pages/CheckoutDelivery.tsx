import { useEffect, useState } from 'react'
import LocationPicker from './LocationPicker'
import { Loader2 } from 'lucide-react'

export type DeliveryDetails = {
  name: string
  mobile: string
  recipientType: 'self' | 'someoneElse'
  locationMethod:
    | 'map'
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

type RecipientLocation = {
  name?: string
  mobile?: string
  location?: string
  addressLine1?: string
  addressLine2?: string
  pinCode?: string
  latitude?: number | null
  longitude?: number | null
}

const RECIPIENT_STORAGE_KEY = 'fruitHouseRecipientLocation'
const REQUEST_ID_STORAGE_KEY = 'fruitHouseLocationRequestId'
const REQUEST_URL_STORAGE_KEY = 'fruitHouseLocationRequestUrl'

// Builds a static OpenStreetMap embed URL for a given point. Used for
// every "snapshot" preview card so previews always reflect the exact
// coordinates passed in (no stale react-leaflet state, no z-index
// surprises from Leaflet's internal panes/controls).
function buildStaticMapEmbedUrl(
  latitude: number,
  longitude: number,
  delta = 0.01
) {
  return `https://www.openstreetmap.org/export/embed.html?bbox=${
    longitude - delta
  },${latitude - delta},${longitude + delta},${
    latitude + delta
  }&layer=mapnik&marker=${latitude},${longitude}`
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
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [continuingToPayment, setContinuingToPayment] = useState(false)

  const [locationLoading, setLocationLoading] = useState(false)
  const [locationError, setLocationError] = useState('')
  const [showLocationPicker, setShowLocationPicker] = useState(false)

  const [locationRequestLoading, setLocationRequestLoading] = useState(false)
  const [locationRequestUrl, setLocationRequestUrl] = useState(
    () => localStorage.getItem(REQUEST_URL_STORAGE_KEY) || ''
  )
  const [locationRequestId, setLocationRequestId] = useState(
    () => localStorage.getItem(REQUEST_ID_STORAGE_KEY) || ''
  )
  const [locationRequestError, setLocationRequestError] = useState('')
  const [recipientLocationReceived, setRecipientLocationReceived] = useState(false)
  const [locationLinkCopied, setLocationLinkCopied] = useState(false)
  const [locationChecking, setLocationChecking] = useState(false)

  const applyRecipientLocation = (recipient: RecipientLocation, requestId = locationRequestId) => {
    setRecipientLocationReceived(true)

    updateDelivery('name', recipient.name || '')
    if (recipient.mobile !== undefined) {
      updateDelivery('mobile', recipient.mobile.replace(/\D/g, '').slice(-10))
    }
    updateDelivery('location', recipient.location || '')
    updateDelivery('addressLine1', recipient.addressLine1 || '')
    updateDelivery('addressLine2', recipient.addressLine2 || '')
    updateDelivery('pinCode', recipient.pinCode || '')
    updateDelivery('latitude', recipient.latitude ?? null)
    updateDelivery('longitude', recipient.longitude ?? null)

    localStorage.setItem(
      RECIPIENT_STORAGE_KEY,
      JSON.stringify({ requestId, ...recipient })
    )
  }

  const checkRecipientLocation = async () => {
    if (!locationRequestId || locationChecking || recipientLocationReceived) return false

    setLocationChecking(true)
    setLocationRequestError('')

    try {
      const response = await fetch(
        `/api/get-location-request?requestId=${encodeURIComponent(locationRequestId)}`,
        { method: 'GET', cache: 'no-store' }
      )

      if (!response.ok) {
        throw new Error('Could not check the recipient location.')
      }

      const data = await response.json()

      if (!data.success || !data.saved || !data.location) {
        return false
      }

      applyRecipientLocation(data.location)
      return true
    } catch (error) {
      console.error('Recipient location check error:', error)
      setLocationRequestError(
        error instanceof Error
          ? error.message
          : 'Could not check the recipient location.'
      )
      return false
    } finally {
      setLocationChecking(false)
    }
  }

  useEffect(() => {
    if (
      delivery.recipientType !== 'someoneElse' ||
      delivery.locationMethod !== 'recipientLink' ||
      !locationRequestId
    ) {
      return
    }

    let cancelled = false

    const restoreAndCheck = async () => {
      try {
        const saved = localStorage.getItem(RECIPIENT_STORAGE_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          if (parsed?.requestId === locationRequestId && !cancelled) {
            applyRecipientLocation(parsed)
            return
          }
        }
      } catch (error) {
        console.error('Could not restore recipient location:', error)
      }

      if (!cancelled) {
        await checkRecipientLocation()
      }
    }

    restoreAndCheck()

    // Poll while this checkout step is open so the sender does not have to
    // manually refresh after the recipient submits their location.
    const intervalId = window.setInterval(() => {
      if (!cancelled && !recipientLocationReceived) {
        void checkRecipientLocation()
      }
    }, 5000)

    return () => {
      cancelled = true
      window.clearInterval(intervalId)
    }
  }, [
    delivery.recipientType,
    delivery.locationMethod,
    locationRequestId,
    recipientLocationReceived,
  ])

  const createLocationRequest = async () => {
    setLocationRequestLoading(true)
    setLocationRequestError('')

    try {
      const response = await fetch('/api/create-location-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      const text = await response.text()
      let data: {
        success?: boolean
        requestId?: string
        locationUrl?: string
        error?: string
      } = {}

      try {
        data = text ? JSON.parse(text) : {}
      } catch {
        throw new Error(
          `Location server returned invalid response (${response.status}).`
        )
      }

      if (!response.ok) {
        throw new Error(data.error || 'Could not create location request.')
      }

      if (!data.locationUrl || !data.requestId) {
        throw new Error(data.error || 'The location link could not be created.')
      }

      setLocationRequestUrl(data.locationUrl)
      setLocationRequestId(data.requestId)
      setRecipientLocationReceived(false)

      localStorage.setItem(REQUEST_ID_STORAGE_KEY, data.requestId)
      localStorage.setItem(REQUEST_URL_STORAGE_KEY, data.locationUrl)

      updateDelivery('locationMethod', 'recipientLink')
    } catch (error) {
      console.error('Create location request error:', error)
      setLocationRequestError(
        error instanceof Error
          ? error.message
          : 'Could not create a location link. Please try again.'
      )
    } finally {
      setLocationRequestLoading(false)
    }
  }

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Location is not supported on this device.')
      return
    }

    setLocationLoading(true)
    setLocationError('')

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords

        updateDelivery('latitude', latitude)
        updateDelivery('longitude', longitude)
        updateDelivery('locationMethod', 'currentLocation')

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`
          )

          if (!response.ok) throw new Error('Location lookup failed')

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
          const locationText = [city, state].filter(Boolean).join(', ')

          updateDelivery(
            'location',
            locationText || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          )

          if (postcode) updateDelivery('pinCode', postcode)
        } catch {
          updateDelivery(
            'location',
            `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
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
        setLocationError('Please allow location access to detect your location.')
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  const emailComplete =
    email.trim().length > 3 && email.includes('@') && email.includes('.')

  const locationComplete = delivery.location.trim().length > 1

  const recipientLocationComplete =
    delivery.recipientType === 'self'
      ? locationComplete &&
        delivery.latitude !== null &&
        delivery.longitude !== null
      : delivery.locationMethod === 'map' ||
          delivery.locationMethod === 'recipientLink'
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

  const canContinueFromDelivery = hasSavedAddress
    ? savedAddressSelected
    : deliveryComplete

  if (!otpSent) {
    return (
      <div className="relative w-full pb-32">
        <div className="w-full px-4 pt-5 sm:px-8 sm:pt-8">
          <div className="mx-auto w-full max-w-[760px]">
            <section className="w-full rounded-[26px] bg-[#17351d] p-5 text-white shadow-[0_18px_60px_rgba(8,21,11,.12)] sm:p-7">
              <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#efffb0]">
                Step 2A - Account
              </p>
              <h3 className="mt-2 font-playfair text-3xl italic">
                Continue with email
              </h3>
              <p className="mt-3 max-w-[520px] text-sm leading-6 text-white/50">
                Enter your email address to continue. We'll use it to save your
                details and make future orders faster.
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

return (
  <>
    {showLocationPicker && (
      <LocationPicker
        initialLatitude={
          delivery.latitude !== null
            ? Number(delivery.latitude)
            : null
        }
        initialLongitude={
          delivery.longitude !== null
            ? Number(delivery.longitude)
            : null
        }
        onClose={() => setShowLocationPicker(false)}
        onConfirm={(latitude, longitude, locationText, pincode) => {
          updateDelivery('latitude', latitude)
          updateDelivery('longitude', longitude)
          updateDelivery(
            'location',
            locationText && locationText.trim()
              ? locationText
              : `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          )
          if (pincode) {
            updateDelivery('pinCode', pincode)
          }
          updateDelivery('locationMethod', 'map')
          setShowLocationPicker(false)
        }}
      />
    )}

      <div className="relative w-full pb-32">
        <div className="w-full px-4 pt-5 sm:px-8 sm:pt-8">
          <div className="mx-auto w-full max-w-[760px]">
            <section className="space-y-5">
              <div className="w-full rounded-[26px] bg-[#17351d] p-5 text-white shadow-[0_18px_60px_rgba(8,21,11,.12)] sm:p-7">
                {!emailAuthenticated ? (
                  <>
                    <p className="text-[8px] font-semibold uppercase tracking-[0.28em] text-[#efffb0]">
                      Step 2B - Email verification
                    </p>
                    <h3 className="mt-2 font-playfair text-3xl italic">
                      Check your inbox
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-white/50">
                      We sent a 6-digit verification code to
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
                          setOtp(event.target.value.replace(/\D/g, ''))
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
                        Back
                      </button>
                      <span className="text-[9px] uppercase tracking-[0.14em] text-white/25">
                        Test OTP: 123456
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#efffb0] text-lg text-[#17351d]">
                      ✓
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
                          {savedAddressSelected ? '✓' : '⌂'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold">Home</p>
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

                    <div className="pt-1">
                      <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#17351d]/50">
                        Who are you ordering for?
                      </p>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {(['self', 'someoneElse'] as const).map((type) => {
                          const selected = delivery.recipientType === type
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => updateDelivery('recipientType', type)}
                              className={`rounded-[18px] border p-4 text-left transition-all ${
                                selected
                                  ? 'border-[#17351d] bg-[#17351d]/5 shadow-sm'
                                  : 'border-[#17351d]/10 bg-[#faf8ef]'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm ${
                                    selected
                                      ? 'bg-[#17351d] text-[#efffb0]'
                                      : 'bg-[#efffb0] text-[#17351d]'
                                  }`}
                                >
                                  {selected ? '✓' : type === 'self' ? 'Me' : '↗'}
                                </div>
                                <div>
                                  <p className="text-sm font-semibold">
                                    {type === 'self' ? 'Myself' : 'Someone else'}
                                  </p>
                                  <p className="mt-1 text-xs leading-5 text-[#17351d]/45">
                                    {type === 'self'
                                      ? 'Deliver the order to me'
                                      : 'Send this order to someone'}
                                  </p>
                                </div>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {delivery.recipientType === 'someoneElse' && (
                      <div className="space-y-3 pt-1">
                        <p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#17351d]/50">
                          How should we get their location?
                        </p>

                        <button
                          type="button"
                          onClick={() => setShowLocationPicker(true)}
                          className={`w-full rounded-[18px] border p-4 text-left transition-all ${
                            delivery.locationMethod === 'map'
                              ? 'border-[#17351d] bg-[#17351d]/5 shadow-sm'
                              : 'border-[#17351d]/10 bg-[#faf8ef]'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#efffb0] text-[#17351d]">
                              ⌖
                            </div>
                            <div>
                              <p className="text-sm font-semibold">Select on map</p>
                              <p className="mt-1 text-xs leading-5 text-[#17351d]/45">
                                Choose their exact delivery location
                              </p>
                            </div>
                          </div>
                        </button>

                        {delivery.locationMethod === 'map' &&
                          delivery.latitude !== null &&
                          delivery.longitude !== null && (
                            <div className="isolate relative z-0 overflow-hidden rounded-[18px] border border-[#17351d]/10 bg-white">
                              <div className="relative h-44 w-full overflow-hidden sm:h-52">
                                <iframe
                                  key={`${delivery.latitude}-${delivery.longitude}`}
                                  title="Selected recipient location"
                                  className="pointer-events-none h-full w-full border-0"
                                  loading="lazy"
                                  src={buildStaticMapEmbedUrl(
                                    Number(delivery.latitude),
                                    Number(delivery.longitude)
                                  )}
                                />
                                <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#17351d] shadow-sm backdrop-blur">
                                  Selected location
                                </div>
                              </div>

                              <div className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="min-w-0">
                                    <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#71864d]">
                                      Delivering to
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-[#17351d]">
                                      {delivery.location}
                                    </p>
                                    <p className="mt-1 text-xs text-[#17351d]/45">
                                      {Number(delivery.latitude).toFixed(6)},{' '}
                                      {Number(delivery.longitude).toFixed(6)}
                                    </p>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => setShowLocationPicker(true)}
                                    className="
                                      shrink-0
                                      rounded-full
                                      border
                                      border-[#17351d]/15
                                      bg-[#faf8ef]
                                      px-4
                                      py-2
                                      text-xs
                                      font-semibold
                                      text-[#17351d]
                                      transition
                                      hover:bg-[#efffb0]
                                      active:scale-[0.97]
                                    "
                                  >
                                    Change location
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}

                        <button
                          type="button"
                          onClick={createLocationRequest}
                          disabled={locationRequestLoading}
                          className={`w-full rounded-[18px] border p-4 text-left transition-all ${
                            delivery.locationMethod === 'recipientLink'
                              ? 'border-[#17351d] bg-[#17351d]/5 shadow-sm'
                              : 'border-[#17351d]/10 bg-[#faf8ef]'
                          } ${locationRequestLoading ? 'cursor-wait opacity-70' : ''}`}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm ${
                                delivery.locationMethod === 'recipientLink'
                                  ? 'bg-[#17351d] text-[#efffb0]'
                                  : 'bg-[#efffb0] text-[#17351d]'
                              }`}
                            >
                              {locationRequestLoading ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : delivery.locationMethod === 'recipientLink' ? (
                                '✓'
                              ) : (
                                '↗'
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-semibold">
                                {locationRequestLoading
                                  ? 'Creating your link...'
                                  : 'Send them a location link'}
                              </p>
                              <p className="mt-1 text-xs leading-5 text-[#17351d]/45">
                                Create a link for them to add their own location
                              </p>
                            </div>
                          </div>
                        </button>

                        {delivery.locationMethod === 'recipientLink' && locationRequestUrl && (
                          <div className="rounded-[18px] border border-[#17351d]/10 bg-[#faf8ef] p-4">
                            <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#71864d]">
                              Location request created
                            </p>
                            <p className="mt-2 text-xs leading-5 text-[#17351d]/50">
                              Send this link to the person receiving the order.
                            </p>

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
                                    await navigator.clipboard.writeText(locationRequestUrl)
                                    setLocationLinkCopied(true)
                                    window.setTimeout(
                                      () => setLocationLinkCopied(false),
                                      2000
                                    )
                                  } catch (error) {
                                    console.error('Copy location link error:', error)
                                  }
                                }}
                                className={`shrink-0 rounded-[12px] px-4 text-xs font-semibold transition-all active:scale-[0.97] ${
                                  locationLinkCopied
                                    ? 'bg-[#efffb0] text-[#17351d]'
                                    : 'bg-[#17351d] text-white hover:bg-[#244b2b]'
                                }`}
                              >
                                {locationLinkCopied ? 'Copied' : 'Copy'}
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => void checkRecipientLocation()}
                              disabled={locationChecking || recipientLocationReceived}
                              className={`mt-4 flex h-11 w-full items-center justify-center rounded-[14px] border text-sm font-semibold transition-all active:scale-[0.98] ${
                                recipientLocationReceived
                                  ? 'border-[#17351d]/10 bg-[#efffb0] text-[#17351d]'
                                  : locationChecking
                                    ? 'cursor-wait border-[#17351d]/10 bg-[#17351d]/5 text-[#17351d]/40'
                                    : 'border-[#17351d]/10 bg-white text-[#17351d] hover:bg-[#17351d] hover:text-white'
                              }`}
                            >
                              {recipientLocationReceived
                                ? 'Location received'
                                : locationChecking
                                  ? 'Checking...'
                                  : 'Check for location'}
                            </button>

                            {recipientLocationReceived ? (
                              <div className="mt-4 overflow-hidden rounded-[20px] border border-[#17351d]/10 bg-white">
                                <div className="flex items-center gap-3 bg-[#efffb0]/50 px-4 py-4">
                                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#17351d] text-sm text-[#efffb0]">
                                    ✓
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
                                        <br />+91 {delivery.mobile}
                                      </>
                                    )}
                                  </p>

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
                                            },${Number(delivery.latitude) - 0.01},${
                                              Number(delivery.longitude) + 0.01
                                            },${Number(delivery.latitude) + 0.01}&layer=mapnik&marker=${
                                              delivery.latitude
                                            },${delivery.longitude}`}
                                          />
                                          <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-[#17351d] shadow-sm backdrop-blur">
                                            Recipient location
                                          </div>
                                        </div>
                                        <div className="px-4 py-3">
                                          <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[#71864d]">
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
                                  …
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-[#17351d]">
                                    Waiting for recipient
                                  </p>
                                  <p className="mt-1 text-xs leading-5 text-[#17351d]/50">
                                    We'll automatically update this page when they submit their location.
                                  </p>
                                </div>
                              </div>
                            )}

                            {locationRequestError && (
                              <p className="mt-2 text-xs text-red-700">
                                {locationRequestError}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    <div>
                      <label className="mb-2 block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#17351d]/50">
                        Location
                      </label>
                  {delivery.recipientType === 'self' ? (
  <>
    {delivery.latitude !== null &&
    delivery.longitude !== null &&
    delivery.location ? (
      <div className="isolate relative z-0 overflow-hidden rounded-[20px] border border-[#17351d]/10 bg-white">
        {/* MAP SNAPSHOT — driven by a plain iframe embed keyed to
            the current coordinates, so it always reflects the
            exact point just selected (no stale map state) and
            never leaks a stray z-index over the fixed footer. */}

        <div className="relative h-52 w-full overflow-hidden sm:h-60">
          <iframe
            key={`${delivery.latitude}-${delivery.longitude}`}
            title="Selected delivery location"
            className="pointer-events-none h-full w-full border-0"
            loading="lazy"
            src={buildStaticMapEmbedUrl(
              Number(delivery.latitude),
              Number(delivery.longitude)
            )}
          />

          {/* Snapshot label */}

          <div
            className="
              pointer-events-none
              absolute
              left-3
              top-3
              rounded-full
              bg-white/95
              px-3
              py-1.5
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-[#17351d]
              shadow-sm
              backdrop-blur
            "
          >
            Selected delivery location
          </div>
        </div>

        {/* LOCATION DETAILS */}

        <div className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#71864d]">
                Delivering to
              </p>

              <p className="mt-1 text-sm font-semibold text-[#17351d]">
                {delivery.location}
              </p>

              <p className="mt-1 text-xs text-[#17351d]/45">
                {Number(delivery.latitude).toFixed(6)},{' '}
                {Number(delivery.longitude).toFixed(6)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowLocationPicker(true)}
              className="
                shrink-0
                rounded-full
                border
                border-[#17351d]/15
                bg-[#faf8ef]
                px-4
                py-2
                text-xs
                font-semibold
                text-[#17351d]
                transition
                hover:bg-[#efffb0]
                active:scale-[0.97]
              "
            >
              Change
            </button>
          </div>
        </div>
      </div>
    ) : (
      <div className="grid gap-3 sm:grid-cols-2">

        <button
          type="button"
          onClick={() => setShowLocationPicker(true)}
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
          Select on map
        </button>

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
          {locationLoading
            ? 'Detecting...'
            : 'Use my location'}
        </button>
      </div>
    )}

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
                            {delivery.location || 'Choose one of the location options above.'}
                          </p>
                        </div>
                      )}
                    </div>

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
                          updateDelivery('addressLine1', event.target.value)
                        }
                        placeholder="House / flat / building, street"
                        autoComplete="address-line1"
                        className="h-12 w-full rounded-[14px] border border-[#17351d]/10 bg-[#faf8ef] px-4 text-base outline-none transition placeholder:text-[#17351d]/25 focus:border-[#17351d]/30 focus:bg-white"
                      />
                    </div>

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
                          updateDelivery('addressLine2', event.target.value)
                        }
                        placeholder="Area, sector, landmark"
                        autoComplete="address-line2"
                        className="h-12 w-full rounded-[14px] border border-[#17351d]/10 bg-[#faf8ef] px-4 text-base outline-none transition placeholder:text-[#17351d]/25 focus:border-[#17351d]/30 focus:bg-white"
                      />
                    </div>

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

              <button
                type="button"
                onClick={onBackToOrder}
                className="w-full py-2 text-xs text-[#17351d]/45 transition hover:text-[#17351d]"
              >
                Back
              </button>
            </section>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#17351d]/10 bg-[#f5f3e8]/95 px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:px-8">
          <div className="mx-auto w-full max-w-[760px]">
            {!emailAuthenticated ? (
              <button
                type="button"
                disabled={otp.length !== 6 || verifyingOtp}
                onClick={() => {
                  if (otp.length !== 6 || verifyingOtp) return
                  // Immediate feedback so the tap doesn't feel unresponsive,
                  // even though the check itself is instant.
                  setVerifyingOtp(true)
                  window.requestAnimationFrame(() => {
                    if (otp === '123456') {
                      setEmailAuthenticated(true)
                      setOtpError(false)
                    } else {
                      setOtpError(true)
                    }
                    setVerifyingOtp(false)
                  })
                }}
                className={`flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold shadow-[0_12px_35px_rgba(8,21,11,.20)] transition active:scale-[0.98] ${
                  otp.length === 6
                    ? 'bg-[#17351d] text-white hover:bg-[#244b2b]'
                    : 'cursor-not-allowed bg-[#17351d]/10 text-[#17351d]/30'
                }`}
              >
                {verifyingOtp && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                {verifyingOtp ? 'Verifying...' : 'Verify email'}
              </button>
            ) : (
              <button
                type="button"
                disabled={!canContinueFromDelivery || continuingToPayment}
                onClick={() => {
                  if (!canContinueFromDelivery || continuingToPayment) return
                  // Show a spinner the instant this is tapped rather than
                  // waiting on onContinueToPayment to resolve, so the
                  // button never feels stuck or unresponsive.
                  setContinuingToPayment(true)
                  window.requestAnimationFrame(() => {
                    onContinueToPayment()
                  })
                }}
                className={`flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold shadow-[0_12px_35px_rgba(8,21,11,.20)] transition active:scale-[0.98] ${
                  canContinueFromDelivery
                    ? 'bg-[#17351d] text-white hover:bg-[#244b2b]'
                    : 'cursor-not-allowed bg-[#17351d]/10 text-[#17351d]/30'
                }`}
              >
                {continuingToPayment && (
                  <Loader2 size={16} className="animate-spin" />
                )}
                {continuingToPayment ? 'Continuing...' : 'Continue to Payment'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
