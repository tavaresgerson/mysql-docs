# Capítulo 25 MySQL Performance Schema

**Índice**

[25.1 Início Rápido do Performance Schema](performance-schema-quick-start.html)

[25.2 Configuração de Compilação (Build) do Performance Schema](performance-schema-build-configuration.html)

[25.3 Configuração de Inicialização (Startup) do Performance Schema](performance-schema-startup-configuration.html)

[25.4 Configuração em Tempo de Execução (Runtime) do Performance Schema](performance-schema-runtime-configuration.html) :   [25.4.1 Temporização de Eventos (Event Timing) do Performance Schema](performance-schema-timing.html)

    [25.4.2 Filtragem de Eventos (Event Filtering) do Performance Schema](performance-schema-filtering.html)

    [25.4.3 Pré-Filtragem de Eventos (Event Pre-Filtering)](performance-schema-pre-filtering.html)

    [25.4.4 Pré-Filtragem por Instrument](performance-schema-instrument-filtering.html)

    [25.4.5 Pré-Filtragem por Objeto](performance-schema-object-filtering.html)

    [25.4.6 Pré-Filtragem por Thread](performance-schema-thread-filtering.html)

    [25.4.7 Pré-Filtragem por Consumer](performance-schema-consumer-filtering.html)

    [25.4.8 Exemplos de Configurações de Consumer](performance-schema-consumer-configurations.html)

    [25.4.9 Nomeando Instruments ou Consumers para Operações de Filtragem](performance-schema-filtering-names.html)

    [25.4.10 Determinando o que Está Instrumented](performance-schema-instrumentation-checking.html)

[25.5 Queries do Performance Schema](performance-schema-queries.html)

[25.6 Convenções de Nomenclatura de Instrumentos do Performance Schema](performance-schema-instrument-naming.html)

[25.7 Monitoramento de Status do Performance Schema](performance-schema-status-monitoring.html)

[25.8 Eventos Atom e Molecule do Performance Schema](performance-schema-atom-molecule-events.html)

[25.9 Tabelas do Performance Schema para Eventos Atuais e Históricos](performance-schema-event-tables.html)

[25.10 Digests de Statement do Performance Schema](performance-schema-statement-digests.html)

[25.11 Características Gerais das Tabelas do Performance Schema](performance-schema-table-characteristics.html)

[25.12 Descrições das Tabelas do Performance Schema](performance-schema-table-descriptions.html) :   [25.12.1 Referência de Tabelas do Performance Schema](performance-schema-table-reference.html)

    [25.12.2 Tabelas de Configuração (Setup) do Performance Schema](performance-schema-setup-tables.html)

    [25.12.3 Tabelas de Instância do Performance Schema](performance-schema-instance-tables.html)

    [25.12.4 Tabelas de Eventos de Espera (Wait Event) do Performance Schema](performance-schema-wait-tables.html)

    [25.12.5 Tabelas de Eventos de Estágio (Stage Event) do Performance Schema](performance-schema-stage-tables.html)

    [25.12.6 Tabelas de Eventos de Statement do Performance Schema](performance-schema-statement-tables.html)

    [25.12.7 Tabelas de Transação do Performance Schema](performance-schema-transaction-tables.html)

    [25.12.8 Tabelas de Conexão do Performance Schema](performance-schema-connection-tables.html)

    [25.12.9 Tabelas de Atributos de Conexão do Performance Schema](performance-schema-connection-attribute-tables.html)

    [25.12.10 Tabelas de Variáveis Definidas pelo Usuário do Performance Schema](performance-schema-user-variable-tables.html)

    [25.12.11 Tabelas de Replication do Performance Schema](performance-schema-replication-tables.html)

    [25.12.12 Tabelas de Lock do Performance Schema](performance-schema-lock-tables.html)

    [25.12.13 Tabelas de Variáveis de Sistema do Performance Schema](performance-schema-system-variable-tables.html)

    [25.12.14 Tabelas de Variáveis de Status do Performance Schema](performance-schema-status-variable-tables.html)

    [25.12.15 Tabelas de Resumo (Summary) do Performance Schema](performance-schema-summary-tables.html)

    [25.12.16 Tabelas Diversas (Miscellaneous) do Performance Schema](performance-schema-miscellaneous-tables.html)

[25.13 Referência de Opções e Variáveis do Performance Schema](performance-schema-option-variable-reference.html)

[25.14 Opções de Comando do Performance Schema](performance-schema-options.html)

[25.15 Variáveis de Sistema do Performance Schema](performance-schema-system-variables.html)

[25.16 Variáveis de Status do Performance Schema](performance-schema-status-variables.html)

[25.17 O Modelo de Alocação de Memória do Performance Schema](performance-schema-memory-model.html)

[25.18 Performance Schema e Plugins](performance-schema-and-plugins.html)

[25.19 Usando o Performance Schema para Diagnosticar Problemas](performance-schema-examples.html) :   [25.19.1 Geração de Perfil de Query (Query Profiling) Usando Performance Schema](performance-schema-query-profiling.html)

