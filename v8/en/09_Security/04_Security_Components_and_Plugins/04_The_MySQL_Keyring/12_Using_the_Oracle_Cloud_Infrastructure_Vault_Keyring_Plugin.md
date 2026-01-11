#### 8.4.4.12 Using the Oracle Cloud Infrastructure Vault Keyring Plugin

Note

The `keyring_oci` plugin is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

The `keyring_oci` plugin is a keyring plugin that communicates with Oracle Cloud Infrastructure Vault for back end storage. No key information is permanently stored in MySQL server local storage. All keys are stored in Oracle Cloud Infrastructure Vault, making this plugin well suited for Oracle Cloud Infrastructure MySQL customers for management of their MySQL Enterprise Edition keys.

As of MySQL 8.0.31, this plugin is deprecated and subject to removal in a future release of MySQL. Instead, consider using the `component_keyring_oci` component for storing keyring data (see Section 8.4.4.11, “Using the Oracle Cloud Infrastructure Vault Keyring Component”).

The `keyring_oci` plugin supports the functions that comprise the standard MySQL Keyring service interface. Keyring operations performed by those functions are accessible at two levels:

* SQL interface: In SQL statements, call the functions described in Section 8.4.4.15, “General-Purpose Keyring Key-Management Functions”.

* C interface: In C-language code, call the keyring service functions described in Section 7.6.9.2, “The Keyring Service”.

Example (using the SQL interface):

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

For information about the characteristics of key values permitted by `keyring_oci`, see Section 8.4.4.13, “Supported Keyring Key Types and Lengths”.

To install `keyring_oci`, use the general instructions found in Section 8.4.4.3, “Keyring Plugin Installation”, together with the configuration information specific to `keyring_oci` found here. Plugin-specific configuration involves setting a number of system variables to indicate the names or values of Oracle Cloud Infrastructure resources.

You are assumed to be familiar with Oracle Cloud Infrastructure concepts, but the following documentation may be helpful when setting up resources to be used by the `keyring_oci` plugin:

* Overview of Vault

* Resource Identifiers

* Required Keys and OCIDs

* Managing Keys

* Managing Compartments

* Managing Vaults

* Managing Secrets

The `keyring_oci` plugin supports the configuration parameters shown in the following table. To specify these parameters, assign values to the corresponding system variables.

<table summary="keyring_oci configuration parameters and corresponding system variables."><thead><tr> <th scope="col">Configuration Parameter</th> <th scope="col">System Variable</th> <th scope="col">Mandatory</th> </tr></thead><tbody><tr> <th>User OCID</th> <td><code>keyring_oci_user</code></td> <td>Yes</td> </tr><tr> <th>Tenancy OCID</th> <td><code>keyring_oci_tenancy</code></td> <td>Yes</td> </tr><tr> <th>Compartment OCID</th> <td><code>keyring_oci_compartment</code></td> <td>Yes</td> </tr><tr> <th>Vault OCID</th> <td><code>keyring_oci_virtual_vault</code></td> <td>Yes</td> </tr><tr> <th>Master key OCID</th> <td><code>keyring_oci_master_key</code></td> <td>Yes</td> </tr><tr> <th>Encryption server endpoint</th> <td><code>keyring_oci_encryption_endpoint</code></td> <td>Yes</td> </tr><tr> <th>Key management server endpoint</th> <td><code>keyring_oci_management_endpoint</code></td> <td>Yes</td> </tr><tr> <th>Vaults server endpoint</th> <td><code>keyring_oci_vaults_endpoint</code></td> <td>Yes</td> </tr><tr> <th>Secrets server endpoint</th> <td><code>keyring_oci_secrets_endpoint</code></td> <td>Yes</td> </tr><tr> <th>RSA private key file</th> <td><code>keyring_oci_key_file</code></td> <td>Yes</td> </tr><tr> <th>RSA private key fingerprint</th> <td><code>keyring_oci_key_fingerprint</code></td> <td>Yes</td> </tr><tr> <th>CA certificate bundle file</th> <td><code>keyring_oci_ca_certificate</code></td> <td>No</td> </tr></tbody></table>

