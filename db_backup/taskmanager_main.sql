-- phpMyAdmin SQL Dump
-- version 4.1.6
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Mar 16, 2014 at 08:23 AM
-- Server version: 5.6.16
-- PHP Version: 5.5.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `taskmanager_main`
--

-- --------------------------------------------------------

--
-- Table structure for table `agenda`
--

CREATE TABLE IF NOT EXISTS `agenda` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `day` enum('0','1','2','3','4','5','6') NOT NULL,
  `starttime` time NOT NULL,
  `endtime` time NOT NULL,
  `tasktype` tinyint(2) NOT NULL,
  `static` tinyint(1) NOT NULL,
  `system` tinyint(1) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `agenda`
--

INSERT INTO `agenda` (`id`, `day`, `starttime`, `endtime`, `tasktype`, `static`, `system`) VALUES
(1, '3', '17:00:00', '23:00:00', 1, 0, 0),
(2, '4', '13:00:00', '15:00:00', 2, 0, 0),
(3, '5', '00:00:00', '02:30:00', 3, 1, 0),
(4, '0', '04:00:00', '08:00:00', 2, 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE IF NOT EXISTS `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` tinytext NOT NULL,
  `last_name` tinytext,
  `mid` varchar(10) DEFAULT NULL,
  `address` tinytext,
  `city` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=11 ;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `first_name`, `last_name`, `mid`, `address`, `city`) VALUES
(5, 'טליה', 'גפן', '24922106', NULL, NULL),
(6, 'קובי', 'זלצברג', NULL, NULL, NULL),
(7, 'יוסף', 'עמרמי', NULL, NULL, NULL),
(8, 'לאה', 'ווסר', NULL, NULL, NULL),
(9, 'שמואל', 'דודבני', NULL, NULL, NULL),
(10, 'דינה', 'בת-יעקב', NULL, NULL, NULL);

--
-- Triggers `clients`
--
DROP TRIGGER IF EXISTS `cleaner`;
DELIMITER //
CREATE TRIGGER `cleaner` AFTER DELETE ON `clients`
 FOR EACH ROW delete p, pa from `email` p, `phone_numbers` pa where p.client_id = old.id and pa.client_id = old.id
//
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `config`
--

CREATE TABLE IF NOT EXISTS `config` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `value` tinytext NOT NULL,
  PRIMARY KEY (`id`),
  KEY `name` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `config`
--

INSERT INTO `config` (`id`, `name`, `value`) VALUES
(1, 'payment_limit', '7'),
(2, 'meeting_duration', '30'),
(3, 'soon_mount', '3'),
(4, 'meet_cancel_mail', 'ask'),
(5, 'table_times', '["\\u05de\\u05e2\\u05e8\\u05db\\u05ea \\u05e9\\u05e2\\u05d5\\u05ea","\\u05e8\\u05d5\\u05e4\\u05d0\\u05d9\\u05dd"]');

-- --------------------------------------------------------

--
-- Table structure for table `email`
--

CREATE TABLE IF NOT EXISTS `email` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email_address` text NOT NULL,
  `client_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=11 ;

--
-- Dumping data for table `email`
--

INSERT INTO `email` (`id`, `email_address`, `client_id`) VALUES
(7, 'talia7@tal.biz', 5),
(8, 'cobicarmel2@gmail.com', 6),
(9, 'mail4leale@gmail.com', 8),
(10, 'mor@more.m', 7);

-- --------------------------------------------------------

--
-- Table structure for table `mail_messages`
--

CREATE TABLE IF NOT EXISTS `mail_messages` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `title` tinytext NOT NULL,
  `subject` tinytext NOT NULL,
  `message` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `mail_messages`
--

INSERT INTO `mail_messages` (`id`, `title`, `subject`, `message`) VALUES
(1, 'ביטול פגישה', 'ביטול פגישה', '<div dir="rtl"> <b>שלום %recipient%,</b> <p style="margin-right: 10px"> לצערי הפגישה שנקבעה לנו לא תוכל להתקיים במועדה. תוכל/י ליצור קשר לקביעת מועד חדש. </p> <div>בברכה,</div> <div style="margin-right: 10px; font-weight: bold"> %company_name% </div> </div>');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE IF NOT EXISTS `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sum` decimal(7,2) NOT NULL,
  `title` tinytext,
  `date` date NOT NULL,
  `client` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=13 ;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `sum`, `title`, `date`, `client`) VALUES
