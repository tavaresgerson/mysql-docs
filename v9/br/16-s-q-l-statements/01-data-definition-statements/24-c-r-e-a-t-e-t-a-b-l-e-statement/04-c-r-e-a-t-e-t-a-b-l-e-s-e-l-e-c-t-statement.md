#### 15.1.24.4 Criar uma tabela a partir de uma declaração `CREATE TABLE ... SELECT`

Você pode criar uma tabela a partir de outra adicionando uma declaração `SELECT` no final da declaração `CREATE TABLE`:

```
CREATE TABLE new_tbl [AS] SELECT * FROM orig_tbl;
```

O MySQL cria novas colunas para todos os elementos na `SELECT`. Por exemplo:

```
mysql> CREATE TABLE test (a INT NOT NULL AUTO_INCREMENT,
    ->        PRIMARY KEY (a), KEY(b))
    ->        ENGINE=InnoDB SELECT b,c FROM test2;
```

Isso cria uma tabela `InnoDB` com três colunas, `a`, `b` e `c`. A opção `ENGINE` faz parte da declaração `CREATE TABLE` e não deve ser usada após a `SELECT`; isso resultaria em um erro de sintaxe. O mesmo vale para outras opções de `CREATE TABLE`, como `CHARSET`.

Observe que as colunas da declaração `SELECT` são anexadas ao lado direito da tabela, e não sobrepostas sobre ela. Veja o exemplo a seguir:

```
mysql> SELECT * FROM foo;
+---+
| n |
+---+
| 1 |
+---+

mysql> CREATE TABLE bar (m INT) SELECT n FROM foo;
Query OK, 1 row affected (0.02 sec)
Records: 1  Duplicates: 0  Warnings: 0

mysql> SELECT * FROM bar;
+------+---+
| m    | n |
+------+---+
| NULL | 1 |
+------+---+
1 row in set (0.00 sec)
```

Para cada linha da tabela `foo`, uma linha é inserida na `bar` com os valores de `foo` e valores padrão para as novas colunas.

Em uma tabela resultante de `CREATE TABLE ... SELECT`, as colunas nomeadas apenas na parte `CREATE TABLE` vêm primeiro. Colunas nomeadas tanto na parte `CREATE TABLE` quanto na parte `SELECT` vêm depois. O tipo de dados das colunas `SELECT` pode ser sobrescrito especificando a coluna na parte `CREATE TABLE`.

Para motores de armazenamento que suportam DDL atômico e restrições de chave estrangeira, a criação de chaves estrangeiras não é permitida em declarações `CREATE TABLE ... SELECT` quando a replicação baseada em linhas está em uso. Restrições de chave estrangeira podem ser adicionadas mais tarde usando `ALTER TABLE`.

Você pode preceder o `SELECT` com `IGNORE` ou `REPLACE` para indicar como lidar com linhas que duplicam valores de chave única. Com `IGNORE`, as linhas que duplicam uma linha existente em um valor de chave única são descartadas. Com `REPLACE`, novas linhas substituem linhas que têm o mesmo valor de chave única. Se nenhum `IGNORE` ou `REPLACE` for especificado, valores de chave única duplicados resultam em um erro. Para mais informações, consulte O efeito de IGNORE na execução da declaração.

Você também pode usar uma declaração `VALUES` na parte `SELECT` de `CREATE TABLE ... SELECT`; a parte `VALUES` da declaração deve incluir um alias de tabela usando uma cláusula `AS`. Para nomear as colunas provenientes de `VALUES`, forneça aliases de coluna com o alias da tabela; caso contrário, os nomes de coluna padrão `column_0`, `column_1`, `column_2`, ..., são usados.

Caso contrário, o nome das colunas na tabela assim criada segue as mesmas regras descritas anteriormente nesta seção. Exemplos:

```
mysql> CREATE TABLE tv1
     >     SELECT * FROM (VALUES ROW(1,3,5), ROW(2,4,6)) AS v;
mysql> TABLE tv1;
+----------+----------+----------+
| column_0 | column_1 | column_2 |
+----------+----------+----------+
|        1 |        3 |        5 |
|        2 |        4 |        6 |
+----------+----------+----------+

mysql> CREATE TABLE tv2
     >     SELECT * FROM (VALUES ROW(1,3,5), ROW(2,4,6)) AS v(x,y,z);
mysql> TABLE tv2;
+---+---+---+
| x | y | z |
+---+---+---+
| 1 | 3 | 5 |
| 2 | 4 | 6 |
+---+---+---+

mysql> CREATE TABLE tv3 (a INT, b INT, c INT)
     >     SELECT * FROM (VALUES ROW(1,3,5), ROW(2,4,6)) AS v(x,y,z);
mysql> TABLE tv3;
+------+------+------+----------+----------+----------+
| a    | b    | c    |        x |        y |        z |
+------+------+------+----------+----------+----------+
| NULL | NULL | NULL |        1 |        3 |        5 |
| NULL | NULL | NULL |        2 |        4 |        6 |
+------+------+------+----------+----------+----------+

mysql> CREATE TABLE tv4 (a INT, b INT, c INT)
     >     SELECT * FROM (VALUES ROW(1,3,5), ROW(2,4,6)) AS v(x,y,z);
mysql> TABLE tv4;
+------+------+------+---+---+---+
| a    | b    | c    | x | y | z |
+------+------+------+---+---+---+
| NULL | NULL | NULL | 1 | 3 | 5 |
| NULL | NULL | NULL | 2 | 4 | 6 |
+------+------+------+---+---+---+

mysql> CREATE TABLE tv5 (a INT, b INT, c INT)
     >     SELECT * FROM (VALUES ROW(1,3,5), ROW(2,4,6)) AS v(a,b,c);
mysql> TABLE tv5;
+------+------+------+
| a    | b    | c    |
+------+------+------+
|    1 |    3 |    5 |
|    2 |    4 |    6 |
+------+------+------+
```

