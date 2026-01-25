## 12.15 Funções de Informação

**Tabela 12.20 Funções de Informação**

<table frame="box" rules="all" summary="Uma referência que lista funções de informação."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>BENCHMARK()</code></td> <td> Executa uma expressão repetidamente </td> </tr><tr><td><code>CHARSET()</code></td> <td> Retorna o Character Set do argumento </td> </tr><tr><td><code>COERCIBILITY()</code></td> <td> Retorna o valor de coerção de Collation do argumento String </td> </tr><tr><td><code>COLLATION()</code></td> <td> Retorna o Collation do argumento String </td> </tr><tr><td><code>CONNECTION_ID()</code></td> <td> Retorna o ID da Connection (Thread ID) para a conexão </td> </tr><tr><td><code>CURRENT_USER()</code>, <code>CURRENT_USER</code></td> <td> O nome de usuário autenticado e o nome do host </td> </tr><tr><td><code>DATABASE()</code></td> <td> Retorna o nome do Database padrão (atual) </td> </tr><tr><td><code>FOUND_ROWS()</code></td> <td> Para um SELECT com uma cláusula LIMIT, o número de linhas que seriam retornadas se não houvesse a cláusula LIMIT </td> </tr><tr><td><code>LAST_INSERT_ID()</code></td> <td> Valor da coluna AUTO_INCREMENT para o último INSERT </td> </tr><tr><td><code>ROW_COUNT()</code></td> <td> O número de linhas atualizadas </td> </tr><tr><td><code>SCHEMA()</code></td> <td> Sinônimo para DATABASE() </td> </tr><tr><td><code>SESSION_USER()</code></td> <td> Sinônimo para USER() </td> </tr><tr><td><code>SYSTEM_USER()</code></td> <td> Sinônimo para USER() </td> </tr><tr><td><code>USER()</code></td> <td> O nome de usuário e o nome do host fornecidos pelo client </td> </tr><tr><td><code>VERSION()</code></td> <td> Retorna uma String que indica a versão do MySQL Server </td> </tr></tbody></table>

* `BENCHMARK(count,expr)`

  A função `BENCHMARK()` executa a expressão *`expr`* repetidamente *`count`* vezes. Ela pode ser usada para medir a rapidez com que o MySQL processa a expressão. O valor do resultado é `0`, ou `NULL` para argumentos inapropriados, como uma contagem de repetição `NULL` ou negativa.

  O uso pretendido é a partir do client **mysql**, que relata os tempos de execução da Query:

  ```sql
  mysql> SELECT BENCHMARK(1000000,AES_ENCRYPT('hello','goodbye'));
  +---------------------------------------------------+
  | BENCHMARK(1000000,AES_ENCRYPT('hello','goodbye')) |
  +---------------------------------------------------+
  |                                                 0 |
  +---------------------------------------------------+
  1 row in set (4.74 sec)
  ```

  O tempo relatado é o tempo decorrido na ponta do client, e não o tempo de CPU na ponta do server. É aconselhável executar `BENCHMARK()` várias vezes e interpretar o resultado em relação à carga de trabalho do server.

  `BENCHMARK()` é destinada a medir o desempenho de runtime de expressões escalares, o que tem implicações significativas para a maneira como você a utiliza e interpreta os resultados:

  + Apenas expressões escalares podem ser usadas. Embora a expressão possa ser uma Subquery, ela deve retornar uma única coluna e, no máximo, uma única linha. Por exemplo, `BENCHMARK(10, (SELECT * FROM t))` falhará se a tabela `t` tiver mais de uma coluna ou mais de uma linha.

  + Executar uma instrução `SELECT expr` *`N`* vezes difere de executar `SELECT BENCHMARK(N, expr)` em termos da quantidade de overhead envolvida. Os dois têm perfis de execução muito diferentes e você não deve esperar que demorem o mesmo tempo. O primeiro envolve o parser, optimizer, Lock de tabela e avaliação de runtime *`N`* vezes cada. O último envolve apenas a avaliação de runtime *`N`* vezes, e todos os outros componentes apenas uma vez. As estruturas de memória já alocadas são reutilizadas e otimizações de runtime, como o caching local de resultados já avaliados para funções de agregação, podem alterar os resultados. O uso de `BENCHMARK()` mede, portanto, o desempenho do componente de runtime, dando mais peso a esse componente e removendo o "ruído" introduzido pela rede, parser, optimizer, e assim por diante.

