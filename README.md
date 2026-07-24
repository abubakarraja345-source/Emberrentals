# Ember Rentals — Pakistan's Elite Luxury Short-Stay Collection

Ember Rentals is a high-end, responsive, and fully integrated React & Vite-based web portal designed for handpicked luxury stays, boutique residences, farmhouses, and elite penthouses across Pakistan's major destinations (Islamabad, Lahore, Karachi, Rawalpindi, Murree, and Nathia Gali). 

The platform supports live inventory updates synchronized directly from a Google Sheet (via a Sheetbest API bridge) with elegant client-side fallbacks, full cross-property comparison modules, an interactive search engine, media carousels with video playback support, and a persistent live WhatsApp Concierge integration.

---

## 🎨 Core Design Concept & Visuals

- **Cosmic Dark Slate & Gold Palette**: Soft off-black backgrounds (`#08080a`) matched with elegant metallic gold accents and warm lighting transitions.
- **Micro-interactions & Page Transitions**: Powered by modern physics-based `motion/react` animations, offering smooth scrolling, tactile hover overlays, card expansions, and sleek route transitions.
- **Polished Typography**: High-contrast pairing featuring elegant serif headings and clean, highly legible monospace parameters.

---

## 🚀 Key Features

1. **Dynamic Inventory Synchronization**: Real-time property fetching from a Google Sheet with automatic failovers.
2. **Photos & Video Gallery Support**: Carousel supporting multiple photos and embedded videos (YouTube, Vimeo, MP4, WebM) or local media files (`photos/karachi.jpg`).
3. **Smart Category Mapping**: Input simple lowercase category labels in the sheet (like `guesthouse`, `penthouse`, or `farmhouse`) and watch them dynamically transform into beautifully formatted categories with custom-tailored badges.
4. **Dynamic Amenities Engine**: Parse comma-separated amenities or individual `amenity1` and `amenity2` columns into glowing highlight badges.
5. **Advanced Filtering & Sort Engine**: Filter dynamically by destinations, stay categories, custom guest capacity ranges, or keyword matches. Sort on demand by prices (low-to-high, high-to-low) or alphabetically.
6. **Interactive Multi-Property Compare Module**: Compare up to 3 luxury residences side-by-side using a dynamic slide-out floating tray comparing pricing, guest capacities, categories, and signature amenities.
7. **Interactive Booking & Inquiry Form**: Built-in reservation concierge forms prefilled with listing titles, calendar dates, and guest volumes.
8. **Continuous Live WhatsApp Chat Integration**: Floating premium action button linking guests straight to live 24/7 concierge operators.

---

## 📊 Google Sheets Setup Guide

The property inventory is dynamically loaded via an API endpoint. To sync your own Google Sheets inventory:

### 1. Column Headers Setup
Format **Row 1** of your Google Sheet with the exact column headers below:

| Column Key | Fallback Headers | Type | Example Value |
| :--- | :--- | :--- | :--- |
| **id** | - | Required | `1` |
| **title** | `name` | Required | `Centaurus Luxury Penthouse` |
| **city** | `location` | Required | `Islamabad` |
| **type** | `category` | Required | `guesthouse` |
| **price** | `rate` | Required | `PKR 35,000 / night` |
| **image** | `images`, `photo`, `photos`, `video`, `videos` | Required | `photos/karachi.jpg, https://youtube.com/watch?v=dQw4w9WgXcQ` |
| **maxGuests** | `capacity`, `guests` | Optional | `6` |
| **amenities** | `amenity1`, `amenity2`, `highlights` | Optional | `Private Infinity Pool, 24/7 Dedicated Butler, High-Speed WiFi` |
| **desc** | `description` | Optional | `Floor-to-ceiling city views with smart home automation.` |

### 2. Column Integration Features
- **Smart Category Formatting**: Write simple, fast category keys inside the **type** or **category** column:
  - `guesthouse` or `guest house` $\rightarrow$ **Luxury Guest Houses** 🏡
  - `penthouse` or `pent` $\rightarrow$ **Elite Penthouses** 🏙️
  - `farmhouse` or `farm house` $\rightarrow$ **Private Farmhouses** 🚜
  - `apartment` or `flat` $\rightarrow$ **Luxury Apartments** 🏨
  - `resort` $\rightarrow$ **Boutique Resorts** 🏝️
  - `glamp` $\rightarrow$ **Scenic Glamps** ⛰️
- **Multiple Photos & Videos**: Separate multiple media links with commas:
  `photos/karachi.jpg, https://youtube.com/watch?v=dQw4w9WgXcQ, photos/bedroom.jpg`

---

## 🖼️ How to Use Local Photos & Videos

If you want to use local photos or videos stored in your project instead of external web links:

1. **Place media files inside the `public` folder**:
   - Save your photos/videos in `public/photos/` (e.g., `public/photos/karachi.jpg`, `public/photos/tour.mp4`).

2. **Reference them in your Google Sheet**:
   - Reference files relative to root (without writing `public`):
     `photos/karachi.jpg` or `/photos/karachi.jpg` or `photos/tour.mp4`
   - You can mix local photos, web URLs, and YouTube video links in the `image` column separated by commas!

---

## 📹 How to Add Property Videos

You can add videos to any listing by including video URLs in the `image` or `video` column in your Google Sheet:
- **YouTube videos**: `https://www.youtube.com/watch?v=YOUR_VIDEO_ID` or `https://youtu.be/YOUR_VIDEO_ID`
- **Vimeo videos**: `https://vimeo.com/YOUR_VIDEO_ID`
- **Direct Video Files (MP4 / WebM)**: `https://example.com/video.mp4` or local path `photos/tour.mp4`

When a video is detected, a **VID** badge and Play icon are automatically overlaid on the thumbnail, and clicking it streams the video directly inside the Property Detail Modal!

---

## 🛠️ Development & Technology Stack

- **React 19**: Modern declarative UI components.
- **Vite 6**: Ultra-fast asset bundler.
- **Tailwind CSS v4**: Utility-first atomic CSS processing.
- **Motion (motion/react)**: Fluid hardware-accelerated animations.
- **Lucide React**: Clean vector icon suite.

### Getting Started

Install packages and boot the local developer server:
```bash
# Install dependencies
npm install

# Start the dev environment on http://localhost:3000
npm run dev

# Compile production-ready builds
npm run build

# Validate code syntax and type-safety
npm run lint
```
