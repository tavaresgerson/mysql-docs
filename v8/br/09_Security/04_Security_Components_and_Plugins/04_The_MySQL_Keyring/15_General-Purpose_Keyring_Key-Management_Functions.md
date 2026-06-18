#### 8.4.4.15 Funções de gerenciamento de chaves do porta-chaves de uso geral

O MySQL Server suporta um serviço de chave pública que permite que componentes internos e plugins armazem informações sensíveis de forma segura para recuperação posterior.

O MySQL Server também inclui uma interface SQL para gerenciamento de chaves de chaveiros, implementada como um conjunto de funções de propósito geral que acessam as capacidades fornecidas pelo serviço de chaveiro interno. As funções de chaveiro estão contidas em um arquivo de biblioteca de plugins, que também contém um plugin `keyring_udf` que deve ser habilitado antes da invocação da função. Para que essas funções sejam usadas, um plugin de chaveiro, como `keyring_file` ou `keyring_okv`, ou um componente de chaveiro, como `component_keyring_file` ou `component_keyring_encrypted_file`, deve ser habilitado.

As funções descritas aqui são de propósito geral e destinadas ao uso com qualquer componente ou plugin de chaveiro. Um componente ou plugin de chaveiro específico pode também fornecer funções próprias que são destinadas ao uso apenas com esse componente ou plugin; veja a Seção 8.4.4.16, “Funções de Gerenciamento de Chave específicas de plugin”.

As seções a seguir fornecem instruções de instalação para as funções do keyring e demonstram como usá-las. Para informações sobre as funções do serviço de keyring invocadas por essas funções, consulte a Seção 7.6.9.2, “O Serviço de Keyring”. Para informações gerais sobre o keyring, consulte a Seção 8.4.4, “O Keyring MySQL”.

- Instalando ou Desinstalando Funções de Carteira de Chave de Uso Geral
- Usando as funções do cartela de identificação geral
- Referência da função de chaveiro de uso geral

##### Instalando ou Desinstalando Funções de Carteira de Chave de Uso Geral

Esta seção descreve como instalar ou desinstalar as funções do chaveiro, que são implementadas em um arquivo de biblioteca de plugins que também contém um plugin `keyring_udf`. Para informações gerais sobre como instalar ou desinstalar plugins e funções carregáveis, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”, e a Seção 7.7.1, “Instalando e Desinstalando Funções Carregáveis”.

As funções do chaveiro permitem operações de gerenciamento de chaves do chaveiro, mas o plugin `keyring_udf` também deve ser instalado, pois as funções não funcionam corretamente sem ele. Tentativas de usar as funções sem o plugin `keyring_udf` resultam em um erro.

Para que o plugin seja utilizado pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin configurando o valor de `plugin_dir` durante o início do servidor.

O nome de base do arquivo da biblioteca de plugins é `keyring_udf`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Para instalar o plugin `keyring_udf` e as funções de chave de segurança, use as instruções `INSTALL PLUGIN` e `CREATE FUNCTION`, ajustando o sufixo `.so` para sua plataforma conforme necessário:

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

Se o plugin e as funções forem usados em um servidor de replicação de origem, instale-os em todas as réplicas para evitar problemas de replicação.

Uma vez instalado conforme descrito, o plugin e as funções permanecem instalados até serem desinstalados. Para removê-los, use as instruções `UNINSTALL PLUGIN` e `DROP FUNCTION`:

```
UNINSTALL PLUGIN keyring_udf;
DROP FUNCTION keyring_key_generate;
DROP FUNCTION keyring_key_fetch;
DROP FUNCTION keyring_key_length_fetch;
DROP FUNCTION keyring_key_type_fetch;
DROP FUNCTION keyring_key_store;
DROP FUNCTION keyring_key_remove;
```

##### Usando as funções do cartela de identificação geral

Antes de usar as funções do cartela de chaves de uso geral, instale-as de acordo com as instruções fornecidas em Instalar ou desinstalar funções da cartela de chaves de uso geral.

As funções do chaveiro estão sujeitas a essas restrições:

- Para usar qualquer função do chaveiro, o plugin `keyring_udf` deve estar habilitado. Caso contrário, ocorrerá um erro:

  ```
  ERROR 1123 (HY000): Can't initialize function 'keyring_key_generate';
  This function requires keyring_udf plugin which is not installed.
  Please install
  ```

  Para instalar o plugin `keyring_udf`, consulte Instalar ou desinstalar funções de cartela de chaves de uso geral.

