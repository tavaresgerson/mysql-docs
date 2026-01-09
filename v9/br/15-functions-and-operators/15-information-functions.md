## 14.15 Funções de Informação

**Tabela 14.20 Funções de Informação**

<table frame="box" rules="all" summary="Uma referência que lista funções de informações.">
<tr><th>Nome</th> <th>Descrição</th> </tr>
<tr><td><a class="link" href="information-functions.html#function_benchmark"><code>BENCHMARK()</code></a></td> <td> Realizar repetidamente uma expressão </td> </tr>
<tr><td><a class="link" href="information-functions.html#function_charset"><code>CHARSET()</code></a></td> <td> Retornar o conjunto de caracteres do argumento </td> </tr>
<tr><td><a class="link" href="information-functions.html#function_coercibility"><code>COERCIBILITY()</code></a></td> <td> Retornar o valor de coercibilidade da colagem de string </td> </tr>
<tr><td><a class="link" href="information-functions.html#function_collation"><code>COLLATION()</code></a></td> <td> Retornar a colagem da string argumento </td> </tr>
<tr><td><a class="link" href="information-functions.html#function_connection-id"><code>CONNECTION_ID()</code></a></td> <td> Retornar o ID de conexão (ID de thread) para a conexão </td> </tr>
<tr><td><a class="link" href="information-functions.html#function_current-role"><code>CURRENT_ROLE()</code></td> <td> Retornar os papéis ativos atuais </td> </tr>
<tr><td><a class="link" href="information-functions.html#function_current-user"><code>CURRENT_USER()</code>, <code>CURRENT_USER</code></a></td> <td> O nome e o nome do host do usuário autenticado </td> </tr>
<tr><td><a class="link" href="information-functions.html#function_database"><code>DATABASE()</code></a></td> <td> Retornar o nome padrão (atual) da base de dados </td> </tr>
<tr><td><a class="link" href="information-functions.html#function_found-rows"><code>FOUND_ROWS()</code></a></td> <td> Para um SELECT com uma cláusula LIMIT, o número de linhas que seriam retornadas se não houvesse cláusula LIMIT </td> </tr>
<tr><td><a class="link" href="information-functions.html#function_icu-version"><code>ICU_VERSION()</code></a></td> <td> Versão da biblioteca ICU </td> </tr>
<tr><td><a class="link" href="information-functions.html#function_last-insert-id"><code>LAST_INSERT_ID()</code></a></td> <td> Valor da coluna AUTOINCREMENT para a última inserção </td> </tr>
<tr><td><a class="link" href="information-functions.html#function_roles-graphml"><code>ROLES_GRAPHML()</code></a></td> <td> Retornar um documento GraphML representando subgrafos de papéis de memória </td> </tr>
<tr><td><a class="link" href="information-functions.html#function_row-count"><code>ROW_COUNT()</code></a></td> <td> O número de linhas atualizadas </td> </tr>
<tr><td><a class="link" href="information-functions.html#function_schema"><code>SCHEMA()</code></a></td> <td> Símbolo para DATABASE() </td> </tr>
<tr><td><a class="link" href="information-functions.html#function_session-user"><code>SESSION_USER()</code></a></td> <td> Símbolo para USER() </td> </tr>
<tr><td><a class="link" href="information-functions.html#function_system-user"><code>SYSTEM_USER()</code></a></td> <td> Símbolo para USER() </td> </tr>
<tr><td><a class="link" href="information-functions.html#function_user"><code>USER()</code></a></td> <td> O nome e o nome do host do usuário fornecido pelo cliente </td> </tr>
<tr><td><a class="link" href="information-functions.html#function_version"><code>VERSION()</code></a></td> <td> Retornar uma string que indica a versão do servidor MySQL </td> </tr>
</table>

