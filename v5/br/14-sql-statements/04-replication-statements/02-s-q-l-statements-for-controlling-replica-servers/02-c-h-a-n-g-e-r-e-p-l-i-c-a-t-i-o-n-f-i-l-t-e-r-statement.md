#### 13.4.2.2. Declaração do filtro de replicação de alterações

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

`REPLICAÇÃO DE FILTRO` define uma ou mais regras de filtragem de replicação na replica da mesma maneira que iniciar a replica **mysqld** com opções de filtragem de replicação, como `--replicate-do-db` ou `--replicate-wild-ignore-table`. Os filtros definidos usando essa declaração diferem dos definidos usando as opções do servidor em dois aspectos-chave:

1. A declaração não exige o reinício do servidor para entrar em vigor, apenas que o thread de replicação do SQL seja interrompido usando `STOP SLAVE SQL_THREAD` primeiro (e reiniciado com `START SLAVE SQL_THREAD` depois).

2. Os efeitos da declaração não são persistentes; quaisquer filtros definidos usando `CHANGE REPLICATION FILTER` são perdidos após o reinício da replica **mysqld**.

Para acessar a opção `CHANGE REPLICATION FILTER`, é necessário o privilégio `SUPER`.

Nota

Os filtros de replicação não podem ser configurados em uma instância do servidor MySQL configurada para replicação por grupo, porque filtrar as transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente.

A lista a seguir mostra as opções de `FILTER DE REPLICAÇÃO DE MUDANÇAS` e como elas se relacionam com as opções de servidor `--replicate-*`:

- `REPLICATE_DO_DB`: Inclua atualizações com base no nome do banco de dados. É equivalente a [`--replicate-do-db`]\(<https://pt.wikipedia.org/wiki/Op%C3%A9rnia_(MySQL#Replica%C3%A7%C3%A3o_do_banco_de_dados)>.

- `REPLICATE_IGNORE_DB`: Exclua atualizações com base no nome do banco de dados. É equivalente a [`--replicate-ignore-db`]\(<https://pt.wikipedia.org/wiki/Op%C3%A9rnia_(MySQL#Replic%C3%A3o)>.

- `REPLICATE_DO_TABLE`: Inclua atualizações com base no nome da tabela. É equivalente a [`--replicate-do-table`](https://pt.wikipedia.org/wiki/Op%C3%A9rnia_\(MySQL\)#%C3%8Dnica_mysqld_replicate-do-table).

- `REPLICATE_IGNORE_TABLE`: Exclua atualizações com base no nome da tabela. É equivalente a [`--replicate-ignore-table`]\(<https://pt.wikipedia.org/wiki/Op%C3%A9rnia_(MySQL#Op%C3%A9rnia_mysqld_replicate-ignore-table)>.

- `REPLICATE_WILD_DO_TABLE`: Inclua atualizações com base na correspondência de padrões de caracteres especiais no nome da tabela. É equivalente a `--replicate-wild-do-table`.

- `REPLICATE_WILD_IGNORE_TABLE`: Exclua atualizações com base na tabela de correspondência de padrões de caracteres. É equivalente a [`--replicate-wild-ignore-table`](https://pt.wikipedia.org/wiki/Op%C3%A9rnia_\(MySQL\)#op%C3%A3o_mysqld_replicate-wild-ignore-table).

- `REPLICATE_REWRITE_DB`: Realize atualizações na replica após substituir o novo nome da replica pelo banco de dados especificado na fonte. É equivalente a [`--replicate-rewrite-db`]\(<https://pt.wikipedia.org/wiki/Op%C3%A9rnia_(MySQL#Op%C3%A3o_mysqld_replicate-rewrite-db)>.

Os efeitos precisos dos filtros `REPLICATE_DO_DB` e `REPLICATE_IGNORE_DB` dependem se a replicação baseada em declarações ou baseada em linhas está em vigor. Consulte Seção 16.2.5, “Como os Servidores Avaliam as Regras de Filtragem de Replicação” para obter mais informações.

Várias regras de filtragem de replicação podem ser criadas em uma única declaração `ALTERAR FILTRO DE REPLICAÇÃO` separando as regras com vírgulas, como mostrado aqui:

```sql
CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (d1), REPLICATE_IGNORE_DB = (d2);
```

Emitir a declaração mostrada acima é equivalente a iniciar a replica **mysqld** com as opções `--replicate-do-db=d1` `--replicate-ignore-db=d2`.

Se a mesma regra de filtragem for especificada várias vezes, apenas a *última* regra será realmente usada. Por exemplo, as duas declarações mostradas aqui têm exatamente o mesmo efeito, porque a primeira regra `REPLICATE_DO_DB` na primeira declaração é ignorada:

```sql
CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (db1, db2), REPLICATE_DO_DB = (db3, db4);

CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (db3,db4);
```

Cuidado

Esse comportamento difere da opção de filtro `--replicate-*`, onde especificar a mesma opção várias vezes causa a criação de múltiplas regras de filtro.

Os nomes das tabelas e bancos de dados que não contenham caracteres especiais não precisam ser entre aspas. Os valores usados com `REPLICATION_WILD_TABLE` e `REPLICATION_WILD_IGNORE_TABLE` são expressões de string, que podem conter caracteres curinga (especiais) e, portanto, devem ser entre aspas. Isso é mostrado nas seguintes declarações de exemplo:

```sql
CHANGE REPLICATION FILTER
    REPLICATE_WILD_DO_TABLE = ('db1.old%');

CHANGE REPLICATION FILTER
    REPLICATE_WILD_IGNORE_TABLE = ('db1.new%', 'db2.new%');
```

Os valores usados com `REPLICATE_REWRITE_DB` representam *pares* de nomes de banco de dados; cada valor deve estar entre parênteses. A seguinte declaração reescreve instruções que ocorrem no banco de dados `db1` na fonte para o banco de dados `db2` na replica:

```sql
CHANGE REPLICATION FILTER REPLICATE_REWRITE_DB = ((db1, db2));
```

A declaração mostrada agora contém dois conjuntos de parênteses, um envolvendo o par de nomes de banco de dados e outro envolvendo toda a lista. Isso é talvez mais facilmente visto no exemplo seguinte, que cria duas regras `rewrite-db`, uma reescrevendo o banco de dados `dbA` para `dbB` e outra reescrevendo o banco de dados `dbC` para `dbD`:

```sql
CHANGE REPLICATION FILTER
  REPLICATE_REWRITE_DB = ((dbA, dbB), (dbC, dbD));
```

Essa declaração deixa as regras de filtragem de replicação existentes inalteradas; para desativar todos os filtros de um determinado tipo, defina o valor do filtro em uma lista explicitamente vazia, como mostrado neste exemplo, que remove todas as regras `REPLICATE_DO_DB` e `REPLICATE_IGNORE_DB` existentes:

```sql
CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (), REPLICATE_IGNORE_DB = ();
```

Definir um filtro para ser esvaziado dessa maneira remove todas as regras existentes, não cria nenhuma nova e não restaura nenhuma regra definida durante o início do mysqld usando as opções `--replicate-*` na linha de comando ou no arquivo de configuração.

Os valores usados com `REPLICATE_WILD_DO_TABLE` e `REPLICATE_WILD_IGNORE_TABLE` devem estar no formato `db_name.tbl_name`. Antes do MySQL 5.7.5, isso não era rigorosamente aplicado, embora o uso de valores não conformes com essas opções pudesse levar a resultados errôneos (Bug #18095449).

Para obter mais informações, consulte Seção 16.2.5, “Como os servidores avaliam as regras de filtragem de replicação”.
