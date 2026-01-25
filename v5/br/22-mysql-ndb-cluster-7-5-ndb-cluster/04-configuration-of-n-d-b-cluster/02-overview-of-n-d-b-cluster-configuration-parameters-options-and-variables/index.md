### 21.4.2 Visão Geral dos Parâmetros, Opções e Variáveis de Configuração do NDB Cluster

[21.4.2.1 Parâmetros de Configuração do Data Node do NDB Cluster](mysql-cluster-params-ndbd.html)

[21.4.2.2 Parâmetros de Configuração do Management Node do NDB Cluster](mysql-cluster-params-mgmd.html)

[21.4.2.3 Parâmetros de Configuração do SQL Node e API Node do NDB Cluster](mysql-cluster-params-api.html)

[21.4.2.4 Outros Parâmetros de Configuração do NDB Cluster](mysql-cluster-params-other.html)

[21.4.2.5 Referência de Opções e Variáveis do mysqld do NDB Cluster](mysql-cluster-option-tables.html)

As próximas seções fornecem tabelas resumidas dos *configuration parameters* do *Node* do NDB Cluster usados no arquivo `config.ini` para reger vários aspectos do comportamento do *Node*, bem como das *options* e *variables* lidas pelo [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") a partir de um arquivo `my.cnf` ou da linha de comando, quando executado como um processo do NDB Cluster. Cada uma das tabelas de parâmetros de *Node* lista os parâmetros para um determinado tipo (`ndbd`, `ndb_mgmd`, `mysqld`, `computer`, `tcp` ou `shm`). Todas as tabelas incluem o *data type* para o parâmetro, *option* ou *variable*, bem como seus valores *default*, mínimo e máximo, conforme aplicável.

**Considerações ao reiniciar Nodes.** Para os parâmetros de *Node*, essas tabelas também indicam o tipo de *restart* necessário (*node restart* ou *system restart*)—e se o *restart* deve ser feito com `--initial`—para alterar o valor de um determinado *configuration parameter*. Ao realizar um *node restart* ou um *initial node restart*, todos os *Data Nodes* do *cluster* devem ser reiniciados em sequência (também conhecido como *rolling restart*). É possível atualizar os *configuration parameters* do *cluster* marcados como `node` *online*—ou seja, sem fazer o *shutdown* do *cluster*—desta maneira. Um *initial node restart* exige o *restart* de cada processo [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") com a *option* `--initial`.

Um *system restart* exige um *shutdown* completo e o *restart* de todo o *cluster*. Um *initial system restart* exige fazer um *backup* do *cluster*, limpar o *file system* do *cluster* após o *shutdown*, e então restaurar a partir do *backup* após o *restart*.

Em qualquer *cluster restart*, todos os *Management Servers* do *cluster* devem ser reiniciados para que leiam os valores de *configuration parameter* atualizados.

Importante

Valores para parâmetros numéricos do *cluster* podem geralmente ser aumentados sem problemas, embora seja aconselhável fazê-lo progressivamente, realizando tais ajustes em incrementos relativamente pequenos. Muitos deles podem ser aumentados *online*, usando um *rolling restart*.

No entanto, diminuir os valores de tais parâmetros—seja isso feito usando um *node restart*, *node initial restart*, ou mesmo um *system restart* completo do *cluster*—não deve ser realizado de forma leviana; é recomendável que você o faça somente após planejamento e testes cuidadosos. Isso é especialmente verdadeiro no que diz respeito aos parâmetros relacionados ao uso de memória e espaço em disco, como [`MaxNoOfTables`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooftables), [`MaxNoOfOrderedIndexes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooforderedindexes) e [`MaxNoOfUniqueHashIndexes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofuniquehashindexes). Além disso, geralmente, os *configuration parameters* relacionados ao uso de memória e disco podem ser aumentados usando um *node restart* simples, mas exigem um *initial node restart* para serem reduzidos.

Como alguns desses parâmetros podem ser usados para configurar mais de um tipo de *Node* do *cluster*, eles podem aparecer em mais de uma das tabelas.

Nota

O valor `4294967039` frequentemente aparece como um valor máximo nestas tabelas. Este valor é definido nas fontes do [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") como `MAX_INT_RNIL` e é igual a `0xFFFFFEFF`, ou `232 − 28 − 1`.