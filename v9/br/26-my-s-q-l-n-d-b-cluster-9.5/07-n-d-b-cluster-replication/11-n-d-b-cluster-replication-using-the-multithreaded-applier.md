### 25.7.11 Replicação de NDB Cluster Usando o Aplicável Multithreaded da MySQL

* Requisitos
* Configuração do MTA: Fonte
* Configuração do MTA: Replicação
* Gerenciamento de Dependências de Transações e Conjuntos de Escrita
* Rastreamento de Uso de Memória do Conjunto de Escrita
* Limitações Conhecidas

A replicação NDB no NDB 9.5 suporta o uso do mecanismo de Aplicável Multithreaded da MySQL Server genérico (MTA), que permite que transações de log binário separadas sejam aplicadas em paralelo em uma replica, aumentando o desempenho de replicação máximo.

#### Requisitos

A implementação do MTA do MySQL Server delega o processamento de transações de log binário separadas para um conjunto de threads de trabalhador (cujo tamanho é configurável) e coordena os threads de trabalhador para garantir que as dependências de transação codificadas no log binário sejam respeitadas e que a ordem de commit seja mantida, se necessário (veja a Seção 19.2.3, “Threads de Replicação”). Para usar essa funcionalidade com o NDB Cluster, é necessário que a replica seja configurada para usar múltiplos threads de trabalhador. Para fazer isso, defina `replica_parallel_workers` para controlar o número de threads de trabalhador na replica. O valor padrão é 4.

#### Configuração do MTA: Fonte

Além disso, é recomendável que você defina a quantidade de memória usada para rastrear conjuntos de escritas de transações de log binário na fonte (`binlog_transaction_dependency_history_size`) para `E * P`, onde *`E`* é o tamanho médio da época (como o número de operações por época) e *`P`* é o paralelismo máximo esperado. Consulte Rastreamento de Uso de Memória do Conjunto de Escrita, para mais informações.

#### Configuração do MTA: Replicação

A configuração do **mysqld** da replica para o MTA `NDB` requer que `replica_parallel_workers` seja maior que 1. O valor inicial recomendado ao habilitar o MTA pela primeira vez é 4, que é o padrão.

Além disso, `replica_preserve_commit_order` deve estar em `ON`. Esse é também o valor padrão.

#### Dependência de Transações e Gerenciamento de Set de Escrita

As dependências de transações são detectadas através da análise do set de escrita de cada transação, ou seja, o conjunto de linhas (tabela, valores de chave) escritas pela transação. Quando duas transações modificam a mesma linha, elas são consideradas dependentes e devem ser aplicadas em ordem (ou seja, seriamente) para evitar deadlocks ou resultados incorretos. Quando uma tabela tem chaves únicas secundárias, esses valores também são adicionados ao set de escrita da transação para detectar o caso em que há dependências de transações implícitas por diferentes transações afetando o mesmo valor de chave única, exigindo assim a ordenação. Quando as dependências não podem ser determinadas de forma eficiente, o **mysqld** recorre a considerar as transações dependentes por razões de segurança.

As dependências de transações são codificadas no log binário pelo **mysqld** fonte. As dependências são codificadas em um evento `ANONYMOUS_GTID` usando um esquema chamado 'Relógio Lógico'. (Veja a Seção 19.1.4.1, “Conceitos do Modo de Replicação”.)

A implementação do set de escrita empregada pelo MySQL (e pelo NDB Cluster) utiliza a detecção de conflitos baseada em hash, com base na correspondência de hashes de linhas de 64 bits de valores relevantes de tabela e índice. Isso detecta de forma confiável quando a mesma chave é vista duas vezes, mas também pode produzir falsos positivos se diferentes valores de tabela e índice hash para o mesmo valor de 64 bits; isso pode resultar em dependências artificiais que podem reduzir o paralelismo disponível.

As dependências de transações são forçadas por qualquer um dos seguintes:

* Declarações DDL
* Rotação do log binário ou encontro de limites de arquivos de log binário
* Limitações de tamanho do histórico do set de escrita
* Escritas que referenciam chaves estrangeiras pai na tabela de destino

Mais especificamente, as transações que realizam inserções, atualizações e exclusões em tabelas de chave estrangeira *pai* são serializadas em relação a todas as transações anteriores e seguintes, e não apenas às transações que afetam tabelas envolvidas em uma relação de restrição. Por outro lado, as transações que realizam inserções, atualizações e exclusões em tabelas de chave estrangeira *filho* (referenciadas) não são especialmente serializadas uma em relação à outra.

A implementação do MySQL MTA tenta aplicar transações de log binário independentes em paralelo. O `NDB` registra todas as alterações que ocorrem em todas as transações de usuário que estão commitando em um período (`TimeBetweenEpochs`, padrão 100 milissegundos), em uma única transação de log binário, referida como uma transação de período. Portanto, para que duas transações de período consecutivas sejam independentes e possam ser aplicadas em paralelo, é necessário que nenhuma linha seja modificada em ambas as épocas. Se qualquer linha for modificada em ambas as épocas, então elas são dependentes e são aplicadas em série, o que pode limitar o paralelismo explorável disponível.

