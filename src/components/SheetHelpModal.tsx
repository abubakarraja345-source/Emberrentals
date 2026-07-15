import React, { useState } from "react";
import { X, FileSpreadsheet, Copy, Check, ExternalLink, HelpCircle, Layers, ArrowRight, Info, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SheetHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SheetHelpModal({ isOpen, onClose }: SheetHelpModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const columns = [
    {
      header: "id",
      fallbacks: "-",
      required: true,
      example: "1",
      desc: "Unique ID for the stay. If left empty, it will auto-increment based on row index."
    },
    {
      header: "title",
      fallbacks: "name",
      required: true,
      example: "Centaurus Luxury Penthouse",
      desc: "The name of your luxury property shown as the main heading."
    },
    {
      header: "city",
      fallbacks: "location",
      required: true,
      example: "Islamabad",
      desc: "The city/region. Match existing tags (e.g., Islamabad, Lahore, Murree, Karachi) to ensure flawless filtering."
    },
    {
      header: "type",
      fallbacks: "category",
      required: true,
      example: "guesthouse",
      desc: "Property category. You can write simple names like guesthouse, penthouse, farmhouse, apartment, resort, or glamp. These are automatically formatted and matched!"
    },
    {
      header: "price",
      fallbacks: "rate",
      required: true,
      example: "PKR 35,000 / night",
      desc: "The visual rate displayed on the card. Keep PKR format with currency prefixes."
    },
    {
      header: "image",
      fallbacks: "images, photo",
      required: true,
      example: "https://images.unsplash.com/... , https://images.unsplash.com/...",
      desc: "Paste public image URLs. To unlock multiple gallery slide images on the card, separate multiple URLs with commas (,)."
    },
    {
      header: "maxGuests",
      fallbacks: "capacity, guests",
      required: false,
      example: "6",
      desc: "Maximum number of guests allowed. If blank, it will guess based on bedroom keywords."
    },
    {
      header: "amenity1",
      fallbacks: "highlight1",
      required: false,
      example: "Private Infinity Pool",
      desc: "First premium highlight badge shown on the card (Default: WiFi Included)."
    },
    {
      header: "amenity2",
      fallbacks: "highlight2",
      required: false,
      example: "24/7 Dedicated Butler",
      desc: "Second premium highlight badge shown on the card (Default: Concierge Care)."
    },
    {
      header: "desc",
      fallbacks: "description",
      required: false,
      example: "Breathtaking floor-to-ceiling city views with bespoke custom interiors, smart automation, and ultra-high-end furnishings.",
      desc: "The descriptive paragraph detailed in comparison tables and search contexts."
    }
  ];

  const handleCopyHeaders = async () => {
    // Join main headers with tabs for easy pasting into Google Sheets
    const headerString = columns.map(c => c.header).join("\t");
    try {
      await navigator.clipboard.writeText(headerString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy headers:", err);
    }
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

        {/* Modal Panel */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="relative w-full max-w-4xl bg-[#0d0c0f] border border-line rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
        >
          {/* Top Line accent */}
          <div className="h-1.5 bg-gradient-to-r from-gold/10 via-gold to-gold/10" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-white/[0.04] border border-line hover:border-gold-light text-ink flex items-center justify-center transition-all cursor-pointer"
            aria-label="Close guide modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="p-6 md:p-8 border-b border-line/40 text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-gold" /> Integration Standard
              </span>
              <h3 className="font-serif text-2xl md:text-3xl font-semibold text-ink mt-2 mb-1">
                Google Sheet Setup Guide
              </h3>
              <p className="text-muted-gold text-xs">
                How to structure your database spreadsheet columns for live inventory synchronization.
              </p>
            </div>

            {/* Quick Copy Action */}
            <button
              onClick={handleCopyHeaders}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer self-start md:self-center ${
                copied
                  ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                  : "bg-gold/10 border-gold/40 text-gold-light hover:bg-gold/20"
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Headers Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Sheet Row 1</span>
                </>
              )}
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-grow overflow-y-auto p-6 md:p-8 space-y-8">
            
            {/* Steps Guide Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/[0.02] border border-line p-4 rounded-2xl text-left">
                <div className="w-7 h-7 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-mono text-xs font-bold mb-3">
                  1
                </div>
                <h5 className="text-xs font-bold text-ink uppercase tracking-wider mb-1">Create Columns</h5>
                <p className="text-[11px] text-muted-gold leading-relaxed">
                  Format row 1 with our headers. You can paste them directly by clicking the <strong>Copy Sheet Row 1</strong> button above.
                </p>
              </div>

              <div className="bg-white/[0.02] border border-line p-4 rounded-2xl text-left">
                <div className="w-7 h-7 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-mono text-xs font-bold mb-3">
                  2
                </div>
                <h5 className="text-xs font-bold text-ink uppercase tracking-wider mb-1">Share Sheet</h5>
                <p className="text-[11px] text-muted-gold leading-relaxed">
                  In Google Sheets, click <strong>Share</strong> and choose <em>"Anyone with the link can view"</em>. This is required for API access.
                </p>
              </div>

              <div className="bg-white/[0.02] border border-line p-4 rounded-2xl text-left">
                <div className="w-7 h-7 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-mono text-xs font-bold mb-3">
                  3
                </div>
                <h5 className="text-xs font-bold text-ink uppercase tracking-wider mb-1">Connect API</h5>
                <p className="text-[11px] text-muted-gold leading-relaxed">
                  Connect your shared sheet URL to <a href="https://sheetbest.com/" target="_blank" rel="noopener noreferrer" className="text-gold-light underline hover:text-gold">Sheetbest</a> or a similar converter to supply the API feed.
                </p>
              </div>
            </div>

            {/* Note about multi-images */}
            <div className="flex items-start gap-3 bg-gold/10 border border-gold/20 p-4 rounded-2xl text-left">
              <Info className="w-5 h-5 text-gold-light shrink-0 mt-0.5" />
              <div>
                <h6 className="text-xs font-bold text-gold-light uppercase tracking-wider mb-1">Multi-Image Slideshow Tip</h6>
                <p className="text-[11px] text-muted-gold leading-relaxed">
                  Want the image carousel on the card to cycle through multiple views? Simply paste your photo links inside the <strong>image</strong> column separated by a simple comma, like this: <br />
                  <code className="text-[10px] font-mono text-ink bg-black/40 px-1.5 py-0.5 rounded mt-1.5 inline-block">
                    https://image1.jpg, https://image2.jpg, https://image3.jpg
                  </code>
                </p>
              </div>
            </div>

            {/* Detailed Headers Table */}
            <div className="space-y-4">
              <h4 className="font-serif text-lg text-ink text-left font-medium">
                Column Header Definitions
              </h4>
              
              <div className="border border-line rounded-2xl overflow-hidden bg-white/[0.01]">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-white/[0.03] border-b border-line">
                        <th className="p-3.5 font-bold text-gold-light uppercase tracking-wider w-[120px]">Header Key</th>
                        <th className="p-3.5 font-bold text-gold-light uppercase tracking-wider w-[120px]">Fallback names</th>
                        <th className="p-3.5 font-bold text-gold-light uppercase tracking-wider w-[100px]">Optional?</th>
                        <th className="p-3.5 font-bold text-gold-light uppercase tracking-wider">Example & Usage Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line/40">
                      {columns.map((col) => (
                        <tr key={col.header} className="hover:bg-white/[0.01] transition-colors">
                          <td className="p-3.5 font-mono font-bold text-ink text-left">
                            {col.header}
                          </td>
                          <td className="p-3.5 font-mono text-muted-soft text-left">
                            {col.fallbacks}
                          </td>
                          <td className="p-3.5 text-left">
                            {col.required ? (
                              <span className="text-[10px] font-bold text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">
                                Required
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-muted-soft bg-white/[0.04] px-2 py-0.5 rounded-full">
                                Optional
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-left space-y-1">
                            <p className="text-ink font-medium leading-relaxed">{col.desc}</p>
                            <p className="text-[11px] text-muted-gold">
                              <span className="text-[9px] font-mono uppercase tracking-wider text-muted-soft">Example: </span>
                              <code className="bg-black/30 px-1 py-0.5 rounded text-gold-light font-mono text-[10px] break-all">
                                {col.example}
                              </code>
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Quick paste visualization */}
            <div className="border border-line rounded-2xl p-5 text-left bg-black/40 space-y-3">
              <h5 className="text-xs font-bold text-ink uppercase tracking-wider">Visual Sheet Representation</h5>
              <div className="overflow-x-auto font-mono text-[10px] bg-charcoal p-3.5 rounded-xl border border-line-strong text-muted-gold whitespace-pre scrollbar-none">
                <div className="text-gold-light border-b border-line pb-1.5 font-bold">
                  id{"\t"}title{"\t"}city{"\t"}type{"\t"}price{"\t"}image{"\t"}maxGuests{"\t"}amenity1{"\t"}amenity2{"\t"}desc
                </div>
                <div className="pt-1.5 opacity-90">
                  1{"\t"}Hillside Retreat{"\t"}Murree{"\t"}Villa{"\t"}PKR 45,000 / night{"\t"}https://unspl.com/v1.jpg, https://unspl.com/v2.jpg{"\t"}8{"\t"}Jacuzzi{"\t"}Free Breakfast{"\t"}Cozy cottage nestled in hills
                </div>
                <div className="opacity-70">
                  2{"\t"}Marina Suite{"\t"}Karachi{"\t"}Suite{"\t"}PKR 30,000 / night{"\t"}https://unspl.com/m1.jpg{"\t"}3{"\t"}Sea View{"\t"}High Security{"\t"}Stunning suite facing local marina harbor
                </div>
              </div>
            </div>

          </div>

          {/* Footer Action */}
          <div className="p-5 md:p-6 border-t border-line/40 bg-[#08080a] flex items-center justify-between text-left">
            <span className="text-[10px] text-muted-soft font-mono">
              Ember Luxury Portal API Integration Setup Help
            </span>
            <button
              onClick={onClose}
              className="cursor-pointer bg-gradient-to-r from-gold to-gold-light hover:brightness-110 font-bold font-sans text-xs uppercase tracking-wider text-charcoal px-6 py-2.5 rounded-xl transition-all"
            >
              Close Setup Guide
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
