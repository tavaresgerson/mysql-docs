#### 8.4.4.16 Keyring System Variables

MySQL Keyring plugins support the following system variables. Use them to configure keyring plugin operation. These variables are unavailable unless the appropriate keyring plugin is installed (see  Section 8.4.4.3, “Keyring Plugin Installation”).

*  `keyring_aws_cmk_id`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-cmk-id=value</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_cmk_id</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The KMS key ID obtained from the AWS KMS server and used by the `keyring_aws` plugin. This variable is unavailable unless that plugin is installed.

  This variable is mandatory. If not specified, `keyring_aws` initialization fails.
*  `keyring_aws_conf_file`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-conf-file=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_conf_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>

  The location of the configuration file for the `keyring_aws` plugin. This variable is unavailable unless that plugin is installed.

  At plugin startup, `keyring_aws` reads the AWS secret access key ID and key from the configuration file. For the `keyring_aws` plugin to start successfully, the configuration file must exist and contain valid secret access key information, initialized as described in  Section 8.4.4.7, “Using the keyring\_aws Amazon Web Services Keyring Plugin”.

  The default file name is `keyring_aws_conf`, located in the default keyring file directory.
*  `keyring_aws_data_file`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-data-file</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_data_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>

  The location of the storage file for the `keyring_aws` plugin. This variable is unavailable unless that plugin is installed.

  At plugin startup, if the value assigned to `keyring_aws_data_file` specifies a file that does not exist, the `keyring_aws` plugin attempts to create it (as well as its parent directory, if necessary). If the file does exist, `keyring_aws` reads any encrypted keys contained in the file into its in-memory cache. `keyring_aws` does not cache unencrypted keys in memory.

  The default file name is `keyring_aws_data`, located in the default keyring file directory.
*  `keyring_aws_region`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-region=value</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_region</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>us-east-1</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>af-south-1</code></p><p class="valid-value"><code>ap-east-1</code></p><p class="valid-value"><code>ap-northeast-1</code></p><p class="valid-value"><code>ap-northeast-2</code></p><p class="valid-value"><code>ap-northeast-3</code></p><p class="valid-value"><code>ap-south-1</code></p><p class="valid-value"><code>ap-southeast-1</code></p><p class="valid-value"><code>ap-southeast-2</code></p><p class="valid-value"><code>ca-central-1</code></p><p class="valid-value"><code>cn-north-1</code></p><p class="valid-value"><code>cn-northwest-1</code></p><p class="valid-value"><code>eu-central-1</code></p><p class="valid-value"><code>eu-north-1</code></p><p class="valid-value"><code>eu-south-1</code></p><p class="valid-value"><code>eu-west-1</code></p><p class="valid-value"><code>eu-west-2</code></p><p class="valid-value"><code>eu-west-3</code></p><p class="valid-value"><code>me-south-1</code></p><p class="valid-value"><code>sa-east-1</code></p><p class="valid-value"><code>us-east-1</code></p><p class="valid-value"><code>us-east-2</code></p><p class="valid-value"><code>us-gov-east-1</code></p><p class="valid-value"><code>us-iso-east-1</code></p><p class="valid-value"><code>us-iso-west-1</code></p><p class="valid-value"><code>us-isob-east-1</code></p><p class="valid-value"><code>us-west-1</code></p><p class="valid-value"><code>us-west-2</code></p></td> </tr></tbody></table>

  The AWS region for the `keyring_aws` plugin. This variable is unavailable unless that plugin is installed.

  If not set, the AWS region defaults to `us-east-1`. Thus, for any other region, this variable must be set explicitly.
*  `keyring_hashicorp_auth_path`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-hashicorp-auth-path=value</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_hashicorp_auth_path</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>/v1/auth/approle/login</code></td> </tr></tbody></table>

  The authentication path where AppRole authentication is enabled within the HashiCorp Vault server, for use by the `keyring_hashicorp` plugin. This variable is unavailable unless that plugin is installed.
*  `keyring_hashicorp_ca_path`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-hashicorp-ca-path=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_hashicorp_ca_path</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>empty string</code></td> </tr></tbody></table>

  The absolute path name of a local file accessible to the MySQL server that contains a properly formatted TLS certificate authority for use by the `keyring_hashicorp` plugin. This variable is unavailable unless that plugin is installed.

  If this variable is not set, the `keyring_hashicorp` plugin opens an HTTPS connection without using server certificate verification, and trusts any certificate delivered by the HashiCorp Vault server. For this to be safe, it must be assumed that the Vault server is not malicious and that no man-in-the-middle attack is possible. If those assumptions are invalid, set `keyring_hashicorp_ca_path` to the path of a trusted CA certificate. (For example, for the instructions in Certificate and Key Preparation, this is the `company.crt` file.)
