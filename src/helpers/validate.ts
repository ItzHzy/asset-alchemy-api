import dotenv from "dotenv";
import jwt, { JwtHeader, Secret, SigningKeyCallback } from "jsonwebtoken";
import jwksClient from "jwks-rsa";

dotenv.config();

const client = jwksClient({
	jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
});

function getKey(header: JwtHeader, callback: (error: any, key: any) => void) {
	client.getSigningKey(header.kid, (error, key) => {
		callback(error, key);
	});
}

async function isTokenValid(token?: string): Promise<boolean> {
	if (!token) return false;

	const bearerToken = token.split(" ").toString();

	const result = new Promise<boolean>((resolve, reject) => {
		jwt.verify(
			bearerToken[1],
			getKey,
			{
				audience: process.env.AUTH0_API_IDENTIFIER,
				issuer: `https://${process.env.AUTH0_DOMAIN}/`,
				algorithms: ["RS256"],
			},
			(error, decoded) => {
				if (error) {
					resolve(false);
				}
				if (decoded) {
					resolve(true);
				}
			}
		);
	});

	return result;
}

export default isTokenValid;
