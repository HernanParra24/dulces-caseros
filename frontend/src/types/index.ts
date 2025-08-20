export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profileImage?: string;
  role: 'user' | 'admin';
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  ingredients: string;
  price: number;
  stock: number;
  category: ProductCategory;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewCount: number;
  weight: string;
  allergens?: string;
  nutritionalInfo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateReviewDto {
  productId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewDto {
  rating: number;
  comment: string;
}

export enum ProductCategory {
  CHOCOLATES = 'chocolates',
  CARAMELOS = 'caramelos',
  GALLETAS = 'galletas',
  PASTELES = 'pasteles',
  BOMBONES = 'bombones',
  TRUFAS = 'trufas',
  DULCES = 'dulces',
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productName: string;
  productImage?: string;
  product?: Product;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  user?: User;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  billingAddress?: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  paymentProof?: string;
  notes?: string;
  estimatedDelivery?: string;
  deliveredAt?: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  MERCADO_PAGO = 'mercado_pago',
  CASH = 'cash',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export interface AuthResponse {
  message: string;
  access_token: string;
  user: User;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  acceptPrivacyPolicy: boolean;
  acceptTerms: boolean;
}

export interface CheckoutFormData {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: string;
  billingAddress?: string;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface ProductFilters {
  search?: string;
  category?: ProductCategory;
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}
