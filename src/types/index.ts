import type { NextPage } from 'next'
import type { ReactElement, ReactNode } from 'react'

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc'
}

export interface QueryOptions {
  page?: number
  limit?: number
  language?: string
}

export interface BlogPostQueryOptions extends QueryOptions {
  title?: string
  sortedBy?: string
  orderBy?: string
}

export interface BlogPostPaginator extends PaginatorInfo<BlogPost> {}

export interface BlogPost {
  id: string
  title: string
  description: string
  slug: string
  content: string
  image: Attachment
  created_at: string
  updated_at: string
  user_name: string
  shop_slug: string
}

export interface GetBySlugParams {
  slug: string
  language?: string
}

export interface GetByIdParams {
  id: string
  language?: string
}

interface GetOptions {
  language?: string
}

export interface SearchParamOptions {
  rating: string
  question: string

  [key: string]: unknown
}

export interface AssetQueryOptions extends QueryOptions {
  shop_id: string
  sortedBy: string
  orderBy: string
  name: string
  price: string | string[]
  categories: string | string[]
  tags: string | string[]
  language?: string
  user?: string
  license_id?: string
  godot_version?: string
}

export interface PopularProductsQueryOptions {
  limit: number
  shop_id: string
  type_slug: string
  range: number
}

export interface FollowShopPopularProductsQueryOption {
  limit: number
}

export interface TopShopQueryOptions {
  limit: number
  name: string
  range: number
}

export interface CategoryQueryOptions extends QueryOptions {}
export interface TagQueryOptions extends QueryOptions {}

export interface TypeQueryOptions extends QueryOptions {}

export interface WishlistQueryOptions extends QueryOptions {}

export interface MyReportsQueryOptions extends QueryOptions {}

export interface MyQuestionQueryOptions extends QueryOptions {}

export interface ShopQueryOptions extends QueryOptions {
  is_active?: boolean
  include_order_count?: boolean
  include_asset_count?: boolean
}

export interface FollowedShopsQueryOptions extends QueryOptions {}

export interface OrderQueryOptions extends QueryOptions {
  orderBy: string
  sortedBy: string
  customer_id?: string
}

export interface WishlistQueryOption extends QueryOptions {}

export interface ReviewQueryOptions extends QueryOptions {
  product_id: string
  rating?: string
}

export interface QuestionQueryOptions extends QueryOptions {
  product_id: string
  question?: string
}

export type NextPageWithLayout<P = {}> = NextPage<P> & {
  authorization?: boolean
  getLayout?: (page: ReactElement) => ReactNode
}

