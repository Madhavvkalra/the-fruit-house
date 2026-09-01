import type { VercelRequest, VercelResponse } from '@vercel/node'

type FruitProduct = {
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

const OPENROUTER_URL =
  'https://openrouter.ai/api/v1/chat/completions'

const MODEL =
  'openrouter/free'

/*
 * SERVER-SIDE FRUIT HOUSE CATALOGUE
 *
 * These IDs must match the products in src/data/products.ts.
 * Fruit Sense is only allowed to recommend products from
 * this catalogue.
 */
const catalogue: FruitProduct[] = [
  {
    id: 'gala-apples',
    name: 'New Zealand Gala Apples',
    origin: 'New Zealand',
    quantity: '4 pcs · ~700–750g',
    qualities: [
      'crisp',
      'naturally sweet',
      'juicy',
      'refreshing',
      'aromatic',
    ],
    intents: [
      'naturally-sweet',
      'refreshing',
      'crisp',
      'snacking',
    ],
    keywords: [
      'apple',
      'gala',
      'crisp',
      'sweet',
      'juicy',
      'refreshing',
    ],
  },

  {
    id: 'red-delicious',
    name: 'Red Delicious Apples',
    origin: 'Washington, USA',
    quantity: '4 pcs · ~700–750g',
    qualities: [
      'crisp',
      'sweet',
      'juicy',
      'mild',
    ],
    intents: [
      'naturally-sweet',
      'snacking',
      'crisp',
    ],
    keywords: [
      'apple',
      'red delicious',
      'crisp',
      'sweet',
      'juicy',
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
      'seedless',
      'refreshing',
      'premium',
    ],
    intents: [
      'naturally-sweet',
      'refreshing',
      'premium-snacking',
      'seedless',
    ],
    keywords: [
      'grapes',
      'shine muscat',
      'sweet',
      'very sweet',
      'seedless',
      'juicy',
      'refreshing',
      'premium',
    ],
  },

  {
    id: 'turkish-cherries',
    name: 'Turkish Cherries',
    origin: 'Turkey',
    quantity: 'Select your weight',
    qualities: [
      'juicy',
      'sweet-tart',
      'fresh',
      'refreshing',
    ],
    intents: [
      'refreshing',
      'naturally-sweet',
      'light-snacking',
      'tangy',
    ],
    keywords: [
      'cherry',
      'cherries',
      'turkish cherries',
      'sweet',
      'tart',
      'juicy',
      'refreshing',
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
      'smooth',
      'satisfying',
      'mild',
    ],
    intents: [
      'satisfying',
      'filling',
      'meal',
      'creamy',
    ],
    keywords: [
      'avocado',
      'creamy',
      'rich',
      'filling',
      'satisfying',
    ],
  },

  {
    id: 'dragon-fruit',
    name: 'Dragon Fruit',
    origin: 'Vietnam',
    quantity: '2 pcs',
    qualities: [
      'mild',
      'refreshing',
      'juicy',
      'light',
      'delicate',
    ],
    intents: [
      'refreshing',
      'light-snacking',
      'exotic',
    ],
    keywords: [
      'dragon fruit',
      'refreshing',
      'light',
      'juicy',
      'mild',
      'exotic',
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
      'indulgent',
      'premium',
    ],
    intents: [
      'naturally-sweet',
      'premium-snacking',
      'indulgent',
      'sweet',
    ],
    keywords: [
      'dates',
      'medjoul',
      'very sweet',
      'sweet',
      'rich',
      'premium',
    ],
  },

  {
    id: 'kiwi-chile',
    name: 'Kiwi',
    origin: 'Chile',
    quantity: '4 pcs',
    qualities: [
      'tangy',
      'bright',
      'juicy',
      'refreshing',
      'fresh',
    ],
    intents: [
      'refreshing',
      'tangy',
      'light-snacking',
    ],
    keywords: [
      'kiwi',
      'chile',
      'tangy',
      'fresh',
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
      'crisp',
      'sweet',
      'juicy',
      'aromatic',
      'refreshing',
    ],
    intents: [
      'naturally-sweet',
      'refreshing',
      'crisp',
      'snacking',
    ],
    keywords: [
      'apple',
      'queen apple',
      'new zealand',
      'crisp',
      'sweet',
      'juicy',
      'refreshing',
    ],
  },

  {
    id: 'granny-smith',
    name: 'Granny Smith Apples',
    origin: 'USA',
    quantity: '4 pcs · ~700–750g',
    qualities: [
      'very crisp',
      'tart',
      'bright',
      'juicy',
      'refreshing',
    ],
    intents: [
      'refreshing',
      'tangy',
      'crisp',
      'tart',
    ],
    keywords: [
      'apple',
      'granny smith',
      'tart',
      'crisp',
      'tangy',
      'refreshing',
    ],
  },

  {
    id: 'packham-pears',
    name: 'Packham Pears',
    origin: 'South Africa',
    quantity: '4 pcs · ~650–700g',
    qualities: [
      'juicy',
      'sweet',
      'soft when ripe',
      'mild',
      'refreshing',
    ],
    intents: [
      'naturally-sweet',
      'snacking',
      'refreshing',
    ],
    keywords: [
      'pear',
      'packham',
      'sweet',
      'juicy',
      'mild',
      'refreshing',
    ],
  },

  {
    id: 'beauty-pears',
    name: 'Beauty Pears',
    origin: 'South Africa',
    quantity: '4 pcs · ~650–700g',
    qualities: [
      'juicy',
      'sweet',
      'mild',
      'refreshing',
    ],
    intents: [
      'naturally-sweet',
      'snacking',
      'refreshing',
    ],
    keywords: [
      'pear',
      'beauty pear',
      'sweet',
      'juicy',
      'mild',
      'refreshing',
    ],
  },

  {
    id: 'egyptian-orange',
    name: 'Egyptian Valencia Orange',
    origin: 'Egypt',
    quantity: '4 pcs · ~800–850g',
    qualities: [
      'juicy',
      'citrusy',
      'refreshing',
      'bright',
      'sweet-tart',
    ],
    intents: [
      'refreshing',
      'citrus',
      'juicy',
    ],
    keywords: [
      'orange',
      'egyptian orange',
      'citrus',
      'juicy',
      'refreshing',
      'bright',
    ],
  },

  {
    id: 'south-african-orange',
    name: 'South African Valencia Orange',
    origin: 'South Africa',
    quantity: '4 pcs · ~800–850g',
    qualities: [
      'juicy',
      'citrusy',
      'refreshing',
      'bright',
      'sweet-tart',
    ],
    intents: [
      'refreshing',
      'citrus',
      'juicy',
    ],
    keywords: [
      'orange',
      'south african orange',
      'citrus',
      'juicy',
      'refreshing',
      'bright',
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
      'refreshing',
    ],
    intents: [
      'naturally-sweet',
      'refreshing',
      'citrus',
      'juicy',
    ],
    keywords: [
      'murcott',
      'honey murcott',
      'citrus',
      'sweet',
      'very sweet',
      'juicy',
      'refreshing',
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
      'citrusy',
      'refreshing',
    ],
    intents: [
      'naturally-sweet',
      'refreshing',
      'citrus',
    ],
    keywords: [
      'mandarin',
      'nova',
      'citrus',
      'sweet',
      'juicy',
      'refreshing',
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
      'refreshing',
    ],
    intents: [
      'naturally-sweet',
      'refreshing',
      'citrus',
    ],
    keywords: [
      'mandarin',
      'nadorcott',
      'citrus',
      'sweet',
      'juicy',
      'refreshing',
    ],
  },

  {
    id: 'red-globe',
    name: 'Red Globe Grapes',
    origin: 'China',
    quantity: '500g',
    qualities: [
      'juicy',
      'sweet',
      'crisp',
      'refreshing',
    ],
    intents: [
      'naturally-sweet',
      'refreshing',
      'snacking',
    ],
    keywords: [
      'grapes',
      'red globe',
      'sweet',
      'juicy',
      'crisp',
      'refreshing',
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
      'crisp',
      'premium',
      'refreshing',
    ],
    intents: [
      'naturally-sweet',
      'premium-snacking',
      'refreshing',
    ],
    keywords: [
      'grapes',
      'black finger',
      'sweet',
      'juicy',
      'crisp',
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
      'fresh',
      'small',
      'snackable',
    ],
    intents: [
      'naturally-sweet',
      'light-snacking',
      'fresh',
    ],
    keywords: [
      'blueberries',
      'berries',
      'sweet',
      'tart',
      'fresh',
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
      'bright',
      'juicy',
      'fresh',
      'refreshing',
    ],
    intents: [
      'refreshing',
      'tangy',
      'light-snacking',
    ],
    keywords: [
      'kiwi',
      'new zealand kiwi',
      'tangy',
      'fresh',
      'refreshing',
      'juicy',
    ],
  },

  {
    id: 'golden-kiwi',
    name: 'Golden Kiwi',
    origin: 'New Zealand',
    quantity: '4 pcs',
    qualities: [
      'sweet',
      'juicy',
      'smooth',
      'tropical',
      'refreshing',
    ],
    intents: [
      'naturally-sweet',
      'refreshing',
      'tropical',
    ],
    keywords: [
      'golden kiwi',
      'kiwi',
      'sweet',
      'juicy',
      'tropical',
      'refreshing',
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
      'indulgent',
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
          'Please tell us what you are looking for.',
      })
    }

    if (message.length > 1000) {
      return res.status(400).json({
        success: false,
        error:
          'Please keep your message under 1000 characters.',
      })
    }

    const systemPrompt = `
You are Fruit Sense.AI, the fruit recommendation
assistant for The Fruit House.

Your job is to understand what the customer wants
and recommend suitable products from the catalogue.

IMPORTANT RULES:

1. You may ONLY recommend products whose exact
   "id" appears in the catalogue.

2. NEVER invent a fruit, product, variety,
   origin or product ID.

3. Do NOT recommend anything outside the catalogue.

4. Match the customer's request against the
   product qualities, intents and keywords.

5. Prefer the strongest matches.

6. Give practical and simple recommendations.

7. Do not diagnose medical conditions.

8. Do not claim that a fruit can cure, treat,
   or prevent a disease.

9. Do not prescribe medication or medical treatment.

10. If the customer describes a serious or persistent
    medical symptom, recommend speaking with a qualified
    healthcare professional.

11. Recommendations are general food suggestions
    and are not medical advice.

12. Recommend between 2 and 4 products when suitable
    products exist.

13. Keep each reason short and useful.

14. Return ONLY valid JSON.

15. Do not include markdown.

16. Do not include a thinking process.

17. Do not include text before or after the JSON.

18. Your entire response MUST be a single JSON object.

19. The response must begin with { and end with }.

20. Never output your reasoning or analysis.

Use EXACTLY this structure:

{
  "recommendations": [
    {
      "productId": "exact catalogue product id",
      "reason": "Short explanation"
    }
  ],
  "summary": "One short friendly sentence"
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
  temperature: 0.1,
  max_tokens: 600,
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

const messageData =
  data?.choices?.[0]?.message

const content =
  typeof messageData?.content === 'string' &&
  messageData.content.trim()
    ? messageData.content
    : typeof messageData?.reasoning === 'string' &&
        messageData.reasoning.trim()
      ? messageData.reasoning
      : null

console.log(
  'Fruit Sense extracted response:',
  content,
)

if (
  typeof content !== 'string' ||
  !content.trim()
) {
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

    /*
     * Final validation against our controlled catalogue.
     */
    const productMap = new Map(
      catalogue.map((product) => [
        product.id,
        product,
      ]),
    )

    const recommendations =
      Array.isArray(
        parsed.recommendations,
      )
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

    if (
      recommendations.length === 0
    ) {
      console.error(
        'Fruit Sense returned no valid catalogue products.',
        parsed,
      )

      return res.status(502).json({
        success: false,
        error:
          'Fruit Sense could not find suitable products right now.',
      })
    }

    return res.status(200).json({
      success: true,
      recommendations,
      summary:
        typeof parsed.summary === 'string'
          ? parsed.summary
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