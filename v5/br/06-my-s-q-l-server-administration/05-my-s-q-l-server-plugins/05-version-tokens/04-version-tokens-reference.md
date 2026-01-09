#### 5.5.5.4 Referência de Tokens de Versão

A discussão a seguir serve como referência para esses elementos de Tokens de Versão:

- Funções dos Tokens de Versão
- Variáveis de sistema de tokens de versão

##### Versão Tokens Funções

A biblioteca de plugins Version Tokens inclui várias funções. Um conjunto de funções permite manipular e inspecionar a lista de tokens de versão do servidor. Outro conjunto de funções permite que os tokens de versão sejam bloqueados e desbloqueados. O privilégio `SUPER` é necessário para invocar qualquer função de Version Tokens.

As seguintes funções permitem a criação, alteração, remoção e inspeção da lista de tokens de versão do servidor. A interpretação dos argumentos *`name_list`* e *`token_list`* (incluindo o tratamento de espaços em branco) ocorre conforme descrito na Seção 5.5.5.3, “Usando Tokens de Versão”, que fornece detalhes sobre a sintaxe para especificar tokens, além de exemplos adicionais.

- `version_tokens_delete(name_list)`

  Exclui tokens da lista de tokens de versão do servidor usando o argumento *`name_list`* e retorna uma string binária que indica o resultado da operação. *`name_list`* é uma lista separada por ponto-e-vírgula de nomes de tokens de versão a serem excluídos.

  ```sql
  mysql> SELECT version_tokens_delete('tok1;tok3');
  +------------------------------------+
  | version_tokens_delete('tok1;tok3') |
  +------------------------------------+
  | 2 version tokens deleted.          |
  +------------------------------------+
  ```

  Um argumento de `NULL` é tratado como uma string vazia, o que não afeta a lista de tokens.

  `version_tokens_delete()` exclui os tokens nomeados em seu argumento, se eles existirem. (Não é um erro excluir tokens inexistentes.) Para limpar a lista de tokens inteiramente sem saber quais tokens estão na lista, passe `NULL` ou uma string que não contenha tokens para `version_tokens_set()`:

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