interface PaginatorInfo<T> {
  current_page: number
  data: T[]
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: any[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export interface SEO {
  metaTitle: string
  metaDescription: string
  ogTitle: string
  ogDescription: string
  ogImage: Attachment
  twitterHandle: string
  twitterCardType: string
  metaTags: string
  canonicalUrl: string
}

export interface Settings {
  id: string
  options: {
    useUnoptimizedImages: boolean
    siteTitle: string
    siteSubtitle: string
    currency: string
    logo: Attachment
    seo: SEO
    contactDetails: ContactDetails
    useOtp: Boolean
    [key: string]: string | any
  }
}

export interface ContactDetails {
  socials: [ShopSocials]
  contact: string
  location: Location
  website: string
}

export interface ShopSocials {
  icon: string
  url: string
}

export interface Location {
  lat: number
  lng: number
  city: string
  state: string
  country: string
  zip: string
  formattedAddress: string
}

export interface Attachment {
  id: string
  original: string
  thumbnail: string
  sizes: { [key: string]: string }
}

export interface Video {
  url: string
}

export interface Shop {
  id: string
  name: string
  slug: string
  description: string
  about: string
  orders_count: number
  products_count: number
  logo: Attachment
  cover_image: Attachment
  owner_id: string
}

export interface User {
  id: string
  bought_assets: string[]
  bought_games: string[]
  editable_assets: string[]
  username: string
  email: string
  profile: {
    contact: string
    fullname: string
  }
  role: string
  created_at: string
  updated_at: string
}

export interface UpdateProfileInput {
  id: string
  profile: {
    contact?: string
    fullname?: string
  }
}

export interface BecomeSellerInput {
  id: string
  acceptedTermsAndConditions: boolean
}

export interface ChangePasswordInput {
  oldPassword: string
  newPassword: string
}

export interface ConfrimEmailInput {
  user_id: string
  token: string
}

export interface ContactInput {
  id: string
  name: string
  email: string
  subject: string
  message: string
}

export interface LoginUserInput {
  email: string
  password: string
  captcha_response?: string
}

export enum OAuthProviderEnum {
  DISCORD = 'discord',
  GOOGLE = 'google',
  LINKEDIN = 'linkedin'
}

export interface OAuthLoginUserInput {
  authentication_code: string
  provider: OAuthProviderEnum
}

export interface RegisterUserInput {
  name: string
  email: string
  password: string
  captcha_response?: string
}

export interface ForgetPasswordInput {
  email: string
  captcha_response?: string
}

export interface ResetPasswordInput {
  token: string
  email: string
  password: string
  captcha_response?: string
}

export interface VerifyForgetPasswordTokenInput {
  token: string
  email: string
  captcha_response?: string
}

export interface PasswordChangeResponse {
  success: boolean
  message: string
}

export interface AuthResponse {
  token: string
  permissions: string[]
  error: string
}

export interface CoreResponse {
  success: boolean
  message: string
}

export interface CreateContactUsInput {
  contact_info: string
  message: string
  captcha_response?: string
}

export interface CreateAbuseReportInput {
  model_id: string
  model_type: string
  message: string
}

export interface CreateFeedbackInput {
  model_id: string
  model_type: string
  positive?: boolean
  negative?: boolean
}

export interface CreateQuestionInput {
  question: string
  product_id: string
  shop_id: string
}

export interface CreateReviewInput {
  product_id: string
  shop_id: string
  order_id: string
  comment?: string
  rating: number
  photos?: Attachment[]
}

export interface UpdateReviewInput extends CreateReviewInput {
  id: string
}

export interface ReviewResponse {
  product_id: string
}

interface ConnectProductOrderPivot {
  product_id: string | number
  order_quantity: number
  unit_price: number
  subtotal: number
  item_type: ItemType
}

export interface CreateOrderInput {
  amount: number
  total: number
  paid_total: number
  products: ConnectProductOrderPivot[]
  sales_tax: number
  payment_gateway: PaymentGateway
  payment_id?: string
  shop_id?: string
  customer_data: CreateOrderClientDataInput
}

export interface CreateOrderClientDataInput {
  id: string
  fullname: string
  email: string
  phone_number: string
  is_company_invoice: boolean
  city?: string
  address?: string
  post_code?: string
  company_name?: string
  tax_identification_number?: string
  country?: string
  accepted_terms_and_conditions: boolean
}

export enum PaymentGateway {
  FULL_WALLET_PAYMENT = 'FULL_WALLET_PAYMENT',
  NO_PAYMENT_REQUIRED = 'NO_PAYMENT_REQUIRED',
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
  RAZORPAY = 'RAZORPAY',
  MOLLIE = 'MOLLIE',
  PAYSTACK = 'PAYSTACK',
  BITPAY = 'BITPAY',
  COINBASE = 'COINBASE'
}

export enum OrderStatus {
  PENDING = 'order_pending',
  // PROCESSING = 'order-processing',
  COMPLETED = 'order_completed',
  CANCELLED = 'order_cancelled',
  REFUNDED = 'order_refunded',
  FAILED = 'order_failed'
  // AT_LOCAL_FACILITY = 'order-at-local-facility',
  // OUT_FOR_DELIVERY = 'order-out-for-delivery',
}

export enum PaymentStatus {
  PENDING = 'payment_pending',
  PROCESSING = 'payment_processing',
  SUCCESS = 'payment_success',
  FAILED = 'payment_failed',
  REVERSAL = 'payment_reversal',
  WALLET = 'payment_wallet'
}

export interface PaymentIntent {
  id: number | string
  order_id: number | string
  payment_gateway: PaymentGateway
  payment_intent_info: PaymentIntentInfo
}

export interface IOrderPaymentSummery {
  used_wallet_amount: number
  is_payment_gateway_use: boolean
  gateway_payment: number
  amount_due: number
  is_full_paid: boolean
}

export interface PaymentIntentInfo {
  client_secret?: string
  payment_id?: string
  is_redirect?: boolean
  redirect_url?: string
  amount?: string
  currency: string
}

export interface CheckoutVerificationInput {
  amount: number
  products: ConnectProductOrderPivot[]
}

export interface ChangedPriceProduct {
  id: string
  old_price: number
  new_price: number
}

export interface VerifiedCheckoutResponse {
  subtotal: number
  total: number
  total_tax: number
  tax_percentage: number
  can_place_order: boolean
  unavailable_products: string[]
  products_with_changed_price: ChangedPriceProduct[]
}

export interface RatingCount {
  rating: number
  total: number
}

export enum PublishStatus {
  Publish = 'publish',
  Draft = 'draft'
}

export enum GameDevelopmentStage {
  Prototype = 'prototype',
  Beta = 'beta',
  EarlyAccess = 'earlyaccess',
  Released = 'released'
}

export enum ItemType {
  Asset = 'asset',
  Game = 'game'
}

export interface AddToCartItem {
  id: string
  name: string
  slug: string
  price: number
  sale_price?: number
  item_type: ItemType
  shop_id: string
  language: string
  status: PublishStatus
  is_foss?: boolean
  development_stage?: GameDevelopmentStage
  builds?: GameBuild[]
}

export interface OrderItem {
  id: string
  name: string
  slug: string
  shop_id: number
  image: Attachment
  item_type: ItemType
  pivot: ConnectProductOrderPivot
  builds?: GameBuild[]
}

export interface Asset {
  id: string
  name: string
  slug: string
  description: string
  price: number
  sale_price: number
  orders_count: number
  total_downloads: number
  image: Attachment
  gallery: Attachment[]
  shop: Shop
  created_at: string
  updated_at: string
  preview_url: string
  my_review: Review[]
  shop_id: string
  rating_count: RatingCount[]
  total_reviews: number
  ratings: number
  tags: Tag[]
  custom_tags: CustomTag[]
  categories: Category[]
  language: string
  in_stock: number
  status: PublishStatus
  is_external: boolean
  external_product_url: string
  external_product_button_text: string
  godot_version?: string
  isMine?: boolean
  is_foss?: boolean
  videos?: {
    url: string
  }[]
  on_hover_video_autoplay_enabled: boolean
  license_id?: string
  license?: License
}

export interface PaginatedAsset extends Asset {
  page?: number
}

export interface AssetPaginator extends PaginatorInfo<Asset> {}

export enum GameQuality {
  AAA = 'aaa',
  AA = 'aa',
  A = 'a',
  Indie = 'indie',
  GameJam = 'gamejam'
}

export interface License {
  id: string
  name: string
  shop_id: string
  content: string
  created_at: string
  updated_at: string
}

export interface LicenseQueryOptions extends QueryOptions {
  name?: string
  shop_id?: string
  sortedBy?: string
  orderBy?: string
  include_admin_created?: boolean
}

export interface LicenseGetOptions extends GetOptions {
  include_content?: boolean
}

export interface LicensePaginator extends PaginatorInfo<License> {}

export interface Genre {
  id: string
  name: string
  slug: string
  image?: Attachment
  meta_description?: string
  full_description?: string
}

export interface VideoDto {
  url: string
}

export interface HardwareSpecifications {
  os: string
  cpu: string
  gpu: string
  ram: string
  storage: string
}

export interface SystemRequirements {
  minimum: HardwareSpecifications
  recommended: HardwareSpecifications
}

export interface GameBuild {
  platform: TargetPlatform
  uploaded_at: string
}

export interface BetaAccess {
  id: string
  code: string
  game_id: string
  game?: Game
  shop_id: string
  is_single_use: boolean
  was_used: boolean
  expirable: boolean
  expires_at?: string
  created_at: string
  updated_at: string
}

export interface Game {
  id: string
  created_at: string
  updated_at: string
  name: string
  slug: string
  license_id: string
  license: License
  quality: GameQuality
  shop_id: string
  shop: Shop
  meta_description: string
  full_description?: string
  release_date: string
  price: number
  sale_price?: number
  genres?: Genre[]
  gallery?: Attachment[]
  image: Attachment
  videos?: VideoDto[]
  builds: GameBuild[]
  system_requirements: SystemRequirements
  requires_internet_connection: boolean
  status: PublishStatus
  development_stage: GameDevelopmentStage
  language: string
}

export interface GamePaginator extends PaginatorInfo<Game> {}

export interface GameGetOptions extends GetOptions {
  include_license?: boolean
  include_genres?: boolean
  include_shop?: boolean
}

export interface ReportsPaginator extends PaginatorInfo<Question> {}

export interface CategoryTreeNode {
  category: Category
  children: CategoryTreeNode[]
}

export interface CategoryTree {
  roots: CategoryTreeNode[]
  leaves: CategoryTreeNode[]
  count: number
}

export interface Category {
  id: string
  name: string
  created_at: Date
  updated_at: Date
  slug: string
  parent_ids?: string[]
  is_visible_in_tree: boolean
  is_visible_in_filters: boolean
  url: string
  description?: string
  article?: string
  language?: string
}

export interface Type {
  id: string
  name: string
  icon: string
  slug: string
  promotional_sliders?: Attachment
  created_at: string
  updated_at: string
  translated_languages: string[]
}

export interface CategoryPaginator extends PaginatorInfo<Category> {}

export interface TagPaginator extends PaginatorInfo<Tag> {}

export interface TypePaginator extends PaginatorInfo<Type> {}

export interface ShopPaginator extends PaginatorInfo<Shop> {}

export interface TaxInfo {
  name: string
  percentage: number
  decimal: number
  multiplier: number
}

export interface Order {
  id: string
  customer_id: number | string
  amount: number
  children: Order[] | undefined
  total: number
  paid_total: number
  payment_gateway: string
  products: Asset[]
  created_at: Date
  updated_at: Date
  payment_id?: string
  order_status: string
  payment_status: string
  wallet_point: {
    amount?: number
  }
  sales_tax: number
  tax_info: TaxInfo | undefined
}

export interface DigitalFile {
  id: string
  fileable: Asset
}

export interface OrderedFile {
  id: string
  customer_id: string
  order_id: string
  product: OrderItem
  created_at: string
  updated_at: string
  tracking_number: string
  order: {
    payment_status: string
    tracking_number: string
    id: string
  }
}

export interface Feedback {
  id: string
  user_id: string
  model_type: string
  model_id: string
  positive: boolean
  negative: boolean
  created_at: string
  updated_at: string
}

export interface Question {
  id: string
  answer: string
  my_feedback: Feedback
  negative_feedbacks_count: number
  positive_feedbacks_count: number
  product: Asset
  question: string
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  name: string
  rating: number
  comment: string
  photos: Attachment[]
  user: User
  product: Asset
  shop: Shop
  feedbacks: Feedback[]
  positive_feedbacks_count: number
  negative_feedbacks_count: number
  my_feedback: Feedback
  order_id?: string
  created_at: string
  updated_at: string
}

export interface Wishlist {
  id: string
  product: Asset
  product_id: string
  user: User[]
  user_id: string
}

export interface TagPaginator extends PaginatorInfo<Tag> {}

export interface OrderPaginator extends PaginatorInfo<Order> {}

export interface OrderedFilePaginator extends PaginatorInfo<OrderedFile> {}

export interface ReviewPaginator extends PaginatorInfo<Review> {}

export interface WishlistPaginator extends PaginatorInfo<Wishlist> {}

export interface QuestionPaginator extends PaginatorInfo<Question> {}

export interface SettingsQueryOptions extends QueryOptions {
  language?: string
}

export interface Tag {
  id: string
  name: string
  slug: string
  details: string
  article: string
}

export interface CustomTag {
  name: string
  slug: string
}

export interface Address {
  city: string
  country: string
  state: string
  street_address: string
  zip: string
}

export interface Feedback {
  id: string
  user_id: string
  model_type: string
  model_id: string
  positive: boolean
  negative: boolean
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  name: string
  rating: number
  comment: string
  photos: Attachment[]
  user: User
  product: Asset
  shop: Shop
  feedbacks: Feedback[]
  positive_feedbacks_count: number
  negative_feedbacks_count: number
  my_feedback: Feedback
  created_at: string
  updated_at: string
}

export interface CreateReviewInput {
  product_id: string
  shop_id: string
  comment?: string
  rating: number
  photos?: Attachment[]
}

export interface CreateAbuseReportInput {
  model_id: string
  message: string
}

export interface Question {
  id: string
  answer: string
  my_feedback: Feedback
  negative_feedbacks_count: number
  positive_feedbacks_count: number
  question: string
  created_at: string
  updated_at: string
}

export interface CreateQuestionInput {
  question: string
  product_id: string
  shop_id: string
}

export interface PaymentIntentCollection {
  tracking_number?: string
  payment_intent_info?: PaymentIntentInfo
  payment_gateway?: string
}

export interface CreateOrderPaymentInput {
  order_id: string
  payment_gateway: string
}

export interface Card {
  expires: string
  network: string
  origin: string
  owner_name: string
  payment_gateway_id: number | string
  default_card: number
}

export interface DownloadableFile {
  id: string
  purchase_key: string
  digital_file_id: string
  customer_id: string
  file: DigitalFile
  created_at: string
  updated_at: string
}

export interface DownloadableFilePaginator
  extends PaginatorInfo<DownloadableFile> {}

export interface LegalContent {
  id: string
  created_at: string
  updated_at: string
  content_type: string
  language: string
  content: string
}

export interface GodotVersionOption {
  label: string
  value: string
}

export interface GodotVersion {
  id: string
  label: string
  value: string
  created_at: string
  updated_at: string
}

export interface GodotVersionQueryOptions extends QueryOptions {
  label?: string
  sortedBy?: SortOrder
  orderBy?: string
}

export interface GodotVersionPaginator extends PaginatorInfo<GodotVersion> {}

export interface StaticPageDto {
  id: string
  title: string
  slug: string
  description: string
  created_at: string
  updated_at: string
  language?: string
  content: string
}

export interface StaticPageQueryOptions extends QueryOptions {
  title?: string
}

export interface StaticPagePaginator extends PaginatorInfo<StaticPageDto> {}

export interface Service {
  id: string
  title: string
  slug: string
  description: string
  language?: string
  image?: Attachment
  content: string
}

export interface ServiceQueryOptions extends QueryOptions {
  title?: string
}

export interface ServicePaginator extends PaginatorInfo<Service> {}

export interface Training {
  id: string
  title: string
  description: string
  language: string
  level?: string
  image?: Attachment
  content: string
  url: string
  parent_id: string
  children?: Training[]
  breadcrumbs: BreadcrumbItem[]
}

export interface TrainingQueryOptions extends QueryOptions {
  title?: string
  sortedBy?: string
  orderBy?: string
}

export interface TrainingPaginator extends PaginatorInfo<Training> {}

export interface OutsourcingOffer {
  id: string
  slug: string
  title: string
  description: string
  language: string
  image: Attachment
  content: string
  url: string
  parent_id?: string
  children?: OutsourcingOffer[]
  breadcrumbs: BreadcrumbItem[]
}

export interface OutsourcingOfferQueryOptions extends QueryOptions {
  title?: string
  sortedBy?: string
  orderBy?: string
}

export interface OutsourcingOfferPaginator
  extends PaginatorInfo<OutsourcingOffer> {}

export interface BreadcrumbItem {
  label: string
  href: string
}

export enum TargetPlatform {
  WINDOWS = 'windows',
  LINUX = 'linux',
  ANDROID = 'android',
  NEUTRAL = 'neutral'
}
