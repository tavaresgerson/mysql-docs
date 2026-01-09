### 26.2.2 Partição de Lista

A partição de lista no MySQL é semelhante à partição por intervalo de várias maneiras. Assim como na partição por `RANGE`, cada partição deve ser definida explicitamente. A principal diferença entre os dois tipos de partição é que, na partição por lista, cada partição é definida e selecionada com base na pertença de um valor de coluna em um dos conjuntos de listas de valores, em vez de em um dos conjuntos de intervalos contíguos de valores. Isso é feito usando `PARTITION BY LIST(expr)` onde *`expr`* é um valor de coluna ou uma expressão baseada em um valor de coluna e retorna um valor inteiro, e então define cada partição por meio de uma `VALUES IN (value_list)`, onde *`value_list`* é uma lista de inteiros separados por vírgula.

Nota

No MySQL 9.5, é possível fazer correspondência apenas com uma lista de inteiros (e possivelmente `NULL` — veja a Seção 26.2.7, “Como o MySQL Partitioning lida com NULL”) ao particionar por `LIST`.

No entanto, outros tipos de coluna podem ser usados em listas de valores ao empregar a partição `LIST COLUMN`, que é descrita mais adiante nesta seção.

Ao contrário do caso das partições definidas por intervalo, as partições de lista não precisam ser declaradas em uma ordem específica. Para informações sintáticas mais detalhadas, consulte a Seção 15.1.24, “Instrução CREATE TABLE”.

Para os exemplos que se seguem, assumimos que a definição básica da tabela a ser partida é fornecida pela instrução `CREATE TABLE` mostrada aqui:

```
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

(Esta é a mesma tabela usada como base para os exemplos na Seção 26.2.1, “Partição por INTERVALO”. Como com os outros exemplos de partição, assumimos que o `default_storage_engine` é `InnoDB`. )

Suponha que haja 20 lojas de vídeo distribuídas entre 4 franquias, conforme mostrado na tabela a seguir.

<table summary="Um exemplo de 20 lojas de vídeo distribuídas entre 4 franquias regionais, conforme descrito no texto anterior."><thead><tr> <th>Região</th> <th>Números de ID da Loja</th> </tr></thead><tbody><tr> <td>Norte</td> <td>3, 5, 6, 9, 17</td> </tr><tr> <td>Leste</td> <td>1, 2, 10, 11, 19, 20</td> </tr><tr> <td>Oeste</td> <td>4, 12, 13, 14, 18</td> </tr><tr> <td>Central</td> <td>7, 8, 15, 16</td> </tr></tbody></table>

Para particionar esta tabela de forma que as linhas das lojas pertencentes à mesma região sejam armazenadas na mesma partição, você pode usar a instrução `CREATE TABLE` mostrada aqui:

```
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

Isso facilita a adição ou remoção de registros de funcionários relacionados a regiões específicas da tabela. Por exemplo, suponha que todas as lojas na região Oeste sejam vendidas para outra empresa. No MySQL 9.5, todas as linhas relacionadas a funcionários que trabalham em lojas dessa região podem ser excluídas com a consulta `ALTER TABLE employees TRUNCATE PARTITION pWest`, que pode ser executada de forma muito mais eficiente do que a instrução `DELETE` equivalente `DELETE FROM employees WHERE store_id IN (4,12,13,14,18);`. (Usar `ALTER TABLE employees DROP PARTITION pWest` também exclui todas essas linhas, mas também remove a partição `pWest` da definição da tabela; você precisaria usar uma instrução `ALTER TABLE ... ADD PARTITION` para restaurar o esquema de particionamento original da tabela.)

Assim como a particionamento `RANGE`, é possível combinar o particionamento `LIST` com o particionamento por hash ou chave para produzir um particionamento composto (subparticionamento). Veja a Seção 26.2.6, “Subparticionamento”.

Ao contrário do caso da partição por `RANGE`, não há um "recurso universal" como `MAXVALUE`; todos os valores esperados para a expressão de partição devem ser cobertos nas cláusulas `PARTITION ... VALUES IN (...)`. Uma declaração `INSERT` que contém um valor de coluna de partição não correspondente falha com um erro, como mostrado neste exemplo:

```
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

Ao inserir várias linhas usando uma única declaração `INSERT` em uma única tabela `InnoDB`, o `InnoDB` considera a declaração como uma única transação, de modo que a presença de qualquer valor não correspondente faz com que a declaração falhe completamente, e assim, nenhuma linha é inserida.

Você pode fazer com que esse tipo de erro seja ignorado usando a palavra-chave `IGNORE`, embora uma mensagem de aviso seja emitida para cada linha que contém valores de coluna de partição não correspondentes, como mostrado aqui.

```
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

Você pode ver na saída da seguinte declaração `TABLE` que as linhas que contêm valores de coluna de partição não correspondentes foram rejeitadas silenciosamente, enquanto as linhas que não contêm valores não correspondentes foram inseridas na tabela:

```
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

O MySQL também oferece suporte à partição por `LIST COLUMNS`, uma variante da partição `LIST` que permite usar colunas de tipos diferentes de inteiro para colunas de partição e usar múltiplas colunas como chaves de partição. Para mais informações, consulte a Seção 26.2.3.2, “Partição por LIST COLUMNS”.