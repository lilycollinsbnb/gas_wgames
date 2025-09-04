import { BetaAccess, GameGetOptions } from './../../types/index'
import {
  AuthResponse,
  CategoryPaginator,
  CategoryQueryOptions,
  ForgetPasswordInput,
  LoginUserInput,
  Order,
  OrderedFilePaginator,
  OrderPaginator,
  OrderQueryOptions,
  PasswordChangeResponse,
  Asset,
  AssetPaginator,
  AssetQueryOptions,
  RegisterUserInput,
  ResetPasswordInput,
  Settings,
  Shop,
  ShopPaginator,
  ShopQueryOptions,
  Tag,
  TagPaginator,
  UpdateProfileInput,
  User,
  QueryOptions,
  CreateContactUsInput,
  VerifyForgetPasswordTokenInput,
  ChangePasswordInput,
  PopularProductsQueryOptions,
  CreateOrderInput,
  CheckoutVerificationInput,
  VerifiedCheckoutResponse,
  TopShopQueryOptions,
  Attachment,
  WishlistQueryOption,
  WishlistPaginator,
  Wishlist,
  ReviewQueryOptions,
  Review,
  CreateReviewInput,
  ReviewResponse,
  UpdateReviewInput,
  ReviewPaginator,
  QuestionQueryOptions,
  QuestionPaginator,
  CreateQuestionInput,
  CreateFeedbackInput,
  Feedback,
  CreateAbuseReportInput,
  WishlistQueryOptions,
  MyReportsQueryOptions,
  MyQuestionQueryOptions,
  GetBySlugParams,
  SettingsQueryOptions,
  TypeQueryOptions,
  Type,
  PaymentIntentCollection,
  CreateOrderPaymentInput,
  Card,
  BecomeSellerInput,
  LegalContent,
  Category,
  BlogPostQueryOptions,
  BlogPost,
  CategoryTree,
  OAuthLoginUserInput,
  CoreResponse,
  ConfrimEmailInput,
  Game,
  GamePaginator,
  GetByIdParams,
  License,
  LicenseQueryOptions,
  LicenseGetOptions,
  LicensePaginator,
  Training,
  TrainingQueryOptions,
  TrainingPaginator,
  OutsourcingOffer,
  OutsourcingOfferPaginator,
  OutsourcingOfferQueryOptions,
  ServicePaginator,
  ServiceQueryOptions,
  Service,
  GodotVersionQueryOptions,
  GodotVersionPaginator,
  StaticPageDto,
  TargetPlatform
} from '@/types'
import { API_ENDPOINTS } from './endpoints'
import { HttpClient } from './http-client'
import { BlogPostPaginator, FollowedShopsQueryOptions } from '@/types'
import { getAuthToken } from './token.utils'
import { PaymentIntent } from '@stripe/stripe-js'

interface AssetDownloadLinkArgs {
  id: string
}

interface GameDownloadLinkArgs {
  id: string
  platform: TargetPlatform
}