(1, '155.00', 'asdf', '2014-03-14', 5),
(2, '22.50', 'קניית רוגלך', '2014-03-13', 5),
(3, '12.50', 'שלגון', '2014-03-12', 5),
(4, '50.00', 'טיול בהרי ירושלים', '2014-03-11', 5),
(5, '250.00', 'הלוואה', '2014-03-14', 6),
(7, '-1.00', 'מינוס', '2014-03-31', 5),
(8, '500.00', NULL, '2014-03-18', 5),
(9, '-15.30', NULL, '2014-03-15', 5),
(10, '150.00', NULL, '2014-03-15', 5),
(11, '120.00', NULL, '2014-03-16', 5),
(12, '12.00', 'jkc', '2014-03-16', 7);

-- --------------------------------------------------------

--
-- Table structure for table `phone_numbers`
--

CREATE TABLE IF NOT EXISTS `phone_numbers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone_number` tinytext NOT NULL,
  `client_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=15 ;

--
-- Dumping data for table `phone_numbers`
--

INSERT INTO `phone_numbers` (`id`, `phone_number`, `client_id`) VALUES
(12, '050-4152235', 5),
(13, '052-7139161', 6),
(14, '050-4711152', 5);

-- --------------------------------------------------------

--
-- Table structure for table `special`
--

CREATE TABLE IF NOT EXISTS `special` (
  `starttime` time NOT NULL,
  `endtime` time NOT NULL,
  `date` date NOT NULL,
  `original` tinyint(4) NOT NULL,
  `system` tinyint(1) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `special`
--

INSERT INTO `special` (`starttime`, `endtime`, `date`, `original`, `system`) VALUES
('12:00:00', '14:00:00', '2014-03-13', 2, 0),
('00:00:00', '02:30:00', '2014-03-14', 3, 0),
('04:00:00', '08:00:00', '2014-03-16', 4, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE IF NOT EXISTS `tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` tinytext,
  `content` text,
  `place` tinytext,
  `starttime` datetime NOT NULL,
  `endtime` datetime NOT NULL,
  `client_id` int(10) unsigned DEFAULT NULL,
  `system` tinyint(1) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=39 ;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `title`, `content`, `place`, `starttime`, `endtime`, `client_id`, `system`) VALUES
(1, 'total boring', NULL, NULL, '2014-03-14 20:15:00', '2014-03-14 20:45:00', 1, 0),
(18, 'פגישה 1', NULL, NULL, '2014-03-15 21:00:00', '2014-03-15 21:30:00', 5, 0),
(19, 'פגישה אצל הרופא', NULL, NULL, '2014-03-14 03:10:00', '2014-03-14 03:40:00', 5, 0),
(21, 'פגישה 1', NULL, NULL, '2014-03-14 06:10:00', '2014-03-14 06:40:00', 5, 0),
(22, 'פגישה 1', NULL, NULL, '2014-03-14 04:10:00', '2014-03-14 04:40:00', 5, 0),
(23, 'קבלת קהל', NULL, NULL, '2014-03-14 00:00:00', '2014-03-14 00:30:00', NULL, 0),
(29, 'פגישה אצל הרופא', NULL, NULL, '2014-03-13 20:00:00', '2014-03-13 20:35:00', 6, 0),
(31, 'איסוף כספים', NULL, NULL, '2014-03-16 16:35:00', '2014-03-16 17:05:00', 5, 0),
(35, 'פגישה אצל הרופא', NULL, NULL, '2014-03-16 04:10:00', '2014-03-16 04:40:00', 7, 0),
(38, 'פגישה אצל הרופא', NULL, NULL, '2014-03-16 07:30:00', '2014-03-16 08:00:00', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tasktypes`
--

CREATE TABLE IF NOT EXISTS `tasktypes` (
  `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `title` tinytext NOT NULL,
  `place` tinytext NOT NULL,
  `duration` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `tasktypes`
--

INSERT INTO `tasktypes` (`id`, `title`, `place`, `duration`) VALUES
(1, 'קבלת קהל', 'לב שומע', 40),
(2, 'נסיעה לצפת', 'צפת', 50),
(3, 'מיכאל וייס', 'מיכאל וייס', 150);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
