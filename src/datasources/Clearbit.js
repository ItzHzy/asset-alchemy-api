import { RESTDataSource } from "apollo-datasource-rest";

class ClearbitAPI extends RESTDataSource {
	constructor() {
		super();

		this.baseURL = "https://company.clearbit.com/v1";
	}

	willSendRequest(request) {
		request.headers.set(
			"Authorization",
			`Bearer ${this.context.CLEARBIT_API_KEY}`
		);
	}

	async getDomain(name) {
		const data = this.get("/domains/find", {
			name: name,
		});
		return data.domain;
	}

	async getLogo(name) {
		const data = await this.get("/domains/find", {
			name: name,
		});

		return data.logo;
	}
}

export default ClearbitAPI;
