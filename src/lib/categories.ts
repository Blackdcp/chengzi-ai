export interface Category {
  id: string;
  name: string;
  iconName: string;
}

export const categories: Category[] = [
  { id: "chatgpt", name: "ChatGPT", iconName: "bot" },
  { id: "claude", name: "Claude", iconName: "sparkles" },
  { id: "grok", name: "Grok", iconName: "zap" },
  { id: "gemini", name: "Gemini", iconName: "star" }
];
