import {
  ArrowLeft,
  ArrowUp,
  Sparkles,
  RotateCcw,
} from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
} from 'react'

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

const quickPrompts = [
  'Something sweet',
  'Something refreshing',
  'I am feeling hungry',
  'Show me something premium',
]

const formatFruitName = (productId: string) => {
  return productId
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    )
}

export default function FruitSense() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

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

    textarea.style.height =
      `${Math.min(textarea.scrollHeight, 140)}px`
  }, [message])

  /* =============================================
     SEND MESSAGE
  ============================================= */

  const askFruitSense = async (
    customMessage?: string
  ) => {
    const trimmed =
      (customMessage ?? message).trim()

    if (!trimmed || loading) return

    /* Add user message */

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: trimmed,
    }

    setMessages((previous) => [
      ...previous,
      userMessage,
    ])

    setMessage('')
    setLoading(true)

    try {
      /*
       * Send current message.
       *
       * We will upgrade the backend next so it can
       * also receive conversation history.
       */

      const response = await fetch(
        '/api/fruit-sense',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            message: trimmed,
          }),
        }
      )

      const data: FruitSenseResponse =
        await response.json()

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

      /* =========================================
         CREATE NATURAL ASSISTANT RESPONSE
      ========================================= */

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
     KEYBOARD HANDLING
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
     RESET CHAT
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

  return (
    <main className="relative flex h-[100dvh] overflow-hidden bg-[#08150b] text-white">

      {/* ===========================================
         AMBIENT BACKGROUND
      ============================================ */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute left-[-100px] top-[10%] h-[350px] w-[350px] rounded-full bg-[#efffb0]/[0.035] blur-[120px]" />

        <div className="absolute bottom-[-100px] right-[-100px] h-[450px] w-[450px] rounded-full bg-[#557c4b]/[0.14] blur-[140px]" />

      </div>

      {/* ===========================================
         MAIN CHAT CONTAINER
      ============================================ */}

      <div className="relative z-10 mx-auto flex h-full w-full max-w-5xl flex-col">

        {/* =========================================
           HEADER
        ========================================= */}

        <header className="flex shrink-0 items-center justify-between border-b border-white/[0.07] bg-[#08150b]/80 px-4 py-4 backdrop-blur-xl sm:px-6">

          {/* LEFT */}

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={() => {
                window.location.href = '/'
              }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Back to The Fruit House"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="flex items-center gap-3">

              {/* AI ICON */}

              <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#efffb0]/20 bg-[#efffb0]/[0.08]">

                <Sparkles
                  size={17}
                  className="text-[#efffb0]"
                />

                <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#08150b] bg-[#9edc78]" />

              </div>

              {/* TITLE */}

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

          {/* RIGHT */}

          <button
            type="button"
            onClick={resetChat}
            disabled={loading}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/50 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
            aria-label="New conversation"
          >
            <RotateCcw size={16} />
          </button>

        </header>

        {/* =========================================
           CHAT AREA
        ========================================= */}

        <section className="flex-1 overflow-y-auto overscroll-contain">

          <div className="mx-auto w-full max-w-4xl px-4 py-6 pb-8 sm:px-6 sm:py-10">

            {/* =====================================
               INTRO LABEL
            ====================================== */}

            {messages.length <= 1 && (

              <div className="mb-10 text-center">

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
                  you're craving.

                </h2>

                <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-white/45">

                  Sweet, refreshing, premium, filling —
                  describe the feeling and I'll find the right fruits.

                </p>

              </div>

            )}

            {/* =====================================
               MESSAGES
            ====================================== */}

            <div className="space-y-7">

              {messages.map((chatMessage) => (

                <div
                  key={chatMessage.id}
                  className={
                    chatMessage.role === 'user'
                      ? 'flex justify-end'
                      : 'flex justify-start'
                  }
                >

                  {/* =================================
                     USER MESSAGE
                  ================================== */}

                  {chatMessage.role === 'user' && (

                    <div className="max-w-[82%] rounded-[24px] rounded-br-md bg-[#efffb0] px-5 py-3.5 text-sm leading-6 text-[#17351d] shadow-lg sm:max-w-[70%]">

                      {chatMessage.content}

                    </div>

                  )}

                  {/* =================================
                     ASSISTANT MESSAGE
                  ================================== */}

                  {chatMessage.role === 'assistant' && (

                    <div className="w-full max-w-[92%] sm:max-w-[85%]">

                      {/* AI IDENTITY */}

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

                      </div>

                      {/* MESSAGE */}

                      <div className="rounded-[24px] rounded-tl-md border border-white/[0.08] bg-white/[0.045] px-5 py-4 backdrop-blur-xl">

                        <p className="text-sm leading-7 text-white/75">

                          {chatMessage.content}

                        </p>

                      </div>

                      {/* =============================
                         RECOMMENDATIONS
                      ============================== */}

                      {chatMessage.recommendations &&
                        chatMessage.recommendations.length >
                          0 && (

                          <div className="mt-4 space-y-3">

                            {chatMessage.recommendations.map(
                              (
                                recommendation,
                                index
                              ) => (

                                <button
                                  key={`${chatMessage.id}-${recommendation.productId}-${index}`}
                                  type="button"
                                  onClick={() => {
                                    window.location.href =
                                      `/fruit/${recommendation.productId}`
                                  }}
                                  className="group flex w-full items-center gap-4 rounded-[22px] border border-white/[0.09] bg-white/[0.04] p-4 text-left transition active:scale-[0.99] hover:border-[#efffb0]/20 hover:bg-white/[0.07]"
                                >

                                  {/* NUMBER */}

                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#efffb0]/15 bg-[#efffb0]/[0.07] text-xs font-semibold text-[#efffb0]">

                                    0{index + 1}

                                  </div>

                                  {/* CONTENT */}

                                  <div className="min-w-0 flex-1">

                                    <h3 className="font-playfair truncate text-xl italic text-white">

                                      {formatFruitName(
                                        recommendation.productId
                                      )}

                                    </h3>

                                    <p className="mt-1 text-xs leading-5 text-white/45">

                                      {recommendation.reason}

                                    </p>

                                  </div>

                                  {/* ARROW */}

                                  <ArrowUp
                                    size={16}
                                    className="shrink-0 -rotate-45 text-white/30 transition group-hover:text-[#efffb0]"
                                  />

                                </button>

                              )
                            )}

                          </div>

                        )}

                    </div>

                  )}

                </div>

              ))}

              {/* ===================================
                 THINKING STATE
              ==================================== */}

              {loading && (

                <div className="flex justify-start">

                  <div className="w-full max-w-[85%]">

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

                      <div className="flex gap-1">

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

                      <p className="text-xs text-white/45">

                        Thinking about your perfect fruit...

                      </p>

                    </div>

                  </div>

                </div>

              )}

            </div>

            <div ref={messagesEndRef} />

          </div>

        </section>

        {/* =========================================
           INPUT AREA
        ========================================= */}

        <footer className="shrink-0 border-t border-white/[0.07] bg-[#08150b]/90 px-3 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 backdrop-blur-2xl sm:px-5 sm:pb-5">

          <div className="mx-auto max-w-4xl">

            {/* =====================================
               QUICK PROMPTS
            ====================================== */}

            {!loading && (

              <div className="mb-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">

                {quickPrompts.map((prompt) => (

                  <button
                    key={prompt}
                    type="button"
                    onClick={() =>
                      askFruitSense(prompt)
                    }
                    className="shrink-0 rounded-full border border-white/[0.09] bg-white/[0.04] px-3.5 py-2 text-[10px] text-white/55 transition hover:border-[#efffb0]/20 hover:bg-[#efffb0]/[0.06] hover:text-[#efffb0]"
                  >

                    {prompt}

                  </button>

                ))}

              </div>

            )}

            {/* =====================================
               INPUT
            ====================================== */}

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
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[17px] bg-[#efffb0] text-[#17351d] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-35"
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