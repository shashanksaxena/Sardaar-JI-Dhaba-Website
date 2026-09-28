const openingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const business = {
    name: 'Sardaar Ji Dhaba',
    established: 2018,
    siteUrl: 'https://sardaarjidhaba.com',
    phone: {
        display: '+91 88828 97431',
        e164: '+918882897431',
    },
    hours: {
        display: '11:00 AM - 11:00 PM',
        opens: '11:00',
        closes: '23:00',
        days: openingDays,
    },
    cuisine: ['Punjabi', 'North Indian'],
    priceRange: '₹₹', // TODO: confirm the current price range before publishing.
    logo: '/images/logo/sardaar-ji-prayagraj.jpg',
    email: 'sardaarjifoods@gmail.com',
    social: {
        instagramHandle: '@sardaarjidhaba',
        instagramUrl: 'https://www.instagram.com/sardaarjidhaba/',
        tripadvisorUrl: null, // TODO: add the verified TripAdvisor profile URL, if one exists.
    },
    serviceDetails: {
        reservations: null, // TODO: confirm whether reservations are accepted.
        delivery: null, // TODO: confirm delivery availability by outlet.
        takeaway: null, // TODO: confirm takeaway availability by outlet.
        parking: null, // TODO: confirm parking availability by outlet.
        familyGroupSeating: null, // TODO: confirm seating suitability and group capacity.
        averageSpendForTwo: null, // TODO: add a verified current average cost for two.
    },
    orderUrl: 'https://www.zomato.com/allahabad/sardaar-ji-1-civil-lines',
    outlets: [
        {
            id: 'noida',
            city: 'Noida',
            streetAddress: 'The Aranya, UGF-37C, Hotmart, Sector 119',
            postalCode: '201316', // TODO: verify the outlet pincode.
            addressRegion: 'Uttar Pradesh',
            latitude: 28.5897917, // TODO: verify the outlet coordinates.
            longitude: 77.4045819, // TODO: verify the outlet coordinates.
            googleBusinessProfileUrl: 'https://www.google.com/maps/place/Sardaar+Ji+Dhaba/@28.5897917,77.4045819,17z/data=!3m1!4b1!4m6!3m5!1s0x390cef9968db7e91:0xef20c2f12f647fa8!8m2!3d28.5897917!4d77.4045819!16s%2Fg%2F11qntlnhyr?entry=ttu&g_ep=EgoyMDI2MDkwNi4wIKXMDSoASAFQAw%3D%3D', // TODO: verify this is the Noida Google Business Profile URL.
            mapUrl: 'https://www.google.com/maps/place/Sardaar+Ji+Dhaba/@28.5897917,77.4045819,17z/data=!3m1!4b1!4m6!3m5!1s0x390cef9968db7e91:0xef20c2f12f647fa8!8m2!3d28.5897917!4d77.4045819!16s%2Fg%2F11qntlnhyr?entry=ttu&g_ep=EgoyMDI2MDkwNi4wIKXMDSoASAFQAw%3D%3D',
            note: 'The original stop. Familiar faces, fresh tandoor.',
            accent: 'terracotta',
            image: '/images/restaurant/dining-room.jpg',
        },
        {
            id: 'prayagraj',
            city: 'Prayagraj',
            streetAddress: '138C, Mahatma Gandhi Marg, near El Chico, Civil Lines',
            postalCode: '211001',
            addressRegion: 'Uttar Pradesh',
            latitude: 25.435801, // TODO: verify the outlet coordinates.
            longitude: 81.8463, // TODO: verify the outlet coordinates.
            googleBusinessProfileUrl: 'https://maps.app.goo.gl/au6ouvfipTnczGyV9', // TODO: verify this is the Prayagraj Google Business Profile URL.
            mapUrl: 'https://maps.app.goo.gl/au6ouvfipTnczGyV9',
            note: 'The same generous table, a different city.',
            accent: 'green',
            image: '/images/restaurant/dhaba-exterior.jpg',
        },
    ],
};

export const brand = {
    name: business.name,
    tagline: `Authentic Dhaba Taste Since ${business.established}`,
    siteUrl: business.siteUrl,
    phone: business.phone.display,
    phoneLink: business.phone.e164,
    email: business.email,
    instagram: business.social.instagramHandle,
    instagramUrl: business.social.instagramUrl,
    googleBusinessUrl: business.outlets[1].googleBusinessProfileUrl,
    orderUrl: business.orderUrl,
    whatsapp: `https://wa.me/${business.phone.e164.slice(1)}?text=${encodeURIComponent(`Hi, I would like to know more about ${business.name}.`)}`,
    logo: business.logo,
};

export const locations = business.outlets.map(outlet => ({
    ...outlet,
    area: `${outlet.streetAddress}, ${outlet.city}, ${outlet.addressRegion} ${outlet.postalCode}`,
    hours: business.hours.display,
    availability: '',
}));