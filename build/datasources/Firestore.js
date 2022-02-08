var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FirestoreDataSource } from "apollo-datasource-firestore";
import { Firestore, FieldValue, } from "@google-cloud/firestore";
import dotenv from "dotenv";
dotenv.config();
const firestore = new Firestore({
    projectId: process.env.PROJECT_ID,
});
export const usersCollection = firestore.collection(process.env.USER_COLLECTION);
export class UserDataSource extends FirestoreDataSource {
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOneById(userId);
        });
    }
    getFollowing(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.findOneById(userId);
            return data ? data.following : [];
        });
    }
    isFollowing(userId, ticker) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.findOneById(userId, {
                ttl: 0,
            });
            return data ? data.following.includes(ticker) : false;
        });
    }
    getPlanType(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.findOneById(userId);
            return data ? data.planType : ["Not a user"];
        });
    }
    getSettings(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.findOneById(userId);
            return data ? data.settings : ["Not a user"];
        });
    }
    getTags(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.findOneById(userId);
            return data ? data.tags : ["Not a user"];
        });
    }
    hasTag(userId, tag) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.findOneById(userId);
            return data ? data.tags.includes(tag) : false;
        });
    }
    addTag(userId, tag) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.getTags(userId);
            data.push(tag);
            this.updateOnePartial(userId, { tags: data });
        });
    }
    followCompany(userId, ticker) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateOnePartial(userId, {
                following: FieldValue.arrayUnion(ticker),
            });
            return true;
        });
    }
    unfollowCompany(userId, ticker) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.updateOnePartial(userId, {
                following: FieldValue.arrayRemove(ticker),
            });
            return true;
        });
    }
}
//# sourceMappingURL=Firestore.js.map