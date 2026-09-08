export interface Category {
  id: string;
  name: string;
  iconName: string;
}

export const categories: Category[] = [
  { id: "gpt", name: "GPT 会员", iconName: "bot" },
  { id: "gemini", name: "Gemini 会员", iconName: "star" }
];
