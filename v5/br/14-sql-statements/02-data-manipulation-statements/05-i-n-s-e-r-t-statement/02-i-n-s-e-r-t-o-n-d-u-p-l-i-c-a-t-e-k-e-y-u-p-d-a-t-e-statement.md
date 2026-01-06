#### 13.2.5.2. Inserir ... na declaração DUPLICATE KEY UPDATE

Se você especificar uma cláusula `ON DUPLICATE KEY UPDATE` e uma linha a ser inserida causaria um valor duplicado em um índice `UNIQUE` ou `PRIMARY KEY`, ocorre uma atualização (`UPDATE`) da linha antiga. Por exemplo, se a coluna `a` for declarada como `UNIQUE` e contiver o valor `1`, as seguintes duas instruções têm efeito semelhante:

```sql
INSERT INTO t1 (a,b,c) VALUES (1,2,3)
  ON DUPLICATE KEY UPDATE c=c+1;

UPDATE t1 SET c=c+1 WHERE a=1;
```

Os efeitos não são exatamente idênticos: para uma tabela `InnoDB` onde `a` é uma coluna de autoincremento, a instrução `INSERT` aumenta o valor de autoincremento, mas a `UPDATE`

Se a coluna `b` também for única, a instrução `INSERT` é equivalente a esta instrução `UPDATE`:

```sql
UPDATE t1 SET c=c+1 WHERE a=1 OR b=2 LIMIT 1;
```

Se `a=1 OU b=2` corresponder a várias linhas, apenas *uma* linha é atualizada. Em geral, você deve tentar evitar o uso de uma cláusula `ON DUPLICATE KEY UPDATE` em tabelas com múltiplos índices únicos.

Com `ON DUPLICATE KEY UPDATE`, o valor affected-rows por linha é 1 se a linha for inserida como uma nova linha, 2 se uma linha existente for atualizada e 0 se uma linha existente for definida com seus valores atuais. Se você especificar a flag `CLIENT_FOUND_ROWS` na função C API `mysql_real_connect()` ao se conectar ao **mysqld**, o valor affected-rows é 1 (e não 0) se uma linha existente for definida com seus valores atuais.

