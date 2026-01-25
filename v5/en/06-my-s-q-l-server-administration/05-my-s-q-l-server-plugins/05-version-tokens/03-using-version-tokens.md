#### 5.5.5.3 Usando Version Tokens

Antes de usar Version Tokens, instale-o de acordo com as instruções fornecidas em [Seção 5.5.5.2, “Instalando ou Desinstalando Version Tokens”](version-tokens-installation.html "5.5.5.2 Instalando ou Desinstalando Version Tokens").

Um cenário no qual Version Tokens pode ser útil é um sistema que acessa uma coleção de MySQL Servers, mas precisa gerenciá-los para fins de load balancing, monitorando-os e ajustando as atribuições de Server de acordo com as mudanças de carga. Tal sistema é composto por estes elementos:

* A coleção de MySQL Servers a serem gerenciados.
* Um aplicativo administrativo ou de gerenciamento que se comunica com os Servers e os organiza em grupos de alta disponibilidade. Os grupos servem a propósitos diferentes, e os Servers dentro de cada grupo podem ter diferentes atribuições (assignments). A atribuição de um Server dentro de um determinado grupo pode mudar a qualquer momento.

* Aplicativos Client que acessam os Servers para recuperar e atualizar dados, escolhendo Servers de acordo com os propósitos a eles atribuídos. Por exemplo, um Client não deve enviar uma atualização para um Server read-only.

Version Tokens permite que o acesso ao Server seja gerenciado de acordo com a atribuição, sem exigir que os Clients consultem repetidamente os Servers sobre suas atribuições:

* O aplicativo de gerenciamento realiza as atribuições de Server e estabelece os version tokens em cada Server para refletir sua atribuição. O aplicativo armazena essas informações em Cache para fornecer um ponto de acesso central a elas.

  Se em algum momento o aplicativo de gerenciamento precisar alterar uma atribuição de Server (por exemplo, para mudar de permitir Writes para read-only), ele altera a version token list do Server e atualiza seu Cache.

* Para melhorar o desempenho, os aplicativos Client obtêm as informações de Cache do aplicativo de gerenciamento, permitindo-lhes evitar a necessidade de recuperar informações sobre as atribuições de Server para cada Statement. Com base no tipo de Statements que ele emite (por exemplo, Reads versus Writes), um Client seleciona um Server apropriado e se conecta a ele.

* Além disso, o Client envia ao Server seus próprios version tokens específicos do Client para registrar a atribuição que ele requer do Server. Para cada Statement enviado pelo Client ao Server, o Server compara sua própria token list com a token list do Client. Se a token list do Server contiver todos os tokens presentes na token list do Client com os mesmos valores, há uma correspondência (match) e o Server executa o Statement.

  Por outro lado, talvez o aplicativo de gerenciamento tenha alterado a atribuição do Server e sua version token list. Neste caso, a nova atribuição de Server pode ser incompatível com os requisitos do Client. Ocorre um token mismatch entre as token lists do Server e do Client, e o Server retorna um error em resposta ao Statement. Esta é uma indicação para que o Client atualize suas informações de version token a partir do Cache do aplicativo de gerenciamento e selecione um novo Server para se comunicar.

A lógica do lado do Client para detectar erros de version token e selecionar um novo Server pode ser implementada de diferentes maneiras:

* O Client pode lidar com todo o registro de version token, detecção de mismatch e Connection Switching por conta própria.

* A lógica para essas ações pode ser implementada em um Connector que gerencia Connections entre Clients e MySQL Servers. Tal Connector pode lidar com a detecção de erro de mismatch e o reenvio de Statement por conta própria, ou pode passar o error para o aplicativo e deixar que o aplicativo reenvie o Statement.

O exemplo a seguir ilustra a discussão precedente de forma mais concreta.