* `CHARSET(str)`

  Retorna o Character Set do argumento String.

  ```sql
  mysql> SELECT CHARSET('abc');
          -> 'latin1'
  mysql> SELECT CHARSET(CONVERT('abc' USING utf8));
          -> 'utf8'
  mysql> SELECT CHARSET(USER());
          -> 'utf8'
  ```

* `COERCIBILITY(str)`

  Retorna o valor de coerção de Collation do argumento String.

  ```sql
  mysql> SELECT COERCIBILITY('abc' COLLATE latin1_swedish_ci);
          -> 0
  mysql> SELECT COERCIBILITY(USER());
          -> 3
  mysql> SELECT COERCIBILITY('abc');
          -> 4
  mysql> SELECT COERCIBILITY(1000);
          -> 5
  ```

  Os valores de retorno têm os significados mostrados na tabela a seguir. Valores menores têm maior precedência.

  <table summary="Valores de retorno de coerção de Collation, o significado de cada valor e um exemplo de cada."><col style="width: 15%"/><col style="width: 15%"/><col style="width: 70%"/><thead><tr> <th>Coercibilidade</th> <th>Significado</th> <th>Exemplo</th> </tr></thead><tbody><tr> <th><code>0</code></th> <td>Collation Explícita</td> <td>Valor com cláusula <code>COLLATE</code></td> </tr><tr> <th><code>1</code></th> <td>Sem Collation</td> <td>Concatenação de Strings com diferentes Collations</td> </tr><tr> <th><code>2</code></th> <td>Collation Implícita</td> <td>Valor de coluna, parâmetro de Stored Routine ou variável local</td> </tr><tr> <th><code>3</code></th> <td>Constante do Sistema</td> <td>Valor de retorno de <code>USER()</code></td> </tr><tr> <th><code>4</code></th> <td>Coercível</td> <td>Literal String</td> </tr><tr> <th><code>5</code></th> <td>Numérico</td> <td>Valor Numérico ou temporal</td> </tr><tr> <th><code>6</code></th> <td>Ignorável</td> <td><code>NULL</code> ou uma expressão derivada de <code>NULL</code></td> </tr></tbody></table>

  Para mais informações, consulte a Seção 10.8.4, “Coercibilidade de Collation em Expressões”.

* `COLLATION(str)`

  Retorna o Collation do argumento String.

  ```sql
  mysql> SELECT COLLATION('abc');
          -> 'latin1_swedish_ci'
  mysql> SELECT COLLATION(_utf8'abc');
          -> 'utf8_general_ci'
  ```

* `CONNECTION_ID()`

  Retorna o ID da Connection (Thread ID) para a conexão. Cada conexão tem um ID que é exclusivo entre o conjunto de clients conectados atualmente.

  O valor retornado por `CONNECTION_ID()` é do mesmo tipo de valor exibido na coluna `ID` da tabela `PROCESSLIST` do Information Schema, na coluna `Id` da saída `SHOW PROCESSLIST` e na coluna `PROCESSLIST_ID` da tabela `threads` do Performance Schema.

  ```sql
  mysql> SELECT CONNECTION_ID();
          -> 23786
  ```

  Aviso

  Alterar o valor de sessão da variável de sistema `pseudo_thread_id` altera o valor retornado pela função `CONNECTION_ID()`.

