import dotenv from "dotenv";
import jwt, {
	JwtHeader,
	Secret,
	VerifyErrors,
	VerifyOptions,
} from "jsonwebtoken";
import jwksClient, { RsaSigningKey } from "jwks-rsa";
import axios from "axios";
import { GraphQLRequestContext } from "apollo-server-types";
import { AuthenticationError } from "apollo-server";

dotenv.config();

const client = jwksClient({
	jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
});

// asynchronously grab signing keys from auth0 api
function getKey(header: JwtHeader, callback: (error: any, key: any) => void) {
	client.getSigningKey(header.kid, (error, key) => {
		console.log(key);
		callback(error, key);
	});
}

const verifyOptions = {
	audience: process.env.AUTH0_API_IDENTIFIER,
	issuer: `https://${process.env.AUTH0_DOMAIN}/`,
	algorithms: ["RS256"],
};

// Plugin to validate JWTs issued by Auth0
const validateToken = {
	// called at the beginning of every request
	async requestDidStart(_: GraphQLRequestContext) {
		// grab bearer token from header
		return {
			async didResolveOperation(requestContext: GraphQLRequestContext) {
				try {
					const token = requestContext.request.http?.headers
						.get("Authorization")
						?.split(" ")[1] as string;

					const jwtHeader = JSON.parse(
						new Buffer(token.split(".")[0], "base64").toString()
					);

					const signingKey = (
						(await client.getSigningKey(jwtHeader.kid)) as any
					).rsaPublicKey;

					// verify the access token and throws an error if not valid
					jwt.verify(
						token,
						signingKey,
						verifyOptions as VerifyOptions,
						(error, decoded) => {
							console.log(decoded);

							if (error) throw new AuthenticationError(error.message);
						}
					);
				} catch (error) {
					throw error;
				}
			},
		};
	},
};

export default validateToken;
