### 26.3.2 Gerenciamento de Partições HASH e KEY

Tabelas que são particionadas por hash ou por chave são muito semelhantes entre si em termos de fazer alterações em uma configuração de particionamento, e ambas diferem de várias maneiras das tabelas que foram particionadas por intervalo ou lista. Por esse motivo, esta seção aborda a modificação de tabelas particionadas por hash ou por chave apenas. Para uma discussão sobre a adição e remoção de particionamentos de tabelas que são particionadas por intervalo ou lista, consulte a Seção 26.3.1, “Gerenciamento de Partições de INTERVALO e LISTA”.

Você não pode remover particionamentos de tabelas que são particionadas por `HASH` ou `KEY` da mesma maneira que pode de tabelas que são particionadas por `INTERVALO` ou `LISTA`. No entanto, você pode combinar particionamentos `HASH` ou `KEY` usando `ALTER TABLE ... COALESCE PARTITION`. Suponha que uma tabela `clients` contendo dados sobre clientes esteja dividida em 12 particionamentos, criados como mostrado aqui:

```
CREATE TABLE clients (
    id INT,
    fname VARCHAR(30),
    lname VARCHAR(30),
    signed DATE
)
PARTITION BY HASH( MONTH(signed) )
PARTITIONS 12;
```

Para reduzir o número de particionamentos de 12 para 8, execute a seguinte instrução `ALTER TABLE`:

```
mysql> ALTER TABLE clients COALESCE PARTITION 4;
Query OK, 0 rows affected (0.02 sec)
```

O `COALESCE` funciona igualmente bem com tabelas que são particionadas por `HASH`, `KEY`, `LINEAR HASH` ou `LINEAR KEY`. Aqui está um exemplo semelhante ao anterior, diferindo apenas no fato de que a tabela está particionada por `LINEAR KEY`:

```
mysql> CREATE TABLE clients_lk (
    ->     id INT,
    ->     fname VARCHAR(30),
    ->     lname VARCHAR(30),
    ->     signed DATE
    -> )
    -> PARTITION BY LINEAR KEY(signed)
    -> PARTITIONS 12;
Query OK, 0 rows affected (0.03 sec)

mysql> ALTER TABLE clients_lk COALESCE PARTITION 4;
Query OK, 0 rows affected (0.06 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

O número após `COALESCE PARTITION` é o número de particionamentos a serem combinados no restante — em outras palavras, é o número de particionamentos a serem removidos da tabela.

Tentar remover mais particionamentos do que estão na tabela resulta em um erro como este:

```
mysql> ALTER TABLE clients COALESCE PARTITION 18;
ERROR 1478 (HY000): Cannot remove all partitions, use DROP TABLE instead
```

Para aumentar o número de particionamentos para a tabela `clients` de 12 para 18, use `ALTER TABLE ... ADD PARTITION` como mostrado aqui:

```
ALTER TABLE clients ADD PARTITION PARTITIONS 6;
```