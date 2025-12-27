#### 25.6.3.3 Usando as estatísticas do CLUSTERLOG no cliente de gerenciamento de clusters NDB

O comando `CLUSTERLOG STATISTICS` do cliente de gerenciamento `NDB` pode fornecer várias estatísticas úteis em sua saída. Os contadores que fornecem informações sobre o estado do cluster são atualizados em intervalos de relatórios de 5 segundos pelo coordenador de transações (TC) e pelo manipulador de consultas local (LQH) e escritos no log do cluster.

**Estatísticas do coordenador de transações.** Cada transação tem um coordenador de transação, que é escolhido por um dos seguintes métodos:

* De forma round-robin
* Pela proximidade de comunicação
* Fornecendo uma dica de colocação de dados quando a transação é iniciada

**Observação**

Você pode determinar qual método de seleção de TC é usado para transações iniciadas a partir de um nó SQL específico usando a variável de sistema `ndb_optimized_node_selection`.

Todas as operações dentro da mesma transação usam o mesmo coordenador de transação, que relata as seguintes estatísticas:

* **Trans count.** Este é o número de transações iniciadas no último intervalo usando este TC como coordenador de transação. Qualquer uma dessas transações pode ter sido comprometida, aborrecida ou permanecer não comprometida no final do intervalo de relatório.

**Observação**

As transações não migram entre TCs.

* **Commit count.** Este é o número de transações usando este TC como coordenador de transação que foram comprometidas no último intervalo de relatório. Como algumas transações comprometidas neste intervalo de relatório podem ter sido iniciadas em um intervalo de relatório anterior, é possível que `Commit count` seja maior que `Trans count`.

* **Contagem de leituras.** Este é o número de operações de leitura de chave primária usando este TC como coordenador de transação que foram iniciadas no último intervalo de relatório, incluindo leituras simples. Este contagem também inclui leituras realizadas como parte de operações de índice único. Uma operação de leitura de índice único gera 2 operações de leitura de chave primária — 1 para a tabela de índice único oculta e 1 para a tabela em que a leitura ocorre.

* **Contagem de leitura simples.** Este é o número de operações de leitura simples usando este TC como coordenador de transação que foram iniciadas no último intervalo de relatório.

* **Contagem de escrita.** Este é o número de operações de escrita de chave primária usando este TC como coordenador de transação que foram iniciadas no último intervalo de relatório. Isso inclui todas as inserções, atualizações, escritas e exclusões, bem como escritas realizadas como parte de operações de índice único.

  Nota

  Uma operação de atualização de índice único pode gerar múltiplas operações de leitura e escrita de PK na tabela de índice e na tabela base.

* **AttrInfoCount.** Este é o número de palavras de dados de 32 bits recebidas no último intervalo de relatório para operações de chave primária usando este TC como coordenador de transação. Para leituras, isso é proporcional ao número de colunas solicitadas. Para inserções e atualizações, isso é proporcional ao número de colunas escritas e ao tamanho de seus dados. Para operações de exclusão, isso geralmente é zero.

  Operações de índice único geram múltiplas operações de PK e, portanto, aumentam este contagem. No entanto, as palavras de dados enviadas para descrever a própria operação de PK e as informações-chave enviadas *não* são contadas aqui. As informações de atributo enviadas para descrever colunas para leitura em varreduras ou para descrever ScanFilters também não são contadas em `AttrInfoCount`.

* **Operações Concorrentes.** Este é o número de operações de chave primária ou de varredura usando este TC como coordenador de transação que foram iniciadas durante o último intervalo de relatório, mas que não foram concluídas. As operações incrementam este contador quando são iniciadas e o decrementam quando são concluídas; isso ocorre após a transação ser confirmada. Leitura e escrita sujas, bem como operações falhas, decrementam este contador.

O valor máximo que `Operações Concorrentes` pode ter é o número máximo de operações que um bloco TC pode suportar; atualmente, este é `(2 * MaxNoOfConcurrentOperations) + 16 + MaxNoOfConcurrentTransactions`. (Para mais informações sobre esses parâmetros de configuração, consulte a seção *Parâmetros de Transação* da Seção 25.4.3.6, “Definindo Nodos de Dados do NDB Cluster”.)

