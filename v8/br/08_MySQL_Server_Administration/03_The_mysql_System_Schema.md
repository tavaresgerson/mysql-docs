## 7.3 O esquema do sistema mysql

O esquema `mysql` é o esquema do sistema. Ele contém tabelas que armazenam informações necessárias pelo servidor MySQL conforme ele é executado. Uma ampla categorização é que o esquema `mysql` contém tabelas de dicionário de dados que armazenam metadados de objetos de banco de dados e tabelas do sistema usadas para outros propósitos operacionais. A discussão a seguir subdivide ainda mais o conjunto de tabelas do sistema em categorias menores.

* Tabelas do Dicionário de Dados
* Tabelas do Sistema de Subvenções
* Tabelas do Sistema de Informação de Objetos
* Tabelas do Sistema de Registro
* Tabelas do Sistema de Ajuda do Lado do Servidor
* Tabelas do Sistema de Fuso Horário
* Tabelas do Sistema de Replicação
* Tabelas do Sistema de Otimizador
* Tabelas de Sistema Diversas

O restante desta seção enumera as tabelas em cada categoria, com referências cruzadas para informações adicionais. As tabelas do dicionário de dados e as tabelas do sistema utilizam o mecanismo de armazenamento `InnoDB`, a menos que haja indicação em contrário.

As tabelas do sistema `mysql` e as tabelas do dicionário de dados residem em um único arquivo de espaço de tabelas `InnoDB`, denominado `mysql.ibd`, no diretório de dados do MySQL. Anteriormente, essas tabelas eram criadas em arquivos de espaço de tabelas individuais no diretório do banco de dados `mysql`.

A criptografia de dados em repouso pode ser habilitada para o espaço de tabelas do esquema do sistema `mysql`. Para mais informações, consulte a Seção 17.13, “Criptografia de dados em repouso do InnoDB”.

### Tabelas do Dicionário de Dados

Esses quadros compõem o dicionário de dados, que contém metadados sobre objetos do banco de dados. Para informações adicionais, consulte o Capítulo 16, * Dicionário de Dados MySQL*.

Importante

O dicionário de dados é novo no MySQL 8.0. Um servidor habilitado para dicionário de dados implica algumas diferenças operacionais gerais em comparação com as versões anteriores do MySQL. Para obter detalhes, consulte a Seção 16.7, “Diferenças de Uso do Dicionário de Dados”. Além disso, para atualizações do MySQL 8.0 para o MySQL 5.7, o procedimento de atualização difere um pouco das versões anteriores do MySQL e exige que você verifique a prontidão da atualização de sua instalação, verificando os pré-requisitos específicos. Para obter mais informações, consulte o Capítulo 3, *Atualizando o MySQL*, particularmente a Seção 3.6, “Preparando Sua Instalação para Atualização”.

* `catalogs`: Informações do catálogo.  
* `character_sets`: Informações sobre os conjuntos de caracteres disponíveis.

* `check_constraints`: Informações sobre as restrições `CHECK` definidas em tabelas. Veja a Seção 15.1.20.6, “Restrições CHECK”.

* `collations`: Informações sobre as colatões para cada conjunto de caracteres.

* `column_statistics`: Estatísticas de histograma para valores de coluna. Veja a Seção 10.9.6, “Estatísticas do otimizador”.

* `column_type_elements`: Informações sobre os tipos usados pelas colunas.

* `columns`: Informações sobre as colunas das tabelas.

* `dd_properties`: Uma tabela que identifica as propriedades do dicionário de dados, como sua versão. O servidor usa isso para determinar se o dicionário de dados deve ser atualizado para uma versão mais recente.

* `events`: Informações sobre os eventos do Cronograma de Eventos. Veja a Seção 27.4, “Usando o Cronograma de Eventos”. Se o servidor for iniciado com a opção `--skip-grant-tables`, o cronograma de eventos é desativado e os eventos registrados na tabela não são executados. Veja a Seção 27.4.2, “Configuração do Cronograma de Eventos”.

* `foreign_keys`, `foreign_key_column_usage`: Informações sobre chaves estrangeiras.

* `index_column_usage`: Informações sobre as colunas utilizadas pelos índices.

