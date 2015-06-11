-- phpMyAdmin SQL Dump
-- version 4.2.11
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: 2015-06-10 10:31:39
-- 服务器版本： 5.6.21
-- PHP Version: 5.6.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `ezb`
--

-- --------------------------------------------------------

--
-- 表的结构 `bookguests`
--

CREATE TABLE IF NOT EXISTS `bookguests` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `book` int(11) NOT NULL,
  `guest` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- 转存表中的数据 `bookguests`
--

INSERT INTO `bookguests` (`id`, `book`, `guest`) VALUES
(1, 2, 3);

-- --------------------------------------------------------

--
-- 表的结构 `books`
--

CREATE TABLE IF NOT EXISTS `books` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_bin NOT NULL,
  `creator` int(11) NOT NULL,
  `author` varchar(255) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- 转存表中的数据 `books`
--

INSERT INTO `books` (`id`, `name`, `creator`, `author`) VALUES
(1, 'TestBook', 1, ''),
(2, 'Burning Books', 1, 'Matthew Fishburn'),
(3, 'Alice in wonderland', 1, ''),
(4, 'The Hundred-Year Lie', 1, 'Randall Fitzgerald');

-- --------------------------------------------------------

--
-- 表的结构 `groupmembers`
--

CREATE TABLE IF NOT EXISTS `groupmembers` (
  `group` int(11) NOT NULL,
  `member` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- 转存表中的数据 `groupmembers`
--

INSERT INTO `groupmembers` (`group`, `member`) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 1),
(2, 3);

-- --------------------------------------------------------

--
-- 表的结构 `groups`
--

CREATE TABLE IF NOT EXISTS `groups` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `creator` int(11) DEFAULT NULL,
  `manager` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- 转存表中的数据 `groups`
--

INSERT INTO `groups` (`id`, `name`, `creator`, `manager`) VALUES
(1, 'group1', 1, 2),
(2, 'group2', 1, 3);

-- --------------------------------------------------------

--
-- 表的结构 `layers`
--

CREATE TABLE IF NOT EXISTS `layers` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_bin NOT NULL,
  `project` int(11) NOT NULL,
  `book` int(11) NOT NULL,
  `parent` int(11) DEFAULT NULL,
  `zoomtype` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT '1',
  `layertype` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- 转存表中的数据 `layers`
--

INSERT INTO `layers` (`id`, `name`, `project`, `book`, `parent`, `zoomtype`, `status`, `layertype`) VALUES
(1, 'testLayer', 1, 1, NULL, 1, NULL, 1);

-- --------------------------------------------------------

--
-- 表的结构 `layertype`
--

CREATE TABLE IF NOT EXISTS `layertype` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- 转存表中的数据 `layertype`
--

INSERT INTO `layertype` (`id`, `name`) VALUES
(1, 'zoomLayer'),
(2, 'quotLayer'),
(3, 'awLayer');

-- --------------------------------------------------------

--
-- 表的结构 `marks`
--

CREATE TABLE IF NOT EXISTS `marks` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `project` int(11) NOT NULL,
  `part` varchar(255) COLLATE utf8_bin NOT NULL,
  `position` varchar(255) COLLATE utf8_bin NOT NULL,
  `book` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- 表的结构 `old_user`
--