* `BENCHMARK(count,expr)`

  A função `BENCHMARK()` executa a expressão *`expr`* repetidamente *`count`* vezes. Ela pode ser usada para medir o tempo que o MySQL leva para processar a expressão. O valor de resultado é `0`, ou `NULL` para argumentos inadequados, como `NULL` ou um contador de repetição negativo.

  O uso pretendido é dentro do cliente **mysql**, que relata os tempos de execução das consultas:

  ```
  mysql> SELECT BENCHMARK(1000000,AES_ENCRYPT('hello','goodbye'));
  +---------------------------------------------------+
  | BENCHMARK(1000000,AES_ENCRYPT('hello','goodbye')) |
  +---------------------------------------------------+
  |                                                 0 |
  +---------------------------------------------------+
  1 row in set (4.74 sec)
  ```

  O tempo relatado é o tempo decorrido no cliente, e não o tempo da CPU no servidor. É aconselhável executar `BENCHMARK()` várias vezes e interpretar o resultado com base na carga do servidor.

  `BENCHMARK()` é destinado a medir o desempenho de execução de expressões escalares, o que tem algumas implicações significativas para a maneira como você as usa e interpreta os resultados:

  + Apenas expressões escalares podem ser usadas. Embora a expressão possa ser uma subconsulta, ela deve retornar uma única coluna e, no máximo, uma única linha. Por exemplo, `BENCHMARK(10, (SELECT * FROM t))` falha se a tabela `t` tiver mais de uma coluna ou mais de uma linha.

Executar uma instrução `SELECT expr` *`N`* vezes difere da execução de `SELECT BENCHMARK(N, expr)` em termos da quantidade de overhead envolvida. Os dois têm perfis de execução muito diferentes e você não deve esperar que eles levem o mesmo tempo. O primeiro envolve o analisador, otimizador, bloqueio de tabela e avaliação em tempo de execução *`N`* vezes cada. O segundo envolve apenas a avaliação em tempo de execução *`N`* vezes, e todos os outros componentes apenas uma vez. As estruturas de memória já alocadas são reutilizadas, e otimizações em tempo de execução, como o cache local de resultados já avaliados para funções agregadas, podem alterar os resultados. O uso de `BENCHMARK()` mede, portanto, o desempenho do componente em tempo de execução, dando mais peso a esse componente e removendo o "ruído" introduzido pela rede, analisador, otimizador e assim por diante.

* `CHARSET(str)`

  Retorna o conjunto de caracteres da string argumento, ou `NULL` se o argumento for `NULL`.

  ```
  mysql> SELECT CHARSET('abc');
          -> 'utf8mb3'
  mysql> SELECT CHARSET(CONVERT('abc' USING latin1));
          -> 'latin1'
  mysql> SELECT CHARSET(USER());
          -> 'utf8mb3'
  ```

* `COERCIBILITY(str)`

  Retorna o valor de coercibilidade da collation do argumento de string.

  ```
  mysql> SELECT COERCIBILITY('abc' COLLATE utf8mb4_swedish_ci);
          -> 0
  mysql> SELECT COERCIBILITY(USER());
          -> 3
  mysql> SELECT COERCIBILITY('abc');
          -> 4
  mysql> SELECT COERCIBILITY(1000);
          -> 5
  ```

  Os valores de retorno têm os significados mostrados na tabela a seguir. Valores menores têm precedência maior.

<table summary="Valores de retorno da coercibilidade da collation, o significado de cada valor e um exemplo de cada um"><col style="width: 15%"/><col style="width: 15%"/><col style="width: 70%"/><thead><tr> <th>Coercibilidade</th> <th>Significado</th> <th>Exemplo</th> </tr></thead><tbody><tr> <th><code>0</code></th> <td>Collation explícita</td> <td>Valor com cláusula <code>COLLATE</code></td> </tr><tr> <th><code>2</code></th> <td>Collation implícita</td> <td>Valor da coluna, parâmetro de rotina armazenado ou variável local</td> </tr><tr> <th><code>3</code></th> <td>Constante do sistema</td> <td><a class="link" href="information-functions.html#function_user"><code>USER()</code></a> valor de retorno</td> </tr><tr> <th><code>4</code></th> <td>Coercível</td> <td>String literal</td> </tr><tr> <th><code>5</code></th> <td>Numérico</td> <td>Valor numérico ou temporal</td> </tr><tr> <th><code>6</code></th> <td>Nulo</td> <td><code>NULL</code> ou uma expressão derivada de <code>NULL</code></td> </tr><tr> <th><code>7</code></th> <td>Sem collation</td> <td>Concatenação de strings com diferentes collations</td> </tr></tbody></table>

