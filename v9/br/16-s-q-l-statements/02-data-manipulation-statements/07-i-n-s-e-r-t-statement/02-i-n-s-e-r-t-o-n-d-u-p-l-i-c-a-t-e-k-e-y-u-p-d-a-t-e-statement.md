#### 15.2.7.2 Instrução `INSERT ... ON DUPLICATE KEY UPDATE`

Se você especificar uma cláusula `ON DUPLICATE KEY UPDATE` e uma linha a ser inserida causaria um valor duplicado em um índice `UNIQUE` ou `PRIMARY KEY`, ocorre uma `UPDATE` da linha antiga. Por exemplo, se a coluna `a` for declarada como `UNIQUE` e contiver o valor `1`, as seguintes duas instruções têm efeito semelhante:

```
INSERT INTO t1 (a,b,c) VALUES (1,2,3)
  ON DUPLICATE KEY UPDATE c=c+1;

UPDATE t1 SET c=c+1 WHERE a=1;
```

Os efeitos não são exatamente idênticos: Para uma tabela `InnoDB` onde `a` é uma coluna de autoincremento, a instrução `INSERT` aumenta o valor de autoincremento, mas a `UPDATE` não.

Se a coluna `b` também for única, a `INSERT` é equivalente a esta instrução `UPDATE`:

```
UPDATE t1 SET c=c+1 WHERE a=1 OR b=2 LIMIT 1;
```

Se `a=1 OR b=2` corresponder a várias linhas, apenas *uma* linha é atualizada. Geralmente, você deve tentar evitar usar uma cláusula `ON DUPLICATE KEY UPDATE` em tabelas com vários índices únicos.

Com `ON DUPLICATE KEY UPDATE`, o valor `affected_rows` por linha é 1 se a linha for inserida como uma nova linha, 2 se uma linha existente for atualizada e 0 se uma linha existente for definida com seus valores atuais. Se você especificar o sinalizador `CLIENT_FOUND_ROWS` para a função `mysql_real_connect()` da API C ao se conectar ao **mysqld**, o valor `affected_rows` é 1 (não 0) se uma linha existente for definida com seus valores atuais.

Se uma tabela contiver uma coluna `AUTO_INCREMENT` e a `INSERT ... ON DUPLICATE KEY UPDATE` inserir ou atualizar uma linha, a função `LAST_INSERT_ID()` retorna o valor `AUTO_INCREMENT`.

A cláusula `ON DUPLICATE KEY UPDATE` pode conter múltiplas atribuições de coluna, separadas por vírgulas.

É possível usar `IGNORE` com `ON DUPLICATE KEY UPDATE` em uma instrução `INSERT`, mas isso pode não funcionar como esperado ao inserir várias linhas em uma tabela que tem várias chaves únicas. Isso fica claro quando um valor atualizado é ele mesmo um valor de chave duplicado. Considere a tabela `t`, criada e preenchida pelas instruções mostradas aqui:

```
mysql> CREATE TABLE t (a SERIAL, b BIGINT NOT NULL, UNIQUE KEY (b));;
Query OK, 0 rows affected (0.03 sec)

mysql> INSERT INTO t VALUES ROW(1,1), ROW(2,2);
Query OK, 2 rows affected (0.01 sec)
Records: 2  Duplicates: 0  Warnings: 0

mysql> TABLE t;
+---+---+
| a | b |
+---+---+
| 1 | 1 |
| 2 | 2 |
+---+---+
2 rows in set (0.00 sec)
```

Agora, tentamos inserir duas linhas, uma das quais contém um valor de chave duplicado, usando `ON DUPLICATE KEY UPDATE`, onde a própria cláusula `UPDATE` resulta em um valor de chave duplicado:

```
mysql> INSERT INTO t VALUES ROW(2,3), ROW(3,3) ON DUPLICATE KEY UPDATE a=a+1, b=b-1;
ERROR 1062 (23000): Duplicate entry '1' for key 't.b'
mysql> TABLE t;
+---+---+
| a | b |
+---+---+
| 1 | 1 |
| 2 | 2 |
+---+---+
2 rows in set (0.00 sec)
```