* `CURRENT_USER`, `CURRENT_USER()`

  Retorna a combinação de nome de usuário e nome de host para a conta MySQL que o server usou para autenticar o client atual. Essa conta determina seus privilégios de acesso. O valor de retorno é uma String no Character Set `utf8`.

  O valor de `CURRENT_USER()` pode diferir do valor de `USER()`.

  ```sql
  mysql> SELECT USER();
          -> 'davida@localhost'
  mysql> SELECT * FROM mysql.user;
  ERROR 1044: Access denied for user ''@'localhost' to
  database 'mysql'
  mysql> SELECT CURRENT_USER();
          -> '@localhost'
  ```

  O exemplo ilustra que, embora o client tenha especificado um nome de usuário `davida` (conforme indicado pelo valor da função `USER()`), o server autenticou o client usando uma conta de usuário anônima (como visto pela parte vazia do nome de usuário do valor `CURRENT_USER()`). Uma maneira pela qual isso pode ocorrer é que não haja nenhuma conta listada nas grant tables para `davida`.

  Dentro de um Stored Program ou View, `CURRENT_USER()` retorna a conta para o usuário que definiu o objeto (conforme fornecido por seu valor `DEFINER`), a menos que definido com a característica `SQL SECURITY INVOKER`. Neste último caso, `CURRENT_USER()` retorna o invoker do objeto.

  Triggers e Events não têm opção para definir a característica `SQL SECURITY`, portanto, para esses objetos, `CURRENT_USER()` retorna a conta para o usuário que definiu o objeto. Para retornar o invoker, use `USER()` ou `SESSION_USER()`.

  As seguintes instruções suportam o uso da função `CURRENT_USER()` para substituir o nome (e, possivelmente, um host) de um usuário afetado ou um definer; nesses casos, `CURRENT_USER()` é expandido onde e conforme necessário:

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

  Para obter informações sobre as implicações que essa expansão de `CURRENT_USER()` tem para a Replication, consulte a Seção 16.4.1.8, “Replicação de CURRENT_USER()”").

* `DATABASE()`

  Retorna o nome do Database padrão (atual) como uma String no Character Set `utf8`. Se não houver um Database padrão, `DATABASE()` retornará `NULL`. Dentro de uma Stored Routine, o Database padrão é o Database ao qual a rotina está associada, o que não é necessariamente o mesmo que o Database que é o padrão no contexto de chamada.

  ```sql
  mysql> SELECT DATABASE();
          -> 'test'
  ```

  Se não houver Database padrão, `DATABASE()` retorna `NULL`.