- As funções do chaveiro acionam as funções do serviço de chaveiro (consulte a Seção 7.6.9.2, “O Serviço de Chaveiro”). As funções do serviço, por sua vez, usam o plugin de chaveiro instalado (por exemplo, `keyring_file` ou `keyring_okv`). Portanto, para usar qualquer função do chaveiro, algum plugin de chaveiro subjacente deve estar habilitado. Caso contrário, ocorrerá um erro:

  ```
  ERROR 3188 (HY000): Function 'keyring_key_generate' failed because
  underlying keyring service returned an error. Please check if a
  keyring plugin is installed and that provided arguments are valid
  for the keyring you are using.
  ```

  Para instalar um plugin de chave de segurança, consulte a Seção 8.4.4.3, “Instalação de Plugin de Chave de Segurança”.

- Um usuário deve possuir o privilégio global `EXECUTE` para usar qualquer função de chave de segurança. Caso contrário, ocorrerá um erro:

  ```
  ERROR 1123 (HY000): Can't initialize function 'keyring_key_generate';
  The user is not privileged to execute this function. User needs to
  have EXECUTE
  ```

  Para conceder o privilégio global `EXECUTE` a um usuário, use esta declaração:

  ```
  GRANT EXECUTE ON *.* TO user;
  ```

  Como alternativa, se você preferir evitar conceder o privilégio global `EXECUTE` enquanto ainda permite que os usuários acessem operações específicas de gerenciamento de chaves, programas armazenados em "wrapper" podem ser definidos (uma técnica descrita mais adiante nesta seção).

- Uma chave armazenada no chaveiro por um usuário específico só pode ser manipulada posteriormente pelo mesmo usuário. Ou seja, o valor da função `CURRENT_USER()` no momento da manipulação da chave deve ter o mesmo valor do momento em que a chave foi armazenada no chaveiro. (Essa restrição exclui o uso das funções do chaveiro para manipulação de chaves de nível de instância, como as criadas por `InnoDB` para suportar a criptografia de tablespace.)

  Para permitir que vários usuários realizem operações na mesma chave, podem ser definidos programas armazenados em "wrapper" (uma técnica descrita mais adiante nesta seção).

- As funções do cartela de chaves suportam os tipos e comprimentos de chaves suportados pelo plugin de cartela de chaves subjacente. Para obter informações sobre as chaves específicas de um plugin de cartela de chaves em particular, consulte a Seção 8.4.4.13, “Tipos e comprimentos de chaves de cartela de chaves suportados”.

Para criar uma nova chave aleatória e armazená-la no chaveiro, chame `keyring_key_generate()`, passando a ele um ID para a chave, juntamente com o tipo da chave (método de criptografia) e seu comprimento em bytes. A chamada a seguir cria uma chave criptografada DSA de 2.048 bits chamada `MyKey`:

```
mysql> SELECT keyring_key_generate('MyKey', 'DSA', 256);
+-------------------------------------------+
| keyring_key_generate('MyKey', 'DSA', 256) |
+-------------------------------------------+
|                                         1 |
+-------------------------------------------+
```

Um valor de retorno de 1 indica sucesso. Se a chave não puder ser criada, o valor de retorno é `NULL` e ocorre um erro. Uma das razões para isso pode ser que o plugin de chave subjacente não suporte a combinação especificada de tipo de chave e comprimento da chave; consulte a Seção 8.4.4.13, “Tipos e comprimentos de chave do chaveiro suportados”.

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

Essa técnica também se aplica a outras funções do chaveiro que, em caso de falha, retornam um valor e um erro.

O ID passado para `keyring_key_generate()` fornece uma maneira de se referir à chave em chamadas subsequentes de funções. Por exemplo, use o ID da chave para recuperar seu tipo como uma string ou sua extensão em bytes como um inteiro:

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

Para recuperar um valor de chave, passe o ID da chave para `keyring_key_fetch()`. O exemplo a seguir usa `HEX()` para exibir o valor da chave, pois ele pode conter caracteres não imprimíveis. O exemplo também usa uma chave curta para ser conciso, mas esteja ciente de que chaves mais longas oferecem melhor segurança:

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

As funções do cartela de identificação tratam os IDs, tipos e valores das chaves como strings binárias, portanto, as comparações são sensíveis ao caso. Por exemplo, os IDs de `MyKey` e `mykey` referem-se a chaves diferentes.

