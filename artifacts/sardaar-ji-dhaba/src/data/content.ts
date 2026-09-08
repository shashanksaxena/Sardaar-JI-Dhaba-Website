export type MenuItem = {
  id: string;
  name: string;
  description: string;
  category: 'Signatures' | 'Vegetarian' | 'Tandoor' | 'Breads' | 'Beverages';
  price: string;
  mark?: string;
  image?: string;
};

export type BlogPost = {
  id: string;
  publishedAt?: string;
  category: string;
  title: string;
  excerpt: string;
  read: string;
  image: string;
  alt: string;
  keywords: string;
  body: string[];
};

export const brand = {
  name: 'Sardaar JI Dhaba',
  tagline: 'Authentic Dhaba Taste Since 2018',
  siteUrl: 'https://sardaarjidhaba.com',
  phone: '8882897431',
  email: 'sardaarjifoods@gmail.com',
  instagram: '@sardaarjidhaba',
  whatsapp: 'https://wa.me/918882897431?text=Hi%2C%20I%20need%20more%20information%20about%20the%20franchise',
  logo: '/images/logo/sardaar-ji-prayagraj.jpg',
};

export const menu: MenuItem[] = [
  { id: 'butter-chicken', name: 'Butter Chicken', description: 'Creamy restaurant-style murgh makhani with tandoori char and a tomato-cashew gravy.', category: 'Signatures', price: '₹260 / 440 / 680', mark: 'Sardaar JI special', image: '/images/blog/restaurant-style-butter-chicken.png' },
  { id: 'dal-makhani', name: 'Dal Makhani', description: 'Slow-cooked black lentils, finished with butter, cream and dhaba patience.', category: 'Signatures', price: '₹170 / 280', mark: 'Dhaba comfort', image: '/images/blog/restaurant-style-dal-makhani.png' },
  { id: 'paneer-tikka', name: 'Paneer Tikka', description: 'Smoky marinated paneer with capsicum, onions and mint chutney.', category: 'Tandoor', price: '₹240 / 380', image: '/images/blog/restaurant-style-paneer-tikka.png' },
  { id: 'hara-bhara-kebab', name: 'Hara Bhara Kebab', description: 'A green, generous vegetarian starter for the table.', category: 'Vegetarian', price: '₹240', image: '/images/menu/menu-vegetarian.jpg' },
  { id: 'crispy-corn', name: 'Crispy Corn', description: 'Crunchy, spiced and made for sharing before the mains.', category: 'Vegetarian', price: '₹240', image: '/images/menu/menu-vegetarian.jpg' },
  { id: 'tandoori-chicken', name: 'Tandoori Chicken', description: 'Yoghurt-marinated, spice-rubbed and kissed by clay-oven fire.', category: 'Tandoor', price: '₹260 / 360 / 480', image: '/images/blog/restaurant-style-tandoori-chicken.png' },
  { id: 'chicken-tikka', name: 'Chicken Tikka', description: 'Juicy boneless chicken pieces with a bright Punjabi marinade.', category: 'Tandoor', price: '₹240 / 300 / 380', image: '/images/blog/restaurant-style-chicken-tikka.png' },
  { id: 'garlic-naan', name: 'Garlic Naan', description: 'Tandoor blistered, brushed with garlic butter and coriander.', category: 'Breads', price: '₹55 / 60', image: '/images/blog/restaurant-style-garlic-naan.png' },
  { id: 'jeera-rice', name: 'Jeera Rice', description: 'Fragrant basmati rice with toasted cumin.', category: 'Vegetarian', price: '₹140', image: '/images/restaurant/signature-thali.jpg' },
  { id: 'matka-lassi', name: 'Matka Lassi', description: 'Thick, chilled and served in an earthen cup.', category: 'Beverages', price: '₹120', image: '/images/people/guest-table.jpg' },
  { id: 'masala-chaas', name: 'Masala Chaas', description: 'Cool, lightly spiced and made for a long meal.', category: 'Beverages', price: '₹60', image: '/images/people/guest-table.jpg' },
];

