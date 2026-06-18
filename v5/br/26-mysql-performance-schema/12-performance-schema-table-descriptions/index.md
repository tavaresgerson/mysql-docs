## 25.12 Descrições de Tabelas do Performance Schema

25.12.1 Referência das Tabelas do Performance Schema

25.12.2 Tabelas de Configuração do Performance Schema

25.12.3 Tabelas de Instâncias do Performance Schema

25.12.4 Tabelas de Eventos de Espera (Wait Event) do Performance Schema

25.12.5 Tabelas de Eventos de Estágio (Stage Event) do Performance Schema

25.12.6 Tabelas de Eventos de Statement (Statement Event) do Performance Schema

25.12.7 Tabelas de Transações do Performance Schema

25.12.8 Tabelas de Conexão do Performance Schema

25.12.9 Tabelas de Atributos de Conexão do Performance Schema

25.12.10 Tabelas de Variáveis Definidas pelo Usuário do Performance Schema

25.12.11 Tabelas de Replicação do Performance Schema

25.12.12 Tabelas de Lock do Performance Schema

25.12.13 Tabelas de Variáveis de Sistema do Performance Schema

25.12.14 Tabelas de Variáveis de Status do Performance Schema

25.12.15 Tabelas de Resumo (Summary) do Performance Schema

25.12.16 Tabelas Diversas do Performance Schema

As tabelas no `database` `performance_schema` podem ser agrupadas da seguinte forma:

* Tabelas de Configuração (Setup). Essas tabelas são usadas para configurar e exibir características de monitoramento.

* Tabelas de Eventos Atuais (Current events). A tabela `events_waits_current` contém o evento mais recente para cada `thread`. Outras tabelas semelhantes contêm eventos atuais em diferentes níveis da hierarquia de eventos: `events_stages_current` para eventos de estágio, `events_statements_current` para eventos de `statement`, e `events_transactions_current` para eventos de transação.

* Tabelas de Histórico (History). Essas tabelas têm a mesma estrutura que as tabelas de eventos atuais, mas contêm mais linhas. Por exemplo, para eventos de espera, a tabela `events_waits_history` contém os 10 eventos mais recentes por `thread`. A tabela `events_waits_history_long` contém os 10.000 eventos mais recentes. Outras tabelas semelhantes existem para históricos de estágio, `statement` e transação.

  Para alterar os tamanhos das tabelas de histórico, defina as variáveis de sistema apropriadas na inicialização do `server`. Por exemplo, para definir os tamanhos das tabelas de histórico de eventos de espera, defina `performance_schema_events_waits_history_size` e `performance_schema_events_waits_history_long_size`.

* Tabelas de Resumo (Summary). Essas tabelas contêm informações agregadas sobre grupos de eventos, incluindo aqueles que foram descartados das tabelas de histórico.

* Tabelas de Instâncias (Instance). Essas tabelas documentam quais tipos de objetos são instrumentados. Um objeto instrumentado, quando usado pelo `server`, produz um evento. Essas tabelas fornecem nomes de eventos e notas explicativas ou informações de status.

* Tabelas Diversas (Miscellaneous). Estas não se enquadram em nenhum dos outros grupos de tabelas.