* **Contagem de Abordagens.** Este é o número de transações usando este TC como coordenador de transação que foram abortadas durante o último intervalo de relatório. Como algumas transações que foram abortadas no último intervalo de relatório podem ter sido iniciadas em um intervalo de relatório anterior, a `Contagem de Abordagens` pode, às vezes, ser maior que a `Contagem de Transações`.

* **Varreduras.** Este é o número de varreduras de tabela usando este TC como coordenador de transação que foram iniciadas durante o último intervalo de relatório. Isso não inclui varreduras de intervalo (ou seja, varreduras de índice ordenadas).

* **Varreduras de Intervalo.** Este é o número de varreduras de índice ordenadas usando este TC como coordenador de transação que foram iniciadas no último intervalo de relatório.

* **Leitura Local.** Este é o número de operações de leitura de chave primária realizadas usando um coordenador de transação em um nó que também contém a replica primária do fragmento do registro. Este contagem também pode ser obtida do contador `LOCAL_READS` na tabela `ndbinfo.counters`.

* **Escrito localmente.** Isso contém o número de operações de leitura de chave primária realizadas usando um coordenador de transação em um nó que também contém a replica primária do fragmento do registro. Esse contagem também pode ser obtida do contador `LOCAL_WRITES` na tabela `ndbinfo.counters`.

**Estatísticas do processador de consultas locais (Operações).** Há um evento de clúster por bloco de processador de consulta local (ou seja, 1 por processo de nó de dados). As operações são registradas no LQH onde os dados sobre os quais estão operando residem.

Nota

Uma única transação pode operar em dados armazenados em múltiplos blocos do LQH.

A estatística `Operações` fornece o número de operações locais realizadas por esse bloco do LQH no último intervalo de relatório e inclui todos os tipos de operações de leitura e escrita (operações de inserção, atualização, escrita e exclusão). Isso também inclui operações usadas para replicar escritas. Por exemplo, em um clúster com duas réplicas de fragmento, a escrita na replica primária de fragmento é registrada no LQH primário, e a escrita no backup é registrada no LQH de backup. Operações de chave única podem resultar em múltiplas operações locais; no entanto, isso *não* inclui operações locais geradas como resultado de uma varredura de tabela ou varredura de índice ordenado, que não são contadas.

**Estatísticas do planejador de processos.**

Além das estatísticas relatadas pelo coordenador de transação e pelo processador de consulta local, cada processo **ndbd** tem um planejador que também fornece métricas úteis relacionadas ao desempenho de um Clúster NDB. Esse planejador roda em um loop infinito; durante cada loop, o planejador realiza as seguintes tarefas:

1. Ler quaisquer mensagens recebidas de soquetes em um buffer de tarefa.
2. Verificar se há mensagens com prazos a serem executadas; se houver, coloque essas mensagens no buffer de tarefa também.

3. Execute (em um loop) todas as mensagens no buffer de trabalho.
4. Envie todas as mensagens distribuídas que foram geradas ao executar as mensagens no buffer de trabalho.

5. Aguarde por novas mensagens recebidas.

As estatísticas do planejador de processos incluem o seguinte:

* **Contador médio de loops.** Este é o número de loops executados no terceiro passo da lista anterior. Esta estatística aumenta de tamanho à medida que a utilização do buffer TCP/IP melhora. Você pode usar isso para monitorar mudanças no desempenho à medida que adiciona novos processos de nó de dados.

* **Tamanho médio de envio e tamanho médio de recebimento.** Essas estatísticas permitem que você avalie a eficiência, respectivamente, das escritas e das leituras entre os nós. Os valores são fornecidos em bytes. Valores mais altos significam um custo por byte enviado ou recebido menor; o valor máximo é de 64K.

Para fazer com que todas as estatísticas do log do clúster sejam registradas, você pode usar o seguinte comando no cliente de gerenciamento `NDB`:

```
ndb_mgm> ALL CLUSTERLOG STATISTICS=15
```

Observação

Definir o limite para `STATISTICS` em 15 faz com que o log do clúster se torne muito detalhado e cresça rapidamente em tamanho, em proporção direta ao número de nós do clúster e à quantidade de atividade no NDB Cluster.

Para obter mais informações sobre os comandos do cliente de gerenciamento do NDB Cluster relacionados ao registro e relatórios, consulte a Seção 25.6.3.1, “Comandos de Gerenciamento de Registro do NDB Cluster”.