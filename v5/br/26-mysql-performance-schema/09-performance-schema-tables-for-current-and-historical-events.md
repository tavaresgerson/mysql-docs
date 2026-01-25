## 25.9 Tabelas do Performance Schema para Eventos Atuais e Históricos

Para eventos de espera (wait), estágio (stage), instrução (statement) e transação (transaction), o Performance Schema pode monitorar e armazenar eventos atuais. Além disso, quando os eventos terminam, o Performance Schema pode armazená-los em tabelas de histórico. Para cada tipo de evento, o Performance Schema utiliza três tabelas para armazenar eventos atuais e históricos. As tabelas têm nomes nos seguintes formatos, onde *`xxx`* indica o tipo de evento (`waits`, `stages`, `statements`, `transactions`):

* `events_xxx_current`: A tabela de "eventos atuais" armazena o evento monitorado atual para cada Thread (uma row por Thread).

* `events_xxx_history`: A tabela de "histórico recente" armazena os eventos mais recentes que terminaram por Thread (até um número máximo de rows por Thread).

* `events_xxx_history_long`: A tabela de "histórico longo" armazena os eventos mais recentes que terminaram globalmente (em todos os Threads, até um número máximo de rows por tabela).

A tabela `_current` para cada tipo de evento contém uma row por Thread, portanto não há uma system variable para configurar seu tamanho máximo. O Performance Schema dimensiona (autosizes) as tabelas de histórico automaticamente, ou os tamanhos podem ser configurados explicitamente na inicialização do servidor usando system variables específicas de tabela, conforme indicado nas seções que descrevem as tabelas de histórico individuais. Valores típicos de dimensionamento automático (autosized) são 10 rows por Thread para as tabelas `_history` e 10.000 rows totais para as tabelas `_history_long`.

Para cada tipo de evento, as tabelas `_current`, `_history` e `_history_long` possuem as mesmas colunas.

As tabelas `_current` mostram o que está acontecendo atualmente dentro do servidor. Quando um evento atual termina, ele é removido de sua tabela `_current`.

As tabelas `_history` e `_history_long` mostram o que aconteceu no passado recente. Quando as tabelas de histórico ficam cheias, os eventos antigos são descartados à medida que novos eventos são adicionados. As Rows expiram das tabelas `_history` e `_history_long` de maneiras diferentes, pois as tabelas servem a propósitos distintos:

* `_history` destina-se a investigar Threads individuais, independentemente da carga global do servidor.

* `_history_long` destina-se a investigar o servidor globalmente, e não cada Thread.

A diferença entre os dois tipos de tabelas de histórico está relacionada à política de retenção de dados. Ambas as tabelas contêm os mesmos dados quando um evento é visto pela primeira vez. No entanto, os dados em cada tabela expiram de forma diferente ao longo do tempo, de modo que os dados podem ser preservados por um período maior ou menor em cada tabela:

* Para `_history`, quando a tabela contém o número máximo de rows para um determinado Thread, a row mais antiga desse Thread é descartada quando uma nova row para esse Thread é adicionada.

* Para `_history_long`, quando a tabela fica cheia, a row mais antiga é descartada quando uma nova row é adicionada, independentemente de qual Thread gerou qualquer uma das rows.

Quando um Thread termina, todas as suas rows são descartadas da tabela `_history`, mas não da tabela `_history_long`.

O exemplo a seguir ilustra as diferenças em como os eventos são adicionados e descartados dos dois tipos de tabelas de histórico. Os princípios se aplicam igualmente a todos os tipos de eventos. O exemplo é baseado nas seguintes premissas:

* O Performance Schema está configurado para reter 10 rows por Thread na tabela `_history` e 10.000 rows totais na tabela `_history_long`.

* O Thread A gera 1 evento por segundo.

* O Thread B gera 100 eventos por segundo.

* Nenhum outro Thread está em execução.

Após 5 segundos de execução:

* A e B geraram 5 e 500 eventos, respectivamente.
* `_history` contém 5 rows para A e 10 rows para B. Como o armazenamento por Thread é limitado a 10 rows, nenhuma row foi descartada para A, enquanto 490 rows foram descartadas para B.

* `_history_long` contém 5 rows para A e 500 rows para B. Como a tabela tem um tamanho máximo de 10.000 rows, nenhuma row foi descartada para nenhum dos Threads.

Após 5 minutos (300 segundos) de execução:

* A e B geraram 300 e 30.000 eventos, respectivamente.
* `_history` contém 10 rows para A e 10 rows para B. Como o armazenamento por Thread é limitado a 10 rows, 290 rows foram descartadas para A, enquanto 29.990 rows foram descartadas para B. As Rows para A incluem dados com até 10 segundos de idade, enquanto as rows para B incluem dados com apenas 0,1 segundos de idade.

* `_history_long` contém 10.000 rows. Como A e B geram juntos 101 eventos por segundo, a tabela contém dados com aproximadamente 10.000/101 = 99 segundos de idade, com uma mistura de rows de B em oposição a A na proporção de aproximadamente 100 para 1.