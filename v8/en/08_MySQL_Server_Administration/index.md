# Chapter 7 MySQL Server Administration

**Table of Contents**

7.1 The MySQL Server :   7.1.1 Configuring the Server

    7.1.2 Server Configuration Defaults

    7.1.3 Server Configuration Validation

    7.1.4 Server Option, System Variable, and Status Variable Reference

    7.1.5 Server System Variable Reference

    7.1.6 Server Status Variable Reference

    7.1.7 Server Command Options

    7.1.8 Server System Variables

    7.1.9 Using System Variables

    7.1.10 Server Status Variables

    7.1.11 Server SQL Modes

    7.1.12 Connection Management

    7.1.13 IPv6 Support

    7.1.14 Network Namespace Support

    7.1.15 MySQL Server Time Zone Support

    7.1.16 Resource Groups

    7.1.17 Server-Side Help Support

    7.1.18 Server Tracking of Client Session State

    7.1.19 The Server Shutdown Process

7.2 The MySQL Data Directory

7.3 The mysql System Schema

7.4 MySQL Server Logs :   7.4.1 Selecting General Query Log and Slow Query Log Output Destinations

    7.4.2 The Error Log

    7.4.3 The General Query Log

    7.4.4 The Binary Log

    7.4.5 The Slow Query Log

    7.4.6 Server Log Maintenance

7.5 MySQL Components :   7.5.1 Installing and Uninstalling Components

    7.5.2 Obtaining Component Information

    7.5.3 Error Log Components

    7.5.4 Query Attribute Components

    7.5.5 Scheduler Component

7.6 MySQL Server Plugins :   7.6.1 Installing and Uninstalling Plugins

    7.6.2 Obtaining Server Plugin Information

    7.6.3 MySQL Enterprise Thread Pool

    7.6.4 The Rewriter Query Rewrite Plugin

    7.6.5 The ddl_rewriter Plugin

    7.6.6 Version Tokens

    7.6.7 The Clone Plugin

    7.6.8 The Keyring Proxy Bridge Plugin

    7.6.9 MySQL Plugin Services

7.7 MySQL Server Loadable Functions :   7.7.1 Installing and Uninstalling Loadable Functions

    7.7.2 Obtaining Information About Loadable Functions

7.8 Running Multiple MySQL Instances on One Machine :   7.8.1 Setting Up Multiple Data Directories

    7.8.2 Running Multiple MySQL Instances on Windows

    7.8.3 Running Multiple MySQL Instances on Unix

    7.8.4 Using Client Programs in a Multiple-Server Environment

7.9 Debugging MySQL :   7.9.1 Debugging a MySQL Server

    7.9.2 Debugging a MySQL Client

    7.9.3 The LOCK_ORDER Tool

    7.9.4 The DBUG Package

MySQL Server (**mysqld**) is the main program that does most of the work in a MySQL installation. This chapter provides an overview of MySQL Server and covers general server administration:

* Server configuration
* The data directory, particularly the `mysql` system schema

* The server log files
* Management of multiple servers on a single machine

For additional information on administrative topics, see also:

* Chapter 8, *Security*
* Chapter 9, *Backup and Recovery*
* Chapter 19, *Replication*