`1` era anteriormente usado para “Sem collation”. Ele não é usado no MySQL 9.5, mas ainda é considerado válido para compatibilidade reversa. (Bug
  #37285902)

Para mais informações, consulte a Seção 12.8.4, “Coercibilidade da collation em expressões”.

* `COLLATION(str)`

  Retorna a collation do argumento de string.

  ```
  mysql> SELECT COLLATION('abc');
          -> 'utf8mb4_0900_ai_ci'
  mysql> SELECT COLLATION(_utf8mb4'abc');
          -> 'utf8mb4_0900_ai_ci'
  mysql> SELECT COLLATION(_latin1'abc');
          -> 'latin1_swedish_ci'
  ```

* `CONNECTION_ID()`

Retorna o ID de conexão (ID de thread) para a conexão. Cada conexão tem um ID que é único entre o conjunto de clientes conectados atualmente.

O valor retornado por `CONNECTION_ID()` é do mesmo tipo de valor exibido na coluna `ID` da tabela `PROCESSLIST` do Schema de Informações, na coluna `Id` da saída `SHOW PROCESSLIST` e na coluna `PROCESSLIST_ID` da tabela `threads` do Schema de Desempenho.

```
  mysql> SELECT CONNECTION_ID();
          -> 23786
  ```

Aviso

Mudar o valor da variável de sistema `pseudo_thread_id` altera o valor retornado pela função `CONNECTION_ID()`.

* `CURRENT_ROLE()`

  Retorna uma string `utf8mb3` contendo os papéis ativos atuais para a sessão atual, separados por vírgulas, ou `NONE` se não houver nenhum. O valor reflete a configuração da variável de sistema `sql_quote_show_create`.

  Suponha que uma conta receba os seguintes papéis:

  ```
  GRANT 'r1', 'r2' TO 'u1'@'localhost';
  SET DEFAULT ROLE ALL TO 'u1'@'localhost';
  ```

  Em sessões para `u1`, o valor inicial de `CURRENT_ROLE()` nomeia os papéis de conta padrão. Usar `SET ROLE` altera isso:

  ```
  mysql> SELECT CURRENT_ROLE();
  +-------------------+
  | CURRENT_ROLE()    |
  +-------------------+
  | `r1`@`%`,`r2`@`%` |
  +-------------------+
  mysql> SET ROLE 'r1'; SELECT CURRENT_ROLE();
  +----------------+
  | CURRENT_ROLE() |
  +----------------+
  | `r1`@`%`       |
  +----------------+
  ```

* `CURRENT_USER`, `CURRENT_USER()`

  Retorna o nome do usuário e o nome do host da conta MySQL que o servidor usou para autenticar o cliente atual. Esta conta determina seus privilégios de acesso. O valor de retorno é uma string no conjunto de caracteres `utf8mb3`.

  O valor de `CURRENT_USER()` pode diferir do valor de `USER()`.

  ```
  mysql> SELECT USER();
          -> 'davida@localhost'
  mysql> SELECT * FROM mysql.user;
  ERROR 1044: Access denied for user ''@'localhost' to
  database 'mysql'
  mysql> SELECT CURRENT_USER();
          -> '@localhost'
  ```

  O exemplo ilustra que, embora o cliente tenha especificado um nome de usuário de `davida` (como indicado pelo valor da função `USER()`), o servidor autenticou o cliente usando uma conta de usuário anônima (como visto pela parte vazia do nome do usuário do valor de `CURRENT_USER()`). Uma maneira de isso ocorrer é que não há conta listada nas tabelas de concessão para `davida`.

Dentro de um programa armazenado ou de uma visualização, `CURRENT_USER()` retorna a conta do usuário que definiu o objeto (conforme especificado pelo valor `DEFINER`) a menos que seja definido com a característica `SQL SECURITY INVOKER`. No último caso, `CURRENT_USER()` retorna o invocador do objeto.

Os gatilhos e eventos não têm opção para definir a característica `SQL SECURITY`, então, para esses objetos, `CURRENT_USER()` retorna a conta do usuário que definiu o objeto. Para retornar o invocador, use `USER()` ou `SESSION_USER()`.

As seguintes instruções suportam o uso da função `CURRENT_USER()` para substituir o nome (e, possivelmente, o host) de um usuário afetado ou de um definidor; nesses casos, `CURRENT_USER()` é expandido onde e como necessário:

+ `DROP USER`
+ `RENAME USER`
+ `GRANT`
+ `REVOKE`
+ `CREATE FUNCTION`
+ `CREATE PROCEDURE`
+ `CREATE TRIGGER`
+ `CREATE EVENT`
+ `CREATE VIEW`
+ `ALTER EVENT`
+ `ALTER VIEW`
+ `SET PASSWORD`

Para informações sobre as implicações dessa expansão de `CURRENT_USER()` para a replicação, consulte a Seção 19.5.1.8, “Replicação de CURRENT\_USER()”).

