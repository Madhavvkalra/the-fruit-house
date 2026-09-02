import {
  ArrowLeft,
  ArrowUp,
  ChevronRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { products } from '../data/products'

type Recommendation = {
  productId: string
  reason: string
}

type FruitSenseResponse = {
  success?: boolean
  recommendations?: Recommendation[]
  summary?: string
  source?: 'ai' | 'fallback'
  error?: string
}

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  recommendations?: Recommendation[]
  source?: 'ai' | 'fallback'
}


const initialPrompts = [
  'I’m craving something sweet',
  'I want something refreshing',
  'Recommend something for my mood',
  'Surprise me with something special',
]

const followUpPrompts = [
  'Something a little more indulgent',
  'Not grapes this time',
  'Let’s go more refreshing',
  'Pick something unexpected',
]

const originFlags: Record<string, string> = {
  'New Zealand': '🇳🇿',
  Kenya: '🇰🇪',
  USA: '🇺🇸',
  'United States': '🇺🇸',
  China: '🇨🇳',
  Chile: '🇨🇱',
  Vietnam: '🇻🇳',
  Peru: '🇵🇪',
  India: '🇮🇳',
  Australia: '🇦🇺',
  Japan: '🇯🇵',
  Mexico: '🇲🇽',
  Turkey: '🇹🇷',
  Spain: '🇪🇸',
  Italy: '🇮🇹',
  'South Africa': '🇿🇦',
  France: '🇫🇷',
  Germany: '🇩🇪',
  Egypt: '🇪🇬',
  Brazil: '🇧🇷',
  Argentina: '🇦🇷',
  Thailand: '🇹🇭',
  Philippines: '🇵🇭',
  Greece: '🇬🇷',
  Netherlands: '🇳🇱',
  Belgium: '🇧🇪',
  Morocco: '🇲🇦',
  Israel: '🇮🇱',
  'South Korea': '🇰🇷',
  Korea: '🇰🇷',
  Taiwan: '🇹🇼',

  Iran: '🇮🇷',
  Iraq: '🇮🇶',
  Tunisia: '🇹🇳',
  Pakistan: '🇵🇰',
  Afghanistan: '🇦🇫',
  Bangladesh: '🇧🇩',
  SriLanka: '🇱🇰',
  'Sri Lanka': '🇱🇰',
  Indonesia: '🇮🇩',
  Malaysia: '🇲🇾',
  Singapore: '🇸🇬',
  Cambodia: '🇰🇭',
  Laos: '🇱🇦',
  Myanmar: '🇲🇲',

  UAE: '🇦🇪',
  'United Arab Emirates': '🇦🇪',
  SaudiArabia: '🇸🇦',
  'Saudi Arabia': '🇸🇦',
  Qatar: '🇶🇦',
  Oman: '🇴🇲',
  Jordan: '🇯🇴',
  Lebanon: '🇱🇧',

  Portugal: '🇵🇹',
  Switzerland: '🇨🇭',
  Austria: '🇦🇹',
  Poland: '🇵🇱',
  Denmark: '🇩🇰',
  Sweden: '🇸🇪',
  Norway: '🇳🇴',
  Finland: '🇫🇮',
  Ireland: '🇮🇪',
  UK: '🇬🇧',
  'United Kingdom': '🇬🇧',

  Canada: '🇨🇦',
  CostaRica: '🇨🇷',
  'Costa Rica': '🇨🇷',
  Guatemala: '🇬🇹',
  Ecuador: '🇪🇨',
  Colombia: '🇨🇴',
  Uruguay: '🇺🇾',

  SouthAfrica: '🇿🇦',
  Ethiopia: '🇪🇹',
  Zimbabwe: '🇿🇼',
  Zambia: '🇿🇲',
  Tanzania: '🇹🇿',
  Uganda: '🇺🇬',

  Russia: '🇷🇺',
  Ukraine: '🇺🇦',
}

const getOriginFlag = (origin: string) => {
  return originFlags[origin.trim()] || '🌍'
}

export default function FruitSense() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)

const loadingMessages = [
  'Understanding what you’re looking for...',
  'Exploring the fruit collection...',
  'Matching flavours and preferences...',
  'Curating the best options for you...',
  'Finding something special...',
  'Almost there...',
]

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Hi, I'm Fruit Sense. Tell me what you're craving, how you're feeling, or what kind of fruit experience you're looking for.",
    },
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const productMap = useMemo(
    () =>
      new Map(
        products.map((product) => [
          product.id,
          product,
        ])
      ),
    []
  )

  const hasConversation = messages.some(
    (chatMessage) => chatMessage.role === 'user'
  )

  const currentPrompts = hasConversation
    ? followUpPrompts
    : initialPrompts
  
