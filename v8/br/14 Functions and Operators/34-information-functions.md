## 14.15 Funções de Informação

**Tabela 14.20 Funções de Informação**

<table><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>BENCHMARK()</code></td> <td> Realizar repetidamente uma expressão </td> </tr><tr><td><code>CHARSET()</code></td> <td> Retornar o conjunto de caracteres do argumento </td> </tr><tr><td><code>COERCIBILITY()</code></td> <td> Retornar o valor de coercibilidade da colocação de cadeia de caracteres </td> </tr><tr><td><code>COLLATION()</code></td> <td> Retornar a colocação da cadeia de caracteres </td> </tr><tr><td><code>CONNECTION_ID()</code></td> <td> Retornar o ID de conexão (ID de thread) para a conexão </td> </tr><tr><td><code>CURRENT_ROLE()</code></td> <td> Retornar os papéis ativos atuais </td> </tr><tr><td><code>CURRENT_USER()</code>, <code>CURRENT_USER</code></td> <td> O nome e o nome do host do usuário autenticado </td> </tr><tr><td><code>DATABASE()</code></td> <td> Retornar o nome da base de dados padrão (atual) </td> </tr><tr><td><code>FOUND_ROWS()</code></td> <td> Para um SELECT com uma cláusula LIMIT, o número de linhas que seriam retornadas se não houvesse a cláusula LIMIT </td> </tr><tr><td><code>ICU_VERSION()</code></td> <td> Versão da biblioteca ICU </td> </tr><tr><td><code>LAST_INSERT_ID()</code></td> <td> Valor da coluna AUTOINCREMENT para a última inserção </td> </tr><tr><td><code>ROLES_GRAPHML()</code></td> <td> Retornar um documento GraphML que representa subgrafos de papéis de memória </td> </tr><tr><td><code>ROW_COUNT()</code></td> <td> Número de linhas atualizadas </td> </tr><tr><td><code>SCHEMA()</code></td> <td> Sinônimo de DATABASE() </td> </tr><tr><td><code>SESSION_USER()</code></td> <td> Sinônimo de USER() </td> </tr><tr><td><code>SYSTEM_USER()</code></td> <td> Sinônimo de USER() </td> </tr><tr><td><code>USER()</code></td> <td> O nome e o nome do host do usuário fornecidos pelo cliente </td> </tr><tr><td><code>VERSION()</code></td> <td> Retornar uma string que indica a versão do servidor MySQL </td> </tr></tbody></table>

A função `BENCHMARK()` executa a expressão *`expr`* repetidamente *`count`* vezes. Pode ser usada para medir o tempo que o MySQL leva para processar a expressão. O valor de resultado é `0`, ou `NULL` para argumentos inadequados, como `NULL` ou um número de repetições negativo.

O uso pretendido é dentro do cliente `mysql`, que relata os tempos de execução das consultas:

```
  mysql> SELECT BENCHMARK(1000000,AES_ENCRYPT('hello','goodbye'));
  +---------------------------------------------------+
  | BENCHMARK(1000000,AES_ENCRYPT('hello','goodbye')) |
  +---------------------------------------------------+
  |                                                 0 |
  +---------------------------------------------------+
  1 row in set (4.74 sec)
  ```

O tempo relatado é o tempo decorrido no cliente, e não o tempo da CPU no servidor. É aconselhável executar `BENCHMARK()` várias vezes e interpretar o resultado com base na carga da máquina do servidor.

`BENCHMARK()` é destinado a medir o desempenho do tempo de execução de expressões escalares, o que tem algumas implicações significativas sobre a forma como você as usa e interpreta os resultados:

