#!/bin/bash
set -e

# Update Apache port listening dynamically based on Render's $PORT env var
PORT="${PORT:-80}"
sed -i "s/Listen 80/Listen ${PORT}/g" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:80>/<VirtualHost \*:${PORT}>/g" /etc/apache2/sites-available/000-default.conf

# Ensure SQLite database directory & file exist
mkdir -p /var/www/html/database
if [ ! -f /var/www/html/database/database.sqlite ]; then
    touch /var/www/html/database/database.sqlite
fi

# Ensure correct permissions on storage, cache, and database
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache /var/www/html/database

# Run migrations and seed data
echo "Running migrations and seeders..."
php artisan migrate --force
php artisan db:seed --force

# Cache routes and configuration for production performance
echo "Caching Laravel configuration and routes..."
php artisan config:cache || true
php artisan route:cache || true

# Start Apache in the foreground
echo "Starting Apache on port ${PORT}..."
exec apache2-foreground
