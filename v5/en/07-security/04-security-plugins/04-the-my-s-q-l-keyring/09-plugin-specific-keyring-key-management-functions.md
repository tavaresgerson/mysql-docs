#### 6.4.4.9 Plugin-Specific Keyring Key-Management Functions

For each keyring plugin-specific function, this section describes its purpose, calling sequence, and return value. For information about general-purpose keyring functions, see [Section 6.4.4.8, “General-Purpose Keyring Key-Management Functions”](keyring-functions-general-purpose.html "6.4.4.8 General-Purpose Keyring Key-Management Functions").

* [`keyring_aws_rotate_cmk()`](keyring-functions-plugin-specific.html#function_keyring-aws-rotate-cmk)

  Associated keyring plugin: `keyring_aws`

  [`keyring_aws_rotate_cmk()`](keyring-functions-plugin-specific.html#function_keyring-aws-rotate-cmk) rotates the customer master key (CMK). Rotation changes only the key that AWS KMS uses for subsequent data key-encryption operations. AWS KMS maintains previous CMK versions, so keys generated using previous CMKs remain decryptable after rotation.

  Rotation changes the CMK value used inside AWS KMS but does not change the ID used to refer to it, so there is no need to change the [`keyring_aws_cmk_id`](keyring-system-variables.html#sysvar_keyring_aws_cmk_id) system variable after calling [`keyring_aws_rotate_cmk()`](keyring-functions-plugin-specific.html#function_keyring-aws-rotate-cmk).

  This function requires the [`SUPER`](privileges-provided.html#priv_super) privilege.

  Arguments:

  None.

  Return value:

  Returns 1 for success, or `NULL` and an error for failure.

* [`keyring_aws_rotate_keys()`](keyring-functions-plugin-specific.html#function_keyring-aws-rotate-keys)

  Associated keyring plugin: `keyring_aws`

  [`keyring_aws_rotate_keys()`](keyring-functions-plugin-specific.html#function_keyring-aws-rotate-keys) rotates keys stored in the `keyring_aws` storage file named by the [`keyring_aws_data_file`](keyring-system-variables.html#sysvar_keyring_aws_data_file) system variable. Rotation sends each key stored in the file to AWS KMS for re-encryption using the value of the [`keyring_aws_cmk_id`](keyring-system-variables.html#sysvar_keyring_aws_cmk_id) system variable as the CMK value, and stores the new encrypted keys in the file.

  [`keyring_aws_rotate_keys()`](keyring-functions-plugin-specific.html#function_keyring-aws-rotate-keys) is useful for key re-encryption under these circumstances:

  + After rotating the CMK; that is, after invoking the [`keyring_aws_rotate_cmk()`](keyring-functions-plugin-specific.html#function_keyring-aws-rotate-cmk) function.

  + After changing the [`keyring_aws_cmk_id`](keyring-system-variables.html#sysvar_keyring_aws_cmk_id) system variable to a different key value.

  This function requires the [`SUPER`](privileges-provided.html#priv_super) privilege.

  Arguments:

  None.

  Return value:

  Returns 1 for success, or `NULL` and an error for failure.
