#### 13.2.5.1 Instrução INSERT ... SELECT

```sql
INSERT [LOW_PRIORITY | HIGH_PRIORITY] [IGNORE]
    [INTO] tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    [(col_name [, col_name] ...)]
    SELECT ...
    [ON DUPLICATE KEY UPDATE assignment_list]

value:
    {expr | DEFAULT}

assignment:
    col_name = value

assignment_list:
    assignment [, assignment] ...
```

Com [`INSERT ... SELECT`](insert-select.html "13.2.5.1 Instrução INSERT ... SELECT"), você pode inserir rapidamente muitas linhas em uma tabela a partir do resultado de uma instrução [`SELECT`](select.html "13.2.9 Instrução SELECT"), que pode selecionar dados de uma ou várias tabelas. Por exemplo:

```sql
INSERT INTO tbl_temp2 (fld_id)
  SELECT tbl_temp1.fld_order_id
  FROM tbl_temp1 WHERE tbl_temp1.fld_order_id > 100;
```

As seguintes condições se aplicam às instruções [`INSERT ... SELECT`](insert-select.html "13.2.5.1 Instrução INSERT ... SELECT"):

* Especifique `IGNORE` para ignorar linhas que causariam violações de chaves duplicadas (duplicate-key violations).

* A tabela de destino da instrução [`INSERT`](insert.html "13.2.5 Instrução INSERT") pode aparecer na cláusula `FROM` da parte [`SELECT`](select.html "13.2.9 Instrução SELECT") da Query. No entanto, você não pode inserir em uma tabela e selecionar da mesma tabela em uma subquery.

  Ao selecionar e inserir na mesma tabela, o MySQL cria uma tabela TEMPORARY interna para armazenar as linhas do [`SELECT`](select.html "13.2.9 Instrução SELECT") e, em seguida, insere essas linhas na tabela de destino. No entanto, você não pode usar `INSERT INTO t ... SELECT ... FROM t` quando `t` é uma tabela `TEMPORARY`, pois tabelas `TEMPORARY` não podem ser referenciadas duas vezes na mesma instrução. Veja [Seção 8.4.4, “Uso de Tabelas Temporárias Internas no MySQL”](internal-temporary-tables.html "8.4.4 Uso de Tabelas Temporárias Internas no MySQL"), e [Seção B.3.6.2, “Problemas com Tabelas TEMPORARY”](temporary-table-problems.html "B.3.6.2 Problemas com Tabelas TEMPORARY").

* Colunas `AUTO_INCREMENT` funcionam como de costume.
* Para garantir que o binary log possa ser usado para recriar as tabelas originais, o MySQL não permite INSERTs concorrentes para instruções [`INSERT ... SELECT`](insert-select.html "13.2.5.1 Instrução INSERT ... SELECT") (veja [Seção 8.11.3, “INSERTs Concorrentes”](concurrent-inserts.html "8.11.3 INSERTs Concorrentes")).

* Para evitar problemas ambíguos de referência de coluna quando o [`SELECT`](select.html "13.2.9 Instrução SELECT") e o [`INSERT`](insert.html "13.2.5 Instrução INSERT") referem-se à mesma tabela, forneça um alias exclusivo para cada tabela usada na parte [`SELECT`](select.html "13.2.9 Instrução SELECT") e qualifique os nomes das colunas nessa parte com o alias apropriado.

Você pode selecionar explicitamente quais partitions ou subpartitions (ou ambos) da tabela Source ou Target (ou ambos) devem ser usadas com uma cláusula `PARTITION` após o nome da tabela. Quando `PARTITION` é usado com o nome da tabela Source na porção [`SELECT`](select.html "13.2.9 Instrução SELECT") da instrução, as linhas são selecionadas apenas das partitions ou subpartitions nomeadas em sua lista de partitions. Quando `PARTITION` é usado com o nome da tabela Target para a porção [`INSERT`](insert.html "13.2.5 Instrução INSERT") da instrução, deve ser possível inserir todas as linhas selecionadas nas partitions ou subpartitions nomeadas na lista de partitions que segue a opção. Caso contrário, a instrução `INSERT ... SELECT` falha. Para mais informações e exemplos, veja [Seção 22.5, “Seleção de Partition”](partitioning-selection.html "22.5 Seleção de Partition").

Para instruções [`INSERT ... SELECT`](insert-on-duplicate.html "13.2.5.2 Instrução INSERT ... ON DUPLICATE KEY UPDATE"), veja [Seção 13.2.5.2, “Instrução INSERT ... ON DUPLICATE KEY UPDATE”](insert-on-duplicate.html "13.2.5.2 Instrução INSERT ... ON DUPLICATE KEY UPDATE Statement") para as condições sob as quais as colunas do [`SELECT`](select.html "13.2.9 Instrução SELECT") podem ser referenciadas em uma cláusula `ON DUPLICATE KEY UPDATE`.

A ordem na qual uma instrução [`SELECT`](select.html "13.2.9 Instrução SELECT") sem a cláusula `ORDER BY` retorna linhas é não determinística. Isso significa que, ao usar Replication, não há garantia de que tal [`SELECT`](select.html "13.2.9 Instrução SELECT") retorne as linhas na mesma ordem no Source e no Replica, o que pode levar a inconsistências entre eles. Para evitar que isso ocorra, sempre escreva instruções `INSERT ... SELECT` que serão replicadas usando uma cláusula `ORDER BY` que produza a mesma ordem de linha no Source e no Replica. Veja também [Seção 16.4.1.17, “Replication e LIMIT”](replication-features-limit.html "16.4.1.17 Replication e LIMIT").

Devido a este problema, as instruções [`INSERT ... SELECT ON DUPLICATE KEY UPDATE`](insert-on-duplicate.html "13.2.5.2 Instrução INSERT ... ON DUPLICATE KEY UPDATE") e [`INSERT IGNORE ... SELECT`](insert-select.html "13.2.5.1 Instrução INSERT ... SELECT") são sinalizadas como inseguras (unsafe) para Replication baseada em instrução (statement-based replication). Tais instruções produzem um aviso no error log quando se usa o modo statement-based e são escritas no binary log usando o formato row-based quando se usa o modo `MIXED`. (Bug #11758262, Bug #50439)

Veja também [Seção 16.2.1.1, “Vantagens e Desvantagens da Replication Baseada em Instrução e Baseada em Linha”](replication-sbr-rbr.html "16.2.1.1 Vantagens e Desvantagens da Replication Baseada em Instrução e Baseada em Linha").

Uma instrução `INSERT ... SELECT` que afeta tabelas partitioned e que utiliza um Storage Engine como [`MyISAM`](myisam-storage-engine.html "15.2 O Storage Engine MyISAM") que emprega Locks em nível de tabela (table-level locks), bloqueia todas as partitions da tabela Target; no entanto, apenas aquelas partitions que são realmente lidas da tabela Source são bloqueadas. (Isso não ocorre com tabelas que usam Storage Engines como [`InnoDB`](innodb-storage-engine.html "Capítulo 14 O Storage Engine InnoDB") que empregam Locks em nível de linha (row-level locking).) Para mais informações, veja [Seção 22.6.4, “Partitioning e Locking”](partitioning-limitations-locking.html "22.6.4 Partitioning e Locking").