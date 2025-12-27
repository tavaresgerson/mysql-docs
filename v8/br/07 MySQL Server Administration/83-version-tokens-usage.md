#### 7.6.6.3 Uso de Tokens de Versão

Antes de usar Tokens de Versão, instale-os de acordo com as instruções fornecidas na Seção 7.6.6.2, “Instalando ou Desinstalando Tokens de Versão”.

Um cenário em que os Tokens de Versão podem ser úteis é um sistema que acessa uma coleção de servidores MySQL, mas precisa gerenciá-los para fins de balanceamento de carga, monitorando-os e ajustando as atribuições dos servidores de acordo com as mudanças de carga. Esse sistema compreende esses elementos:

* A coleção de servidores MySQL a serem gerenciados.
* Um aplicativo administrativo ou de gerenciamento que se comunica com os servidores e os organiza em grupos de alta disponibilidade. Os grupos servem a diferentes propósitos, e os servidores dentro de cada grupo podem ter atribuições diferentes. A atribuição de um servidor dentro de um determinado grupo pode mudar a qualquer momento.
* Aplicativos de cliente que acessam os servidores para recuperar e atualizar dados, escolhendo servidores de acordo com os propósitos a eles atribuídos. Por exemplo, um cliente não deve enviar uma atualização para um servidor de leitura somente.

Os Tokens de Versão permitem que o acesso aos servidores seja gerenciado de acordo com a atribuição, sem que os clientes precisem consultar repetidamente os servidores sobre suas atribuições:

* O aplicativo de gerenciamento realiza as atribuições dos servidores e estabelece tokens de versão em cada servidor para refletir sua atribuição. O aplicativo armazena essa informação para fornecer um ponto de acesso central para ela.

Se, em algum momento, o aplicativo de gerenciamento precisar alterar uma atribuição de servidor (por exemplo, para mudar de permitir escritas para leitura apenas), ele altera a lista de tokens de versão do servidor e atualiza seu cache.
* Para melhorar o desempenho, as aplicações cliente obtêm informações de cache do aplicativo de gerenciamento, permitindo que evitem ter que recuperar informações sobre as atribuições de servidores para cada declaração. Com base no tipo de declarações que emite (por exemplo, leituras versus escritas), um cliente seleciona um servidor apropriado e se conecta a ele.
* Além disso, o cliente envia ao servidor seus próprios tokens de versão específicos do cliente para registrar a atribuição que ele requer do servidor. Para cada declaração enviada pelo cliente ao servidor, o servidor compara sua própria lista de tokens com a lista de tokens do cliente. Se a lista de tokens do servidor contiver todos os tokens presentes na lista de tokens do cliente com os mesmos valores, há um correspondência e o servidor executa a declaração.
Por outro lado, talvez o aplicativo de gerenciamento tenha alterado a atribuição de servidor e sua lista de tokens de versão. Nesse caso, a nova atribuição de servidor pode não ser mais compatível com os requisitos do cliente. Um desalinhamento de tokens entre as listas de tokens do servidor e do cliente ocorre e o servidor retorna um erro em resposta à declaração. Isso é uma indicação para o cliente atualizar suas informações de tokens de versão do cache do aplicativo de gerenciamento e selecionar um novo servidor com o qual se comunicar.
A lógica do lado do cliente para detectar erros de tokens de versão e selecionar um novo servidor pode ser implementada de diferentes maneiras:

* O cliente pode gerenciar todo o registro de tokens de versão, detecção de incompatibilidade e alternância de conexão.
* A lógica para essas ações pode ser implementada em um conector que gerencia as conexões entre clientes e servidores MySQL. Tal conector pode lidar com a detecção de erros de incompatibilidade e reenviar a declaração, ou pode passar o erro para o aplicativo e deixar que o aplicativo reenvie a declaração.

O exemplo a seguir ilustra a discussão anterior de forma mais concreta.

Quando o Version Token é inicializado em um servidor específico, a lista de tokens de versão do servidor está vazia. A manutenção da lista de tokens é realizada chamando funções. O privilégio `VERSION_TOKEN_ADMIN` (ou o privilégio desatualizado `SUPER`) é necessário para chamar qualquer uma das funções do Version Token, portanto, a modificação da lista de tokens deve ser feita por um aplicativo de gerenciamento ou administrativo que tenha esse privilégio.