Essa função pode ser usada para o valor padrão de uma coluna `VARCHAR` ou `TEXT`, como mostrado na seguinte instrução `CREATE TABLE`:

```
  CREATE TABLE t (c VARCHAR(288) DEFAULT (CURRENT_USER()));
  ```

* `DATABASE()`

  Retorna o nome padrão (atual) da base de dados como uma string no conjunto de caracteres `utf8mb3`. Se não houver base de dados padrão, `DATABASE()` retorna `NULL`. Dentro de uma rotina armazenada, a base de dados padrão é a base de dados com a qual a rotina está associada, o que nem sempre é a mesma base de dados que é padrão no contexto de chamada.

  ```
  mysql> SELECT DATABASE();
          -> 'test'
  ```

  Se não houver base de dados padrão, `DATABASE()` retorna `NULL`.

* `FOUND_ROWS()`

  Nota

O modificador da consulta `SQL_CALC_FOUND_ROWS` e a função `FOUND_ROWS()` associada estão desatualizados; espera-se que sejam removidos em uma versão futura do MySQL. Execute a consulta com `LIMIT`, e depois uma segunda consulta com `COUNT(*)` e sem `LIMIT` para determinar se há linhas adicionais. Por exemplo, em vez dessas consultas:

  ```
  SELECT SQL_CALC_FOUND_ROWS * FROM tbl_name WHERE id > 100 LIMIT 10;
  SELECT FOUND_ROWS();
  ```

  Use essas consultas em vez disso:

  ```
  SELECT * FROM tbl_name WHERE id > 100 LIMIT 10;
  SELECT COUNT(*) FROM tbl_name WHERE id > 100;
  ```

  `COUNT(*)` está sujeito a certas otimizações. `SQL_CALC_FOUND_ROWS` faz com que algumas otimizações sejam desativadas.

  Uma declaração `SELECT` pode incluir uma cláusula `LIMIT` para restringir o número de linhas que o servidor retorna ao cliente. Em alguns casos, é desejável saber quantas linhas a declaração teria retornado sem o `LIMIT`, mas sem executar a declaração novamente. Para obter esse número de linhas, inclua uma opção `SQL_CALC_FOUND_ROWS` na declaração `SELECT`, e depois invoque `FOUND_ROWS()` posteriormente:

  ```
  mysql> SELECT SQL_CALC_FOUND_ROWS * FROM tbl_name
      -> WHERE id > 100 LIMIT 10;
  mysql> SELECT FOUND_ROWS();
  ```

  A segunda `SELECT` retorna um número indicando quantas linhas a primeira `SELECT` teria retornado se tivesse sido escrita sem a cláusula `LIMIT`.

  Na ausência da opção `SQL_CALC_FOUND_ROWS` na declaração `SELECT` mais recente com sucesso, `FOUND_ROWS()` retorna o número de linhas no conjunto de resultados retornado por essa declaração. Se a declaração incluir uma cláusula `LIMIT`, `FOUND_ROWS()` retorna o número de linhas até o limite. Por exemplo, `FOUND_ROWS()` retorna 10 ou 60, respectivamente, se a declaração incluir `LIMIT 10` ou `LIMIT 50, 10`.

  O número de linhas disponível através de `FOUND_ROWS()` é transitório e não é destinado a estar disponível após a declaração que segue a declaração `SELECT SQL_CALC_FOUND_ROWS`. Se você precisar referenciar o valor mais tarde, salve-o:

  ```
  mysql> SELECT SQL_CALC_FOUND_ROWS * FROM ... ;
  mysql> SET @rows = FOUND_ROWS();
  ```

Se você estiver usando `SELECT SQL_CALC_FOUND_ROWS`, o MySQL deve calcular quantos registros estão no conjunto de resultados completo. No entanto, isso é mais rápido do que executar a consulta novamente sem `LIMIT`, porque o conjunto de resultados não precisa ser enviado ao cliente.

`SQL_CALC_FOUND_ROWS` e `FOUND_ROWS()` podem ser úteis em situações em que você deseja restringir o número de registros que uma consulta retorna, mas também determinar o número de registros no conjunto de resultados completo sem executar a consulta novamente. Um exemplo é um script da Web que apresenta uma exibição em páginas contendo links para as páginas que mostram outras seções de um resultado de pesquisa. Usar `FOUND_ROWS()` permite determinar quantos outros páginas são necessárias para o restante do resultado.

