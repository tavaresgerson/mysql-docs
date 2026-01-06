## 5.3 Banco de Dados do Sistema mysql

O banco de dados `mysql` é o banco de dados do sistema. Ele contém tabelas que armazenam informações necessárias para o servidor MySQL conforme ele está em execução.

As tabelas no banco de dados `mysql` se enquadram nessas categorias:

- Tabelas do Sistema de Concessões
- Tabelas do Sistema de Informações de Objetos
- Tabelas do sistema de registro
- Tabelas do sistema de ajuda no lado do servidor (system-schema.html#system-schema-help-tables)
- Tabelas do Sistema de Fuso Horário
- Tabelas do sistema de replicação
- Tabelas do sistema otimizador (system-schema.html#system-schema-optimizer-tables)
- Tabelas de sistema variáveis

O restante desta seção enumera as tabelas em cada categoria, com referências cruzadas para informações adicionais. As tabelas do sistema usam o motor de armazenamento `MyISAM`, a menos que haja indicação em contrário.

Aviso

Não **converte** as tabelas do sistema MySQL no banco de dados `mysql` de `MyISAM` para tabelas `InnoDB`. Esta é uma operação não suportada. Se você fizer isso, o MySQL não será reiniciado até que você restaure as tabelas do sistema antigas de um backup ou as gere novamente reiniciando o diretório de dados (consulte Seção 2.9.1, “Inicializando o Diretório de Dados”).

### Tabelas do Sistema de Créditos

Essas tabelas do sistema contêm informações sobre concessões relativas às contas de usuários e os privilégios que elas possuem:

- `user`: Contas de usuário, privilégios globais e outras colunas não de privilégio.

- `db`: privilégios de nível de banco de dados.

- `tables_priv`: privilégios de nível de tabela.

- `columns_priv`: privilégios em nível de coluna.

- `procs_priv`: Permissões de procedimentos armazenados e funções.

- `proxies_priv`: Privilegios do usuário proxy.

Para obter mais informações sobre a estrutura, o conteúdo e o propósito das tabelas de subsídios, consulte Seção 6.2.3, “Tabelas de Subsídios”.

### Tabelas do Sistema de Informação de Objetos

Essas tabelas do sistema contêm informações sobre programas armazenados, funções carregáveis e plugins do lado do servidor:

- `event`: O registro para eventos do Agendamento de Eventos instalado usando `CREATE EVENT`. Se o servidor for iniciado com a opção `--skip-grant-tables`, o agendamento de eventos é desativado e os eventos registrados na tabela não são executados. Veja Seção 23.4.2, “Configuração do Agendamento de Eventos”.

- `func`: O registro para funções carregáveis instaladas usando `CREATE FUNCTION`. Durante a sequência de inicialização normal, o servidor carrega as funções registradas nesta tabela. Se o servidor for iniciado com a opção `--skip-grant-tables`, as funções registradas na tabela não são carregadas e ficam indisponíveis. Veja Seção 5.6.1, “Instalando e Desinstalando Funções Carregáveis”.

- `plugin`: O registro para plugins do lado do servidor instalados usando `INSTALL PLUGIN`. Durante a sequência de inicialização normal, o servidor carrega os plugins registrados nesta tabela. Se o servidor for iniciado com a opção `--skip-grant-tables`, os plugins registrados na tabela não são carregados e ficam indisponíveis. Veja Seção 5.5.1, “Instalando e Desinstalando Plugins”.

  A tabela `plugin` usa o mecanismo de armazenamento `InnoDB` a partir do MySQL 5.7.6, `MyISAM` antes disso.

- `proc`: Informações sobre procedimentos e funções armazenadas. Veja Seção 23.2, “Usando Rotinas Armazenadas”.

### Tabelas do sistema de registro

O servidor utiliza essas tabelas do sistema para registro:

- `general_log`: A tabela de registro de consultas gerais.
- `slow_log`: A tabela do log de consultas lentas.

As tabelas de log utilizam o mecanismo de armazenamento `CSV`.

Para obter mais informações, consulte Seção 5.4, "Logs do Servidor MySQL".

### Sistemas de Ajuda no Servidor Tabelas

Essas tabelas do sistema contêm informações de ajuda no lado do servidor:

- `help_category`: Informações sobre as categorias de ajuda.

- `help_keyword`: Palavras-chave associadas a tópicos de ajuda.

- `help_relation`: Mapeamentos entre palavras-chave de ajuda e tópicos.

- `help_topic`: Conteúdo do tópico de ajuda.

Essas tabelas usam o mecanismo de armazenamento `InnoDB` a partir do MySQL 5.7.5, `MyISAM` antes disso.

Para mais informações, consulte Seção 5.1.14, “Suporte de Ajuda no Servidor”.

### Tabelas do Sistema de Fuso Horário

Essas tabelas do sistema contêm informações sobre fuso horário:

- `time_zone`: IDs de fuso horário e se eles usam segundos intercalares.

- `time_zone_leap_second`: Quando os segundos intercalares ocorrem.

- `time_zone_name`: Mapas entre IDs de fuso horário e nomes.

- `time_zone_transition`, `time_zone_transition_type`: Descrições da zona horária.

Essas tabelas usam o mecanismo de armazenamento `InnoDB` a partir do MySQL 5.7.5, `MyISAM` antes disso.

Para obter mais informações, consulte Seção 5.1.13, “Suporte de Fuso Horário do MySQL Server”.

### Tabelas do Sistema de Replicação

O servidor usa essas tabelas do sistema para suportar a replicação:

- `gtid_executed`: Tabela para armazenar valores de GTID. Veja [Tabela mysql.gtid\_executed](https://pt.wikipedia.org/wiki/Replicação_de_GTID#Conceitos_de_GTID_executados).

  A tabela `gtid_executed` utiliza o mecanismo de armazenamento `InnoDB`.

- `ndb_binlog_index`: Informações de log binário para a replicação do NDB Cluster. Veja Seção 21.7.4, “NDB Cluster Replication Schema and Tables”.

  Antes da versão 7.5.2 do NDB, essa tabela utilizava o mecanismo de armazenamento `MyISAM`. Na versão 7.5.2 e em versões posteriores, ele utiliza o `InnoDB`. Se você está planejando uma atualização de uma versão anterior do NDB Cluster para a versão 7.5.2 ou posterior, consulte Seção 21.3.7, “Atualização e Downgrade do NDB Cluster”, para obter informações importantes relacionadas a essa mudança.

- `slave_master_info`, `slave_relay_log_info`, `slave_worker_info`: Usado para armazenar informações de replicação em servidores replicados. Consulte Seção 16.2.4, “Repositórios de Log de Relay e Metadados de Replicação”.

  Todas essas três tabelas usam o mecanismo de armazenamento `InnoDB`.

### Tabelas do Sistema de Otimizador

Essas tabelas do sistema são para uso do otimizador:

- `innodb_index_stats`, `innodb_table_stats`: Usado para estatísticas do otimizador persistente do `InnoDB`. Consulte Seção 14.8.11.1, “Configurando Parâmetros de Estatísticas do Otimizador Persistente”.

- `server_cost`, `engine_cost`: O modelo de custo do otimizador utiliza tabelas que contêm informações de estimativa de custo sobre operações que ocorrem durante a execução da consulta. `server_cost` contém estimativas de custo do otimizador para operações gerais do servidor. `engine_cost` contém estimativas para operações específicas de motores de armazenamento particulares. Consulte Seção 8.9.5, “O Modelo de Custo do Otimizador”.

Essas tabelas utilizam o mecanismo de armazenamento `InnoDB`.

### Tabelas de sistema variadas

Outras tabelas do sistema não se enquadram nas categorias anteriores:

- `audit_log_filter`, `audit_log_user`: Se o MySQL Enterprise Audit estiver instalado, essas tabelas fornecem armazenamento persistente das definições do filtro do log de auditoria e das contas de usuário. Veja Tabelas de Log de Auditoria.

- `firewall_users`, `firewall_whitelist`: Se o MySQL Enterprise Firewall estiver instalado, essas tabelas fornecem armazenamento persistente para as informações usadas pelo firewall. Consulte Seção 6.4.6, “MySQL Enterprise Firewall”.

- `servers`: Usado pelo mecanismo de armazenamento `FEDERATED`. Consulte Seção 15.8.2.2, “Criando uma Tabela FEDERATED Usando CREATE SERVER”.

  A tabela `servers` usa o mecanismo de armazenamento `InnoDB` a partir do MySQL 5.7.6, `MyISAM` antes disso.
