export type MenuItem = {
  id: string;
  name: string;
  description: string;
  category: 'Signatures' | 'Vegetarian' | 'Tandoor' | 'Breads' | 'Beverages';
  price: string;
  mark?: string;
  image?: string;
};

export const brand = {
  name: 'Sardaar JI Dhaba',
  tagline: 'Authentic Dhaba Taste Since 2018',
  phone: '8882897431',
  email: 'sardaarjifoods@gmail.com',
  instagram: '@sardaarjidhaba',
  whatsapp: 'https://wa.me/918882897431?text=Hi%2C%20I%20need%20more%20information%20about%20the%20franchise',
  logo: '/images/logo/sardaar-ji-prayagraj.jpg',
};

export const menu: MenuItem[] = [
  { id: 'butter-chicken', name: 'Butter Chicken', description: 'A rich, gently spiced classic from the non-veg menu.', category: 'Signatures', price: '₹260 / 440 / 680', mark: 'Sardaar JI special', image: '/images/restaurant/signature-thali.jpg' },
  { id: 'dal-makhani', name: 'Dal Makhani', description: 'Slow-cooked black lentils, finished with butter and time.', category: 'Signatures', price: '₹170 / 280', mark: 'Dhaba comfort', image: '/images/menu/buffet-menu.jpg' },
  { id: 'paneer-tikka', name: 'Paneer Tikka', description: 'Smoky, marinated paneer with the tandoor doing the work.', category: 'Tandoor', price: '₹240 / 380', image: '/images/menu/menu-vegetarian.jpg' },
  { id: 'hara-bhara-kebab', name: 'Hara Bhara Kebab', description: 'A green, generous vegetarian starter for the table.', category: 'Vegetarian', price: '₹240', image: '/images/menu/menu-vegetarian.jpg' },
  { id: 'crispy-corn', name: 'Crispy Corn', description: 'Crunchy, spiced and made for sharing before the mains.', category: 'Vegetarian', price: '₹240', image: '/images/menu/menu-vegetarian.jpg' },
  { id: 'tandoori-chicken', name: 'Tandoori Chicken', description: 'Yoghurt-marinated, kissed by the clay oven fire.', category: 'Tandoor', price: '₹260 / 360 / 480', image: '/images/menu/menu-non-vegetarian.jpg' },
  { id: 'chicken-tikka', name: 'Chicken Tikka', description: 'Charred chicken pieces with a bright Punjabi marinade.', category: 'Tandoor', price: '₹240 / 300 / 380', image: '/images/menu/menu-non-vegetarian.jpg' },
  { id: 'garlic-naan', name: 'Garlic Naan', description: 'Tandoor blistered, brushed with garlic and coriander.', category: 'Breads', price: '₹55 / 60', image: '/images/restaurant/signature-thali.jpg' },
  { id: 'jeera-rice', name: 'Jeera Rice', description: 'Fragrant basmati rice with toasted cumin.', category: 'Vegetarian', price: '₹140', image: '/images/restaurant/signature-thali.jpg' },
  { id: 'matka-lassi', name: 'Matka Lassi', description: 'Thick, chilled and served in an earthen cup.', category: 'Beverages', price: '₹120', image: '/images/people/guest-table.jpg' },
  { id: 'masala-chaas', name: 'Masala Chaas', description: 'Cool, lightly spiced and made for a long meal.', category: 'Beverages', price: '₹60', image: '/images/people/guest-table.jpg' },
];

export const locations = [
  { id: 'noida', city: 'Noida', area: 'Address and map link to be confirmed', note: 'The original stop. Familiar faces, fresh tandoor.', hours: 'Timings to be confirmed', accent: 'terracotta', image: '/images/restaurant/dining-room.jpg' },
  { id: 'prayagraj', city: 'Prayagraj', area: '138 B, MG Marg, Civil Lines, near Bank of Baroda & El-Chico', note: 'The same generous table, a different city.', hours: 'Delivery hours shown on menu: 11:00 AM – 12:00 AM', accent: 'green', image: '/images/restaurant/dhaba-exterior.jpg' },
];

export const menuBoards = [
  { id: 'vegetarian', title: 'Vegetarian menu', image: '/images/menu/menu-vegetarian.jpg', alt: 'Sardaar JI Dhaba vegetarian menu board' },
  { id: 'non-vegetarian', title: 'Non-vegetarian menu', image: '/images/menu/menu-non-vegetarian.jpg', alt: 'Sardaar JI Dhaba non-vegetarian menu board' },
  { id: 'buffet', title: 'Buffet menu', image: '/images/menu/buffet-menu.jpg', alt: 'Sardaar JI Dhaba buffet menu board' },
];

export const stories = [
  { id: 'butter-chicken', category: 'From the tandoor', title: 'Why our butter chicken tastes like a late-night highway stop', excerpt: 'The char, the cream, the last piece of naan. A little story behind our most-ordered plate.', read: '4 min read', image: '/images/restaurant/signature-thali.jpg' },
  { id: 'dal-makhani', category: 'Kitchen notes', title: 'A pot that refuses to hurry: the making of Dal Makhani', excerpt: 'Good dal takes its time. Ours starts before sunrise and ends when it is ready.', read: '3 min read', image: '/images/menu/buffet-menu.jpg' },
  { id: 'paneer-tikka', category: 'Tandoor diaries', title: 'The red marinade on our paneer tikka', excerpt: 'A close look at the smoky, tangy, unapologetically Punjabi bite.', read: '5 min read', image: '/images/menu/menu-vegetarian.jpg' },
];

export const values = [
  { number: '01', title: 'Feed people properly', copy: 'No tiny portions. No rushed plates. A dhaba table should feel like someone was waiting for you.' },
  { number: '02', title: 'Keep the fire honest', copy: 'Our food gets its personality from time, heat and hands — not shortcuts or theatrics.' },
  { number: '03', title: 'Make room at the table', copy: 'Whether you arrive alone, with a family, or with a bus full of friends, there is always another chair.' },
];