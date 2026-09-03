export type ProductVariant = {
  label: string
  price: number
  compareAtPrice?: number
}

export type Nutrition = {
  energy: string
  energyUnit?: string
  carbohydrates: string
  carbohydratesNote?: string
  fibre: string
  fibreNote?: string
  natural: string
  naturalNote?: string
}

export type ProductFAQ = {
  question: string
  answer: string
}

export type ProductWhyLoveIt = {
  title: string
  description: string
}

export type Product = {
  id: string
  name: string
  origin: string
  images?: string[]
  quantity: string

  description?: string
  about?: string
  storage?: string
  ripenessGuide?: string
  experience?: string
  whyLoveIt?: ProductWhyLoveIt[]
  highlights?: string[]

  nutrition?: Nutrition

  faqs?: ProductFAQ[]

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

  storage:
    'Keep refrigerated to maintain crispness and freshness. Store away from strongly scented foods.',

  ripenessGuide:
    'Ready to enjoy immediately. The best apples feel firm, crisp and heavy for their size.',

  experience:
    'A crisp little moment of everyday luxury. Refreshing, naturally sweet and beautifully satisfying from the very first bite.',

  nutrition: {
    energy: '~60 kcal',
    carbohydrates: '~15g',
    fibre: '~3g',
    natural: 'Fresh',
    naturalNote: 'real fruit goodness',
  },

  faqs: [
    {
      question: 'Where do these New Zealand Gala Apples come from?',
      answer:
        'These apples are grown in New Zealand and selected for their crisp texture, sweetness and appearance.',
    },
    {
      question: 'How should I store them?',
      answer:
        'Keep them refrigerated to help preserve their crispness and natural freshness.',
    },
    {
      question: 'How do I know they are ready to enjoy?',
      answer:
        'They are ready to enjoy immediately when they feel firm and crisp.',
    },
  ],

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

  about:
    'Richly coloured, mildly sweet and beautifully crisp, Washington Red Delicious Apples are known for their distinctive deep-red skin and classic apple character. Their juicy bite and gentle sweetness make them perfect for everyday snacking, fruit platters and refreshing moments throughout the day.',

  storage:
    'Keep refrigerated for maximum freshness. Store in the crisper drawer and wash just before eating.',

  ripenessGuide:
    'Choose apples that feel firm and have smooth, deeply coloured skin. A fresh Red Delicious should feel crisp and juicy when bitten into.',

  whyLoveIt: [
    {
      title: 'Carefully selected',
      description:
        'Each apple is selected for appearance, firmness and overall eating quality.'
    },
    {
      title: 'Classic sweetness',
      description:
        'A gentle natural sweetness with a crisp, refreshing bite.'
    },
    {
      title: 'Premium quality',
      description:
        'Sourced from Washington for a refined everyday fruit experience.'
    }
  ],

  experience:
    'A beautifully classic fruit experience. Enjoy the gentle sweetness, crisp texture and refreshing character of Washington Red Delicious Apples at their freshest.',

  highlights: [
    'Naturally sweet',
    'Crisp & juicy',
    'Premium quality'
  ],

  nutrition: {
    energy: '52',
    energyUnit: 'kcal',
    carbohydrates: '14g',
    carbohydratesNote: 'Naturally occurring carbohydrates',
    fibre: '2.4g',
    fibreNote: 'Dietary fibre',
    natural: 'Fresh',
    naturalNote: 'Real fruit goodness'
  },

  faqs: [
    {
      question: 'Where are these apples from?',
      answer: 'These Red Delicious Apples are sourced from Washington, USA.'
    },
    {
      question: 'How should I store them?',
      answer:
        'Keep them refrigerated in the crisper drawer to maintain their freshness and crisp texture.'
    },
    {
      question: 'How do I know they are ready to eat?',
      answer:
        'They should feel firm with smooth, richly coloured skin. They are best enjoyed crisp and chilled.'
    },
    {
      question: 'How much do I receive?',
      answer:
        'The current pack contains 4 apples weighing approximately 700–750g.'
    }
  ],

  variants: [
    {
      label: '4 pcs',
      price: 389,
      compareAtPrice: 649
    }
  ]
},

{
  id: 'shine-muscat',
  name: 'Shine Muscat Seedless Grapes',
  origin: 'China',
  quantity: '500g',
  badge: 'PREMIUM',
  rating: 5,
  reviewCount: 1,

  about:
    'Known for their beautiful appearance, crisp bite and intensely aromatic sweetness, Shine Muscat grapes offer a distinctly premium grape experience. Naturally seedless and wonderfully juicy, they are made for slow snacking, elegant fruit platters and refreshing moments.',

  storage:
    'Keep refrigerated in their original packaging or a breathable container. Wash gently just before eating.',

  ripenessGuide:
    'Look for plump, firm grapes with a fresh appearance and vibrant colour. The best berries should feel crisp and juicy when bitten into.',

  whyLoveIt: [
    {
      title: 'Premium grape variety',
      description:
        'Shine Muscat is prized for its distinctive aroma, crisp texture and naturally sweet flavour.'
    },
    {
      title: 'Naturally seedless',
      description:
        'Enjoy the entire grape without the distraction of seeds.'
    },
    {
      title: 'Beautifully aromatic',
      description:
        'A fragrant sweetness that makes every bite feel a little more special.'
    }
  ],

  experience:
    'Crisp, aromatic and naturally sweet — Shine Muscat grapes turn an ordinary snack into a small luxury. Best enjoyed chilled and straight from the fridge.',

  highlights: [
    'Naturally seedless',
    'Crisp & juicy',
    'Premium quality'
  ],

  nutrition: {
    energy: '69',
    energyUnit: 'kcal',
    carbohydrates: '18g',
    carbohydratesNote: 'Naturally occurring carbohydrates',
    fibre: '0.9g',
    fibreNote: 'Dietary fibre',
    natural: 'Fresh',
    naturalNote: 'Naturally sweet fruit'
  },

  faqs: [
    {
      question: 'Where are these grapes from?',
      answer: 'These Shine Muscat grapes are sourced from China.'
    },
    {
      question: 'Are they seedless?',
      answer: 'Yes. Shine Muscat grapes are naturally seedless.'
    },
    {
      question: 'How should I store them?',
      answer:
        'Keep them refrigerated and wash them gently just before eating.'
    },
    {
      question: 'How should I enjoy them?',
      answer:
        'They are excellent chilled on their own, in fruit platters or alongside desserts and cheese.'
    },
    {
      question: 'How much do I receive?',
      answer: 'The current pack contains 500g of Shine Muscat grapes.'
    }
  ],

  variants: [
    {
      label: '500g',
      price: 300,
      compareAtPrice: 500
    }
  ]
},

