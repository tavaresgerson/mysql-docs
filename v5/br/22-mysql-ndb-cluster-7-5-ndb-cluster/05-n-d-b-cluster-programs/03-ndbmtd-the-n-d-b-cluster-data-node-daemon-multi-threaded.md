### 21.5.3 ndbmtd — O daemon do nó de dados do cluster NDB (multi-threaded)

**ndbmtd** é uma versão multithread do **ndbd**, o processo que é usado para lidar com todos os dados nas tabelas usando o mecanismo de armazenamento `NDBCLUSTER`. **ndbmtd** é destinado para uso em computadores hospedeiros que possuem múltiplos núcleos de CPU. Exceto quando indicado de outra forma, **ndbmtd** funciona da mesma maneira que **ndbd**; portanto, nesta seção, concentramos-nos nas maneiras pelas quais **ndbmtd** difere de **ndbd**, e você deve consultar Seção 21.5.1, “ndbd — O Daemon do Nó de Dados do NDB Cluster”, para obter informações adicionais sobre a execução de nós de dados do NDB Cluster que se aplicam tanto às versões monofiladas quanto às versões multifiladas do processo do nó de dados.

As opções de linha de comando e os parâmetros de configuração usados com **ndbd** também se aplicam a **ndbmtd**. Para obter mais informações sobre essas opções e parâmetros, consulte Seção 21.5.1, “ndbd — O Daemon do Nó de Dados do NDB Cluster” e Seção 21.4.3.6, “Definindo Nodos de Dados do NDB Cluster”, respectivamente.

**ndbmtd** também é compatível com o sistema de arquivos de **ndbd**. Em outras palavras, um nó de dados que esteja executando **ndbd** pode ser parado, o binário substituído por **ndbmtd** e, em seguida, reiniciado sem perda de dados. (No entanto, ao fazer isso, você deve garantir que `MaxNoOfExecutionThreads` esteja configurado com um valor apropriado antes de reiniciar o nó, se você deseja que **ndbmtd** seja executado de forma multithreading.) Da mesma forma, um binário de **ndbmtd** pode ser substituído por **ndbd** simplesmente parando o nó e, em seguida, iniciando **ndbd** no lugar do binário multithreading. Não é necessário ao alternar entre os dois para iniciar o binário do nó de dados usando `--initial`.

Usar **ndbmtd** difere do uso de **ndbd** em dois aspectos principais:

1. Como o **ndbmtd** é executado por padrão no modo de único thread (ou seja, ele se comporta como o **ndbd**), você deve configurá-lo para usar múltiplos fios. Isso pode ser feito definindo um valor apropriado no arquivo `config.ini` para o parâmetro de configuração `MaxNoOfExecutionThreads` ou o parâmetro de configuração `ThreadConfig`. Usar `MaxNoOfExecutionThreads` é mais simples, mas `ThreadConfig` oferece mais flexibilidade. Para obter mais informações sobre esses parâmetros de configuração e seu uso, consulte Parâmetros de Configuração de Multithreading (ndbmtd).

2. Os arquivos de registro são gerados por erros críticos nos processos do **ndbmtd** de uma maneira um pouco diferente daquela em que são gerados por falhas do **ndbd**. Essas diferenças são discutidas com mais detalhes nos próximos parágrafos.

Assim como **ndbd**, **ndbmtd** gera um conjunto de arquivos de log que são colocados no diretório especificado por `DataDir` no arquivo de configuração `config.ini`. Exceto pelos arquivos de registro, eles são gerados da mesma maneira e têm os mesmos nomes que os gerados por **ndbd**.

Em caso de um erro crítico, **ndbmtd** gera arquivos de registro que descrevem o que aconteceu logo antes da ocorrência do erro. Esses arquivos, que podem ser encontrados no `DataDir` do nó de dados, são úteis para a análise de problemas pelas equipes de Desenvolvimento e Suporte do NDB Cluster. Um arquivo de registro é gerado para cada **ndbmtd** thread. Os nomes desses arquivos seguem o seguinte padrão:

```sql
ndb_node_id_trace.log.trace_id_tthread_id,
```

Neste padrão, *`node_id`* representa o ID de nó único do nó de dados do clúster, *`trace_id`* é um número de sequência de traço, e *`thread_id`* é o ID do thread. Por exemplo, em caso de falha de um processo **ndbmtd** que está executando como um nó de dados do NDB Cluster com o ID de nó 3 e com `MaxNoOfExecutionThreads` igual a 4, quatro arquivos de traço são gerados no diretório de dados do nó de dados. Se for a primeira vez que esse nó falha, esses arquivos são nomeados `ndb_3_trace.log.1_t1`, `ndb_3_trace.log.1_t2`, `ndb_3_trace.log.1_t3` e `ndb_3_trace.log.1_t4`. Internamente, esses arquivos de traço seguem o mesmo formato que os arquivos de traço do **ndbd**.

Os códigos de saída e mensagens de encerramento prematuro do processo de um nó de dados, gerados quando um processo de nó de dados é encerrado precocemente, também são usados pelo **ndbmtd**. Consulte Mensagens de Erro do Nó de Dados para uma lista desses.

Nota

É possível usar **ndbd** e **ndbmtd** simultaneamente em diferentes nós de dados no mesmo NDB Cluster. No entanto, tais configurações não foram testadas extensivamente; portanto, não podemos recomendar que sejam usadas em um ambiente de produção neste momento.
