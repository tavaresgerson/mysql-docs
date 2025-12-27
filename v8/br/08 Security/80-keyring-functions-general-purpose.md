#### 8.4.4.12 Funções de Gerenciamento de Chaves do Carteira de Chaves de Uso Geral

O MySQL Server suporta um serviço de carteira de chaves que permite que componentes internos e plugins armazem informações sensíveis de forma segura para recuperação posterior.

O MySQL Server também inclui uma interface SQL para gerenciamento de chaves da carteira, implementada como um conjunto de funções de uso geral que acessam as capacidades fornecidas pelo serviço interno de carteira de chaves. As funções da carteira de chaves estão contidas em um arquivo de biblioteca de plugins, que também contém um plugin `keyring_udf` que deve ser habilitado antes da invocação da função. Para que essas funções sejam usadas, um plugin de carteira de chaves, como `keyring_okv`, ou um componente de carteira de chaves, como `component_keyring_file` ou `component_keyring_encrypted_file`, deve ser habilitado.

As funções descritas aqui são de uso geral e destinadas ao uso com qualquer componente ou plugin de carteira de chaves. Um componente ou plugin de carteira de chaves específico pode também fornecer funções próprias que são destinadas ao uso apenas com esse componente ou plugin; consulte a Seção 8.4.4.13, “Funções de Gerenciamento de Chaves da Carteira de Chaves Específicas de Plugin”.

As seções a seguir fornecem instruções de instalação para as funções da carteira de chaves e demonstram como usá-las. Para informações gerais sobre a carteira de chaves, consulte  Seção 8.4.4, “A Carteira de Chaves do MySQL”.

*  Instalando ou Desinstalando Funções de Carteira de Chaves de Uso Geral
*  Usando Funções de Carteira de Chaves de Uso Geral
*  Referência de Funções de Carteira de Chaves de Uso Geral

##### Instalando ou Desinstalando Funções de Carteira de Chaves de Uso Geral

Esta seção descreve como instalar ou desinstalar as funções da carteira de chaves, que são implementadas em um arquivo de biblioteca de plugins que também contém um plugin `keyring_udf`. Para informações gerais sobre a instalação ou desinstalação de plugins e funções carregáveis, consulte  Seção 7.6.1, “Instalando e Desinstalando Plugins”, e  Seção 7.7.1, “Instalando e Desinstalando Funções Carregáveis”.

As funções do chaveiro permitem operações de gerenciamento de chaves do chaveiro, mas o plugin `keyring_udf` também deve ser instalado, pois as funções não funcionam corretamente sem ele. Tentativas de usar as funções sem o plugin `keyring_udf` resultam em um erro.

Para ser utilizável pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin ajustando o valor de `plugin_dir` na inicialização do servidor.

O nome base do arquivo da biblioteca do plugin é `keyring_udf`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Para instalar o plugin `keyring_udf` e as funções do chaveiro, use as instruções `INSTALL PLUGIN` e `CREATE FUNCTION`, ajustando o sufixo `.so` conforme necessário para sua plataforma:

