import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const PLAN_MAP = {
  plan_100: {
    zhName: "基础充值码",
    enName: "Basic Credit Code",
    cnyAmount: 100,
    usdAmount: 14,
    platformCreditZh: "$100 平台计价额度",
    platformCreditEn: "Get $100 platform credit",
  },
  plan_300: {
    zhName: "大额充值码",
    enName: "Pro Credit Code",
    cnyAmount: 300,
    usdAmount: 42,
    platformCreditZh: "$300 平台计价额度",
    platformCreditEn: "Get $300 platform credit",
  },
} as const;

function escapeHtml(unsafe: string): string {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      planId?: keyof typeof PLAN_MAP;
      email?: string;
      lang?: string;
      contact?: string;
      orderId?: string;
      productName?: string;
      price?: string | number;
      payMethod?: string;
      refCode?: string;
      refSource?: string;
      workLink?: string;
      requirement?: string;
    };
    const { planId, email, lang, contact } = body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let finalOrderId = '';
    let finalProductName = '';
    let finalPrice = '';
    let finalPayMethodStr = '';
    let finalEmail = '';
    let finalContact = '';
    const finalLang = lang === 'en' ? 'English' : '中文';
    let finalCredit = '';
    const refSource = body.refSource === 'api-invite' ? 'api-invite' : body.refSource === 'homepage' ? 'homepage' : '';
    const refLabel = refSource === 'api-invite' ? 'API 邀请码（辅助核对）' : refSource === 'homepage' ? '首页推广码' : '推荐码（辅助核对）';
    const refTip = refSource === 'api-invite'
      ? '这是 API 邀请活动线索；邀请奖励请以 New API 控制台中的邀请关系和被邀请用户首充记录为准。'
      : refSource === 'homepage'
        ? '这是首页推广来源码；仅用于判断订单来源，不等同于 New API 邀请返佣。'
        : '推荐码仅用于辅助查单；如涉及邀请奖励，请以 New API 控制台中的邀请关系和被邀请用户首充记录为准。';

    if (planId) {
      // 1. API Service Order with planId secure validation
      const plan = PLAN_MAP[planId];
      if (!plan) {
        return NextResponse.json({ error: 'Invalid planId' }, { status: 400 });
      }
      if (!email || !emailRegex.test(email)) {
        return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
      }

      // Generate order ID
      const now = new Date();
      const ts = now.getFullYear().toString() +
        (now.getMonth() + 1).toString().padStart(2, '0') +
        now.getDate().toString().padStart(2, '0') +
        now.getHours().toString().padStart(2, '0') +
        now.getMinutes().toString().padStart(2, '0') +
        now.getSeconds().toString().padStart(2, '0');
      const rand = Math.floor(1000 + Math.random() * 9000);
      finalOrderId = `API-${ts}-${rand}`;

      const isEn = lang === 'en';
      finalProductName = isEn ? plan.enName : plan.zhName;
      finalPrice = isEn ? `$${plan.usdAmount}` : `¥${plan.cnyAmount}`;
      finalPayMethodStr = isEn ? 'PayPal' : '支付宝';
      finalEmail = escapeHtml(email);
      finalContact = escapeHtml(contact || '');
      finalCredit = isEn ? plan.platformCreditEn : plan.platformCreditZh;
    } else {
      // 2. Legacy / Marketing / Main page fallback
      const { orderId, email: rawEmail, productName, price, payMethod } = body;
      if (!orderId || !rawEmail || !productName) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }
      if (!emailRegex.test(rawEmail)) {
        return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
      }
      finalOrderId = escapeHtml(orderId);
      finalProductName = escapeHtml(productName);
      finalPrice = price !== undefined ? (lang === 'en' ? `$${price}` : `¥${price}`) : '未知';
      finalEmail = escapeHtml(rawEmail);
      
      let payMethodStr = '未知';
      if (payMethod === 'alipay') {
        payMethodStr = '支付宝';
      } else if (payMethod === 'wechat') {
        payMethodStr = '微信支付';
      } else if (payMethod === 'paypal') {
        payMethodStr = 'PayPal';
      }
      finalPayMethodStr = payMethodStr;
    }

    // Configure nodemailer transporter using environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.163.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #0a0a0a; color: #ffffff; padding: 20px; text-align: center;">
          <h2 style="margin: 0;">📦 新订单通知</h2>
        </div>
        <div style="padding: 24px; color: #333;">
          <p style="font-size: 16px; margin-bottom: 24px;">您有一笔新订单等待处理：</p>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tbody>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; color: #666; width: 100px;">订单编号</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; font-weight: 600;">${finalOrderId}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; color: #666;">系统语言</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; font-weight: 600;">${finalLang}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; color: #666;">商品名称</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; font-weight: 600; color: #ff6600;">${finalProductName}</td>
              </tr>
              ${finalCredit ? `
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; color: #666;">平台额度</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; font-weight: 600; color: #22c55e;">${finalCredit}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; color: #666;">支付金额</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; font-weight: 600;">${finalPrice}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; color: #666;">支付方式</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; font-weight: 600;">${finalPayMethodStr}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; color: #666;">客户邮箱</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; font-weight: 600;">
                  <a href="mailto:${finalEmail}" style="color: #0a0a0a; text-decoration: none;">${finalEmail}</a>
                </td>
              </tr>
              ${finalContact ? `
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; color: #666;">联系备注</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; font-weight: 600; white-space: pre-wrap;">${finalContact}</td>
              </tr>
              ` : ''}
              ${body.refCode ? `
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; color: #666;">${refLabel}</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; font-weight: 600; color: #ff6600;">${escapeHtml(body.refCode)}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; color: #666;">来源说明</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; font-weight: 600; color: #666;">
                  ${refTip}
                </td>
              </tr>
              ` : ''}
              ${body.workLink ? `
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; color: #666;">作品/主页链接</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; font-weight: 600; word-break: break-all;">
                  <a href="${escapeHtml(body.workLink)}" target="_blank" style="color: #1677ff;">${escapeHtml(body.workLink)}</a>
                </td>
              </tr>
              ` : ''}
              ${body.requirement ? `
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; color: #666;">具体需求</td>
                <td style="padding: 12px 0; border-bottom: 1px solid #eaeaea; font-weight: 600; white-space: pre-wrap;">${escapeHtml(body.requirement)}</td>
              </tr>
              ` : ''}
            </tbody>
          </table>
          
          <p style="margin-top: 32px; font-size: 14px; color: #666; text-align: center;">
            请核对收款后，尽快通过客户邮箱发送卡密/商品。
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: `"订单系统" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      subject: `[新订单] 收到一笔新订单：${finalProductName} (${finalPrice})`,
      html: htmlContent,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Notification sent successfully' });
  } catch (error: unknown) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
