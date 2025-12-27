### 8.4.4 The Password Validation Component

8.4.4.1 Password Validation Component Installation and Uninstallation

8.4.4.2 Password Validation Options and Variables

8.4.4.3 Transitioning to the Password Validation Component

The `validate_password` component serves to improve security by requiring account passwords and enabling strength testing of potential passwords. This component exposes system variables that enable you to configure password policy, and status variables for component monitoring.

The `validate_password` component implements these capabilities:

* For SQL statements that assign a password supplied as a cleartext value, `validate_password` checks the password against the current password policy and rejects the password if it is weak (the statement returns an `ER_NOT_VALID_PASSWORD` error). This applies to the `ALTER USER`, `CREATE USER`, and `SET PASSWORD` statements.

* For `CREATE USER` statements, `validate_password` requires that a password be given, and that it satisfies the password policy. This is true even if an account is locked initially because otherwise unlocking the account later would cause it to become accessible without a password that satisfies the policy.

* `validate_password` implements a `VALIDATE_PASSWORD_STRENGTH()` SQL function that assesses the strength of potential passwords. This function takes a password argument and returns an integer from 0 (weak) to 100 (strong).

Note

For statements that assign or modify account passwords (`ALTER USER`, `CREATE USER`, and `SET PASSWORD`), the `validate_password` capabilities described here apply only to accounts that use an authentication plugin that stores credentials internally to MySQL. For accounts that use plugins that perform authentication against a credentials system external to MySQL, password management must be handled externally against that system as well. For more information about internal credentials storage, see Section 8.2.15, “Password Management”.

The preceding restriction does not apply to use of the `VALIDATE_PASSWORD_STRENGTH()` function because it does not affect accounts directly.

Examples:

* `validate_password` checks the cleartext password in the following statement. Under the default password policy, which requires passwords to be at least 8 characters long, the password is weak and the statement produces an error:

  ```
  mysql> ALTER USER USER() IDENTIFIED BY 'abc';
  ERROR 1819 (HY000): Your password does not satisfy the current
  policy requirements
  ```

* Passwords specified as hashed values are not checked because the original password value is not available for checking:

  ```
  mysql> ALTER USER 'jeffrey'@'localhost'
         IDENTIFIED WITH sha256_password
         AS '*0D3CED9BEC10A777AEC23CCC353A8C08A633045E';
  Query OK, 0 rows affected (0.01 sec)
  ```

* This account-creation statement fails, even though the account is locked initially, because it does not include a password that satisfies the current password policy:

  ```
  mysql> CREATE USER 'juanita'@'localhost' ACCOUNT LOCK;
  ERROR 1819 (HY000): Your password does not satisfy the current
  policy requirements
  ```

* To check a password, use the `VALIDATE_PASSWORD_STRENGTH()` function:

  ```
  mysql> SELECT VALIDATE_PASSWORD_STRENGTH('weak');
  +------------------------------------+
  | VALIDATE_PASSWORD_STRENGTH('weak') |
  +------------------------------------+
  |                                 25 |
  +------------------------------------+
  mysql> SELECT VALIDATE_PASSWORD_STRENGTH('lessweak$_@123');
  +----------------------------------------------+
  | VALIDATE_PASSWORD_STRENGTH('lessweak$_@123') |
  +----------------------------------------------+
  |                                           50 |
  +----------------------------------------------+
  mysql> SELECT VALIDATE_PASSWORD_STRENGTH('N0Tweak$_@123!');
  +----------------------------------------------+
  | VALIDATE_PASSWORD_STRENGTH('N0Tweak$_@123!') |
  +----------------------------------------------+
  |                                          100 |
  +----------------------------------------------+
  ```

To configure password checking, modify the system variables having names of the form `validate_password.xxx`; these are the parameters that control password policy. See Section 8.4.4.2, “Password Validation Options and Variables”.

If `validate_password` is not installed, the `validate_password.xxx` system variables are not available, passwords in statements are not checked, and the `VALIDATE_PASSWORD_STRENGTH()` function always returns 0. For example, without the plugin installed, accounts can be assigned passwords shorter than 8 characters, or no password at all.

Assuming that `validate_password` is installed, it implements three levels of password checking: `LOW`, `MEDIUM`, and `STRONG`. The default is `MEDIUM`; to change this, modify the value of `validate_password.policy`. The policies implement increasingly strict password tests. The following descriptions refer to default parameter values, which can be modified by changing the appropriate system variables.

* `LOW` policy tests password length only. Passwords must be at least 8 characters long. To change this length, modify `validate_password.length`.

* `MEDIUM` policy adds the conditions that passwords must contain at least 1 numeric character, 1 lowercase character, 1 uppercase character, and 1 special (nonalphanumeric) character. To change these values, modify `validate_password.number_count`, `validate_password.mixed_case_count`, and `validate_password.special_char_count`.

* `STRONG` policy adds the condition that password substrings of length 4 or longer must not match words in the dictionary file, if one has been specified. To specify the dictionary file, modify `validate_password.dictionary_file`.

In addition, `validate_password` supports the capability of rejecting passwords that match the user name part of the effective user account for the current session, either forward or in reverse. To provide control over this capability, `validate_password` exposes a `validate_password.check_user_name` system variable, which is enabled by default.
