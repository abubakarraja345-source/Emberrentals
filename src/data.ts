import { Property, Category, City, Testimonial, Leader } from "./types";

export const CITIES: City[] = [
  {
    id: "islamabad",
    name: "Islamabad",
    tagline: "Capital elegance & green serenity",
    image: "/photos/islamabad.jpg"
  },
  {
    id: "rawalpindi",
    name: "Rawalpindi",
    tagline: "Twin city comfort & history",
    image: "/photos/Rawalpindi.jpg"
  },
  {
    id: "lahore",
    name: "Lahore",
    tagline: "Heritage, culture & modern style",
    image: "/photos/Lahore.jpg"
  },
  {
    id: "murree",
    name: "Murree",
    tagline: "High mountain breeze & winter escape",
    image: "/photos/murree.jpg"
  },
  {
    id: "nathiagali",
    name: "Nathia Gali",
    tagline: "Alpine valleys & serene trails",
    image: "/photos/nathiagali.jpg"
  },
  {
    id: "karachi",
    name: "Karachi",
    tagline: "Coastal lifestyle & vibrant nightscape",
    image: "/photos/karachi.jpg"
  }
];

export const CATEGORIES: Category[] = [
  {
    id: "apartments",
    type: "Apartment",
    label: "Luxury Apartments",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    startingPrice: "PKR 25,000",
    desc: "Plush spaces, floor-to-ceiling windows, and premier city center locations."
  },
  {
    id: "penthouses",
    type: "Penthouse",
    label: "Elite Penthouses",
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80",
    startingPrice: "PKR 75,000",
    desc: "Private rooftops, infinity plunge pools, and uninterrupted skyline vistas."
  },
  {
    id: "resorts",
    type: "Resort",
    label: "Boutique Resorts",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    startingPrice: "PKR 45,000",
    desc: "Complete privacy, spa-level baths, and customized butler assistance."
  },
  {
    id: "glamps",
    type: "Glamp",
    label: "Scenic Glamps",
    image: "https://images.unsplash.com/photo-1533760881669-80db4d7b341a?auto=format&fit=crop&w=800&q=80",
    startingPrice: "PKR 30,000",
    desc: "Stargazing domes, high-altitude alpine views, and warm fireplaces."
  },
  {
    id: "farmhouses",
    type: "Farmhouse",
    label: "Private Farmhouses",
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
    startingPrice: "PKR 90,000",
    desc: "Expansive green lawns, private BBQ zones, and peaceful countryside air."
  },
  {
    id: "guesthouses",
    type: "Guest House",
    label: "Luxury Guest Houses",
    image: "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=800&q=80",
    startingPrice: "PKR 15,000",
    desc: "Bespoke hospitality, cozy shared lounges, and homestyle comfort in premier sectors."
  }
];

