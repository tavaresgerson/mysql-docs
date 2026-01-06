# Capítulo 25: Símio de Desempenho do MySQL

**Índice**

25.1 Início Rápido do Schema de Desempenho

25.2 Configuração de Configuração de Schema de Desempenho

25.3 Configuração de Inicialização do Schema de Desempenho

25.4 Configuração de Execução do Schema de Desempenho :   25.4.1 Cronometragem de Eventos do Schema de Desempenho

```
25.4.2 Performance Schema Event Filtering

25.4.3 Event Pre-Filtering

25.4.4 Pre-Filtering by Instrument

25.4.5 Pre-Filtering by Object

25.4.6 Pre-Filtering by Thread

25.4.7 Pre-Filtering by Consumer

25.4.8 Example Consumer Configurations

25.4.9 Naming Instruments or Consumers for Filtering Operations

25.4.10 Determining What Is Instrumented
```

25.5 Consultas do Schema de Desempenho

25.6 Convenções de Nomenclatura de Instrumentos do Schema de Desempenho

25.7 Monitoramento do estado do esquema de desempenho

25.8 Eventos de Schema de Desempenho de Átomo e Molécula

25.9 Tabelas do Schema de Desempenho para Eventos Atuais e Históricos

Resumo dos registros do esquema de desempenho

Características Gerais da Tabela do Schema de Desempenho

25.12 Descrições das tabelas do esquema de desempenho :   25.12.1 Referência das tabelas do esquema de desempenho

```
25.12.2 Performance Schema Setup Tables

25.12.3 Performance Schema Instance Tables

25.12.4 Performance Schema Wait Event Tables

25.12.5 Performance Schema Stage Event Tables

25.12.6 Performance Schema Statement Event Tables

25.12.7 Performance Schema Transaction Tables

25.12.8 Performance Schema Connection Tables

25.12.9 Performance Schema Connection Attribute Tables

25.12.10 Performance Schema User-Defined Variable Tables

25.12.11 Performance Schema Replication Tables

25.12.12 Performance Schema Lock Tables

25.12.13 Performance Schema System Variable Tables

25.12.14 Performance Schema Status Variable Tables

25.12.15 Performance Schema Summary Tables

25.12.16 Performance Schema Miscellaneous Tables
```

25.13 Opção do Schema de Desempenho e Referência de Variável

25.14 Opções de comando do esquema de desempenho

25.15 Variáveis do Sistema de Schema de Desempenho

25.16 Variáveis de status do esquema de desempenho

25.17 Modelo de Alocação de Memória do Schema de Desempenho

25.18 Schema de desempenho e plugins

25.19 Usando o Schema de Desempenho para Diagnosticar Problemas :   25.19.1 Análise de perfis de consulta usando o Schema de Desempenho

25.20 Migração para o Sistema de Schema de Desempenho e Tabelas de Variáveis de Status

25.21 Restrições no Schema de Desempenho

O MySQL Performance Schema é uma funcionalidade para monitorar a execução do MySQL Server em um nível baixo. O Performance Schema possui as seguintes características:

- O Schema de Desempenho oferece uma maneira de inspecionar a execução interna do servidor em tempo de execução. Ele é implementado usando o mecanismo de armazenamento `[PERFORMANCE_SCHEMA]` e o banco de dados `performance_schema`. O Schema de Desempenho foca principalmente nos dados de desempenho. Isso difere do `INFORMATION_SCHEMA`, que serve para a inspeção de metadados.

- O Schema de Desempenho monitora eventos do servidor. Um “evento” é qualquer ação que o servidor realiza que leva tempo e foi instrumentado para que informações de temporização possam ser coletadas. Em geral, um evento pode ser uma chamada de função, uma espera pelo sistema operacional, uma etapa de execução de uma instrução SQL, como análise ou ordenação, ou uma instrução inteira ou um grupo de instruções. A coleta de eventos fornece acesso a informações sobre chamadas de sincronização (como para mútuos), I/O de arquivos e tabelas, bloqueios de tabelas, entre outros, para o servidor e para vários motores de armazenamento.

