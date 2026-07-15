import React from "react";
import { 
  Waves, 
  Bath, 
  Bed, 
  Eye, 
  Mountain, 
  Utensils, 
  Wifi, 
  Tv, 
  Dumbbell, 
  Flame, 
  Wind, 
  ConciergeBell, 
  HeartHandshake, 
  Car, 
  Sun, 
  ShowerHead, 
  Users,
  Sparkles
} from "lucide-react";
import { motion } from "motion/react";

interface Amenity {
  name: string;
  icon: React.ComponentType<any>;
  desc: string;
}

const PREMIUM_AMENITIES: Amenity[] = [
  { name: "Private Swimming Pools", icon: Waves, desc: "Temperature-regulated private pools for leisure and relaxation." },
  { name: "Private Jacuzzi", icon: Bath, desc: "Heated therapeutic hot tubs designed for complete unwinding." },
  { name: "Luxury Bedrooms", icon: Bed, desc: "King-sized plush mattresses with custom designer linens." },
  { name: "Panoramic Views", icon: Eye, desc: "Floor-to-ceiling vistas overlooking city skylines and valleys." },
  { name: "Mountain Landscapes", icon: Mountain, desc: "Breathtaking highland surroundings and pristine forest air." },
  { name: "Modern Kitchens", icon: Utensils, desc: "Fully equipped cooking spaces with top-tier premium appliances." },
  { name: "High-Speed WiFi", icon: Wifi, desc: "Blazing-fast fiber internet connectivity for work and streaming." },
  { name: "Smart TVs", icon: Tv, desc: "High-definition screens with pre-loaded streaming applications." },
  { name: "Gym", icon: Dumbbell, desc: "Private fitness zones equipped with essential wellness gear." },
  { name: "Sauna", icon: Flame, desc: "Dedicated dry steam rooms for ultimate body purification." },
  { name: "Sheesha Lounge", icon: Wind, desc: "Curated aesthetic spaces for pleasant evening smoke sessions." },
  { name: "Concierge Service", icon: ConciergeBell, desc: "Vetted dedicated local hosts managing all your custom requests." },
  { name: "24/7 Support", icon: HeartHandshake, desc: "Round-the-clock reservation help and immediate onsite assistance." },
  { name: "Secure Parking", icon: Car, desc: "Dedicated physical parking slots inside heavily guarded towers." },
  { name: "Private Terraces", icon: Sun, desc: "Expansive outdoor spaces styled with evening lighting." },
  { name: "Luxury Bathrooms", icon: ShowerHead, desc: "Plush marble baths, rainfall showers, and complimentary products." },
  { name: "BBQ Areas", icon: Flame, desc: "Equipped open-air grills perfect for family barbecue dinners." },
  { name: "Family-Friendly Spaces", icon: Users, desc: "Spacious lounges and secure environments for kids and seniors." }
];

export default function AmenitiesSection() {
  return (
    <section className="py-24 bg-charcoal border-t border-line/40 relative overflow-hidden" id="amenities-section">
      {/* Background ambient radial gradients */}
      <div className="absolute top-1/4 -left-1/4 w-[50%] h-[50%] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-[50%] h-[50%] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] uppercase tracking-[0.25em] text-gold font-bold">
            Premium Amenities
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-ink mt-2 mb-4">
            Everything you need, beyond expectation
          </h2>
          <div className="flex items-center justify-center gap-3 w-max mx-auto mb-4">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-gold" />
            <div className="w-2 h-2 rounded-full bg-gold-light shadow-[0_0_8px_var(--color-gold)]" />
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-gold" />
          </div>
          <p className="text-muted-gold text-xs sm:text-sm">
            Ember Rentals offers premium handpicked features built directly into our collection. Every amenity is verified and maintained to high luxury standards.
          </p>
        </div>

        {/* 18 Amenities Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {PREMIUM_AMENITIES.map((amenity, index) => {
            const Icon = amenity.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.03 }}
                className="group relative p-5 bg-[#0e0d11]/40 border border-line hover:border-gold/40 rounded-2xl transition-all duration-300 flex flex-col items-center text-center gap-3 hover:bg-white/[0.01]"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gold/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="p-3.5 rounded-xl bg-[#16151a] text-gold-light border border-line/80 group-hover:bg-gold group-hover:text-charcoal group-hover:border-gold group-hover:shadow-[0_0_12px_rgba(232,206,143,0.3)] transition-all duration-300 shrink-0">
                  <Icon className="w-5 h-5 stroke-[1.5]" />
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-ink group-hover:text-gold-light transition-colors duration-300">
                    {amenity.name}
                  </h4>
                  <p className="text-[10px] text-muted-soft leading-relaxed line-clamp-2 md:line-clamp-none opacity-0 group-hover:opacity-100 transition-all duration-300 h-0 group-hover:h-auto mt-0 group-hover:mt-1 font-light">
                    {amenity.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
