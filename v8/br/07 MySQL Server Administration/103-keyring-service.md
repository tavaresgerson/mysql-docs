#### 7.6.9.2 O serviço de colocação de chaves

O MySQL Server suporta um serviço de keyring que permite que componentes e plugins internos armazenem informações confidenciais com segurança para recuperação posterior.

- No nível SQL, como um conjunto de funções carregáveis que cada mapa em chamadas para as rotinas de serviço.
- Como uma interface de linguagem C, chamável como um serviço de plug-in de plug-ins de servidor ou funções carregáveis.

Esta seção descreve como usar as funções de serviço de chaveiro para armazenar, recuperar e remover chaves no keystore de chaveiro do MySQL. Para informações sobre a interface SQL que usa funções, Seção 8.4.4.12, Funções de gerenciamento de chaveiro de propósito geral. Para informações gerais de chaveiro, veja Seção 8.4.4, The MySQL Keyring.

O serviço de keyring usa qualquer plugin de keyring subjacente ativado, se houver. Se nenhum plugin de keyring estiver ativado, as chamadas de serviço de keyring falham.

Um "record" no keystore consiste em dados (a própria chave) e um identificador único através do qual a chave é acessada.

- `key_id`: O ID ou nome da chave. `key_id` valores que começam com `mysql_` são reservados pelo MySQL Server.
- `user_id`: O ID de usuário efetivo da sessão. Se não houver contexto de usuário, este valor pode ser `NULL`. O valor não precisa ser realmente um user; o significado depende da aplicação.

  As funções que implementam a interface de função de chaveiro passam o valor de `CURRENT_USER()` como o valor de `user_id` para as funções de serviço de chaveiro.

As funções de serviço de chaveiro têm as seguintes características em comum:

- Cada função retorna 0 para sucesso, 1 para falha.
- Os argumentos `key_id` e `user_id` formam uma combinação única indicando qual tecla no chaveiro a ser usada.
- O argumento `key_type` fornece informações adicionais sobre a chave, como seu método de criptografia ou uso pretendido.
- As funções de serviço de chave tratam IDs de chave, nomes de usuário, tipos e valores como strings binárias, então as comparações são sensíveis a maiúsculas e minúsculas. Por exemplo, IDs de `MyKey` e `mykey` referem-se a chaves diferentes.

Estas funções de serviço de chaveiro estão disponíveis:

- `my_key_fetch()`

  A função aloca a memória para os buffers usados para armazenar a chave e o tipo de chave retornados. O chamador deve zero ou ofuscar a memória quando ela não for mais necessária, em seguida, liberá-la.

  Sintaxe:

  ```
  bool my_key_fetch(const char *key_id, const char **key_type,
                    const char* user_id, void **key, size_t *key_len)
  ```

  Argumentos:

  - `key_id`, `user_id`: Strings com terminação nula que, como um par, formam um identificador exclusivo indicando qual chave buscar.
  - `key_type`: O endereço de um ponteiro de buffer. A função armazena nele um ponteiro para uma string terminada em zero que fornece informações adicionais sobre a chave (armazenada quando a chave foi adicionada).
  - `key`: O endereço de um ponteiro de buffer. A função armazena nele um ponteiro para o buffer contendo os dados-chave recuperados.
  - `key_len`: O endereço de uma variável na qual a função armazena o tamanho em bytes do buffer `*key`.

  Valor de retorno:

  Retorna 0 para sucesso, 1 para falha.
- `my_key_generate()`

  Gerar uma nova chave aleatória de um determinado tipo e comprimento e armazená-la no chaveiro. A chave tem um comprimento de `key_len` e está associada ao identificador formado a partir de `key_id` e `user_id`. Os valores de tipo e comprimento devem ser consistentes com os valores suportados pelo plugin de chaveiro subjacente. Veja Seção 8.4.4.10, Tipos e Longos de Chaveiros Suportados.

  Sintaxe:

  ```
  bool my_key_generate(const char *key_id, const char *key_type,
                       const char *user_id, size_t key_len)
  ```

  Argumentos:

  - `key_id`, `user_id`: Strings com terminação nula que, como um par, formam um identificador exclusivo para a chave a ser gerada.
  - `key_type`: Uma sequência de caracteres com terminação nula que fornece informações adicionais sobre a chave.
  - `key_len`: O tamanho em bytes da chave a ser gerada.

  Valor de retorno:

  Retorna 0 para sucesso, 1 para falha.
- `my_key_remove()`

  Retira uma chave do chaveiro.

  Sintaxe:

  ```
  bool my_key_remove(const char *key_id, const char* user_id)
  ```

  Argumentos:

  - `key_id`, `user_id`: Strings com terminação nula que, como um par, formam um identificador exclusivo para a chave a ser removida.

  Valor de retorno:

  Retorna 0 para sucesso, 1 para falha.
- `my_key_store()`

  Obfusca e armazena uma chave no chaveiro.

  Sintaxe:

  ```
  bool my_key_store(const char *key_id, const char *key_type,
                    const char* user_id, void *key, size_t key_len)
  ```

  Argumentos:

  - `key_id`, `user_id`: Strings com terminação nula que, como um par, formam um identificador exclusivo para a chave a ser armazenada.
  - `key_type`: Uma sequência de caracteres com terminação nula que fornece informações adicionais sobre a chave.
  - `key`: O buffer que contém os dados-chave a armazenar.
  - `key_len`: O tamanho em bytes do buffer `key`.

  Valor de retorno:

  Retorna 0 para sucesso, 1 para falha.
