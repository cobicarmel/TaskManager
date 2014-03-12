-- phpMyAdmin SQL Dump
-- version 4.1.6
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Mar 12, 2014 at 09:50 PM
-- Server version: 5.6.16
-- PHP Version: 5.5.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `taskmanager`
--
CREATE DATABASE IF NOT EXISTS `taskmanager` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `taskmanager`;

-- --------------------------------------------------------

--
-- Table structure for table `action_authorized`
--

CREATE TABLE IF NOT EXISTS `action_authorized` (
  `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `subject` enum('Task','Client','Payment','Agenda') NOT NULL,
  `action` varchar(20) NOT NULL,
  `access` tinyint(2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=21 ;

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
(20, 'Agenda', 'updatespecial', 3);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `password` tinytext NOT NULL,
  `permission` tinyint(2) unsigned NOT NULL,
  `area` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `permission`, `area`) VALUES
(1, 'לייביש', 'ddc2be7ee4d75ffda75e19900df9ff8b', 2, 'lerner'),
(2, 'קובי', 'c85f975261c91b72f5fd88a8f7e61653', 1, 'main');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