```
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

Se o plugin e as funções forem usados em um servidor de replicação de origem, instale-os em todas as réplicas também para evitar problemas de replicação.

Uma vez instalado como descrito, o plugin e as funções permanecem instalados até serem desinstalados. Para removê-los, use as instruções `UNINSTALL PLUGIN` e `DROP FUNCTION`:

```
UNINSTALL PLUGIN keyring_udf;
DROP FUNCTION keyring_key_generate;
DROP FUNCTION keyring_key_fetch;
DROP FUNCTION keyring_key_length_fetch;
DROP FUNCTION keyring_key_type_fetch;
DROP FUNCTION keyring_key_store;
DROP FUNCTION keyring_key_remove;
```

##### Usando Funções Gerais do Chaveiro

Antes de usar as funções gerais do chaveiro, instale-as de acordo com as instruções fornecidas em Instalar ou Desinstalar Funções Gerais do Chaveiro.

As funções do chaveiro estão sujeitas a essas restrições:

* Para usar qualquer função do chaveiro, o plugin `keyring_udf` deve estar habilitado. Caso contrário, ocorre um erro:

  ```
  ERROR 1123 (HY000): Can't initialize function 'keyring_key_generate';
  This function requires keyring_udf plugin which is not installed.
  Please install
  ```

Para instalar o plugin `keyring_udf`, consulte Instalar ou Desinstalar Funções de Carteira de Chaves de Uso Geral.
* As funções da carteira de chaves invocam funções do serviço de carteira de chaves (consulte a Seção 7.6.9.2, “O Serviço de Carteira de Chaves”). As funções do serviço, por sua vez, usam o plugin de carteira de chaves instalado (por exemplo, `keyring_okv`). Portanto, para usar qualquer função da carteira de chaves, algum plugin de carteira de chaves subjacente deve estar habilitado. Caso contrário, ocorre um erro:

  ```
  ERROR 3188 (HY000): Function 'keyring_key_generate' failed because
  underlying keyring service returned an error. Please check if a
  keyring plugin is installed and that provided arguments are valid
  for the keyring you are using.
  ```

  Para instalar um plugin de carteira de chaves, consulte a Seção 8.4.4.3, “Instalação de Plugins de Carteira de Chaves”.
* Um usuário deve possuir o privilégio global `EXECUTE` para usar qualquer função da carteira de chaves. Caso contrário, ocorre um erro:

  ```
  ERROR 1123 (HY000): Can't initialize function 'keyring_key_generate';
  The user is not privileged to execute this function. User needs to
  have EXECUTE
  ```

  Para conceder o privilégio global `EXECUTE` a um usuário, use a seguinte declaração:

  ```
  GRANT EXECUTE ON *.* TO user;
  ```

  Alternativamente, se você preferir evitar conceder o privilégio global `EXECUTE` enquanto ainda permite que os usuários acessem operações específicas de gerenciamento de chaves, programas armazenados “wrapper” podem ser definidos (uma técnica descrita mais adiante nesta seção).
* Uma chave armazenada na carteira de chaves por um usuário específico pode ser manipulada mais tarde apenas pelo mesmo usuário. Ou seja, o valor da função `CURRENT_USER()` no momento da manipulação da chave deve ter o mesmo valor do momento em que a chave foi armazenada na carteira de chaves. (Essa restrição exclui o uso das funções da carteira de chaves para manipulação de chaves de nível de instância, como as criadas pelo `InnoDB` para suportar criptografia de espaço de tabelas.)

  Para permitir que vários usuários realizem operações na mesma chave, programas armazenados “wrapper” podem ser definidos (uma técnica descrita mais adiante nesta seção).
* As funções da carteira de chaves suportam os tipos e comprimentos de chaves suportados pelo plugin de carteira de chaves subjacente. Para informações sobre chaves específicas de um plugin de carteira de chaves particular, consulte a Seção 8.4.4.10, “Tipos e comprimentos de chaves de carteira de chaves suportados”.

Para criar uma nova chave aleatória e armazená-la no conjunto de chaves, chame `keyring_key_generate()`, passando a ele um ID para a chave, juntamente com o tipo da chave (método de criptografia) e seu comprimento em bytes. A chamada seguinte cria uma chave criptografada DSA de 2.048 bits chamada `MyKey`:

```
mysql> SELECT keyring_key_generate('MyKey', 'DSA', 256);
+-------------------------------------------+
| keyring_key_generate('MyKey', 'DSA', 256) |
+-------------------------------------------+
|                                         1 |
+-------------------------------------------+
```

Um valor de retorno de 1 indica sucesso. Se a chave não puder ser criada, o valor de retorno é `NULL` e ocorre um erro. Uma das razões para isso pode ser que o plugin de conjunto de chaves subjacente não suporte a combinação especificada de tipo de chave e comprimento da chave; consulte a Seção 8.4.4.10, “Tipos e Comprimentos de Chaves de Conjunto de Chaves Suportáveis”.

Para poder verificar o tipo de retorno, independentemente de ocorrer um erro, use `SELECT ... INTO @var_name` e teste o valor da variável:

```
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

Essa técnica também se aplica a outras funções de conjunto de chaves que retornam um valor e um erro em caso de falha.

O ID passado para `keyring_key_generate()` fornece um meio de referência para a chave em chamadas subsequentes de funções. Por exemplo, use o ID da chave para recuperar seu tipo como uma string ou seu comprimento em bytes como um inteiro:

```
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

Para recuperar o valor de uma chave, passe o ID da chave para `keyring_key_fetch()`. O exemplo seguinte usa `HEX()` para exibir o valor da chave, pois ela pode conter caracteres não imprimíveis. O exemplo também usa uma chave curta para brevidade, mas esteja ciente de que chaves mais longas oferecem melhor segurança:

```
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

