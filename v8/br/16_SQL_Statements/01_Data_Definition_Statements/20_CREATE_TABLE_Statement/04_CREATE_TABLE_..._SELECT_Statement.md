#### 15.1.20.4 CRIAR Tabela ... Instrução SELECT

Você pode criar uma tabela a partir de outra adicionando uma declaração `SELECT` no final da declaração `CREATE TABLE`:

```
CREATE TABLE new_tbl [AS] SELECT * FROM orig_tbl;
```

O MySQL cria novas colunas para todos os elementos no `SELECT`. Por exemplo:

```
mysql> CREATE TABLE test (a INT NOT NULL AUTO_INCREMENT,
    ->        PRIMARY KEY (a), KEY(b))
    ->        ENGINE=InnoDB SELECT b,c FROM test2;
```

Isso cria uma tabela `InnoDB` com três colunas, `a`, `b` e `c`. A opção `ENGINE` faz parte da declaração `CREATE TABLE`, e não deve ser usada após `SELECT`; isso resultaria em um erro de sintaxe. O mesmo vale para outras opções `CREATE TABLE`, como `CHARSET`.

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

Para cada linha da tabela `foo`, uma linha é inserida na tabela `bar` com os valores da tabela `foo` e valores padrão para as novas colunas.

Em uma tabela resultante de `CREATE TABLE ... SELECT`, as colunas nomeadas apenas na parte `CREATE TABLE` vêm primeiro. As colunas nomeadas em ambas as partes ou apenas na parte `SELECT` vêm depois. O tipo de dados das colunas `SELECT` pode ser alterado especificando também a coluna na parte `CREATE TABLE`.

Se ocorrerem erros durante a cópia de dados para a tabela, a tabela será automaticamente excluída e não criada. No entanto, antes do MySQL 8.0.21, quando a replicação baseada em linhas estiver em uso, uma declaração `CREATE TABLE ... SELECT` será registrada no log binário como duas transações, uma para criar a tabela e outra para inserir dados. Quando a declaração é aplicada a partir do log binário, uma falha entre as duas transações ou durante a cópia de dados pode resultar na replicação de uma tabela vazia. Essa limitação é removida no MySQL 8.0.21. Em motores de armazenamento que suportam DDL atômico, `CREATE TABLE ... SELECT` agora é registrado e aplicado como uma única transação quando a replicação baseada em linhas estiver em uso. Para mais informações, consulte a Seção 15.1.1, “Suporte à Declaração de Definição de Dados Atômicos”.

A partir do MySQL 8.0.21, em motores de armazenamento que suportam DDL atômico e restrições de chave estrangeira, a criação de chaves estrangeiras não é permitida em instruções `CREATE TABLE ... SELECT` quando a replicação baseada em linhas está em uso. As restrições de chave estrangeira podem ser adicionadas posteriormente usando `ALTER TABLE`.

Você pode preceder `SELECT` com `IGNORE` ou `REPLACE` para indicar como lidar com linhas que duplicam valores de chave única. Com `IGNORE`, linhas que duplicam uma linha existente em um valor de chave única são descartadas. Com `REPLACE`, novas linhas substituem linhas que têm o mesmo valor de chave única. Se nenhum dos valores de `IGNORE` ou `REPLACE` for especificado, valores de chave única duplicados resultam em um erro. Para mais informações, consulte O efeito de IGNORE na execução da declaração.

No MySQL 8.0.19 e versões posteriores, você também pode usar uma instrução `VALUES` na parte `SELECT` de `CREATE TABLE ... SELECT`; a parte `VALUES` da instrução deve incluir um alias de tabela usando uma cláusula `AS`. Para nomear as colunas provenientes de `VALUES`, forneça aliases de coluna com o alias da tabela; caso contrário, os nomes de coluna padrão `column_0`, `column_1`, `column_2`, ..., são usados.

Caso contrário, o nome das colunas na tabela criada segue as mesmas regras descritas anteriormente nesta seção. Exemplos:

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

Ao selecionar todas as colunas e usar os nomes de colunas padrão, você pode omitir `SELECT *`, então a declaração usada para criar a tabela `tv1` também pode ser escrita da seguinte forma:

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

Ao usar `VALUES` como a fonte do `SELECT`, todas as colunas são sempre selecionadas para a nova tabela, e colunas individuais não podem ser selecionadas, pois podem ser quando selecionadas de uma tabela nomeada; cada uma das seguintes declarações produz um erro (`ER_OPERAND_COLUMNS`):

