import type { VercelRequest, VercelResponse } from '@vercel/node'
import { products } from '../src/data/products'

type ChatHistoryItem = {
  role: 'user' | 'assistant'
  content: string
}

type AIRecommendation = {
  productId: string
  reason: string
}

type AIResponse = {
  recommendations?: AIRecommendation[]
  summary?: string
}

/* =================================================
   HELPERS
================================================= */

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

function cleanAIResponse(content: string) {
  return content
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim()
}

/* =================================================
   SAFE CONVERSATION HISTORY

   Only allow valid user/assistant messages.
   Limit history so requests stay small and fast.
================================================= */

function sanitizeHistory(
  history: unknown
): ChatHistoryItem[] {
  if (!Array.isArray(history)) return []

  return history
    .filter((item): item is ChatHistoryItem => {
      return (
        item &&
        typeof item === 'object' &&
        (item.role === 'user' ||
          item.role === 'assistant') &&
        typeof item.content === 'string' &&
        item.content.trim().length > 0
      )
    })
    .slice(-8)
    .map((item) => ({
      role: item.role,
      content: item.content.trim().slice(0, 500),
    }))
}

/* =================================================
   LOCAL FALLBACK

   Fruit Sense still works if the AI provider fails.
================================================= */

function getFallbackRecommendations(message: string) {
  const query = message.toLowerCase()

  const hasProduct = (id: string) =>
    products.some((product) => product.id === id)

  const pick = (
    items: { productId: string; reason: string }[]
  ) =>
    items
      .filter((item) => hasProduct(item.productId))
      .slice(0, 3)

  /* HUNGRY / FILLING */

  if (
    query.includes('hungry') ||
    query.includes('hunger') ||
    query.includes('filling') ||
    query.includes('full')
  ) {
    return {
      recommendations: pick([
        {
          productId: 'avocado',
          reason: 'Creamy and satisfying for a more filling snack.',
        },
        {
          productId: 'medjoul-dates',
          reason: 'Naturally sweet and satisfying when you want something substantial.',
        },
        {
          productId: 'gala-apples',
          reason: 'Crisp and easy to enjoy as a satisfying snack.',
        },
      ]),
      summary:
        'If you want something satisfying, these are great places to start.',
    }
  }

  /* SAD / LOW */

  if (
    query.includes('sad') ||
    query.includes('low') ||
    query.includes('down') ||
    query.includes('upset') ||
    query.includes('bad mood')
  ) {
    return {
      recommendations: pick([
        {
          productId: 'shine-muscat',
          reason: 'Sweet and juicy, like a little premium treat.',
        },
        {
          productId: 'gala-apples',
          reason: 'Naturally sweet and crisp for a comforting bite.',
        },
        {
          productId: 'dragon-fruit',
          reason: 'Light, refreshing and beautifully vibrant.',
        },
        {
          productId: 'medjoul-dates',
          reason: 'Rich natural sweetness for a comforting snack.',
        },
      ]),
      summary:
        'I would go for something sweet and refreshing right now.',
    }
  }

  /* TIRED / LOW ENERGY */

  if (
    query.includes('weak') ||
    query.includes('tired') ||
    query.includes('energy') ||
    query.includes('exhausted')
  ) {
    return {
      recommendations: pick([
        {
          productId: 'medjoul-dates',
          reason: 'Naturally sweet and convenient for a quick snack.',
        },
        {
          productId: 'gala-apples',
          reason: 'Crisp, naturally sweet and easy to enjoy.',
        },
        {
          productId: 'shine-muscat',
          reason: 'Juicy and sweet when you want something refreshing.',
        },
      ]),
      summary:
        'I would keep it simple with something naturally sweet and refreshing.',
    }
  }

  /* REFRESHING */

  if (
    query.includes('refresh') ||
    query.includes('juicy') ||
    query.includes('fresh') ||
    query.includes('hydrating')
  ) {
    return {
      recommendations: pick([
        {
          productId: 'dragon-fruit',
          reason: 'Light, refreshing and subtly sweet.',
        },
        {
          productId: 'shine-muscat',
          reason: 'Exceptionally juicy with a sweet flavour.',
        },
        {
          productId: 'golden-kiwi',
          reason: 'Bright and refreshing with a distinctive flavour.',
        },
      ]),
      summary:
        'For something fresh and refreshing, I would start with these.',
    }
  }

  /* SWEET */

  if (
    query.includes('sweet') ||
    query.includes('dessert') ||
    query.includes('treat')
  ) {
    return {
      recommendations: pick([
        {
          productId: 'shine-muscat',
          reason: 'Beautifully sweet and exceptionally juicy.',
        },
        {
          productId: 'medjoul-dates',
          reason: 'Rich natural sweetness with a caramel-like flavour.',
        },
        {
          productId: 'gala-apples',
          reason: 'Naturally sweet with a crisp bite.',
        },
      ]),
      summary:
        'If you are craving something sweet, these are my top picks.',
    }
  }

  /* PREMIUM */

  if (
    query.includes('premium') ||
    query.includes('special') ||
    query.includes('luxury') ||
    query.includes('exotic')
  ) {
    return {
      recommendations: pick([
        {
          productId: 'shine-muscat',
          reason: 'A premium grape experience with exceptional sweetness.',
        },
        {
          productId: 'turkish-cherries',
          reason: 'A beautiful choice when you want something special.',
        },
        {
          productId: 'golden-kiwi',
          reason: 'Distinctive, bright and wonderfully premium.',
        },
        {
          productId: 'dragon-fruit',
          reason: 'Visually striking and beautifully unique.',
        },
      ]),
      summary:
        'For something genuinely special, these would be my premium picks.',
    }
  }

  /* DEFAULT */

  return {
    recommendations: pick([
      {
        productId: 'gala-apples',
        reason: 'A crisp and naturally sweet everyday favourite.',
      },
      {
        productId: 'shine-muscat',
        reason: 'Premium, juicy and beautifully sweet.',
      },
      {
        productId: 'dragon-fruit',
        reason: 'Light, refreshing and unique.',
      },
    ]),
    summary:
      'Tell me what you are craving, and I will help you find something perfect.',
  }
}