Se uma tabela contiver uma coluna `AUTO_INCREMENT` e a instrução `INSERT ... ON DUPLICATE KEY UPDATE` (insert-on-duplicate.html) inserir ou atualizar uma linha, a função `LAST_INSERT_ID()` (information-functions.html#function\_last-insert-id) retorna o valor `AUTO_INCREMENT`.

A cláusula `ON DUPLICATE KEY UPDATE` pode conter várias atribuições de coluna, separadas por vírgulas.

É possível usar `IGNORE` com `ON DUPLICATE KEY UPDATE` em uma instrução `INSERT`, mas isso pode não funcionar conforme o esperado ao inserir várias linhas em uma tabela que tem várias chaves únicas. Isso fica evidente quando um valor atualizado é ele mesmo um valor de chave duplicado. Considere a tabela `t`, criada e preenchida pelas instruções mostradas aqui:

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

Agora, tentamos inserir duas linhas, uma das quais contém um valor de chave duplicado, usando `ON DUPLICATE KEY UPDATE`, onde a própria cláusula `UPDATE` resulta em um valor de chave duplicado:

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

A primeira linha contém um valor duplicado para uma das chaves únicas da tabela (coluna `a`), mas `b=b+1` na cláusula `UPDATE` resulta em uma violação da chave única para a coluna `b`; a declaração é imediatamente rejeitada com um erro, e nenhuma linha é atualizada. Vamos repetir a declaração, desta vez adicionando a palavra-chave **`IGNORE`**, assim:

```sql
mysql> INSERT IGNORE INTO t VALUES (2,3), (3,3)
    -> ON DUPLICATE KEY UPDATE a=a+1, b=b-1;
Query OK, 1 row affected, 1 warning (0.00 sec)
Records: 2  Duplicates: 1  Warnings: 1
```

Desta vez, o erro anterior é rebaixado a um aviso, conforme mostrado aqui:

```sql
mysql> SHOW WARNINGS;
+---------+------+-----------------------------------+
| Level   | Code | Message                           |
+---------+------+-----------------------------------+
| Warning | 1062 | Duplicate entry '1' for key 't.b' |
+---------+------+-----------------------------------+
1 row in set (0.00 sec)
```

Como a declaração não foi rejeitada, a execução continua. Isso significa que a segunda linha é inserida em `t`, como podemos ver aqui:

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

Em expressões de valor de atribuição na cláusula `ON DUPLICATE KEY UPDATE`, você pode usar a função `VALUES(col_name)` para referenciar os valores das colunas da parte `INSERT` da declaração `INSERT ... ON DUPLICATE KEY UPDATE` (insert-on-duplicate.html). Em outras palavras, `VALUES(col_name)` na cláusula `ON DUPLICATE KEY UPDATE` refere-se ao valor de *`col_name`* que seria inserido, se não houvesse conflito de chave duplicada. Essa função é especialmente útil em inserções de múltiplas linhas. A função `VALUES()` só tem significado como introdução para listas de valores de declarações `INSERT`, ou na cláusula `ON DUPLICATE KEY UPDATE` de uma declaração `INSERT` (insert.html), e retorna `NULL` caso contrário. Por exemplo:

```sql
INSERT INTO t1 (a,b,c) VALUES (1,2,3),(4,5,6)
  ON DUPLICATE KEY UPDATE c=VALUES(a)+VALUES(b);
```

Essa afirmação é idêntica às seguintes duas afirmações:

```sql
INSERT INTO t1 (a,b,c) VALUES (1,2,3)
  ON DUPLICATE KEY UPDATE c=3;
INSERT INTO t1 (a,b,c) VALUES (4,5,6)
  ON DUPLICATE KEY UPDATE c=9;
```

Para as instruções `INSERT ... SELECT`, essas regras se aplicam às formas aceitáveis de expressões de consulta `SELECT` que você pode referenciar em uma cláusula `ON DUPLICATE KEY UPDATE`:

- Referências a colunas de consultas em uma única tabela, que pode ser uma tabela derivada.

- Referências a colunas de consultas em uma junção entre várias tabelas.

- Referências a colunas de consultas `DISTINCT`.

- Referências a colunas em outras tabelas, desde que o `SELECT` não use `GROUP BY`. Um efeito colateral é que você deve qualificar referências a nomes de colunas não únicos.

As referências a colunas de uma `UNION` não funcionam de forma confiável. Para contornar essa restrição, reescreva a `UNION` como uma tabela derivada, para que suas linhas possam ser tratadas como um conjunto de resultados de uma única tabela. Por exemplo, essa declaração pode produzir resultados incorretos:

```sql
INSERT INTO t1 (a, b)
  SELECT c, d FROM t2
  UNION
  SELECT e, f FROM t3
ON DUPLICATE KEY UPDATE b = b + c;
```

Em vez disso, use uma declaração equivalente que reescreva a `UNION` (union.html) como uma tabela derivada:

```sql
INSERT INTO t1 (a, b)
SELECT * FROM
  (SELECT c, d FROM t2
   UNION
   SELECT e, f FROM t3) AS dt
ON DUPLICATE KEY UPDATE b = b + c;
```

A técnica de reescrever uma consulta como uma tabela derivada também permite referências a colunas de consultas `GROUP BY`.

Como os resultados das instruções `INSERT ... SELECT` dependem da ordem das linhas do `SELECT` e essa ordem nem sempre pode ser garantida, é possível que, ao registrar instruções `INSERT ... SELECT ON DUPLICATE KEY UPDATE` para a fonte e a replica divergirem. Assim, as instruções `INSERT ... SELECT ON DUPLICATE KEY UPDATE` são marcadas como inseguras para a replicação baseada em instruções. Essas instruções produzem um aviso no log de erro ao usar o modo baseado em instruções e são escritas no log binário usando o formato baseado em linha ao usar o modo `MIXED`. Uma instrução `INSERT ... ON DUPLICATE KEY UPDATE` contra uma tabela com mais de uma chave única ou primária também é marcada como insegura. (Bug #11765650, Bug #58637)

Veja também Seção 16.2.1.1, “Vantagens e desvantagens da replicação baseada em declarações e baseada em linhas”.

Uma instrução `INSERT ... ON DUPLICATE KEY UPDATE` em uma tabela particionada usando um mecanismo de armazenamento como `MyISAM` que emprega bloqueios de nível de tabela bloqueia quaisquer particionamentos da tabela em que uma coluna de chave de particionamento é atualizada. (Isso não ocorre com tabelas que usam mecanismos de armazenamento como `InnoDB` que empregam bloqueios de nível de linha.) Para mais informações, consulte Seção 22.6.4, “Particionamento e Bloqueio”.
