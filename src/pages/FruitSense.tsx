import { ArrowUpRight, Sparkles } from 'lucide-react'
import { useState } from 'react'

type Recommendation = {
  productId: string
  fruit: string
  origin: string
  quantity: string
  reason: string
}

type FruitSenseResponse = {
  success: boolean
  recommendations?: Recommendation[]
  summary?: string
  error?: string
}

export default function FruitSense() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<FruitSenseResponse | null>(null)

  const askFruitSense = async () => {
    const trimmed = message.trim()

    if (!trimmed || loading) return

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/fruit-sense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmed,
        }),
      })

      const data: FruitSenseResponse = await response.json()

      setResult(data)
    } catch (error) {
      console.error('Fruit Sense request failed:', error)

      setResult({
        success: false,
        error: 'Fruit Sense could not connect right now. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    askFruitSense()
  }

  return (
    <main className="min-h-screen bg-[#08150b] text-white">
      {/* NAVIGATION */}

      <nav className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-5 py-5 md:px-10 md:py-7">
        <button
          type="button"
          onClick={() => {
            window.location.href = '/'
          }}
          className="flex items-center gap-3"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 text-lg">
            ✦
          </span>

          <span className="font-playfair text-xl italic sm:text-2xl">
            The Fruit House
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            window.location.href = '/'
          }}
          className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-xs font-medium backdrop-blur-xl transition hover:bg-white hover:text-[#17351d]"
        >
          Shop Fruits
          <ArrowUpRight size={14} />
        </button>
      </nav>

      {/* HERO */}

      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 pb-20 pt-32">
        {/* Ambient background */}

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[15%] top-[20%] h-[300px] w-[300px] rounded-full bg-[#efffb0]/[0.035] blur-[100px]" />

          <div className="absolute bottom-[10%] right-[10%] h-[350px] w-[350px] rounded-full bg-[#557c4b]/[0.12] blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-5xl">
          {/* LABEL */}

          <div className="flex justify-center">
            <div className="flex items-center gap-2 rounded-full border border-[#efffb0]/20 bg-[#efffb0]/[0.06] px-4 py-2">
              <Sparkles size={13} className="text-[#efffb0]" />

              <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#efffb0]">
                Fruit Sense AI
              </span>
            </div>
          </div>

          {/* TITLE */}

          <div className="mx-auto mt-8 max-w-4xl text-center">
            <h1 className="font-playfair text-[52px] leading-[0.9] italic sm:text-7xl md:text-[92px]">
              Tell us what
              <br />
              you're craving.
            </h1>

            <p className="mx-auto mt-7 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
              Describe what you're looking for and Fruit Sense AI will find
              the fruits from The Fruit House catalogue that fit you best.
            </p>
          </div>

          {/* INPUT */}

          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-12 max-w-3xl"
          >
            <div className="rounded-[28px] border border-white/15 bg-white/[0.06] p-2 shadow-2xl backdrop-blur-2xl">
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="e.g. I want something refreshing and naturally sweet"
                  maxLength={1000}
                  className="min-h-[58px] flex-1 rounded-[21px] bg-transparent px-5 text-sm text-white outline-none placeholder:text-white/30"
                />

                <button
                  type="submit"
                  disabled={!message.trim() || loading}
                  className="flex min-h-[58px] items-center justify-center gap-2 rounded-[21px] bg-[#efffb0] px-7 text-sm font-semibold text-[#17351d] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading ? 'Finding...' : 'Ask Fruit Sense'}

                  {!loading && <ArrowUpRight size={16} />}
                </button>
              </div>
            </div>

            <p className="mt-3 text-center text-[8px] uppercase tracking-[0.2em] text-white/25">
              Recommendations are based only on The Fruit House catalogue
            </p>
          </form>

          {/* RESULTS */}

          {result && (
            <section className="mx-auto mt-14 max-w-4xl">
              {result.success && result.recommendations?.length ? (
                <>
                  <div className="mb-7 text-center">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#efffb0]/70">
                      Fruit Sense Selection
                    </p>

                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/60">
                      {result.summary}
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {result.recommendations.map((recommendation) => (
                      <div
                        key={recommendation.productId}
                        className="group rounded-[24px] border border-white/10 bg-white/[0.055] p-5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.08]"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[#efffb0]/60">
                              Recommended
                            </p>

                            <h2 className="font-playfair mt-2 text-[27px] italic">
                              {recommendation.fruit}
                            </h2>
                          </div>

                          <span className="rounded-full border border-white/10 px-2.5 py-1 text-[8px] text-white/40">
                            {recommendation.origin}
                          </span>
                        </div>

                        <div className="my-5 h-px bg-white/10" />

                        <p className="text-xs leading-6 text-white/55">
                          {recommendation.reason}
                        </p>

                        <button
                          type="button"
                          onClick={() => {
                            window.location.href = `/fruit/${recommendation.productId}`
                          }}
                          className="mt-6 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#efffb0]"
                        >
                          View fruit
                          <ArrowUpRight size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-6 text-center">
                  <p className="text-sm text-white/60">
                    {result.error ||
                      'Fruit Sense could not find a suitable recommendation.'}
                  </p>
                </div>
              )}
            </section>
          )}
        </div>
      </section>
    </main>
  )
}