import type { VercelRequest, VercelResponse } from '@vercel/node'

const OPENROUTER_URL =
  'https://openrouter.ai/api/v1/chat/completions'

const MODEL = 'openrouter/free'

type CatalogueProduct = {
  id: string
  name: string
  origin: string
  quantity: string
  qualities: string[]
  intents: string[]
  keywords: string[]
}

type ModelRecommendation = {
  productId?: unknown
  reason?: unknown
}

type ModelResponse = {
  recommendations?: ModelRecommendation[]
  summary?: unknown
}

/* =================================================
   THE FRUIT HOUSE CATALOGUE
================================================= */

const catalogue: CatalogueProduct[] = [
  {
    id: 'gala-apples',
    name: 'New Zealand Gala Apples',
    origin: 'New Zealand',
    quantity: '4 pcs · ~700–750g',
    qualities: [
      'sweet',
      'crisp',
      'juicy',
      'refreshing',
      'aromatic',
    ],
    intents: [
      'everyday-snacking',
      'refreshing',
      'naturally-sweet',
    ],
    keywords: [
      'apple',
      'gala',
      'sweet',
      'crisp',
      'juicy',
      'refreshing',
      'snack',
    ],
  },

  {
    id: 'red-delicious',
    name: 'Red Delicious Apples',
    origin: 'Washington, USA',
    quantity: '4 pcs · ~700–750g',
    qualities: [
      'sweet',
      'mild',
      'juicy',
      'soft',
    ],
    intents: [
      'naturally-sweet',
      'everyday-snacking',
    ],
    keywords: [
      'apple',
      'red delicious',
      'sweet',
      'juicy',
      'snack',
    ],
  },

  {
    id: 'shine-muscat',
    name: 'Shine Muscat Seedless Grapes',
    origin: 'China',
    quantity: '500g',
    qualities: [
      'very sweet',
      'juicy',
      'crisp',
      'premium',
      'seedless',
    ],
    intents: [
      'indulgent',
      'naturally-sweet',
      'premium-snacking',
    ],
    keywords: [
      'grapes',
      'shine muscat',
      'sweet',
      'juicy',
      'seedless',
      'premium',
    ],
  },

  {
    id: 'turkish-cherries',
    name: 'Turkish Cherries',
    origin: 'Turkey',
    quantity: 'Select your weight',
    qualities: [
      'sweet',
      'juicy',
      'premium',
      'refreshing',
    ],
    intents: [
      'premium-snacking',
      'naturally-sweet',
      'refreshing',
    ],
    keywords: [
      'cherries',
      'cherry',
      'sweet',
      'juicy',
      'premium',
    ],
  },

  {
    id: 'avocado',
    name: 'Avocado',
    origin: 'Kenya',
    quantity: 'Ready to eat',
    qualities: [
      'creamy',
      'rich',
      'mild',
      'filling',
    ],
    intents: [
      'filling',
      'breakfast',
      'balanced-meal',
    ],
    keywords: [
      'avocado',
      'creamy',
      'filling',
      'breakfast',
      'rich',
    ],
  },

  {
    id: 'dragon-fruit',
    name: 'Dragon Fruit',
    origin: 'Vietnam',
    quantity: '2 pcs',
    qualities: [
      'refreshing',
      'light',
      'juicy',
      'mild',
    ],
    intents: [
      'refreshing',
      'light-snacking',
    ],
    keywords: [
      'dragon fruit',
      'refreshing',
      'light',
      'juicy',
      'cooling',
    ],
  },

  {
    id: 'medjoul-dates',
    name: 'Medjoul Dates',
    origin: 'UAE',
    quantity: '500g',
    qualities: [
      'very sweet',
      'soft',
      'rich',
      'caramel-like',
      'filling',
    ],
    intents: [
      'naturally-sweet',
      'indulgent',
      'energy-snacking',
    ],
    keywords: [
      'dates',
      'medjoul',
      'sweet',
      'rich',
      'snack',
      'energy',
    ],
  },

  {
    id: 'kiwi-chile',
    name: 'Kiwi',
    origin: 'Chile',
    quantity: '4 pcs',
    qualities: [
      'tangy',
      'refreshing',
      'juicy',
    ],
    intents: [
      'refreshing',
      'light-snacking',
    ],
    keywords: [
      'kiwi',
      'tangy',
      'refreshing',
      'juicy',
    ],
  },

  {
    id: 'queen-apples',
    name: 'New Zealand Queen Apples',
    origin: 'New Zealand',
    quantity: '4 pcs · ~700–750g',
    qualities: [
      'sweet',
      'crisp',
      'juicy',
    ],
    intents: [
      'everyday-snacking',
      'naturally-sweet',
    ],
    keywords: [
      'apple',
      'queen apple',
      'sweet',
      'crisp',
    ],
  },

  {
    id: 'granny-smith',
    name: 'Granny Smith Apples',
    origin: 'USA',
    quantity: '4 pcs · ~700–750g',
    qualities: [
      'tart',
      'crisp',
      'refreshing',
    ],
    intents: [
      'refreshing',
      'crisp-snacking',
    ],
    keywords: [
      'apple',
      'granny smith',
      'tart',
      'crisp',
      'refreshing',
    ],
  },

  {
    id: 'packham-pears',
    name: 'Packham Pears',
    origin: 'South Africa',
    quantity: '4 pcs · ~650–700g',
    qualities: [
      'sweet',
      'juicy',
      'soft',
    ],
    intents: [
      'everyday-snacking',
      'naturally-sweet',
    ],
    keywords: [
      'pear',
      'packham',
      'sweet',
      'juicy',
    ],
  },

  {
    id: 'beauty-pears',
    name: 'Beauty Pears',
    origin: 'South Africa',
    quantity: '4 pcs · ~650–700g',
    qualities: [
      'sweet',
      'juicy',
      'delicate',
    ],
    intents: [
      'everyday-snacking',
      'naturally-sweet',
    ],
    keywords: [
      'pear',
      'beauty pear',
      'sweet',
      'juicy',
    ],
  },

  {
    id: 'egyptian-orange',
    name: 'Egyptian Valencia Orange',
    origin: 'Egypt',
    quantity: '4 pcs · ~800–850g',
    qualities: [
      'juicy',
      'refreshing',
      'citrusy',
      'sweet-tart',
    ],
    intents: [
      'refreshing',
      'juicy',
      'morning-fruit',
    ],
    keywords: [
      'orange',
      'citrus',
      'juicy',
      'refreshing',
      'valencia',
    ],
  },

  {
    id: 'south-african-orange',
    name: 'South African Valencia Orange',
    origin: 'South Africa',
    quantity: '4 pcs · ~800–850g',
    qualities: [
      'juicy',
      'refreshing',
      'citrusy',
    ],
    intents: [
      'refreshing',
      'juicy',
    ],
    keywords: [
      'orange',
      'citrus',
      'juicy',
      'refreshing',
    ],
  },

  {
    id: 'royal-honey-murcott',
    name: 'Royal Honey Murcott (RHM)',
    origin: 'South Africa',
    quantity: '800–850g',
    qualities: [
      'very sweet',
      'juicy',
      'citrusy',
      'premium',
    ],
    intents: [
      'naturally-sweet',
      'refreshing',
      'premium-snacking',
    ],
    keywords: [
      'murcott',
      'mandarin',
      'sweet',
      'citrus',
      'juicy',
    ],
  },

  {
    id: 'nova-mandarin',
    name: 'Nova Mandarin',
    origin: 'South Africa',
    quantity: '800–850g',
    qualities: [
      'sweet',
      'juicy',
      'easy-snacking',
    ],
    intents: [
      'refreshing',
      'easy-snacking',
    ],
    keywords: [
      'mandarin',
      'nova',
      'citrus',
      'sweet',
      'juicy',
    ],
  },

  {
    id: 'nadorcott',
    name: 'Nadorcott Mandarins',
    origin: 'South Africa',
    quantity: '800–850g',
    qualities: [
      'sweet',
      'juicy',
      'citrusy',
    ],
    intents: [
      'refreshing',
      'easy-snacking',
    ],
    keywords: [
      'mandarin',
      'nadorcott',
      'citrus',
      'sweet',
    ],
  },

  {
    id: 'red-globe',
    name: 'Red Globe Grapes',
    origin: 'China',
    quantity: '500g',
    qualities: [
      'sweet',
      'juicy',
      'crisp',
    ],
    intents: [
      'naturally-sweet',
      'snacking',
      'refreshing',
    ],
    keywords: [
      'grapes',
      'red globe',
      'sweet',
      'juicy',
    ],
  },

  {
    id: 'black-finger',
    name: 'Black Finger Grapes',
    origin: 'China',
    quantity: '500g',
    qualities: [
      'sweet',
      'juicy',
      'premium',
    ],
    intents: [
      'premium-snacking',
      'naturally-sweet',
    ],
    keywords: [
      'grapes',
      'black finger',
      'sweet',
      'premium',
    ],
  },

  {
    id: 'blueberries',
    name: 'Blueberries',
    origin: 'Peru',
    quantity: '125g',
    qualities: [
      'sweet-tart',
      'juicy',
      'light',
    ],
    intents: [
      'light-snacking',
      'breakfast',
      'refreshing',
    ],
    keywords: [
      'blueberries',
      'berries',
      'light',
      'snack',
    ],
  },

  {
    id: 'new-zealand-kiwi',
    name: 'Kiwi',
    origin: 'New Zealand',
    quantity: '4 pcs',
    qualities: [
      'tangy',
      'refreshing',
      'juicy',
    ],
    intents: [
      'refreshing',
      'light-snacking',
    ],
    keywords: [
      'kiwi',
      'new zealand',
      'tangy',
      'refreshing',
    ],
  },

  {
    id: 'golden-kiwi',
    name: 'Golden Kiwi',
    origin: 'New Zealand',
    quantity: '4 pcs',
    qualities: [
      'sweet',
      'tropical',
      'juicy',
      'refreshing',
    ],
    intents: [
      'refreshing',
      'naturally-sweet',
      'premium-snacking',
    ],
    keywords: [
      'golden kiwi',
      'kiwi',
      'sweet',
      'tropical',
      'juicy',
    ],
  },

  {
    id: 'chausa-mango',
    name: 'Chausa Mango',
    origin: 'India',
    quantity: '2 pcs · ~750–800g',
    qualities: [
      'very sweet',
      'juicy',
      'tropical',
      'rich',
    ],
    intents: [
      'naturally-sweet',
      'tropical',
      'indulgent',
    ],
    keywords: [
      'mango',
      'chausa',
      'sweet',
      'very sweet',
      'tropical',
      'juicy',
    ],
  },

  {
    id: 'langda-mango',
    name: 'Langda Mango',
    origin: 'India',
    quantity: '~800g',
    qualities: [
      'sweet',
      'juicy',
      'tropical',
      'aromatic',
      'rich',
    ],
    intents: [
      'naturally-sweet',
      'tropical',
      'indulgent',
    ],
    keywords: [
      'mango',
      'langda',
      'indian mango',
      'sweet',
      'tropical',
      'juicy',
    ],
  },

  {
    id: 'kimia-dates',
    name: 'Kimia Dates',
    origin: 'Iran',
    quantity: '500g',
    qualities: [
      'very sweet',
      'soft',
      'rich',
      'caramel-like',
    ],
    intents: [
      'naturally-sweet',
      'indulgent',
      'snacking',
    ],
    keywords: [
      'dates',
      'kimia',
      'sweet',
      'very sweet',
      'soft',
      'rich',
    ],
  },

  {
    id: 'zahidi-dates',
    name: 'Zahidi Dates',
    origin: 'Iraq',
    quantity: 'Select your weight',
    qualities: [
      'sweet',
      'firm',
      'rich',
      'snackable',
    ],
    intents: [
      'naturally-sweet',
      'snacking',
      'indulgent',
    ],
    keywords: [
      'dates',
      'zahidi',
      'sweet',
      'firm',
      'snack',
    ],
  },

  {
    id: 'alig-dates',
    name: 'Alig Dates',
    origin: 'Tunisia',
    quantity: '200g',
    qualities: [
      'sweet',
      'soft',
      'snackable',
      'rich',
    ],
    intents: [
      'naturally-sweet',
      'snacking',
      'indulgent',
    ],
    keywords: [
      'dates',
      'alig',
      'sweet',
      'soft',
      'snack',
    ],
  },
]

