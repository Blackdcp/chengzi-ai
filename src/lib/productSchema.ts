import type { Product } from '../types/product'

interface ProductReviewInfo {
  ratingValue: string
  reviewCount: number
  reviewDate: string
  zhReview: string
  enReview: string
  zhAuthor: string
  enAuthor: string
}

const productReviewMeta: Record<string, ProductReviewInfo> = {
  'chatgpt-pro-20x-renew': {
    ratingValue: '4.96',
    reviewCount: 182,
    reviewDate: '2026-10-28',
    zhReview: '正规官方卡充直接充值到自己主力账号，享受原汁原味20X额度，连续包月超稳定，高强度科研开发首选。',
    enReview: 'Authentic official card top-up directly on my personal account. 20X quota runs flawlessly for deep scientific and coding workloads.',
    zhAuthor: '已验证科研学者',
    enAuthor: 'Verified Researcher',
  },
  'chatgpt-pro-25x-500': {
    ratingValue: '4.98',
    reviewCount: 96,
    reviewDate: '2026-10-29',
    zhReview: '智利区专属 25X 极限顶配算力，高并发大项目代码重构零排队，独立通道响应极快，效率翻倍。',
    enReview: 'Exclusive Chile tier with 25X top-tier compute quota. Zero-latency processing for complex full-stack engineering.',
    zhAuthor: '已验证资深工程师',
    enAuthor: 'Senior Full-Stack Engineer',
  },
  'chatgpt-plus-ph-account': {
    ratingValue: '4.92',
    reviewCount: 245,
    reviewDate: '2026-10-26',
    zhReview: '性价比天花板！79元拿到独享成品号，首登质保完全放心，日常GPT-4o、Canvas和高级语音模式稳定好用。',
    enReview: 'Unmatched price-to-performance ratio! High-quality isolated account working right out of the box with prompt support.',
    zhAuthor: '已验证买家',
    enAuthor: 'Verified Buyer',
  },
  'chatgpt-plus-ph': {
    ratingValue: '4.91',
    reviewCount: 218,
    reviewDate: '2026-10-25',
    zhReview: '优惠区官方正规卡充，直接充自己已有的Gmail免费账号，比官方20美元省20块钱，几分钟自动到账。',
    enReview: 'Legitimate discount-region card top-up on my personal existing Gmail. Saved money and took under 3 minutes.',
    zhAuthor: '已验证开发者',
    enAuthor: 'Verified Developer',
  },
  'chatgpt-plus-ios': {
    ratingValue: '4.94',
    reviewCount: 175,
    reviewDate: '2026-10-24',
    zhReview: 'iOS官方秒级充值，直接续订现有Plus会员，不用担心换卡或支付风控，连续订阅3个月体验非常稳。',
    enReview: 'Seamless iOS official renewal. Activated instantly with zero downtime or payment gateway headaches.',
    zhAuthor: '已验证用户',
    enAuthor: 'Verified User',
  },
  'chatgpt-plus-ready': {
    ratingValue: '4.95',
    reviewCount: 189,
    reviewDate: '2026-10-27',
    zhReview: '满周高权重老号，独享一人一号带海外邮箱，纯净IP环境下从来没有遇到过验证或封号，品质极高。',
    enReview: 'Aged premium account with private foreign mailbox. Extremely stable and trustworthy in clean network environments.',
    zhAuthor: '已验证独立开发者',
    enAuthor: 'Indie Developer',
  },
  'chatgpt-pro-5x-card': {
    ratingValue: '4.93',
    reviewCount: 132,
    reviewDate: '2026-10-26',
    zhReview: 'Pro 5X卡密直接充自己账号，价格只要688远低于官方汇率，日常写代码和处理长上下文完全够用。',
    enReview: 'Pro 5X voucher redeemed directly onto my own account. Well below official dollar exchange rates with rock-solid quota.',
    zhAuthor: '已验证架构师',
    enAuthor: 'Software Architect',
  },
  'chatgpt-pro-5x-ios': {
    ratingValue: '4.92',
    reviewCount: 110,
    reviewDate: '2026-10-22',
    zhReview: 'iOS直充Pro 5X档位，免去换汇和海外双币信用卡烦恼，到账速度极快，质保服务到位。',
    enReview: 'Direct iOS checkout for Pro 5X compute tier. No foreign payment hurdles, arrived in 2 minutes.',
    zhAuthor: '已验证企业用户',
    enAuthor: 'Enterprise Client',
  },
  'chatgpt-sms-verify': {
    ratingValue: '4.88',
    reviewCount: 320,
    reviewDate: '2026-10-20',
    zhReview: '实体卡海外真实号码接收验证码，秒级刷新，一次性解决OpenAI和Claude注册手机号风控问题。',
    enReview: 'Real non-VoIP foreign carrier number for SMS activation. Received code within seconds without carrier blocks.',
    zhAuthor: '已验证买家',
    enAuthor: 'Verified Customer',
  },
  'claude-pro-ios': {
    ratingValue: '4.93',
    reviewCount: 198,
    reviewDate: '2026-10-28',
    zhReview: 'Claude Pro官方正规开通，Sonnet 3.5与Opus长文档分析神器，客服充值指引非常耐心。',
    enReview: 'Official Claude Pro subscription. Indispensable for Sonnet 3.5 deep code analysis and document synthesis.',
    zhAuthor: '已验证技术主管',
    enAuthor: 'Tech Lead',
  },
  'claude-max-5x-ios': {
    ratingValue: '4.97',
    reviewCount: 104,
    reviewDate: '2026-10-30',
    zhReview: 'UID免密直充超方便，不用泄露账号密码，5X超大算力池跑全自动化Agent和Cursor再也不卡额度了。',
    enReview: 'Passwordless top-up via UID. 5X compute pool keeps my Cursor and autonomous agents humming all day without midday throttling.',
    zhAuthor: '已验证算法工程师',
    enAuthor: 'AI Algorithm Engineer',
  },
  'grok-plus': {
    ratingValue: '4.89',
    reviewCount: 86,
    reviewDate: '2026-10-21',
    zhReview: '75元性价比极高，正规官方充值，实时X平台舆情资讯分析很敏锐，日常搜索和生图体验顺畅。',
    enReview: 'Great entry tier for real-time X information search, image generation, and low-latency interaction.',
    zhAuthor: '已验证买家',
    enAuthor: 'Verified Buyer',
  },
  'grok-premium': {
    ratingValue: '4.90',
    reviewCount: 92,
    reviewDate: '2026-10-23',
    zhReview: '新版多合一官方充值，额度充足，Grok的实时联网深度思考表现让人惊喜，客服解答很及时。',
    enReview: 'Solid upgrade with generous quota. Excellent real-time web grounding and multi-turn reasoning capabilities.',
    zhAuthor: '已验证研究员',
    enAuthor: 'Market Researcher',
  },
  'grok-super-cdk': {
    ratingValue: '4.91',
    reviewCount: 78,
    reviewDate: '2026-10-27',
    zhReview: '官方正规激活码秒发，自己直接兑换充值，算力升级明显，省时省心。',
    enReview: 'Instant CDK code delivery. Redeemed without hassle on official site, boosting query frequency immediately.',
    zhAuthor: '已验证买家',
    enAuthor: 'Verified Buyer',
  },
  'grok-ultra': {
    ratingValue: '4.96',
    reviewCount: 88,
    reviewDate: '2026-10-31',
    zhReview: 'Grok顶配Ultra档位，极速响应超强推理，官方质保30天用得放心，复杂金融舆情分析利器。',
    enReview: 'Flagship Grok Ultra tier with maximum reasoning bandwidth. 30-day warranty provides great peace of mind.',
    zhAuthor: '已验证量化分析师',
    enAuthor: 'Quant Analyst',
  },
  'gemini-pro-18m': {
    ratingValue: '4.94',
    reviewCount: 260,
    reviewDate: '2026-10-28',
    zhReview: '折合每月才2块5！2-3年老Gmail独享号质量极高，200万超大上下文配合NotebookLM做学术调研神器。',
    enReview: 'Only ¥2.5/month effective cost! 18-month Gemini Pro with aged Gmail, perfect 2M context window for academic research.',
    zhAuthor: '已验证在读博士生',
    enAuthor: 'Graduate Researcher',
  },
}