CREATE TABLE IF NOT EXISTS `old_user` (
  `id` int(11) PRIMARY KEY  AUTO_INCREMENT,
  `lalala` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- 转存表中的数据 `old_user`
--

INSERT INTO `old_user` (`id`, `lalala`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4);

-- --------------------------------------------------------

--
-- 表的结构 `parts`
--

CREATE TABLE IF NOT EXISTS `parts` (
  `key` varchar(255) COLLATE utf8_bin PRIMARY KEY,
  `layer` int(11) NOT NULL,
  `contents` text COLLATE utf8_bin,
  `heading` int(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- 转存表中的数据 `parts`
--

INSERT INTO `parts` (`key`, `layer`, `contents`, `heading`) VALUES
('00000010.0000000-1429775101920', 1, 'Chapter1', 1),
('0000003a.aaaaaaa-1429786978293', 1, NULL, NULL),
('00000057.1c71c71-1429862981427', 1, 'Once upon a time', NULL),
('00000073.8e38e38-1429786994735', 1, NULL, NULL),
('00000078.4bda12e-1429862998210', 1, 'there was a girl', NULL),
('0000007d.097b425-1429860075842', 1, NULL, NULL),
('00000081.c71c71c-1429786994735', 1, 'Chapter2', 2),
('00030606.84bda12-1429787077909', 1, NULL, NULL),
('000509b4.587e6b6-1429863043023', 1, 'She was in France', NULL),
('00070d62.2c3f35b-1429787079001', 1, NULL, NULL);

-- --------------------------------------------------------

--
-- 表的结构 `projectguests`
--

CREATE TABLE IF NOT EXISTS `projectguests` (
  `project` int(11) NOT NULL,
  `guest` int(11) NOT NULL,
  `id` int(11) PRIMARY KEY  AUTO_INCREMENT
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- 转存表中的数据 `projectguests`
--

INSERT INTO `projectguests` (`project`, `guest`, `id`) VALUES
(1, 2, 1);

-- --------------------------------------------------------

--
-- 表的结构 `projects`
--

CREATE TABLE IF NOT EXISTS `projects` (
  `id` int(11) PRIMARY KEY  AUTO_INCREMENT,
  `name` varchar(128) COLLATE utf8_bin NOT NULL,
  `creator` int(11) NOT NULL,
  `description` varchar(500) COLLATE utf8_bin NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `creatime` date NOT NULL,
  `group` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- 转存表中的数据 `projects`
--

INSERT INTO `projects` (`id`, `name`, `creator`, `description`, `status`, `creatime`, `group`) VALUES
(1, 'Test 1 of project', 1, 'First Test', 1, '2015-05-17', 1),
(2, 'Test 2 of project', 1, 'Second Test', 2, '2015-05-18', 2);

-- --------------------------------------------------------

--
-- 表的结构 `sequences`
--

CREATE TABLE IF NOT EXISTS `sequences` (
  `id` int(11) PRIMARY KEY  AUTO_INCREMENT,
  `layer` int(11) NOT NULL,
  `contents` text COLLATE utf8_bin,
  `name` varchar(255) COLLATE utf8_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- 表的结构 `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) PRIMARY KEY  AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_bin NOT NULL,
  `password` varchar(50) COLLATE utf8_bin NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- 转存表中的数据 `users`
--

INSERT INTO `users` (`id`, `name`, `password`, `status`) VALUES
(1, 'super', 'super', 1),
(2, 'ord1', 'ord', 2),
(3, 'ord2', 'ord', 2),
(4, 'ord3', 'ord', 2);

-- --------------------------------------------------------

--
-- 表的结构 `userstatus`
--

CREATE TABLE IF NOT EXISTS `userstatus` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- 转存表中的数据 `userstatus`
--

INSERT INTO `userstatus` (`id`, `name`) VALUES
(1, 'superUser'),
(2, 'ordinaryUser');

-- --------------------------------------------------------

--
-- 表的结构 `workstatus`
--

CREATE TABLE IF NOT EXISTS `workstatus` (
  `id` int(11) PRIMARY KEY  AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- 转存表中的数据 `workstatus`
--

INSERT INTO `workstatus` (`id`, `name`) VALUES
(1, 'private'),
(2, 'public');

-- --------------------------------------------------------

--
-- 表的结构 `zoomtypes`
--

CREATE TABLE IF NOT EXISTS `zoomtypes` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(20) COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- 转存表中的数据 `zoomtypes`
--

INSERT INTO `zoomtypes` (`id`, `name`) VALUES
(1, 'paragraph'),
(2, 'chapter'),
(3, 'book'),
(4, 'user-defined');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookguests`
--
ALTER TABLE `bookguests`
 ADD KEY `book_idx` (`book`), ADD KEY `guest_idx` (`guest`);

--
-- Indexes for table `books`
--
ALTER TABLE `books`
 ADD KEY `bookCreator_idx` (`creator`);

--
-- Indexes for table `groupmembers`
--
ALTER TABLE `groupmembers`
 ADD KEY `group_id_idx` (`group`), ADD KEY `member_id_idx` (`member`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
 ADD KEY `creator_idx` (`creator`), ADD KEY `manager_idx` (`manager`);

--
-- Indexes for table `layers`
--
ALTER TABLE `layers`
 ADD KEY `parentlayer_idx` (`parent`), ADD KEY `booklayer_idx` (`book`), ADD KEY `projectlayer_idx` (`project`), ADD KEY `type_idx` (`zoomtype`), ADD KEY `layerstatus_idx` (`status`), ADD KEY `layertype_idx` (`layertype`);

--
-- Indexes for table `marks`
--
ALTER TABLE `marks`
 ADD KEY `layer_idx` (`project`), ADD KEY `part_idx` (`part`), ADD KEY `book_idx` (`book`), ADD KEY `part_idx1` (`part`,`book`);

--
-- Indexes for table `parts`
--
ALTER TABLE `parts`
 ADD KEY `layer_idx` (`layer`);

--
-- Indexes for table `projectguests`
--
ALTER TABLE `projectguests`
 ADD KEY `project_idx` (`project`), ADD KEY `guestname_idx` (`guest`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
 ADD UNIQUE KEY `name` (`name`), ADD KEY `id_idx` (`creator`), ADD KEY `projectstatus_idx` (`status`);

--
-- Indexes for table `sequences`
--
ALTER TABLE `sequences`
 ADD KEY `layer_idx` (`layer`);

--
-- 限制导出的表
--

--
-- 限制表 `bookguests`
--
ALTER TABLE `bookguests`
ADD CONSTRAINT `book` FOREIGN KEY (`book`) REFERENCES `books` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- 限制表 `books`
--
ALTER TABLE `books`
ADD CONSTRAINT `bookCreator` FOREIGN KEY (`creator`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- 限制表 `groupmembers`
--
ALTER TABLE `groupmembers`
ADD CONSTRAINT `group_id` FOREIGN KEY (`group`) REFERENCES `groups` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD CONSTRAINT `member_id` FOREIGN KEY (`member`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- 限制表 `groups`
--
ALTER TABLE `groups`
ADD CONSTRAINT `group_creator` FOREIGN KEY (`creator`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD CONSTRAINT `group_manager` FOREIGN KEY (`manager`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- 限制表 `layers`
--
ALTER TABLE `layers`
ADD CONSTRAINT `booklayer` FOREIGN KEY (`book`) REFERENCES `books` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD CONSTRAINT `layerstatus` FOREIGN KEY (`status`) REFERENCES `workstatus` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD CONSTRAINT `layertype` FOREIGN KEY (`layertype`) REFERENCES `layertype` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD CONSTRAINT `projectlayer` FOREIGN KEY (`project`) REFERENCES `projects` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD CONSTRAINT `zoomtype` FOREIGN KEY (`zoomtype`) REFERENCES `zoomtypes` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- 限制表 `marks`
--
ALTER TABLE `marks`
ADD CONSTRAINT `markbook` FOREIGN KEY (`book`) REFERENCES `books` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD CONSTRAINT `part` FOREIGN KEY (`part`) REFERENCES `parts` (`key`) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD CONSTRAINT `project` FOREIGN KEY (`project`) REFERENCES `projects` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- 限制表 `parts`
--
ALTER TABLE `parts`
ADD CONSTRAINT `layer` FOREIGN KEY (`layer`) REFERENCES `layers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- 限制表 `projectguests`
--
ALTER TABLE `projectguests`
ADD CONSTRAINT `guestname` FOREIGN KEY (`guest`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD CONSTRAINT `projectinviting` FOREIGN KEY (`project`) REFERENCES `projects` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- 限制表 `projects`
--
ALTER TABLE `projects`
ADD CONSTRAINT `creator` FOREIGN KEY (`creator`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
ADD CONSTRAINT `projectstatus` FOREIGN KEY (`status`) REFERENCES `workstatus` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- 限制表 `sequences`
--
ALTER TABLE `sequences`
ADD CONSTRAINT `seqlayer` FOREIGN KEY (`layer`) REFERENCES `layers` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
