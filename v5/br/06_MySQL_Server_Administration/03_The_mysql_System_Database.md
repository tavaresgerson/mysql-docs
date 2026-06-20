## 5.3 Banco de Dados do Sistema mysql

O banco de dados `mysql` é o banco de dados do sistema. Ele contém tabelas que armazenam informações necessárias pelo servidor MySQL conforme ele é executado.

As tabelas no banco de dados `mysql` se enquadram nessas categorias:

* Tabelas do Sistema de Concessão * Tabelas do Sistema de Informação de Objetos * Tabelas do Sistema de Registro * Tabelas do Sistema de Ajuda do Lado do Servidor * Tabelas do Sistema de Fuso Horário * Tabelas do Sistema de Replicação * Tabelas do Sistema de Otimizador * Tabelas de Sistema Diversas

O restante desta seção enumera as tabelas em cada categoria, com referências cruzadas para informações adicionais. As tabelas do sistema utilizam o mecanismo de armazenamento `MyISAM`, a menos que haja indicação em contrário.

Aviso

*Não* converta as tabelas do sistema MySQL no banco de dados `mysql` de `MyISAM` para as tabelas `InnoDB`. Esta é uma operação não suportada. Se você fizer isso, o MySQL não reiniciará até que você restaure as tabelas do sistema antigas a partir de um backup ou as gere novamente, reiniciando o diretório de dados (consulte Seção 2.9.1, “Inicializando o Diretório de Dados”).

### Tabelas do Sistema de Bolsa

Essas tabelas do sistema contêm informações sobre concessão de contas de usuário e os privilégios que elas possuem:

* `user`: Contas de usuário, privilégios globais e outras colunas não de privilégio.

* `db`: Privilegios de nível de banco de dados.
* `tables_priv`: Privilegios de nível de tabela.
* `columns_priv`: Privilegios de nível de coluna.
* `procs_priv`: Privilegios de procedimentos e funções armazenadas.

* `proxies_priv`: Privilegios do usuário proxy.

Para mais informações sobre a estrutura, o conteúdo e o propósito das tabelas de subsídios, consulte a Seção 6.2.3, “Tabelas de subsídios”.

### Tabelas do Sistema de Informação de Objetos

Essas tabelas do sistema contêm informações sobre programas armazenados, funções carregáveis e plugins do lado do servidor:

* `event`: O registro para eventos do Agendamento de Eventos instalado usando `CREATE EVENT`. Se o servidor for iniciado com a opção `--skip-grant-tables`, o agendamento de eventos é desativado e os eventos registrados na tabela não são executados. Veja a Seção 23.4.2, “Configuração do Agendamento de Eventos”.

* `func`: O registro para funções carregáveis instaladas usando `CREATE FUNCTION`. Durante a sequência normal de inicialização, o servidor carrega as funções registradas nesta tabela. Se o servidor for iniciado com a opção `--skip-grant-tables`, as funções registradas na tabela não são carregadas e não estão disponíveis. Veja a Seção 5.6.1, “Instalando e Desinstalando Funções Carregáveis”.

* `plugin`: O registro para plugins instalados no lado do servidor usando `INSTALL PLUGIN`. Durante a sequência normal de inicialização, o servidor carrega plugins registrados nesta tabela. Se o servidor for iniciado com a opção `--skip-grant-tables`, os plugins registrados na tabela não são carregados e não estão disponíveis. Veja a Seção 5.5.1, “Instalando e Desinstalando Plugins”.

A tabela `plugin` utiliza o mecanismo de armazenamento `InnoDB` a partir do MySQL 5.7.6, `MyISAM` antes disso.

* `proc`: Informações sobre procedimentos e funções armazenadas. Veja a Seção 23.2, “Usando Rotinas Armazenadas”.

### Tabelas do Sistema de Registro

O servidor utiliza essas tabelas do sistema para registro:

* `general_log`: A tabela de registro de consultas gerais. * `slow_log`: A tabela de registro de consultas lentas.

As tabelas de registro utilizam o mecanismo de armazenamento `CSV`.

Para mais informações, consulte a Seção 5.4, “Logs do servidor MySQL”.

### Tabelas do Sistema de Ajuda do Lado do Servidor

Essas tabelas do sistema contêm informações de ajuda do lado do servidor:

