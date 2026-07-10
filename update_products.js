const fs = require('fs');
const path = require('path');

const zhPath = path.join('e:/Antigravity/chengzi-ai/src/content/products/zh');
const enPath = path.join('e:/Antigravity/chengzi-ai/src/content/products/en');

// Delete old files
const filesToDelete = [
  'chatgpt-plus-ready-account.json',
  'chatgpt-plus-renewal.json',
  'chatgpt-pro-20x-fast.json',
  'gemini-pro-year-account.json'
];

filesToDelete.forEach(file => {
  const zhFile = path.join(zhPath, file);
  const enFile = path.join(enPath, file);
  if (fs.existsSync(zhFile)) fs.unlinkSync(zhFile);
  if (fs.existsSync(enFile)) fs.unlinkSync(enFile);
});

// New products definition
const products = [
  {
    id: "plus-ready-codex",
    categoryId: "gpt",
    categoryNameZh: "GPT 会员",
    categoryNameEn: "GPT Member",
    titleZh: "Plus 成品 网页用 (支持 Codex)",
    titleEn: "Plus Ready Account - Web (Codex Supported)",
    subtitleZh: "高配版 Plus 成品账号，支持 Codex 功能，专为网页端打造。推荐使用指纹浏览器+干净IP，手机端同时登陆会增加风控风险。",
    subtitleEn: "Premium Plus ready-made account supporting Codex, exclusive for Web. Recommended to use fingerprint browser + clean IP.",
    price: 100.0,
    originalPriceTextZh: "高权重新号",
    originalPriceTextEn: "High-trust New Account",
    order: 2,
    tagsZh: ["支持Codex", "网页端专用", "高权重"],
    tagsEn: ["Codex Supported", "Web Exclusive", "High Trust"],
    inStock: true,
    buyButtonTextZh: "下单购买 ￥100.0",
    buyButtonTextEn: "Buy Now ¥100.0",
    warningsZh: ["买的稳定号推荐用指纹浏览器+干净ip使用，手机端同时登陆会增加风控风险。网页端请认准网页端专用成品号(不要买成json)。"],
    warningsEn: ["For stable accounts, we recommend using fingerprint browser with clean IP. Logging in via mobile app simultaneously increases risk. Ensure you are buying a Web-exclusive account."],
    detailSectionsZh: [
      {
        title: "适合人群",
        items: ["需要稳定使用 ChatGPT Plus 的用户", "需要运行代码 (Codex) 的开发者", "希望免去自己注册麻烦的用户"]
      },
      {
        title: "发货内容",
        items: ["高权重成品账号及密码", "绑定的邮箱及密码"]
      }
    ],
    detailSectionsEn: [
      {
        title: "Suitable For",
        items: ["Users needing stable ChatGPT Plus access", "Developers needing code execution (Codex)", "Users avoiding the hassle of self-registration"]
      },
      {
        title: "Delivery Contents",
        items: ["High-trust ready-made account & password", "Bound email & password"]
      }
    ]
  },
  {
    id: "plus-ready-normal",
    categoryId: "gpt",
    categoryNameZh: "GPT 会员",
    categoryNameEn: "GPT Member",
    titleZh: "Plus 成品 网页用 (普通版)",
    titleEn: "Plus Ready Account - Web (Standard)",
    subtitleZh: "基础款 Plus 成品账号。推荐使用指纹浏览器+干净IP，手机端同时登陆会增加风控风险。",
    subtitleEn: "Standard Plus ready-made account for Web. Recommended to use fingerprint browser + clean IP.",
    price: 66.0,
    originalPriceTextZh: "高性价首选",
    originalPriceTextEn: "Best Value",
    order: 3,
    tagsZh: ["普通版", "网页端专用", "高性价比"],
    tagsEn: ["Standard", "Web Exclusive", "Best Value"],
    inStock: true,
    buyButtonTextZh: "下单购买 ￥66.0",
    buyButtonTextEn: "Buy Now ¥66.0",
    warningsZh: ["买的稳定号推荐用指纹浏览器+干净ip使用，手机端同时登陆会增加风控风险。网页端请认准网页端专用成品号(不要买成json)。"],
    warningsEn: ["For stable accounts, we recommend using fingerprint browser with clean IP. Logging in via mobile app simultaneously increases risk."],
    detailSectionsZh: [
      {
        title: "适合人群",
        items: ["预算有限的 Plus 体验用户", "日常对话和轻量级任务需求"]
      },
      {
        title: "发货内容",
        items: ["基础成品账号及密码", "绑定的邮箱及密码"]
      }
    ],
    detailSectionsEn: [
      {
        title: "Suitable For",
        items: ["Budget-conscious Plus users", "Daily chatting and lightweight tasks"]
      },
      {
        title: "Delivery Contents",
        items: ["Standard ready-made account & password", "Bound email & password"]
      }
    ]
  },
  {
    id: "plus-ready-google",
    categoryId: "gpt",
    categoryNameZh: "GPT 会员",
    categoryNameEn: "GPT Member",
    titleZh: "Plus 成品 网页用 谷歌邮箱",
    titleEn: "Plus Ready Account - Web (Google Email)",
    subtitleZh: "采用高权重谷歌邮箱注册，适合纯净 IP 配合指纹浏览器在网页端使用。",
    subtitleEn: "Registered with high-trust Google Email, suitable for clean IP and fingerprint browser on Web.",
    price: 100.0,
    originalPriceTextZh: "谷歌直登",
    originalPriceTextEn: "Google Direct Login",
    order: 4,
    tagsZh: ["谷歌邮箱", "网页端专用", "防风控"],
    tagsEn: ["Google Email", "Web Exclusive", "Anti-Ban"],
    inStock: true,
    buyButtonTextZh: "下单购买 ￥100.0",
    buyButtonTextEn: "Buy Now ¥100.0",
    warningsZh: ["买的稳定号推荐用指纹浏览器+干净ip使用，手机端同时登陆会增加风控风险。"],
    warningsEn: ["For stable accounts, we recommend using fingerprint browser with clean IP. Logging in via mobile app simultaneously increases risk."],
    detailSectionsZh: [
      {
        title: "适合人群",
        items: ["习惯使用 Google 授权登录的用户", "对账号稳定性要求极高的专业用户"]
      },
      {
        title: "发货内容",
        items: ["绑定的谷歌邮箱及密码", "辅助恢复邮箱或手机"]
      }
    ],
    detailSectionsEn: [
      {
        title: "Suitable For",
        items: ["Users accustomed to Google OAuth login", "Pro users demanding high account stability"]
      },
      {
        title: "Delivery Contents",
        items: ["Bound Google email & password", "Recovery email or phone"]
      }
    ]
  },
  {
    id: "grok-ready-7d",
    categoryId: "gpt",
    categoryNameZh: "GPT 会员",
    categoryNameEn: "GPT Member",
    titleZh: "Grok 成品号 7天",
    titleEn: "Grok Ready Account - 7 Days",
    subtitleZh: "xAI 推出的 Grok 模型体验账号，质保 7 天。抢鲜体验马斯克最新无限制 AI 助手。",
    subtitleEn: "xAI's Grok model experience account, 7-day warranty. Early access to Elon Musk's unfiltered AI.",
    price: 39.9,
    originalPriceTextZh: "尝鲜专区",
    originalPriceTextEn: "Early Access",
    order: 5,
    tagsZh: ["Grok体验", "7天质保", "马斯克AI"],
    tagsEn: ["Grok Trial", "7D Warranty", "xAI"],
    inStock: true,
    buyButtonTextZh: "下单购买 ￥39.9",
    buyButtonTextEn: "Buy Now ¥39.9",
    warningsZh: ["仅保证 7 天内的登录和使用，到期不可续费，介意勿拍。"],
    warningsEn: ["Only guarantees login and usage within 7 days. Cannot be renewed after expiration."],
    detailSectionsZh: [
      {
        title: "适合人群",
        items: ["想要体验 X (Twitter) 平台 Grok 的用户", "对幽默反叛人格 AI 感兴趣的极客"]
      },
      {
        title: "发货内容",
        items: ["X (Twitter) 账号与密码", "绑定的邮箱与密码"]
      }
    ],
    detailSectionsEn: [
      {
        title: "Suitable For",
        items: ["Users wanting to try X (Twitter)'s Grok", "Geeks interested in humorous/rebellious AI"]
      },
      {
        title: "Delivery Contents",
        items: ["X (Twitter) account & password", "Bound email & password"]
      }
    ]
  },
  {
    id: "codex-sms",
    categoryId: "gpt",
    categoryNameZh: "GPT 会员",
    categoryNameEn: "GPT Member",
    titleZh: "Codex 长效接码 美国实卡",
    titleEn: "Codex Long-term SMS - US Real Card",
    subtitleZh: "美国实体手机卡接码服务，秒过所有 AI 验证，用于 OpenAI 等账号的长期验证接码。",
    subtitleEn: "US physical mobile card SMS service, passes all AI verifications for long-term OpenAI usage.",
    price: 2.8,
    originalPriceTextZh: "￥4",
    originalPriceTextEn: "¥4",
    order: 6,
    tagsZh: ["长效接码", "美国实卡", "防封锁"],
    tagsEn: ["Long-term SMS", "US Real Card", "Anti-Ban"],
    inStock: true,
    buyButtonTextZh: "下单购买 ￥2.8",
    buyButtonTextEn: "Buy Now ¥2.8",
    warningsZh: ["仅提供单次指定平台的接码服务，拍下后联系客服获取手机号和验证码。"],
    warningsEn: ["Provides single SMS verification for the designated platform. Contact support after purchase."],
    detailSectionsZh: [
      {
        title: "适合人群",
        items: ["自己注册 OpenAI 或被风控要求验证手机号的用户", "需要高权重美国实卡号码的用户"]
      },
      {
        title: "发货内容",
        items: ["一个独享的美国实体卡手机号", "代收一条验证码短信"]
      }
    ],
    detailSectionsEn: [
      {
        title: "Suitable For",
        items: ["Users self-registering OpenAI or hitting phone verification blocks", "Users needing high-trust US real numbers"]
      },
      {
        title: "Delivery Contents",
        items: ["An exclusive US physical mobile number", "Receiving one verification SMS"]
      }
    ]
  },
  {
    id: "gpt-normal-whiteip",
    categoryId: "gpt",
    categoryNameZh: "GPT 会员",
    categoryNameEn: "GPT Member",
    titleZh: "GPT 普通账号 白家宽号",
    titleEn: "GPT Normal Account - White Home IP",
    subtitleZh: "使用极品白净家庭宽带注册的普通 ChatGPT 账号，风控极低，适合长期自用。",
    subtitleEn: "Normal ChatGPT account registered via pristine home broadband IP. Extremely low risk, perfect for long-term use.",
    price: 1.6,
    originalPriceTextZh: "￥15.0",
    originalPriceTextEn: "¥15.0",
    order: 7,
    tagsZh: ["极品白净", "家庭宽带", "普通账号"],
    tagsEn: ["Pristine IP", "Home Broadband", "Normal Acc"],
    inStock: true,
    buyButtonTextZh: "下单购买 ￥1.6",
    buyButtonTextEn: "Buy Now ¥1.6",
    warningsZh: ["买的稳定号推荐用指纹浏览器+干净ip使用，手机端同时登陆会增加风控风险。"],
    warningsEn: ["For stable accounts, we recommend using fingerprint browser with clean IP. Logging in via mobile app simultaneously increases risk."],
    detailSectionsZh: [
      {
        title: "适合人群",
        items: ["只需要使用免费 GPT-3.5/GPT-4o mini 模型的人群", "需要大量低成本备用号的开发者或工作室"]
      },
      {
        title: "发货内容",
        items: ["普通 ChatGPT 账号及密码", "绑定的专属邮箱"]
      }
    ],
    detailSectionsEn: [
      {
        title: "Suitable For",
        items: ["Users only needing free GPT-3.5/GPT-4o mini models", "Developers needing low-cost backup accounts"]
      },
      {
        title: "Delivery Contents",
        items: ["Normal ChatGPT account & password", "Bound exclusive email"]
      }
    ]
  },
  {
    id: "gemini-pro-direct",
    categoryId: "gemini",
    categoryNameZh: "Gemini 会员",
    categoryNameEn: "Gemini Member",
    titleZh: "Gemini Ai Pro 会员 直充含绑卡",
    titleEn: "Gemini AI Pro Member - Direct Top-up",
    subtitleZh: "包含正规国际信用卡绑卡服务，直接升级您现有的 Google 账号至 Gemini Advanced (Pro)。",
    subtitleEn: "Includes legitimate international credit card binding. Directly upgrades your Google account to Gemini Advanced (Pro).",
    price: 11.5,
    originalPriceTextZh: "安全直充",
    originalPriceTextEn: "Safe Top-up",
    order: 1,
    tagsZh: ["Gemini Pro", "直充到账", "含绑卡服务"],
    tagsEn: ["Gemini Pro", "Direct Top-up", "Card Binding"],
    inStock: true,
    buyButtonTextZh: "下单购买 ￥11.5",
    buyButtonTextEn: "Buy Now ¥11.5",
    warningsZh: ["需要您提供需要升级的谷歌账号与密码。直充期间请勿登录抢占IP，以免触发谷歌风控。"],
    warningsEn: ["Requires your Google account and password for the upgrade. Do not log in during the process to avoid triggering Google risk control."],
    detailSectionsZh: [
      {
        title: "适合人群",
        items: ["想要使用 Google 最强模型 Gemini 1.5 Pro 的用户", "没有海外信用卡的国内用户"]
      },
      {
        title: "发货内容",
        items: ["协助将您的谷歌账号升级为 Gemini Advanced", "包含绑定的虚拟卡开卡费和手续费"]
      }
    ],
    detailSectionsEn: [
      {
        title: "Suitable For",
        items: ["Users wanting Google's strongest model Gemini 1.5 Pro", "Users without overseas credit cards"]
      },
      {
        title: "Delivery Contents",
        items: ["Assistance in upgrading your Google account to Gemini Advanced", "Includes virtual card issuance and handling fees"]
      }
    ]
  }
];

