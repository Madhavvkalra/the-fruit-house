import { Navigate, useMatch, useSearchParams } from 'react-router-dom'

import App from './App'
import RecipientLocation from './pages/RecipientLocation'

export default function AppRoutes() {
  const [searchParams] = useSearchParams()

  // App is rendered as one stable element instead of through <Routes>, so that
  // moving between "/" and "/fruit/:productId" never remounts it and the
  // basket survives opening a product.
  const productMatch = useMatch('/fruit/:productId')
  const isHome = Boolean(useMatch('/'))
  const isRecipientPath = Boolean(useMatch('/recipient-location'))

  // Recipient links are generated server-side in api/create-location-request.ts
  // as `/?recipientLocation=true&requestId=...`. Links already sent to
  // recipients use that exact shape, so it stays supported permanently and
  // takes priority over path matching.
  const isLegacyRecipientLink =
    searchParams.get('recipientLocation') === 'true'

  if (isLegacyRecipientLink || isRecipientPath) {
    return <RecipientLocation />
  }

  if (!isHome && !productMatch) {
    return <Navigate to="/" replace />
  }

  return (
    <App
      routeProductId={productMatch?.params.productId ?? null}
    />
  )
}
