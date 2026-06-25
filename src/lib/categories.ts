export interface Category {
  id: string;
  name: string;
  iconName: string;
}

export const categories: Category[] = [
  { id: "ai-accounts", name: "AI 账号与订阅", iconName: "bot" },
  { id: "ai-api", name: "API 中转服务", iconName: "key" },
  { id: "marketing", name: "营销引流资源", iconName: "trending-up" }
];
