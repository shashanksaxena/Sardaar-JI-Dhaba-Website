import { business } from '@/config/business';
import { LocalLandingPage } from '@/components/LocalLandingPage';

const outlet = business.outlets.find(location => location.id === 'noida');

export default function NoidaPage() {
    return (
        <LocalLandingPage
            city="Noida"
            canonicalPath="/locations/noida"
            heading="Sardaar Ji Dhaba in Noida"
            address={outlet?.streetAddress ?? 'Noida, Uttar Pradesh'}
            postalCode={outlet?.postalCode ?? undefined}
            hours={outlet?.hours ?? undefined}
            description="Visit Sardaar Ji Dhaba in Noida for Punjabi and North Indian food, including tandoori favourites, curries, breads and other dhaba-style dishes. The configured outlet address is The Aranya, Sector 119, Noida. Use this page to review the address, opening hours, contact number and map directions before travelling. Menu availability and prices can change, so contact the restaurant if you are visiting for a particular dish or need current details. If you have a food allergy or dietary requirement, speak to the team about ingredients and preparation before ordering. Opening hours can vary, so call to confirm today's schedule before travelling."
            image={outlet?.image ?? '/images/restaurant/dining-room.jpg'}
        />
    );
}