{
  id: 'turkish-cherries',
  name: 'Turkish Cherries',
  origin: 'Turkey',
  quantity: 'Select your weight',
  badge: 'PREMIUM',

  about:
    'Glossy, juicy and naturally sweet with a gentle touch of tartness, Turkish Cherries deliver the kind of flavour that makes you reach for just one more. Carefully selected during their season, they bring a beautiful balance of freshness, sweetness and premium quality.',

  storage:
    'Keep refrigerated as soon as possible after receiving. Store unwashed and wash gently just before eating.',

  ripenessGuide:
    'Look for cherries with glossy skin, rich colour and firm flesh. They should feel plump and juicy rather than soft or shrivelled.',

  whyLoveIt: [
    {
      title: 'Exceptional flavour',
      description:
        'A naturally sweet flavour balanced by just the right amount of refreshing tartness.'
    },
    {
      title: 'Premium seasonal fruit',
      description:
        'Carefully selected to capture the best of the cherry season.'
    },
    {
      title: 'Naturally juicy',
      description:
        'Firm, succulent cherries that deliver a satisfying bite.'
    }
  ],

  experience:
    'A little taste of seasonal luxury. Chill them, place them on a beautiful platter and let their natural sweetness do the rest.',

  highlights: [
    'Juicy & sweet',
    'Seasonal luxury',
    'Premium quality'
  ],

  nutrition: {
    energy: '63',
    energyUnit: 'kcal',
    carbohydrates: '16g',
    carbohydratesNote: 'Naturally occurring carbohydrates',
    fibre: '2.1g',
    fibreNote: 'Dietary fibre',
    natural: 'Fresh',
    naturalNote: 'Naturally sweet fruit'
  },

  faqs: [
    {
      question: 'Where are these cherries from?',
      answer: 'These premium cherries are sourced from Turkey.'
    },
    {
      question: 'How should I store them?',
      answer:
        'Refrigerate them promptly and wash gently immediately before eating.'
    },
    {
      question: 'What do they taste like?',
      answer:
        'They have a naturally sweet flavour with a refreshing, gently tart finish.'
    },
    {
      question: 'Are they suitable for fruit platters?',
      answer:
        'Absolutely. Their glossy appearance and rich colour make them especially beautiful on fruit platters.'
    },
    {
      question: 'What pack sizes are available?',
      answer:
        'You can currently choose between 250g, 500g and 2kg options.'
    }
  ],

  variants: [
    {
      label: '250g',
      price: 500
    },
    {
      label: '500g',
      price: 900
    },
    {
      label: '2kg',
      price: 3200
    }
  ]
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

  about:
    'Creamy, buttery and wonderfully versatile, Kenyan Avocados are loved for their smooth texture and rich yet delicate flavour. From toast and salads to smoothies and dips, this is one fruit that fits effortlessly into almost anything.',

  storage:
    'Keep at room temperature while it ripens. Once ripe, move it to the refrigerator to slow further ripening and maintain freshness.',

  ripenessGuide:
    'A ripe avocado should yield slightly to gentle pressure without feeling mushy. If it is still firm, allow it to ripen naturally at room temperature.',

  whyLoveIt: [
    {
      title: 'Rich & creamy',
      description:
        'A naturally smooth, buttery texture that makes every bite feel indulgent.'
    },
    {
      title: 'Incredibly versatile',
      description:
        'Perfect for toast, salads, smoothies, dips or simply enjoying with a little seasoning.'
    },
    {
      title: 'Ready to ripen',
      description:
        'Enjoy it at its perfect stage by letting nature take its course over the next few days.'
    }
  ],

  experience:
    'Creamy comfort in fruit form. Slice it over warm toast, mash it into a dip or simply enjoy it with a pinch of salt and lemon.',

  highlights: [
    'Rich & creamy',
    'Highly versatile',
    'Premium quality'
  ],

  nutrition: {
    energy: '160',
    energyUnit: 'kcal',
    carbohydrates: '9g',
    carbohydratesNote: 'Naturally occurring carbohydrates',
    fibre: '7g',
    fibreNote: 'Dietary fibre',
    natural: 'Wholesome',
    naturalNote: 'Real fruit goodness'
  },

  faqs: [
    {
      question: 'Where is this avocado from?',
      answer: 'These avocados are sourced from Kenya.'
    },
    {
      question: 'How should I store it?',
      answer:
        'Keep it at room temperature until it ripens. Once ripe, refrigerate it.'
    },
    {
      question: 'How do I know when it is ripe?',
      answer:
        'Gently press the skin. A ripe avocado should have a slight give without feeling overly soft.'
    },
    {
      question: 'How long does it take to ripen?',
      answer:
        'Depending on its stage when received, it can take around 3–5 days to ripen naturally.'
    },
    {
      question: 'What can I use avocado for?',
      answer:
        'It works beautifully in toast, salads, smoothies, dips and many other dishes.'
    }
  ],

  variants: [
    {
      label: '1 pc',
      price: 249,
      compareAtPrice: 379
    }
  ]
},

{
  id: 'dragon-fruit',
  name: 'Dragon Fruit',
  origin: 'Vietnam',
  quantity: '2 pcs',
  badge: 'TRENDING',

  about:
    'Striking on the outside and beautifully delicate inside, Vietnamese Dragon Fruit is loved for its refreshing character, soft juicy texture and gentle natural sweetness. Its vibrant appearance makes it just as exciting on a fruit platter as it is refreshing on a hot afternoon.',

  storage:
    'Keep refrigerated once ripe. For the best experience, serve chilled.',

  ripenessGuide:
    'A ripe dragon fruit should have vibrant skin and give slightly when pressed gently. Avoid fruit that feels excessively soft or has damaged skin.',

  whyLoveIt: [
    {
      title: 'Naturally refreshing',
      description:
        'A light, juicy texture that makes dragon fruit especially enjoyable when served chilled.'
    },
    {
      title: 'A striking fruit',
      description:
        'Its unique appearance brings colour and personality to any fruit platter.'
    },
    {
      title: 'Delicate sweetness',
      description:
        'A subtle natural sweetness for those moments when you want something light and refreshing.'
    }
  ],

  experience:
    'Cool, refreshing and unmistakably exotic. Slice it open, chill it well and enjoy the delicate sweetness hiding beneath its dramatic exterior.',

  highlights: [
    'Exotic fruit',
    'Beautifully refreshing',
    'Freshly selected'
  ],

  nutrition: {
    energy: '60',
    energyUnit: 'kcal',
    carbohydrates: '13g',
    carbohydratesNote: 'Naturally occurring carbohydrates',
    fibre: '3g',
    fibreNote: 'Dietary fibre',
    natural: 'Fresh',
    naturalNote: 'Light & refreshing fruit'
  },

  faqs: [
    {
      question: 'Where is this dragon fruit from?',
      answer: 'These dragon fruits are sourced from Vietnam.'
    },
    {
      question: 'How should I store it?',
      answer:
        'Keep ripe dragon fruit refrigerated and serve chilled for the most refreshing experience.'
    },
    {
      question: 'How do I know it is ready to eat?',
      answer:
        'The skin should look vibrant and the fruit should give slightly when pressed gently.'
    },
    {
      question: 'How should I eat dragon fruit?',
      answer:
        'Cut it in half and scoop out the flesh, or peel and slice it for fruit bowls and platters.'
    },
    {
      question: 'How much do I receive?',
      answer: 'The current pack contains 2 pieces of dragon fruit.'
    }
  ],

  variants: [
    {
      label: '2 pcs',
      price: 250
    }
  ]
},

{
  id: 'medjoul-dates',
  name: 'Medjoul Dates',
  origin: 'UAE',
  quantity: '500g',
  badge: 'PREMIUM',
  rating: 5,
  reviewCount: 3,

  about:
    'Large, soft and naturally indulgent, Medjoul Dates are known for their rich caramel-like sweetness and luxurious texture. Their generous size and soft bite make them feel more like a dessert than an ordinary fruit — while still being completely natural.',

  storage:
    'Store in a cool, dry place away from direct sunlight. For a firmer, cooler texture, refrigerate after opening.',

  ripenessGuide:
    'Premium Medjoul Dates should feel soft and pleasantly plump with a naturally wrinkled skin. Their texture should be tender rather than dry or hard.',

  whyLoveIt: [
    {
      title: 'Naturally indulgent',
      description:
        'Deep caramel-like sweetness makes these dates feel wonderfully dessert-like.'
    },
    {
      title: 'Soft & luxurious',
      description:
        'A naturally soft, chewy texture that makes every bite rich and satisfying.'
    },
    {
      title: 'Premium classic',
      description:
        'A timeless fruit enjoyed across cultures and particularly loved for its exceptional size and texture.'
    }
  ],

  experience:
    'A little luxury, naturally. Enjoy one slowly with coffee, add them to a dessert platter or keep them close whenever you want something sweet.',

  highlights: [
    'Naturally sweet',
    'Soft & rich',
    'Premium quality'
  ],

  nutrition: {
    energy: '277',
    energyUnit: 'kcal',
    carbohydrates: '75g',
    carbohydratesNote: 'Naturally occurring carbohydrates',
    fibre: '7g',
    fibreNote: 'Dietary fibre',
    natural: 'Naturally sweet',
    naturalNote: 'Real fruit goodness'
  },

  faqs: [
    {
      question: 'Where are these Medjoul Dates from?',
      answer: 'These Medjoul Dates are sourced from the UAE.'
    },
    {
      question: 'How should I store them?',
      answer:
        'Keep them in a cool, dry place. Refrigeration can be used for a firmer texture and longer freshness.'
    },
    {
      question: 'What do Medjoul Dates taste like?',
      answer:
        'They have a rich, naturally sweet flavour often described as caramel-like, with a soft and chewy texture.'
    },
    {
      question: 'How can I enjoy them?',
      answer:
        'Enjoy them on their own, with coffee, alongside nuts and cheese, or as part of a dessert platter.'
    },
    {
      question: 'How much do I receive?',
      answer: 'The current pack contains 500g of Medjoul Dates.'
    }
  ],

  variants: [
    {
      label: '500g',
      price: 999,
      compareAtPrice: 1299
    }
  ]
},

