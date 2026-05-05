CREATE DATABASE IF NOT EXISTS tipi_cms
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'tipi_user'@'localhost' IDENTIFIED BY 'tipi_password';
GRANT ALL PRIVILEGES ON tipi_cms.* TO 'tipi_user'@'localhost';
FLUSH PRIVILEGES;
