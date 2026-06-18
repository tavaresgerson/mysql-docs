#### 25.4.3.13 Gerenciamento de Memória do Nó de Dados

Toda a alocação de memória para um nó de dados é realizada quando o nó é iniciado. Isso garante que o nó de dados possa funcionar de maneira estável sem usar memória de troca, para que o `NDB` possa ser usado para aplicações sensíveis à latência (em tempo real). Os seguintes tipos de memória são alocados no início do nó de dados:

- Memória de dados
- Memória global compartilhada
- Reinicie os buffers de log
- Buffers de trabalho
- Enviar tampões
- Cache de página para registros de dados de disco
- Memória de transações de esquema
- Memória de transação
- Desfazer buffer de log
- Memória de consulta
- Bloquear objetos
- Memória de esquema
- Estruturas de dados bloqueadas
- Memória de sinal longa
- Buffers de comunicação de memória compartilhada

O gerenciador de memória `NDB`, que regula a memória da maioria dos nós de dados, gerencia os seguintes recursos de memória:

- Memória de dados (`DataMemory`)

- Reinicie os buffers de log (`RedoBuffer`)

- Buffers de trabalho

- Envie buffers (`SendBufferMemory`, `TotalSendBufferMemory`, `ExtraSendBufferMemory`)

- Página de cache do cache de dados do disco (`DiskPageBufferMemory`, `DiskPageBufferEntries`)

- Memória de transação (`TransactionMemory`)

- Memória de consulta

- Registros de acesso ao disco

- Buffers de arquivo

Cada um desses recursos é configurado com uma área de memória reservada e uma área de memória máxima. A área de memória reservada pode ser usada apenas pelo recurso para o qual ela é reservada e não pode ser compartilhada com outros recursos; um determinado recurso nunca pode alocar mais do que a memória máxima permitida para o recurso. Um recurso que não tem memória máxima pode se expandir para usar toda a memória compartilhada no gerenciador de memória.

O tamanho da memória compartilhada global para esses recursos é controlado pelo parâmetro de configuração `SharedGlobalMemory` (padrão: 128 MB).

A memória de dados é sempre reservada e nunca adquire memória da memória compartilhada. Ela é controlada usando o parâmetro de configuração `DataMemory`, cujo máximo é de 16384 GB. `DataMemory` é onde os registros são armazenados, incluindo índices de hash (aproximadamente 15 bytes por linha), índices ordenados (10-12 bytes por linha por índice) e cabeçalhos de linha (16-32 bytes por linha).

Os buffers de log de refazer também usam apenas memória reservada; isso é controlado pelo parâmetro de configuração `RedoBuffer`, que define o tamanho do buffer de log de refazer por thread do LDM. Isso significa que a quantidade real de memória usada é o valor desse parâmetro multiplicado pelo número de threads do LDM no nó de dados.

Os buffers de trabalho usam apenas memória reservada; o tamanho dessa memória é calculado por `NDB`, com base nos números de threads de vários tipos.

Os buffers de envio têm uma parte reservada, mas também podem alocar um adicional de 25% da memória global compartilhada. O tamanho da reserva do buffer de envio é calculado em duas etapas:

1. Use o valor do parâmetro de configuração `TotalSendBufferMemory` (sem valor padrão) ou a soma dos buffers de envio individuais usados por todas as conexões individuais ao nó de dados. Um nó de dados está conectado a todos os outros nós de dados, a todos os nós de API e a todos os nós de gerenciamento. Isso significa que, em um clúster com 2 nós de dados, 2 nós de gerenciamento e 10 nós de API, cada nó de dados tem 13 conexões de nó. Como o valor padrão para `SendBufferMemory` para uma conexão de nó de dados é de 2 MByte, isso resulta em um total de 26 MB.

2. Para obter o tamanho total reservado para o buffer de envio, o valor do parâmetro de configuração `ExtraSendBufferMemory` (se houver, valor padrão 0) é adicionado ao valor obtido no passo anterior.

