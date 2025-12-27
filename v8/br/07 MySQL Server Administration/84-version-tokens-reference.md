#### 7.6.6.4 Referência aos Tokens de Versão

A discussão a seguir serve como referência para esses elementos de Tokens de Versão:

* Funções dos Tokens de Versão
* Variáveis de Sistema dos Tokens de Versão

##### Funções dos Tokens de Versão

A biblioteca de plugins dos Tokens de Versão inclui várias funções. Um conjunto de funções permite que a lista de tokens de versão do servidor seja manipulada e inspecionada. Outro conjunto de funções permite que os tokens de versão sejam bloqueados e desbloqueados. O privilégio `VERSION_TOKEN_ADMIN` (ou o privilégio `SUPER`, desatualizado) é necessário para invocar qualquer função dos Tokens de Versão.

As seguintes funções permitem que a lista de tokens de versão do servidor seja criada, alterada, removida e inspecionada. A interpretação dos argumentos *`name_list`* e *`token_list`* (incluindo o tratamento de espaços em branco) ocorre conforme descrito na Seção 7.6.6.3, “Uso dos Tokens de Versão”, que fornece detalhes sobre a sintaxe para especificar tokens, bem como exemplos adicionais.

* `version_tokens_delete(name_list)`

  Exclui tokens da lista de tokens de versão do servidor usando o argumento *`name_list`* e retorna uma string binária que indica o resultado da operação. *`name_list`* é uma lista separada por ponto-e-vírgula de nomes de tokens de versão a serem excluídos.

  ```
  mysql> SELECT version_tokens_delete('tok1;tok3');
  +------------------------------------+
  | version_tokens_delete('tok1;tok3') |
  +------------------------------------+
  | 2 version tokens deleted.          |
  +------------------------------------+
  ```

  Um argumento de `NULL` é tratado como uma string vazia, que não tem efeito na lista de tokens.

   `version_tokens_delete()` exclui os tokens nomeados em seu argumento, se existirem. (Não é um erro excluir tokens não existentes.) Para limpar completamente a lista de tokens sem saber quais tokens estão na lista, passe `NULL` ou uma string sem tokens para `version_tokens_set()`:

  ```
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
* `version_tokens_edit(token_list)`
Portuguese (Brazil):

Modifica a lista de tokens de versão do servidor usando o argumento *`token_list`* e retorna uma string binária que indica o resultado da operação. *`token_list`* é uma lista separada por ponto-e-vírgula de pares `nome=valor` que especificam o nome de cada token a ser definido e seu valor. Se um token existir, seu valor é atualizado com o valor fornecido. Se um token não existir, ele é criado com o valor fornecido. Se o argumento for `NULL` ou uma string que não contenha tokens, a lista de tokens permanece inalterada.

```
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
*  `version_tokens_set(token_list)`

Substitui a lista de tokens de versão do servidor pelos tokens definidos no argumento *`token_list`* e retorna uma string binária que indica o resultado da operação. *`token_list`* é uma lista separada por ponto-e-vírgula de pares `nome=valor` que especificam o nome de cada token a ser definido e seu valor. Se o argumento for `NULL` ou uma string que não contenha tokens, a lista de tokens é zerada.

```
  mysql> SELECT version_tokens_set('tok1=value1;tok2=value2');
  +-----------------------------------------------+
  | version_tokens_set('tok1=value1;tok2=value2') |
  +-----------------------------------------------+
  | 2 version tokens set.                         |
  +-----------------------------------------------+
  ```
*  `version_tokens_show()`

Retorna a lista de tokens de versão do servidor como uma string binária contendo uma lista separada por ponto-e-vírgula de pares `nome=valor`.

```
  mysql> SELECT version_tokens_show();
  +--------------------------+
  | version_tokens_show()    |
  +--------------------------+
  | tok2=value2;tok1=value1; |
  +--------------------------+
  ```

As seguintes funções permitem que os tokens de versão sejam bloqueados e desbloqueados:

* `version_tokens_lock_exclusive(token_name[, token_name] ..., timeout)`

Adquire bloqueios exclusivos em um ou mais tokens de versão, especificados por nome como strings, expirando com um erro se os bloqueios não forem adquiridos dentro do valor de tempo limite fornecido.

```
  mysql> SELECT version_tokens_lock_exclusive('lock1', 'lock2', 10);
  +-----------------------------------------------------+
  | version_tokens_lock_exclusive('lock1', 'lock2', 10) |
  +-----------------------------------------------------+
  |                                                   1 |
  +-----------------------------------------------------+
  ```
* `version_tokens_lock_shared(token_name[, token_name] ..., timeout)`

Adquire bloqueios compartilhados em um ou mais tokens de versão, especificados por nome como strings, expirando com um erro se os bloqueios não forem adquiridos dentro do valor de tempo limite fornecido.

```
  mysql> SELECT version_tokens_lock_shared('lock1', 'lock2', 10);
  +--------------------------------------------------+
  | version_tokens_lock_shared('lock1', 'lock2', 10) |
  +--------------------------------------------------+
  |                                                1 |
  +--------------------------------------------------+
  ```
*  `version_tokens_unlock()`