{
  id: 'kiwi-chile',
  name: 'Kiwi',
  origin: 'Chile',
  quantity: '4 pcs',
  badge: 'BEST SELLER',
  rating: 5,
  reviewCount: 1,

  about:
    'Bright, juicy and wonderfully tangy, Chilean Kiwi brings a refreshing balance of sweetness and acidity to every bite. Beneath its distinctive fuzzy skin is vibrant green flesh with a fresh, lively flavour that works beautifully on its own or in fruit bowls.',

  storage:
    'Keep at room temperature while firm and allow it to ripen naturally. Once ripe, refrigerate to maintain freshness.',

  ripenessGuide:
    'A ripe kiwi should yield slightly when gently pressed. If it feels very firm, leave it at room temperature for a few days before enjoying.',

  whyLoveIt: [
    {
      title: 'Sweet & tangy',
      description:
        'A lively flavour profile that combines natural sweetness with a refreshing tang.'
    },
    {
      title: 'Beautifully refreshing',
      description:
        'Juicy green flesh makes kiwi an excellent choice when you want something bright and fresh.'
    },
    {
      title: 'Perfect for fruit bowls',
      description:
        'Its vibrant colour adds an instant pop to breakfast bowls, desserts and fruit platters.'
    }
  ],

  experience:
    'A little burst of freshness. Slice it, scoop it or add it to a fruit bowl — Chilean Kiwi brings brightness to almost any moment.',

  highlights: [
    'Sweet & tangy',
    'Beautifully refreshing',
    'Freshly selected'
  ],

  nutrition: {
    energy: '61',
    energyUnit: 'kcal',
    carbohydrates: '15g',
    carbohydratesNote: 'Naturally occurring carbohydrates',
    fibre: '3g',
    fibreNote: 'Dietary fibre',
    natural: 'Fresh',
    naturalNote: 'Bright & refreshing fruit'
  },

  faqs: [
    {
      question: 'Where is this kiwi from?',
      answer: 'These kiwis are sourced from Chile.'
    },
    {
      question: 'How should I store kiwi?',
      answer:
        'Keep firm kiwis at room temperature until they ripen. Once ripe, refrigerate them.'
    },
    {
      question: 'How do I know when kiwi is ready?',
      answer:
        'Gently press the fruit. A ripe kiwi should give slightly without feeling overly soft.'
    },
    {
      question: 'How can I eat kiwi?',
      answer:
        'Slice it in half and scoop out the flesh, peel and slice it, or add it to fruit bowls and desserts.'
    },
    {
      question: 'How much do I receive?',
      answer: 'The current pack contains 4 kiwis.'
    }
  ],

  variants: [
    {
      label: '4 pcs',
      price: 240,
      compareAtPrice: 300
    }
  ]
},

 {
  id: 'queen-apples',
  name: 'New Zealand Queen Apples',
  origin: 'New Zealand',
  quantity: '4 pcs · ~700–750g',
  badge: 'PREMIUM',

  about:
    'Beautifully crisp, juicy and naturally sweet, New Zealand Queen Apples are a refined apple variety with a wonderfully balanced flavour. Their fresh crunch and delicate sweetness make them an elegant everyday apple, equally at home in a fruit bowl or enjoyed straight from the fridge.',

  storage:
    'Keep refrigerated in the crisper drawer for maximum freshness. Wash just before eating.',

  ripenessGuide:
    'Choose apples that feel firm and have smooth, unblemished skin. A fresh Queen Apple should have a satisfying crisp bite and juicy texture.',

  whyLoveIt: [
    {
      title: 'Carefully selected',
      description:
        'Selected for their appearance, firmness and satisfying eating quality.'
    },
    {
      title: 'Crisp & juicy',
      description:
        'A refreshing crunch followed by naturally sweet, juicy flavour.'
    },
    {
      title: 'Premium New Zealand fruit',
      description:
        'Sourced from New Zealand for a distinctly premium apple experience.'
    }
  ],

  experience:
    'Fresh, crisp and effortlessly elegant. Chill one before eating and enjoy that satisfying first crunch of a beautifully selected New Zealand apple.',

  highlights: [
    'Crisp & juicy',
    'Naturally sweet',
    'Premium quality'
  ],

  nutrition: {
    energy: '52',
    energyUnit: 'kcal',
    carbohydrates: '14g',
    carbohydratesNote: 'Naturally occurring carbohydrates',
    fibre: '2.4g',
    fibreNote: 'Dietary fibre',
    natural: 'Fresh',
    naturalNote: 'Real fruit goodness'
  },

  faqs: [
    {
      question: 'Where are these apples from?',
      answer: 'These Queen Apples are sourced from New Zealand.'
    },
    {
      question: 'How should I store them?',
      answer:
        'Keep them refrigerated in the crisper drawer to maintain their crisp texture and freshness.'
    },
    {
      question: 'What do Queen Apples taste like?',
      answer:
        'They have a naturally sweet flavour with a refreshing, crisp and juicy bite.'
    },
    {
      question: 'How much do I receive?',
      answer:
        'The current pack contains 4 apples weighing approximately 700–750g.'
    }
  ],

  variants: [
    {
      label: '4 pcs',
      price: 349
    }
  ]
},

 {
  id: 'granny-smith',
  name: 'Granny Smith Apples',
  origin: 'USA',
  quantity: '4 pcs · ~700–750g',
  badge: 'CLASSIC',

  about:
    'Instantly recognisable by their vibrant green skin, Granny Smith Apples are famous for their firm crunch and wonderfully refreshing tartness. Their lively flavour makes them an excellent choice for those who prefer an apple with a sharper, more refreshing personality.',

  storage:
    'Keep refrigerated in the crisper drawer. Wash just before eating for the freshest experience.',

  ripenessGuide:
    'Look for firm apples with bright green, smooth skin. Granny Smiths are naturally crisp and are best enjoyed when they retain their firm texture.',

  whyLoveIt: [
    {
      title: 'Naturally tangy',
      description:
        'A refreshing tartness that gives Granny Smith its unmistakable character.'
    },
    {
      title: 'Extra crisp',
      description:
        'Firm flesh delivers a satisfying crunch with every bite.'
    },
    {
      title: 'A true classic',
      description:
        'One of the most recognisable apple varieties, loved for its bold and refreshing flavour.'
    }
  ],

  experience:
    'Sharp, crisp and refreshing. Granny Smith is the apple to reach for when you want something that wakes up your palate rather than simply tasting sweet.',

  highlights: [
    'Crisp & firm',
    'Refreshing tartness',
    'Classic variety'
  ],

  nutrition: {
    energy: '52',
    energyUnit: 'kcal',
    carbohydrates: '14g',
    carbohydratesNote: 'Naturally occurring carbohydrates',
    fibre: '2.4g',
    fibreNote: 'Dietary fibre',
    natural: 'Fresh',
    naturalNote: 'Real fruit goodness'
  },

  faqs: [
    {
      question: 'Where are these Granny Smith Apples from?',
      answer: 'These apples are sourced from the USA.'
    },
    {
      question: 'What do Granny Smith Apples taste like?',
      answer:
        'They are known for their distinctly tart, refreshing flavour and firm, crisp texture.'
    },
    {
      question: 'How should I store them?',
      answer:
        'Keep them refrigerated in the crisper drawer to preserve their crunch and freshness.'
    },
    {
      question: 'Are they good for cooking?',
      answer:
        'Yes. Their firm texture and tart flavour make them particularly versatile for both snacking and cooking.'
    },
    {
      question: 'How much do I receive?',
      answer:
        'The current pack contains 4 apples weighing approximately 700–750g.'
    }
  ],

  variants: [
    {
      label: '4 pcs',
      price: 360
    }
  ]
},

  {
  id: 'packham-pears',
  name: 'Packham Pears',
  origin: 'South Africa',
  quantity: '4 pcs · ~650–700g',
  badge: 'PREMIUM',
  rating: 5,
  reviewCount: 1,

  about:
    'Elegant, juicy and naturally fragrant, Packham Pears are loved for their soft, succulent texture and delicate sweetness. Their distinctive shape and fresh flavour make them a beautiful addition to fruit bowls while their juicy flesh makes them wonderfully satisfying on their own.',

  storage:
    'Keep firm pears at room temperature until they ripen. Once ripe, refrigerate to extend freshness.',

  ripenessGuide:
    'Gently press the area around the stem. A slight give indicates that the pear is ready to enjoy. Avoid pressing the body of the fruit as it bruises easily.',

  whyLoveIt: [
    {
      title: 'Juicy & delicate',
      description:
        'Soft, succulent flesh with a gentle natural sweetness.'
    },
    {
      title: 'Beautifully fragrant',
      description:
        'A subtle fruity aroma adds to the experience as the pear ripens.'
    },
    {
      title: 'Premium selection',
      description:
        'Carefully selected South African pears chosen for quality and eating experience.'
    }
  ],

  experience:
    'Let it ripen naturally, then take that first soft, juicy bite. Packham Pears are wonderfully gentle, refreshing and effortlessly elegant.',

  highlights: [
    'Juicy & tender',
    'Naturally sweet',
    'Premium quality'
  ],

  nutrition: {
    energy: '57',
    energyUnit: 'kcal',
    carbohydrates: '15g',
    carbohydratesNote: 'Naturally occurring carbohydrates',
    fibre: '3.1g',
    fibreNote: 'Dietary fibre',
    natural: 'Fresh',
    naturalNote: 'Naturally sweet fruit'
  },

  faqs: [
    {
      question: 'Where are these pears from?',
      answer: 'These Packham Pears are sourced from South Africa.'
    },
    {
      question: 'How do I know when they are ripe?',
      answer:
        'Gently press around the stem. A slight softness indicates that the pear is ready to eat.'
    },
    {
      question: 'Should I refrigerate them?',
      answer:
        'Keep firm pears at room temperature while they ripen. Refrigerate them once they reach your preferred ripeness.'
    },
    {
      question: 'What do Packham Pears taste like?',
      answer:
        'They have a delicate sweetness with a juicy, soft and refreshing texture.'
    },
    {
      question: 'How much do I receive?',
      answer:
        'The current pack contains 4 pears weighing approximately 650–700g.'
    }
  ],

  variants: [
    {
      label: '4 pcs',
      price: 320
    }
  ]
},

  {
  id: 'beauty-pears',
  name: 'Beauty Pears',
  origin: 'South Africa',
  quantity: '4 pcs · ~650–700g',
  badge: 'PREMIUM',

  about:
    'Delicately sweet, juicy and beautifully refreshing, South African Beauty Pears offer a wonderfully smooth fruit experience. Their naturally soft texture and elegant flavour make them a lovely choice for relaxed snacking, breakfast bowls and beautifully presented fruit platters.',

  storage:
    'Allow firm pears to ripen at room temperature. Once ripe, refrigerate them to maintain freshness.',

  ripenessGuide:
    'Press gently near the stem. The fruit should give slightly when ripe while still feeling pleasantly firm overall.',

  whyLoveIt: [
    {
      title: 'Naturally delicate',
      description:
        'A gentle sweetness and soft, juicy texture that is easy to enjoy.'
    },
    {
      title: 'Beautifully refreshing',
      description:
        'Light, juicy flavour makes these pears especially enjoyable chilled.'
    },
    {
      title: 'Carefully selected',
      description:
        'Selected for their appearance, texture and overall eating quality.'
    }
  ],

  experience:
    'Soft, juicy and naturally elegant. Give them time to ripen and enjoy them chilled for a beautifully refreshing pear experience.',

  highlights: [
    'Soft & juicy',
    'Delicately sweet',
    'Premium quality'
  ],

  nutrition: {
    energy: '57',
    energyUnit: 'kcal',
    carbohydrates: '15g',
    carbohydratesNote: 'Naturally occurring carbohydrates',
    fibre: '3.1g',
    fibreNote: 'Dietary fibre',
    natural: 'Fresh',
    naturalNote: 'Naturally sweet fruit'
  },

  faqs: [
    {
      question: 'Where are these pears from?',
      answer: 'These Beauty Pears are sourced from South Africa.'
    },
    {
      question: 'How should I store them?',
      answer:
        'Keep them at room temperature while firm and refrigerate once they reach your preferred ripeness.'
    },
    {
      question: 'How do I know when they are ready?',
      answer:
        'A slight give around the stem is a good indication that the pear is ripe and ready to enjoy.'
    },
    {
      question: 'What do they taste like?',
      answer:
        'Beauty Pears have a delicate sweetness with a juicy and refreshing texture.'
    },
    {
      question: 'How much do I receive?',
      answer:
        'The current pack contains 4 pears weighing approximately 650–700g.'
    }
  ],

  variants: [
    {
      label: '4 pcs',
      price: 379,
      compareAtPrice: 449
    }
  ]
},

  {
  id: 'egyptian-orange',
  name: 'Egyptian Valencia Orange',
  origin: 'Egypt',
  quantity: '4 pcs · ~800–850g',
  badge: 'FRESH PICK',

  about:
    'Bright, juicy and naturally refreshing, Egyptian Valencia Oranges are loved for their vibrant citrus flavour and generous juice. Their balanced sweetness and gentle acidity make them equally enjoyable as a snack or squeezed into a refreshing glass of fresh orange juice.',

  storage:
    'Store refrigerated for maximum freshness, or keep at room temperature if you plan to enjoy them soon. Wash the skin before cutting.',

  ripenessGuide:
    'Choose oranges that feel heavy for their size, with firm skin and a fresh citrus aroma. A heavier orange generally indicates good juiciness.',

  whyLoveIt: [
    {
      title: 'Naturally juicy',
      description:
        'Packed with refreshing citrus character and plenty of natural juiciness.'
    },
    {
      title: 'Sweet citrus flavour',
      description:
        'A pleasant balance of natural sweetness and bright citrus acidity.'
    },
    {
      title: 'Perfect for juice',
      description:
        'Wonderful eaten whole and particularly satisfying when freshly squeezed.'
    }
  ],

  experience:
    'Brighten the day with a beautifully juicy orange. Peel it slowly for a refreshing snack or squeeze it fresh for a glass of sunshine.',

  highlights: [
    'Juicy & refreshing',
    'Bright citrus flavour',
    'Freshly selected'
  ],

  nutrition: {
    energy: '47',
    energyUnit: 'kcal',
    carbohydrates: '12g',
    carbohydratesNote: 'Naturally occurring carbohydrates',
    fibre: '2.4g',
    fibreNote: 'Dietary fibre',
    natural: 'Fresh',
    naturalNote: 'Naturally juicy fruit'
  },

  faqs: [
    {
      question: 'Where are these oranges from?',
      answer: 'These Valencia Oranges are sourced from Egypt.'
    },
    {
      question: 'How should I store them?',
      answer:
        'Refrigerate them for longer freshness, or keep them at room temperature if you plan to consume them soon.'
    },
    {
      question: 'How do I choose a juicy orange?',
      answer:
        'Look for oranges that feel heavy for their size and have firm, fresh-looking skin.'
    },
    {
      question: 'Are they good for fresh juice?',
      answer:
        'Yes. Valencia Oranges are particularly well suited to juicing because of their naturally juicy character.'
    },
    {
      question: 'How much do I receive?',
      answer:
        'The current pack contains 4 oranges weighing approximately 800–850g.'
    }
  ],

  variants: [
    {
      label: '4 pcs',
      price: 160
    }
  ]
},

 {
  id: 'south-african-orange',
  name: 'South African Valencia Orange',
  origin: 'South Africa',
  quantity: '4 pcs · ~800–850g',
  badge: 'PREMIUM',

  about:
    'Beautifully juicy with a bright citrus aroma and naturally balanced sweetness, South African Valencia Oranges are a refreshing classic. Their vibrant flavour and generous juice make them ideal for everyday snacking, breakfast tables and freshly squeezed juice.',

  storage:
    'Keep refrigerated for maximum freshness. They can also be kept at room temperature for short-term storage.',

  ripenessGuide:
    'Look for firm oranges that feel heavy for their size. A fresh citrus aroma and smooth, well-coloured skin are also good signs of quality.',

  whyLoveIt: [
    {
      title: 'Bright & juicy',
      description:
        'A generous burst of refreshing citrus with naturally juicy flesh.'
    },
    {
      title: 'Balanced sweetness',
      description:
        'A lively citrus flavour with a pleasant balance between sweetness and acidity.'
    },
    {
      title: 'Premium selection',
      description:
        'Carefully selected South African oranges chosen for freshness and eating quality.'
    }
  ],

  experience:
    'Fresh, bright and wonderfully juicy. Peel one for an easy snack or squeeze it fresh when you want a proper citrus pick-me-up.',

  highlights: [
    'Naturally juicy',
    'Bright & refreshing',
    'Premium quality'
  ],

  nutrition: {
    energy: '47',
    energyUnit: 'kcal',
    carbohydrates: '12g',
    carbohydratesNote: 'Naturally occurring carbohydrates',
    fibre: '2.4g',
    fibreNote: 'Dietary fibre',
    natural: 'Fresh',
    naturalNote: 'Naturally juicy fruit'
  },

  faqs: [
    {
      question: 'Where are these oranges from?',
      answer: 'These Valencia Oranges are sourced from South Africa.'
    },
    {
      question: 'How should I store them?',
      answer:
        'Refrigerate them for maximum freshness, or keep them at room temperature for short-term storage.'
    },
    {
      question: 'How do I choose a juicy orange?',
      answer:
        'Choose oranges that feel heavy for their size and have firm, fresh-looking skin.'
    },
    {
      question: 'Can I use them for fresh juice?',
      answer:
        'Yes. Their naturally juicy flesh makes them a great choice for freshly squeezed orange juice.'
    },
    {
      question: 'How much do I receive?',
      answer:
        'The current pack contains 4 oranges weighing approximately 800–850g.'
    }
  ],

  variants: [
    {
      label: '4 pcs',
      price: 200
    }
  ]
},