export const locations = [
  { id: 'noida', city: 'Noida', area: 'Address and map link to be confirmed', mapUrl: 'https://share.google/zq5xCHFH67vrbVefk', note: 'The original stop. Familiar faces, fresh tandoor.', hours: 'Timings to be confirmed', accent: 'terracotta', image: '/images/restaurant/dining-room.jpg' },
  { id: 'prayagraj', city: 'Prayagraj', area: '138 B, MG Marg, Civil Lines, near Bank of Baroda & El-Chico', mapUrl: 'https://share.google/LtsUIeXdIUQjuwNy4', note: 'The same generous table, a different city.', hours: 'Delivery hours shown on menu: 11:00 AM - 12:00 AM', accent: 'green', image: '/images/restaurant/dhaba-exterior.jpg' },
];

export const menuBoards = [
  { id: 'vegetarian', title: 'Vegetarian menu', image: '/images/menu/menu-vegetarian.jpg', alt: 'Sardaar JI Dhaba vegetarian menu board' },
  { id: 'non-vegetarian', title: 'Non-vegetarian menu', image: '/images/menu/menu-non-vegetarian.jpg', alt: 'Sardaar JI Dhaba non-vegetarian menu board' },
  { id: 'buffet', title: 'Buffet menu', image: '/images/menu/buffet-menu.jpg', alt: 'Sardaar JI Dhaba buffet menu board' },
];

const cookingClose = 'The restaurant finish comes from patience more than heavy cream or extra masala. Taste at the end, rest the dish for a few minutes, and serve it hot with naan, roti or jeera rice. At Sardaar JI Dhaba, we look for the same balance every time: a gravy that clings, spice that stays warm, and a final bite that still feels generous.';

