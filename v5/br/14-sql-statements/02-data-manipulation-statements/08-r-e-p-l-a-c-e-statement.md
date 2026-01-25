### 13.2.8 Declaração REPLACE

```sql
REPLACE [LOW_PRIORITY | DELAYED]
    [INTO] tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    [(col_name [, col_name] ...)]
    {VALUES | VALUE} (value_list) [, (value_list)] ...

REPLACE [LOW_PRIORITY | DELAYED]
    [INTO] tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    SET assignment_list

REPLACE [LOW_PRIORITY | DELAYED]
    [INTO] tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    [(col_name [, col_name] ...)]
    SELECT ...

value:
    {expr | DEFAULT}

value_list:
    value [, value] ...

assignment:
    col_name = value

assignment_list:
    assignment [, assignment] ...
```

O `REPLACE` funciona exatamente como o `INSERT`, exceto que se uma linha antiga na tabela tiver o mesmo valor que uma nova linha para uma `PRIMARY KEY` ou um `UNIQUE` index, a linha antiga é excluída antes que a nova linha seja inserida. Consulte [Seção 13.2.5, “Declaração INSERT”](insert.html "13.2.5 INSERT Statement").

O `REPLACE` é uma extensão do MySQL ao padrão SQL. Ele insere ou *exclui* e insere. Para outra extensão do MySQL ao SQL padrão—que insere ou *atualiza*—consulte [Seção 13.2.5.2, “Declaração INSERT ... ON DUPLICATE KEY UPDATE”](insert-on-duplicate.html "13.2.5.2 INSERT ... ON DUPLICATE KEY UPDATE Statement").

`INSERTs` e `REPLACEs` com `DELAYED` foram descontinuados no MySQL 5.6. No MySQL 5.7, o `DELAYED` não é suportado. O servidor reconhece, mas ignora a palavra-chave `DELAYED`, trata o `replace` como um `replace` não atrasado e gera um aviso `ER_WARN_LEGACY_SYNTAX_CONVERTED`: REPLACE DELAYED is no longer supported. The statement was converted to REPLACE. A palavra-chave `DELAYED` está programada para ser removida em uma versão futura.

Nota

O `REPLACE` só faz sentido se uma tabela tiver uma `PRIMARY KEY` ou um `UNIQUE` index. Caso contrário, ele se torna equivalente ao `INSERT`, pois não há Index a ser usado para determinar se uma nova linha duplica outra.

Os valores para todas as columns são extraídos dos valores especificados na declaração `REPLACE`. Quaisquer columns ausentes são definidas para seus valores `DEFAULT`, assim como acontece no `INSERT`. Você não pode referenciar valores da linha atual e usá-los na nova linha. Se você usar uma atribuição como `SET col_name = col_name + 1`, a referência ao nome da column no lado direito é tratada como `DEFAULT(col_name)`, de modo que a atribuição é equivalente a `SET col_name = DEFAULT(col_name) + 1`.

Para usar o `REPLACE`, você deve ter ambos os privileges `INSERT` e `DELETE` para a tabela.

Se uma generated column for explicitamente substituída, o único valor permitido é `DEFAULT`. Para obter informações sobre generated columns, consulte [Seção 13.1.18.7, “CREATE TABLE e Generated Columns”](create-table-generated-columns.html "13.1.18.7 CREATE TABLE and Generated Columns").

O `REPLACE` suporta a seleção explícita de Partition usando a cláusula `PARTITION` com uma lista de nomes de Partitions, Subpartitions ou ambos, separados por vírgulas. Assim como acontece com o `INSERT`, se não for possível inserir a nova linha em nenhuma dessas Partitions ou Subpartitions, a declaração `REPLACE` falha com o erro Found a row not matching the given partition set. Para mais informações e exemplos, consulte [Seção 22.5, “Seleção de Partition”](partitioning-selection.html "22.5 Partition Selection").

A declaração `REPLACE` retorna uma contagem para indicar o número de linhas afetadas. Este é o somatório das linhas excluídas e inseridas. Se a contagem for 1 para uma declaração `REPLACE` de linha única, uma linha foi inserida e nenhuma linha foi excluída. Se a contagem for maior que 1, uma ou mais linhas antigas foram excluídas antes que a nova linha fosse inserida. É possível que uma única linha substitua mais de uma linha antiga se a tabela contiver múltiplos Unique Indexes e a nova linha duplicar valores para diferentes linhas antigas em diferentes Unique Indexes.

A contagem de linhas afetadas facilita a determinação se o `REPLACE` apenas adicionou uma linha ou se também substituiu alguma linha: Verifique se a contagem é 1 (adicionada) ou maior (substituída).

Se você estiver usando a C API, a contagem de linhas afetadas pode ser obtida usando a função [`mysql_affected_rows()`](/doc/c-api/5.7/en/mysql-affected-rows.html).

Você não pode substituir dados em uma tabela e selecionar dados da mesma tabela em uma subquery.

