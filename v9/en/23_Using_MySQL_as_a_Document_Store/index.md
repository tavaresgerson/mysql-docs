# Chapter 22 Using MySQL as a Document Store

This chapter introduces an alternative way of working with MySQL as
a document store, sometimes referred to as “using
NoSQL”. If your intention is to use MySQL in a traditional
(SQL) way, this chapter is probably not relevant to you.

Traditionally, relational databases such as MySQL have usually
required a schema to be defined before documents can be stored. The
features described in this section enable you to use MySQL as a
document store, which is a schema-less, and therefore
schema-flexible, storage system for documents. For example, when you
create documents describing products, you do not need to know and
define all possible attributes of any products before storing and
operating with the documents. This differs from working with a
relational database and storing products in a table, when all
columns of the table must be known and defined before adding any
products to the database. The features described in this chapter
enable you to choose how you configure MySQL, using only the
document store model, or combining the flexibility of the document
store model with the power of the relational model.

To use MySQL as a document store, you use the following server
features:

* X Plugin enables MySQL Server to communicate with clients using
  X Protocol, which is a prerequisite for using MySQL as a
  document store. X Plugin is enabled by default in MySQL Server
  as of MySQL 9.5. For instructions to verify X
  Plugin installation and to configure and monitor X Plugin, see
  [Section 22.5, “X Plugin”](x-plugin.html "22.5 X Plugin").

* X Protocol supports both CRUD and SQL operations,
  authentication via SASL, allows streaming (pipelining) of
  commands and is extensible on the protocol and the message
  layer. Clients compatible with X Protocol include MySQL Shell
  and MySQL 9.5 Connectors.

* Clients that communicate with a MySQL Server using X Protocol
  can use X DevAPI to develop applications. X DevAPI offers a
  modern programming interface with a simple yet powerful design
  which provides support for established industry standard
  concepts. This chapter explains how to get started using either
  the JavaScript or Python implementation of X DevAPI in
  MySQL Shell as a client. See
  [X DevAPI User Guide](/doc/x-devapi-userguide/en/) for in-depth tutorials on
  using X DevAPI.