{
  id: 'royal-honey-murcott',
  name: 'Royal Honey Murcott (RHM)',
  origin: 'South Africa',
  quantity: '800–850g',
  badge: 'PREMIUM',

  about:
    'Royal Honey Murcott mandarins are prized for their rich sweetness, vibrant citrus aroma and wonderfully juicy segments. Carefully selected from South Africa, they offer an indulgent mandarin experience with a beautiful balance of sweetness and refreshing citrus character.',

  storage:
    'Keep refrigerated for maximum freshness. Allow the fruit to come closer to room temperature before eating for a fuller flavour.',

  ripenessGuide:
    'Choose fruit that feels heavy for its size with firm, well-coloured skin and a fresh citrus aroma. The fruit should feel juicy rather than excessively soft.',

  whyLoveIt: [
    {
      title: 'Rich natural sweetness',
      description:
        'A naturally sweet and satisfying flavour that makes every segment wonderfully indulgent.'
    },
    {
      title: 'Exceptionally juicy',
      description:
        'Generous juice and tender segments make every bite refreshing.'
    },
    {
      title: 'Premium citrus',
      description:
        'A carefully selected South African mandarin for a more elevated everyday fruit experience.'
    }
  ],

  experience:
    'Peel it, separate the segments and enjoy the fragrance before the first bite. Royal Honey Murcott brings a rich, juicy sweetness that feels like citrus at its finest.',

  highlights: [
    'Rich & sweet',
    'Exceptionally juicy',
    'Premium citrus'
  ],

  nutrition: {
    energy: '53',
    energyUnit: 'kcal',
    carbohydrates: '13g',
    carbohydratesNote: 'Naturally occurring carbohydrates',
    fibre: '1.8g',
    fibreNote: 'Dietary fibre',
    natural: 'Fresh',
    naturalNote: 'Naturally sweet citrus'
  },

  faqs: [
    {
      question: 'Where is Royal Honey Murcott from?',
      answer:
        'These Royal Honey Murcott mandarins are sourced from South Africa.'
    },
    {
      question: 'What does Royal Honey Murcott taste like?',
      answer:
        'They are known for their rich natural sweetness, juicy texture and refreshing citrus character.'
    },
    {
      question: 'How should I store them?',
      answer:
        'Keep them refrigerated for maximum freshness.'
    },
    {
      question: 'How do I know they are fresh?',
      answer:
        'Fresh mandarins should feel heavy for their size, have firm skin and carry a pleasant citrus aroma.'
    },
    {
      question: 'How much do I receive?',
      answer:
        'The current pack weighs approximately 800–850g.'
    }
  ],

  variants: [
    {
      label: '800–850g',
      price: 300
    }
  ]
},

