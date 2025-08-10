FROM node:21.6-alpine

WORKDIR /usr/src/app
COPY . .

RUN set -eux; \
    \
    npm install -g pm2; \
    npm install

EXPOSE 3000
CMD [ "npm", "start" ]
