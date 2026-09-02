import type { VercelRequest, VercelResponse } from '@vercel/node'
import { products } from '../src/data/products'

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
   LOCAL FALLBACK

   This makes Fruit Sense work even when the free
   AI provider is overloaded.
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
      .slice(0, 4)

  /* =============================================
     HUNGRY / FILLING
  ============================================= */

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
          reason: 'Naturally sweet and satisfying when you need something substantial.',
        },
        {
          productId: 'gala-apples',
          reason: 'Crisp and easy to enjoy as a satisfying snack.',
        },
      ]),
      summary:
        'Here are some satisfying fruits for when you want something more filling.',
    }
  }

  /* =============================================
     LOW / SAD / DOWN
  ============================================= */

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
          reason: 'Sweet, juicy grapes that feel like a little treat.',
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
        'A few sweet and refreshing fruits to brighten your snack time.',
    }
  }

  /* =============================================
     WEAK / TIRED / LOW ENERGY

     No medical claims.
  ============================================= */

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
          reason: 'Naturally sweet and convenient when you want a quick snack.',
        },
        {
          productId: 'gala-apples',
          reason: 'Crisp, naturally sweet and easy to enjoy.',
        },
        {
          productId: 'shine-muscat',
          reason: 'Juicy and sweet for a refreshing snack.',
        },
      ]),
      summary:
        'Here are some naturally sweet and refreshing fruit options for you.',
    }
  }

  /* =============================================
     REFRESHING / JUICY
  ============================================= */

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
          productId: 'watermelon',
          reason: 'A classic choice when you want something juicy and refreshing.',
        },
        {
          productId: 'kiwi-chile',
          reason: 'Bright and tangy with a refreshing flavour.',
        },
      ]),
      summary:
        'These are some fresh and refreshing choices from The Fruit House.',
    }
  }

  /* =============================================
     SWEET
  ============================================= */

  if (
    query.includes('sweet') ||
    query.includes('dessert') ||
    query.includes('treat')
  ) {
    return {
      recommendations: pick([
        {
          productId: 'shine-muscat',
          reason: 'Beautifully sweet and juicy.',
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
        'A few naturally sweet picks selected for you.',
    }
  }

  /* =============================================
     PREMIUM / SPECIAL
  ============================================= */

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
          reason: 'A beautiful premium fruit choice for something special.',
        },
        {
          productId: 'golden-kiwi',
          reason: 'Bright, distinctive and deliciously premium.',
        },
        {
          productId: 'dragon-fruit',
          reason: 'Visually striking and wonderfully unique.',
        },
      ]),
      summary:
        'Here are some premium and special picks from The Fruit House.',
    }
  }

  /* =============================================
     DEFAULT
  ============================================= */

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
      'Here are a few handpicked fruits from The Fruit House.',
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
      error: 'Method not allowed',
    })
  }

  try {
    const { message } = req.body

    /* =============================================
       VALIDATE MESSAGE
    ============================================= */

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error:
          'Please tell Fruit Sense what you are looking for.',
      })
    }

    const OPENROUTER_API_KEY =
      process.env.OPENROUTER_API_KEY

    /* =============================================
       IF API KEY MISSING → FALLBACK
    ============================================= */

    if (!OPENROUTER_API_KEY) {
      console.warn(
        'OPENROUTER_API_KEY missing — using local Fruit Sense'
      )

      return res.status(200).json({
        success: true,
        source: 'fallback',
        ...getFallbackRecommendations(message),
      })
    }

    /* =============================================
       BUILD SMALLER CATALOGUE

       IMPORTANT:
       Don't send unnecessary fields to the model.
    ============================================= */

    const catalogue = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description || '',
    }))

    /* =============================================
       SYSTEM PROMPT

       Keep this SHORT to reduce token usage.
    ============================================= */

    const systemPrompt = `You are Fruit Sense for The Fruit House.

Recommend ONLY products from this catalogue.

Rules:
- Return ONLY valid JSON.
- No markdown.
- No explanation.
- Recommend exactly 3 fruits.
- Use exact product IDs from the catalogue.
- Reasons must be under 12 words.
- Summary must be under 15 words.
- Never diagnose or make medical claims.

JSON format:
{"recommendations":[{"productId":"id","reason":"short reason"}],"summary":"short summary"}

Catalogue:
${JSON.stringify(catalogue)}`

    /* =============================================
       AI CONFIG
    ============================================= */

    const model =
      'nvidia/nemotron-3-super-120b-a12b:free'

    const MAX_ATTEMPTS = 3

    let rawResponse = ''
    let lastError: unknown = null

    /* =============================================
       TRY AI
    ============================================= */

    for (
      let attempt = 1;
      attempt <= MAX_ATTEMPTS;
      attempt++
    ) {
      try {
        console.log(
          `Fruit Sense: trying ${model} — attempt ${attempt}/${MAX_ATTEMPTS}`
        )

        const response = await fetch(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            method: 'POST',

            headers: {
              Authorization: `Bearer ${OPENROUTER_API_KEY}`,
              'Content-Type': 'application/json',

              'HTTP-Referer':
                process.env.VERCEL_URL
                  ? `https://${process.env.VERCEL_URL}`
                  : 'http://localhost:5173',

              'X-Title':
                'The Fruit House - Fruit Sense AI',
            },

            body: JSON.stringify({
              model,

              messages: [
                {
                  role: 'system',
                  content: systemPrompt,
                },
                {
                  role: 'user',
                  content: message.trim(),
                },
              ],

              temperature: 0.4,

              /*
               * IMPORTANT:
               * Give the model enough tokens.
               *
               * Nemotron may use tokens internally,
               * so 220 was too low.
               */
              max_tokens: 800,
            }),
          }
        )

        const data = await response.json()

        console.log(
          `Fruit Sense FULL RESPONSE — attempt ${attempt}:`,
          JSON.stringify(data, null, 2)
        )

        /* =========================================
           PROVIDER ERROR
        ========================================= */

        if (!response.ok || data?.error) {
          lastError = data?.error || data

          console.error(
            `Fruit Sense failed attempt ${attempt}:`,
            lastError
          )

          if (attempt < MAX_ATTEMPTS) {
            await sleep(attempt * 1500)
          }

          continue
        }

        /* =========================================
           CHECK TRUNCATION
        ========================================= */

        const finishReason =
          data?.choices?.[0]?.finish_reason

        if (finishReason === 'length') {
          console.warn(
            'Fruit Sense response was truncated'
          )

          lastError =
            'Response truncated by token limit'

          if (attempt < MAX_ATTEMPTS) {
            await sleep(attempt * 1500)
          }

          continue
        }

        /* =========================================
           GET CONTENT
        ========================================= */

        const content =
          typeof data?.choices?.[0]?.message?.content ===
          'string'
            ? data.choices[0].message.content.trim()
            : ''

        console.log(
          `Fruit Sense RAW RESPONSE — attempt ${attempt}:`,
          content
        )

        if (!content) {
          lastError = 'Empty AI response'

          if (attempt < MAX_ATTEMPTS) {
            await sleep(attempt * 1500)
          }

          continue
        }

        rawResponse = content

        console.log(
          `Fruit Sense SUCCESS on attempt ${attempt}`
        )

        break
      } catch (error) {
        lastError = error

        console.error(
          `Fruit Sense network error — attempt ${attempt}:`,
          error
        )

        if (attempt < MAX_ATTEMPTS) {
          await sleep(attempt * 1500)
        }
      }
    }

    /* =============================================
       AI FAILED → LOCAL FALLBACK

       THIS IS THE IMPORTANT PART.
       Your website will still work.
    ============================================= */

    if (!rawResponse) {
      console.warn(
        'Fruit Sense AI unavailable — using fallback:',
        lastError
      )

      return res.status(200).json({
        success: true,
        source: 'fallback',
        ...getFallbackRecommendations(message),
      })
    }

    /* =============================================
       CLEAN RESPONSE
    ============================================= */

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
      console.warn(
        'Fruit Sense invalid JSON shape — using fallback'
      )

      return res.status(200).json({
        success: true,
        source: 'fallback',
        ...getFallbackRecommendations(message),
      })
    }

    const jsonResponse =
      cleanedResponse.slice(
        jsonStart,
        jsonEnd + 1
      )

    /* =============================================
       PARSE JSON
    ============================================= */

    let parsedResponse: AIResponse

    try {
      parsedResponse = JSON.parse(jsonResponse)
    } catch (error) {
      console.error(
        'Fruit Sense JSON parsing failed:',
        jsonResponse
      )

      return res.status(200).json({
        success: true,
        source: 'fallback',
        ...getFallbackRecommendations(message),
      })
    }

    /* =============================================
       VALIDATE PRODUCT IDS
    ============================================= */

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
        .slice(0, 4)

    /* =============================================
       INVALID AI RESPONSE → FALLBACK
    ============================================= */

    if (validRecommendations.length === 0) {
      console.warn(
        'Fruit Sense returned invalid recommendations'
      )

      return res.status(200).json({
        success: true,
        source: 'fallback',
        ...getFallbackRecommendations(message),
      })
    }

    /* =============================================
       FINAL SUCCESS
    ============================================= */

    const finalResponse = {
      success: true,

      source: 'ai',

      recommendations: validRecommendations,

      summary:
        typeof parsedResponse.summary === 'string' &&
        parsedResponse.summary.trim()
          ? parsedResponse.summary.trim()
          : 'Here are some fruits selected especially for you.',
    }

    console.log(
      'Fruit Sense FINAL RESPONSE:',
      finalResponse
    )

    return res.status(200).json(finalResponse)
  } catch (error) {
    console.error(
      'Fruit Sense unexpected error:',
      error
    )

    /*
     * Final safety net.
     */

    const message =
      typeof req.body?.message === 'string'
        ? req.body.message
        : ''

    return res.status(200).json({
      success: true,
      source: 'fallback',
      ...getFallbackRecommendations(message),
    })
  }
}