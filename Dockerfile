FROM node:lts-alpine
RUN apk update && apk add --no-cache nmap && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache \
      chromium \
      harfbuzz \
      "freetype>2.8" \
      ttf-freefont \
      nss
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
WORKDIR '/app'
COPY . .
RUN yarn install
RUN yarn build
CMD [ "yarn", "start:prod" ]