As funções de conjunto de chaves tratam IDs, tipos e valores de chaves como strings binárias, portanto, as comparações são sensíveis ao caso. Por exemplo, IDs de `MyKey` e `mykey` referem-se a chaves diferentes.

Para remover uma chave, passe o ID da chave para `keyring_key_remove()`:

```
mysql> SELECT keyring_key_remove('MyKey');
+-----------------------------+
| keyring_key_remove('MyKey') |
+-----------------------------+
|                           1 |
+-----------------------------+
```

Para ofuscar e armazenar uma chave que você fornecer, passe o ID da chave, tipo e valor para `keyring_key_store()`:

```
mysql> SELECT keyring_key_store('AES_key', 'AES', 'Secret string');
+------------------------------------------------------+
| keyring_key_store('AES_key', 'AES', 'Secret string') |
+------------------------------------------------------+
|                                                    1 |
+------------------------------------------------------+
```

Como indicado anteriormente, um usuário deve ter o privilégio global `EXECUTE` para chamar funções do keychain, e o usuário que armazena uma chave no keychain inicialmente deve ser o mesmo usuário que realiza operações subsequentes na chave mais tarde, conforme determinado pelo valor `CURRENT_USER()` em vigor para cada chamada de função. Para permitir que usuários que não têm o privilégio global `EXECUTE` ou que podem não ser o "proprietário" da chave realizem operações com chaves, use essa técnica:

1. Defina programas armazenados "wrapper" que encapsulam as operações de chave necessárias e têm um valor `DEFINER` igual ao proprietário da chave.
2. Conceda o privilégio `EXECUTE` para programas armazenados específicos aos usuários individuais que devem ser capazes de invocá-los.
3. Se as operações implementadas pelos programas armazenados wrapper não incluem a criação de chaves, crie as chaves necessárias com antecedência, usando a conta nomeada como `DEFINER` nas definições do programa armazenado.

Essa técnica permite que as chaves sejam compartilhadas entre usuários e fornece aos DBA um controle mais detalhado sobre quem pode fazer o que com as chaves, sem precisar conceder privilégios globais.

O exemplo seguinte mostra como configurar uma chave compartilhada chamada `SharedKey` que é de propriedade do DBA, e uma função armazenada `get_shared_key()` que fornece acesso ao valor atual da chave. O valor pode ser recuperado por qualquer usuário com o privilégio `EXECUTE` para essa função, que é criada no esquema `key_schema`.

De uma conta administrativa MySQL (`'root'@'localhost'` neste exemplo), crie o esquema administrativo e a função armazenada para acessar a chave:

```
mysql> CREATE SCHEMA key_schema;

mysql> CREATE DEFINER = 'root'@'localhost'
       FUNCTION key_schema.get_shared_key()
       RETURNS BLOB READS SQL DATA
       RETURN keyring_key_fetch('SharedKey');
```

De sua conta administrativa, garanta que a chave compartilhada exista:

```
mysql> SELECT keyring_key_generate('SharedKey', 'DSA', 8);
+---------------------------------------------+
| keyring_key_generate('SharedKey', 'DSA', 8) |
+---------------------------------------------+
|                                           1 |
+---------------------------------------------+
```

De sua conta administrativa, crie uma conta de usuário comum para a qual o acesso à chave deve ser concedido:

```
mysql> CREATE USER 'key_user'@'localhost'
       IDENTIFIED BY 'key_user_pwd';
```

De sua conta `key_user`, verifique que, sem o devido privilégio `EXECUTE`, a nova conta não pode acessar a chave compartilhada:

```
mysql> SELECT HEX(key_schema.get_shared_key());
ERROR 1370 (42000): execute command denied to user 'key_user'@'localhost'
for routine 'key_schema.get_shared_key'
```

A partir da conta administrativa, conceda `EXECUTE` para `key_user` para a função de armazenamento:

```
mysql> GRANT EXECUTE ON FUNCTION key_schema.get_shared_key
       TO 'key_user'@'localhost';
```

A partir da conta `key_user`, verifique se a chave agora é acessível:

```
mysql> SELECT HEX(key_schema.get_shared_key());
+----------------------------------+
| HEX(key_schema.get_shared_key()) |
+----------------------------------+
| 9BAFB9E75CEEB013                 |
+----------------------------------+
```

##### Referência da Função de Carteira de Chave de Uso Geral

Para cada função de carteira de chave de uso geral, esta seção descreve seu propósito, sequência de chamadas e valor de retorno. Para informações sobre as condições sob as quais essas funções podem ser invocadas, consulte  Usando Funções de Carteira de Chave de Uso Geral.

