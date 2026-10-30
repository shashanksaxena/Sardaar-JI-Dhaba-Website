import { business, locations } from '../config/business';

const noidaDepartments = business.schemaDepartments.filter(department => department.city === 'Noida');
const prayagrajDepartment = business.schemaDepartments.find(department => department.city === 'Prayagraj')!;

export type FaqItem = {
    question: string;
    answer: string;
};

const homeFaqs: FaqItem[] = [
    {
        question: 'How can I enquire about a Sardaar Ji Dhaba franchise?',
        answer: 'Complete the franchise enquiry form on this website with your contact details, preferred city and approximate investment budget. The team can then review your interest and contact you about an initial conversation.',
    },
    {
        question: 'Where does Sardaar Ji Dhaba currently operate?',
        answer: 'Sardaar Ji Dhaba has an operating presence in Noida and Prayagraj. Share the city you are considering so the team can discuss your enquiry.',
    },
    {
        question: 'What investment is required to open a Sardaar Ji Dhaba franchise?',
        answer: 'A verified franchise investment amount has not been published. The enquiry form asks for your approximate budget so the team can understand your readiness and discuss requirements directly.',
    },
    {
        question: 'Do I need restaurant experience to enquire?',
        answer: 'You can submit an enquiry whether you currently operate a restaurant, have hospitality experience or are a first-time entrepreneur. Share your background so the team can understand your plans.',
    },
    {
        question: 'Does submitting an enquiry guarantee franchise approval?',
        answer: 'No. Submitting the form is only an initial enquiry. Any potential partnership would depend on further discussion, suitability and mutually agreed terms.',
    },
];

// TODO: Confirm reservations, delivery, takeaway, group seating, and average-spend details before replacing these generic answers.
const cityFaqs = (location: (typeof locations)[number]): FaqItem[] => [
    {
        question: `What cuisine does ${business.name} serve in ${location.city}?`,
        answer: 'The menu features Punjabi and North Indian cuisine, alongside Desi Chinese dishes.',
    },
    {
        question: `What are the opening hours of ${business.name} in ${location.city}?`,
        answer: `The ${location.city} outlet is open daily from ${business.hours.display}.`,
    },
    {
        question: `Where is ${business.name} in ${location.city} located?`,
        answer: location.city === 'Noida'
            ? `The Noida branches are in ${noidaDepartments.map(department => department.streetAddress).join(' and ')}, Noida, Uttar Pradesh.`
            : `The Prayagraj branch is at ${prayagrajDepartment.streetAddress}, Prayagraj, ${prayagrajDepartment.addressRegion} ${prayagrajDepartment.postalCode}.`,
    },
    {
        question: `What signature dishes are listed at ${business.name} in ${location.city}?`,
        answer: 'The menu lists Tandoori Chicken, Kadhai Chicken, Dal Makhani and Paneer Tikka, with Punjabi, North Indian and Desi Chinese options.',
    },
    {
        question: `Does the ${location.city} outlet serve vegetarian and non-vegetarian food?`,
        answer: 'The published menu includes vegetarian items such as paneer and dal dishes, as well as chicken, mutton, egg and fish dishes. Ask the outlet about current availability and ingredients.',
    },
    {
        question: `Can I reserve a table or order delivery from the ${location.city} outlet?`,
        answer: 'Reservation, delivery and takeaway availability have not been confirmed for this outlet. Please call directly to check.',
    },
    {
        question: `Is the ${location.city} outlet suitable for families and groups?`,
        answer: 'Group seating and reservation details have not been confirmed. Call the outlet to ask about seating for your party before visiting.',
    },
    {
        question: `What is the average cost for two at ${business.name} in ${location.city}?`,
        answer: 'An average cost for two has not been confirmed. Review the current menu and contact the outlet for up-to-date prices.',
    },
];

const consultingFaqs: FaqItem[] = [
    {
        question: 'Who does RestroGrowth work with?',
        answer: 'RestroGrowth is designed for small and medium restaurants, including independent single-outlet operators and growing businesses planning their next stage.',
    },
    {
        question: 'What restaurant consulting services are available?',
        answer: 'Support can cover restaurant operations and SOPs, food cost and profitability, marketing and customer growth, technology and automation, launch planning, and business performance reviews.',
    },
    {
        question: 'Is RestroGrowth consulting remote or on-site?',
        answer: 'The service is remote-first. On-site support can be discussed when the restaurant and the work require it.',
    },
    {
        question: 'How do I get started with RestroGrowth?',
        answer: 'Submit the consulting enquiry form with your restaurant details and the area where you need help. The team can then review your requirements and arrange an initial conversation.',
    },
];

export function getFaqItems(route: string): FaqItem[] {
    if (route === '/') return homeFaqs;
    if (route === '/restaurant-consulting') return consultingFaqs;
    const location = locations.find(item => route === `/locations/${item.id}` || route === `/${item.id}`);
    return location ? cityFaqs(location) : [];
}