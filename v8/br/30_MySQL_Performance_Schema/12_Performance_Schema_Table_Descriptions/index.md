## 29.12 Descrições das tabelas do esquema de desempenho

29.12.1 Referência da Tabela do Schema de Desempenho

29.12.1 Configurações das tabelas do esquema de desempenho

29.12.3 Tabelas de Instâncias do Schema de Desempenho

29.12.4 Tabelas de Eventos de Aguarda do Schema de Desempenho

29.12.5 Tabelas de eventos de estágio do esquema de desempenho

29.12.6 Tabelas de eventos da declaração do esquema de desempenho

29.12.7 Tabelas de Transações do Schema de Desempenho

29.12.8 Tabelas de Conexão do Schema de Desempenho

29.12.9 Tabelas de atributos de conexão do esquema de desempenho

29.12.10 Tabelas de Variáveis Definidas pelo Usuário do Schema de Desempenho

Tabelas de Replicação do Schema de Desempenho 29.12.11

29.12.12 Schema de desempenho das tabelas do NDB Cluster

29.12.13 Tabelas de bloqueio do esquema de desempenho

29.12.14 Tabelas de variáveis do sistema do esquema de desempenho

Tabelas de variáveis do esquema de desempenho 29.12.15

Tabelas do Pool de Fios do Schema de Desempenho 29.12.16

29.12.17 Tabelas do Firewall do Schema de Desempenho

29.12.18 Tabelas do Carteira de Schema de Desempenho

29.12.19 Clonar tabelas do esquema de desempenho

29.12.20 Tabelas de Resumo do Schema de Desempenho

29.12.21 Schema de desempenho Tabelas Diversas

As tabelas no banco de dados `performance_schema` podem ser agrupadas da seguinte forma:

- Configure as tabelas. Essas tabelas são usadas para configurar e exibir as características de monitoramento.

- Tabelas de eventos atuais. A tabela `events_waits_current` contém o evento mais recente para cada tópico. Outras tabelas semelhantes contêm eventos atuais em diferentes níveis da hierarquia de eventos: `events_stages_current` para eventos de estágio, `events_statements_current` para eventos de declaração e `events_transactions_current` para eventos de transação.

- Tabelas de histórico. Essas tabelas têm a mesma estrutura das tabelas de eventos atuais, mas contêm mais linhas. Por exemplo, para eventos de espera, a tabela `events_waits_history` contém os 10 eventos mais recentes por fio. `events_waits_history_long` contém os 10.000 eventos mais recentes. Existem outras tabelas semelhantes para históricos de estágios, declarações e transações.

  Para alterar os tamanhos das tabelas de histórico, defina as variáveis de sistema apropriadas no início do servidor. Por exemplo, para definir os tamanhos das tabelas de histórico de eventos de espera, defina `performance_schema_events_waits_history_size` e `performance_schema_events_waits_history_long_size`.

- Tabelas de resumo. Essas tabelas contêm informações agregadas por grupos de eventos, incluindo aqueles que foram descartados das tabelas de histórico.

- Tabelas de instâncias. Essas tabelas documentam os tipos de objetos que estão instrumentados. Um objeto instrumentado, quando usado pelo servidor, gera um evento. Essas tabelas fornecem nomes de eventos e notas explicativas ou informações de status.

- Tabelas variadas. Essas não se enquadram em nenhum dos outros grupos de tabelas.
