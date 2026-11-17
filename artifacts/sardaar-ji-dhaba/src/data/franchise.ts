export type FranchiseFormat = {
    id: string;
    name: string;
    investment: string;
    budget: number;
    area: string;
    seating: string;
    image: string;
    imageAlt: string;
    summary: string;
    features: string[];
    suitableFor: string[];
    breakdown: { expense: string; amount: number }[];
};

export const franchiseFee = 300000;
export const franchiseRoyalty = '5% of monthly net sales';

export const franchiseFormats: FranchiseFormat[] = [
    {
        id: 'express',
        name: 'Express Dhaba',
        investment: '₹10–12 lakh',
        budget: 1000000,
        area: '300–500 sq. ft.',
        seating: '8–15 guests',
        image: '/images/restaurant/signature-thali.jpg',
        imageAlt: 'Punjabi thali served at Sardaar Ji Dhaba',
        summary: 'A compact, takeaway-led format with a focused Punjabi and North Indian menu.',
        features: ['Quick-service restaurant', 'Takeaway focused with limited dine-in', 'Compact kitchen', 'Focused Punjabi and North Indian menu'],
        suitableFor: ['High-street locations', 'Smaller cities', 'Compact commercial spaces', 'First-time restaurant entrepreneurs'],
        breakdown: [
            { expense: 'Franchise fee', amount: 300000 },
            { expense: 'Interiors and furniture', amount: 150000 },
            { expense: 'Kitchen equipment', amount: 200000 },
            { expense: 'Electrical, plumbing and exhaust', amount: 80000 },
            { expense: 'Branding and signage', amount: 40000 },
            { expense: 'Licences and registrations', amount: 30000 },
            { expense: 'POS, utensils and CCTV', amount: 50000 },
            { expense: 'Initial inventory', amount: 50000 },
            { expense: 'Working capital', amount: 100000 },
        ],
    },
    {
        id: 'classic',
        name: 'Classic Dhaba',
        investment: '₹18–22 lakh',
        budget: 1800000,
        area: '700–1,000 sq. ft.',
        seating: '25–40 guests',
        image: '/images/restaurant/dining-room.jpg',
        imageAlt: 'Dining room at Sardaar Ji Dhaba',
        summary: 'A full-service restaurant format for dine-in, takeaway and online delivery.',
        features: ['Full-service Punjabi restaurant', 'Dine-in, takeaway and online food delivery', 'Full commercial kitchen', 'Expanded Punjabi and North Indian menu'],
        suitableFor: ['Main commercial markets', 'Family dining locations', 'Established residential and commercial areas'],
        breakdown: [
            { expense: 'Franchise fee', amount: 300000 },
            { expense: 'Interiors and furniture', amount: 350000 },
            { expense: 'Kitchen equipment', amount: 400000 },
            { expense: 'Electrical, plumbing and exhaust', amount: 150000 },
            { expense: 'Branding and signage', amount: 60000 },
            { expense: 'Licences and registrations', amount: 40000 },
            { expense: 'POS, utensils and CCTV', amount: 80000 },
            { expense: 'Initial inventory', amount: 80000 },
            { expense: 'Working capital', amount: 200000 },
            { expense: 'Contingency', amount: 140000 },
        ],
    },
    {
        id: 'premium',
        name: 'Premium Dhaba',
        investment: '₹30–40 lakh',
        budget: 3000000,
        area: '1,200–1,800 sq. ft.',
        seating: '50–70 guests',
        image: '/images/restaurant/celebration-room.jpg',
        imageAlt: 'Restaurant dining room set for a family gathering',
        summary: 'A larger family restaurant with premium interiors and an enhanced dine-in experience.',
        features: ['Premium family restaurant', 'Full-service dining and premium interiors', 'Live tandoor', 'Expanded menu and enhanced dining experience'],
        suitableFor: ['Prime commercial locations', 'Large family dining markets', 'Premium high-footfall areas'],
        breakdown: [
            { expense: 'Franchise fee', amount: 300000 },
            { expense: 'Interiors and furniture', amount: 700000 },
            { expense: 'Kitchen equipment', amount: 700000 },
            { expense: 'Electrical, plumbing and exhaust', amount: 300000 },
            { expense: 'Branding and signage', amount: 100000 },
            { expense: 'Licences and registrations', amount: 50000 },
            { expense: 'POS, utensils and CCTV', amount: 120000 },
            { expense: 'Initial inventory', amount: 120000 },
            { expense: 'Working capital', amount: 300000 },
            { expense: 'Contingency', amount: 310000 },
        ],
    },
];

export const formatRupees = (amount: number) =>
    `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount)}`;

export const franchiseSupport = [
    { title: 'Brand support', icon: 'brand', items: ['Brand licensing and usage guidelines', 'Restaurant signage specifications', 'Interior branding guidelines'] },
    { title: 'Restaurant setup', icon: 'setup', items: ['Site evaluation and layout guidance', 'Kitchen equipment specifications', 'Kitchen workflow planning'] },
    { title: 'Training', icon: 'training', items: ['Standardised recipes and food preparation', 'Portion control', 'Kitchen staff training and customer service standards'] },
    { title: 'Operations', icon: 'operations', items: ['Standard operating procedures', 'Hygiene and food quality guidelines', 'Inventory guidance, vendor recommendations and checklists'] },
    { title: 'Marketing', icon: 'marketing', items: ['Grand opening guidance', 'Social media creatives and templates', 'Approved promotions and delivery onboarding guidance'] },
    { title: 'Launch support', icon: 'launch', items: ['Pre-opening checklist and opening coordination', 'Initial operational guidance', 'Post-launch support as specified in the agreement'] },
];

export const franchiseProcess = [
    'Submit Franchise Enquiry',
    'Initial Discussion',
    'Investment and Location Evaluation',
    'Franchise Approval and Agreement',
    'Restaurant Setup and Training',
    'Grand Opening',
];

export const franchisePartnerResponsibilities = [
    'Provide the investment',
    'Arrange suitable commercial property',
    'Obtain required local approvals and licences',
    'Hire and manage restaurant staff',
    'Manage daily restaurant operations',
    'Pay rent, utilities, salaries and monthly royalty',
    'Maintain brand and hygiene standards',
];

export const brandResponsibilities = [
    'Grant brand usage rights',
    'Provide menu, recipes and operational SOPs',
    'Guide restaurant setup',
    'Conduct agreed initial training',
    'Provide branding guidelines',
    'Provide operational and launch guidance',
    'Conduct quality and brand compliance reviews',
];