/* =================================================
   MAIN HANDLER
================================================= */

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    const { message, history } = req.body || {}

    /* VALIDATE MESSAGE */

    if (
      !message ||
      typeof message !== 'string' ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        error:
          'Please tell Fruit Sense what you are looking for.',
      })
    }

    const userMessage = message.trim().slice(0, 1000)

    const conversationHistory =
      sanitizeHistory(history)

const GROQ_API_KEY = process.env.GROQ_API_KEY

/* API KEY MISSING → FALLBACK */

if (!GROQ_API_KEY) {
  console.warn(
    'GROQ_API_KEY missing — using fallback'
  )

  return res.status(200).json({
    success: true,
    source: 'fallback',
    ...getFallbackRecommendations(userMessage),
  })
}

    /* BUILD CATALOGUE */

    const catalogue = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description || '',
      origin: (product as any).origin || '',
    }))

    /* SYSTEM PROMPT */

const systemPrompt = `You are Fruit Sense, the premium, playful and slightly quirky fruit concierge for The Fruit House.

Your personality:
- Warm and conversational
- Fun and slightly quirky
- Knowledgeable about fruits
- Premium and curated
- Helpful, never robotic

Your job is to help customers discover fruits from The Fruit House.

Use previous conversation messages to understand follow-up questions.

You can discuss:
- Fruit recommendations
- Taste, sweetness and texture
- Fruit varieties and origins
- Cravings and moods
- Occasions and gifting
- Premium and exotic fruits

IMPORTANT:

You must ONLY recommend fruits from the catalogue.

Always return exactly 3 different fruits.

For unrelated questions, do not seriously answer them. Respond with a short playful joke, gently redirect toward fruits, and still recommend exactly 3 relevant fruits.

Never:
- Predict the future
- Make medical diagnoses or claims
- Act as a general-purpose assistant
- Recommend products outside the catalogue
- Expose reasoning

RESPONSE RULES:

Return ONLY valid JSON.

Exactly this structure:

{
  "recommendations": [
    {
      "productId": "exact-product-id",
      "reason": "maximum 18 words"
    },
    {
      "productId": "exact-product-id",
      "reason": "maximum 18 words"
    },
    {
      "productId": "exact-product-id",
      "reason": "maximum 18 words"
    }
  ],
  "summary": "Warm, playful response under 55 words."
}

Catalogue:
${JSON.stringify(catalogue)}`

    const MAX_ATTEMPTS = 3

    let rawResponse = ''
    let lastError: unknown = null

    /* =============================================
       AI REQUEST WITH RETRIES
    ============================================= */

    for (
      let attempt = 1;
      attempt <= MAX_ATTEMPTS;
      attempt++
    ) {
      try {
        console.log(
          `Fruit Sense attempt ${attempt}/${MAX_ATTEMPTS}`
        )

const response = await fetch(
  "https://api.groq.com/openai/v1/chat/completions",
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b",

messages: [
  {
    role: "system",
    content: systemPrompt,
  },

  ...conversationHistory.map((item) => ({
    role: item.role,
    content: item.content,
  })),

  {
    role: "user",
    content: userMessage,
  },
],

      temperature: 0.7,
      max_tokens: 500,
    }),
  }
)

        const responseText = await response.text()

        let data: any

        try {
          data = JSON.parse(responseText)
        } catch {
          lastError =
            responseText ||
            'OpenRouter returned invalid JSON'

          console.error(
            'Fruit Sense provider returned non-JSON:',
            responseText
          )

          if (attempt < MAX_ATTEMPTS) {
            await sleep(attempt * 1500)
          }

          continue
        }

