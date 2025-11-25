// Admin Types
export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: 'admin';
  isActive: boolean;
  isBanned: boolean;
  adminProfile?: {
    logo?: string;
    themeColors?: {
      primary: string;
      secondary: string;
      accent: string;
    };
    font?: string;
    subdomain?: string;
    customDomain?: string;
    isPaid?: boolean;
    stripeCustomerId?: string;
    paymentDate?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
}

export interface AdminCustomization {
  logo?: string;
  themeColors?: ThemeColors;
  font?: string;
  subdomain?: string;
  customDomain?: string;
}

export interface PaymentSession {
  sessionId: string;
  url: string;
}

export interface SubdomainCheck {
  subdomain: string;
  available: boolean;
}

export interface SubdomainSuggestion {
  suggestion: string;
  available: boolean;
}

export interface PaymentData {
  successUrl: string;
  cancelUrl: string;
  customerEmail?: string;
}

// Master Admin Types
export interface AdminStats {
  total: number;
  active: number;
  inactive: number;
  banned: number;
  paid: number;
  unpaid: number;
}

export interface UpdateAdminStatus {
  isActive: boolean;
  isBanned?: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  count: number;
  totalPages?: number;
  currentPage?: number;
}

// Form Types
export interface AdminRegistrationForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AdminLoginForm {
  email: string;
  password: string;
}

export interface CustomizationForm {
  logo: string;
  themeColors: ThemeColors;
  font: string;
  subdomain: string;
  customDomain: string;
}

// Available Options
export const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro' },
  { value: 'Nunito', label: 'Nunito' },
] as const;

export const THEME_PRESETS = [
  {
    name: 'Default Blue',
    colors: {
      primary: '#3B82F6',
      secondary: '#64748B',
      accent: '#10B981',
    },
  },
  {
    name: 'Purple Theme',
    colors: {
      primary: '#8B5CF6',
      secondary: '#64748B',
      accent: '#EC4899',
    },
  },
  {
    name: 'Green Theme',
    colors: {
      primary: '#10B981',
      secondary: '#64748B',
      accent: '#F59E0B',
    },
  },
  {
    name: 'Red Theme',
    colors: {
      primary: '#EF4444',
      secondary: '#64748B',
      accent: '#8B5CF6',
    },
  },
  {
    name: 'Orange Theme',
    colors: {
      primary: '#F97316',
      secondary: '#64748B',
      accent: '#06B6D4',
    },
  },
] as const;
