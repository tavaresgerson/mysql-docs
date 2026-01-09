#### 8.4.4.2 Password Validation Options and Variables

This section describes the system and status variables that `validate_password` provides to enable its operation to be configured and monitored.

* Password Validation Component System Variables
* Password Validation Component Status Variables
* Password Validation Plugin Options
* Password Validation Plugin System Variables
* Password Validation Plugin Status Variables

##### Password Validation Component System Variables

If the `validate_password` component is enabled, it exposes several system variables that enable configuration of password checking:

```
mysql> SHOW VARIABLES LIKE 'validate_password.%';
+-------------------------------------------------+--------+
| Variable_name                                   | Value  |
+-------------------------------------------------+--------+
| validate_password.changed_characters_percentage | 0      |
| validate_password.check_user_name               | ON     |
| validate_password.dictionary_file               |        |
| validate_password.length                        | 8      |
| validate_password.mixed_case_count              | 1      |
| validate_password.number_count                  | 1      |
| validate_password.policy                        | MEDIUM |
| validate_password.special_char_count            | 1      |
+-------------------------------------------------+--------+
```

To change how passwords are checked, you can set these system variables at server startup or at runtime. The following list describes the meaning of each variable.

* `validate_password.changed_characters_percentage`

  <table frame="box" rules="all" summary="Properties for validate_password.changed_characters_percentage"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--validate-password.changed-characters-percentage[=value]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="validate-password-options-variables.html#sysvar_validate_password.changed_characters_percentage">validate_password.changed_characters_percentage</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">100</code></td> </tr></tbody></table>

  Indicates the minimum number of characters, as a percentage of all characters, in a password that a user must change before `validate_password` accepts a new password for the user's own account. This applies only when changing an existing password, and has no effect when setting a user account's initial password.

  This variable is not available unless `validate_password` is installed.

  By default, `validate_password.changed_characters_percentage` permits all of the characters from the current password to be reused in the new password. The range of valid percentages is 0 to 100. If set to 100 percent, all of the characters from the current password are rejected, regardless of the casing. Characters '`abc`' and '`ABC`' are considered to be the same characters. If `validate_password` rejects the new password, it reports an error indicating the minimum number of characters that must differ.

  If the `ALTER USER` statement does not provide the existing password in a `REPLACE` clause, this variable is not enforced. Whether the `REPLACE` clause is required is subject to the password verification policy as it applies to a given account. For an overview of the policy, see Password Verification-Required Policy.

