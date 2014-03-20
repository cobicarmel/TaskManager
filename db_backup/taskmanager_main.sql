-- phpMyAdmin SQL Dump
-- version 4.1.6
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Mar 19, 2014 at 11:06 PM
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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=21 ;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=14 ;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=45 ;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
