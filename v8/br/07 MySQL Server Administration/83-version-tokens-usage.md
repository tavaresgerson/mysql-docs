#### 7.6.6.3 Utilização de Tokens de Versão

Antes de utilizar os Tokens de Versão, instale-os de acordo com as instruções fornecidas na Secção 7.6.6.2, "Instalar ou Desinstalar Tokens de Versão".

Um cenário em que os Tokens de Versão podem ser úteis é um sistema que acessa uma coleção de servidores MySQL, mas precisa gerenciá-los para fins de equilíbrio de carga, monitorando-os e ajustando as atribuições do servidor de acordo com as mudanças de carga.

- A coleção de servidores MySQL a ser gerida.
- Um aplicativo administrativo ou de gerenciamento que se comunica com os servidores e os organiza em grupos de alta disponibilidade. Os grupos servem a propósitos diferentes, e os servidores dentro de cada grupo podem ter atribuições diferentes. A atribuição de um servidor dentro de um determinado grupo pode mudar a qualquer momento.
- Aplicativos cliente que acessam os servidores para recuperar e atualizar dados, escolhendo servidores de acordo com os propósitos atribuídos a eles.

Os Tokens de versão permitem que o acesso ao servidor seja gerenciado de acordo com a atribuição sem exigir que os clientes façam consultas repetidas aos servidores sobre suas atribuições:

- O aplicativo de gerenciamento executa atribuições de servidor e estabelece tokens de versão em cada servidor para refletir sua atribuição.

  Se em algum momento o aplicativo de gerenciamento precisar mudar uma atribuição de servidor (por exemplo, mudá-lo de permitir gravações para somente leitura), ele altera a lista de tokens de versão do servidor e atualiza seu cache.
- Para melhorar o desempenho, os aplicativos cliente obtêm informações de cache do aplicativo de gerenciamento, permitindo que eles evitem ter que recuperar informações sobre as atribuições do servidor para cada instrução.
- Para cada instrução enviada pelo cliente para o servidor, o servidor compara sua própria lista de tokens com a lista de tokens do cliente. Se a lista de tokens do servidor contém todos os tokens presentes na lista de tokens do cliente com os mesmos valores, há uma correspondência e o servidor executa a instrução.

  Por outro lado, talvez o aplicativo de gerenciamento tenha mudado a atribuição do servidor e sua lista de tokens de versão. Nesse caso, a nova atribuição do servidor pode agora ser incompatível com os requisitos do cliente. Ocorre uma incompatibilidade de tokens entre as listas de tokens do servidor e do cliente e o servidor retorna um erro em resposta à instrução. Esta é uma indicação para o cliente atualizar suas informações de tokens de versão do cache do aplicativo de gerenciamento e selecionar um novo servidor para se comunicar.

A lógica do lado do cliente para detectar erros de token de versão e selecionar um novo servidor pode ser implementada de diferentes maneiras:

- O cliente pode lidar com todo o registro de token de versão, detecção de incompatibilidade e comutação de conexão.
- A lógica para essas ações pode ser implementada em um conector que gerencia conexões entre clientes e servidores MySQL.

O exemplo a seguir ilustra de forma mais concreta a discussão anterior.

Quando os Tokens de Versão são inicializados em um determinado servidor, a lista de tokens de versão do servidor está vazia. A manutenção da lista de tokens é realizada chamando funções. O privilégio `VERSION_TOKEN_ADMIN` (ou o privilégio depreciado `SUPER`) é necessário para chamar qualquer uma das funções de Tokens de Versão, portanto, a modificação da lista de tokens deve ser feita por um aplicativo de gerenciamento ou administrativo que tenha esse privilégio.

Suponha que um aplicativo de gerenciamento se comunique com um conjunto de servidores que são consultados por clientes para acessar bancos de dados de funcionários e produtos (chamados `emp` e `prod`, respectivamente). Todos os servidores têm permissão para processar instruções de recuperação de dados, mas apenas alguns deles têm permissão para fazer atualizações de banco de dados. Para lidar com isso em uma base específica de banco de dados, o aplicativo de gerenciamento estabelece uma lista de tokens de versão em cada servidor. Na lista de tokens para um determinado servidor, os nomes de tokens representam nomes de banco de dados e os valores de tokens são `read` ou `write` dependendo de se o banco de dados deve ser usado apenas em leitura ou se pode receber leitura e gravação.

As aplicações cliente registram uma lista de tokens de versão que exigem que o servidor corresponda definindo uma variável do sistema. A configuração variável ocorre em uma base específica do cliente, para que diferentes clientes possam registrar diferentes requisitos. Por padrão, a lista de tokens do cliente está vazia, o que corresponde a qualquer lista de tokens do servidor. Quando um cliente define sua lista de tokens para um valor não vazio, a correspondência pode ter sucesso ou falhar, dependendo da lista de tokens de versão do servidor.

Para definir a lista de tokens de versão para um servidor, o aplicativo de gerenciamento chama a função `version_tokens_set()`. (Há também funções para modificar e exibir a lista de tokens, descrita mais adiante.) Por exemplo, o aplicativo pode enviar estas instruções para um grupo de três servidores:

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

