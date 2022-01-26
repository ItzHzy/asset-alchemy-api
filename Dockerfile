FROM node:14-alpine
ARG _AUTH0_DOMAIN
ARG _AUTH0_API_IDENTIFIER
ARG _IEX_API_KEY
ARG _USER_COLLECTION
ENV NODE_ENV=production
ENV PORT=8080
ENV PROJECT_ID=asset-alchemy
ENV AUTH0_DOMAIN=_AUTH0_DOMAIN
ENV AUTH0_API_IDENTIFIER=_AUTH0_API_IDENTIFIER
ENV IEX_API_KEY=_IEX_API_KEY
ENV USER_COLLECTION=_USER_COLLECTION

COPY package*.json ./
RUN npm i
COPY . ./
EXPOSE 8080
CMD [ "node", "./src/index.js" ]