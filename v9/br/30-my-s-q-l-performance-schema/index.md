# Capítulo 29 Schema de Desempenho do MySQL

**Índice**

29.1 Início Rápido do Schema de Desempenho

29.2 Configuração de Construção do Schema de Desempenho

29.3 Configuração de Inicialização do Schema de Desempenho

29.4 Configuração de Tempo de Execução do Schema de Desempenho :   29.4.1 Temporização de Eventos do Schema de Desempenho

    29.4.2 Filtragem de Eventos do Schema de Desempenho

    29.4.3 Pré-filtragem de Eventos

    29.4.4 Pré-filtragem por Instrumento

    29.4.5 Pré-filtragem por Objeto

    29.4.6 Pré-filtragem por Fuso

    29.4.7 Pré-filtragem por Consumidor

    29.4.8 Configurações de Consumidores Exemplos

    29.4.9 Nomeação de Instrumentos ou Consumidores para Operações de Filtragem

    29.4.10 Determinando o que está Instrumentado

29.5 Consultas do Schema de Desempenho

29.6 Convenções de Nomenclatura de Instrumentos do Schema de Desempenho

29.7 Monitoramento do Status do Schema de Desempenho

29.8 Eventos de Átomo e Molécula do Schema de Desempenho

29.9 Tabelas do Schema de Desempenho para Eventos Atuais e Históricos

29.10 Digestas e Amostragem de Declarações do Schema de Desempenho

29.11 Características Gerais das Tabelas do Schema de Desempenho

29.12 Descrições das Tabelas do Schema de Desempenho :   29.12.1 Referência da Tabela do Schema de Desempenho

    29.12.2 Tabelas de Configuração do Schema de Inicialização

    29.12.3 Tabelas de Instância do Schema de Desempenho

    29.12.4 Tabelas de Eventos de Espera do Schema de Desempenho

    29.12.5 Tabelas de Eventos de Estágio do Schema de Desempenho

    29.12.6 Tabelas de Eventos de Declaração do Schema de Desempenho

    29.12.7 Tabelas de Eventos de Transação do Schema de Desempenho

    29.12.8 Tabelas de Conexão do Schema de Desempenho

    29.12.9 Tabelas de Atributos de Conexão do Schema de Desempenho

    29.12.10 Tabelas de Variáveis Definidas pelo Usuário do Schema de Desempenho

    29.12.11 Tabelas de Replicação do Schema de Desempenho

    29.12.12 Tabelas do NDB Cluster do Schema de Desempenho

    29.12.13 Tabelas de Bloqueio do Schema de Desempenho

    29.12.14 Tabelas de Variáveis do Sistema do Schema de Desempenho

29.12.15 Tabelas de Variáveis do Schema de Desempenho

    29.12.16 Tabelas do Pool de Threads do Schema de Desempenho

    29.12.17 Tabelas do Firewall do Schema de Desempenho

    29.12.18 Tabelas do Carteira de Chaves do Schema de Desempenho

    29.12.19 Tabelas de Clone do Schema de Desempenho

    29.12.20 Tabelas de Resumo do Schema de Desempenho

    29.12.21 Tabelas de Telemetria do Schema de Desempenho

    29.12.22 Tabelas Diversas do Schema de Desempenho

29.13 Referência de Opções e Variáveis do Schema de Desempenho

29.14 Opções de Comando do Schema de Desempenho

29.15 Variáveis de Sistema do Schema de Desempenho

29.16 Variáveis de Status do Schema de Desempenho

29.17 O Modelo de Alocação de Memória do Schema de Desempenho

29.18 Schema de Desempenho e Plugins

29.19 Usando o Schema de Desempenho para Diagnosticar Problemas:   29.19.1 Profilagem de Consulta Usando o Schema de Desempenho

    29.19.2 Obtenção de Informações de Evento Pais

29.20 Restrições do Schema de Desempenho

O Schema de Desempenho do MySQL é uma funcionalidade para monitorar a execução do servidor MySQL em um nível baixo. O Schema de Desempenho tem essas características:

* O Schema de Desempenho fornece uma maneira de inspecionar a execução interna do servidor em tempo de execução. Ele é implementado usando o mecanismo de armazenamento `PERFORMANCE_SCHEMA` e o banco de dados `performance_schema`. O Schema de Desempenho foca principalmente em dados de desempenho. Isso difere da `INFORMATION_SCHEMA`, que serve para a inspeção de metadados.

