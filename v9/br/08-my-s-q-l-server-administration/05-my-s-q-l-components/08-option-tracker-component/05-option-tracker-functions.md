#### 7.5.8.5 Funções do Rastreador de Opções

O Rastreador de Opções fornece as funções mostradas na tabela a seguir. Informações mais detalhadas sobre cada função estão disponíveis na lista que segue a tabela.

Essas funções fornecem interfaces seguras para ler e atualizar a tabela `mysql_option.option_usage` (ver Seção 7.5.8.1, “Tabelas do Rastreador de Opções”) e a tabela `performance_schema.mysql_option`; além disso, as alterações feitas usando as funções são propagadas para os secundários da Replicação por Grupo, enquanto as alterações feitas usando SQL não o são. Por essas razões, você deve sempre usar as funções do Rastreador de Opções para modificar os dados de uso de opções em vez de tentar atualizar diretamente qualquer uma dessas tabelas.

**Tabela 7.11 Funções do Rastreador de Opções**

<table frame="box" rules="all" summary="Uma referência que lista as funções fornecidas pelo Componente Option Tracker."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><a class="link" href="option-tracker-component-functions.html#function_option-tracker-option-register"><code>option_tracker_option_register()</code></a></td> <td> Registrar uma opção com o nome da opção fornecido, o nome do contêiner e o valor de *`enabled`* com o Option Tracker; ou seja, uma linha correspondente a essa opção é inserida na tabela `mysql_option` do Schema de Desempenho.</td> </tr><tr><td><a class="link" href="option-tracker-component-functions.html#function_option-tracker-option-unregister"><code>option_tracker_option_unregister()</code></a></td> <td> Desregistrar uma opção do Option Tracker</td> </tr><tr><td><a class="link" href="option-tracker-component-functions.html#function_option-tracker-usage-get"><code>option_tracker_usage_get()</code></a></td> <td> Obter dados de uso para uma opção registrada com o Option Tracker</td> </tr><tr><td><a class="link" href="option-tracker-component-functions.html#function_option-tracker-usage-set"><code>option_tracker_usage_set()</code></a></td> <td> Definir dados de uso para uma opção registrada com o Option Tracker</td> </tr></tbody></table>

* `option_tracker_option_register()`

  Esta função registra a opção com o nome da opção fornecido, o nome do contêiner e o valor de *`enabled`* com o Option Tracker; ou seja, uma linha correspondente a essa opção é inserida na tabela `mysql_option` do Schema de Desempenho.

  Sintaxe:

  ```
  int option_tracker_option_register(
    string option_name,
    string container_name
    int enabled
  )
  ```

  Argumentos:

  + *`option_name`*: O nome da opção. Este é uma string que não é case-sensitive. Este argumento não pode ser nulo, embora possa ser uma string vazia.

