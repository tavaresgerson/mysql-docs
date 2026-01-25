#### 21.6.3.3 Usando CLUSTERLOG STATISTICS no Cliente de Gerenciamento do NDB Cluster

O comando [`CLUSTERLOG STATISTICS`](mysql-cluster-logging-management-commands.html "21.6.3.1 NDB Cluster Logging Management Commands") do cliente de gerenciamento [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") pode fornecer uma série de estatísticas úteis em sua saída. Contadores que fornecem informações sobre o estado do Cluster são atualizados em intervalos de relatório de 5 segundos pelo *transaction coordinator* (TC) e pelo *local query handler* (LQH), e gravados no *cluster log*.

**Estatísticas do transaction coordinator.** Cada transação possui um *transaction coordinator*, que é escolhido por um dos seguintes métodos:

* De forma *round-robin*
* Por proximidade de comunicação
* Ao fornecer um *data placement hint* quando a transação é iniciada

Nota

Você pode determinar qual método de seleção de TC é usado para transações iniciadas a partir de um dado *SQL node* usando a variável de sistema [`ndb_optimized_node_selection`](mysql-cluster-options-variables.html#sysvar_ndb_optimized_node_selection).

Todas as operações dentro da mesma transação usam o mesmo *transaction coordinator*, que relata as seguintes estatísticas:

* **Trans count.** Este é o número de transações iniciadas no último intervalo usando este TC como o *transaction coordinator*. Qualquer uma dessas transações pode ter sido confirmada (committed), abortada, ou permanecer não confirmada ao final do intervalo de relatório.

  Nota

  Transações não migram entre TCs.

* **Commit count.** Este é o número de transações usando este TC como o *transaction coordinator* que foram confirmadas (committed) no último intervalo de relatório. Como algumas transações confirmadas neste intervalo de relatório podem ter sido iniciadas em um intervalo anterior, é possível que o `Commit count` seja maior que o `Trans count`.

* **Read count.** Este é o número de operações de Primary Key read que foram iniciadas no último intervalo de relatório usando este TC como o *transaction coordinator*, incluindo *simple reads*. Essa contagem também inclui reads realizadas como parte de operações de *unique index*. Uma operação de *unique index read* gera 2 operações de Primary Key read — 1 para a tabela de *unique index* oculta e 1 para a tabela na qual o read ocorre.

* **Simple read count.** Este é o número de operações de *simple read* usando este TC como o *transaction coordinator* que foram iniciadas no último intervalo de relatório.

* **Write count.** Este é o número de operações de Primary Key write usando este TC como o *transaction coordinator* que foram iniciadas no último intervalo de relatório. Isso inclui todos os inserts, updates, writes e deletes, bem como writes realizadas como parte de operações de *unique index*.

  Nota

  Uma operação de *unique index update* pode gerar múltiplas operações de PK read e write na tabela Index e na tabela base.

* **AttrInfoCount.** Este é o número de palavras de dados de 32 bits recebidas no último intervalo de relatório para operações de Primary Key usando este TC como o *transaction coordinator*. Para reads, isso é proporcional ao número de colunas solicitadas. Para inserts e updates, isso é proporcional ao número de colunas gravadas e ao tamanho de seus dados. Para operações de delete, isso geralmente é zero.

  Operações de *unique index* geram múltiplas operações PK e, portanto, aumentam essa contagem. No entanto, as palavras de dados enviadas para descrever a própria operação PK e as informações da chave enviadas *não* são contadas aqui. As informações de atributo enviadas para descrever colunas para reads em *scans*, ou para descrever *ScanFilters*, também não são contadas em `AttrInfoCount`.

* **Concurrent Operations.** Este é o número de operações de Primary Key ou *scan* usando este TC como o *transaction coordinator* que foram iniciadas durante o último intervalo de relatório, mas que não foram concluídas. As operações incrementam este contador quando são iniciadas e o decrementam quando são concluídas; isso ocorre após o *commit* da transação. *Dirty reads* e *writes* — bem como operações que falharam — decrementam este contador.

  O valor máximo que `Concurrent Operations` pode ter é o número máximo de operações que um bloco TC pode suportar; atualmente, este é `(2 * MaxNoOfConcurrentOperations) + 16 + MaxNoOfConcurrentTransactions`. (Para mais informações sobre esses parâmetros de configuração, consulte a seção *Transaction Parameters* em [Section 21.4.3.6, “Defining NDB Cluster Data Nodes”](mysql-cluster-ndbd-definition.html "21.4.3.6 Defining NDB Cluster Data Nodes").)

* **Abort count.** Este é o número de transações usando este TC como o *transaction coordinator* que foram abortadas durante o último intervalo de relatório. Como algumas transações que foram abortadas no último intervalo de relatório podem ter sido iniciadas em um intervalo anterior, o `Abort count` pode, às vezes, ser maior que o `Trans count`.

* **Scans.** Este é o número de *table scans* usando este TC como o *transaction coordinator* que foram iniciados durante o último intervalo de relatório. Isso não inclui *range scans* (ou seja, *ordered index scans*).

* **Range scans.** Este é o número de *ordered index scans* usando este TC como o *transaction coordinator* que foram iniciados no último intervalo de relatório.

* **Local reads.** Este é o número de operações de Primary Key read realizadas usando um *transaction coordinator* em um *node* que também contém a réplica de fragmento primário do registro. Essa contagem também pode ser obtida a partir do contador `LOCAL_READS` na tabela [`ndbinfo.counters`](mysql-cluster-ndbinfo-counters.html "21.6.15.10 The ndbinfo counters Table").

* **Local writes.** Isto contém o número de operações de Primary Key read que foram realizadas usando um *transaction coordinator* em um *node* que também contém a réplica de fragmento primário do registro. Essa contagem também pode ser obtida a partir do contador `LOCAL_WRITES` na tabela [`ndbinfo.counters`](mysql-cluster-ndbinfo-counters.html "21.6.15.10 The ndbinfo counters Table").

**Estatísticas do Local query handler (Operations).** Existe 1 evento de cluster por bloco *local query handler* (ou seja, 1 por processo de *data node*). As operações são registradas no LQH onde residem os dados em que estão operando.

Nota

Uma única transação pode operar em dados armazenados em múltiplos blocos LQH.

A estatística `Operations` fornece o número de operações locais realizadas por este bloco LQH no último intervalo de relatório e inclui todos os tipos de operações de read e write (operações de insert, update, write e delete). Isso também inclui operações usadas para replicar *writes*. Por exemplo, em um Cluster com duas réplicas de fragmento, o *write* para a réplica de fragmento primário é registrado no LQH primário, e o *write* para o *backup* é registrado no LQH de *backup*. As operações de *unique key* podem resultar em múltiplas operações locais; no entanto, isso *não* inclui operações locais geradas como resultado de um *table scan* ou *ordered index scan*, que não são contadas.

**Estatísticas do Process scheduler.**

Além das estatísticas relatadas pelo *transaction coordinator* e *local query handler*, cada processo [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") possui um *scheduler* que também fornece métricas úteis relacionadas ao desempenho de um NDB Cluster. Este *scheduler* é executado em um loop infinito; durante cada loop, o *scheduler* realiza as seguintes tarefas:

1. Lê todas as mensagens recebidas dos *sockets* para um *job buffer*.
2. Verifica se há alguma mensagem cronometrada para ser executada; em caso afirmativo, também as coloca no *job buffer*.
3. Executa (em loop) todas as mensagens no *job buffer*.
4. Envia todas as mensagens distribuídas que foram geradas pela execução das mensagens no *job buffer*.
5. Aguarda por novas mensagens recebidas.

As estatísticas do *Process scheduler* incluem o seguinte:

* **Mean Loop Counter.** Este é o número de *loops* executados na terceira etapa da lista anterior. Esta estatística aumenta de tamanho à medida que a utilização do *buffer* TCP/IP melhora. Você pode usá-la para monitorar mudanças no desempenho à medida que adiciona novos processos de *data node*.

* **Mean send size and Mean receive size.** Estas estatísticas permitem avaliar a eficiência, respectivamente, de *writes* e *reads* entre *nodes*. Os valores são fornecidos em bytes. Valores mais altos significam um custo menor por byte enviado ou recebido; o valor máximo é 64K.

Para fazer com que todas as estatísticas do *cluster log* sejam registradas, você pode usar o seguinte comando no cliente de gerenciamento [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"):

```sql
ndb_mgm> ALL CLUSTERLOG STATISTICS=15
```

Nota

Definir o *threshold* para `STATISTICS` como 15 faz com que o *cluster log* se torne muito verboso e cresça rapidamente em tamanho, em proporção direta ao número de *cluster nodes* e à quantidade de atividade no NDB Cluster.

Para mais informações sobre os comandos do cliente de gerenciamento NDB Cluster relacionados a logging e relatórios, consulte [Section 21.6.3.1, “NDB Cluster Logging Management Commands”](mysql-cluster-logging-management-commands.html "21.6.3.1 NDB Cluster Logging Management Commands").