+ Apenas expressões escalares podem ser usadas. Embora a expressão possa ser uma subconsulta, ela deve retornar uma única coluna e, no máximo, uma única linha. Por exemplo, `BENCHMARK(10, (SELECT * FROM t))` falha se a tabela `t` tiver mais de uma coluna ou mais de uma linha.
+ Executar uma declaração `SELECT expr` *`N`* vezes difere de executar `SELECT BENCHMARK(N, expr)` em termos da quantidade de overhead envolvida. Os dois têm perfis de execução muito diferentes e você não deve esperar que eles levem o mesmo tempo. O primeiro envolve o analisador, otimizador, bloqueio de tabela e avaliação de tempo de execução *`N`* vezes cada. O segundo envolve apenas a avaliação de tempo de execução *`N`* vezes, e todos os outros componentes apenas uma vez. As estruturas de memória já alocadas são reutilizadas, e otimizações de tempo de execução, como o cache local de resultados já avaliados para funções agregadas, podem alterar os resultados. O uso de `BENCHMARK()` mede, portanto, o desempenho do componente de tempo de execução, dando mais peso a esse componente e removendo o "ruído" introduzido pela rede, analisador, otimizador e assim por diante.
*  `CHARSET(str)`

Retorna o conjunto de caracteres da string argumento, ou `NULL` se o argumento for `NULL`.

```
  mysql> SELECT CHARSET('abc');
          -> 'utf8mb3'
  mysql> SELECT CHARSET(CONVERT('abc' USING latin1));
          -> 'latin1'
  mysql> SELECT CHARSET(USER());
          -> 'utf8mb3'
  ```
*  `COERCIBILITY(str)`

  Retorna o valor de coercibilidade de ordenação da string argumento.

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

  <table><col style="width: 15%"/><col style="width: 15%"/><col style="width: 70%"/><thead><tr> <th>Coercibilidade</th> <th>Significado</th> <th>Exemplo</th> </tr></thead><tbody><tr> <th><code>0</code></th> <td>Ordenação explícita</td> <td>Valor com cláusula <code>COLLATE</code></td> </tr><tr> <th><code>1</code></th> <td>Sem ordenação</td> <td>Concatenação de strings com ordenações diferentes</td> </tr><tr> <th><code>2</code></th> <td>Ordenação implícita</td> <td>Valor da coluna, parâmetro de rotina armazenado ou variável local</td> </tr><tr> <th><code>3</code></th> <td>Constante do sistema</td> <td>Valor de retorno de <code>USER()</code></td> </tr><tr> <th><code>4</code></th> <td>Coercível</td> <td>String literal</td> </tr><tr> <th><code>5</code></th> <td>Numérico</td> <td>Valor numérico ou temporal</td> </tr><tr> <th><code>6</code></th> <td>Ignorável</td> <td><code>NULL</code> ou uma expressão derivada de <code>NULL</code></td> </tr></tbody></table>

  Para mais informações, consulte a Seção 12.8.4, “Coercibilidade de ordenação em expressões”.
*  `COLLATION(str)`

  Retorna a ordenação da string argumento.

  ```
  mysql> SELECT COLLATION('abc');
          -> 'utf8mb4_0900_ai_ci'
  mysql> SELECT COLLATION(_utf8mb4'abc');
          -> 'utf8mb4_0900_ai_ci'
  mysql> SELECT COLLATION(_latin1'abc');
          -> 'latin1_swedish_ci'
  ```
*  `CONNECTION_ID()`

  Retorna o ID de conexão (ID de thread) para a conexão. Cada conexão tem um ID que é único entre o conjunto de clientes conectados atualmente.

  O valor retornado por `CONNECTION_ID()` é do mesmo tipo de valor exibido na coluna `ID` da tabela `PROCESSLIST` do Schema de Informações, na coluna `Id` da saída de `SHOW PROCESSLIST` e na coluna `PROCESSLIST_ID` da tabela `threads` do Schema de Desempenho.

  ```
  mysql> SELECT CONNECTION_ID();
          -> 23786
  ```

  Aviso

  Alterar o valor da variável de sistema `pseudo_thread_id` muda o valor retornado pela função `CONNECTION_ID()`.
*  `CURRENT_ROLE()`

Retorna uma string `utf8mb3` contendo os papéis ativos atuais para a sessão atual, separados por vírgulas, ou `NONE` se não houver nenhum. O valor reflete a configuração da variável de sistema `sql_quote_show_create`.

