import { business } from '@/config/business';
import { LocalLandingPage } from '@/components/LocalLandingPage';

const outlet = business.outlets.find(location => location.id === 'prayagraj');

export default function PrayagrajPage() {
    return (
        <LocalLandingPage
            city="Prayagraj"
            canonicalPath="/locations/prayagraj"
            heading="Sardaar Ji Dhaba in Civil Lines, Prayagraj"
            address={outlet?.streetAddress ?? 'Civil Lines, Prayagraj'}
            postalCode={outlet?.postalCode ?? undefined}
            hours={outlet?.hours ?? undefined}
            mapUrl={outlet?.mapUrl ?? undefined}
            latitude={outlet?.latitude ?? null}
            longitude={outlet?.longitude ?? null}
            description="Find Sardaar Ji Dhaba in Civil Lines, Prayagraj, near El Chico on Mahatma Gandhi Marg. The outlet serves Punjabi and North Indian favourites alongside Desi Chinese dishes, with options such as Dal Makhani, Paneer Tikka, Tandoori Chicken and Kadhai Chicken listed on the menu. Use this page to check the published address, opening hours, phone number and map directions before visiting. Menu availability and prices can change, so call the restaurant if you need to confirm a specific dish or current details. If you have a food allergy or dietary requirement, ask the team about ingredients and preparation before ordering. The outlet is listed as open daily from 11:00 AM to 11:00 PM."
            image={outlet?.image ?? '/images/restaurant/dhaba-exterior.jpg'}
            zomatoUrl={business.orderUrl}
        />
    );
}
