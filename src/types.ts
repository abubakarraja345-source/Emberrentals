export interface Property {
  id: string;
  title: string;
  price: string;
  pricePerNight: number; // For sorting and range checks
  desc: string;
  image: string; // Comma separated or single image
  images: string[]; // Parsed array of image/video URLs
  amenity1?: string;
  amenity2?: string;
  amenities?: string[]; // Complete parsed amenities array
  city: string;
  type: string; // e.g. Apartment, Penthouse, Resort, Glamp, Farmhouse, Guest House
  maxGuests: number; // Number of guests supported
}

export interface Category {
  id: string;
  type: string;
  label: string;
  image: string;
  startingPrice: string;
  desc: string;
}

export interface City {
  id: string;
  name: string;
  tagline: string;
  image: string;
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  rating: number;
  text: string;
  avatar: string;
}

export interface Leader {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  instagram: string;
}