useEffect(() => {
  if (!loading) {
    setLoadingStep(0)
    return
  }

  const interval = setInterval(() => {
    setLoadingStep((previous) => {
      return previous < loadingMessages.length - 1
        ? previous + 1
        : 0
    })
  }, 3000)

  return () => clearInterval(interval)
}, [loading])

  /* =============================================
     AUTO SCROLL
  ============================================= */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages, loading])

  /* =============================================
     AUTO RESIZE TEXTAREA
  ============================================= */

  useEffect(() => {
    const textarea = textareaRef.current

    if (!textarea) return

    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(
      textarea.scrollHeight,
      140
    )}px`
  }, [message])

  /* =============================================
     SEND MESSAGE
  ============================================= */

  const askFruitSense = async (
    customMessage?: string
  ) => {
    const trimmed = (
      customMessage ?? message
    ).trim()

    if (!trimmed || loading) return

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: trimmed,
    }

    const conversationHistory = messages
      .filter(
        (chatMessage) =>
          chatMessage.role === 'user' ||
          chatMessage.role === 'assistant'
      )
      .slice(-8)
      .map((chatMessage) => ({
        role: chatMessage.role,
        content: chatMessage.content,
      }))

    setMessages((previous) => [
      ...previous,
      userMessage,
    ])

    setMessage('')
    setLoading(true)

    try {
      const response = await fetch(
        '/api/fruit-sense',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            message: trimmed,
            history: conversationHistory,
          }),
        }
      )

      const responseText = await response.text()

      let data: FruitSenseResponse

      try {
        data = JSON.parse(responseText)
      } catch {
        console.error(
          'Fruit Sense received a non-JSON response:',
          responseText
        )

        throw new Error(
          responseText.startsWith('<!DOCTYPE') ||
            responseText.startsWith('<html')
            ? 'Fruit Sense is temporarily unavailable. Please try again in a moment.'
            : responseText ||
                'Fruit Sense returned an unexpected response.'
        )
      }

      console.log(
        'Fruit Sense frontend response:',
        data
      )

      if (!response.ok || !data.success) {
        throw new Error(
          data?.error ||
            'Fruit Sense could not process your request.'
        )
      }

      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',

        content:
          data.summary ||
          'Here are some fruits I think you might enjoy.',

        recommendations:
          data.recommendations || [],

        source: data.source,
      }

      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ])
    } catch (error) {
      console.error(
        'Fruit Sense request failed:',
        error
      )

      const errorMessage: ChatMessage = {
        id: `${Date.now()}-error`,
        role: 'assistant',

        content:
          error instanceof Error
            ? error.message
            : 'I could not connect right now. Please try again in a moment.',
      }

      setMessages((previous) => [
        ...previous,
        errorMessage,
      ])
    } finally {
      setLoading(false)
    }
  }

  /* =============================================
     KEYBOARD
  ============================================= */

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (
      event.key === 'Enter' &&
      !event.shiftKey
    ) {
      event.preventDefault()
      askFruitSense()
    }
  }

  /* =============================================
     RESET
  ============================================= */

  const resetChat = () => {
    if (loading) return

    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content:
          "Fresh start. Tell me what you're craving and I'll help you find something beautiful.",
      },
    ])

    setMessage('')

    setTimeout(() => {
      textareaRef.current?.focus()
    }, 100)
  }

  /* =============================================
     OPEN PRODUCT
  ============================================= */

  const openProduct = (productId: string) => {
    window.location.href = `/fruit/${productId}`
  }

  return (
    <main className="relative flex h-[100dvh] overflow-hidden bg-[#08150b] text-white">

      {/* Ambient background */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[-100px] top-[8%] h-[350px] w-[350px] rounded-full bg-[#efffb0]/[0.04] blur-[120px]" />

        <div className="absolute bottom-[-120px] right-[-100px] h-[480px] w-[480px] rounded-full bg-[#557c4b]/[0.15] blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col">

        {/* HEADER */}

        <header className="flex shrink-0 items-center justify-between border-b border-white/[0.07] bg-[#08150b]/80 px-4 py-4 backdrop-blur-xl sm:px-6">

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() => {
                window.location.href = '/'
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition hover:bg-white/10 hover:text-white active:scale-95"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="flex items-center gap-3">

              <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#efffb0]/20 bg-[#efffb0]/[0.08]">
                <Sparkles
                  size={17}
                  className="text-[#efffb0]"
                />

                <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#08150b] bg-[#9edc78]" />
              </div>

              <div>
                <div className="flex items-center gap-2">

                  <h1 className="font-playfair text-lg italic sm:text-xl">
                    Fruit Sense
                  </h1>

                  <span className="rounded-full border border-[#efffb0]/15 bg-[#efffb0]/[0.06] px-2 py-0.5 text-[7px] font-semibold uppercase tracking-[0.18em] text-[#efffb0]/80">
                    AI
                  </span>
                </div>

                <p className="text-[9px] text-white/40">
                  Your personal fruit concierge
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={resetChat}
            disabled={loading}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/50 transition hover:bg-white/10 hover:text-white active:scale-95 disabled:opacity-40"
            aria-label="New conversation"
          >
            <RotateCcw size={16} />
          </button>
        </header>

        {/* CHAT */}

        <section className="flex-1 overflow-y-auto overscroll-contain">

          <div className="mx-auto w-full max-w-5xl px-4 py-6 pb-10 sm:px-6 sm:py-10">

            {/* WELCOME */}

            {messages.length <= 1 && (
              <div className="mb-10 text-center sm:mb-14">

                <div className="mb-5 flex justify-center">
                  <div className="flex items-center gap-2 rounded-full border border-[#efffb0]/15 bg-[#efffb0]/[0.05] px-4 py-2">
                    <Sparkles
                      size={12}
                      className="text-[#efffb0]"
                    />

                    <span className="text-[8px] font-semibold uppercase tracking-[0.25em] text-[#efffb0]/80">
                      Powered by The Fruit House
                    </span>
                  </div>
                </div>

                <h2 className="font-playfair text-4xl leading-[0.95] italic sm:text-6xl">
                  Tell me what
                  <br />

                  <span className="text-[#efffb0]">
                    you're craving.
                  </span>
                </h2>

                <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-white/45">
                  Sweet, refreshing, indulgent or something
                  completely unexpected — describe the feeling and
                  I'll find your perfect fruit.
                </p>
              </div>
            )}

            {/* MESSAGES */}

            <div className="space-y-8">

              {messages.map((chatMessage) => (
                <div
                  key={chatMessage.id}
                  className={
                    chatMessage.role === 'user'
                      ? 'flex justify-end'
                      : 'flex justify-start'
                  }
                >

                  {/* USER MESSAGE */}

                  {chatMessage.role === 'user' && (
                    <div className="max-w-[84%] rounded-[24px] rounded-br-md bg-[#efffb0] px-5 py-3.5 text-sm leading-6 text-[#17351d] shadow-lg sm:max-w-[65%]">
                      {chatMessage.content}
                    </div>
                  )}

                  {/* ASSISTANT MESSAGE */}

                  {chatMessage.role === 'assistant' && (
                    <div className="w-full sm:max-w-[90%]">

                      <div className="mb-2 flex items-center gap-2">

                        <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#efffb0]/15 bg-[#efffb0]/[0.06]">
                          <Sparkles
                            size={11}
                            className="text-[#efffb0]"
                          />
                        </div>

                        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#efffb0]/70">
                          Fruit Sense
                        </span>

                        {chatMessage.source ===
                          'fallback' && (
                          <span className="text-[8px] text-white/25">
                            • catalogue picks
                          </span>
                        )}
                      </div>

                      <div className="rounded-[24px] rounded-tl-md border border-white/[0.08] bg-white/[0.045] px-5 py-4 backdrop-blur-xl">
                        <p className="text-sm leading-7 text-white/75">
                          {chatMessage.content}
                        </p>
                      </div>

                      {/* RECOMMENDATION CARDS */}

                      {chatMessage.recommendations &&
                        chatMessage.recommendations.length >
                          0 && (
                          <div className="mt-4">

                            {chatMessage.recommendations
                              .length > 1 && (
                              <p className="mb-2 text-[8px] uppercase tracking-[0.18em] text-white/25 sm:hidden">
                                Swipe to explore
                              </p>
                            )}

                            <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-3 pr-4 sm:grid sm:grid-cols-2 sm:overflow-visible lg:grid-cols-3">

                              {chatMessage.recommendations.map(
                                (
                                  recommendation,
                                  index
                                ) => {
                                  const product =
                                    productMap.get(
                                      recommendation.productId
                                    )

                                  if (!product) return null

                                  const productImage =
                                    product.images?.[0] ||
                                    '/fruit-shop-placeholder.png'

                                  return (
                                    <button
                                      key={`${chatMessage.id}-${recommendation.productId}`}
                                      type="button"
                                      onClick={() =>
                                        openProduct(
                                          product.id
                                        )
                                      }
                                      className="group relative min-w-[82vw] snap-start overflow-hidden rounded-[24px] border border-white/[0.09] bg-[#102317]/90 text-left shadow-xl transition duration-300 hover:-translate-y-1 hover:border-[#efffb0]/25 hover:bg-[#142b1a] active:scale-[0.98] sm:min-w-0"
                                    >

                                      {/* IMAGE */}

                                      <div className="relative aspect-[1.25/1] overflow-hidden bg-[#0c1c10]">

                                        <img
                                          src={productImage}
                                          alt={product.name}
                                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                          onError={(
                                            event
                                          ) => {
                                            event.currentTarget.src =
                                              '/fruit-shop-placeholder.png'
                                          }}
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1c10]/80 via-transparent to-transparent" />

                                        {/* NUMBER */}

                                        <div className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-[#efffb0]/20 bg-[#08150b]/75 text-[9px] font-semibold tracking-wider text-[#efffb0] backdrop-blur-md">
                                          0{index + 1}
                                        </div>

                                        {/* ORIGIN */}

                                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-[#08150b]/65 px-2.5 py-1.5 backdrop-blur-md">

                                          <span className="text-xs">
                                            {getOriginFlag(
                                              product.origin
                                            )}
                                          </span>

                                          <span className="max-w-[130px] truncate text-[8px] font-medium uppercase tracking-[0.12em] text-white/70">
                                            {product.origin}
                                          </span>
                                        </div>
                                      </div>

                                      {/* CARD CONTENT */}

                                      <div className="p-4">

                                        <div className="flex items-start justify-between gap-3">

                                          <div className="min-w-0">

                                            <h3 className="font-playfair truncate text-xl italic text-white">
                                              {product.name}
                                            </h3>

                                            <p className="mt-1 text-[9px] uppercase tracking-[0.14em] text-white/30">
                                              {product.quantity}
                                            </p>
                                          </div>

                                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/[0.08] text-white/35 transition group-hover:border-[#efffb0]/20 group-hover:text-[#efffb0]">
                                            <ChevronRight
                                              size={15}
                                            />
                                          </div>
                                        </div>

                                        <div className="mt-4 border-t border-white/[0.07] pt-3">
                                          <p className="text-xs leading-5 text-white/50">
                                            {
                                              recommendation.reason
                                            }
                                          </p>
                                        </div>
                                      </div>
                                    </button>
                                  )
                                }
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              ))}

              {/* TYPING INDICATOR */}

              {loading && (
                <div className="flex justify-start">

                  <div className="w-full sm:max-w-[90%]">

                    <div className="mb-2 flex items-center gap-2">

                      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#efffb0]/15 bg-[#efffb0]/[0.06]">
                        <Sparkles
                          size={11}
                          className="animate-pulse text-[#efffb0]"
                        />
                      </div>

                      <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#efffb0]/70">
                        Fruit Sense
                      </span>
                    </div>

<div className="inline-flex items-center gap-3 rounded-[22px] rounded-tl-md border border-white/[0.08] bg-white/[0.045] px-5 py-4">

  {/* Bouncing dots */}
  <div className="flex gap-1.5">
    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#efffb0]" />

    <span
      className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#efffb0]"
      style={{
        animationDelay: '150ms',
      }}
    />

    <span
      className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#efffb0]"
      style={{
        animationDelay: '300ms',
      }}
    />
  </div>

  {/* Changing loading message */}
  <div className="relative h-5 overflow-hidden">
    <p
      key={loadingStep}
      className="animate-[fadeSlide_0.6s_ease-out] text-xs text-white/50"
    >
      {loadingMessages[loadingStep]}
    </p>
  </div>

</div>
                  </div>
                </div>
              )}
            </div>

            <div ref={messagesEndRef} />
          </div>
        </section>

        {/* INPUT */}

        <footer className="shrink-0 border-t border-white/[0.07] bg-[#08150b]/90 px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-2xl sm:px-5 sm:pb-5">

          <div className="mx-auto max-w-5xl">

            {!loading && (
              <div className="mb-3 flex gap-2 overflow-x-auto pb-1">

                {currentPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() =>
                      askFruitSense(prompt)
                    }
                    className="shrink-0 rounded-full border border-white/[0.09] bg-white/[0.04] px-3.5 py-2 text-[10px] text-white/55 transition hover:border-[#efffb0]/20 hover:bg-[#efffb0]/[0.06] hover:text-[#efffb0] active:scale-95"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            <div className="rounded-[24px] border border-white/[0.12] bg-white/[0.055] p-2 shadow-2xl backdrop-blur-xl">

              <div className="flex items-end gap-2">

                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Fruit Sense anything..."
                  rows={1}
                  maxLength={1000}
                  disabled={loading}
                  className="max-h-[140px] min-h-[48px] flex-1 resize-none bg-transparent px-3 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/30 disabled:opacity-50"
                />

                <button
                  type="button"
                  onClick={() =>
                    askFruitSense()
                  }
                  disabled={
                    !message.trim() || loading
                  }
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[17px] bg-[#efffb0] text-[#17351d] transition hover:bg-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-35"
                  aria-label="Send message"
                >
                  <ArrowUp size={19} />
                </button>
              </div>
            </div>

            <p className="mt-2 text-center text-[7px] uppercase tracking-[0.2em] text-white/20">
              Fruit Sense recommends exclusively from The Fruit House catalogue
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}