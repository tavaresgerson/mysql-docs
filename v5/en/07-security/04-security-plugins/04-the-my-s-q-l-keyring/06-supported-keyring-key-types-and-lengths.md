#### 6.4.4.6 Supported Keyring Key Types and Lengths

MySQL Keyring supports keys of different types (encryption algorithms) and lengths:

* The available key types depend on which keyring plugin is installed.

* The permitted key lengths are subject to multiple factors:

  + General keyring loadable-function interface limits (for keys managed using one of the keyring functions described in [Section 6.4.4.8, “General-Purpose Keyring Key-Management Functions”](keyring-functions-general-purpose.html "6.4.4.8 General-Purpose Keyring Key-Management Functions")), or limits from back end implementations. These length limits can vary by key operation type.

  + In addition to the general limits, individual keyring plugins may impose restrictions on key lengths per key type.

[Table 6.23, “General Keyring Key Length Limits”](keyring-key-types.html#keyring-general-key-length-limits-table "Table 6.23 General Keyring Key Length Limits") shows the general key-length limits. (The lower limits for `keyring_aws` are imposed by the AWS KMS interface, not the keyring functions.) [Table 6.24, “Keyring Plugin Key Types and Lengths”](keyring-key-types.html#keyring-key-types-table "Table 6.24 Keyring Plugin Key Types and Lengths") shows the key types each keyring plugin permits, as well as any plugin-specific key-length restrictions.

**Table 6.23 General Keyring Key Length Limits**

<table summary="General limits on keyring key lengths."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Key Operation</th> <th>Maximum Key Length</th> </tr></thead><tbody><tr> <td>Generate key</td> <td><p class="valid-value"> 2,048 bytes; 1,024 for <code>keyring_aws</code> </p></td> </tr><tr> <td>Store key</td> <td><p class="valid-value"> 2,048 bytes </p></td> </tr><tr> <td>Fetch key</td> <td><p class="valid-value"> 2,048 bytes </p></td> </tr></tbody></table>

**Table 6.24 Keyring Plugin Key Types and Lengths**

<table summary="Key types and lengths supported by keyring plugins."><col style="width: 30%"/><col style="width: 25%"/><col style="width: 45%"/><thead><tr> <th>Plugin Name</th> <th>Permitted Key Type</th> <th>Plugin-Specific Length Restrictions</th> </tr></thead><tbody><tr> <th valign="top"><code>keyring_aws</code></th> <td><p class="valid-value"> <code>AES</code> </p></td> <td><p class="valid-value"> 16, 24, or 32 bytes </p></td> </tr><tr> <th valign="top"><code>keyring_encrypted_file</code></th> <td><p class="valid-value"> <code>AES</code> </p><p class="valid-value"> <code>DSA</code> </p><p class="valid-value"> <code>RSA</code> </p></td> <td><p class="valid-value"> None </p><p class="valid-value"> None </p><p class="valid-value"> None </p></td> </tr><tr> <th valign="top"><code>keyring_file</code></th> <td><p class="valid-value"> <code>AES</code> </p><p class="valid-value"> <code>DSA</code> </p><p class="valid-value"> <code>RSA</code> </p></td> <td><p class="valid-value"> None </p><p class="valid-value"> None </p><p class="valid-value"> None </p></td> </tr><tr> <th valign="top"><code>keyring_okv</code></th> <td><p class="valid-value"> <code>AES</code> </p></td> <td><p class="valid-value"> 16, 24, or 32 bytes </p></td> </tr></tbody></table>
