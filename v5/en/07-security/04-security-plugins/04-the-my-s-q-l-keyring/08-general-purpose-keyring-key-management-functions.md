#### 6.4.4.8 Funções de Gerenciamento de Chaves Keyring de Propósito Geral

O MySQL Server oferece suporte a um service Keyring que permite que componentes internos do servidor e Plugins armazenem informações confidenciais de forma segura para recuperação posterior.

A partir do MySQL 5.7.13, o MySQL Server inclui uma interface SQL para gerenciamento de chaves Keyring, implementada como um conjunto de funções de propósito geral que acessam os recursos fornecidos pelo service Keyring interno. As funções Keyring estão contidas em um arquivo de biblioteca de Plugin, que também contém um Plugin `keyring_udf` que deve ser habilitado antes da invocação da função. Para que essas funções sejam usadas, um Plugin Keyring como `keyring_file` ou `keyring_okv` deve ser habilitado.

As funções descritas aqui são de propósito geral e destinadas ao uso com qualquer componente ou Plugin Keyring. Um determinado componente ou Plugin Keyring também pode fornecer funções próprias destinadas ao uso apenas com esse componente ou Plugin; consulte [Seção 6.4.4.9, “Funções de Gerenciamento de Chaves Keyring Específicas de Plugin”](keyring-functions-plugin-specific.html "6.4.4.9 Funções de Gerenciamento de Chaves Keyring Específicas de Plugin").

As seções a seguir fornecem instruções de instalação para as funções Keyring e demonstram como usá-las. Para obter informações sobre as funções do service Keyring invocadas por essas funções, consulte [Seção 5.5.6.2, “O Service Keyring”](keyring-service.html "5.5.6.2 O Service Keyring"). Para informações gerais sobre Keyring, consulte [Seção 6.4.4, “O Keyring MySQL”](keyring.html "6.4.4 O Keyring MySQL").

