## 7.3 O Esquema do Sistema `mysql`

O esquema `mysql` é o esquema do sistema. Ele contém tabelas que armazenam informações necessárias para o servidor MySQL conforme ele está em execução. Uma categorização ampla é que o esquema `mysql` contém tabelas de dicionário de dados que armazenam metadados de objetos de banco de dados e tabelas de sistema usadas para outros propósitos operacionais. A discussão a seguir subdivide ainda mais o conjunto de tabelas de sistema em categorias menores.

*  Tabelas de Dicionário de Dados
*  Tabelas do Sistema de Concessão
*  Tabelas de Sistema de Informações de Objetos
*  Tabelas de Sistema de Log
*  Tabelas de Sistema de Ajuda no Lado do Servidor
*  Tabelas de Sistema de Fuso Horário
*  Tabelas de Sistema de Replicação
*  Tabelas de Sistema de Otimizador
*  Tabelas de Sistema Diversas

O restante desta seção enumera as tabelas em cada categoria, com referências cruzadas para informações adicionais. As tabelas de dicionário de dados e as tabelas de sistema usam o mecanismo de armazenamento `InnoDB`, a menos que indicado de outra forma.

As tabelas do sistema `mysql` e as tabelas de dicionário de dados residem em um único arquivo de espaço de tabelas `InnoDB` chamado `mysql.ibd` no diretório de dados do MySQL. Anteriormente, essas tabelas eram criadas em arquivos de espaço de tabelas individuais no diretório do banco de dados `mysql`.