Suponha que um aplicativo de gerenciamento se comunique com um conjunto de servidores que são consultados por clientes para acessar bancos de dados de funcionários e produtos (chamados `emp` e `prod`, respectivamente). Todos os servidores têm permissão para processar declarações de recuperação de dados, mas apenas alguns deles têm permissão para fazer atualizações no banco de dados. Para lidar com isso de forma específica para o banco de dados, o aplicativo de gerenciamento estabelece uma lista de tokens de versão em cada servidor. Na lista de tokens de um servidor específico, os nomes dos tokens representam os nomes dos bancos de dados e os valores dos tokens são `leitura` ou `escrita`, dependendo se o banco de dados deve ser usado de forma apenas de leitura ou se pode realizar leituras e escritas.

As aplicações cliente registram uma lista de tokens de versão que exigem que o servidor corresponda, definindo uma variável do sistema. A definição da variável ocorre de forma específica para cada cliente, portanto, diferentes clientes podem registrar requisitos diferentes. Por padrão, a lista de tokens do cliente está vazia, o que corresponde a qualquer lista de tokens do servidor. Quando um cliente define sua lista de tokens para um valor não vazio, a correspondência pode ser bem-sucedida ou falha, dependendo da lista de tokens do servidor.

Para definir a lista de tokens de versão para um servidor, o aplicativo de gerenciamento chama a função `version_tokens_set()`. (Existem também funções para modificar e exibir a lista de tokens, descritas mais adiante.) Por exemplo, o aplicativo pode enviar essas instruções para um grupo de três servidores:

Servidor 1:

```
mysql> SELECT version_tokens_set('emp=read;prod=read');
+------------------------------------------+
| version_tokens_set('emp=read;prod=read') |
+------------------------------------------+
| 2 version tokens set.                    |
+------------------------------------------+
```

Servidor 2:

```
mysql> SELECT version_tokens_set('emp=write;prod=read');
+-------------------------------------------+
| version_tokens_set('emp=write;prod=read') |
+-------------------------------------------+
| 2 version tokens set.                     |
+-------------------------------------------+
```

Servidor 3:

```
mysql> SELECT version_tokens_set('emp=read;prod=write');
+-------------------------------------------+
| version_tokens_set('emp=read;prod=write') |
+-------------------------------------------+
| 2 version tokens set.                     |
+-------------------------------------------+
```

A lista de tokens em cada caso é especificada como uma lista separada por ponto e vírgula de pares `nome=valor`. Os valores da lista de tokens resultantes resultam nestas atribuições de servidor:

* Qualquer servidor aceita leituras para qualquer banco de dados.
* Apenas o servidor 2 aceita atualizações para o banco de dados `emp`.
* Apenas o servidor 3 aceita atualizações para o banco de dados `prod`.

Além de atribuir a cada servidor uma lista de tokens de versão, o aplicativo de gerenciamento também mantém um cache que reflete as atribuições de servidor.

Antes de se comunicar com os servidores, um aplicativo cliente entra em contato com o aplicativo de gerenciamento e recupera informações sobre as atribuições de servidor. Em seguida, o cliente seleciona um servidor com base nessas atribuições. Suponha que um cliente queira realizar leituras e escritas no banco de dados `emp`. Com base nas atribuições anteriores, apenas o servidor 2 se qualifica. O cliente se conecta ao servidor 2 e registra seus requisitos de servidor lá, definindo sua variável de sistema `version_tokens_session`:

```
mysql> SET @@SESSION.version_tokens_session = 'emp=write';
```

Para as instruções subsequentes enviadas pelo cliente ao servidor 2, o servidor compara sua própria lista de tokens de versão com a lista do cliente para verificar se elas correspondem. Se sim, as instruções são executadas normalmente:

Discrepancias entre as listas de tokens de versão do servidor e do cliente podem ocorrer de duas maneiras:

* Um nome de token na valor `version_tokens_session` não está presente na lista de tokens do servidor. Nesse caso, ocorre um erro `ER_VTOKEN_PLUGIN_TOKEN_NOT_FOUND`.
* Um valor de token na valor `version_tokens_session` difere do valor do token correspondente na lista de tokens do servidor. Nesse caso, ocorre um erro `ER_VTOKEN_PLUGIN_TOKEN_MISMATCH`.