```
CREATE TABLE tvx
    SELECT (x,z) FROM (VALUES ROW(1,3,5), ROW(2,4,6)) AS v(x,y,z);

CREATE TABLE tvx (a INT, c INT)
    SELECT (x,z) FROM (VALUES ROW(1,3,5), ROW(2,4,6)) AS v(x,y,z);
```

Da mesma forma, você pode usar uma declaração `TABLE` no lugar da `SELECT`. Isso segue as mesmas regras que com `VALUES`; todas as colunas da tabela de origem e seus nomes na tabela de origem são sempre inseridos na nova tabela. Exemplos:

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

Como a ordem das linhas nas declarações subjacentes `SELECT` nem sempre pode ser determinada, as declarações `CREATE TABLE ... IGNORE SELECT` e `CREATE TABLE ... REPLACE SELECT` são marcadas como inseguras para a replicação baseada em declarações. Essas declarações produzem um aviso no log de erros ao usar o modo baseado em declarações e são escritas no log binário usando o formato baseado em linhas ao usar o modo `MIXED`. Veja também a Seção 19.2.1.1, “Vantagens e Desvantagens da Replicação Baseada em Declarações e Baseada em Linhas”.

`CREATE TABLE ... SELECT` não cria automaticamente nenhum índice para você. Isso é feito intencionalmente para tornar a declaração o mais flexível possível. Se você quiser ter índices na tabela criada, deve especificar esses índices antes da declaração `SELECT`:

```
mysql> CREATE TABLE bar (UNIQUE (n)) SELECT n FROM foo;
```

Para `CREATE TABLE ... SELECT`, a tabela de destino não preserva informações sobre se as colunas da tabela selecionada são colunas geradas. A parte `SELECT` da declaração não pode atribuir valores às colunas geradas na tabela de destino.

Para `CREATE TABLE ... SELECT`, a tabela de destino preserva os valores padrão de expressão da tabela original.

Pode ocorrer alguma conversão de tipos de dados. Por exemplo, o atributo `AUTO_INCREMENT` não é preservado, e as colunas `VARCHAR` podem se tornar colunas `CHAR`. Os atributos retreinados são `NULL` (ou `NOT NULL`) e, para aquelas colunas que os possuem, `CHARACTER SET`, `COLLATION`, `COMMENT` e a cláusula `DEFAULT`.

Ao criar uma tabela com `CREATE TABLE ... SELECT`, certifique-se de aliasar quaisquer chamadas de função ou expressões na consulta. Caso contrário, a instrução `CREATE` pode falhar ou resultar em nomes de colunas indesejados.

```
CREATE TABLE artists_and_works
  SELECT artist.name, COUNT(work.artist_id) AS number_of_works
  FROM artist LEFT JOIN work ON artist.id = work.artist_id
  GROUP BY artist.id;
```

Você também pode especificar explicitamente o tipo de dado para uma coluna na tabela criada:

```
CREATE TABLE foo (a TINYINT NOT NULL) SELECT b+1 AS a FROM bar;
```

Para `CREATE TABLE ... SELECT`, se `IF NOT EXISTS` for fornecido e a tabela de destino existir, nada é inserido na tabela de destino e a instrução não é registrada.

Para garantir que o log binário possa ser usado para recriar as tabelas originais, o MySQL não permite inserções concorrentes durante o `CREATE TABLE ... SELECT`. No entanto, antes do MySQL 8.0.21, quando uma operação `CREATE TABLE ... SELECT` é aplicada a partir do log binário quando a replicação baseada em linhas está em uso, inserções concorrentes são permitidas na tabela replicada durante a cópia de dados. Essa limitação é removida no MySQL 8.0.21 em motores de armazenamento que suportam a declaração de definição de dados atômica. Para mais informações, consulte a Seção 15.1.1, “Suporte à Declaração de Definição de Dados Atômica”.

Você não pode usar `FOR UPDATE` como parte do `SELECT` em uma declaração como `CREATE TABLE new_table SELECT ... FROM old_table ...`. Se você tentar fazer isso, a declaração falhará.

As operações `CREATE TABLE ... SELECT` aplicam os valores `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` apenas às colunas. Os valores de tabela e índice `ENGINE_ATTRIBUTE` e `SECONDARY_ENGINE_ATTRIBUTE` não são aplicados à nova tabela, a menos que sejam especificados explicitamente.
