#### B.3.2.13 Ignoring user

If you get the following error, it means that when [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") was started or when it reloaded the grant tables, it found an account in the `user` table that had an invalid password.

`Found wrong password for user 'some_user'@'some_host'; ignoring user`

As a result, the account is simply ignored by the permission system.

The following list indicates possible causes of and fixes for this problem:

* You may be running a new version of [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") with an old `user` table. Check whether the `Password` column of that table is shorter than 16 characters. If so, correct this condition by running [**mysql\_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables").

* The account has an old password (eight characters long). Update the account in the `user` table to have a new password.

* You have specified a password in the `user` table without using the [`PASSWORD()`](encryption-functions.html#function_password) function. Use [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") to update the account in the `user` table with a new password, making sure to use the [`PASSWORD()`](encryption-functions.html#function_password) function:

  ```sql
  mysql> UPDATE user SET Password=PASSWORD('new_password')
      -> WHERE User='some_user' AND Host='some_host';
  ```
