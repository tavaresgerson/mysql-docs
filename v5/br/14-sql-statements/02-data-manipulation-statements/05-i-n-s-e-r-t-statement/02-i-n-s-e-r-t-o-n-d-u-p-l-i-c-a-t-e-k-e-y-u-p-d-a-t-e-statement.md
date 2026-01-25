#### 13.2.5.2 INSERT ... ON DUPLICATE KEY UPDATE Statement

Se você especificar uma cláusula `ON DUPLICATE KEY UPDATE` e uma linha a ser inserida causaria um valor duplicado em um `UNIQUE` index ou `PRIMARY KEY`, ocorre um [`UPDATE`](update.html "13.2.11 UPDATE Statement") da linha antiga. Por exemplo, se a coluna `a` for declarada como `UNIQUE` e contiver o valor `1`, as duas instruções a seguir têm efeito semelhante:

```sql
INSERT INTO t1 (a,b,c) VALUES (1,2,3)
  ON DUPLICATE KEY UPDATE c=c+1;

UPDATE t1 SET c=c+1 WHERE a=1;
```

Os efeitos não são exatamente idênticos: Para uma tabela `InnoDB` onde `a` é uma coluna auto-incremento, a instrução `INSERT` aumenta o valor de auto-incremento, mas o `UPDATE` não.

Se a coluna `b` também for unique, o [`INSERT`](insert.html "13.2.5 INSERT Statement") é equivalente à seguinte instrução [`UPDATE`](update.html "13.2.11 UPDATE Statement"):

```sql
UPDATE t1 SET c=c+1 WHERE a=1 OR b=2 LIMIT 1;
```

Se `a=1 OR b=2` corresponder a várias linhas, apenas *uma* linha é atualizada. Em geral, você deve tentar evitar usar uma cláusula `ON DUPLICATE KEY UPDATE` em tabelas com múltiplos unique indexes.

Com `ON DUPLICATE KEY UPDATE`, o valor de affected-rows por linha é 1 se a linha for inserida como uma nova linha, 2 se uma linha existente for atualizada e 0 se uma linha existente for definida com seus valores atuais. Se você especificar a flag `CLIENT_FOUND_ROWS` para a função C API [`mysql_real_connect()`](/doc/c-api/5.7/en/mysql-real-connect.html) ao se conectar ao [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), o valor de affected-rows é 1 (não 0) se uma linha existente for definida com seus valores atuais.