* O Schema de Desempenho monitora eventos do servidor. Um “evento” é qualquer ação realizada pelo servidor que leva tempo e foi instrumentada para que informações de temporização possam ser coletadas. Em geral, um evento pode ser uma chamada de função, uma espera pelo sistema operacional, uma etapa de execução de uma instrução SQL, como análise ou ordenação, ou uma instrução inteira ou um grupo de instruções. A coleta de eventos fornece acesso a informações sobre chamadas de sincronização (como para mutexes), I/O de arquivos e tabelas, bloqueios de tabelas, entre outros, para o servidor e para vários motores de armazenamento.

* Os eventos do Schema de Desempenho são distintos dos eventos escritos no log binário do servidor (que descrevem modificações de dados) e dos eventos do Agendamento de Eventos (que são um tipo de programa armazenado).

* Os eventos do Schema de Desempenho são específicos para uma instância dada do MySQL Server. As tabelas do Schema de Desempenho são consideradas locais para o servidor, e as alterações nelas não são replicadas ou escritas no log binário.

* Eventos atuais estão disponíveis, assim como históricos e resumos de eventos. Isso permite determinar quantas vezes as atividades instrumentadas foram realizadas e quanto tempo elas levaram. As informações dos eventos estão disponíveis para mostrar as atividades de threads específicas ou atividades associadas a objetos particulares, como um mutex ou um arquivo.

* O motor de armazenamento `PERFORMANCE_SCHEMA` coleta dados de eventos usando “pontos de instrumentação” no código-fonte do servidor.

* Os eventos coletados são armazenados em tabelas no banco de dados `performance_schema`. Essas tabelas podem ser consultadas usando instruções `SELECT` como outras tabelas.

* A configuração do Schema de Desempenho pode ser modificada dinamicamente atualizando tabelas no banco de dados `performance_schema` por meio de instruções SQL. As alterações na configuração afetam a coleta de dados imediatamente.

* As tabelas do Schema de Desempenho são tabelas de memória que não utilizam armazenamento persistente no disco. O conteúdo é reaprovado a partir do início da inicialização do servidor e descartado na parada do servidor.

* O monitoramento está disponível em todas as plataformas suportadas pelo MySQL.

* Algumas limitações podem ser aplicadas: os tipos de temporizadores podem variar de acordo com a plataforma. Os instrumentos que se aplicam aos motores de armazenamento podem não ser implementados para todos os motores de armazenamento. A instrumentação de cada motor de terceiros é responsabilidade do mantenedor do motor. Veja também a Seção 29.20, “Restrições no Schema de Desempenho”.

* A coleta de dados é implementada modificando o código-fonte do servidor para adicionar instrumentação. Não há threads separados associados ao Schema de Desempenho, ao contrário de outras funcionalidades, como replicação ou Agendamento de Eventos.

O Schema de Desempenho é destinado a fornecer acesso a informações úteis sobre a execução do servidor, com um impacto mínimo no desempenho do servidor. A implementação segue esses objetivos de design:

* A ativação do Schema de Desempenho não causa alterações no comportamento do servidor. Por exemplo, não altera a alocação de threads e não altera os planos de execução de consultas (como mostrado pelo `EXPLAIN`).

* O monitoramento do servidor ocorre continuamente e de forma discreta, com muito pouco overhead. A ativação do Schema de Desempenho não torna o servidor inutilizável.

* O analisador permanece inalterado. Não há novas palavras-chave ou declarações.

* A execução do código do servidor prossegue normalmente, mesmo que o Schema de Desempenho falhe internamente.

* Quando há a opção de realizar o processamento durante a coleta de eventos inicialmente ou durante a recuperação de eventos posteriormente, a prioridade é fazer a coleta mais rápida. Isso ocorre porque a coleta é contínua, enquanto a recuperação é sob demanda e pode não ocorrer em nenhum momento.

* A maioria das tabelas do Schema de Desempenho tem índices, o que dá ao otimizador acesso a planos de execução diferentes de varreduras completas da tabela. Para mais informações, consulte a Seção 10.2.4, “Otimizando Consultas do Schema de Desempenho”.

* É fácil adicionar novos pontos de instrumentação.
* A instrumentação é versionada. Se a implementação da instrumentação mudar, o código previamente instrumentado continua funcionando. Isso beneficia os desenvolvedores de plugins de terceiros, pois não é necessário atualizar cada plugin para se manter sincronizado com as últimas mudanças no Schema de Desempenho.

Nota

O esquema `sys` do MySQL é um conjunto de objetos que fornece acesso conveniente aos dados coletados pelo Schema de Desempenho. O esquema `sys` é instalado por padrão. Para instruções de uso, consulte o Capítulo 30, *Esquema sys do MySQL*.