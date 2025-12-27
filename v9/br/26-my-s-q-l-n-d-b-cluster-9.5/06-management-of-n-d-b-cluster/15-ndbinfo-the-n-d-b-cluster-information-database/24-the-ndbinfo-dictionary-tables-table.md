#### 25.6.15.24 Tabela ndbinfo dictionary_tables

Esta tabela fornece informações do dicionário `NDB` para as tabelas `NDB`. `dictionary_tables` contém as colunas listadas aqui:

* `table_id`

  O ID único da tabela

* `database_name`

  Nome do banco de dados que contém a tabela

* `table_name`

  Nome da tabela

* `status`

  O status da tabela; um dos valores `New`, `Changed`, `Retrieved`, `Invalid` ou `Altered`. (Veja Object::Status, para mais informações sobre os valores de status de objetos.)

* `attributes`

  Número de atributos da tabela

* `primary_key_cols`

  Número de colunas na chave primária da tabela

* `primary_key`

  Uma lista separada por vírgula das colunas na chave primária da tabela

* `storage`

  Tipo de armazenamento usado pela tabela; um dos valores `memory`, `disk` ou `default`

* `logging`

  Se o registro é habilitado para esta tabela

* `dynamic`

  `1` se a tabela for dinâmica, caso contrário `0`; a tabela é considerada dinâmica se `table->``getForceVarPart()` for `true`, ou se pelo menos uma coluna da tabela for dinâmica

* `read_backup`

  `1` se lido de qualquer replica (`opção READ_BACKUP` é habilitada para esta tabela, caso contrário `0`; veja Seção 15.1.24.12, “Definindo Opções de Comentário NDB”)

* `fully_replicated`

  `1` se `FULLY_REPLICATED` for habilitado para esta tabela (cada nó de dados no cluster tem uma cópia completa da tabela), `0` se não; veja Seção 15.1.24.12, “Definindo Opções de Comentário NDB”

* `checksum`

  Se esta tabela usar um checksum, o valor nesta coluna é `1`; se não, é `0`

* `row_size`

  A quantidade de dados, em bytes, que pode ser armazenada em uma linha, excluindo qualquer dado blob armazenado separadamente em tabelas blob; veja Table::getRowSizeInBytes(), na documentação da API, para mais informações

* `min_rows`

Número mínimo de linhas, usado para calcular divisões; consulte Table::getMinRows() na documentação da API para obter mais informações

* `max_rows`

Número máximo de linhas, usado para calcular divisões; consulte Table::getMaxRows() na documentação da API para obter mais informações

* `tablespace`

ID do espaço de tabelas ao qual a tabela pertence, se houver; é `0`, se a tabela não usar dados no disco

* `fragment_type`

O tipo de fragmento da tabela; um dos `Single`, `AllSmall`, `AllMedium`, `AllLarge`, `DistrKeyHash`, `DistrKeyLin`, `UserDefined`, `unused` ou `HashMapPartition`; para mais informações, consulte Object::FragmentType, na documentação da API NDB

* `hash_map`

O mapa de hash usado pela tabela

* `fragments`

Número de fragmentos da tabela

* `partitions`

Número de divisões usadas pela tabela

* `partition_balance`

Tipo de equilíbrio de partição usado, se houver; um dos `FOR_RP_BY_NODE`, `FOR_RA_BY_NODE`, `FOR_RP_BY_LDM`, `FOR_RA_BY_LDM`, `FOR_RA_BY_LDM_X_2`, `FOR_RA_BY_LDM_X_3` ou `FOR_RA_BY_LDM_X_4`; consulte Seção 15.1.24.12, “Definindo Opções de Comentário NDB”

* `contains_GCI`

`1` se a tabela incluir um índice de checkpoint global, caso contrário `0`

* `single_user_mode`

Tipo de acesso permitido à tabela quando o modo de único usuário estiver em vigor; um dos `locked`, `read_only` ou `read_write`; esses são equivalentes aos valores `SingleUserModeLocked`, `SingleUserModeReadOnly` e `SingleUserModeReadWrite`, respectivamente, do tipo `Table::SingleUserMode` na API NDB

* `force_var_part`

`1` se `table->`getForceVarPart()` for `true` para esta tabela, e `0` se não for

* `GCI_bits`

Usado em testes

* `author_bits`

Usado em testes