* `help_category`: Informações sobre as categorias de ajuda.

* `help_keyword`: Palavras-chave associadas a tópicos de ajuda.

* `help_relation`: Mapas entre palavras-chave de ajuda e temas.

* `help_topic`: Conteúdo do tópico de ajuda.

Essas tabelas utilizam o mecanismo de armazenamento `InnoDB` a partir do MySQL 5.7.5, `MyISAM` antes disso.

Para mais informações, consulte a Seção 5.1.14, “Suporte de Ajuda no Servidor”.

### Tabelas do Sistema de Fuso Horário

Essas tabelas do sistema contêm informações sobre fuso horário:

* `time_zone`: Identificação do fuso horário e se utilizam segundos intercalares.

* `time_zone_leap_second`: Quando ocorrem segundos intercalares.

* `time_zone_name`: Mapas entre IDs de fuso horário e nomes.

* `time_zone_transition`, `time_zone_transition_type`: Descrições do fuso horário.

Essas tabelas utilizam o mecanismo de armazenamento `InnoDB` a partir do MySQL 5.7.5, `MyISAM` antes disso.

Para mais informações, consulte a Seção 5.1.13, “Suporte de Fuso Horário do MySQL Server”.

### Tabelas do Sistema de Replicação

O servidor utiliza essas tabelas do sistema para suportar a replicação:

* `gtid_executed`: Tabela para armazenar valores de GTID. Veja a tabela mysql.gtid_executed.

A tabela `gtid_executed` utiliza o mecanismo de armazenamento `InnoDB`.

* `ndb_binlog_index`: Informações de log binário para replicação do NDB Cluster. Veja a Seção 21.7.4, “Esquema e tabelas de replicação do NDB Cluster”.

Antes da NDB 7.5.2, esta tabela empregava o mecanismo de armazenamento `MyISAM`. Na NDB 7.5.2 e em versões posteriores, ele usa `InnoDB`. Se você está planejando uma atualização de uma versão anterior do NDB Cluster para a NDB 7.5.2 ou posterior, consulte a Seção 21.3.7, “Atualizando e Desatualizando o NDB Cluster”, para obter informações importantes relacionadas a essa mudança.

* `slave_master_info`, `slave_relay_log_info`, `slave_worker_info`: Usado para armazenar informações de replicação em servidores de replicação. Veja a Seção 16.2.4, “Repositórios de Log de Relay e Metadados de Replicação”.

Todas essas três tabelas utilizam o mecanismo de armazenamento `InnoDB`.

### Tabelas do Sistema de Otimizador

Essas tabelas do sistema são para uso pelo otimizador:

* `innodb_index_stats`, `innodb_table_stats`: Usado para estatísticas persistentes do otimizador `InnoDB`. Veja a Seção 14.8.11.1, “Configurando Parâmetros de Estatísticas de Otimizador Persistente”.

* `server_cost`, `engine_cost`: O modelo de custo do otimizador utiliza tabelas que contêm informações de estimativa de custo sobre operações que ocorrem durante a execução da consulta. `server_cost` contém estimativas de custo do otimizador para operações gerais do servidor. `engine_cost` contém estimativas para operações específicas de motores de armazenamento particulares. Veja a Seção 8.9.5, “O Modelo de Custo do Otimizador”.

Essas tabelas utilizam o mecanismo de armazenamento `InnoDB`.

### Tabelas de sistema variadas

Outras tabelas do sistema não se enquadram nas categorias anteriores:

* `audit_log_filter`, `audit_log_user`: Se o MySQL Enterprise Audit estiver instalado, essas tabelas fornecem armazenamento persistente das definições do filtro do registro de auditoria e das contas de usuário. Veja as tabelas do registro de auditoria.

* `firewall_users`, `firewall_whitelist`: Se o MySQL Enterprise Firewall estiver instalado, essas tabelas fornecem armazenamento persistente para as informações usadas pelo firewall. Veja a Seção 6.4.6, “MySQL Enterprise Firewall”.

* `servers`: Usado pelo motor de armazenamento `FEDERATED`. Veja a Seção 15.8.2.2, “Criando uma tabela FEDERATED usando CREATE SERVER”.

A tabela `servers` utiliza o mecanismo de armazenamento `InnoDB` a partir do MySQL 5.7.6, e `MyISAM` antes disso.