Suponha que uma conta seja concedida com papéis da seguinte forma:

```
  GRANT 'r1', 'r2' TO 'u1'@'localhost';
  SET DEFAULT ROLE ALL TO 'u1'@'localhost';
  ```

Em sessões para `u1`, o valor inicial de `CURRENT_ROLE()` nomeia os papéis padrão da conta. Usando `SET ROLE`, isso é alterado:

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

Retorna a combinação de nome de usuário e nome do host para a conta MySQL que o servidor usou para autenticar o cliente atual. Essa conta determina seus privilégios de acesso. O valor de retorno é uma string no conjunto de caracteres `utf8mb3`.

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

O exemplo ilustra que, embora o cliente tenha especificado um nome de usuário de `davida` (conforme indicado pelo valor da função `USER()`), o servidor autenticou o cliente usando uma conta de usuário anônima (como visto pela parte vazia do nome de usuário do valor `CURRENT_USER()`). Uma maneira de isso ocorrer é que não há conta listada nas tabelas de concessão para `davida`.

Dentro de um programa ou visual armazenado, `CURRENT_USER()` retorna a conta do usuário que definiu o objeto (conforme dado pelo seu valor `DEFINER`) a menos que seja definido com a característica `SQL SECURITY INVOKER`. No último caso, `CURRENT_USER()` retorna o invocador do objeto.

Triggers e eventos não têm opção para definir a característica `SQL SECURITY`, então, para esses objetos, `CURRENT_USER()` retorna a conta do usuário que definiu o objeto. Para retornar o invocador, use `USER()` ou `SESSION_USER()`.

As seguintes instruções suportam o uso da função `CURRENT_USER()` para substituir o nome de (e, possivelmente, o host de) um usuário afetado ou um definidor; nesses casos, `CURRENT_USER()` é expandido onde e como necessário:

+  `DROP USER`
+  `RENAME USER`
+  `GRANT`
+  `REVOKE`
+  `CREATE FUNCTION`
+  `CREATE PROCEDURE`
+  `CREATE TRIGGER`
+  `CREATE EVENT`
+  `CREATE VIEW`
+  `ALTER EVENT`
+  `ALTER VIEW`
+  `SET PASSWORD`

  Para informações sobre as implicações dessa expansão do `CURRENT_USER()` para a replicação, consulte a Seção 19.5.1.8, “Replicação do `CURRENT\_USER()`”).

  Essa função pode ser usada para o valor padrão de uma coluna `VARCHAR` ou `TEXT`, conforme mostrado na seguinte instrução `CREATE TABLE`:

  ```
  CREATE TABLE t (c VARCHAR(288) DEFAULT (CURRENT_USER()));
  ```
*  `DATABASE()`

  Retorna o nome padrão (atual) da base de dados como uma string no conjunto de caracteres `utf8mb3`. Se não houver base de dados padrão, `DATABASE()` retorna `NULL`. Dentro de uma rotina armazenada, a base de dados padrão é a base de dados com a qual a rotina está associada, o que nem sempre é o mesmo que a base de dados padrão no contexto de chamada.

  ```
  mysql> SELECT DATABASE();
          -> 'test'
  ```

  Se não houver base de dados padrão, `DATABASE()` retorna `NULL`.
