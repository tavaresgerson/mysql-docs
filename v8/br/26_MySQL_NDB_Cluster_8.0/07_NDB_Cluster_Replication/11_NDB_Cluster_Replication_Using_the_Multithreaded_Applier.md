### 25.7.11 Replicação do aglomerado do NDB usando o aplicativo multithread

- Requisitos
- Configuração da MTA: Fonte
- Configuração da MTA: Replica
- Dependência de transação e manipulação de conjunto de escrita
- Rastreamento de uso da memória do Writeset
- Limitações conhecidas

A partir da versão NDB 8.0.33, a replicação do NDB suporta o uso do mecanismo de aplicação de aplicativos multithread do MySQL Server genérico (MTA), que permite que transações de log binário independentes sejam aplicadas em paralelo em uma replica, aumentando o desempenho máximo da replicação.

#### Requisitos

A implementação do MySQL Server MTA delegou o processamento de transações de log binário separadas para um conjunto de threads de trabalhador (cujo tamanho é configurável) e coordena os threads de trabalhador para garantir que as dependências de transações codificadas no log binário sejam respeitadas e que a ordem de commit seja mantida, se necessário (veja a Seção 19.2.3, “Threads de Replicação”). Para usar essa funcionalidade com o NDB Cluster, é necessário que as três condições a seguir sejam atendidas:

1. *As dependências das transações de log binário são determinadas na fonte*.

   Para que isso seja verdade, a variável de sistema de servidor `binlog_transaction_dependency_tracking` deve ser definida como `WRITESET` na fonte. Isso é suportado pelo NDB 8.0.33 e versões posteriores. (O padrão é `COMMIT_ORDER`.)

   O trabalho de manutenção do conjunto de escrita em `NDB` é realizado pelo fio de injeção de log binário do MySQL como parte da preparação e do commit de cada transação de época no log binário. Isso requer recursos extras e pode reduzir o desempenho máximo.

2. *As dependências de transação são codificadas no log binário*.

   O NDB 8.0.33 e versões posteriores suportam a opção de inicialização `--ndb-log-transaction-dependency` para o **mysqld**. Defina essa opção para `ON` para permitir a gravação das dependências de transações `NDB` no log binário.

3. *A réplica está configurada para usar vários threads de trabalhador*.

   O NDB 8.0.33 e versões posteriores suportam a configuração de `replica_parallel_workers` para valores não nulos para controlar o número de threads de trabalhador na replica. O padrão é 4.

#### Configuração da MTA: Fonte

A configuração do **mysqld** para o MTA `NDB` deve incluir as seguintes configurações explícitas:

- `binlog_transaction_dependency_tracking` deve ser definido como `WRITESET`.

- A fonte de replicação mysqld deve ser iniciada com `--ndb-log-transaction-dependency=ON`.

Se definido, `replica_parallel_type` deve ser `LOGICAL_CLOCK` (o valor padrão).

Nota

`NDB` não suporta `replica_parallel_type=DATABASE`.

Além disso, recomenda-se que você defina a quantidade de memória usada para rastrear conjuntos de transações de log binário nas fontes (`binlog_transaction_dependency_history_size`) para `E * P`, onde `E` é o tamanho médio da época (como o número de operações por época) e `P` é o paralelismo máximo esperado. Consulte Uso de Memória para Rastreamento de Conjuntos de Transações, para obter mais informações.

#### Configuração da MTA: Replica

A configuração do **mysqld** para o MTA `NDB` exige que o `replica_parallel_workers` seja maior que 1. O valor inicial recomendado ao habilitar o MTA pela primeira vez é 4, que é o padrão.

Além disso, `replica_preserve_commit_order` deve ser `ON`. Este é também o valor padrão.

#### Dependência de transação e manipulação de conjunto de escrita

As dependências de transações são detectadas através da análise do conjunto de escritas de cada transação, ou seja, o conjunto de linhas (tabela, valores de chave) escritas pela transação. Quando duas transações modificam a mesma linha, elas são consideradas dependentes e devem ser aplicadas em ordem (ou seja, seriamente) para evitar deadlocks ou resultados incorretos. Quando uma tabela tem chaves únicas secundárias, esses valores também são adicionados ao conjunto de escritas da transação para detectar o caso em que há dependências de transações implícitas por diferentes transações afetando o mesmo valor de chave única, exigindo, assim, uma ordem. Quando as dependências não podem ser determinadas de forma eficiente, o **mysqld** recorre à consideração das transações como dependentes por razões de segurança.

As dependências de transação são codificadas no log binário pelo servidor **mysqld**. As dependências são codificadas em um evento `ANONYMOUS_GTID` usando um esquema chamado 'Relógio Lógico'. (Veja a Seção 19.1.4.1, "Conceitos do Modo de Replicação".)

A implementação de writeset empregada pelo MySQL (e pelo NDB Cluster) utiliza a detecção de conflitos baseada em hash, com base na comparação de hashes de linhas de 64 bits de valores relevantes de tabelas e índices. Isso detecta de forma confiável quando a mesma chave é vista duas vezes, mas também pode produzir falsos positivos se diferentes valores de tabela e índice hash para o mesmo valor de 64 bits; isso pode resultar em dependências artificiais que podem reduzir o paralelismo disponível.

As dependências de transação são forçadas por qualquer uma das seguintes razões:

