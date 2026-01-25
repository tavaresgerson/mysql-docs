### 22.3.2 Gerenciamento de Partições HASH e KEY

Tabelas particionadas por hash ou por key são muito semelhantes entre si no que diz respeito à realização de alterações na configuração de Particionamento, e ambas diferem de várias maneiras das tabelas particionadas por range ou list. Por essa razão, esta seção aborda apenas a modificação de tabelas particionadas por hash ou por key. Para uma discussão sobre a adição e remoção de Partitions de tabelas particionadas por range ou list, consulte [Section 22.3.1, “Gerenciamento de Partições RANGE e LIST”](partitioning-management-range-list.html "22.3.1 Gerenciamento de Partições RANGE e LIST").

Não é possível fazer o DROP de Partitions de tabelas particionadas por `HASH` ou `KEY` da mesma forma que é possível em tabelas particionadas por `RANGE` ou `LIST`. No entanto, você pode fazer o merge de Partitions `HASH` ou `KEY` usando a instrução `ALTER TABLE ... COALESCE PARTITION`. Suponha que você tenha uma tabela contendo dados sobre clientes, dividida em doze Partitions. A tabela `clients` é definida como mostrado aqui:

```sql
CREATE TABLE clients (
    id INT,
    fname VARCHAR(30),
    lname VARCHAR(30),
    signed DATE
)
PARTITION BY HASH( MONTH(signed) )
PARTITIONS 12;
```

Para reduzir o número de Partitions de doze para oito, execute o seguinte comando [`ALTER TABLE`](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations"):

```sql
mysql> ALTER TABLE clients COALESCE PARTITION 4;
Query OK, 0 rows affected (0.02 sec)
```

`COALESCE` funciona igualmente bem com tabelas particionadas por `HASH`, `KEY`, `LINEAR HASH` ou `LINEAR KEY`. Aqui está um exemplo semelhante ao anterior, diferindo apenas porque a tabela é particionada por `LINEAR KEY`:

```sql
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

O número após `COALESCE PARTITION` é o número de Partitions a fazer o merge no restante—em outras palavras, é o número de Partitions a serem removidas da tabela.

Se você tentar remover mais Partitions do que a tabela possui, o resultado é um error como o mostrado:

```sql
mysql> ALTER TABLE clients COALESCE PARTITION 18;
ERROR 1478 (HY000): Cannot remove all partitions, use DROP TABLE instead
```

Para aumentar o número de Partitions para a tabela `clients` de 12 para 18, use `ALTER TABLE ... ADD PARTITION` conforme mostrado aqui:

```sql
ALTER TABLE clients ADD PARTITION PARTITIONS 6;
```