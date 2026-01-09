#### 8.4.5.16 Plugin-Specific Keyring Key-Management Functions

For each keyring plugin-specific function, this section describes its purpose, calling sequence, and return value. For information about general-purpose keyring functions, see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”.

* `keyring_aws_rotate_cmk()`

  Associated keyring plugin: `keyring_aws`

  Note

  `keyring_aws_rotate_cmk()` is not provided by the AWS keyring component. For this reason, the function should be considered deprecated and thus subject to removal in a future version of MySQL.

  `keyring_aws_rotate_cmk()` rotates the AWS KMS key. Rotation changes only the key that AWS KMS uses for subsequent data key-encryption operations. AWS KMS maintains previous CMK versions, so keys generated using previous CMKs remain decryptable after rotation.

  Rotation changes the CMK value used inside AWS KMS but does not change the ID used to refer to it, so there is no need to change the `keyring_aws_cmk_id` system variable after calling `keyring_aws_rotate_cmk()`.

  This function requires the `SUPER` privilege.

  Arguments:

  None.

  Return value:

  Returns 1 for success, or `NULL` and an error for failure.

* `keyring_aws_rotate_keys()`

  Associated keyring plugin: `keyring_aws`

  Note

  `keyring_aws_rotate_keys()` is not provided by the AWS keyring component. For this reason, the function should be considered deprecated and thus subject to removal in a future version of MySQL.

  `keyring_aws_rotate_keys()` rotates keys stored in the `keyring_aws` storage file named by the `keyring_aws_data_file` system variable. Rotation sends each key stored in the file to AWS KMS for re-encryption using the value of the `keyring_aws_cmk_id` system variable as the CMK value, and stores the new encrypted keys in the file.

  `keyring_aws_rotate_keys()` is useful for key re-encryption under these circumstances:

  + After rotating the CMK; that is, after invoking the `keyring_aws_rotate_cmk()` function.

  + After changing the `keyring_aws_cmk_id` system variable to a different key value.

  This function requires the `SUPER` privilege.

  Arguments:

  None.

  Return value:

  Returns 1 for success, or `NULL` and an error for failure.

* `keyring_hashicorp_update_config()`

  Associated keyring plugin: `keyring_hashicorp`

  Note

  `keyring_hashicorp_update_config()` is not provided by the HashiCorp keyring component. For this reason, the function should be considered deprecated and thus subject to removal in a future version of MySQL.

  When invoked, the `keyring_hashicorp_update_config()` function causes `keyring_hashicorp` to perform a runtime reconfiguration, as described in keyring_hashicorp Configuration.

  This function requires the `SYSTEM_VARIABLES_ADMIN` privilege because it modifies global system variables.

  Arguments:

  None.

  Return value:

  Returns the string `'Configuration update was successful.'` for success, or `'Configuration update failed.'` for failure.