A lista de tokens em cada caso é especificada como uma lista separada por ponto e vírgula de pares de `name=value`.

- Qualquer servidor aceita leituras para qualquer banco de dados.
- Apenas o servidor 2 aceita atualizações para o banco de dados `emp`.
- Somente o servidor 3 aceita atualizações para o banco de dados `prod`.

Além de atribuir a cada servidor uma lista de tokens de versão, o aplicativo de gerenciamento também mantém um cache que reflete as atribuições do servidor.

Antes de se comunicar com os servidores, um aplicativo cliente contata o aplicativo de gerenciamento e recupera informações sobre as atribuições do servidor. Em seguida, o cliente seleciona um servidor com base nessas atribuições. Suponha que um cliente queira executar leituras e gravações no banco de dados `emp`. Com base nas atribuições anteriores, apenas o servidor 2 se qualifica. O cliente se conecta ao servidor 2 e registra seus requisitos de servidor ali, definindo sua variável de sistema `version_tokens_session`:

```
mysql> SET @@SESSION.version_tokens_session = 'emp=write';
```

Para instruções subsequentes enviadas pelo cliente para o servidor 2, o servidor compara sua própria lista de tokens de versão com a lista do cliente para verificar se elas correspondem.

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

As discrepâncias entre as listas de tokens de versão do servidor e do cliente podem ocorrer de duas maneiras:

- Um nome de token no valor `version_tokens_session` não está presente na lista de token do servidor. Neste caso, ocorre um erro `ER_VTOKEN_PLUGIN_TOKEN_NOT_FOUND`.
- Um valor de token no valor `version_tokens_session` difere do valor do token correspondente na lista de tokens do servidor. Neste caso, ocorre um erro `ER_VTOKEN_PLUGIN_TOKEN_MISMATCH`.

Enquanto a atribuição do servidor 2 não for alterada, o cliente continua a usá-lo para leituras e gravações. Mas suponha que o aplicativo de gerenciamento queira alterar as atribuições do servidor para que as gravações para o banco de dados `emp` sejam enviadas para o servidor 1 em vez do servidor 2. Para fazer isso, ele usa `version_tokens_edit()` para modificar o valor do token `emp` nos dois servidores (e atualiza seu cache de atribuições do servidor):

Servidor 1:

```
mysql> SELECT version_tokens_edit('emp=write');
+----------------------------------+
| version_tokens_edit('emp=write') |
+----------------------------------+
| 1 version tokens updated.        |
+----------------------------------+
```

Servidor 2:

```
mysql> SELECT version_tokens_edit('emp=read');
+---------------------------------+
| version_tokens_edit('emp=read') |
+---------------------------------+
| 1 version tokens updated.       |
+---------------------------------+
```

`version_tokens_edit()` modifica os tokens nomeados na lista de tokens do servidor e deixa os outros tokens inalterados.

A próxima vez que o cliente envia uma instrução para o servidor 2, sua própria lista de tokens não mais coincide com a lista de tokens do servidor e ocorre um erro:

```
mysql> UPDATE emp.employee SET salary = salary * 1.1 WHERE id = 4982;
ERROR 3136 (42000): Version token mismatch for emp. Correct value read
```

Neste caso, o cliente deve entrar em contato com o aplicativo de gerenciamento para obter informações atualizadas sobre as atribuições de servidor, selecionar um novo servidor e enviar a instrução de falha para o novo servidor.

::: info Note

Cada cliente deve cooperar com os Tokens de Versão enviando somente instruções de acordo com a lista de tokens que ele registra com um determinado servidor. Por exemplo, se um cliente registra uma lista de tokens de `'emp=read'`, não há nada nos Tokens de Versão para impedir o cliente de enviar atualizações para o banco de dados `emp`. O próprio cliente deve abster-se de fazê-lo.

:::

Para cada instrução recebida de um cliente, o servidor usa implícitamente o bloqueio, da seguinte forma:

- Pegue um bloqueio compartilhado para cada token nomeado na lista de tokens do cliente (ou seja, no valor `version_tokens_session`)
- Executar a comparação entre as listas de tokens do servidor e do cliente
- Executar a instrução ou produzir um erro dependendo do resultado da comparação
- Solte as fechaduras .

O servidor usa bloqueios compartilhados para que as comparações para várias sessões possam ocorrer sem bloqueio, enquanto impede alterações nos tokens para qualquer sessão que tente adquirir um bloqueio exclusivo antes de manipular tokens com os mesmos nomes na lista de tokens do servidor.

O exemplo anterior usa apenas algumas das funções incluídas na biblioteca de plugins de Tokens de Versão, mas há outras. Um conjunto de funções permite que a lista de tokens de versão do servidor seja manipulada e inspecionada. Outro conjunto de funções permite que os tokens de versão sejam bloqueados e desbloqueados.

Essas funções permitem que a lista de tokens de versão do servidor seja criada, alterada, removida e inspecionada:

- `version_tokens_set()` substitui completamente a lista atual e atribui uma nova lista. O argumento é uma lista separada por ponto e vírgula de pares de `name=value`.
- \[`version_tokens_edit()`] permite modificações parciais na lista atual. Ele pode adicionar novos tokens ou alterar os valores dos tokens existentes. O argumento é uma lista separada por ponto e vírgula de pares de \[`name=value`].
- `version_tokens_delete()` exclui tokens da lista atual. O argumento é uma lista de nomes de tokens separados por ponto e vírgula.
- `version_tokens_show()` exibe a lista de tokens atual. Não requer nenhum argumento.

Cada uma dessas funções, se bem sucedida, retorna uma string binária indicando qual ação ocorreu. O exemplo a seguir estabelece a lista de tokens do servidor, modifica-a adicionando um novo token, exclui alguns tokens e exibe a lista de tokens resultante:

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

Alertas ocorrem se uma lista de tokens for malformada:

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

Como mencionado anteriormente, os tokens de versão são definidos usando uma lista separada por pontos e vírgulas de pares de `name=value` . Considere esta invocação de `version_tokens_set()`:

```
mysql> SELECT version_tokens_set('tok1=b;;; tok2= a = b ; tok1 = 1\'2 3"4')
+---------------------------------------------------------------+
| version_tokens_set('tok1=b;;; tok2= a = b ; tok1 = 1\'2 3"4') |
+---------------------------------------------------------------+
| 3 version tokens set.                                         |
+---------------------------------------------------------------+
```

O Version Tokens interpreta o argumento da seguinte forma:

- O espaço em branco em torno de nomes e valores é ignorado. O espaço em branco dentro de nomes e valores é permitido.
- Não há mecanismo de cotação.
- A ordem dos tokens não é significativa, exceto que, se uma lista de tokens contiver várias instâncias de um determinado nome de token, o último valor tem precedência sobre os valores anteriores.

Dadas essas regras, a chamada anterior de `version_tokens_set()` resulta em uma lista de tokens com dois tokens: `tok1` tem o valor `1'2 3"4`, e `tok2` tem o valor `a = b`.

```
mysql> SELECT version_tokens_show();
+--------------------------+
| version_tokens_show()    |
+--------------------------+
| tok2=a = b;tok1=1'2 3"4; |
+--------------------------+
```

Se a lista de tokens contém dois tokens, por que o \[`version_tokens_set()`] retornou o valor \[`3 version tokens set`]]? Isso ocorreu porque a lista de tokens original continha duas definições para \[`tok1`], e a segunda definição substituiu a primeira.

As funções de manipulação de tokens de versão colocam essas restrições em nomes e valores de tokens:

- Os nomes de token não podem conter caracteres `=` ou `;` e têm um comprimento máximo de 64 caracteres.
- Os valores de token não podem conter caracteres PH. O comprimento dos valores é limitado pelo valor da variável do sistema PH.
- Os Tokens de versão tratam os nomes e valores de token como strings binárias, de modo que as comparações são sensíveis a maiúsculas e minúsculas.

Os Tokens de versão também incluem um conjunto de funções que permitem que os tokens sejam bloqueados e desbloqueados:

- `version_tokens_lock_exclusive()` adquire bloqueios de token de versão exclusiva. Ele leva uma lista de um ou mais nomes de bloqueio e um valor de tempo de expiração.
- `version_tokens_lock_shared()` adquire bloqueios de token de versão compartilhada. Ele leva uma lista de um ou mais nomes de bloqueio e um valor de tempo de expiração.
- `version_tokens_unlock()` libera bloqueios de token de versão (exclusivos e compartilhados).

Cada função de bloqueio retorna um valor diferente de zero para sucesso. Caso contrário, ocorre um erro:

```
mysql> SELECT version_tokens_lock_shared('lock1', 'lock2', 0);
+-------------------------------------------------+
| version_tokens_lock_shared('lock1', 'lock2', 0) |
+-------------------------------------------------+
|                                               1 |
+-------------------------------------------------+

mysql> SELECT version_tokens_lock_shared(NULL, 0);
ERROR 3131 (42000): Incorrect locking service lock name '(null)'.
```

O bloqueio usando as funções de bloqueio de Tokens de Versão é aconselhável; os aplicativos devem concordar em cooperar.

É possível bloquear nomes de token inexistentes. Isso não cria os tokens.

::: info Note

As funções de bloqueio de Tokens de versão são baseadas no serviço de bloqueio descrito na Seção 7.6.9.1, The Locking Service, e, portanto, têm a mesma semântica para bloqueios compartilhados e exclusivos. (Os Tokens de versão usam as rotinas de serviço de bloqueio integradas no servidor, não a interface de função de serviço de bloqueio, portanto, essas funções não precisam ser instaladas para usar Tokens de versão.) Blocos adquiridos pelos Tokens de versão usam um namespace de serviço de bloqueio de `version_token_locks`.

:::

Para as funções de bloqueio de Tokens de versão, os argumentos de nome de token são usados exatamente como especificado. O espaço em branco circundante não é ignorado e os caracteres `=` e `;` são permitidos. Isso ocorre porque os Tokens de versão simplesmente passam os nomes de token a serem bloqueados para o serviço de bloqueio.