if (!response.ok || data?.error) {
  lastError = data?.error || data

  console.error(
    `Fruit Sense provider error on attempt ${attempt}:`,
    lastError
  )

  /* Don't repeatedly retry rate-limit errors */
  if (response.status === 429) {
    console.warn(
      'Fruit Sense rate limit reached — using fallback'
    )
    break
  }

  if (attempt < MAX_ATTEMPTS) {
    await sleep(attempt * 1500)
  }

  continue
}

        /* TRUNCATION */

const finishReason =
  data?.choices?.[0]?.finish_reason

if (finishReason === 'length') {
  console.warn(
    'Fruit Sense response truncated — retrying'
  )

  lastError = 'Response truncated'

  if (attempt < MAX_ATTEMPTS) {
    await sleep(attempt * 1500)
  }

  continue
}

        /* GET AI CONTENT */

        const content =
          typeof data?.choices?.[0]?.message?.content ===
          'string'
            ? data.choices[0].message.content.trim()
            : ''

        if (!content) {
          lastError = 'Empty AI response'

          if (attempt < MAX_ATTEMPTS) {
            await sleep(attempt * 1500)
          }

          continue
        }

        rawResponse = content

        console.log(
          `Fruit Sense AI succeeded on attempt ${attempt}`
        )

        break
      } catch (error) {
        lastError = error

        console.error(
          `Fruit Sense network error on attempt ${attempt}:`,
          error
        )

        if (attempt < MAX_ATTEMPTS) {
          await sleep(attempt * 1500)
        }
      }
    }

    /* AI FAILED → FALLBACK */

    if (!rawResponse) {
      console.warn(
        'Fruit Sense AI unavailable — fallback:',
        lastError
      )

      return res.status(200).json({
        success: true,
        source: 'fallback',
        ...getFallbackRecommendations(userMessage),
      })
    }

    /* CLEAN RESPONSE */

    const cleanedResponse =
      cleanAIResponse(rawResponse)

    const jsonStart =
      cleanedResponse.indexOf('{')

    const jsonEnd =
      cleanedResponse.lastIndexOf('}')

    if (
      jsonStart === -1 ||
      jsonEnd === -1 ||
      jsonEnd <= jsonStart
    ) {
      return res.status(200).json({
        success: true,
        source: 'fallback',
        ...getFallbackRecommendations(userMessage),
      })
    }

    const jsonResponse =
      cleanedResponse.slice(
        jsonStart,
        jsonEnd + 1
      )

    /* PARSE AI JSON */

    let parsedResponse: AIResponse

    try {
      parsedResponse = JSON.parse(jsonResponse)
    } catch {
      console.warn(
        'Fruit Sense returned invalid JSON — fallback used'
      )

      return res.status(200).json({
        success: true,
        source: 'fallback',
        ...getFallbackRecommendations(userMessage),
      })
    }

    /* VALIDATE PRODUCTS */

    const validProductIds = new Set(
      products.map((product) => product.id)
    )

    const validRecommendations =
      (parsedResponse.recommendations || [])
        .filter((recommendation) => {
          return (
            recommendation &&
            typeof recommendation.productId ===
              'string' &&
            validProductIds.has(
              recommendation.productId
            ) &&
            typeof recommendation.reason ===
              'string' &&
            recommendation.reason.trim().length > 0
          )
        })
        .slice(0, 3)

    /* INVALID RECOMMENDATIONS → FALLBACK */

    if (validRecommendations.length === 0) {
      return res.status(200).json({
        success: true,
        source: 'fallback',
        ...getFallbackRecommendations(userMessage),
      })
    }

    /* FINAL RESPONSE */

    return res.status(200).json({
      success: true,
      source: 'ai',

      recommendations: validRecommendations,

      summary:
        typeof parsedResponse.summary === 'string' &&
        parsedResponse.summary.trim()
          ? parsedResponse.summary.trim()
          : 'Based on what you told me, these would be my picks for you.',
    })
  } catch (error) {
    console.error(
      'Fruit Sense unexpected error:',
      error
    )

    const fallbackMessage =
      typeof req.body?.message === 'string'
        ? req.body.message
        : ''

    return res.status(200).json({
      success: true,
      source: 'fallback',
      ...getFallbackRecommendations(fallbackMessage),
    })
  }
}