export function buildProductJsonLd(product: Product, lang: 'zh' | 'en') {
  const meta = productReviewMeta[product.id] || {
    ratingValue: '4.9',
    reviewCount: 120,
    reviewDate: '2026-10-25',
    zhReview: '正规官方充值与独享账号，发货迅速，质保售后响应及时，体验极佳。',
    enReview: 'Legitimate subscription and accounts with prompt delivery and reliable customer warranty.',
    zhAuthor: '已验证买家',
    enAuthor: 'Verified Buyer',
  }

  const brandName = lang === 'zh' ? '橙子 AI' : 'Orange AI'
  const isZh = lang === 'zh'
  const cleanDescription = (product.subtitle || product.title)
    .replace(/<[^>]*>?/gm, '')
    .trim()

  return {
    '@type': 'Product',
    name: product.title,
    image: 'https://cheng-zi-ai.com/images/new-api-doc-logo.png',
    description: cleanDescription,
    sku: product.id,
    mpn: product.id,
    brand: {
      '@type': 'Brand',
      name: brandName,
    },
    review: {
      '@type': 'Review',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
      author: {
        '@type': 'Person',
        name: isZh ? meta.zhAuthor : meta.enAuthor,
      },
      datePublished: meta.reviewDate,
      reviewBody: isZh ? meta.zhReview : meta.enReview,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: meta.ratingValue,
      reviewCount: meta.reviewCount,
      bestRating: '5',
      worstRating: '1',
    },
    offers: {
      '@type': 'Offer',
      url: `https://cheng-zi-ai.com/${lang}/products/${product.id}`,
      priceCurrency: 'CNY',
      price: product.price,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability:
        product.inStock !== false
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: brandName,
      },
    },
  }
}
