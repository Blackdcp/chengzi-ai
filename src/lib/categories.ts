export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const categories: Category[] = [
  { id: "ai-accounts", name: "AI 账号与订阅", icon: "🤖" },
  { id: "marketing", name: "营销引流资源", icon: "📈" },
  { id: "tools", name: "精选实用工具", icon: "🛠️" }
];
