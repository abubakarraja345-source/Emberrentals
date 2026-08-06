import React, { useState } from "react";
import { ChevronLeft, ChevronRight, MessageCircle, MapPin, Users, Sparkles, ArrowLeftRight, Share2, Play, Video, X } from "lucide-react";
import { Property } from "../types";
import { motion, AnimatePresence } from "motion/react";
import PropertyDetailModal from "./PropertyDetailModal";
import { parseMediaList, parseAmenities, getMapUrls } from "../utils/mediaUtils";

interface PropertyCardProps {
  property: Property;
  checkinDate?: string;
  checkoutDate?: string;
  guestsRange?: string;
  isCompared?: boolean;
  onCompareToggle?: () => void;
}

export default function PropertyCard({
  property,
  checkinDate = "",
  checkoutDate = "",
  guestsRange = "",
  isCompared = false,
  onCompareToggle
}: PropertyCardProps) {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const { embedSrc } = getMapUrls(property);

  // Parse media list (images and videos)
  const mediaItems = parseMediaList(
    property.images && property.images.length > 0 ? property.images : property.image
  );

  const activeMedia = mediaItems[currentImgIndex] || mediaItems[0] || {
    url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
    isVideo: false
  };

  // Parse amenities
  const allAmenities = property.amenities && property.amenities.length > 0 
    ? property.amenities 
    : parseAmenities(property);

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImgIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImgIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr + "T00:00:00");
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const handleBookWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Construct premium personalized WhatsApp message
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
    
    const whatsappUrl = `https://wa.me/923359176409?text=${encodeURIComponent(msg)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    // Construct deep-link URL pointing to this specific stay
    const shareUrl = `${window.location.origin}${window.location.pathname}?property=${encodeURIComponent(property.id)}`;
    
    const shareData = {
      title: property.title,
      text: `Check out this amazing luxury stay: ${property.title} in ${property.city}!`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // If the user cancelled, do nothing. If it failed due to a different error, fallback to copying.
        if (err instanceof Error && err.name !== "AbortError") {
          copyToClipboard(shareUrl);
        }
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <>
      <motion.article 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        onClick={() => setIsDetailOpen(true)}
        className="group bg-charcoal-light border border-line hover:border-line-strong rounded-2xl overflow-hidden shadow-xl hover:shadow-[0_20px_45px_rgba(0,0,0,0.6),0_0_0_1px_rgba(232,206,143,0.15)] flex flex-col h-full transition-all duration-300 cursor-pointer"
      >
      {/* Media / Images & Videos / Map Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-black/40">
        <div className="absolute inset-0">
          {showMap ? (
            <div className="w-full h-full bg-black relative" onClick={(e) => e.stopPropagation()}>
              <iframe
                src={embedSrc}
                title={`${property.title} location map`}
                className="w-full h-full border-0 filter contrast-105"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMap(false);
                }}
                className="absolute top-3 right-3 bg-black/80 hover:bg-black text-gold-light p-1.5 rounded-full border border-gold/40 shadow-lg z-20 cursor-pointer"
                title="Back to photos"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : activeMedia.isVideo ? (
            <div className="w-full h-full bg-black relative flex items-center justify-center">
              {activeMedia.embedUrl ? (
                <iframe
                  src={activeMedia.embedUrl}
                  title={`${property.title} video tour`}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <video
                  src={activeMedia.url}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  onClick={(e) => e.stopPropagation()}
                  className="w-full h-full object-cover"
                />
              )}
              {/* Video Tour Badge Overlay */}
              <div className="absolute bottom-3 left-3 z-10 bg-black/80 backdrop-blur-md border border-gold/40 text-gold-light text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-md pointer-events-none">
                <Video className="w-3.5 h-3.5 text-gold animate-pulse" />
                <span>Video Tour</span>
              </div>
            </div>
          ) : (
            <img
              src={activeMedia.url}
              alt={property.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80";
              }}
            />
          )}
        </div>

        {/* Dynamic Navigation Arrows (Only shown when not in map view) */}
        {!showMap && mediaItems.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-gold-light border border-white/10 flex items-center justify-center cursor-pointer transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
              aria-label="Previous Media"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-gold-light border border-white/10 flex items-center justify-center cursor-pointer transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
              aria-label="Next Media"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Carousel Indicator Dots */}
        {!showMap && mediaItems.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {mediaItems.map((item, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentImgIndex 
                    ? "w-4.5 bg-gold" 
                    : item.isVideo 
                      ? "w-2 bg-gold/50" 
                      : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        )}

        {/* City, Type & Map Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
          <div className="flex items-center gap-1.5">
            <span className="backdrop-blur-md bg-black/50 border border-line text-gold-light text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1">
              <MapPin className="w-3 h-3 text-gold" />
              {property.city}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMap(!showMap);
              }}
              className={`backdrop-blur-md border text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 transition-all shadow-md cursor-pointer ${
                showMap 
                  ? "bg-gold text-charcoal border-gold" 
                  : "bg-black/60 hover:bg-black text-gold-light border-gold/40 hover:border-gold"
              }`}
              title={showMap ? "View Photos" : "View Map"}
            >
              <MapPin className="w-3 h-3" />
              <span>{showMap ? "Photos" : "Map"}</span>
            </button>
          </div>
          <span className="backdrop-blur-md bg-gold/80 border border-gold text-charcoal text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full w-max">
            {property.type}
          </span>
        </div>

        {/* Max Guests Tag */}
        <div className="absolute top-4 right-4 z-10">
          <span className="backdrop-blur-md bg-black/60 border border-line text-ink text-[10px] font-medium px-3 py-1 rounded-full flex items-center gap-1">
            <Users className="w-3 h-3 text-gold-light" />
            Max: {property.maxGuests} guests
          </span>
        </div>
      </div>

      {/* Property Details Body */}
      <div className="p-6 flex flex-col flex-grow text-left">
        <div className="flex items-baseline justify-between gap-2 mb-2">
          <span className="text-gold font-semibold text-sm tracking-wide font-mono">
            {property.price}
          </span>
        </div>

        <h3 className="font-serif text-lg font-semibold text-ink line-clamp-1 mb-2 group-hover:text-gold-light transition-colors">
          {property.title}
        </h3>

        <p className="text-muted-gold text-xs leading-relaxed line-clamp-3 mb-4 flex-grow">
          {property.desc}
        </p>

        {/* Amenities Highlights */}
        <div className="flex flex-wrap gap-1.5 mb-5 border-t border-line/50 pt-4">
          {allAmenities.slice(0, 3).map((amenity, idx) => (
            <span
              key={idx}
              className="text-[10px] bg-white/[0.03] border border-line/60 px-2.5 py-1 rounded-full text-muted-gold font-medium flex items-center gap-1"
            >
              <Sparkles className="w-2.5 h-2.5 text-gold shrink-0" />
              {amenity}
            </span>
          ))}
          {allAmenities.length > 3 && (
            <span className="text-[10px] bg-gold/10 border border-gold/20 px-2 py-1 rounded-full text-gold-light font-bold">
              +{allAmenities.length - 3} more
            </span>
          )}
        </div>

        {/* Call to Action Buttons */}
        <div className="flex gap-2 w-full mt-auto">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleBookWhatsApp(e);
            }}
            className="flex-grow cursor-pointer flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-charcoal bg-gradient-to-r from-gold to-gold-light hover:brightness-110 py-3 rounded-xl shadow-md hover:shadow-gold/10 transition-all active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4 fill-charcoal" />
            Book Stays
          </button>
          
          {onCompareToggle && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCompareToggle();
              }}
              className={`px-2.5 py-3 rounded-xl border flex items-center justify-center gap-1 text-[11px] font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                isCompared
                  ? "bg-gold text-charcoal border-gold shadow-[0_0_12px_rgba(232,206,143,0.3)] font-black"
                  : "bg-white/[0.03] border-line hover:border-gold/60 text-gold-light hover:bg-white/[0.06]"
              }`}
              title={isCompared ? "Remove from comparison" : "Compare with other stays"}
            >
              <ArrowLeftRight className={`w-3.5 h-3.5 ${isCompared ? "animate-pulse" : ""}`} />
              <span>{isCompared ? "Added" : "Compare"}</span>
            </button>
          )}

          <button
            onClick={handleShare}
            className={`px-3 py-3 rounded-xl border flex items-center justify-center transition-all duration-300 cursor-pointer ${
              copied
                ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 min-w-[65px]"
                : "bg-white/[0.03] border-line hover:border-gold/60 text-gold-light hover:bg-white/[0.06]"
            }`}
            title={copied ? "Link Copied!" : "Share Stay"}
          >
            {copied ? (
              <span className="text-[10px] font-bold uppercase tracking-wider">Copied</span>
            ) : (
              <Share2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
      </motion.article>

      <PropertyDetailModal
        property={property}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        checkinDate={checkinDate}
        checkoutDate={checkoutDate}
        guestsRange={guestsRange}
      />
    </>
  );
}
