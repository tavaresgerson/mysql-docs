## 25.9 Tabelas do Schema de Desempenho para Eventos Atuais e Históricos

Para eventos de espera, etapa, declaração e transação, o Schema de Desempenho pode monitorar e armazenar eventos atuais. Além disso, quando os eventos terminam, o Schema de Desempenho pode armazená-los em tabelas de histórico. Para cada tipo de evento, o Schema de Desempenho usa três tabelas para armazenar eventos atuais e históricos. As tabelas têm nomes da seguinte forma, onde *`xxx`* indica o tipo de evento (`waits`, `stages`, `statements`, `transactions`):

- `events_xxx_current`: A tabela "eventos_xxx_current" armazena o evento monitorado atual para cada thread (uma linha por thread).

- `events_xxx_history`: A tabela "história recente" armazena os eventos mais recentes que terminaram por thread (até um número máximo de linhas por thread).

- `events_xxx_history_long`: A tabela "história longa" armazena os eventos mais recentes que terminaram globalmente (em todas as threads, até um número máximo de linhas por tabela).

A tabela `_current` para cada tipo de evento contém uma linha por thread, portanto, não há uma variável de sistema para configurar seu tamanho máximo. O Schema de Desempenho ajusta automaticamente as tabelas de histórico, ou os tamanhos podem ser configurados explicitamente durante a inicialização do servidor usando variáveis de sistema específicas da tabela, conforme indicado nas seções que descrevem as tabelas de histórico individuais. Os valores típicos de ajuste automático são 10 linhas por thread para as tabelas `_history` e 10.000 linhas no total para as tabelas `_history_long`.

Para cada tipo de evento, as tabelas `_current`, `_history` e `_history_long` têm as mesmas colunas.

As tabelas `_current` mostram o que está acontecendo atualmente no servidor. Quando um evento atual termina, ele é removido de sua tabela `_current`.

As tabelas _history e _history_long mostram o que aconteceu no passado recente. Quando as tabelas de histórico ficam cheias, os eventos antigos são descartados à medida que novos eventos são adicionados. As linhas expiram das tabelas _history e _history_long de maneiras diferentes porque as tabelas servem a propósitos diferentes:

- `_history` é destinado a investigar os threads individuais, independentemente da carga global do servidor.

- `_history_long` é destinado a investigar o servidor globalmente, não cada thread.

A diferença entre os dois tipos de tabelas de histórico está relacionada à política de retenção de dados. Ambas as tabelas contêm os mesmos dados quando um evento é visto pela primeira vez. No entanto, os dados em cada tabela expiram de maneira diferente ao longo do tempo, de modo que os dados podem ser preservados por um período mais longo ou mais curto em cada tabela:

- Para _history, quando a tabela contém o número máximo de linhas para um determinado thread, a linha mais antiga do thread é descartada quando uma nova linha para esse thread é adicionada.

- Para `_history_long`, quando a tabela ficar cheia, a linha mais antiga será descartada quando uma nova linha for adicionada, independentemente de qual thread tenha gerado a linha.

Quando um tópico é encerrado, todas as suas linhas são descartadas da tabela _history, mas não da tabela _history_long.

O exemplo a seguir ilustra as diferenças na forma como os eventos são adicionados e descartados nas duas tabelas de histórico. Os princípios se aplicam igualmente a todos os tipos de eventos. O exemplo é baseado nesses pressupostos:

- O Schema de Desempenho é configurado para reter 10 linhas por thread na tabela _history e 10.000 linhas no total na tabela _history_long.

- O thread A gera 1 evento por segundo.

  O thread B gera 100 eventos por segundo.

- Nenhum outro thread está em execução.

Após 5 segundos de execução:

- A e B geraram 5 e 500 eventos, respectivamente.

- `_history` contém 5 linhas para A e 10 linhas para B. Como o armazenamento por thread é limitado a 10 linhas, nenhuma linha foi descartada para A, enquanto 490 linhas foram descartadas para B.

- `_history_long` contém 5 linhas para A e 500 linhas para B. Como a tabela tem um tamanho máximo de 10.000 linhas, nenhuma linha foi descartada para nenhuma das threads.

Após 5 minutos (300 segundos) de execução:

- A e B geraram 300 e 30.000 eventos, respectivamente.

- `_history` contém 10 linhas para A e 10 linhas para B. Como o armazenamento por thread é limitado a 10 linhas, 290 linhas foram descartadas para A, enquanto 29.990 linhas foram descartadas para B. As linhas para A incluem dados de até 10 segundos de idade, enquanto as linhas para B incluem dados de apenas 0,1 segundo de idade.

- `_history_long` contém 10.000 linhas. Como A e B geram juntos 101 eventos por segundo, a tabela contém dados até aproximadamente 10.000/101 = 99 segundos, com uma mistura de linhas aproximadamente de 100 a 1 de B em oposição a A.
