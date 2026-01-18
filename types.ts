
export interface WhopPlan {
  name: string;
  price: number;
  currency: string;
  cycle: string;
}

export interface Competitor {
  name: string;
  priceRange: string;
  advantage: string;
}

export interface SentimentBreakdown {
  valueForMoney: number;
  quality: number;
  support: number;
  easeOfUse: number;
}

export interface WhopListing {
  id: string;
  name: string;
  url: string;
  creator: string;
  plans: WhopPlan[];
  description: string;
  features: string[];
  category: string;
  pros: string[];
  cons: string[];
  sentimentScore: number;
  sentimentBreakdown: SentimentBreakdown;
  growthPotential: string;
  competitors: Competitor[];
  confidenceScore: number;
  extractedAt: string;
  sources: { title: string; uri: string }[];
}

export interface ScrapingState {
  isLoading: boolean;
  error: string | null;
  history: WhopListing[];
  currentResult: WhopListing | null;
}
