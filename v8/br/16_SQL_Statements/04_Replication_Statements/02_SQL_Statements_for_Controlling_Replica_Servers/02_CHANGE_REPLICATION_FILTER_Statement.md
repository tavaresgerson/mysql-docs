#### 15.4.2.2. Declaração de filtro de replicação de alterações

```
CHANGE REPLICATION FILTER filter[, filter]
	[, ...] [FOR CHANNEL channel]

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
    db_name.table_name[, db_name.table_name][, ...]
wild_tbl_list:
    'db_pattern.table_pattern'[, 'db_pattern.table_pattern'][, ...]

db_pair_list:
    (db_pair)[, (db_pair)][, ...]

db_pair:
    from_db, to_db
```

`CHANGE REPLICATION FILTER` define uma ou mais regras de filtragem de replicação na replica da mesma forma que iniciar a replica **mysqld** com opções de filtragem de replicação, como `--replicate-do-db` ou `--replicate-wild-ignore-table`. Os filtros definidos usando essa declaração diferem dos definidos usando as opções do servidor em dois aspectos-chave:

1. A declaração não exige o reinício do servidor para entrar em vigor, apenas que o fio de replicação SQL seja interrompido usando `STOP REPLICA SQL_THREAD` primeiro (e reiniciado com `START REPLICA SQL_THREAD` depois).

2. Os efeitos da declaração não são persistentes; quaisquer filtros definidos usando `CHANGE REPLICATION FILTER` são perdidos após o reinício da replica **mysqld**.

O `CHANGE REPLICATION FILTER` requer o privilégio `REPLICATION_SLAVE_ADMIN` (ou o privilégio descontinuado `SUPER`).

Use a cláusula `FOR CHANNEL channel` para criar um filtro de replicação específico para um canal de replicação, por exemplo, em uma replica multi-fonte. Os filtros aplicados sem uma cláusula específica `FOR CHANNEL` são considerados filtros globais, ou seja, são aplicados a todos os canais de replicação.

Nota

Os filtros de replicação global não podem ser configurados em uma instância do servidor MySQL configurada para a Replicação por Grupo, porque filtrar transações em alguns servidores tornaria o grupo incapaz de chegar a um acordo sobre um estado consistente. Filtros de replicação específicos para canais podem ser configurados em canais de replicação que não estejam diretamente envolvidos com a Replicação por Grupo, como quando um membro do grupo também atua como replica para uma fonte que está fora do grupo. Eles não podem ser configurados nos canais `group_replication_applier` ou `group_replication_recovery`.

A lista a seguir mostra as opções `CHANGE REPLICATION FILTER` e como elas se relacionam com as opções do servidor `--replicate-*`:

- `REPLICATE_DO_DB`: Inclua atualizações com base no nome do banco de dados. É equivalente a `--replicate-do-db`.

- `REPLICATE_IGNORE_DB`: Exclua atualizações com base no nome do banco de dados. Equivalente a `--replicate-ignore-db`.

- `REPLICATE_DO_TABLE`: Inclua atualizações com base no nome da tabela. É equivalente a `--replicate-do-table`.

- `REPLICATE_IGNORE_TABLE`: Exclua atualizações com base no nome da tabela. Equivalente a `--replicate-ignore-table`.

- `REPLICATE_WILD_DO_TABLE`: Inclua atualizações com base na tabela de correspondência de padrões de caracteres. É equivalente a `--replicate-wild-do-table`.

- `REPLICATE_WILD_IGNORE_TABLE`: Exclua atualizações com base no nome da tabela de correspondência de padrões de caracteres. Equivalente a `--replicate-wild-ignore-table`.

- `REPLICATE_REWRITE_DB`: Realize atualizações na replica após substituir o novo nome na replica pelo banco de dados especificado na fonte. Equivalente a `--replicate-rewrite-db`.

Os efeitos precisos dos filtros `REPLICATE_DO_DB` e `REPLICATE_IGNORE_DB` dependem se a replicação baseada em declarações ou baseada em linhas está em vigor. Consulte a Seção 19.2.5, “Como os Servidores Avaliam as Regras de Filtragem de Replicação”, para obter mais informações.

Várias regras de filtragem de replicação podem ser criadas em uma única declaração `CHANGE REPLICATION FILTER` separando as regras com vírgulas, como mostrado aqui:

```
CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (d1), REPLICATE_IGNORE_DB = (d2);
```

Emitir a declaração mostrada acima é equivalente a iniciar a replica **mysqld** com as opções `--replicate-do-db=d1` `--replicate-ignore-db=d2`.

Em uma replica multi-fonte, que utiliza vários canais de replicação para processar transações de diferentes fontes, use a cláusula `FOR CHANNEL channel` para definir um filtro de replicação em um canal de replicação:

```
CHANGE REPLICATION FILTER REPLICATE_DO_DB = (d1) FOR CHANNEL channel_1;
```

Isso permite que você crie um filtro de replicação específico para um canal para filtrar dados selecionados de uma fonte. Quando uma cláusula `FOR CHANNEL` é fornecida, a instrução do filtro de replicação atua nesse canal de replicação, removendo qualquer filtro de replicação existente que tenha o mesmo tipo de filtro que os filtros especificados e substituindo-os pelo filtro especificado. Os tipos de filtro não explicitamente listados na instrução não são modificados. Se emitido contra um canal de replicação que não está configurado, a instrução falha com um erro ER\_SLAVE\_CONFIGURATION. Se emitido contra canais de replicação de grupo, a instrução falha com um erro ER\_SLAVE\_CHANNEL\_OPERATION\_NOT\_ALLOWED.

Em uma replica com múltiplos canais de replicação configurados, emitir `CHANGE REPLICATION FILTER` sem a cláusula `FOR CHANNEL` configura o filtro de replicação para cada canal de replicação configurado e para os filtros de replicação global. Para cada tipo de filtro, se o tipo de filtro estiver listado na declaração, então quaisquer regras de filtro existentes desse tipo são substituídas pelas regras de filtro especificadas na declaração mais recentemente emitida; caso contrário, o valor antigo do tipo de filtro é mantido. Para mais informações, consulte a Seção 19.2.5.4, “Filtros Baseados em Canais de Replicação”.

Se a mesma regra de filtragem for especificada várias vezes, apenas a *última* regra será usada. Por exemplo, as duas declarações mostradas aqui têm exatamente o mesmo efeito, porque a primeira regra `REPLICATE_DO_DB` na primeira declaração é ignorada:

```
CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (db1, db2), REPLICATE_DO_DB = (db3, db4);

CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (db3, db4);
```

Cuidado

Esse comportamento difere da opção de filtro `--replicate-*`, onde especificar a mesma opção várias vezes causa a criação de múltiplas regras de filtro.

Os nomes das tabelas e bancos de dados que não contenham caracteres especiais não precisam ser entre aspas. Os valores usados com `REPLICATION_WILD_TABLE` e `REPLICATION_WILD_IGNORE_TABLE` são expressões de string, que podem conter caracteres curinga (especiais), e, portanto, devem ser entre aspas. Isso é mostrado nas seguintes declarações de exemplo:

```
CHANGE REPLICATION FILTER
    REPLICATE_WILD_DO_TABLE = ('db1.old%');

CHANGE REPLICATION FILTER
    REPLICATE_WILD_IGNORE_TABLE = ('db1.new%', 'db2.new%');
```

Os valores usados com `REPLICATE_REWRITE_DB` representam *pares* de nomes de bancos de dados; cada valor deve ser fechado entre parênteses. A seguinte declaração reescreve as instruções que ocorrem no banco de dados `db1` na fonte para o banco de dados `db2` na replica:

```
CHANGE REPLICATION FILTER REPLICATE_REWRITE_DB = ((db1, db2));
```

A declaração mostrada contém dois conjuntos de parênteses, um envolvendo o par de nomes de banco de dados e outro envolvendo toda a lista. Isso é talvez mais facilmente visto no exemplo seguinte, que cria duas regras `rewrite-db`s, uma reescrevendo o banco de dados `dbA` para `dbB` e outra reescrevendo o banco de dados `dbC` para `dbD`:

```
CHANGE REPLICATION FILTER
  REPLICATE_REWRITE_DB = ((dbA, dbB), (dbC, dbD));
```

A declaração `CHANGE REPLICATION FILTER` substitui as regras de filtragem de replicação apenas para os tipos de filtro e canais de replicação afetados pela declaração e deixa as outras regras e canais inalterados. Se você quiser desativar todos os filtros de um determinado tipo, defina o valor do filtro em uma lista explicitamente vazia, como mostrado neste exemplo, que remove todas as regras `REPLICATE_DO_DB` e `REPLICATE_IGNORE_DB` existentes:

```
CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (), REPLICATE_IGNORE_DB = ();
```

Definir um filtro para ser esvaziado dessa maneira remove todas as regras existentes, não cria nenhuma nova e não restaura nenhuma regra definida durante o início do mysqld usando as opções `--replicate-*` na linha de comando ou no arquivo de configuração.

A declaração `RESET REPLICA ALL` remove os filtros de replicação específicos de canal que foram definidos em canais excluídos pela declaração. Quando o canal ou canais excluídos são recriados, quaisquer filtros de replicação globais especificados para a replica são copiados para eles, e nenhum filtro de replicação específico de canal é aplicado.

Para obter mais informações, consulte a Seção 19.2.5, “Como os Servidores Avaliam as Regras de Filtragem de Replicação”.
