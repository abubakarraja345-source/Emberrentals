import React, { useState, useEffect } from "react";
import { Mail, Phone, User, Calendar, MessageSquare, Send, CheckCircle2, AlertTriangle, MessageCircle, ChevronLeft, ChevronRight, Check, Sparkles } from "lucide-react";
import { Property } from "../types";
import { motion, AnimatePresence } from "motion/react";

interface InquiryFormProps {
  properties: Property[];
  prefilledProperty?: string;
}

export default function InquiryForm({ properties, prefilledProperty = "" }: InquiryFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [checkin, setCheckin] = useState("");
  const [selectedProperty, setSelectedProperty] = useState(prefilledProperty);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<{ type: "success" | "error" | "info" | null; text: string }>({
    type: null,
    text: ""
  });
  const [sending, setSending] = useState(false);
  const [touchedSteps, setTouchedSteps] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (prefilledProperty) {
      setSelectedProperty(prefilledProperty);
    }
  }, [prefilledProperty]);

  const steps = [
    { id: 1, label: "Choose Stay", desc: "Select property & dates", icon: Calendar },
    { id: 2, label: "Your Profile", desc: "Contact details", icon: User },
    { id: 3, label: "Preferences", desc: "Message & submit", icon: MessageSquare }
  ];

  // Client-side field validation for advancing steps
  const isStepValid = (stepId: number) => {
    if (stepId === 1) {
      // Step 1: Optional but good to check if they selected or at least it is valid
      return true;
    }
    if (stepId === 2) {
      // Step 2: Name, Email and Phone are required
      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      return name.trim() !== "" && isEmailValid && phone.trim() !== "";
    }
    if (stepId === 3) {
      // Step 3: Message is required
      return message.trim() !== "";
    }
    return true;
  };

  const handleNext = () => {
    setTouchedSteps(prev => ({ ...prev, [currentStep]: true }));
    if (isStepValid(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStepValid(1) || !isStepValid(2) || !isStepValid(3)) {
      setStatus({
        type: "error",
        text: "Please verify that all fields are filled correctly before sending."
      });
      return;
    }

    setSending(true);
    setStatus({ type: null, text: "" });

    // Web3Forms Access Key
    const accessKey = "14c583bd-7044-4407-a5f1-a69ef6c85ecf";

    const formData = new FormData();
    formData.append("access_key", accessKey);
    formData.append("subject", `New Multi-Step Elite Inquiry from ${name}`);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("checkin_date", checkin || "Not specified");
    formData.append("property_interest", selectedProperty || "General Inquiry");
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
          text: "Thank you! Your luxury inquiry has been dispatched to our reservation concierge. We will reach back within 2 hours with available dates."
        });
        // Reset state
        setName("");
        setEmail("");
        setPhone("");
        setCheckin("");
        setSelectedProperty("");
        setMessage("");
        setCurrentStep(1);
        setTouchedSteps({});
      } else {
        throw new Error(data.message || "Failed submission");
      }
    } catch (err) {
      console.error("Submission failed", err);
      setStatus({
        type: "error",
        text: "Could not deliver your inquiry through the secure server. Please tap 'Chat on WhatsApp' for instant priority booking!"
      });
    } finally {
      setSending(false);
    }
  };

  const handleWhatsAppInquiry = () => {
    let msg = `Hello Ember Rentals Concierge,\n\nI have a general inquiry:\n\n`;
    msg += `👤 *Name:* ${name || "Guest"}\n`;
    if (email) msg += `✉️ *Email:* ${email}\n`;
    if (phone) msg += `📞 *Phone:* ${phone}\n`;
    if (checkin) msg += `📅 *Check-In Date:* ${checkin}\n`;
    if (selectedProperty) msg += `🏨 *Property of Interest:* ${selectedProperty}\n`;
    if (message) msg += `💬 *Message:* ${message}\n`;
    msg += `\nPlease guide me. Thank you!`;

    window.open(`https://wa.me/923052367555?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-line rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
      {/* Golden accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gold to-gold-light" />

      <div className="mb-8">
        <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold flex items-center gap-1.5 justify-center sm:justify-start">
          <Sparkles className="w-4.5 h-4.5" /> Customized Concierge Care
        </span>
        <h3 className="font-serif text-2xl md:text-3xl font-semibold text-ink mt-2 mb-2">
          Concierge Reservation Inquiry
        </h3>
        <p className="text-xs text-muted-gold leading-relaxed">
          Complete our intuitive multi-step form to let our booking specialists secure your ideal luxury unit.
        </p>
      </div>

      {/* VISUAL PROGRESS STEPPER */}
      <div className="relative mb-8 pt-2">
        {/* Connection progress lines */}
        <div className="absolute top-[26px] left-[10%] right-[10%] h-[2px] bg-white/[0.06] z-0 hidden sm:block" />
        <div 
          className="absolute top-[26px] left-[10%] h-[2px] bg-gradient-to-r from-gold to-gold-light z-0 transition-all duration-500 hidden sm:block"
          style={{ width: `${(currentStep - 1) * 40}%` }}
        />

        {/* Stepper nodes */}
        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 z-10">
          {steps.map((step) => {
            const IconComponent = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const isError = touchedSteps[step.id] && !isStepValid(step.id);

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  // Only allow jumping back or jumping to adjacent steps if valid
                  if (step.id < currentStep || isStepValid(currentStep)) {
                    setCurrentStep(step.id);
                  }
                }}
                className="flex sm:flex-col items-center gap-3 sm:gap-2.5 text-left sm:text-center w-full sm:w-1/3 group cursor-pointer focus:outline-none"
              >
                {/* Visual Circle Node */}
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCompleted
                      ? "bg-gold border-gold text-charcoal shadow-[0_0_12px_rgba(232,206,143,0.4)]"
                      : isActive
                      ? "bg-charcoal border-gold-light text-gold-light shadow-[0_0_12px_rgba(232,206,143,0.2)]"
                      : isError
                      ? "bg-charcoal border-rose-500 text-rose-400"
                      : "bg-charcoal border-line text-muted-soft group-hover:border-gold/50"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 stroke-[3px]" />
                  ) : (
                    <IconComponent className="w-4.5 h-4.5" />
                  )}
                </div>

                {/* Text Metadata */}
                <div className="flex flex-col sm:items-center">
                  <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    isActive ? "text-gold-light" : isCompleted ? "text-ink" : "text-muted-soft"
                  }`}>
                    {step.label}
                  </span>
                  <span className="text-[10px] text-muted-gold hidden sm:inline">
                    {step.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Global Status messages */}
      {status.type && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-start gap-3 border text-xs leading-relaxed ${
            status.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              : status.type === "error"
              ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
              : "bg-blue-500/10 border-blue-500/30 text-blue-400"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
          )}
          <div>{status.text}</div>
        </div>
      )}

      {/* MULTI-STEP SLIDING WRAPPER FORM */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Stay Property Selection */}
                <div className="space-y-1.5 text-left">
                  <label htmlFor="inq-property" className="block text-[10px] font-bold uppercase tracking-wider text-gold-light">
                    Stay Property <span className="text-muted-soft">(Optional)</span>
                  </label>
                  <div className="relative">
                    <select
                      id="inq-property"
                      value={selectedProperty}
                      onChange={(e) => setSelectedProperty(e.target.value)}
                      className="w-full bg-[#111115] border border-line focus:border-gold-light/40 rounded-xl py-3 px-4 text-sm text-ink focus:outline-none transition-all appearance-none cursor-pointer"
                    >
                      <option value="">Select property of interest...</option>
                      {properties.map((p) => (
                        <option key={p.id} value={p.title}>
                          [{p.city}] {p.title}
                        </option>
                      ))}
                    </select>
                    {/* custom indicator arrow */}
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gold-light text-xs font-semibold">
                      ▼
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-soft">
                    Choose which elite stay you would like to reserve.
                  </p>
                </div>

                {/* Checkin Date */}
                <div className="space-y-1.5 text-left">
                  <label htmlFor="inq-checkin" className="block text-[10px] font-bold uppercase tracking-wider text-gold-light">
                    Target Check-in Date <span className="text-muted-soft">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-soft" />
                    <input
                      type="date"
                      id="inq-checkin"
                      value={checkin}
                      onChange={(e) => setCheckin(e.target.value)}
                      className="w-full bg-white/[0.03] border border-line focus:border-gold-light/40 rounded-xl py-3 pl-11 pr-4 text-sm text-ink focus:outline-none transition-all cursor-pointer"
                    />
                  </div>
                  <p className="text-[10px] text-muted-soft">
                    Select your tentative checking arrival date.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {/* Name Input */}
              <div className="space-y-1.5 text-left">
                <label htmlFor="inq-name" className="block text-[10px] font-bold uppercase tracking-wider text-gold-light">
                  Your Full Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-soft" />
                  <input
                    type="text"
                    id="inq-name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Yahya Ali"
                    className="w-full bg-white/[0.03] border border-line focus:border-gold-light/40 rounded-xl py-3 pl-11 pr-4 text-sm text-ink placeholder:text-muted-soft focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Contact info Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label htmlFor="inq-email" className="block text-[10px] font-bold uppercase tracking-wider text-gold-light">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-soft" />
                    <input
                      type="email"
                      id="inq-email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. name@domain.com"
                      className="w-full bg-white/[0.03] border border-line focus:border-gold-light/40 rounded-xl py-3 pl-11 pr-4 text-sm text-ink placeholder:text-muted-soft focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label htmlFor="inq-phone" className="block text-[10px] font-bold uppercase tracking-wider text-gold-light">
                    Phone Number <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-soft" />
                    <input
                      type="tel"
                      id="inq-phone"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +92 300 1234567"
                      className="w-full bg-white/[0.03] border border-line focus:border-gold-light/40 rounded-xl py-3 pl-11 pr-4 text-sm text-ink placeholder:text-muted-soft focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              {/* Message Input */}
              <div className="space-y-1.5 text-left">
                <label htmlFor="inq-message" className="block text-[10px] font-bold uppercase tracking-wider text-gold-light">
                  Inquiry Message or Special Preferences <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-soft" />
                  <textarea
                    id="inq-message"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about custom requests, guest count, dining arrangements, airport pickups, etc."
                    className="w-full bg-white/[0.03] border border-line focus:border-gold-light/40 rounded-xl py-3 pl-11 pr-4 text-sm text-ink placeholder:text-muted-soft focus:outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STEPPER CONTROLS & NAVIGATION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-line/40">
          
          {/* Back button */}
          <div className="w-full sm:w-auto">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-gold border border-line hover:border-gold/40 hover:text-ink py-3 px-5 rounded-xl transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div className="hidden sm:block w-24 h-1" />
            )}
          </div>

          {/* Forward Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStepValid(currentStep)}
                className="cursor-pointer flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-[#08080a] bg-gradient-to-r from-gold to-gold-light hover:brightness-110 disabled:opacity-45 py-3.5 px-7 rounded-xl transition-all"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  disabled={sending || !isStepValid(3)}
                  className="cursor-pointer flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-[#08080a] bg-gradient-to-r from-gold to-gold-light hover:brightness-110 disabled:opacity-45 py-3.5 px-6 rounded-xl shadow-md transition-all active:scale-[0.98]"
                >
                  <Send className="w-4 h-4" />
                  {sending ? "Transmitting..." : "Send Secure Email"}
                </button>
                
                <button
                  type="button"
                  onClick={handleWhatsAppInquiry}
                  className="cursor-pointer flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-light border border-gold/30 hover:border-gold-light/60 hover:bg-gold/5 py-3.5 px-6 rounded-xl transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat on WhatsApp
                </button>
              </>
            )}
          </div>

        </div>
      </form>
    </div>
  );
}
