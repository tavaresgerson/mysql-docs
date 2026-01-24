# Chapter 19 Using MySQL as a Document Store

**Table of Contents**

19.1 Key Concepts

19.2 Setting Up MySQL as a Document Store :   19.2.1 Installing MySQL Shell

    19.2.2 Starting MySQL Shell

19.3 Quick-Start Guide: MySQL for Visual Studio

19.4 X Plugin :   19.4.1 Using Encrypted Connections with X Plugin

    19.4.2 X Plugin Options and Variables

    19.4.3 Monitoring X Plugin

This chapter introduces an alternative way of working with MySQL as a document store, sometimes referred to as “using NoSQL”. If your intention is to use MySQL in a traditional (SQL) way, this chapter is probably not relevant to you.

Important

MySQL Shell 8.0 is the most recent version and is highly recommended for use with MySQL Server 5.7. Please upgrade to MySQL Shell 8.0. If you have not yet installed MySQL Shell, download it from the [download site](https://dev.mysql.com/downloads/shell). See the MySQL Shell 8.0 documentation for the latest documentation. This chapter covers configuring MySQL 5.7 server as a document store and is compatible with version 8.0 clients such as MySQL Shell and MySQL Connectors.

Relational databases such as MySQL usually required a document schema to be defined before documents can be stored. The features described in this section enable you to use MySQL as a document store, which is a schema-less, and therefore schema-flexible, storage system for documents. When using MySQL as a document store, to create documents describing products you do not need to know and define all possible attributes of any products before storing them and operating with them. This differs from working with a relational database and storing products in a table, when all columns of the table must be known and defined before adding any products to the database. The features described in this chapter enable you to choose how you configure MySQL, using only the document store model, or combining the flexibility of the document store model with the power of the relational model.

These sections cover the usage of MySQL as a document store:

* The Section 19.1, “Key Concepts” section covers concepts like Document, Collection, Session, and Schema to help you understand how to use MySQL as a document store.

* The Section 19.2, “Setting Up MySQL as a Document Store” section explains how to configure X Plugin on a MySQL Server, so it can function as a document store, and how to install MySQL Shell to use as a client.

* MySQL Shell 8.0 provides more detailed information about using MySQL Shell.

* *X DevAPI User guide.*

  Clients that communicate with a MySQL Server using the X Protocol can use the X DevAPI to develop applications. For example MySQL Shell and MySQL Connectors provide this ability by implementing the X DevAPI. X DevAPI offers a modern programming interface with a simple yet powerful design which provides support for established industry standard concepts. See X DevAPI User Guide for in-depth tutorials on using X DevAPI.

* The following MySQL products support the X Protocol and enable you to use X DevAPI in your chosen language to develop applications that communicate with a MySQL Server functioning as a document store.

  + MySQL Shell provides implementations of X DevAPI in JavaScript and Python.

  + Connector/C++
  + Connector/J
  + Connector/Node.js
  + Connector/NET
  + Connector/Python
