import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-[#173B2D]/10 bg-[#F8F4E8] text-[#173B2D]">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 lg:px-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl">
              The Fruit House
            </h2>

            <p className="mt-4 max-w-md text-sm leading-7 text-[#526257]">
              Carefully selected fruits, brought together with a
              little more thought, freshness and care.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em]">
              Explore
            </h3>

            <div className="mt-5 flex flex-col gap-3 text-sm">
              <Link
                to="/"
                className="text-[#526257] transition-colors hover:text-[#173B2D]"
              >
                Shop
              </Link>

              <Link
                to="/fruit-sense"
                className="text-[#526257] transition-colors hover:text-[#173B2D]"
              >
                Fruit Sense
              </Link>

              <Link
                to="/our-story"
                className="text-[#526257] transition-colors hover:text-[#173B2D]"
              >
                Our Story
              </Link>

              <Link
                to="/contact"
                className="text-[#526257] transition-colors hover:text-[#173B2D]"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em]">
              Legal
            </h3>

            <div className="mt-5 flex flex-col gap-3 text-sm">
              <Link
                to="/terms-and-conditions"
                className="text-[#526257] transition-colors hover:text-[#173B2D]"
              >
                Terms & Conditions
              </Link>

              <Link
                to="/refund-and-cancellation"
                className="text-[#526257] transition-colors hover:text-[#173B2D]"
              >
                Cancellation & Refund
              </Link>

              <Link
                to="/contact"
                className="text-[#526257] transition-colors hover:text-[#173B2D]"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[#173B2D]/10 pt-6">
          <div className="flex flex-col gap-2 text-xs text-[#718076] sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} The Fruit House. All rights reserved.
            </p>

            <p>
              Freshness, thoughtfully delivered.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}