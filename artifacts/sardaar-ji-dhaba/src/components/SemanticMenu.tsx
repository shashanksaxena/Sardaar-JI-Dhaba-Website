import { menu, type MenuItem } from '@/data/content';

const nonVegetarianPattern = /\b(chicken|mutton|egg|fish|prawn|prawns|pork|beef)\b/i;
const dietByItemId: Record<string, 'vegetarian' | 'non-vegetarian'> = {
    'angara-masala-chaap': 'vegetarian',
};

const categoryOrder = [
    'Starters',
    'Main Course',
    'Paneer',
    'Vegetarian',
    'Breads',
    'Rice & Biryani',
    'Raita & Salad',
    'Soups',
    'Desi Style Chinese',
    'Desserts',
    'Beverages',
];

const categoryLabels: Record<string, string> = {
    Breads: 'Tandoor & Breads',
};

function dietaryStatus(item: MenuItem): 'vegetarian' | 'non-vegetarian' | 'unconfirmed' {
    return dietByItemId[item.id] ?? (nonVegetarianPattern.test(`${item.name} ${item.description}`) ? 'non-vegetarian' : 'unconfirmed');
}

function categoryId(category: string) {
    return category.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-');
}

function MenuItemRow({ item }: { item: MenuItem }) {
    const diet = dietaryStatus(item);
    const dietLabel = diet === 'vegetarian' ? 'Vegetarian' : diet === 'non-vegetarian' ? 'Non-vegetarian' : 'Ask about ingredients';
    const dietClass = diet === 'vegetarian' ? 'menu-item--vegetarian' : diet === 'non-vegetarian' ? 'menu-item--non-vegetarian' : 'menu-item--diet-unconfirmed';
    const dietBadgeClass = diet === 'vegetarian' ? 'text-emerald-800' : diet === 'non-vegetarian' ? 'text-amber-900' : 'text-muted-foreground';
    const schemaDiet = diet === 'vegetarian' ? 'https://schema.org/VegetarianDiet' : diet === 'non-vegetarian' ? 'https://schema.org/NonVegetarianDiet' : undefined;
    const schemaPrice = item.price?.match(/\d+(?:\.\d{1,2})?/)?.[0];

    return (
        <li
            className={`menu-item grid gap-2 border-b border-foreground/10 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start ${dietClass}`}
            itemScope
            itemType="https://schema.org/MenuItem"
        >
            <div>
                <span className="flex items-center gap-2 font-display text-xl" itemProp="name">
                    {schemaDiet && <span aria-hidden="true" className={`grid h-4 w-4 shrink-0 place-items-center border-2 ${diet === 'vegetarian' ? 'border-emerald-700' : 'border-amber-900'}`}>
                        {diet === 'vegetarian'
                            ? <span className="h-2 w-2 rounded-full bg-emerald-700" />
                            : <span className="h-0 w-0 border-x-[5px] border-b-[9px] border-x-transparent border-b-amber-900" />}
                    </span>}
                    {item.name}
                </span>
                {item.description && !/pending confirmation/i.test(item.description) && <span className="mt-1 block text-sm leading-6 text-muted-foreground" itemProp="description">{item.description}</span>}
                <span className={`mt-2 inline-flex text-xs font-semibold ${dietBadgeClass}`}>{dietLabel}</span>
                {schemaDiet && <meta itemProp="suitableForDiet" content={schemaDiet} />}
            </div>
            <span className="text-sm font-semibold text-primary" itemProp="offers" itemScope itemType="https://schema.org/Offer">
                {item.price ? (
                    <>
                        <span>{item.price}</span>
                        {schemaPrice && <meta itemProp="price" content={schemaPrice} />}
                        <meta itemProp="priceCurrency" content="INR" />
                    </>
                ) : (
                    <span>Ask for current price</span>
                )}
            </span>
        </li>
    );
}

export function SemanticMenu({ items = menu, showCategoryHeadings = true }: { items?: MenuItem[]; showCategoryHeadings?: boolean }) {
    const categories = [...new Set(items.map(item => item.category))].sort((left, right) => {
        const leftIndex = categoryOrder.indexOf(left);
        const rightIndex = categoryOrder.indexOf(right);
        return (leftIndex < 0 ? categoryOrder.length : leftIndex) - (rightIndex < 0 ? categoryOrder.length : rightIndex) || left.localeCompare(right);
    });

    return (
        <div className="space-y-10" itemScope itemType="https://schema.org/Menu">
            <meta itemProp="name" content="Sardaar Ji Dhaba Menu" />
            {categories.map(category => (
                <section key={category} aria-labelledby={categoryId(category)} itemScope itemType="https://schema.org/MenuSection">
                    {showCategoryHeadings && <h2 id={categoryId(category)} className="mb-2 border-b border-foreground/15 pb-3 font-display text-3xl" itemProp="name">
                        {categoryLabels[category] ?? category}
                    </h2>}
                    <ul className="m-0 list-none p-0" itemProp="hasMenuItem">
                        {items.filter(item => item.category === category).map(item => <MenuItemRow key={item.id} item={item} />)}
                    </ul>
                </section>
            ))}
        </div>
    );
}
