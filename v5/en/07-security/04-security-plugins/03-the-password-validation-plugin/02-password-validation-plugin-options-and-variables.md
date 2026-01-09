#### 6.4.3.2 Password Validation Plugin Options and Variables

This section describes the options, system variables, and status variables that `validate_password` provides to enable its operation to be configured and monitored.

* [Password Validation Plugin Options](validate-password-options-variables.html#validate-password-options "Password Validation Plugin Options")
* [Password Validation Plugin System Variables](validate-password-options-variables.html#validate-password-system-variables "Password Validation Plugin System Variables")
* [Password Validation Plugin Status Variables](validate-password-options-variables.html#validate-password-status-variables "Password Validation Plugin Status Variables")

##### Password Validation Plugin Options

To control activation of the `validate_password` plugin, use this option:

* [`--validate-password[=value]`](validate-password-options-variables.html#option_mysqld_validate-password)

  <table frame="box" rules="all" summary="Properties for validate-password"><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  This option controls how the server loads the `validate_password` plugin at startup. The value should be one of those available for plugin-loading options, as described in [Section 5.5.1, “Installing and Uninstalling Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins"). For example, [`--validate-password=FORCE_PLUS_PERMANENT`](validate-password-options-variables.html#option_mysqld_validate-password) tells the server to load the plugin at startup and prevents it from being removed while the server is running.

  This option is available only if the `validate_password` plugin has been previously registered with [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") or is loaded with [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add). See [Section 6.4.3.1, “Password Validation Plugin Installation”](validate-password-installation.html "6.4.3.1 Password Validation Plugin Installation").

##### Password Validation Plugin System Variables

If the `validate_password` plugin is enabled, it exposes several system variables that enable configuration of password checking:

```sql
mysql> SHOW VARIABLES LIKE 'validate_password%';
+--------------------------------------+--------+
| Variable_name                        | Value  |
+--------------------------------------+--------+
| validate_password_check_user_name    | OFF    |
| validate_password_dictionary_file    |        |
| validate_password_length             | 8      |
| validate_password_mixed_case_count   | 1      |
| validate_password_number_count       | 1      |
| validate_password_policy             | MEDIUM |
| validate_password_special_char_count | 1      |
+--------------------------------------+--------+
```

To change how passwords are checked, you can set these system variables at server startup or at runtime. The following list describes the meaning of each variable.

* [`validate_password_check_user_name`](validate-password-options-variables.html#sysvar_validate_password_check_user_name)

  <table frame="box" rules="all" summary="Properties for validate_password_check_user_name"><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password-check-user-name[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.15</td> </tr><tr><th>System Variable</th> <td><code>validate_password_check_user_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Whether `validate_password` compares passwords to the user name part of the effective user account for the current session and rejects them if they match. This variable is unavailable unless `validate_password` is installed.

  By default, [`validate_password_check_user_name`](validate-password-options-variables.html#sysvar_validate_password_check_user_name) is disabled. This variable controls user name matching independent of the value of [`validate_password_policy`](validate-password-options-variables.html#sysvar_validate_password_policy).

  When [`validate_password_check_user_name`](validate-password-options-variables.html#sysvar_validate_password_check_user_name) is enabled, it has these effects:

  + Checking occurs in all contexts for which `validate_password` is invoked, which includes use of statements such as [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") or [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement") to change the current user's password, and invocation of functions such as [`PASSWORD()`](encryption-functions.html#function_password) and [`VALIDATE_PASSWORD_STRENGTH()`](encryption-functions.html#function_validate-password-strength).

  + The user names used for comparison are taken from the values of the [`USER()`](information-functions.html#function_user) and [`CURRENT_USER()`](information-functions.html#function_current-user) functions for the current session. An implication is that a user who has sufficient privileges to set another user's password can set the password to that user's name, and cannot set that user' password to the name of the user executing the statement. For example, `'root'@'localhost'` can set the password for `'jeffrey'@'localhost'` to `'jeffrey'`, but cannot set the password to `'root`.

  + Only the user name part of the [`USER()`](information-functions.html#function_user) and [`CURRENT_USER()`](information-functions.html#function_current-user) function values is used, not the host name part. If a user name is empty, no comparison occurs.

  + If a password is the same as the user name or its reverse, a match occurs and the password is rejected.

  + User-name matching is case-sensitive. The password and user name values are compared as binary strings on a byte-by-byte basis.

  + If a password matches the user name, [`VALIDATE_PASSWORD_STRENGTH()`](encryption-functions.html#function_validate-password-strength) returns 0 regardless of how other `validate_password` system variables are set.

* [`validate_password_dictionary_file`](validate-password-options-variables.html#sysvar_validate_password_dictionary_file)

  <table frame="box" rules="all" summary="Properties for validate_password_dictionary_file"><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password-dictionary-file=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password_dictionary_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  The path name of the dictionary file that `validate_password` uses for checking passwords. This variable is unavailable unless `validate_password` is installed.

  By default, this variable has an empty value and dictionary checks are not performed. For dictionary checks to occur, the variable value must be nonempty. If the file is named as a relative path, it is interpreted relative to the server data directory. File contents should be lowercase, one word per line. Contents are treated as having a character set of `utf8`. The maximum permitted file size is 1MB.

  For the dictionary file to be used during password checking, the password policy must be set to 2 (`STRONG`); see the description of the [`validate_password_policy`](validate-password-options-variables.html#sysvar_validate_password_policy) system variable. Assuming that is true, each substring of the password of length 4 up to 100 is compared to the words in the dictionary file. Any match causes the password to be rejected. Comparisons are not case-sensitive.

  For [`VALIDATE_PASSWORD_STRENGTH()`](encryption-functions.html#function_validate-password-strength), the password is checked against all policies, including `STRONG`, so the strength assessment includes the dictionary check regardless of the [`validate_password_policy`](validate-password-options-variables.html#sysvar_validate_password_policy) value.

  [`validate_password_dictionary_file`](validate-password-options-variables.html#sysvar_validate_password_dictionary_file) can be set at runtime and assigning a value causes the named file to be read without a server restart.

* [`validate_password_length`](validate-password-options-variables.html#sysvar_validate_password_length)

  <table frame="box" rules="all" summary="Properties for validate_password_length"><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password-length=#</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password_length</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>8</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr></tbody></table>

  The minimum number of characters that `validate_password` requires passwords to have. This variable is unavailable unless `validate_password` is installed.

  The [`validate_password_length`](validate-password-options-variables.html#sysvar_validate_password_length) minimum value is a function of several other related system variables. The value cannot be set less than the value of this expression:

  ```sql
  validate_password_number_count
  + validate_password_special_char_count
  + (2 * validate_password_mixed_case_count)
  ```

  If `validate_password` adjusts the value of [`validate_password_length`](validate-password-options-variables.html#sysvar_validate_password_length) due to the preceding constraint, it writes a message to the error log.

* [`validate_password_mixed_case_count`](validate-password-options-variables.html#sysvar_validate_password_mixed_case_count)

  <table frame="box" rules="all" summary="Properties for validate_password_mixed_case_count"><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password-mixed-case-count=#</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password_mixed_case_count</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr></tbody></table>

  The minimum number of lowercase and uppercase characters that `validate_password` requires passwords to have if the password policy is `MEDIUM` or stronger. This variable is unavailable unless `validate_password` is installed.

  For a given [`validate_password_mixed_case_count`](validate-password-options-variables.html#sysvar_validate_password_mixed_case_count) value, the password must have that many lowercase characters, and that many uppercase characters.

* [`validate_password_number_count`](validate-password-options-variables.html#sysvar_validate_password_number_count)

  <table frame="box" rules="all" summary="Properties for validate_password_number_count"><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password-number-count=#</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password_number_count</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr></tbody></table>

  The minimum number of numeric (digit) characters that `validate_password` requires passwords to have if the password policy is `MEDIUM` or stronger. This variable is unavailable unless `validate_password` is installed.

* [`validate_password_policy`](validate-password-options-variables.html#sysvar_validate_password_policy)

  <table frame="box" rules="all" summary="Properties for validate_password_policy"><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password-policy=value</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password_policy</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Valid Values</th> <td><p><code>0</code></p><p><code>1</code></p><p><code>2</code></p></td> </tr></tbody></table>

  The password policy enforced by `validate_password`. This variable is unavailable unless `validate_password` is installed.

  [`validate_password_policy`](validate-password-options-variables.html#sysvar_validate_password_policy) affects how `validate_password` uses its other policy-setting system variables, except for checking passwords against user names, which is controlled independently by [`validate_password_check_user_name`](validate-password-options-variables.html#sysvar_validate_password_check_user_name).

  The [`validate_password_policy`](validate-password-options-variables.html#sysvar_validate_password_policy) value can be specified using numeric values 0, 1, 2, or the corresponding symbolic values `LOW`, `MEDIUM`, `STRONG`. The following table describes the tests performed for each policy. For the length test, the required length is the value of the [`validate_password_length`](validate-password-options-variables.html#sysvar_validate_password_length) system variable. Similarly, the required values for the other tests are given by other `validate_password_xxx` variables.

  <table summary="Password policies enforced by the validate_password plugin and the tests performed for each policy."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Policy</th> <th>Tests Performed</th> </tr></thead><tbody><tr> <td><code>0</code> or <code>LOW</code></td> <td>Length</td> </tr><tr> <td><code>1</code> or <code>MEDIUM</code></td> <td>Length; numeric, lowercase/uppercase, and special characters</td> </tr><tr> <td><code>2</code> or <code>STRONG</code></td> <td>Length; numeric, lowercase/uppercase, and special characters; dictionary file</td> </tr></tbody></table>

* [`validate_password_special_char_count`](validate-password-options-variables.html#sysvar_validate_password_special_char_count)

  <table frame="box" rules="all" summary="Properties for validate_password_special_char_count"><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password-special-char-count=#</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password_special_char_count</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr></tbody></table>

  The minimum number of nonalphanumeric characters that `validate_password` requires passwords to have if the password policy is `MEDIUM` or stronger. This variable is unavailable unless `validate_password` is installed.

##### Password Validation Plugin Status Variables

If the `validate_password` plugin is enabled, it exposes status variables that provide operational information:

```sql
mysql> SHOW STATUS LIKE 'validate_password%';
+-----------------------------------------------+---------------------+
| Variable_name                                 | Value               |
+-----------------------------------------------+---------------------+
| validate_password.dictionary_file_last_parsed | 2019-10-03 08:33:49 |
| validate_password_dictionary_file_words_count | 1902                |
+-----------------------------------------------+---------------------+
```

The following list describes the meaning of each status variable.

* [`validate_password_dictionary_file_last_parsed`](validate-password-options-variables.html#statvar_validate_password_dictionary_file_last_parsed)

  When the dictionary file was last parsed.

* [`validate_password_dictionary_file_words_count`](validate-password-options-variables.html#statvar_validate_password_dictionary_file_words_count)

  The number of words read from the dictionary file.