Enquanto a atribuição do servidor 2 não mudar, o cliente continuará a usá-lo para leituras e escritas. Mas suponha que o aplicativo de gerenciamento queira alterar as atribuições de servidores para que as escritas para o banco de dados `emp` devam ser enviadas ao servidor 1 em vez do servidor 2. Para fazer isso, ele usa `version_tokens_edit()` para modificar o valor do token `emp` nos dois servidores (e atualiza seu cache de atribuições de servidores):

Servidor 1:

```
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

Servidor 2:

```
mysql> SELECT version_tokens_edit('emp=write');
+----------------------------------+
| version_tokens_edit('emp=write') |
+----------------------------------+
| 1 version tokens updated.        |
+----------------------------------+
```

`version_tokens_edit()` modifica os tokens nomeados na lista de tokens do servidor e deixa outros tokens inalterados.

Da próxima vez que o cliente enviar uma declaração ao servidor 2, sua própria lista de tokens não mais corresponde à lista de tokens do servidor e ocorre um erro:

```
mysql> SELECT version_tokens_edit('emp=read');
+---------------------------------+
| version_tokens_edit('emp=read') |
+---------------------------------+
| 1 version tokens updated.       |
+---------------------------------+
```

Neste caso, o cliente deve entrar em contato com o aplicativo de gerenciamento para obter informações atualizadas sobre as atribuições de servidores, selecionar um novo servidor e enviar a declaração falha para o novo servidor.

::: info Nota

Cada cliente deve cooperar com Tokens de Versão enviando apenas declarações de acordo com a lista de tokens que ele registra com um servidor específico. Por exemplo, se um cliente registra uma lista de tokens de `'emp=read'`, não há nada na Version Tokens para impedir que o cliente envie atualizações para o banco de dados `emp`. O próprio cliente deve se abster de fazer isso.

:::

Para cada declaração recebida de um cliente, o servidor usa implicitamente o bloqueio, da seguinte forma:

* Use uma chave compartilhada para cada token nomeado na lista de tokens do cliente (ou seja, no valor `version_tokens_session`)
* Realize a comparação entre as listas de tokens do servidor e do cliente
* Execute a instrução ou produza um erro dependendo do resultado da comparação
* Liberar as chaves

O servidor usa chaves compartilhadas para que as comparações para várias sessões possam ocorrer sem bloqueio, enquanto previne alterações nos tokens para qualquer sessão que tente adquirir uma chave exclusiva antes de manipular tokens dos mesmos nomes na lista de tokens do servidor.

O exemplo anterior usa apenas algumas das funções incluídas na biblioteca de plugins de Tokens de Versão, mas há outras. Um conjunto de funções permite que a lista de tokens de versão do servidor seja manipulada e inspecionada. Outro conjunto de funções permite que os tokens de versão sejam bloqueados e desbloqueados.

Essas funções permitem que a lista de tokens de versão do servidor seja criada, alterada, removida e inspecionada:

* `version_tokens_set()` substitui completamente a lista atual e atribui uma nova lista. O argumento é uma lista separada por ponto-e-vírgula de pares `name=value`.
* `version_tokens_edit()` permite modificações parciais da lista atual. Pode adicionar novos tokens ou alterar os valores dos tokens existentes. O argumento é uma lista separada por ponto-e-vírgula de pares `name=value`.
* `version_tokens_delete()` exclui tokens da lista atual. O argumento é uma lista separada por ponto-e-vírgula de nomes de tokens.
* `version_tokens_show()` exibe a lista atual de tokens. Não aceita argumento.

Cada uma dessas funções, se bem-sucedida, retorna uma string binária indicando qual ação ocorreu. O exemplo seguinte estabelece a lista de tokens do servidor, a modifica adicionando um novo token, excluindo alguns tokens e exibindo a lista de tokens resultante:

```
mysql> UPDATE emp.employee SET salary = salary * 1.1 WHERE id = 4982;
ERROR 3136 (42000): Version token mismatch for emp. Correct value read
```

Avisos ocorrem se uma lista de tokens estiver malformada:

```
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

Como mencionado anteriormente, os tokens de versão são definidos usando uma lista separada por ponto-e-vírgula de pares `nome=valor`. Considere esta invocação de `version_tokens_set()`:

```
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

O Version Tokens interpreta o argumento da seguinte forma:

* Espaços em branco ao redor de nomes e valores são ignorados. Espaços em branco dentro de nomes e valores são permitidos. (Para `version_tokens_delete()`, que recebe uma lista de nomes sem valores, espaços em branco ao redor de nomes são ignorados.)
* Não há mecanismo de citação.
* A ordem dos tokens não é significativa, exceto que, se uma lista de tokens contiver múltiplas instâncias de um nome de token dado, o último valor prevalece sobre os valores anteriores.

Dadas essas regras, a chamada anterior de `version_tokens_set()` resulta em uma lista de tokens com dois tokens: `tok1` tem o valor `1'2 3"4`, e `tok2` tem o valor `a = b`. Para verificar isso, chame `version_tokens_show()`:

```
mysql> SELECT version_tokens_set('tok1=b;;; tok2= a = b ; tok1 = 1\'2 3"4')
+---------------------------------------------------------------+
| version_tokens_set('tok1=b;;; tok2= a = b ; tok1 = 1\'2 3"4') |
+---------------------------------------------------------------+
| 3 version tokens set.                                         |
+---------------------------------------------------------------+
```

Se a lista de tokens contiver dois tokens, por que `version_tokens_set()` retornou o valor `3 tokens de versão definidos`? Isso ocorreu porque a lista de tokens original continha duas definições para `tok1`, e a segunda definição substituiu a primeira.

As funções de manipulação de tokens de Version Tokens colocam essas restrições em nomes e valores de tokens:

* Nomes de tokens não podem conter caracteres `=` ou `;` e têm um comprimento máximo de 64 caracteres.
* Valores de tokens não podem conter caracteres `;`. O comprimento dos valores é limitado pela variável de sistema `max_allowed_packet`.
* Version Tokens trata nomes e valores de tokens como strings binárias, então as comparações são sensíveis ao caso.

Version Tokens também inclui um conjunto de funções que permitem que os tokens sejam bloqueados e desbloqueados:

* `version_tokens_lock_exclusive()` adquire bloqueios exclusivos de tokens de versão. Ele aceita uma lista de um ou mais nomes de bloqueio e um valor de tempo de espera.
* `version_tokens_lock_shared()` adquire bloqueios compartilhados de tokens de versão. Ele aceita uma lista de um ou mais nomes de bloqueio e um valor de tempo de espera.
* `version_tokens_unlock()` libera bloqueios de tokens de versão (exclusivos e compartilhados). Ele não aceita argumentos.

Cada função de bloqueio retorna um valor não nulo para sucesso. Caso contrário, ocorre um erro:

```
mysql> SELECT version_tokens_show();
+--------------------------+
| version_tokens_show()    |
+--------------------------+
| tok2=a = b;tok1=1'2 3"4; |
+--------------------------+
```

O bloqueio usando as funções de bloqueio de Tokens de Versão é aconselhável; as aplicações devem concordar em cooperar.

É possível bloquear nomes de tokens não existentes. Isso não cria os tokens.

::: info Nota

As funções de bloqueio de Tokens de Versão são baseadas no serviço de bloqueio descrito na Seção 7.6.9.1, “O Serviço de Bloqueio”, e, portanto, têm a mesma semântica para bloqueios compartilhados e exclusivos. (Os Tokens de Versão usam as rotinas do serviço de bloqueio integradas ao servidor, e não a interface da função do serviço de bloqueio, portanto, essas funções não precisam ser instaladas para usar os Tokens de Versão.) Os bloqueios adquiridos pelos Tokens de Versão usam um namespace de serviço de bloqueio de `version_token_locks`. Os bloqueios do serviço de bloqueio podem ser monitorados usando o Schema de Desempenho, portanto, isso também é verdadeiro para os bloqueios dos Tokens de Versão. Para detalhes, consulte Monitoramento do Serviço de Bloqueio.

Para as funções de bloqueio de Tokens de Versão, os argumentos de nome de token são usados exatamente como especificado. Espaços em branco ao redor não são ignorados e os caracteres `=` e `;` são permitidos. Isso ocorre porque os Tokens de Versão simplesmente passam os nomes de tokens a serem bloqueados como estão para o serviço de bloqueio.