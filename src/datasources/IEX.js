import { RESTDataSource } from "apollo-datasource-rest";

//TODO: use custom caching to use custom timestamps
//TODO: use built-in filter on IEX instead of custom
export default class IEXCloudAPI extends RESTDataSource {
	constructor() {
		super();
		this.baseURL = "https://cloud.iexapis.com/stable";
	}

	async willSendRequest(request) {
		request.params.set("token", this.context.IEX_API_KEY);
	}

	async getTickers(query) {
		const data = await this.get(`/search/${encodeURIComponent(query)}`, null, {
			cacheOptions: { ttl: 60 },
		});

		return data.map((result) => result.symbol);
	}

	async getName(ticker) {
		const data = await this.get(
			`/stock/${encodeURIComponent(ticker)}/stats/companyName`,
			null,
			{
				cacheOptions: { ttl: 86400 },
			}
		);

		//TODO: please fix this madness
		return data
			.replace(" Corporation", "")
			.replace(" Inc.", "")
			.replace(" Corp.", "")
			.replace(" Ltd.", "")
			.replace(" Corp", "")
			.replace(" Inc", "")
			.replace(" plc", "")
			.replace(" Plc", "")
			.replace(" Ltd", "");
	}

	async getPrice(ticker) {
		return this.get(`/stock/${encodeURIComponent(ticker)}/price`, null, {
			cacheOptions: { ttl: 0 },
		});
	}

	//TODO: return as percentage
	//TODO: use opening price as base
	async getDailyDelta(ticker) {
		return this.get(
			`/stock/${encodeURIComponent(ticker)}/quote/changePercent`,
			null,
			{ cacheOptions: { ttl: 0 } }
		);
	}

	async getRevenue(ticker) {
		const data = await this.get(
			`/stock/${encodeURIComponent(ticker)}/income`,
			{ last: 4 },
			{
				cacheOptions: { ttl: 86400 },
			}
		);
		return data.income ? data.income.map((result) => result.totalRevenue) : [];
	}

	async getNetIncome(ticker) {
		const data = await this.get(
			`/stock/${encodeURIComponent(ticker)}/income`,
			{ last: 4 },
			{
				cacheOptions: { ttl: 86400 },
			}
		);

		return data.income ? data.income.map((result) => result.netIncome) : [];
	}

	//TODO: calculate profit margin here vs through the api to save credits
	async getGrossProfit(ticker) {
		const data = await this.get(
			`/stock/${encodeURIComponent(ticker)}/income`,
			{ last: 4 },
			{
				cacheOptions: { ttl: 86400 },
			}
		);

		return data.income ? data.income.map((result) => result.grossProfit) : [];
	}

	async getOperatingIncome(ticker) {
		const data = await this.get(
			`/stock/${encodeURIComponent(ticker)}/income`,
			{ last: 4 },
			{
				cacheOptions: { ttl: 86400 },
			}
		);

		return data.income
			? data.income.map((result) => result.operatingIncome)
			: [];
	}

	async getPERatio(ticker) {
		return this.get(
			`/stock/${encodeURIComponent(ticker)}/stats/peRatio`,
			null,
			{ cacheOptions: { ttl: 86400 } }
		);
	}

	async getDescription(ticker) {
		const data = await this.get(
			`/stock/${encodeURIComponent(ticker)}/company`,
			null,
			{
				cacheOptions: { ttl: 604800 },
			}
		);

		return data.description;
	}

	async getLogo(ticker) {
		const data = await this.get(
			`/stock/${encodeURIComponent(ticker)}/logo`,
			null,
			{
				cacheOptions: { ttl: 86400 },
			}
		);

		return data.url;
	}

	async getNews(tickers) {
		const data = await this.get(`/stock/market/batch`, {
			symbols: tickers.toString(),
			types: "news",
			last: 15,
			language: "en",
		});

		const arr = [];

		for (const ticker in data) {
			arr.push(...data[ticker].news);
		}

		return arr;
	}

	async getHistoricalPrices(ticker, range, interval) {
		return this.get(
			`/stock/${encodeURIComponent(ticker)}/chart/${encodeURIComponent(range)}`,
			{
				chartCloseOnly: true,
				filter: "date,close",
				chartInterval: interval,
			}
		);
	}

	async getReportingDates(ticker) {
		const data = await this.get(
			`/stock/${encodeURIComponent(ticker)}/income`,
			{ last: 4 },
			{
				cacheOptions: { ttl: 86400 },
			}
		);

		return data.income ? data.income.map((result) => result.reportDate) : [];
	}
}
