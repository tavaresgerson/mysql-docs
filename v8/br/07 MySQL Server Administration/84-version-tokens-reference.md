#### 7.6.6.4 Referência de Tokens de Versão

A discussão a seguir serve como referência a esses elementos de Tokens de Versão:

- Funções de Tokens de Versão
- Variáveis do sistema de tokens de versão

##### Funções de Tokens de Versão

A biblioteca de plugins de Tokens de Versão inclui várias funções. Um conjunto de funções permite que a lista de tokens de versão do servidor seja manipulada e inspecionada. Outro conjunto de funções permite que os tokens de versão sejam bloqueados e desbloqueados. O privilégio `VERSION_TOKEN_ADMIN` (ou o privilégio depreciado `SUPER`) é necessário para invocar qualquer função de Tokens de Versão.

As seguintes funções permitem que a lista de tokens de versão do servidor seja criada, alterada, removida e inspecionada. A interpretação dos argumentos \* `name_list` \* e \* `token_list` \* (incluindo o manuseio de espaços em branco) ocorre conforme descrito na Seção 7.6.6.3, "Utilizando Tokens de Versão", que fornece detalhes sobre a sintaxe para especificar tokens, bem como exemplos adicionais.

- `version_tokens_delete(name_list)`

Exclui tokens da lista de tokens de versão do servidor usando o argumento \* `name_list` \* e retorna uma string binária que indica o resultado da operação. \* `name_list` \* é uma lista separada por ponto e vírgula de nomes de tokens de versão para excluir.

```
mysql> SELECT version_tokens_delete('tok1;tok3');
+------------------------------------+
| version_tokens_delete('tok1;tok3') |
+------------------------------------+
| 2 version tokens deleted.          |
+------------------------------------+
```

Um argumento de `NULL` é tratado como uma string vazia, que não tem efeito na lista de tokens.

`version_tokens_delete()` exclui os tokens nomeados em seu argumento, se eles existirem. (Não é um erro excluir tokens inexistentes.) Para limpar a lista de tokens inteiramente sem saber quais tokens estão na lista, passe `NULL` ou uma string que não contenha tokens para `version_tokens_set()`:

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

- `version_tokens_edit(token_list)`

Modifica a lista de tokens de versão do servidor usando o argumento \* `token_list` \* e retorna uma string binária que indica o resultado da operação. \* `token_list` \* é uma lista separada por pontos e vírgulas de pares de `name=value` especificando o nome de cada token a ser definido e seu valor. Se um token existe, seu valor é atualizado com o valor dado. Se um token não existe, ele é criado com o valor dado. Se o argumento é `NULL` ou uma string que não contém tokens, a lista de tokens permanece inalterada.

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

- `version_tokens_set(token_list)`

Substitui a lista de tokens de versão do servidor com os tokens definidos no argumento \* `token_list` \* e retorna uma string binária que indica o resultado da operação. \* `token_list` \* é uma lista separada por pontos e vírgulas de pares de `name=value` especificando o nome de cada token a ser definido e seu valor. Se o argumento é `NULL` ou uma string que não contém tokens, a lista de tokens é limpa.

```
mysql> SELECT version_tokens_set('tok1=value1;tok2=value2');
+-----------------------------------------------+
| version_tokens_set('tok1=value1;tok2=value2') |
+-----------------------------------------------+
| 2 version tokens set.                         |
+-----------------------------------------------+
```

- `version_tokens_show()`

Retorna a lista de tokens de versão do servidor como uma string binária contendo uma lista separada por ponto e vírgula de pares de `name=value`.

```
mysql> SELECT version_tokens_show();
+--------------------------+
| version_tokens_show()    |
+--------------------------+
| tok2=value2;tok1=value1; |
+--------------------------+
```

As seguintes funções permitem que os tokens de versão sejam bloqueados e desbloqueados:

- `version_tokens_lock_exclusive(token_name[, token_name] ..., timeout)`

  Adquire bloqueios exclusivos em um ou mais tokens de versão, especificados pelo nome como strings, expirando com um erro se os bloqueios não forem adquiridos dentro do valor de tempo de expiração dado.

  ```
  mysql> SELECT version_tokens_lock_exclusive('lock1', 'lock2', 10);
  +-----------------------------------------------------+
  | version_tokens_lock_exclusive('lock1', 'lock2', 10) |
  +-----------------------------------------------------+
  |                                                   1 |
  +-----------------------------------------------------+
  ```
- `version_tokens_lock_shared(token_name[, token_name] ..., timeout)`

  Adquire bloqueios compartilhados em um ou mais tokens de versão, especificados por nome como strings, expirando com um erro se os bloqueios não forem adquiridos dentro do valor de tempo de expiração dado.

  ```
  mysql> SELECT version_tokens_lock_shared('lock1', 'lock2', 10);
  +--------------------------------------------------+
  | version_tokens_lock_shared('lock1', 'lock2', 10) |
  +--------------------------------------------------+
  |                                                1 |
  +--------------------------------------------------+
  ```
