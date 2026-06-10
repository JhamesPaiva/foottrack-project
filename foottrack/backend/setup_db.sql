-- Run this script in MySQL before starting the app
CREATE DATABASE IF NOT EXISTS foottrack CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'foottrack_user'@'localhost' IDENTIFIED BY 'foottrack_pass';
GRANT ALL PRIVILEGES ON foottrack.* TO 'foottrack_user'@'localhost';
FLUSH PRIVILEGES;