A criptografia de dados em repouso pode ser habilitada para o espaço de tabelas do esquema `mysql`. Para mais informações, consulte a Seção 17.13, “Criptografia de Dados em Repouso do `InnoDB’”.

### Tabelas de Dicionário de Dados

Essas tabelas compõem o dicionário de dados, que contém metadados sobre objetos de banco de dados. Para informações adicionais, consulte o Capítulo 16, *Dicionário de Dados do MySQL*.

* `catalogos`: Informações sobre o catálogo.
* `conjuntos_caracteres`: Informações sobre os conjuntos de caracteres disponíveis.
* `verificar_restrições`: Informações sobre as restrições `CHECK` definidas em tabelas. Consulte a Seção 15.1.20.6, “Restrições `CHECK`”.
* `colagens`: Informações sobre as colgagens para cada conjunto de caracteres.
* `estatísticas_colunas`: Estatísticas de histograma para os valores das colunas. Consulte a Seção 10.9.6, “Estatísticas do otimizador”.
* `elementos_tipos_colunas`: Informações sobre os tipos usados pelas colunas.
* `colunas`: Informações sobre as colunas em tabelas.
* `propriedades_dicionario_dados`: Uma tabela que identifica as propriedades do dicionário de dados, como sua versão. O servidor usa isso para determinar se o dicionário de dados deve ser atualizado para uma versão mais nova.
* `eventos`: Informações sobre os eventos do Agendamento de Eventos. Consulte  Seção 27.4, “Usando o Agendamento de Eventos”. Se o servidor for iniciado com a opção `--skip-grant-tables`, o agendamento de eventos é desativado e os eventos registrados na tabela não são executados. Consulte a Seção 27.4.2, “Configuração do Agendamento de Eventos”.
* `chave_estrangeira`, `uso_coluna_chave_estrangeira`: Informações sobre chaves estrangeiras.
* `uso_coluna_índice`: Informações sobre colunas usadas por índices.
* `partições_índice`: Informações sobre as partições usadas por índices.
* `estatísticas_índice`: Usado para armazenar estatísticas dinâmicas de índices geradas quando `ANALYZE TABLE` é executado.
* `índice`: Informações sobre índices de tabelas.
* `log_ddl_innodb`: Armazena logs de DDL para operações DDL seguras em caso de falha.
* `elementos_tipo_parâmetros`: Informações sobre parâmetros de procedimentos armazenados e funções, e sobre os valores de retorno para funções armazenadas.
* `parâmetros`: Informações sobre procedimentos armazenados e funções. Consulte a Seção 27.2, “Usando Rotinas Armazenadas”.
* `grupos_recursos`: Informações sobre grupos de recursos. Consulte  Seção 7.1.16, “Grupos de Recursos”.
* `rotinas`: Informações sobre procedimentos armazenados e funções. Consulte a Seção 27.2, “Usando Rotinas Armazenadas”.
* `esquema`: Informações sobre esquemas. No MySQL, um esquema é um banco de dados, então esta tabela fornece informações sobre bancos de dados.
* `sistemas_referenciais_espaciais`: Informações sobre os sistemas de referência espaciais disponíveis para dados espaciais.
* `valores_partição_tabela`: Informações sobre os valores usados pelas partições de tabelas.
* `partições_tabela`: Informações sobre as partições usadas por tabelas.
* `estatísticas_tabela`: Informações sobre estatísticas dinâmicas de tabelas geradas quando `ANALYZE TABLE` é executado.
* `tabelas`: Informações sobre tabelas em bancos de dados.
* `arquivos_espaço_tabela`: Informações sobre os arquivos usados por espaços de tabela.
* `espaços_tabela`: Informações sobre espaços de tabela ativos.
* `triggers`: Informações sobre triggers.
* `uso_rotina_visualização`: Informações sobre as dependências entre visualizações e funções armazenadas usadas por elas.
* `uso_tabela_visualização`: Usado para rastrear dependências entre visualizações e suas tabelas subjacentes.

As tabelas do dicionário de dados são invisíveis. Não podem ser lidas com `SELECT`, não aparecem na saída de `SHOW TABLES`, não estão listadas na tabela `INFORMATION_SCHEMA.TABLES`, e assim por diante. No entanto, na maioria dos casos, existem tabelas correspondentes do `INFORMATION_SCHEMA` que podem ser consultadas. conceitualmente, o `INFORMATION_SCHEMA` fornece uma visão através da qual o MySQL expõe o metadados do dicionário de dados. Por exemplo, você não pode selecionar diretamente da tabela `mysql.schemata`:

```
mysql> SELECT * FROM mysql.schemata;
ERROR 3554 (HY000): Access to data dictionary table 'mysql.schemata' is rejected.
```

Em vez disso, selecione essas informações da tabela correspondente do `INFORMATION_SCHEMA`:

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

Não existe uma tabela do `INFORMATION_SCHEMA` que corresponda exatamente a `mysql.indexes`, mas a `INFORMATION_SCHEMA.STATISTICS` contém muitas das mesmas informações.

Até o momento, não existem tabelas do `INFORMATION_SCHEMA` que correspondam exatamente a `mysql.foreign_keys`, `mysql.foreign_key_column_usage`. A maneira padrão de obter informações sobre chaves estrangeiras é usando as tabelas `INFORMATION_SCHEMA` `REFERENTIAL_CONSTRAINTS` e `KEY_COLUMN_USAGE`; essas tabelas agora são implementadas como vistas nas tabelas `foreign_keys`, `foreign_key_column_usage` e outras tabelas do dicionário de dados.

### Tabelas do Sistema de Concessão

Essas tabelas de sistema contêm informações sobre concessões de contas de usuário e os privilégios que elas possuem. Para obter informações adicionais sobre a estrutura, conteúdo e propósito dessas tabelas, consulte a Seção 8.2.3, “Tabelas de Concessão”.

As tabelas de concessão do MySQL 8.4 são tabelas `InnoDB` (transacionais). As declarações de gerenciamento de contas são transacionais e ou bem-sucedidas para todos os usuários nomeados ou são revertidas e não têm efeito se ocorrer algum erro.

* `user`: Contas de usuário, privilégios globais e outras colunas não de privilégio.
* `global_grants`: Atribuições de privilégios globais dinâmicos a usuários; veja Privilégios estáticos versus dinâmicos.
* `db`: Privilégios de nível de banco de dados.
* `tables_priv`: Privilégios de nível de tabela.
* `columns_priv`: Privilégios de nível de coluna.
* `procs_priv`: Privilégios de procedimentos armazenados e funções.
* `proxies_priv`: Privilégios de usuário proxy.
* `default_roles`: Esta tabela lista os papéis padrão a serem ativados após um usuário se conectar e autenticar ou executar `SET ROLE DEFAULT`.
* `role_edges`: Esta tabela lista arestas para subgrafos de papéis.

Uma linha de tabela `user` pode se referir a uma conta de usuário ou a um papel. O servidor pode distinguir se uma linha representa uma conta de usuário, um papel ou ambos consultando a tabela `role_edges` para obter informações sobre as relações entre os IDs de autenticação.
* `password_history`: Informações sobre alterações de senha.

### Tabelas do Sistema de Informações de Objetos

Essas tabelas de sistema contêm informações sobre componentes, funções carregáveis e plugins do lado do servidor:

* `component`: O registro para componentes do servidor instalados usando `INSTALL COMPONENT`. Quaisquer componentes listados nesta tabela são instalados por um serviço de carregamento durante a sequência de inicialização do servidor. Veja Seção 7.5.1, “Instalando e Desinstalando Componentes”.
* `func`: O registro para funções carregáveis instaladas usando `CREATE FUNCTION`. Durante a sequência de inicialização normal, o servidor carrega as funções registradas nesta tabela. Se o servidor for iniciado com a opção `--skip-grant-tables`, as funções registradas na tabela não são carregadas e estão indisponíveis. Veja Seção 7.7.1, “Instalando e Desinstalando Funções Carregáveis”.

::: info Nota

Assim como a tabela `mysql.func` do sistema, a tabela `user_defined_functions` do Schema de Desempenho lista funções carregáveis instaladas usando `CREATE FUNCTION`. Ao contrário da tabela `mysql.func`, a tabela `user_defined_functions` também lista funções instaladas automaticamente por componentes do servidor ou plugins. Essa diferença torna a tabela `user_defined_functions` preferível à tabela `mysql.func` para verificar quais funções estão instaladas. Veja a Seção 29.12.22.10, “A tabela user\_defined\_functions”.

:::

* `plugin`: O registro para plugins do lado do servidor instalados usando `INSTALL PLUGIN`. Durante a sequência de inicialização normal, o servidor carrega plugins registrados nesta tabela. Se o servidor for iniciado com a opção `--skip-grant-tables`, os plugins registrados na tabela não são carregados e estão indisponíveis. Veja a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

### Tabelas do Sistema de Log

O servidor usa essas tabelas de sistema para registro:

* `general_log`: A tabela de log de consultas gerais.
* `slow_log`: A tabela de log de consultas lentas.

As tabelas de log usam o mecanismo de armazenamento `CSV`.

Para mais informações, veja a Seção 7.4, “Logs do Servidor MySQL”.

### Tabelas do Sistema de Ajuda do Lado do Servidor

Essas tabelas de sistema contêm informações de ajuda do lado do servidor:

* `help_category`: Informações sobre categorias de ajuda.
* `help_keyword`: Palavras-chave associadas a tópicos de ajuda.
* `help_relation`: Mapeamentos entre palavras-chave de ajuda e tópicos.
* `help_topic`: Conteúdo do tópico de ajuda.

Para mais informações, veja a Seção 7.1.17, “Suporte de Ajuda do Lado do Servidor”.

### Tabelas do Sistema de Fuso Horário

Essas tabelas de sistema contêm informações sobre fusos horários:

* `time_zone`: IDs de fusos horários e se eles usam segundos intercalares.
* `time_zone_leap_second`: Quando os segundos intercalares ocorrem.
* `time_zone_name`: Mapeamentos entre IDs de fusos horários e nomes.
* `time_zone_transition`, `time_zone_transition_type`: Descrições de fusos horários.

Para mais informações, veja a Seção 7.1.15, “Suporte de Fuso Horário do Servidor MySQL”.

### Tabelas do Sistema de Replicação

O servidor usa essas tabelas de sistema para suporte à replicação:

* `gtid_executed`: Tabela para armazenar valores GTID. Veja a tabela mysql.gtid_executed.
* `ndb_binlog_index`: Informações de log binário para a replicação do NDB Cluster. Esta tabela é criada apenas se o servidor for construído com suporte a `NDBCLUSTER`. Veja a Seção 25.7.4, “Esquema e tabelas de replicação do NDB Cluster”.
* `slave_master_info`, `slave_relay_log_info`, `slave_worker_info`: Usados para armazenar informações de replicação em servidores replicados. Veja a Seção 19.2.4, “Repositórios de metadados de log de replicação e replicação”.

Todas as tabelas listadas acima usam o mecanismo de armazenamento `InnoDB`.

### Tabelas do Sistema de Otimizador

Estas tabelas de sistema são para uso do otimizador:

* `innodb_index_stats`, `innodb_table_stats`: Usados para estatísticas de otimizador persistentes de `InnoDB`. Veja a Seção 17.8.10.1, “Configurando parâmetros de estatísticas de otimizador persistentes”.
* `server_cost`, `engine_cost`: O modelo de custo do otimizador usa tabelas que contêm informações de estimativa de custo sobre operações que ocorrem durante a execução de consultas. `server_cost` contém estimativas de custo do otimizador para operações gerais do servidor. `engine_cost` contém estimativas para operações específicas de motores de armazenamento particulares. Veja a Seção 10.9.5, “O Modelo de Custo do Otimizador”.

### Tabelas de Sistema Diversas

Outras tabelas de sistema não se encaixam nas categorias anteriores:

* `audit_log_filter`, `audit_log_user`: Se o MySQL Enterprise Audit estiver instalado, essas tabelas fornecem armazenamento persistente das definições do filtro do log de auditoria e das contas de usuário. Veja Tabelas de Log de Auditoria.
* `firewall_group_allowlist`, `firewall_groups`, `firewall_memebership`, `firewall_users`, `firewall_whitelist`: Se o MySQL Enterprise Firewall estiver instalado, essas tabelas fornecem armazenamento persistente das informações usadas pelo firewall. Veja Seção 8.4.7, “MySQL Enterprise Firewall”.
* `servers`: Usado pelo mecanismo de armazenamento `FEDERATED`. Veja Seção 18.8.2.2, “Criando uma Tabela FEDERATED Usando CREATE SERVER”.
* `innodb_dynamic_metadata`: Usado pelo mecanismo de armazenamento `InnoDB` para armazenar metadados de tabelas que mudam rapidamente, como valores de contador de incremento automático e indicadores de corrupção de árvores de índice. Substitui a tabela de buffer do dicionário de dados que residia no espaço de tabelas do sistema `InnoDB`.