+ *`container_name`*: O nome do contêiner. Este argumento é case-insensitive e não pode ser uma string vazia ou null.

  + *`enabled`*: `1` se a opção estiver habilitada, `0` se estiver desabilitada.

  Valor de retorno:

  `0` em caso de sucesso, um valor não nulo caso contrário. O valor não nulo é geralmente `1`, mas isso não é garantido.

  Exemplo:

  ```
  mysql> SELECT option_tracker_option_register('Berry Picker', 'component_berry_picker', 0);
  +-----------------------------------------------------------------------------+
  | option_tracker_option_register('Berry Picker', 'component_berry_picker', 0) |
  +-----------------------------------------------------------------------------+
  |                                                                           0 |
  +-----------------------------------------------------------------------------+
  ```

  Você pode verificar se a opção foi registrada consultando a tabela `mysql_option`, assim:

  ```
  mysql> SELECT * FROM performance_schema.mysql_option WHERE OPTION_NAME='Berry Picker';
  +--------------+----------------+------------------------+
  | OPTION_NAME  | OPTION_ENABLED | OPTION_CONTAINER       |
  +--------------+----------------+------------------------+
  | Berry Picker | FALSE          | component_berry_picker |
  +--------------+----------------+------------------------+
  ```

  Não é necessário que o contêiner nomeado realmente exista para que essa função funcione.

  O chamador deve ter o privilégio `OPTION_TRACKER_UPDATER`; esse privilégio deve ser concedido explicitamente.

  Chamadas subsequentes a essa função não têm efeito na tabela `mysql_option` e retornam `1`, indicando que a chamada à função não teve sucesso; para alterar o status de uma opção dada de desabilitada para habilitada, é necessário desregistrar usando `option_tracker_option_unregister()`, depois re-registrar, assim:

  ```
  mysql> SELECT option_tracker_option_register('Berry Picker', 'component_berry_picker', 0);
  +-----------------------------------------------------------------------------+
  | option_tracker_option_register('Berry Picker', 'component_berry_picker', 0) |
  +-----------------------------------------------------------------------------+
  |                                                                           0 |
  +-----------------------------------------------------------------------------+

  mysql> SELECT * FROM performance_schema.mysql_option WHERE OPTION_NAME='Berry Picker';
  +--------------+----------------+------------------------+
  | OPTION_NAME  | OPTION_ENABLED | OPTION_CONTAINER       |
  +--------------+----------------+------------------------+
  | Berry Picker | FALSE          | component_berry_picker |
  +--------------+----------------+------------------------+

  mysql> SELECT option_tracker_option_register('Berry Picker', 'component_berry_picker', 1);
  +-----------------------------------------------------------------------------+
  | option_tracker_option_register('Berry Picker', 'component_berry_picker', 1) |
  +-----------------------------------------------------------------------------+
  |                                                                           1 |
  +-----------------------------------------------------------------------------+

  mysql> SELECT * FROM performance_schema.mysql_option WHERE OPTION_NAME='Berry Picker';
  +--------------+----------------+------------------------+
  | OPTION_NAME  | OPTION_ENABLED | OPTION_CONTAINER       |
  +--------------+----------------+------------------------+
  | Berry Picker | FALSE          | component_berry_picker |
  +--------------+----------------+------------------------+

  mysql> SELECT option_tracker_option_unregister('Berry Picker');
  +--------------------------------------------------+
  | option_tracker_option_unregister('Berry Picker') |
  +--------------------------------------------------+
  |                                                0 |
  +--------------------------------------------------+

  mysql> SELECT * FROM performance_schema.mysql_option WHERE OPTION_NAME='Berry Picker';
  Empty set (0.00 sec)

  mysql> SELECT option_tracker_option_register('Berry Picker', 'component_berry_picker', 1);
  +-----------------------------------------------------------------------------+
  | option_tracker_option_register('Berry Picker', 'component_berry_picker', 1) |
  +-----------------------------------------------------------------------------+
  |                                                                           0 |
  +-----------------------------------------------------------------------------+

  mysql> SELECT * FROM performance_schema.mysql_option WHERE OPTION_NAME='Berry Picker';
  +--------------+----------------+------------------------+
  | OPTION_NAME  | OPTION_ENABLED | OPTION_CONTAINER       |
  +--------------+----------------+------------------------+
  | Berry Picker | TRUE           | component_berry_picker |
  +--------------+----------------+------------------------+
  ```

  Chamadas a essa função não atualizam a tabela `mysql_option.option_usage`; para adicionar ou atualizar informações de uso, use `option_tracker_usage_set()`.

* `option_tracker_option_unregister()`

  Essa função desregistra uma opção que foi previamente registrada; ou seja, remove a linha correspondente da tabela `mysql_option`.

  Sintaxe:

  ```
  int option_tracker_option_unregister(
    string option_name
  )
  ```

  Argumentos:

  *`option_name`*: O nome da opção a ser desregistrada. Esta é uma string case-insensitive, que não pode ser null, mas pode ser uma string vazia.

  Valor de retorno:

  `0` em caso de sucesso, um valor não nulo caso contrário. O valor não nulo é geralmente `1`, mas isso não é garantido.

  Exemplo:

  ```
  mysql> SELECT * FROM performance_schema.mysql_option
      ->   WHERE OPTION_NAME='Berry Picker';
  +--------------+----------------+------------------------+
  | OPTION_NAME  | OPTION_ENABLED | OPTION_CONTAINER       |
  +--------------+----------------+------------------------+
  | Berry Picker | TRUE           | component_berry_picker |
  +--------------+----------------+------------------------+

  mysql> SELECT option_tracker_option_unregister('Berry Picker');
  +--------------------------------------------------+
  | option_tracker_option_unregister('berry picker') |
  +--------------------------------------------------+
  |                                                0 |
  +--------------------------------------------------+


  mysql> SELECT * FROM performance_schema.mysql_option
      -> WHERE OPTION_NAME='Berry Picker';
  Empty set (0.00 sec)
  ```

  Como observado anteriormente, o nome da opção é case-insensitive, como mostrado aqui:

  ```
  mysql> SELECT * FROM performance_schema.mysql_option
      ->   WHERE OPTION_NAME='Berry Picker';
  +--------------+----------------+------------------------+
  | OPTION_NAME  | OPTION_ENABLED | OPTION_CONTAINER       |
  +--------------+----------------+------------------------+
  | Berry Picker | TRUE           | component_berry_picker |
  +--------------+----------------+------------------------+

  mysql> SELECT option_tracker_option_unregister('berry picker');
  +--------------------------------------------------+
  | option_tracker_option_unregister('berry picker') |
  +--------------------------------------------------+
  |                                                0 |
  +--------------------------------------------------+

  mysql> SELECT * FROM performance_schema.mysql_option
      ->   WHERE OPTION_NAME='Berry Picker';
  Empty set (0.00 sec)
  ```