* `FOUND_ROWS()`

  Uma instrução `SELECT` pode incluir uma cláusula `LIMIT` para restringir o número de linhas que o server retorna ao client. Em alguns casos, é desejável saber quantas linhas a instrução teria retornado sem o `LIMIT`, mas sem executar a instrução novamente. Para obter esta contagem de linhas (row count), inclua uma opção `SQL_CALC_FOUND_ROWS` na instrução `SELECT` e, em seguida, invoque `FOUND_ROWS()`:

  ```sql
  mysql> SELECT SQL_CALC_FOUND_ROWS * FROM tbl_name
      -> WHERE id > 100 LIMIT 10;
  mysql> SELECT FOUND_ROWS();
  ```

  O segundo `SELECT` retorna um número que indica quantas linhas o primeiro `SELECT` teria retornado se tivesse sido escrito sem a cláusula `LIMIT`.

  Na ausência da opção `SQL_CALC_FOUND_ROWS` na instrução `SELECT` mais recente e bem-sucedida, `FOUND_ROWS()` retorna o número de linhas no Result Set retornado por essa instrução. Se a instrução incluir uma cláusula `LIMIT`, `FOUND_ROWS()` retornará o número de linhas até o limite. Por exemplo, `FOUND_ROWS()` retorna 10 ou 60, respectivamente, se a instrução incluir `LIMIT 10` ou `LIMIT 50, 10`.

  O row count disponível através de `FOUND_ROWS()` é transitório e não se destina a estar disponível após a instrução que se segue à instrução `SELECT SQL_CALC_FOUND_ROWS`. Se você precisar se referir ao valor mais tarde, salve-o:

  ```sql
  mysql> SELECT SQL_CALC_FOUND_ROWS * FROM ... ;
  mysql> SET @rows = FOUND_ROWS();
  ```

  Se você estiver usando `SELECT SQL_CALC_FOUND_ROWS`, o MySQL deve calcular quantas linhas existem no Result Set completo. No entanto, isso é mais rápido do que executar a Query novamente sem `LIMIT`, porque o Result Set não precisa ser enviado ao client.

  `SQL_CALC_FOUND_ROWS` e `FOUND_ROWS()` podem ser úteis em situações em que você deseja restringir o número de linhas que uma Query retorna, mas também determinar o número de linhas no Result Set completo sem executar a Query novamente. Um exemplo é um script Web que apresenta uma exibição paginada contendo Links para as páginas que mostram outras seções de um resultado de pesquisa. O uso de `FOUND_ROWS()` permite determinar quantas outras páginas são necessárias para o restante do resultado.

  O uso de `SQL_CALC_FOUND_ROWS` e `FOUND_ROWS()` é mais complexo para instruções `UNION` do que para instruções `SELECT` simples, porque `LIMIT` pode ocorrer em vários locais em um `UNION`. Ele pode ser aplicado a instruções `SELECT` individuais no `UNION`, ou global ao resultado `UNION` como um todo.

  A intenção de `SQL_CALC_FOUND_ROWS` para `UNION` é que ele retorne o row count que seria retornado sem um `LIMIT` global. As condições para o uso de `SQL_CALC_FOUND_ROWS` com `UNION` são:

  + A palavra-chave `SQL_CALC_FOUND_ROWS` deve aparecer no primeiro `SELECT` do `UNION`.

  + O valor de `FOUND_ROWS()` é exato apenas se `UNION ALL` for usado. Se `UNION` sem `ALL` for usado, a remoção de duplicatas ocorre e o valor de `FOUND_ROWS()` é apenas aproximado.

  + Se nenhum `LIMIT` estiver presente no `UNION`, `SQL_CALC_FOUND_ROWS` será ignorado e retornará o número de linhas na tabela temporária que é criada para processar o `UNION`.

  Além dos casos descritos aqui, o comportamento de `FOUND_ROWS()` é indefinido (por exemplo, seu valor após uma instrução `SELECT` que falha com um erro).

  Importante

  `FOUND_ROWS()` não é replicado de forma confiável usando statement-based replication. Esta função é replicada automaticamente usando row-based replication.

