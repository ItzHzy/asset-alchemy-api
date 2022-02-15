import { RequestOptions, RESTDataSource } from "apollo-datasource-rest";

export interface CompanyInfoResult {
  symbol: string;
  companyName: string;
  exchange: string;
  industry: string;
  website: string;
  description: string;
  CEO: string;
  securityName: string;
  issueType: string;
  sector: string;
  primarySicCode: number;
  employees: number;
  tags: Array<string>;
  address: string;
  address2: string | null;
  state: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
}

export interface CompanyStatsResult {
  companyName: string;
  marketcap: number;
  week52high: number;
  week52low: number;
  week52highSplitAdjustOnly: number;
  week52lowSplitAdjustOnly: number;
  week52change: number;
  sharesOutstanding: number;
  float: number;
  avg10Volume: number;
  avg30Volume: number;
  day200MovingAvg: number;
  day50MovingAvg: number;
  employees: number;
  ttmEPS: number;
  ttmDividendRate: number;
  dividendYield: number;
  nextDividendDate: string;
  exDividendDate: string;
  nextEarningsDate: string;
  peRatio: number;
  beta: number;
  maxChangePercent: number;
  year5ChangePercent: number;
  year2ChangePercent: number;
  year1ChangePercent: number;
  ytdChangePercent: number;
  month6ChangePercent: number;
  month3ChangePercent: number;
  month1ChangePercent: number;
  day30ChangePercent: number;
  day5ChangePercent: number;
}

export interface IncomeStatementResult {
  reportDate: string;
  filingType: string;
  fiscalDate: string;
  fiscalQuarter: number;
  fiscalYear: number;
  currency: string;
  totalRevenue: number;
  costOfRevenue: number;
  grossProfit: number;
  researchAndDevelopment: number;
  sellingGeneralAndAdmin: number;
  operatingExpense: number;
  operatingIncome: number;
  otherIncomeExpenseNet: number;
  ebit: number;
  interestIncome: number;
  pretaxIncome: number;
  incomeTax: number;
  minorityInterest: number;
  netIncome: number;
  netIncomeBasic: number;
}

export interface QuoteResult {
  symbol: string;
  companyName: string;
  primaryExchange: string;
  calculationPrice: string;
  open: number;
  openTime: number;
  openSource: string;
  close: number;
  closeTime: number;
  closeSource: string;
  high: number;
  highTime: number;
  highSource: string;
  low: number;
  lowTime: number;
  lowSource: string;
  latestPrice: number;
  latestSource: string;
  latestTime: string;
  latestUpdate: number;
  latestVolume: number;
  iexRealtimePrice: number;
  iexRealtimeSize: number;
  iexLastUpdated: number;
  delayedPrice: number;
  delayedPriceTime: number;
  oddLotDelayedPrice: number;
  oddLotDelayedPriceTime: number;
  extendedPrice: number;
  extendedChange: number;
  extendedChangePercent: number;
  extendedPriceTime: number;
  previousClose: number;
  previousVolume: number;
  change: number;
  changePercent: number;
  volume: number;
  iexMarketPercent: number;
  iexVolume: number;
  avgTotalVolume: number;
  iexBidPrice: number;
  iexBidSize: number;
  iexAskPrice: number;
  iexAskSize: number;
  iexOpen: number;
  iexOpenTime: number;
  iexClose: number;
  iexCloseTime: number;
  marketCap: number;
  peRatio: number;
  week52High: number;
  week52Low: number;
  ytdChange: number;
  lastTradeTime: number;
  currency: string;
  isUSMarketOpen: boolean;
}

export interface NewsResult {
  datetime: number;
  headline: string;
  source: string;
  qmUrl: string;
  url: string;
  summary: string;
  related: string;
  image: string;
  lang: string;
  hasPaywall: boolean;
}

export interface HistoricalPriceResult {
  date: string;
  close: number;
}

type SmallIntArg = 1 | 2 | 3 | 4 | 5;
type QuarterArg = 1 | 2 | 3 | 4;
type HalfArg = 1 | 2;

export type ChartRange =
  | "today"
  | "yesterday"
  | "ytd"
  | "last-week"
  | "last-month"
  | "last-quarter"
  | `${SmallIntArg}d`
  | `${SmallIntArg}w`
  | `${SmallIntArg}m`
  | `${SmallIntArg}q`
  | `${SmallIntArg}y`
  | "tomorrow"
  | "this-week"
  | "this-month"
  | "this-quarter"
  | "next-week"
  | "next-quarter"
  | `Q${QuarterArg}${number}`
  | `H${HalfArg}${number}`
  | `${number}`;

export default class IEXCloudAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "https://cloud.iexapis.com/stable";
  }

  async willSendRequest(request: RequestOptions) {
    request.params.set("token", this.context.IEX_API_KEY);
  }

  async getTickers(query: string): Promise<string[]> {
    const data = await this.get(
      `/search/${encodeURIComponent(query)}`,
      {},
      {
        cacheOptions: { ttl: 60 },
      }
    );
    return data.map((result: { symbol: any }) => result.symbol);
  }

  async getBasicInfo(
    ticker: string | number | boolean
  ): Promise<CompanyInfoResult> {
    const data: CompanyInfoResult = await this.get(
      `/stock/${encodeURIComponent(ticker)}/company`,
      {},
      {
        cacheOptions: { ttl: 604800 },
      }
    );

    return data;
  }

  async getBasicStats(
    ticker: string | number | boolean
  ): Promise<CompanyStatsResult> {
    return this.get(
      `/stock/${encodeURIComponent(ticker)}/stats`,
      {},
      {
        cacheOptions: { ttl: 86400 },
      }
    );
  }

  async getLogo(ticker: string | number | boolean): Promise<string> {
    const data = await this.get(
      `/stock/${encodeURIComponent(ticker)}/logo`,
      {},
      {
        cacheOptions: { ttl: 86400 },
      }
    );

    return data.url;
  }

  async getIncomeStatement(
    ticker: string | number | boolean
  ): Promise<IncomeStatementResult[]> {
    const data = await this.get(
      `/stock/${encodeURIComponent(ticker)}/income`,
      { last: 4 },
      {
        cacheOptions: { ttl: 86400 },
      }
    );
    return data.income ? data.income : [];
  }

  async getQuote(ticker: string): Promise<QuoteResult> {
    return this.get(
      `/stock/${encodeURIComponent(ticker)}/quote`,
      {
        displayPercent: true,
      },
      {
        cacheOptions: { ttl: 600 },
      }
    );
  }

  async getHistoricalPrices(
    ticker: string | number | boolean,
    range: string | number | boolean,
    interval: any
  ): Promise<HistoricalPriceResult[]> {
    return this.get(
      `/stock/${encodeURIComponent(ticker)}/chart/${encodeURIComponent(range)}`,
      {
        chartCloseOnly: true,
        filter: "date,close",
        chartInterval: interval,
      }
    );
  }

  async getNews(
    tickers: Array<string>,
    following: Array<string>
  ): Promise<Array<NewsResult>> {
    try {
      const data = await this.get(`/stock/market/batch`, {
        symbols: tickers.toString(),
        types: "news",
        last: 15,
        language: "en",
      });

      const arr: Array<NewsResult> = [];

      for (const ticker in data) {
        arr.push(...data[ticker].news);
      }

      arr.forEach((element, index) => {
        arr[index].related = arr[index].related
          .split(",")
          .filter((ticker) => following.includes(ticker))
          .toString();
      });

      return arr;
    } catch (error) {
      console.log(error);

      return [];
    }
  }
}
