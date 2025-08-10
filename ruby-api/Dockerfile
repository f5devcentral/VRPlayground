FROM ruby:3.0.2-alpine

WORKDIR /usr/src/app
COPY . .

ENV RACK_ENV production
RUN set -eux; \
    \
    gem install bundle; \
    bundle install --without development --jobs=$(nproc --all); \
    bundle clean --force

EXPOSE 4567
CMD [ "ruby", "index.rb" ]
