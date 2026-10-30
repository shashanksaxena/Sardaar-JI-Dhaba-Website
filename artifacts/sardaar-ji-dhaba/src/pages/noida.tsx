import { business } from '@/config/business';
import { LocalLandingPage } from '@/components/LocalLandingPage';

const outlet = business.outlets.find(location => location.id === 'noida');

export default function NoidaPage() {
    return (
        <LocalLandingPage
            city="Noida"
            heading="Sardaar Ji Dhaba in Noida"
            address={outlet?.streetAddress ?? 'Noida, Uttar Pradesh'}
            postalCode={outlet?.postalCode ?? undefined}
            description="Find Sardaar Ji Dhaba in Noida and plan your visit for Punjabi and North Indian food. Check the published outlet address and directions before travelling."
            image={outlet?.image ?? '/images/restaurant/dining-room.jpg'}
        />
    );
}
