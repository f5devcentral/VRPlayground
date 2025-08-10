FROM node:21.6-alpine as build

WORKDIR /usr/src/app

COPY package*.json .

RUN set -eux; \
    \
    npm install

COPY . .

RUN set -eux; \
    \
    npm run build


FROM nginx:1.27-alpine

COPY --from=build /usr/src/app/dist/ /usr/share/nginx/html/
COPY conf.d /etc/nginx/conf.d
