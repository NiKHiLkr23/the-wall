type QuoteSource = {
  title: string;
  url?: string;
  locator?: string;
  speaker?: string;
};

export type Quote = {
  id: string;
  text: string;
  author: string;
  source: string;
  sourceUrl?: string;
  kind?: string;
  addedAt?: string;
  textForm?: string;
  attribution?: {
    name: string;
    status: string;
    note?: string;
  };
  sourceDetails?: QuoteSource;
  originalSource?: QuoteSource;
};
