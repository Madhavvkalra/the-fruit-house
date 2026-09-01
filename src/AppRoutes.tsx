import { Navigate, useMatch, useSearchParams } from 'react-router-dom'

import App from './App'
import FruitSense from './pages/FruitSense'
import RecipientLocation from './pages/RecipientLocation'
import type { StudioMode } from './pages/HamperStudio'

export default function AppRoutes() {
  const [searchParams] = useSearchParams()

  const productMatch = useMatch('/fruit/:productId')
  const isHome = Boolean(useMatch('/'))
  const isRecipientPath = Boolean(useMatch('/recipient-location'))
  const isHamperStudio = Boolean(useMatch('/hamper-studio'))
  const isFruitSense = Boolean(useMatch('/fruit-sense'))

  const isLegacyRecipientLink =
    searchParams.get('recipientLocation') === 'true'

  if (isLegacyRecipientLink || isRecipientPath) {
    return <RecipientLocation />
  }

  if (isFruitSense) {
    return <FruitSense />
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