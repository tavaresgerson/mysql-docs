### 6.6.1 MySQL Enterprise Encryption Installation

MySQL Enterprise Encryption functions are located in a loadable function library file installed in the plugin directory (the directory named by the [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) system variable). The function library base name is `openssl_udf` and the suffix is platform dependent. For example, the file name on Linux or Windows is `openssl_udf.so` or `openssl_udf.dll`, respectively.

To install functions from the library file, use the [`CREATE FUNCTION`](create-function-loadable.html "13.7.3.1 CREATE FUNCTION Statement for Loadable Functions") statement. To load all functions from the library, use this set of statements, adjusting the file name suffix as necessary:

```sql
CREATE FUNCTION asymmetric_decrypt RETURNS STRING
  SONAME 'openssl_udf.so';
CREATE FUNCTION asymmetric_derive RETURNS STRING
  SONAME 'openssl_udf.so';
CREATE FUNCTION asymmetric_encrypt RETURNS STRING
  SONAME 'openssl_udf.so';
CREATE FUNCTION asymmetric_sign RETURNS STRING
  SONAME 'openssl_udf.so';
CREATE FUNCTION asymmetric_verify RETURNS INTEGER
  SONAME 'openssl_udf.so';
CREATE FUNCTION create_asymmetric_priv_key RETURNS STRING
  SONAME 'openssl_udf.so';
CREATE FUNCTION create_asymmetric_pub_key RETURNS STRING
  SONAME 'openssl_udf.so';
CREATE FUNCTION create_dh_parameters RETURNS STRING
  SONAME 'openssl_udf.so';
CREATE FUNCTION create_digest RETURNS STRING
  SONAME 'openssl_udf.so';
```

Once installed, the functions remain installed across server restarts. To unload the functions, use the [`DROP FUNCTION`](drop-function-loadable.html "13.7.3.2 DROP FUNCTION Statement for Loadable Functions") statement:

```sql
DROP FUNCTION asymmetric_decrypt;
DROP FUNCTION asymmetric_derive;
DROP FUNCTION asymmetric_encrypt;
DROP FUNCTION asymmetric_sign;
DROP FUNCTION asymmetric_verify;
DROP FUNCTION create_asymmetric_priv_key;
DROP FUNCTION create_asymmetric_pub_key;
DROP FUNCTION create_dh_parameters;
DROP FUNCTION create_digest;
```

In the [`CREATE FUNCTION`](create-function-loadable.html "13.7.3.1 CREATE FUNCTION Statement for Loadable Functions") and [`DROP FUNCTION`](drop-function-loadable.html "13.7.3.2 DROP FUNCTION Statement for Loadable Functions") statements, the function names must be specified in lowercase. This differs from their use at function invocation time, for which you can use any lettercase.

The [`CREATE FUNCTION`](create-function-loadable.html "13.7.3.1 CREATE FUNCTION Statement for Loadable Functions") and [`DROP FUNCTION`](drop-function-loadable.html "13.7.3.2 DROP FUNCTION Statement for Loadable Functions") statements require the [`INSERT`](privileges-provided.html#priv_insert) and [`DROP`](privileges-provided.html#priv_drop) privilege, respectively, for the `mysql` database.