* `validate_password.check_user_name`

  <table frame="box" rules="all" summary="Properties for validate_password.check_user_name"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--validate-password.check-user-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="validate-password-options-variables.html#sysvar_validate_password.check_user_name">validate_password.check_user_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>

  Whether `validate_password` compares passwords to the user name part of the effective user account for the current session and rejects them if they match. This variable is unavailable unless `validate_password` is installed.

  By default, `validate_password.check_user_name` is enabled. This variable controls user name matching independent of the value of `validate_password.policy`.

  When `validate_password.check_user_name` is enabled, it has these effects:

  + Checking occurs in all contexts for which `validate_password` is invoked, which includes use of statements such as `ALTER USER` or `SET PASSWORD` to change the current user's password, and invocation of functions such as `VALIDATE_PASSWORD_STRENGTH()`.

  + The user names used for comparison are taken from the values of the `USER()` and `CURRENT_USER()` functions for the current session. An implication is that a user who has sufficient privileges to set another user's password can set the password to that user's name, and cannot set that user' password to the name of the user executing the statement. For example, `'root'@'localhost'` can set the password for `'jeffrey'@'localhost'` to `'jeffrey'`, but cannot set the password to `'root`.

  + Only the user name part of the `USER()` and `CURRENT_USER()` function values is used, not the host name part. If a user name is empty, no comparison occurs.

  + If a password is the same as the user name or its reverse, a match occurs and the password is rejected.

  + User-name matching is case-sensitive. The password and user name values are compared as binary strings on a byte-by-byte basis.

  + If a password matches the user name, `VALIDATE_PASSWORD_STRENGTH()` returns 0 regardless of how other `validate_password` system variables are set.

* `validate_password.dictionary_file`

  <table frame="box" rules="all" summary="Properties for validate_password.dictionary_file"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--validate-password.dictionary-file=file_name</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="validate-password-options-variables.html#sysvar_validate_password.dictionary_file">validate_password.dictionary_file</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  The path name of the dictionary file that `validate_password` uses for checking passwords. This variable is unavailable unless `validate_password` is installed.

  By default, this variable has an empty value and dictionary checks are not performed. For dictionary checks to occur, the variable value must be nonempty. If the file is named as a relative path, it is interpreted relative to the server data directory. File contents should be lowercase, one word per line. Contents are treated as having a character set of `utf8mb3`. The maximum permitted file size is 1MB.

  For the dictionary file to be used during password checking, the password policy must be set to 2 (`STRONG`); see the description of the `validate_password.policy` system variable. Assuming that is true, each substring of the password of length 4 up to 100 is compared to the words in the dictionary file. Any match causes the password to be rejected. Comparisons are not case-sensitive.

  For `VALIDATE_PASSWORD_STRENGTH()`, the password is checked against all policies, including `STRONG`, so the strength assessment includes the dictionary check regardless of the `validate_password.policy` value.

  `validate_password.dictionary_file` can be set at runtime and assigning a value causes the named file to be read without a server restart.

* `validate_password.length`

  <table frame="box" rules="all" summary="Properties for validate_password.length"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--validate-password.length=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="validate-password-options-variables.html#sysvar_validate_password.length">validate_password.length</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">8</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr></tbody></table>

  The minimum number of characters that `validate_password` requires passwords to have. This variable is unavailable unless `validate_password` is installed.

  The `validate_password.length` minimum value is a function of several other related system variables. The value cannot be set less than the value of this expression:

  ```
  validate_password.number_count
  + validate_password.special_char_count
  + (2 * validate_password.mixed_case_count)
  ```

  If `validate_password` adjusts the value of `validate_password.length` due to the preceding constraint, it writes a message to the error log.

* `validate_password.mixed_case_count`

  <table frame="box" rules="all" summary="Properties for validate_password.mixed_case_count"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--validate-password.mixed-case-count=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="validate-password-options-variables.html#sysvar_validate_password.mixed_case_count">validate_password.mixed_case_count</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr></tbody></table>

  The minimum number of lowercase and uppercase characters that `validate_password` requires passwords to have if the password policy is `MEDIUM` or stronger. This variable is unavailable unless `validate_password` is installed.

  For a given `validate_password.mixed_case_count` value, the password must have that many lowercase characters, and that many uppercase characters.

* `validate_password.number_count`

  <table frame="box" rules="all" summary="Properties for validate_password.number_count"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--validate-password.number-count=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="validate-password-options-variables.html#sysvar_validate_password.number_count">validate_password.number_count</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr></tbody></table>

  The minimum number of numeric (digit) characters that `validate_password` requires passwords to have if the password policy is `MEDIUM` or stronger. This variable is unavailable unless `validate_password` is installed.

* `validate_password.policy`

  <table frame="box" rules="all" summary="Properties for validate_password.policy"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--validate-password.policy=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="validate-password-options-variables.html#sysvar_validate_password.policy">validate_password.policy</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">0</code></p><p class="valid-value"><code class="literal">1</code></p><p class="valid-value"><code class="literal">2</code></p></td> </tr></tbody></table>

  The password policy enforced by `validate_password`. This variable is unavailable unless `validate_password` is installed.

  `validate_password.policy` affects how `validate_password` uses its other policy-setting system variables, except for checking passwords against user names, which is controlled independently by `validate_password.check_user_name`.

  The `validate_password.policy` value can be specified using numeric values 0, 1, 2, or the corresponding symbolic values `LOW`, `MEDIUM`, `STRONG`. The following table describes the tests performed for each policy. For the length test, the required length is the value of the `validate_password.length` system variable. Similarly, the required values for the other tests are given by other `validate_password.xxx` variables.

  <table summary="Password policies enforced by the validate_password component and the tests performed for each policy."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Policy</th> <th>Tests Performed</th> </tr></thead><tbody><tr> <td><code class="literal">0</code> or <code class="literal">LOW</code></td> <td>Length</td> </tr><tr> <td><code class="literal">1</code> or <code class="literal">MEDIUM</code></td> <td>Length; numeric, lowercase/uppercase, and special characters</td> </tr><tr> <td><code class="literal">2</code> or <code class="literal">STRONG</code></td> <td>Length; numeric, lowercase/uppercase, and special characters; dictionary file</td> </tr></tbody></table>

* `validate_password.special_char_count`

  <table frame="box" rules="all" summary="Properties for validate_password.special_char_count"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--validate-password.special-char-count=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="validate-password-options-variables.html#sysvar_validate_password.special_char_count">validate_password.special_char_count</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">1</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr></tbody></table>

  The minimum number of nonalphanumeric characters that `validate_password` requires passwords to have if the password policy is `MEDIUM` or stronger. This variable is unavailable unless `validate_password` is installed.

##### Password Validation Component Status Variables

If the `validate_password` component is enabled, it exposes status variables that provide operational information:

```
mysql> SHOW STATUS LIKE 'validate_password.%';
+-----------------------------------------------+---------------------+
| Variable_name                                 | Value               |
+-----------------------------------------------+---------------------+
| validate_password.dictionary_file_last_parsed | 2019-10-03 08:33:49 |
| validate_password.dictionary_file_words_count | 1902                |
+-----------------------------------------------+---------------------+
```

The following list describes the meaning of each status variable.

* `validate_password.dictionary_file_last_parsed`

  When the dictionary file was last parsed. This variable is unavailable unless `validate_password` is installed.

* `validate_password.dictionary_file_words_count`

  The number of words read from the dictionary file. This variable is unavailable unless `validate_password` is installed.

##### Password Validation Plugin Options

Note

In MySQL 9.5, the `validate_password` plugin was reimplemented as the `validate_password` component. The `validate_password` plugin is deprecated; expect it to be removed in a future version of MySQL. Consequently, its options are also deprecated, and you should expect them to be removed as well. MySQL installations that use the plugin should make the transition to using the component instead. See Section 8.4.4.3, “Transitioning to the Password Validation Component”.

To control activation of the `validate_password` plugin, use this option:

* `--validate-password[=value]`

  <table frame="box" rules="all" summary="Properties for validate-password"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--validate-password[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">ON</code></p><p class="valid-value"><code class="literal">OFF</code></p><p class="valid-value"><code class="literal">FORCE</code></p><p class="valid-value"><code class="literal">FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  This option controls how the server loads the deprecated `validate_password` plugin at startup. The value should be one of those available for plugin-loading options, as described in Section 7.6.1, “Installing and Uninstalling Plugins”. For example, `--validate-password=FORCE_PLUS_PERMANENT` tells the server to load the plugin at startup and prevents it from being removed while the server is running.

  This option is available only if the `validate_password` plugin has been previously registered with `INSTALL PLUGIN` or is loaded with `--plugin-load-add`. See Section 8.4.4.1, “Password Validation Component Installation and Uninstallation”.

##### Password Validation Plugin System Variables

Note

In MySQL 9.5, the `validate_password` plugin was reimplemented as the `validate_password` component. The `validate_password` plugin is deprecated; expect it to be removed in a future version of MySQL. Consequently, its system variables are also deprecated and you should expect them to be removed as well. Use the corresponding system variables of the `validate_password` component instead; see Password Validation Component System Variables. MySQL installations that use the plugin should make the transition to using the component instead. See Section 8.4.4.3, “Transitioning to the Password Validation Component”.

* `validate_password_check_user_name`

  <table frame="box" rules="all" summary="Properties for validate_password.check_user_name"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--validate-password.check-user-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="validate-password-options-variables.html#sysvar_validate_password.check_user_name">validate_password.check_user_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>

  This `validate_password` plugin system variable is deprecated; expect it to be removed in a future version of MySQL. Use the corresponding `validate_password.check_user_name` system variable of the `validate_password` component instead.

* `validate_password_dictionary_file`

  <table frame="box" rules="all" summary="Properties for validate_password.check_user_name"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--validate-password.check-user-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="validate-password-options-variables.html#sysvar_validate_password.check_user_name">validate_password.check_user_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>

  This `validate_password` plugin system variable is deprecated; expect it to be removed in a future version of MySQL. Use the corresponding `validate_password.dictionary_file` system variable of the `validate_password` component instead.

* `validate_password_length`

  <table frame="box" rules="all" summary="Properties for validate_password.check_user_name"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--validate-password.check-user-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="validate-password-options-variables.html#sysvar_validate_password.check_user_name">validate_password.check_user_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>

  This `validate_password` plugin system variable is deprecated; expect it to be removed in a future version of MySQL. Use the corresponding `validate_password.length` system variable of the `validate_password` component instead.

* `validate_password_mixed_case_count`

  <table frame="box" rules="all" summary="Properties for validate_password.check_user_name"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--validate-password.check-user-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="validate-password-options-variables.html#sysvar_validate_password.check_user_name">validate_password.check_user_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>

  This `validate_password` plugin system variable is deprecated; expect it to be removed in a future version of MySQL. Use the corresponding `validate_password.mixed_case_count` system variable of the `validate_password` component instead.

* `validate_password_number_count`

  <table frame="box" rules="all" summary="Properties for validate_password.check_user_name"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--validate-password.check-user-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="validate-password-options-variables.html#sysvar_validate_password.check_user_name">validate_password.check_user_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>

  This `validate_password` plugin system variable is deprecated; expect it to be removed in a future version of MySQL. Use the corresponding `validate_password.number_count` system variable of the `validate_password` component instead.

* `validate_password_policy`

  <table frame="box" rules="all" summary="Properties for validate_password.check_user_name"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--validate-password.check-user-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="validate-password-options-variables.html#sysvar_validate_password.check_user_name">validate_password.check_user_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>

  This `validate_password` plugin system variable is deprecated; expect it to be removed in a future version of MySQL. Use the corresponding `validate_password.policy` system variable of the `validate_password` component instead.

* `validate_password_special_char_count`

  <table frame="box" rules="all" summary="Properties for validate_password.check_user_name"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--validate-password.check-user-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="validate-password-options-variables.html#sysvar_validate_password.check_user_name">validate_password.check_user_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr></tbody></table>

  This `validate_password` plugin system variable is deprecated; expect it to be removed in a future version of MySQL. Use the corresponding `validate_password.special_char_count` system variable of the `validate_password` component instead.

##### Password Validation Plugin Status Variables

Note

In MySQL 9.5, the `validate_password` plugin was reimplemented as the `validate_password` component. The `validate_password` plugin is deprecated; expect it to be removed in a future version of MySQL. Consequently, its status variables are also deprecated; expect it to be removed. Use the corresponding status variables of the `validate_password` component; see Password Validation Component Status Variables. MySQL installations that use the plugin should make the transition to using the component instead. See Section 8.4.4.3, “Transitioning to the Password Validation Component”.

* `validate_password_dictionary_file_last_parsed`

  This `validate_password` plugin status variable is deprecated; expect it to be removed in a future version of MySQL. Use the corresponding `validate_password.dictionary_file_last_parsed` status variable of the `validate_password` component instead.

* `validate_password_dictionary_file_words_count`

  This `validate_password` plugin status variable is deprecated; expect it to be removed in a future version of MySQL. Use the corresponding `validate_password.dictionary_file_words_count` status variable of the `validate_password` component instead.
