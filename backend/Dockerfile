FROM php:8.3-apache

# Install required system packages and PHP SQLite extensions
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    sqlite3 \
    libsqlite3-dev \
    && docker-php-ext-install pdo pdo_sqlite mbstring bcmath opcache zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Configure Apache VirtualHost
COPY docker/vhost.conf /etc/apache2/sites-available/000-default.conf

# Install Composer from official image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . /var/www/html

# Remove Windows CRLF line endings from entrypoint script and make executable
RUN sed -i -e 's/\r$//' /var/www/html/docker-entrypoint.sh \
    && chmod +x /var/www/html/docker-entrypoint.sh \
    && cp /var/www/html/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

# Install Composer production dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Set directory permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Expose default port (overridden at runtime by Render $PORT)
EXPOSE 80

ENTRYPOINT ["docker-entrypoint.sh"]
