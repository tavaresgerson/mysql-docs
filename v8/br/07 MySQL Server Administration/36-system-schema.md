## 7.3 O esquema do sistema mysql

O `mysql` esquema é o esquema do sistema. Ele contém tabelas que armazenam informações requeridas pelo servidor MySQL enquanto ele é executado. Uma categorização ampla é que o `mysql` esquema contém tabelas de dicionário de dados que armazenam metadados de objetos de banco de dados e tabelas do sistema usadas para outros propósitos operacionais. A discussão a seguir subdivide o conjunto de tabelas do sistema em categorias menores.

- Tabelas de dicionário de dados
- Quadros do sistema de subvenções
- Tabelas do sistema de informação de objetos
- Tabelas de sistema de registo
- Tabelas do Sistema de Ajuda do Servidor
- Tabelas do sistema de fusos horários
- Tabelas do sistema de replicação
- Tabelas do sistema do optimizador
- Tabelas de Sistemas Diversos

O restante desta seção enumera as tabelas em cada categoria, com referências cruzadas para informações adicionais.

As tabelas do sistema `mysql` e as tabelas do dicionário de dados residem em um único arquivo de espaço de tabelas `InnoDB` chamado `mysql.ibd` no diretório de dados MySQL. Anteriormente, essas tabelas eram criadas em arquivos de espaço de tabelas individuais no diretório de banco de dados `mysql`.

A criptografia de dados em repouso pode ser ativada para o espaço de tabelas de esquema do sistema `mysql`. Para mais informações, consulte a Seção 17.13, "InnoDB Data-at-Rest Encryption".

### Tabelas de dicionário de dados

Estas tabelas compreendem o dicionário de dados, que contém metadados sobre objetos de banco de dados.

- `catalogs`: Informações do catálogo.
- `character_sets`: Informações sobre conjuntos de caracteres disponíveis.
- `check_constraints`: Informações sobre as restrições de `CHECK` definidas nas tabelas.
- `collations`: Informações sobre cotações para cada conjunto de caracteres.
- `column_statistics`: Estatísticas de histograma para valores de coluna. Ver Secção 10.9.6, "Estatísticas do Otimizador".
- `column_type_elements`: Informações sobre os tipos utilizados pelas colunas.
- `columns`: Informações sobre colunas em tabelas.
- `dd_properties`: Uma tabela que identifica as propriedades do dicionário de dados, como sua versão. O servidor usa isso para determinar se o dicionário de dados deve ser atualizado para uma versão mais recente.
- `events`: Informações sobre eventos do Agendador de Eventos. Ver Seção 27.4, Utilizando o Agendador de Eventos. Se o servidor for iniciado com a opção `--skip-grant-tables`, o agendador de eventos será desativado e os eventos registrados na tabela não serão executados. Ver Seção 27.4.2, Configuração do Agendador de Eventos.
- `foreign_keys`, `foreign_key_column_usage`: Informações sobre chaves estrangeiras.
- `index_column_usage`: Informações sobre as colunas utilizadas pelos índices.
- `index_partitions`: Informações sobre partições usadas por índices.
- `index_stats`: Usado para armazenar estatísticas de índice dinâmico geradas quando `ANALYZE TABLE` é executado.
- `indexes`: Informações sobre índices de tabelas.
- `innodb_ddl_log`: Armazena registros DDL para operações DDL com segurança de colisão.
- `parameter_type_elements`: Informações sobre parâmetros de procedimento e função armazenados e sobre valores de retorno para funções armazenadas.
- `parameters`: Informações sobre procedimentos e funções armazenados. Ver Secção 27.2, "Utilizar rotinas armazenadas".
- `resource_groups`: Informações sobre grupos de recursos. Ver secção 7.1.16, "Grupos de recursos".
- `routines`: Informações sobre procedimentos e funções armazenados. Ver Secção 27.2, "Utilizar rotinas armazenadas".
- `schemata`: Informações sobre esquemas. No MySQL, um esquema é um banco de dados, então esta tabela fornece informações sobre bancos de dados.
- `st_spatial_reference_systems`: Informações sobre os sistemas de referência espacial disponíveis para dados espaciais.
- `table_partition_values`: Informações sobre valores usados por partições de tabelas.
- `table_partitions`: Informações sobre partições usadas por tabelas.
- `table_stats`: Informações sobre estatísticas de tabelas dinâmicas geradas quando `ANALYZE TABLE` é executado.
- `tables`: Informações sobre tabelas em bases de dados.
- `tablespace_files`: Informações sobre arquivos usados por tablespaces.
- `tablespaces`: Informações sobre espaços de tabela ativos.
- `triggers`: Informações sobre gatilhos.
- `view_routine_usage`: Informações sobre dependências entre visualizações e funções armazenadas utilizadas por elas.
- `view_table_usage`: Usado para rastrear dependências entre visualizações e suas tabelas subjacentes.

