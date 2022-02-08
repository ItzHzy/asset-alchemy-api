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
class ClearbitAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = "https://company.clearbit.com/v1";
    }
    willSendRequest(request) {
        request.headers.set("Authorization", `Bearer ${this.context.CLEARBIT_API_KEY}`);
    }
    getLogo(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.get("/domains/find", {
                name: name,
            });
            return data.logo;
        });
    }
}
export default ClearbitAPI;
//# sourceMappingURL=Clearbit.js.map