*  `keyring_hashicorp_caching`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-hashicorp-caching[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_hashicorp_caching</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Whether to enable the optional in-memory key cache used by the `keyring_hashicorp` plugin to cache keys from the HashiCorp Vault server. This variable is unavailable unless that plugin is installed. If the cache is enabled, the plugin populates it during initialization. Otherwise, the plugin populates only the key list during initialization.

  Enabling the cache is a compromise: It improves performance, but maintains a copy of sensitive key information in memory, which may be undesirable for security purposes.
*  `keyring_hashicorp_commit_auth_path`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>keyring_hashicorp_commit_auth_path</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  This variable is associated with `keyring_hashicorp_auth_path`, from which it takes its value during `keyring_hashicorp` plugin initialization. This variable is unavailable unless that plugin is installed. It reflects the “committed” value actually used for plugin operation if initialization succeeds. For additional information, see keyring\_hashicorp Configuration.
*  `keyring_hashicorp_commit_ca_path`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>keyring_hashicorp_commit_ca_path</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  This variable is associated with `keyring_hashicorp_ca_path`, from which it takes its value during `keyring_hashicorp` plugin initialization. This variable is unavailable unless that plugin is installed. It reflects the “committed” value actually used for plugin operation if initialization succeeds. For additional information, see keyring\_hashicorp Configuration.
*  `keyring_hashicorp_commit_caching`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>keyring_hashicorp_commit_caching</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  This variable is associated with `keyring_hashicorp_caching`, from which it takes its value during `keyring_hashicorp` plugin initialization. This variable is unavailable unless that plugin is installed. It reflects the “committed” value actually used for plugin operation if initialization succeeds. For additional information, see keyring\_hashicorp Configuration.
*  `keyring_hashicorp_commit_role_id`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>keyring_hashicorp_commit_role_id</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  This variable is associated with `keyring_hashicorp_role_id`, from which it takes its value during `keyring_hashicorp` plugin initialization. This variable is unavailable unless that plugin is installed. It reflects the “committed” value actually used for plugin operation if initialization succeeds. For additional information, see keyring\_hashicorp Configuration.
*  `keyring_hashicorp_commit_server_url`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>keyring_hashicorp_commit_server_url</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  This variable is associated with `keyring_hashicorp_server_url`, from which it takes its value during `keyring_hashicorp` plugin initialization. This variable is unavailable unless that plugin is installed. It reflects the “committed” value actually used for plugin operation if initialization succeeds. For additional information, see keyring\_hashicorp Configuration.
*  `keyring_hashicorp_commit_store_path`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>keyring_hashicorp_commit_store_path</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  This variable is associated with `keyring_hashicorp_store_path`, from which it takes its value during `keyring_hashicorp` plugin initialization. This variable is unavailable unless that plugin is installed. It reflects the “committed” value actually used for plugin operation if initialization succeeds. For additional information, see keyring\_hashicorp Configuration.
*  `keyring_hashicorp_role_id`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-hashicorp-role-id=value</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_hashicorp_role_id</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>empty string</code></td> </tr></tbody></table>

  The HashiCorp Vault AppRole authentication role ID, for use by the `keyring_hashicorp` plugin. This variable is unavailable unless that plugin is installed. The value must be in UUID format.

  This variable is mandatory. If not specified, `keyring_hashicorp` initialization fails.
*  `keyring_hashicorp_secret_id`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-hashicorp-secret-id=value</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_hashicorp_secret_id</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>empty string</code></td> </tr></tbody></table>

  The HashiCorp Vault AppRole authentication secret ID, for use by the `keyring_hashicorp` plugin. This variable is unavailable unless that plugin is installed. The value must be in UUID format.

  This variable is mandatory. If not specified, `keyring_hashicorp` initialization fails.

  The value of this variable is sensitive, so its value is masked by `*` characters when displayed.
*  `keyring_hashicorp_server_url`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-hashicorp-server-url=value</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_hashicorp_server_url</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>https://127.0.0.1:8200</code></td> </tr></tbody></table>

  The HashiCorp Vault server URL, for use by the `keyring_hashicorp` plugin. This variable is unavailable unless that plugin is installed. The value must begin with `https://`.
*  `keyring_hashicorp_store_path`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-hashicorp-store-path=value</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_hashicorp_store_path</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>empty string</code></td> </tr></tbody></table>

  A store path within the HashiCorp Vault server that is writeable when appropriate AppRole credentials are provided by the `keyring_hashicorp` plugin. This variable is unavailable unless that plugin is installed. To specify the credentials, set the `keyring_hashicorp_role_id` and `keyring_hashicorp_secret_id` system variables (for example, as shown in keyring\_hashicorp Configuration).

  This variable is mandatory. If not specified, `keyring_hashicorp` initialization fails.
*  `keyring_okv_conf_dir`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-okv-conf-dir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_okv_conf_dir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>empty string</code></td> </tr></tbody></table>

  The path name of the directory that stores configuration information used by the `keyring_okv` plugin. This variable is unavailable unless that plugin is installed. The location should be a directory considered for use only by the `keyring_okv` plugin. For example, do not locate the directory under the data directory.

  The default `keyring_okv_conf_dir` value is empty. For the `keyring_okv` plugin to be able to access Oracle Key Vault, the value must be set to a directory that contains Oracle Key Vault configuration and SSL materials. For instructions on setting up this directory, see  Section 8.4.4.6, “Using the keyring\_okv KMIP Plugin”.

  The directory should have a restrictive mode and be accessible only to the account used to run the MySQL server. For example, on Unix and Unix-like systems, to use the `/usr/local/mysql/mysql-keyring-okv` directory, the following commands (executed as `root`) create the directory and set its mode and ownership:

  ```
  cd /usr/local/mysql
  mkdir mysql-keyring-okv
  chmod 750 mysql-keyring-okv
  chown mysql mysql-keyring-okv
  chgrp mysql mysql-keyring-okv
  ```

  If the value assigned to `keyring_okv_conf_dir` specifies a directory that does not exist, or that does not contain configuration information that enables a connection to Oracle Key Vault to be established, `keyring_okv` writes an error message to the error log. If an attempted runtime assignment to `keyring_okv_conf_dir` results in an error, the variable value and keyring operation remain unchanged.
*  `keyring_operations`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>keyring_operations</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  Whether keyring operations are enabled. This variable is used during key migration operations. See Section 8.4.4.11, “Migrating Keys Between Keyring Keystores”. The privileges required to modify this variable are `ENCRYPTION_KEY_ADMIN` in addition to either `SYSTEM_VARIABLES_ADMIN` or the deprecated  `SUPER` privilege.