As transações de período são consideradas independentes com base no conjunto de linhas modificadas no cluster de origem na época, mas não incluindo os eventos `mysql.ndb_apply_status` `WRITE_ROW` gerados que transmitem metadados de período. Isso evita que cada transação de período seja trivialmente dependente da época anterior, mas exige que o binlog seja aplicado na replica com a ordem de commit preservada. Isso também implica que um log binário NDB com dependências de writeset não é adequado para uso por uma base de dados replica com um motor de armazenamento MySQL diferente.

Pode ser possível ou desejável modificar o comportamento das transações de registro para evitar padrões de modificações repetidas nas mesmas linhas, em transações separadas ao longo de um curto período de tempo, para aumentar o paralelismo explorável.

#### Rastreamento de Memória do Conjunto de Escrevendo

A quantidade de memória usada para rastrear os conjuntos de escrevendo de transações de log binário pode ser definida usando a variável de sistema do servidor `binlog_transaction_dependency_history_size`, que tem um valor padrão de 25000 hashes de linhas.

Se uma transação de log binário médio modifica *`N`* linhas, então, para poder identificar transações independentes (paraleláveis) até um nível de paralelismo de *`P`*, precisamos que `binlog_transaction_dependency_history_size` esteja no mínimo `N * P`. (O máximo é 1.000.000.)

O tamanho finito da história resulta em um comprimento finito de dependência que pode ser determinado de forma confiável, dando uma paralelismo finito que pode ser expresso. Qualquer linha não encontrada na história pode ser dependente da última transação excluída da história.

O histórico do conjunto de escrevendo não age como uma janela deslizante sobre as últimas *`N`* transações; em vez disso, é um buffer finito que pode ser preenchido completamente, e então seu conteúdo é descartado completamente quando ele se torna cheio. Isso significa que o tamanho da história segue um padrão de serra ao longo do tempo, e, portanto, o comprimento máximo de dependência detectável também segue um padrão de serra ao longo do tempo, de modo que transações independentes ainda podem ser marcadas como dependentes se o buffer de histórico do conjunto de escrevendo tiver sido redefinido entre serem processadas.

Neste esquema, cada transação em um arquivo de log binário é anotada com um `número_sequência` (1, 2, 3, ...), bem como o número de sequência da transação de log binário mais recente da qual ela depende, à qual nos referimos como `last_committed`.

Dentro de um arquivo de log binário específico, a primeira transação tem `sequence_number` 1 e `last_committed` 0.

Quando uma transação de log binário depende de seu predecessor imediato, sua aplicação é serializada. Se a dependência for de uma transação anterior, pode ser possível aplicar a transação em paralelo com as transações independentes anteriores.

O conteúdo dos eventos `ANONYMOUS_GTID`, incluindo `sequence_number` e `last_committed` (e, portanto, as dependências da transação), pode ser visto usando **mysqlbinlog**.

Os eventos `ANONYMOUS_GTID` gerados na fonte são tratados separadamente do payload da transação comprimida com eventos em massa `BEGIN`, `TABLE_MAP*`, `WRITE_ROW*`, `UPDATE_ROW*`, `DELETE_ROW*` e `COMMIT`, permitindo que as dependências sejam determinadas antes da descomprimagem. Isso significa que o thread do coordenador da replica pode delegar a descomprimagem do payload da transação para um thread de trabalho, proporcionando a descomprimagem paralela automática de transações independentes na replica.

#### Limitações Conhecidas

**Colunas únicas secundárias.** Tabelas com colunas únicas secundárias (ou seja, chaves únicas diferentes da chave primária) enviam todas as colunas para a fonte para que conflitos relacionados a chaves únicas possam ser detectados.

Quando o modo de log binário atual não inclui todas as colunas, mas apenas as colunas alteradas (`--ndb-log-updated-only=OFF`, `--ndb-log-update-minimal=ON`, `--ndb-log-update-as-write=OFF`), isso pode aumentar o volume de dados enviados dos nós de dados para os nós SQL.

O impacto depende tanto da taxa de modificação (atualização ou exclusão) de linhas nessas tabelas quanto do volume de dados em colunas que não são realmente modificadas.

**Replicação de NDB para InnoDB.** A dependência de acompanhamento de transações do injetor de log binário `NDB` ignora intencionalmente as dependências entre transações criadas por eventos de metadados `mysql.ndb_apply_status` gerados, que são tratados separadamente como parte do commit da transação de época no aplicador de réplica. Para a replicação para `InnoDB`, não há tratamento especial; isso pode resultar em desempenho reduzido ou outros problemas ao usar um aplicador `InnoDB` multithread para consumir um log binário MTA `NDB`.