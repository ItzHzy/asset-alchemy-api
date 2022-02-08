var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const resolvers = {
    Query: {
        searchCompanies: (parent, { query }, { dataSources, token }) => __awaiter(void 0, void 0, void 0, function* () {
            const tickers = yield dataSources.IEXCloudAPI.getTickers(query);
            const data = tickers.filter(function (ticker) {
                return !ticker.includes("-") && !ticker.match(".*\\d.*");
            });
            return data;
        }),
        getCompanyInfo: (parent, { ticker }, { token }) => __awaiter(void 0, void 0, void 0, function* () {
            return ticker;
        }),
        getNews: (parent, { ticker }, { dataSources }) => __awaiter(void 0, void 0, void 0, function* () {
            const data = yield dataSources.IEXCloudAPI.getNews([ticker]);
            return data;
        }),
        getHistoricalPrices: (parent, { ticker, range, interval }, { dataSources }) => __awaiter(void 0, void 0, void 0, function* () {
            return dataSources.IEXCloudAPI.getHistoricalPrices(ticker, range, interval);
        }),
        getFollowing: (parent, { userId }, { dataSources }) => __awaiter(void 0, void 0, void 0, function* () {
            return dataSources.UserDataSource.getFollowing(userId);
        }),
        isFollowing: (parent, { userId, ticker }, { dataSources }) => __awaiter(void 0, void 0, void 0, function* () {
            yield new Promise((resolve) => setTimeout(resolve, 50));
            return dataSources.UserDataSource.isFollowing(userId, ticker);
        }),
        getFeed: (parent, { userId }, { dataSources }) => __awaiter(void 0, void 0, void 0, function* () {
            const tickers = yield dataSources.UserDataSource.getFollowing(userId);
            return dataSources.IEXCloudAPI.getNews(tickers, tickers);
        }),
    },
    Mutation: {
        followCompany: (parent, { userId, ticker }, { dataSources }) => __awaiter(void 0, void 0, void 0, function* () {
            return dataSources.UserDataSource.followCompany(userId, ticker);
        }),
        unfollowCompany: (parent, { userId, ticker }, { dataSources }) => __awaiter(void 0, void 0, void 0, function* () {
            return dataSources.UserDataSource.unfollowCompany(userId, ticker);
        }),
    },
    Company: {
        ticker: (parent, {}, { dataSources }) => __awaiter(void 0, void 0, void 0, function* () {
            return parent;
        }),
        name: (parent, {}, { dataSources }) => __awaiter(void 0, void 0, void 0, function* () {
            return (yield dataSources.IEXCloudAPI.getBasicInfo(parent)).companyName;
        }),
        logo: (parent, {}, { dataSources }) => __awaiter(void 0, void 0, void 0, function* () {
            return yield dataSources.IEXCloudAPI.getLogo(parent);
        }),
        description: (parent, {}, { dataSources }) => __awaiter(void 0, void 0, void 0, function* () {
            return (yield dataSources.IEXCloudAPI.getBasicInfo(parent)).description;
        }),
        price: (parent, {}, { dataSources }) => __awaiter(void 0, void 0, void 0, function* () {
            return (yield dataSources.IEXCloudAPI.getQuote(parent)).latestPrice;
        }),
        dailyDelta: (parent, {}, { dataSources }) => __awaiter(void 0, void 0, void 0, function* () {
            return (yield dataSources.IEXCloudAPI.getQuote(parent)).changePercent;
        }),
        revenue: (parent, {}, { dataSources }) => __awaiter(void 0, void 0, void 0, function* () {
            return (yield dataSources.IEXCloudAPI.getIncomeStatement(parent)).map((result) => result.totalRevenue);
        }),
        netIncome: (parent, {}, { dataSources }) => __awaiter(void 0, void 0, void 0, function* () {
            return (yield dataSources.IEXCloudAPI.getIncomeStatement(parent)).map((result) => result.netIncome);
        }),
        grossProfit: (parent, {}, { dataSources }) => __awaiter(void 0, void 0, void 0, function* () {
            return (yield dataSources.IEXCloudAPI.getIncomeStatement(parent)).map((result) => result.grossProfit);
        }),
        operatingIncome: (parent, {}, { dataSources }) => __awaiter(void 0, void 0, void 0, function* () {
            return (yield dataSources.IEXCloudAPI.getIncomeStatement(parent)).map((result) => result.operatingIncome);
        }),
        peRatio: (parent, {}, { dataSources }) => __awaiter(void 0, void 0, void 0, function* () {
            return (yield dataSources.IEXCloudAPI.getBasicStats(parent)).peRatio;
        }),
        reportingDates: (parent, {}, { dataSources }) => __awaiter(void 0, void 0, void 0, function* () {
            return (yield dataSources.IEXCloudAPI.getIncomeStatement(parent)).map((result) => result.reportDate);
        }),
    },
    News: {
        datetime: (parent, {}, { dataSources }) => __awaiter(void 0, void 0, void 0, function* () {
            return parent.datetime;
        }),
        headline: (parent, {}, { dataSources }) => __awaiter(void 0, void 0, void 0, function* () {
            return parent.headline;
        }),
        related: (parent, {}, { dataSources }) => __awaiter(void 0, void 0, void 0, function* () {
            return parent.related
                .split(",")
                .filter((ticker) => !ticker.includes("-") && ticker != "");
        }),
        sourceURL: (parent, {}, { dataSources }) => __awaiter(void 0, void 0, void 0, function* () {
            return parent.url;
        }),
        summary: (parent, {}, { dataSources }) => __awaiter(void 0, void 0, void 0, function* () {
            return parent.summary;
        }),
    },
};
export default resolvers;
//# sourceMappingURL=resolvers.js.map