const baseStories: BlogPost[] = [
  {
    id: 'restaurant-style-butter-chicken',
    category: 'Recipe guide',
    title: 'How to Make Restaurant Style Butter Chicken',
    excerpt: 'A creamy murgh makhani guide with tandoori-style chicken, smooth tomato gravy and the finish guests remember.',
    read: '4 min read',
    image: '/images/blog/restaurant-style-butter-chicken.png',
    alt: 'Restaurant style butter chicken with naan in a copper bowl',
    keywords: 'restaurant style butter chicken recipe, how to make butter chicken, murgh makhani, Punjabi butter chicken',
    body: [
      'Restaurant style butter chicken starts before the gravy. Marinate boneless or bone-in chicken with thick curd, ginger-garlic paste, Kashmiri chilli, salt, garam masala, lemon juice and a spoon of mustard oil. Give it at least two hours, or overnight if you want the deeper dhaba flavour. Roast the chicken on a hot tawa, grill pan or oven until the edges catch colour. That light char is what keeps the final curry from tasting flat.',
      'For the gravy, cook tomatoes with cashews, a little onion, ginger, garlic, green chilli, bay leaf and whole spices until everything softens. Blend it smooth, then strain if you want the polished restaurant texture. Heat butter, add Kashmiri chilli powder on low flame, pour in the puree and cook until the fat begins to show at the sides.',
      'Add salt, honey or sugar to balance acidity, crushed kasuri methi and a little garam masala. Slide in the roasted chicken and simmer gently so the smoke and masala meet. Finish with cream and a final knob of butter, keeping the flame low so the gravy stays silky.',
      cookingClose,
    ],
  },
  {
    id: 'restaurant-style-kadhai-chicken',
    category: 'Recipe guide',
    title: 'How to Make Restaurant Style Kadhai Chicken',
    excerpt: 'Bold tomato masala, crunchy capsicum and freshly crushed kadhai spice for a proper dhaba-style chicken.',
    read: '4 min read',
    image: '/images/blog/restaurant-style-kadhai-chicken.png',
    alt: 'Restaurant style kadhai chicken with capsicum and onion in a black kadhai',
    keywords: 'restaurant style kadhai chicken recipe, kadhai chicken masala, dhaba style chicken curry',
    body: [
      'Kadhai chicken should taste lively, not heavy. Begin by dry roasting coriander seeds, cumin, black pepper, fennel and dried red chillies until fragrant. Crush them coarsely; do not turn them into a fine powder. This fresh kadhai masala is the difference between a regular chicken curry and the restaurant-style version with texture, aroma and a little bite in every spoonful.',
      'Heat oil in a kadhai and sear chicken pieces with salt until they lose their raw colour. Remove them, then cook onions until lightly golden. Add ginger-garlic paste, chopped tomatoes, chilli powder and turmeric. Cook the masala until it thickens and the oil separates. Return the chicken, cover and let it simmer in its own juices.',
      'When the chicken is nearly done, add diced capsicum, onion petals and the crushed kadhai masala. Keep the vegetables slightly crunchy; they should taste fresh against the rich tomato base. A spoon of butter at the end rounds the sharp edges without making the dish sweet.',
      cookingClose,
    ],
  },
  {
    id: 'restaurant-style-dal-makhani',
    category: 'Recipe guide',
    title: 'How to Make Restaurant Style Dal Makhani',
    excerpt: 'Slow black lentils, rajma, butter and cream cooked into the deep, smoky comfort of a Punjabi table.',
    read: '4 min read',
    image: '/images/blog/restaurant-style-dal-makhani.png',
    alt: 'Restaurant style dal makhani with butter and naan',
    keywords: 'restaurant style dal makhani recipe, Punjabi dal makhani, creamy black lentil dal',
    body: [
      'Dal makhani rewards time. Soak whole urad dal and a small handful of rajma overnight, then pressure cook them with salt until they are completely soft. The grains should mash easily between your fingers. Restaurant texture comes from slow simmering after this point, not from leaving the lentils undercooked or adding too much cream too early.',
      'In a heavy pot, heat butter with a little oil. Add ginger-garlic paste, tomato puree, Kashmiri chilli and a pinch of turmeric. Cook patiently until the tomato loses its raw smell and the masala turns glossy. Add the cooked dal with its liquid and begin simmering on low heat, stirring often so it does not catch at the bottom.',
      'Mash some lentils against the side of the pot as it cooks. Add hot water as needed and keep reducing. After an hour, finish with butter, cream, garam masala and crushed kasuri methi. For a smoky dhaba note, place a hot coal in a small bowl, add ghee, cover the pot for two minutes, then remove it.',
      cookingClose,
    ],
  },
  {
    id: 'restaurant-style-paneer-tikka',
    category: 'Recipe guide',
    title: 'How to Make Restaurant Style Paneer Tikka',
    excerpt: 'A tandoor-style paneer tikka method with thick marinade, high heat and smoky edges.',
    read: '4 min read',
    image: '/images/blog/restaurant-style-paneer-tikka.png',
    alt: 'Restaurant style paneer tikka skewers with chutney',
    keywords: 'restaurant style paneer tikka recipe, tandoori paneer tikka, paneer starter recipe',
    body: [
      'Paneer tikka works best when the paneer is firm, fresh and cut into generous cubes. Whisk hung curd with ginger-garlic paste, Kashmiri chilli, turmeric, garam masala, chaat masala, lemon juice, salt and mustard oil. Add a spoon of roasted besan to help the marinade grip. Toss paneer with capsicum and onion petals gently so the cubes do not break.',
      'Rest the marinated paneer for at least thirty minutes. Skewer the paneer and vegetables, brushing lightly with oil. Cook in a very hot oven, air fryer, grill pan or tandoor-style setup. The goal is quick colour on the outside while the paneer stays soft inside. Slow cooking dries paneer, so keep the heat confident.',
      'Once the edges char, brush with butter and sprinkle chaat masala. If using a pan, finish directly over flame for a few seconds with tongs, or use a short covered smoke with coal and ghee. Serve immediately with mint chutney, lemon and onion rings.',
      cookingClose,
    ],
  },
  {
    id: 'restaurant-style-tandoori-chicken',
    category: 'Recipe guide',
    title: 'How to Make Restaurant Style Tandoori Chicken',
    excerpt: 'Deep red masala, juicy chicken and smoky char without needing a full restaurant tandoor at home.',
    read: '4 min read',
    image: '/images/blog/restaurant-style-tandoori-chicken.png',
    alt: 'Restaurant style tandoori chicken with lemon and onions',
    keywords: 'restaurant style tandoori chicken recipe, dhaba tandoori chicken, Indian grilled chicken',
    body: [
      'Great tandoori chicken is built in two marinades. First, score the chicken and rub it with salt, lemon juice and ginger-garlic paste. Let it sit for twenty minutes so the seasoning reaches inside. For the second marinade, mix hung curd, Kashmiri chilli, cumin, coriander powder, garam masala, kasuri methi, mustard oil and a little roasted besan.',
      'Coat the chicken well, pushing marinade into every cut. Rest it for at least four hours. Cook on high heat in an oven, grill or air fryer, turning once and basting with butter or oil. High heat gives the familiar restaurant char, while the curd keeps the meat juicy. Avoid crowding the tray, or the chicken will steam instead of roast.',
      'When cooked through, rest the chicken for five minutes. Finish with lemon juice, chaat masala and onion rings. A brief coal smoke gives the aroma people associate with a dhaba tandoor, even when the cooking happened in a home kitchen.',
      cookingClose,
    ],
  },
  {
    id: 'restaurant-style-chicken-tikka',
    category: 'Recipe guide',
    title: 'How to Make Restaurant Style Chicken Tikka',
    excerpt: 'Boneless tandoori-style chicken tikka that stays juicy, smoky and ready for chutney.',
    read: '4 min read',
    image: '/images/blog/restaurant-style-chicken-tikka.png',
    alt: 'Restaurant style chicken tikka pieces with mint chutney',
    keywords: 'restaurant style chicken tikka recipe, tandoori chicken tikka, chicken starter recipe',
    body: [
      'Chicken tikka needs small details done right. Use boneless thigh if possible because it stays juicy under high heat. Cut even pieces and marinate with lemon juice, salt and ginger-garlic paste first. After twenty minutes, add hung curd, Kashmiri chilli, coriander powder, cumin, garam masala, black pepper, kasuri methi and mustard oil.',
      'Rest the chicken for a few hours, then thread it on skewers with slight gaps between pieces. Cook hot and fast in an oven, grill pan or tandoor. Baste once with butter and turn only when the edges begin to char. This keeps the tikka moist while giving it the smoky crust that makes restaurant starters so satisfying.',
      'Finish with chaat masala, lemon and a little melted butter. Serve with mint chutney and sliced onions, or fold the pieces into wraps. If you want a second flavour layer, toss the cooked tikka for one minute in a hot pan with butter, garlic and crushed kasuri methi.',
      cookingClose,
    ],
  },
  {
    id: 'restaurant-style-malai-kofta',
    category: 'Recipe guide',
    title: 'How to Make Restaurant Style Malai Kofta',
    excerpt: 'Soft paneer-potato kofta in a creamy cashew gravy made for naan and special dinners.',
    read: '4 min read',
    image: '/images/blog/restaurant-style-malai-kofta.png',
    alt: 'Restaurant style malai kofta in creamy gravy',
    keywords: 'restaurant style malai kofta recipe, creamy kofta curry, North Indian vegetarian curry',
    body: [
      'Malai kofta should feel festive but balanced. Mash boiled potatoes with grated paneer, cornflour, salt, garam masala and a few chopped nuts or raisins if you like a classic restaurant touch. Shape smooth balls and fry on medium heat until golden. Keep them firm enough to hold, but soft enough to break easily with a spoon.',
      'For the gravy, cook onions, tomatoes, cashews, ginger, garlic and whole spices until soft. Blend to a smooth paste and strain for a refined texture. Heat butter, add a little chilli powder and pour in the paste. Cook until glossy, then add water or milk to adjust the body. Season with salt, sugar, garam masala and kasuri methi.',
      'Add cream near the end and keep the flame low. Place kofta in the serving dish and pour hot gravy over them just before serving, so they do not become soggy. Garnish with cream, coriander and slivered nuts.',
      cookingClose,
    ],
  },
  {
    id: 'restaurant-style-shahi-paneer',
    category: 'Recipe guide',
    title: 'How to Make Restaurant Style Shahi Paneer',
    excerpt: 'Silky tomato-cashew gravy, soft paneer and the gentle sweetness of a North Indian classic.',
    read: '4 min read',
    image: '/images/blog/restaurant-style-shahi-paneer.png',
    alt: 'Restaurant style shahi paneer with paratha',
    keywords: 'restaurant style shahi paneer recipe, shahi paneer gravy, paneer curry recipe',
    body: [
      'Shahi paneer is about smoothness. Simmer tomatoes, onions, cashews, ginger, garlic, green chilli, cardamom and bay leaf until everything softens. Blend the mixture very well, then strain it if you want the restaurant-style gravy that looks glossy and feels velvety. Soak paneer cubes in warm salted water for ten minutes so they stay soft.',
      'Heat butter with a splash of oil. Add Kashmiri chilli powder on low heat, then pour in the blended gravy. Cook slowly until the raw tomato note disappears and the masala thickens. Add salt, a small pinch of sugar, garam masala and crushed kasuri methi. If the gravy feels too sharp, a little milk helps soften it before cream goes in.',
      'Add paneer gently and simmer only for a few minutes. Overcooking makes paneer rubbery. Finish with cream, ginger juliennes and coriander. The final gravy should be rich but not overly sweet, with enough spice to keep every bite interesting.',
      cookingClose,
    ],
  },
  {
    id: 'restaurant-style-chole-bhature',
    category: 'Recipe guide',
    title: 'How to Make Restaurant Style Chole Bhature',
    excerpt: 'Dark, spicy chole and puffed bhature with the proper street-side restaurant finish.',
    read: '4 min read',
    image: '/images/blog/restaurant-style-chole-bhature.png',
    alt: 'Restaurant style chole bhature with onions and green chilli',
    keywords: 'restaurant style chole bhature recipe, Punjabi chole recipe, fluffy bhature recipe',
    body: [
      'Restaurant-style chole begins with soaked chickpeas cooked until tender with tea leaves or a tea bag, black cardamom, bay leaf, cinnamon and salt. The tea gives the chole its deep colour without changing the flavour too much. Save the cooking liquid because it carries starch and spice, which help the masala become thick and glossy.',
      'For the masala, cook onions until golden, then add ginger-garlic paste, tomato puree, chole masala, coriander powder, chilli powder, cumin and amchur. Cook until oil separates. Add the chickpeas and mash a small portion to thicken the curry. Simmer with the reserved liquid until the chole look dark, clingy and restaurant-rich.',
      'For bhature, knead maida with curd, semolina, salt, sugar, a little oil and enough water to make a soft dough. Rest it, roll evenly and fry in hot oil so it puffs quickly. Serve chole with bhature, onion, pickle, lemon and green chilli.',
      cookingClose,
    ],
  },
  {
    id: 'restaurant-style-garlic-naan',
    category: 'Recipe guide',
    title: 'How to Make Restaurant Style Garlic Naan',
    excerpt: 'Soft, blistered naan brushed with garlic butter and finished with coriander.',
    read: '4 min read',
    image: '/images/blog/restaurant-style-garlic-naan.png',
    alt: 'Restaurant style garlic naan stacked near a tandoor',
    keywords: 'restaurant style garlic naan recipe, tandoori naan at home, Indian bread recipe',
    body: [
      'Garlic naan needs a soft dough and fierce heat. Mix maida with salt, sugar, curd, a little baking powder, oil and warm water. Knead until smooth, then rest until the dough relaxes and becomes easy to stretch. Divide into balls and keep them covered so the surface does not dry while you prepare the garlic butter.',
      'Mix melted butter with finely chopped garlic, coriander and a pinch of salt. Roll each dough ball into an oval or teardrop, keeping it slightly thick. For a tandoor-style finish at home, cook the naan on a very hot tawa. Wet one side lightly, place it wet-side down so it sticks, then flip the tawa over the flame to blister the top.',
      'Brush generously with garlic butter the moment it comes off the heat. Stack under a clean cloth for a minute so the naan stays soft. Serve with butter chicken, dal makhani, kadhai chicken or any gravy that deserves a proper scoop.',
      cookingClose,
    ],
  },
];