*  `FOUND_ROWS()`

  ::: informação Nota

  O modificador de consulta `SQL_CALC_FOUND_ROWS` e a função `FOUND_ROWS()` estão desatualizados; espere-se que sejam removidos em uma versão futura do MySQL. Execute a consulta com `LIMIT` e, em seguida, uma segunda consulta com `COUNT(*)` e sem `LIMIT` para determinar se há linhas adicionais. Por exemplo, em vez dessas consultas:

  ```
  SELECT SQL_CALC_FOUND_ROWS * FROM tbl_name WHERE id > 100 LIMIT 10;
  SELECT FOUND_ROWS();
  ```

  Use essas consultas em vez disso:

  ```
  SELECT * FROM tbl_name WHERE id > 100 LIMIT 10;
  SELECT COUNT(*) FROM tbl_name WHERE id > 100;
  ```

   `COUNT(*)` está sujeito a certas otimizações. `SQL_CALC_FOUND_ROWS` desativa algumas otimizações.


  :::

  Uma consulta `SELECT` pode incluir uma cláusula `LIMIT` para restringir o número de linhas que o servidor retorna ao cliente. Em alguns casos, é desejável saber quantas linhas a consulta teria retornado sem o `LIMIT`, mas sem executar a consulta novamente. Para obter esse número de linhas, inclua uma opção `SQL_CALC_FOUND_ROWS` na consulta `SELECT` e, em seguida, invoque `FOUND_ROWS()` posteriormente:

  ```
  mysql> SELECT SQL_CALC_FOUND_ROWS * FROM tbl_name
      -> WHERE id > 100 LIMIT 10;
  mysql> SELECT FOUND_ROWS();
  ```

A segunda consulta `SELECT` retorna um número que indica quantos registros a primeira consulta `SELECT` teria retornado se tivesse sido escrita sem a cláusula `LIMIT`.

Na ausência da opção `SQL_CALC_FOUND_ROWS` na consulta `SELECT` bem-sucedida mais recente, o `FOUND_ROWS()` retorna o número de registros no conjunto de resultados retornado por essa consulta. Se a consulta incluir uma cláusula `LIMIT`, o `FOUND_ROWS()` retorna o número de registros até o limite. Por exemplo, o `FOUND_ROWS()` retorna 10 ou 60, respectivamente, se a consulta incluir `LIMIT 10` ou `LIMIT 50, 10`.

O contagem de linhas disponível através do `FOUND_ROWS()` é transitória e não deve ser disponível após a consulta que segue a consulta `SELECT SQL_CALC_FOUND_ROWS`. Se você precisar referenciar o valor mais tarde, salve-o:

```
  mysql> SELECT SQL_CALC_FOUND_ROWS * FROM ... ;
  mysql> SET @rows = FOUND_ROWS();
  ```

Se você estiver usando `SELECT SQL_CALC_FOUND_ROWS`, o MySQL deve calcular quantos registros estão no conjunto de resultados completo. No entanto, isso é mais rápido do que executar a consulta novamente sem `LIMIT`, porque o conjunto de resultados não precisa ser enviado ao cliente.

`SQL_CALC_FOUND_ROWS` e `FOUND_ROWS()` podem ser úteis em situações em que você deseja restringir o número de registros que uma consulta retorna, mas também determinar o número de registros no conjunto de resultados completo sem executar a consulta novamente. Um exemplo é um script da Web que apresenta uma exibição paginada contendo links para as páginas que mostram outras seções de um resultado de pesquisa. Usar `FOUND_ROWS()` permite determinar quantos outros páginas são necessárias para o restante do resultado.

O uso de `SQL_CALC_FOUND_ROWS` e `FOUND_ROWS()` é mais complexo para as instruções `UNION` do que para as instruções simples `SELECT`, porque `LIMIT` pode ocorrer em vários lugares em uma `UNION`. Pode ser aplicado a instruções `SELECT` individuais na `UNION`, ou globalmente ao resultado da `UNION` como um todo.

A intenção de `SQL_CALC_FOUND_ROWS` para `UNION` é que ele retorne o número de linhas que seria retornado sem um `LIMIT` global. As condições para o uso de `SQL_CALC_FOUND_ROWS` com `UNION` são:

  + A palavra-chave `SQL_CALC_FOUND_ROWS` deve aparecer no primeiro `SELECT` da `UNION`.
  + O valor de `FOUND_ROWS()` é exato apenas se `UNION ALL` for usado. Se `UNION` sem `ALL` for usado, a remoção de duplicatas ocorre e o valor de `FOUND_ROWS()` é apenas aproximado.
  + Se não houver `LIMIT` na `UNION`, `SQL_CALC_FOUND_ROWS` é ignorado e retorna o número de linhas na tabela temporária que é criada para processar a `UNION`.

  Além dos casos descritos aqui, o comportamento de `FOUND_ROWS()` é indefinido (por exemplo, seu valor após uma instrução `SELECT` que falha com um erro).

  Importante

   `FOUND_ROWS()` não é replicado de forma confiável usando replicação baseada em instruções. Esta função é replicada automaticamente usando replicação baseada em linhas.
