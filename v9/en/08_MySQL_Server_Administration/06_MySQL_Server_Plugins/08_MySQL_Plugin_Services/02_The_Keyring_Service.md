#### 7.6.8.2 The Keyring Service

MySQL Server supports a keyring service that enables internal components and plugins to securely store sensitive information for later retrieval. MySQL distributions provide a keyring interface that is accessible at two levels:

* At the SQL level, as a set of loadable functions that each map onto calls to the service routines.

* As a C language interface, callable as a plugin service from server plugins or loadable functions.

This section describes how to use the keyring service functions to store, retrieve, and remove keys in the MySQL keyring keystore. For information about the SQL interface that uses functions, Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”. For general keyring information, see Section 8.4.5, “The MySQL Keyring”.

The keyring service uses whatever underlying keyring plugin is enabled, if any. If no keyring plugin is enabled, keyring service calls fail.

A “record” in the keystore consists of data (the key itself) and a unique identifier through which the key is accessed. The identifier has two parts:

* `key_id`: The key ID or name. `key_id` values that begin with `mysql_` are reserved by MySQL Server.

* `user_id`: The session effective user ID. If there is no user context, this value can be `NULL`. The value need not actually be a “user”; the meaning depends on the application.

  Functions that implement the keyring function interface pass the value of `CURRENT_USER()` as the `user_id` value to keyring service functions.

The keyring service functions have these characteristics in common:

* Each function returns 0 for success, 1 for failure.
* The `key_id` and `user_id` arguments form a unique combination indicating which key in the keyring to use.

* The `key_type` argument provides additional information about the key, such as its encryption method or intended use.

* Keyring service functions treat key IDs, user names, types, and values as binary strings, so comparisons are case-sensitive. For example, IDs of `MyKey` and `mykey` refer to different keys.

These keyring service functions are available:

* `my_key_fetch()`

  Deobfuscates and retrieves a key from the keyring, along with its type. The function allocates the memory for the buffers used to store the returned key and key type. The caller should zero or obfuscate the memory when it is no longer needed, then free it.

  Syntax:

  ```
  bool my_key_fetch(const char *key_id, const char **key_type,
                    const char* user_id, void **key, size_t *key_len)
  ```

  Arguments:

  + `key_id`, `user_id`: Null-terminated strings that as a pair form a unique identifier indicating which key to fetch.

  + `key_type`: The address of a buffer pointer. The function stores into it a pointer to a null-terminated string that provides additional information about the key (stored when the key was added).

  + `key`: The address of a buffer pointer. The function stores into it a pointer to the buffer containing the fetched key data.

  + `key_len`: The address of a variable into which the function stores the size in bytes of the `*key` buffer.

  Return value:

  Returns 0 for success, 1 for failure.

* `my_key_generate()`

  Generates a new random key of a given type and length and stores it in the keyring. The key has a length of `key_len` and is associated with the identifier formed from `key_id` and `user_id`. The type and length values must be consistent with the values supported by the underlying keyring plugin. See Section 8.4.5.13, “Supported Keyring Key Types and Lengths”.

  Syntax:

  ```
  bool my_key_generate(const char *key_id, const char *key_type,
                       const char *user_id, size_t key_len)
  ```

  Arguments:

  + `key_id`, `user_id`: Null-terminated strings that as a pair form a unique identifier for the key to be generated.

  + `key_type`: A null-terminated string that provides additional information about the key.

  + `key_len`: The size in bytes of the key to be generated.

  Return value:

  Returns 0 for success, 1 for failure.

* `my_key_remove()`

  Removes a key from the keyring.

  Syntax:

  ```
  bool my_key_remove(const char *key_id, const char* user_id)
  ```

  Arguments:

  + `key_id`, `user_id`: Null-terminated strings that as a pair form a unique identifier for the key to be removed.

  Return value:

  Returns 0 for success, 1 for failure.

* `my_key_store()`

  Obfuscates and stores a key in the keyring.

  Syntax:

  ```
  bool my_key_store(const char *key_id, const char *key_type,
                    const char* user_id, void *key, size_t key_len)
  ```

  Arguments:

  + `key_id`, `user_id`: Null-terminated strings that as a pair form a unique identifier for the key to be stored.

  + `key_type`: A null-terminated string that provides additional information about the key.

  + `key`: The buffer containing the key data to be stored.

  + `key_len`: The size in bytes of the `key` buffer.

  Return value:

  Returns 0 for success, 1 for failure.
