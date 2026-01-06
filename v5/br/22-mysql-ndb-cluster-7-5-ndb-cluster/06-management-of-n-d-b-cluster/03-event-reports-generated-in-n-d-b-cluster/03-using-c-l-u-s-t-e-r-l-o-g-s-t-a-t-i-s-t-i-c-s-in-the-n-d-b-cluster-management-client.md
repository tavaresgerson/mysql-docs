#### 21.6.3.3 Usar estatísticas do CLUSTERLOG no cliente de gerenciamento de clusters NDB

O comando `CLUSTERLOG STATISTICS` do cliente de gerenciamento do `NDB` pode fornecer várias estatísticas úteis em sua saída. Os contadores que fornecem informações sobre o estado do clúster são atualizados em intervalos de relatórios de 5 segundos pelo coordenador de transações (TC) e pelo manipulador de consultas local (LQH) e são escritos no log do clúster.

**Estatísticas do coordenador de transação.** Cada transação tem um coordenador de transação, que é escolhido por um dos seguintes métodos:

- De forma round-robin
- Por proximidade de comunicação
- Ao fornecer uma dica de colocação de dados quando a transação é iniciada

Nota

Você pode determinar qual método de seleção de nós TC é usado para transações iniciadas a partir de um nó SQL específico usando a variável de sistema `ndb_optimized_node_selection`.

Todas as operações dentro da mesma transação utilizam o mesmo coordenador de transação, que reporta as seguintes estatísticas:

- **Contagem de transações.** Este é o número de transações iniciadas no último intervalo usando este TC como coordenador da transação. Qualquer uma dessas transações pode ter sido confirmada, interrompida ou permanecer não confirmada no final do intervalo de relatório.

  Nota

  As transações não migram entre os TC.

- **Número de transações confirmadas.** Este é o número de transações que utilizaram este TC como coordenador de transação e que foram confirmadas no último intervalo de relatórios. Como algumas transações confirmadas neste intervalo de relatórios podem ter começado em um intervalo de relatórios anterior, é possível que o número de transações confirmadas seja maior que o número de transações.

- **Contagem de leituras.** Este é o número de operações de leitura da chave primária usando este TC como coordenador de transação que foram iniciadas no último intervalo de relatório, incluindo leituras simples. Este contagem também inclui leituras realizadas como parte de operações de índice único. Uma operação de leitura de índice único gera 2 operações de leitura da chave primária — 1 para a tabela de índice único oculta e 1 para a tabela em que a leitura ocorre.

- **Contagem de leituras simples.** Este é o número de operações de leitura simples usando este TC (coordenador de transação) que foram iniciadas no último intervalo de relatório.

- **Escreva o número de operações de escrita de chave primária** usando este TC como coordenador de transação que foram iniciadas no último intervalo de relatório. Isso inclui todas as inserções, atualizações, escritas e exclusões, bem como escritas realizadas como parte de operações de índice único.

  Nota

  Uma operação de atualização de índice única pode gerar múltiplas operações de leitura e escrita de PK na tabela de índice e na tabela base.

- **AttrInfoCount.** Este é o número de palavras de dados de 32 bits recebidas no último intervalo de relatório para operações de chave primária usando este TC como coordenador de transação. Para leituras, isso é proporcional ao número de colunas solicitadas. Para inserções e atualizações, isso é proporcional ao número de colunas escritas e ao tamanho de seus dados. Para operações de exclusão, geralmente é zero.

  As operações de índice únicas geram múltiplas operações de PK e, portanto, aumentam esse contagem. No entanto, as palavras de dados enviadas para descrever a própria operação de PK e as informações-chave enviadas *não* são contadas aqui. As informações de atributo enviadas para descrever as colunas a serem lidas em varreduras ou para descrever os ScanFilters também não são contadas no `AttrInfoCount`.

- **Operações Concorrentes.** Este é o número de operações de chave primária ou de varredura que usam esta TC como coordenador de transação e que foram iniciadas durante o último intervalo de relatório, mas que não foram concluídas. As operações incrementam este contador quando são iniciadas e o decrementam quando são concluídas; isso ocorre após a transação ser confirmada. Leitura e escrita sujas, bem como operações falhas, decrementam este contador.

  O valor máximo que `Operações Concorrentes` pode ter é o número máximo de operações que um bloco TC pode suportar; atualmente, isso é `(2 * MaxNoOfConcurrentOperations) + 16 + MaxNoOfConcurrentTransactions`. (Para mais informações sobre esses parâmetros de configuração, consulte a seção *Parâmetros de Transação* de Seção 21.4.3.6, “Definindo Nodos de Dados do NDB Cluster”.)

