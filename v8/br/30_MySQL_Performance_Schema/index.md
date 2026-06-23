# Capítulo 29 Símio de desempenho do MySQL

O Schema de Desempenho do MySQL é uma funcionalidade para monitorar a execução do servidor MySQL em um nível baixo. O Schema de Desempenho tem essas características:

* O Schema de Desempenho fornece uma maneira de inspecionar a execução interna do servidor em tempo de execução. Ele é implementado usando o mecanismo de armazenamento `PERFORMANCE_SCHEMA` e o banco de dados `performance_schema`. O Schema de Desempenho se concentra principalmente em dados de desempenho. Isso difere de `INFORMATION_SCHEMA`, que serve para inspeção de metadados.

* O Schema de Desempenho monitora eventos do servidor. Um "evento" é qualquer coisa que o servidor faz que leva tempo e que foi instrumentado para que informações de temporização possam ser coletadas. Em geral, um evento pode ser uma chamada de função, uma espera pelo sistema operacional, uma etapa de execução de uma declaração SQL, como análise ou ordenação, ou uma declaração inteira ou grupo de declarações. A coleta de eventos fornece acesso a informações sobre chamadas de sincronização (como para mútuos) de E/S de arquivos e tabelas, bloqueios de tabelas, etc., para o servidor e para vários motores de armazenamento.

* Os eventos do Schema de desempenho são distintos dos eventos escritos no log binário do servidor (que descrevem modificações de dados) e dos eventos do Agendamento de eventos (que são um tipo de programa armazenado).

* Os eventos do Schema de desempenho são específicos para uma instância dada do MySQL Server. As tabelas do Schema de desempenho são consideradas locais para o servidor, e as alterações nelas não são replicadas ou escritas no log binário.

* Os eventos atuais estão disponíveis, assim como históricos e resumos de eventos. Isso permite que você determine quantas vezes as atividades instrumentadas foram realizadas e quanto tempo elas levaram. As informações dos eventos estão disponíveis para mostrar as atividades de determinados tópicos ou atividades associadas a objetos específicos, como um mutex ou arquivo.

* O motor de armazenamento `PERFORMANCE_SCHEMA` coleta dados de eventos usando "pontos de instrumentação" no código-fonte do servidor.

* Os eventos coletados são armazenados em tabelas no banco de dados `performance_schema`. Essas tabelas podem ser consultadas usando declarações `SELECT` como outras tabelas.

* A configuração do Schema de desempenho pode ser modificada dinamicamente atualizando tabelas no banco de dados `performance_schema` por meio de instruções SQL. As alterações na configuração afetam a coleta de dados imediatamente.

* As tabelas do Gerador de Desempenho são tabelas de memória que não utilizam armazenamento persistente em disco. O conteúdo é repopulado a partir do início da inicialização do servidor e descartado na desativação do servidor.

* O monitoramento está disponível em todas as plataformas suportadas pelo MySQL.

Algumas limitações podem ser aplicadas: os tipos de temporizadores podem variar de acordo com a plataforma. Os instrumentos que se aplicam a motores de armazenamento podem não ser implementados para todos os motores de armazenamento. A instrumentação de cada motor de terceiros é responsabilidade do mantenedor do motor. Veja também a Seção 29.20, “Restrições no Schema de Desempenho”.

* A coleta de dados é implementada modificando o código-fonte do servidor para adicionar instrumentação. Não há threads separadas associadas ao Schema de desempenho, ao contrário de outras funcionalidades, como replicação ou o Agendamento de eventos.

O Schema de Desempenho é destinado a fornecer acesso a informações úteis sobre a execução do servidor, ao mesmo tempo em que tem um impacto mínimo no desempenho do servidor. A implementação segue esses objetivos de design:

* A ativação do Schema de Desempenho não causa alterações no comportamento do servidor. Por exemplo, não causa alterações na programação de threads e não causa alterações nos planos de execução de consultas (como mostrado por `EXPLAIN`).

* O monitoramento do servidor ocorre continuamente e de forma discreta, com um custo mínimo. A ativação do Schema de desempenho não torna o servidor inutilizável.

* O analisador não foi alterado. Não há novas palavras-chave ou declarações.

* A execução do código do servidor prossegue normalmente, mesmo se o Gerador de Desempenho falhar internamente.

* Quando há a opção de realizar o processamento durante a coleta de eventos inicialmente ou durante a recuperação de eventos posteriormente, a prioridade é dada para tornar a coleta mais rápida. Isso ocorre porque a coleta é contínua, enquanto a recuperação é sob demanda e pode não ocorrer em absoluto.

* A maioria das tabelas do Schema de Desempenho tem índices, o que permite ao otimizador acessar planos de execução diferentes de varreduras completas da tabela. Para mais informações, consulte a Seção 10.2.4, “Otimizando consultas do Schema de Desempenho”.

* É fácil adicionar novos pontos de instrumentação. * A instrumentação é versionada. Se a implementação da instrumentação mudar, o código previamente instrumentado continua a funcionar. Isso beneficia os desenvolvedores de plugins de terceiros, pois não é necessário atualizar cada plugin para se manter sincronizado com as últimas mudanças do Schema de Desempenho.

Nota

O esquema MySQL `sys` é um conjunto de objetos que oferece acesso conveniente aos dados coletados pelo Gerador de Desempenho. O esquema `sys` é instalado por padrão. Para instruções de uso, consulte o Capítulo 30, *Esquema sys MySQL*.