- `version_tokens_unlock()`

Libera todos os bloqueios que foram adquiridos na sessão atual usando `version_tokens_lock_exclusive()` e `version_tokens_lock_shared()`.

```
mysql> SELECT version_tokens_unlock();
+-------------------------+
| version_tokens_unlock() |
+-------------------------+
|                       1 |
+-------------------------+
```

As funções de bloqueio partilham estas características:

- O valor de retorno é diferente de zero para sucesso. Caso contrário, ocorre um erro.
- Nomes de símbolos são cordas.
- Em contraste com o manuseio de argumentos para as funções que manipulam a lista de tokens do servidor, os espaços em branco que cercam os argumentos de nome de token não são ignorados e os caracteres `=` e `;` são permitidos.
- É possível bloquear nomes de token inexistentes. Isso não cria os tokens.
- Os valores de tempo de espera são inteiros não negativos que representam o tempo em segundos para esperar para adquirir bloqueios antes de expirar com um erro. Se o tempo de espera for 0, não há espera e a função produz um erro se os bloqueios não puderem ser adquiridos imediatamente.
- As funções de bloqueio dos tokens de versão baseiam-se no serviço de bloqueio descrito na secção 7.6.9.1, "O serviço de bloqueio".

##### Variáveis do sistema de tokens de versão

Os Tokens de versão suportam as seguintes variáveis do sistema. Estas variáveis não estão disponíveis a menos que o plugin de Tokens de versão seja instalado (ver Seção 7.6.6.2, "Instalar ou Desinstalar Tokens de Versão").

Variaveis do sistema:

- `version_tokens_session`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--version-tokens-session=value</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>version_tokens_session</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Sim , sim .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>NULL</code>]]</td> </tr></tbody></table>

O valor de sessão desta variável especifica a lista de tokens da versão do cliente e indica os tokens que a sessão do cliente requer que a lista de tokens da versão do servidor tenha.

Se a variável `version_tokens_session` for `NULL` (o padrão) ou tiver um valor vazio, qualquer lista de tokens de versão do servidor corresponde. (Na verdade, um valor vazio desativa os requisitos de correspondência.)

Se a variável `version_tokens_session` tem um valor não vazio, qualquer desajuste entre seu valor e a lista de tokens de versão do servidor resulta em um erro para qualquer instrução que a sessão envia ao servidor. Um desajuste ocorre sob estas condições:

- Um nome de token no valor `version_tokens_session` não está presente na lista de token do servidor. Neste caso, ocorre um erro `ER_VTOKEN_PLUGIN_TOKEN_NOT_FOUND`.
- Um valor de token no valor `version_tokens_session` difere do valor do token correspondente na lista de tokens do servidor. Neste caso, ocorre um erro `ER_VTOKEN_PLUGIN_TOKEN_MISMATCH`.

Não é um desajuste para a lista de tokens de versão do servidor incluir um token não nomeado no valor `version_tokens_session`.

Suponha que um aplicativo de gerenciamento tenha definido a lista de tokens do servidor da seguinte forma:

```
mysql> SELECT version_tokens_set('tok1=a;tok2=b;tok3=c');
+--------------------------------------------+
| version_tokens_set('tok1=a;tok2=b;tok3=c') |
+--------------------------------------------+
| 3 version tokens set.                      |
+--------------------------------------------+
```

Um cliente registra os tokens que requer que o servidor corresponda ao definir seu valor `version_tokens_session`. Então, para cada instrução subsequente enviada pelo cliente, o servidor verifica sua lista de tokens com o valor `version_tokens_session` do cliente e produz um erro se houver uma incompatibilidade:

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

O primeiro `SELECT` é bem sucedido porque os tokens do cliente `tok1` e `tok2` estão presentes na lista de tokens do servidor e cada token tem o mesmo valor na lista do servidor. O segundo `SELECT` falha porque, embora `tok1` esteja presente na lista de tokens do servidor, ele tem um valor diferente do especificado pelo cliente.

Neste ponto, qualquer instrução enviada pelo cliente falha, a menos que a lista de tokens do servidor mude de tal forma que coincida novamente.

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

Agora o valor do cliente `version_tokens_session` corresponde à lista de tokens do servidor e o cliente pode executar novamente com sucesso instruções:

```
mysql> SELECT 1;
+---+
| 1 |
+---+
| 1 |
+---+
```

- `version_tokens_session_number`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--version-tokens-session-number=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>version_tokens_session_number</code>]]</td> </tr><tr><th>Área de aplicação</th> <td>Global, Sessão</td> </tr><tr><th>Dinâmico</th> <td>Não .</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica</th> <td>Não .</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr></tbody></table>

Esta variável é para uso interno.