/* =================================================
   API HANDLER
================================================= */

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  res.setHeader(
    'Content-Type',
    'application/json',
  )

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  const apiKey =
    process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    console.error(
      'OPENROUTER_API_KEY is missing',
    )

    return res.status(500).json({
      success: false,
      error:
        'Fruit Sense is not configured yet.',
    })
  }

  try {
    const body = req.body ?? {}

    const message =
      typeof body.message === 'string'
        ? body.message.trim()
        : ''

    if (!message) {
      return res.status(400).json({
        success: false,
        error:
          'Please tell Fruit Sense what you are looking for.',
      })
    }

    if (message.length > 1000) {
      return res.status(400).json({
        success: false,
        error:
          'Please keep your message under 1000 characters.',
      })
    }

    /* =================================================
       AI SYSTEM PROMPT
    ================================================= */

    const systemPrompt = `
You are Fruit Sense.AI, the intelligent fruit guide
for The Fruit House.

Your job is to understand what the customer is:

- feeling
- experiencing
- craving
- looking for
- trying to include in their lifestyle

Then recommend suitable fruits ONLY from the
provided The Fruit House catalogue.

IMPORTANT RULES:

1. You may ONLY recommend products whose exact
   "id" appears in the catalogue.

2. NEVER invent a fruit, product, variety,
   origin or product ID.

3. NEVER recommend anything outside the catalogue.

4. Match the customer's request against the
   product qualities, intents and keywords.

5. Prefer the strongest and most relevant matches.

6. Give practical, warm and simple recommendations.

7. Recommendations must be framed as general food
   suggestions, not medical advice.

8. Do NOT diagnose medical conditions.

9. Do NOT claim that any fruit can cure, treat,
   prevent or guarantee improvement of a disease
   or medical condition.

10. Do NOT prescribe medication or treatment.

11. If the customer describes a serious, dangerous
    or persistent medical symptom, gently encourage
    them to speak with a qualified healthcare
    professional.

12. Recommend between 2 and 4 products whenever
    suitable products exist.

13. Keep every recommendation reason short,
    natural and useful.

14. Return ONLY valid JSON.

15. Do not include markdown.

16. Do not include analysis or reasoning.

17. Do not include text before or after the JSON.

18. Your entire response MUST be one JSON object.

19. The response MUST begin with { and end with }.

Use EXACTLY this structure:

{
  "recommendations": [
    {
      "productId": "exact catalogue product id",
      "reason": "Short explanation of why this fruit suits the customer's request"
    }
  ],
  "summary": "One short warm sentence introducing the recommendations"
}

CATALOGUE:

${JSON.stringify(catalogue)}
`

    console.log(
      'Fruit Sense: starting OpenRouter request',
    )

    const controller =
      new AbortController()

    const timeout = setTimeout(() => {
      controller.abort()
    }, 15000)

    let response: Response

    try {
      response = await fetch(
        OPENROUTER_URL,
        {
          method: 'POST',

          headers: {
            Authorization:
              `Bearer ${apiKey}`,

            'Content-Type':
              'application/json',

            'HTTP-Referer':
              'https://the-fruit-house.com',

            'X-Title':
              'The Fruit House - Fruit Sense AI',
          },

          body: JSON.stringify({
            model: MODEL,

            messages: [
              {
                role: 'system',
                content: systemPrompt,
              },

              {
                role: 'user',
                content: message,
              },
            ],

            temperature: 0.2,

            max_tokens: 700,

            stream: false,

            response_format: {
              type: 'json_object',
            },
          }),

          signal: controller.signal,
        },
      )
    } finally {
      clearTimeout(timeout)
    }

    console.log(
      'Fruit Sense: OpenRouter responded with status',
      response.status,
    )

    const data = await response.json()

    console.log(
      'Fruit Sense FULL RESPONSE:',
      JSON.stringify(data, null, 2),
    )

    if (!response.ok) {
      console.error(
        'OpenRouter error:',
        data,
      )

      return res.status(502).json({
        success: false,
        error:
          data?.error?.message ||
          'Fruit Sense could not generate recommendations right now.',
      })
    }

    /* =================================================
       EXTRACT FINAL MODEL RESPONSE

       IMPORTANT:
       We ONLY use message.content.

       We NEVER use message.reasoning as the response.
    ================================================= */

    const messageData =
      data?.choices?.[0]?.message

    const content =
      typeof messageData?.content === 'string' &&
      messageData.content.trim()
        ? messageData.content.trim()
        : null

    console.log(
      'Fruit Sense extracted response:',
      content,
    )

    if (!content) {
      console.error(
        'Empty OpenRouter response:',
        data,
      )

      return res.status(502).json({
        success: false,
        error:
          'Fruit Sense returned an empty response.',
      })
    }

    console.log(
      'Fruit Sense RAW MODEL RESPONSE:',
      content,
    )

    /* =================================================
       PARSE AI JSON
    ================================================= */

    let parsed: ModelResponse

    try {
      parsed = JSON.parse(content)
    } catch {
      console.error(
        'Invalid JSON from OpenRouter.',
        'Raw content:',
        content,
      )

      return res.status(502).json({
        success: false,
        error:
          'Fruit Sense returned an invalid response.',
      })
    }

    /* =================================================
       FINAL CATALOGUE VALIDATION

       AI CANNOT SUCCESSFULLY RETURN PRODUCTS
       THAT DO NOT EXIST IN OUR CATALOGUE.
    ================================================= */

    const productMap = new Map(
      catalogue.map((product) => [
        product.id,
        product,
      ]),
    )

    const recommendations =
      Array.isArray(parsed.recommendations)
        ? parsed.recommendations
            .filter(
              (item) =>
                item &&
                typeof item.productId ===
                  'string' &&
                typeof item.reason ===
                  'string' &&
                productMap.has(
                  item.productId,
                ),
            )
            .slice(0, 4)
            .map((item) => {
              const product =
                productMap.get(
                  item.productId as string,
                )!

              return {
                productId: product.id,
                fruit: product.name,
                origin: product.origin,
                quantity: product.quantity,
                reason:
                  item.reason as string,
              }
            })
        : []

    if (recommendations.length === 0) {
      console.error(
        'Fruit Sense returned no valid catalogue products.',
        parsed,
      )

      return res.status(502).json({
        success: false,
        error:
          'Fruit Sense could not find suitable fruits right now.',
      })
    }

    /* =================================================
       SUCCESS RESPONSE
    ================================================= */

    return res.status(200).json({
      success: true,

      recommendations,

      summary:
        typeof parsed.summary === 'string'
          ? parsed.summary.trim()
          : '',
    })
  } catch (error) {
    console.error(
      'Fruit Sense error:',
      error,
    )

    if (
      error instanceof Error &&
      error.name === 'AbortError'
    ) {
      return res.status(504).json({
        success: false,
        error:
          'Fruit Sense took too long to respond. Please try again.',
      })
    }

    return res.status(500).json({
      success: false,

      error:
        error instanceof Error
          ? error.message
          : String(error),
    })
  }
}