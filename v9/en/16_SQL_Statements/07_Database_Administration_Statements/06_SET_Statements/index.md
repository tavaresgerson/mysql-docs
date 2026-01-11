### 15.7.6 SET Statements

15.7.6.1 SET Syntax for Variable Assignment

15.7.6.2 SET CHARACTER SET Statement

15.7.6.3 SET NAMES Statement

The `SET` statement has several forms. Descriptions for those forms that are not associated with a specific server capability appear in subsections of this section:

* `SET var_name = value` enables you to assign values to variables that affect the operation of the server or clients. See Section 15.7.6.1, “SET Syntax for Variable Assignment”.

* `SET CHARACTER SET` and `SET NAMES` assign values to character set and collation variables associated with the current connection to the server. See Section 15.7.6.2, “SET CHARACTER SET Statement”, and Section 15.7.6.3, “SET NAMES Statement”.

Descriptions for the other forms appear elsewhere, grouped with other statements related to the capability they help implement:

* `SET DEFAULT ROLE` and `SET ROLE` set the default role and current role for user accounts. See Section 15.7.1.9, “SET DEFAULT ROLE Statement”, and Section 15.7.1.11, “SET ROLE Statement”.

* `SET PASSWORD` assigns account passwords. See Section 15.7.1.10, “SET PASSWORD Statement”.

* `SET RESOURCE GROUP` assigns threads to a resource group. See Section 15.7.2.4, “SET RESOURCE GROUP Statement”.

* `SET TRANSACTION ISOLATION LEVEL` sets the isolation level for transaction processing. See Section 15.3.7, “SET TRANSACTION Statement”.
