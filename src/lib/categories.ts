export interface Category {
  id: string;
  name: string;
  iconName: string;
}

export const categories: Category[] = [
  { id: "gpt", name: "GPT 会员", iconName: "bot" },
  { id: "gemini", name: "Gemini 会员", iconName: "star" },
  { id: "api", name: "API 中转站", iconName: "key" },
  { id: "growth", name: "营销资源", iconName: "trending-up" }
];
