### 6.6.1 Instalação do MySQL Enterprise Encryption

As funções do MySQL Enterprise Encryption estão localizadas em um arquivo de biblioteca de funções carregável instalado no *plugin directory* (o diretório nomeado pela *system variable* [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir)). O nome base da biblioteca de funções é `openssl_udf` e o sufixo depende da plataforma. Por exemplo, o nome do arquivo no Linux ou Windows é `openssl_udf.so` ou `openssl_udf.dll`, respectivamente.

Para instalar funções a partir do arquivo de biblioteca, use a instrução [`CREATE FUNCTION`](create-function-loadable.html "13.7.3.1 CREATE FUNCTION Statement for Loadable Functions"). Para carregar todas as funções da biblioteca, use este conjunto de instruções, ajustando o sufixo do nome do arquivo conforme necessário:

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

Uma vez instaladas, as funções permanecem instaladas mesmo após reinicializações do servidor. Para descarregar as funções, use a instrução [`DROP FUNCTION`](drop-function-loadable.html "13.7.3.2 DROP FUNCTION Statement for Loadable Functions"):

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

Nas instruções [`CREATE FUNCTION`](create-function-loadable.html "13.7.3.1 CREATE FUNCTION Statement for Loadable Functions") e [`DROP FUNCTION`](drop-function-loadable.html "13.7.3.2 DROP FUNCTION Statement for Loadable Functions"), os nomes das funções devem ser especificados em minúsculas. Isso difere do seu uso no momento da invocação da função, para o qual você pode usar qualquer caixa de letra.

As instruções [`CREATE FUNCTION`](create-function-loadable.html "13.7.3.1 CREATE FUNCTION Statement for Loadable Functions") e [`DROP FUNCTION`](drop-function-loadable.html "13.7.3.2 DROP FUNCTION Statement for Loadable Functions") exigem o *privilege* [`INSERT`](privileges-provided.html#priv_insert) e [`DROP`](privileges-provided.html#priv_drop), respectivamente, para o *database* `mysql`.