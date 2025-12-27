#### 25.4.3.13 Gerenciamento de Memória do Nó de Dados

Toda a alocação de memória para um nó de dados é realizada quando o nó é iniciado. Isso garante que o nó de dados possa funcionar de maneira estável sem usar memória de troca, permitindo que o `NDB` seja usado para aplicações sensíveis à latência (em tempo real). Os seguintes tipos de memória são alocados no início do nó de dados:

* Memória de dados
* Memória global compartilhada
* Blocos de log de refazer
* Blocos de trabalho
* Blocos de envio
* Cache de página de registros de dados de disco
* Memória de transações de esquema
* Memória de transação
* Bloco de buffer de log de desfazer
* Memória de consulta
* Objetos de bloco
* Memória de esquema
* Estruturas de dados de bloco
* Memória de sinal longo
* Blocos de buffers de comunicação de memória compartilhada

O gerenciador de memória `NDB`, que regula a maioria da memória do nó de dados, gerencia os seguintes recursos de memória:

* Memória de dados (`DataMemory`)

* Blocos de log de refazer (`RedoBuffer`)

* Blocos de trabalho
* Blocos de envio (`SendBufferMemory`, `TotalSendBufferMemory`, `ExtraSendBufferMemory`)

* Cache de página de registros de dados de disco (`DiskPageBufferMemory`, `DiskPageBufferEntries`)

* Memória de transação (`TransactionMemory`)

* Memória de consulta
* Registros de acesso ao disco
* Blocos de arquivo

Cada um desses recursos é configurado com uma área de memória reservada e uma área de memória máxima. A área de memória reservada pode ser usada apenas pelo recurso para o qual é reservada e não pode ser compartilhada com outros recursos; um dado recurso nunca pode alocar mais que a memória máxima permitida para o recurso. Um recurso que não tem memória máxima pode se expandir para usar toda a memória compartilhada no gerenciador de memória.

O tamanho da memória global compartilhada para esses recursos é controlado pelo parâmetro de configuração `SharedGlobalMemory` (padrão: 128 MB).

A memória de dados é sempre reservada e nunca obtém memória da memória compartilhada. Ela é controlada usando o parâmetro de configuração `DataMemory`, cujo máximo é de 16384 GB. `DataMemory` é onde os registros são armazenados, incluindo índices de hash (aproximadamente 15 bytes por linha), índices ordenados (10-12 bytes por linha por índice) e cabeçalhos de linha (16-32 bytes por linha).

Os buffers de log de refazer também usam memória reservada; isso é controlado pelo parâmetro de configuração `RedoBuffer`, que define o tamanho do buffer de log de refazer por fio LDM. Isso significa que a quantidade real de memória usada é o valor deste parâmetro multiplicado pelo número de fios LDM no nó de dados.

Os buffers de trabalho usam memória reservada apenas; o tamanho dessa memória é calculado pelo `NDB`, com base nos números de fios de vários tipos.

Os buffers de envio usam uma parte reservada, mas também podem alocar um adicional de 25% da memória global compartilhada. O tamanho da parte reservada do buffer de envio é calculado em duas etapas:

1. Use o valor do parâmetro de configuração `TotalSendBufferMemory` (sem valor padrão) ou a soma dos buffers de envio individuais usados por todas as conexões individuais ao nó de dados. Um nó de dados está conectado a todos os outros nós de dados, a todos os nós API e a todos os nós de gerenciamento. Isso significa que, em um clúster com 2 nós de dados, 2 nós de gerenciamento e 10 nós API, cada nó de dados tem 13 conexões de nó. Como o valor padrão para `SendBufferMemory` para uma conexão de nó de dados é de 2 MB, isso resulta em um total de 26 MB.

2. Para obter o tamanho total da parte reservada para o buffer de envio, o valor do parâmetro de configuração `ExtraSendBufferMemory`, se houver (valor padrão 0), é adicionado ao valor obtido na etapa anterior.

Em outras palavras, se `TotalSendBufferMemory` foi definido, o tamanho do buffer de envio é `TotalSendBufferMemory

+ ExtraSendBufferMemory`; caso contrário, o tamanho do buffer de envio é igual a `([número de conexões de nó] * SendBufferMemory) + ExtraSendBufferMemory`.

O cache de página para registros de dados em disco usa um recurso reservado; o tamanho desse recurso é controlado pelo parâmetro de configuração `DiskPageBufferMemory` (padrão 64 MB). A memória para entradas de página de disco de 32 KB também é alocada; o número dessas entradas é determinado pelo parâmetro de configuração `DiskPageBufferEntries` (padrão 10).

A memória de transação tem uma parte reservada que é calculada pelo `NDB`, ou é definida explicitamente usando o parâmetro de configuração `TransactionMemory`; a memória de transação também pode usar uma quantidade ilimitada de memória global compartilhada. A memória de transação é usada para todos os recursos operacionais que lidam com transações, varreduras, bloqueios, buffers de varredura e operações de gatilho. Ela também armazena as linhas da tabela conforme elas são atualizadas, antes de o próximo commit escrevê-las na memória de dados.

Os recursos são alocados a partir de um recurso comum de memória de transação e também podem usar recursos da memória global compartilhada. o tamanho desse recurso pode ser controlado usando um único parâmetro de configuração `TransactionMemory`.

A memória reservada para buffers de log de desfazer pode ser definida usando o parâmetro de configuração `InitialLogFileGroup`. Se um buffer de log de desfazer for criado como parte de uma instrução SQL `CREATE LOGFILE GROUP`, a memória é retirada da memória de transação.

