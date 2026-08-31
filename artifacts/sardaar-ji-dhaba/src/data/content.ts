export type MenuItem = {
  id: string;
  name: string;
  description: string;
  category: 'Signatures' | 'Vegetarian' | 'Tandoor' | 'Breads' | 'Beverages';
  price: string;
  mark?: string;
};

export const brand = {
  name: 'Sardaar JI Dhaba',
  tagline: 'Authentic Dhaba Taste Since 2018',
  phone: '8882897431',
  email: 'sardaarjifoods@gmail.com',
  instagram: '@sardaarjidhaba',
  whatsapp: 'https://wa.me/918882897431',
};

export const menu: MenuItem[] = [
  { id: 'butter-chicken', name: 'Butter Chicken', description: 'Charred chicken, tomato makhani, a whisper of smoke.', category: 'Signatures', price: '₹ —', mark: 'House favourite' },
  { id: 'dal-makhani', name: 'Dal Makhani', description: 'Slow-cooked black lentils, finished with cultured butter.', category: 'Signatures', price: '₹ —', mark: '12 hour simmer' },
  { id: 'paneer-tikka', name: 'Paneer Tikka', description: 'Tandoori paneer, peppers, onion and our red marinade.', category: 'Tandoor', price: '₹ —' },
  { id: 'amritsari-fish', name: 'Amritsari Fish', description: 'Crisp gram-flour batter, ajwain and a squeeze of lime.', category: 'Signatures', price: '₹ —' },
  { id: 'chole-bhature', name: 'Chole Bhature', description: 'Spiced chickpeas with cloud-soft, fried bhature.', category: 'Vegetarian', price: '₹ —' },
  { id: 'sarson-saag', name: 'Sarson Saag & Makki Roti', description: 'Winter greens, corn flatbread and a knob of butter.', category: 'Vegetarian', price: '₹ —' },
  { id: 'tandoori-chicken', name: 'Tandoori Chicken', description: 'Yoghurt-marinated, kissed by the clay oven fire.', category: 'Tandoor', price: '₹ —' },
  { id: 'garlic-naan', name: 'Garlic Naan', description: 'Tandoor blistered, brushed with garlic and coriander.', category: 'Breads', price: '₹ —' },
  { id: 'lassi', name: 'Matka Lassi', description: 'Thick, chilled and served in an earthen cup.', category: 'Beverages', price: '₹ —' },
  { id: 'chai', name: 'Cutting Chai', description: 'Strong, milky tea with cardamom and roadside comfort.', category: 'Beverages', price: '₹ —' },
];

export const locations = [
  { id: 'noida', city: 'Noida', area: 'Address placeholder — to be provided', note: 'The original stop. Familiar faces, fresh tandoor.', hours: 'Timings placeholder', accent: 'terracotta' },
  { id: 'prayagraj', city: 'Prayagraj', area: 'Address placeholder — to be provided', note: 'The same generous table, a different city.', hours: 'Timings placeholder', accent: 'green' },
];

export const stories = [
  { id: 'butter-chicken', category: 'From the tandoor', title: 'Why our butter chicken tastes like a late-night highway stop', excerpt: 'The char, the cream, the last piece of naan. A little story behind our most-ordered plate.', read: '4 min read' },
  { id: 'dal-makhani', category: 'Kitchen notes', title: 'A pot that refuses to hurry: the making of Dal Makhani', excerpt: 'Good dal takes its time. Ours starts before sunrise and ends when it is ready.', read: '3 min read' },
  { id: 'paneer-tikka', category: 'Tandoor diaries', title: 'The red marinade on our paneer tikka', excerpt: 'A close look at the smoky, tangy, unapologetically Punjabi bite.', read: '5 min read' },
];

export const values = [
  { number: '01', title: 'Feed people properly', copy: 'No tiny portions. No rushed plates. A dhaba table should feel like someone was waiting for you.' },
  { number: '02', title: 'Keep the fire honest', copy: 'Our food gets its personality from time, heat and hands — not shortcuts or theatrics.' },
  { number: '03', title: 'Make room at the table', copy: 'Whether you arrive alone, with a family, or with a bus full of friends, there is always another chair.' },
];