{
  id: 'nova-mandarin',
  name: 'Nova Mandarin',
  origin: 'South Africa',
  quantity: '800–850g',
  note: 'By Sea',
  badge: 'PREMIUM',

  about:
    'Nova Mandarins are beautifully aromatic citrus fruits with a juicy texture and naturally sweet flavour. Sourced from South Africa, they offer a refreshing balance of sweetness and gentle citrus tang, making them an effortless snack throughout the day.',

  storage:
    'Keep refrigerated to preserve freshness and juiciness. Bring to room temperature briefly before eating if you prefer a more aromatic flavour.',

  ripenessGuide:
    'Look for mandarins with vibrant colour, firm skin and a pleasant citrus fragrance. Fruit that feels pleasantly heavy for its size is often particularly juicy.',

  whyLoveIt: [
    {
      title: 'Naturally aromatic',
      description:
        'A fresh citrus fragrance that becomes even more inviting as you peel the fruit.'
    },
    {
      title: 'Juicy & refreshing',
      description:
        'Tender segments with plenty of natural juice for a wonderfully refreshing bite.'
    },
    {
      title: 'Carefully sourced',
      description:
        'Selected from South Africa for a premium citrus experience.'
    }
  ],

  experience:
    'There is something satisfying about peeling a perfectly fresh mandarin. Nova delivers that fragrant first peel followed by juicy, naturally sweet citrus segments.',

  highlights: [
    'Juicy & refreshing',
    'Naturally aromatic',
    'Premium citrus'
  ],

  nutrition: {
    energy: '53',
    energyUnit: 'kcal',
    carbohydrates: '13g',
    carbohydratesNote: 'Naturally occurring carbohydrates',
    fibre: '1.8g',
    fibreNote: 'Dietary fibre',
    natural: 'Fresh',
    naturalNote: 'Naturally sweet citrus'
  },

  faqs: [
    {
      question: 'Where are these mandarins from?',
      answer: 'These Nova Mandarins are sourced from South Africa.'
    },
    {
      question: 'What does Nova Mandarin taste like?',
      answer:
        'Nova Mandarins have a naturally sweet, juicy flavour with a refreshing citrus tang.'
    },
    {
      question: 'How should I store them?',
      answer:
        'Keep them refrigerated to maintain their freshness and juiciness.'
    },
    {
      question: 'What does "By Sea" mean?',
      answer:
        'The product is noted as arriving by sea as part of its sourcing and logistics information.'
    },
    {
      question: 'How much do I receive?',
      answer:
        'The current pack weighs approximately 800–850g.'
    }
  ],

  variants: [
    {
      label: '800–850g',
      price: 299
    }
  ]
},

 {
  id: 'nadorcott',
  name: 'Nadorcott Mandarins',
  origin: 'South Africa',
  quantity: '800–850g',
  badge: 'PREMIUM',

  about:
    'Nadorcott Mandarins are loved for their deep citrus aroma, juicy texture and naturally sweet flavour. Their easy-to-enjoy segments make them an ideal everyday fruit, while their vibrant character makes them especially satisfying when served chilled.',

  storage:
    'Refrigerate for maximum freshness. Keep the skin intact until you are ready to eat the fruit.',

  ripenessGuide:
    'Fresh Nadorcott Mandarins should feel firm but juicy and have a vibrant citrus colour. A pleasant fragrance is another good sign of freshness.',

  whyLoveIt: [
    {
      title: 'Naturally sweet',
      description:
        'A smooth citrus sweetness that makes these mandarins easy to enjoy straight from the pack.'
    },
    {
      title: 'Full of flavour',
      description:
        'A lively citrus aroma and juicy texture give Nadorcott its distinctive character.'
    },
    {
      title: 'Easy everyday snack',
      description:
        'Convenient individual segments make them perfect for snacking at home, work or on the go.'
    }
  ],

  experience:
    'Peel, separate and enjoy. Nadorcott Mandarins deliver a bright, juicy citrus moment without needing anything else.',

  highlights: [
    'Naturally sweet',
    'Juicy & aromatic',
    'Easy to enjoy'
  ],

  nutrition: {
    energy: '53',
    energyUnit: 'kcal',
    carbohydrates: '13g',
    carbohydratesNote: 'Naturally occurring carbohydrates',
    fibre: '1.8g',
    fibreNote: 'Dietary fibre',
    natural: 'Fresh',
    naturalNote: 'Naturally sweet citrus'
  },

  faqs: [
    {
      question: 'Where are Nadorcott Mandarins from?',
      answer:
        'These Nadorcott Mandarins are sourced from South Africa.'
    },
    {
      question: 'What do they taste like?',
      answer:
        'They have a naturally sweet citrus flavour with a juicy texture and fresh aroma.'
    },
    {
      question: 'How should I store them?',
      answer:
        'Refrigerate them to maintain freshness and juiciness.'
    },
    {
      question: 'Are they good for snacking?',
      answer:
        'Yes. Their easy-to-separate segments make them an excellent everyday snack.'
    },
    {
      question: 'How much do I receive?',
      answer:
        'The current pack weighs approximately 800–850g.'
    }
  ],

  variants: [
    {
      label: '800–850g',
      price: 300
    }
  ]
},

  {
  id: 'red-globe',
  name: 'Red Globe Grapes',
  origin: 'China',
  quantity: '500g',
  badge: 'FRESH PICK',

  about:
    'Large, beautifully coloured and wonderfully juicy, Red Globe Grapes are known for their generous size and crisp, satisfying bite. Their naturally sweet flavour and vibrant appearance make them an excellent choice for snacking, fruit platters and entertaining.',

  storage:
    'Keep refrigerated in their original packaging or a breathable container. Wash gently just before eating.',

  ripenessGuide:
    'Look for plump grapes with smooth, intact skin and a fresh appearance. The berries should feel firm and juicy rather than soft or shrivelled.',

  whyLoveIt: [
    {
      title: 'Beautifully large',
      description:
        'Distinctively generous berries that make every handful feel substantial.'
    },
    {
      title: 'Crisp & juicy',
      description:
        'A satisfying bite followed by refreshing natural juiciness.'
    },
    {
      title: 'Naturally sweet',
      description:
        'A smooth fruit sweetness that makes them effortless to enjoy on their own.'
    }
  ],

  experience:
    'Big, crisp and juicy. Keep them chilled and enjoy a handful whenever you want a refreshing fruit break.',

  highlights: [
    'Large & juicy',
    'Crisp bite',
    'Naturally sweet'
  ],

  nutrition: {
    energy: '69',
    energyUnit: 'kcal',
    carbohydrates: '18g',
    carbohydratesNote: 'Naturally occurring carbohydrates',
    fibre: '0.9g',
    fibreNote: 'Dietary fibre',
    natural: 'Fresh',
    naturalNote: 'Naturally sweet fruit'
  },

  faqs: [
    {
      question: 'Where are these grapes from?',
      answer: 'These Red Globe Grapes are sourced from China.'
    },
    {
      question: 'What makes Red Globe Grapes different?',
      answer:
        'They are known for their particularly large berries, attractive colour and juicy, crisp texture.'
    },
    {
      question: 'How should I store them?',
      answer:
        'Keep them refrigerated and wash them gently just before eating.'
    },
    {
      question: 'Are they good for fruit platters?',
      answer:
        'Yes. Their large size and vibrant colour make them especially attractive on fruit platters.'
    },
    {
      question: 'How much do I receive?',
      answer:
        'The current pack contains 500g of Red Globe Grapes.'
    }
  ],

  variants: [
    {
      label: '500g',
      price: 300
    }
  ]
},

