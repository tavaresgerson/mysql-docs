# Chapter 16 MySQL Data Dictionary

**Table of Contents**

16.1 Data Dictionary Schema

16.2 Removal of File-based Metadata Storage

16.3 Transactional Storage of Dictionary Data

16.4 Dictionary Object Cache

16.5 INFORMATION_SCHEMA and Data Dictionary Integration

16.6 Serialized Dictionary Information (SDI)

16.7 Data Dictionary Usage Differences

16.8 Data Dictionary Limitations

MySQL Server incorporates a transactional data dictionary that stores information about database objects. In previous MySQL releases, dictionary data was stored in metadata files, nontransactional tables, and storage engine-specific data dictionaries.

This chapter describes the main features, benefits, usage differences, and limitations of the data dictionary. For other implications of the data dictionary feature, refer to the “Data Dictionary Notes” section in the MySQL 8.0 Release Notes.

Benefits of the MySQL data dictionary include:

* Simplicity of a centralized data dictionary schema that uniformly stores dictionary data. See Section 16.1, “Data Dictionary Schema”.

* Removal of file-based metadata storage. See Section 16.2, “Removal of File-based Metadata Storage”.

* Transactional, crash-safe storage of dictionary data. See Section 16.3, “Transactional Storage of Dictionary Data”.

* Uniform and centralized caching for dictionary objects. See Section 16.4, “Dictionary Object Cache”.

* A simpler and improved implementation for some `INFORMATION_SCHEMA` tables. See Section 16.5, “INFORMATION_SCHEMA and Data Dictionary Integration”.

* Atomic DDL. See Section 15.1.1, “Atomic Data Definition Statement Support”.

Important

A data dictionary-enabled server entails some general operational differences compared to a server that does not have a data dictionary; see Section 16.7, “Data Dictionary Usage Differences”. Also, for upgrades to MySQL 8.0, the upgrade procedure differs somewhat from previous MySQL releases and requires that you verify the upgrade readiness of your installation by checking specific prerequisites. For more information, see Chapter 3, *Upgrading MySQL*, particularly Section 3.6, “Preparing Your Installation for Upgrade”.
