import { RESTDataSource } from "apollo-datasource-rest";

export default class IEXCloudAPI extends RESTDataSource {
	constructor() {
		super();
		this.baseURL = "https://cloud.iexapis.com/stable";
	}

	async willSendRequest(request) {
		request.params.set("token", this.context.IEX_API_KEY);
	}

	async getTickers(query) {
		try {
			const data = await this.get(
				`/search/${encodeURIComponent(query)}`,
				null,
				{
					cacheOptions: { ttl: 60 },
				}
			);
			return data.map((result) => result.symbol);
		} catch {
			return [];
		}
	}

	// 	return data
	// 		.replace(" Corporation", "")
	// 		.replace(" Inc.", "")
	// 		.replace(" Corp.", "")
	// 		.replace(" Ltd.", "")
	// 		.replace(" Corp", "")
	// 		.replace(" Inc", "")
	// 		.replace(" plc", "")
	// 		.replace(" Plc", "")
	// 		.replace(" Ltd", "");
	// }

	async getBasicInfo(ticker) {
		const data = await this.get(
			`/stock/${encodeURIComponent(ticker)}/company`,
			null,
			{
				cacheOptions: { ttl: 604800 },
			}
		);

		return data;
	}

	async getBasicStats(ticker) {
		return this.get(`/stock/${encodeURIComponent(ticker)}/stats`, null, {
			cacheOptions: { ttl: 86400 },
		});
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

	async getIncomeStatement(ticker) {
		const data = await this.get(
			`/stock/${encodeURIComponent(ticker)}/income`,
			{ last: 4 },
			{
				cacheOptions: { ttl: 86400 },
			}
		);
		return data.income ? data.income : [];
	}

	async getQuote(ticker) {
		return this.get(`/stock/${encodeURIComponent(ticker)}/quote`, null, {
			cacheOptions: { ttl: 0 },
		});
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

	async getNews(tickers) {
		try {
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
		} catch {
			return [];
		}
	}
}