class Client {
  assets = {
    all: ({
      categories,
      tags,
      name,
      shop_id,
      price,
      ...query
    }: Partial<AssetQueryOptions> = {}) => {
      const categoryList =
        typeof categories === 'string' ? [categories] : categories
      const tagList = typeof tags === 'string' ? [tags] : tags
      return HttpClient.get<AssetPaginator>(API_ENDPOINTS.PRODUCTS_PUBLIC, {
        searchJoin: 'and',
        with: 'shop',
        orderBy: 'updated_at',
        sortedBy: 'ASC',
        ...query,
        price,
        name,
        shop_id,
        ...(typeof categoryList === undefined
          ? {}
          : { categories: categoryList }),
        ...(typeof tagList === undefined ? {} : { tags: tagList }),

        search: HttpClient.formatSearchParams({
          categories,
          tags,
          name,
          shop_id,
          price,
          status: 'publish',
          user: this.currentUser?.username
        })
      })
    },
    popular: (params: Partial<PopularProductsQueryOptions>) =>
      HttpClient.get<Asset[]>(API_ENDPOINTS.PRODUCTS_POPULAR, {
        with: 'shop',
        withCount: 'orders',
        ...params
      }),
    get: ({ slug, language }: GetBySlugParams) =>
      HttpClient.get<Asset>(`${API_ENDPOINTS.PRODUCTS}/${slug}`, {
        language,
        with: 'shop;tags;type',
        withCount: 'orders'
      }),
    download: (input: { product_id: string }) =>
      HttpClient.post<string>(API_ENDPOINTS.PRODUCTS_FREE_DOWNLOAD, input)
  }
  betaAccess = {
    get: ({ code }: { code: string }) =>
      HttpClient.get<BetaAccess>(
        `${API_ENDPOINTS.BETA_ACCESS}/code/${encodeURIComponent(code)}`
      ),
    reedemBetaAccess: (data: { code: string }) =>
      HttpClient.post<string>(API_ENDPOINTS.REDEEM_BETA_ACCESS_LINK, data)
  }
  blog = {
    all: (query?: BlogPostQueryOptions) =>
      HttpClient.get<BlogPostPaginator>(API_ENDPOINTS.BLOG, { ...query }),
    get: ({ slug, language }: { slug: string; language?: string }) =>
      HttpClient.get<BlogPost>(`${API_ENDPOINTS.BLOG}/${slug}`, {
        language
      })
  }
  categories = {
    all: (query?: CategoryQueryOptions) =>
      HttpClient.get<CategoryPaginator>(API_ENDPOINTS.CATEGORIES, { ...query }),
    get: ({ slug, language }: { slug: string; language?: string }) =>
      HttpClient.get<Category>(`${API_ENDPOINTS.CATEGORIES}/${slug}`, {
        language
      }),
    tree: () => HttpClient.get<CategoryTree>(`${API_ENDPOINTS.CATEGORIES}/tree`)
  }
  games = {
    get: ({ slug, options }: { slug: string; options: GameGetOptions }) =>
      HttpClient.get<Game>(`${API_ENDPOINTS.GAMES}/slug/${slug}`, options),
    getById: ({ id, options }: { id: string; options: GameGetOptions }) =>
      HttpClient.get<Game>(`${API_ENDPOINTS.GAMES}/id/${id}`, options),
    all: (options?: Partial<QueryOptions> & Partial<GameGetOptions>) =>
      HttpClient.get<GamePaginator>(API_ENDPOINTS.GAMES_PUBLIC, options),
    myGames: (options?: Partial<QueryOptions> & Partial<GameGetOptions>) =>
      HttpClient.get<GamePaginator>(`${API_ENDPOINTS.GAMES}/my-games`, options)
  }
  tags = {
    all: (query?: QueryOptions) =>
      HttpClient.get<TagPaginator>(API_ENDPOINTS.TAGS, query),
    get: ({ slug, language }: { slug: string; language?: string }) =>
      HttpClient.get<Tag>(`${API_ENDPOINTS.TAGS}/${slug}`, { language })
  }
  shops = {
    all: (query?: ShopQueryOptions) =>
      HttpClient.get<ShopPaginator>(API_ENDPOINTS.SHOPS, query),
    top: ({ name, ...query }: Partial<TopShopQueryOptions> = {}) =>
      HttpClient.get<ShopPaginator>(API_ENDPOINTS.TOP_SHOPS, {
        searchJoin: 'and',
        // withCount: 'products',
        ...query,
        search: name ? name : undefined
      }),
    get: (slug: string) =>
      HttpClient.get<Shop>(`${API_ENDPOINTS.SHOPS}/${slug}`),
    getById: (id: string) =>
      HttpClient.get<Shop>(`${API_ENDPOINTS.SHOPS}/id/${id}`)
  }
  orders = {
    all: (query?: OrderQueryOptions) =>
      HttpClient.get<OrderPaginator>(API_ENDPOINTS.ORDERS, query),
    get: (id: string) => HttpClient.get<Order>(`${API_ENDPOINTS.ORDERS}/${id}`),
    downloadable: (query?: OrderQueryOptions) => {
      return HttpClient.get<OrderedFilePaginator>(
        API_ENDPOINTS.ORDERS_DOWNLOADS,
        query
      )
    },
    generateDownloadFreeAssetLink: ({ id: asset_id }: AssetDownloadLinkArgs) =>
      HttpClient.post<string>(
        API_ENDPOINTS.GENERATE_FREE_DOWNLOADABLE_ASSET_LINK,
        {
          asset_id
        }
      ),
    generateDownloadAssetLink: ({ id: asset_id }: AssetDownloadLinkArgs) =>
      HttpClient.post<string>(API_ENDPOINTS.GENERATE_DOWNLOADABLE_ASSET_LINK, {
        asset_id
      }),
    generateDownloadGameLink: ({
      id: game_id,
      platform
    }: GameDownloadLinkArgs) =>
      HttpClient.post<string>(API_ENDPOINTS.GENERATE_DOWNLOADABLE_GAME_LINK, {
        game_id,
        platform
      }),
    verify: (data: CheckoutVerificationInput) =>
      HttpClient.post<VerifiedCheckoutResponse>(
        API_ENDPOINTS.ORDERS_CHECKOUT_VERIFY,
        data
      ),
    create: (data: CreateOrderInput) =>
      HttpClient.post<Order>(API_ENDPOINTS.ORDERS, data),
    getPaymentIntent: (order_id: string) =>
      HttpClient.get<PaymentIntent>(
        `${API_ENDPOINTS.PAYMENT_INTENT}/${order_id}`
      ),
    payment: (input: CreateOrderPaymentInput) =>
      HttpClient.post<any>(API_ENDPOINTS.ORDERS_PAYMENT, input),
    savePaymentMethod: (input: any) =>
      HttpClient.post<any>(API_ENDPOINTS.SAVE_PAYMENT_METHOD, input),
    notifyPaymentSucceeded: (input: any) =>
      HttpClient.put<any>(API_ENDPOINTS.NOTIFY_PAYMENT_SUCCESS, input),
    delete: (order_id: string) =>
      HttpClient.delete(`${API_ENDPOINTS.ORDERS}/${order_id}`)
  }
  users = {
    me: () => {
      const token = getAuthToken()
      const options = {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }

      return HttpClient.get<User>(API_ENDPOINTS.USERS_ME, null, options).then(
        (response) => {
          this.currentUser = response
          return response
        }
      )
    },

    update: (user: UpdateProfileInput) =>
      HttpClient.put<User>(`${API_ENDPOINTS.USERS}/${user.id}`, user),
    login: (input: LoginUserInput) =>
      HttpClient.post<AuthResponse>(API_ENDPOINTS.USERS_LOGIN, input),
    oAuthLogin: (input: OAuthLoginUserInput) =>
      HttpClient.post<AuthResponse>(API_ENDPOINTS.USERS_OAUTH_LOGIN, input),
    register: (input: RegisterUserInput) =>
      HttpClient.post<CoreResponse>(API_ENDPOINTS.USERS_REGISTER, input),
    forgotPassword: (input: ForgetPasswordInput) =>
      HttpClient.post<PasswordChangeResponse>(
        API_ENDPOINTS.USERS_FORGOT_PASSWORD,
        input
      ),
    verifyForgotPasswordToken: (input: VerifyForgetPasswordTokenInput) =>
      HttpClient.post<PasswordChangeResponse>(
        API_ENDPOINTS.USERS_VERIFY_FORGOT_PASSWORD_TOKEN,
        input
      ),
    resetPassword: (input: ResetPasswordInput) =>
      HttpClient.post<PasswordChangeResponse>(
        API_ENDPOINTS.USERS_RESET_PASSWORD,
        input
      ),
    changePassword: (input: ChangePasswordInput) =>
      HttpClient.post<PasswordChangeResponse>(
        API_ENDPOINTS.USERS_CHANGE_PASSWORD,
        input
      ),
    logout: () => HttpClient.post<boolean>(API_ENDPOINTS.USERS_LOGOUT, {}),
    confirmEmail: (input: ConfrimEmailInput) =>
      HttpClient.post<CoreResponse>(API_ENDPOINTS.USERS_CONFIRM_EMAIL, input)
    // upgradeAccountToSeller: (input: BecomeSellerInput) => HttpClient.post<any>(API_ENDPOINTS.USERS_BECOME_SELLER, {})
  }
  licenses = {
    get: ({ id, language }: GetByIdParams) =>
      HttpClient.get<License>(`${API_ENDPOINTS.LICENSE}/${id}`, {
        language,
        include_content: true
      }),
    all: (
      options?: Partial<LicenseQueryOptions> & Partial<LicenseGetOptions>
    ) => HttpClient.get<LicensePaginator>(API_ENDPOINTS.LICENSE, options)
  }
  godotVersions = {
    all: (query?: GodotVersionQueryOptions) =>
      HttpClient.get<GodotVersionPaginator>(API_ENDPOINTS.GODOT_VERSIONS, {
        ...query
      })
  }
  staticPages = {
    get: ({ slug, language }: { slug: string; language?: string }) =>
      HttpClient.get<StaticPageDto>(
        `${API_ENDPOINTS.STATIC_PAGES}/slug/${slug}`,
        {
          language
        }
      )
  }
  services = {
    all: (query?: ServiceQueryOptions) =>
      HttpClient.get<ServicePaginator>(API_ENDPOINTS.SERVICES, { ...query }),
    get: ({ slug, language }: { slug: string; language?: string }) =>
      HttpClient.get<Service>(`${API_ENDPOINTS.SERVICES}/slug/${slug}`, {
        language
      })
  }
  trainings = {
    all: (query?: TrainingQueryOptions) =>
      HttpClient.get<TrainingPaginator>(API_ENDPOINTS.TRAININGS, { ...query }),
    get: ({ slug, language }: { slug: string; language?: string }) =>
      HttpClient.get<Training>(`${API_ENDPOINTS.TRAININGS}/slug/${slug}`, {
        language,
        include_details: true
      }),
    topLevel: (language?: string) =>
      HttpClient.get<Training[]>(`${API_ENDPOINTS.TRAININGS}/top-level`, {
        language
      })
  }
  outsourcing = {
    all: (query?: OutsourcingOfferQueryOptions) =>
      HttpClient.get<OutsourcingOfferPaginator>(API_ENDPOINTS.OUTSOURCING, {
        ...query
      }),
    get: ({ slug, language }: { slug: string; language?: string }) =>
      HttpClient.get<OutsourcingOffer>(
        `${API_ENDPOINTS.OUTSOURCING}/slug/${slug}`,
        {
          language,
          include_details: true
        }
      ),
    topLevel: (language?: string) =>
      HttpClient.get<OutsourcingOffer[]>(
        `${API_ENDPOINTS.OUTSOURCING}/top-level`,
        {
          language
        }
      )
  }
  questions = {
    all: ({ question, ...params }: QuestionQueryOptions) =>
      HttpClient.get<QuestionPaginator>(API_ENDPOINTS.PRODUCTS_QUESTIONS, {
        searchJoin: 'and',
        ...params,
        search: HttpClient.formatSearchParams({
          question
        })
      }),

    create: (input: CreateQuestionInput) =>
      HttpClient.post<Review>(API_ENDPOINTS.PRODUCTS_QUESTIONS, input)
  }
  feedback = {
    create: (input: CreateFeedbackInput) =>
      HttpClient.post<Feedback>(API_ENDPOINTS.PRODUCTS_FEEDBACK, input)
  }
  abuse = {
    create: (input: CreateAbuseReportInput) =>
      HttpClient.post<Review>(
        API_ENDPOINTS.PRODUCTS_REVIEWS_ABUSE_REPORT,
        input
      )
  }
  reviews = {
    all: ({ rating, ...params }: ReviewQueryOptions) =>
      HttpClient.get<ReviewPaginator>(API_ENDPOINTS.PRODUCTS_REVIEWS, {
        searchJoin: 'and',
        with: 'user',
        ...params,
        search: HttpClient.formatSearchParams({
          rating
        })
      }),
    get: ({ id }: { id: string }) =>
      HttpClient.get<Review>(`${API_ENDPOINTS.PRODUCTS_REVIEWS}/${id}`),
    create: (input: CreateReviewInput) =>
      HttpClient.post<ReviewResponse>(API_ENDPOINTS.PRODUCTS_REVIEWS, input),
    update: (input: UpdateReviewInput) =>
      HttpClient.put<ReviewResponse>(
        `${API_ENDPOINTS.PRODUCTS_REVIEWS}/${input.id}`,
        input
      )
  }
  wishlist = {
    all: (params: WishlistQueryOptions) =>
      HttpClient.get<AssetPaginator>(API_ENDPOINTS.USERS_WISHLIST, {
        with: 'shop',
        orderBy: 'created_at',
        sortedBy: 'desc',
        ...params
      }),
    toggle: (input: { product_id: string }) =>
      HttpClient.post<{ in_wishlist: boolean }>(
        API_ENDPOINTS.USERS_WISHLIST_TOGGLE,
        input
      ),
    remove: (id: string) =>
      HttpClient.delete<Wishlist>(`${API_ENDPOINTS.WISHLIST}/${id}`),
    checkIsInWishlist: ({ product_id }: { product_id: string }) =>
      HttpClient.get<boolean>(
        `${API_ENDPOINTS.WISHLIST}/in_wishlist/${product_id}`
      )
  }
  myQuestions = {
    all: (params: MyQuestionQueryOptions) =>
      HttpClient.get<QuestionPaginator>(API_ENDPOINTS.MY_QUESTIONS, {
        with: 'user',
        orderBy: 'created_at',
        sortedBy: 'desc',
        ...params
      })
  }
  myReports = {
    all: (params: MyReportsQueryOptions) =>
      HttpClient.get<QuestionPaginator>(API_ENDPOINTS.MY_REPORTS, {
        with: 'user',
        orderBy: 'created_at',
        sortedBy: 'desc',
        ...params
      })
  }
  follow = {
    shops: (query?: FollowedShopsQueryOptions) =>
      HttpClient.get<ShopPaginator>(API_ENDPOINTS.FOLLOWED_SHOPS, query),
    isShopFollowed: (input: { shop_id: string }) =>
      HttpClient.get<boolean>(API_ENDPOINTS.FOLLOW_SHOP, input),
    toggle: (input: { shop_id: string }) =>
      HttpClient.post<boolean>(API_ENDPOINTS.FOLLOW_SHOP, input),
    followedShopProducts: (params: Partial<FollowedShopsQueryOptions>) => {
      return HttpClient.get<Asset[]>(API_ENDPOINTS.FOLLOWED_SHOPS_PRODUCTS, {
        ...params
      })
    }
  }
  settings = {
    all: (params?: SettingsQueryOptions) =>
      HttpClient.get<Settings>(API_ENDPOINTS.SETTINGS, { ...params }),
    contactUs: (input: CreateContactUsInput) =>
      HttpClient.post<any>(API_ENDPOINTS.CONACT_US, input),
    upload: (input: File[]) => {
      let formData = new FormData()
      input.forEach((attachment) => {
        formData.append('attachment[]', attachment)
      })
      return HttpClient.post<Attachment[]>(API_ENDPOINTS.UPLOADS, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    }
  }
  cards = {
    all: (params?: any) =>
      HttpClient.get<Card[]>(API_ENDPOINTS.CARDS, { ...params }),
    remove: ({ id }: { id: string }) =>
      HttpClient.delete<any>(`${API_ENDPOINTS.CARDS}/${id}`),
    addPaymentMethod: (method_key: any) =>
      HttpClient.post<any>(API_ENDPOINTS.CARDS, method_key),
    makeDefaultPaymentMethod: (input: any) =>
      HttpClient.post<any>(API_ENDPOINTS.SET_DEFAULT_CARD, input)
  }
  legalContent = {
    getByType: ({
      content_type,
      language
    }: {
      content_type: string
      language: string
    }) =>
      HttpClient.get<LegalContent>(`${API_ENDPOINTS.LEGAL_CONTENT}`, {
        content_type,
        language
      })
  }
  currentUser: User | undefined
}

export default new Client()
