#### 5.5.6.2 O Serviço de Chaveiro

O MySQL Server suporta um serviço de chave de segurança que permite que componentes internos do servidor e plugins armazem informações sensíveis de forma segura para recuperação posterior. As distribuições do MySQL fornecem uma interface de chave de segurança acessível em dois níveis:

- No nível SQL, como um conjunto de funções carregáveis que correspondem a chamadas às rotinas de serviço.

- Como uma interface em linguagem C, acessível como um serviço de plugin a partir de plugins do servidor ou funções carregáveis.

Esta seção descreve como usar as funções do serviço de chaveiro para armazenar, recuperar e remover chaves no keystore do keyring MySQL. Para informações sobre a interface SQL que usa funções, consulte Seção 6.4.4.8, “Funções de gerenciamento de chaves do keyring de propósito geral”. Para informações gerais sobre o keyring, consulte Seção 6.4.4, “O keyring MySQL”.

O serviço de chave de acesso usa o plugin de chave de acesso subjacente habilitado, se houver. Se nenhum plugin de chave de acesso estiver habilitado, as chamadas do serviço de chave de acesso falham.

Um "registro" no keystore consiste em dados (a própria chave) e um identificador único através do qual a chave é acessada. O identificador tem duas partes:

- `key_id`: O ID ou nome da chave. Os valores de `key_id` que começam com `mysql_` são reservados pelo MySQL Server.

- `user_id`: O ID de usuário efetivo da sessão. Se não houver contexto de usuário, esse valor pode ser `NULL`. O valor não precisa ser realmente um "usuário"; o significado depende do aplicativo.

  As funções que implementam a interface da função de chave de segurança passam o valor de `CURRENT_USER()` como o valor `user_id` para as funções do serviço de chave de segurança.

As funções do serviço de chaveiros têm essas características em comum:

- Cada função retorna 0 para sucesso e 1 para falha.

- Os argumentos `key_id` e `user_id` formam uma combinação única que indica qual chave no conjunto de chaves deve ser usada.

- O argumento `key_type` fornece informações adicionais sobre a chave, como seu método de criptografia ou uso pretendido.

- As funções do serviço de chaveiro tratam os IDs de chave, nomes de usuário, tipos e valores como strings binárias, portanto, as comparações são sensíveis ao caso. Por exemplo, os IDs de `MyKey` e `mykey` referem-se a chaves diferentes.

Estes são os serviços de chaveiros disponíveis:

- `my_key_fetch()`

  Desobfuso e recupera uma chave do conjunto de chaves, juntamente com seu tipo. A função aloca a memória para os buffers usados para armazenar a chave e o tipo de chave retornados. O chamador deve zerar ou obfuscar a memória quando ela não for mais necessária, e depois liberá-la.

  Sintaxe:

  ```sql
  my_bool my_key_fetch(const char *key_id, const char **key_type,
                       const char* user_id, void **key, size_t *key_len)
  ```

  Argumentos:

  - `key_id`, `user_id`: Strings terminadas por nulo que, como um par, formam um identificador único que indica qual chave deve ser recuperada.

  - `key_type`: O endereço de um ponteiro de buffer. A função armazena nele um ponteiro para uma string terminada por nulo que fornece informações adicionais sobre a chave (armazenadas quando a chave foi adicionada).

  - `key`: O endereço de um ponteiro de buffer. A função armazena nele um ponteiro para o buffer que contém os dados da chave obtidos.

  - `key_len`: O endereço de uma variável na qual a função armazena o tamanho, em bytes, do buffer `*key`.

  Valor de retorno:

  Retorna 0 para sucesso, 1 para falha.

- `my_key_generate()`

  Gera uma nova chave aleatória de um tipo e comprimento específicos e armazena-a no conjunto de chaves. A chave tem um comprimento de `key_len` e está associada ao identificador formado por `key_id` e `user_id`. Os valores de tipo e comprimento devem ser consistentes com os valores suportados pelo plugin de conjunto de chaves subjacente. Consulte Seção 6.4.4.6, “Tipos e comprimentos de chaves de conjunto de chaves suportados”.

  Sintaxe:

  ```sql
  my_bool my_key_generate(const char *key_id, const char *key_type,
                          const char *user_id, size_t key_len)
  ```

  Argumentos:

  - `key_id`, `user_id`: Strings terminadas por nulo que, como um par, formam um identificador único para a chave a ser gerada.

  - `key_type`: Uma string terminada por nulo que fornece informações adicionais sobre a chave.

  - `key_len`: O tamanho em bytes da chave a ser gerada.

  Valor de retorno:

  Retorna 0 para sucesso, 1 para falha.

- `my_key_remove()`

  Remove uma chave do chaveiro.

  Sintaxe:

  ```sql
  my_bool my_key_remove(const char *key_id, const char* user_id)
  ```

  Argumentos:

  - `key_id`, `user_id`: Strings terminadas por nulo que, como um par, formam um identificador único para a chave a ser removida.

  Valor de retorno:

  Retorna 0 para sucesso, 1 para falha.

- `my_key_store()`

  Esconde e armazena uma chave no conjunto de chaves.

  Sintaxe:

  ```sql
  my_bool my_key_store(const char *key_id, const char *key_type,
                       const char* user_id, void *key, size_t key_len)
  ```

  Argumentos:

  - `key_id`, `user_id`: Strings terminadas por nulo que, como um par, formam um identificador único para a chave a ser armazenada.

  - `key_type`: Uma string terminada por nulo que fornece informações adicionais sobre a chave.

  - `key`: O buffer contendo os dados de chave a serem armazenados.

  - `key_len`: O tamanho em bytes do buffer `key`.

  Valor de retorno:

  Retorna 0 para sucesso, 1 para falha.