const additionalStories: BlogPost[] = [
  ['restaurant-style-rajma', '2026-08-22', 'How to Make Restaurant Style Rajma', 'Creamy kidney beans simmered in a deep onion-tomato masala for a proper Punjabi comfort plate.', '/images/blog/restaurant-style-dal-makhani.png'],
  ['restaurant-style-matar-paneer', '2026-08-15', 'How to Make Restaurant Style Matar Paneer', 'Soft paneer and sweet green peas in a bright, silky North Indian gravy.', '/images/blog/restaurant-style-shahi-paneer.png'],
  ['restaurant-style-fish-tikka', '2026-08-08', 'How to Make Restaurant Style Fish Tikka', 'A high-heat marinade that gives fish tikka smoky edges while keeping the centre tender.', '/images/blog/restaurant-style-tandoori-chicken.png'],
  ['restaurant-style-palak-paneer', '2026-08-01', 'How to Make Restaurant Style Palak Paneer', 'Blanched spinach, warm spices and paneer brought together in a fresh green curry.', '/images/blog/restaurant-style-paneer-tikka.png'],
  ['restaurant-style-chicken-biryani', '2026-07-25', 'How to Make Restaurant Style Chicken Biryani', 'Layered basmati rice, spiced chicken and saffron steam for a generous one-pot feast.', '/images/blog/restaurant-style-kadhai-chicken.png'],
  ['restaurant-style-aloo-gobi', '2026-07-18', 'How to Make Restaurant Style Aloo Gobi', 'Crisp-edged potatoes and tender cauliflower with a dry masala that clings to every bite.', '/images/blog/restaurant-style-chole-bhature.png'],
  ['restaurant-style-tandoori-prawns', '2026-07-11', 'How to Make Restaurant Style Tandoori Prawns', 'Quick-marinated prawns cooked hot enough for char, spice and a juicy finish.', '/images/blog/restaurant-style-chicken-tikka.png'],
  ['restaurant-style-kulcha', '2026-07-04', 'How to Make Restaurant Style Amritsari Kulcha', 'Stuffed, blistered bread with a crisp base and a soft centre made for chole.', '/images/blog/restaurant-style-garlic-naan.png'],
  ['restaurant-style-gajar-halwa', '2026-06-27', 'How to Make Restaurant Style Gajar Halwa', 'Slow-cooked carrots, milk, cardamom and nuts for a warm Punjabi dessert.', '/images/blog/restaurant-style-malai-kofta.png'],
  ['restaurant-style-mango-lassi', '2026-06-20', 'How to Make Restaurant Style Mango Lassi', 'Ripe mango, thick curd and cardamom blended into a cool, creamy glass.', '/images/people/guest-table.jpg'],
].map(([id, publishedAt, title, excerpt, image]) => ({
  id,
  publishedAt,
  category: 'Recipe guide',
  title,
  excerpt,
  read: '4 min read',
  image,
  alt: title,
  keywords: `${title.toLowerCase()}, Punjabi recipe, restaurant style Indian food`,
  body: [
    `Start with fresh ingredients and give the masala enough time to develop. ${excerpt}`,
    'Cook on steady heat, tasting as you go. The restaurant finish comes from balance: enough spice for character, enough fat for body and enough resting time for the flavours to settle.',
    cookingClose,
  ],
}));

export const stories: BlogPost[] = [...baseStories, ...additionalStories]
  .map((story, index) => ({ ...story, publishedAt: story.publishedAt ?? `2025-${String(10 - Math.floor(index / 2)).padStart(2, '0')}-${String(20 - index).padStart(2, '0')}` }))
  .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));

export const values = [
  { number: '01', title: 'Feed people properly', copy: 'No tiny portions. No rushed plates. A dhaba table should feel like someone was waiting for you.' },
  { number: '02', title: 'Keep the fire honest', copy: 'Our food gets its personality from time, heat and hands, not shortcuts or theatrics.' },
  { number: '03', title: 'Make room at the table', copy: 'Whether you arrive alone, with a family, or with a bus full of friends, there is always another chair.' },
];