* `index_partitions`: Informações sobre as partições utilizadas pelos índices.

* `index_stats`: Usado para armazenar estatísticas de índice dinâmico geradas quando o `ANALYZE TABLE` é executado.

* `indexes`: Informações sobre índices de tabela.
* `innodb_ddl_log`: Armazena logs de DDL para operações DDL seguras em caso de falha.

* `parameter_type_elements`: Informações sobre os parâmetros do procedimento e função armazenados, e sobre os valores de retorno para funções armazenadas.

* `parameters`: Informações sobre procedimentos e funções armazenadas. Veja a Seção 27.2, “Usando Rotinas Armazenadas”.

* `resource_groups`: Informações sobre grupos de recursos. Veja a Seção 7.1.16, “Grupos de Recursos”.

* `routines`: Informações sobre procedimentos e funções armazenadas. Veja a Seção 27.2, “Usando Rotinas Armazenadas”.

* `schemata`: Informações sobre esquemas. Em MySQL, um esquema é um banco de dados, então esta tabela fornece informações sobre bancos de dados.

* `st_spatial_reference_systems`: Informações sobre os sistemas de referência espacial disponíveis para dados espaciais.

* `table_partition_values`: Informações sobre os valores utilizados pelas partições da tabela.

* `table_partitions`: Informações sobre as partições utilizadas pelas tabelas.

* `table_stats`: Informações sobre estatísticas dinâmicas de tabela geradas quando o `ANALYZE TABLE` é executado.

* `tables`: Informações sobre tabelas em bancos de dados.

* `tablespace_files`: Informações sobre os arquivos utilizados pelos espaços de tabela.

* `tablespaces`: Informações sobre os espaços de tabela ativos.

* `triggers`: Informações sobre os gatilhos. * `view_routine_usage`: Informações sobre as dependências entre as visualizações e as funções armazenadas que são usadas por elas.

* `view_table_usage`: Usado para rastrear dependências entre visualizações e suas tabelas subjacentes.

As tabelas do dicionário de dados são invisíveis. Não podem ser lidas com `SELECT`, não aparecem na saída de `SHOW TABLES`, não estão listadas na tabela `INFORMATION_SCHEMA.TABLES`, e assim por diante. No entanto, na maioria dos casos, existem tabelas correspondentes `INFORMATION_SCHEMA` que podem ser consultadas. Conceitualmente, o `INFORMATION_SCHEMA` fornece uma visão através da qual o MySQL expõe metadados do dicionário de dados. Por exemplo, não é possível selecionar diretamente da tabela `mysql.schemata`:

```
mysql> SELECT * FROM mysql.schemata;
ERROR 3554 (HY000): Access to data dictionary table 'mysql.schemata' is rejected.
```

Em vez disso, selecione essas informações da tabela correspondente `INFORMATION_SCHEMA`:

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

Não existe uma tabela do Esquema de Informações que corresponda exatamente a `mysql.indexes`, mas `INFORMATION_SCHEMA.STATISTICS` contém muitas das mesmas informações.

Até o momento, não existem tabelas `INFORMATION_SCHEMA` que correspondam exatamente a `mysql.foreign_keys`, `mysql.foreign_key_column_usage`. A maneira padrão de obter informações de chave estrangeira é usando as tabelas `INFORMATION_SCHEMA` `REFERENTIAL_CONSTRAINTS` e `KEY_COLUMN_USAGE`; essas tabelas são agora implementadas como visualizações no `foreign_keys`, `foreign_key_column_usage` e outras tabelas do dicionário de dados.

Algumas tabelas do sistema de antes do MySQL 8.0 foram substituídas por tabelas do dicionário de dados e não estão mais presentes no esquema do sistema `mysql`:

* A tabela do dicionário de dados `events` substitui a tabela `event` da versão anterior do MySQL 8.0.

* As tabelas do dicionário de dados `parameters` e `routines` substituem juntas a tabela `proc` da versão anterior do MySQL 8.0.

### Tabelas do Sistema de Bolsa

Essas tabelas do sistema contêm informações sobre as contas de usuário e os privilégios que elas possuem. Para informações adicionais sobre a estrutura, o conteúdo e o propósito dessas tabelas, consulte a Seção 8.2.3, “Tabelas de Concessão”.