[25.20 Migrando para as Tabelas de Variáveis de Sistema e Status do Performance Schema](performance-schema-variable-table-migration.html)

[25.21 Restrições no Performance Schema](performance-schema-restrictions.html)

O Performance Schema do MySQL é um recurso para monitorar a execução do MySQL Server em um nível baixo. O Performance Schema possui as seguintes características:

* O Performance Schema fornece uma maneira de inspecionar a execução interna do servidor em tempo de execução (runtime). Ele é implementado usando o Storage Engine `PERFORMANCE_SCHEMA` e o Database `performance_schema`. O Performance Schema foca principalmente em dados de performance. Isso difere do `INFORMATION_SCHEMA`, que serve para a inspeção de metadados.

* O Performance Schema monitora Events do servidor. Um “Event” é qualquer coisa que o servidor faz que leva tempo e foi instrumentado para que as informações de temporização (timing) possam ser coletadas. Em geral, um Event pode ser uma chamada de função, uma espera pelo sistema operacional, um estágio de execução de um statement SQL como parsing ou sorting, ou um statement inteiro ou grupo de statements. A coleta de Events fornece acesso a informações sobre chamadas de sincronização (como para Mutexes), I/O de arquivos e tabelas, Locks de tabela e assim por diante para o servidor e para vários Storage Engines.

* Os Events do Performance Schema são distintos dos Events gravados no binary log do servidor (que descrevem modificações de dados) e dos Events do Event Scheduler (que são um tipo de stored program).

* Os Events do Performance Schema são específicos a uma determinada instância do MySQL Server. As tabelas do Performance Schema são consideradas locais ao servidor, e as alterações feitas nelas não são replicadas nem gravadas no binary log.

* Events atuais estão disponíveis, assim como históricos e resumos de Events. Isso permite determinar quantas vezes as atividades instrumented foram executadas e quanto tempo elas levaram. As informações de Event estão disponíveis para mostrar as atividades de Threads específicas, ou a atividade associada a objetos específicos, como um Mutex ou arquivo.

* O Storage Engine `PERFORMANCE_SCHEMA` coleta dados de Event usando “pontos de Instrumentation” no código-fonte do servidor.

* Os Events coletados são armazenados em tabelas no Database `performance_schema`. Essas tabelas podem ser consultadas usando statements `SELECT` como outras tabelas.

* A configuração do Performance Schema pode ser modificada dinamicamente atualizando tabelas no Database `performance_schema` por meio de statements SQL. As alterações de configuração afetam a coleta de dados imediatamente.

* As tabelas no Performance Schema são tabelas in-memory que não utilizam armazenamento persistente em disco (on-disk). O conteúdo é repopulado a partir da inicialização do servidor (startup) e descartado no desligamento do servidor (shutdown).

* O monitoramento está disponível em todas as plataformas suportadas pelo MySQL.

  Algumas limitações podem se aplicar: Os tipos de timers podem variar por plataforma. Instruments que se aplicam a Storage Engines podem não ser implementados para todos os Storage Engines. A Instrumentation de cada engine de terceiros é responsabilidade do mantenedor do engine. Veja também [Seção 25.21, “Restrições no Performance Schema”](performance-schema-restrictions.html "25.21 Restrições no Performance Schema").

* A coleta de dados é implementada modificando o código-fonte do servidor para adicionar Instrumentation. Não há Threads separadas associadas ao Performance Schema, diferentemente de outros recursos como replication ou o Event Scheduler.

O Performance Schema tem como objetivo fornecer acesso a informações úteis sobre a execução do servidor, com impacto mínimo no desempenho do servidor. A implementação segue estas metas de design:

* A ativação do Performance Schema não causa alterações no comportamento do servidor. Por exemplo, ele não causa mudanças no agendamento de Thread, e não causa alterações nos planos de execução de Query (como mostrado por `EXPLAIN`).

* O monitoramento do servidor ocorre de forma contínua e discreta, com pouca sobrecarga (overhead). A ativação do Performance Schema não torna o servidor inutilizável.

* O Parser permanece inalterado. Não há novas palavras-chave ou statements.

* A execução do código do servidor prossegue normalmente mesmo que o Performance Schema falhe internamente.

* Quando há uma escolha entre realizar o processamento durante a coleta de Events inicialmente ou durante a recuperação de Events posteriormente, a prioridade é dada a tornar a coleta mais rápida. Isso ocorre porque a coleta é contínua, enquanto a recuperação é sob demanda e pode nunca acontecer.

* É fácil adicionar novos pontos de Instrumentation.
* A Instrumentation é versionada. Se a implementação da Instrumentation mudar, o código previamente instrumented continua a funcionar. Isso beneficia os desenvolvedores de Plugins de terceiros, pois não é necessário atualizar cada Plugin para se manter sincronizado com as últimas alterações do Performance Schema.

**Nota**

O schema `sys` do MySQL é um conjunto de objetos que fornece acesso conveniente aos dados coletados pelo Performance Schema. O schema `sys` é instalado por padrão. Para instruções de uso, veja [Capítulo 26, *MySQL sys Schema*](sys-schema.html "Chapter 26 MySQL sys Schema").