Para remover uma chave, passe o ID da chave para `keyring_key_remove()`:

```
mysql> SELECT keyring_key_remove('MyKey');
+-----------------------------+
| keyring_key_remove('MyKey') |
+-----------------------------+
|                           1 |
+-----------------------------+
```

Para ofuscar e armazenar uma chave que você fornecer, passe o ID da chave, o tipo e o valor para `keyring_key_store()`:

```
mysql> SELECT keyring_key_store('AES_key', 'AES', 'Secret string');
+------------------------------------------------------+
| keyring_key_store('AES_key', 'AES', 'Secret string') |
+------------------------------------------------------+
|                                                    1 |
+------------------------------------------------------+
```

Como indicado anteriormente, um usuário deve ter o privilégio global `EXECUTE` para chamar funções do chaveiro, e o usuário que armazena uma chave no chaveiro inicialmente deve ser o mesmo usuário que realiza operações subsequentes na chave mais tarde, conforme determinado pelo valor `CURRENT_USER()` em vigor para cada chamada de função. Para permitir operações com chaves a usuários que não têm o privilégio global `EXECUTE` ou que podem não ser o "proprietário" da chave, use essa técnica:

1. Defina programas armazenados "wrapper" que encapsulam as operações de chave necessárias e têm um valor `DEFINER` igual ao proprietário da chave.

2. Conceda o privilégio `EXECUTE` para programas armazenados específicos aos usuários individuais que devem ser capazes de invocá-los.

3. Se as operações implementadas pelo wrapper armazenar programas não incluem a criação de chaves, crie as chaves necessárias com antecedência, usando a conta nomeada como `DEFINER` nas definições do programa armazenado.

Essa técnica permite que as chaves sejam compartilhadas entre os usuários e oferece aos administradores de banco de dados um controle mais detalhado sobre quem pode fazer o que com as chaves, sem precisar conceder privilégios globais.

O exemplo a seguir mostra como configurar uma chave compartilhada chamada `SharedKey` que pertence ao DBA e uma função armazenada `get_shared_key()` que fornece acesso ao valor atual da chave. O valor pode ser recuperado por qualquer usuário com o privilégio `EXECUTE` para essa função, que é criada no esquema `key_schema`.

A partir de uma conta administrativa do MySQL (`'root'@'localhost'` neste exemplo), crie o esquema administrativo e a função armazenada para acessar a chave:

```
mysql> CREATE SCHEMA key_schema;

mysql> CREATE DEFINER = 'root'@'localhost'
       FUNCTION key_schema.get_shared_key()
       RETURNS BLOB READS SQL DATA
       RETURN keyring_key_fetch('SharedKey');
```

Na conta administrativa, certifique-se de que a chave compartilhada existe:

```
mysql> SELECT keyring_key_generate('SharedKey', 'DSA', 8);
+---------------------------------------------+
| keyring_key_generate('SharedKey', 'DSA', 8) |
+---------------------------------------------+
|                                           1 |
+---------------------------------------------+
```

A partir da conta administrativa, crie uma conta de usuário comum à qual o acesso à chave deve ser concedido:

```
mysql> CREATE USER 'key_user'@'localhost'
       IDENTIFIED BY 'key_user_pwd';
```

A partir da conta `key_user`, verifique se, sem o privilégio adequado `EXECUTE`, a nova conta não pode acessar a chave compartilhada:

```
mysql> SELECT HEX(key_schema.get_shared_key());
ERROR 1370 (42000): execute command denied to user 'key_user'@'localhost'
for routine 'key_schema.get_shared_key'
```

Do quadro administrativo, conceda `EXECUTE` para `key_user` para a função armazenada:

```
mysql> GRANT EXECUTE ON FUNCTION key_schema.get_shared_key
       TO 'key_user'@'localhost';
```

A partir da conta `key_user`, verifique se a chave agora está acessível:

```
mysql> SELECT HEX(key_schema.get_shared_key());
+----------------------------------+
| HEX(key_schema.get_shared_key()) |
+----------------------------------+
| 9BAFB9E75CEEB013                 |
+----------------------------------+
```

##### Referência da função de chaveiro de uso geral

Para cada função do bloco de chaves de propósito geral, esta seção descreve seu propósito, a sequência de chamadas e o valor de retorno. Para obter informações sobre as condições sob as quais essas funções podem ser invocadas, consulte o uso de funções do bloco de chaves de propósito geral.

