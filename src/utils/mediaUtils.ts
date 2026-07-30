// Media and Amenity helper functions for Ember Rentals

export interface MediaItem {
  url: string;
  isVideo: boolean;
  embedUrl?: string;
  type: 'video' | 'image';
}

const DEFAULT_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80";

/**
 * Normalizes and converts raw media links (Google Drive, YouTube, local paths, Unsplash, direct mp4, etc.)
 */
export function cleanMediaUrl(rawUrl: string): string {
  if (!rawUrl) return DEFAULT_FALLBACK_IMAGE;
  let url = rawUrl.trim();

  // Strip wrapping quotes or brackets if present
  if ((url.startsWith('"') && url.endsWith('"')) || (url.startsWith("'") && url.endsWith("'"))) {
    url = url.slice(1, -1).trim();
  }

  // Handle Google Drive links
  const driveFileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i) || 
                         url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/i);
  if (driveFileMatch && driveFileMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${driveFileMatch[1]}`;
  }

  // Handle YouTube links
  const ytWatchMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/i);
  if (ytWatchMatch && ytWatchMatch[1]) {
    return `https://www.youtube.com/embed/${ytWatchMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytWatchMatch[1]}`;
  }

  // Handle Vimeo links
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1&loop=1`;
  }

  // Handle local public paths or raw strings
  if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("data:")) {
    // Clean public prefix if user entered public/photos/karachi.jpg
    if (url.startsWith("public/")) {
      url = url.replace(/^public\//, "/");
    }

    const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif', '.mp4', '.webm', '.mov', '.m4v', '.avif', '.bmp'];
    const lowerUrl = url.toLowerCase();
    const hasExtension = validExtensions.some(ext => lowerUrl.includes(ext));
    const isKnownPath = lowerUrl.startsWith("photos/") || lowerUrl.startsWith("/photos/") || lowerUrl.startsWith("images/") || lowerUrl.startsWith("/images/");

    // If it's plain text without a media extension or known media directory, fallback to default image
    if (!hasExtension && !isKnownPath) {
      return DEFAULT_FALLBACK_IMAGE;
    }

    // Ensure leading slash for root resolution
    if (!url.startsWith("/")) {
      url = "/" + url;
    }
  }

  return url;
}

/**
 * Checks if a cleaned URL or raw string points to a video
 */
export function isVideoUrl(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase().trim();
  
  // Clean query strings for extension check
  const pathOnly = lower.split('?')[0].split('#')[0];

  const videoExtensions = ['.mp4', '.webm', '.mov', '.m4v', '.ogg', '.ogv', '.avi', '.flv', '.m3u8', '.mkv', '.3gp'];
  if (videoExtensions.some(ext => pathOnly.endsWith(ext))) {
    return true;
  }

  const videoKeywords = [
    'youtube.com', 'youtu.be', 'vimeo.com', 'loom.com', 'wistia.com',
    'dailymotion.com', 'tiktok.com', 'fb.watch', 'data:video/'
  ];

  if (videoKeywords.some(keyword => lower.includes(keyword))) {
    return true;
  }

  return false;
}

/**
 * Parses raw image / video column string or array from Google Sheets or data.ts,
 * separating video and image URLs cleanly to prevent visual rendering bugs.
 */
export function parseMediaList(raw: string | string[] | undefined): MediaItem[] {
  let rawUrls: string[] = [];

  if (Array.isArray(raw)) {
    rawUrls = raw.map(item => String(item).trim()).filter(Boolean);
  } else if (typeof raw === "string" && raw.trim().length > 0) {
    // Split by comma, semicolon, newline, or pipe
    const tokens = raw.split(/[,;|\n]+/);
    for (const token of tokens) {
      const trimmed = token.trim();
      if (!trimmed) continue;
      
      // If someone pasted multiple URLs separated by spaces
      if (trimmed.includes("http://") || trimmed.includes("https://")) {
        const spaceSplit = trimmed.split(/\s+/).filter(Boolean);
        rawUrls.push(...spaceSplit);
      } else {
        rawUrls.push(trimmed);
      }
    }
  }

  // Deduplicate and filter out invalid tokens
  rawUrls = Array.from(new Set(rawUrls.filter(u => u.length > 0)));

  if (rawUrls.length === 0) {
    return [{
      url: DEFAULT_FALLBACK_IMAGE,
      isVideo: false,
      type: 'image'
    }];
  }

  const mediaItems: MediaItem[] = rawUrls.map((rawItem) => {
    const cleaned = cleanMediaUrl(rawItem);
    const isVid = isVideoUrl(cleaned) || isVideoUrl(rawItem);
    
    let embedUrl: string | undefined = undefined;
    if (isVid) {
      if (cleaned.includes("youtube.com/embed") || cleaned.includes("player.vimeo.com/video")) {
        embedUrl = cleaned;
      }
    }

    return {
      url: cleaned,
      isVideo: isVid,
      embedUrl,
      type: isVid ? 'video' : 'image'
    };
  });

  return mediaItems;
}

/**
 * Helper to extract strictly image URLs from a media list
 */
export function getImageMedia(mediaList: MediaItem[]): MediaItem[] {
  return mediaList.filter(m => !m.isVideo);
}

/**
 * Helper to extract strictly video URLs from a media list
 */
export function getVideoMedia(mediaList: MediaItem[]): MediaItem[] {
  return mediaList.filter(m => m.isVideo);
}

/**
 * Parses amenities from Google Sheet row or object into a clean array of unique amenity labels
 */
export function parseAmenities(row: any): string[] {
  const items: string[] = [];

  const candidateFields = [
    row?.amenities,
    row?.amenity,
    row?.features,
    row?.facilities,
    row?.highlights,
    row?.amenity1,
    row?.amenity2,
    row?.amenity3,
    row?.amenity4,
    row?.highlight1,
    row?.highlight2
  ];

  for (const field of candidateFields) {
    if (typeof field === "string" && field.trim().length > 0) {
      // Split by comma, semicolon, or pipe
      const parts = field.split(/[,;|]+/).map((s) => s.trim()).filter(Boolean);
      items.push(...parts);
    } else if (Array.isArray(field)) {
      items.push(...field.filter(Boolean).map((s) => String(s).trim()));
    }
  }

  // Deduplicate and filter
  const unique = Array.from(new Set(items)).filter(
    (a) => a.length > 0 && a.toLowerCase() !== "null" && a.toLowerCase() !== "undefined"
  );

  if (unique.length === 0) {
    return ["WiFi Included", "Concierge Care", "24/7 Security", "Climate Control"];
  }

  return unique;
}

/**
 * Resolves Google Map embed source and external link from property data,
 * handling iframe embed strings, direct Google Maps URLs, share links, coordinates, and place names.
 * Safely strips prefix label text (e.g. "Location*https://maps.app.goo.gl/...") so Google Maps receives valid queries.
 */
export function getMapUrls(property: any): { embedSrc: string; externalMapLink: string } {
  let raw = String(
    property?.mapUrl || 
    property?.googleMap || 
    property?.map || 
    property?.locationLink || 
    property?.location || 
    property?.address ||
    ""
  ).trim();

  let embedSrc = "";
  let externalMapLink = "";

  // 1. If raw contains an iframe tag or entity, extract the src attribute
  if (raw.includes("<iframe") || raw.includes("&lt;iframe")) {
    const decoded = raw
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
    const match = decoded.match(/src=["']([^"']+)["']/i) || decoded.match(/src=([^\s>]+)/i);
    if (match && match[1]) {
      raw = match[1];
    }
  }

  // 2. Extract HTTP/HTTPS URL if present anywhere in raw (e.g. "Location*https://maps.app.goo.gl/...")
  const urlMatch = raw.match(/(https?:\/\/[^\s"'<>]+)/i);
  let extractedUrl = "";
  if (urlMatch && urlMatch[1]) {
    // Strip trailing markdown symbols, asterisks, or quotes
    extractedUrl = urlMatch[1].replace(/[)*_>"]+$/, "");
  }

  // Helper: extract place name from Google Maps URL or pb string (e.g. !2sGreen%20City%2C%20Lahore)
  const extractPlaceFromPbOrUrl = (str: string): string | null => {
    const pbPlaceMatch = str.match(/!2s([^!&]+)/);
    if (pbPlaceMatch && pbPlaceMatch[1]) {
      try {
        return decodeURIComponent(pbPlaceMatch[1].replace(/\+/g, " "));
      } catch (e) {}
    }
    const placeMatch = str.match(/\/place\/([^/@?]+)/);
    if (placeMatch && placeMatch[1]) {
      try {
        return decodeURIComponent(placeMatch[1].replace(/\+/g, " "));
      } catch (e) {}
    }
    const searchMatch = str.match(/\/search\/([^/@?]+)/);
    if (searchMatch && searchMatch[1]) {
      try {
        return decodeURIComponent(searchMatch[1].replace(/\+/g, " "));
      } catch (e) {}
    }
    return null;
  };

  // Helper: extract lat/lng coordinates
  const extractCoords = (str: string): { lat: string; lng: string } | null => {
    const pbCoordMatch = str.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/) || str.match(/!4d(-?\d+\.\d+)!3d(-?\d+\.\d+)/);
    if (pbCoordMatch) {
      if (str.includes("!3d" + pbCoordMatch[1])) {
        return { lat: pbCoordMatch[1], lng: pbCoordMatch[2] };
      } else {
        return { lat: pbCoordMatch[2], lng: pbCoordMatch[1] };
      }
    }
    const viewportMatch = str.match(/@(-?\d{1,2}\.\d+),\s*(-?\d{1,3}\.\d+)/);
    if (viewportMatch) {
      return { lat: viewportMatch[1], lng: viewportMatch[2] };
    }
    const queryCoordMatch = str.match(/[?&](?:q|ll)=(-?\d{1,2}\.\d+),\s*(-?\d{1,3}\.\d+)/);
    if (queryCoordMatch) {
      return { lat: queryCoordMatch[1], lng: queryCoordMatch[2] };
    }
    const textCoordMatch = str.match(/^(-?\d{1,2}\.\d+),\s*(-?\d{1,3}\.\d+)$/);
    if (textCoordMatch) {
      return { lat: textCoordMatch[1], lng: textCoordMatch[2] };
    }
    return null;
  };

  if (extractedUrl) {
    externalMapLink = extractedUrl;

    const coords = extractCoords(extractedUrl);
    const placeName = extractPlaceFromPbOrUrl(extractedUrl);

    if (extractedUrl.includes("google.com/maps/embed") || extractedUrl.includes("output=embed") || extractedUrl.includes("embed?pb=")) {
      embedSrc = extractedUrl;
      if (placeName) {
        externalMapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName)}`;
      } else if (coords) {
        externalMapLink = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
      }
    } else if (coords) {
      embedSrc = `https://maps.google.com/maps?q=${coords.lat},${coords.lng}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
    } else if (placeName) {
      embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(placeName)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    } else {
      // For short links like maps.app.goo.gl/...
      // Construct a clean, reliable embed query using property title + city
      const searchTarget = `${property?.title || "Property"}, ${property?.city || "Pakistan"}, Pakistan`;
      embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(searchTarget)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
    }
  } else {
    // Clean leading labels like "Location*", "Location:", "Address:", etc.
    const cleanText = raw
      .replace(/^[*_\s]*(location|map|google\s*map|address|pin|place)[:*\s_-]*/i, "")
      .replace(/[*_]+$/g, "")
      .trim();

    if (cleanText.length > 0) {
      const coords = extractCoords(cleanText);
      if (coords) {
        externalMapLink = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
        embedSrc = `https://maps.google.com/maps?q=${coords.lat},${coords.lng}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
      } else {
        externalMapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanText)}`;
        embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(cleanText)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
      }
    } else {
      const fallbackSearch = `${property?.title || "Property"}, ${property?.city || "Pakistan"}, Pakistan`;
      externalMapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fallbackSearch)}`;
      embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(fallbackSearch)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
    }
  }

  return { embedSrc, externalMapLink };
}

