### 22.2.2 Partitioning por LIST

O partitioning por LIST no MySQL é similar ao partitioning por RANGE em muitos aspectos. Assim como no partitioning por `RANGE`, cada partition deve ser explicitamente definida. A principal diferença entre os dois tipos de partitioning é que, no partitioning por LIST, cada partition é definida e selecionada com base na associação de um valor de coluna em um de um conjunto de listas de valores (value lists), em vez de em um conjunto de ranges de valores contíguos. Isso é feito usando `PARTITION BY LIST(expr)` onde *`expr`* é um valor de coluna ou uma expression baseada em um valor de coluna e que retorna um valor inteiro, e então definindo cada partition por meio de um `VALUES IN (value_list)`, onde *`value_list`* é uma lista de inteiros separada por vírgulas.

Nota

No MySQL 5.7, é possível fazer a correspondência apenas com uma lista de inteiros (e possivelmente `NULL`— veja [Seção 22.2.7, “Como o Partitioning do MySQL Lida com NULL”](partitioning-handling-nulls.html "22.2.7 Como o Partitioning do MySQL Lida com NULL")) ao usar partitioning por `LIST`.

Entretanto, outros tipos de coluna podem ser usados em value lists ao empregar o partitioning `LIST COLUMN`, que é descrito mais adiante nesta seção.

Ao contrário do caso das partitions definidas por range, as list partitions não precisam ser declaradas em nenhuma ordem específica. Para informações sintáticas mais detalhadas, consulte [Seção 13.1.18, “Instrução CREATE TABLE”](create-table.html "13.1.18 Instrução CREATE TABLE").

Para os exemplos a seguir, assumimos que a definição básica da tabela a ser particionada é fornecida pela instrução [`CREATE TABLE`](create-table.html "13.1.18 Instrução CREATE TABLE") mostrada aqui:

```sql
CREATE TABLE employees (
    id INT NOT NULL,
    fname VARCHAR(30),
    lname VARCHAR(30),
    hired DATE NOT NULL DEFAULT '1970-01-01',
    separated DATE NOT NULL DEFAULT '9999-12-31',
    job_code INT,
    store_id INT
);
```

(Esta é a mesma tabela usada como base para os exemplos na [Seção 22.2.1, “Partitioning por RANGE”](partitioning-range.html "22.2.1 Partitioning por RANGE").)

Suponha que existam 20 videolocadoras distribuídas em 4 franquias, conforme mostrado na tabela a seguir.

<table summary="Um exemplo de 20 videolocadoras distribuídas em 4 franquias regionais, conforme descrito no texto anterior."><thead><tr> <th>Região</th> <th>Números de ID da Loja</th> </tr></thead><tbody><tr> <td>Norte</td> <td>3, 5, 6, 9, 17</td> </tr><tr> <td>Leste</td> <td>1, 2, 10, 11, 19, 20</td> </tr><tr> <td>Oeste</td> <td>4, 12, 13, 14, 18</td> </tr><tr> <td>Central</td> <td>7, 8, 15, 16</td> </tr> </tbody></table>

Para particionar esta tabela de forma que as linhas para lojas pertencentes à mesma região sejam armazenadas na mesma partition, você pode usar a instrução [`CREATE TABLE`](create-table.html "13.1.18 Instrução CREATE TABLE") mostrada aqui:

```sql
CREATE TABLE employees (
    id INT NOT NULL,
    fname VARCHAR(30),
    lname VARCHAR(30),
    hired DATE NOT NULL DEFAULT '1970-01-01',
    separated DATE NOT NULL DEFAULT '9999-12-31',
    job_code INT,
    store_id INT
)
PARTITION BY LIST(store_id) (
    PARTITION pNorth VALUES IN (3,5,6,9,17),
    PARTITION pEast VALUES IN (1,2,10,11,19,20),
    PARTITION pWest VALUES IN (4,12,13,14,18),
    PARTITION pCentral VALUES IN (7,8,15,16)
);
```

