## 14.15 Funções de Informação

**Tabela 14.20 Funções de Informação**

<table frame="box" rules="all" summary="A reference that lists information functions."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Descrição</th> </tr></thead><tbody><tr><td><code>BENCHMARK()</code></td> <td>Execute repetidamente uma expressão</td> </tr><tr><td><code>CHARSET()</code></td> <td>Retorne o conjunto de caracteres do argumento</td> </tr><tr><td><code>COERCIBILITY()</code></td> <td>Retorne o valor de coercitividade de ordenação do argumento de string</td> </tr><tr><td><code>COLLATION()</code></td> <td>Retorne a ordenação do argumento de string</td> </tr><tr><td><code>CONNECTION_ID()</code></td> <td>Retorne o ID de conexão (ID de thread) para a conexão</td> </tr><tr><td><code>CURRENT_ROLE()</code></td> <td>Retorne os papéis ativos atuais</td> </tr><tr><td><code>CURRENT_USER()</code>, <code>CURRENT_USER</code></td> <td>O nome do usuário autenticado e o nome do host</td> </tr><tr><td><code>DATABASE()</code></td> <td>Retorne o nome do banco de dados padrão (atual)</td> </tr><tr><td><code>FOUND_ROWS()</code></td> <td>Para um SELECT com uma cláusula LIMIT, o número de linhas que seriam devolvidas se não houvesse cláusula LIMIT</td> </tr><tr><td><code>ICU_VERSION()</code></td> <td>Versão da biblioteca da UTI</td> </tr><tr><td><code>LAST_INSERT_ID()</code></td> <td>Valor da coluna AUTOINCREMENT para a última inserção</td> </tr><tr><td><code>ROLES_GRAPHML()</code></td> <td>Retorne um documento GraphML que represente subgrafos de papel de memória</td> </tr><tr><td><code>ROW_COUNT()</code></td> <td>O número de linhas atualizadas</td> </tr><tr><td><code>SCHEMA()</code></td> <td>Sinônimo de DATABASE()</td> </tr><tr><td><code>SESSION_USER()</code></td> <td>Sinônimo de USER()</td> </tr><tr><td><code>SYSTEM_USER()</code></td> <td>Sinônimo de USER()</td> </tr><tr><td><code>USER()</code></td> <td>O nome de usuário e o nome do host fornecidos pelo cliente</td> </tr><tr><td><code>VERSION()</code></td> <td>Retorne uma string que indique a versão do servidor MySQL</td> </tr></tbody></table>

* `BENCHMARK(count,expr)`

A função `BENCHMARK()` executa a expressão *`expr`* repetidamente *`count`* vezes. Ela pode ser usada para medir a rapidez com que o MySQL processa a expressão. O valor do resultado é `0`, ou `NULL` para argumentos inadequados, como um `NULL` ou contagem de repetição negativa.

O uso pretendido é a partir do cliente **mysql**, que relata os tempos de execução das consultas:

  ```
  mysql> SELECT BENCHMARK(1000000,AES_ENCRYPT('hello','goodbye'));
  +---------------------------------------------------+
  | BENCHMARK(1000000,AES_ENCRYPT('hello','goodbye')) |
  +---------------------------------------------------+
  |                                                 0 |
  +---------------------------------------------------+
  1 row in set (4.74 sec)
  ```

O tempo relatado é o tempo gasto no cliente, não o tempo da CPU no servidor. É aconselhável executar `BENCHMARK()` várias vezes e interpretar o resultado em relação à carga pesada da máquina do servidor.

`BENCHMARK()` é destinado a medir o desempenho do runtime de expressões escalares, o que tem algumas implicações significativas sobre a forma como você o usa e interpreta os resultados:

