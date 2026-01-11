# Chapter 8 Security

**Table of Contents**

8.1 General Security Issues :   8.1.1 Security Guidelines

    8.1.2 Keeping Passwords Secure

    8.1.3 Making MySQL Secure Against Attackers

    8.1.4 Security-Related mysqld Options and Variables

    8.1.5 How to Run MySQL as a Normal User

    8.1.6 Security Considerations for LOAD DATA LOCAL

    8.1.7 Client Programming Security Guidelines

8.2 Access Control and Account Management :   8.2.1 Account User Names and Passwords

    8.2.2 Privileges Provided by MySQL

    8.2.3 Grant Tables

    8.2.4 Specifying Account Names

    8.2.5 Specifying Role Names

    8.2.6 Access Control, Stage 1: Connection Verification

    8.2.7 Access Control, Stage 2: Request Verification

    8.2.8 Adding Accounts, Assigning Privileges, and Dropping Accounts

    8.2.9 Reserved Accounts

    8.2.10 Using Roles

    8.2.11 Account Categories

    8.2.12 Privilege Restriction Using Partial Revokes

    8.2.13 When Privilege Changes Take Effect

    8.2.14 Assigning Account Passwords

    8.2.15 Password Management

    8.2.16 Server Handling of Expired Passwords

    8.2.17 Pluggable Authentication

    8.2.18 Multifactor Authentication

    8.2.19 Proxy Users

    8.2.20 Account Locking

    8.2.21 Setting Account Resource Limits

    8.2.22 Troubleshooting Problems Connecting to MySQL

    8.2.23 SQL-Based Account Activity Auditing

8.3 Using Encrypted Connections :   8.3.1 Configuring MySQL to Use Encrypted Connections

    8.3.2 Encrypted Connection TLS Protocols and Ciphers

    8.3.3 Creating SSL and RSA Certificates and Keys

    8.3.4 Connecting to MySQL Remotely from Windows with SSH

    8.3.5 Reusing SSL Sessions

8.4 Security Components and Plugins :   8.4.1 Authentication Plugins

    8.4.2 The Connection Control Component

    8.4.3 Connection Control Plugins

    8.4.4 The Password Validation Component

    8.4.5 The MySQL Keyring

    8.4.6 MySQL Enterprise Audit

    8.4.7 The Audit Message Component

    8.4.8 MySQL Enterprise Firewall

8.5 MySQL Enterprise Data Masking :   8.5.1 Data-Masking Components Versus the Data-Masking Plugin

    8.5.2 MySQL Enterprise Data Masking Components

    8.5.3 MySQL Enterprise Data Masking Plugin

8.6 MySQL Enterprise Encryption :   8.6.1 MySQL Enterprise Encryption Installation and Upgrading

    8.6.2 Configuring MySQL Enterprise Encryption

    8.6.3 MySQL Enterprise Encryption Usage and Examples

    8.6.4 MySQL Enterprise Encryption Function Reference

    8.6.5 MySQL Enterprise Encryption Component Function Descriptions

8.7 SELinux :   8.7.1 Check if SELinux is Enabled

    8.7.2 Changing the SELinux Mode

    8.7.3 MySQL Server SELinux Policies

    8.7.4 SELinux File Context

    8.7.5 SELinux TCP Port Context

    8.7.6 Troubleshooting SELinux

8.8 FIPS Support

When thinking about security within a MySQL installation, you should consider a wide range of possible topics and how they affect the security of your MySQL server and related applications:

* General factors that affect security. These include choosing good passwords, not granting unnecessary privileges to users, ensuring application security by preventing SQL injections and data corruption, and others. See Section 8.1, “General Security Issues”.

* Security of the installation itself. The data files, log files, and the all the application files of your installation should be protected to ensure that they are not readable or writable by unauthorized parties. For more information, see Section 2.9, “Postinstallation Setup and Testing”.

* Access control and security within the database system itself, including the users and databases granted with access to the databases, views and stored programs in use within the database. For more information, see Section 8.2, “Access Control and Account Management”.

* The features offered by security-related plugins. See Section 8.4, “Security Components and Plugins”.

* Network security of MySQL and your system. The security is related to the grants for individual users, but you may also wish to restrict MySQL so that it is available only locally on the MySQL server host, or to a limited set of other hosts.

* Ensure that you have adequate and appropriate backups of your database files, configuration and log files. Also be sure that you have a recovery solution in place and test that you are able to successfully recover the information from your backups. See Chapter 9, *Backup and Recovery*.

Note

Several topics in this chapter are also addressed in the Secure Deployment Guide, which provides procedures for deploying a generic binary distribution of MySQL Enterprise Edition Server with features for managing the security of your MySQL installation.