A primeira linha contém um valor duplicado para uma das chaves únicas da tabela (coluna `a`), mas `b=b+1` na cláusula `UPDATE` resulta em uma violação de chave única para a coluna `b`; a instrução é imediatamente rejeitada com um erro, e nenhuma linha é atualizada. Vamos repetir a instrução, desta vez adicionando a palavra-chave **`IGNORE`**, assim:

```
mysql> INSERT IGNORE INTO t VALUES ROW(2,3), ROW(3,3)
    -> ON DUPLICATE KEY UPDATE a=a+1, b=b-1;
Query OK, 1 row affected, 1 warning (0.00 sec)
Records: 2  Duplicates: 1  Warnings: 1
```

Desta vez, o erro anterior é degradado para um aviso, como mostrado aqui:

```
mysql> SHOW WARNINGS;
+---------+------+-----------------------------------+
| Level   | Code | Message                           |
+---------+------+-----------------------------------+
| Warning | 1062 | Duplicate entry '1' for key 't.b' |
+---------+------+-----------------------------------+
1 row in set (0.00 sec)
```

Como a instrução não foi rejeitada, a execução continua. Isso significa que a segunda linha é inserida em `t`, como podemos ver aqui:

```
mysql> TABLE t;
+---+---+
| a | b |
+---+---+
| 1 | 1 |
| 2 | 2 |
| 3 | 3 |
+---+---+
3 rows in set (0.00 sec)
```

Em expressões de valor de atribuição na cláusula `ON DUPLICATE KEY UPDATE`, você pode usar a função `VALUES(col_name)` para referenciar os valores de coluna da parte `INSERT` da declaração `INSERT ... ON DUPLICATE KEY UPDATE`. Em outras palavras, `VALUES(col_name)` na cláusula `ON DUPLICATE KEY UPDATE` refere-se ao valor de *`col_name`* que seria inserido, se não houvesse conflito de chave duplicada. Essa função é especialmente útil em inserções de múltiplas linhas. A função `VALUES()` é significativa apenas como introdução para listas de valores de declaração `INSERT`, ou na cláusula `ON DUPLICATE KEY UPDATE` de uma declaração `INSERT`, e retorna `NULL` caso contrário. Por exemplo:

```
INSERT INTO t1 (a,b,c) VALUES (1,2,3),(4,5,6)
  ON DUPLICATE KEY UPDATE c=VALUES(a)+VALUES(b);
```

Essa declaração é idêntica às seguintes duas declarações:

```
INSERT INTO t1 (a,b,c) VALUES (1,2,3)
  ON DUPLICATE KEY UPDATE c=3;
INSERT INTO t1 (a,b,c) VALUES (4,5,6)
  ON DUPLICATE KEY UPDATE c=9;
```

Observação

O uso de `VALUES()` para referenciar a nova linha e colunas é desaconselhável e está sujeito à remoção em uma versão futura do MySQL. Em vez disso, use aliases de linha e coluna, conforme descrito nos próximos parágrafos desta seção.

É possível usar um alias para a linha, com, opcionalmente, uma ou mais de suas colunas a serem inseridas, seguindo a cláusula `VALUES` ou `SET`, e precedida pela palavra-chave `AS`. Usando o alias de linha `new`, a declaração mostrada anteriormente usando `VALUES()` para acessar os novos valores de coluna pode ser escrita na forma mostrada aqui:

```
INSERT INTO t1 (a,b,c) VALUES (1,2,3),(4,5,6) AS new
  ON DUPLICATE KEY UPDATE c = new.a+new.b;
```

Se, além disso, você usar os aliases de coluna `m`, `n` e `p`, você pode omitir o alias de linha na cláusula de atribuição e escrever a mesma declaração assim:

```
INSERT INTO t1 (a,b,c) VALUES (1,2,3),(4,5,6) AS new(m,n,p)
  ON DUPLICATE KEY UPDATE c = m+n;
```

Ao usar aliases de coluna dessa maneira, você ainda deve usar um alias de linha após a cláusula `VALUES`, mesmo que não faça uso direto dele na cláusula de atribuição.

