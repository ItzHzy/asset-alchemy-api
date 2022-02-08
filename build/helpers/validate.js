var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
dotenv.config();
const client = jwksClient({
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
});
function getKey(header, callback) {
    client.getSigningKey(header.kid, (error, key) => {
        callback(error, key);
    });
}
function isTokenValid(token) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!token)
            return false;
        const bearerToken = token.split(" ").toString();
        const result = new Promise((resolve, reject) => {
            jwt.verify(bearerToken[1], getKey, {
                audience: process.env.AUTH0_API_IDENTIFIER,
                issuer: `https://${process.env.AUTH0_DOMAIN}/`,
                algorithms: ["RS256"],
            }, (error, decoded) => {
                if (error) {
                    resolve(false);
                }
                if (decoded) {
                    resolve(true);
                }
            });
        });
        return result;
    });
}
export default isTokenValid;
//# sourceMappingURL=validate.js.map