{
  id: 'black-finger',
  name: 'Black Finger Grapes',
  origin: 'China',
  quantity: '500g',
  badge: 'PREMIUM',

  about:
    'Distinctively elongated, dark and beautifully glossy, Black Finger Grapes bring a striking look together with a crisp, juicy bite. Their naturally sweet flavour and unusual shape make them a standout choice for premium snacking and elegant fruit presentation.',

  storage:
    'Keep refrigerated in a breathable container or their original packaging. Wash gently just before eating.',

  ripenessGuide:
    'Look for firm, plump berries with deep colour and smooth skin. The grapes should feel crisp and juicy when bitten into.',

  whyLoveIt: [
    {
      title: 'Distinctive shape',
      description:
        'Their elegant elongated shape makes Black Finger Grapes instantly recognisable.'
    },
    {
      title: 'Crisp & juicy',
      description:
        'A satisfying crunch followed by refreshing natural juiciness.'
    },
    {
      title: 'Premium presentation',
      description:
        'Their deep colour and unusual form make them particularly striking on a fruit platter.'
    }
  ],

  experience:
    'A grape with attitude. Deep in colour, elegantly shaped and wonderfully juicy, Black Finger Grapes make even a simple snack feel a little more premium.',

  highlights: [
    'Distinctive shape',
    'Crisp & juicy',
    'Premium quality'
  ],

  nutrition: {
    energy: '69',
    energyUnit: 'kcal',
    carbohydrates: '18g',
    carbohydratesNote: 'Naturally occurring carbohydrates',
    fibre: '0.9g',
    fibreNote: 'Dietary fibre',
    natural: 'Fresh',
    naturalNote: 'Naturally sweet fruit'
  },

  faqs: [
    {
      question: 'Where are these grapes from?',
      answer: 'These Black Finger Grapes are sourced from China.'
    },
    {
      question: 'What makes Black Finger Grapes unique?',
      answer:
        'Their elongated shape, deep colour and crisp, juicy texture give them a distinctive premium appearance.'
    },
    {
      question: 'How should I store them?',
      answer:
        'Keep them refrigerated and wash them gently just before eating.'
    },
    {
      question: 'Are they good for entertaining?',
      answer:
        'Yes. Their unusual shape and dark colour make them especially attractive on fruit platters.'
    },
    {
      question: 'How much do I receive?',
      answer:
        'The current pack contains 500g of Black Finger Grapes.'
    }
  ],

  variants: [
    {
      label: '500g',
      price: 399
    }
  ]
},

 {
  id: 'blueberries',
  name: 'Blueberries',
  origin: 'Peru',
  quantity: '125g',
  badge: 'FRESH PICK',

  about:
    'Small, vibrant and naturally sweet, Peruvian Blueberries bring a beautiful burst of flavour to every handful. Their firm skin and juicy centre make them wonderfully easy to snack on, while their deep colour adds an elegant touch to breakfast bowls, desserts and fruit platters.',

  storage:
    'Keep refrigerated and dry until ready to eat. Avoid washing until just before serving to help maintain freshness.',

  ripenessGuide:
    'Look for plump berries with deep blue-purple colour and a fresh, slightly powdery bloom on the skin. Avoid berries that appear crushed or excessively soft.',

  whyLoveIt: [
    {
      title: 'Naturally sweet',
      description:
        'Small berries packed with a pleasant natural sweetness and refreshing flavour.'
    },
    {
      title: 'Fresh & juicy',
      description:
        'A firm outer skin gives way to a juicy centre with every bite.'
    },
    {
      title: 'Beautifully versatile',
      description:
        'Perfect for snacking, breakfast bowls, desserts, smoothies and elegant fruit platters.'
    }
  ],

  experience:
    'Pop one in, then another. Peruvian Blueberries are effortlessly snackable — fresh, juicy and just sweet enough to keep you reaching for the next one.',

  highlights: [
    'Naturally sweet',
    'Fresh & juicy',
    'Beautifully versatile'
  ],

  nutrition: {
    energy: '57',
    energyUnit: 'kcal',
    carbohydrates: '14g',
    carbohydratesNote: 'Naturally occurring carbohydrates',
    fibre: '2.4g',
    fibreNote: 'Dietary fibre',
    natural: 'Fresh',
    naturalNote: 'Real fruit goodness'
  },

  faqs: [
    {
      question: 'Where are these blueberries from?',
      answer: 'These blueberries are sourced from Peru.'
    },
    {
      question: 'How should I store them?',
      answer:
        'Keep them refrigerated and dry. Wash them only just before eating.'
    },
    {
      question: 'How do I know they are fresh?',
      answer:
        'Fresh blueberries should be plump, firm and deeply coloured, often with a natural powdery bloom on their skin.'
    },
    {
      question: 'What can I use blueberries for?',
      answer:
        'Enjoy them on their own, in breakfast bowls, desserts, smoothies or fruit platters.'
    },
    {
      question: 'How much do I receive?',
      answer: 'The current pack contains 125g of blueberries.'
    }
  ],

  variants: [
    {
      label: '125g',
      price: 300
    }
  ]
},

 {
  id: 'new-zealand-kiwi',
  name: 'Kiwi',
  origin: 'New Zealand',
  quantity: '4 pcs',
  badge: 'PREMIUM',

  about:
    'Fresh, vibrant and naturally refreshing, New Zealand Kiwis are loved for their bright green flesh, juicy texture and distinctive sweet-tangy flavour. Their beautiful colour and refreshing character make them a natural favourite for breakfast bowls, fruit platters and everyday snacking.',

  storage:
    'Keep firm kiwis at room temperature until they ripen. Once ripe, refrigerate to maintain freshness.',

  ripenessGuide:
    'Gently press the fruit with your fingertips. A ripe kiwi should yield slightly without feeling overly soft.',

  whyLoveIt: [
    {
      title: 'Sweet & tangy',
      description:
        'A lively balance of natural sweetness and refreshing citrus-like tanginess.'
    },
    {
      title: 'Beautifully refreshing',
      description:
        'Juicy green flesh gives every bite a bright and refreshing character.'
    },
    {
      title: 'Premium New Zealand fruit',
      description:
        'Carefully selected for a refined kiwi experience with excellent texture and flavour.'
    }
  ],

  experience:
    'Slice it open and reveal that beautiful green centre. New Zealand Kiwi brings a bright little burst of freshness to your day.',

  highlights: [
    'Sweet & tangy',
    'Juicy & refreshing',
    'Premium quality'
  ],

  nutrition: {
    energy: '61',
    energyUnit: 'kcal',
    carbohydrates: '15g',
    carbohydratesNote: 'Naturally occurring carbohydrates',
    fibre: '3g',
    fibreNote: 'Dietary fibre',
    natural: 'Fresh',
    naturalNote: 'Bright & refreshing fruit'
  },

  faqs: [
    {
      question: 'Where are these kiwis from?',
      answer: 'These kiwis are sourced from New Zealand.'
    },
    {
      question: 'How should I store them?',
      answer:
        'Keep firm kiwis at room temperature until ripe, then refrigerate them.'
    },
    {
      question: 'How do I know when they are ripe?',
      answer:
        'A ripe kiwi should give slightly when gently pressed.'
    },
    {
      question: 'What do they taste like?',
      answer:
        'They have a refreshing balance of natural sweetness and tanginess.'
    },
    {
      question: 'How much do I receive?',
      answer: 'The current pack contains 4 kiwis.'
    }
  ],

  variants: [
    {
      label: '4 pcs',
      price: 299
    }
  ]
},

