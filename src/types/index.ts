// Common Types for Backend Integration

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  nationality?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  name: string;
  type: 'deluxe-room' | 'super-deluxe' | 'executive-suite';
  description: string;
  detailedDescription: string;
  price: number;
  weekendPrice: number;
  originalPrice: number;
  size: string;
  maxOccupancy: number;
  bedType: string;
  images: string[];
  features: string[];
  amenities: RoomAmenity[];
  highlights: string[];
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RoomAmenity {
  id: string;
  name: string;
  icon: string;
  category: string;
}

export interface Booking {
  id: string;
  userId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  numberOfRooms: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  specialRequests?: string;
  addOns: BookingAddOn[];
  guestDetails: GuestDetails;
  createdAt: string;
  updatedAt: string;
}

export interface BookingAddOn {
  id: string;
  name: string;
  price: number;
  description: string;
}

export interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  country?: string;
  specialRequests?: string;
}

export interface EventPackage {
  id: string;
  name: string;
  type: 'wedding' | 'corporate' | 'celebration' | 'wedding-hall';
  description: string;
  price: string;
  capacity: string;
  features: string[];
  images: string[];
  isActive: boolean;
}

export interface EventInquiry {
  id: string;
  packageId: string;
  contactName: string;
  email: string;
  phone: string;
  eventDate: string;
  guestCount: number;
  message?: string;
  status: 'new' | 'contacted' | 'quoted' | 'booked' | 'cancelled';
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  roomId?: string;
  rating: number;
  title: string;
  content: string;
  stayDate: string;
  isVerified: boolean;
  isApproved: boolean;
  helpfulVotes: number;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    location?: string;
  };
}

export interface Attraction {
  id: string;
  name: string;
  category: 'heritage' | 'nature' | 'dining' | 'activities';
  description: string;
  distance: string;
  duration: string;
  rating: number;
  price: string;
  images: string[];
  highlights: string[];
  isActive: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  createdAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  order: number;
}

// API Request/Response Types
export interface BookingRequest {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  numberOfRooms: number;
  addOnIds: string[];
  guestDetails: GuestDetails;
  specialRequests?: string;
}

export interface AvailabilityRequest {
  checkInDate: string;
  checkOutDate: string;
  adults: number;
  children: number;
  numberOfRooms: number;
}

export interface AvailabilityResponse {
  available: boolean;
  rooms: Room[];
  totalPrice: number;
  priceBreakdown: {
    roomTotal: number;
    addOnsTotal: number;
    taxes: number;
    discount: number;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}