export const FALLBACK_PROPERTIES: Property[] = [
  {
    id: "1",
    title: "1 Bedroom Elite Skyline Suite",
    price: "From PKR 25,000 / night",
    pricePerNight: 25000,
    desc: "Elegant contemporary interiors with majestic skyline views, premium marble baths, and bespoke furnishings.",
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80"
    ],
    amenity1: "High-Speed WiFi",
    amenity2: "Smart TV",
    city: "Islamabad",
    type: "Apartment",
    maxGuests: 2
  },
  {
    id: "2",
    title: "2 Bedroom Serene Family Haven",
    price: "From PKR 35,000 / night",
    pricePerNight: 35000,
    desc: "Exquisite multi-bedroom layout perfect for families. Private terrace overlooking the twin city scenery.",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80"
    ],
    amenity1: "Private Terrace",
    amenity2: "Modern Kitchen",
    city: "Rawalpindi",
    type: "Apartment",
    maxGuests: 4
  },
  {
    id: "3",
    title: "3 Bedroom Imperial Royal Flat",
    price: "From PKR 55,000 / night",
    pricePerNight: 55000,
    desc: "A sprawling boutique flat boasting grand chandeliers, premium sound setups, and bespoke dining rooms.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80"
    ],
    amenity1: "Secured Parking",
    amenity2: "Butler Service",
    city: "Lahore",
    type: "Apartment",
    maxGuests: 6
  },
  {
    id: "4",
    title: "Crown Jewel Vista Penthouse",
    price: "From PKR 85,000 / night",
    pricePerNight: 85000,
    desc: "Breathtaking floor-to-ceiling visual frame of Islamabad. Features private sky patio and cozy designer fireplace.",
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80"
    ],
    amenity1: "Skyline View",
    amenity2: "Designer Lounge",
    city: "Islamabad",
    type: "Penthouse",
    maxGuests: 4
  },
  {
    id: "5",
    title: "Azure Poolside Oasis Penthouse",
    price: "From PKR 120,000 / night",
    pricePerNight: 120000,
    desc: "Exclusive seaside sanctuary featuring a private rooftop pool, modern cocktail lounge, and open sundeck.",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80"
    ],
    amenity1: "Private Pool",
    amenity2: "Sea View",
    city: "Karachi",
    type: "Penthouse",
    maxGuests: 5
  },
  {
    id: "6",
    title: "Whispering Pines Highland Resort",
    price: "From PKR 60,000 / night",
    pricePerNight: 60000,
    desc: "Nestled in Murree's lush pine forests. Enjoy gourmet kitchens, outdoor campfires, and crisp mountain breeze.",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?auto=format&fit=crop&w=800&q=80"
    ],
    amenity1: "Mountain View",
    amenity2: "BBQ Setup",
    city: "Murree",
    type: "Resort",
    maxGuests: 8
  },
  {
    id: "7",
    title: "The Alpine Sanctuary & Spa Dome",
    price: "From PKR 45,000 / night",
    pricePerNight: 45000,
    desc: "Experience glamping at its peak. Heated geo-domes with luxurious plush beds, private telescope, and spa baths.",
    image: "https://images.unsplash.com/photo-1533760881669-80db4d7b341a?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1533760881669-80db4d7b341a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80"
    ],
    amenity1: "Starry Dome",
    amenity2: "Heating Spa",
    city: "Nathia Gali",
    type: "Glamp",
    maxGuests: 2
  },
  {
    id: "8",
    title: "Ember Country Meadows Estate",
    price: "From PKR 95,000 / night",
    pricePerNight: 95000,
    desc: "A massive, gorgeous farmhouse surrounded by curated orchards. Perfect for retreats, family reunions, and events.",
    image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80"
    ],
    amenity1: "Huge Lawns",
    amenity2: "Private BBQ",
    city: "Rawalpindi",
    type: "Farmhouse",
    maxGuests: 12
  },
  {
    id: "9",
    title: "The Royal Crest Heritage Guest House",
    price: "From PKR 18,000 / night",
    pricePerNight: 18000,
    desc: "A stunning, boutique colonial-style residence offering high-end comfort, custom hospitality, and peaceful gardens.",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80"
    ],
    amenity1: "Gourmet Breakfast",
    amenity2: "24/7 Butler",
    city: "Islamabad",
    type: "Guest House",
    maxGuests: 4
  },
  {
    id: "10",
    title: "Glow Executive Club Guest House",
    price: "From PKR 15,000 / night",
    pricePerNight: 15000,
    desc: "Unmatched executive stays featuring elegant private lounges, meeting desks, and highly secure surroundings.",
    image: "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80"
    ],
    amenity1: "Meeting Desk",
    amenity2: "Secured Lounge",
    city: "Lahore",
    type: "Guest House",
    maxGuests: 2
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Aaliya Rahman",
    city: "Islamabad",
    rating: 5,
    text: "The skyline suite looked even more breathtaking than the photos. Pristine cleanliness, prompt check-in, and premium five-star feel. Highly recommended!",
    avatar: "A"
  },
  {
    id: "2",
    name: "Muneeb Shah",
    city: "Karachi",
    rating: 5,
    text: "Outstanding private pool penthouse stay. Hearing the ocean breeze while dipping in the sunset pool was pure therapeutic magic. Worth every single rupee.",
    avatar: "M"
  },
  {
    id: "3",
    name: "Sana Malik",
    city: "Lahore",
    rating: 5,
    text: "Incredibly attentive hospitality. The staff accommodated our family requests with absolute warmth. Truly the premier way to travel in Pakistan.",
    avatar: "S"
  },
  {
    id: "4",
    name: "Dr. Farhan Qureshi",
    city: "Peshawar",
    rating: 5,
    text: "Our alpine dome glamping was surreal! Waking up to Murree's clouds right outside the transparent canopy is something we will cherish forever.",
    avatar: "F"
  }
];