{
  id: 'golden-kiwi',
  name: 'Golden Kiwi',
  origin: 'New Zealand',
  quantity: '4 pcs',
  badge: 'PREMIUM',

  about:
    'Golden Kiwi offers a smoother, sweeter and more delicate take on the classic kiwi. With beautiful golden flesh, a juicy texture and naturally mellow sweetness, this New Zealand fruit is an elegant choice when you want something refreshing without the sharper tang of green kiwi.',

  storage:
    'Keep firm Golden Kiwis at room temperature until ripe. Refrigerate once ripe to preserve their freshness.',

  ripenessGuide:
    'Gently press the fruit. A ripe Golden Kiwi should have a slight give while remaining pleasantly firm.',

  whyLoveIt: [
    {
      title: 'Naturally sweeter',
      description:
        'A mellow, naturally sweet flavour with less sharpness than traditional green kiwi.'
    },
    {
      title: 'Smooth & juicy',
      description:
        'Golden flesh delivers a soft, juicy texture that is incredibly easy to enjoy.'
    },
    {
      title: 'Beautifully different',
      description:
        'Its golden interior makes it a striking addition to breakfast bowls and fruit platters.'
    }
  ],

  experience:
    'Golden, juicy and wonderfully mellow. If classic kiwi is a little too tangy for you, this is the softer, sweeter side of the family.',

  highlights: [
    'Naturally sweet',
    'Smooth & juicy',
    'Premium quality'
  ],

  nutrition: {
    energy: '63',
    energyUnit: 'kcal',
    carbohydrates: '15g',
    carbohydratesNote: 'Naturally occurring carbohydrates',
    fibre: '1.4g',
    fibreNote: 'Dietary fibre',
    natural: 'Fresh',
    naturalNote: 'Naturally sweet fruit'
  },

  faqs: [
    {
      question: 'Where is this Golden Kiwi from?',
      answer: 'These Golden Kiwis are sourced from New Zealand.'
    },
    {
      question: 'How is Golden Kiwi different from green kiwi?',
      answer:
        'Golden Kiwi is generally sweeter and more mellow, with a softer flavour and beautiful golden flesh.'
    },
    {
      question: 'How should I store it?',
      answer:
        'Keep firm fruit at room temperature until ripe, then refrigerate.'
    },
    {
      question: 'How do I know when it is ready?',
      answer:
        'It should give slightly when gently pressed without feeling mushy.'
    },
    {
      question: 'How much do I receive?',
      answer: 'The current pack contains 4 Golden Kiwis.'
    }
  ],

  variants: [
    {
      label: '4 pcs',
      price: 400,
      compareAtPrice: 419
    }
  ]
},

 {
  id: 'chausa-mango',
  name: 'Chausa Mango',
  origin: 'India',
  quantity: '2 pcs · ~750–800g',
  badge: 'PREMIUM',
  rating: 5,
  reviewCount: 1,

  about:
    'Chausa Mango is a much-loved Indian summer mango known for its intensely sweet flavour, juicy flesh and wonderfully aromatic character. When perfectly ripe, its soft golden flesh delivers the kind of rich, tropical sweetness that makes mango season feel truly special.',

  storage:
    'Keep firm mangoes at room temperature until they ripen. Once ripe, refrigerate and enjoy chilled.',

  ripenessGuide:
    'A ripe Chausa Mango should become noticeably fragrant and give gently when pressed. The fruit should feel soft and juicy without being excessively mushy.',

  whyLoveIt: [
    {
      title: 'Deeply sweet',
      description:
        'Known for its rich natural sweetness and satisfying tropical flavour.'
    },
    {
      title: 'Juicy & aromatic',
      description:
        'A fragrant mango with soft, succulent flesh when perfectly ripe.'
    },
    {
      title: 'Indian summer classic',
      description:
        'A beloved seasonal mango that captures the essence of a traditional Indian summer.'
    }
  ],

  experience:
    'Let it ripen, chill it, then get ready. Chausa is the kind of mango that needs very little introduction once that unmistakable aroma reaches you.',

  highlights: [
    'Richly sweet',
    'Juicy & aromatic',
    'Indian seasonal favourite'
  ],

  nutrition: {
    energy: '60',
    energyUnit: 'kcal',
    carbohydrates: '15g',
    carbohydratesNote: 'Naturally occurring carbohydrates',
    fibre: '1.6g',
    fibreNote: 'Dietary fibre',
    natural: 'Fresh',
    naturalNote: 'Naturally sweet seasonal fruit'
  },

  faqs: [
    {
      question: 'Where is Chausa Mango from?',
      answer:
        'Chausa Mango is an Indian mango variety and this product is sourced from India.'
    },
    {
      question: 'How do I know when it is ripe?',
      answer:
        'A ripe Chausa should feel slightly soft and develop a beautiful, naturally sweet mango aroma.'
    },
    {
      question: 'How should I store it?',
      answer:
        'Allow firm mangoes to ripen at room temperature. Refrigerate once ripe.'
    },
    {
      question: 'What does Chausa Mango taste like?',
      answer:
        'It is known for rich sweetness, juicy flesh and a strong, inviting mango aroma.'
    },
    {
      question: 'How much do I receive?',
      answer:
        'The current pack contains 2 mangoes weighing approximately 750–800g.'
    }
  ],

  variants: [
    {
      label: '2 pcs',
      price: 250
    }
  ]
},

 {
  id: 'langda-mango',
  name: 'Langda Mango',
  origin: 'India',
  quantity: '~800g',
  badge: 'CLASSIC',

  about:
    'Langda Mango is one of India’s most recognisable traditional mango varieties, loved for its distinctive aroma, smooth juicy flesh and beautifully balanced sweetness. Its unique flavour profile makes it a favourite among mango lovers who appreciate something more nuanced than simple sweetness.',

  storage:
    'Keep mangoes at room temperature while they ripen. Once ripe, refrigerate to preserve freshness and serve chilled.',

  ripenessGuide:
    'A ripe Langda should feel slightly soft to gentle pressure and develop a noticeable fruity aroma. The skin may remain predominantly green even when ripe.',

  whyLoveIt: [
    {
      title: 'Distinctive flavour',
      description:
        'Langda has a memorable flavour profile that sets it apart from sweeter, more straightforward mango varieties.'
    },
    {
      title: 'Smooth & juicy',
      description:
        'Soft, succulent flesh makes it a wonderfully satisfying mango when ripe.'
    },
    {
      title: 'Indian classic',
      description:
        'A traditional favourite with a long-standing place in India’s mango culture.'
    }
  ],

  experience:
    'Not every great mango needs to shout. Langda wins you over with its aroma, smooth texture and unmistakably distinctive Indian mango character.',

  highlights: [
    'Distinctive flavour',
    'Smooth & juicy',
    'Indian classic'
  ],

  nutrition: {
    energy: '60',
    energyUnit: 'kcal',
    carbohydrates: '15g',
    carbohydratesNote: 'Naturally occurring carbohydrates',
    fibre: '1.6g',
    fibreNote: 'Dietary fibre',
    natural: 'Fresh',
    naturalNote: 'Naturally sweet seasonal fruit'
  },

  faqs: [
    {
      question: 'Where is Langda Mango from?',
      answer:
        'Langda is a traditional Indian mango variety and this product is sourced from India.'
    },
    {
      question: 'How do I know when Langda is ripe?',
      answer:
        'It should give slightly when gently pressed and develop a noticeable fruity aroma. Its skin can remain green even when ripe.'
    },
    {
      question: 'How should I store it?',
      answer:
        'Keep it at room temperature while ripening and refrigerate once ripe.'
    },
    {
      question: 'What does Langda taste like?',
      answer:
        'It has a distinctive, aromatic mango flavour with smooth juicy flesh and balanced sweetness.'
    },
    {
      question: 'How much do I receive?',
      answer: 'The current pack weighs approximately 800g.'
    }
  ],

  variants: [
    {
      label: '800g',
      price: 200
    }
  ]
},

 {
  id: 'kimia-dates',
  name: 'Kimia Dates',
  origin: 'Iran',
  quantity: '500g',
  badge: 'PREMIUM',

  about:
    'Soft, dark and naturally rich, Kimia Dates are known for their moist texture and deep caramel-like sweetness. Sourced from Iran, they offer a wonderfully tender bite and make an indulgent everyday snack for anyone who appreciates naturally sweet fruit.',

  storage:
    'Store in a cool, dry place away from direct sunlight. Refrigerate after opening for a firmer texture and extended freshness.',

  ripenessGuide:
    'Kimia Dates are naturally soft and moist. Look for dates with a deep, even colour and a tender texture without excessive dryness.',

  whyLoveIt: [
    {
      title: 'Soft & moist',
      description:
        'A naturally tender texture that makes Kimia Dates particularly easy to enjoy.'
    },
    {
      title: 'Rich natural sweetness',
      description:
        'Deep, caramel-like sweetness without needing anything added.'
    },
    {
      title: 'Premium Iranian dates',
      description:
        'Carefully selected for their characteristic texture, colour and flavour.'
    }
  ],

  experience:
    'Soft, rich and wonderfully satisfying. Kimia Dates are the kind of fruit that quietly doubles as dessert.',

  highlights: [
    'Soft & moist',
    'Richly sweet',
    'Premium quality'
  ],

  nutrition: {
    energy: '277',
    energyUnit: 'kcal',
    carbohydrates: '75g',
    carbohydratesNote: 'Naturally occurring carbohydrates',
    fibre: '7g',
    fibreNote: 'Dietary fibre',
    natural: 'Naturally sweet',
    naturalNote: 'Real fruit goodness'
  },

  faqs: [
    {
      question: 'Where are these Kimia Dates from?',
      answer: 'These Kimia Dates are sourced from Iran.'
    },
    {
      question: 'What are Kimia Dates like?',
      answer:
        'They are known for their soft, moist texture and rich natural sweetness.'
    },
    {
      question: 'How should I store them?',
      answer:
        'Store them in a cool, dry place. Refrigeration is recommended after opening.'
    },
    {
      question: 'What do they taste like?',
      answer:
        'They have a rich, naturally sweet flavour with a deep caramel-like character.'
    },
    {
      question: 'How much do I receive?',
      answer: 'The current pack contains 500g of Kimia Dates.'
    }
  ],

  variants: [
    {
      label: '500g',
      price: 349,
      compareAtPrice: 399
    }
  ]
},

 {
  id: 'zahidi-dates',
  name: 'Zahidi Dates',
  origin: 'Iraq',
  quantity: 'Select your weight',
  badge: 'PREMIUM',

  about:
    'Zahidi Dates are a distinctive Iraqi date variety appreciated for their golden appearance, pleasantly firm texture and naturally sweet, nutty flavour. Less soft than some of the richer date varieties, Zahidi offers a more structured bite while remaining naturally satisfying.',

  storage:
    'Keep in a cool, dry place away from direct sunlight. Refrigerate for longer storage and a firmer, cooler texture.',

  ripenessGuide:
    'Look for dates with an attractive golden-brown colour and firm yet pleasantly chewy texture. They should feel fresh rather than excessively dry.',

  whyLoveIt: [
    {
      title: 'Naturally nutty',
      description:
        'A subtle nutty character gives Zahidi Dates a distinctive flavour compared with softer date varieties.'
    },
    {
      title: 'Firm & chewy',
      description:
        'A more structured texture for those who prefer their dates with a satisfying bite.'
    },
    {
      title: 'Traditional Iraqi variety',
      description:
        'A classic date variety with a character all its own.'
    }
  ],

  experience:
    'Golden, gently sweet and satisfyingly chewy. Zahidi is the date for someone who likes a little more bite with their sweetness.',

  highlights: [
    'Naturally sweet',
    'Firm & chewy',
    'Distinctive variety'
  ],

  nutrition: {
    energy: '282',
    energyUnit: 'kcal',
    carbohydrates: '75g',
    carbohydratesNote: 'Naturally occurring carbohydrates',
    fibre: '6.7g',
    fibreNote: 'Dietary fibre',
    natural: 'Naturally sweet',
    naturalNote: 'Real fruit goodness'
  },

  faqs: [
    {
      question: 'Where are these dates from?',
      answer: 'These Zahidi Dates are sourced from Iraq.'
    },
    {
      question: 'What do Zahidi Dates taste like?',
      answer:
        'They have a naturally sweet flavour with a subtle nutty character and a pleasantly chewy texture.'
    },
    {
      question: 'How are they different from soft dates?',
      answer:
        'Zahidi Dates generally have a firmer, more structured texture than very soft date varieties.'
    },
    {
      question: 'How should I store them?',
      answer:
        'Store them in a cool, dry place. Refrigeration is recommended for longer storage.'
    },
    {
      question: 'What sizes are available?',
      answer:
        'The current options are 250g and 500g.'
    }
  ],

  variants: [
    {
      label: '250g',
      price: 349
    },
    {
      label: '500g',
      price: 349
    }
  ]
},

 {
  id: 'alig-dates',
  name: 'Alig Dates',
  origin: 'Tunisia',
  quantity: '200g',
  badge: 'PREMIUM',

  about:
    'Alig Dates are a traditional Tunisian date variety known for their naturally sweet flavour, tender texture and rich Mediterranean character. Their balanced sweetness makes them an enjoyable little treat when you want something naturally indulgent without an overwhelming richness.',

  storage:
    'Store in a cool, dry place away from direct sunlight. Refrigerate after opening to maintain freshness for longer.',

  ripenessGuide:
    'Fresh Alig Dates should have an even natural colour and a tender, pleasantly chewy texture. Avoid fruit that feels excessively dry or damaged.',

  whyLoveIt: [
    {
      title: 'Naturally sweet',
      description:
        'Gentle natural sweetness makes them an easy everyday treat.'
    },
    {
      title: 'Tender texture',
      description:
        'A pleasantly soft and chewy bite that makes them easy to snack on.'
    },
    {
      title: 'Tunisian character',
      description:
        'A traditional North African date variety with its own distinctive flavour profile.'
    }
  ],

  experience:
    'Small, sweet and wonderfully satisfying. Alig Dates bring a taste of Tunisia to your fruit shelf in a beautifully simple form.',

  highlights: [
    'Naturally sweet',
    'Tender & chewy',
    'Tunisian variety'
  ],

  nutrition: {
    energy: '277',
    energyUnit: 'kcal',
    carbohydrates: '75g',
    carbohydratesNote: 'Naturally occurring carbohydrates',
    fibre: '7g',
    fibreNote: 'Dietary fibre',
    natural: 'Naturally sweet',
    naturalNote: 'Real fruit goodness'
  },

  faqs: [
    {
      question: 'Where are these dates from?',
      answer: 'These Alig Dates are sourced from Tunisia.'
    },
    {
      question: 'What do Alig Dates taste like?',
      answer:
        'They have a naturally sweet flavour with a tender, pleasantly chewy texture.'
    },
    {
      question: 'How should I store them?',
      answer:
        'Keep them in a cool, dry place away from direct sunlight. Refrigerate after opening.'
    },
    {
      question: 'How can I enjoy them?',
      answer:
        'Enjoy them directly as a snack, alongside nuts and cheese, or as part of a dessert or fruit platter.'
    },
    {
      question: 'How much do I receive?',
      answer: 'The current pack contains 200g of Alig Dates.'
    }
  ],

  variants: [
    {
      label: '200g',
      price: 100,
      compareAtPrice: 120
    }
  ]
},
]