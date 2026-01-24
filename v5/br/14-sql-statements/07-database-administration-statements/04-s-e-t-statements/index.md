### 13.7.4 SET Statements

[13.7.4.1 SET Syntax for Variable Assignment](set-variable.html)

[13.7.4.2 SET CHARACTER SET Statement](set-character-set.html)

[13.7.4.3 SET NAMES Statement](set-names.html)

The [`SET`](set-statement.html "13.7.4 SET Statements") statement has several forms. Descriptions for those forms that are not associated with a specific server capability appear in subsections of this section:

* [`SET var_name = value`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") enables you to assign values to variables that affect the operation of the server or clients. See [Section 13.7.4.1, “SET Syntax for Variable Assignment”](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment").

* [`SET CHARACTER SET`](set-character-set.html "13.7.4.2 SET CHARACTER SET Statement") and [`SET NAMES`](set-names.html "13.7.4.3 SET NAMES Statement") assign values to character set and collation variables associated with the current connection to the server. See [Section 13.7.4.2, “SET CHARACTER SET Statement”](set-character-set.html "13.7.4.2 SET CHARACTER SET Statement"), and [Section 13.7.4.3, “SET NAMES Statement”](set-names.html "13.7.4.3 SET NAMES Statement").

Descriptions for the other forms appear elsewhere, grouped with other statements related to the capability they help implement:

* [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement") assigns account passwords. See [Section 13.7.1.7, “SET PASSWORD Statement”](set-password.html "13.7.1.7 SET PASSWORD Statement").

* [`SET TRANSACTION ISOLATION LEVEL`](set-transaction.html "13.3.6 SET TRANSACTION Statement") sets the isolation level for transaction processing. See [Section 13.3.6, “SET TRANSACTION Statement”](set-transaction.html "13.3.6 SET TRANSACTION Statement").