Ao selecionar todas as colunas e usar os nomes de coluna padrão, você pode omitir `SELECT *`, então a declaração usada para criar a tabela `tv1` também pode ser escrita como mostrado aqui:

```
mysql> CREATE TABLE tv1 VALUES ROW(1,3,5), ROW(2,4,6);
mysql> TABLE tv1;
+----------+----------+----------+
| column_0 | column_1 | column_2 |
+----------+----------+----------+
|        1 |        3 |        5 |
|        2 |        4 |        6 |
+----------+----------+----------+
```

Ao usar `VALUES` como a fonte do `SELECT`, todas as colunas são sempre selecionadas para a nova tabela, e colunas individuais não podem ser selecionadas como podem ser ao selecionar de uma tabela nomeada; cada uma das seguintes declarações produz um erro (`ER_OPERAND_COLUMNS`):

```
CREATE TABLE tvx
    SELECT (x,z) FROM (VALUES ROW(1,3,5), ROW(2,4,6)) AS v(x,y,z);

CREATE TABLE tvx (a INT, c INT)
    SELECT (x,z) FROM (VALUES ROW(1,3,5), ROW(2,4,6)) AS v(x,y,z);
```

Da mesma forma, você pode usar uma declaração `TABLE` no lugar do `SELECT`. Isso segue as mesmas regras que com `VALUES`; todas as colunas da tabela de origem e seus nomes na tabela de origem são sempre inseridos na nova tabela. Exemplos:

```
mysql> TABLE t1;
+----+----+
| a  | b  |
+----+----+
|  1 |  2 |
|  6 |  7 |
| 10 | -4 |
| 14 |  6 |
+----+----+

mysql> CREATE TABLE tt1 TABLE t1;
mysql> TABLE tt1;
+----+----+
| a  | b  |
+----+----+
|  1 |  2 |
|  6 |  7 |
| 10 | -4 |
| 14 |  6 |
+----+----+

mysql> CREATE TABLE tt2 (x INT) TABLE t1;
mysql> TABLE tt2;
+------+----+----+
| x    | a  | b  |
+------+----+----+
| NULL |  1 |  2 |
| NULL |  6 |  7 |
| NULL | 10 | -4 |
| NULL | 14 |  6 |
+------+----+----+
```

Como a ordem das linhas nas instruções `SELECT` subjacentes não pode ser determinada sempre, as instruções `CREATE TABLE ... IGNORE SELECT` e `CREATE TABLE ... REPLACE SELECT` são marcadas como inseguras para a replicação baseada em instruções. Tais instruções produzem um aviso no log de erro ao usar o modo baseado em instruções e são escritas no log binário usando o formato baseado em linha ao usar o modo `MIXED`. Veja também a Seção 19.2.1.1, “Vantagens e Desvantagens da Replicação Baseada em Instruções e Baseada em Linha”.

`CREATE TABLE ... SELECT` não cria automaticamente nenhum índice para você. Isso é feito intencionalmente para tornar a instrução o mais flexível possível. Se você quiser ter índices na tabela criada, deve especificar esses índices antes da instrução `SELECT`:

```
mysql> CREATE TABLE bar (UNIQUE (n)) SELECT n FROM foo;
```

Para `CREATE TABLE ... SELECT`, a tabela de destino não preserva informações sobre se as colunas da tabela selecionada são colunas geradas. A parte `SELECT` da instrução não pode atribuir valores a colunas geradas na tabela de destino.

Para `CREATE TABLE ... SELECT`, a tabela de destino preserva os valores padrão de expressão da tabela original.

Pode ocorrer alguma conversão de tipos de dados. Por exemplo, o atributo `AUTO_INCREMENT` não é preservado e as colunas `VARCHAR` podem se tornar colunas `CHAR`. Os atributos retreinados são `NULL` (ou `NOT NULL`) e, para aquelas colunas que os têm, `CHARACTER SET`, `COLLATION`, `COMMENT` e a cláusula `DEFAULT`.

Ao criar uma tabela com `CREATE TABLE ... SELECT`, certifique-se de aliasar quaisquer chamadas de função ou expressões na consulta. Se você não fizer isso, a instrução `CREATE` pode falhar ou resultar em nomes de colunas indesejáveis.

```
CREATE TABLE artists_and_works
  SELECT artist.name, COUNT(work.artist_id) AS number_of_works
  FROM artist LEFT JOIN work ON artist.id = work.artist_id
  GROUP BY artist.id;
```

Você também pode especificar explicitamente o tipo de dados para uma coluna na tabela criada:

```
CREATE TABLE foo (a TINYINT NOT NULL) SELECT b+1 AS a FROM bar;
```

Para `CREATE TABLE ... SELECT`, se `IF NOT EXISTS` for fornecido e a tabela de destino existir, nada é inserido na tabela de destino, e a declaração não é registrada.

Para garantir que o log binário possa ser usado para recriar as tabelas originais, o MySQL não permite inserções concorrentes durante `CREATE TABLE ... SELECT`. Para mais informações, consulte a Seção 15.1.1, “Suporte à Declaração de Definição de Dados Atômica”.

Você não pode usar `FOR UPDATE` como parte da cláusula `SELECT` em uma declaração como `CREATE TABLE new_table SELECT ... FROM old_table ...`. Se você tentar fazer isso, a declaração falhará.

As operações `CREATE TABLE ... SELECT` aplicam os valores de `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` às colunas. Os valores de `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` da tabela e do índice não são aplicados à nova tabela, a menos que sejam especificados explicitamente.