A partir do MySQL 8.0, as tabelas de concessão são as tabelas `InnoDB` (transacionais). Anteriormente, essas tabelas eram as `MyISAM` (não transacionais). A mudança do mecanismo de armazenamento de tabelas de concessão está por trás de uma mudança acompanhada no MySQL 8.0 no comportamento das declarações de gerenciamento de contas, como as `CREATE USER` e `GRANT`. Anteriormente, uma declaração de gerenciamento de conta que mencionava vários usuários poderia ter sucesso para alguns usuários e falhar para outros. As declarações agora são transacionais e ou têm sucesso para todos os usuários mencionados ou retornam e não têm efeito se ocorrer algum erro.

Nota

Se o MySQL for atualizado a partir de uma versão mais antiga, mas as tabelas de concessão não forem atualizadas de `MyISAM` para `InnoDB`, o servidor as considera apenas de leitura e as declarações de gerenciamento de conta produzem um erro. Para obter instruções de atualização, consulte o Capítulo 3, *Atualizando o MySQL*.

* `user`: Contas de usuário, privilégios globais e outras colunas não de privilégio.

* `global_grants`: Atribuição de privilégios globais dinâmicos aos usuários; veja Privilégios estáticos versus dinâmicos.

* `db`: Privilegios de nível de banco de dados.
* `tables_priv`: Privilegios de nível de tabela.
* `columns_priv`: Privilegios de nível de coluna.
* `procs_priv`: Privilegios de procedimentos e funções armazenadas.

* `proxies_priv`: Privilegios do usuário proxy.
* `default_roles`: Esta tabela lista os papéis padrão a serem ativados após um usuário se conectar e autenticar, ou executar [`SET ROLE DEFAULT`](set-role.html "15.7.1.11 SET ROLE Statement").

* `role_edges`: Esta tabela lista bordas para subgrafos de papel.

Uma linha de tabela `user` pode se referir a uma conta de usuário ou a um papel. O servidor pode distinguir se uma linha representa uma conta de usuário, um papel ou ambos, consultando a tabela `role_edges` para informações sobre as relações entre os IDs de autenticação.

* `password_history`: Informações sobre alterações de senha.

### Tabelas do Sistema de Informação de Objetos

Essas tabelas do sistema contêm informações sobre componentes, funções carregáveis e plugins do lado do servidor:

* `component`: O registro para componentes do servidor instalados usando `INSTALL COMPONENT`(install-component.html "15.7.4.3 INSTALL COMPONENT Statement"). Quaisquer componentes listados nesta tabela são instalados por um serviço de carregamento durante a sequência de inicialização do servidor. Veja a Seção 7.5.1, “Instalando e Desinstalando Componentes”.

