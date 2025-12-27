#### 7.6.9.2 O Serviço de Chaveiro

O MySQL Server suporta um serviço de chaveiro que permite que componentes internos e plugins armazem informações sensíveis de forma segura para recuperação posterior. As distribuições do MySQL fornecem uma interface de chaveiro acessível em dois níveis:

* No nível SQL, como um conjunto de funções carregáveis que correspondem a chamadas às rotinas do serviço.
* Como uma interface em linguagem C, acessível como um serviço de plugin a partir de plugins do servidor ou funções carregáveis.

Esta secção descreve como usar as funções do serviço de chaveiro para armazenar, recuperar e remover chaves no keystore do MySQL Keyring. Para informações sobre a interface SQL que usa funções, consulte a Seção 8.4.4.12, “Funções de Gerenciamento de Chaves de Chaveiro de Uso Geral”. Para informações gerais sobre o chaveiro, consulte a Seção 8.4.4, “O MySQL Keyring”.

O serviço de chaveiro usa o plugin de chaveiro subjacente, se houver. Se nenhum plugin de chaveiro estiver habilitado, as chamadas ao serviço de chaveiro falham.

Um “registro” no keystore consiste em dados (a própria chave) e um identificador único pelo qual a chave é acessada. O identificador tem duas partes:

* `key_id`: O ID ou nome da chave. Os valores `key_id` que começam com `mysql_` são reservados pelo MySQL Server.
* `user_id`: O ID de usuário efetivo da sessão. Se não houver contexto de usuário, esse valor pode ser `NULL`. O valor não precisa ser realmente um “usuário”; o significado depende da aplicação.

As funções que implementam a interface de função de chaveiro passam o valor de  `CURRENT_USER()` como o valor de `user_id` para as funções do serviço de chaveiro.

As funções do serviço de chaveiro têm essas características em comum:

* Cada função retorna 0 para sucesso, 1 para falha.
* Os argumentos `key_id` e `user_id` formam uma combinação única que indica qual chave no conjunto de chaves a ser usada.
* O argumento `key_type` fornece informações adicionais sobre a chave, como seu método de criptografia ou uso pretendido.
* As funções do serviço de conjunto de chaves tratam IDs de chaves, nomes de usuários, tipos e valores como strings binárias, portanto, as comparações são sensíveis ao caso. Por exemplo, IDs de `MyKey` e `mykey` referem-se a chaves diferentes.

Estas funções do serviço de conjunto de chaves estão disponíveis:

* `my_key_fetch()`

  Desobstrui e recupera uma chave do conjunto de chaves, juntamente com seu tipo. A função aloca a memória para os buffers usados para armazenar a chave e o tipo de chave retornados. O chamador deve zerar ou obstrurgir a memória quando ela não for mais necessária, e depois liberá-la.

  Sintaxe:

  ```
  bool my_key_fetch(const char *key_id, const char **key_type,
                    const char* user_id, void **key, size_t *key_len)
  ```

  Argumentos:

  + `key_id`, `user_id`: Strings terminadas por nulo que, como um par, formam um identificador único indicando qual chave deve ser recuperada.
  + `key_type`: O endereço de um ponteiro de buffer. A função armazena nele um ponteiro para uma string terminada por nulo que fornece informações adicionais sobre a chave (armazenadas quando a chave foi adicionada).
  + `key`: O endereço de um ponteiro de buffer. A função armazena nele um ponteiro para o buffer que contém os dados da chave recuperados.
  + `key_len`: O endereço de uma variável na qual a função armazena o tamanho em bytes do buffer `*key`.

  Valor de retorno:

  Retorna 0 para sucesso, 1 para falha.
* `my_key_generate()`

  Gera uma nova chave aleatória de um tipo e comprimento dados e a armazena no conjunto de chaves. A chave tem um comprimento de `key_len` e está associada ao identificador formado por `key_id` e `user_id`. Os valores de tipo e comprimento devem ser consistentes com os valores suportados pelo plugin de conjunto de chaves subjacente. Consulte  Seção 8.4.4.10, “Tipos e comprimentos de chaves de conjunto de chaves suportados”.

  Sintaxe:

  ```
  bool my_key_generate(const char *key_id, const char *key_type,
                       const char *user_id, size_t key_len)
  ```

  Argumentos:
```
  bool my_key_remove(const char *key_id, const char* user_id)
  ```
```
  bool my_key_store(const char *key_id, const char *key_type,
                    const char* user_id, void *key, size_t key_len)
  ```

















































































































j7cX5sZRLnodqsEco1VX```

  Argumentos:

  + `key_id`, `user_id`: Cadeias terminadas em nulo que, como um par, formam um identificador único para a chave a ser armazenada.
  + `key_type`: Uma cadeia terminada em nulo que fornece informações adicionais sobre a chave.
  + `key`: O buffer contendo os dados da chave a ser armazenada.
  + `key_len`: O tamanho em bytes do buffer `key`.

  Valor de retorno:

  Retorna 0 para sucesso, 1 para falha.