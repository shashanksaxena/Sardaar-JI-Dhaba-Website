import { business } from '@/config/business';
import { LocalLandingPage } from '@/components/LocalLandingPage';

export default function PrayagrajPage() {
    return (
        <LocalLandingPage
            city="Prayagraj"
            heading="Sardaar Ji Dhaba Prayagraj - Civil Lines"
            address="138C, Mahatma Gandhi Marg, near El Chico, Civil Lines"
            postalCode="211001"
            description="Find Sardaar Ji Dhaba at 138C, Mahatma Gandhi Marg, near El Chico in Civil Lines, Prayagraj. Visit for Punjabi and North Indian food, or use the map and ordering links to plan your meal."
            image="/images/restaurant/dhaba-exterior.jpg"
            zomatoUrl={business.orderUrl}
        />
    );
}