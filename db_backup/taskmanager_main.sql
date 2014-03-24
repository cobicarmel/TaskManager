-- phpMyAdmin SQL Dump
-- version 4.1.6
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Mar 24, 2014 at 07:41 PM
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
CREATE DATABASE IF NOT EXISTS `taskmanager_main` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `taskmanager_main`;

-- --------------------------------------------------------

--
-- Table structure for table `action_authorized`
--

CREATE TABLE IF NOT EXISTS `action_authorized` (
  `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `subject` enum('Task','Client','Payment','Agenda','Users') NOT NULL,
  `action` varchar(20) NOT NULL,
  `access` tinyint(2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

--
-- Dumping data for table `action_authorized`
--

INSERT INTO `action_authorized` (`id`, `subject`, `action`, `access`) VALUES
(1, 'Agenda', 'getall', 3),
(2, 'Client', 'getall', 3),
(3, 'Task', 'getday', 3),
(4, 'Agenda', 'getspecial', 3),
(5, 'Task', 'createtask', 3),
(6, 'Task', 'changetime', 3),
(7, 'Client', 'newclient', 3),
(8, 'Task', 'clienthistory', 3),
(9, 'Payment', 'getpayments', 3),
(10, 'Client', 'remove', 3),
(11, 'Payment', 'addpayment', 3),
(12, 'Payment', 'editpayment', 3),
(13, 'Payment', 'removepayment', 3),
(14, 'Client', 'edit', 3),
(15, 'Client', 'additem', 3),
(16, 'Client', 'search', 3),
(17, 'Task', 'removetask', 3),
(18, 'Task', 'edittask', 3),
(19, 'Agenda', 'addspecial', 3),
(20, 'Agenda', 'updatespecial', 3),
(21, 'Task', 'addtasktypes', 3),
(22, 'Task', 'edittasktypes', 3),
(23, 'Task', 'removetasktypes', 3),
(24, 'Agenda', 'addagenda', 3),
(25, 'Agenda', 'updateagenda', 3),
(26, 'Agenda', 'remove', 3),
(27, 'Users', 'editusers', 2),
(28, 'Users', 'addusers', 2),
(29, 'Users', 'removeusers', 2);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

--
-- Dumping data for table `agenda`
--

INSERT INTO `agenda` (`id`, `day`, `starttime`, `endtime`, `tasktype`, `static`, `system`) VALUES
(21, '0', '10:45:00', '13:00:00', 6, 0, 0),
(22, '5', '11:30:00', '14:40:00', 8, 1, 0);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `first_name`, `last_name`, `mid`, `address`, `city`) VALUES
(1, 'טליה', 'אביגד', NULL, NULL, NULL);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

--
-- Dumping data for table `config`
--

INSERT INTO `config` (`id`, `name`, `value`) VALUES
(6, 'table_times', '["\\u05de\\u05e2\\u05e8\\u05db\\u05ea \\u05e9\\u05e2\\u05d5\\u05ea","\\u05e8\\u05d5\\u05e4\\u05d0\\u05d9\\u05dd"]'),
(7, 'ranks', '{"1":92,"2":93,"3":94,"4":95}'),
(8, 'payment_limit', '8'),
(9, 'meeting_duration', '40');

-- --------------------------------------------------------

--
-- Table structure for table `email`
--

CREATE TABLE IF NOT EXISTS `email` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email_address` text NOT NULL,
  `client_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `sum`, `title`, `date`, `client`) VALUES
(1, '12.00', 'גלידה', '2014-03-23', 1);

-- --------------------------------------------------------

--
-- Table structure for table `phone_numbers`
--

CREATE TABLE IF NOT EXISTS `phone_numbers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone_number` tinytext NOT NULL,
  `client_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

--
-- Dumping data for table `phone_numbers`
--

INSERT INTO `phone_numbers` (`id`, `phone_number`, `client_id`) VALUES
(1, '050-4122135', 1);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `title`, `content`, `place`, `starttime`, `endtime`, `client_id`, `system`) VALUES
(1, ' ירושלים', 'ארוחת חצות', ' ירושלים', '2014-03-23 12:00:00', '2014-03-23 12:45:00', 1, 0),
(2, 'הייטק', NULL, 'יהודה הלוי 10, בני ברק', '2014-03-25 17:00:00', '2014-03-25 17:40:00', NULL, 0);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tasktypes`
--

INSERT INTO `tasktypes` (`id`, `title`, `place`, `duration`) VALUES
(6, 'קבלת קהל - ירושלים', 'לב שומע - ירושלים', 45),
(7, 'קבלת קהל - בני ברק', 'לב שומע - בני ברק', 45),
(8, 'פרופסור ויצמן', 'מגדלי ויצמן', 120);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `username` tinytext NOT NULL,
  `password` tinytext NOT NULL,
  `permission` tinyint(1) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` tinytext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `permission`, `phone`, `email`) VALUES
(1, 'לייבל', 'c17672c95122be1262282cc9918bdca5', 2, '050-23464867', 'tamaryaalom7@gmail.com'),
(2, 'קובי', 'c85f975261c91b72f5fd88a8f7e61653', 1, '052-7139161', ''),
(3, 'ללוש', 'b736f6b24b377554f9b8539001e1b615', 3, NULL, NULL);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
