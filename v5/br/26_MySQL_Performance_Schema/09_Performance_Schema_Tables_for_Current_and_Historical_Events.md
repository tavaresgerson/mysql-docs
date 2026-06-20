## 25.9 Tabelas do Schema de Desempenho para Eventos Atuais e Históricos

Para eventos de espera, etapa, declaração e transação, o Schema de Desempenho pode monitorar e armazenar eventos atuais. Além disso, quando os eventos terminam, o Schema de Desempenho pode armazená-los em tabelas de histórico. Para cada tipo de evento, o Schema de Desempenho usa três tabelas para armazenar eventos atuais e históricos. As tabelas têm nomes dos seguintes formatos, onde *`xxx`* indica o tipo de evento (`waits`, `stages`, `statements`, `transactions`):

* `events_xxx_current`: A tabela “eventos atuais” armazena o evento monitorado atual para cada thread (uma string por thread).

* `events_xxx_history`: A tabela “história recente” armazena os eventos mais recentes que terminaram por thread (até um número máximo de strings por thread).

* `events_xxx_history_long`: A tabela "longa história" armazena os eventos mais recentes que terminaram globalmente (em todas as threads, até um número máximo de strings por tabela).

A tabela `_current` para cada tipo de evento contém uma string por thread, portanto, não há uma variável do sistema para configurar seu tamanho máximo. O Schema de Desempenho autodimensiona as tabelas de histórico, ou os tamanhos podem ser configurados explicitamente na inicialização do servidor usando variáveis de sistema específicas para cada tabela, conforme indicado nas seções que descrevem as tabelas de histórico individuais. Os valores típicos de autodimensionamento são 10 strings por thread para as tabelas `_history`, e 10.000 strings totais para as tabelas `_history_long`.

Para cada tipo de evento, as tabelas `_current`, `_history` e `_history_long` possuem as mesmas colunas.

As tabelas `_current` mostram o que está acontecendo atualmente dentro do servidor. Quando um evento atual termina, ele é removido de sua tabela `_current`.

As tabelas `_history` e `_history_long` mostram o que aconteceu no passado recente. Quando as tabelas de histórico se enchem, os eventos antigos são descartados à medida que novos eventos são adicionados. As strings expiram das tabelas `_history` e `_history_long` de maneiras diferentes, porque as tabelas servem a propósitos diferentes:

* `_history` é destinado a investigar threads individuais, independentemente da carga global do servidor.

* `_history_long` é destinado a investigar o servidor globalmente, não cada thread.

A diferença entre os dois tipos de tabelas de histórico está relacionada à política de retenção de dados. Ambas as tabelas contêm os mesmos dados quando um evento é visto pela primeira vez. No entanto, os dados dentro de cada tabela expiram de maneira diferente ao longo do tempo, de modo que os dados podem ser preservados por um período mais longo ou mais curto em cada tabela:

* Para `_history`, quando a tabela contém o número máximo de strings para um determinado thread, a string mais antiga do thread é descartada quando uma nova string para esse thread é adicionada.

* Para `_history_long`, quando a tabela ficar cheia, a string mais antiga é descartada quando uma nova string é adicionada, independentemente de qual thread gerou aquela string.

Quando um thread termina, todas as suas strings são descartadas da tabela `_history`, mas não da tabela `_history_long`.

O exemplo a seguir ilustra as diferenças na forma como os eventos são adicionados e descartados nas duas tipos de tabelas de histórico. Os princípios se aplicam igualmente a todos os tipos de eventos. O exemplo é baseado nesses pressupostos:

* O Schema de Desempenho é configurado para reter 10 strings por thread na tabela `_history` e 10.000 strings no total na tabela `_history_long`.

* O thread A gera 1 evento por segundo.

O thread B gera 100 eventos por segundo.

* Nenhuma outra string está em execução.

Após 5 segundos de execução:

* A e B geraram 5 e 500 eventos, respectivamente.
* `_history` contém 5 strings para A e 10 strings para B. Como o armazenamento por thread é limitado a 10 strings, não foram descartadas nenhuma string para A, enquanto 490 strings foram descartadas para B.

* `_history_long` contém 5 strings para A e 500 strings para B. Como a tabela tem um tamanho máximo de 10.000 strings, nenhuma string foi descartada para nenhum dos threads.

Após 5 minutos (300 segundos) de execução:

* A e B geraram 300 e 30.000 eventos, respectivamente.
* `_history` contém 10 strings para A e 10 strings para B. Como o armazenamento por thread é limitado a 10 strings, 290 strings foram descartadas para A, enquanto 29.990 strings foram descartadas para B. As strings para A incluem dados de até 10 segundos de idade, enquanto as strings para B incluem dados de apenas 0,1 segundo de idade.

* `_history_long` contém 10.000 strings. Como A e B juntos geram 101 eventos por segundo, a tabela contém dados até aproximadamente 10.000/101 = 99 segundos de idade, com uma mistura de strings aproximadamente de 100 a 1 de B em oposição a A.