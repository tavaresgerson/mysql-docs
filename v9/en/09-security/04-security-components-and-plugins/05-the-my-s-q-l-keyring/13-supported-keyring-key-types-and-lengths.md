#### 8.4.5.13 Supported Keyring Key Types and Lengths

MySQL Keyring supports keys of different types (encryption algorithms) and lengths:

* The available key types depend on which keyring plugin is installed.

* The permitted key lengths are subject to multiple factors:

  + General keyring loadable-function interface limits (for keys managed using one of the keyring functions described in Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”), or limits from back end implementations. These length limits can vary by key operation type.

  + In addition to the general limits, individual keyring plugins may impose restrictions on key lengths per key type.

Table 8.32, “General Keyring Key Length Limits” shows the general key-length limits. (The lower limits for `keyring_aws` are imposed by the AWS KMS interface, not the keyring functions.) For keyring plugins, Table 8.33, “Keyring Plugin Key Types and Lengths” shows the key types each keyring plugin permits, as well as any plugin-specific key-length restrictions. For most keyring components, the general key-length limits apply and there are no key-type restrictions.

Note

`component_keyring_oci` can generate keys of type `AES` with a size of 16, 24, or 32 bytes only.

**Table 8.32 General Keyring Key Length Limits**

<table summary="General limits on keyring key lengths."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Key Operation</th> <th>Maximum Key Length</th> </tr></thead><tbody><tr> <td>Generate key</td> <td><p class="valid-value"> 16,384 bytes (2,048 previously); 1,024 for <code class="literal">keyring_aws</code> </p></td> </tr><tr> <td>Store key</td> <td><p class="valid-value"> 16,384 bytes (2,048 previously); 4,096 for <code class="literal">keyring_aws</code> </p></td> </tr><tr> <td>Fetch key</td> <td><p class="valid-value"> 16,384 bytes (2,048 previously); 4,096 for <code class="literal">keyring_aws</code> </p></td> </tr></tbody></table>

**Table 8.33 Keyring Plugin Key Types and Lengths**

<table summary="Key types and lengths supported by keyring plugins."><col style="width: 30%"/><col style="width: 25%"/><col style="width: 45%"/><thead><tr> <th scope="col">Plugin Name</th> <th scope="col">Permitted Key Type</th> <th scope="col">Plugin-Specific Length Restrictions</th> </tr></thead><tbody><tr> <th scope="row" valign="top"><code class="literal">keyring_aws</code></th> <td><p class="valid-value"> <code class="literal">AES</code> </p><p class="valid-value"> <code class="literal">SECRET</code> </p></td> <td><p class="valid-value"> 16, 24, or 32 bytes </p><p class="valid-value"> None </p></td> </tr><tr> <th scope="row" valign="top"><code class="literal">keyring_hashicorp</code></th> <td><p class="valid-value"> <code class="literal">AES</code> </p><p class="valid-value"> <code class="literal">DSA</code> </p><p class="valid-value"> <code class="literal">RSA</code> </p><p class="valid-value"> <code class="literal">SECRET</code> </p></td> <td><p class="valid-value"> None </p><p class="valid-value"> None </p><p class="valid-value"> None </p><p class="valid-value"> None </p></td> </tr><tr> <th scope="row" valign="top"><code class="literal">keyring_okv</code></th> <td><p class="valid-value"> <code class="literal">AES</code> </p><p class="valid-value"> <code class="literal">SECRET</code> </p></td> <td><p class="valid-value"> 16, 24, or 32 bytes </p><p class="valid-value"> None </p></td> </tr></tbody></table>

The `SECRET` key type is intended for general-purpose storage of sensitive data using the MySQL keyring, and is supported by most keyring components and keyring plugins. The keyring encrypts and decrypts `SECRET` data as a byte stream upon storage and retrieval.

Example keyring operations involving the `SECRET` key type:

```
SELECT keyring_key_generate('MySecret1', 'SECRET', 20);
SELECT keyring_key_remove('MySecret1');

SELECT keyring_key_store('MySecret2', 'SECRET', 'MySecretData');
SELECT keyring_key_fetch('MySecret2');
SELECT keyring_key_length_fetch('MySecret2');
SELECT keyring_key_type_fetch('MySecret2');
SELECT keyring_key_remove('MySecret2');
```