* `LAST_INSERT_ID()`, `LAST_INSERT_ID(expr)`

  Sem argumento, `LAST_INSERT_ID()` retorna um valor `BIGINT UNSIGNED` (64 bits) representando o primeiro valor gerado automaticamente inserido com sucesso para uma coluna `AUTO_INCREMENT` como resultado da instrução `INSERT` executada mais recentemente. O valor de `LAST_INSERT_ID()` permanece inalterado se nenhuma linha for inserida com sucesso.

  Com um argumento, `LAST_INSERT_ID()` retorna um inteiro não assinado (unsigned integer).

  Por exemplo, após inserir uma linha que gera um valor `AUTO_INCREMENT`, você pode obter o valor assim:

  ```sql
  mysql> SELECT LAST_INSERT_ID();
          -> 195
  ```

  A instrução em execução atual não afeta o valor de `LAST_INSERT_ID()`. Suponha que você gere um valor `AUTO_INCREMENT` com uma instrução e, em seguida, se refira a `LAST_INSERT_ID()` em uma instrução `INSERT` de múltiplas linhas que insere linhas em uma tabela com sua própria coluna `AUTO_INCREMENT`. O valor de `LAST_INSERT_ID()` permanece estável na segunda instrução; seu valor para a segunda e as linhas posteriores não é afetado pelas inserções de linhas anteriores. (No entanto, se você misturar referências a `LAST_INSERT_ID()` e `LAST_INSERT_ID(expr)`, o efeito é indefinido.)

  Se a instrução anterior retornou um erro, o valor de `LAST_INSERT_ID()` é indefinido. Para tabelas transacionais, se a instrução for revertida (rolled back) devido a um erro, o valor de `LAST_INSERT_ID()` fica indefinido. Para `ROLLBACK` manual, o valor de `LAST_INSERT_ID()` não é restaurado para o que estava antes da Transaction; ele permanece como estava no ponto do `ROLLBACK`.

  Dentro do corpo de uma Stored Routine (Procedure ou Function) ou um Trigger, o valor de `LAST_INSERT_ID()` muda da mesma forma que para instruções executadas fora do corpo desses tipos de objetos. O efeito de uma Stored Routine ou Trigger sobre o valor de `LAST_INSERT_ID()` que é visto pelas instruções seguintes depende do tipo de rotina:

  + Se um Stored Procedure executa instruções que alteram o valor de `LAST_INSERT_ID()`, o valor alterado é visto pelas instruções que seguem a chamada da Procedure.

  + Para Stored Functions e Triggers que alteram o valor, o valor é restaurado quando a função ou Trigger termina, de modo que as instruções que os seguem não veem um valor alterado.

  O ID que foi gerado é mantido no server em uma base *por conexão (per-connection basis)*. Isso significa que o valor retornado pela função para um determinado client é o primeiro valor `AUTO_INCREMENT` gerado para a instrução mais recente que afeta uma coluna `AUTO_INCREMENT` *por esse client*. Esse valor não pode ser afetado por outros clients, mesmo que gerem seus próprios valores `AUTO_INCREMENT`. Esse comportamento garante que cada client possa recuperar seu próprio ID sem se preocupar com a atividade de outros clients e sem a necessidade de Locks ou Transactions.

  O valor de `LAST_INSERT_ID()` não é alterado se você definir a coluna `AUTO_INCREMENT` de uma linha para um valor não-“mágico” (ou seja, um valor que não é `NULL` e nem `0`).

  Importante

  Se você inserir várias linhas usando uma única instrução `INSERT`, `LAST_INSERT_ID()` retorna o valor gerado para a *primeira* linha inserida *apenas*. A razão para isso é tornar possível reproduzir facilmente a mesma instrução `INSERT` contra algum outro server.

  Por exemplo:

  ```sql
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

  Se você usar `INSERT IGNORE` e a linha for ignorada, `LAST_INSERT_ID()` permanece inalterado em relação ao valor atual (ou 0 é retornado se a conexão ainda não tiver executado um `INSERT` bem-sucedido) e, para tabelas não transacionais, o contador `AUTO_INCREMENT` não é incrementado. Para tabelas `InnoDB`, o contador `AUTO_INCREMENT` é incrementado se `innodb_autoinc_lock_mode` estiver definido como `1` ou `2`, conforme demonstrado no exemplo a seguir:

  ```sql
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
         ) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
  ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1

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
  ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1

  # The LAST_INSERT_ID is unchanged because the previous insert was unsuccessful

  mysql> SELECT LAST_INSERT_ID();
  +------------------+
  | LAST_INSERT_ID() |
  +------------------+
  |                1 |
  +------------------+
  ```

  Para obter mais informações, consulte a Seção 14.6.1.6, “Tratamento de AUTO_INCREMENT no InnoDB”.

  Se *`expr`* for fornecido como um argumento para `LAST_INSERT_ID()`, o valor do argumento é retornado pela função e é lembrado como o próximo valor a ser retornado por `LAST_INSERT_ID()`. Isso pode ser usado para simular Sequences:

  1. Crie uma tabela para manter o contador da Sequence e inicialize-o:

     ```sql
     mysql> CREATE TABLE sequence (id INT NOT NULL);
     mysql> INSERT INTO sequence VALUES (0);
     ```

  2. Use a tabela para gerar números de Sequence assim:

     ```sql
     mysql> UPDATE sequence SET id=LAST_INSERT_ID(id+1);
     mysql> SELECT LAST_INSERT_ID();
     ```

     A instrução `UPDATE` incrementa o contador da Sequence e faz com que a próxima chamada para `LAST_INSERT_ID()` retorne o valor atualizado. A instrução `SELECT` recupera esse valor. A função C API `mysql_insert_id()` também pode ser usada para obter o valor. Consulte mysql_insert_id().

  Você pode gerar Sequences sem chamar `LAST_INSERT_ID()`, mas a utilidade de usar a função dessa forma é que o valor do ID é mantido no server como o último valor gerado automaticamente. É seguro para multiusuários porque vários clients podem emitir a instrução `UPDATE` e obter seu próprio valor de Sequence com a instrução `SELECT` (ou `mysql_insert_id()`), sem afetar ou serem afetados por outros clients que geram seus próprios valores de Sequence.

  Observe que `mysql_insert_id()` é atualizado apenas após instruções `INSERT` e `UPDATE`, portanto, você não pode usar a função C API para recuperar o valor de `LAST_INSERT_ID(expr)` após executar outras instruções SQL como `SELECT` ou `SET`.

* `ROW_COUNT()`

  `ROW_COUNT()` retorna um valor da seguinte forma:

  + Instruções DDL: 0. Isso se aplica a instruções como `CREATE TABLE` ou `DROP TABLE`.

  + Instruções DML diferentes de `SELECT`: O número de linhas afetadas. Isso se aplica a instruções como `UPDATE`, `INSERT` ou `DELETE` (como antes), mas agora também a instruções como `ALTER TABLE` e `LOAD DATA`.

  + `SELECT`: -1 se a instrução retornar um Result Set, ou o número de linhas “afetadas” se não retornar. Por exemplo, para `SELECT * FROM t1`, `ROW_COUNT()` retorna -1. Para `SELECT * FROM t1 INTO OUTFILE 'file_name'`, `ROW_COUNT()` retorna o número de linhas gravadas no arquivo.

  + Instruções `SIGNAL`: 0.

  Para instruções `UPDATE`, o valor de linhas afetadas, por padrão, é o número de linhas realmente alteradas. Se você especificar o flag `CLIENT_FOUND_ROWS` para `mysql_real_connect()` ao se conectar ao **mysqld**, o valor de linhas afetadas é o número de linhas “encontradas”; ou seja, correspondidas pela cláusula `WHERE`.

  Para instruções `REPLACE`, o valor de linhas afetadas é 2 se a nova linha substituiu uma linha antiga, porque neste caso, uma linha foi inserida após a duplicação ser excluída.

  Para instruções `INSERT ... ON DUPLICATE KEY UPDATE`, o valor de linhas afetadas por linha é 1 se a linha for inserida como uma nova linha, 2 se uma linha existente for atualizada e 0 se uma linha existente for definida para seus valores atuais. Se você especificar o flag `CLIENT_FOUND_ROWS`, o valor de linhas afetadas é 1 (não 0) se uma linha existente for definida para seus valores atuais.

  O valor `ROW_COUNT()` é semelhante ao valor da função C API `mysql_affected_rows()` e ao row count que o client **mysql** exibe após a execução da instrução.

  ```sql
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

  `ROW_COUNT()` não é replicado de forma confiável usando statement-based replication. Esta função é replicada automaticamente usando row-based replication.

* `SCHEMA()`

  Esta função é um sinônimo para `DATABASE()`.

* `SESSION_USER()`

  `SESSION_USER()` é um sinônimo para `USER()`.

* `SYSTEM_USER()`

  `SYSTEM_USER()` é um sinônimo para `USER()`.

* `USER()`

  Retorna o nome de usuário e o nome do host atuais do MySQL como uma String no Character Set `utf8`.

  ```sql
  mysql> SELECT USER();
          -> 'davida@localhost'
  ```

  O valor indica o nome de usuário que você especificou ao se conectar ao server e o host do client do qual você se conectou. O valor pode ser diferente do de `CURRENT_USER()`.

* `VERSION()`

  Retorna uma String que indica a versão do MySQL Server. A String usa o Character Set `utf8`. O valor pode ter um sufixo além do número da versão. Consulte a descrição da variável de sistema `version` na Seção 5.1.7, “Variáveis de Sistema do Servidor”.

  Esta função não é segura para statement-based replication. Um aviso é registrado se você usar esta função quando `binlog_format` estiver definido como `STATEMENT`.

  ```sql
  mysql> SELECT VERSION();
          -> '5.7.44-standard'
  ```