- Os eventos do esquema de desempenho são distintos dos eventos escritos no log binário do servidor (que descrevem as modificações de dados) e dos eventos do Agendamento de Eventos (que são um tipo de programa armazenado).

- Os eventos do Schema de Desempenho são específicos para uma instância específica do MySQL Server. As tabelas do Schema de Desempenho são consideradas locais para o servidor, e as alterações nelas não são replicadas ou escritas no log binário.

- Os eventos atuais estão disponíveis, assim como as histórias e resumos dos eventos. Isso permite que você determine quantas vezes as atividades instrumentadas foram realizadas e quanto tempo elas levaram. As informações dos eventos estão disponíveis para mostrar as atividades de threads específicas ou atividades associadas a objetos particulares, como um mutex ou um arquivo.

- O mecanismo de armazenamento `PERFORMANCE_SCHEMA` coleta dados de eventos usando "pontos de instrumentação" no código-fonte do servidor.

- Os eventos coletados são armazenados em tabelas no banco de dados `performance_schema`. Essas tabelas podem ser consultadas usando instruções `SELECT` como outras tabelas.

- A configuração do Schema de Desempenho pode ser modificada dinamicamente atualizando tabelas no banco de dados `performance_schema` por meio de instruções SQL. As alterações na configuração afetam a coleta de dados imediatamente.

- As tabelas do Gerenciamento de Desempenho são tabelas de memória que não utilizam armazenamento persistente em disco. O conteúdo é reaproveitado a partir do início do servidor e descartado ao desligar o servidor.

- O monitoramento está disponível em todas as plataformas suportadas pelo MySQL.

  Algumas limitações podem se aplicar: os tipos de temporizadores podem variar de acordo com a plataforma. Os instrumentos que se aplicam a motores de armazenamento podem não ser implementados para todos os motores de armazenamento. A instrumentação de cada motor de terceiros é responsabilidade do mantenedor do motor. Veja também Seção 25.21, “Restrições no Schema de Desempenho”.

- A coleta de dados é implementada modificando o código-fonte do servidor para adicionar instrumentação. Não há threads separadas associadas ao Schema de Desempenho, ao contrário de outras funcionalidades, como replicação ou Agendamento de Eventos.

O Schema de Desempenho visa fornecer acesso a informações úteis sobre a execução do servidor, mantendo um impacto mínimo no desempenho do servidor. A implementação segue esses objetivos de design:

- A ativação do Schema de Desempenho não causa alterações no comportamento do servidor. Por exemplo, não altera a alocação de threads e não altera os planos de execução de consultas (como mostrado pelo `EXPLAIN`).

- O monitoramento do servidor ocorre continuamente e de forma discreta, com um custo muito baixo. A ativação do Schema de Desempenho não torna o servidor inutilizável.

- O analisador não foi alterado. Não há novas palavras-chave ou declarações.

- A execução do código do servidor prossegue normalmente, mesmo que o Schema de Desempenho falhe internamente.

- Quando há a opção de realizar o processamento durante a coleta de eventos inicialmente ou durante a recuperação de eventos mais tarde, a prioridade é fazer a coleta mais rápida. Isso ocorre porque a coleta está em andamento, enquanto a recuperação é sob demanda e pode não ocorrer em absoluto.

- É fácil adicionar novos pontos de instrumentação.

- A instrumentação é versionada. Se a implementação da instrumentação mudar, o código previamente instrumentado continua funcionando. Isso beneficia os desenvolvedores de plugins de terceiros, pois não é necessário atualizar cada plugin para se manter sincronizado com as últimas mudanças no Schema de Desempenho.

Nota

O esquema `sys` do MySQL é um conjunto de objetos que oferece acesso conveniente aos dados coletados pelo Gerenciador de Desempenho. O esquema `sys` é instalado por padrão. Para instruções de uso, consulte Capítulo 26, *Esquema sys do MySQL*.
