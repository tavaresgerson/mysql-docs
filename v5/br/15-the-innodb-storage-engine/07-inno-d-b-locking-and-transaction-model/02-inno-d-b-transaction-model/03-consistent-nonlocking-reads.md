#### 14.7.2.3 Leitura consistente sem bloqueio

Uma leitura consistente significa que o `InnoDB` usa a versão múltipla para apresentar a uma consulta um instantâneo do banco de dados em um determinado momento. A consulta vê as alterações feitas por transações que foram confirmadas antes desse momento, e nenhuma alteração feita por transações posteriores ou não confirmadas. A exceção a essa regra é que a consulta vê as alterações feitas por declarações anteriores dentro da mesma transação. Essa exceção causa a seguinte anomalia: Se você atualizar algumas linhas em uma tabela, uma `SELECT` vê a versão mais recente das linhas atualizadas, mas também pode ver versões mais antigas de qualquer linha. Se outras sessões atualizarem simultaneamente a mesma tabela, a anomalia significa que você pode ver a tabela em um estado que nunca existiu no banco de dados.

Se o nível de isolamento de transação for `REPEATABLE READ` (o nível padrão), todas as leituras consistentes dentro da mesma transação lerão o instantâneo estabelecido pela primeira leitura desse tipo naquela transação. Você pode obter um instantâneo mais recente para suas consultas ao confirmar a transação atual e, em seguida, emitir novas consultas.

Com o nível de isolamento `LEIA COM PROMESSA`, cada leitura consistente dentro de uma transação define e lê seu próprio instantâneo fresco.

A leitura consistente é o modo padrão no qual o `InnoDB` processa as instruções `SELECT` nos níveis de isolamento `READ COMMITTED` e `REPEATABLE READ`. Uma leitura consistente não define nenhum bloqueio nas tabelas a que acessa, e, portanto, outras sessões estão livres para modificar essas tabelas ao mesmo tempo em que uma leitura consistente está sendo realizada na tabela.

Suponha que você esteja executando o nível de isolamento `REPEATABLE READ` padrão. Quando você emite uma leitura consistente (ou seja, uma instrução `SELECT` comum), o `InnoDB` atribui um ponto de tempo para sua transação, de acordo com o qual sua consulta vê o banco de dados. Se outra transação excluir uma linha e confirmar após o seu ponto de tempo ter sido atribuído, você não verá que a linha foi excluída. As inserções e atualizações são tratadas de maneira semelhante.

Nota

O instantâneo do estado do banco de dados se aplica a instruções `SELECT` dentro de uma transação, não necessariamente a instruções DML. Se você inserir ou modificar algumas linhas e então confirmar essa transação, uma instrução `DELETE` ou `UPDATE` emitida por outra transação `REPEATABLE READ` concorrente poderia afetar aquelas linhas que foram confirmadas recentemente, mesmo que a sessão não possa consultá-las. Se uma transação atualizar ou excluir linhas confirmadas por outra transação, essas alterações se tornam visíveis para a transação atual. Por exemplo, você pode encontrar uma situação como a seguinte:

```sql
SELECT COUNT(c1) FROM t1 WHERE c1 = 'xyz';
-- Returns 0: no rows match.
DELETE FROM t1 WHERE c1 = 'xyz';
-- Deletes several rows recently committed by other transaction.

SELECT COUNT(c2) FROM t1 WHERE c2 = 'abc';
-- Returns 0: no rows match.
UPDATE t1 SET c2 = 'cba' WHERE c2 = 'abc';
-- Affects 10 rows: another txn just committed 10 rows with 'abc' values.
SELECT COUNT(c2) FROM t1 WHERE c2 = 'cba';
-- Returns 10: this txn can now see the rows it just updated.
```

Você pode avançar seu ponto de tempo ao confirmar sua transação e, em seguida, executar outro `SELECT` ou `START TRANSACTION WITH CONSISTENT SNAPSHOT`.

Isso é chamado de controle de concorrência em várias versões.

No exemplo a seguir, a sessão A só verá a linha inserida por B quando B tiver realizado o commit e A também tiver realizado, de modo que o ponto de tempo seja avançado após o commit de B.

```sql
             Session A              Session B

           SET autocommit=0;      SET autocommit=0;
time
|          SELECT * FROM t;
|          empty set
|                                 INSERT INTO t VALUES (1, 2);
|
v          SELECT * FROM t;
           empty set
                                  COMMIT;

           SELECT * FROM t;
           empty set

           COMMIT;

           SELECT * FROM t;
           ---------------------
           |    1    |    2    |
           ---------------------
```

Se você quiser ver o estado mais recente do banco de dados, use o nível de isolamento `READ COMMITTED` ou uma leitura com bloqueio:

```sql
SELECT * FROM t LOCK IN SHARE MODE;
```

Com o nível de isolamento `LEIA COM PROMESSA`, cada leitura consistente dentro de uma transação cria e lê seu próprio instantâneo fresco. Com `BLOQUEIE EM MODO COMPARTILHADO`, ocorre uma leitura de bloqueio em vez disso: um `SELECT` bloqueia até que a transação que contém as linhas mais recentes termine (veja a Seção 14.7.2.4, “Leitura de Bloqueio”).

A leitura consistente não funciona em determinadas instruções DDL:

- A leitura consistente não funciona sobre `DROP TABLE`, porque o MySQL não pode usar uma tabela que tenha sido excluída e o `InnoDB` destrói a tabela.

- A leitura consistente não funciona em operações de `ALTER TABLE` que fazem uma cópia temporária da tabela original e excluem a tabela original quando a cópia temporária é construída. Quando você reemite uma leitura consistente dentro de uma transação, as linhas na nova tabela não são visíveis porque essas linhas não existiam quando o instantâneo da transação foi feito. Nesse caso, a transação retorna um erro: `ER_TABLE_DEF_CHANGED`, “A definição da tabela mudou, tente novamente a transação”.

O tipo de leitura varia para seleções em cláusulas como `INSERT INTO ... SELECT`, `UPDATE ... (SELECT)` e `CREATE TABLE ... SELECT` que não especificam `FOR UPDATE` ou `LOCK IN SHARE MODE`:

- Por padrão, o `InnoDB` usa bloqueios mais fortes nessas instruções e a parte `SELECT` funciona como `READ COMMITTED`, onde cada leitura consistente, mesmo dentro da mesma transação, define e lê seu próprio instantâneo fresco.

- Para realizar uma leitura não bloqueante nesses casos, habilite a opção `innodb_locks_unsafe_for_binlog` e defina o nível de isolamento da transação para `READ UNCOMMITTED`, `READ COMMITTED` ou `REPEATABLE READ` para evitar a definição de bloqueios em linhas lidas da tabela selecionada.