Uma instrução `INSERT ... SELECT ... ON DUPLICATE KEY UPDATE` que usa `VALUES()` na cláusula `UPDATE`, como esta, lança uma mensagem de aviso:

```
INSERT INTO t1
  SELECT c, c+d FROM t2
  ON DUPLICATE KEY UPDATE b = VALUES(b);
```

Você pode eliminar esses avisos usando uma subconsulta em vez disso, como este:

```
INSERT INTO t1
  SELECT * FROM (SELECT c, c+d AS e FROM t2) AS dt
  ON DUPLICATE KEY UPDATE b = e;
```

Você também pode usar aliases de linha e coluna com uma cláusula `SET`, como mencionado anteriormente. Empregar `SET` em vez de `VALUES` nas duas instruções `INSERT ... ON DUPLICATE KEY UPDATE` mostradas pode ser feito como mostrado aqui:

```
INSERT INTO t1 SET a=1,b=2,c=3 AS new
  ON DUPLICATE KEY UPDATE c = new.a+new.b;

INSERT INTO t1 SET a=1,b=2,c=3 AS new(m,n,p)
  ON DUPLICATE KEY UPDATE c = m+n;
```

O alias de linha não deve ser o mesmo que o nome da tabela. Se aliases de coluna não forem usados, ou se forem os mesmos que os nomes das colunas, eles devem ser distinguidos usando o alias de linha na cláusula `ON DUPLICATE KEY UPDATE`. Os aliases de coluna devem ser únicos em relação ao alias de linha ao qual se aplicam (ou seja, nenhum alias de coluna que faça referência a colunas da mesma linha pode ser o mesmo).

Para instruções `INSERT ... SELECT`, essas regras se aplicam em relação às formas aceitáveis de expressões de consulta `SELECT` que você pode referenciar em uma cláusula `ON DUPLICATE KEY UPDATE`:

* Referências a colunas de consultas em uma única tabela, que pode ser uma tabela derivada.

* Referências a colunas de consultas em uma junção em várias tabelas.

* Referências a colunas de consultas `DISTINCT`.

* Referências a colunas em outras tabelas, desde que o `SELECT` não use `GROUP BY`. Um efeito colateral é que você deve qualificar referências a nomes de colunas não únicos.

Referências a colunas de uma `UNION` não são suportadas. Para contornar essa restrição, reescreva a `UNION` como uma tabela derivada para que suas linhas possam ser tratadas como um conjunto de resultados de uma única tabela. Por exemplo, esta instrução produz um erro:

```
INSERT INTO t1 (a, b)
  SELECT c, d FROM t2
  UNION
  SELECT e, f FROM t3
ON DUPLICATE KEY UPDATE b = b + c;
```

Em vez disso, use uma instrução equivalente que reescreva a `UNION` como uma tabela derivada:

```
INSERT INTO t1 (a, b)
SELECT * FROM
  (SELECT c, d FROM t2
   UNION
   SELECT e, f FROM t3) AS dt
ON DUPLICATE KEY UPDATE b = b + c;
```

A técnica de reescrever uma consulta como uma tabela derivada também permite referências a colunas de consultas `GROUP BY`.

Como os resultados das instruções `INSERT ... SELECT` dependem da ordem das linhas da consulta `SELECT` e essa ordem nem sempre pode ser garantida, é possível que, ao registrar as instruções `INSERT ... SELECT ON DUPLICATE KEY UPDATE` para a fonte e a replica, elas divergirem. Assim, as instruções `INSERT ... SELECT ON DUPLICATE KEY UPDATE` são marcadas como inseguras para a replicação baseada em instruções. Essas instruções produzem um aviso no log de erro ao usar o modo baseado em instruções e são escritas no log binário usando o formato baseado em linha ao usar o modo `MIXED`. Uma instrução `INSERT ... ON DUPLICATE KEY UPDATE` contra uma tabela com mais de uma chave única ou primária também é marcada como insegura. (Bug #11765650, Bug #58637)

Veja também a Seção 19.2.1.1, “Vantagens e Desvantagens da Replicação Baseada em Instruções e Baseada em Linhas”.