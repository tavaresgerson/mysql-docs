### 21.5.3 ndbmtd — O Daemon (Multi-Threaded) do Data Node do NDB Cluster

**ndbmtd**") é uma versão multi-threaded do **ndbd**, o processo usado para manipular todos os dados em tabelas que utilizam o storage engine `NDBCLUSTER`. O **ndbmtd**") é destinado ao uso em hosts que possuem múltiplos núcleos de CPU (cores). Exceto quando indicado de outra forma, o **ndbmtd**") funciona da mesma maneira que o **ndbd**; portanto, nesta seção, focamos nas formas em que o **ndbmtd**") difere do **ndbd**. Você deve consultar Section 21.5.1, “ndbd — The NDB Cluster Data Node Daemon”, para obter informações adicionais sobre a execução de Data Nodes do NDB Cluster que se aplicam tanto às versões single-threaded quanto multi-threaded do processo do Data Node.

As opções de linha de comando e os parâmetros de configuração usados com **ndbd** também se aplicam ao **ndbmtd**"). Para obter mais informações sobre essas opções e parâmetros, consulte Section 21.5.1, “ndbd — The NDB Cluster Data Node Daemon” e Section 21.4.3.6, “Defining NDB Cluster Data Nodes”, respectivamente.

O **ndbmtd**") também é compatível em nível de file system com o **ndbd**. Em outras palavras, um Data Node executando o **ndbd** pode ser interrompido, seu Binary substituído pelo **ndbmtd**"), e então reiniciado sem qualquer perda de dados. (No entanto, ao fazer isso, você deve garantir que `MaxNoOfExecutionThreads` esteja definido para um valor apropriado antes de reiniciar o Node, caso deseje que o **ndbmtd**") seja executado de forma multi-threaded.) Da mesma forma, um Binary **ndbmtd**") pode ser substituído pelo **ndbd** simplesmente interrompendo o Node e iniciando o **ndbd** no lugar do Binary multi-threaded. Não é necessário, ao alternar entre os dois, iniciar o Binary do Data Node usando `--initial`.

O uso do **ndbmtd**") difere do uso do **ndbd** em dois aspectos principais:

1. Como o **ndbmtd**") é executado por padrão no modo single-threaded (ou seja, se comporta como o **ndbd**), você deve configurá-lo para usar múltiplos Threads. Isso pode ser feito definindo um valor apropriado no arquivo `config.ini` para o parâmetro de configuração `MaxNoOfExecutionThreads` ou para o parâmetro `ThreadConfig`. O uso de `MaxNoOfExecutionThreads` é mais simples, mas `ThreadConfig` oferece mais flexibilidade. Para obter mais informações sobre esses parâmetros de configuração e seu uso, consulte Multi-Threading Configuration Parameters (ndbmtd)").

2. Trace files são gerados por erros críticos em processos **ndbmtd**") de uma maneira um pouco diferente de como são gerados por falhas do **ndbd**. Essas diferenças são discutidas em mais detalhes nos próximos parágrafos.

Assim como o **ndbd**, o **ndbmtd**") gera um conjunto de log files que são colocados no diretório especificado por `DataDir` no arquivo de configuração `config.ini`. Exceto pelos trace files, eles são gerados da mesma forma e têm os mesmos nomes daqueles gerados pelo **ndbd**.

No caso de um erro crítico, o **ndbmtd**") gera trace files descrevendo o que aconteceu imediatamente antes da ocorrência do erro. Esses arquivos, que podem ser encontrados no `DataDir` do Data Node, são úteis para a análise de problemas pelas equipes de Desenvolvimento e Suporte do NDB Cluster. Um trace file é gerado para cada Thread do **ndbmtd**"). Os nomes desses arquivos seguem o seguinte padrão:

```sql
ndb_node_id_trace.log.trace_id_tthread_id,
```

Neste padrão, *`node_id`* representa o ID exclusivo do Data Node no Cluster, *`trace_id`* é um número de sequência de rastreamento (trace), e *`thread_id`* é o ID do Thread. Por exemplo, no caso de falha de um processo **ndbmtd**") em execução como um Data Node do NDB Cluster com o Node ID 3 e com `MaxNoOfExecutionThreads` igual a 4, quatro trace files são gerados no diretório de dados do Data Node. Se for a primeira vez que este Node falhou, esses arquivos serão nomeados `ndb_3_trace.log.1_t1`, `ndb_3_trace.log.1_t2`, `ndb_3_trace.log.1_t3` e `ndb_3_trace.log.1_t4`. Internamente, esses trace files seguem o mesmo formato dos trace files do **ndbd**.

Os exit codes e mensagens do **ndbd** que são gerados quando um processo de Data Node é encerrado prematuramente também são usados pelo **ndbmtd**"). Consulte Data Node Error Messages, para obter uma lista deles.

Nota

É possível usar o **ndbd** e o **ndbmtd**") simultaneamente em diferentes Data Nodes no mesmo NDB Cluster. No entanto, tais configurações não foram extensivamente testadas; portanto, não podemos recomendar fazer isso em um ambiente de produção neste momento.