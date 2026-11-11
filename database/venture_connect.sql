-- ==========================================================
-- VENTURE CONNECT - MINI PROJECT DATABASE
-- Database: `venture_connect`
-- Table: `contact_messages`
-- Tagline: From Idea to Investment
-- ==========================================================

-- Create database if it does not already exist
CREATE DATABASE IF NOT EXISTS `venture_connect` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `venture_connect`;

-- Drop table if it exists (clean re-import support)
DROP TABLE IF EXISTS `contact_messages`;

-- Create contact messages table
CREATE TABLE `contact_messages` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `subject` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample realistic enquiries demonstrating ecosystem engagement
INSERT INTO `contact_messages` (`full_name`, `email`, `subject`, `message`, `created_at`) VALUES
('Aarav Mehta', 'aarav.mehta@solargen.io', 'CleanTech Incubation Partnership Enquiry', 'Hello Venture Connect team, our early-stage solar tracking startup is seeking angel syndicate discovery and incubation opportunities. We would love to learn more about the upcoming hackathons.', NOW() - INTERVAL 2 DAY),
('Elena Rostova', 'elena.r@horizoncap.vc', 'Investor Onboarding & Startup Deal Flow', 'Hi there, representing Horizon Seed Capital. We are interested in reviewing early-stage AI and B2B SaaS pitch decks evaluated by the Venture Connect readiness criteria.', NOW() - INTERVAL 1 DAY),
('Dr. Vikram Sharma', 'vikram.sharma@techcampus.edu', 'University Entrepreneurship Cell Integration', 'Greetings, I chair the incubation center at National Institute of Technology. We wish to connect our annual student innovation challenge with the Venture Connect hackathon hub.', NOW() - INTERVAL 3 HOUR);
