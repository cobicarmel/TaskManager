SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;


CREATE TABLE IF NOT EXISTS `action_authorized` (
  `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `subject` enum('Task','Client','Payment','Agenda','Users','sendMail','Settings','Access','Reminders') NOT NULL,
  `action` tinytext NOT NULL,
  `title` tinyint(3) unsigned NOT NULL,
  `access` tinyint(2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=37 ;

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
(36, 'Reminders', 'removereminders', 46, 2);

CREATE TABLE IF NOT EXISTS `agenda` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `day` enum('0','1','2','3','4','5','6') NOT NULL,
  `starttime` time NOT NULL,
  `endtime` time NOT NULL,
  `tasktype` tinyint(2) NOT NULL,
  `static` tinyint(1) NOT NULL,
  `system` tinyint(1) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=30 ;

INSERT INTO `agenda` (`id`, `day`, `starttime`, `endtime`, `tasktype`, `static`, `system`) VALUES
(21, '0', '10:45:00', '13:00:00', 6, 0, 0),
(26, '1', '17:15:00', '18:00:00', 14, 0, 0),
(28, '2', '14:00:00', '20:00:00', 7, 0, 0),
(29, '1', '17:15:00', '20:30:00', 14, 0, 1);

CREATE TABLE IF NOT EXISTS `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` tinytext NOT NULL,
  `last_name` tinytext,
  `mid` varchar(10) DEFAULT NULL,
  `address` tinytext,
  `city` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

INSERT INTO `clients` (`id`, `first_name`, `last_name`, `mid`, `address`, `city`) VALUES
(1, 'טליה', 'אביגד', NULL, NULL, NULL),
(2, 'מוטי', 'גן עדן', NULL, 'הנרקיסים 7', 'צאלים'),
(3, 'יעקב', 'זלצברג', '308533322', 'סולם יעקב 4/49', 'ירושלים');
DROP TRIGGER IF EXISTS `cleaner`;
DELIMITER //
CREATE TRIGGER `cleaner` AFTER DELETE ON `clients`
 FOR EACH ROW delete p, pa from `email` p, `phone_numbers` pa where p.client_id = old.id and pa.client_id = old.id
//
DELIMITER ;

CREATE TABLE IF NOT EXISTS `config` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `value` tinytext NOT NULL,
  PRIMARY KEY (`id`),
  KEY `name` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=19 ;

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
(16, 'mail_sender_name', '"TaskManager"'),
(17, 'reminders_audio', '"1"'),
(18, 'remove_old_reminders', '"3"');

CREATE TABLE IF NOT EXISTS `email` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email_address` text NOT NULL,
  `client_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

INSERT INTO `email` (`id`, `email_address`, `client_id`) VALUES
(1, 'cobicarmel2@gmail.com', 1),
(2, 'moty555@walla.co.il', 2),
(3, 'jzaltzberg@gmail.com', 3);

CREATE TABLE IF NOT EXISTS `mail_messages` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `title` tinytext NOT NULL,
  `subject` tinytext NOT NULL,
  `message` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

INSERT INTO `mail_messages` (`id`, `title`, `subject`, `message`) VALUES
(1, 'הודעת ביטול', 'ביטול פגישה', '<div dir="rtl">\n<b>שלום %recipient%,</b>\n<p style="margin-right:10px">לצערי הפגישה שנקבעה לנו לא תוכל להתקיים במועדה. תוכל/י ליצור קשר לקביעת מועד חדש.</p>\n<div>בברכה,</div>\n<div style="margin-right:10px;font-weight:bold">\n<span>%company_name%</span>\n</div>\n</div>');

CREATE TABLE IF NOT EXISTS `payments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sum` decimal(7,2) NOT NULL,
  `title` tinytext,
  `date` date NOT NULL,
  `client` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

INSERT INTO `payments` (`id`, `sum`, `title`, `date`, `client`) VALUES
(1, '12.00', 'גלידה', '2014-03-23', 1),
(2, '40.00', 'sdf', '2014-03-25', 3);

CREATE TABLE IF NOT EXISTS `phone_numbers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone_number` tinytext NOT NULL,
  `client_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

INSERT INTO `phone_numbers` (`id`, `phone_number`, `client_id`) VALUES
(1, '050-4122135', 1),
(2, '052-4185235', 1),
(3, '050-0522214', 2),
(4, '052-7139161', 3);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=10 ;

CREATE TABLE IF NOT EXISTS `special` (
  `starttime` time NOT NULL,
  `endtime` time NOT NULL,
  `date` date NOT NULL,
  `original` tinyint(4) NOT NULL,
  `system` tinyint(1) unsigned NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `special` (`starttime`, `endtime`, `date`, `original`, `system`) VALUES
('14:00:00', '20:35:00', '2014-03-25', 28, 0);

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
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=23 ;

INSERT INTO `tasks` (`id`, `title`, `content`, `place`, `starttime`, `endtime`, `client_id`, `system`) VALUES
(2, 'הייטק', NULL, 'יהודה הלוי 10, בני ברק', '2014-03-25 17:00:00', '2014-03-25 17:40:00', 3, 0),
(13, 'ביטוח לאומי', NULL, NULL, '2014-03-24 23:00:00', '2014-03-24 23:40:00', 1, 0),
(16, ' בני ברק', NULL, ' בני ברק', '2014-03-25 18:10:00', '2014-03-25 18:55:00', 1, 0),
(17, 'פרופ'' וייצמן', NULL, 'רח'' וייצמן 14 קומה 15 חדר 15', '2014-03-24 17:20:00', '2014-03-24 18:05:00', 2, 1),
(18, 'ביטוח לאומי', NULL, NULL, '2014-03-28 06:00:00', '2014-03-28 06:45:00', NULL, 0),
(19, ' בני ברק', NULL, ' בני ברק', '2014-04-01 15:00:00', '2014-04-01 15:45:00', NULL, 0),
(20, 'פגישה', NULL, NULL, '2014-04-05 02:05:00', '2014-04-05 02:50:00', NULL, 0),
(22, 'קבלת קהל', NULL, NULL, '2014-04-05 23:20:00', '2014-04-06 00:05:00', NULL, 0);

CREATE TABLE IF NOT EXISTS `tasktypes` (
  `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `title` tinytext NOT NULL,
  `place` tinytext NOT NULL,
  `duration` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=16 ;

INSERT INTO `tasktypes` (`id`, `title`, `place`, `duration`) VALUES
(6, 'קבלת קהל - ירושלים', 'לב שומע - ירושלים', 45),
(7, 'קבלת קהל - בני ברק', 'לב שומע - בני ברק', 45),
(14, 'פרופ'' וייצמן', 'רח'' וייצמן 14 קומה 15 חדר 15', 45),
(15, ' חיידר חכמת שלמה חסידי', 'רבינו גרשום 14', 210);
DROP TRIGGER IF EXISTS `agenda_clean`;
DELIMITER //
CREATE TRIGGER `agenda_clean` AFTER DELETE ON `tasktypes`
 FOR EACH ROW delete from agenda where tasktype = old.id
//
DELIMITER ;

CREATE TABLE IF NOT EXISTS `users` (
  `id` tinyint(4) NOT NULL AUTO_INCREMENT,
  `username` tinytext NOT NULL,
  `password` tinytext NOT NULL,
  `permission` tinyint(1) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` tinytext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

INSERT INTO `users` (`id`, `username`, `password`, `permission`, `phone`, `email`) VALUES
(1, 'לייבל', 'c17672c95122be1262282cc9918bdca5', 3, '050-23464867', 'tamaryaalom7@gmail.com'),
(2, 'קובי', 'c85f975261c91b72f5fd88a8f7e61653', 1, '052-7139161', ''),
(3, 'רותי', 'c17672c95122be1262282cc9918bdca5', 4, NULL, NULL);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
