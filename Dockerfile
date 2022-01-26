FROM node:14-alpine
ENV NODE_ENV production
ENV PORT 8080
ENV PROJECT_ID asset-alchemy

ARG AUTH0_DOMAIN
ARG AUTH0_API_IDENTIFIER
ARG IEX_API_KEY
ARG USER_COLLECTION

ENV AUTH0_DOMAIN $AUTH0_DOMAIN
ENV AUTH0_API_IDENTIFIER $AUTH0_API_IDENTIFIER
ENV IEX_API_KEY $IEX_API_KEY
ENV USER_COLLECTION $USER_COLLECTION

WORKDIR /app
COPY ./package*.json /app/
COPY ./ /app/
RUN ls -alR
RUN npm install --production
EXPOSE 8080
ENTRYPOINT [ "node", "./src/index.js" ] 