Isso torna fácil adicionar ou remover registros de funcionários relacionados a regiões específicas na tabela. Por exemplo, suponha que todas as lojas na região Oeste sejam vendidas para outra empresa. No MySQL 5.7, todas as linhas relacionadas a funcionários que trabalham em lojas dessa região podem ser excluídas com a Query `ALTER TABLE employees TRUNCATE PARTITION pWest`, que pode ser executada de forma muito mais eficiente do que a instrução [`DELETE`](delete.html "13.2.2 Instrução DELETE") equivalente `DELETE FROM employees WHERE store_id IN (4,12,13,14,18);`. (Usar `ALTER TABLE employees DROP PARTITION pWest` também excluiria todas essas linhas, mas também removeria a partition `pWest` da definição da tabela; você precisaria usar uma instrução `ALTER TABLE ... ADD PARTITION` para restaurar o esquema de partitioning original da tabela.)

Assim como no partitioning por `RANGE`, é possível combinar o partitioning por `LIST` com o partitioning por hash ou key para produzir um partitioning composto (subpartitioning). Consulte [Seção 22.2.6, “Subpartitioning”](partitioning-subpartitions.html "22.2.6 Subpartitioning").

Ao contrário do caso do partitioning por `RANGE`, não existe um "catch-all" (captura-tudo) como `MAXVALUE`; todos os valores esperados para a expression de partitioning devem ser cobertos nas cláusulas `PARTITION ... VALUES IN (...)`. Uma instrução [`INSERT`](insert.html "13.2.5 Instrução INSERT") contendo um valor de coluna de partitioning sem correspondência falha com um erro, conforme mostrado neste exemplo:

```sql
mysql> CREATE TABLE h2 (
    ->   c1 INT,
    ->   c2 INT
    -> )
    -> PARTITION BY LIST(c1) (
    ->   PARTITION p0 VALUES IN (1, 4, 7),
    ->   PARTITION p1 VALUES IN (2, 5, 8)
    -> );
Query OK, 0 rows affected (0.11 sec)

mysql> INSERT INTO h2 VALUES (3, 5);
ERROR 1525 (HY000): Table has no partition for value 3
```

Ao inserir múltiplas rows usando uma única instrução [`INSERT`](insert.html "13.2.5 Instrução INSERT"), o comportamento depende se a tabela utiliza um storage engine transacional. Para uma tabela [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), a instrução é considerada uma única transaction, portanto, a presença de quaisquer valores sem correspondência faz com que a instrução falhe completamente, e nenhuma row é inserida. Para uma tabela usando um storage engine não transacional, como [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine"), quaisquer rows que vierem antes da row contendo o valor sem correspondência são inseridas, mas as que vierem depois não são.

Você pode fazer com que este tipo de erro seja ignorado usando a keyword `IGNORE`, embora um warning seja emitido para cada row que contenha valores de coluna de partitioning sem correspondência, conforme mostrado aqui.

```sql
mysql> TRUNCATE h2;
Query OK, 1 row affected (0.00 sec)

mysql> TABLE h2;
Empty set (0.00 sec)

mysql> INSERT IGNORE INTO h2 VALUES (2, 5), (6, 10), (7, 5), (3, 1), (1, 9);
Query OK, 3 rows affected, 2 warnings (0.01 sec)
Records: 5  Duplicates: 2  Warnings: 2

mysql> SHOW WARNINGS;
+---------+------+------------------------------------+
| Level   | Code | Message                            |
+---------+------+------------------------------------+
| Warning | 1526 | Table has no partition for value 6 |
| Warning | 1526 | Table has no partition for value 3 |
+---------+------+------------------------------------+
2 rows in set (0.00 sec)
```

Você pode ver na saída da seguinte instrução [`TABLE`](/doc/refman/8.0/en/table.html) que as rows contendo valores de coluna de partitioning sem correspondência foram rejeitadas silenciosamente, enquanto as rows que não continham valores sem correspondência foram inseridas na tabela:

```sql
mysql> TABLE h2;
+------+------+
| c1   | c2   |
+------+------+
|    7 |    5 |
|    1 |    9 |
|    2 |    5 |
+------+------+
3 rows in set (0.00 sec)
```

O MySQL também oferece suporte ao partitioning `LIST COLUMNS`, uma variante do partitioning por `LIST` que permite usar colunas de tipos diferentes de integer para as colunas de partitioning e usar múltiplas colunas como partitioning keys. Para mais informações, consulte [Seção 22.2.3.2, “Partitioning por LIST COLUMNS”](partitioning-columns-list.html "22.2.3.2 Partitioning por LIST COLUMNS").