- Declarações DDL
- Rotacionamento do log binário ou encontro de limites de arquivos de log binário
- Limitações de tamanho da história de escrita
- Escreve que fazem referência a chaves estrangeiras pai na tabela de destino

  Mais especificamente, as transações que realizam inserções, atualizações e exclusões em tabelas de chave estrangeira *pai* são serializadas em relação a todas as transações anteriores e seguintes, e não apenas às transações que afetam tabelas envolvidas em uma relação de restrição. Por outro lado, as transações que realizam inserções, atualizações e exclusões em tabelas de chave estrangeira *filho* (referenciadas) não são especialmente serializadas umas em relação às outras.

A implementação do MySQL MTA tenta aplicar transações de log binário independentes em paralelo. `NDB` registra todas as alterações que ocorrem em todas as transações de usuário que estão sendo executadas em uma época (`TimeBetweenEpochs`, padrão 100 milissegundos), em uma única transação de log binário, referida como uma transação de época. Portanto, para que duas transações de época consecutivas sejam independentes e possam ser aplicadas em paralelo, é necessário que nenhuma linha seja modificada em ambas as épocas. Se qualquer linha for modificada em ambas as épocas, elas serão dependentes e serão aplicadas em série, o que pode limitar o paralelismo explorável disponível.

As transações de época são consideradas independentes com base no conjunto de linhas modificadas no cluster de origem na época, mas excluindo os eventos `mysql.ndb_apply_status` `WRITE_ROW` gerados que transmitem metadados da época. Isso evita que cada transação de época seja trivialmente dependente da época anterior, mas exige que o binlog seja aplicado na replica com a ordem de commit preservada. Isso também implica que um log binário NDB com dependências de writeset não é adequado para uso por uma base de dados replica com um motor de armazenamento MySQL diferente.

Pode ser possível ou desejável modificar o comportamento das transações de aplicação para evitar padrões de modificações repetidas nas mesmas linhas, em transações separadas ao longo de um curto período de tempo, para aumentar o paralelismo explorável da aplicação.

#### Rastreamento de uso da memória do Writeset

A quantidade de memória usada para rastrear conjuntos de gravações de transações de log binário pode ser definida usando a variável de sistema do servidor `binlog_transaction_dependency_history_size`, que tem como padrão 25.000 hashes de linha.

Se uma transação de log binário médio modifica `N` linhas, então, para podermos identificar transações independentes (paraleláveis) até um nível de paralelismo de `P`, precisamos que `binlog_transaction_dependency_history_size` esteja no mínimo `N * P`. (O máximo é 1.000.000.)

O tamanho finito da história resulta em um comprimento máximo de dependência finito que pode ser determinado com confiança, proporcionando um paralelismo finito que pode ser expresso. Qualquer linha não encontrada na história pode ser dependente da última transação excluída da história.

O histórico de conjunto de escrita não funciona como uma janela deslizante sobre as últimas `N` transações; em vez disso, é um buffer finito que pode ficar completamente cheio, e então seu conteúdo é descartado completamente quando ele estiver cheio. Isso significa que o tamanho do histórico segue um padrão de serra ao longo do tempo, e, portanto, o comprimento máximo de dependência detectável também segue um padrão de serra ao longo do tempo, de modo que transações independentes ainda podem ser marcadas como dependentes se o buffer de histórico do conjunto de escrita tiver sido redefinido entre o processamento delas.

Neste esquema, cada transação em um arquivo de log binário é anotada com um `sequence_number` (1, 2, 3, ...), bem como o número de sequência da transação de log binário mais recente a que ela depende, à qual nos referimos como `last_committed`.

Dentro de um arquivo de log binário dado, a primeira transação tem `sequence_number` 1 e `last_committed` 0.

Quando uma transação de log binário depende de sua predecessora imediata, sua aplicação é serializada. Se a dependência for de uma transação anterior, pode ser possível aplicar a transação em paralelo com as transações independentes anteriores.

O conteúdo dos eventos `ANONYMOUS_GTID`, incluindo `sequence_number` e `last_committed` (e, portanto, as dependências da transação), pode ser visualizado usando **mysqlbinlog**.

Os eventos `ANONYMOUS_GTID` gerados na fonte são tratados separadamente do payload de transação comprimida com eventos em massa `BEGIN`, `TABLE_MAP*`, `WRITE_ROW*`, `UPDATE_ROW*`, `DELETE_ROW*` e `COMMIT`, permitindo que as dependências sejam determinadas antes da descomprimagem. Isso significa que o fio do coordenador da replica pode delegar a descomprimagem do payload de transação para um fio de trabalhador, fornecendo a descomprimagem paralela automática de transações independentes na replica.

#### Limitações conhecidas

**Colunas únicas secundárias.** As tabelas com colunas únicas secundárias (ou seja, chaves únicas diferentes da chave primária) enviam todas as colunas para a fonte para que possam ser detectados conflitos relacionados a chaves únicas.

Quando o modo de registro binário atual não inclui todas as colunas, mas apenas as colunas alteradas (`--ndb-log-updated-only=OFF`, `--ndb-log-update-minimal=ON`, `--ndb-log-update-as-write=OFF`), isso pode aumentar o volume de dados enviados dos nós de dados para os nós de SQL.

O impacto depende tanto da taxa de modificação (atualização ou exclusão) das linhas nessas tabelas quanto do volume de dados nas colunas que não são realmente modificadas.

**Replicação de NDB para InnoDB.** A dependência de transação do injetor de log binário `NDB` ignora intencionalmente as dependências entre transações criadas por eventos de metadados `mysql.ndb_apply_status` gerados, que são tratados separadamente como parte do commit da transação de época no aplicativo replicador. Para a replicação em `InnoDB`, não há tratamento especial; isso pode resultar em desempenho reduzido ou outros problemas ao usar um aplicativo multithread `InnoDB` para consumir um log binário MTA `NDB`.