* `func`: O registro para funções carregáveis instaladas usando `CREATE FUNCTION` (create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions"). Durante a sequência normal de inicialização, o servidor carrega as funções registradas nesta tabela. Se o servidor for iniciado com a opção `--skip-grant-tables`, as funções registradas na tabela não são carregadas e não estão disponíveis. Veja a Seção 7.7.1, “Instalando e Desinstalando Funções Carregáveis”.

Nota

Assim como a tabela do sistema `mysql.func`, a tabela do Schema de Desempenho `user_defined_functions` lista funções carregáveis instaladas usando [`CREATE FUNCTION`(create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions"). Ao contrário da tabela `mysql.func`, a tabela `user_defined_functions` também lista funções instaladas automaticamente por componentes do servidor ou plugins. Essa diferença torna `user_defined_functions` preferível a `mysql.func` para verificar quais funções estão instaladas. Veja a Seção 29.12.21.10, “A tabela user_defined_functions”.

* `plugin`: O registro para plugins instalados no lado do servidor usando `INSTALL PLUGIN`[(install-plugin.html "15.7.4.4 INSTALL PLUGIN Statement")]. Durante a sequência normal de inicialização, o servidor carrega plugins registrados nesta tabela. Se o servidor for iniciado com a opção `--skip-grant-tables`, os plugins registrados na tabela não são carregados e não estão disponíveis. Veja a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

### Tabelas do Sistema de Registro

O servidor utiliza essas tabelas do sistema para registro:

* `general_log`: A tabela de registro de consultas gerais. * `slow_log`: A tabela de registro de consultas lentas.

As tabelas de registro utilizam o mecanismo de armazenamento `CSV`.

Para mais informações, consulte a Seção 7.4, “Logs do servidor MySQL”.

### Tabelas do Sistema de Ajuda do Lado do Servidor

Essas tabelas do sistema contêm informações de ajuda do lado do servidor:

* `help_category`: Informações sobre as categorias de ajuda.

* `help_keyword`: Palavras-chave associadas a tópicos de ajuda.

* `help_relation`: Mapas entre palavras-chave de ajuda e tópicos.

* `help_topic`: Conteúdo do tópico de ajuda.

Para mais informações, consulte a Seção 7.1.17, “Suporte de Ajuda no Servidor”.

### Tabelas do Sistema de Fuso Horário

Essas tabelas do sistema contêm informações sobre fuso horário:

* `time_zone`: Identificação do fuso horário e se utilizam segundos intercalares.

* `time_zone_leap_second`: Quando ocorrem segundos intercalares.

* `time_zone_name`: Mapas entre IDs de fuso horário e nomes.

* `time_zone_transition`, `time_zone_transition_type`: Descrições do fuso horário.

Para mais informações, consulte a Seção 7.1.15, “Suporte de Fuso Horário do MySQL Server”.

### Tabelas do Sistema de Replicação

O servidor utiliza essas tabelas do sistema para suportar a replicação:

* `gtid_executed`: Tabela para armazenar valores de GTID. Veja a tabela mysql.gtid_executed.

* `ndb_binlog_index`: Informações de log binário para replicação do NDB Cluster. Esta tabela é criada apenas se o servidor for construído com suporte ao `NDBCLUSTER`. Veja a Seção 25.7.4, “Esquema e tabelas de replicação do NDB Cluster”.

* `slave_master_info`, `slave_relay_log_info`, `slave_worker_info`: Usado para armazenar informações de replicação em servidores de replicação. Veja a Seção 19.2.4, “Repositórios de Log de Relay e Metadados de Replicação”.

Todas as tabelas listadas acima usam o mecanismo de armazenamento `InnoDB`.

### Tabelas do Sistema de Otimizador

Essas tabelas do sistema são para uso pelo otimizador:

* `innodb_index_stats`, `innodb_table_stats`: Usado para estatísticas persistentes do otimizador `InnoDB`. Veja a Seção 17.8.10.1, “Configurando Parâmetros de Estatísticas de Otimizador Persistente”.

* `server_cost`, `engine_cost`: O modelo de custo do otimizador utiliza tabelas que contêm informações de estimativa de custo sobre operações que ocorrem durante a execução da consulta. `server_cost` contém estimativas de custo do otimizador para operações gerais do servidor. `engine_cost` contém estimativas para operações específicas de motores de armazenamento particulares. Veja a Seção 10.9.5, “O Modelo de Custo do Otimizador”.

### Tabelas de sistema variadas

Outras tabelas do sistema não se encaixam nas categorias anteriores:

* `audit_log_filter`, `audit_log_user`: Se o MySQL Enterprise Audit estiver instalado, essas tabelas fornecem armazenamento persistente das definições do filtro do log de auditoria e das contas de usuário. Veja as tabelas do log de auditoria.

* `firewall_group_allowlist`, `firewall_groups`, `firewall_memebership`, `firewall_users`, `firewall_whitelist`: Se o MySQL Enterprise Firewall estiver instalado, essas tabelas fornecem armazenamento persistente para as informações usadas pelo firewall. Veja a Seção 8.4.7, “MySQL Enterprise Firewall”.

* `servers`: Usado pelo motor de armazenamento `FEDERATED`. Veja a Seção 18.8.2.2, “Criando uma Tabela FEDERATED Usando CREATE SERVER”.

* `innodb_dynamic_metadata`: Usado pelo motor de armazenamento `InnoDB` para armazenar metadados de tabela de mudança rápida, como valores de contagem de autoincremento e indicadores de corrupção de árvore de índice. Substitui a tabela de buffer do dicionário de dados que residia no espaço de tabela do sistema `InnoDB`.