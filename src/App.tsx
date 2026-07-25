import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  MapPin, 
  Search, 
  Calendar, 
  Users, 
  ChevronRight, 
  Phone, 
  Instagram, 
  ArrowRight, 
  Check, 
  HelpCircle,
  MessageSquare,
  MessageCircle,
  Shield,
  Clock,
  ThumbsUp,
  SlidersHorizontal,
  X
} from "lucide-react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PropertyCard from "./components/PropertyCard";
import InquiryForm from "./components/InquiryForm";
import CitySelector from "./components/CitySelector";
import { CompareTray, CompareModal } from "./components/CompareProperties";
import SheetHelpModal from "./components/SheetHelpModal";
import CategoryCard from "./components/CategoryCard";
import AmenitiesSection from "./components/AmenitiesSection";
import { parseMediaList, parseAmenities } from "./utils/mediaUtils";
import { Property, Category, City, Testimonial, Leader } from "./types";
import { 
  CITIES, 
  CATEGORIES, 
  FALLBACK_PROPERTIES, 
  TESTIMONIALS, 
  LEADERS, 
  GALLERY_ITEMS, 
  FAQS 
} from "./data";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Page / Tab navigation state
  const [activeTab, setActiveTab] = useState<string>("home");

  // Properties list loaded dynamically
  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingProperties, setLoadingProperties] = useState<boolean>(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedGuestsRange, setSelectedGuestsRange] = useState<string>("any");
  const [sortBy, setSortBy] = useState<string>("default");

  // Home page Search Bar local inputs (applied on search click)
  const [homeCity, setHomeCity] = useState<string>("Islamabad");
  const [homeCheckin, setHomeCheckin] = useState<string>("");
  const [homeCheckout, setHomeCheckout] = useState<string>("");
  const [homeGuestsRange, setHomeGuestsRange] = useState<string>("any");

  // Global checkin/checkout dates (for WhatsApp prefill)
  const [activeCheckin, setActiveCheckin] = useState<string>("");
  const [activeCheckout, setActiveCheckout] = useState<string>("");

  // Lightbox for visual gallery
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  // Testimonial sliding state
  const [testimonialIndex, setTestimonialIndex] = useState<number>(0);

  // Inquiry property prefill
  const [prefilledInquiryProperty, setPrefilledInquiryProperty] = useState<string>("");

  // FAQ open indexes
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Property comparison state
  const [comparedPropertyIds, setComparedPropertyIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState<boolean>(false);
  const [isSheetHelpOpen, setIsSheetHelpOpen] = useState<boolean>(false);

  // Fetch properties from Google Sheets (via Sheetbest API) with robust fallback
  useEffect(() => {
    const fetchProperties = async () => {
      setLoadingProperties(true);
      try {
        const sheetUrl = "https://api.sheetbest.com/sheets/d591ec86-b52d-4d32-9163-4e0b05115fa7";
        const res = await fetch(sheetUrl);
        if (!res.ok) throw new Error("Sheet API returned an error status");
        
        const data = await res.json();
        if (data && Array.isArray(data) && data.length > 0) {
          // Map and clean sheets data
          const normalized: Property[] = data.map((row: any, idx: number) => {
            const title = row.title || row.name || `Luxury Villa ${idx + 1}`;
            const city = row.city || row.location || "Islamabad";
            const rawType = String(row.type || row.category || "Apartment").trim().toLowerCase();
            let type = "Apartment";
            if (rawType.includes("guesthouse") || rawType.includes("guest house") || rawType.includes("guest-house")) {
              type = "Guest House";
            } else if (rawType.includes("penthouse") || rawType === "pent") {
              type = "Penthouse";
            } else if (rawType.includes("farmhouse") || rawType.includes("farm house") || rawType.includes("farm-house")) {
              type = "Farmhouse";
            } else if (rawType.includes("resort")) {
              type = "Resort";
            } else if (rawType.includes("glamp")) {
              type = "Glamp";
            } else if (rawType.includes("apartment") || rawType.includes("flat") || rawType.includes("room")) {
              type = "Apartment";
            } else {
              type = rawType
                .split(/[\s\-_]+/)
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
            }
            const price = row.price || row.rate || "PKR 30,000 / night";
            const desc = row.desc || row.description || "Curated stay featuring high-end spaces and exquisite attention to comfort.";
            
            // Parse media (images and videos)
            const rawMedia = row.image || row.images || row.photo || row.photos || row.video || row.videos || "";
            const mediaItems = parseMediaList(rawMedia);
            const mediaUrls = mediaItems.map((m) => m.url);

            // Parse amenities
            const amenitiesList = parseAmenities(row);
            
            // Parse Google Map link or iframe embed code with smart detection
            let mapUrl = "";
            const specificMapKeys = ["googlemap", "googlemaps", "mapurl", "maplink", "googlemaplink", "googlemapurl", "map", "maps", "gmap", "gmaps", "embed", "mapembed", "iframe", "locationmap", "mapshare", "sharemap"];
            
            // Step 1: First check if any cell value in the row contains an iframe tag or google maps URL
            for (const key of Object.keys(row)) {
              const val = String(row[key] || "").trim();
              if (val.includes("<iframe") || val.includes("&lt;iframe") || val.includes("google.com/maps") || val.includes("maps.app.goo.gl") || val.includes("output=embed") || val.includes("embed?pb=")) {
                mapUrl = val;
                break;
              }
            }

            // Step 2: If not found by content, check explicit map column names
            if (!mapUrl) {
              for (const key of Object.keys(row)) {
                const k = key.toLowerCase().replace(/[^a-z0-9]/g, "");
                if (specificMapKeys.includes(k)) {
                  if (row[key] && String(row[key]).trim().length > 0) {
                    mapUrl = String(row[key]).trim();
                    break;
                  }
                }
              }
            }

            // Parse price string to number for range operations if possible
            let pricePerNight = 30000;
            const parsedPrice = parseInt(price.replace(/[^0-9]/g, ""), 10);
            if (!isNaN(parsedPrice)) pricePerNight = parsedPrice;

            // Determine guest limit
            let maxGuests = 4;
            if (row.maxGuests || row.capacity || row.guests) {
              const parsedGuests = parseInt(row.maxGuests || row.capacity || row.guests, 10);
              if (!isNaN(parsedGuests)) maxGuests = parsedGuests;
            } else {
              // Guess based on Title keywords
              const tLower = title.toLowerCase();
              if (tLower.includes("1 bedroom") || tLower.includes("1bd")) maxGuests = 2;
              else if (tLower.includes("2 bedroom") || tLower.includes("2bd")) maxGuests = 4;
              else if (tLower.includes("3 bedroom") || tLower.includes("3bd")) maxGuests = 6;
              else if (tLower.includes("farmhouse")) maxGuests = 12;
              else if (tLower.includes("penthouse")) maxGuests = 6;
            }

            return {
              id: String(row.id || idx + 1),
              title,
              price,
              pricePerNight,
              desc,
              image: mediaUrls.join(", "),
              images: mediaUrls,
              amenity1: amenitiesList[0] || "WiFi Included",
              amenity2: amenitiesList[1] || "Concierge Care",
              amenities: amenitiesList,
              city,
              type,
              maxGuests,
              mapUrl: mapUrl ? String(mapUrl).trim() : undefined
            };
          });

          setProperties(normalized);
          console.log(`✓ Loaded ${normalized.length} properties dynamically from Google Sheets.`);
        } else {
          throw new Error("No properties found in sheet data");
        }
      } catch (err) {
        console.warn("⚠ Failed to load Google Sheet, using high-quality local fallback properties.", err);
        setProperties(FALLBACK_PROPERTIES);
      } finally {
        setLoadingProperties(false);
      }
    };

    fetchProperties();
  }, []);

  // Handle incoming shared deep-links (?property=ID)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const propId = params.get("property");
    if (propId && properties.length > 0) {
      const matched = properties.find((p) => p.id === propId);
      if (matched) {
        // Direct to properties tab and set the filter search query
        setSearchQuery(matched.title);
        setActiveTab("properties");
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Clean up URL parameters so it doesn't get stuck on subsequent visits/reloads
        try {
          const newUrl = window.location.pathname + window.location.hash;
          window.history.replaceState({}, document.title, newUrl);
        } catch (e) {
          console.warn("Could not clean up URL search parameters:", e);
        }
      }
    }
  }, [properties]);

  // Interval hook for cycling reviews testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Filter application helper
  const filteredProperties = properties.filter((p) => {
    // 1. Search query match
    const searchLower = searchQuery.toLowerCase();
    const titleMatch = p.title.toLowerCase().includes(searchLower);
    const descMatch = p.desc.toLowerCase().includes(searchLower);
    const cityMatch = p.city.toLowerCase().includes(searchLower);
    const typeMatch = p.type.toLowerCase().includes(searchLower);
    const queryMatches = !searchQuery || titleMatch || descMatch || cityMatch || typeMatch;

    // 2. City filter
    const cityMatches = selectedCity === "all" || p.city.toLowerCase() === selectedCity.toLowerCase();

    // 3. Category / Type filter
    const typeMatches = selectedType === "all" || p.type.toLowerCase() === selectedType.toLowerCase();

    // 4. Guest range filter
    // Options: 'any' | '1-2' | '3-4' | '5-6' | '7+'
    let guestsMatches = true;
    if (selectedGuestsRange === "1-2") {
      guestsMatches = p.maxGuests >= 1 && p.maxGuests <= 2;
    } else if (selectedGuestsRange === "3-4") {
      guestsMatches = p.maxGuests >= 3 && p.maxGuests <= 4;
    } else if (selectedGuestsRange === "5-6") {
      guestsMatches = p.maxGuests >= 5 && p.maxGuests <= 6;
    } else if (selectedGuestsRange === "7+") {
      guestsMatches = p.maxGuests >= 7;
    }

    return queryMatches && cityMatches && typeMatches && guestsMatches;
  });

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (sortBy === "price-asc") {
      return a.pricePerNight - b.pricePerNight;
    } else if (sortBy === "price-desc") {
      return b.pricePerNight - a.pricePerNight;
    } else if (sortBy === "name-asc") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Handle comparison selection and toggle
  const handleToggleCompare = (propertyId: string) => {
    setComparedPropertyIds((prev) => {
      if (prev.includes(propertyId)) {
        return prev.filter((id) => id !== propertyId);
      } else {
        if (prev.length >= 3) {
          return prev; // Maximum 3 items
        }
        return [...prev, propertyId];
      }
    });
  };

  // Get currently selected comparison Property objects
  const comparedProperties = properties.filter((p) => comparedPropertyIds.includes(p.id));

  // Action: Clicking home page Search widget
  const handleHomeSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSelectedCity(homeCity);
    setSelectedGuestsRange(homeGuestsRange);
    setActiveCheckin(homeCheckin);
    setActiveCheckout(homeCheckout);
    setActiveTab("properties");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Action: Clicking explore city
  const handleCitySelect = (cityName: string) => {
    setSelectedCity(cityName);
    setActiveTab("properties");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Action: Clicking category 'Explore More'
  const handleCategorySelect = (categoryType: string) => {
    setSelectedType(categoryType);
    setActiveTab("properties");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Action: Header or Hero CTAs
  const handleBookYourStayClick = () => {
    setSelectedCity("all");
    setSelectedType("all");
    setSelectedGuestsRange("any");
    setActiveTab("properties");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#08080a] text-[#f4efe3] overflow-x-hidden selection:bg-gold selection:text-charcoal flex flex-col font-sans">
      
      {/* Dynamic Header Component */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onBookStayClick={handleBookYourStayClick} 
      />

      {/* Main Dynamic Viewport with transition container */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          
          {/* ==================== HOME TAB ==================== */}
          {activeTab === "home" && (
            <motion.div
              key="home-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Premium Luxury Hero Section */}
              <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-24 pb-12">
                {/* Background Video or high-end illustration */}
                <div className="absolute inset-0 z-0">
                  <video 
                    autoPlay 
                    muted 
                    loop 
                    playsInline 
                    className="w-full h-full object-cover saturate-[0.8] brightness-[0.4]"
                    poster="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80"
                  >
                    <source src="https://assets.mixkit.co/videos/4641/4641-360.mp4" type="video/mp4" />
                  </video>
                  {/* Subtle luxurious color gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#08080a]/60 via-[#08080a]/80 to-[#08080a]" />
                  <div className="absolute inset-0 bg-radial-at-b from-gold/15 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Hero Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full flex flex-col items-center text-center mt-8">
                  
                  {/* Eyebrow Label */}
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-line bg-charcoal/40 backdrop-blur-md text-gold-light text-xs tracking-[0.22em] uppercase mb-6"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
                    Pakistan's Luxury Stay Collection
                  </motion.div>

                  {/* Title */}
                  <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="font-serif text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.1] max-w-4xl text-ink mb-6"
                  >
                    Luxury stays, <em className="italic font-medium text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-gold-deep filter drop-shadow-[0_0_15px_rgba(201,162,78,0.2)]">curated</em> for unforgettable escapes.
                  </motion.h1>

                  {/* Subtext */}
                  <motion.p 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-muted-gold text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed mb-10 font-light"
                  >
                    Handpicked apartments, penthouses, resorts, glamps, and farmhouses across Pakistan. Every stay chosen for comfort, privacy, and five-star hospitality.
                  </motion.p>

                  {/* Action buttons */}
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap items-center justify-center gap-4 mb-12"
                  >
                    <button
                      onClick={handleBookYourStayClick}
                      className="cursor-pointer font-sans px-8 py-4 rounded-full font-bold text-sm tracking-wider uppercase text-charcoal bg-gradient-to-r from-gold to-gold-light hover:brightness-110 shadow-2xl hover:shadow-gold/30 transition-all transform hover:-translate-y-1 active:translate-y-0"
                    >
                      Book Your stay
                    </button>
                    <button
                      onClick={() => {
                        const target = document.getElementById("featured-categories");
                        target?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="cursor-pointer font-sans px-8 py-4 rounded-full font-bold text-sm tracking-wider uppercase text-ink border border-line hover:border-gold-light/40 hover:bg-white/[0.02] transition-all transform hover:-translate-y-1 active:translate-y-0"
                    >
                      Explore Categories
                    </button>
                  </motion.div>

                  {/* Search / Booking filter bar widget */}
                  <motion.form 
                    initial={{ opacity: 0, y: 25 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    onSubmit={handleHomeSearchSubmit}
                    className="w-full max-w-5xl bg-charcoal-light/80 backdrop-blur-xl border border-line rounded-3xl p-5 md:p-6 shadow-2xl grid grid-cols-1 md:grid-cols-5 gap-4 items-end text-left"
                  >
                    {/* Destination City Field */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-gold-light flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Destination
                      </label>
                      <select 
                        value={homeCity}
                        onChange={(e) => setHomeCity(e.target.value)}
                        className="bg-white/[0.04] border border-line hover:border-line-strong rounded-xl py-3 px-4 text-xs font-semibold text-ink focus:outline-none focus:border-gold transition-all cursor-pointer appearance-none"
                      >
                        {CITIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>

                    {/* Check In Date */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-gold-light flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Check In
                      </label>
                      <input 
                        type="date" 
                        value={homeCheckin}
                        onChange={(e) => setHomeCheckin(e.target.value)}
                        className="bg-white/[0.04] border border-line hover:border-line-strong rounded-xl py-3 px-4 text-xs font-semibold text-ink focus:outline-none focus:border-gold transition-all"
                      />
                    </div>

                    {/* Check Out Date */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-gold-light flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Check Out
                      </label>
                      <input 
                        type="date" 
                        value={homeCheckout}
                        onChange={(e) => setHomeCheckout(e.target.value)}
                        className="bg-white/[0.04] border border-line hover:border-line-strong rounded-xl py-3 px-4 text-xs font-semibold text-ink focus:outline-none focus:border-gold transition-all"
                      />
                    </div>

                    {/* Guest Range Selector Bucket */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-gold-light flex items-center gap-1">
                        <Users className="w-3 h-3" /> Guest Range
                      </label>
                      <select 
                        value={homeGuestsRange}
                        onChange={(e) => setHomeGuestsRange(e.target.value)}
                        className="bg-white/[0.04] border border-line hover:border-line-strong rounded-xl py-3 px-4 text-xs font-semibold text-ink focus:outline-none focus:border-gold transition-all cursor-pointer"
                      >
                        <option value="any">Any Capacity</option>
                        <option value="1-2">1 - 2 Guests</option>
                        <option value="3-4">3 - 4 Guests</option>
                        <option value="5-6">5 - 6 Guests</option>
                        <option value="7+">7+ Guests (Large groups)</option>
                      </select>
                    </div>

                    {/* Search Submit */}
                    <button
                      type="submit"
                      className="w-full cursor-pointer bg-gradient-to-r from-gold via-gold-light to-gold rounded-xl py-3.5 font-bold text-xs uppercase tracking-wider text-charcoal shadow-lg hover:shadow-gold/20 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      Search Stays
                    </button>
                  </motion.form>

                  {/* Trust Items badges Row */}
                  <div className="mt-12 flex flex-wrap items-center justify-center gap-4 text-xs text-gold-light font-medium">
                    <span className="flex items-center gap-2 bg-white/[0.03] border border-line px-4 py-2 rounded-full">
                      <Shield className="w-4 h-4 text-gold" />
                      4 Years of Hospitality Excellence
                    </span>
                    <span className="flex items-center gap-2 bg-white/[0.03] border border-line px-4 py-2 rounded-full">
                      <Sparkles className="w-4 h-4 text-gold" />
                      100% Curated Premium Standard
                    </span>
                    <span className="flex items-center gap-2 bg-white/[0.03] border border-line px-4 py-2 rounded-full">
                      <Clock className="w-4 h-4 text-gold" />
                      24/7 Dedicated Support
                    </span>
                  </div>

                </div>
              </section>

              {/* SECTION: Explore Pakistan Destinations (Interactive City Selection) */}
              <section className="py-24 bg-charcoal-light border-t border-line/40">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                  
                  {/* Section header */}
                  <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-bold">
                      Explore Pakistan
                    </span>
                    <h2 className="font-serif text-3xl md:text-5xl font-semibold text-ink mt-2 mb-4">
                      Elite Destinations
                    </h2>
                    <div className="flex items-center justify-center gap-3 w-max mx-auto mb-4">
                      <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-gold" />
                      <div className="w-2 h-2 rounded-full bg-gold-light shadow-[0_0_8px_var(--color-gold)]" />
                      <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-gold" />
                    </div>
                    <p className="text-muted-gold text-xs sm:text-sm">
                      Click any city below to instantly see our curated premium stays with active filters applied.
                    </p>
                  </div>

                  {/* City selector list */}
                  <CitySelector cities={CITIES} onCityClick={handleCitySelect} />

                </div>
              </section>

              {/* SECTION: categories grid (Strict request: home page only shows type/category of properties) */}
              <section id="featured-categories" className="py-24 bg-charcoal border-t border-line/40">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                  
                  {/* Section header */}
                  <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-bold">
                      Our Collections
                    </span>
                    <h2 className="font-serif text-3xl md:text-5xl font-semibold text-ink mt-2 mb-4">
                      Stay Categories &amp; Types
                    </h2>
                    {/* Decorative Divider */}
                    <div className="flex items-center justify-center gap-3 w-max mx-auto mb-4">
                      <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-gold" />
                      <div className="w-2 h-2 rounded-full bg-gold-light shadow-[0_0_8px_var(--color-gold)]" />
                      <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-gold" />
                    </div>
                    <p className="text-muted-gold text-xs sm:text-sm">
                      We organize Pakistan's premier lodgings into beautifully themed categories. Find the style that perfectly fits your journey, with complete transparency.
                    </p>
                  </div>

                  {/* Grid of categories with starting prices and explore buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {CATEGORIES.map((cat) => (
                      <CategoryCard 
                        key={cat.id} 
                        category={cat} 
                        onExploreClick={handleCategorySelect} 
                      />
                    ))}
                  </div>

                </div>
              </section>

              {/* SECTION: Every Occasion - Tailored Escapes */}
              <section className="py-24 bg-charcoal-light border-t border-line/40">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                  {/* Section header */}
                  <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-bold">
                      Every Occasion
                    </span>
                    <h2 className="font-serif text-3xl md:text-5xl font-semibold text-ink mt-2 mb-4">
                      Tailored luxury for every escape
                    </h2>
                    <div className="flex items-center justify-center gap-3 w-max mx-auto mb-4">
                      <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-gold" />
                      <div className="w-2 h-2 rounded-full bg-gold-light shadow-[0_0_8px_var(--color-gold)]" />
                      <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-gold" />
                    </div>
                    <p className="text-muted-gold text-xs sm:text-sm font-light">
                      Whether planning a family vacation, romantic getaway, or corporate retreat, we craft perfect settings tailored exactly to your needs.
                    </p>
                  </div>

                  {/* 8 Occasions Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { title: "Family Vacations", desc: "Spacious luxury for multi-generational comfort.", emoji: "👨‍👩‍👧‍👦" },
                      { title: "Romantic Getaways", desc: "Intimate settings with stunning private vistas.", emoji: "💖" },
                      { title: "Honeymoons", desc: "Bespoke packages in scenic, highly private retreats.", emoji: "🌹" },
                      { title: "Business Trips", desc: "Workstations, blazing fiber WiFi, and prime city centers.", emoji: "💼" },
                      { title: "Weekend Escapes", desc: "Quick premium retreats to reset from routine.", emoji: "⛰️" },
                      { title: "Friends Gatherings", desc: "Huge open lawns, pool parties, and BBQ lounges.", emoji: "🥂" },
                      { title: "Birthday Celebrations", desc: "Curated farmhouses for memorable private events.", emoji: "🎂" },
                      { title: "Corporate Retreats", desc: "Immersive team retreats in tranquil mountain locations.", emoji: "🤝" }
                    ].map((occ, idx) => (
                      <div 
                        key={idx}
                        className="p-6 bg-[#0e0d11]/40 border border-line/80 hover:border-gold/30 rounded-2xl transition-all duration-300 flex flex-col gap-3 group hover:bg-white/[0.01] cursor-pointer"
                        onClick={handleBookYourStayClick}
                      >
                        <div className="w-10 h-10 rounded-full bg-gold/5 border border-gold/10 flex items-center justify-center text-lg group-hover:bg-gold/10 transition-all duration-300 shadow-[0_0_8px_rgba(232,206,143,0.05)]">
                          {occ.emoji}
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-ink group-hover:text-gold-light transition-colors duration-300 text-left">
                            {occ.title}
                          </h4>
                          <p className="text-xs text-muted-gold leading-relaxed mt-1.5 font-light text-left">
                            {occ.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION: Hospitality Stats & Achievements Banner */}
              <section className="py-20 bg-charcoal border-t border-line/40 relative overflow-hidden">
                <div className="absolute inset-0 bg-radial-at-t from-gold/5 via-transparent to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    
                    {/* Left: Beautiful bedroom visual with elegant framing */}
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-line shadow-2xl">
                      <img 
                        src="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1000&q=80" 
                        alt="Ember Luxury Living" 
                        className="w-full h-full object-cover saturate-[0.8] brightness-[0.7]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-charcoal/40 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6 p-5 bg-charcoal/80 backdrop-blur-md rounded-2xl border border-line flex items-center justify-between">
                        <div>
                          <span className="text-[9px] font-bold text-gold uppercase tracking-widest">Featured Residence</span>
                          <h5 className="text-xs font-serif text-ink mt-0.5">The Imperial Royal Penthouse</h5>
                        </div>
                        <button 
                          onClick={handleBookYourStayClick}
                          className="cursor-pointer text-[10px] font-bold uppercase tracking-wider text-gold hover:text-gold-light transition-colors"
                        >
                          View Details &rarr;
                        </button>
                      </div>
                    </div>

                    {/* Right: Big Bold Numbers Grid */}
                    <div className="space-y-8 text-left">
                      <div>
                        <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-bold">
                          Ember by the Numbers
                        </span>
                        <h3 className="font-serif text-3xl md:text-5xl font-semibold text-ink mt-2 mb-4 leading-tight">
                          Setting new gold standards for short stays
                        </h3>
                        <p className="text-muted-gold text-xs sm:text-sm font-light leading-relaxed">
                          We believe in architectural excellence, highly verified cleanliness, and seamless instant reservations. Over four years, we have scaled our footprint across Pakistan's most scenic destinations.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-6 pt-4">
                        {[
                          { num: "4+", label: "Years of Hospitality", desc: "Consistent premium standards since 2022." },
                          { num: "6", label: "Major Cities", desc: "Top safe-haven urban & holiday locations." },
                          { num: "100+", label: "Luxury Properties", desc: "Vetted handpicked premium collection." },
                          { num: "1000+", label: "Happy Guests", desc: "Unmatched five-star reviews and memories." }
                        ].map((stat, idx) => (
                          <div key={idx} className="p-5 bg-[#0e0d11]/40 border border-line/80 rounded-2xl">
                            <span className="font-serif text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-light to-gold-deep block">
                              {stat.num}
                            </span>
                            <span className="text-xs font-semibold text-ink mt-1.5 block">
                              {stat.label}
                            </span>
                            <span className="text-[10px] text-muted-soft mt-1 block leading-normal font-light">
                              {stat.desc}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </section>

              {/* SECTION: Our Promise / Why Choose Us */}
              <section className="py-24 bg-charcoal border-t border-line/40">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                  {/* Section header */}
                  <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-bold">
                      Our Promise
                    </span>
                    <h2 className="font-serif text-3xl md:text-5xl font-semibold text-ink mt-2 mb-4">
                      Why Choose Ember Rentals
                    </h2>
                    <div className="flex items-center justify-center gap-3 w-max mx-auto mb-4">
                      <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-gold" />
                      <div className="w-2 h-2 rounded-full bg-gold-light shadow-[0_0_8px_var(--color-gold)]" />
                      <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-gold" />
                    </div>
                    <p className="text-muted-gold text-xs sm:text-sm font-light">
                      We set the benchmark for luxury short-term accommodations in Pakistan with consistent, audited, and guest-centric hospitality.
                    </p>
                  </div>

                  {/* 8 Benefits Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { title: "Luxury verified properties", desc: "Fully vetted, handpicked stays featuring state-of-the-art designs and comfort." },
                      { title: "Professional hospitality", desc: "Dedicated on-ground care ensuring five-star luxury standards from check-in to check-out." },
                      { title: "Prime locations", desc: "Situated in Pakistan's safest, most central, and aesthetically beautiful neighborhoods." },
                      { title: "Premium cleanliness", desc: "Deeply sanitized, professionally laundered, and audited hygiene protocols before every arrival." },
                      { title: "24/7 guest support", desc: "Round-the-clock concierge team standing by on WhatsApp to cater to every bespoke request." },
                      { title: "Instant booking", desc: "Hassle-free checkout process with instant reservations confirmed directly on WhatsApp." },
                      { title: "Transparent pricing", desc: "Competitive rates, zero hidden fees, and fully outlined stay inclusions." },
                      { title: "Safe and secure stays", desc: "Situated inside highly guarded towers or private luxury developments with 24/7 guarded security." }
                    ].map((benefit, index) => (
                      <div 
                        key={index}
                        className="p-6 bg-[#0e0d11]/40 border border-line/80 hover:border-gold/30 rounded-2xl transition-all duration-300 flex flex-col gap-3 group hover:bg-white/[0.01]"
                      >
                        <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold-light group-hover:bg-gold group-hover:text-charcoal transition-all duration-300 shadow-[0_0_8px_rgba(232,206,143,0.1)]">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-ink group-hover:text-gold-light transition-colors duration-300">
                            {benefit.title}
                          </h4>
                          <p className="text-xs text-muted-gold leading-relaxed mt-1.5 font-light">
                            {benefit.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* SECTION: Signature Curated Amenities */}
              <AmenitiesSection />

              {/* SECTION: Experience Gallery with Lightbox */}
              <section className="py-24 bg-charcoal">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                  
                  {/* Section header */}
                  <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-bold">
                      Visual Showcase
                    </span>
                    <h2 className="font-serif text-3xl md:text-5xl font-semibold text-ink mt-2 mb-4">
                      Glimpse into Ember living
                    </h2>
                    <div className="flex items-center justify-center gap-3 w-max mx-auto mb-4">
                      <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-gold" />
                      <div className="w-2 h-2 rounded-full bg-gold-light shadow-[0_0_8px_var(--color-gold)]" />
                      <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-gold" />
                    </div>
                  </div>

                  {/* Gallery grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {GALLERY_ITEMS.map((item, index) => (
                      <div 
                        key={index}
                        onClick={() => setLightboxImg(item.url)}
                        className="group relative cursor-pointer aspect-square rounded-2xl overflow-hidden border border-line bg-black/40"
                      >
                        <img 
                          src={item.url} 
                          alt={item.category} 
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Caption Tag */}
                        <div className="absolute bottom-4 left-4 bg-charcoal-light/80 backdrop-blur-md border border-line px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-ink transition-transform translate-y-2 group-hover:translate-y-0 duration-300">
                          {item.category}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </section>

              {/* SECTION: Reviews Slider */}
              <section className="py-24 bg-charcoal-light border-t border-line/40 relative">
                <div className="max-w-5xl mx-auto px-4 md:px-8 text-center">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-bold">
                    Testimonials
                  </span>
                  <h2 className="font-serif text-3xl md:text-5xl font-semibold text-ink mt-2 mb-16">
                    Loved by Guests Across Pakistan
                  </h2>

                  {/* Slider Card */}
                  <div className="relative bg-[#08080a]/60 border border-line rounded-3xl p-8 md:p-12 max-w-3xl mx-auto shadow-2xl overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-gold/5 via-gold to-gold/5" />
                    
                    <div className="flex items-center justify-center gap-1 text-gold mb-6 text-lg">
                      {Array.from({ length: TESTIMONIALS[testimonialIndex].rating }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>

                    <p className="font-serif italic text-lg sm:text-2xl text-ink leading-relaxed mb-8">
                      "{TESTIMONIALS[testimonialIndex].text}"
                    </p>

                    <div className="flex items-center justify-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gold to-gold-light text-charcoal font-bold font-serif text-lg flex items-center justify-center shadow-lg">
                        {TESTIMONIALS[testimonialIndex].avatar}
                      </div>
                      <div className="text-left">
                        <strong className="block text-ink text-sm font-semibold">
                          {TESTIMONIALS[testimonialIndex].name}
                        </strong>
                        <span className="block text-xs text-muted-gold">
                          Verified Stay in {TESTIMONIALS[testimonialIndex].city}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Slider Navigation Dots */}
                  <div className="flex items-center justify-center gap-2.5 mt-8">
                    {TESTIMONIALS.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setTestimonialIndex(idx)}
                        className={`h-2 rounded-full cursor-pointer transition-all ${
                          idx === testimonialIndex ? "w-6 bg-gold" : "w-2 bg-line-strong"
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                </div>
              </section>

              {/* Call to Action Banner on Home */}
              <section className="relative py-28 text-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                  <img 
                    src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80" 
                    alt="Bespoke stays" 
                    className="w-full h-full object-cover brightness-[0.3]"
                  />
                  <div className="absolute inset-0 bg-[#08080a]/80" />
                </div>
                <div className="relative z-10 max-w-4xl mx-auto px-4">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-bold mb-4 block">
                    Your Next Escape
                  </span>
                  <h2 className="font-serif text-4xl sm:text-5xl font-semibold text-ink mb-6">
                    Bespoke luxury is just <em className="italic font-medium text-gold-light">one tap</em> away.
                  </h2>
                  <p className="text-muted-gold text-sm sm:text-base max-w-lg mx-auto mb-8 font-light">
                    Join thousands of elite guests who trust Ember Rentals with their luxury escapes, family vacations, and honeymoon retreats.
                  </p>
                  <button
                    onClick={handleBookYourStayClick}
                    className="cursor-pointer inline-flex items-center gap-2 bg-gradient-to-r from-gold to-gold-light hover:brightness-110 font-bold font-sans text-xs uppercase tracking-wider text-charcoal px-8 py-4 rounded-full shadow-2xl transition-all"
                  >
                    <span>Browse All Listings</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </section>

            </motion.div>
          )}

          {/* ==================== PROPERTIES TAB ==================== */}
          {activeTab === "properties" && (
            <motion.div
              key="properties-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="pt-28 pb-20"
            >
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                
                {/* Visual Banner Header */}
                <div className="text-center max-w-3xl mx-auto mb-12">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-bold">
                    Collection
                  </span>
                  <h2 className="font-serif text-3xl md:text-5xl font-semibold text-ink mt-2 mb-4">
                    Our Curated Luxury Stays
                  </h2>
                  <div className="flex items-center justify-center gap-3 w-max mx-auto mb-4">
                    <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-gold" />
                    <div className="w-2 h-2 rounded-full bg-gold-light shadow-[0_0_8px_var(--color-gold)]" />
                    <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-gold" />
                  </div>
                  <p className="text-muted-gold text-xs sm:text-sm">
                    Select your filters, search specific spots, and book directly via secure WhatsApp integration instantly.
                  </p>
                </div>

                {/* ADVANCED FILTERING PANEL */}
                <div className="bg-charcoal-light/60 border border-line rounded-2xl p-6 mb-12 shadow-xl flex flex-col gap-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line/40 pb-4">
                    <div className="flex items-center gap-2.5">
                      <SlidersHorizontal className="w-4 h-4 text-gold-light" />
                      <span className="font-serif text-sm font-semibold uppercase tracking-wider text-ink">
                        Filter Stays
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      

                      {/* Clear Filters CTA */}
                      {(selectedCity !== "all" || selectedType !== "all" || selectedGuestsRange !== "any" || searchQuery || sortBy !== "default") && (
                        <button
                          onClick={() => {
                            setSelectedCity("all");
                            setSelectedType("all");
                            setSelectedGuestsRange("any");
                            setSearchQuery("");
                            setSortBy("default");
                          }}
                          className="text-[11px] font-bold text-gold-light hover:text-ink transition-colors cursor-pointer"
                        >
                          Reset All Filters
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Grid of inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-left">
                    {/* 1. Keyword Search */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-gold-light">
                        Search Keywords
                      </label>
                      <div className="relative">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-soft" />
                        <input 
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="e.g. jacuzzi, penthouse..."
                          className="w-full bg-white/[0.03] border border-line focus:border-gold rounded-xl py-3 pl-11 pr-4 text-xs text-ink placeholder:text-muted-soft focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* 2. City Filter Dropdown */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-gold-light">
                        City / Destination
                      </label>
                      <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="w-full bg-charcoal-light border border-line focus:border-gold rounded-xl py-3 px-4 text-xs text-ink focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="all">All Cities</option>
                        {CITIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>

                    {/* 3. Category / Type Dropdown */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-gold-light">
                        Stay Type
                      </label>
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-full bg-charcoal-light border border-line focus:border-gold rounded-xl py-3 px-4 text-xs text-ink focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="all">All Categories</option>
                        <option value="Apartment">Luxury Apartments</option>
                        <option value="Penthouse">Elite Penthouses</option>
                        <option value="Resort">Boutique Resorts</option>
                        <option value="Glamp">Scenic Glamps</option>
                        <option value="Farmhouse">Private Farmhouses</option>
                        <option value="Guest House">Luxury Guest Houses</option>
                      </select>
                    </div>

                    {/* 4. Guest Range Dropdown Selector (Strict Request) */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-gold-light">
                        Guest Capacity Range
                      </label>
                      <select
                        value={selectedGuestsRange}
                        onChange={(e) => setSelectedGuestsRange(e.target.value)}
                        className="w-full bg-charcoal-light border border-line focus:border-gold rounded-xl py-3 px-4 text-xs text-ink focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="any">Any Capacity Limit</option>
                        <option value="1-2">1 - 2 Guests Limit</option>
                        <option value="3-4">3 - 4 Guests Limit</option>
                        <option value="5-6">5 - 6 Guests Limit</option>
                        <option value="7+">7+ Guests Limit (Large families)</option>
                      </select>
                    </div>

                    {/* 5. Sort Dropdown */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-widest text-gold-light">
                        Sort Listings
                      </label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full bg-charcoal-light border border-line focus:border-gold rounded-xl py-3 px-4 text-xs text-ink focus:outline-none transition-all cursor-pointer"
                      >
                        <option value="default">Default Order</option>
                        <option value="price-asc">Price (Low to High)</option>
                        <option value="price-desc">Price (High to Low)</option>
                        <option value="name-asc">Name (A-Z)</option>
                      </select>
                    </div>
                  </div>

                  {/* Active Filtering Badges info */}
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-gold">
                    <span>Active Filters:</span>
                    <span className="bg-white/[0.04] border border-line px-2.5 py-1 rounded-md text-ink">
                      City: {selectedCity === "all" ? "All Locations" : selectedCity}
                    </span>
                    <span className="bg-white/[0.04] border border-line px-2.5 py-1 rounded-md text-ink">
                      Category: {selectedType === "all" ? "All Types" : selectedType}
                    </span>
                    <span className="bg-white/[0.04] border border-line px-2.5 py-1 rounded-md text-ink">
                      Guest Capacity: {selectedGuestsRange === "any" ? "Any Group Size" : `${selectedGuestsRange} guests`}
                    </span>
                    {searchQuery && (
                      <span className="bg-white/[0.04] border border-line px-2.5 py-1 rounded-md text-ink">
                        Keyword: "{searchQuery}"
                      </span>
                    )}
                    {sortBy !== "default" && (
                      <span className="bg-gold/10 border border-gold/30 px-2.5 py-1 rounded-md text-gold">
                        Sorted: {sortBy === "price-asc" ? "Price (Low to High)" : sortBy === "price-desc" ? "Price (High to Low)" : "Name (A-Z)"}
                      </span>
                    )}
                  </div>
                </div>

                {/* PROPERTIES GRID */}
                {loadingProperties ? (
                  <div className="py-24 text-center">
                    <div className="w-12 h-12 rounded-full border-t-2 border-gold animate-spin mx-auto mb-4" />
                    <p className="text-sm text-muted-gold">Contacting reservation inventory...</p>
                  </div>
                ) : sortedProperties.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sortedProperties.map((p) => (
                      <div key={p.id} onClick={() => setPrefilledInquiryProperty(p.title)}>
                        <PropertyCard 
                          property={p} 
                          checkinDate={activeCheckin}
                          checkoutDate={activeCheckout}
                          guestsRange={selectedGuestsRange === "any" ? "" : `${selectedGuestsRange} guests`}
                          isCompared={comparedPropertyIds.includes(p.id)}
                          onCompareToggle={() => handleToggleCompare(p.id)}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-20 text-center border border-line border-dashed rounded-2xl max-w-xl mx-auto">
                    <p className="text-sm text-muted-gold mb-6">
                      No matching properties found in this destination bucket. Try adjusting filters or select a different stay category.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCity("all");
                        setSelectedType("all");
                        setSelectedGuestsRange("any");
                        setSearchQuery("");
                      }}
                      className="cursor-pointer text-xs font-semibold uppercase tracking-wider text-charcoal bg-gradient-to-r from-gold to-gold-light px-5 py-2.5 rounded-xl transition-all"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}

                {/* INQUIRY FORM AT BOTTOM OF PROPERTIES PAGE */}
                <div className="mt-24 max-w-4xl mx-auto">
                  <div className="text-center mb-10">
                    <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-bold">
                      Direct Touch
                    </span>
                    <h2 className="font-serif text-2xl md:text-4xl font-semibold text-ink mt-1 mb-2">
                      Inquire About Your Next Stay
                    </h2>
                    <p className="text-muted-gold text-xs">
                      If you have custom requirements or wish to confirm calendar dates with our team.
                    </p>
                  </div>
                  <InquiryForm 
                    properties={properties} 
                    prefilledProperty={prefilledInquiryProperty} 
                  />
                </div>

              </div>
            </motion.div>
          )}

          {/* ==================== ABOUT TAB ==================== */}
          {activeTab === "about" && (
            <motion.div
              key="about-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="pt-28 pb-20"
            >
              <div className="max-w-7xl mx-auto px-4 md:px-8">
                
                {/* Intro Hero banner */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
                  <div className="lg:col-span-7 text-left">
                    <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-bold">
                      Ember Rentals
                    </span>
                    <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold text-ink mt-2 mb-6">
                      Where luxury meets <em className="italic font-medium text-gold-light">hospitality</em>
                    </h2>
                    <div className="w-20 h-[2px] bg-gradient-to-r from-gold to-transparent mb-6" />
                    
                    <p className="text-muted-gold text-sm sm:text-base leading-relaxed mb-6 font-light">
                      Founded four years ago, Ember Rentals has grown from a single premium apartment in Islamabad to Pakistan's pre-eminent short-stay hospitality brand, spanning 6 major cities.
                    </p>
                    <p className="text-muted-gold text-sm sm:text-base leading-relaxed mb-8 font-light">
                      We believe a vacation or business trip is defined by the spaces you occupy. Every single listing inside Ember's portfolio undergoes rigorous aesthetic verification, linen-quality inspection, and technical audit. From secure private swimming pools to heated high-altitude domes, your peaceful stay is our highest benchmark.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/[0.02] border border-line p-5 rounded-2xl">
                        <strong className="block font-serif text-3xl text-gold-light">4+ Years</strong>
                        <span className="text-[10px] uppercase text-muted-gold tracking-widest font-semibold">Of pristine operations</span>
                      </div>
                      <div className="bg-white/[0.02] border border-line p-5 rounded-2xl">
                        <strong className="block font-serif text-3xl text-gold-light">1,000+</strong>
                        <span className="text-[10px] uppercase text-muted-gold tracking-widest font-semibold">Happy VIP guests</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-gold/15 to-transparent rounded-2xl pointer-events-none" />
                    <img 
                      src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80" 
                      alt="Luxury interior" 
                      className="w-full h-[400px] object-cover rounded-2xl border border-line shadow-2xl"
                    />
                    <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-gold to-gold-light text-charcoal px-6 py-4 rounded-2xl shadow-xl text-center">
                      <strong className="block font-serif text-2xl font-bold leading-none">100+</strong>
                      <span className="text-[9px] uppercase tracking-widest font-bold">Premium stays</span>
                    </div>
                  </div>
                </div>

                {/* LEADERSHIP SECTION (FOUNDER AND BOARD MEMBERS WITH LINKS) */}
                <div className="py-16 border-t border-line/40">
                  <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-bold">
                      Ember Leadership
                    </span>
                    <h2 className="font-serif text-3xl md:text-5xl font-semibold text-ink mt-2 mb-4">
                      Meet the Founders &amp; Board
                    </h2>
                    <p className="text-muted-gold text-xs sm:text-sm">
                      Our dynamic executives driving Ember Rentals' commitment to luxury standards, market expansion, and exquisite operations.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {LEADERS.map((leader) => (
                      <div 
                        key={leader.id}
                        className="bg-charcoal-light border border-line rounded-2xl p-6 text-center flex flex-col items-center group relative overflow-hidden"
                      >
                        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Circle Portrait */}
                        <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gold/40 p-1 mb-6 shadow-xl transition-all duration-300 group-hover:border-gold-light group-hover:shadow-gold/25 flex-shrink-0">
                          <img 
                            src={leader.image} 
                            alt={leader.name} 
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>

                        <span className="text-[10px] uppercase tracking-wider text-gold font-semibold mb-1">
                          {leader.role}
                        </span>
                        
                        <h4 className="font-serif text-xl font-bold text-ink mb-3 group-hover:text-gold-light transition-colors">
                          {leader.name}
                        </h4>

                        <p className="text-muted-gold text-xs leading-relaxed italic mb-6 max-w-[240px]">
                          "{leader.bio}"
                        </p>

                        {/* Instagram quick-action */}
                        <a 
                          href={leader.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-auto flex items-center justify-center gap-2 text-[10px] uppercase font-bold tracking-wider text-muted-gold hover:text-gold-light border border-line hover:border-gold/30 rounded-full px-5 py-2.5 bg-white/[0.01] hover:bg-gold/5 transition-all w-full"
                        >
                          <Instagram className="w-3.5 h-3.5" />
                          <span>Instagram</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ==================== INQUIRY TAB ==================== */}
          {activeTab === "inquiry" && (
            <motion.div
              key="inquiry-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="pt-28 pb-20"
            >
              <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
                
                <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-bold">
                  Bespoke Support
                </span>
                <h2 className="font-serif text-3xl md:text-5xl font-semibold text-ink mt-2 mb-4">
                  Reservations &amp; Custom Booking
                </h2>
                <p className="text-muted-gold text-xs sm:text-sm max-w-xl mx-auto mb-12">
                  Submit detailed requirements regarding honeymoons, private corporate getaways, and luxury villa schedules. Let our booking concierge handles the rest.
                </p>

                {/* Inquiry Form component */}
                <InquiryForm properties={properties} />

                {/* Additional Quick Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 text-left">
                  <div className="bg-charcoal-light border border-line p-5 rounded-2xl">
                    <h5 className="font-serif text-base font-semibold text-ink mb-2">Concierge Phone</h5>
                    <a href="https://wa.me/923052367555" className="text-xs text-gold hover:text-gold-light font-mono block">
                      +92 305 2367555
                    </a>
                  </div>
                  <div className="bg-charcoal-light border border-line p-5 rounded-2xl">
                    <h5 className="font-serif text-base font-semibold text-ink mb-2">Corporate Office</h5>
                    <span className="text-xs text-muted-gold block leading-relaxed">
                      68B Tycon Plaza, Bahria Town Phase 7, Rawalpindi
                    </span>
                  </div>
                  <div className="bg-charcoal-light border border-line p-5 rounded-2xl">
                    <h5 className="font-serif text-base font-semibold text-ink mb-2">Active Stays</h5>
                    <span className="text-xs text-muted-gold block">
                      Islamabad, Lahore, Karachi, Rawalpindi, Murree, Nathia Gali
                    </span>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ==================== FAQ TAB ==================== */}
          {activeTab === "faq" && (
            <motion.div
              key="faq-page"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="pt-28 pb-20"
            >
              <div className="max-w-4xl mx-auto px-4 md:px-8">
                
                <div className="text-center mb-16">
                  <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-bold">
                    Assistance
                  </span>
                  <h2 className="font-serif text-3xl md:text-5xl font-semibold text-ink mt-2 mb-4">
                    Everything you need to know
                  </h2>
                  <p className="text-muted-gold text-xs sm:text-sm">
                    Common answers to check-in schedules, secure tower regulations, booking processes, and pricing models.
                  </p>
                </div>

                {/* Accordion FAQ list */}
                <div className="space-y-4">
                  {FAQS.map((faq, idx) => (
                    <div 
                      key={idx}
                      className="bg-charcoal-light border border-line rounded-2xl overflow-hidden transition-all duration-300"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                        className="w-full text-left py-5 px-6 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                      >
                        <span className="font-serif text-base sm:text-lg font-medium text-ink">
                          {faq.q}
                        </span>
                        <span className="text-gold text-xl font-bold font-mono">
                          {openFaqIndex === idx ? "−" : "+"}
                        </span>
                      </button>

                      <AnimatePresence>
                        {openFaqIndex === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-line/40"
                          >
                            <p className="p-6 text-xs sm:text-sm text-muted-gold leading-relaxed text-left">
                              {faq.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Global Image Lightbox Overlay Modal */}
      {lightboxImg && (
        <div 
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <button 
            onClick={() => setLightboxImg(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full border border-line bg-charcoal-light flex items-center justify-center text-ink cursor-pointer hover:text-gold"
          >
            <X className="w-5 h-5" />
          </button>
          <img 
            src={lightboxImg} 
            alt="Expanded view" 
            className="max-w-full max-h-[85vh] rounded-2xl border border-line shadow-2xl object-cover"
          />
        </div>
      )}

      {/* Compare Properties Floating Tray & side-by-side Modal */}
      <CompareTray
        comparedProperties={comparedProperties}
        onRemove={(id) => handleToggleCompare(id)}
        onClear={() => setComparedPropertyIds([])}
        onCompareOpen={() => setIsCompareOpen(true)}
      />

      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        comparedProperties={comparedProperties}
        onRemove={(id) => handleToggleCompare(id)}
        checkinDate={activeCheckin}
        checkoutDate={activeCheckout}
        guestsRange={selectedGuestsRange === "any" ? "" : `${selectedGuestsRange} guests`}
      />

      <SheetHelpModal
        isOpen={isSheetHelpOpen}
        onClose={() => setIsSheetHelpOpen(false)}
      />

      {/* Persistent WhatsApp Floating Action Button (FAB) */}
      <div className="fixed bottom-6 right-6 z-40 md:bottom-8 md:right-8 flex flex-col gap-3 items-end pointer-events-none">
        <a
          href="https://wa.me/923052367555?text=Hello%20Ember%20Rentals%2C%20I%20would%20like%20to%20inquire%20about%20booking%20a%20stay."
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto group relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-white shadow-[0_8px_32px_rgba(37,211,102,0.3),0_0_0_1px_rgba(232,206,143,0.15)] border border-white/10 transition-all duration-300 hover:scale-110 active:scale-95 hover:brightness-110"
          aria-label="Chat with Ember Rentals Concierge on WhatsApp"
        >
          {/* Pulsing outer glow */}
          <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping opacity-75 -z-10" />

          {/* Icon */}
          <MessageCircle className="w-7 h-7 md:w-8 md:h-8 drop-shadow-md" />

          {/* Elegant Tooltip */}
          <span className="absolute right-full mr-3 whitespace-nowrap bg-charcoal-light border border-line-strong text-ink text-xs font-medium py-2 px-3 rounded-xl shadow-xl opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Concierge Live
            </span>
          </span>
        </a>
      </div>

      {/* Luxury Global Footer */}
      <Footer setActiveTab={setActiveTab} />

    </div>
  );
}