*  `ICU_VERSION()`

  A versão da biblioteca Internacional de Componentes para Unicode (ICU) usada para suportar operações de expressão regular (veja a Seção 14.8.2, “Expressões Regulares”). Esta função é destinada principalmente para uso em casos de teste.
*  `LAST_INSERT_ID()`, `LAST_INSERT_ID(expr)`

  Sem argumento, `LAST_INSERT_ID()` retorna um valor `BIGINT UNSIGNED` (64 bits) representando o primeiro valor gerado automaticamente inserido para uma coluna `AUTO_INCREMENT` como resultado da instrução `INSERT` executada mais recentemente. O valor de `LAST_INSERT_ID()` permanece inalterado se nenhuma linha for inserida com sucesso.

  Com um argumento, `LAST_INSERT_ID()` retorna um inteiro não assinado, ou `NULL` se o argumento for `NULL`.

  Por exemplo, após inserir uma linha que gera um valor `AUTO_INCREMENT`, você pode obter o valor assim:

  ```
  mysql> SELECT LAST_INSERT_ID();
          -> 195
  ```

A declaração atualmente em execução não afeta o valor de `LAST_INSERT_ID()`. Suponha que você gere um valor `AUTO_INCREMENT` com uma declaração e, em seguida, faça referência a `LAST_INSERT_ID()` em uma declaração `INSERT` de múltiplas linhas que insere linhas em uma tabela com sua própria coluna `AUTO_INCREMENT`. O valor de `LAST_INSERT_ID()` permanece estável na segunda declaração; seu valor para as segunda e linhas subsequentes não é afetado pelas inserções de linhas anteriores. (Você deve estar ciente de que, se você misturar referências a `LAST_INSERT_ID()` e `LAST_INSERT_ID(expr)`, o efeito é indefinido.)

Se a declaração anterior retornou um erro, o valor de `LAST_INSERT_ID()` é indefinido. Para tabelas transacionais, se a declaração for revertida devido a um erro, o valor de `LAST_INSERT_ID()` é deixado indefinido. Para `ROLLBACK` manual, o valor de `LAST_INSERT_ID()` não é restaurado para o anterior à transação; ele permanece como estava no ponto do `ROLLBACK`.

Dentro do corpo de uma rotina armazenada (procedimento ou função) ou um gatilho, o valor de `LAST_INSERT_ID()` muda da mesma maneira que para declarações executadas fora do corpo desses tipos de objetos. O efeito de uma rotina armazenada ou gatilho sobre o valor de `LAST_INSERT_ID()` que é visto seguindo declarações depende do tipo de rotina:

+ Se um procedimento armazenado executa declarações que alteram o valor de `LAST_INSERT_ID()`, o valor alterado é visto por declarações que seguem a chamada do procedimento.
+ Para funções armazenadas e gatilhos que alteram o valor, o valor é restaurado quando a função ou gatilho termina, então declarações que vêm depois dele não veem um valor alterado.

O ID gerado é mantido no servidor em uma base *por conexão*. Isso significa que o valor retornado pela função a um cliente específico é o primeiro valor `AUTO_INCREMENT` gerado para a declaração mais recente que afeta uma coluna `AUTO_INCREMENT` *por esse cliente*. Esse valor não pode ser afetado por outros clientes, mesmo que eles gerem valores `AUTO_INCREMENT` próprios. Esse comportamento garante que cada cliente possa recuperar seu próprio ID sem preocupação com a atividade de outros clientes, e sem a necessidade de bloqueios ou transações.

O valor de `LAST_INSERT_ID()` não é alterado se você definir a coluna `AUTO_INCREMENT` de uma linha para um valor não "mágico" (ou seja, um valor que não é `NULL` e não `0`).

Importante