O uso de `SQL_CALC_FOUND_ROWS` e `FOUND_ROWS()` é mais complexo para as instruções `UNION` do que para instruções `SELECT` simples, porque `LIMIT` pode ocorrer em vários lugares em uma `UNION`. Pode ser aplicado a instruções `SELECT` individuais na `UNION`, ou globalmente ao resultado da `UNION` como um todo.

A intenção de `SQL_CALC_FOUND_ROWS` para `UNION` é que ele deve retornar o contagem de linhas que seria retornada sem um `LIMIT` global. As condições para o uso de `SQL_CALC_FOUND_ROWS` com `UNION` são:

+ A palavra-chave `SQL_CALC_FOUND_ROWS` deve aparecer na primeira `SELECT` da `UNION`.

+ O valor de `FOUND_ROWS()` é exato apenas se `UNION ALL` for usado. Se `UNION` sem `ALL` for usado, a remoção de duplicatas ocorre e o valor de `FOUND_ROWS()` é apenas aproximado.

+ Se não houver `LIMIT` na `UNION`, `SQL_CALC_FOUND_ROWS` é ignorado e retorna o número de linhas na tabela temporária que é criada para processar a `UNION`.

Além dos casos descritos aqui, o comportamento de `FOUND_ROWS()` é indefinido (por exemplo, seu valor após uma instrução `SELECT` que falha com um erro).

Importante

`FOUND_ROWS()` não é replicada de forma confiável usando replicação baseada em instruções. Esta função é replicada automaticamente usando replicação baseada em linhas.

* `ICU_VERSION()`

  A versão da biblioteca Internacional de Componentes para Unicode (ICU) usada para suportar operações de expressão regular (consulte a Seção 14.8.2, “Expressões Regulares”). Esta função é destinada principalmente para uso em casos de teste.

* `LAST_INSERT_ID()`, `LAST_INSERT_ID(expr)`

  Sem argumento, `LAST_INSERT_ID()` retorna um valor `BIGINT UNSIGNED` (64 bits) representando o primeiro valor gerado automaticamente inserido para uma coluna `AUTO_INCREMENT` como resultado da instrução `INSERT` executada mais recentemente. O valor de `LAST_INSERT_ID()` permanece inalterado se nenhuma linha for inserida com sucesso.

  Com um argumento, `LAST_INSERT_ID()` retorna um inteiro não assinado ou `NULL` se o argumento for `NULL`.

  Por exemplo, após inserir uma linha que gera um valor `AUTO_INCREMENT`, você pode obter o valor assim:

  ```
  mysql> SELECT LAST_INSERT_ID();
          -> 195
  ```

  A instrução atualmente em execução não afeta o valor de `LAST_INSERT_ID()`. Suponha que você gere um valor `AUTO_INCREMENT` com uma instrução e, em seguida, faça referência a `LAST_INSERT_ID()` em uma instrução `INSERT` de múltiplas linhas que insere linhas em uma tabela com sua própria coluna `AUTO_INCREMENT`. O valor de `LAST_INSERT_ID()` permanece estável na segunda instrução; seu valor para as segunda e linhas posteriores não é afetado pelas inserções de linhas anteriores. (Você deve estar ciente de que, se você misturar referências a `LAST_INSERT_ID()` e `LAST_INSERT_ID(expr)`, o efeito é indefinido.)

Se a declaração anterior retornar um erro, o valor de `LAST_INSERT_ID()` será indefinido. Para tabelas transacionais, se a declaração for revertida devido a um erro, o valor de `LAST_INSERT_ID()` permanecerá indefinido. Para um `ROLLBACK` manual, o valor de `LAST_INSERT_ID()` não é restaurado para o valor anterior à transação; ele permanece como estava no momento do `ROLLBACK`.

Dentro do corpo de uma rotina armazenada (procedimento ou função) ou de um gatilho, o valor de `LAST_INSERT_ID()` muda da mesma maneira que para declarações executadas fora do corpo desses tipos de objetos. O efeito de uma rotina armazenada ou de um gatilho sobre o valor de `LAST_INSERT_ID()` que é visto seguindo declarações depende do tipo de rotina:

