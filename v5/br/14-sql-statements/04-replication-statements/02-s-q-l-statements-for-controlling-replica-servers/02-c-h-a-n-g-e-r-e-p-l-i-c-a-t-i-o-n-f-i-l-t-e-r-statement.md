#### 13.4.2.2 Instrução CHANGE REPLICATION FILTER

```sql
CHANGE REPLICATION FILTER filter[, filter][, ...]

filter: {
    REPLICATE_DO_DB = (db_list)
  | REPLICATE_IGNORE_DB = (db_list)
  | REPLICATE_DO_TABLE = (tbl_list)
  | REPLICATE_IGNORE_TABLE = (tbl_list)
  | REPLICATE_WILD_DO_TABLE = (wild_tbl_list)
  | REPLICATE_WILD_IGNORE_TABLE = (wild_tbl_list)
  | REPLICATE_REWRITE_DB = (db_pair_list)
}

db_list:
    db_name[, db_name][, ...]

tbl_list:
    db_name.table_name[, db_table_name][, ...]
wild_tbl_list:
    'db_pattern.table_pattern'[, 'db_pattern.table_pattern'][, ...]

db_pair_list:
    (db_pair)[, (db_pair)][, ...]

db_pair:
    from_db, to_db
```

A instrução `CHANGE REPLICATION FILTER` define uma ou mais regras de filtragem de replicação na Replica da mesma forma que ao iniciar o servidor Replica [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") com opções de filtragem de replicação, como [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db) ou [`--replicate-wild-ignore-table`](replication-options-replica.html#option_mysqld_replicate-wild-ignore-table). Os filtros definidos usando esta instrução diferem daqueles definidos usando as opções do servidor em dois aspectos principais:

1. A instrução não exige o reinício do servidor para entrar em vigor, apenas que o Thread SQL de replicação seja parado primeiro usando [`STOP SLAVE SQL_THREAD`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") (e reiniciado depois com [`START SLAVE SQL_THREAD`](start-slave.html "13.4.2.5 START SLAVE Statement")).

2. Os efeitos da instrução não são persistentes; quaisquer filtros definidos usando `CHANGE REPLICATION FILTER` são perdidos após um reinício do servidor Replica [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

[`CHANGE REPLICATION FILTER`](change-replication-filter.html "13.4.2.2 CHANGE REPLICATION FILTER Statement") exige o privilégio [`SUPER`](privileges-provided.html#priv_super).

Note

Filtros de replicação não podem ser definidos em uma instância do servidor MySQL configurada para Group Replication, pois a filtragem de Transactions em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

A lista a seguir mostra as opções de `CHANGE REPLICATION FILTER` e como elas se relacionam com as opções de servidor `--replicate-*`:

* `REPLICATE_DO_DB`: Inclui Updates com base no nome do Database. Equivalente a [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db).

* `REPLICATE_IGNORE_DB`: Exclui Updates com base no nome do Database. Equivalente a [`--replicate-ignore-db`](replication-options-replica.html#option_mysqld_replicate-ignore-db).

* `REPLICATE_DO_TABLE`: Inclui Updates com base no nome da Table. Equivalente a [`--replicate-do-table`](replication-options-replica.html#option_mysqld_replicate-do-table).

* `REPLICATE_IGNORE_TABLE`: Exclui Updates com base no nome da Table. Equivalente a [`--replicate-ignore-table`](replication-options-replica.html#option_mysqld_replicate-ignore-table).

* `REPLICATE_WILD_DO_TABLE`: Inclui Updates com base em padrão Wildcard (curinga) que corresponde ao nome da Table. Equivalente a [`--replicate-wild-do-table`](replication-options-replica.html#option_mysqld_replicate-wild-do-table).

* `REPLICATE_WILD_IGNORE_TABLE`: Exclui Updates com base em padrão Wildcard (curinga) que corresponde ao nome da Table. Equivalente a [`--replicate-wild-ignore-table`](replication-options-replica.html#option_mysqld_replicate-wild-ignore-table).

* `REPLICATE_REWRITE_DB`: Executa Updates na Replica após substituir um novo nome na Replica pelo Database especificado na Source. Equivalente a [`--replicate-rewrite-db`](replication-options-replica.html#option_mysqld_replicate-rewrite-db).

Os efeitos precisos dos filtros `REPLICATE_DO_DB` e `REPLICATE_IGNORE_DB` dependem de a replicação baseada em Statement (statement-based replication) ou baseada em Row (row-based replication) estar em vigor. Consulte [Section 16.2.5, “How Servers Evaluate Replication Filtering Rules”](replication-rules.html "16.2.5 How Servers Evaluate Replication Filtering Rules"), para mais informações.

Múltiplas regras de filtragem de replicação podem ser criadas em uma única instrução `CHANGE REPLICATION FILTER`, separando as regras com vírgulas, conforme mostrado aqui:

```sql
CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (d1), REPLICATE_IGNORE_DB = (d2);
```

Executar a instrução mostrada é equivalente a iniciar o servidor Replica [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") com as opções [`--replicate-do-db=d1`](replication-options-replica.html#option_mysqld_replicate-do-db) [`--replicate-ignore-db=d2`](replication-options-replica.html#option_mysqld_replicate-ignore-db).

Se a mesma regra de filtragem for especificada múltiplas vezes, apenas a *última* regra será realmente usada. Por exemplo, as duas instruções mostradas aqui têm exatamente o mesmo efeito, pois a primeira regra `REPLICATE_DO_DB` na primeira instrução é ignorada:

```sql
CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (db1, db2), REPLICATE_DO_DB = (db3, db4);

CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (db3,db4);
```

Cuidado

Este comportamento difere daquele das opções de filtro `--replicate-*`, onde especificar a mesma opção múltiplas vezes causa a criação de múltiplas regras de filtro.

Nomes de Tables e Databases que não contêm caracteres especiais não precisam ser citados (entre aspas). Os valores usados com `REPLICATION_WILD_TABLE` e `REPLICATION_WILD_IGNORE_TABLE` são expressões de string, possivelmente contendo caracteres wildcard (curinga) (especiais), e, portanto, devem ser citados. Isso é mostrado nas seguintes instruções de exemplo:

```sql
CHANGE REPLICATION FILTER
    REPLICATE_WILD_DO_TABLE = ('db1.old%');

CHANGE REPLICATION FILTER
    REPLICATE_WILD_IGNORE_TABLE = ('db1.new%', 'db2.new%');
```

Valores usados com `REPLICATE_REWRITE_DB` representam *pares* de nomes de Database; cada valor deve ser delimitado por parênteses. A instrução a seguir reescreve Statements ocorrendo no Database `db1` na Source para o Database `db2` na Replica:

```sql
CHANGE REPLICATION FILTER REPLICATE_REWRITE_DB = ((db1, db2));
```

A instrução mostrada contém dois conjuntos de parênteses, um delimitando o par de nomes de Database, e o outro delimitando a lista inteira. Isso é talvez mais fácil de ser visto no exemplo a seguir, que cria duas regras de `rewrite-db`, uma reescrevendo o Database `dbA` para `dbB`, e outra reescrevendo o Database `dbC` para `dbD`:

```sql
CHANGE REPLICATION FILTER
  REPLICATE_REWRITE_DB = ((dbA, dbB), (dbC, dbD));
```

Esta instrução deixa inalteradas quaisquer regras de filtragem de replicação existentes; para remover (unset) todos os filtros de um determinado tipo, defina o valor do filtro como uma lista explicitamente vazia, conforme mostrado neste exemplo, que remove todas as regras existentes `REPLICATE_DO_DB` e `REPLICATE_IGNORE_DB`:

```sql
CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (), REPLICATE_IGNORE_DB = ();
```

Definir um filtro como vazio desta forma remove todas as regras existentes, não cria novas e não restaura quaisquer regras definidas na inicialização do mysqld usando opções `--replicate-*` na linha de comando ou no arquivo de configuração.

Os valores utilizados com `REPLICATE_WILD_DO_TABLE` e `REPLICATE_WILD_IGNORE_TABLE` devem estar no formato `db_name.tbl_name`. Antes do MySQL 5.7.5, isso não era estritamente obrigatório, embora o uso de valores não conformes com essas opções pudesse levar a resultados errôneos (Bug #18095449).

Para mais informações, consulte [Section 16.2.5, “How Servers Evaluate Replication Filtering Rules”](replication-rules.html "16.2.5 How Servers Evaluate Replication Filtering Rules").