To be usable during the server startup process, `keyring_oci` must be loaded using the `--early-plugin-load` option. As indicated by the preceding table, several plugin-related system variables are mandatory and must also be set:

* Oracle Cloud Infrastructure uses Oracle Cloud IDs (OCIDs) extensively to designate resources, and several `keyring_oci` parameters specify OCID values of the resources to use. Consequently, prior to using the `keyring_oci` plugin, these prerequisites must be satisfied:

  + A user for connecting to Oracle Cloud Infrastructure must exist. Create the user if necessary and assign the user OCID to the `keyring_oci_user` system variable.

  + The Oracle Cloud Infrastructure tenancy to be used must exist, as well as the MySQL compartment within the tenancy, and the vault within the compartment. Create these resources if necessary and make sure the user is enabled to use them. Assign the OCIDs for the tenancy, compartment and vault to the `keyring_oci_tenancy`, `keyring_oci_compartment`, and `keyring_oci_virtual_vault` system variables.

  + A master key for encryption must exist. Create it if necessary and assign its OCID to the `keyring_oci_master_key` system variable.

* Several server endpoints must be specified. These endpoints are vault specific and Oracle Cloud Infrastructure assigns them at vault-creation time. Obtain their values from the vault details page and assign them to the `keyring_oci_encryption_endpoint`, `keyring_oci_management_endpoint`, `keyring_oci_vaults_endpoint`, and `keyring_oci_secrets_endpoint` system variables.

* The Oracle Cloud Infrastructure API uses an RSA private/public key pair for authentication. To create this key pair and obtain the key fingerprint, use the instructions at Required Keys and OCIDs. Assign the private key file name and key fingerprint to the `keyring_oci_key_file` and `keyring_oci_key_fingerprint` system variables.

In addition to the mandatory system variables, `keyring_oci_ca_certificate` optionally may be set to specify a certificate authority (CA) certificate bundle file for peer authentication. On Windows systems, this variable should be set to `disabled`, or to the path to a CA certificate bundle file.

Important

If you copy a parameter from the Oracle Cloud Infrastructure Console, the copied value may include an initial `https://` part. Omit that part when setting the corresponding `keyring_oci` system variable.

For example, to load and configure `keyring_oci`, use these lines in the server `my.cnf` file (adjust the `.so` suffix and file location for your platform as necessary):

```
[mysqld]
early-plugin-load=keyring_oci.so
keyring_oci_user=ocid1.user.oc1..longAlphaNumericString
keyring_oci_tenancy=ocid1.tenancy.oc1..longAlphaNumericString
keyring_oci_compartment=ocid1.compartment.oc1..longAlphaNumericString
keyring_oci_virtual_vault=ocid1.vault.oc1.iad.shortAlphaNumericString.longAlphaNumericString
keyring_oci_master_key=ocid1.key.oc1.iad.shortAlphaNumericString.longAlphaNumericString
keyring_oci_encryption_endpoint=shortAlphaNumericString-crypto.kms.us-ashburn-1.oraclecloud.com
keyring_oci_management_endpoint=shortAlphaNumericString-management.kms.us-ashburn-1.oraclecloud.com
keyring_oci_vaults_endpoint=vaults.us-ashburn-1.oci.oraclecloud.com
keyring_oci_secrets_endpoint=secrets.vaults.us-ashburn-1.oci.oraclecloud.com
keyring_oci_key_file=file_name
keyring_oci_key_fingerprint=12:34:56:78:90:ab:cd:ef:12:34:56:78:90:ab:cd:ef
```

For additional information about the `keyring_oci` plugin-specific system variables, see Section 8.4.4.19, “Keyring System Variables”.

The `keyring_oci` plugin does not support runtime reconfiguration and none of its system variables can be modified at runtime. To change configuration parameters, do this:

* Modify parameter settings in the `my.cnf` file, or use `SET PERSIST_ONLY` for parameters that are persisted to `mysqld-auto.conf`.

* Restart the server.
