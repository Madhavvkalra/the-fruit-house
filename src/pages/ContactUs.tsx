import { Mail, MapPin, Phone } from 'lucide-react'

export default function ContactUs() {
  return (
    <main className="min-h-screen bg-[#F8F4E8] px-5 py-16 text-[#173B2D] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#6B806F]">
            The Fruit House
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl">
            Contact Us
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#526257]">
            You may contact us using the information below.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <div className="rounded-3xl bg-white p-7 shadow-sm">
            <Phone size={22} strokeWidth={1.7} />
            <h2 className="mt-5 text-sm font-semibold">
              Telephone
            </h2>
            <a
              href="tel:9953191920"
              className="mt-2 block text-sm text-[#526257] hover:text-[#173B2D]"
            >
              9953191920
            </a>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-sm">
            <Mail size={22} strokeWidth={1.7} />
            <h2 className="mt-5 text-sm font-semibold">
              Email
            </h2>
            <a
              href="mailto:madhavkalra5074@gmail.com"
              className="mt-2 block break-all text-sm text-[#526257] hover:text-[#173B2D]"
            >
              madhavkalra5074@gmail.com
            </a>
          </div>

          <div className="rounded-3xl bg-white p-7 shadow-sm">
            <MapPin size={22} strokeWidth={1.7} />
            <h2 className="mt-5 text-sm font-semibold">
              Registered & Operational Address
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#526257]">
              C-77, The Fruit House,
              <br />
              Azadpur Mandi, Delhi,
              <br />
              Delhi, PIN: 110089
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-7 shadow-sm sm:p-9">
          <h2 className="text-lg font-semibold">
            Merchant Legal Entity
          </h2>

          <p className="mt-3 text-sm leading-7 text-[#526257]">
            The Fruit House
          </p>
        </div>

        <p className="mt-10 text-xs text-[#718076]">
          Last updated on 03-09-2026
        </p>
      </div>
    </main>
  )
}
