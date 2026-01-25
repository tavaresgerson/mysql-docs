#### 5.5.6.2 O Serviço Keyring

O MySQL Server suporta um serviço Keyring que permite que componentes internos do servidor e Plugins armazenem informações confidenciais de forma segura para posterior recuperação. As distribuições MySQL fornecem uma interface Keyring que é acessível em dois níveis:

* No nível SQL, como um conjunto de funções carregáveis (loadable functions) que mapeiam para chamadas às rotinas do Service.

* Como uma interface de linguagem C, que pode ser chamada como um serviço de Plugin a partir de Plugins do servidor ou funções carregáveis.

Esta seção descreve como usar as funções do serviço Keyring para armazenar, recuperar e remover keys no keystore do Keyring do MySQL. Para obter informações sobre a interface SQL que usa funções, consulte [Section 6.4.4.8, “General-Purpose Keyring Key-Management Functions”](keyring-functions-general-purpose.html "6.4.4.8 General-Purpose Keyring Key-Management Functions"). Para informações gerais sobre Keyring, consulte [Section 6.4.4, “The MySQL Keyring”](keyring.html "6.4.4 The MySQL Keyring").

O serviço Keyring utiliza qualquer Plugin Keyring subjacente que esteja habilitado, se houver. Se nenhum Plugin Keyring estiver habilitado, as chamadas de serviço Keyring falharão.

Um "registro" (record) no keystore consiste em dados (a própria key) e um identificador exclusivo através do qual a key é acessada. O identificador possui duas partes:

* `key_id`: O ID ou nome da key. Os valores de `key_id` que começam com `mysql_` são reservados pelo MySQL Server.

* `user_id`: O ID de usuário efetivo da sessão. Se não houver contexto de usuário, este valor pode ser `NULL`. O valor não precisa ser necessariamente um "usuário"; o significado depende da aplicação.

  As funções que implementam a interface de função Keyring passam o valor de [`CURRENT_USER()`](information-functions.html#function_current-user) como o valor `user_id` para as funções de serviço Keyring.

As funções do serviço Keyring têm estas características em comum:

* Cada função retorna 0 para sucesso e 1 para falha.
* Os argumentos `key_id` e `user_id` formam uma combinação exclusiva que indica qual key no Keyring deve ser usada.

* O argumento `key_type` fornece informações adicionais sobre a key, como seu método de encryption ou uso pretendido.

* As funções do serviço Keyring tratam IDs de keys, nomes de usuário, tipos e valores como strings binárias, portanto, as comparações diferenciam maiúsculas de minúsculas (case-sensitive). Por exemplo, IDs `MyKey` e `mykey` referem-se a keys diferentes.

Estas funções de serviço Keyring estão disponíveis:

* `my_key_fetch()`

  Desofusca e recupera uma key do Keyring, juntamente com seu tipo. A função aloca a memória para os buffers usados para armazenar a key e o tipo de key retornados. O chamador deve zerar ou ofuscar a memória quando ela não for mais necessária e, em seguida, liberá-la (free).

  Sintaxe:

  ```sql
  my_bool my_key_fetch(const char *key_id, const char **key_type,
                       const char* user_id, void **key, size_t *key_len)
  ```

  Argumentos:

  + `key_id`, `user_id`: Strings terminadas em nulo (null-terminated strings) que, em par, formam um identificador exclusivo indicando qual key deve ser recuperada (fetch).

  + `key_type`: O endereço de um ponteiro de buffer. A função armazena nele um ponteiro para uma string terminada em nulo que fornece informações adicionais sobre a key (armazenadas quando a key foi adicionada).

  + `key`: O endereço de um ponteiro de buffer. A função armazena nele um ponteiro para o buffer contendo os dados da key recuperada.

  + `key_len`: O endereço de uma variável na qual a função armazena o tamanho em bytes do buffer `*key`.

  Valor de Retorno:

  Retorna 0 para sucesso, 1 para falha.

* `my_key_generate()`

  Gera uma nova key aleatória de um determinado tipo e comprimento e a armazena no Keyring. A key tem um comprimento de `key_len` e está associada ao identificador formado por `key_id` e `user_id`. Os valores de tipo e comprimento devem ser consistentes com os valores suportados pelo Plugin Keyring subjacente. Consulte [Section 6.4.4.6, “Supported Keyring Key Types and Lengths”](keyring-key-types.html "6.4.4.6 Supported Keyring Key Types and Lengths").

  Sintaxe:

  ```sql
  my_bool my_key_generate(const char *key_id, const char *key_type,
                          const char *user_id, size_t key_len)
  ```

  Argumentos:

  + `key_id`, `user_id`: Strings terminadas em nulo que, em par, formam um identificador exclusivo para a key a ser gerada.

  + `key_type`: Uma string terminada em nulo que fornece informações adicionais sobre a key.

  + `key_len`: O tamanho em bytes da key a ser gerada.

  Valor de Retorno:

  Retorna 0 para sucesso, 1 para falha.

* `my_key_remove()`

  Remove uma key do Keyring.

  Sintaxe:

  ```sql
  my_bool my_key_remove(const char *key_id, const char* user_id)
  ```

  Argumentos:

  + `key_id`, `user_id`: Strings terminadas em nulo que, em par, formam um identificador exclusivo para a key a ser removida.

  Valor de Retorno:

  Retorna 0 para sucesso, 1 para falha.

* `my_key_store()`

  Ofusca e armazena uma key no Keyring.

  Sintaxe:

  ```sql
  my_bool my_key_store(const char *key_id, const char *key_type,
                       const char* user_id, void *key, size_t key_len)
  ```

  Argumentos:

  + `key_id`, `user_id`: Strings terminadas em nulo que, em par, formam um identificador exclusivo para a key a ser armazenada.

  + `key_type`: Uma string terminada em nulo que fornece informações adicionais sobre a key.

  + `key`: O buffer contendo os dados da key a serem armazenados.

  + `key_len`: O tamanho em bytes do buffer `key`.

  Valor de Retorno:

  Retorna 0 para sucesso, 1 para falha.