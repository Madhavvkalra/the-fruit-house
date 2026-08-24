import { Navigate, useMatch, useSearchParams } from 'react-router-dom'

import App from './App'
import RecipientLocation from './pages/RecipientLocation'
import type { StudioMode } from './pages/HamperStudio'

export default function AppRoutes() {
  const [searchParams] = useSearchParams()

  // App is rendered as one stable element instead of through <Routes>, so that
  // moving between "/", "/fruit/:productId" and "/hamper-studio" never remounts
  // it and the basket survives navigation. The Hamper Studio in particular has
  // to reach App's existing cart, so it is a mode of App, not a sibling.
  const productMatch = useMatch('/fruit/:productId')
  const isHome = Boolean(useMatch('/'))
  const isRecipientPath = Boolean(useMatch('/recipient-location'))
  const isHamperStudio = Boolean(useMatch('/hamper-studio'))

  // Recipient links are generated server-side in api/create-location-request.ts
  // as `/?recipientLocation=true&requestId=...`. Links already sent to
  // recipients use that exact shape, so it stays supported permanently and
  // takes priority over path matching.
  const isLegacyRecipientLink =
    searchParams.get('recipientLocation') === 'true'

  if (isLegacyRecipientLink || isRecipientPath) {
    return <RecipientLocation />
  }

  if (!isHome && !productMatch && !isHamperStudio) {
    return <Navigate to="/" replace />
  }

  // /hamper-studio?mode=curated|build opens straight into that entry option;
  // bare /hamper-studio shows the landing choice. A null mode means this is not
  // the studio at all, so App has one prop to consult rather than two that
  // could disagree.
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