- `keyring_key_fetch(key_id)`

  Dada uma ID chave, desobfuso e retorna o valor da chave.

  Argumentos:

  - `key_id`: Uma string que especifica o ID da chave.

  Valor de retorno:

  Retorna o valor da chave como uma string para sucesso, `NULL` se a chave não existir, ou `NULL` e um erro para falha.

  Nota

  Os valores-chave recuperados usando `keyring_key_fetch()` estão sujeitos aos limites gerais da função de chave de armário descritos na Seção 8.4.4.13, “Tipos e comprimentos de chaves de armário suportados”. Um valor de chave mais longo que esse comprimento pode ser armazenado usando uma função de serviço de armário (consulte a Seção 7.6.9.2, “O Serviço de Armário”), mas se recuperado usando `keyring_key_fetch()`, será truncado para o limite da função de armário geral.

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

  O exemplo usa `HEX()` para exibir o valor da chave porque ele pode conter caracteres não imprimíveis. O exemplo também usa uma chave curta para ser conciso, mas esteja ciente de que chaves mais longas oferecem melhor segurança.

- `keyring_key_generate(key_id, key_type, key_length)`

  Gera uma nova chave aleatória com um ID, tipo e comprimento definidos e armazena-a no conjunto de chaves. Os valores de tipo e comprimento devem ser consistentes com os valores suportados pelo plugin de conjunto de chaves subjacente. Consulte a Seção 8.4.4.13, “Tipos e comprimentos de chave suportados pelo conjunto de chaves”.

  Argumentos:

  - `key_id`: Uma string que especifica o ID da chave.

  - `key_type`: Uma string que especifica o tipo de chave.

  - `key_length`: Um número inteiro que especifica o comprimento da chave em bytes.

  Valor de retorno:

  Retorna 1 para sucesso ou `NULL` e um erro para falha.

  Exemplo:

  ```
  mysql> SELECT keyring_key_generate('RSA_key', 'RSA', 384);
  +---------------------------------------------+
  | keyring_key_generate('RSA_key', 'RSA', 384) |
  +---------------------------------------------+
  |                                           1 |
  +---------------------------------------------+
  ```

- `keyring_key_length_fetch(key_id)`

  Dada uma ID chave, retorna o comprimento da chave.

  Argumentos:

  - `key_id`: Uma string que especifica o ID da chave.

  Valor de retorno:

  Retorna o comprimento da chave em bytes como um inteiro para sucesso, `NULL` se a chave não existir, ou `NULL` e um erro para falha.

  Exemplo:

  Veja a descrição de `keyring_key_fetch()`.

- `keyring_key_remove(key_id)`

  Remove a chave com o ID fornecido do chaveiro.

  Argumentos:

  - `key_id`: Uma string que especifica o ID da chave.

  Valor de retorno:

  Retorna 1 para sucesso ou `NULL` para falha.

  Exemplo:

  ```
  mysql> SELECT keyring_key_remove('AES_key');
  +-------------------------------+
  | keyring_key_remove('AES_key') |
  +-------------------------------+
  |                             1 |
  +-------------------------------+
  ```

- `keyring_key_store(key_id, key_type, key)`

  Esconde e armazena uma chave no conjunto de chaves.

  Argumentos:

  - `key_id`: Uma string que especifica o ID da chave.

  - `key_type`: Uma string que especifica o tipo de chave.

  - `key`: Uma string que especifica o valor da chave.

  Valor de retorno:

  Retorna 1 para sucesso ou `NULL` e um erro para falha.

  Exemplo:

  ```
  mysql> SELECT keyring_key_store('new key', 'DSA', 'My key value');
  +-----------------------------------------------------+
  | keyring_key_store('new key', 'DSA', 'My key value') |
  +-----------------------------------------------------+
  |                                                   1 |
  +-----------------------------------------------------+
  ```

- `keyring_key_type_fetch(key_id)`

  Dada uma ID chave, retorna o tipo de chave.

  Argumentos:

  - `key_id`: Uma string que especifica o ID da chave.

  Valor de retorno:

  Retorna o tipo de chave como uma string para sucesso, `NULL` se a chave não existir, ou `NULL` e um erro para falha.

  Exemplo:

  Veja a descrição de `keyring_key_fetch()`.