+ Se um procedimento armazenado executa declarações que alteram o valor de `LAST_INSERT_ID()`, o valor alterado é visto por declarações que seguem a chamada do procedimento.

+ Para funções e gatilhos armazenados que alteram o valor, o valor é restaurado quando a função ou gatilho termina, então declarações que vêm depois não veem um valor alterado.

O ID que foi gerado é mantido no servidor em uma base *por conexão*. Isso significa que o valor retornado pela função para um cliente específico é o primeiro valor `AUTO_INCREMENT` gerado para a declaração mais recente que afeta uma coluna `AUTO_INCREMENT` *por esse cliente*. Esse valor não pode ser afetado por outros clientes, mesmo que eles gerem valores `AUTO_INCREMENT` próprios. Esse comportamento garante que cada cliente possa recuperar seu próprio ID sem preocupação com a atividade de outros clientes, e sem a necessidade de bloqueios ou transações.

O valor de `LAST_INSERT_ID()` não é alterado se você definir a coluna `AUTO_INCREMENT` de uma linha para um valor não "mágico" (ou seja, um valor que não é `NULL` e não `0`).

Importante

Se você inserir várias linhas usando uma única instrução `INSERT`, `LAST_INSERT_ID()` retornará o valor gerado para a *primeira* linha inserida *apenas*. A razão para isso é permitir que você reproduza facilmente a mesma instrução `INSERT` em outro servidor.

Por exemplo:

```
  mysql> USE test;

  mysql> CREATE TABLE t (
         id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
         name VARCHAR(10) NOT NULL
         );

  mysql> INSERT INTO t VALUES (NULL, 'Bob');

  mysql> SELECT * FROM t;
  +----+------+
  | id | name |
  +----+------+
  |  1 | Bob  |
  +----+------+

  mysql> SELECT LAST_INSERT_ID();
  +------------------+
  | LAST_INSERT_ID() |
  +------------------+
  |                1 |
  +------------------+

  mysql> INSERT INTO t VALUES
         (NULL, 'Mary'), (NULL, 'Jane'), (NULL, 'Lisa');

  mysql> SELECT * FROM t;
  +----+------+
  | id | name |
  +----+------+
  |  1 | Bob  |
  |  2 | Mary |
  |  3 | Jane |
  |  4 | Lisa |
  +----+------+

  mysql> SELECT LAST_INSERT_ID();
  +------------------+
  | LAST_INSERT_ID() |
  +------------------+
  |                2 |
  +------------------+
  ```

Embora a segunda instrução `INSERT` tenha inserido três novas linhas em `t`, o ID gerado para a primeira dessas linhas foi `2`, e é esse valor que é retornado por `LAST_INSERT_ID()` para a instrução `SELECT` seguinte.

Se você usar `INSERT IGNORE` e a linha for ignorada, o `LAST_INSERT_ID()` permanece inalterado do valor atual (ou 0 é retornado se a conexão ainda não tiver realizado uma `INSERT` bem-sucedida) e, para tabelas não transacionais, o contador `AUTO_INCREMENT` não é incrementado. Para tabelas `InnoDB`, o contador `AUTO_INCREMENT` é incrementado se `innodb_autoinc_lock_mode` estiver definido como `1` ou `2`, como demonstrado no exemplo seguinte:

```
  mysql> USE test;

  mysql> SELECT @@innodb_autoinc_lock_mode;
  +----------------------------+
  | @@innodb_autoinc_lock_mode |
  +----------------------------+
  |                          1 |
  +----------------------------+

  mysql> CREATE TABLE `t` (
         `id` INT(11) NOT NULL AUTO_INCREMENT,
         `val` INT(11) DEFAULT NULL,
         PRIMARY KEY (`id`),
         UNIQUE KEY `i1` (`val`)
         ) ENGINE=InnoDB;

  # Insert two rows

  mysql> INSERT INTO t (val) VALUES (1),(2);

  # With auto_increment_offset=1, the inserted rows
  # result in an AUTO_INCREMENT value of 3

  mysql> SHOW CREATE TABLE t\G
  *************************** 1. row ***************************
         Table: t
  Create Table: CREATE TABLE `t` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `val` int(11) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `i1` (`val`)
  ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

  # LAST_INSERT_ID() returns the first automatically generated
  # value that is successfully inserted for the AUTO_INCREMENT column

  mysql> SELECT LAST_INSERT_ID();
  +------------------+
  | LAST_INSERT_ID() |
  +------------------+
  |                1 |
  +------------------+

  # The attempted insertion of duplicate rows fail but errors are ignored

  mysql> INSERT IGNORE INTO t (val) VALUES (1),(2);
  Query OK, 0 rows affected (0.00 sec)
  Records: 2  Duplicates: 2  Warnings: 0

  # With innodb_autoinc_lock_mode=1, the AUTO_INCREMENT counter
  # is incremented for the ignored rows

  mysql> SHOW CREATE TABLE t\G
  *************************** 1. row ***************************
         Table: t
  Create Table: CREATE TABLE `t` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `val` int(11) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `i1` (`val`)
  ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

  # The LAST_INSERT_ID is unchanged because the previous insert was unsuccessful

  mysql> SELECT LAST_INSERT_ID();
  +------------------+
  | LAST_INSERT_ID() |
  +------------------+
  |                1 |
  +------------------+
  ```

