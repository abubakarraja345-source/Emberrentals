import React from "react";
import { ArrowRight, Star } from "lucide-react";
import { Category } from "../types";
import { motion } from "motion/react";

interface CategoryCardProps {
  key?: React.Key;
  category: Category;
  onExploreClick: (categoryType: string) => void;
}

export default function CategoryCard({ category, onExploreClick }: CategoryCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group bg-charcoal-light border border-line hover:border-line-strong rounded-2xl overflow-hidden shadow-xl flex flex-col relative"
    >
      {/* Background Image of Category */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={category.image}
          alt={category.label}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
        
        {/* Dynamic decorative star */}
        <div className="absolute top-4 right-4 backdrop-blur-md bg-black/40 border border-white/10 w-8 h-8 rounded-full flex items-center justify-center text-gold">
          <Star className="w-4 h-4 fill-gold" />
        </div>
      </div>

      {/* Description and Action Area */}
      <div className="p-6 text-left flex flex-col flex-grow">
        <h3 className="font-serif text-xl font-semibold text-ink group-hover:text-gold-light transition-colors mb-1.5">
          {category.label}
        </h3>
        
        {/* Price label */}
        <div className="text-gold font-semibold text-sm font-mono tracking-wide mb-3">
          Starting from {category.startingPrice} per night
        </div>

        <p className="text-xs text-muted-gold leading-relaxed mb-6 flex-grow">
          {category.desc}
        </p>

        {/* Explore More Button */}
        <button
          onClick={() => onExploreClick(category.type)}
          className="cursor-pointer flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider border border-gold/30 hover:border-gold hover:bg-gold/5 py-3 rounded-xl transition-all w-full text-gold-light group-hover:text-ink group-hover:bg-gradient-to-r group-hover:from-gold group-hover:to-gold-light group-hover:border-transparent"
        >
          <span>Explore {category.label}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </motion.div>
  );
}