Libera todos os bloqueios adquiridos durante a sessão atual usando `version_tokens_lock_exclusive()` e `version_tokens_lock_shared()`.

```
  mysql> SELECT version_tokens_unlock();
  +-------------------------+
  | version_tokens_unlock() |
  +-------------------------+
  |                       1 |
  +-------------------------+
  ```

As funções de bloqueio compartilham essas características:

* O valor de retorno é diferente de zero para sucesso. Caso contrário, ocorre um erro.
* Os nomes dos tokens são cadeias de caracteres.
* Em contraste com o tratamento de argumentos para as funções que manipulam a lista de tokens do servidor, os espaços em branco ao redor dos argumentos do nome do token não são ignorados e os caracteres `=` e `;` são permitidos.
* É possível bloquear nomes de tokens inexistentes. Isso não cria os tokens.
* Os valores de tempo de espera são inteiros não negativos que representam o tempo em segundos para aguardar a aquisição de bloqueios antes de esgotar o tempo com um erro. Se o tempo de espera for 0, não há espera e a função produz um erro se os bloqueios não puderem ser adquiridos imediatamente.
* As funções de bloqueio de tokens de versão são baseadas no serviço de bloqueio descrito na Seção 7.6.9.1, “O Serviço de Bloqueio”.

##### Variáveis de Sistema de Tokens de Versão

O Version Tokens suporta as seguintes variáveis de sistema. Essas variáveis não estão disponíveis a menos que o plugin Version Tokens esteja instalado (consulte a Seção 7.6.6.2, “Instalando ou Desinstalando Version Tokens”).

Variáveis de sistema:

*  `version_tokens_session`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--version-tokens-session=value</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>version_tokens_session</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Cadeia de Caracteres</td> </tr><tr><th>Valor Padrão</th> <td><code>NULL</code></td> </tr></tbody></table>

  O valor da sessão desta variável especifica a lista de tokens de versão do cliente e indica os tokens que a sessão do cliente exige que a lista de tokens de versão do servidor tenha.

  Se a variável `version_tokens_session` for `NULL` (o padrão) ou tiver um valor vazio, qualquer lista de tokens de versão do servidor será compatível. (Na prática, um valor vazio desabilita os requisitos de compatibilidade.)

Se a variável `version_tokens_session` tiver um valor não vazio, qualquer incompatibilidade entre seu valor e a lista de tokens de versão do servidor resulta em um erro para qualquer declaração enviada pela sessão ao servidor. Uma incompatibilidade ocorre sob as seguintes condições:

  + Um nome de token na valor de `version_tokens_session` não está presente na lista de tokens do servidor. Nesse caso, ocorre um erro `ER_VTOKEN_PLUGIN_TOKEN_NOT_FOUND`.
  + Um valor de token na valor de `version_tokens_session` difere do valor do token correspondente na lista de tokens do servidor. Nesse caso, ocorre um erro `ER_VTOKEN_PLUGIN_TOKEN_MISMATCH`.

  Não é uma incompatibilidade para a lista de tokens de versão do servidor incluir um token não nomeado no valor de `version_tokens_session`.

  Suponha que um aplicativo de gerenciamento tenha definido a lista de tokens do servidor da seguinte forma:

  ```
  mysql> SELECT version_tokens_set('tok1=a;tok2=b;tok3=c');
  +--------------------------------------------+
  | version_tokens_set('tok1=a;tok2=b;tok3=c') |
  +--------------------------------------------+
  | 3 version tokens set.                      |
  +--------------------------------------------+
  ```

  Um cliente registra os tokens que ele exige que o servidor corresponda, configurando seu valor de `version_tokens_session`. Em seguida, para cada declaração subsequente enviada pelo cliente, o servidor verifica sua lista de tokens contra o valor de `version_tokens_session` do cliente e produz um erro se houver uma incompatibilidade:

  ```
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

  O primeiro  `SELECT` é bem-sucedido porque os tokens do cliente `tok1` e `tok2` estão presentes na lista de tokens do servidor e cada token tem o mesmo valor na lista do servidor. O segundo  `SELECT` falha porque, embora `tok1` esteja presente na lista de tokens do servidor, ele tem um valor diferente do especificado pelo cliente.

  Neste ponto, qualquer declaração enviada pelo cliente falha, a menos que a lista de tokens do servidor mude de forma que ela corresponda novamente. Suponha que o aplicativo de gerenciamento mude a lista de tokens do servidor da seguinte forma:

  ```
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

  Agora o valor de `version_tokens_session` do cliente corresponde à lista de tokens do servidor e o cliente pode, novamente, executar declarações com sucesso:

  ```
  mysql> SELECT 1;
  +---+
  | 1 |
  +---+
  | 1 |
  +---+
  ```
*  `version_tokens_session_number`

<table><tbody><tr><th>Formato de linha de comando</th> <td><code>--version-tokens-session-number=#</code></td> </tr><tr><th>Variável do sistema</th> <td><code>version_tokens_session_number</code></td> </tr><tr><th>Alcance</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Aplicação da dica `SET_VAR`</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>0</code></td> </tr></tbody></table>

Esta variável é para uso interno.