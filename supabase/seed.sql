-- ============================================================================
-- GlobeTrotter Curated Reference Data Seed
-- Tables: public.cities (30 cities), public.activities (120 activities)
-- ============================================================================

-- Clean existing reference data to prevent duplicate keys on re-seeding
DELETE FROM public.activities;
DELETE FROM public.cities;

-- ----------------------------------------------------------------------------
-- 1. Insert 30 Curated Global Cities
-- ----------------------------------------------------------------------------
INSERT INTO public.cities (id, name, country, region, description, image_url, cost_index, popularity_score) VALUES
-- Asia
('c1000000-0000-0000-0000-000000000001', 'Tokyo', 'Japan', 'Asia', 'Ultra-modern metropolis blending neon skyscrapers, historical shrines, and Michelin-starred dining.', 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80', 3.8, 98),
('c1000000-0000-0000-0000-000000000002', 'Kyoto', 'Japan', 'Asia', 'Ancient imperial capital home to thousands of classical Buddhist temples, gardens, and imperial palaces.', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80', 3.2, 94),
('c1000000-0000-0000-0000-000000000003', 'Osaka', 'Japan', 'Asia', 'Dynamic port city celebrated for street food nightlife, modern architecture, and historic castle.', 'https://images.unsplash.com/photo-1590559899731-a3f30bc4a039?auto=format&fit=crop&w=1200&q=80', 3.0, 91),
('c1000000-0000-0000-0000-000000000004', 'Bangkok', 'Thailand', 'Asia', 'Vibrant capital featuring ornate shrines, lively canal networks, and world-renowned street food.', 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80', 1.8, 96),
('c1000000-0000-0000-0000-000000000005', 'Singapore', 'Singapore', 'Asia', 'Futuristic garden city-state known for architectural marvels, diverse culinary cultures, and green spaces.', 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80', 4.2, 95),
('c1000000-0000-0000-0000-000000000006', 'Seoul', 'South Korea', 'Asia', 'High-tech metropolis where K-culture, royal palaces, and vibrant night markets intersect.', 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1200&q=80', 3.1, 93),
('c1000000-0000-0000-0000-000000000007', 'Bali', 'Indonesia', 'Asia', 'Tropical island paradise renowned for forested volcanic mountains, iconic rice paddies, and coral reefs.', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80', 1.9, 97),
('c1000000-0000-0000-0000-000000000008', 'Hanoi', 'Vietnam', 'Asia', 'Centuries-old capital known for French colonial architecture, ancient pagodas, and rich coffee culture.', 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=80', 1.5, 88),
('c1000000-0000-0000-0000-000000000009', 'Taipei', 'Taiwan', 'Asia', 'Bustling capital known for lively night markets, hot springs, and scenic mountain hiking trails.', 'https://images.unsplash.com/photo-1508248017013-fe55d8dd445b?auto=format&fit=crop&w=1200&q=80', 2.3, 89),
('c1000000-0000-0000-0000-000000000010', 'Mumbai', 'India', 'Asia', 'India’s bustling financial and entertainment hub, rich with colonial architecture and coastal promenades.', 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=1200&q=80', 1.7, 87),

-- Europe
('c1000000-0000-0000-0000-000000000011', 'Paris', 'France', 'Europe', 'The global center of art, fashion, gastronomy, and culture with romantic boulevards and monuments.', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80', 4.1, 99),
('c1000000-0000-0000-0000-000000000012', 'Rome', 'Italy', 'Europe', 'The Eternal City packed with nearly 3,000 years of globally influential art, architecture, and ruins.', 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80', 3.4, 98),
('c1000000-0000-0000-0000-000000000013', 'Barcelona', 'Spain', 'Europe', 'Mediterranean metropolis famed for Gaudí architecture, sunny coastal beaches, and tapas bars.', 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80', 3.0, 96),
('c1000000-0000-0000-0000-000000000014', 'London', 'United Kingdom', 'Europe', 'Iconic global city with historic royal landmarks, world-class West End theatres, and diverse boroughs.', 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80', 4.3, 98),
('c1000000-0000-0000-0000-000000000015', 'Amsterdam', 'Netherlands', 'Europe', 'Charming canal capital renowned for its artistic heritage, cycling culture, and narrow gabled houses.', 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=80', 3.7, 94),
('c1000000-0000-0000-0000-000000000016', 'Florence', 'Italy', 'Europe', 'The cradle of the Renaissance, home to world-renowned museums, marble cathedrals, and Tuscan wine.', 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=1200&q=80', 3.3, 92),
('c1000000-0000-0000-0000-000000000017', 'Prague', 'Czech Republic', 'Europe', 'City of a Hundred Spires featuring gothic churches, colorful baroque buildings, and a medieval Old Town.', 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1200&q=80', 2.4, 90),
('c1000000-0000-0000-0000-000000000018', 'Vienna', 'Austria', 'Europe', 'Imperial city shaped by classical music heritage, baroque palaces, and historic coffeehouse traditions.', 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1200&q=80', 3.5, 91),
('c1000000-0000-0000-0000-000000000019', 'Berlin', 'Germany', 'Europe', 'Dynamic capital famous for its modern history, electronic music scene, art galleries, and green parks.', 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1200&q=80', 3.0, 89),
('c1000000-0000-0000-0000-000000000020', 'Lisbon', 'Portugal', 'Europe', 'Coastal hilltop capital with pastel-colored buildings, historic tramways, and Atlantic ocean vistas.', 'https://images.unsplash.com/photo-1509840841025-9088ba78a826?auto=format&fit=crop&w=1200&q=80', 2.6, 93),

-- Middle East
('c1000000-0000-0000-0000-000000000021', 'Dubai', 'United Arab Emirates', 'Middle East', 'Futuristic luxury hub featuring the world’s tallest skyscrapers, palm islands, and desert adventures.', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', 4.4, 97),
('c1000000-0000-0000-0000-000000000022', 'Abu Dhabi', 'United Arab Emirates', 'Middle East', 'Sophisticated capital renowned for the Grand Mosque, Louvre Abu Dhabi, and pristine island resorts.', 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1200&q=80', 4.0, 88),
('c1000000-0000-0000-0000-000000000023', 'Istanbul', 'Turkey', 'Middle East', 'Transcontinental metropolis bridging Europe and Asia with historic mosques, bazars, and Bosphorus cruises.', 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=1200&q=80', 2.2, 95),
('c1000000-0000-0000-0000-000000000024', 'Doha', 'Qatar', 'Middle East', 'Modern waterfront city characterized by dramatic skyline architecture, traditional souqs, and Islamic art.', 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80', 3.8, 86),
('c1000000-0000-0000-0000-000000000025', 'Muscat', 'Oman', 'Middle East', 'Tranquil coastal capital tucked between rugged mountains and the Arabian Sea with white-washed buildings.', 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=1200&q=80', 2.8, 83),

-- North America
('c1000000-0000-0000-0000-000000000026', 'New York City', 'United States', 'North America', 'The vibrant cultural and financial capital of the world, home to iconic skyscrapers and Central Park.', 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80', 4.5, 99),
('c1000000-0000-0000-0000-000000000027', 'San Francisco', 'United States', 'North America', 'Iconic bay city known for the Golden Gate Bridge, historic cable cars, and tech innovation.', 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80', 4.2, 94),
('c1000000-0000-0000-0000-000000000028', 'Vancouver', 'Canada', 'North America', 'Coastal seaport framed by majestic Pacific mountains, vibrant waterfront paths, and outdoor recreation.', 'https://images.unsplash.com/photo-1559511260-66a65e09b2ee?auto=format&fit=crop&w=1200&q=80', 3.9, 92),
('c1000000-0000-0000-0000-000000000029', 'Mexico City', 'Mexico', 'North America', 'High-altitude capital buzzing with Mesoamerican history, world-class culinary innovation, and colorful arts.', 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=1200&q=80', 2.0, 92),
('c1000000-0000-0000-0000-000000000030', 'Montreal', 'Canada', 'North America', 'Bilingual cultural metropolis with European charm, historic cobblestones, and world-class festival scene.', 'https://images.unsplash.com/photo-1519178173499-d41cfa28a8d1?auto=format&fit=crop&w=1200&q=80', 3.1, 89);


-- ----------------------------------------------------------------------------
-- 2. Insert 120 Curated Destination Activities (4 per city)
-- ----------------------------------------------------------------------------
INSERT INTO public.activities (city_id, name, description, category, estimated_cost, currency, duration_minutes, image_url) VALUES
-- Tokyo (1)
('c1000000-0000-0000-0000-000000000001', 'Shibuya Sky Observation Deck', 'Panoramic open-air 360-degree observation deck offering sunset views of Shibuya Crossing.', 'sightseeing', 22.00, 'USD', 90, 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000001', 'Senso-ji & Asakusa Old Town Walk', 'Explore Tokyo’s oldest Buddhist temple and traditional Nakamise shopping street.', 'culture', 0.00, 'USD', 120, 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000001', 'Tsukiji Outer Market Food Tour', 'Sample fresh sashimi, tamagoyaki, wagyu skewers, and matcha sweets with a local food guide.', 'food', 65.00, 'USD', 150, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000001', 'teamLab Planets Digital Art Museum', 'Immersive body-immersive digital artwork exhibition walking barefoot through water and lights.', 'adventure', 38.00, 'USD', 120, 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'),

-- Kyoto (2)
('c1000000-0000-0000-0000-000000000002', 'Fushimi Inari Shrine Morning Hike', 'Hike through 10,000 vibrant vermilion torii gates winding up the sacred wooded mountain.', 'sightseeing', 0.00, 'USD', 150, 'https://images.unsplash.com/photo-1478436127897-769e00d02635?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000002', 'Arashiyama Bamboo Grove & Monkey Park', 'Walk through towering bamboo paths and visit the hilltop sanctuary overlooking Kyoto.', 'adventure', 8.00, 'USD', 120, 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000002', 'Authentic Tea Ceremony in Gion', 'Traditional Uji matcha preparation ceremony in a historic wooden machiya teahouse.', 'culture', 45.00, 'USD', 75, 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000002', 'Nishiki Market Culinary Discovery', 'Stroll Kyoto’s Kitchen with over 100 stalls of pickles, skewers, and seasonal snacks.', 'food', 30.00, 'USD', 90, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'),

-- Osaka (3)
('c1000000-0000-0000-0000-000000000003', 'Dotonbori Street Food Crawl', 'Taste signature Takoyaki, Okonomiyaki, and Kushikatsu under the iconic Glico Man neon sign.', 'food', 40.00, 'USD', 120, 'https://images.unsplash.com/photo-1590559899731-a3f30bc4a039?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000003', 'Osaka Castle & Park Grounds', 'Historic 16th-century fortress surrounded by stone ramparts, moats, and cherry blossoms.', 'culture', 6.00, 'USD', 120, 'https://images.unsplash.com/photo-1590559899731-a3f30bc4a039?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000003', 'Umeda Sky Building Floating Garden', 'Futuristic dual-tower observation bridge providing panoramic views of the Kansai skyline.', 'sightseeing', 14.00, 'USD', 60, 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000003', 'Shinsekai & Tsutenkaku Tower Walk', 'Vintage retro district showcasing Showa-era arcade atmosphere and local street cuisine.', 'sightseeing', 0.00, 'USD', 90, 'https://images.unsplash.com/photo-1590559899731-a3f30bc4a039?auto=format&fit=crop&w=800&q=80'),

-- Bangkok (4)
('c1000000-0000-0000-0000-000000000004', 'Grand Palace & Wat Phra Kaew Tour', 'Ornate royal temple complex home to the sacred Emerald Buddha.', 'culture', 15.00, 'USD', 150, 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000004', 'Chao Phraya River Sunset Longtail Boat', 'Cruise the historical water arteries of Bangkok passing illuminated riverside temples.', 'adventure', 25.00, 'USD', 90, 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000004', 'Chatuchak Weekend Market Exploration', 'One of the world’s largest outdoor markets featuring over 15,000 vibrant stalls.', 'sightseeing', 0.00, 'USD', 180, 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000004', 'Michelin Street Food Tasting in Chinatown', 'Evening gastronomic walk exploring Yaowarat road Pad Thai, satay, and mango sticky rice.', 'food', 35.00, 'USD', 120, 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80'),

-- Singapore (5)
('c1000000-0000-0000-0000-000000000005', 'Gardens by the Bay & Cloud Forest Dome', 'Spectacular indoor mist waterfall and futuristic Supertree Grove light show.', 'sightseeing', 28.00, 'USD', 150, 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000005', 'Marina Bay Sands SkyPark Observation Deck', 'Unrivaled 57th-floor skyline views overlooking Marina Bay and the Singapore Strait.', 'sightseeing', 24.00, 'USD', 75, 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000005', 'Hawker Center Feast at Lau Pa Sat', 'Indulge in Hainanese chicken rice, chili crab, laksa, and freshly grilled satay skewers.', 'food', 20.00, 'USD', 90, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000005', 'Night Safari Wildlife Experience', 'World’s first nocturnal zoo journey through diverse global rainforest habitats.', 'adventure', 42.00, 'USD', 180, 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80'),

-- Seoul (6)
('c1000000-0000-0000-0000-000000000006', 'Gyeongbokgung Palace & Hanbok Experience', 'Rent traditional Korean dress and tour the Grand Joseon Dynasty royal palace grounds.', 'culture', 18.00, 'USD', 150, 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000006', 'N Seoul Tower Sunset Cable Car', 'Scenic ride up Mount Namsan for sweeping city views and the famous love-locks deck.', 'sightseeing', 12.00, 'USD', 90, 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000006', 'Gwangjang Market K-Food Tour', 'Savor bindaetteok (mung bean pancakes), mayak gimbap, and kalguksu noodle soup.', 'food', 25.00, 'USD', 120, 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000006', 'Hongdae Nightlife & Street Busking', 'Vibrant student district packed with live indie music, fashion boutiques, and K-BBQ.', 'adventure', 0.00, 'USD', 180, 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=800&q=80'),

-- Bali (7)
('c1000000-0000-0000-0000-000000000007', 'Tegallalang Rice Terraces & Jungle Swing', 'Iconic stepped emerald paddies and thrilling jungle swing over Ubud lush valleys.', 'adventure', 15.00, 'USD', 120, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000007', 'Uluwatu Clifftop Temple & Kecak Dance', 'Watch traditional Balinese fire dance at sunset perched 70 meters above the Indian Ocean.', 'culture', 12.00, 'USD', 150, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000007', 'Mount Batur Sunrise Trek', 'Early morning volcanic hike to witness clouds and sunrise from the volcanic crater peak.', 'adventure', 45.00, 'USD', 300, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000007', 'Jimbaran Bay Seafood Candlelit Dinner', 'Fresh grilled snapper, prawns, and calamari served right on the ocean sand.', 'food', 35.00, 'USD', 120, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'),

-- Hanoi (8)
('c1000000-0000-0000-0000-000000000008', 'Old Quarter Street Food & Egg Coffee', 'Sample legendary Bun Cha, Pho Bo, and whip-topped creamy egg coffee in ancient alleys.', 'food', 20.00, 'USD', 120, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000008', 'Hoan Kiem Lake & Ngoc Son Temple', 'Peaceful morning walk around the central lake and the scarlet wooden bridge.', 'sightseeing', 2.00, 'USD', 60, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000008', 'Hanoi Train Street Coffee Experience', 'Sip Vietnamese robusta while watching the passenger train pass inches from storefronts.', 'adventure', 5.00, 'USD', 60, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000008', 'Traditional Thang Long Water Puppet Show', 'Centuries-old folk performance depicting Vietnamese rural legends over water.', 'culture', 8.00, 'USD', 60, 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'),

-- Taipei (9)
('c1000000-0000-0000-0000-000000000009', 'Taipei 101 Observatory Tower', 'Ride high-speed pressurized elevator to the 89th floor panoramic indoor/outdoor deck.', 'sightseeing', 20.00, 'USD', 90, 'https://images.unsplash.com/photo-1508248017013-fe55d8dd445b?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000009', 'Shilin Night Market Food Safari', 'Indulge in crispy XL fried chicken, pepper pork buns, bubble tea, and oyster omelets.', 'food', 22.00, 'USD', 120, 'https://images.unsplash.com/photo-1508248017013-fe55d8dd445b?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000009', 'Elephant Mountain Sunset Hike', 'Short picturesque stone-step hike offering the premier photo view of Taipei skyline.', 'adventure', 0.00, 'USD', 90, 'https://images.unsplash.com/photo-1508248017013-fe55d8dd445b?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000009', 'Jiufen Old Street Tea & Lantern Tour', 'Misty hillside village with winding lantern-lit alleyways inspiring classic animated films.', 'culture', 35.00, 'USD', 240, 'https://images.unsplash.com/photo-1508248017013-fe55d8dd445b?auto=format&fit=crop&w=800&q=80'),

-- Mumbai (10)
('c1000000-0000-0000-0000-000000000010', 'Gateway of India & Colaba Heritage Walk', 'Historical waterfront archway and grand Victorian Gothic architectural buildings.', 'sightseeing', 0.00, 'USD', 120, 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000010', 'Elephanta Island Caves Ferry Excursion', 'UNESCO rock-cut cave temples dedicated to Shiva dating back to the 5th century.', 'culture', 12.00, 'USD', 240, 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000010', 'Marine Drive Sunset & Street Snacks', 'Stroll Queen’s Necklace promenade tasting Pav Bhaji, Bhel Puri, and spicy Vada Pav.', 'food', 10.00, 'USD', 90, 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000010', 'Chhatrapati Shivaji Maharaj Terminus Tour', 'Masterpiece of Victorian Italianate Gothic Revival railway station architecture.', 'culture', 2.00, 'USD', 60, 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=800&q=80'),

-- Paris (11)
('c1000000-0000-0000-0000-000000000011', 'Eiffel Tower Summit Access Tour', 'Ascend to the top tier of the Iron Lady for panoramic views across the Parisian skyline.', 'sightseeing', 35.00, 'USD', 120, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000011', 'Louvre Museum Masterpieces Walking Tour', 'Skip-the-line guided entrance viewing the Mona Lisa, Venus de Milo, and Winged Victory.', 'culture', 65.00, 'USD', 150, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000011', 'Montmartre & Sacré-Cœur Artist Quarter Walk', 'Bohemian hillside streets once inhabited by Picasso and Van Gogh with basilica views.', 'sightseeing', 0.00, 'USD', 120, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000011', 'Seine River Evening Champagne Cruise', 'Gliding past illuminated historic bridges, Notre-Dame Cathedral, and the Musée d’Orsay.', 'relaxation', 45.00, 'USD', 75, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80'),

-- Rome (12)
('c1000000-0000-0000-0000-000000000012', 'Colosseum & Roman Forum VIP Tour', 'Walk through the ancient gladiatorial arena floor and the ruins of the Roman Empire.', 'culture', 55.00, 'USD', 180, 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000012', 'Vatican Museums & Sistine Chapel', 'Admire Michelangelo’s frescoes and Renaissance treasures inside the Papal galleries.', 'culture', 40.00, 'USD', 210, 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000012', 'Trastevere Food & Natural Wine Walk', 'Indulge in authentic cacio e pepe, crispy supplì, Roman pizza, and artisanal gelato.', 'food', 70.00, 'USD', 180, 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000012', 'Trevi Fountain & Pantheon Night Walk', 'Experience Rome’s illuminated baroque fountains and historic cobblestone piazzas.', 'sightseeing', 0.00, 'USD', 90, 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80'),

-- Barcelona (13)
('c1000000-0000-0000-0000-000000000013', 'Sagrada Família Fast-Track Tower Tour', 'Gaudí’s masterpiece basilica featuring vibrant stained glass and soaring organic towers.', 'culture', 36.00, 'USD', 120, 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000013', 'Park Güell Mosaic Hillside Walk', 'Whimsical park overlooking Barcelona with famous salamander sculptures and views.', 'sightseeing', 14.00, 'USD', 90, 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000013', 'Gothic Quarter Tapas & Vermouth Crawl', 'Taste Jamón Ibérico, patatas bravas, and Catalan pintxos in medieval stone taverns.', 'food', 50.00, 'USD', 150, 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000013', 'Barceloneta Beach Sunset Paddleboard', 'Relax along the Mediterranean coastline enjoying scenic horizon views and sea breeze.', 'adventure', 30.00, 'USD', 90, 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80'),

-- London (14)
('c1000000-0000-0000-0000-000000000014', 'Tower of London & Crown Jewels', 'Historic fortress, prison, and castle safeguarding centuries of British Royal regalia.', 'culture', 38.00, 'USD', 150, 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000014', 'Westminster Abbey & Big Ben Walk', 'Marvel at Gothic royal coronation grounds, Parliament square, and historic London landmarks.', 'sightseeing', 30.00, 'USD', 120, 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000014', 'Borough Market Gourmet Food Tour', 'Explore London’s premier culinary market with artisan cheeses, pies, and street oysters.', 'food', 45.00, 'USD', 120, 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000014', 'West End Theatre Musical Evening', 'Experience top-tier live stage productions in historic Soho and Covent Garden theatres.', 'culture', 75.00, 'USD', 180, 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80'),

-- Amsterdam (15)
('c1000000-0000-0000-0000-000000000015', 'Van Gogh Museum Skip-the-Line', 'World’s largest collection of paintings, drawings, and letters by Vincent van Gogh.', 'culture', 25.00, 'USD', 120, 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000015', 'Classic Canal Boat Cruise with Cheese', 'Sail through UNESCO 17th-century canal rings sampling Dutch Gouda and wine.', 'relaxation', 32.00, 'USD', 75, 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000015', 'Jordaan District Bike Tour', 'Cycle through picturesque courtyards, boutique streets, and flower-lined waterways.', 'adventure', 28.00, 'USD', 150, 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000015', 'Rijksmuseum Dutch Masters Tour', 'Explore Rembrandt’s Night Watch and Vermeer masterpieces in the grand national gallery.', 'culture', 26.00, 'USD', 150, 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=800&q=80'),

-- Florence (16)
('c1000000-0000-0000-0000-000000000016', 'Uffizi Gallery Renaissance Tour', 'Guided tour of Botticelli’s Birth of Venus, Da Vinci, and Raphael treasures.', 'culture', 35.00, 'USD', 150, 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000016', 'Duomo Brunelleschi Dome Climb', 'Climb 463 stone steps to the summit of the cathedral dome for breathtaking Tuscan vistas.', 'sightseeing', 30.00, 'USD', 90, 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000016', 'Tuscan Wine & Bistecca Alla Fiorentina', 'Authentic steak dinner paired with world-class Chianti Classico in a historical cantina.', 'food', 65.00, 'USD', 120, 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000016', 'Piazzale Michelangelo Sunset Walk', 'Panoramic hilltop terrace overlooking the Arno river, Ponte Vecchio, and Florence roofs.', 'sightseeing', 0.00, 'USD', 90, 'https://images.unsplash.com/photo-1543429776-2782fc8e1acd?auto=format&fit=crop&w=800&q=80'),

-- Prague (17)
('c1000000-0000-0000-0000-000000000017', 'Prague Castle & St. Vitus Cathedral', 'Ancient castle complex with panoramic vistas over Bohemia and gothic architecture.', 'culture', 18.00, 'USD', 180, 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000017', 'Charles Bridge Sunrise Walk', 'Atmospheric morning walk across the 14th-century stone bridge flanked by saint statues.', 'sightseeing', 0.00, 'USD', 60, 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000017', 'Czech Pilsner Brewery & Goulash Dinner', 'Taste authentic unpasteurized Pilsner Urquell paired with slow-cooked beef goulash.', 'food', 28.00, 'USD', 120, 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000017', 'Old Town Astronomical Clock Show', 'Watch the medieval mechanical clock display in the heart of Prague Old Town square.', 'sightseeing', 0.00, 'USD', 45, 'https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=800&q=80'),

-- Vienna (18)
('c1000000-0000-0000-0000-000000000018', 'Schönbrunn Palace Grand Tour', 'Imperial summer residence of the Habsburg monarchs with magnificent baroque gardens.', 'culture', 28.00, 'USD', 150, 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000018', 'Historic Coffeehouse & Sachertorte', 'Sip Viennese melange accompanied by original decadent chocolate apricot cake.', 'food', 18.00, 'USD', 60, 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000018', 'St. Stephen’s Cathedral Tower Climb', 'Gothic cathedral in the historic centre with colorful tiled roof and tower views.', 'sightseeing', 7.00, 'USD', 60, 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000018', 'Classical Mozart & Strauss Concert', 'Experience live classical orchestra performance inside an ornate historic Viennese palace.', 'culture', 60.00, 'USD', 120, 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=800&q=80'),

-- Berlin (19)
('c1000000-0000-0000-0000-000000000019', 'East Side Gallery & Wall Memorial Walk', 'Longest open-air mural gallery preserving remaining sections of the Berlin Wall.', 'culture', 0.00, 'USD', 90, 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000019', 'Reichstag Building Glass Dome Visit', 'Norman Foster’s glass dome providing 360-degree views and parliamentary history.', 'sightseeing', 0.00, 'USD', 90, 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000019', 'Kreuzberg Street Art & Currywurst Tour', 'Discover urban street art murals, counter-culture cafes, and local currywurst.', 'food', 25.00, 'USD', 120, 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000019', 'Museum Island Pergamon & Neues Museum', 'UNESCO complex showcasing the Ishtar Gate and the world-famous bust of Nefertiti.', 'culture', 22.00, 'USD', 180, 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80'),

-- Lisbon (20)
('c1000000-0000-0000-0000-000000000020', 'Belém Tower & Pastéis de Belém Tour', 'Visit UNESCO maritime fortress and taste the original warm Portuguese custard tarts.', 'culture', 12.00, 'USD', 120, 'https://images.unsplash.com/photo-1509840841025-9088ba78a826?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000020', 'Historic Tram 28 Alfama Neighborhood', 'Ride the vintage yellow tram through winding cobblestone streets of old Lisbon.', 'sightseeing', 4.00, 'USD', 75, 'https://images.unsplash.com/photo-1509840841025-9088ba78a826?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000020', 'Time Out Market Seafood Tasting', 'Gourmet food hall curated by culinary journalists showcasing top Portuguese chefs.', 'food', 30.00, 'USD', 90, 'https://images.unsplash.com/photo-1509840841025-9088ba78a826?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000020', 'Miradouro de Santa Luzia Sunset View', 'Tile-clad terrace offering panoramic views over the terracotta roofs of Alfama and Tagus River.', 'relaxation', 0.00, 'USD', 60, 'https://images.unsplash.com/photo-1509840841025-9088ba78a826?auto=format&fit=crop&w=800&q=80'),

-- Dubai (21)
('c1000000-0000-0000-0000-000000000021', 'Burj Khalifa 148th Floor Observation', 'Visit the world’s tallest tower observation lounge and marvel over the skyline and fountains.', 'sightseeing', 75.00, 'USD', 90, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000021', 'Desert Safari with Dune Bashing & BBQ', '4x4 dune bashing, sandboarding, camel riding, and traditional Bedouin camp dinner.', 'adventure', 60.00, 'USD', 360, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000021', 'Dubai Marina Luxury Yacht Cruise', 'Scenic cruise through the yacht harbor passing Ain Dubai and Jumeirah Beach Residence.', 'relaxation', 45.00, 'USD', 120, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000021', 'Old Dubai Gold & Spice Souk Abra Ride', 'Cross Dubai Creek on a traditional wooden boat to explore fragrant aromatic souqs.', 'culture', 5.00, 'USD', 90, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80'),

-- Abu Dhabi (22)
('c1000000-0000-0000-0000-000000000022', 'Sheikh Zayed Grand Mosque Tour', 'Architectural marvel made of white marble, crystal chandeliers, and handcrafted carpets.', 'culture', 0.00, 'USD', 120, 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000022', 'Louvre Abu Dhabi Museum Tour', 'Jean Nouvel’s floating dome museum showcasing masterpieces from ancient to modern civilizations.', 'culture', 18.00, 'USD', 150, 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000022', 'Ferrari World Formula Rossa Experience', 'Ride the world’s fastest roller coaster accelerating to 240 km/h in 4.9 seconds.', 'adventure', 85.00, 'USD', 240, 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000022', 'Corniche Beach Kayak & Promenade', 'Relax along the manicured waterfront promenade with turquoise Persian Gulf waters.', 'relaxation', 25.00, 'USD', 90, 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80'),

-- Istanbul (23)
('c1000000-0000-0000-0000-000000000023', 'Hagia Sophia & Blue Mosque Exploration', 'Marvel at iconic domes, Byzantine golden mosaics, and Iznik ceramic tiles.', 'culture', 25.00, 'USD', 150, 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000023', 'Bosphorus Sunset Ferry Cruise', 'Sail between the European and Asian continents witnessing waterfront Ottoman palaces.', 'sightseeing', 12.00, 'USD', 120, 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000023', 'Grand Bazaar Spice & Baklava Safari', 'Explore 4,000 historic shops tasting pistachio baklava, Turkish delight, and roasted coffee.', 'food', 30.00, 'USD', 120, 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000023', 'Basilica Cistern Underground Walk', 'Atmospheric ancient underground water reservoir with illuminated Medusa head pillars.', 'sightseeing', 18.00, 'USD', 60, 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80'),

-- Doha (24)
('c1000000-0000-0000-0000-000000000024', 'Museum of Islamic Art & Park', 'I.M. Pei-designed building showcasing 1,400 years of Islamic art, textiles, and ceramics.', 'culture', 14.00, 'USD', 120, 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000024', 'Souq Waqif Night Market Walk', 'Traditional labyrinth souq famous for spices, handicrafts, falconry shops, and shisha cafes.', 'sightseeing', 0.00, 'USD', 120, 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000024', 'Katara Cultural Village & Amphitheatre', 'Greco-Roman style amphitheatre, traditional pigeon towers, and art galleries.', 'culture', 0.00, 'USD', 90, 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000024', 'Khor Al Adaid Inland Sea 4x4 Dune Ride', 'UNESCO reserve where desert dunes meet the azure sea in a spectacular desert landscape.', 'adventure', 70.00, 'USD', 240, 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80'),

-- Muscat (25)
('c1000000-0000-0000-0000-000000000025', 'Sultan Qaboos Grand Mosque', 'Breathtaking contemporary Islamic architecture featuring pure Persian carpet and chandelier.', 'culture', 0.00, 'USD', 90, 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000025', 'Mutrah Corniche & Souq Stroll', 'Scenic harbor promenade, frankincense fragrances, antique silver dagger shops, and Omani halwa.', 'sightseeing', 0.00, 'USD', 120, 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000025', 'Bimah Sinkhole & Wadi Shab Adventure', 'Swim in a crystal-clear turquoise limestone crater and hike through dramatic mountain gorges.', 'adventure', 45.00, 'USD', 300, 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000025', 'Dolphin Watching & Snorkel Dhow Cruise', 'Sail along Oman’s dramatic rocky coastline spotting spinner dolphins and sea turtles.', 'relaxation', 40.00, 'USD', 180, 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&w=800&q=80'),

-- New York City (26)
('c1000000-0000-0000-0000-000000000026', 'Empire State Building Sunset Deck', 'Ascend the 86th floor open-air observatory for the defining view of the Manhattan grid.', 'sightseeing', 44.00, 'USD', 90, 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000026', 'Central Park Bicycle Loop & Bethesda Terrace', 'Cycle beneath the elm canopies visiting the famous fountain and Bow Bridge.', 'relaxation', 20.00, 'USD', 120, 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000026', 'Metropolitan Museum of Art Highlights', 'World-class galleries ranging from Temple of Dendur to Impressionist paintings.', 'culture', 30.00, 'USD', 180, 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000026', 'Chelsea Market & High Line Park Walk', 'Elevated green park on historical rail tracks ending at Chelsea culinary food stalls.', 'food', 35.00, 'USD', 120, 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80'),

-- San Francisco (27)
('c1000000-0000-0000-0000-000000000027', 'Golden Gate Bridge Bike Across to Sausalito', 'Cycle across the iconic orange suspension bridge and take the ferry back with city skyline views.', 'adventure', 35.00, 'USD', 180, 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000027', 'Alcatraz Island Day Tour & Cellhouse Audio', 'Ferry ride to the legendary former maximum-security federal penitentiary in the bay.', 'culture', 45.00, 'USD', 180, 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000027', 'Fisherman’s Wharf Clam Chowder & Sea Lions', 'Sourdough bread bowl clam chowder at Pier 39 and observe barking wild sea lions.', 'food', 22.00, 'USD', 90, 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000027', 'Mission District Murals & Taqueria Walk', 'Explore vibrant Chicano street art on Clarion Alley and taste award-winning Mission burritos.', 'food', 18.00, 'USD', 90, 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80'),

-- Vancouver (28)
('c1000000-0000-0000-0000-000000000028', 'Stanley Park Seawall Cycling Tour', 'Paved oceanfront cycling path circling temperate rainforests and totem poles.', 'adventure', 24.00, 'USD', 120, 'https://images.unsplash.com/photo-1559511260-66a65e09b2ee?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000028', 'Capilano Suspension Bridge Park', 'Cross swaying footbridge suspended 70 meters above a forested river canyon.', 'sightseeing', 48.00, 'USD', 120, 'https://images.unsplash.com/photo-1559511260-66a65e09b2ee?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000028', 'Granville Island Public Market Feast', 'Sample artisan smoked salmon, fresh baked pastries, and British Columbia craft ciders.', 'food', 30.00, 'USD', 120, 'https://images.unsplash.com/photo-1559511260-66a65e09b2ee?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000028', 'Grouse Mountain Skyride & Peak Hike', 'Aerial tramway to mountain peak with timber wolf habitat and panoramic ocean views.', 'adventure', 52.00, 'USD', 180, 'https://images.unsplash.com/photo-1559511260-66a65e09b2ee?auto=format&fit=crop&w=800&q=80'),

-- Mexico City (29)
('c1000000-0000-0000-0000-000000000029', 'Teotihuacan Pyramids Early Morning Tour', 'Climb the Pyramid of the Sun and Moon in the ancient pre-Columbian city.', 'culture', 35.00, 'USD', 300, 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000029', 'Frida Kahlo Museum (Casa Azul) in Coyoacán', 'Tour the cobalt-blue home and personal art studio of iconic painter Frida Kahlo.', 'culture', 18.00, 'USD', 120, 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000029', 'Roma Norte & Condesa Street Taco Crawl', 'Taste gourmet tacos al pastor, suadero, and churros with chocolate in trendy art districts.', 'food', 25.00, 'USD', 120, 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000029', 'Xochimilco Floating Gardens Trajinera Ride', 'Party on colorful traditional canal boats accompanied by floating mariachi bands.', 'relaxation', 20.00, 'USD', 150, 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=800&q=80'),

-- Montreal (30)
('c1000000-0000-0000-0000-000000000030', 'Old Montreal Historic Walking Tour', 'Cobblestone streets, 17th-century stone mansions, and Notre-Dame Basilica light show.', 'culture', 22.00, 'USD', 120, 'https://images.unsplash.com/photo-1519178173499-d41cfa28a8d1?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000030', 'Mount Royal Park Lookout Hike', 'Olmsted-designed urban mountain park with panoramic views of downtown and the St. Lawrence River.', 'sightseeing', 0.00, 'USD', 90, 'https://images.unsplash.com/photo-1519178173499-d41cfa28a8d1?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000030', 'Mile End Bagels & Montreal Smoked Meat', 'Indulge in wood-fired St-Viateur bagels and legendary spiced smoked brisket sandwiches.', 'food', 25.00, 'USD', 90, 'https://images.unsplash.com/photo-1519178173499-d41cfa28a8d1?auto=format&fit=crop&w=800&q=80'),
('c1000000-0000-0000-0000-000000000030', 'Montreal Botanical Garden & Biodome', 'Massive cultural greenhouse domes and themed Chinese and Japanese zen gardens.', 'relaxation', 20.00, 'USD', 150, 'https://images.unsplash.com/photo-1519178173499-d41cfa28a8d1?auto=format&fit=crop&w=800&q=80');