Vários recursos relacionados a metadados para recursos de dados em disco também não têm parte reservada e usam apenas memória global compartilhada. A memória global compartilhada é, portanto, compartilhada entre buffers de envio, memória de transação e metadados de dados em disco.

Se `TransactionMemory` não for definido, ele é calculado com base nos seguintes parâmetros:

* `MaxNoOfConcurrentOperations`
* `MaxNoOfConcurrentTransactions`
* `MaxNoOfFiredTriggers`
* `MaxNoOfLocalOperations`
* `MaxNoOfConcurrentIndexOperations`
* `MaxNoOfConcurrentScans`
* `MaxNoOfLocalScans`
* `BatchSizePerLocalScan`
* `TransactionBufferMemory`

Quando `TransactionMemory` é definido explicitamente, nenhum dos parâmetros de configuração listados é usado para calcular o tamanho da memória. Além disso, os parâmetros `MaxNoOfConcurrentIndexOperations`, `MaxNoOfFiredTriggers`, `MaxNoOfLocalOperations` e `MaxNoOfLocalScans` são incompatíveis com `TransactionMemory` e não podem ser definidos simultaneamente com ele; se `TransactionMemory` for definido e algum desses quatro parâmetros também for definido no arquivo de configuração `config.ini`, o servidor de gerenciamento não poderá ser iniciado.

Os parâmetros `MaxNoOfConcurrentIndexOperations`, `MaxNoOfFiredTriggers`, `MaxNoOfLocalOperations` e `MaxNoOfLocalScans` estão todos desatualizados; você deve esperar que eles sejam removidos de uma futura versão do MySQL NDB Cluster.

O recurso de memória de transação contém um grande número de pools de memória. Cada pool de memória representa um tipo de objeto e contém um conjunto de objetos; cada pool inclui uma parte reservada alocada ao pool no momento do início; essa memória reservada nunca é devolvida à memória global compartilhada. Os registros reservados são encontrados usando uma estrutura de dados que possui apenas um nível para recuperação rápida, o que significa que um número de registros em cada pool deve ser reservado. O número de registros reservados em cada pool tem algum impacto no desempenho e na alocação de memória reservada, mas geralmente é necessário apenas em certos casos de uso muito avançados para definir explicitamente os tamanhos reservados.

O tamanho da parte reservada do pool pode ser controlado definindo os seguintes parâmetros de configuração:

* `ReservedConcurrentIndexOperations`
* `ReservedFiredTriggers`
* `ReservedConcurrentOperations`
* `ReservedLocalScans`
* `ReservedConcurrentTransactions`
* `ReservedConcurrentScans`
* `ReservedTransactionBufferMemory`

Para qualquer um dos parâmetros listados acima que não seja definido explicitamente em `config.ini`, o valor reservado é calculado como 25% do valor máximo correspondente. Por exemplo, se não for definido, `ReservedConcurrentIndexOperations` é calculado como 25% de `MaxNoOfConcurrentIndexOperations`, e `ReservedLocalScans` é calculado como 25% de `MaxNoOfLocalScans`.

Observação

Se `ReservedTransactionBufferMemory` não for definido, ele é calculado como 25% de `TransactionBufferMemory`.

O número de registros reservados é por nó de dados; esses registros são divididos entre os threads que os gerenciam (threads LDM e TC) em cada nó. Na maioria dos casos, é suficiente definir apenas `TransactionMemory` e permitir que o número de registros nos pools seja regido por seu valor.

`MaxNoOfConcurrentScans` limita o número de varreduras concorrentes que podem estar ativas em cada thread TC. Isso é importante para evitar a sobrecarga do cluster.

`MaxNoOfConcurrentOperations` limita o número de operações que podem estar ativas ao mesmo tempo na atualização de transações. (Leitores simples não são afetados por este parâmetro.) Este número precisa ser limitado porque é necessário pre-alocar memória para lidar com falhas de nó, e um recurso deve estar disponível para lidar com o número máximo de operações ativas em um único fio TC quando há disputas por falhas de nó. É imperativo que `MaxNoOfConcurrentOperations` seja definido com o mesmo número em todos os nós (isso pode ser feito mais facilmente definindo um valor para ele uma vez, na seção `[ndbd default]` do arquivo de configuração global `config.ini`). Embora seu valor possa ser aumentado usando um reinício em rolagem (veja Seção 25.6.5, “Realizando um Reinício em Rolagem de um NDB Cluster”), diminuí-lo dessa maneira não é considerado seguro devido à possibilidade de uma falha de nó ocorrer durante o reinício em rolagem.

É possível limitar o tamanho de uma única transação no NDB Cluster através do parâmetro `MaxDMLOperationsPerTransaction`. Se este não for definido, o tamanho de uma transação é limitado por `MaxNoOfConcurrentOperations` desde que este parâmetro limita o número total de operações concorrentes por fio TC.

O tamanho da memória do esquema é controlado pelo seguinte conjunto de parâmetros de configuração:

* `MaxNoOfSubscriptions`
* `MaxNoOfSubscribers`
* `MaxNoOfConcurrentSubOperations`
* `MaxNoOfAttributes`
* `MaxNoOfTables`
* `MaxNoOfOrderedIndexes`
* `MaxNoOfUniqueHashIndexes`
* `MaxNoOfTriggers`

O número de nós e o número de threads LDM também têm um grande impacto no tamanho da memória do esquema, pois o número de partições em cada tabela e em cada partição (e suas réplicas de fragmento) precisa ser representado na memória do esquema.

Além disso, vários outros registros são alocados durante o início da execução. Esses são relativamente pequenos. Cada bloco em cada thread contém objetos de bloco que utilizam memória. Esse tamanho de memória também é normalmente bastante pequeno em comparação com as outras estruturas de memória dos nós de dados.