As tabelas do dicionário de dados são invisíveis. Eles não podem ser lidos com o `SELECT`, não aparecem na saída do `SHOW TABLES`, não estão listados na tabela do `INFORMATION_SCHEMA.TABLES`, e assim por diante. No entanto, na maioria dos casos há tabelas correspondentes do `INFORMATION_SCHEMA` que podem ser consultadas. Conceptualmente, o `INFORMATION_SCHEMA` fornece uma visualização através da qual o MySQL expõe metadados do dicionário de dados. Por exemplo, você não pode selecionar diretamente da tabela do `mysql.schemata`:

```
mysql> SELECT * FROM mysql.schemata;
ERROR 3554 (HY000): Access to data dictionary table 'mysql.schemata' is rejected.
```

Em vez disso, selecione essa informação na tabela correspondente `INFORMATION_SCHEMA`:

```
mysql> SELECT * FROM INFORMATION_SCHEMA.SCHEMATA\G
*************************** 1. row ***************************
              CATALOG_NAME: def
               SCHEMA_NAME: mysql
DEFAULT_CHARACTER_SET_NAME: utf8mb4
    DEFAULT_COLLATION_NAME: utf8mb4_0900_ai_ci
                  SQL_PATH: NULL
        DEFAULT_ENCRYPTION: NO
*************************** 2. row ***************************
              CATALOG_NAME: def
               SCHEMA_NAME: information_schema
DEFAULT_CHARACTER_SET_NAME: utf8mb3
    DEFAULT_COLLATION_NAME: utf8mb3_general_ci
                  SQL_PATH: NULL
        DEFAULT_ENCRYPTION: NO
*************************** 3. row ***************************
              CATALOG_NAME: def
               SCHEMA_NAME: performance_schema
DEFAULT_CHARACTER_SET_NAME: utf8mb4
    DEFAULT_COLLATION_NAME: utf8mb4_0900_ai_ci
                  SQL_PATH: NULL
        DEFAULT_ENCRYPTION: NO
...
```

Não há uma tabela de esquema de informações que corresponda exatamente a `mysql.indexes`, mas `INFORMATION_SCHEMA.STATISTICS` contém grande parte da mesma informação.

A maneira padrão do SQL de obter informações de chave estrangeira é usando as tabelas `INFORMATION_SCHEMA` e `REFERENTIAL_CONSTRAINTS`; essas tabelas agora são implementadas como vistas nas tabelas `foreign_keys` e `foreign_key_column_usage` e outras tabelas de dicionário de dados.

### Quadros do sistema de subvenções

Estas tabelas de sistema contêm informações de concessão sobre as contas de utilizador e os privilégios que estas possuem.

As tabelas de concessão do MySQL 8.4 são tabelas (transacionais) `InnoDB` . As instruções de gerenciamento de conta são transacionais e são bem-sucedidas para todos os usuários nomeados ou revertem e não têm efeito se ocorrer algum erro.

- `user`: contas de usuário, privilégios globais e outras colunas sem privilégios.
- `global_grants`: Atribuições de privilégios globais dinâmicos aos usuários; ver Privilégios estáticos versus dinâmicos.
- `db`: Privilégios de nível de base de dados.
- `tables_priv`: Privilégios de nível de tabela.
- `columns_priv`: Privilégios de nível de coluna.
- `procs_priv`: Privilégios de procedimento e função armazenados.
- `proxies_priv`: Privilégios de usuário de proxy.
- `default_roles`: Esta tabela lista as funções padrão a serem ativadas após um usuário se conectar e autenticar, ou executar `SET ROLE DEFAULT`.
- `role_edges`: Esta tabela lista as bordas para subgráficos de funções.

  Uma determinada linha de tabela `user` pode referir-se a uma conta de utilizador ou a uma função. O servidor pode distinguir se uma linha representa uma conta de utilizador, uma função ou ambas consultando a tabela `role_edges` para obter informações sobre as relações entre IDs de autenticação.
- `password_history`: Informações sobre alterações de senha.

### Tabelas do sistema de informação de objetos

Estas tabelas de sistema contêm informações sobre componentes, funções carregáveis e plugins do lado do servidor:

- `component`: O registro para componentes do servidor instalados usando `INSTALL COMPONENT`. Qualquer componente listado nesta tabela é instalado por um serviço de carregador durante a sequência de inicialização do servidor. Veja Seção 7.5.1, Instalar e Desinstalar Componentes.

