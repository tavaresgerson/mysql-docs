#### 25.6.16.23 A tabela ndbinfo dictionary\_tables

Esta tabela fornece informações do dicionário `NDB` para as tabelas `NDB`. `dictionary_tables` contém as colunas listadas aqui:

- `table_id`

  O ID único da tabela

- `database_name`

  Nome do banco de dados que contém a tabela

- `table_name`

  Nome da tabela

- `status`

  O status da tabela; um dos `New`, `Changed`, `Retrieved`, `Invalid` ou `Altered`. (Consulte Object::Status, para mais informações sobre os valores de status do objeto.)

- `attributes`

  Número de atributos da tabela

- `primary_key_cols`

  Número de colunas na chave primária da tabela

- `primary_key`

  Uma lista separada por vírgula das colunas da chave primária da tabela

- `storage`

  Tipo de armazenamento utilizado pela tabela; um dos `memory`, `disk` ou `default`

- `logging`

  Se o registro está habilitado para esta tabela

- `dynamic`

  `1` se a tabela for dinâmica, caso contrário `0`; a tabela é considerada dinâmica se `table->``getForceVarPart()` for verdadeiro, ou se pelo menos uma coluna da tabela for dinâmica

- `read_backup`

  `1` se lido a partir de qualquer replica (a opção `READ_BACKUP` está habilitada para esta tabela, caso contrário, `0`; veja a Seção 15.1.20.12, “Definindo Opções de Comentário NDB”)

- `fully_replicated`

  `1` se `FULLY_REPLICATED` estiver habilitado para esta tabela (cada nó de dados no clúster tem uma cópia completa da tabela), `0` se não estiver; consulte a Seção 15.1.20.12, “Definindo Opções de Comentário NDB”

- `checksum`

  Se esta tabela usar um checksum, o valor nesta coluna é `1`; caso contrário, é `0`

- `row_size`

  A quantidade de dados, em bytes, que podem ser armazenados em uma única linha, excluindo quaisquer dados de blob armazenados separadamente em tabelas de blob; consulte Table::getRowSizeInBytes() na documentação da API para obter mais informações

- `min_rows`

  Número mínimo de linhas, usado para calcular as partições; consulte Table::getMinRows() na documentação da API para mais informações

- `max_rows`

  Número máximo de linhas, usado para calcular as partições; consulte Table::getMaxRows() na documentação da API para obter mais informações

- `tablespace`

  ID do espaço de tabelas ao qual a tabela pertence, se houver; isso é `0`, se a tabela não usar dados no disco

- `fragment_type`

  O tipo de fragmento da tabela; um dos `Single`, `AllSmall`, `AllMedium`, `AllLarge`, `DistrKeyHash`, `DistrKeyLin`, `UserDefined`, `unused` ou `HashMapPartition`; para mais informações, consulte Object::FragmentType, na documentação da API NDB

- `hash_map`

  O mapa de hash usado pela tabela

- `fragments`

  Número de fragmentos de mesa

- `partitions`

  Número de partições usadas pela tabela

- `partition_balance`

  Tipo de equilíbrio de partição utilizado, se houver; um dos `FOR_RP_BY_NODE`, `FOR_RA_BY_NODE`, `FOR_RP_BY_LDM`, `FOR_RA_BY_LDM`, `FOR_RA_BY_LDM_X_2`, `FOR_RA_BY_LDM_X_3` ou `FOR_RA_BY_LDM_X_4`; consulte a Seção 15.1.20.12, “Definindo as Opções de Comentário NDB”

- `contains_GCI`

  `1` se a tabela incluir um índice de ponto de verificação global, caso contrário `0`

- `single_user_mode`

  Tipo de acesso permitido à tabela quando o modo de usuário único está em vigor; um dos `locked`, `read_only` ou `read_write`; estes são equivalentes aos valores `SingleUserModeLocked`, `SingleUserModeReadOnly` e `SingleUserModeReadWrite`, respectivamente, do tipo `Table::SingleUserMode` na API NDB

- `force_var_part`

  Isso é `1` se `table->``getForceVarPart()` for verdadeiro para esta tabela e `0` se não for.

- `GCI_bits`

  Utilizado em testes

- `author_bits`

  Utilizado em testes

A tabela `dictionary_tables` foi adicionada no NDB 8.0.29.
