import React from "react";
import { X, ArrowLeftRight, MessageCircle, MapPin, Users, Sparkles, Trash2 } from "lucide-react";
import { Property } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface CompareTrayProps {
  comparedProperties: Property[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onCompareOpen: () => void;
}

export function CompareTray({
  comparedProperties,
  onRemove,
  onClear,
  onCompareOpen
}: CompareTrayProps) {
  if (comparedProperties.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 md:pb-6 pointer-events-none">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 25 }}
        className="pointer-events-auto max-w-4xl mx-auto backdrop-blur-xl bg-[#0b0a0d]/90 border border-line-strong rounded-2xl md:rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.8),0_0_0_1px_rgba(232,206,143,0.1)] p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        {/* Info & Items list */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="text-center sm:text-left flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
              <ArrowLeftRight className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-semibold text-ink">Compare Stays</h4>
              <p className="text-[10px] text-muted-gold font-mono">
                {comparedProperties.length} of 3 selected
              </p>
            </div>
          </div>

          {/* Mini cards list */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
            {comparedProperties.map((p) => {
              const finalImage = p.images && p.images.length > 0 
                ? p.images[0] 
                : p.image?.split(",")[0].trim() || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=150&q=80";

              return (
                <div 
                  key={p.id} 
                  className="flex items-center gap-2 bg-white/[0.03] border border-line px-2 py-1.5 rounded-xl group relative flex-shrink-0"
                >
                  <img 
                    src={finalImage} 
                    alt={p.title} 
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                  <span className="text-[10px] font-medium text-ink max-w-[80px] truncate">
                    {p.title}
                  </span>
                  <button
                    onClick={() => onRemove(p.id)}
                    className="text-muted-soft hover:text-gold transition-colors cursor-pointer p-0.5"
                    aria-label={`Remove ${p.title} from comparison`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={onClear}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[10px] uppercase font-bold tracking-wider text-muted-gold hover:text-ink hover:bg-white/[0.04] transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
          
          <button
            onClick={onCompareOpen}
            disabled={comparedProperties.length < 2}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer ${
              comparedProperties.length >= 2
                ? "bg-gradient-to-r from-gold to-gold-light text-charcoal hover:brightness-110 shadow-lg shadow-gold/10"
                : "bg-white/[0.03] border border-line text-muted-soft cursor-not-allowed"
            }`}
          >
            {comparedProperties.length < 2 
              ? "Select 2 to Compare" 
              : `Compare Now (${comparedProperties.length})`}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedProperties: Property[];
  onRemove: (id: string) => void;
  checkinDate?: string;
  checkoutDate?: string;
  guestsRange?: string;
}

export function CompareModal({
  isOpen,
  onClose,
  comparedProperties,
  onRemove,
  checkinDate = "",
  checkoutDate = "",
  guestsRange = ""
}: CompareModalProps) {
  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr + "T00:00:00");
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const handleBookWhatsApp = (property: Property) => {
    let msg = `Hello Ember Rentals,\n\nI would like to inquire about booking:\n\n`;
    msg += `🏨 *Property:* ${property.title}\n`;
    msg += `📍 *City:* ${property.city}\n`;
    msg += `💵 *Rate:* ${property.price}\n`;
    
    if (checkinDate) {
      msg += `📅 *Check-In:* ${formatDate(checkinDate)}\n`;
    }
    if (checkoutDate) {
      msg += `📅 *Check-Out:* ${formatDate(checkoutDate)}\n`;
    }
    if (guestsRange) {
      msg += `👥 *Guests:* ${guestsRange}\n`;
    }
    
    msg += `\nPlease let me know the availability of this stay. Thank you!`;
    
    const whatsappUrl = `https://wa.me/923052367555?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#040405]/95 backdrop-blur-xl"
        />

        {/* Modal content */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="relative w-full max-w-5xl bg-[#0d0c0f] border border-line rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
        >
          {/* Top Line accent */}
          <div className="h-1 bg-gradient-to-r from-gold/10 via-gold to-gold/10" />

          {/* Close trigger button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-white/[0.04] border border-line hover:border-gold-light text-ink flex items-center justify-center transition-all cursor-pointer"
            aria-label="Close comparison panel"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="p-6 md:p-8 border-b border-line/40 text-left">
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold flex items-center gap-1.5">
              <ArrowLeftRight className="w-3.5 h-3.5" /> Side-by-side overview
            </span>
            <h3 className="font-serif text-2xl md:text-3xl font-semibold text-ink mt-2 mb-1">
              Compare Selected Listings
            </h3>
            <p className="text-muted-gold text-xs">
              Compare rates, capacity, type, and highlights to discover your ideal private sanctuary.
            </p>
          </div>

          {/* Body with comparison matrix */}
          <div className="flex-grow overflow-y-auto p-6 md:p-8">
            {comparedProperties.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-sm text-muted-gold mb-4">No properties selected for comparison.</p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-gold text-charcoal font-bold text-xs uppercase tracking-wider"
                >
                  Return to properties
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto scrollbar-none">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr>
                      {/* Metric name column */}
                      <th className="w-1/4 pb-6 font-serif text-sm font-semibold text-gold-light border-b border-line/30">
                        Listing Details
                      </th>
                      
                      {/* Compared columns */}
                      {comparedProperties.map((p) => {
                        const finalImage = p.images && p.images.length > 0 
                          ? p.images[0] 
                          : p.image?.split(",")[0].trim() || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=300&q=80";

                        return (
                          <th key={p.id} className="w-1/4 px-4 pb-6 border-b border-line/30 relative group">
                            {/* Remove button */}
                            <button
                              onClick={() => onRemove(p.id)}
                              className="absolute top-0 right-4 w-7 h-7 rounded-full bg-black/60 border border-line text-muted-gold hover:text-gold flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                              title="Remove listing"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>

                            <div className="flex flex-col gap-3">
                              <div className="aspect-[3/2] rounded-2xl overflow-hidden border border-line bg-black/40">
                                <img
                                  src={finalImage}
                                  alt={p.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <h4 className="font-serif text-base font-semibold text-ink line-clamp-2">
                                {p.title}
                              </h4>
                            </div>
                          </th>
                        );
                      })}

                      {/* Empty cells to fill 3 columns comparison if less are selected */}
                      {Array.from({ length: Math.max(0, 3 - comparedProperties.length) }).map((_, i) => (
                        <th key={`empty-th-${i}`} className="w-1/4 px-4 pb-6 border-b border-line/30">
                          <div className="aspect-[3/2] rounded-2xl border border-dashed border-line/40 flex flex-col items-center justify-center text-center p-4 bg-white/[0.01]">
                            <ArrowLeftRight className="w-6 h-6 text-muted-soft mb-2" />
                            <span className="text-[10px] text-muted-soft font-mono uppercase tracking-widest">
                              Empty Slot
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* NIGHTLY RATE ROW */}
                    <tr className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-4 font-serif text-xs font-semibold text-muted-gold border-b border-line/20 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold" /> Price / Rate
                      </td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="px-4 py-4 border-b border-line/20">
                          <span className="font-mono text-gold font-bold text-sm">
                            {p.price}
                          </span>
                        </td>
                      ))}
                      {Array.from({ length: Math.max(0, 3 - comparedProperties.length) }).map((_, i) => (
                        <td key={`empty-rate-${i}`} className="px-4 py-4 border-b border-line/20 text-muted-soft text-xs italic">-</td>
                      ))}
                    </tr>

                    {/* LOCATION / CITY ROW */}
                    <tr className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-4 font-serif text-xs font-semibold text-muted-gold border-b border-line/20 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gold" /> City Location
                      </td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="px-4 py-4 border-b border-line/20">
                          <span className="text-xs text-ink font-medium">
                            {p.city}
                          </span>
                        </td>
                      ))}
                      {Array.from({ length: Math.max(0, 3 - comparedProperties.length) }).map((_, i) => (
                        <td key={`empty-city-${i}`} className="px-4 py-4 border-b border-line/20 text-muted-soft text-xs italic">-</td>
                      ))}
                    </tr>

                    {/* CATEGORY TYPE ROW */}
                    <tr className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-4 font-serif text-xs font-semibold text-muted-gold border-b border-line/20 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-gold" /> Stay Category
                      </td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="px-4 py-4 border-b border-line/20">
                          <span className="text-[10px] bg-gold/15 border border-gold/40 text-gold-light font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                            {p.type}
                          </span>
                        </td>
                      ))}
                      {Array.from({ length: Math.max(0, 3 - comparedProperties.length) }).map((_, i) => (
                        <td key={`empty-type-${i}`} className="px-4 py-4 border-b border-line/20 text-muted-soft text-xs italic">-</td>
                      ))}
                    </tr>

                    {/* MAX CAPACITY ROW */}
                    <tr className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-4 font-serif text-xs font-semibold text-muted-gold border-b border-line/20 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-gold" /> Guest Capacity
                      </td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="px-4 py-4 border-b border-line/20">
                          <span className="text-xs text-ink">
                            Max <strong>{p.maxGuests}</strong> guests
                          </span>
                        </td>
                      ))}
                      {Array.from({ length: Math.max(0, 3 - comparedProperties.length) }).map((_, i) => (
                        <td key={`empty-capacity-${i}`} className="px-4 py-4 border-b border-line/20 text-muted-soft text-xs italic">-</td>
                      ))}
                    </tr>

                    {/* AMENITIES ROW */}
                    <tr className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-4 font-serif text-xs font-semibold text-muted-gold border-b border-line/20 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-gold" /> Primary Highlights
                      </td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="px-4 py-4 border-b border-line/20">
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] bg-white/[0.03] border border-line px-2 py-0.5 rounded-md text-muted-gold font-medium w-max">
                              {p.amenity1 || "WiFi Included"}
                            </span>
                            <span className="text-[10px] bg-white/[0.03] border border-line px-2 py-0.5 rounded-md text-muted-gold font-medium w-max">
                              {p.amenity2 || "Concierge Care"}
                            </span>
                          </div>
                        </td>
                      ))}
                      {Array.from({ length: Math.max(0, 3 - comparedProperties.length) }).map((_, i) => (
                        <td key={`empty-amenities-${i}`} className="px-4 py-4 border-b border-line/20 text-muted-soft text-xs italic">-</td>
                      ))}
                    </tr>

                    {/* OVERVIEW DESCRIPTION ROW */}
                    <tr className="hover:bg-white/[0.01] transition-colors">
                      <td className="py-4 font-serif text-xs font-semibold text-muted-gold border-b border-line/20 flex items-center gap-1.5">
                        Description
                      </td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="px-4 py-4 border-b border-line/20">
                          <p className="text-[11px] text-muted-gold leading-relaxed line-clamp-4 max-w-[200px]">
                            {p.desc}
                          </p>
                        </td>
                      ))}
                      {Array.from({ length: Math.max(0, 3 - comparedProperties.length) }).map((_, i) => (
                        <td key={`empty-desc-${i}`} className="px-4 py-4 border-b border-line/20 text-muted-soft text-xs italic">-</td>
                      ))}
                    </tr>

                    {/* BOOKING BUTTON ACTION ROW */}
                    <tr>
                      <td className="py-6 font-serif text-xs font-semibold text-muted-gold flex items-center gap-1.5">
                        Reserve Stay
                      </td>
                      {comparedProperties.map((p) => (
                        <td key={p.id} className="px-4 py-6">
                          <button
                            onClick={() => handleBookWhatsApp(p)}
                            className="w-full cursor-pointer flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-charcoal bg-gradient-to-r from-gold to-gold-light hover:brightness-110 py-2.5 px-3 rounded-xl shadow-md transition-all active:scale-[0.98]"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-charcoal" />
                            Book Stay
                          </button>
                        </td>
                      ))}
                      {Array.from({ length: Math.max(0, 3 - comparedProperties.length) }).map((_, i) => (
                        <td key={`empty-book-${i}`} className="px-4 py-6 text-muted-soft text-xs italic">-</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