O MySQL usa o seguinte algoritmo para o `REPLACE` (e `LOAD DATA ... REPLACE`):

1. Tente inserir a nova linha na tabela
2. Enquanto a inserção falhar devido a um erro de duplicate-key para uma Primary Key ou Unique Index:

   1. Exclua da tabela a linha conflitante que possui o valor da duplicate key
   2. Tente novamente inserir a nova linha na tabela

É possível que, no caso de um erro de duplicate-key, um storage engine execute o `REPLACE` como um `update` em vez de um `delete` mais um `insert`, mas a semântica é a mesma. Não há efeitos visíveis para o usuário, exceto por uma possível diferença na forma como o storage engine incrementa as variáveis de status `Handler_xxx`.

Como os resultados das declarações `REPLACE ... SELECT` dependem da ordenação das linhas do `SELECT` e essa ordem nem sempre pode ser garantida, é possível que ao registrar essas declarações, o source e a replica divergirem. Por esse motivo, as declarações `REPLACE ... SELECT` são sinalizadas como inseguras para Statement-Based Replication. Tais declarações geram um aviso no error log ao usar o modo statement-based e são escritas no Binary Log usando o formato row-based quando no modo `MIXED`. Consulte também [Seção 16.2.1.1, “Vantagens e Desvantagens da Replicação Statement-Based e Row-Based”](replication-sbr-rbr.html "16.2.1.1 Advantages and Disadvantages of Statement-Based and Row-Based Replication").

Ao modificar uma tabela existente que não está Partitioned para acomodar Partitioning, ou, ao modificar o Partitioning de uma tabela já Partitioned, você pode considerar alterar a Primary Key da tabela (consulte [Seção 22.6.1, “Partitioning Keys, Primary Keys e Unique Keys”](partitioning-limitations-partitioning-keys-unique-keys.html "22.6.1 Partitioning Keys, Primary Keys, and Unique Keys")). Você deve estar ciente de que, se fizer isso, os resultados das declarações `REPLACE` podem ser afetados, assim como seriam se você modificasse a Primary Key de uma tabela não Partitioned. Considere a tabela criada pela seguinte declaração `CREATE TABLE`:

```sql
CREATE TABLE test (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  data VARCHAR(64) DEFAULT NULL,
  ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);
```

Quando criamos esta tabela e executamos as declarações mostradas no cliente mysql, o resultado é o seguinte:

```sql
mysql> REPLACE INTO test VALUES (1, 'Old', '2014-08-20 18:47:00');
Query OK, 1 row affected (0.04 sec)

mysql> REPLACE INTO test VALUES (1, 'New', '2014-08-20 18:47:42');
Query OK, 2 rows affected (0.04 sec)

mysql> SELECT * FROM test;
+----+------+---------------------+
| id | data | ts                  |
+----+------+---------------------+
|  1 | New  | 2014-08-20 18:47:42 |
+----+------+---------------------+
1 row in set (0.00 sec)
```

Agora criamos uma segunda tabela quase idêntica à primeira, exceto que a Primary Key agora cobre 2 columns, conforme mostrado aqui (texto em destaque):

```sql
CREATE TABLE test2 (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  data VARCHAR(64) DEFAULT NULL,
  ts TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id, ts)
);
```

Quando executamos em `test2` as mesmas duas declarações `REPLACE` que fizemos na tabela `test` original, obtemos um resultado diferente:

```sql
mysql> REPLACE INTO test2 VALUES (1, 'Old', '2014-08-20 18:47:00');
Query OK, 1 row affected (0.05 sec)

mysql> REPLACE INTO test2 VALUES (1, 'New', '2014-08-20 18:47:42');
Query OK, 1 row affected (0.06 sec)

mysql> SELECT * FROM test2;
+----+------+---------------------+
| id | data | ts                  |
+----+------+---------------------+
|  1 | Old  | 2014-08-20 18:47:00 |
|  1 | New  | 2014-08-20 18:47:42 |
+----+------+---------------------+
2 rows in set (0.00 sec)
```

Isso se deve ao fato de que, quando executado em `test2`, os valores das columns `id` e `ts` devem corresponder aos de uma linha existente para que a linha seja substituída; caso contrário, uma linha é inserida.

Uma declaração `REPLACE` que afeta uma tabela Partitioned usando um storage engine como o `MyISAM`, que emprega Table-Level Locks, bloqueia apenas aquelas Partitions que contêm linhas que correspondem à cláusula `WHERE` da declaração `REPLACE`, desde que nenhuma das Partitioning columns da tabela seja atualizada; caso contrário, a tabela inteira é bloqueada. (Para storage engines como o `InnoDB` que empregam Row-Level Locking, nenhum bloqueio de Partitions ocorre.) Para mais informações, consulte [Seção 22.6.4, “Partitioning e Locking”](partitioning-limitations-locking.html "22.6.4 Partitioning and Locking").