Quando Version Tokens inicializa em um determinado Server, a version token list do Server está vazia. A manutenção da Token list é realizada chamando Functions. O privilégio [`SUPER`](privileges-provided.html#priv_super) é necessário para chamar qualquer uma das Version Token Functions, portanto, a modificação da token list deve ser feita por um aplicativo de gerenciamento ou administrativo que possua esse privilégio.

Suponha que um aplicativo de gerenciamento se comunique com um conjunto de Servers que são consultados por Clients para acessar Databases de funcionários e produtos (nomeados `emp` e `prod`, respectivamente). Todos os Servers têm permissão para processar Statements de recuperação de dados, mas apenas alguns deles têm permissão para fazer updates de Database. Para lidar com isso em uma base específica de Database, o aplicativo de gerenciamento estabelece uma lista de version tokens em cada Server. Na token list para um determinado Server, os nomes dos tokens representam nomes de Database e os valores dos tokens são `read` ou `write`, dependendo se o Database deve ser usado no modo read-only ou se pode aceitar Reads e Writes.

Os aplicativos Client registram uma lista de version tokens que exigem que o Server corresponda, definindo uma system variable. A definição da variável ocorre em uma base específica do Client, portanto, diferentes Clients podem registrar requisitos diferentes. Por padrão, a token list do Client está vazia, o que corresponde a qualquer token list do Server. Quando um Client define sua token list para um valor não vazio, a correspondência (matching) pode ser bem-sucedida ou falhar, dependendo da version token list do Server.

Para definir a version token list de um Server, o aplicativo de gerenciamento chama a Function [`version_tokens_set()`](version-tokens-reference.html#function_version-tokens-set). (Existem também Functions para modificar e exibir a token list, descritas mais adiante.) Por exemplo, o aplicativo pode enviar estes Statements para um grupo de três Servers:

Server 1:

```sql
mysql> SELECT version_tokens_set('emp=read;prod=read');
+------------------------------------------+
| version_tokens_set('emp=read;prod=read') |
+------------------------------------------+
| 2 version tokens set.                    |
+------------------------------------------+
```

Server 2:

```sql
mysql> SELECT version_tokens_set('emp=write;prod=read');
+-------------------------------------------+
| version_tokens_set('emp=write;prod=read') |
+-------------------------------------------+
| 2 version tokens set.                     |
+-------------------------------------------+
```

Server 3:

```sql
mysql> SELECT version_tokens_set('emp=read;prod=write');
+-------------------------------------------+
| version_tokens_set('emp=read;prod=write') |
+-------------------------------------------+
| 2 version tokens set.                     |
+-------------------------------------------+
```

A token list em cada caso é especificada como uma lista de pares `name=value` separados por ponto e vírgula. Os valores resultantes da token list resultam nestas atribuições de Server:

* Qualquer Server aceita Reads para ambos os Databases.
* Apenas o Server 2 aceita Updates para o Database `emp`.

* Apenas o Server 3 aceita Updates para o Database `prod`.

Além de atribuir a cada Server uma version token list, o aplicativo de gerenciamento também mantém um Cache que reflete as atribuições do Server.

Antes de se comunicar com os Servers, um aplicativo Client entra em contato com o aplicativo de gerenciamento e recupera informações sobre as atribuições do Server. Em seguida, o Client seleciona um Server com base nessas atribuições. Suponha que um Client queira realizar Reads e Writes no Database `emp`. Com base nas atribuições anteriores, apenas o Server 2 se qualifica. O Client se conecta ao Server 2 e registra seus requisitos de Server lá, definindo sua system variable [`version_tokens_session`](version-tokens-reference.html#sysvar_version_tokens_session):

```sql
mysql> SET @@SESSION.version_tokens_session = 'emp=write';
```

Para Statements subsequentes enviados pelo Client ao Server 2, o Server compara sua própria version token list com a lista do Client para verificar se há correspondência (match). Se houver, os Statements são executados normalmente:

```sql
mysql> UPDATE emp.employee SET salary = salary * 1.1 WHERE id = 4981;
Query OK, 1 row affected (0.07 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> SELECT last_name, first_name FROM emp.employee WHERE id = 4981;
+-----------+------------+
| last_name | first_name |
+-----------+------------+
| Smith     | Abe        |
+-----------+------------+
1 row in set (0.01 sec)
```

Discrepâncias entre as version token lists do Server e do Client podem ocorrer de duas maneiras:

* Um token name no valor de [`version_tokens_session`](version-tokens-reference.html#sysvar_version_tokens_session) não está presente na server token list. Neste caso, ocorre um error [`ER_VTOKEN_PLUGIN_TOKEN_NOT_FOUND`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_vtoken_plugin_token_not_found).

* Um token value no valor de [`version_tokens_session`](version-tokens-reference.html#sysvar_version_tokens_session) difere do valor do token correspondente na server token list. Neste caso, ocorre um error [`ER_VTOKEN_PLUGIN_TOKEN_MISMATCH`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_vtoken_plugin_token_mismatch).

Enquanto a atribuição do Server 2 não mudar, o Client continua a usá-lo para Reads e Writes. Mas suponha que o aplicativo de gerenciamento queira alterar as atribuições de Server para que os Writes para o Database `emp` devam ser enviados para o Server 1 em vez do Server 2. Para fazer isso, ele usa [`version_tokens_edit()`](version-tokens-reference.html#function_version-tokens-edit) para modificar o valor do token `emp` nos dois Servers (e atualiza seu Cache de atribuições de Server):

Server 1:

```sql
mysql> SELECT version_tokens_edit('emp=write');
+----------------------------------+
| version_tokens_edit('emp=write') |
+----------------------------------+
| 1 version tokens updated.        |
+----------------------------------+
```

Server 2:

```sql
mysql> SELECT version_tokens_edit('emp=read');
+---------------------------------+
| version_tokens_edit('emp=read') |
+---------------------------------+
| 1 version tokens updated.       |
+---------------------------------+
```

A função [`version_tokens_edit()`](version-tokens-reference.html#function_version-tokens-edit) modifica os tokens nomeados na server token list e deixa outros tokens inalterados.

Na próxima vez que o Client envia um Statement para o Server 2, sua própria token list não corresponde mais à server token list, e ocorre um error:

```sql
mysql> UPDATE emp.employee SET salary = salary * 1.1 WHERE id = 4982;
ERROR 3136 (42000): Version token mismatch for emp. Correct value read
```

Neste caso, o Client deve entrar em contato com o aplicativo de gerenciamento para obter informações atualizadas sobre as atribuições de Server, selecionar um novo Server e enviar o Statement que falhou para o novo Server.

Note

Cada Client deve cooperar com Version Tokens enviando apenas Statements de acordo com a token list que ele registra em um determinado Server. Por exemplo, se um Client registra uma token list de `'emp=read'`, não há nada em Version Tokens para impedir que o Client envie Updates para o Database `emp`. O próprio Client deve se abster de fazê-lo.

Para cada Statement recebido de um Client, o Server implicitamente usa Locking, da seguinte forma:

* Adquire um shared lock para cada token nomeado na token list do Client (ou seja, no valor de [`version_tokens_session`](version-tokens-reference.html#sysvar_version_tokens_session)).
* Realiza a comparação entre as token lists do Server e do Client.
* Executa o Statement ou produz um error dependendo do resultado da comparação.
* Libera os Locks.

O Server usa shared locks para que comparações para múltiplas Sessions possam ocorrer sem Blocking, enquanto impede alterações nos tokens para qualquer Session que tente adquirir um exclusive lock antes de manipular tokens com os mesmos nomes na server token list.

O exemplo anterior usa apenas algumas das Functions incluídas na biblioteca do Plugin Version Tokens, mas há outras. Um conjunto de Functions permite que a lista de version tokens do Server seja manipulada e inspecionada. Outro conjunto de Functions permite que os version tokens sejam bloqueados e desbloqueados (Locked e Unlocked).

Estas Functions permitem que a lista de version tokens do Server seja criada, alterada, removida e inspecionada:

* [`version_tokens_set()`](version-tokens-reference.html#function_version-tokens-set) substitui completamente a lista atual e atribui uma nova lista. O argumento é uma lista de pares `name=value` separados por ponto e vírgula.

* [`version_tokens_edit()`](version-tokens-reference.html#function_version-tokens-edit) permite modificações parciais na lista atual. Pode adicionar novos tokens ou alterar os valores de tokens existentes. O argumento é uma lista de pares `name=value` separados por ponto e vírgula.

* [`version_tokens_delete()`](version-tokens-reference.html#function_version-tokens-delete) exclui tokens da lista atual. O argumento é uma lista de token names separados por ponto e vírgula.

* [`version_tokens_show()`](version-tokens-reference.html#function_version-tokens-show) exibe a token list atual. Não aceita argumentos.

Cada uma dessas Functions, se bem-sucedida, retorna uma string binária indicando qual ação ocorreu. O exemplo a seguir estabelece a server token list, a modifica adicionando um novo token, exclui alguns tokens e exibe a token list resultante:

```sql
mysql> SELECT version_tokens_set('tok1=a;tok2=b');
+-------------------------------------+
| version_tokens_set('tok1=a;tok2=b') |
+-------------------------------------+
| 2 version tokens set.               |
+-------------------------------------+
mysql> SELECT version_tokens_edit('tok3=c');
+-------------------------------+
| version_tokens_edit('tok3=c') |
+-------------------------------+
| 1 version tokens updated.     |
+-------------------------------+
mysql> SELECT version_tokens_delete('tok2;tok1');
+------------------------------------+
| version_tokens_delete('tok2;tok1') |
+------------------------------------+
| 2 version tokens deleted.          |
+------------------------------------+
mysql> SELECT version_tokens_show();
+-----------------------+
| version_tokens_show() |
+-----------------------+
| tok3=c;               |
+-----------------------+
```

Warnings ocorrem se uma token list estiver malformada:

```sql
mysql> SELECT version_tokens_set('tok1=a; =c');
+----------------------------------+
| version_tokens_set('tok1=a; =c') |
+----------------------------------+
| 1 version tokens set.            |
+----------------------------------+
1 row in set, 1 warning (0.00 sec)

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Warning
   Code: 42000
Message: Invalid version token pair encountered. The list provided
         is only partially updated.
1 row in set (0.00 sec)
```

Conforme mencionado anteriormente, version tokens são definidos usando uma lista de pares `name=value` separados por ponto e vírgula. Considere esta invocação de [`version_tokens_set()`](version-tokens-reference.html#function_version-tokens-set):

```sql
mysql> SELECT version_tokens_set('tok1=b;;; tok2= a = b ; tok1 = 1\'2 3"4')
+---------------------------------------------------------------+
| version_tokens_set('tok1=b;;; tok2= a = b ; tok1 = 1\'2 3"4') |
+---------------------------------------------------------------+
| 3 version tokens set.                                         |
+---------------------------------------------------------------+
```

Version Tokens interpreta o argumento da seguinte forma:

* Whitespace (espaço em branco) ao redor de nomes e valores é ignorado. Whitespace dentro de nomes e valores é permitido. (Para [`version_tokens_delete()`](version-tokens-reference.html#function_version-tokens-delete), que aceita uma lista de nomes sem valores, o Whitespace ao redor dos nomes é ignorado.)

* Não há mecanismo de Quoting (aspas).
* A ordem dos tokens não é significativa, exceto que, se uma token list contiver múltiplas instâncias de um determinado token name, o último valor prevalece sobre os valores anteriores.

Dadas essas regras, a chamada [`version_tokens_set()`](version-tokens-reference.html#function_version-tokens-set) anterior resulta em uma token list com dois tokens: `tok1` tem o valor `1'2 3"4`, e `tok2` tem o valor `a = b`. Para verificar isso, chame [`version_tokens_show()`](version-tokens-reference.html#function_version-tokens-show):

```sql
mysql> SELECT version_tokens_show();
+--------------------------+
| version_tokens_show()    |
+--------------------------+
| tok2=a = b;tok1=1'2 3"4; |
+--------------------------+
```

Se a token list contém dois tokens, por que [`version_tokens_set()`](version-tokens-reference.html#function_version-tokens-set) retornou o valor `3 version tokens set`? Isso ocorreu porque a token list original continha duas definições para `tok1`, e a segunda definição substituiu a primeira.

As Version Tokens Functions de manipulação de token impõem estas restrições aos token names e valores:

* Token names não podem conter os caracteres `=` ou `;` e têm um comprimento máximo de 64 caracteres.

* Token values não podem conter o caractere `;`. O comprimento dos valores é limitado pelo valor da system variable [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet).

* Version Tokens trata token names e valores como strings binárias, portanto, as comparações são case-sensitive (sensíveis a maiúsculas e minúsculas).

Version Tokens também inclui um conjunto de Functions que permitem que os tokens sejam Locked e Unlocked:

* [`version_tokens_lock_exclusive()`](version-tokens-reference.html#function_version-tokens-lock-exclusive) adquire exclusive version token locks. Aceita uma lista de um ou mais lock names e um valor de timeout.

* [`version_tokens_lock_shared()`](version-tokens-reference.html#function_version-tokens-lock-shared) adquire shared version token locks. Aceita uma lista de um ou mais lock names e um valor de timeout.

* [`version_tokens_unlock()`](version-tokens-reference.html#function_version-tokens-unlock) libera version token locks (exclusive e shared). Não aceita argumentos.

Cada função de Locking retorna um valor diferente de zero em caso de sucesso. Caso contrário, ocorre um error:

```sql
mysql> SELECT version_tokens_lock_shared('lock1', 'lock2', 0);
+-------------------------------------------------+
| version_tokens_lock_shared('lock1', 'lock2', 0) |
+-------------------------------------------------+
|                                               1 |
+-------------------------------------------------+

mysql> SELECT version_tokens_lock_shared(NULL, 0);
ERROR 3131 (42000): Incorrect locking service lock name '(null)'.
```

O Locking usando as Version Tokens Locking Functions é consultivo (advisory); os aplicativos devem concordar em cooperar.

É possível aplicar Lock em token names não existentes. Isso não cria os tokens.

Note

As Version Tokens Locking Functions são baseadas no Locking Service descrito em [Seção 5.5.6.1, “O Locking Service”](locking-service.html "5.5.6.1 O Locking Service"), e, portanto, têm a mesma semântica para shared e exclusive locks. (Version Tokens usa as rotinas de Locking Service integradas ao Server, e não a interface de Function do Locking Service, portanto, essas Functions não precisam ser instaladas para usar Version Tokens.) Locks adquiridos por Version Tokens usam um namespace de Locking Service de `version_token_locks`. Os Locks do Locking Service podem ser monitorados usando o Performance Schema, o que também é verdade para os Version Tokens Locks. Para detalhes, consulte [Locking Service Monitoring](locking-service.html#locking-service-monitoring "Locking Service Monitoring").

Para as Version Tokens Locking Functions, os argumentos de token name são usados exatamente conforme especificado. O Whitespace circundante não é ignorado e os caracteres `=` e `;` são permitidos. Isso ocorre porque Version Tokens simplesmente passa os token names a serem Locked como estão para o Locking Service.