## Tabelas do Schema de Desempenho para Eventos Atuais e Históricos

Para eventos de espera, estágio, declaração e transação, o Schema de Desempenho pode monitorar e armazenar eventos atuais. Além disso, quando os eventos terminam, o Schema de Desempenho pode armazená-los em tabelas de histórico. Para cada tipo de evento, o Schema de Desempenho usa três tabelas para armazenar eventos atuais e históricos. As tabelas têm nomes das seguintes formas, onde *`xxx`* indica o tipo de evento (`waits`, `stages`, `statements`, `transactions`):

* `events_xxx_current`: A tabela “eventos atuais” armazena o evento monitorado atual para cada thread (uma linha por thread).

* `events_xxx_history`: A tabela “histórico recente” armazena os eventos mais recentes que terminaram por thread (até um número máximo de linhas por thread).

* `events_xxx_history_long`: A tabela “histórico longo” armazena os eventos mais recentes que terminaram globalmente (em todas as threads, até um número máximo de linhas por tabela).

A tabela `_current` para cada tipo de evento contém uma linha por thread, então não há variável de sistema para configurar seu tamanho máximo. O Schema de Desempenho autodimensiona as tabelas de histórico, ou os tamanhos podem ser configurados explicitamente na inicialização do servidor usando variáveis de sistema específicas da tabela, conforme indicado nas seções que descrevem as tabelas de histórico individuais. Valores autodimensionados típicos são 10 linhas por thread para as tabelas `_history` e 10.000 linhas totais para as tabelas `_history_long`.

Para cada tipo de evento, as tabelas `_current`, `_history` e `_history_long` têm as mesmas colunas. As tabelas `_current` e `_history` têm a mesma indexação. A tabela `_history_long` não tem indexação.

As tabelas `_current` mostram o que está acontecendo atualmente dentro do servidor. Quando um evento atual termina, ele é removido de sua tabela `_current`.

As tabelas `_history` e `_history_long` mostram o que aconteceu no passado recente. Quando as tabelas de histórico se tornam cheias, os eventos antigos são descartados à medida que novos eventos são adicionados. As linhas expiram das tabelas `_history` e `_history_long` de maneiras diferentes porque as tabelas servem a propósitos diferentes:

* `_history` é destinado a investigar threads individuais, independentemente da carga global do servidor.

* `_history_long` é destinado a investigar o servidor globalmente, não cada thread.

A diferença entre os dois tipos de tabelas de histórico está relacionada à política de retenção de dados. Ambas as tabelas contêm os mesmos dados quando um evento é visto pela primeira vez. No entanto, os dados dentro de cada tabela expiram de maneira diferente ao longo do tempo, de modo que os dados podem ser preservados por um tempo mais longo ou mais curto em cada tabela:

* Para `_history`, quando a tabela contém o número máximo de linhas para um thread específico, a linha de thread mais antiga é descartada quando uma nova linha para esse thread é adicionada.

* Para `_history_long`, quando a tabela se torna cheia, a linha mais antiga é descartada quando uma nova linha é adicionada, independentemente de qual thread gerou a linha.

Quando um thread termina, todas as suas linhas são descartadas da tabela `_history`, mas não da tabela `_history_long`.

O exemplo seguinte ilustra as diferenças em como os eventos são adicionados e descartados nas duas tipos de tabelas de histórico. Os princípios se aplicam igualmente a todos os tipos de eventos. O exemplo é baseado nessas suposições:

* O Schema de Desempenho é configurado para reter 10 linhas por thread na tabela `_history` e 10.000 linhas totais na tabela `_history_long`.

* O Thread A gera 1 evento por segundo.

  O Thread B gera 100 eventos por segundo.

* Nenhum outro thread está em execução.

Após 5 segundos de execução:

* A e B geraram, respectivamente, 5 e 500 eventos.
* `_history` contém 5 linhas para A e 10 linhas para B. Como o armazenamento por fio é limitado a 10 linhas, nenhuma linha foi descartada para A, enquanto 490 linhas foram descartadas para B.

* `_history_long` contém 5 linhas para A e 500 linhas para B. Como a tabela tem um tamanho máximo de 10.000 linhas, nenhuma linha foi descartada para nenhum dos fios.

Após 5 minutos (300 segundos) de execução:

* A e B geraram, respectivamente, 300 e 30.000 eventos.
* `_history` contém 10 linhas para A e 10 linhas para B. Como o armazenamento por fio é limitado a 10 linhas, 290 linhas foram descartadas para A, enquanto 29.990 linhas foram descartadas para B. As linhas para A incluem dados de até 10 segundos de idade, enquanto as linhas para B incluem dados de até apenas 0,1 segundo de idade.

* `_history_long` contém 10.000 linhas. Como A e B juntos geram 101 eventos por segundo, a tabela contém dados de até aproximadamente 10.000/101 = 99 segundos de idade, com uma mistura de linhas aproximadamente 100 a 1 de B em oposição a A.