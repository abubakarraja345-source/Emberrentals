import { useState, useEffect } from "react";
import { Menu, X, MessageSquare, Phone } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onBookStayClick: () => void;
}

export default function Header({ activeTab, setActiveTab, onBookStayClick }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "properties", label: "Properties" },
    { id: "about", label: "About Us" },
    { id: "inquiry", label: "Inquiry & Support" },
    { id: "faq", label: "FAQ" }
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-8 py-4 transition-all duration-300 ${
        scrolled ? "bg-[#08080a]/90 backdrop-blur-md shadow-lg py-3" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleTabClick("home")}
          className="flex items-center gap-3 cursor-pointer group focus:outline-none"
        >
          <div
            className="w-12 h-12 rounded-full border border-gold/40 bg-cover bg-center transition-transform group-hover:scale-105"
            style={{
              backgroundImage: "url('https://i.postimg.cc/G3fr77Yj/Chat-GPT-Image-Jul-9-2026-01-58-40-AM.png')"
            }}
          />
          <div className="text-left">
            <span className="block font-serif text-lg tracking-[0.18em] text-ink font-semibold uppercase group-hover:text-gold-light transition-colors">
              Ember Rentals
            </span>
            <span className="block text-[10px] tracking-[0.2em] text-muted-gold uppercase">
              Pakistan's Luxury Stays
            </span>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wider">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`relative py-2 cursor-pointer transition-colors uppercase text-[11px] font-semibold ${
                activeTab === item.id ? "text-gold-light" : "text-muted-gold hover:text-ink"
              }`}
            >
              {item.label}
              {activeTab === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-gold to-gold-light shadow-[0_0_8px_rgba(201,162,78,0.4)]" />
              )}
            </button>
          ))}
        </nav>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="https://wa.me/923052367555"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs border border-line hover:border-gold-light/50 px-4 py-2.5 rounded-full text-ink hover:text-gold-light bg-white/[0.02] transition-all"
          >
            <Phone className="w-3 h-3 text-gold" />
            <span>+92 305 2367555</span>
          </a>
          <button
            onClick={onBookStayClick}
            className="cursor-pointer text-xs uppercase font-semibold tracking-wider text-[#08080a] bg-gradient-to-r from-gold to-gold-light hover:brightness-110 px-5 py-2.5 rounded-full shadow-[0_4px_15px_rgba(201,162,78,0.2)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Book Your Stay
          </button>
        </div>

        {/* Mobile Navigation Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-line bg-white/[0.04] text-ink cursor-pointer focus:outline-none"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-[78px] left-4 right-4 bg-[#08080a]/95 border border-line rounded-2xl backdrop-blur-lg p-3 shadow-2xl flex flex-col gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full text-left py-3 px-4 rounded-xl text-sm transition-all ${
                activeTab === item.id
                  ? "bg-gold/10 text-gold-light font-semibold"
                  : "text-muted-gold hover:text-ink hover:bg-white/[0.02]"
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="border-t border-line mt-2 pt-3 pb-1 flex flex-col gap-2">
            <a
              href="https://wa.me/923052367555"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-xs border border-line py-3 rounded-full text-ink bg-white/[0.02]"
            >
              <Phone className="w-4 h-4 text-gold" />
              <span>+92 305 2367555</span>
            </a>
            <button
              onClick={() => {
                setMobileOpen(false);
                onBookStayClick();
              }}
              className="w-full text-center text-xs uppercase font-semibold tracking-wider text-[#08080a] bg-gradient-to-r from-gold to-gold-light py-3 rounded-full shadow-[0_4px_15px_rgba(201,162,78,0.2)]"
            >
              Book Your Stay
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
