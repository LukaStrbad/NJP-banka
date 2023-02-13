CREATE DATABASE IF NOT EXISTS njp_banka;
USE njp_banka;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    salt VARCHAR(36) NOT NULL,
    email VARCHAR(100) NOT NULL,
    firstName VARCHAR(100) NOT NULL,
    lastName VARCHAR(100) NOT NULL,
    dateOfBirth DATE NOT NULL,
    pass VARCHAR(255) NOT NULL,
    isAdmin boolean NOT NULL DEFAULT false
);
CREATE TABLE accounts (
    iban CHAR(21) PRIMARY KEY NOT NULL,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.0,
    userId INT NOT NULL,
    currency CHAR(3) NOT NULL,
    FOREIGN KEY (userId) REFERENCES users (id)
);
CREATE TABLE sendtransactions (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    amount DECIMAL(15, 2) NOT NULL,
    iban CHAR(21) NOT NULL,
    -- NULL if it's ATM
    receiverIban CHAR(21),
    receivingCurrency CHAR(3) NOT NULL,
    exchangeRate DOUBLE DEFAULT 1.0,
    time_stamp TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (iban) REFERENCES accounts (iban),
    FOREIGN KEY (receiverIban) REFERENCES accounts (iban)
);
CREATE TABLE receivetransactions (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    amount DECIMAL(15, 2) NOT NULL,
    iban CHAR(21) NOT NULL,
    -- NULL if it's ATM
    senderIban CHAR(21),
    time_stamp TIMESTAMP NOT NULL DEFAULT NOW(),
    FOREIGN KEY (iban) REFERENCES accounts (iban),
    FOREIGN KEY (senderIban) REFERENCES accounts (iban)
);
-- default user for the bank
INSERT INTO users(firstName, email, lastName, dateOfBirth, pass)
VALUES ('', '', '', MAKEDATE(1, 1), '');
-- default bank account for the bank
INSERT INTO accounts(iban, balance, userId, currency)
VALUES ('HR0000000000000000000', 0, 1, '000');