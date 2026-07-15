import React, { useState, useEffect } from "react";
import { X, MapPin, Users, Sparkles, Send, CheckCircle2, AlertTriangle, MessageCircle, ChevronLeft, ChevronRight, Calendar, User, Mail, Phone, MessageSquare, Info } from "lucide-react";
import { Property } from "../types";
import { motion, AnimatePresence } from "motion/react";

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
    }
  }, [isOpen, property, checkinDate, checkoutDate, guestsRange]);

  if (!isOpen) return null;

  // Parse images. If property.image is empty or null, we use fallback.
  const imagesList = property.images && property.images.length > 0 
    ? property.images 
    : (property.image || "")
        .split(",")
        .map((url) => url.trim())
        .filter(Boolean);

  const finalImages = imagesList.length > 0 
    ? imagesList 
    : ["https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80"];

  const handleNextImage = () => {
    setActiveImgIndex((prev) => (prev + 1) % finalImages.length);
  };

  const handlePrevImage = () => {
    setActiveImgIndex((prev) => (prev - 1 + finalImages.length) % finalImages.length);
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
          className="relative w-full max-w-6xl bg-charcoal border border-line rounded-3xl overflow-hidden shadow-2xl flex flex-col md:grid md:grid-cols-12 max-h-[90vh] md:max-h-[85vh]"
        >
          {/* Top aesthetic accent line */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold/20 via-gold to-gold/20 z-10" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 border border-white/10 text-ink flex items-center justify-center hover:border-gold-light hover:bg-black/80 transition-all cursor-pointer shadow-lg"
            aria-label="Close details modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* LEFT PANEL: Advanced Image Gallery (5 cols) */}
          <div className="col-span-12 md:col-span-6 bg-[#09090b] flex flex-col justify-between h-[300px] sm:h-[400px] md:h-full relative overflow-hidden border-b md:border-b-0 md:border-r border-line">
            
            {/* Active Large Image Display */}
            <div className="relative flex-grow overflow-hidden group/modal-gallery flex items-center justify-center bg-black">
              <img
                src={finalImages[activeImgIndex]}
                alt={`${property.title} gallery preview`}
                className="w-full h-full object-cover transition-all duration-500"
              />

              {/* Navigation arrows overlay */}
              {finalImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 border border-white/10 hover:border-gold-light hover:bg-black/80 text-gold-light flex items-center justify-center cursor-pointer transition-all shadow-md"
                    aria-label="Previous Image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 border border-white/10 hover:border-gold-light hover:bg-black/80 text-gold-light flex items-center justify-center cursor-pointer transition-all shadow-md"
                    aria-label="Next Image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Upper tags indicators */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-black/60 backdrop-blur-md border border-line text-gold-light text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-gold" />
                  {property.city}
                </span>
                <span className="bg-gold text-charcoal text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md">
                  {property.type}
                </span>
              </div>

              {/* Guest badge */}
              <div className="absolute top-4 right-16">
                <span className="bg-black/60 backdrop-blur-md border border-line text-ink text-[9px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1">
                  <Users className="w-3 h-3 text-gold-light" />
                  Max: {property.maxGuests} guests
                </span>
              </div>
            </div>

            {/* Thumbnail Row Indicator (Only shown if multiple images exist) */}
            {finalImages.length > 1 && (
              <div className="bg-[#0e0d11] p-3 border-t border-line overflow-x-auto scrollbar-none flex gap-2 shrink-0">
                {finalImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      idx === activeImgIndex 
                        ? "border-gold scale-105 shadow-[0_0_8px_rgba(232,206,143,0.3)]" 
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT PANEL: Details & Booking Form (7 cols) */}
          <div className="col-span-12 md:col-span-6 flex flex-col h-[50vh] md:h-full overflow-y-auto">
            {/* Scroll Container */}
            <div className="p-6 md:p-8 space-y-6 text-left flex-grow">
              
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
                  Included Amenities
                </h4>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-gold/10 border border-gold/20 px-3.5 py-1.5 rounded-full text-gold-light font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-gold" />
                    {property.amenity1 || "Verified Luxury"}
                  </span>
                  <span className="text-xs bg-gold/10 border border-gold/20 px-3.5 py-1.5 rounded-full text-gold-light font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-gold" />
                    {property.amenity2 || "Concierge Support"}
                  </span>
                  <span className="text-xs bg-white/[0.03] border border-line/50 px-3.5 py-1.5 rounded-full text-muted-gold font-medium">
                    24/7 Security
                  </span>
                  <span className="text-xs bg-white/[0.03] border border-line/50 px-3.5 py-1.5 rounded-full text-muted-gold font-medium">
                    High-Speed WiFi
                  </span>
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