Se você inserir várias linhas usando uma única instrução `INSERT`, `LAST_INSERT_ID()` retorna o valor gerado para a *primeira* linha inserida *apenas*. A razão para isso é permitir que seja facilmente reproduzida a mesma instrução `INSERT` em outro servidor.

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

Embora a segunda instrução `INSERT` tenha inserido três novas linhas em `t`, o ID gerado para a primeira dessas linhas foi `2`, e é esse valor que é retornado por `LAST_INSERT_ID()` para a instrução `SELECT` subsequente.

Se você usar `INSERT IGNORE` e a linha for ignorada, o `LAST_INSERT_ID()` permanece inalterado do valor atual (ou `0` é retornado se a conexão ainda não realizou uma `INSERT` bem-sucedida) e, para tabelas não transacionais, o contador `AUTO_INCREMENT` não é incrementado. Para tabelas `InnoDB`, o contador `AUTO_INCREMENT` é incrementado se `innodb_autoinc_lock_mode` for definido para `1` ou `2`, como demonstrado no exemplo seguinte:

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

Para mais informações, consulte a Seção 17.6.1.6, “Tratamento de `AUTO_INCREMENT` em InnoDB”.

Se *`expr`* for fornecido como argumento para `LAST_INSERT_ID()`, o valor do argumento é retornado pela função e é lembrado como o próximo valor a ser retornado por `LAST_INSERT_ID()`. Isso pode ser usado para simular sequências:

1. Crie uma tabela para armazenar o contador de sequência e inicie-a:

```
     mysql> CREATE TABLE sequence (id INT NOT NULL);
     mysql> INSERT INTO sequence VALUES (0);
     ```
2. Use a tabela para gerar números de sequência da seguinte forma:

```
     mysql> UPDATE sequence SET id=LAST_INSERT_ID(id+1);
     mysql> SELECT LAST_INSERT_ID();
     ```

A instrução `UPDATE` incrementa o contador de sequência e faz com que o próximo chamado para `LAST_INSERT_ID()` retorne o valor atualizado. A instrução `SELECT` recupera esse valor. A função C `mysql_insert_id()` também pode ser usada para obter o valor. Veja mysql\_insert\_id().

Você pode gerar sequências sem chamar `LAST_INSERT_ID()`, mas a utilidade de usar a função dessa maneira é que o valor do ID é mantido no servidor como o último valor gerado automaticamente. É seguro para múltiplos usuários porque vários clientes podem emitir a instrução `UPDATE` e obter seu próprio valor de sequência com a instrução `SELECT` (ou `mysql_insert_id()`), sem afetar ou ser afetado por outros clientes que geram seus próprios valores de sequência.

Note que `mysql_insert_id()` é atualizado apenas após as instruções `INSERT` e `UPDATE`, então você não pode usar a função C para recuperar o valor para `LAST_INSERT_ID(expr)` após executar outras instruções SQL como `SELECT` ou `SET`.
*  `ROLES_GRAPHML()`

  Retorna uma string `utf8mb3` contendo um documento GraphML que representa subgrafos de rolos de memória. O privilégio `ROLE_ADMIN` (ou o desatualizado privilégio `SUPER`) é necessário para ver o conteúdo no elemento `<graphml>`. Caso contrário, o resultado mostra apenas um elemento vazio:

  ```
  mysql> SELECT ROLES_GRAPHML();
  +---------------------------------------------------+
  | ROLES_GRAPHML()                                   |
  +---------------------------------------------------+
  | <?xml version="1.0" encoding="UTF-8"?><graphml /> |
  +---------------------------------------------------+
  ```
*  `ROW_COUNT()`

  `ROW_COUNT()` retorna um valor da seguinte forma:

