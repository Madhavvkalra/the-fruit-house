import { useState } from 'react'

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

  const [saveError, setSaveError] = useState('')

const [saving, setSaving] = useState(false)

const requestId =
  new URLSearchParams(
    window.location.search
  ).get('requestId')

  const isComplete =
    name.trim().length > 1 &&
    location.trim().length > 1 &&
    addressLine1.trim().length > 4 &&
    pinCode.replace(/\D/g, '').length === 6

const handleSave = async () => {
  if (!isComplete || saving) return

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
          latitude: null,
          longitude: null,
        }),
      }
    )

    const text =
      await response.text()

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

  {saveError && (
  <p className="mt-3 text-center text-xs text-red-700">
    {saveError}
  </p>
)}
            </button>

          </section>

          <p className="mt-5 text-center text-[9px] uppercase tracking-[0.16em] text-[#17351d]/25">
            The Fruit House · Freshness delivered
          </p>

        </div>
      </div>
    </main>
  )
}