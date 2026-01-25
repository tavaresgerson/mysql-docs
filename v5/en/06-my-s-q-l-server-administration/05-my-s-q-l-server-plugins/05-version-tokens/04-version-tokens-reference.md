#### 5.5.5.4 Referência de Version Tokens

A discussão a seguir serve como referência para estes elementos de Version Tokens:

* [Funções de Version Tokens](version-tokens-reference.html#version-tokens-routines "Version Tokens Functions")
* [Variáveis de Sistema de Version Tokens](version-tokens-reference.html#version-tokens-system-variables "Version Tokens System Variables")

##### Funções de Version Tokens

A biblioteca do Plugin Version Tokens inclui várias funções. Um conjunto de funções permite que a lista de version tokens do servidor seja manipulada e inspecionada. Outro conjunto de funções permite que os version tokens sejam Locked e Unlocked. O privilégio [`SUPER`](privileges-provided.html#priv_super) é exigido para invocar qualquer função de Version Tokens.

As funções a seguir permitem que a lista de version tokens do servidor seja criada, alterada, removida e inspecionada. A interpretação dos argumentos *`name_list`* e *`token_list`* (incluindo o tratamento de espaços em branco) ocorre conforme descrito na [Seção 5.5.5.3, “Usando Version Tokens”](version-tokens-usage.html "5.5.5.3 Usando Version Tokens"), que fornece detalhes sobre a sintaxe para especificação de tokens, bem como exemplos adicionais.

* [`version_tokens_delete(name_list)`](version-tokens-reference.html#function_version-tokens-delete)

  Exclui tokens da lista de version tokens do servidor usando o argumento *`name_list`* e retorna uma string binária que indica o resultado da operação. *`name_list`* é uma lista de nomes de version tokens separados por ponto e vírgula a serem excluídos.

  ```sql
  mysql> SELECT version_tokens_delete('tok1;tok3');
  +------------------------------------+
  | version_tokens_delete('tok1;tok3') |
  +------------------------------------+
  | 2 version tokens deleted.          |
  +------------------------------------+
  ```

  Um argumento `NULL` é tratado como uma string vazia, o que não tem efeito na lista de tokens.

  [`version_tokens_delete()`](version-tokens-reference.html#function_version-tokens-delete) exclui os tokens nomeados em seu argumento, se existirem. (Não é um erro excluir tokens não existentes.) Para limpar a lista de tokens inteiramente sem saber quais tokens estão na lista, passe `NULL` ou uma string que não contenha tokens para [`version_tokens_set()`](version-tokens-reference.html#function_version-tokens-set):

  ```sql
  mysql> SELECT version_tokens_set(NULL);
  +------------------------------+
  | version_tokens_set(NULL)     |
  +------------------------------+
  | Version tokens list cleared. |
  +------------------------------+
  mysql> SELECT version_tokens_set('');
  +------------------------------+
  | version_tokens_set('')       |
  +------------------------------+
  | Version tokens list cleared. |
  +------------------------------+
  ```

* [`version_tokens_edit(token_list)`](version-tokens-reference.html#function_version-tokens-edit)

  Modifica a lista de version tokens do servidor usando o argumento *`token_list`* e retorna uma string binária que indica o resultado da operação. *`token_list`* é uma lista de pares `name=value` separados por ponto e vírgula, especificando o nome de cada token a ser definido e seu valor. Se um token existir, seu valor é atualizado com o valor fornecido. Se um token não existir, ele é criado com o valor fornecido. Se o argumento for `NULL` ou uma string sem tokens, a lista de tokens permanece inalterada.

  ```sql
  mysql> SELECT version_tokens_set('tok1=value1;tok2=value2');
  +-----------------------------------------------+
  | version_tokens_set('tok1=value1;tok2=value2') |
  +-----------------------------------------------+
  | 2 version tokens set.                         |
  +-----------------------------------------------+
  mysql> SELECT version_tokens_edit('tok2=new_value2;tok3=new_value3');
  +--------------------------------------------------------+
  | version_tokens_edit('tok2=new_value2;tok3=new_value3') |
  +--------------------------------------------------------+
  | 2 version tokens updated.                              |
  +--------------------------------------------------------+
  ```

* [`version_tokens_set(token_list)`](version-tokens-reference.html#function_version-tokens-set)

  Substitui a lista de version tokens do servidor pelos tokens definidos no argumento *`token_list`* e retorna uma string binária que indica o resultado da operação. *`token_list`* é uma lista de pares `name=value` separados por ponto e vírgula, especificando o nome de cada token a ser definido e seu valor. Se o argumento for `NULL` ou uma string sem tokens, a lista de tokens é limpa.

  ```sql
  mysql> SELECT version_tokens_set('tok1=value1;tok2=value2');
  +-----------------------------------------------+
  | version_tokens_set('tok1=value1;tok2=value2') |
  +-----------------------------------------------+
  | 2 version tokens set.                         |
  +-----------------------------------------------+
  ```

* [`version_tokens_show()`](version-tokens-reference.html#function_version-tokens-show)

  Retorna a lista de version tokens do servidor como uma string binária contendo uma lista de pares `name=value` separados por ponto e vírgula.

  ```sql
  mysql> SELECT version_tokens_show();
  +--------------------------+
  | version_tokens_show()    |
  +--------------------------+
  | tok2=value2;tok1=value1; |
  +--------------------------+
  ```

As funções a seguir permitem que os version tokens sejam Locked e Unlocked:

* [`version_tokens_lock_exclusive(token_name[, token_name] ..., timeout)`](version-tokens-reference.html#function_version-tokens-lock-exclusive)

  Adquire Exclusive Locks em um ou mais version tokens, especificados pelo nome como strings, gerando um timeout com erro se os Locks não forem adquiridos dentro do valor de timeout fornecido.

  ```sql
  mysql> SELECT version_tokens_lock_exclusive('lock1', 'lock2', 10);
  +-----------------------------------------------------+
  | version_tokens_lock_exclusive('lock1', 'lock2', 10) |
  +-----------------------------------------------------+
  |                                                   1 |
  +-----------------------------------------------------+
  ```

* [`version_tokens_lock_shared(token_name[, token_name] ..., timeout)`](version-tokens-reference.html#function_version-tokens-lock-shared)

  Adquire Shared Locks em um ou mais version tokens, especificados pelo nome como strings, gerando um timeout com erro se os Locks não forem adquiridos dentro do valor de timeout fornecido.

  ```sql
  mysql> SELECT version_tokens_lock_shared('lock1', 'lock2', 10);
  +--------------------------------------------------+
  | version_tokens_lock_shared('lock1', 'lock2', 10) |
  +--------------------------------------------------+
  |                                                1 |
  +--------------------------------------------------+
  ```

* [`version_tokens_unlock()`](version-tokens-reference.html#function_version-tokens-unlock)

  Libera todos os Locks que foram adquiridos na Session atual usando [`version_tokens_lock_exclusive()`](version-tokens-reference.html#function_version-tokens-lock-exclusive) e [`version_tokens_lock_shared()`](version-tokens-reference.html#function_version-tokens-lock-shared).

  ```sql
  mysql> SELECT version_tokens_unlock();
  +-------------------------+
  | version_tokens_unlock() |
  +-------------------------+
  |                       1 |
  +-------------------------+
  ```

As funções de Locking compartilham estas características:

* O valor de retorno é diferente de zero para sucesso. Caso contrário, ocorre um erro.

* Nomes de tokens são strings.
* Em contraste com o tratamento de argumentos para as funções que manipulam a lista de tokens do servidor, espaços em branco ao redor dos argumentos de nome de token não são ignorados e os caracteres `=` e `;` são permitidos.

* É possível dar Lock em nomes de tokens não existentes. Isso não cria os tokens.

* Os valores de Timeout são inteiros não negativos que representam o tempo em segundos de espera para adquirir Locks antes de atingir o timeout com um erro. Se o timeout for 0, não haverá espera e a função produzirá um erro se os Locks não puderem ser adquiridos imediatamente.

* As funções de Locking do Version Tokens são baseadas no Locking Service descrito na [Seção 5.5.6.1, “O Locking Service”](locking-service.html "5.5.6.1 The Locking Service").

##### Variáveis de Sistema de Version Tokens

O Version Tokens suporta as seguintes variáveis de sistema. Essas variáveis não estão disponíveis a menos que o Plugin Version Tokens esteja instalado (consulte [Seção 5.5.5.2, “Instalando ou Desinstalando Version Tokens”](version-tokens-installation.html "5.5.5.2 Installing or Uninstalling Version Tokens")).

Variáveis de sistema:

* [`version_tokens_session`](version-tokens-reference.html#sysvar_version_tokens_session)

  <table frame="box" rules="all" summary="Propriedades para version_tokens_session"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--version-tokens-session=value</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>version_tokens_session</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmica</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr> </tbody></table>

  O valor de Session desta variável especifica a lista de version tokens do cliente e indica os tokens que a Session do cliente exige que a lista de version tokens do servidor possua.

  Se a variável [`version_tokens_session`](version-tokens-reference.html#sysvar_version_tokens_session) for `NULL` (o padrão) ou tiver um valor vazio, qualquer lista de version tokens do servidor corresponderá. (Na prática, um valor vazio desativa os requisitos de correspondência.)

  Se a variável [`version_tokens_session`](version-tokens-reference.html#sysvar_version_tokens_session) tiver um valor não vazio, qualquer incompatibilidade (mismatch) entre seu valor e a lista de version tokens do servidor resultará em um erro para qualquer Statement que a Session envie ao servidor. Uma incompatibilidade ocorre sob estas condições:

  + Um nome de token no valor de [`version_tokens_session`](version-tokens-reference.html#sysvar_version_tokens_session) não está presente na lista de tokens do servidor. Neste caso, ocorre um erro [`ER_VTOKEN_PLUGIN_TOKEN_NOT_FOUND`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_vtoken_plugin_token_not_found).

  + Um valor de token no valor de [`version_tokens_session`](version-tokens-reference.html#sysvar_version_tokens_session) difere do valor do token correspondente na lista de tokens do servidor. Neste caso, ocorre um erro [`ER_VTOKEN_PLUGIN_TOKEN_MISMATCH`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_vtoken_plugin_token_mismatch).

  Não é considerada uma incompatibilidade se a lista de version tokens do servidor incluir um token não nomeado no valor de [`version_tokens_session`](version-tokens-reference.html#sysvar_version_tokens_session).

  Suponha que uma aplicação de gerenciamento tenha definido a lista de tokens do servidor da seguinte forma:

  ```sql
  mysql> SELECT version_tokens_set('tok1=a;tok2=b;tok3=c');
  +--------------------------------------------+
  | version_tokens_set('tok1=a;tok2=b;tok3=c') |
  +--------------------------------------------+
  | 3 version tokens set.                      |
  +--------------------------------------------+
  ```

  Um cliente registra os tokens que ele exige que o servidor corresponda definindo seu valor de [`version_tokens_session`](version-tokens-reference.html#sysvar_version_tokens_session). Em seguida, para cada Statement subsequente enviado pelo cliente, o servidor verifica sua lista de tokens em relação ao valor de [`version_tokens_session`](version-tokens-reference.html#sysvar_version_tokens_session) do cliente e produz um erro se houver uma incompatibilidade:

  ```sql
  mysql> SET @@SESSION.version_tokens_session = 'tok1=a;tok2=b';
  mysql> SELECT 1;
  +---+
  | 1 |
  +---+
  | 1 |
  +---+

  mysql> SET @@SESSION.version_tokens_session = 'tok1=b';
  mysql> SELECT 1;
  ERROR 3136 (42000): Version token mismatch for tok1. Correct value a
  ```

  O primeiro [`SELECT`](select.html "13.2.9 SELECT Statement") é bem-sucedido porque os tokens do cliente `tok1` e `tok2` estão presentes na lista de tokens do servidor e cada token tem o mesmo valor na lista do servidor. O segundo [`SELECT`](select.html "13.2.9 SELECT Statement") falha porque, embora `tok1` esteja presente na lista de tokens do servidor, ele tem um valor diferente do especificado pelo cliente.

  Neste ponto, qualquer Statement enviado pelo cliente falha, a menos que a lista de tokens do servidor mude de forma que corresponda novamente. Suponha que a aplicação de gerenciamento altere a lista de tokens do servidor da seguinte forma:

  ```sql
  mysql> SELECT version_tokens_edit('tok1=b');
  +-------------------------------+
  | version_tokens_edit('tok1=b') |
  +-------------------------------+
  | 1 version tokens updated.     |
  +-------------------------------+
  mysql> SELECT version_tokens_show();
  +-----------------------+
  | version_tokens_show() |
  +-----------------------+
  | tok3=c;tok1=b;tok2=b; |
  +-----------------------+
  ```

  Agora o valor de [`version_tokens_session`](version-tokens-reference.html#sysvar_version_tokens_session) do cliente corresponde à lista de tokens do servidor e o cliente pode novamente executar Statements com sucesso:

  ```sql
  mysql> SELECT 1;
  +---+
  | 1 |
  +---+
  | 1 |
  +---+
  ```

* [`version_tokens_session_number`](version-tokens-reference.html#sysvar_version_tokens_session_number)

  <table frame="box" rules="all" summary="Propriedades para version_tokens_session_number"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--version-tokens-session-number=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>version_tokens_session_number</code></td> </tr><tr><th>Escopo</th> <td>Global, Session</td> </tr><tr><th>Dinâmica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr> </tbody></table>

  Esta variável destina-se a uso interno.