Em outras palavras, se `TotalSendBufferMemory` foi definido, o tamanho do buffer de envio é \`TotalSendBufferMemory

- ExtraSendBufferMemory`; otherwise, the size of the send buffer is equal to `(\[número de conexões de nó] \* SendBufferMemory) + ExtraSendBufferMemory\`.

O cache de página para registros de dados de disco usa um recurso reservado; o tamanho desse recurso é controlado pelo parâmetro de configuração `DiskPageBufferMemory` (padrão 64 MB). A memória para entradas de página de disco de 32 KB também é alocada; o número dessas entradas é determinado pelo parâmetro de configuração `DiskPageBufferEntries` (padrão 10).

A memória de transação possui uma parte reservada que é calculada por `NDB`, ou é definida explicitamente usando o parâmetro de configuração `TransactionMemory`, introduzido no NDB 8.0 (anteriormente, esse valor era sempre calculado por `NDB`)); a memória de transação também pode usar uma quantidade ilimitada de memória global compartilhada. A memória de transação é usada para todos os recursos operacionais que lidam com transações, varreduras, bloqueios, buffers de varredura e operações de gatilho. Ela também armazena as linhas da tabela conforme elas são atualizadas, antes de o próximo commit escrevê-las na memória de dados.

Anteriormente, os registros operacionais utilizavam recursos dedicados cujos tamanhos eram controlados por vários parâmetros de configuração. No NDB 8.0, todos esses recursos são alocados a partir de um recurso de memória de transação comum e também podem usar recursos da memória compartilhada global. o tamanho desse recurso pode ser controlado usando um único parâmetro de configuração `TransactionMemory`.

A memória reservada para os buffers do log de desfazer pode ser definida usando o parâmetro de configuração `InitialLogFileGroup`. Se um buffer de log de desfazer for criado como parte de uma instrução SQL `CREATE LOGFILE GROUP`, a memória é retirada da memória da transação.

Vários recursos relacionados aos metadados dos recursos de dados do disco também não têm uma parte reservada e usam apenas memória global compartilhada. Portanto, a memória global compartilhada é compartilhada entre os buffers de envio, a memória de transação e os metadados do Disk Data.

Se `TransactionMemory` não estiver definido, ele é calculado com base nos seguintes parâmetros:

- `MaxNoOfConcurrentOperations`
- `MaxNoOfConcurrentTransactions`
- `MaxNoOfFiredTriggers`
- `MaxNoOfLocalOperations`
- `MaxNoOfConcurrentIndexOperations`
- `MaxNoOfConcurrentScans`
- `MaxNoOfLocalScans`
- `BatchSizePerLocalScan`
- `TransactionBufferMemory`

Quando `TransactionMemory` é definido explicitamente, nenhum dos parâmetros de configuração listados anteriormente é usado para calcular o tamanho da memória. Além disso, os parâmetros `MaxNoOfConcurrentIndexOperations`, `MaxNoOfFiredTriggers`, `MaxNoOfLocalOperations` e `MaxNoOfLocalScans` são incompatíveis com `TransactionMemory` e não podem ser definidos simultaneamente com ele; se `TransactionMemory` for definido e qualquer um desses quatro parâmetros também for definido no arquivo de configuração `config.ini`, o servidor de gerenciamento não poderá ser iniciado. *Nota*: Antes da versão NDB 8.0.29, essa restrição não era aplicada para `MaxNoOfFiredTriggers`, `MaxNoOfLocalScans` ou `MaxNoOfLocalOperations` (Bug #102509, Bug
\#32474988).

Os parâmetros `MaxNoOfConcurrentIndexOperations`, `MaxNoOfFiredTriggers`, `MaxNoOfLocalOperations` e `MaxNoOfLocalScans` estão todos desatualizados no NDB 8.0; você deve esperar que eles sejam removidos de uma futura versão do MySQL NDB Cluster.

Antes da versão 8.0.29 do NDB, não era possível definir nenhum dos `MaxNoOfConcurrentTransactions`, `MaxNoOfConcurrentOperations` ou `MaxNoOfConcurrentScans` simultaneamente com `TransactionMemory`.

O recurso de memória de transação contém um grande número de pools de memória. Cada pool de memória representa um tipo de objeto e contém um conjunto de objetos; cada pool inclui uma parte reservada alocada para o pool no momento do início; essa memória reservada nunca é devolvida à memória global compartilhada. Os registros reservados são encontrados usando uma estrutura de dados que possui apenas um único nível para recuperação rápida, o que significa que um número de registros em cada pool deve ser reservado. O número de registros reservados em cada pool tem algum impacto no desempenho e na alocação de memória reservada, mas geralmente é necessário apenas em certos casos de uso muito avançados para definir explicitamente os tamanhos reservados.

O tamanho da parte reservada da piscina pode ser controlado definindo os seguintes parâmetros de configuração:

- `ReservedConcurrentIndexOperations`
- `ReservedFiredTriggers`
- `ReservedConcurrentOperations`
- `ReservedLocalScans`
- `ReservedConcurrentTransactions`
- `ReservedConcurrentScans`
- `ReservedTransactionBufferMemory`

Para qualquer um dos parâmetros listados acima que não seja definido explicitamente em `config.ini`, o ajuste reservado é calculado como 25% do ajuste máximo correspondente. Por exemplo, se não definido, `ReservedConcurrentIndexOperations` é calculado como 25% de `MaxNoOfConcurrentIndexOperations`, e `ReservedLocalScans` é calculado como 25% de `MaxNoOfLocalScans`.

Nota

Se `ReservedTransactionBufferMemory` não estiver definido, ele é calculado como 25% de `TransactionBufferMemory`.

O número de registros reservados é por nó de dados; esses registros são divididos entre os threads que os gerenciam (threads LDM e TC) em cada nó. Na maioria dos casos, é suficiente definir apenas `TransactionMemory` e permitir que o número de registros nos pools seja regido por seu valor.

`MaxNoOfConcurrentScans` limita o número de varreduras concorrentes que podem estar ativas em cada fio TC. Isso é importante para evitar a sobrecarga do clúster.

`MaxNoOfConcurrentOperations` limita o número de operações que podem estar ativas ao mesmo tempo na atualização de transações. (Leitores simples não são afetados por este parâmetro.) Este número precisa ser limitado porque é necessário pre-alocar memória para lidar com falhas de nó, e um recurso deve estar disponível para lidar com o número máximo de operações ativas em um único fio TC quando há concorrência com falhas de nó. É imperativo que `MaxNoOfConcurrentOperations` seja definido com o mesmo número em todos os nós (isso pode ser feito mais facilmente definindo um valor para ele uma vez, na seção `[ndbd default]` do arquivo de configuração global `config.ini`). Embora seu valor possa ser aumentado usando um reinício em rolagem (veja a Seção 25.6.5, “Realizando um Reinício em Rolagem de um NDB Cluster”), diminuí-lo dessa maneira não é considerado seguro devido à possibilidade de uma falha de nó ocorrer durante o reinício em rolagem.

É possível limitar o tamanho de uma única transação no NDB Cluster através do parâmetro `MaxDMLOperationsPerTransaction`. Se este não for definido, o tamanho de uma única transação é limitado pelo `MaxNoOfConcurrentOperations`, pois este parâmetro limita o número total de operações concorrentes por fio TC.

O tamanho da memória do esquema é controlado pelo seguinte conjunto de parâmetros de configuração:

- `MaxNoOfSubscriptions`
- `MaxNoOfSubscribers`
- `MaxNoOfConcurrentSubOperations`
- `MaxNoOfAttributes`
- `MaxNoOfTables`
- `MaxNoOfOrderedIndexes`
- `MaxNoOfUniqueHashIndexes`
- `MaxNoOfTriggers`

O número de nós e o número de threads do LDM também têm um grande impacto no tamanho da memória do esquema, pois o número de partições em cada tabela e em cada partição (e suas réplicas de fragmento) precisa ser representado na memória do esquema.

Além disso, vários outros registros são alocados durante o início. Esses são relativamente pequenos. Cada bloco em cada thread contém objetos de bloco que usam memória. Esse tamanho de memória também é normalmente bastante pequeno em comparação com as outras estruturas de memória dos nós de dados.