Para mais informações, consulte a Seção 17.6.1.6, “Tratamento de `AUTO\_INCREMENT` em `InnoDB’”.

Se `expr` for fornecido como argumento para `LAST_INSERT_ID()`, o valor do argumento é retornado pela função e é lembrado como o próximo valor a ser retornado por `LAST_INSERT_ID()`. Isso pode ser usado para simular sequências:

1. Crie uma tabela para armazenar o contador de sequência e inicie-a:

     ```
     mysql> CREATE TABLE sequence (id INT NOT NULL);
     mysql> INSERT INTO sequence VALUES (0);
     ```

2. Use a tabela para gerar números de sequência assim:

     ```
     mysql> UPDATE sequence SET id=LAST_INSERT_ID(id+1);
     mysql> SELECT LAST_INSERT_ID();
     ```

     A instrução `UPDATE` incrementa o contador de sequência e faz com que a próxima chamada para `LAST_INSERT_ID()` retorne o valor atualizado. A instrução `SELECT` recupera esse valor. A função C API `mysql_insert_id()` também pode ser usada para obter o valor. Veja mysql\_insert\_id().

Você pode gerar sequências sem chamar `LAST_INSERT_ID()`, mas a utilidade de usar a função dessa maneira é que o valor do ID é mantido no servidor como o último valor gerado automaticamente. É seguro para múltiplos usuários, pois vários clientes podem emitir a instrução `UPDATE` e obter seu próprio valor de sequência com a instrução `SELECT` (ou `mysql_insert_id()`), sem afetar ou ser afetado por outros clientes que geram seus próprios valores de sequência.

Note que `mysql_insert_id()` é atualizado apenas após as instruções `INSERT` e `UPDATE`, então você não pode usar a função da API C para recuperar o valor para `LAST_INSERT_ID(expr)` após executar outras instruções SQL como `SELECT` ou `SET`.

* `ROLES_GRAPHML()`

  Retorna uma string `utf8mb3` contendo um documento GraphML representando subgrafos de rolos de memória. O privilégio `ROLE_ADMIN` (ou o privilégio desatualizado `SUPER`) é necessário para ver o conteúdo no elemento `<graphml>`. Caso contrário, o resultado mostra apenas um elemento vazio:

  ```
  mysql> SELECT ROLES_GRAPHML();
  +---------------------------------------------------+
  | ROLES_GRAPHML()                                   |
  +---------------------------------------------------+
  | <?xml version="1.0" encoding="UTF-8"?><graphml /> |
  +---------------------------------------------------+
  ```

* `ROW_COUNT()`

  `ROW_COUNT()` retorna um valor da seguinte forma:

  + Instruções DDL: 0. Isso se aplica a instruções como `CREATE TABLE` ou `DROP TABLE`.

  + Instruções DML, exceto `SELECT`: O número de linhas afetadas. Isso se aplica a instruções como `UPDATE`, `INSERT` ou `DELETE` (como antes), mas agora também a instruções como `ALTER TABLE` e `LOAD DATA`.

  + `SELECT`: -1 se a instrução retornar um conjunto de resultados, ou o número de linhas "afectadas" se não retornar. Por exemplo, para `SELECT * FROM t1`, `ROW_COUNT()` retorna -1. Para `SELECT * FROM t1 INTO OUTFILE 'file_name'`, `ROW_COUNT()` retorna o número de linhas escritas no arquivo.

  + Instruções `SIGNAL`: 0.

Para as instruções `UPDATE`, o valor `affected-rows` por padrão é o número de linhas realmente alteradas. Se você especificar a bandeira `CLIENT_FOUND_ROWS` para `mysql_real_connect()` ao se conectar ao **mysqld**, o valor `affected-rows` é o número de linhas "encontradas"; ou seja, correspondentes à cláusula `WHERE`.

Para as instruções `REPLACE`, o valor `affected-rows` é 2 se a nova linha substituir uma linha antiga, porque, neste caso, uma linha é inserida após a duplicata ser excluída.

Para as instruções `INSERT ... ON DUPLICATE KEY UPDATE`, o valor `affected-rows` por linha é 1 se a linha for inserida como uma nova linha, 2 se uma linha existente for atualizada e 0 se uma linha existente for definida com seus valores atuais. Se você especificar a bandeira `CLIENT_FOUND_ROWS`, o valor `affected-rows` é 1 (e não 0) se uma linha existente for definida com seus valores atuais.

O valor `ROW_COUNT()` é semelhante ao valor da função C API `mysql_affected_rows()` e ao número de linhas que o cliente **mysql** exibe após a execução da instrução.

```
  mysql> INSERT INTO t VALUES(1),(2),(3);
  Query OK, 3 rows affected (0.00 sec)
  Records: 3  Duplicates: 0  Warnings: 0

  mysql> SELECT ROW_COUNT();
  +-------------+
  | ROW_COUNT() |
  +-------------+
  |           3 |
  +-------------+
  1 row in set (0.00 sec)

  mysql> DELETE FROM t WHERE i IN(1,2);
  Query OK, 2 rows affected (0.00 sec)

  mysql> SELECT ROW_COUNT();
  +-------------+
  | ROW_COUNT() |
  +-------------+
  |           2 |
  +-------------+
  1 row in set (0.00 sec)
  ```

Importante

`ROW_COUNT()` não é replicada de forma confiável usando a replicação baseada em instruções. Esta função é replicada automaticamente usando a replicação baseada em linhas.

* `SCHEMA()`

Esta função é sinônima de `DATABASE()`.

* `SESSION_USER()`

`SESSION_USER()` é sinônimo de `USER()`.

Assim como `USER()`, esta função pode ser usada para o valor padrão de uma coluna `VARCHAR` ou `TEXT`, como mostrado na seguinte instrução `CREATE TABLE`:

```
  CREATE TABLE t (c VARCHAR(288) DEFAULT (SESSION_USER()));
  ```

* `SYSTEM_USER()`

`SYSTEM_USER()` é sinônimo de `USER()`.

Nota

A função `SYSTEM_USER()` é distinta do privilégio `SYSTEM_USER`. A primeira retorna o nome atual da conta MySQL. A segunda distingue as categorias de contas de usuário do sistema e as contas de usuário regulares (consulte a Seção 8.2.11, “Categorias de Conta”).

Assim como `USER()`, essa função pode ser usada para o valor padrão de uma coluna `VARCHAR` ou `TEXT`, como mostrado na seguinte instrução `CREATE TABLE`:

```
  CREATE TABLE t (c VARCHAR(288) DEFAULT (SYSTEM_USER()));
  ```

* `USER()`

Retorna o nome atual do usuário MySQL e o nome do host como uma string no conjunto de caracteres `utf8mb3`.

```
  mysql> SELECT USER();
          -> 'davida@localhost'
  ```

O valor indica o nome do usuário que você especificou ao se conectar ao servidor e o host do cliente a partir do qual você se conectou. O valor pode ser diferente do de `CURRENT_USER()`.

Essa função pode ser usada para o valor padrão de uma coluna `VARCHAR` ou `TEXT`, como mostrado na seguinte instrução `CREATE TABLE`:

```
  CREATE TABLE t (c VARCHAR(288) DEFAULT (USER()));
  ```

* `VERSION()`

Retorna uma string que indica a versão do servidor MySQL. A string usa o conjunto de caracteres `utf8mb3`. O valor pode ter um sufixo além do número da versão. Consulte a descrição da variável de sistema `version` na Seção 7.1.8, “Variáveis de Sistema do Servidor”.

Essa função não é segura para a replicação baseada em instruções. Uma mensagem de aviso é registrada se você usar essa função quando `binlog_format` estiver definido como `STATEMENT`.

```
  mysql> SELECT VERSION();
          -> '9.5.0-standard'
  ```