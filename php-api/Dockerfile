FROM php:7.4-apache

RUN a2enmod rewrite

RUN set -eux; \
    \
    apt update; \
    apt install -y \
        curl \
        git \
        unzip

COPY . /var/www/html
WORKDIR /var/www/html

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN composer install

EXPOSE 80
CMD ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]