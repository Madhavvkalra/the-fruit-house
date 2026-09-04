import { useEffect } from 'react'
import {
  Navigate,
  useLocation,
  useMatch,
  useSearchParams,
} from 'react-router-dom'

import App from './App'
import FruitSense from './pages/FruitSense'
import RecipientLocation from './pages/RecipientLocation'
import type { StudioMode } from './pages/HamperStudio'

import ContactUs from './pages/ContactUs'
import TermsAndConditions from './pages/TermsAndConditions'
import RefundAndCancellation from './pages/RefundAndCancellation'

export default function AppRoutes() {

    const location = useLocation()

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant',
    })
  }, [location.pathname, location.search])

  const [searchParams] = useSearchParams()

  const productMatch = useMatch('/fruit/:productId')
  const isHome = Boolean(useMatch('/'))
  const isRecipientPath = Boolean(useMatch('/recipient-location'))
  const isHamperStudio = Boolean(useMatch('/hamper-studio'))
  const isFruitSense = Boolean(useMatch('/fruit-sense'))

 const isContactUs = Boolean(useMatch('/contact'))
const isTermsAndConditions = Boolean(
  useMatch('/terms-and-conditions')
)
const isRefundAndCancellation = Boolean(
  useMatch('/refund-and-cancellation')
)

  const isLegacyRecipientLink =
    searchParams.get('recipientLocation') === 'true'

  if (isLegacyRecipientLink || isRecipientPath) {
    return <RecipientLocation />
  }

  if (isFruitSense) {
    return <FruitSense />
  }

  if (isContactUs) {
  return <ContactUs />
}

if (isTermsAndConditions) {
  return <TermsAndConditions />
}

if (isRefundAndCancellation) {
  return <RefundAndCancellation />
}

  if (!isHome && !productMatch && !isHamperStudio) {
    return <Navigate to="/" replace />
  }

  const requestedMode = searchParams.get('mode')

  const hamperMode: StudioMode | null = !isHamperStudio
    ? null
    : requestedMode === 'curated' || requestedMode === 'build'
      ? requestedMode
      : 'landing'

  return (
    <App
      routeProductId={productMatch?.params.productId ?? null}
      hamperMode={hamperMode}
    />
  )
}