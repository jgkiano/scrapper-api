FROM node:alpine
RUN apk add --no-cache bash
RUN apk add --no-cache ca-certificates
WORKDIR '/app'
COPY . .
RUN yarn install
RUN yarn build
CMD [ "yarn", "start:prod" ]