### 6.6.1 Instalação da Encriptação do MySQL Enterprise

As funções de criptografia do MySQL Enterprise estão localizadas em um arquivo de biblioteca de funções carregável instalado no diretório do plugin (o diretório nomeado pela variável de sistema `plugin_dir`). O nome da base da biblioteca de funções é `openssl_udf` e o sufixo depende da plataforma. Por exemplo, o nome do arquivo no Linux ou no Windows é `openssl_udf.so` ou `openssl_udf.dll`, respectivamente.

Para instalar funções do arquivo da biblioteca, use a instrução `CREATE FUNCTION`. Para carregar todas as funções da biblioteca, use este conjunto de instruções, ajustando o sufixo do nome do arquivo conforme necessário:

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

Uma vez instalado, as funções permanecem instaladas após a reinicialização do servidor. Para desativar as funções, use a instrução `DROP FUNCTION`:

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

Nas instruções `CREATE FUNCTION` e `DROP FUNCTION`, os nomes das funções devem ser especificados em minúsculas. Isso difere do uso deles no momento da invocação da função, para o qual você pode usar qualquer caso de letra.

As instruções `CREATE FUNCTION` e `DROP FUNCTION` exigem os privilégios `INSERT` e `DROP`, respectivamente, para o banco de dados `mysql`.
