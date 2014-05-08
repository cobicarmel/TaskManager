-- phpMyAdmin SQL Dump
-- version 4.1.12
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: May 09, 2014 at 01:56 AM
-- Server version: 5.6.16
-- PHP Version: 5.5.11

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
-- Table structure for table `action_authorized`
--

CREATE TABLE IF NOT EXISTS `action_authorized` (
  `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `subject` enum('Task','Client','Payment','Agenda','Users','sendMail','Settings','Access','Reminders','Outlook') NOT NULL,
  `action` tinytext NOT NULL,
  `title` tinyint(3) unsigned NOT NULL,
  `access` tinyint(2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=39 ;

--
-- Dumping data for table `action_authorized`
--

INSERT INTO `action_authorized` (`id`, `subject`, `action`, `title`, `access`) VALUES
(1, 'Agenda', 'getall,getspecial', 124, 4),
(2, 'Client', 'getall,search', 124, 4),
(3, 'Task', 'getday', 124, 4),
(5, 'Task', 'createtask', 49, 3),
(7, 'Client', 'newclient', 49, 3),
(8, 'Task', 'clienthistory', 126, 3),
(9, 'Payment', 'getpayments', 124, 2),
(10, 'Client', 'remove', 46, 2),
(11, 'Payment', 'addpayment', 49, 2),
(12, 'Payment', 'editpayment', 88, 2),
(13, 'Payment', 'removepayment', 46, 2),
(14, 'Client', 'edit,additem', 88, 3),
(17, 'Task', 'removetask', 46, 3),
(18, 'Task', 'edittask,changetime', 88, 3),
(19, 'Agenda', 'addspecial,updatespecial', 125, 3),
(21, 'Task', 'addtasktypes', 127, 3),
(22, 'Task', 'edittasktypes', 128, 3),
(23, 'Task', 'removetasktypes', 129, 3),
(24, 'Agenda', 'addagenda,updateagenda', 49, 3),
(27, 'Users', 'editusers', 88, 3),
(28, 'Users', 'addusers', 49, 3),
(29, 'Users', 'removeusers', 46, 2),
(30, 'sendMail', 'send', 123, 3),
(31, 'Settings', 'changesettings', 130, 2),
(32, 'Agenda', 'remove', 46, 3),
(33, 'Access', 'changeaccess', 121, 2),
(34, 'Reminders', 'editreminders', 88, 3),
(35, 'Reminders', 'addreminders', 49, 3),
(36, 'Reminders', 'removereminders', 46, 2),
(37, 'Outlook', 'importtask', 160, 2),
(38, 'Outlook', 'exporttasks', 0, 2);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `agenda`
--

INSERT INTO `agenda` (`id`, `day`, `starttime`, `endtime`, `tasktype`, `static`, `system`) VALUES
(1, '3', '15:00:00', '19:00:00', 1, 0, 0);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=20 ;

--
-- Dumping data for table `config`
--

INSERT INTO `config` (`id`, `name`, `value`) VALUES
(6, 'table_times', '["\\u05de\\u05e2\\u05e8\\u05db\\u05ea \\u05e9\\u05e2\\u05d5\\u05ea","\\u05e8\\u05d5\\u05e4\\u05d0\\u05d9\\u05dd"]'),
(7, 'ranks', '{"1":92,"2":93,"3":94,"4":95}'),
(8, 'payment_limit', '8'),
(9, 'meeting_duration', '"45"'),
(10, 'meet_cancel_mail', '"2"'),
(11, 'soon_mount', '3'),
(12, 'undefined_time', '"2"'),
(13, 'interactive_meet', '"2"'),
(14, 'mail_sender_address', '"jzaltzberg@gmail.com"'),
(15, 'mail_sender_pass', '"1712Hgec"'),
(16, 'mail_sender_name', '"\\u05e7\\u05d5\\u05d1\\u05d9"'),
(17, 'reminders_audio', '"1"'),
(18, 'remove_old_reminders', '"3"'),
(19, 'allow_desktop_notify', '"1"');

-- --------------------------------------------------------

--
-- Table structure for table `email`
--

CREATE TABLE IF NOT EXISTS `email` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email_address` text NOT NULL,
  `client_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

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
(1, 'הודעת ביטול', 'ביטול פגישה', '<div dir="rtl">\n<b>שלום %recipient%,</b>\n<p style="margin-right:10px">לצערי הפגישה שנקבעה לנו לא תוכל להתקיים במועדה. תוכל/י ליצור קשר לקביעת מועד חדש.</p>\n<div>בברכה,</div>\n<div style="margin-right:10px;font-weight:bold">\n<span>%sender_name%</span>\n</div>\n</div>');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `phone_numbers`
--

CREATE TABLE IF NOT EXISTS `phone_numbers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone_number` tinytext NOT NULL,
  `client_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Table structure for table `reminders`
--

CREATE TABLE IF NOT EXISTS `reminders` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` tinytext,
  `content` text,
  `date` datetime NOT NULL,
  `status` enum('0','1','2') NOT NULL DEFAULT '0',
  `client_id` int(10) unsigned DEFAULT NULL,
  `task_id` int(10) unsigned DEFAULT NULL,
  `user_id` tinyint(4) NOT NULL,
  `pre` varchar(8) DEFAULT NULL,
  `custom_pre` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=6 ;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `title`, `content`, `place`, `starttime`, `endtime`, `client_id`, `system`) VALUES
(2, 'ביטוח לאומי', NULL, NULL, '2014-05-07 04:00:00', '2014-05-07 04:45:00', NULL, 0),
(3, 'פריסת חממות', 'חייבים להגיע לשם דחוף\n', 'בני ברק', '2014-05-07 09:00:00', '2014-05-07 09:30:00', NULL, 0),
(4, 'ביטוח לאומי', NULL, NULL, '2014-05-09 05:00:00', '2014-05-09 05:45:00', NULL, 1),
(5, 'ביטוח לאומיהו', NULL, NULL, '2014-05-09 05:00:00', '2014-05-09 05:45:00', NULL, 0);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- Dumping data for table `tasktypes`
--

INSERT INTO `tasktypes` (`id`, `title`, `place`, `duration`) VALUES
(1, 'חיידר חכמת שלמה - חסידי', 'ירושלים', 30);

--
-- Triggers `tasktypes`
--
DROP TRIGGER IF EXISTS `agenda_clean`;
DELIMITER //
CREATE TRIGGER `agenda_clean` AFTER DELETE ON `tasktypes`
 FOR EACH ROW delete from agenda where tasktype = old.id
//
DELIMITER ;

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
  `last_logged` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `permission`, `phone`, `email`, `last_logged`) VALUES
(1, 'קובי', 'c85f975261c91b72f5fd88a8f7e61653', 1, '052-7139161', 'jzaltzberg@gmail.com', '2014-05-09 02:50:22'),
(3, 'רותי', 'c17672c95122be1262282cc9918bdca5', 4, NULL, NULL, NULL);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
