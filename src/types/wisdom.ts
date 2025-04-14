
export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export interface StoicQuote {
  quote: string;
  author: string;
}
