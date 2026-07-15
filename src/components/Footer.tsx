import { Phone, Mail, MapPin, Instagram, MessageSquare } from "lucide-react";

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-charcoal-light border-t border-line pt-16 pb-8 text-ink">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        {/* Brand identity column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full border border-gold/40 bg-cover bg-center"
              style={{
                backgroundImage: "url('https://i.postimg.cc/G3fr77Yj/Chat-GPT-Image-Jul-9-2026-01-58-40-AM.png')"
              }}
            />
            <div>
              <span className="block font-serif text-lg tracking-[0.15em] text-ink font-semibold uppercase">
                Ember Rentals
              </span>
              <span className="block text-[9px] tracking-[0.2em] text-muted-gold uppercase">
                Pakistan's Premium collection
              </span>
            </div>
          </div>
          <p className="text-sm text-muted-gold leading-relaxed max-w-xs mt-2">
            Pakistan's finest selection of luxury apartments, penthouses, resorts, glamps, and farmhouses — handpicked for unforgettable stays and five-star hospitality.
          </p>
          <div className="flex items-center gap-3 mt-2">
            <a
              href="https://www.instagram.com/ember.rentals"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-muted-gold hover:text-gold-light hover:border-gold-light transition-all bg-white/[0.01]"
              aria-label="Instagram Profile"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://wa.me/923052367555"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-muted-gold hover:text-gold-light hover:border-gold-light transition-all bg-white/[0.01]"
              aria-label="WhatsApp Contact"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Explore Links column */}
        <div>
          <h4 className="font-serif text-[15px] font-semibold tracking-wider text-ink mb-6 uppercase">
            Explore
          </h4>
          <ul className="flex flex-col gap-3 text-sm text-muted-gold">
            <li>
              <button
                onClick={() => handleTabClick("home")}
                className="hover:text-gold-light transition-colors cursor-pointer text-left focus:outline-none"
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabClick("properties")}
                className="hover:text-gold-light transition-colors cursor-pointer text-left focus:outline-none"
              >
                Our Properties
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabClick("about")}
                className="hover:text-gold-light transition-colors cursor-pointer text-left focus:outline-none"
              >
                About Us
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabClick("inquiry")}
                className="hover:text-gold-light transition-colors cursor-pointer text-left focus:outline-none"
              >
                Bookings & Support
              </button>
            </li>
          </ul>
        </div>

        {/* Categories column */}
        <div>
          <h4 className="font-serif text-[15px] font-semibold tracking-wider text-ink mb-6 uppercase">
            Stay Categories
          </h4>
          <ul className="flex flex-col gap-3 text-sm text-muted-gold">
            <li>Luxury Apartments</li>
            <li>Elite Penthouses</li>
            <li>Boutique Resorts</li>
            <li>Scenic Glamps</li>
            <li>Private Farmhouses</li>
          </ul>
        </div>

        {/* Contact info column */}
        <div id="contact-footer">
          <h4 className="font-serif text-[15px] font-semibold tracking-wider text-ink mb-6 uppercase">
            Direct Contact
          </h4>
          <ul className="flex flex-col gap-4 text-sm text-muted-gold">
            <li className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-gold flex-shrink-0 mt-1" />
              <a
                href="https://wa.me/923052367555"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold-light transition-all"
              >
                +92 305 2367555
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-gold flex-shrink-0 mt-1" />
              <a href="mailto:emberrental@gmail.com" className="hover:text-gold-light transition-all">
                emberrental@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-1" />
              <a
                href="https://maps.app.goo.gl/3rFgJJ8Cqb3i1sUo6?g_st=ic"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold-light transition-all text-xs leading-relaxed"
              >
                68B Building, Tycon Plaza, 3rd Floor, Food Street, Bahria Town Phase 7, Rawalpindi, Pakistan
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line mt-12 pt-8 max-w-7xl mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-gold">
        <p>© 2026 Ember Rentals. Engineered to provide premium short stays across Pakistan.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-gold-light transition-all">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-gold-light transition-all">
            Terms of Service
          </a>
          <button
            onClick={() => handleTabClick("inquiry")}
            className="hover:text-gold-light transition-all cursor-pointer focus:outline-none"
          >
            Guest Support
          </button>
        </div>
      </div>
    </footer>
  );
}
