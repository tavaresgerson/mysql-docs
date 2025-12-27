### 6.2.8 Reserved Accounts

One part of the MySQL installation process is data directory initialization (see [Section 2.9.1, “Initializing the Data Directory”](data-directory-initialization.html "2.9.1 Initializing the Data Directory")). During data directory initialization, MySQL creates user accounts that should be considered reserved:

* `'root'@'localhost`: Used for administrative purposes. This account has all privileges and can perform any operation.

  Strictly speaking, this account name is not reserved, in the sense that some installations rename the `root` account to something else to avoid exposing a highly privileged account with a well-known name.

* `'mysql.sys'@'localhost'`: Used as the `DEFINER` for [`sys`](sys-schema.html "Chapter 26 MySQL sys Schema") schema objects. Use of the `mysql.sys` account avoids problems that occur if a DBA renames or removes the `root` account. This account is locked so that it cannot be used for client connections.

* `'mysql.session'@'localhost'`: Used internally by plugins to access the server. This account is locked so that it cannot be used for client connections.