export const LEADERS: Leader[] = [
  {
    id: "yahya",
    name: "Yahya Ali",
    role: "Founder",
    bio: "Pioneering premium short-stay standards across Pakistan, Yahya leads our selection criteria with an obsessive focus on design, security, and world-class vibes.",
    image: "https://i.postimg.cc/QCTFBMHh/Yahya.jpg",
    instagram: "https://www.instagram.com/yahyaalii.bnb?igsh=cDkzanoxZXJwaWQx"
  },
  {
    id: "hassan",
    name: "Hassan Gul",
    role: "Chief Executive Officer",
    bio: "Orchestrating seamless operations, guest services, and pristine property maintenance so that every reservation transcends standard lodging.",
    image: "https://i.postimg.cc/vm2wW5wh/hassan.jpg",
    instagram: "https://www.instagram.com/hassanngulbnb?igsh=MTZqMTBvazdwdXo1bg=="
  },
  {
    id: "zia",
    name: "Zia Tufail",
    role: "Chief Business Officer",
    bio: "Cultivating elite real estate alliances and driving expansion footprints to put Ember Rentals in Pakistan's most scenic and high-end locations.",
    image: "https://i.postimg.cc/q7R9Mg6D/Zia.jpg",
    instagram: "https://www.instagram.com/ziaullahtufail?igsh=MWs4bDE0bjQ3cTUwMw=="
  },
  {
    id: "faizan",
    name: "Faizan",
    role: "Chief Marketing Officer",
    bio: "Telling the stories of Pakistan's pristine landscapes and curated living spaces, keeping Ember Rentals at the peak of elite travelers' minds.",
    image: "https://i.postimg.cc/Bnc1ctNv/IMG-5545.jpg",
    instagram: "https://www.instagram.com/scalewfaizan"
  }
];

export const GALLERY_ITEMS = [
  { url: "https://i.postimg.cc/6QBbrhSF/IMG-4680.avif", category: "Living Rooms" },
  { url: "https://i.postimg.cc/7hwFfk4x/IMG-4494.avif", category: "Infinity Pools" },
  { url: "https://i.postimg.cc/wBPWCd3z/IMG-6294.avif", category: "Jacuzzis" },
  { url: "https://i.postimg.cc/DZ6SW7sh/IMG-6145.avif", category: "Mountain Resorts" },
  { url: "https://i.postimg.cc/ZqKR112d/IMG-6133.avif", category: "Luxury Bedrooms" },
  { url: "https://i.postimg.cc/FRSQqprY/IMG-4499.avif", category: "Skyline Views" },
  { url: "https://i.postimg.cc/ydHf1yhk/IMG-6242.avif", category: "Outdoor Terraces" },
  { url: "https://i.postimg.cc/bv8bdCMd/IMG-6238.avif", category: "Farmhouses" },
  { url: "https://i.postimg.cc/G9wtV9n8/IMG-6083.avif", category: "Guest Houses" }
];

export const FAQS = [
  {
    q: "What cities does Ember Rentals operate in?",
    a: "We proudly host luxury stays in Islamabad, Rawalpindi, Lahore, Murree, Nathia Gali, and Karachi. We are expanding to more premium locations soon!"
  },
  {
    q: "How does the guest capacity range filter work?",
    a: "To offer unmatched comfort, our properties list maximum guest limits. You can filter properties based on your group size (e.g. 1-2, 3-4, 5-6, or 7+ guests) to match your stay requirements precisely."
  },
  {
    q: "Can I book instantly via WhatsApp?",
    a: "Yes! Every property card has a 'Book via WhatsApp' button. It auto-generates a detailed message with the property name, check-in dates, and pricing details so our 24/7 concierge can lock in your booking instantly."
  },
  {
    q: "Are your properties safe and secure?",
    a: "Security is our highest benchmark. Every apartment, resort, and penthouse resides inside premium, guarded gated developments or luxury towers with 24/7 round-the-clock physical security and smart card access."
  },
  {
    q: "Do you support custom event hosting or wedding stay bookings?",
    a: "Absolutely. Our elite farmhouses and scenic resorts are ideal for family reunions, honeymoons, and private business retreats. Reach out via our Inquiry Form or WhatsApp to arrange custom premium requirements."
  }
];
