export interface Brand {
  id: number
  name: string
  slug: string
  tagline?: string
  description?: string
  origin_country?: string
  logo_url?: string
  hero_image_url?: string
  is_active: boolean
  order_index: number
  motorcycles_count?: number
  motorcycles?: Motorcycle[]
}

export interface Motorcycle {
  id: number
  brand_id: number
  name: string
  slug: string
  category: 'Performance' | 'Adventure & Touring' | 'Urban Mobility' | 'Premium Heritage'
  tagline?: string
  description?: string
  engine_cc?: number
  horsepower?: number
  torque_nm?: number
  weight_kg?: number
  top_speed_kmh?: number
  acceleration_0_100?: string | number
  fuel_capacity_liters?: string | number
  seat_height_mm?: number
  price_starting_at: string | number
  currency: string
  image_url: string
  gallery_images?: string[]
  color_options?: string[]
  is_featured: boolean
  is_active: boolean
  order_index: number
  brand?: Brand
}

export interface TestRideRequest {
  id: number
  brand_id: number
  motorcycle_id?: number
  customer_name: string
  email: string
  phone: string
  preferred_city: 'Dubai' | 'Riyadh' | 'Doha'
  preferred_date?: string
  experience_level?: 'Beginner' | 'Intermediate' | 'Expert'
  notes?: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  admin_notes?: string
  created_at: string
  brand?: Brand
  motorcycle?: Motorcycle
}

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'moderator'
  brand_id?: number | null
  brand?: Brand
}

export interface CmsSettings {
  homepage_hero_headline?: {
    prefix?: string
    highlight?: string
    subhead?: string
  }
  section_visibility?: {
    brand_marques_bar?: boolean
    featured_telemetry_showcase?: boolean
    catalog_filter_grid?: boolean
    test_ride_concierge_drawer?: boolean
    regional_showrooms_map?: boolean
    vip_financing_section?: boolean
  }
  regional_dealerships?: Array<{
    city: string
    country: string
    address: string
    phone: string
    whatsapp: string
    status: string
  }>
}