- `func`: O registro para funções carregáveis instaladas usando `CREATE FUNCTION`. Durante a sequência de inicialização normal, o servidor carrega funções registradas nesta tabela. Se o servidor for iniciado com a opção `--skip-grant-tables`, as funções registradas na tabela não serão carregadas e não estarão disponíveis. Veja Seção 7.7.1, Instalar e Desinstalar Funções Carregáveis.

  ::: info Note

  Como a tabela do sistema `mysql.func`, a tabela do Esquema de Desempenho `user_defined_functions` lista funções instaladas usando `CREATE FUNCTION`. Ao contrário da tabela `mysql.func`, a tabela `user_defined_functions` também lista funções instaladas automaticamente por componentes do servidor ou plugins. Esta diferença faz com que `user_defined_functions` seja preferível a `mysql.func` para verificar quais funções estão instaladas.

  :::

- `plugin`: O registro para plugins do lado do servidor instalados usando `INSTALL PLUGIN`. Durante a sequência de inicialização normal, o servidor carrega plugins registrados nesta tabela. Se o servidor for iniciado com a `--skip-grant-tables` opção, os plugins registrados na tabela não são carregados e estão indisponíveis. Veja Seção 7.6.1, Instalar e Desinstalar Plugins.

### Tabelas de sistema de registo

O servidor utiliza estas tabelas de sistema para registo:

- `general_log`: A tabela geral de registro de consultas.
- `slow_log`: A tabela de registro de consulta lenta.

As tabelas de log usam o motor de armazenamento `CSV`.

Para mais informações, ver Secção 7.4, "Logos do servidor MySQL".

### Tabelas do Sistema de Ajuda do Servidor

Estas tabelas de sistema contêm informações de ajuda do lado do servidor:

- `help_category`: Informações sobre categorias de ajuda.
- `help_keyword`: Palavras-chave associadas a tópicos de ajuda.
- `help_relation`: mapeamentos entre palavras-chave de ajuda e tópicos.
- `help_topic`: Conteúdo do tópico de ajuda.

Para mais informações, ver Secção 7.1.17, "Suporte de Ajuda do Servidor".

### Tabelas do sistema de fusos horários

Estas tabelas de sistema contêm informações sobre os fusos horários:

- `time_zone`: IDs de fuso horário e se eles usam segundos intercalares.
- `time_zone_leap_second`: Quando ocorrem segundos bissextos.
- `time_zone_name`: mapeamentos entre IDs e nomes de fusos horários.
- `time_zone_transition`, `time_zone_transition_type`: Descrições de fusos horários.

Para mais informações, ver Secção 7.1.15, "Suporte de fuso horário do servidor MySQL".

### Tabelas do sistema de replicação

O servidor usa estas tabelas de sistema para suportar a replicação:

- `gtid_executed`: Tabela para armazenar valores GTID. Ver mysql.gtid\_executed Table.
- `ndb_binlog_index`: Informações de log binário para replicação de cluster NDB. Esta tabela é criada somente se o servidor for construído com suporte a `NDBCLUSTER`.
- `slave_master_info`, `slave_relay_log_info`, `slave_worker_info`: Usado para armazenar informações de replicação em servidores de replicação. Veja Seção 19.2.4, Repositórios de metadados de log de retransmissão e replicação.

Todas as tabelas listadas usam o motor de armazenamento `InnoDB`.

### Tabelas do sistema do optimizador

Estas tabelas de sistema são para uso do optimizador:

- `innodb_index_stats`, `innodb_table_stats`: Usado para `InnoDB` estatísticas de otimizador persistente. Veja Seção 17.8.10.1, Configurar Parâmetros de Estatísticas de Otimizador Persistente.
- `server_cost`, `engine_cost`: O modelo de custo do otimizador usa tabelas que contêm informações de estimativa de custo sobre operações que ocorrem durante a execução da consulta. `server_cost` contém estimativas de custo do otimizador para operações gerais do servidor. `engine_cost` contém estimativas para operações específicas de motores de armazenamento específicos.

### Tabelas de Sistemas Diversos

Outras tabelas do sistema não se enquadram nas categorias anteriores:

- `audit_log_filter`, `audit_log_user`: Se o MySQL Enterprise Audit estiver instalado, essas tabelas fornecem armazenamento persistente de definições de filtro de log de auditoria e contas de usuário.
- `firewall_group_allowlist`, `firewall_groups`, `firewall_memebership`, `firewall_users`, `firewall_whitelist`: Se o MySQL Enterprise Firewall estiver instalado, essas tabelas fornecem armazenamento persistente para informações usadas pelo firewall.
- `servers`: Usado pelo `FEDERATED` motor de armazenamento. Veja Seção 18.8.2.2, Criando uma tabela FEDERADA Usando CREATE SERVER.
- `innodb_dynamic_metadata`: Usado pelo `InnoDB` para armazenar metadados de tabelas que mudam rapidamente, como valores de contador de aumento automático e sinais de corrupção de árvore de índice. Substitui a tabela de buffer do dicionário de dados que residia no espaço de tabelas do sistema `InnoDB`.
