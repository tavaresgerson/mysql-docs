### 15.7.1 Account Management Statements

15.7.1.1 ALTER USER Statement

15.7.1.2 CREATE ROLE Statement

15.7.1.3 CREATE USER Statement

15.7.1.4 DROP ROLE Statement

15.7.1.5 DROP USER Statement

15.7.1.6 GRANT Statement

15.7.1.7 RENAME USER Statement

15.7.1.8 REVOKE Statement

15.7.1.9 SET DEFAULT ROLE Statement

15.7.1.10 SET PASSWORD Statement

15.7.1.11 SET ROLE Statement

MySQL account information is stored in the tables of the `mysql` system schema. This database and the access control system are discussed extensively in Chapter 7, *MySQL Server Administration*, which you should consult for additional details.

Important

Some MySQL releases introduce changes to the grant tables to add new privileges or features. To make sure that you can take advantage of any new capabilities, update your grant tables to the current structure whenever you upgrade MySQL. See Chapter 3, *Upgrading MySQL*.

When the `read_only` system variable is enabled, account-management statements require the `CONNECTION_ADMIN` privilege (or the deprecated `SUPER` privilege), in addition to any other required privileges. This is because they modify tables in the `mysql` system schema.

Account management statements are atomic and crash safe. For more information, see Section 15.1.1, “Atomic Data Definition Statement Support”.
