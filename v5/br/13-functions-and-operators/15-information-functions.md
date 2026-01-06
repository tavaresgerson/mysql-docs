## 12.15 Funções de Informação

**Tabela 12.20 Funções de Informação**

<table frame="box" rules="all" summary="Uma referência que lista as funções de informação."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Nome</th> <th>Descrição</th> </tr></thead><tbody><tr><td><a class="link" href="information-functions.html#function_benchmark">[[PH_HTML_CODE_<code class="literal">ROW_COUNT()</code>]</a></td> <td>Execute repetidamente uma expressão</td> </tr><tr><td><a class="link" href="information-functions.html#function_charset">[[PH_HTML_CODE_<code class="literal">ROW_COUNT()</code>]</a></td> <td>Retorne o conjunto de caracteres do argumento</td> </tr><tr><td><a class="link" href="information-functions.html#function_coercibility">[[PH_HTML_CODE_<code class="literal">SESSION_USER()</code>]</a></td> <td>Retorne o valor de coercibilidade de ordenação do argumento string</td> </tr><tr><td><a class="link" href="information-functions.html#function_collation">[[PH_HTML_CODE_<code class="literal">SYSTEM_USER()</code>]</a></td> <td>Retorne a ordenação do argumento de string</td> </tr><tr><td><a class="link" href="information-functions.html#function_connection-id">[[PH_HTML_CODE_<code class="literal">USER()</code>]</a></td> <td>Retorne o ID de conexão (ID de thread) para a conexão</td> </tr><tr><td><a class="link" href="information-functions.html#function_current-user">[[PH_HTML_CODE_<code class="literal">VERSION()</code>], [[<code class="literal">CURRENT_USER</code>]]</a></td> <td>O nome do usuário autenticado e o nome do host</td> </tr><tr><td><a class="link" href="information-functions.html#function_database">[[<code class="literal">DATABASE()</code>]]</a></td> <td>Retorne o nome do banco de dados padrão (atual)</td> </tr><tr><td><a class="link" href="information-functions.html#function_found-rows">[[<code class="literal">FOUND_ROWS()</code>]]</a></td> <td>Para uma consulta SELECT com uma cláusula LIMIT, o número de linhas que seriam retornadas se não houvesse a cláusula LIMIT</td> </tr><tr><td><a class="link" href="information-functions.html#function_last-insert-id">[[<code class="literal">LAST_INSERT_ID()</code>]]</a></td> <td>Valor da coluna AUTOINCREMENT para a última inserção</td> </tr><tr><td><a class="link" href="information-functions.html#function_row-count">[[<code class="literal">ROW_COUNT()</code>]]</a></td> <td>O número de linhas atualizadas</td> </tr><tr><td><a class="link" href="information-functions.html#function_schema">[[<code class="literal">CHARSET()</code><code class="literal">ROW_COUNT()</code>]</a></td> <td>Sinônimo de DATABASE()</td> </tr><tr><td><a class="link" href="information-functions.html#function_session-user">[[<code class="literal">SESSION_USER()</code>]]</a></td> <td>Sinônimo de USER()</td> </tr><tr><td><a class="link" href="information-functions.html#function_system-user">[[<code class="literal">SYSTEM_USER()</code>]]</a></td> <td>Sinônimo de USER()</td> </tr><tr><td><a class="link" href="information-functions.html#function_user">[[<code class="literal">USER()</code>]]</a></td> <td>O nome de usuário e o nome do host fornecidos pelo cliente</td> </tr><tr><td><a class="link" href="information-functions.html#function_version">[[<code class="literal">VERSION()</code>]]</a></td> <td>Retorne uma string que indique a versão do servidor MySQL</td> </tr></tbody></table>

- `BENCHMARK(contagem, expr)`

  A função `BENCHMARK()` executa a expressão *`expr`* repetidamente *`count`* vezes. Ela pode ser usada para medir o tempo que o MySQL leva para processar a expressão. O valor de resultado é `0`, ou `NULL` para argumentos inadequados, como um `NULL` ou um número de repetições negativo.

  O uso pretendido é a partir do cliente **mysql**, que relata os tempos de execução das consultas:

  ```sql
  mysql> SELECT BENCHMARK(1000000,AES_ENCRYPT('hello','goodbye'));
  +---------------------------------------------------+
  | BENCHMARK(1000000,AES_ENCRYPT('hello','goodbye')) |
  +---------------------------------------------------+
  |                                                 0 |
  +---------------------------------------------------+
  1 row in set (4.74 sec)
  ```

  O tempo relatado é o tempo gasto no cliente, não o tempo da CPU no servidor. É aconselhável executar o `BENCHMARK()` várias vezes e interpretar o resultado com base na carga pesada da máquina do servidor.

  O `BENCHMARK()` é destinado a medir o desempenho de execução de expressões escalares, o que tem algumas implicações significativas sobre a forma como você o usa e interpreta os resultados:

  - Apenas expressões escalares podem ser usadas. Embora a expressão possa ser uma subconsulta, ela deve retornar uma única coluna e, no máximo, uma única linha. Por exemplo, `BENCHMARK(10, (SELECT * FROM t))` falha se a tabela `t` tiver mais de uma coluna ou mais de uma linha.

  - Executar uma instrução `SELECT expr` *`N`* vezes difere da execução de `SELECT BENCHMARK(N, expr)` em termos da quantidade de overhead envolvida. Os dois têm perfis de execução muito diferentes e você não deve esperar que eles levem o mesmo tempo. O primeiro envolve o analisador, otimizador, bloqueio de tabela e avaliação dinâmica *`N`* vezes cada. O segundo envolve apenas a avaliação dinâmica *`N`* vezes, e todos os outros componentes apenas uma vez. As estruturas de memória já alocadas são reutilizadas, e otimizações dinâmicas, como o cache local de resultados já avaliados para funções agregadas, podem alterar os resultados. O uso de `BENCHMARK()` mede, portanto, o desempenho do componente dinâmico, dando mais peso a esse componente e removendo o "ruído" introduzido pela rede, analisador, otimizador e assim por diante.

- `CHARSET(str)`

  Retorna o conjunto de caracteres da string de argumento.

  ```sql
  mysql> SELECT CHARSET('abc');
          -> 'latin1'
  mysql> SELECT CHARSET(CONVERT('abc' USING utf8));
          -> 'utf8'
  mysql> SELECT CHARSET(USER());
          -> 'utf8'
  ```

- `COERCIBILITY(str)`

  Retorna o valor de coercibilidade de ordenação da string.

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

  Os valores de retorno têm os significados mostrados na tabela a seguir. Valores menores têm precedência maior.

  <table summary="Valores de retorno da coercibilidade da collation, o significado de cada valor e um exemplo de cada um."><col style="width: 15%"/><col style="width: 15%"/><col style="width: 70%"/><thead><tr> <th scope="col">Coercibilidade</th> <th scope="col">Significado</th> <th scope="col">Exemplo</th> </tr></thead><tbody><tr> <th scope="row">[[PH_HTML_CODE_<code class="literal">NULL</code>]</th> <td>Ordenação explícita</td> <td>Valor com cláusula [[PH_HTML_CODE_<code class="literal">NULL</code>]</td> </tr><tr> <th scope="row">[[<code class="literal">1</code>]]</th> <td>Sem classificação</td> <td>Concatenação de cadeias de caracteres com diferentes codificações</td> </tr><tr> <th scope="row">[[<code class="literal">2</code>]]</th> <td>Ordenação implícita</td> <td>Valor da coluna, parâmetro de rotina armazenado ou variável local</td> </tr><tr> <th scope="row">[[<code class="literal">3</code>]]</th> <td>Sistema constante</td> <td><a class="link" href="information-functions.html#function_user">[[<code class="literal">USER()</code>]]</a>valor de retorno</td> </tr><tr> <th scope="row">[[<code class="literal">4</code>]]</th> <td>Coercível</td> <td>String literal</td> </tr><tr> <th scope="row">[[<code class="literal">5</code>]]</th> <td>Numérico</td> <td>Valor numérico ou temporal</td> </tr><tr> <th scope="row">[[<code class="literal">6</code>]]</th> <td>Ignorável</td> <td>[[<code class="literal">NULL</code>]] ou uma expressão derivada de [[<code class="literal">NULL</code>]]</td> </tr></tbody></table>

  Para mais informações, consulte a Seção 10.8.4, “Coercitividade da Collation em Expressões”.

- `COLLATE(str)`

  Retorna a ordenação da string de argumento.

  ```sql
  mysql> SELECT COLLATION('abc');
          -> 'latin1_swedish_ci'
  mysql> SELECT COLLATION(_utf8'abc');
          -> 'utf8_general_ci'
  ```

- `ID_CONEXÃO()`

  Retorna o ID de conexão (ID de thread) para a conexão. Cada conexão tem um ID que é único entre o conjunto de clientes conectados atualmente.

  O valor retornado por `CONNECTION_ID()` é do mesmo tipo de valor exibido na coluna `ID` da tabela `PROCESSLIST` do Schema de Informações, na coluna `Id` da saída `SHOW PROCESSLIST` e na coluna `PROCESSLIST_ID` da tabela `threads` do Schema de Desempenho.

  ```sql
  mysql> SELECT CONNECTION_ID();
          -> 23786
  ```

  Aviso

  Alterar o valor da variável de sistema `pseudo_thread_id` muda o valor retornado pela função `CONNECTION_ID()`.

- `USUARIO_CORRENTE`, `USUARIO_CORRENTE()`

  Retorna a combinação de nome de usuário e nome do host para a conta MySQL que o servidor usou para autenticar o cliente atual. Essa conta determina seus privilégios de acesso. O valor de retorno é uma string no conjunto de caracteres `utf8`.

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

  O exemplo ilustra que, embora o cliente tenha especificado um nome de usuário de `davida` (como indicado pelo valor da função `USER()`), o servidor autenticou o cliente usando uma conta de usuário anônima (como visto pela parte vazia do nome de usuário da função `CURRENT_USER()`). Uma maneira de isso ocorrer é que não há uma conta listada nas tabelas de concessão para `davida`.

  Dentro de um programa ou visual armazenado, `CURRENT_USER()` retorna a conta do usuário que definiu o objeto (conforme especificado pelo valor `DEFINER`), a menos que seja definido com a característica `SQL SECURITY INVOKER`. Nesse último caso, `CURRENT_USER()` retorna o invocador do objeto.

  Os gatilhos e eventos não têm a opção de definir a característica `SQL SECURITY`, então, para esses objetos, `CURRENT_USER()` retorna a conta do usuário que definiu o objeto. Para retornar o invocante, use `USER()` ou `SESSION_USER()`.

  As seguintes declarações apoiam o uso da função `CURRENT_USER()` para substituir o nome (e, possivelmente, o endereço de um host) de um usuário afetado ou de um definidor; nesses casos, `CURRENT_USER()` é expandido onde e como necessário:

  - `DROP USER`
  - `RENOMEAR USUÁRIO`
  - `CONCEDER`
  - REVOGAR
  - `CREATE FUNCTION`
  - `CREATE PROCEDURE`
  - `CREATE TRIGGER`
  - `Crie evento`
  - `CREATE VIEW`
  - `ALTERAR EVENTO`
  - `ALTER VIEW`
  - `DEFINIR SENHA`

  Para obter informações sobre as implicações dessa expansão do `CURRENT_USER()` para a replicação, consulte a Seção 16.4.1.8, “Replicação do CURRENT\_USER()”).

- `DATABASE()`

  Retorna o nome do banco de dados padrão (atual) como uma string no conjunto de caracteres `utf8`. Se não houver um banco de dados padrão, o `DATABASE()` retorna `NULL`. Dentro de uma rotina armazenada, o banco de dados padrão é o banco de dados com o qual a rotina está associada, o que nem sempre é o mesmo do banco de dados padrão no contexto de chamada.

  ```sql
  mysql> SELECT DATABASE();
          -> 'test'
  ```

  Se não houver um banco de dados padrão, o `DATABASE()` retorna `NULL`.

- `FOUND_ROWS()`

  Uma instrução `SELECT` pode incluir uma cláusula `LIMIT` para restringir o número de linhas que o servidor retorna ao cliente. Em alguns casos, é desejável saber quantas linhas a instrução teria retornado sem a cláusula `LIMIT`, mas sem executar a instrução novamente. Para obter esse número de linhas, inclua a opção `SQL_CALC_FOUND_ROWS` na instrução `SELECT` e, em seguida, invocando `FOUND_ROWS()` posteriormente:

  ```sql
  mysql> SELECT SQL_CALC_FOUND_ROWS * FROM tbl_name
      -> WHERE id > 100 LIMIT 10;
  mysql> SELECT FOUND_ROWS();
  ```

  A segunda `SELECT` retorna um número que indica quantos registros a primeira `SELECT` teria retornado se tivesse sido escrita sem a cláusula `LIMIT`.

  Na ausência da opção `SQL_CALC_FOUND_ROWS` na declaração `SELECT` mais recente com sucesso, `FOUND_ROWS()` retorna o número de linhas no conjunto de resultados retornado por essa declaração. Se a declaração incluir uma cláusula `LIMIT`, `FOUND_ROWS()` retorna o número de linhas até o limite. Por exemplo, `FOUND_ROWS()` retorna 10 ou 60, respectivamente, se a declaração incluir `LIMIT 10` ou `LIMIT 50, 10`.

  O número de linhas disponível através de `FOUND_ROWS()` é transitório e não deve ser acessado após a instrução que segue a instrução `SELECT SQL_CALC_FOUND_ROWS`. Se você precisar referenciar o valor posteriormente, salve-o:

  ```sql
  mysql> SELECT SQL_CALC_FOUND_ROWS * FROM ... ;
  mysql> SET @rows = FOUND_ROWS();
  ```

  Se você estiver usando `SELECT SQL_CALC_FOUND_ROWS`, o MySQL deve calcular quantas linhas estão no conjunto de resultados completo. No entanto, isso é mais rápido do que executar a consulta novamente sem `LIMIT`, porque o conjunto de resultados não precisa ser enviado ao cliente.

  `SQL_CALC_FOUND_ROWS` e `FOUND_ROWS()` podem ser úteis em situações em que você deseja restringir o número de linhas que uma consulta retorna, mas também determinar o número de linhas no conjunto de resultados completo sem executar a consulta novamente. Um exemplo é um script da Web que apresenta uma exibição em páginas contendo links para as páginas que mostram outras seções de um resultado de pesquisa. Usar `FOUND_ROWS()` permite determinar quantas outras páginas são necessárias para o restante do resultado.

  O uso de `SQL_CALC_FOUND_ROWS` e `FOUND_ROWS()` é mais complexo para as instruções `UNION` do que para as instruções simples `SELECT`, porque o `LIMIT` pode ocorrer em vários pontos de uma `UNION`. Ele pode ser aplicado a instruções `SELECT` individuais na `UNION`, ou globalmente ao resultado da `UNION` como um todo.

  A intenção do `SQL_CALC_FOUND_ROWS` para `UNION` é que ele retorne o número de linhas que seria retornado sem um `LIMIT` global. As condições para o uso do `SQL_CALC_FOUND_ROWS` com `UNION` são:

  - A palavra-chave `SQL_CALC_FOUND_ROWS` deve aparecer no primeiro `SELECT` da `UNION`.

  - O valor de `FOUND_ROWS()` é exato apenas se o `UNION ALL` for usado. Se o `UNION` sem `ALL` for usado, a remoção de duplicatas ocorre e o valor de `FOUND_ROWS()` é apenas aproximado.

  - Se não houver um `LIMIT` na `UNION`, o `SQL_CALC_FOUND_ROWS` é ignorado e retorna o número de linhas na tabela temporária criada para processar a `UNION`.

  Além dos casos descritos aqui, o comportamento do `FOUND_ROWS()` é indefinido (por exemplo, seu valor após uma instrução `SELECT` que falha com um erro).

  Importante

  `FOUND_ROWS()` não é replicado de forma confiável usando a replicação baseada em instruções. Essa função é replicada automaticamente usando a replicação baseada em linhas.

- `LAST_INSERT_ID()`, `LAST_INSERT_ID(expr)`

  Sem argumento, `LAST_INSERT_ID()` retorna um valor `BIGINT UNSIGNED` (64 bits) que representa o primeiro valor gerado automaticamente inserido com sucesso para uma coluna `AUTO_INCREMENT` como resultado da instrução `INSERT` executada mais recentemente. O valor de `LAST_INSERT_ID()` permanece inalterado se nenhuma linha for inserida com sucesso.

  Com um argumento, `LAST_INSERT_ID()` retorna um inteiro não assinado.

  Por exemplo, após inserir uma linha que gera um valor `AUTO_INCREMENT`, você pode obter o valor da seguinte forma:

  ```sql
  mysql> SELECT LAST_INSERT_ID();
          -> 195
  ```

  A declaração atualmente em execução não afeta o valor de `LAST_INSERT_ID()`. Suponha que você gere um valor `AUTO_INCREMENT` com uma declaração e, em seguida, faça referência a `LAST_INSERT_ID()` em uma declaração `INSERT` de múltiplas linhas que insere linhas em uma tabela com sua própria coluna `AUTO_INCREMENT`. O valor de `LAST_INSERT_ID()` permanece estável na segunda declaração; seu valor para as segunda e linhas subsequentes não é afetado pelas inserções das linhas anteriores. (No entanto, se você misturar referências a `LAST_INSERT_ID()` e `LAST_INSERT_ID(expr)`, o efeito é indefinido.)

  Se a declaração anterior retornou um erro, o valor de `LAST_INSERT_ID()` é indefinido. Para tabelas transacionais, se a declaração for revertida devido a um erro, o valor de `LAST_INSERT_ID()` permanece indefinido. Para um `ROLLBACK` manual, o valor de `LAST_INSERT_ID()` não é restaurado para o valor anterior à transação; ele permanece como estava no momento do `ROLLBACK`.

  Dentro do corpo de uma rotina armazenada (procedimento ou função) ou de um gatilho, o valor de `LAST_INSERT_ID()` muda da mesma maneira que para instruções executadas fora do corpo desses tipos de objetos. O efeito de uma rotina armazenada ou gatilho sobre o valor de `LAST_INSERT_ID()` que é visto ao seguir instruções depende do tipo de rotina:

  - Se um procedimento armazenado executar instruções que alterem o valor de `LAST_INSERT_ID()`, o valor alterado será visto por instruções que seguem a chamada do procedimento.

  - Para funções e gatilhos armazenados que alteram o valor, o valor é restaurado quando a função ou o gatilho termina, então as instruções que os seguem não veem um valor alterado.

  O ID gerado é mantido no servidor de forma *por conexão*. Isso significa que o valor retornado pela função para um cliente específico é o primeiro valor `AUTO_INCREMENT` gerado para a declaração mais recente que afeta uma coluna `AUTO_INCREMENT` *por esse cliente*. Esse valor não pode ser afetado por outros clientes, mesmo que eles gerem seus próprios valores `AUTO_INCREMENT`. Esse comportamento garante que cada cliente possa recuperar seu próprio ID sem preocupação com a atividade de outros clientes, e sem a necessidade de bloqueios ou transações.

  O valor de `LAST_INSERT_ID()` não é alterado se você definir a coluna `AUTO_INCREMENT` de uma linha para um valor não "mágico" (ou seja, um valor que não é `NULL` e não é `0`).

  Importante

  Se você inserir várias linhas usando uma única instrução `INSERT`, `LAST_INSERT_ID()` retorna o valor gerado para a *primeira* linha inserida *apenas*. A razão para isso é permitir que você reproduza facilmente a mesma instrução `INSERT` em outro servidor.

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

  Se você usar `INSERT IGNORE` e a linha for ignorada, o `LAST_INSERT_ID()` permanece inalterado em relação ao valor atual (ou 0 é retornado se a conexão ainda não tiver realizado uma `INSERT` bem-sucedida) e, para tabelas não transacionais, o contador `AUTO_INCREMENT` não é incrementado. Para tabelas `InnoDB`, o contador `AUTO_INCREMENT` é incrementado se `innodb_autoinc_lock_mode` estiver definido como `1` ou `2`, como demonstrado no exemplo a seguir:

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

  Para obter mais informações, consulte a Seção 14.6.1.6, “Tratamento do AUTO\_INCREMENT no InnoDB”.

  Se *`expr`* for fornecido como argumento para `LAST_INSERT_ID()`, o valor do argumento é retornado pela função e é lembrado como o próximo valor a ser retornado por `LAST_INSERT_ID()`. Isso pode ser usado para simular sequências:

  1. Crie uma tabela para armazenar o contador de sequência e inicie-a:

     ```sql
     mysql> CREATE TABLE sequence (id INT NOT NULL);
     mysql> INSERT INTO sequence VALUES (0);
     ```

  2. Use a tabela para gerar números de sequência da seguinte forma:

     ```sql
     mysql> UPDATE sequence SET id=LAST_INSERT_ID(id+1);
     mysql> SELECT LAST_INSERT_ID();
     ```

     A instrução `UPDATE` incrementa o contador de sequência e faz com que o próximo chamado para `LAST_INSERT_ID()` retorne o valor atualizado. A instrução `SELECT` recupera esse valor. A função C API `mysql_insert_id()` também pode ser usada para obter o valor. Veja mysql\_insert\_id().

  Você pode gerar sequências sem chamar `LAST_INSERT_ID()`, mas a utilidade de usar a função dessa maneira é que o valor do ID é mantido no servidor como o último valor gerado automaticamente. É seguro para múltiplos usuários, pois vários clientes podem emitir a instrução `UPDATE` e obter seu próprio valor de sequência com a instrução `SELECT` (ou `mysql_insert_id()`), sem afetar ou ser afetado por outros clientes que geram seus próprios valores de sequência.

  Observe que `mysql_insert_id()` só é atualizado após os comandos `INSERT` e `UPDATE`, então você não pode usar a função da API C para recuperar o valor para `LAST_INSERT_ID(expr)` após executar outros comandos SQL como `SELECT` ou `SET`.

- `ROW_COUNT()`

  `ROW_COUNT()` retorna um valor da seguinte forma:

  - Declarações DDL: 0. Isso se aplica a declarações como `CREATE TABLE` ou `DROP TABLE`.

  - Declarações DML, exceto `SELECT`: O número de linhas afetadas. Isso se aplica a declarações como `UPDATE`, `INSERT` ou `DELETE` (como antes), mas agora também a declarações como `ALTER TABLE` e `LOAD DATA`.

  - `SELECT`: -1 se a instrução retornar um conjunto de resultados, ou o número de linhas “afetadas” se não retornar. Por exemplo, para `SELECT * FROM t1`, `ROW_COUNT()` retorna -1. Para `SELECT * FROM t1 INTO OUTFILE 'file_name'`, `ROW_COUNT()` retorna o número de linhas escritas no arquivo.

  - Declarações `SIGNAL`: 0.

  Para as instruções `UPDATE`, o valor affected-rows, por padrão, é o número de linhas realmente alteradas. Se você especificar a flag `CLIENT_FOUND_ROWS` para `mysql_real_connect()` ao se conectar ao **mysqld**, o valor affected-rows é o número de linhas "encontradas", ou seja, correspondentes à cláusula `WHERE`.

  Para as instruções `REPLACE`, o valor affected-rows é 2 se a nova linha substituir uma linha antiga, porque, neste caso, uma linha foi inserida após a duplicata ter sido excluída.

  Para as instruções `INSERT ... ON DUPLICATE KEY UPDATE`, o valor de `affected-rows` por linha é 1 se a linha for inserida como uma nova linha, 2 se uma linha existente for atualizada e 0 se uma linha existente for definida com seus valores atuais. Se você especificar a bandeira `CLIENT_FOUND_ROWS`, o valor de `affected-rows` é 1 (e não 0) se uma linha existente for definida com seus valores atuais.

  O valor de `ROW_COUNT()` é semelhante ao valor da função C API `mysql_affected_rows()` e ao número de linhas exibido pelo cliente **mysql** após a execução da instrução.

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

  A função `ROW_COUNT()` não é replicada de forma confiável com a replicação baseada em instruções. Essa função é replicada automaticamente com a replicação baseada em linhas.

- `SCHEMA()`

  Essa função é sinônima de `DATABASE()`.

- `SESSION_USER()`

  `SESSION_USER()` é sinônimo de `USER()`.

- `SISTEMA_USUARIO()`

  `SYSTEM_USER()` é um sinônimo de `USER()`.

- `USUARIO()`

  Retorna o nome atual do usuário e o nome do host do MySQL como uma string no conjunto de caracteres `utf8`.

  ```sql
  mysql> SELECT USER();
          -> 'davida@localhost'
  ```

  O valor indica o nome de usuário que você especificou ao se conectar ao servidor e o host do cliente a partir do qual você se conectou. O valor pode ser diferente do de `CURRENT_USER()`.

- `VERSÃO()`

  Retorna uma string que indica a versão do servidor MySQL. A string utiliza o conjunto de caracteres `utf8`. O valor pode ter um sufixo além do número da versão. Veja a descrição da variável de sistema `version` na Seção 5.1.7, “Variáveis de sistema do servidor”.

  Essa função não é segura para a replicação baseada em instruções. Um aviso é registrado se você usar essa função quando o `binlog_format` estiver configurado para `STATEMENT`.

  ```sql
  mysql> SELECT VERSION();
          -> '5.7.44-standard'
  ```
