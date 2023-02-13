/*
SQLyog Community v13.1.9 (64 bit)
MySQL - 8.0.31 : Database - njp_banka
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`njp_banka` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `njp_banka`;

/*Table structure for table `accounts` */

DROP TABLE IF EXISTS `accounts`;

CREATE TABLE `accounts` (
  `iban` char(21) NOT NULL,
  `balance` decimal(15,2) NOT NULL DEFAULT '0.00',
  `userId` int NOT NULL,
  `currency` char(3) NOT NULL,
  PRIMARY KEY (`iban`),
  KEY `userId` (`userId`),
  CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `accounts` */

insert  into `accounts`(`iban`,`balance`,`userId`,`currency`) values 
('HR3017261426517314048',680.47,1,'GBP'),
('HR3381368319727909239',970.00,2,'EUR'),
('HR3806722546708913705',429.09,3,'EUR'),
('HR6373777942065251327',504.66,1,'EUR'),
('HR7538564908781665941',188.71,3,'USD'),
('HR8339255634119421791',100.00,2,'USD');

/*Table structure for table `receivetransactions` */

DROP TABLE IF EXISTS `receivetransactions`;

CREATE TABLE `receivetransactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `amount` decimal(15,2) NOT NULL,
  `iban` char(21) NOT NULL,
  `senderIban` char(21) DEFAULT NULL,
  `time_stamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `iban` (`iban`),
  KEY `senderIban` (`senderIban`),
  CONSTRAINT `receivetransactions_ibfk_1` FOREIGN KEY (`iban`) REFERENCES `accounts` (`iban`),
  CONSTRAINT `receivetransactions_ibfk_2` FOREIGN KEY (`senderIban`) REFERENCES `accounts` (`iban`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `receivetransactions` */

insert  into `receivetransactions`(`id`,`amount`,`iban`,`senderIban`,`time_stamp`) values 
(1,2000.00,'HR3381368319727909239',NULL,'2023-02-07 19:39:04'),
(2,0.00,'HR6373777942065251327','HR3381368319727909239','2023-02-07 21:15:59'),
(3,500.00,'HR6373777942065251327','HR3381368319727909239','2023-02-07 21:16:09'),
(4,10.76,'HR8339255634119421791','HR6373777942065251327','2023-02-07 21:16:45'),
(5,107.60,'HR8339255634119421791','HR6373777942065251327','2023-02-07 21:16:57'),
(6,300.00,'HR6373777942065251327',NULL,'2023-02-07 21:17:21'),
(7,17.01,'HR6373777942065251327','HR8339255634119421791','2023-02-07 21:17:45'),
(9,142.73,'HR3017261426517314048','HR6373777942065251327','2023-02-08 16:15:11'),
(12,200.00,'HR3017261426517314048',NULL,'2023-02-08 16:15:32'),
(13,167.65,'HR6373777942065251327','HR3017261426517314048','2023-02-08 16:15:42'),
(14,800.00,'HR3806722546708913705',NULL,'2023-02-13 15:45:34'),
(15,85.00,'HR7538564908781665941',NULL,'2023-02-13 15:45:44'),
(16,153.71,'HR7538564908781665941','HR3806722546708913705','2023-02-13 15:46:04'),
(17,160.00,'HR3806722546708913705','HR6373777942065251327','2023-02-13 15:46:26'),
(18,3.09,'HR3806722546708913705','HR3017261426517314048','2023-02-13 15:46:38'),
(19,352.86,'HR3017261426517314048','HR3381368319727909239','2023-02-13 15:46:59'),
(21,167.61,'HR3017261426517314048','HR3806722546708913705','2023-02-13 15:47:41');

/*Table structure for table `sendtransactions` */

DROP TABLE IF EXISTS `sendtransactions`;

CREATE TABLE `sendtransactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `amount` decimal(15,2) NOT NULL,
  `iban` char(21) NOT NULL,
  `receiverIban` char(21) DEFAULT NULL,
  `receivingCurrency` char(3) NOT NULL,
  `exchangeRate` double DEFAULT '1',
  `time_stamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `iban` (`iban`),
  KEY `receiverIban` (`receiverIban`),
  CONSTRAINT `sendtransactions_ibfk_1` FOREIGN KEY (`iban`) REFERENCES `accounts` (`iban`),
  CONSTRAINT `sendtransactions_ibfk_2` FOREIGN KEY (`receiverIban`) REFERENCES `accounts` (`iban`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `sendtransactions` */

insert  into `sendtransactions`(`id`,`amount`,`iban`,`receiverIban`,`receivingCurrency`,`exchangeRate`,`time_stamp`) values 
(2,0.00,'HR3381368319727909239','HR6373777942065251327','EUR',1,'2023-02-07 21:15:59'),
(3,500.00,'HR3381368319727909239','HR6373777942065251327','EUR',1,'2023-02-07 21:16:09'),
(4,10.00,'HR6373777942065251327','HR8339255634119421791','USD',1.076,'2023-02-07 21:16:45'),
(5,100.00,'HR6373777942065251327','HR8339255634119421791','USD',1.076,'2023-02-07 21:16:57'),
(7,18.36,'HR8339255634119421791','HR6373777942065251327','EUR',0.9266123054114159,'2023-02-07 21:17:45'),
(8,100.00,'HR3381368319727909239',NULL,'EUR',1,'2023-02-07 21:17:59'),
(9,160.00,'HR6373777942065251327','HR3017261426517314048','GBP',0.89204,'2023-02-08 16:15:11'),
(10,30.00,'HR3017261426517314048',NULL,'GBP',1,'2023-02-08 16:15:23'),
(11,50.00,'HR6373777942065251327',NULL,'EUR',1,'2023-02-08 16:15:27'),
(13,150.00,'HR3017261426517314048','HR6373777942065251327','EUR',1.1176680972818311,'2023-02-08 16:15:42'),
(16,144.00,'HR3806722546708913705','HR7538564908781665941','USD',1.0674,'2023-02-13 15:46:04'),
(17,160.00,'HR6373777942065251327','HR3806722546708913705','EUR',1,'2023-02-13 15:46:26'),
(18,2.73,'HR3017261426517314048','HR3806722546708913705','EUR',1.130186141657531,'2023-02-13 15:46:38'),
(19,400.00,'HR3381368319727909239','HR3017261426517314048','GBP',0.88215,'2023-02-13 15:46:59'),
(20,30.00,'HR3381368319727909239',NULL,'EUR',1,'2023-02-13 15:47:16'),
(21,190.00,'HR3806722546708913705','HR3017261426517314048','GBP',0.88215,'2023-02-13 15:47:41'),
(22,50.00,'HR7538564908781665941',NULL,'USD',1,'2023-02-13 15:47:51'),
(23,200.00,'HR3806722546708913705',NULL,'EUR',1,'2023-02-13 15:47:55');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `salt` varchar(36) NOT NULL,
  `email` varchar(100) NOT NULL,
  `firstName` varchar(100) NOT NULL,
  `lastName` varchar(100) NOT NULL,
  `dateOfBirth` date NOT NULL,
  `pass` varchar(255) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `users` */

insert  into `users`(`id`,`salt`,`email`,`firstName`,`lastName`,`dateOfBirth`,`pass`,`isAdmin`) values 
(1,'652832ec-3b1f-469c-8ea7-883749929b24','lstrbad@tvz.hr','Luka','Strbad','2001-08-13','58b39fbcf504dfd2d9ed71997b00567ed1545163fec289bbc6260e804a1703dca571e46f745121166db7026bcbbd0501ae11693d162dddd366229ca412efaff4',0),
(2,'2650ce35-20af-46aa-9b40-7e4bbb0f3838','admin@tvz.hr','Admin','Admin','2000-01-01','bf5c7131235479400c86559cb0d4289091e5c50ed8d6407f731334f7f159d8394cf8ee33bc39c67a16293baba793d197f0f22919525125d0d232d5e3483c7a88',1),
(3,'66e76ba6-b8dc-464c-acdf-6f4928d78d06','ivan.horvat@gmail.com','Ivan','Horvat','1970-01-01','a16cbb711ea1a48c31dc80933a709f088615c4ededf2dfac47dc6ac3a33dd77e5610429f870c45be9f5af4854b1e1fcda119d2edf2d73ea4642d5de47d1fb633',0);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
