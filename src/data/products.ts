export type ProductVariant = {
  label: string
  price: number
  compareAtPrice?: number
}

export type Product = {
  id: string
  name: string
  origin: string
  images?: string[]
  quantity: string
  description?: string
  badge?: string
  rating?: number
  reviewCount?: number
  note?: string
  variants: ProductVariant[]
}

export const products: Product[] = [
  {
    id: 'gala-apples',
    name: 'New Zealand Gala Apples',
    origin: 'New Zealand',
    images: [
      '/gala-apple-1.jpg',
      '/gala-apple-2.jpg',
      '/gala-apple-3.jpg',
    ],
    quantity: '4 pcs · ~700–750g',
    description:
      'Crisp, naturally sweet and beautifully aromatic, New Zealand Gala Apples are known for their delicate floral fragrance, fine texture and refreshing bite. Grown in the cool orchards of New Zealand, these apples offer a balanced sweetness with a gentle crispness that makes them perfect for everyday snacking, breakfast bowls and fresh fruit platters.',
    badge: 'PREMIUM',
    rating: 5,
    reviewCount: 1,
    variants: [
      {
        label: '4 pcs',
        price: 349,
        compareAtPrice: 549,
      },
    ],
  },

  {
    id: 'red-delicious',
    name: 'Red Delicious Apples',
    origin: 'Washington, USA',
    quantity: '4 pcs · ~700–750g',
    badge: 'PREMIUM',
    variants: [
      {
        label: '4 pcs',
        price: 389,
        compareAtPrice: 649,
      },
    ],
  },

  {
    id: 'shine-muscat',
    name: 'Shine Muscat Seedless Grapes',
    origin: 'China',
    quantity: '500g',
    badge: 'PREMIUM',
    rating: 5,
    reviewCount: 1,
    variants: [
      {
        label: '500g',
        price: 300,
        compareAtPrice: 500,
      },
    ],
  },

  {
    id: 'turkish-cherries',
    name: 'Turkish Cherries',
    origin: 'Turkey',
    quantity: 'Select your weight',
    badge: 'PREMIUM',
    variants: [
      {
        label: '250g',
        price: 500,
      },
      {
        label: '500g',
        price: 900,
      },
      {
        label: '2kg',
        price: 3200,
      },
    ],
  },

  {
    id: 'avocado',
    name: 'Avocado',
    origin: 'Kenya',
    quantity: 'Ready to eat',
    badge: 'BEST SELLER',
    rating: 5,
    reviewCount: 4,
    note: 'Ripe in 3–5 days',
    variants: [
      {
        label: '1 pc',
        price: 249,
        compareAtPrice: 379,
      },
    ],
  },

  {
    id: 'dragon-fruit',
    name: 'Dragon Fruit',
    origin: 'Vietnam',
    quantity: '2 pcs',
    badge: 'TRENDING',
    variants: [
      {
        label: '2 pcs',
        price: 250,
      },
    ],
  },

  {
    id: 'medjoul-dates',
    name: 'Medjoul Dates',
    origin: 'UAE',
    quantity: '500g',
    badge: 'PREMIUM',
    rating: 5,
    reviewCount: 3,
    variants: [
      {
        label: '500g',
        price: 999,
        compareAtPrice: 1299,
      },
    ],
  },

  {
    id: 'kiwi-chile',
    name: 'Kiwi',
    origin: 'Chile',
    quantity: '4 pcs',
    badge: 'BEST SELLER',
    rating: 5,
    reviewCount: 1,
    variants: [
      {
        label: '4 pcs',
        price: 240,
        compareAtPrice: 300,
      },
    ],
  },

  {
    id: 'queen-apples',
    name: 'New Zealand Queen Apples',
    origin: 'New Zealand',
    quantity: '4 pcs · ~700–750g',
    variants: [
      {
        label: '4 pcs',
        price: 349,
      },
    ],
  },

  {
    id: 'granny-smith',
    name: 'Granny Smith Apples',
    origin: 'USA',
    quantity: '4 pcs · ~700–750g',
    variants: [
      {
        label: '4 pcs',
        price: 360,
      },
    ],
  },

  {
    id: 'packham-pears',
    name: 'Packham Pears',
    origin: 'South Africa',
    quantity: '4 pcs · ~650–700g',
    rating: 5,
    reviewCount: 1,
    variants: [
      {
        label: '4 pcs',
        price: 320,
      },
    ],
  },

  {
    id: 'beauty-pears',
    name: 'Beauty Pears',
    origin: 'South Africa',
    quantity: '4 pcs · ~650–700g',
    variants: [
      {
        label: '4 pcs',
        price: 379,
        compareAtPrice: 449,
      },
    ],
  },

  {
    id: 'egyptian-orange',
    name: 'Egyptian Valencia Orange',
    origin: 'Egypt',
    quantity: '4 pcs · ~800–850g',
    variants: [
      {
        label: '4 pcs',
        price: 160,
      },
    ],
  },

  {
    id: 'south-african-orange',
    name: 'South African Valencia Orange',
    origin: 'South Africa',
    quantity: '4 pcs · ~800–850g',
    variants: [
      {
        label: '4 pcs',
        price: 200,
      },
    ],
  },

  {
    id: 'royal-honey-murcott',
    name: 'Royal Honey Murcott (RHM)',
    origin: 'South Africa',
    quantity: '800–850g',
    variants: [
      {
        label: '800–850g',
        price: 300,
      },
    ],
  },

  {
    id: 'nova-mandarin',
    name: 'Nova Mandarin',
    origin: 'South Africa',
    quantity: '800–850g',
    note: 'By Sea',
    variants: [
      {
        label: '800–850g',
        price: 299,
      },
    ],
  },

  {
    id: 'nadorcott',
    name: 'Nadorcott Mandarins',
    origin: 'South Africa',
    quantity: '800–850g',
    variants: [
      {
        label: '800–850g',
        price: 300,
      },
    ],
  },

  {
    id: 'red-globe',
    name: 'Red Globe Grapes',
    origin: 'China',
    quantity: '500g',
    variants: [
      {
        label: '500g',
        price: 300,
      },
    ],
  },

  {
    id: 'black-finger',
    name: 'Black Finger Grapes',
    origin: 'China',
    quantity: '500g',
    badge: 'PREMIUM',
    variants: [
      {
        label: '500g',
        price: 399,
      },
    ],
  },

  {
    id: 'blueberries',
    name: 'Blueberries',
    origin: 'Peru',
    quantity: '125g',
    variants: [
      {
        label: '125g',
        price: 300,
      },
    ],
  },

  {
    id: 'new-zealand-kiwi',
    name: 'Kiwi',
    origin: 'New Zealand',
    quantity: '4 pcs',
    variants: [
      {
        label: '4 pcs',
        price: 299,
      },
    ],
  },

  {
    id: 'golden-kiwi',
    name: 'Golden Kiwi',
    origin: 'New Zealand',
    quantity: '4 pcs',
    variants: [
      {
        label: '4 pcs',
        price: 400,
        compareAtPrice: 419,
      },
    ],
  },

  {
    id: 'chausa-mango',
    name: 'Chausa Mango',
    origin: 'India',
    quantity: '2 pcs · ~750–800g',
    rating: 5,
    reviewCount: 1,
    variants: [
      {
        label: '2 pcs',
        price: 250,
      },
    ],
  },

  {
    id: 'langda-mango',
    name: 'Langda Mango',
    origin: 'India',
    quantity: '~800g',
    variants: [
      {
        label: '800g',
        price: 200,
      },
    ],
  },

  {
    id: 'kimia-dates',
    name: 'Kimia Dates',
    origin: 'Iran',
    quantity: '500g',
    variants: [
      {
        label: '500g',
        price: 349,
        compareAtPrice: 399,
      },
    ],
  },

  {
    id: 'zahidi-dates',
    name: 'Zahidi Dates',
    origin: 'Iraq',
    quantity: 'Select your weight',
    variants: [
      {
        label: '250g',
        price: 349,
      },
      {
        label: '500g',
        price: 349,
      },
    ],
  },

  {
    id: 'alig-dates',
    name: 'Alig Dates',
    origin: 'Tunisia',
    quantity: '200g',
    variants: [
      {
        label: '200g',
        price: 100,
        compareAtPrice: 120,
      },
    ],
  },
]