+ Apenas expressões escalares podem ser usadas. Embora a expressão possa ser uma subconsulta, ela deve retornar uma única coluna e, no máximo, uma única linha. Por exemplo, `BENCHMARK(10, (SELECT * FROM t))`(information-functions.html#function_benchmark) falha se a tabela `t` tiver mais de uma coluna ou mais de uma linha.

Executar uma declaração `SELECT expr` *`N`* vezes difere da execução de `SELECT BENCHMARK(N, expr)` em termos da quantidade de overhead envolvida. Os dois têm perfis de execução muito diferentes e você não deve esperar que eles levem o mesmo tempo. O primeiro envolve o analisador, otimizador, bloqueio de tabela e avaliação de tempo de execução *`N`* vezes cada. O segundo envolve apenas a avaliação de tempo de execução *`N`* vezes, e todos os outros componentes apenas uma vez. As estruturas de memória já alocadas são reutilizadas, e otimizações de tempo de execução, como o cache local de resultados já avaliados para funções agregadas, podem alterar os resultados. O uso de `BENCHMARK()` mede, portanto, o desempenho do componente de tempo de execução, dando mais peso a esse componente e removendo o "ruído" introduzido pela rede, analisador, otimizador e assim por diante.

* `CHARSET(str)`

Retorna o conjunto de caracteres da string de argumento, ou `NULL` se o argumento for `NULL`.

  ```
  mysql> SELECT CHARSET('abc');
          -> 'utf8mb3'
  mysql> SELECT CHARSET(CONVERT('abc' USING latin1));
          -> 'latin1'
  mysql> SELECT CHARSET(USER());
          -> 'utf8mb3'
  ```

* `COERCIBILITY(str)`

Retorna o valor de coercibilidade da ordenação da string argumento.

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

  <table summary="Collation coercibility return values, the meaning of each value, and an example of each."><col style="width: 15%"/><col style="width: 15%"/><col style="width: 70%"/><thead><tr> <th scope="col">Coercibility</th> <th scope="col">Meaning</th> <th scope="col">Example</th> </tr></thead><tbody><tr> <th scope="row"><code>0</code></th> <td>Explicit collation</td> <td>Value with <code>COLLATE</code> clause</td> </tr><tr> <th scope="row"><code>1</code></th> <td>Sem comparação</td> <td>Concatenação de cadeias de caracteres com diferentes codificações</td> </tr><tr> <th scope="row"><code>2</code></th> <td>Ordenação implícita</td> <td>Valor da coluna, parâmetro de rotina armazenado ou variável local</td> </tr><tr> <th scope="row"><code>3</code></th> <td>System constant</td> <td><code>USER()</code> return value</td> </tr><tr> <th scope="row"><code>4</code></th> <td>Coercible</td> <td>Literal string</td> </tr><tr> <th scope="row"><code>5</code></th> <td>Numeric</td> <td>Numeric or temporal value</td> </tr><tr> <th scope="row"><code>6</code></th> <td>Ignorável</td> <td><code>NULL</code>ou uma expressão derivada de<code>NULL</code></td> </tr></tbody></table>

Para mais informações, consulte a Seção 12.8.4, “Coercitividade da Collinação em Expressões”.

* `COLLATION(str)`

Retorna a codificação da string de argumento.

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

O valor retornado por `CONNECTION_ID()` é do mesmo tipo de valor exibido na coluna `ID` da tabela do Esquema de Informações `PROCESSLIST`, na coluna `Id` do [`SHOW PROCESSLIST`](show-processlist.html "15.7.7.29 SHOW PROCESSLIST Statement") de saída e na coluna `PROCESSLIST_ID` da tabela do Schema de Desempenho `threads`.

  ```
  mysql> SELECT CONNECTION_ID();
          -> 23786
  ```

Aviso

Altere o valor da sessão da variável de sistema `pseudo_thread_id` e o valor retornado pela função `CONNECTION_ID()` será alterado.

* `CURRENT_ROLE()`

Retorna uma string `utf8mb3` contendo os papéis ativos atuais para a sessão atual, separados por vírgulas, ou `NONE` se não houver nenhum. O valor reflete a configuração da variável de sistema `sql_quote_show_create`.

Suponha que uma conta receba os seguintes papéis:

  ```
  GRANT 'r1', 'r2' TO 'u1'@'localhost';
  SET DEFAULT ROLE ALL TO 'u1'@'localhost';
  ```

Nas sessões para `u1`, os nomes iniciais dos papéis de conta do `CURRENT_ROLE()` definem as contas padrão. O uso de [`SET ROLE`](set-role.html "15.7.1.11 SET ROLE Statement") altera isso:

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

Retorna a combinação de nome de usuário e nome de host para a conta MySQL que o servidor usou para autenticar o cliente atual. Essa conta determina seus privilégios de acesso. O valor de retorno é uma string no conjunto de caracteres `utf8mb3`.

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

O exemplo ilustra que, embora o cliente tenha especificado um nome de usuário de `davida` (como indicado pelo valor da função `USER()`, o servidor autenticou o cliente usando uma conta de usuário anônima (como visto pela parte vazia do nome de usuário do valor `CURRENT_USER()`). Uma maneira dessa ocorrência pode ser que não haja uma conta listada nas tabelas de concessão para `davida`.

Dentro de um programa ou visual armazenado, `CURRENT_USER()` retorna a conta do usuário que definiu o objeto (conforme dado pelo seu valor `DEFINER`) a menos que seja definido com a característica `SQL SECURITY INVOKER`. No último caso, `CURRENT_USER()` retorna o invocador do objeto.

Os gatilhos e eventos não têm opção para definir a característica `SQL SECURITY`, portanto, para esses objetos, `CURRENT_USER()` retorna a conta do usuário que definiu o objeto. Para retornar o invocador, use `USER()` ou `SESSION_USER()`.

As seguintes declarações apoiam o uso da função `CURRENT_USER()` para substituir o nome de (e, possivelmente, o endereço de) um usuário afetado ou um definidor; nesses casos, `CURRENT_USER()` é expandido onde e conforme necessário:

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

Para informações sobre as implicações que essa expansão do `CURRENT_USER()` tem para a replicação, consulte a Seção 19.5.1.8, “Replicação de CURRENT_USER()”).

Começando com o MySQL 8.0.34, essa função pode ser usada para o valor padrão de uma coluna `VARCHAR` ou `TEXT`, conforme mostrado na seguinte declaração `CREATE TABLE`:

  ```
  CREATE TABLE t (c VARCHAR(288) DEFAULT (CURRENT_USER()));
  ```

* `DATABASE()`

Retorna o nome do banco de dados padrão (atual) como uma string no conjunto de caracteres `utf8mb3`. Se não houver um banco de dados padrão, `DATABASE()` retorna `NULL`. Dentro de uma rotina armazenada, o banco de dados padrão é o banco de dados com o qual a rotina está associada, que não é necessariamente o mesmo que o banco de dados que é o padrão no contexto de chamada.

  ```
  mysql> SELECT DATABASE();
          -> 'test'
  ```

Se não houver um banco de dados padrão, `DATABASE()` retorna `NULL`.

* `FOUND_ROWS()`

Nota

O modificador de consulta `SQL_CALC_FOUND_ROWS` e a função acompanhante `FOUND_ROWS()` são desatualizados a partir do MySQL 8.0.17; espera-se que eles sejam removidos em uma versão futura do MySQL. Como substituição, considere executar sua consulta com `LIMIT`, e em seguida, uma segunda consulta com `COUNT(*)` e sem `LIMIT` para determinar se há linhas adicionais. Por exemplo, em vez dessas consultas:

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

Uma declaração `SELECT` pode incluir uma cláusula `LIMIT` para restringir o número de linhas que o servidor retorna ao cliente. Em alguns casos, é desejável saber quantas linhas a declaração teria retornado sem a `LIMIT`, mas sem executar a declaração novamente. Para obter esse número de linhas, inclua uma opção `SQL_CALC_FOUND_ROWS` na declaração `SELECT`, e então invoque `FOUND_ROWS()` posteriormente:

  ```
  mysql> SELECT SQL_CALC_FOUND_ROWS * FROM tbl_name
      -> WHERE id > 100 LIMIT 10;
  mysql> SELECT FOUND_ROWS();
  ```

O segundo `SELECT` retorna um número que indica quantas linhas o primeiro `SELECT` teria retornado se tivesse sido escrito sem a cláusula `LIMIT`.

Na ausência da opção `SQL_CALC_FOUND_ROWS` na declaração mais recente bem-sucedida `SELECT`, `FOUND_ROWS()` retorna o número de linhas no conjunto de resultados retornado por essa declaração. Se a declaração incluir uma cláusula `LIMIT`, `FOUND_ROWS()` retorna o número de linhas até o limite. Por exemplo, `FOUND_ROWS()` retorna 10 ou 60, respectivamente, se a declaração incluir `LIMIT 10` ou `LIMIT 50, 10`.

O número de linhas disponível através de `FOUND_ROWS()` é transitório e não deve ser disponível após a declaração após a declaração de `SELECT SQL_CALC_FOUND_ROWS`. Se você precisar referir-se ao valor posteriormente, salve-o:

  ```
  mysql> SELECT SQL_CALC_FOUND_ROWS * FROM ... ;
  mysql> SET @rows = FOUND_ROWS();
  ```

Se você estiver usando `SELECT SQL_CALC_FOUND_ROWS`, o MySQL deve calcular quantas linhas estão no conjunto de resultados completo. No entanto, isso é mais rápido do que executar a consulta novamente sem `LIMIT`, porque o conjunto de resultados não precisa ser enviado ao cliente.

`SQL_CALC_FOUND_ROWS` e `FOUND_ROWS()` podem ser úteis em situações em que você deseja restringir o número de linhas que uma consulta retorna, mas também determinar o número de linhas no conjunto de resultados completo sem executar a consulta novamente. Um exemplo é um script da Web que apresenta um display em páginas contendo links para as páginas que mostram outras seções de um resultado de pesquisa. Usando `FOUND_ROWS()`, você pode determinar quantas outras páginas são necessárias para o restante do resultado.

O uso de `SQL_CALC_FOUND_ROWS` e `FOUND_ROWS()` é mais complexo para as declarações `UNION` do que para declarações simples `SELECT`, porque `LIMIT` pode ocorrer em vários lugares em um `UNION`. Pode ser aplicado a declarações individuais `SELECT` no `UNION`, ou global para o `UNION` resultado como um todo.

A intenção do `SQL_CALC_FOUND_ROWS` para o `UNION` é que ele retorne o número de linhas que seria retornado sem um global `LIMIT`. As condições para o uso do `SQL_CALC_FOUND_ROWS` com o `UNION` são:

+ A palavra-chave `SQL_CALC_FOUND_ROWS` deve aparecer no primeiro `SELECT` do `UNION`.

+ O valor de `FOUND_ROWS()` é exato apenas se `UNION ALL` for usado. Se `UNION` sem `ALL` for usado, a remoção de duplicatas ocorre e o valor de `FOUND_ROWS()` é apenas aproximado.

+ Se não houver `LIMIT` presente no `UNION`, o `SQL_CALC_FOUND_ROWS` é ignorado e retorna o número de linhas na tabela temporária que é criada para processar o `UNION`.

Além dos casos descritos aqui, o comportamento de `FOUND_ROWS()` é indefinido (por exemplo, seu valor após uma declaração `SELECT` que falha com um erro).

Importante

`FOUND_ROWS()` não é replicado de forma confiável usando replicação baseada em declarações. Essa função é replicada automaticamente usando replicação baseada em linhas.

* `ICU_VERSION()`

A versão da biblioteca Internacional de Componentes para Unicode (ICU) usada para suportar operações de expressão regular (ver Seção 14.8.2, “Expressões Regulares”). Esta função é destinada principalmente para uso em casos de teste.

* `LAST_INSERT_ID()`, `LAST_INSERT_ID(expr)`

Sem argumento, `LAST_INSERT_ID()` retorna um valor `BIGINT UNSIGNED` (64 bits) que representa o primeiro valor gerado automaticamente inserido com sucesso para uma coluna `AUTO_INCREMENT` como resultado da declaração `INSERT` executada mais recentemente. O valor de `LAST_INSERT_ID()` permanece inalterado se nenhuma linha for inserida com sucesso.

Com um argumento, `LAST_INSERT_ID()` retorna um inteiro não assinado, ou `NULL` se o argumento for `NULL`.

Por exemplo, após inserir uma linha que gera um valor de `AUTO_INCREMENT`, você pode obter o valor da seguinte forma:

  ```
  mysql> SELECT LAST_INSERT_ID();
          -> 195
  ```

A declaração atualmente em execução não afeta o valor de `LAST_INSERT_ID()`. Suponha que você gere um valor de `AUTO_INCREMENT` com uma declaração e, em seguida, faça referência a `LAST_INSERT_ID()` em uma declaração múltipla de `INSERT` que insere linhas em uma tabela com sua própria coluna `AUTO_INCREMENT`. O valor de `LAST_INSERT_ID()` permanece estável na segunda declaração; seu valor para as segunda e as linhas subsequentes não é afetado pelas inserções das linhas anteriores. (Você deve estar ciente de que, se você misturar referências a `LAST_INSERT_ID()` e `LAST_INSERT_ID(expr)`, o efeito é indefinido.)

Se a declaração anterior retornar um erro, o valor de `LAST_INSERT_ID()` é indefinido. Para tabelas transacionais, se a declaração for revertida devido a um erro, o valor de `LAST_INSERT_ID()` é deixado indefinido. Para `ROLLBACK` manual, o valor de `LAST_INSERT_ID()` não é restaurado para o anterior à transação; permanece como estava no ponto do `ROLLBACK`.

Dentro do corpo de uma rotina armazenada (procedimento ou função) ou de um gatilho, o valor de `LAST_INSERT_ID()` muda da mesma maneira que para as declarações executadas fora do corpo desses tipos de objetos. O efeito de uma rotina armazenada ou gatilho sobre o valor de `LAST_INSERT_ID()` que é visto ao seguir declarações depende do tipo de rotina:

+ Se um procedimento armazenado executar instruções que alterem o valor de `LAST_INSERT_ID()`, o valor alterado será visto por instruções que seguem a chamada do procedimento.

+ Para funções e gatilhos armazenados que alteram o valor, o valor é restaurado quando a função ou gatilho termina, de modo que as instruções que vêm depois dele não veem um valor alterado.

O ID que foi gerado é mantido no servidor em uma base *por conexão*. Isso significa que o valor retornado pela função para um cliente específico é o primeiro valor `AUTO_INCREMENT` gerado para a declaração mais recente que afeta uma coluna `AUTO_INCREMENT` *por aquele cliente*. Esse valor não pode ser afetado por outros clientes, mesmo que eles gerem valores `AUTO_INCREMENT` próprios. Esse comportamento garante que cada cliente possa recuperar seu próprio ID sem preocupação com a atividade de outros clientes, e sem a necessidade de bloqueios ou transações.

O valor de `LAST_INSERT_ID()` não é alterado se você definir a coluna `AUTO_INCREMENT` de uma linha para um valor não "mágico" (ou seja, um valor que não é `NULL` e não `0`).

Importante

Se você inserir várias linhas usando uma única declaração `INSERT`, `LAST_INSERT_ID()` retorna o valor gerado para a *primeira* linha inserida *apenas*. A razão para isso é permitir que você possa facilmente reproduzir a mesma declaração `INSERT` contra algum outro servidor.

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

Embora a segunda declaração `INSERT` tenha inserido três novas linhas em `t`, o ID gerado para a primeira dessas linhas foi `2`, e é esse valor que é retornado por `LAST_INSERT_ID()` para a declaração seguinte `SELECT`.

Se você usar `INSERT IGNORE` e a linha for ignorada, o (insert.html "15.2.7 INSERT Statement") permanece inalterado do valor atual (ou é retornado 0 se a conexão ainda não realizou uma conexão bem-sucedida `INSERT`) e, para tabelas não transacionais, o contador `AUTO_INCREMENT` não é incrementado. Para tabelas `InnoDB`, o contador `AUTO_INCREMENT` é incrementado se `innodb_autoinc_lock_mode` estiver definido como `1` ou `2`, como demonstrado no exemplo a seguir:

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

Para mais informações, consulte a Seção 17.6.1.6, “Tratamento de AUTO_INCREMENT em InnoDB”.

Se *`expr`* for fornecido como argumento para `LAST_INSERT_ID()`, o valor do argumento é retornado pela função e é lembrado como o próximo valor a ser retornado por `LAST_INSERT_ID()`. Isso pode ser usado para simular sequências:

1. Crie uma tabela para armazenar o contador de sequência e inicializá-la:

     ```
     mysql> CREATE TABLE sequence (id INT NOT NULL);
     mysql> INSERT INTO sequence VALUES (0);
     ```

2. Use a tabela para gerar números de sequência da seguinte forma:

     ```
     mysql> UPDATE sequence SET id=LAST_INSERT_ID(id+1);
     mysql> SELECT LAST_INSERT_ID();
     ```

A declaração `UPDATE` incrementa o contador de sequência e faz com que o próximo chamado para `LAST_INSERT_ID()` retorne o valor atualizado. A declaração `SELECT` recupera esse valor. A função C API `mysql_insert_id()` também pode ser usada para obter o valor. Veja mysql_insert_id().

Você pode gerar sequências sem chamar `LAST_INSERT_ID()`, mas a utilidade de usar a função dessa maneira é que o valor do ID é mantido no servidor como o último valor gerado automaticamente. É seguro para múltiplos usuários, pois vários clientes podem emitir a declaração `UPDATE` e obter seu próprio valor de sequência com a declaração `SELECT` (ou `mysql_insert_id()`), sem afetar ou ser afetado por outros clientes que geram seus próprios valores de sequência.

Observe que `mysql_insert_id()` é atualizado apenas após as declarações `INSERT` e `UPDATE`, portanto, você não pode usar a função da API C para recuperar o valor para `LAST_INSERT_ID(expr)` após executar outras declarações SQL, como `SELECT` ou `SET`.

* `ROLES_GRAPHML()`

Retorna uma string `utf8mb3` contendo um documento GraphML que representa subgrafos de papel de memória. O privilégio `ROLE_ADMIN` (ou o privilégio descontinuado `SUPER`) é necessário para visualizar o conteúdo no elemento `<graphml>`. Caso contrário, o resultado mostra apenas um elemento vazio:

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

+ Declarações DDL: 0. Isso se aplica a declarações como `CREATE TABLE` ou `DROP TABLE`.

+ Declarações DML, exceto `SELECT`: O número de linhas afetadas. Isso se aplica a declarações como `UPDATE`, `INSERT` ou `DELETE` (como antes), mas agora também a declarações como [`ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement") e [`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement").

+ `SELECT`: -1 se a declaração retornar um conjunto de resultados, ou o número de linhas "afetadas" se não o fizer. Por exemplo, para `SELECT * FROM t1`, `ROW_COUNT()` retorna -1. Para `SELECT * FROM t1 INTO OUTFILE 'file_name'`, `ROW_COUNT()` retorna o número de linhas escritas no arquivo.

+ `SIGNAL` declarações: 0.

Para as declarações `UPDATE`, o valor de linhas afetadas, por padrão, é o número de linhas que realmente foram alteradas. Se você especificar a bandeira `CLIENT_FOUND_ROWS` para `mysql_real_connect()` ao se conectar ao **mysqld**, o valor de linhas afetadas é o número de linhas "encontradas"; ou seja, correspondentes à cláusula `WHERE`.

Para as declarações `REPLACE`, o valor de `REPLACE` é 2 se a nova linha substituiu uma linha antiga, porque, neste caso, uma linha foi inserida após a duplicata ter sido excluída.

Para as declarações `INSERT ... ON DUPLICATE KEY UPDATE`(insert-on-duplicate.html "15.2.7.2 INSERT ... ON DUPLICATE KEY UPDATE Statement"), o valor de linhas afetadas por linha é 1 se a linha for inserida como uma nova linha, 2 se uma linha existente for atualizada e 0 se uma linha existente for definida com seus valores atuais. Se você especificar a bandeira `CLIENT_FOUND_ROWS`, o valor de linhas afetadas é 1 (não 0) se uma linha existente for definida com seus valores atuais.

O valor de `ROW_COUNT()` é semelhante ao valor da função C API `mysql_affected_rows()` e ao número de linhas que o cliente **mysql** exibe após a execução da declaração.

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

`ROW_COUNT()` não é replicado de forma confiável usando replicação baseada em declarações. Essa função é replicada automaticamente usando replicação baseada em linhas.

* `SCHEMA()`

Esta função é sinônimo de `DATABASE()`.

* `SESSION_USER()`

`SESSION_USER()` é sinônimo de `USER()`.

Começando com o MySQL 8.0.34, como `USER()`, essa função pode ser usada para o valor padrão de uma coluna `VARCHAR` ou `TEXT`, conforme mostrado na seguinte declaração `CREATE TABLE`:

  ```
  CREATE TABLE t (c VARCHAR(288) DEFAULT (SESSION_USER()));
  ```

* `SYSTEM_USER()`

`SYSTEM_USER()` é sinônimo de `USER()`.

Nota

A função `SYSTEM_USER()` é distinta do privilégio `SYSTEM_USER`. A primeira retorna o nome atual da conta MySQL. A segunda distingue as categorias de usuários do sistema e as contas de usuários regulares (consulte Seção 8.2.11, “Categorias de contas”).

Começando com o MySQL 8.0.34, como `USER()`, essa função pode ser usada para o valor padrão de uma coluna `VARCHAR` ou `TEXT`, conforme mostrado na seguinte declaração `CREATE TABLE`:

  ```
  CREATE TABLE t (c VARCHAR(288) DEFAULT (SYSTEM_USER()));
  ```

* `USER()`

Retorna o nome atual do usuário e o nome do host do MySQL como uma string no conjunto de caracteres `utf8mb3`.

  ```
  mysql> SELECT USER();
          -> 'davida@localhost'
  ```

O valor indica o nome do usuário que você especificou ao se conectar ao servidor e o host do cliente do qual você se conectou. O valor pode ser diferente do de `CURRENT_USER()`.

Começando com o MySQL 8.0.34, essa função pode ser usada para o valor padrão de uma coluna `VARCHAR` ou `TEXT`, conforme mostrado na seguinte declaração `CREATE TABLE`:

  ```
  CREATE TABLE t (c VARCHAR(288) DEFAULT (USER()));
  ```

* `VERSION()`

Retorna uma string que indica a versão do servidor MySQL. A string utiliza o conjunto de caracteres `utf8mb3`. O valor pode ter um sufixo além do número da versão. Consulte a descrição da variável de sistema `version` na Seção 7.1.8, “Variáveis de sistema do servidor”.

Essa função não é segura para replicação baseada em declarações. Um aviso é registrado se você usar essa função quando `binlog_format` está definido como `STATEMENT`.

  ```
  mysql> SELECT VERSION();
          -> '8.0.44-standard'
  ```