`option_tracker_option_unregister()` retorna um valor não nulo indicando falha se não for encontrada nenhuma linha correspondente ao nome da opção na tabela `mysql_option`.

* `option_tracker_usage_get()`

  Esta função retorna o mesmo valor que a seguinte consulta:

  ```
  mysql> SELECT USAGE_DATA FROM mysql_option.option_usage
      ->   WHERE OPTION_NAME='JavaScript Stored Program';
  +-------------------------------------------------------+
  | USAGE_DATA                                            |
  +-------------------------------------------------------+
  | {"used": "false", "usedDate": "2024-10-17T20:24:41Z"} |
  +-------------------------------------------------------+
  ```

  Sintaxe:

  ```
  string option_tracker_usage_get(
    option_name
  )
  ```

  Argumentos:

  *`option_name`*: Uma string sem consideração de maiúsculas e minúsculas.

  Valor de retorno: Uma string no formato `JSON`. Veja a descrição da função `option_tracker_usage_set()` para obter mais informações sobre esse valor.

  Exemplo:

  ```
  mysql> SELECT option_tracker_usage_get('Berry Picker');
  +----------------------------------------------------+
  | option_tracker_usage_get('Berry Picker')           |
  +----------------------------------------------------+
  | {"used": true, "usedDate": "2024-10-16T09:14:41Z"} |
  +----------------------------------------------------+
  ```

* `option_tracker_usage_set()`

  Define os dados de uso para a opção nomeada.

  Sintaxe:

  ```
  int option_tracker_usage_set(
    string option_name,
    string usage_data
  )
  ```

  Argumentos:

  + *`option_name`*: O nome da opção, uma string sem consideração de maiúsculas e minúsculas. Isso pode ser uma string vazia, mas não pode ser `null`.

  + *`usage_data`*: Os dados de uso para registrar a opção nomeada. Isso deve ser uma string formatada em `JSON`, que geralmente assume a forma mostrada aqui:

    ```
    {
      "used": "boolean"
      "usedDate": "ISO8601 date"
    }
    ```

    A chave `used` deve ser `true` se a opção tiver sido usada durante a sessão atual e `false` caso contrário. `usedDate` deve ser um valor de data e hora citado no formato [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html), por exemplo, `"2024-10-17T20:24:41Z"`. Embora isso não seja um requisito, normalmente espera-se que essa seja a data e hora atuais em UTC. Você pode obter esse valor, usando `UTC_DATE()` e `UTC_TIME()`, de forma semelhante à mostrada aqui (texto destacado):

    ```
    SELECT option_tracker_option_set(
      'Berry Picker',
      CONCAT(UTC_DATE(), 'T', UTC_TIME(), 'Z')
    );
    ```

    O formato do *`usage_data`* mostrado, com as chaves `used` e `usedDate`, é o recomendado. É possível incluir outras chaves e valores na string `JSON`, mas também é possível que eles não sejam lidos, entendidos ou até permitidos por outras aplicações.

  Tipo de retorno:

Um inteiro: `0` em caso de sucesso e um valor não nulo (geralmente `1`) caso contrário.

Exemplo:

```
  mysql> SELECT option_tracker_usage_set(
      ->   'Berry Picker', '{"used": true, "usedDate": "2024-10-17T20:38:23Z"}');
  +------------------------------------------------------------------------------------------------+
  | option_tracker_usage_set('Berry Picker', '{"used": true, "usedDate": "2024-10-17T20:38:23Z"}') |
  +------------------------------------------------------------------------------------------------+
  |                                                                                              0 |
  +------------------------------------------------------------------------------------------------+

  mysql> SELECT option_tracker_usage_get('Berry Picker');
  +----------------------------------------------------+
  | option_tracker_usage_get('Berry Picker')           |
  +----------------------------------------------------+
  | {"used": true, "usedDate": "2024-10-17T20:38:23Z"} |
  +----------------------------------------------------+
  ```

`option_tracker_usage_set()` exige que o usuário que chama a função seja concedido explicitamente o privilégio `OPTION_TRACKER_UPDATER`; `option_tracker_usage_get()` exige qualquer um dos `OPTION_TRACKER_UPDATER` ou `OPTION_TRACKER_OBSERVER`. Isso é verdadeiro mesmo para o usuário `root` do MySQL.