- **Contagem de abortos.** Este é o número de transações que utilizaram este TC como coordenador de transação e que foram abortadas durante o último intervalo de relatório. Como algumas transações que foram abortadas no último intervalo de relatório podem ter começado em um intervalo de relatório anterior, a **Contagem de abortos** pode, às vezes, ser maior que a **Contagem de transações**.

- **Escaneios.** Este é o número de escaneios de tabela usando este TC como coordenador de transação que foram iniciados durante o último intervalo de relatório. Isso não inclui escaneios de intervalo (ou seja, escaneios de índice ordenados).

- **Explorações de intervalo.** Este é o número de explorações de índice solicitadas usando este TC como coordenador de transação que foram iniciadas no último intervalo de relatório.

- **Leitura local.** Este é o número de operações de leitura de chave primária realizadas usando um coordenador de transação em um nó que também contém a replica primária do fragmento do registro. Esse contagem também pode ser obtida do contador `LOCAL_READS` na tabela `ndbinfo.counters`.

- **Localmente escrito.** Este número indica o número de operações de leitura de chave primária que foram realizadas usando um coordenador de transação em um nó que também contém a replica primária do fragmento do registro. Esse contagem também pode ser obtida do contador `LOCAL_WRITES` na tabela `ndbinfo.counters`.

**Estatísticas do manipulador de consultas locais (Operações).** Há um evento de clúster por bloco de manipulador de consultas locais (ou seja, 1 por processo de nó de dados). As operações são registradas no LQH onde os dados sobre os quais estão operando residem.

Nota

Uma única transação pode operar em dados armazenados em múltiplos blocos LQH.

A estatística "Operações" fornece o número de operações locais realizadas por este bloco LQH no último intervalo de relatórios e inclui todos os tipos de operações de leitura e escrita (operações de inserção, atualização, escrita e exclusão). Isso também inclui operações usadas para replicar escritas. Por exemplo, em um clúster com duas réplicas de fragmentação, a escrita na replica primária de fragmentação é registrada no LQH primário, e a escrita no backup é registrada no LQH de backup. Operações de chave única podem resultar em múltiplas operações locais; no entanto, isso *não* inclui operações locais geradas como resultado de uma varredura de tabela ou varredura de índice ordenado, que não são contadas.

**Estatísticas do planejador de processos.**

Além das estatísticas relatadas pelo coordenador de transações e pelo manipulador de consultas locais, cada processo **ndbd** possui um planejador que também fornece métricas úteis relacionadas ao desempenho de um NDB Cluster. Esse planejador executa em um loop infinito; durante cada loop, o planejador realiza as seguintes tarefas:

1. Leia quaisquer mensagens recebidas de soquetes em um buffer de trabalho.

2. Verifique se há mensagens com prazos a serem executadas; se houver, coloque essas mensagens também no buffer de tarefas.

3. Execute (em um loop) quaisquer mensagens no buffer de trabalho.

4. Envie quaisquer mensagens distribuídas que foram geradas ao executar as mensagens no buffer de trabalho.

5. Aguarde por quaisquer novas mensagens recebidas.

As estatísticas do planejador de processos incluem o seguinte:

- **Contador de Looperes Mínimo.** Este é o número de loopes executados no terceiro passo a partir da lista anterior. Esta estatística aumenta à medida que a utilização do buffer TCP/IP melhora. Você pode usar isso para monitorar mudanças no desempenho à medida que adiciona novos processos de nó de dados.

- **Tamanho médio de envio e tamanho médio de recebimento.** Essas estatísticas permitem avaliar a eficiência, respectivamente, das operações de escrita e leitura entre os nós. Os valores são fornecidos em bytes. Valores mais altos significam um custo menor por byte enviado ou recebido; o valor máximo é de 64K.

Para registrar todas as estatísticas do log do cluster, você pode usar o seguinte comando no cliente de gerenciamento do `NDB`:

```sql
ndb_mgm> ALL CLUSTERLOG STATISTICS=15
```

Nota

Definir o limite para `STATISTICS` em 15 faz com que o log do cluster se torne muito extenso e cresça rapidamente, em proporção direta ao número de nós do cluster e à quantidade de atividade no NDB Cluster.

Para obter mais informações sobre os comandos do cliente de gerenciamento do NDB Cluster relacionados ao registro e relatórios, consulte Seção 21.6.3.1, “Comandos de Gerenciamento de Registro do NDB Cluster”.
