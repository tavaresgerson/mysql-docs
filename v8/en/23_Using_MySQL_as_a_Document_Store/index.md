# Chapter 22 Using MySQL as a Document Store

**Table of Contents**

22.1 Interfaces to a MySQL Document Store

22.2 Document Store Concepts

22.3 JavaScript Quick-Start Guide: MySQL Shell for Document Store :   22.3.1 MySQL Shell

    22.3.2 Download and Import world_x Database

    22.3.3 Documents and Collections

    22.3.4 Relational Tables

    22.3.5 Documents in Tables

22.4 Python Quick-Start Guide: MySQL Shell for Document Store :   22.4.1 MySQL Shell

    22.4.2 Download and Import world_x Database

    22.4.3 Documents and Collections

    22.4.4 Relational Tables

    22.4.5 Documents in Tables

22.5 X Plugin :   22.5.1 Checking X Plugin Installation

    22.5.2 Disabling X Plugin

    22.5.3 Using Encrypted Connections with X Plugin

    22.5.4 Using X Plugin with the Caching SHA-2 Authentication Plugin

    22.5.5 Connection Compression with X Plugin

    22.5.6 X Plugin Options and Variables

    22.5.7 Monitoring X Plugin

This chapter introduces an alternative way of working with MySQL as a document store, sometimes referred to as “using NoSQL”. If your intention is to use MySQL in a traditional (SQL) way, this chapter is probably not relevant to you.

Traditionally, relational databases such as MySQL have usually required a schema to be defined before documents can be stored. The features described in this section enable you to use MySQL as a document store, which is a schema-less, and therefore schema-flexible, storage system for documents. For example, when you create documents describing products, you do not need to know and define all possible attributes of any products before storing and operating with the documents. This differs from working with a relational database and storing products in a table, when all columns of the table must be known and defined before adding any products to the database. The features described in this chapter enable you to choose how you configure MySQL, using only the document store model, or combining the flexibility of the document store model with the power of the relational model.

To use MySQL as a document store, you use the following server features:

* X Plugin enables MySQL Server to communicate with clients using X Protocol, which is a prerequisite for using MySQL as a document store. X Plugin is enabled by default in MySQL Server as of MySQL 8.0. For instructions to verify X Plugin installation and to configure and monitor X Plugin, see Section 22.5, “X Plugin”.

* X Protocol supports both CRUD and SQL operations, authentication via SASL, allows streaming (pipelining) of commands and is extensible on the protocol and the message layer. Clients compatible with X Protocol include MySQL Shell and MySQL 8.0 Connectors.

* Clients that communicate with a MySQL Server using X Protocol can use X DevAPI to develop applications. X DevAPI offers a modern programming interface with a simple yet powerful design which provides support for established industry standard concepts. This chapter explains how to get started using either the JavaScript or Python implementation of X DevAPI in MySQL Shell as a client. See X DevAPI User Guide for in-depth tutorials on using X DevAPI.