*  `keyring_key_fetch(key_id)`

  Dado um ID de chave, desobfuso e retorna o valor da chave.

  Argumentos:

  + *`key_id`*: Uma string que especifica o ID da chave.

  Valor de retorno:

  Retorna o valor da chave como uma string para sucesso, `NULL` se a chave não existir, ou `NULL` e um erro para falha.

  ::: info Nota

  Os valores das chaves recuperados usando `keyring_key_fetch()` estão sujeitos aos limites da função de carteira de chave geral descritos em  Seção 8.4.4.10, “Tipos e Longitudes de Chaves de Carteira Suportado”. Um valor de chave mais longo que esse comprimento pode ser armazenado usando uma função de serviço de carteira (consulte Seção 7.6.9.2, “O Serviço de Carteira”), mas se recuperado usando `keyring_key_fetch()` é truncado para o limite da função de carteira de chave geral.

  :::

  Exemplo:

  ```
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

  O exemplo usa  `HEX()` para exibir o valor da chave porque pode conter caracteres não imprimíveis. O exemplo também usa uma chave curta para brevidade, mas esteja ciente de que chaves mais longas fornecem melhor segurança.
* `keyring_key_generate(key_id, key_type, key_length)`

  Gera uma nova chave aleatória com um ID, tipo e comprimento dados, e a armazena na carteira. Os valores de tipo e comprimento devem ser consistentes com os valores suportados pelo plugin de carteira subjacente. Consulte Seção 8.4.4.10, “Tipos e Longitudes de Chaves de Carteira Suportado”.

  Argumentos:

  + *`key_id`*: Uma string que especifica o ID da chave.
  + *`key_type`*: Uma string que especifica o tipo de chave.
  + *`key_length`*: Um inteiro que especifica o comprimento da chave em bytes.

  Valor de retorno:

Retorna 1 para sucesso, ou `NULL` e um erro para falha.

Exemplo:

```
  mysql> SELECT keyring_key_generate('RSA_key', 'RSA', 384);
  +---------------------------------------------+
  | keyring_key_generate('RSA_key', 'RSA', 384) |
  +---------------------------------------------+
  |                                           1 |
  +---------------------------------------------+
  ```
* `keyring_key_length_fetch(key_id)`

  Dado um ID de chave, retorna o comprimento da chave.

  Argumentos:

  + *`key_id`*: Uma string que especifica o ID da chave.

  Valor de retorno:

  Retorna o comprimento da chave em bytes como um inteiro para sucesso, `NULL` se a chave não existir, ou `NULL` e um erro para falha.

  Exemplo:

  Veja a descrição de `keyring_key_fetch()`.
* `keyring_key_remove(key_id)`

  Remove a chave com um ID dado do anel de chaves.

  Argumentos:

  + *`key_id`*: Uma string que especifica o ID da chave.

  Valor de retorno:

  Retorna 1 para sucesso, ou `NULL` para falha.

  Exemplo:

  ```
  mysql> SELECT keyring_key_remove('AES_key');
  +-------------------------------+
  | keyring_key_remove('AES_key') |
  +-------------------------------+
  |                             1 |
  +-------------------------------+
  ```
* `keyring_key_store(key_id, key_type, key)`

  Oculta e armazena uma chave no anel de chaves.

  Argumentos:

  + *`key_id`*: Uma string que especifica o ID da chave.
  + *`key_type`*: Uma string que especifica o tipo de chave.
  + *`key`*: Uma string que especifica o valor da chave.

  Valor de retorno:

  Retorna 1 para sucesso, ou `NULL` e um erro para falha.

  Exemplo:

  ```
  mysql> SELECT keyring_key_store('new key', 'DSA', 'My key value');
  +-----------------------------------------------------+
  | keyring_key_store('new key', 'DSA', 'My key value') |
  +-----------------------------------------------------+
  |                                                   1 |
  +-----------------------------------------------------+
  ```
* `keyring_key_type_fetch(key_id)`

  Dado um ID de chave, retorna o tipo de chave.

  Argumentos:

  + *`key_id`*: Uma string que especifica o ID da chave.

  Valor de retorno:

  Retorna o tipo de chave como uma string para sucesso, `NULL` se a chave não existir, ou `NULL` e um erro para falha.

  Exemplo:

  Veja a descrição de `keyring_key_fetch()`.