+ Declarações DDL: 0. Isso se aplica a declarações como `CREATE TABLE` ou `DROP TABLE`.
+ Declarações DML, exceto `SELECT`: O número de linhas afetadas. Isso se aplica a declarações como `UPDATE`, `INSERT` ou `DELETE` (como antes), mas agora também a declarações como `ALTER TABLE` e `LOAD DATA`.
+ `SELECT`: -1 se a declaração retornar um conjunto de resultados, ou o número de linhas "afetadas" se não retornar. Por exemplo, para `SELECT * FROM t1`, `ROW_COUNT()` retorna -1. Para `SELECT * FROM t1 INTO OUTFILE 'nome_arquivo'`, `ROW_COUNT()` retorna o número de linhas escritas no arquivo.
+ Declarações `SIGNAL`: 0.

Para declarações `UPDATE`, o valor de linhas afetadas por padrão é o número de linhas realmente alteradas. Se você especificar o sinalizador `CLIENT_FOUND_ROWS` para `mysql_real_connect()` ao se conectar ao `mysqld`, o valor de linhas afetadas é o número de linhas "encontradas"; ou seja, correspondidas pela cláusula `WHERE`.

Para declarações `REPLACE`, o valor de linhas afetadas é 2 se a nova linha substituir uma linha antiga, porque, neste caso, uma linha foi inserida após a duplicata ser excluída.

Para declarações `INSERT ... ON DUPLICATE KEY UPDATE`, o valor de linhas afetadas por linha é 1 se a linha for inserida como uma nova linha, 2 se uma linha existente for atualizada e 0 se uma linha existente for definida com seus valores atuais. Se você especificar o sinalizador `CLIENT_FOUND_ROWS`, o valor de linhas afetadas é 1 (não 0) se uma linha existente for definida com seus valores atuais.

O valor de `ROW_COUNT()` é semelhante ao valor da função C API `mysql_affected_rows()` e ao número de linhas que o cliente `mysql` exibe após a execução da declaração.

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

`ROW_COUNT()` não é replicada de forma confiável usando a replicação baseada em declarações. Esta função é replicada automaticamente usando a replicação baseada em linhas.
* `SCHEMA()`

Esta função é sinônima de `DATABASE()`.
* `SESSION_USER()`

`SESSION_USER()` é sinônimo de `USER()`.

Assim como `USER()`, essa função pode ser usada para o valor padrão de uma coluna `VARCHAR` ou `TEXT`, conforme mostrado na seguinte instrução `CREATE TABLE`:

```
  CREATE TABLE t (c VARCHAR(288) DEFAULT (SESSION_USER()));
  ```

`SYSTEM_USER()` é um sinônimo de `USER()`.

::: info Nota

A função `SYSTEM_USER()` é distinta do privilégio `SYSTEM_USER`. A primeira retorna o nome da conta MySQL atual. A segunda distingue as categorias de contas de usuário do sistema e do usuário comum (consulte a Seção 8.2.11, “Categorias de Conta”).

:::

Assim como `USER()`, essa função pode ser usada para o valor padrão de uma coluna `VARCHAR` ou `TEXT`, conforme mostrado na seguinte instrução `CREATE TABLE`:

```
  CREATE TABLE t (c VARCHAR(288) DEFAULT (SYSTEM_USER()));
  ```

Retorna o nome do usuário MySQL atual e o nome do host como uma string no conjunto de caracteres `utf8mb3`.

```
  mysql> SELECT USER();
          -> 'davida@localhost'
  ```

O valor indica o nome do usuário que você especificou ao se conectar ao servidor e o host do cliente a partir do qual você se conectou. O valor pode ser diferente do de `CURRENT_USER()`.

Essa função pode ser usada para o valor padrão de uma coluna `VARCHAR` ou `TEXT`, conforme mostrado na seguinte instrução `CREATE TABLE`:

```
  CREATE TABLE t (c VARCHAR(288) DEFAULT (USER()));
  ```

Retorna uma string que indica a versão do servidor MySQL. A string usa o conjunto de caracteres `utf8mb3`. O valor pode ter um sufixo além do número da versão. Consulte a descrição da variável de sistema `version` na Seção 7.1.8, “Variáveis de Sistema do Servidor”.

Essa função não é segura para a replicação baseada em instruções. Uma mensagem de aviso é registrada se você usar essa função quando `binlog_format` estiver definido como `STATEMENT`.

```DCBPKPCF4l