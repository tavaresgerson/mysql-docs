### 22.3.2 Gerenciamento das partições HASH e KEY

As tabelas que são particionadas por hash ou por chave são muito semelhantes entre si em relação à realização de alterações em uma configuração de particionamento, e ambas diferem de várias maneiras das tabelas que foram particionadas por intervalo ou lista. Por essa razão, esta seção aborda apenas a modificação de tabelas particionadas por hash ou por chave. Para uma discussão sobre a adição e remoção de particionamentos de tabelas que são particionadas por intervalo ou lista, consulte Seção 22.3.1, “Gestão de Partições RANGE e LIST”.

Você não pode excluir partições de tabelas que estejam particionadas por `HASH` ou `KEY` da mesma maneira que pode ser feito com tabelas particionadas por `RANGE` ou `LIST`. No entanto, você pode combinar partições `HASH` ou `KEY` usando a instrução `ALTER TABLE ... COALESCE PARTITION`. Suponha que você tenha uma tabela contendo dados sobre clientes, que está dividida em doze partições. A tabela `clients` é definida da seguinte forma:

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

Para reduzir o número de partições de doze para oito, execute o seguinte comando `ALTER TABLE`:

```sql
mysql> ALTER TABLE clients COALESCE PARTITION 4;
Query OK, 0 rows affected (0.02 sec)
```

O `COALESCE` funciona igualmente bem com tabelas que são particionadas por `HASH`, `KEY`, `LINEAR HASH` ou `LINEAR KEY`. Aqui está um exemplo semelhante ao anterior, diferindo apenas no fato de que a tabela está particionada por `LINEAR KEY`:

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

O número após `COALESCE PARTITION` é o número de partições a serem unidas no restante — em outras palavras, é o número de partições a serem removidas da tabela.

Se você tentar remover mais partições do que a tabela possui, o resultado será um erro como o mostrado:

```sql
mysql> ALTER TABLE clients COALESCE PARTITION 18;
ERROR 1478 (HY000): Cannot remove all partitions, use DROP TABLE instead
```

Para aumentar o número de partições da tabela `clients` de 12 para 18, use `ALTER TABLE ... ADD PARTITION`, conforme mostrado aqui:

```sql
ALTER TABLE clients ADD PARTITION PARTITIONS 6;
```
