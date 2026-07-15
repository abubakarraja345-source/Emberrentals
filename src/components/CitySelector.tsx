import { MapPin, ArrowRight } from "lucide-react";
import { City } from "../types";
import { motion } from "motion/react";

interface CitySelectorProps {
  cities: City[];
  onCityClick: (cityName: string) => void;
}

export default function CitySelector({ cities, onCityClick }: CitySelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cities.map((city) => (
        <motion.div
          key={city.id}
          whileHover={{ y: -6 }}
          onClick={() => onCityClick(city.name)}
          className="group cursor-pointer relative aspect-[4/5] rounded-2xl overflow-hidden border border-line hover:border-gold/30 shadow-lg"
        >
          {/* Background Image */}
          <img
            src={city.image}
            alt={city.name}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
          />
          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
          
          {/* Details Overlay */}
          <div className="absolute inset-0 p-6 flex flex-col justify-end text-left z-10">
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-gold font-bold flex items-center gap-1.5 mb-1">
              <MapPin className="w-3.5 h-3.5 text-gold" />
              Pakistan
            </span>
            <h3 className="font-serif text-2xl font-semibold text-ink group-hover:text-gold-light transition-colors mb-1.5">
              {city.name}
            </h3>
            <p className="text-xs text-muted-gold font-medium line-clamp-1 mb-4">
              {city.tagline}
            </p>
            
            {/* Quick Button */}
            <div className="flex items-center gap-2 text-xs uppercase font-semibold tracking-wider text-gold-light group-hover:text-gold-light/80 transition-colors">
              <span>View Listings</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