- \`version\_tokens\_edit(token\_list)

  Modifica a lista de tokens de versão do servidor usando o argumento *`token_list`* e retorna uma string binária que indica o resultado da operação. *`token_list`* é uma lista separada por ponto-e-vírgula de pares `name=value`, especificando o nome de cada token a ser definido e seu valor. Se um token existir, seu valor é atualizado com o valor fornecido. Se um token não existir, ele é criado com o valor fornecido. Se o argumento for `NULL` ou uma string que não contenha tokens, a lista de tokens permanece inalterada.

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

- `version_tokens_set(token_list)`

  Substitui a lista de tokens de versão do servidor pelos tokens definidos no argumento *`token_list`* e retorna uma string binária que indica o resultado da operação. *`token_list`* é uma lista separada por ponto-e-vírgula de pares `name=value`, especificando o nome de cada token a ser definido e seu valor. Se o argumento for `NULL` ou uma string que não contenha tokens, a lista de tokens é limpa.

  ```sql
  mysql> SELECT version_tokens_set('tok1=value1;tok2=value2');
  +-----------------------------------------------+
  | version_tokens_set('tok1=value1;tok2=value2') |
  +-----------------------------------------------+
  | 2 version tokens set.                         |
  +-----------------------------------------------+
  ```

- `version_tokens_show()`

  Retorna a lista de tokens de versão do servidor como uma string binária contendo uma lista separada por ponto e vírgula de pares `nome=valor`.

  ```sql
  mysql> SELECT version_tokens_show();
  +--------------------------+
  | version_tokens_show()    |
  +--------------------------+
  | tok2=value2;tok1=value1; |
  +--------------------------+
  ```

As seguintes funções permitem que os tokens de versão sejam bloqueados e desbloqueados:

- `version_tokens_lock_exclusive(token_name[, token_name] ..., timeout)`

  Adquire bloqueados exclusivos em um ou mais tokens de versão, especificados por nome como strings, expirando com um erro se os bloqueados não forem adquiridos dentro do valor de tempo de espera especificado.

  ```sql
  mysql> SELECT version_tokens_lock_exclusive('lock1', 'lock2', 10);
  +-----------------------------------------------------+
  | version_tokens_lock_exclusive('lock1', 'lock2', 10) |
  +-----------------------------------------------------+
  |                                                   1 |
  +-----------------------------------------------------+
  ```

- `version_tokens_lock_shared(token_name[, token_name] ..., timeout)`

  Adquire blocos de versão compartilhados em um ou mais tokens, especificados pelo nome como strings, expirando com um erro se os blocos não forem adquiridos dentro do valor de tempo de espera especificado.

  ```sql
  mysql> SELECT version_tokens_lock_shared('lock1', 'lock2', 10);
  +--------------------------------------------------+
  | version_tokens_lock_shared('lock1', 'lock2', 10) |
  +--------------------------------------------------+
  |                                                1 |
  +--------------------------------------------------+
  ```

- `version_tokens_unlock()`

  Libera todos os bloqueios adquiridos durante a sessão atual usando `version_tokens_lock_exclusive()` e `version_tokens_lock_shared()`.

  ```sql
  mysql> SELECT version_tokens_unlock();
  +-------------------------+
  | version_tokens_unlock() |
  +-------------------------+
  |                       1 |
  +-------------------------+
  ```

As funções de bloqueio compartilham essas características:

- O valor de retorno é diferente de zero para sucesso. Caso contrário, ocorre um erro.

- Os nomes dos tokens são cadeias de caracteres.

- Em contraste com o tratamento de argumentos para as funções que manipulam a lista de tokens do servidor, os espaços em branco ao redor dos argumentos do nome do token não são ignorados e os caracteres `=` e `;` são permitidos.

- É possível bloquear nomes de tokens inexistentes. Isso não cria os tokens.

- Os valores de tempo de espera são inteiros não negativos que representam o tempo em segundos para aguardar para adquirir blocos antes de expirar com um erro. Se o tempo de espera for 0, não há espera e a função produz um erro se os blocos não puderem ser adquiridos imediatamente.

- As funções de bloqueio de tokens de versão são baseadas no serviço de bloqueio descrito na Seção 5.5.6.1, “O Serviço de Bloqueio”.

##### Sistema de Tokens de Versão Variáveis

O Version Tokens suporta as seguintes variáveis de sistema. Essas variáveis não estão disponíveis a menos que o plugin Version Tokens esteja instalado (consulte Seção 5.5.5.2, “Instalando ou Desinstalando o Version Tokens”).

Variáveis do sistema:

- `version_tokens_session`

  <table frame="box" rules="all" summary="Propriedades para version_tokens_session"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--version-tokens-session=value</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="version-tokens-reference.html#sysvar_version_tokens_session">version_tokens_session</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

  O valor da sessão desta variável especifica a lista de tokens da versão do cliente e indica os tokens que a sessão do cliente exige que a lista de tokens da versão do servidor tenha.

  Se a variável `version_tokens_session` for `NULL` (o padrão) ou tiver um valor vazio, qualquer lista de tokens de versão do servidor será compatível. (Na prática, um valor vazio desativa os requisitos de compatibilidade.)

  Se a variável `version_tokens_session` tiver um valor não vazio, qualquer desajuste entre seu valor e a lista de tokens da versão do servidor resulta em um erro para qualquer declaração que a sessão enviar ao servidor. Um desajuste ocorre nessas condições:

  - Um nome de token na valor de `version_tokens_session` não está presente na lista de tokens do servidor. Nesse caso, ocorre um erro `ER_VTOKEN_PLUGIN_TOKEN_NOT_FOUND`.

  - Um valor de token na variável `version_tokens_session` difere do valor do token correspondente na lista de tokens do servidor. Nesse caso, ocorre um erro `ER_VTOKEN_PLUGIN_TOKEN_MISMATCH`.

  Não é uma incompatibilidade que a lista de tokens da versão do servidor inclua um token que não esteja nomeado no valor da variável `version_tokens_session`.

  Suponha que um aplicativo de gerenciamento tenha definido a lista de tokens do servidor da seguinte forma:

  ```sql
  mysql> SELECT version_tokens_set('tok1=a;tok2=b;tok3=c');
  +--------------------------------------------+
  | version_tokens_set('tok1=a;tok2=b;tok3=c') |
  +--------------------------------------------+
  | 3 version tokens set.                      |
  +--------------------------------------------+
  ```

  Um cliente registra os tokens que exige que o servidor corresponda, definindo o valor de sua variável `version_tokens_session` (ver referência de tokens de versão). Em seguida, para cada declaração subsequente enviada pelo cliente, o servidor verifica sua lista de tokens contra o valor da variável `version_tokens_session` (ver referência de tokens de versão) do cliente e gera um erro se houver uma discrepância:

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

  O primeiro `SELECT` é bem-sucedido porque os tokens do cliente `tok1` e `tok2` estão presentes na lista de tokens do servidor e cada token tem o mesmo valor na lista do servidor. O segundo `SELECT` falha porque, embora `tok1` esteja presente na lista de tokens do servidor, ele tem um valor diferente do especificado pelo cliente.

  Neste ponto, qualquer declaração enviada pelo cliente falha, a menos que a lista de tokens do servidor mude de forma que ela volte a corresponder. Suponha que o aplicativo de gerenciamento mude a lista de tokens do servidor da seguinte forma:

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

  Agora, o valor do cliente `version_tokens_session` corresponde à lista de tokens do servidor e o cliente pode executar novamente as instruções com sucesso:

  ```sql
  mysql> SELECT 1;
  +---+
  | 1 |
  +---+
  | 1 |
  +---+
  ```

- `version_tokens_session_number`

  <table frame="box" rules="all" summary="Propriedades para version_tokens_session_number"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--version-tokens-session-number=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="version-tokens-reference.html#sysvar_version_tokens_session_number">version_tokens_session_number</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr></tbody></table>

  Esta variável é para uso interno.
