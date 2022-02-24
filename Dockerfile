FROM node:14-alpine
ENV NODE_ENV production
ENV PORT 8080
ENV PROJECT_ID asset-alchemy
ENV AUTH0_DOMAIN asset-alchemy.us.auth0.com
ENV AUTH0_API_IDENTIFIER https://api.assetalchemy.io

WORKDIR /app
COPY ./package*.json /app/
COPY ./ /app/
RUN npm install --production
RUN npx tsc
EXPOSE 8080
ENTRYPOINT ["node", "./build/index.js" ] 