Se uma tabela contiver uma coluna `AUTO_INCREMENT` e [`INSERT ... ON DUPLICATE KEY UPDATE`](insert-on-duplicate.html "13.2.5.2 INSERT ... ON DUPLICATE KEY UPDATE Statement") inserir ou atualizar uma linha, a função [`LAST_INSERT_ID()`](information-functions.html#function_last-insert-id) retorna o valor `AUTO_INCREMENT`.

A cláusula `ON DUPLICATE KEY UPDATE` pode conter múltiplas atribuições de coluna, separadas por vírgulas.

É possível usar `IGNORE` com `ON DUPLICATE KEY UPDATE` em uma instrução `INSERT`, mas isso pode não se comportar como esperado ao inserir múltiplas linhas em uma tabela que possui múltiplas unique keys. Isso se torna aparente quando um valor atualizado é, ele próprio, um valor de duplicate key. Considere a tabela `t`, criada e populada pelas instruções mostradas aqui:

```sql
mysql> CREATE TABLE t (a SERIAL, b BIGINT NOT NULL, UNIQUE KEY (b));;
Query OK, 0 rows affected (0.03 sec)

mysql> INSERT INTO t VALUES (1,1), (2,2);
Query OK, 2 rows affected (0.01 sec)
Records: 2  Duplicates: 0  Warnings: 0

mysql> SELECT * FROM t;
+---+---+
| a | b |
+---+---+
| 1 | 1 |
| 2 | 2 |
+---+---+
2 rows in set (0.00 sec)
```

Agora tentamos inserir duas linhas, uma das quais contém um valor de duplicate key, usando `ON DUPLICATE KEY UPDATE`, onde a própria cláusula `UPDATE` resulta em um valor de duplicate key:

```sql
mysql> INSERT INTO t VALUES (2,3), (3,3) ON DUPLICATE KEY UPDATE a=a+1, b=b-1;
ERROR 1062 (23000): Duplicate entry '1' for key 't.b'
mysql> SELECT * FROM t;
+---+---+
| a | b |
+---+---+
| 1 | 1 |
| 2 | 2 |
+---+---+
2 rows in set (0.00 sec)
```

A primeira linha contém um valor duplicado para uma das unique keys da tabela (coluna `a`), mas `b=b+1` na cláusula `UPDATE` resulta em uma violação de unique key para a coluna `b`; a instrução é imediatamente rejeitada com um erro, e nenhuma linha é atualizada. Vamos repetir a instrução, desta vez adicionando a palavra-chave **`IGNORE`**, assim:

```sql
mysql> INSERT IGNORE INTO t VALUES (2,3), (3,3)
    -> ON DUPLICATE KEY UPDATE a=a+1, b=b-1;
Query OK, 1 row affected, 1 warning (0.00 sec)
Records: 2  Duplicates: 1  Warnings: 1
```

Desta vez, o erro anterior é rebaixado para um warning, conforme mostrado aqui:

```sql
mysql> SHOW WARNINGS;
+---------+------+-----------------------------------+
| Level   | Code | Message                           |
+---------+------+-----------------------------------+
| Warning | 1062 | Duplicate entry '1' for key 't.b' |
+---------+------+-----------------------------------+
1 row in set (0.00 sec)
```

Como a instrução não foi rejeitada, a execução continua. Isso significa que a segunda linha é inserida em `t`, como podemos ver aqui:

```sql
mysql> SELECT * FROM t;
+---+---+
| a | b |
+---+---+
| 1 | 1 |
| 2 | 2 |
| 3 | 3 |
+---+---+
3 rows in set (0.00 sec)
```

Em expressões de valor de atribuição na cláusula `ON DUPLICATE KEY UPDATE`, você pode usar a função [`VALUES(col_name)`](miscellaneous-functions.html#function_values) para se referir aos valores de coluna da porção [`INSERT`](insert.html "13.2.5 INSERT Statement") da instrução [`INSERT ... ON DUPLICATE KEY UPDATE`](insert-on-duplicate.html "13.2.5.2 INSERT ... ON DUPLICATE KEY UPDATE Statement"). Em outras palavras, [`VALUES(col_name)`](miscellaneous-functions.html#function_values) na cláusula `ON DUPLICATE KEY UPDATE` refere-se ao valor de *`col_name`* que seria inserido, caso não tivesse ocorrido um conflito de duplicate-key. Esta função é especialmente útil em inserts de múltiplas linhas. A função [`VALUES()`](miscellaneous-functions.html#function_values) é significativa apenas como um introductor para listas de valores de instruções `INSERT`, ou na cláusula `ON DUPLICATE KEY UPDATE` de uma instrução [`INSERT`](insert.html "13.2.5 INSERT Statement"), e retorna `NULL` caso contrário. Por exemplo:

```sql
INSERT INTO t1 (a,b,c) VALUES (1,2,3),(4,5,6)
  ON DUPLICATE KEY UPDATE c=VALUES(a)+VALUES(b);
```

Essa instrução é idêntica às duas instruções a seguir:

```sql
INSERT INTO t1 (a,b,c) VALUES (1,2,3)
  ON DUPLICATE KEY UPDATE c=3;
INSERT INTO t1 (a,b,c) VALUES (4,5,6)
  ON DUPLICATE KEY UPDATE c=9;
```

Para instruções [`INSERT ... SELECT`](insert-on-duplicate.html "13.2.5.2 INSERT ... ON DUPLICATE KEY UPDATE Statement"), estas regras se aplicam em relação às formas aceitáveis de expressões de `SELECT` query às quais você pode se referir em uma cláusula `ON DUPLICATE KEY UPDATE`:

* Referências a colunas de queries em uma única tabela, que pode ser uma derived table.
* Referências a colunas de queries em um JOIN sobre múltiplas tabelas.
* Referências a colunas de queries `DISTINCT`.
* Referências a colunas em outras tabelas, desde que o [`SELECT`](select.html "13.2.9 SELECT Statement") não use `GROUP BY`. Um efeito colateral é que você deve qualificar referências a nomes de colunas não únicos.

Referências a colunas de um [`UNION`](union.html "13.2.9.3 UNION Clause") não funcionam de forma confiável. Para contornar essa restrição, reescreva o [`UNION`](union.html "13.2.9.3 UNION Clause") como uma derived table para que suas linhas possam ser tratadas como um result set de tabela única. Por exemplo, esta instrução pode produzir resultados incorretos:

```sql
INSERT INTO t1 (a, b)
  SELECT c, d FROM t2
  UNION
  SELECT e, f FROM t3
ON DUPLICATE KEY UPDATE b = b + c;
```

Em vez disso, use uma instrução equivalente que reescreve o [`UNION`](union.html "13.2.9.3 UNION Clause") como uma derived table:

```sql
INSERT INTO t1 (a, b)
SELECT * FROM
  (SELECT c, d FROM t2
   UNION
   SELECT e, f FROM t3) AS dt
ON DUPLICATE KEY UPDATE b = b + c;
```

A técnica de reescrever uma query como uma derived table também permite referências a colunas de queries `GROUP BY`.

Como os resultados das instruções [`INSERT ... SELECT`](insert-select.html "13.2.5.1 INSERT ... SELECT Statement") dependem da ordenação das linhas do [`SELECT`](select.html "13.2.9 SELECT Statement") e essa ordem nem sempre pode ser garantida, é possível que, ao logar instruções [`INSERT ... SELECT ON DUPLICATE KEY UPDATE`](insert-on-duplicate.html "13.2.5.2 INSERT ... ON DUPLICATE KEY UPDATE Statement"), a source e a replica divergirem. Assim, as instruções [`INSERT ... SELECT ON DUPLICATE KEY UPDATE`](insert-on-duplicate.html "13.2.5.2 INSERT ... ON DUPLICATE KEY UPDATE Statement") são sinalizadas como inseguras (unsafe) para replication baseada em statement (statement-based replication). Tais instruções produzem um warning no error log ao usar o modo statement-based e são escritas no binary log usando o formato row-based ao usar o modo `MIXED`. Uma instrução [`INSERT ... ON DUPLICATE KEY UPDATE`](insert-on-duplicate.html "13.2.5.2 INSERT ... ON DUPLICATE KEY UPDATE Statement") contra uma tabela que tenha mais de um unique ou primary key também é marcada como insegura (unsafe). (Bug #11765650, Bug #58637)

Veja também [Seção 16.2.1.1, “Vantagens e Desvantagens da Replication Baseada em Statement e Baseada em Row”](replication-sbr-rbr.html "16.2.1.1 Advantages and Disadvantages of Statement-Based and Row-Based Replication").

Um `INSERT ... ON DUPLICATE KEY UPDATE` em uma partitioned table que usa um storage engine como [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") e que emprega locks de nível de tabela (table-level locks) bloqueia quaisquer partitions da tabela nas quais uma coluna de partitioning key é atualizada. (Isso não ocorre com tabelas que usam storage engines como [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") que empregam row-level locking.) Para mais informações, veja [Section 22.6.4, “Partitioning and Locking”](partitioning-limitations-locking.html "22.6.4 Partitioning and Locking").