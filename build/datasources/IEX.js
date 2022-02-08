var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { RESTDataSource } from "apollo-datasource-rest";
export default class IEXCloudAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = "https://cloud.iexapis.com/stable";
    }
    willSendRequest(request) {
        return __awaiter(this, void 0, void 0, function* () {
            request.params.set("token", this.context.IEX_API_KEY);
        });
    }
    getTickers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.get(`/search/${encodeURIComponent(query)}`, {}, {
                    cacheOptions: { ttl: 60 },
                });
                return data.map((result) => result.symbol);
            }
            catch (_a) {
                return [];
            }
        });
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
    getBasicInfo(ticker) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.get(`/stock/${encodeURIComponent(ticker)}/company`, {}, {
                cacheOptions: { ttl: 604800 },
            });
            return data;
        });
    }
    getBasicStats(ticker) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get(`/stock/${encodeURIComponent(ticker)}/stats`, {}, {
                cacheOptions: { ttl: 86400 },
            });
        });
    }
    getLogo(ticker) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.get(`/stock/${encodeURIComponent(ticker)}/logo`, {}, {
                cacheOptions: { ttl: 86400 },
            });
            return data.url;
        });
    }
    getIncomeStatement(ticker) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.get(`/stock/${encodeURIComponent(ticker)}/income`, { last: 4 }, {
                cacheOptions: { ttl: 86400 },
            });
            return data.income ? data.income : [];
        });
    }
    getQuote(ticker) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get(`/stock/${encodeURIComponent(ticker)}/quote`, {
                displayPercent: true,
            }, {
                cacheOptions: { ttl: 600 },
            });
        });
    }
    getHistoricalPrices(ticker, range, interval) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.get(`/stock/${encodeURIComponent(ticker)}/chart/${encodeURIComponent(range)}`, {
                chartCloseOnly: true,
                filter: "date,close",
                chartInterval: interval,
            });
        });
    }
    getNews(tickers, following) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.get(`/stock/market/batch`, {
                    symbols: tickers.toString(),
                    types: "news",
                    last: 15,
                    language: "en",
                });
                const arr = [];
                for (const ticker in data) {
                    arr.push(...data[ticker].news);
                }
                arr.forEach((element, index) => {
                    arr[index].related = arr[index].related
                        .split(",")
                        .filter((ticker) => following.includes(ticker))
                        .toString();
                    console.log(arr[index].related);
                });
                return arr;
            }
            catch (error) {
                console.log(error);
                return [];
            }
        });
    }
}
//# sourceMappingURL=IEX.js.map