* [Instalando ou Desinstalando Funções Keyring de Propósito Geral](keyring-functions-general-purpose.html#keyring-function-installation "Instalando ou Desinstalando Funções Keyring de Propósito Geral")
* [Usando Funções Keyring de Propósito Geral](keyring-functions-general-purpose.html#keyring-function-usage "Usando Funções Keyring de Propósito Geral")
* [Referência de Funções Keyring de Propósito Geral](keyring-functions-general-purpose.html#keyring-function-reference "Referência de Funções Keyring de Propósito Geral")

##### Instalando ou Desinstalando Funções Keyring de Propósito Geral

Esta seção descreve como instalar ou desinstalar as funções Keyring, que são implementadas em um arquivo de biblioteca de Plugin que também contém um Plugin `keyring_udf`. Para obter informações gerais sobre como instalar ou desinstalar Plugins e funções carregáveis, consulte [Seção 5.5.1, “Instalando e Desinstalando Plugins”](plugin-loading.html "5.5.1 Instalando e Desinstalando Plugins") e [Seção 5.6.1, “Instalando e Desinstalando Funções Carregáveis”](function-loading.html "5.6.1 Instalando e Desinstalando Funções Carregáveis").

As funções Keyring habilitam operações de gerenciamento de chaves Keyring, mas o Plugin `keyring_udf` também deve ser instalado, pois as funções não funcionam corretamente sem ele. Tentativas de usar as funções sem o Plugin `keyring_udf` resultam em um erro.

Para ser utilizável pelo servidor, o arquivo de biblioteca do Plugin deve estar localizado no diretório de Plugins do MySQL (o diretório nomeado pela variável de sistema [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir)). Se necessário, configure a localização do diretório de Plugins definindo o valor de [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) na inicialização do servidor.

O nome base do arquivo de biblioteca do Plugin é `keyring_udf`. O sufixo do nome do arquivo difere por plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Para instalar o Plugin `keyring_udf` e as funções Keyring, use as instruções [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 Comando INSTALL PLUGIN") e [`CREATE FUNCTION`](create-function.html "13.1.13 Comando CREATE FUNCTION"), ajustando o sufixo `.so` para sua plataforma conforme necessário:

```sql
INSTALL PLUGIN keyring_udf SONAME 'keyring_udf.so';
CREATE FUNCTION keyring_key_generate RETURNS INTEGER
  SONAME 'keyring_udf.so';
CREATE FUNCTION keyring_key_fetch RETURNS STRING
  SONAME 'keyring_udf.so';
CREATE FUNCTION keyring_key_length_fetch RETURNS INTEGER
  SONAME 'keyring_udf.so';
CREATE FUNCTION keyring_key_type_fetch RETURNS STRING
  SONAME 'keyring_udf.so';
CREATE FUNCTION keyring_key_store RETURNS INTEGER
  SONAME 'keyring_udf.so';
CREATE FUNCTION keyring_key_remove RETURNS INTEGER
  SONAME 'keyring_udf.so';
```

Se o Plugin e as funções forem usados em um source replication server, instale-os em todas as replicas também para evitar problemas de replicação.

Uma vez instalados conforme descrito, o Plugin e as funções permanecem instalados até que sejam desinstalados. Para removê-los, use os comandos [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 Comando UNINSTALL PLUGIN") e [`DROP FUNCTION`](drop-function.html "13.1.24 Comando DROP FUNCTION"):

```sql
UNINSTALL PLUGIN keyring_udf;
DROP FUNCTION keyring_key_generate;
DROP FUNCTION keyring_key_fetch;
DROP FUNCTION keyring_key_length_fetch;
DROP FUNCTION keyring_key_type_fetch;
DROP FUNCTION keyring_key_store;
DROP FUNCTION keyring_key_remove;
```

##### Usando Funções Keyring de Propósito Geral

Antes de usar as funções de propósito geral Keyring, instale-as de acordo com as instruções fornecidas em [Instalando ou Desinstalando Funções Keyring de Propósito Geral](keyring-functions-general-purpose.html#keyring-function-installation "Instalando ou Desinstalando Funções Keyring de Propósito Geral").

As funções Keyring estão sujeitas a estas restrições:

* Para usar qualquer função Keyring, o Plugin `keyring_udf` deve estar habilitado. Caso contrário, ocorre um erro:

  ```sql
  ERROR 1123 (HY000): Can't initialize function 'keyring_key_generate';
  This function requires keyring_udf plugin which is not installed.
  Please install
  ```

  Para instalar o Plugin `keyring_udf`, consulte [Instalando ou Desinstalando Funções Keyring de Propósito Geral](keyring-functions-general-purpose.html#keyring-function-installation "Instalando ou Desinstalando Funções Keyring de Propósito Geral").

* As funções Keyring invocam funções do service Keyring (consulte [Seção 5.5.6.2, “O Service Keyring”](keyring-service.html "5.5.6.2 O Service Keyring")). As funções do service, por sua vez, usam qualquer Plugin Keyring que esteja instalado (por exemplo, `keyring_file` ou `keyring_okv`). Portanto, para usar qualquer função Keyring, algum Plugin Keyring subjacente deve estar habilitado. Caso contrário, ocorre um erro:

  ```sql
  ERROR 3188 (HY000): Function 'keyring_key_generate' failed because
  underlying keyring service returned an error. Please check if a
  keyring plugin is installed and that provided arguments are valid
  for the keyring you are using.
  ```

  Para instalar um Plugin Keyring, consulte [Seção 6.4.4.1, “Instalação do Plugin Keyring”](keyring-plugin-installation.html "6.4.4.1 Instalação do Plugin Keyring").

* Um usuário deve possuir o privilégio global [`EXECUTE`](privileges-provided.html#priv_execute) para usar qualquer função Keyring. Caso contrário, ocorre um erro:

  ```sql
  ERROR 1123 (HY000): Can't initialize function 'keyring_key_generate';
  The user is not privileged to execute this function. User needs to
  have EXECUTE
  ```

  Para conceder o privilégio global [`EXECUTE`](privileges-provided.html#priv_execute) a um usuário, use este comando:

  ```sql
  GRANT EXECUTE ON *.* TO user;
  ```

  Alternativamente, se preferir evitar a concessão do privilégio global [`EXECUTE`](privileges-provided.html#priv_execute) enquanto ainda permite que os usuários acessem operações específicas de gerenciamento de chaves, podem ser definidos Stored Programs "wrapper" (uma técnica descrita mais adiante nesta seção).

* Uma chave armazenada no Keyring por um determinado usuário pode ser manipulada posteriormente apenas pelo mesmo usuário. Ou seja, o valor da função [`CURRENT_USER()`](information-functions.html#function_current-user) no momento da manipulação da chave deve ter o mesmo valor de quando a chave foi armazenada no Keyring. (Essa restrição impede o uso das funções Keyring para manipulação de chaves de instância ampla, como aquelas criadas pelo `InnoDB` para suportar criptografia de tablespace.)

  Para permitir que vários usuários realizem operações na mesma chave, podem ser definidos Stored Programs "wrapper" (uma técnica descrita mais adiante nesta seção).

* As funções Keyring suportam os key types e lengths suportados pelo Plugin Keyring subjacente. Para obter informações sobre chaves específicas de um determinado Plugin Keyring, consulte [Seção 6.4.4.6, “Tipos e Comprimentos de Chave Keyring Suportados”](keyring-key-types.html "6.4.4.6 Tipos e Comprimentos de Chave Keyring Suportados").

Para criar uma nova chave aleatória e armazená-la no Keyring, chame [`keyring_key_generate()`](keyring-functions-general-purpose.html#function_keyring-key-generate), passando a ele um ID para a chave, juntamente com o key type (método de criptografia) e seu length em bytes. A chamada a seguir cria uma chave criptografada DSA de 2.048 bits chamada `MyKey`:

```sql
mysql> SELECT keyring_key_generate('MyKey', 'DSA', 256);
+-------------------------------------------+
| keyring_key_generate('MyKey', 'DSA', 256) |
+-------------------------------------------+
|                                         1 |
+-------------------------------------------+
```

Um valor de retorno de 1 indica sucesso. Se a chave não puder ser criada, o valor de retorno é `NULL` e ocorre um erro. Uma razão para isso pode ser que o Plugin Keyring subjacente não suporte a combinação especificada de key type e key length; consulte [Seção 6.4.4.6, “Tipos e Comprimentos de Chave Keyring Suportados”](keyring-key-types.html#keyring-key-types "6.4.4.6 Tipos e Comprimentos de Chave Keyring Suportados").

Para poder verificar o tipo de retorno, independentemente de ocorrer um erro, use `SELECT ... INTO @var_name` e teste o valor da variável:

```sql
mysql> SELECT keyring_key_generate('', '', -1) INTO @x;
ERROR 3188 (HY000): Function 'keyring_key_generate' failed because
underlying keyring service returned an error. Please check if a
keyring plugin is installed and that provided arguments are valid
for the keyring you are using.
mysql> SELECT @x;
+------+
| @x   |
+------+
| NULL |
+------+
mysql> SELECT keyring_key_generate('x', 'AES', 16) INTO @x;
mysql> SELECT @x;
+------+
| @x   |
+------+
|    1 |
+------+
```

Esta técnica também se aplica a outras funções Keyring que, em caso de falha, retornam um valor e um erro.

O ID passado para [`keyring_key_generate()`](keyring-functions-general-purpose.html#function_keyring-key-generate) fornece um meio de se referir à chave em chamadas de função subsequentes. Por exemplo, use o Key ID para recuperar seu tipo como uma string ou seu length em bytes como um integer:

```sql
mysql> SELECT keyring_key_type_fetch('MyKey');
+---------------------------------+
| keyring_key_type_fetch('MyKey') |
+---------------------------------+
| DSA                             |
+---------------------------------+
mysql> SELECT keyring_key_length_fetch('MyKey');
+-----------------------------------+
| keyring_key_length_fetch('MyKey') |
+-----------------------------------+
|                               256 |
+-----------------------------------+
```

Para recuperar um key value, passe o Key ID para [`keyring_key_fetch()`](keyring-functions-general-purpose.html#function_keyring-key-fetch). O exemplo a seguir usa [`HEX()`](string-functions.html#function_hex) para exibir o key value, pois ele pode conter caracteres não imprimíveis. O exemplo também usa uma chave curta por brevidade, mas esteja ciente de que chaves mais longas oferecem melhor segurança:

```sql
mysql> SELECT keyring_key_generate('MyShortKey', 'DSA', 8);
+----------------------------------------------+
| keyring_key_generate('MyShortKey', 'DSA', 8) |
+----------------------------------------------+
|                                            1 |
+----------------------------------------------+
mysql> SELECT HEX(keyring_key_fetch('MyShortKey'));
+--------------------------------------+
| HEX(keyring_key_fetch('MyShortKey')) |
+--------------------------------------+
| 1DB3B0FC3328A24C                     |
+--------------------------------------+
```

As funções Keyring tratam Key IDs, tipos e valores como strings binárias, portanto, as comparações diferenciam maiúsculas de minúsculas. Por exemplo, IDs `MyKey` e `mykey` referem-se a chaves diferentes.

Para remover uma chave, passe o Key ID para [`keyring_key_remove()`](keyring-functions-general-purpose.html#function_keyring-key-remove):

```sql
mysql> SELECT keyring_key_remove('MyKey');
+-----------------------------+
| keyring_key_remove('MyKey') |
+-----------------------------+
|                           1 |
+-----------------------------+
```

Para ofuscar e armazenar uma chave que você fornece, passe o Key ID, o type e o value para [`keyring_key_store()`](keyring-functions-general-purpose.html#function_keyring-key-store):

```sql
mysql> SELECT keyring_key_store('AES_key', 'AES', 'Secret string');
+------------------------------------------------------+
| keyring_key_store('AES_key', 'AES', 'Secret string') |
+------------------------------------------------------+
|                                                    1 |
+------------------------------------------------------+
```

Conforme indicado anteriormente, um usuário deve ter o privilégio global [`EXECUTE`](privileges-provided.html#priv_execute) para chamar funções Keyring, e o usuário que armazena uma chave no Keyring inicialmente deve ser o mesmo usuário que executa operações subsequentes na chave mais tarde, conforme determinado pelo valor [`CURRENT_USER()`](information-functions.html#function_current-user) em vigor para cada chamada de função. Para permitir operações de chave a usuários que não possuem o privilégio global [`EXECUTE`](privileges-provided.html#priv_execute) ou que podem não ser o "proprietário" da chave, use esta técnica:

1. Defina Stored Programs "wrapper" que encapsulam as operações de chave necessárias e têm um valor `DEFINER` igual ao proprietário da chave.

2. Conceda o privilégio [`EXECUTE`](privileges-provided.html#priv_execute) para Stored Programs específicos aos usuários individuais que devem poder invocá-los.

3. Se as operações implementadas pelos Stored Programs wrapper não incluírem a criação de chaves, crie as chaves necessárias com antecedência, usando a conta nomeada como `DEFINER` nas definições do Stored Program.

Essa técnica permite que as chaves sejam compartilhadas entre usuários e fornece aos DBAs um controle mais granular sobre quem pode fazer o quê com as chaves, sem a necessidade de conceder privilégios globais.

O exemplo a seguir mostra como configurar uma chave compartilhada chamada `SharedKey` que pertence ao DBA, e uma função armazenada `get_shared_key()` que fornece acesso ao valor atual da chave. O valor pode ser recuperado por qualquer usuário com o privilégio [`EXECUTE`](privileges-provided.html#priv_execute) para essa função, que é criada no schema `key_schema`.

A partir de uma conta administrativa do MySQL (`'root'@'localhost'` neste exemplo), crie o schema administrativo e a função armazenada para acessar a chave:

```sql
mysql> CREATE SCHEMA key_schema;

mysql> CREATE DEFINER = 'root'@'localhost'
       FUNCTION key_schema.get_shared_key()
       RETURNS BLOB READS SQL DATA
       RETURN keyring_key_fetch('SharedKey');
```

A partir da conta administrativa, garanta que a chave compartilhada exista:

```sql
mysql> SELECT keyring_key_generate('SharedKey', 'DSA', 8);
+---------------------------------------------+
| keyring_key_generate('SharedKey', 'DSA', 8) |
+---------------------------------------------+
|                                           1 |
+---------------------------------------------+
```

A partir da conta administrativa, crie uma conta de usuário comum à qual o acesso à chave será concedido:

```sql
mysql> CREATE USER 'key_user'@'localhost'
       IDENTIFIED BY 'key_user_pwd';
```

A partir da conta `key_user`, verifique se, sem o privilégio [`EXECUTE`](privileges-provided.html#priv_execute) adequado, a nova conta não pode acessar a chave compartilhada:

```sql
mysql> SELECT HEX(key_schema.get_shared_key());
ERROR 1370 (42000): execute command denied to user 'key_user'@'localhost'
for routine 'key_schema.get_shared_key'
```

A partir da conta administrativa, conceda [`EXECUTE`](privileges-provided.html#priv_execute) a `key_user` para a função armazenada:

```sql
mysql> GRANT EXECUTE ON FUNCTION key_schema.get_shared_key
       TO 'key_user'@'localhost';
```

A partir da conta `key_user`, verifique se a chave agora está acessível:

```sql
mysql> SELECT HEX(key_schema.get_shared_key());
+----------------------------------+
| HEX(key_schema.get_shared_key()) |
+----------------------------------+
| 9BAFB9E75CEEB013                 |
+----------------------------------+
```

##### Referência de Funções Keyring de Propósito Geral

Para cada função Keyring de propósito geral, esta seção descreve sua finalidade, sequência de chamada e valor de retorno. Para obter informações sobre as condições sob as quais essas funções podem ser invocadas, consulte [Usando Funções Keyring de Propósito Geral](keyring-functions-general-purpose.html#keyring-function-usage "Usando Funções Keyring de Propósito Geral").

* [`keyring_key_fetch(key_id)`](keyring-functions-general-purpose.html#function_keyring-key-fetch)

  Dado um Key ID, desofusca e retorna o key value.

  Argumentos:

  + *`key_id`*: Uma string que especifica o Key ID.

  Valor de retorno:

  Retorna o key value como uma string em caso de sucesso, `NULL` se a chave não existir, ou `NULL` e um erro em caso de falha.

  Note

  Os key values recuperados usando [`keyring_key_fetch()`](keyring-functions-general-purpose.html#function_keyring-key-fetch) estão sujeitos aos limites gerais das funções Keyring descritos em [Seção 6.4.4.6, “Tipos e Comprimentos de Chave Keyring Suportados”](keyring-key-types.html "6.4.4.6 Tipos e Comprimentos de Chave Keyring Suportados"). Um key value mais longo do que esse length pode ser armazenado usando uma função de service Keyring (consulte [Seção 5.5.6.2, “O Service Keyring”](keyring-service.html "5.5.6.2 O Service Keyring")), mas se for recuperado usando [`keyring_key_fetch()`](keyring-functions-general-purpose.html#function_keyring-key-fetch), é truncado para o limite geral da função Keyring.

  Exemplo:

  ```sql
  mysql> SELECT keyring_key_generate('RSA_key', 'RSA', 16);
  +--------------------------------------------+
  | keyring_key_generate('RSA_key', 'RSA', 16) |
  +--------------------------------------------+
  |                                          1 |
  +--------------------------------------------+
  mysql> SELECT HEX(keyring_key_fetch('RSA_key'));
  +-----------------------------------+
  | HEX(keyring_key_fetch('RSA_key')) |
  +-----------------------------------+
  | 91C2253B696064D3556984B6630F891A  |
  +-----------------------------------+
  mysql> SELECT keyring_key_type_fetch('RSA_key');
  +-----------------------------------+
  | keyring_key_type_fetch('RSA_key') |
  +-----------------------------------+
  | RSA                               |
  +-----------------------------------+
  mysql> SELECT keyring_key_length_fetch('RSA_key');
  +-------------------------------------+
  | keyring_key_length_fetch('RSA_key') |
  +-------------------------------------+
  |                                  16 |
  +-------------------------------------+
  ```

  O exemplo usa [`HEX()`](string-functions.html#function_hex) para exibir o key value, pois ele pode conter caracteres não imprimíveis. O exemplo também usa uma chave curta por brevidade, mas esteja ciente de que chaves mais longas oferecem melhor segurança.

* [`keyring_key_generate(key_id, key_type, key_length)`](keyring-functions-general-purpose.html#function_keyring-key-generate)

  Gera uma nova chave aleatória com um determinado ID, type e length, e a armazena no Keyring. Os valores de type e length devem ser consistentes com os valores suportados pelo Plugin Keyring subjacente. Consulte [Seção 6.4.4.6, “Tipos e Comprimentos de Chave Keyring Suportados”](keyring-key-types.html "6.4.4.6 Tipos e Comprimentos de Chave Keyring Suportados").

  Argumentos:

  + *`key_id`*: Uma string que especifica o Key ID.

  + *`key_type`*: Uma string que especifica o key type.

  + *`key_length`*: Um integer que especifica o key length em bytes.

  Valor de retorno:

  Retorna 1 em caso de sucesso, ou `NULL` e um erro em caso de falha.

  Exemplo:

  ```sql
  mysql> SELECT keyring_key_generate('RSA_key', 'RSA', 384);
  +---------------------------------------------+
  | keyring_key_generate('RSA_key', 'RSA', 384) |
  +---------------------------------------------+
  |                                           1 |
  +---------------------------------------------+
  ```

* [`keyring_key_length_fetch(key_id)`](keyring-functions-general-purpose.html#function_keyring-key-length-fetch)

  Dado um Key ID, retorna o key length.

  Argumentos:

  + *`key_id`*: Uma string que especifica o Key ID.

  Valor de retorno:

  Retorna o key length em bytes como um integer em caso de sucesso, `NULL` se a chave não existir, ou `NULL` e um erro em caso de falha.

  Exemplo:

  Consulte a descrição de [`keyring_key_fetch()`](keyring-functions-general-purpose.html#function_keyring-key-fetch).

* [`keyring_key_remove(key_id)`](keyring-functions-general-purpose.html#function_keyring-key-remove)

  Remove a chave com um determinado ID do Keyring.

  Argumentos:

  + *`key_id`*: Uma string que especifica o Key ID.

  Valor de retorno:

  Retorna 1 em caso de sucesso, ou `NULL` em caso de falha.

  Exemplo:

  ```sql
  mysql> SELECT keyring_key_remove('AES_key');
  +-------------------------------+
  | keyring_key_remove('AES_key') |
  +-------------------------------+
  |                             1 |
  +-------------------------------+
  ```

* [`keyring_key_store(key_id, key_type, key)`](keyring-functions-general-purpose.html#function_keyring-key-store)

  Ofusca e armazena uma chave no Keyring.

  Argumentos:

  + *`key_id`*: Uma string que especifica o Key ID.

  + *`key_type`*: Uma string que especifica o key type.

  + *`key`*: Uma string que especifica o key value.

  Valor de retorno:

  Retorna 1 em caso de sucesso, ou `NULL` e um erro em caso de falha.

  Exemplo:

  ```sql
  mysql> SELECT keyring_key_store('new key', 'DSA', 'My key value');
  +-----------------------------------------------------+
  | keyring_key_store('new key', 'DSA', 'My key value') |
  +-----------------------------------------------------+
  |                                                   1 |
  +-----------------------------------------------------+
  ```

* [`keyring_key_type_fetch(key_id)`](keyring-functions-general-purpose.html#function_keyring-key-type-fetch)

  Dado um Key ID, retorna o key type.

  Argumentos:

  + *`key_id`*: Uma string que especifica o Key ID.

  Valor de retorno:

  Retorna o key type como uma string em caso de sucesso, `NULL` se a chave não existir, ou `NULL` e um erro em caso de falha.

  Exemplo:

  Consulte a descrição de [`keyring_key_fetch()`](keyring-functions-general-purpose.html#function_keyring-key-fetch).