// Write new products
products.forEach(p => {
  const zhData = {
    id: p.id,
    categoryId: p.categoryId,
    categoryName: p.categoryNameZh,
    title: p.titleZh,
    subtitle: p.subtitleZh,
    price: p.price,
    originalPriceText: p.originalPriceTextZh,
    order: p.order,
    tags: p.tagsZh,
    inStock: p.inStock,
    buyButtonText: p.buyButtonTextZh,
    actionType: "buy",
    warnings: p.warningsZh,
    detail: {
      title: p.titleZh,
      subtitle: p.subtitleZh,
      sections: p.detailSectionsZh
    },
    isHot: p.order <= 3,
    orderName: p.titleZh
  };

  const enData = {
    id: p.id,
    categoryId: p.categoryId,
    categoryName: p.categoryNameEn,
    title: p.titleEn,
    subtitle: p.subtitleEn,
    price: p.price,
    originalPriceText: p.originalPriceTextEn,
    order: p.order,
    tags: p.tagsEn,
    inStock: p.inStock,
    buyButtonText: p.buyButtonTextEn,
    actionType: "buy",
    warnings: p.warningsEn,
    detail: {
      title: p.titleEn,
      subtitle: p.subtitleEn,
      sections: p.detailSectionsEn
    },
    isHot: p.order <= 3,
    orderName: p.titleEn
  };

  fs.writeFileSync(path.join(zhPath, `${p.id}.json`), JSON.stringify(zhData, null, 2), 'utf8');
  fs.writeFileSync(path.join(enPath, `${p.id}.json`), JSON.stringify(enData, null, 2), 'utf8');
});

console.log("Product replacement completed successfully.");
