import React, { useState, useEffect } from "react";
import { X, MapPin, Users, Sparkles, Send, CheckCircle2, AlertTriangle, MessageCircle, ChevronLeft, ChevronRight, Calendar, User, Mail, Phone, MessageSquare, Info, Play, Video, ExternalLink } from "lucide-react";
import { Property } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { parseMediaList, parseAmenities, getMapUrls } from "../utils/mediaUtils";

interface PropertyDetailModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  checkinDate?: string;
  checkoutDate?: string;
  guestsRange?: string;
}

export default function PropertyDetailModal({
  property,
  isOpen,
  onClose,
  checkinDate = "",
  checkoutDate = "",
  guestsRange = ""
}: PropertyDetailModalProps) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [failedMedia, setFailedMedia] = useState<Record<number, boolean>>({});

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [checkin, setCheckin] = useState(checkinDate);
  const [checkout, setCheckout] = useState(checkoutDate);
  const [guestsCount, setGuestsCount] = useState(guestsRange || "2");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error" | null; text: string }>({
    type: null,
    text: ""
  });
  const [submitting, setSubmitting] = useState(false);

  // Initialize values when property or incoming search query dates change
  useEffect(() => {
    if (isOpen) {
      setCheckin(checkinDate);
      setCheckout(checkoutDate);
      setGuestsCount(guestsRange || "2");
      setMessage(`Hello, I am interested in booking ${property.title} in ${property.city}. Please provide availability and booking terms.`);
      setStatus({ type: null, text: "" });
      setActiveImgIndex(0);
      setSlideDirection(0);
      setFailedMedia({});
    }
  }, [isOpen, property, checkinDate, checkoutDate, guestsRange]);

  if (!isOpen) return null;

  // Parse media (images & videos)
  const rawMediaItems = parseMediaList(
    property.images && property.images.length > 0 ? property.images : property.image
  );

  // Filter out or fix failed media
  const mediaItems = rawMediaItems.map((item, index) => {
    if (failedMedia[index]) {
      return {
        url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
        isVideo: false,
        type: 'image' as const
      };
    }
    return item;
  });

  const activeMedia = mediaItems[activeImgIndex] || mediaItems[0] || {
    url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
    isVideo: false,
    type: 'image'
  };

  // Parse dynamic amenities list
  const allAmenities = property.amenities && property.amenities.length > 0 
    ? property.amenities 
    : parseAmenities(property);

  // Determine Google Map links for Location section using robust utility
  const { embedSrc, externalMapLink } = getMapUrls(property);

  const handleNextImage = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setSlideDirection(1);
    setActiveImgIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const handlePrevImage = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setSlideDirection(-1);
    setActiveImgIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr + "T00:00:00");
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // Web3Forms Form submission handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: null, text: "" });

    const accessKey = "ea284f84-14e6-4467-a39f-421a353fdbe6";
    const formData = new FormData();
    formData.append("access_key", accessKey);
    formData.append("subject", `New Premium Unit Inquiry: ${property.title} - from ${name}`);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("checkin_date", checkin);
    formData.append("checkout_date", checkout);
    formData.append("property_interest", property.title);
    formData.append("city_destination", property.city);
    formData.append("guests_count", guestsCount);
    formData.append("message", message);
    formData.append("from_name", "Ember Rentals Portal");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        setStatus({
          type: "success",
          text: `Your premium request for "${property.title}" has been transmitted. Our reservation concierge is reviewing availability and will email you back within 2 hours!`
        });
        setName("");
        setEmail("");
        setPhone("");
      } else {
        throw new Error(data.message || "Submission failed");
      }
    } catch (err) {
      console.error("Booking submission error:", err);
      setStatus({
        type: "error",
        text: "Could not deliver your inquiry via email. Please click 'Chat on WhatsApp' below for instant priority booking!"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsAppDirect = () => {
    let msg = `Hello Ember Rentals Concierge,\n\nI am inquiring about booking this specific unit:\n\n`;
    msg += `🏨 *Property:* ${property.title}\n`;
    msg += `📍 *City:* ${property.city}\n`;
    msg += `💵 *Rate:* ${property.price}\n\n`;
    msg += `👤 *Guest Name:* ${name || "Interested Guest"}\n`;
    if (email) msg += `✉️ *Email:* ${email}\n`;
    if (phone) msg += `📞 *Phone:* ${phone}\n`;
    if (checkin) msg += `📅 *Check-In:* ${formatDate(checkin)}\n`;
    if (checkout) msg += `📅 *Check-Out:* ${formatDate(checkout)}\n`;
    if (guestsCount) msg += `👥 *Number of Guests:* ${guestsCount}\n`;
    if (message) msg += `💬 *Message:* ${message}\n`;
    msg += `\nPlease guide me on availability. Thank you!`;

    const url = `https://wa.me/923052367555?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener,noreferrer");
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
          className="absolute inset-0 bg-black/95 backdrop-blur-xl"
        />

        {/* Modal Main Panel */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="relative w-full max-w-6xl bg-charcoal border border-line rounded-3xl overflow-hidden shadow-2xl flex flex-col md:grid md:grid-cols-12 h-[88vh] md:h-[84vh] max-h-[900px]"
        >
          {/* Top aesthetic accent line */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold/20 via-gold to-gold/20 z-10" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/70 border border-white/20 text-ink flex items-center justify-center hover:border-gold-light hover:bg-black transition-all cursor-pointer shadow-lg"
            aria-label="Close details modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* LEFT PANEL: Advanced Image & Video Gallery (6 cols) */}
          <div 
            className="col-span-12 md:col-span-6 bg-[#09090b] flex flex-col justify-between h-[320px] sm:h-[380px] md:h-full relative overflow-hidden border-b md:border-b-0 md:border-r border-line shrink-0"
            onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchStart === null) return;
              const touchEnd = e.changedTouches[0].clientX;
              const diff = touchStart - touchEnd;
              if (diff > 40) handleNextImage();
              if (diff < -40) handlePrevImage();
              setTouchStart(null);
            }}
          >
            {/* Active Display with Smooth Slide Transitions */}
            <div className="relative flex-grow overflow-hidden group/modal-gallery flex items-center justify-center bg-black min-h-[220px]">
              <AnimatePresence mode="popLayout" custom={slideDirection} initial={false}>
                <motion.div
                  key={activeImgIndex}
                  custom={slideDirection}
                  initial={(dir) => ({
                    x: dir > 0 ? "100%" : dir < 0 ? "-100%" : 0,
                    opacity: 0
                  })}
                  animate={{ x: 0, opacity: 1 }}
                  exit={(dir) => ({
                    x: dir > 0 ? "-100%" : dir < 0 ? "100%" : 0,
                    opacity: 0
                  })}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="w-full h-full flex items-center justify-center bg-black"
                >
                  {activeMedia.isVideo ? (
                    activeMedia.embedUrl ? (
                      <iframe
                        src={activeMedia.embedUrl}
                        title={`${property.title} video`}
                        className="w-full h-full border-0 min-h-[220px]"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={activeMedia.url}
                        controls
                        autoPlay
                        muted
                        loop
                        playsInline
                        onError={() => {
                          setFailedMedia(prev => ({ ...prev, [activeImgIndex]: true }));
                        }}
                        className="w-full h-full object-contain bg-black max-h-[450px]"
                      />
                    )
                  ) : (
                    <img
                      src={activeMedia.url}
                      alt={`${property.title} gallery preview`}
                      className="w-full h-full object-cover transition-all duration-300"
                      onError={() => {
                        setFailedMedia(prev => ({ ...prev, [activeImgIndex]: true }));
                      }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Video Indicator Tag */}
              {activeMedia.isVideo && (
                <div className="absolute bottom-4 left-4 z-20 bg-black/80 backdrop-blur-md border border-gold/40 text-gold-light text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-md pointer-events-none">
                  <Video className="w-3.5 h-3.5 text-gold animate-pulse" />
                  <span>Property Video Tour</span>
                </div>
              )}

              {/* Navigation arrows overlay */}
              {mediaItems.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/75 border border-white/20 hover:border-gold-light hover:bg-black text-gold-light flex items-center justify-center cursor-pointer transition-all shadow-md z-20"
                    aria-label="Previous Media"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/75 border border-white/20 hover:border-gold-light hover:bg-black text-gold-light flex items-center justify-center cursor-pointer transition-all shadow-md z-20"
                    aria-label="Next Media"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Upper tags indicators */}
              <div className="absolute top-4 left-4 flex gap-2 z-20 pointer-events-none">
                <span className="bg-black/70 backdrop-blur-md border border-line text-gold-light text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-gold" />
                  {property.city}
                </span>
                <span className="bg-gold text-charcoal text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                  {property.type}
                </span>
              </div>

              {/* Guest badge */}
              <div className="absolute top-4 right-16 z-20 pointer-events-none">
                <span className="bg-black/70 backdrop-blur-md border border-line text-ink text-[9px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
                  <Users className="w-3 h-3 text-gold-light" />
                  Max: {property.maxGuests} guests
                </span>
              </div>
            </div>

            {/* Thumbnail Row Indicator */}
            {mediaItems.length > 1 && (
              <div className="bg-[#0e0d11] p-3 border-t border-line overflow-x-auto scrollbar-thin scrollbar-thumb-gold/30 flex gap-2 shrink-0 z-10">
                {mediaItems.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      setSlideDirection(idx > activeImgIndex ? 1 : -1);
                      setActiveImgIndex(idx);
                    }}
                    className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      idx === activeImgIndex 
                        ? "border-gold scale-105 shadow-[0_0_8px_rgba(232,206,143,0.4)]" 
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    {item.isVideo ? (
                      <div className="w-full h-full bg-black flex items-center justify-center relative">
                        <Play className="w-4 h-4 text-gold fill-gold" />
                        <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-[8px] font-mono text-gold-light px-1 rounded">
                          VID
                        </span>
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={() => {
                          setFailedMedia(prev => ({ ...prev, [idx]: true }));
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT PANEL: Scrollable Details & Booking Form (6 cols) */}
          <div className="col-span-12 md:col-span-6 flex flex-col h-full min-h-0 overflow-y-auto">
            {/* Scroll Container */}
            <div className="p-6 md:p-8 space-y-6 text-left">
              
              {/* Main Titles */}
              <div>
                <span className="text-gold font-mono font-bold text-base tracking-wide block mb-1">
                  {property.price}
                </span>
                <h3 className="font-serif text-xl md:text-2xl font-bold text-ink">
                  {property.title}
                </h3>
              </div>

              {/* Divider */}
              <div className="h-px bg-line/60" />

              {/* Specifications Block */}
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold-light mb-3">
                  Property Specifications
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/[0.02] border border-line/50 p-3 rounded-xl">
                    <span className="text-[9px] text-muted-soft block uppercase tracking-wider mb-0.5">Destination City</span>
                    <span className="text-xs font-semibold text-ink flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gold-light" />
                      {property.city}
                    </span>
                  </div>
                  <div className="bg-white/[0.02] border border-line/50 p-3 rounded-xl">
                    <span className="text-[9px] text-muted-soft block uppercase tracking-wider mb-0.5">Stay Category</span>
                    <span className="text-xs font-semibold text-ink">{property.type}</span>
                  </div>
                  <div className="bg-white/[0.02] border border-line/50 p-3 rounded-xl">
                    <span className="text-[9px] text-muted-soft block uppercase tracking-wider mb-0.5">Capacity Limit</span>
                    <span className="text-xs font-semibold text-ink flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-gold-light" />
                      Up to {property.maxGuests} Guests
                    </span>
                  </div>
                  <div className="bg-white/[0.02] border border-line/50 p-3 rounded-xl">
                    <span className="text-[9px] text-muted-soft block uppercase tracking-wider mb-0.5">Rate / Cost</span>
                    <span className="text-xs font-semibold text-gold-light font-mono">{property.price}</span>
                  </div>
                </div>
              </div>

              {/* Premium Highlights */}
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold-light mb-2.5">
                  Included Amenities ({allAmenities.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {allAmenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-gold/10 border border-gold/25 px-3 py-1.5 rounded-full text-gold-light font-semibold flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Full Description */}
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold-light mb-2">
                  Detailed Description
                </h4>
                <p className="text-xs text-muted-gold leading-relaxed">
                  {property.desc}
                </p>
              </div>

              {/* Property Map & Neighborhood Location */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold-light flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gold" />
                    Property Location & Map
                  </h4>
                  {externalMapLink && (
                    <a
                      href={externalMapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-gold hover:text-gold-light flex items-center gap-1 underline decoration-gold/40 hover:decoration-gold transition-colors"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <div className="relative w-full h-48 md:h-56 rounded-2xl overflow-hidden border border-line/80 bg-black/50 shadow-inner group">
                  <iframe
                    src={embedSrc}
                    title={`${property.title} location map`}
                    className="w-full h-full border-0 filter contrast-105"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="absolute bottom-2.5 left-2.5 pointer-events-none bg-black/85 backdrop-blur-md border border-line px-3 py-1.5 rounded-xl text-[10px] font-medium text-muted-gold flex items-center gap-1.5 shadow-lg">
                    <MapPin className="w-3.5 h-3.5 text-gold shrink-0 animate-bounce" />
                    <span className="truncate max-w-[200px] sm:max-w-[280px] font-semibold text-ink">{property.city}, Pakistan</span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-line/60" />

              {/* DEDICATED BOOK THIS UNIT FORM */}
              <div className="bg-black/30 border border-line p-5 rounded-2xl relative overflow-hidden space-y-4">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold to-gold-light" />
                
                <div>
                  <h4 className="font-serif text-lg font-semibold text-ink flex items-center gap-2">
                    Book This Unit
                  </h4>
                  <p className="text-[11px] text-muted-gold">
                    Submit your booking inquiry details directly for <strong>{property.title}</strong>.
                  </p>
                </div>

                {status.type && (
                  <div
                    className={`p-3.5 rounded-xl flex items-start gap-3 border text-xs leading-relaxed ${
                      status.type === "success"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                    }`}
                  >
                    {status.type === "success" ? (
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
                    )}
                    <div>{status.text}</div>
                  </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-3.5 text-left">
                  {/* Name Input */}
                  <div className="space-y-1">
                    <label htmlFor="modal-book-name" className="text-[9px] uppercase font-bold tracking-widest text-gold-light">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-soft" />
                      <input
                        type="text"
                        id="modal-book-name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full bg-white/[0.02] border border-line focus:border-gold-light/40 rounded-xl py-2.5 pl-10 pr-4 text-xs text-ink focus:outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label htmlFor="modal-book-email" className="text-[9px] uppercase font-bold tracking-widest text-gold-light">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-soft" />
                        <input
                          type="email"
                          id="modal-book-email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@domain.com"
                          className="w-full bg-white/[0.02] border border-line focus:border-gold-light/40 rounded-xl py-2.5 pl-10 pr-4 text-xs text-ink focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="modal-book-phone" className="text-[9px] uppercase font-bold tracking-widest text-gold-light">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-soft" />
                        <input
                          type="tel"
                          id="modal-book-phone"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+92 300 1234567"
                          className="w-full bg-white/[0.02] border border-line focus:border-gold-light/40 rounded-xl py-2.5 pl-10 pr-4 text-xs text-ink focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Checkin / Checkout and Guests Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label htmlFor="modal-book-checkin" className="text-[9px] uppercase font-bold tracking-widest text-gold-light">
                        Check-in
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-soft" />
                        <input
                          type="date"
                          id="modal-book-checkin"
                          required
                          value={checkin}
                          onChange={(e) => setCheckin(e.target.value)}
                          className="w-full bg-white/[0.02] border border-line focus:border-gold-light/40 rounded-xl py-2.5 pl-9 pr-2 text-[11px] text-ink focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="modal-book-checkout" className="text-[9px] uppercase font-bold tracking-widest text-gold-light">
                        Check-out
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-soft" />
                        <input
                          type="date"
                          id="modal-book-checkout"
                          value={checkout}
                          onChange={(e) => setCheckout(e.target.value)}
                          className="w-full bg-white/[0.02] border border-line focus:border-gold-light/40 rounded-xl py-2.5 pl-9 pr-2 text-[11px] text-ink focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="modal-book-guests" className="text-[9px] uppercase font-bold tracking-widest text-gold-light">
                        Total Guests
                      </label>
                      <div className="relative">
                        <select
                          id="modal-book-guests"
                          value={guestsCount}
                          onChange={(e) => setGuestsCount(e.target.value)}
                          className="w-full bg-[#111115] border border-line focus:border-gold-light/40 rounded-xl py-2.5 px-3 text-xs text-ink focus:outline-none transition-all appearance-none cursor-pointer"
                        >
                          {Array.from({ length: Math.max(2, property.maxGuests) }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>
                              {n} {n === 1 ? "Guest" : "Guests"}
                            </option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gold-light text-[9px]">
                          ▼
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Inquiry Message text area */}
                  <div className="space-y-1">
                    <label htmlFor="modal-book-message" className="text-[9px] uppercase font-bold tracking-widest text-gold-light">
                      Special requests or remarks
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-soft" />
                      <textarea
                        id="modal-book-message"
                        rows={3}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="e.g. airport pickups, chef service, early check-in details..."
                        className="w-full bg-white/[0.02] border border-line focus:border-gold-light/40 rounded-xl py-2.5 pl-10 pr-4 text-xs text-ink focus:outline-none transition-all resize-none"
                      />
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-1.5">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 cursor-pointer flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-charcoal bg-gradient-to-r from-gold to-gold-light hover:brightness-110 disabled:opacity-50 py-3 rounded-xl shadow-md transition-all active:scale-[0.98]"
                    >
                      <Send className="w-3.5 h-3.5" />
                      {submitting ? "Sending..." : "Submit Inquiry"}
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleWhatsAppDirect}
                      className="flex-1 cursor-pointer flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gold-light border border-gold/30 hover:border-gold-light/60 hover:bg-gold/5 py-3 rounded-xl transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      WhatsApp Chat
                    </button>
                  </div>
                </form>
              </div>

            </div>

            {/* Sticky Footer Action */}
            <div className="bg-[#0e0d11] p-5 border-t border-line flex items-center justify-between mt-auto">
              <span className="text-[9px] text-muted-soft font-mono uppercase tracking-wider">
                Luxury Stays Rental Suite
              </span>
              <button
                onClick={onClose}
                className="cursor-pointer bg-white/[0.05] border border-line hover:border-gold-light text-ink font-bold text-[10px] uppercase tracking-wider px-5 py-2.5 rounded-xl transition-all"
              >
                Close Specifications
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
