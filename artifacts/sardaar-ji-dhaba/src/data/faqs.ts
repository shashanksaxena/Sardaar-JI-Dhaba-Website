import { business, locations } from '../config/business';

const noidaDepartments = business.schemaDepartments.filter(department => department.city === 'Noida');
const prayagrajDepartment = business.schemaDepartments.find(department => department.city === 'Prayagraj')!;

export type FaqItem = {
    question: string;
    answer: string;
};

const homeFaqs: FaqItem[] = [
    {
        question: `What cuisine does ${business.name} serve?`,
        answer: `The menu features Punjabi and North Indian cuisine, alongside Desi Chinese dishes.`,
    },
    {
        question: `What are the opening hours of ${business.name} in Noida and Prayagraj?`,
        answer: `Both outlets are open daily from ${business.hours.display}.`,
    },
    {
        question: `Where is ${business.name} located?`,
        answer: `The Noida outlets are in ${noidaDepartments.map(department => department.streetAddress).join(' and ')}. The Prayagraj outlet is at ${prayagrajDepartment.streetAddress}, Prayagraj, ${prayagrajDepartment.addressRegion} ${prayagrajDepartment.postalCode}.`,
    },
    {
        question: `What signature dishes are listed by ${business.name}?`,
        answer: 'The menu lists Punjabi and North Indian favourites including Tandoori Chicken, Kadhai Chicken, Dal Makhani and Paneer Tikka, alongside Desi Chinese dishes.',
    },
    {
        question: `Does ${business.name} serve vegetarian and non-vegetarian food?`,
        answer: 'The published menu includes vegetarian items such as paneer and dal dishes, as well as chicken, mutton, egg and fish dishes. Ask the outlet about current availability and ingredients.',
    },
    {
        question: `Does ${business.name} take reservations or offer delivery and takeaway?`,
        answer: 'Reservation, delivery and takeaway availability have not been confirmed. Please call the outlet directly to check before placing plans or an order.',
    },
    {
        question: `Is ${business.name} suitable for families and groups?`,
        answer: 'Group seating and reservation details have not been confirmed. Call the outlet to ask about seating for your party before visiting.',
    },
    {
        question: `What is the average cost for two at ${business.name}?`,
        answer: 'An average cost for two has not been confirmed. Review the current menu and contact the outlet for up-to-date prices.',
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