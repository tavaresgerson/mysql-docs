# Glossário do MySQL

Esses termos são comumente usados em informações sobre o servidor de banco de dados MySQL. Este glossário surgiu como uma referência para a terminologia sobre o mecanismo de armazenamento InnoDB, e a maioria das definições está relacionada ao InnoDB.

### A

Arquivo .ARM: Metadados para tabelas `ARCHIVE`. Contrasta com o arquivo **.ARZ**. Arquivos com essa extensão são sempre incluídos em backups produzidos pelo comando `mysqlbackup` do produto **MySQL Enterprise Backup**.

```
See Also .ARZ file, MySQL Enterprise Backup, mysqlbackup command.
```

Arquivo .ARZ: Dados para tabelas ARCHIVE. Contrasta com o arquivo **.ARM**. Arquivos com essa extensão são sempre incluídos em backups produzidos pelo comando `mysqlbackup` do produto **MySQL Enterprise Backup**.

```
See Also .ARM file, MySQL Enterprise Backup, mysqlbackup command.
```

ACID: Um acrônimo que significa atomicidade, consistência, isolamento e durabilidade. Essas propriedades são desejáveis em um sistema de banco de dados e estão todas intimamente ligadas à noção de **transação**. As características transacionais do `InnoDB` aderem aos princípios ACID.

```
Transactions are **atomic** units of work that can be **committed** or **rolled back**. When a transaction makes multiple changes to the database, either all the changes succeed when the transaction is committed, or all the changes are undone when the transaction is rolled back.

The database remains in a consistent state at all times — after each commit or rollback, and while transactions are in progress. If related data is being updated across multiple tables, queries see either all old values or all new values, not a mix of old and new values.

Transactions are protected (isolated) from each other while they are in progress; they cannot interfere with each other or see each other's uncommitted data. This isolation is achieved through the **locking** mechanism. Experienced users can adjust the **isolation level**, trading off less protection in favor of increased performance and **concurrency**, when they can be sure that the transactions really do not interfere with each other.

The results of transactions are durable: once a commit operation succeeds, the changes made by that transaction are safe from power failures, system crashes, race conditions, or other potential dangers that many non-database applications are vulnerable to. Durability typically involves writing to disk storage, with a certain amount of redundancy to protect against power failures or software crashes during write operations. (In `InnoDB`, the **doublewrite buffer** assists with durability.)

See Also atomic, commit, concurrency, doublewrite buffer, isolation level, locking, rollback, transaction.
```

varredura adaptativa: Um algoritmo para tabelas do **InnoDB** que suaviza o overhead de I/O introduzido pelos **pontos de verificação**. Em vez de **varrer** todas as **páginas** modificadas do **pool de buffers** para os **arquivos de dados** de uma vez, o MySQL varre periodicamente pequenos conjuntos de páginas modificadas. O algoritmo de varredura adaptativa estende esse processo, estimulando a taxa ótima para realizar essas varreduras periódicas, com base na taxa de varredura e na velocidade com que as informações de **refazer** são geradas.

```
See Also buffer pool, checkpoint, data files, flush, InnoDB, page, redo log.
```

índice de hash adaptável: Uma otimização para tabelas `InnoDB` que pode acelerar as consultas usando os operadores `=` e `IN`, construindo um **índice de hash** na memória. O MySQL monitora as consultas de índice para tabelas `InnoDB` e, se as consultas puderem se beneficiar de um índice de hash, ele constrói um automaticamente para **páginas** de índice que são acessadas com frequência. Em certo sentido, o índice de hash adaptável configura o MySQL em tempo de execução para aproveitar a ampla memória principal, aproximando-se da arquitetura de bancos de dados com memória principal. Essa funcionalidade é controlada pela opção de configuração `innodb_adaptive_hash_index`. Como essa funcionalidade beneficia algumas cargas de trabalho e não outras, e a memória usada para o índice de hash é reservada no **buffer pool**, você geralmente deve realizar testes com essa funcionalidade habilitada e desabilitada.

```
The hash index is always built based on an existing **B-tree** index on the table. MySQL can build a hash index on a prefix of any length of the key defined for the B-tree, depending on the pattern of searches against the index. A hash index can be partial; the whole B-tree index does not need to be cached in the buffer pool.

See Also B-tree, buffer pool, hash index, page, secondary index.
```

ADO.NET: Um framework de mapeamento objeto-relacional (ORM) para aplicações construídas usando tecnologias .NET, como **ASP.NET**. Essas aplicações podem interagir com o MySQL por meio do componente **Connector/NET**.

```
See Also .NET, ASP.net, Connector/NET, Mono, Visual Studio.
```

AIO: Abreviação para **I/O assíncrono**. Você pode ver essa abreviação em mensagens ou palavras-chave do `InnoDB`.

```
See Also asynchronous I/O.
```

ANSI: No **ODBC**, um método alternativo de suporte a conjuntos de caracteres e outros aspectos de internacionalização. Contrasta com **Unicode**. O **Connector/ODBC** 3.51 é um driver ANSI, enquanto o **Connector/ODBC** 5.1 é um driver Unicode.

```
See Also Connector/ODBC, ODBC, Unicode.
```

Antílope: O nome de código para o formato de arquivo original do `InnoDB`. Ele suporta os formatos de linha **REDUNDANTE** e **COMPACT**, mas não os novos formatos de linha **DINÂMICA** e **COMPACTADO** disponíveis no formato de arquivo **Barracuda**.

```
See Also Barracuda, compact row format, compressed row format, dynamic row format, file format, innodb\_file\_format, redundant row format.
```

API: As APIs fornecem acesso de nível baixo ao protocolo MySQL e aos recursos MySQL a partir de programas **de cliente**. Contrasta com o acesso de nível superior fornecido por um **Conector**.

```
See Also C API, client, connector, native C API, Perl API, PHP API, Python API, Ruby API.
```

interface de programação de aplicativos (API): Um conjunto de funções ou procedimentos. Uma API fornece um conjunto estável de nomes e tipos para funções, procedimentos, parâmetros e valores de retorno.

aplicar: Quando um backup produzido pelo produto **MySQL Enterprise Backup** não inclui as alterações mais recentes que ocorreram durante a execução do backup, o processo de atualização dos arquivos de backup para incluir essas alterações é conhecido como a etapa **aplicar**. É especificado pela opção `apply-log` do comando `mysqlbackup`.

```
Before the changes are applied, we refer to the files as a **raw backup**. After the changes are applied, we refer to the files as a **prepared backup**. The changes are recorded in the **ibbackup\_logfile** file; once the apply step is finished, this file is no longer necessary.

See Also hot backup, ibbackup\_logfile, MySQL Enterprise Backup, prepared backup, raw backup.
```

ASP.net: Um framework para o desenvolvimento de aplicações baseadas na web usando tecnologias e linguagens **.NET**. Essas aplicações podem interagir com o MySQL por meio do componente **Connector/NET**.

```
Another technology for writing server-side web pages with MySQL is **PHP**.

See Also .NET, ADO.NET, Connector/NET, Mono, PHP, Visual Studio.
```

montagem: Uma biblioteca de código compilado em um sistema **.NET**, acessada por meio do **Connector/NET**. Armazenada no **GAC** para permitir a versão sem conflitos de nomeação.

```
See Also .NET, GAC.
```

E/S assíncrona: Um tipo de operação de E/S que permite que outros processos prossigam antes que a E/S seja concluída. Também conhecida como **E/S não bloqueante** e abreviada como **AIO**. O `InnoDB` utiliza este tipo de E/S para certas operações que podem ser executadas em paralelo sem afetar a confiabilidade do banco de dados, como a leitura de páginas no **pool de buffers** que não foram realmente solicitadas, mas podem ser necessárias em breve.

```
Historically, `InnoDB` used asynchronous I/O on Windows systems only. Starting with the InnoDB Plugin 1.1 and MySQL 5.5, `InnoDB` uses asynchronous I/O on Linux systems. This change introduces a dependency on `libaio`. Asynchronous I/O on Linux systems is configured using the `innodb_use_native_aio` option, which is enabled by default. On other Unix-like systems, InnoDB uses synchronous I/O only.

See Also buffer pool, nonblocking I/O.
```

atômico: No contexto SQL, as **transações** são unidades de trabalho que ou têm sucesso totalmente (quando **comprometidas**) ou não têm nenhum efeito (quando **revertidas**). A propriedade indivisível ("atômica") das transações é a "A" do acrônimo **ACID**.

```
See Also ACID, commit, rollback, transaction.
```

DDL atômico: Uma instrução *DDL* atômica é aquela que combina as atualizações do *dicionário de dados*, as operações do *motor de armazenamento* e os registros binários associados a uma operação de DDL em uma única transação atômica. A transação é totalmente confirmada ou revertida, mesmo que o servidor seja interrompido durante a operação. O suporte ao DDL atômico foi adicionado no MySQL 8.0. Para mais informações, consulte Suporte ao Dicionário de Definição de Dados Atômicos.

```
See Also binary log, data dictionary, DDL, storage engine.
```

Instrução atômica: instruções especiais fornecidas pela CPU, para garantir que operações críticas de baixo nível não possam ser interrompidas.

Autoincremento: Uma propriedade de uma coluna de tabela (especificada pela palavra-chave `AUTO_INCREMENT`) que adiciona automaticamente uma sequência crescente de valores na coluna.

```
It saves work for the developer, not to have to produce new unique values when inserting new rows. It provides useful information for the query optimizer, because the column is known to be not null and with unique values. The values from such a column can be used as lookup keys in various contexts, and because they are auto-generated there is no reason to ever change them; for this reason, primary key columns are often specified as auto-incrementing.

Auto-increment columns can be problematic with statement-based replication, because replaying the statements on a replica might not produce the same set of column values as on the source, due to timing issues. When you have an auto-incrementing primary key, you can use statement-based replication only with the setting `innodb_autoinc_lock_mode=1`. If you have `innodb_autoinc_lock_mode=2`, which allows higher concurrency for insert operations, use **row-based replication** rather than **statement-based replication**. The setting `innodb_autoinc_lock_mode=0` should not be used except for compatibility purposes.

Consecutive lock mode (`innodb_autoinc_lock_mode=1`) is the default setting prior to MySQL 8.0.3. As of MySQL 8.0.3, interleaved lock mode (`innodb_autoinc_lock_mode=2`) is the default, which reflects the change from statement-based to row-based replication as the default replication type.

See Also auto-increment locking, innodb\_autoinc\_lock\_mode, primary key, row-based replication, statement-based replication.
```

Bloqueio de autoincremento: A conveniência de uma chave primária de **autoincremento** implica em um certo compromisso com a concorrência. No caso mais simples, se uma transação está inserindo valores na tabela, qualquer outra transação deve esperar para fazer suas próprias inserções naquela tabela, para que as linhas inseridas pela primeira transação recebam valores consecutivos da chave primária. O `InnoDB` inclui otimizações e a opção `innodb_autoinc_lock_mode` para que você possa configurar um equilíbrio ótimo entre sequências previsíveis de valores de autoincremento e a **concorrência** máxima para operações de inserção.

```
See Also auto-increment, concurrency, innodb\_autoinc\_lock\_mode.
```

autocommit: Uma configuração que causa uma operação de **commit** após cada **SQL** instrução. Esse modo não é recomendado para trabalhar com tabelas `InnoDB` com **transações** que abrangem várias instruções. Ele pode ajudar no desempenho de **transações de leitura** em tabelas `InnoDB`, onde minimiza o overhead do **bloqueio** e da geração de dados de **undo**, especialmente no MySQL 5.6.4 e versões posteriores. Também é apropriado para trabalhar com tabelas `MyISAM`, onde as transações não são aplicáveis.

```
See Also commit, locking, read-only transaction, SQL, transaction, undo.
```

disponibilidade: A capacidade de lidar com e, se necessário, recuperar de falhas no host, incluindo falhas no MySQL, no sistema operacional ou no hardware, e a atividade de manutenção que possam causar tempo de inatividade. Muitas vezes associada à **escalabilidade** como aspectos críticos de uma implantação em larga escala.

```
See Also scalability.
```

MySQL Enterprise Backup: Um produto licenciado que realiza backups **quentes** de bancos de dados MySQL. Ele oferece a maior eficiência e flexibilidade ao fazer backups de tabelas `InnoDB`, mas também pode fazer backups de tabelas `MyISAM` e outros tipos.

```
See Also hot backup, InnoDB.
```

### B

B-tree: Uma estrutura de dados em forma de árvore que é popular para uso em índices de banco de dados. A estrutura é mantida ordenada em todos os momentos, permitindo uma busca rápida por correspondências exatas (operador igual) e faixas (por exemplo, maior que, menor que e operadores `BETWEEN`). Esse tipo de índice está disponível para a maioria dos motores de armazenamento, como `InnoDB` e `MyISAM`.

```
Because B-tree nodes can have many children, a B-tree is not the same as a binary tree, which is limited to 2 children per node.

Contrast with **hash index**, which is only available in the `MEMORY` storage engine. The `MEMORY` storage engine can also use B-tree indexes, and you should choose B-tree indexes for `MEMORY` tables if some queries use range operators.

The use of the term B-tree is intended as a reference to the general class of index design. B-tree structures used by MySQL storage engines may be regarded as variants due to sophistications not present in a classic B-tree design. For related information, refer to the `InnoDB` Page Structure Fil Header section of the MySQL Internals Manual.

See Also hash index.
```

backticks: Os identificadores dentro das instruções SQL do MySQL devem ser citados usando o caractere backtick (\`\`\`) se contiverem caracteres especiais ou palavras reservadas. Por exemplo, para se referir a uma tabela chamada `FOO#BAR` ou a uma coluna chamada `SELECT`, você especificaria os identificadores como `FOO#BAR` e `SELECT`. Como os backticks fornecem um nível extra de segurança, eles são amplamente utilizados em instruções SQL geradas por programas, onde os nomes dos identificadores podem não ser conhecidos antecipadamente.

```
Many other database systems use double quotation marks (`"`) around such special names. For portability, you can enable `ANSI_QUOTES` mode in MySQL and use double quotation marks instead of backticks to qualify identifier names.

See Also SQL.
```

backup: O processo de copiar alguns ou todos os dados da tabela e metadados de uma instância MySQL, para armazenamento seguro. Também pode se referir ao conjunto de arquivos copiados. Esta é uma tarefa crucial para os DBAs. O oposto deste processo é a operação de **restauração**.

```
With MySQL, **physical backups** are performed by the **MySQL Enterprise Backup** product, and **logical backups** are performed by the `mysqldump` command. These techniques have different characteristics in terms of size and representation of the backup data, and speed (especially speed of the restore operation).

Backups are further classified as **hot**, **warm**, or **cold** depending on how much they interfere with normal database operation. (Hot backups have the least interference, cold backups the most.)

See Also cold backup, hot backup, logical backup, MySQL Enterprise Backup, mysqldump, physical backup, warm backup.
```

Barracuda: O nome de código para um **formato de arquivo** do `InnoDB` que suporta o formato de linha **COMPRESSADO**, que permite a compressão de tabelas do InnoDB, e o formato de linha **DINÂMICO**, que melhora o layout de armazenamento para colunas de comprimento variável longo.

```
The **MySQL Enterprise Backup** product version 3.5 and above supports backing up tablespaces that use the Barracuda file format.

See Also Antelope, compact row format, compressed row format, dynamic row format, file format, file-per-table, general tablespace, innodb\_file\_format, MySQL Enterprise Backup, row format, system tablespace.
```

coluna base: Uma coluna de tabela não gerada sobre a qual uma coluna gerada armazenada ou uma coluna gerada virtual é baseada. Em outras palavras, uma coluna base é uma coluna de tabela não gerada que faz parte de uma definição de coluna gerada.

```
See Also generated column, stored generated column, virtual generated column.
```

beta: Uma fase inicial da vida de um produto de software, quando ele está disponível apenas para avaliação, geralmente sem um número de lançamento definido ou um número menor que 1. O **InnoDB** não usa a designação beta, preferindo uma fase de **adotante precoce** que pode se estender por várias versões pontuais, levando a um lançamento **GA**.

```
See Also early adopter, GA.
```

log binário: Um arquivo que contém um registro de todas as declarações ou alterações de linha que tentam alterar os dados da tabela. O conteúdo do log binário pode ser rebobinado para atualizar as réplicas em um cenário de **replicação** ou para atualizar um banco de dados após restaurar os dados da tabela a partir de um backup. O recurso de registro binário pode ser ativado e desativado, embora a Oracle recommende sempre ativá-lo se você usar a replicação ou realizar backups.

```
You can examine the contents of the binary log, or replay it during replication or recovery, by using the **mysqlbinlog** command. For full information about the binary log, see Section 5.4.4, “The Binary Log”. For MySQL configuration options related to the binary log, see Section 16.1.6.4, “Binary Logging Options and Variables”.

For the **MySQL Enterprise Backup** product, the file name of the binary log and the current position within the file are important details. To record this information for the source when taking a backup in a replication context, you can specify the `--slave-info` option.

Prior to MySQL 5.0, a similar capability was available, known as the update log. In MySQL 5.0 and higher, the binary log replaces the update log.

See Also binlog, MySQL Enterprise Backup, replication.
```

binlog: Um nome informal para o arquivo de **log binário**. Por exemplo, você pode ver essa abreviação sendo usada em mensagens de e-mail ou discussões em fóruns.

```
See Also binary log.
```

expansão de consulta cega: um modo especial de **pesquisa de texto completo** habilitado pela cláusula `WITH QUERY EXPANSION`. Ele realiza a pesquisa duas vezes, onde a frase de busca para a segunda pesquisa é a frase de busca original concatenada com os poucos documentos mais relevantes da primeira pesquisa. Essa técnica é principalmente aplicável para frases de busca curtas, talvez apenas uma palavra. Ela pode descobrir correspondências relevantes onde o termo de busca preciso não ocorre no documento.

```
See Also full-text search.
```

BLOB: Um tipo de dado SQL (`TINYBLOB`, `BLOB`, `MEDIUMBLOB` e `LONGBLOB`) para objetos que contêm qualquer tipo de dados binários, de tamanho arbitrário. Usado para armazenar documentos, imagens, arquivos de som e outros tipos de informações que não podem ser facilmente decompostos em linhas e colunas dentro de uma tabela MySQL. As técnicas para lidar com BLOBs dentro de uma aplicação MySQL variam com cada **Conector** e **API**. O `Connector/ODBC` do MySQL define os valores `BLOB` como `LONGVARBINARY`. Para coleções grandes e de formato livre de dados de caracteres, o termo da indústria é **CLOB**, representado pelos tipos de dados `TEXT` do MySQL.

```
See Also API, CLOB, connector, Connector/ODBC.
```

obstáculo: Uma parte de um sistema que está limitada em tamanho ou capacidade, que tem o efeito de limitar o desempenho geral. Por exemplo, uma área de memória pode ser menor do que o necessário; o acesso a um único recurso necessário pode impedir que múltiplos núcleos da CPU funcionem simultaneamente; ou esperar que o I/O do disco seja concluído pode impedir que a CPU funcione na capacidade máxima. Remover os gargalos tende a melhorar a **concorrência**. Por exemplo, a capacidade de ter múltiplas instâncias do **pool de buffers** do `InnoDB` reduz a concorrência quando múltiplas sessões leem e escrevem no pool de buffers simultaneamente.

```
See Also buffer pool, concurrency.
```

bounce: Uma operação de **shutdown** seguida imediatamente por um reinício. Idealmente, com um período de **aquecimento** relativamente curto para que o desempenho e a produtividade voltem rapidamente a um alto nível.

```
See Also shutdown.
```

Alocador de amigos: Um mecanismo para gerenciar **páginas** de tamanhos diferentes no **pool de buffers** do InnoDB.

```
See Also buffer pool, page, page size.
```

buffer: Uma área de memória ou disco usada para armazenamento temporário. Os dados são armazenados em memória para que possam ser escritos no disco de forma eficiente, com poucas operações de E/S grandes em vez de muitas pequenas. Os dados são armazenados em disco para maior confiabilidade, para que possam ser recuperados mesmo quando ocorre um **crash** ou outra falha no momento mais inoportuno. Os principais tipos de buffers usados pelo InnoDB são o **buffer pool**, o **buffer doublewrite** e o **buffer de alterações**.

```
See Also buffer pool, change buffer, crash, doublewrite buffer.
```

pool de buffers: Área de memória que armazena dados `InnoDB` em cache para tabelas e índices. Para a eficiência das operações de leitura de alto volume, o pool de buffers é dividido em **páginas** que podem potencialmente armazenar múltiplas linhas. Para a eficiência da gestão de cache, o pool de buffers é implementado como uma lista encadeada de páginas; os dados que raramente são usados são eliminados do cache, usando uma variação do algoritmo **LRU**. Em sistemas com grande memória, você pode melhorar a concorrência dividindo o pool de buffers em múltiplas **instâncias de pool de buffers**.

```
Several `InnoDB` status variables, `INFORMATION_SCHEMA` tables, and `performance_schema` tables help to monitor the internal workings of the buffer pool. Starting in MySQL 5.6, you can avoid a lengthy warmup period after restarting the server, particularly for instances with large buffer pools, by saving the buffer pool state at server shutdown and restoring the buffer pool to the same state at server startup. See Section 14.8.3.6, “Saving and Restoring the Buffer Pool State”.

See Also buffer pool instance, LRU, page, warm up.
```

instância do pool de buffers: Qualquer uma das múltiplas regiões em que o **pool de buffers** pode ser dividido, controlada pela opção de configuração `innodb_buffer_pool_instances`. O tamanho total da memória especificado por `innodb_buffer_pool_size` é dividido entre todas as instâncias do pool de buffers. Tipicamente, ter múltiplas instâncias do pool de buffers é apropriado para sistemas que alocam vários gigabytes ao pool de buffers do `InnoDB`, com cada instância sendo de um gigabyte ou maior. Em sistemas que carregam ou procuram grandes quantidades de dados no pool de buffers de muitas sessões concorrentes, ter múltiplas instâncias do pool de buffers reduz a disputa por acesso exclusivo às estruturas de dados que gerenciam o pool de buffers.

```
See Also buffer pool.
```

incorporado: O motor de armazenamento `InnoDB` incorporado no MySQL é a forma original de distribuição do motor de armazenamento. Em contraste com o **Plugin InnoDB**. A partir do MySQL 5.5, o Plugin InnoDB foi incorporado de volta à base de código do MySQL como o motor de armazenamento `InnoDB` incorporado (conhecido como InnoDB 1.1).

```
This distinction is important mainly in MySQL 5.1, where a feature or bug fix might apply to the InnoDB Plugin but not the built-in `InnoDB`, or vice versa.

See Also InnoDB.
```

regras de negócios: As relações e sequências de ações que formam a base do software de negócios, usado para gerir uma empresa comercial. Às vezes, essas regras são ditadas por lei, outras vezes por políticas da empresa. Um planejamento cuidadoso garante que as relações codificadas e aplicadas pelo banco de dados, e as ações realizadas por meio da lógica da aplicação, reflitam com precisão as políticas reais da empresa e possam lidar com situações da vida real.

```
For example, an employee leaving a company might trigger a sequence of actions from the human resources department. The human resources database might also need the flexibility to represent data about a person who has been hired, but not yet started work. Closing an account at an online service might result in data being removed from a database, or the data might be moved or flagged so that it could be recovered if the account is re-opened. A company might establish policies regarding salary maximums, minimums, and adjustments, in addition to basic sanity checks such as the salary not being a negative number. A retail database might not allow a purchase with the same serial number to be returned more than once, or might not allow credit card purchases above a certain value, while a database used to detect fraud might allow these kinds of things.

See Also relational.
```

### C

Arquivo .cfg: Um arquivo de metadados usado com o recurso de **espaço de tabela transponível** do **InnoDB**. Ele é gerado pelo comando `FLUSH TABLES ... FOR EXPORT`, coloca uma ou mais tabelas em um estado consistente que pode ser copiado para outro servidor. O arquivo .cfg é copiado junto com o arquivo .ibd correspondente e é usado para ajustar os valores internos do arquivo .ibd, como o **ID de espaço**, durante a etapa `ALTER TABLE ... IMPORT TABLESPACE`.

```
See Also .ibd file, space ID, transportable tablespace.
```

C: Uma linguagem de programação que combina portabilidade com desempenho e acesso a recursos de hardware de baixo nível, tornando-a uma escolha popular para a escrita de sistemas operacionais, drivers e outros tipos de software de sistema. Muitas aplicações complexas, linguagens e módulos reutilizáveis apresentam partes escritas em C, unidas com componentes de alto nível escritos em outras linguagens. Sua sintaxe central é familiar para desenvolvedores de **C++**, **Java** e **C#**.

```
See Also C API, C++, C#, Java.
```

C API: O código **API** C é distribuído com o MySQL. Ele está incluído na biblioteca **libmysqlclient** e permite que os programas em **C** acessem um banco de dados.

```
See Also API, C, libmysqlclient.
```

C#: Uma linguagem de programação que combina tipos fortes e recursos orientada a objetos, executada dentro do **.NET** da Microsoft ou de sua contraparte de código aberto **Mono**. Muitas vezes usada para criar aplicativos com o **ASP.net**. Sua sintaxe é familiar para desenvolvedores de **C**, **C++** e **Java**.

```
See Also .NET, ASP.net, C, Connector/NET, C++, Java, Mono.
```

C++: Uma linguagem de programação com sintaxe básica familiar aos desenvolvedores de **C**. Fornece acesso a operações de baixo nível para desempenho, combinadas com tipos de dados de nível superior, recursos orientado a objetos e coleta de lixo. Para escrever aplicativos C++ para o MySQL, você usa o componente **Connector/C++**.

```
See Also C, Connector/C++.
```

cache: O termo geral para qualquer área de memória que armazena cópias de dados para recuperação frequente ou de alta velocidade. No `InnoDB`, o tipo principal de estrutura de cache é o **pool de buffers**.

```
See Also buffer, buffer pool.
```

cardinalidade: O número de valores diferentes em uma **coluna** de uma tabela. Quando as consultas referem-se a colunas que têm um **índice** associado, a cardinalidade de cada coluna influencia qual método de acesso é mais eficiente. Por exemplo, para uma coluna com uma **restrição de unicidade**, o número de valores diferentes é igual ao número de linhas na tabela. Se uma tabela tiver um milhão de linhas, mas apenas 10 valores diferentes para uma coluna específica, cada valor ocorre (em média) 100.000 vezes. Uma consulta como `SELECT c1 FROM t1 WHERE c1 = 50;` pode, portanto, retornar 1 linha ou um número enorme de linhas, e o servidor de banco de dados pode processar a consulta de maneira diferente, dependendo da cardinalidade de `c1`.

```
If the values in a column have a very uneven distribution, the cardinality might not be a good way to determine the best query plan. For example, `SELECT c1 FROM t1 WHERE c1 = x;` might return 1 row when `x=50` and a million rows when `x=30`. In such a case, you might need to use **index hints** to pass along advice about which lookup method is more efficient for a particular query.

Cardinality can also apply to the number of distinct values present in multiple columns, as in a **composite index**.

See Also column, composite index, index, index hint, persistent statistics, random dive, selectivity, unique constraint.
```

buffer de alterações: uma estrutura de dados especial que registra as alterações em **páginas** em **índices secundários**. Esses valores podem resultar de instruções SQL `INSERT`, `UPDATE` ou `DELETE` (**DML**). O conjunto de recursos envolvendo o buffer de alterações é conhecido coletivamente como **bufferização de alterações**, que consiste em **bufferização de inserção**, **bufferização de exclusão** e **bufferização de purga**.

```
Changes are only recorded in the change buffer when the relevant page from the secondary index is not in the **buffer pool**. When the relevant index page is brought into the buffer pool while associated changes are still in the change buffer, the changes for that page are applied in the buffer pool (**merged**) using the data from the change buffer. Periodically, the **purge** operation that runs during times when the system is mostly idle, or during a slow shutdown, writes the new index pages to disk. The purge operation can write the disk blocks for a series of index values more efficiently than if each value were written to disk immediately.

Physically, the change buffer is part of the **system tablespace**, so that the index changes remain buffered across database restarts. The changes are only applied (**merged**) when the pages are brought into the buffer pool due to some other read operation.

The kinds and amount of data stored in the change buffer are governed by the `innodb_change_buffering` and `innodb_change_buffer_max_size` configuration options. To see information about the current data in the change buffer, issue the `SHOW ENGINE INNODB STATUS` command.

Formerly known as the **insert buffer**.

See Also buffer pool, change buffering, delete buffering, DML, insert buffer, insert buffering, merge, page, purge, purge buffering, secondary index, system tablespace.
```

alterar o buffer: O termo geral para as funcionalidades que envolvem o **buffer de alteração**, que inclui **buffer de inserção**, **buffer de exclusão** e **buffer de purga**. As alterações de índice resultantes de instruções SQL, que normalmente poderiam envolver operações aleatórias de E/S, são revertidas e realizadas periodicamente por um **thread** em segundo plano. Essa sequência de operações pode gravar os blocos de disco para uma série de valores de índice de forma mais eficiente do que se cada valor fosse gravado no disco imediatamente. Controlado pelas opções de configuração `innodb_change_buffering` e `innodb_change_buffer_max_size`.

```
See Also change buffer, delete buffering, insert buffering, purge buffering.
```

ponto de verificação: À medida que alterações são feitas nas páginas de dados que estão armazenadas no **pool de buffer**, essas alterações são escritas nos **arquivos de dados** em algum momento mais tarde, um processo conhecido como **limpeza**. O ponto de verificação é um registro das últimas alterações (representado por um valor **LSN**) que foram escritas com sucesso nos arquivos de dados.

```
See Also buffer pool, data files, flush, fuzzy checkpointing, LSN.
```

checksum: Em `InnoDB`, um mecanismo de validação para detectar corrupção quando uma **página** em um **espaço de tabelas** é lida do disco para o **pool de buffers** do `InnoDB`. Esse recurso é controlado pela opção de configuração `innodb_checksums` no MySQL 5.5. `innodb_checksums` é desatualizado no MySQL 5.6.3, substituído por `innodb_checksum_algorithm`.

```
The **innochecksum** command helps diagnose corruption problems by testing the checksum values for a specified **tablespace** file while the MySQL server is shut down.

MySQL also uses checksums for replication purposes. For details, see the configuration options `binlog_checksum`, `source_verify_checksum` or `master_verify_checksum`, and `replica_sql_verify_checksum` or `slave_sql_verify_checksum`.

See Also buffer pool, page, tablespace.
```

tabela filho: Em uma relação de **chave estrangeira**, uma tabela filho é aquela cujas linhas referenciam (ou apontam) para linhas de outra tabela com um valor idêntico para uma coluna específica. Esta é a tabela que contém a cláusula `FOREIGN KEY ... REFERENCES` e, opcionalmente, as cláusulas `ON UPDATE` e `ON DELETE`. A linha correspondente na **tabela pai** deve existir antes que a linha possa ser criada na tabela filho. Os valores na tabela filho podem impedir operações de exclusão ou atualização na tabela pai ou podem causar exclusão ou atualização automática na tabela filho, com base na opção `ON CASCADE` usada ao criar a chave estrangeira.

```
See Also foreign key, parent table.
```

página limpa: Uma **página** no **pool de buffer** do `InnoDB` onde todas as alterações feitas na memória também foram escritas (**flushadas**) nos arquivos de dados. O oposto de uma **página suja**.

```
See Also buffer pool, data files, dirty page, flush, page.
```

desligamento limpo: Um **desligamento** que é concluído sem erros e aplica todas as alterações às tabelas do `InnoDB` antes de terminar, ao contrário de um **quebra** ou um **desligamento rápido**. Sinônimo de **desligamento lento**.

```
See Also crash, fast shutdown, shutdown, slow shutdown.
```

cliente: Um programa que funciona fora do servidor de banco de dados, comunicando-se com o banco de dados enviando solicitações por meio de um **conector** ou uma **API** disponibilizada por meio de **bibliotecas de cliente**. Ele pode ser executado na mesma máquina física do servidor de banco de dados ou em uma máquina remota conectada por meio de uma rede. Pode ser um aplicativo de banco de dados de propósito específico ou um programa de propósito geral, como o processador de linha de comando **mysql**.

```
See Also API, client libraries, connector, mysql, server.
```

bibliotecas de clientes: Arquivos que contêm coleções de funções para trabalhar com bancos de dados. Ao compilar seu programa com essas bibliotecas ou instalá-las no mesmo sistema que sua aplicação, você pode executar um aplicativo de banco de dados (conhecido como **cliente**) em uma máquina que não tenha o servidor MySQL instalado; o aplicativo acessa o banco de dados pela rede. Com o MySQL, você pode usar a biblioteca **libmysqlclient** do próprio servidor MySQL.

```
See Also client, libmysqlclient.
```

declaração preparada no lado do cliente: Um tipo de **declaração preparada** onde o cache e a reutilização são gerenciados localmente, emulando a funcionalidade das **declarações preparadas no lado do servidor**. Historicamente, usado por alguns desenvolvedores de **Connector/J**, **Connector/ODBC** e **Connector/PHP** para resolver problemas com procedimentos armazenados no lado do servidor. Com as versões modernas do servidor MySQL, as declarações preparadas no lado do servidor são recomendadas para desempenho, escalabilidade e eficiência de memória.

```
See Also Connector/J, Connector/ODBC, Connector/PHP, prepared statement.
```

CLOB: Um tipo de dado SQL (`TINYTEXT`, `TEXT`, `MEDIUMTEXT` ou `LONGTEXT`) para objetos que contêm qualquer tipo de dados de caracteres, de tamanho arbitrário. Usado para armazenar documentos baseados em texto, com conjunto de caracteres e ordem de ordenação associados. As técnicas para lidar com CLOBs dentro de uma aplicação MySQL variam com cada **Conector** e **API**. O MySQL Connector/ODBC define valores `TEXT` como `LONGVARCHAR`. Para armazenar dados binários, o equivalente é o tipo **BLOB**.

```
See Also API, BLOB, connector, Connector/ODBC.
```

Índice agrupado: O termo `InnoDB` para um índice de **chave primária**. O armazenamento de tabelas `InnoDB` é organizado com base nos valores das colunas da chave primária, para acelerar consultas e ordenamentos que envolvam as colunas da chave primária. Para obter o melhor desempenho, escolha as colunas da chave primária com cuidado, com base nas consultas mais críticas em termos de desempenho. Como modificar as colunas do índice agrupado é uma operação cara, escolha colunas primárias que sejam raramente ou nunca atualizadas.

```
In the Oracle Database product, this type of table is known as an **index-organized table**.

See Also index, primary key, secondary index.
```

Backup frio: Um **backup** feito enquanto o banco de dados está desligado. Para aplicações e sites movimentados, isso pode não ser prático, e você pode preferir um **backup quente** ou um **backup quente**.

```
See Also backup, hot backup, warm backup.
```

Coluna: Um item de dados dentro de uma **linha**, cujo armazenamento e semântica são definidos por um tipo de dado. Cada **tabela** e **índice** são definidos em grande parte pelo conjunto de colunas que contêm.

```
Each column has a **cardinality** value. A column can be the **primary key** for its table, or part of the primary key. A column can be subject to a **unique constraint**, a **NOT NULL constraint**, or both. Values in different columns, even across different tables, can be linked by a **foreign key** relationship.

In discussions of MySQL internal operations, sometimes **field** is used as a synonym.

See Also cardinality, foreign key, index, NOT NULL constraint, primary key, row, table, unique constraint.
```

índice de coluna: Um **índice** em uma única coluna.

```
See Also composite index, index.
```

prefixo da coluna: Quando um **índice** é criado com uma especificação de comprimento, como `CREATE INDEX idx ON t1 (c1(N))`, apenas os primeiros N caracteres do valor da coluna são armazenados no índice. Manter o prefixo do índice pequeno torna o índice compacto, e as economias de memória e I/O de disco ajudam no desempenho. (Embora fazer o prefixo do índice muito pequeno possa prejudicar a otimização de consultas, fazendo com que linhas com valores diferentes pareçam duplicatas para o otimizador de consultas.)

```
For columns containing binary values or long text strings, where sorting is not a major consideration and storing the entire value in the index would waste space, the index automatically uses the first N (typically 768) characters of the value to do lookups and sorts.

See Also index.
```

Interceptador de comandos: Sinônimo de **interceptador de declarações**. Um aspecto do padrão de design **interceptador** disponível tanto para **Connector/NET** quanto para **Connector/J**. O que o **Connector/NET** chama de comando, o **Connector/J** chama de declaração. Em contraste com o **interceptador de exceções**.

```
See Also Connector/J, Connector/NET, exception interceptor, interceptor, statement interceptor.
```

commit: Uma instrução **SQL** que encerra uma **transação**, tornando permanentes quaisquer alterações feitas pela transação. É o oposto do **rollback**, que desfaz quaisquer alterações feitas na transação.

```
`InnoDB` uses an **optimistic** mechanism for commits, so that changes can be written to the data files before the commit actually occurs. This technique makes the commit itself faster, with the tradeoff that more work is required in case of a rollback.

By default, MySQL uses the **autocommit** setting, which automatically issues a commit following each SQL statement.

See Also autocommit, optimistic, rollback, SQL, transaction.
```

formato de linha compacto: O formato de linha padrão **InnoDB** para tabelas **InnoDB** do MySQL 5.0.3 ao MySQL 5.7.8. A partir do MySQL 5.7.9, o formato de linha padrão é definido pela opção de configuração **innodb\_default\_row\_format**, que tem um valor padrão de **DINÂMICO**. O formato de linha **COMPACT** oferece uma representação mais compacta para nulos e colunas de comprimento variável do que o formato de linha padrão anterior (**REDUNDANTE**).

```
For additional information about `InnoDB` `COMPACT` row format, see Section 14.11, “InnoDB Row Formats”.

See Also Antelope, dynamic row format, file format, redundant row format, row format.
```

índice composto: um **índice** que inclui várias colunas.

```
See Also index.
```

backup comprimido: O recurso de compressão do produto **MySQL Enterprise Backup** cria uma cópia comprimida de cada espaço de tabela, alterando a extensão de `.ibd` para `.ibz`. A compressão dos dados do backup permite que você mantenha mais backups prontos e reduz o tempo para transferir backups para um servidor diferente. Os dados são descompactados durante a operação de restauração. Quando uma operação de backup comprimido processa uma tabela que já está comprimida, ela ignora o passo de compressão para essa tabela, porque a compressão novamente resultaria em pouca ou nenhuma economia de espaço.

```
A set of files produced by the **MySQL Enterprise Backup** product, where each **tablespace** is compressed. The compressed files are renamed with a `.ibz` file extension.

Applying **compression** at the start of the backup process helps to avoid storage overhead during the compression process, and to avoid network overhead when transferring the backup files to another server. The process of **applying** the **binary log** takes longer, and requires uncompressing the backup files.

See Also apply, binary log, compression, hot backup, MySQL Enterprise Backup, tablespace.
```

formato de linha compactada: um **formato de linha** que permite a **compressão** de dados e índices para tabelas `InnoDB`. Foi introduzido no **Plugin InnoDB**, disponível como parte do formato de arquivo **Barracuda**. Campos grandes são armazenados longe da página que contém o resto dos dados da linha, como no **formato de linha dinâmico**. Tanto as páginas de índice quanto os campos grandes são compactados, resultando em economia de memória e disco. Dependendo da estrutura dos dados, a redução no uso de memória e disco pode ou não superar o overhead de desempenho da descompactação dos dados conforme eles são usados. Consulte a Seção 14.9, “Compressão de Tabelas e Páginas InnoDB”, para detalhes de uso.

```
For additional information about `InnoDB` `COMPRESSED` row format, see DYNAMIC Row Format.

See Also Barracuda, compression, dynamic row format, row format.
```

tabela compactada: uma tabela para a qual os dados são armazenados em formato compactado. Para o `InnoDB`, é uma tabela criada com `ROW_FORMAT=COMPRESSED`. Consulte a Seção 14.9, “Compressão de Tabela e Página do InnoDB”, para obter mais informações.

```
See Also compressed row format, compression.
```

compressão: uma funcionalidade com benefícios significativos, como ocupar menos espaço em disco, realizar menos operações de E/S e usar menos memória para cache.

```
`InnoDB` supports both table-level and page-level compression. `InnoDB` page compression is also referred to as **transparent page compression**. For more information about `InnoDB` compression, see Section 14.9, “InnoDB Table and Page Compression”.

Another type of compression is the **compressed backup** feature of the **MySQL Enterprise Backup** product.

See Also Barracuda, buffer pool, compressed backup, compressed row format, DML, transparent page compression.
```

falha de compressão: Na verdade, não é um erro, mas sim uma operação cara que pode ocorrer ao usar a **compressão** em combinação com operações **DML**. Isso ocorre quando: as atualizações de uma **página** comprimida ultrapassam a área na página reservada para registrar as modificações; a página é comprimida novamente, com todas as alterações aplicadas aos dados da tabela; os dados recompressados não cabem na página original, exigindo que o MySQL divida os dados em duas novas páginas e comprima cada uma separadamente. Para verificar a frequência dessa condição, execute a consulta na tabela `INFORMATION_SCHEMA.INNODB_CMP` e verifique quanto o valor da coluna `COMPRESS_OPS` excede o valor da coluna `COMPRESS_OPS_OK`. Idealmente, as falhas de compressão não ocorrem com frequência; quando isso acontece, você pode ajustar as opções de configuração `innodb_compression_level`, `innodb_compression_failure_threshold_pct` e `innodb_compression_pad_pct_max`.

```
See Also compression, DML, page.
```

índice concatenado: veja índice composto.

concorrência: A capacidade de múltiplas operações (na terminologia de banco de dados, **transações**) serem executadas simultaneamente, sem interferir umas nas outras. A concorrência também está relacionada ao desempenho, pois, idealmente, a proteção para múltiplas transações simultâneas funciona com um mínimo de sobrecarga de desempenho, utilizando mecanismos eficientes para **bloqueio**.

```
See Also ACID, locking, transaction.
```

arquivo de configuração: O arquivo que contém os valores das **opções** usados pelo MySQL ao iniciar. Tradicionalmente, no Linux e no Unix, esse arquivo é chamado `my.cnf`, e no Windows, é chamado `my.ini`. Você pode definir várias opções relacionadas ao InnoDB na seção `[mysqld]` do arquivo.

```
See Section 4.2.2.2, “Using Option Files” for information about where MySQL searches for configuration files.

When you use the **MySQL Enterprise Backup** product, you typically use two configuration files: one that specifies where the data comes from and how it is structured (which could be the original configuration file for your server), and a stripped-down one containing only a small set of options that specify where the backup data goes and how it is structured. The configuration files used with the **MySQL Enterprise Backup** product must contain certain options that are typically left out of regular configuration files, so you might need to add options to your existing configuration file for use with **MySQL Enterprise Backup**.

See Also my.cnf, MySQL Enterprise Backup, option, option file.
```

conexão: O canal de comunicação entre uma aplicação e um servidor MySQL. O desempenho e a escalabilidade de uma aplicação de banco de dados são influenciados pela rapidez com que uma conexão com o banco de dados pode ser estabelecida, quantos podem ser feitos simultaneamente e por quanto tempo persistem. Os parâmetros como **host**, **port**, e assim por diante, são representados como uma **string de conexão** no **Connector/NET** e como um **DSN** no **Connector/ODBC**. Sistemas de alto tráfego utilizam uma otimização conhecida como **pool de conexões**.

```
See Also connection pool, connection string, Connector/NET, Connector/ODBC, DSN, host, port.
```

pool de conexões: uma área de cache que permite que as **conexões** do banco de dados sejam reutilizadas dentro do mesmo aplicativo ou entre diferentes aplicativos, em vez de configurar e desativar uma nova conexão para cada operação no banco de dados. Essa técnica é comum em servidores de aplicativos **J2EE**. Aplicativos **Java** que utilizam o **Connector/J** podem usar as funcionalidades do pool de conexões do **Tomcat** e outros servidores de aplicativos. A reutilização é transparente para os aplicativos; o aplicativo ainda abre e fecha a conexão normalmente.

```
See Also connection, Connector/J, J2EE, Tomcat.
```

string de conexão: Uma representação dos parâmetros para uma **conexão** com um banco de dados, codificada como uma literal de string para que possa ser usada no código do programa. As partes da string representam parâmetros de conexão, como **host** e **port**. Uma string de conexão contém vários pares chave-valor, separados por pontos e vírgulas. Cada par chave-valor é unido com um sinal de igual. Frequentemente usada com aplicações **Connector/NET**. Consulte Criar uma string de conexão Connector/NET para obter detalhes.

```
See Also connection, Connector/NET, host, port.
```

conector: Os Conectores MySQL fornecem conectividade ao servidor MySQL para programas **de cliente**. Várias linguagens de programação e frameworks têm seus próprios Conectores associados. Em contraste com o acesso de nível mais baixo fornecido por uma **API**.

```
See Also API, client, Connector/C++, Connector/J, Connector/NET, Connector/ODBC.
```

Conector/C++: O Connector/C++ 8.0 pode ser usado para acessar servidores MySQL que implementam um repositório de documentos ou de forma tradicional usando consultas SQL. Ele permite o desenvolvimento de aplicações C++ usando o X DevAPI ou aplicações em C usando o X DevAPI para C. Também permite o desenvolvimento de aplicações C++ que utilizam a API baseada no JDBC do Connector/C++ 1.1. Para mais informações, consulte o Guia do Desenvolvedor do MySQL Connector/C++ 9.5.

```
See Also client, connector, JDBC.
```

Conector/J: Um **driver JDBC** que fornece conectividade para aplicações **cliente** desenvolvidas na linguagem de programação **Java**. Estão disponíveis diferentes versões compatíveis com as especificações JDBC 3.0 e JDBC 4.0. O MySQL Connector/J é um driver do tipo 4 JDBC: uma implementação pura em Java do protocolo MySQL que não depende das **bibliotecas do cliente** do MySQL. Para obter detalhes completos, consulte o Guia do Desenvolvedor do MySQL Connector/J.

```
See Also client, client libraries, connector, Java, JDBC.
```

Connector/NET: Um **conectivo** MySQL para desenvolvedores que escrevem aplicações usando linguagens, tecnologias e frameworks como **C#**, **.NET**, **Mono**, **Visual Studio**, **ASP.net** e **ADO.net**.

```
See Also ADO.NET, ASP.net, connector, C#, Mono, Visual Studio.
```

Conector/ODBC: A família de drivers ODBC do MySQL que oferece acesso a um banco de dados MySQL usando a API padrão da indústria Open Database Connectivity (**ODBC**). Anteriormente chamados de drivers MyODBC. Para obter detalhes completos, consulte o Guia do Desenvolvedor do MySQL Connector/ODBC.

```
See Also connector, ODBC.
```

Conector/PHP: Uma versão das **APIs** `mysql` e `mysqli` para **PHP** otimizada para o sistema operacional Windows.

```
See Also connector, PHP, PHP API.
```

leitura consistente: Uma operação de leitura que utiliza informações de **instantâneo** para apresentar os resultados da consulta com base em um ponto no tempo, independentemente das alterações realizadas por outras transações em execução ao mesmo tempo. Se os dados solicitados tiverem sido alterados por outra transação, os dados originais são reconstruídos com base no conteúdo do **registro de desfazer**. Essa técnica evita alguns dos problemas de **bloqueio** que podem reduzir a **concorrência**, forçando as transações a esperar que outras transações terminem.

```
With **REPEATABLE READ** **isolation level**, the snapshot is based on the time when the first read operation is performed. With **READ COMMITTED** isolation level, the snapshot is reset to the time of each consistent read operation.

Consistent read is the default mode in which `InnoDB` processes `SELECT` statements in **READ COMMITTED** and **REPEATABLE READ** isolation levels. Because a consistent read does not set any locks on the tables it accesses, other sessions are free to modify those tables while a consistent read is being performed on the table.

For technical details about the applicable isolation levels, see Section 14.7.2.3, “Consistent Nonlocking Reads”.

See Also concurrency, isolation level, locking, READ COMMITTED, REPEATABLE READ, snapshot, transaction, undo log.
```

restrição: Um teste automático que pode bloquear as alterações no banco de dados para evitar que os dados se tornem inconsistentes. (Em termos de ciência da computação, um tipo de afirmação relacionada a uma condição invariante.) As restrições são um componente crucial da filosofia `ACID`, para manter a consistência dos dados. As restrições suportadas pelo MySQL incluem `restrições FOREIGN KEY` e `restrições únicas`.

```
See Also ACID, foreign key, unique constraint.
```

contador: Um valor que é incrementado por um tipo específico de operação do `InnoDB`. Útil para medir a ocupação de um servidor, solucionar problemas de desempenho e testar se as alterações (por exemplo, nas configurações ou índices usados por consultas) têm os efeitos desejados em nível baixo. Diferentes tipos de contadores estão disponíveis nas tabelas do `Performance Schema` e nas tabelas do `INFORMATION_SCHEMA`, particularmente `INFORMATION_SCHEMA.INNODB_METRICS`.

```
See Also INFORMATION\_SCHEMA, metrics counter, Performance Schema.
```

Índice de cobertura: Um `índice` que inclui todas as colunas recuperadas por uma consulta. Em vez de usar os valores do índice como ponteiros para encontrar as linhas completas da tabela, a consulta retorna valores da estrutura do índice, economizando o I/O do disco. O `InnoDB` pode aplicar essa técnica de otimização a mais índices do que o MyISAM pode, porque os `índices secundários` do `InnoDB` também incluem as colunas da **chave primária**. O `InnoDB` não pode aplicar essa técnica para consultas em tabelas modificadas por uma transação, até que essa transação termine.

```
Any **column index** or **composite index** could act as a covering index, given the right query. Design your indexes and queries to take advantage of this optimization technique wherever possible.

See Also column index, composite index, index, primary key, secondary index.
```

CPU-bound: Um tipo de `carga de trabalho` onde o principal `bottleneck` são as operações da CPU na memória. Geralmente envolve operações intensivas em leitura, onde todos os resultados podem ser armazenados em cache no `buffer pool`.

```
See Also bottleneck, buffer pool, workload.
```

crash: O MySQL usa o termo “crash” para se referir, de forma geral, a qualquer operação de “shutdown” inesperada em que o servidor não consegue realizar sua limpeza normal. Por exemplo, um crash pode ocorrer devido a uma falha de hardware na máquina do servidor de banco de dados ou no dispositivo de armazenamento; uma falha de energia; uma possível incompatibilidade de dados que faz o servidor MySQL parar; um **shutdown rápido** iniciado pelo DBA; ou muitas outras razões. A robusta e automática **recuperação de crash** para tabelas `InnoDB` garante que os dados sejam consistentes quando o servidor é reiniciado, sem nenhum trabalho extra para o DBA.

```
See Also crash recovery, fast shutdown, InnoDB, shutdown.
```

recuperação após falha: As atividades de limpeza que ocorrem quando o MySQL é reiniciado após uma **falha**. Para as tabelas `InnoDB`, as alterações de transações incompletas são regravadas usando dados do **log de reescrita**. As alterações que foram **comprometidas** antes da falha, mas ainda não escritas nos **arquivos de dados**, são reconstruídas a partir do **buffer de dupla escrita**. Quando o banco de dados é desligado normalmente, esse tipo de atividade é realizado durante o desligamento pela operação **purga**.

```
During normal operation, committed data can be stored in the **change buffer** for a period of time before being written to the data files. There is always a tradeoff between keeping the data files up-to-date, which introduces performance overhead during normal operation, and buffering the data, which can make shutdown and crash recovery take longer.

See Also change buffer, commit, crash, data files, doublewrite buffer, InnoDB, purge, redo log.
```

CRUD: Abreviação de “criar, ler, atualizar, excluir”, uma sequência comum de operações em aplicações de banco de dados. Muitas vezes denota uma classe de aplicações com uso relativamente simples do banco de dados (instruções básicas de `DDL`, `DML` e `consulta` em `SQL`) que podem ser implementadas rapidamente em qualquer linguagem.

```
See Also DDL, DML, query, SQL.
```

cursor: Uma estrutura de dados interna do MySQL que representa o conjunto de resultados de uma instrução SQL. Muitas vezes usada com `instruções preparadas` e `SQL dinâmico`. Funciona como um iterador em outros linguagens de alto nível, produzindo cada valor do conjunto de resultados conforme solicitado.

```
Although SQL usually handles the processing of cursors for you, you might delve into the inner workings when dealing with performance-critical code.

See Also dynamic SQL, prepared statement, query.
```

### D

linguagem de definição de dados: Veja DDL.

dicionário de dados: Metadados que acompanham objetos relacionados ao InnoDB, como **tabelas**, **índice** e **colunas** de tabelas. Esses metadados estão fisicamente localizados no **espaço de tabela do sistema InnoDB**. Por razões históricas, eles se sobrepõem, em certa medida, às informações armazenadas nos arquivos `.frm`.

```
Because the **MySQL Enterprise Backup** product always backs up the system tablespace, all backups include the contents of the data dictionary.

See Also column, file-per-table, .frm file, index, MySQL Enterprise Backup, system tablespace, table.
```

diretório de dados: O diretório sob o qual cada **instância** do MySQL mantém os **arquivos de dados** para o `InnoDB` e os diretórios que representam as bases de dados individuais. Controlado pela opção de configuração `datadir`.

```
See Also data files, instance.
```

arquivos de dados: os arquivos que contêm fisicamente os dados da **tabela** e do **índice**.

```
The `InnoDB` **system tablespace**, which holds the `InnoDB` **data dictionary** and is capable of holding data for multiple `InnoDB` tables, is represented by one or more `.ibdata` data files.

File-per-table tablespaces, which hold data for a single `InnoDB` table, are represented by a `.ibd` data file.

General tablespaces (introduced in MySQL 5.7.6), which can hold data for multiple `InnoDB` tables, are also represented by a `.ibd` data file.

See Also data dictionary, file-per-table, general tablespace, .ibd file, ibdata file, index, system tablespace, table, tablespace.
```

linguagem de manipulação de dados: Veja DML.

armazenamento de dados: Um sistema ou aplicativo de banco de dados que executa principalmente grandes **consultas**. Os dados de leitura apenas ou quase exclusivamente podem ser organizados em forma **denormalizada** para eficiência nas consultas. Pode se beneficiar das otimizações para **transações de leitura apenas** no MySQL 5.6 e versões posteriores. Contrasta com **OLTP**.

```
See Also denormalized, OLTP, query, read-only transaction.
```

banco de dados: Dentro do diretório de dados do MySQL, cada banco de dados é representado por um diretório separado. O **espaço de sistema InnoDB**, que pode armazenar dados de tabelas de vários bancos de dados dentro de uma **instância** do MySQL, é mantido em **arquivos de dados** que residem fora dos diretórios de banco de dados individuais. Quando o modo **arquivo por tabela** é habilitado, os **arquivos .ibd** que representam as tabelas individuais do InnoDB são armazenados dentro dos diretórios do banco de dados, a menos que sejam criados em outro lugar usando a cláusula `DIRETÓRIO DE DADOS`. Os espaços de tabela gerais, introduzidos no MySQL 5.7.6, também armazenam dados de tabelas em **arquivos .ibd**. Ao contrário dos **arquivos .ibd** de arquivo por tabela, os **arquivos .ibd** de espaço de tabela geral podem armazenar dados de tabelas de vários bancos de dados dentro de uma **instância** do MySQL e podem ser atribuídos a diretórios relativos ou independentes do diretório de dados do MySQL.

```
For long-time MySQL users, a database is a familiar notion. Users coming from an Oracle Database background may find that the MySQL meaning of a database is closer to what Oracle Database calls a **schema**.

See Also data files, file-per-table, .ibd file, instance, schema, system tablespace.
```

DCL: Linguagem de controle de dados, um conjunto de instruções **SQL** para gerenciar privilégios. No MySQL, consiste nas instruções `GRANT` e `REVOKE`. Contrasta com **DDL** e **DML**.

```
See Also DDL, DML, SQL.
```

Fornecedor DDEX: Uma funcionalidade que permite usar as ferramentas de design de dados no **Visual Studio** para manipular o esquema e os objetos dentro de um banco de dados MySQL. Para aplicações MySQL que utilizam o **Connector/NET**, o Plugin MySQL do Visual Studio atua como um fornecedor DDEX com o MySQL 5.0 e versões posteriores.

```
See Also Visual Studio.
```

DDL: Linguagem de definição de dados, um conjunto de instruções **SQL** para manipular o próprio banco de dados, em vez das linhas individuais das tabelas. Inclui todas as formas das instruções `CREATE`, `ALTER` e `DROP`. Também inclui a instrução `TRUNCATE`, porque funciona de maneira diferente de uma instrução `DELETE FROM table_name`, embora o efeito final seja semelhante.

```
DDL statements automatically **commit** the current **transaction**; they cannot be **rolled back**.

The `InnoDB` online DDL feature enhances performance for `CREATE INDEX`, `DROP INDEX`, and many types of `ALTER TABLE` operations. See Section 14.13, “InnoDB and Online DDL” for more information. Also, the `InnoDB` file-per-table setting can affect the behavior of `DROP TABLE` and `TRUNCATE TABLE` operations.

Contrast with **DML** and **DCL**.

See Also commit, DCL, DML, file-per-table, rollback, SQL, transaction.
```

impasse: Uma situação em que diferentes **transações** não conseguem prosseguir, porque cada uma detém um **bloqueio** que a outra precisa. Como ambas as transações estão esperando que um recurso esteja disponível, nenhuma delas libera os bloqueios que detém.

```
A deadlock can occur when the transactions lock rows in multiple tables (through statements such as `UPDATE` or `SELECT ... FOR UPDATE`), but in the opposite order. A deadlock can also occur when such statements lock ranges of index records and **gaps**, with each transaction acquiring some locks but not others due to a timing issue.

For background information on how deadlocks are automatically detected and handled, see Section 14.7.5.2, “Deadlock Detection”. For tips on avoiding and recovering from deadlock conditions, see Section 14.7.5.3, “How to Minimize and Handle Deadlocks”.

See Also gap, lock, transaction.
```

Detecção de ponto morto: Um mecanismo que detecta automaticamente quando ocorre um **ponto morto** e **reverte automaticamente** uma das **transações** envolvidas (a **vítima**). A detecção de ponto morto pode ser desativada usando a opção de configuração `innodb_deadlock_detect`.

```
See Also deadlock, rollback, transaction, victim.
```

Quando o `InnoDB` processa uma instrução `DELETE`, as linhas são marcadas imediatamente para exclusão e não são mais retornadas por consultas. O armazenamento é recuperado em algum momento mais tarde, durante a coleta periódica de lixo conhecida como operação de **purga**. Para remover grandes quantidades de dados, as operações relacionadas têm suas próprias características de desempenho: **TRUNCATE** e **DROP**.

```
See Also drop, purge, truncate.
```

excluir o buffer: A técnica de armazenar as alterações nas páginas de índice secundário, resultantes das operações `DELETE`, no **buffer de alterações** em vez de escrever as alterações imediatamente, para que as escritas físicas possam ser realizadas para minimizar o I/O aleatório. (Como as operações de exclusão são um processo de duas etapas, essa operação armazena a escrita que normalmente marca um registro de índice para exclusão.) É um dos tipos de **buffering de alterações**: os outros são **buffering de inserção** e **buffering de purga**.

```
See Also change buffer, change buffering, insert buffer, insert buffering, purge buffering.
```

denormalizado: Uma estratégia de armazenamento de dados que duplica os dados em diferentes tabelas, em vez de vincular as tabelas com **chaves estrangeiras** e consultas de **junção**. Tipicamente usado em aplicações de **data warehouse**, onde os dados não são atualizados após o carregamento. Nessas aplicações, o desempenho das consultas é mais importante do que tornar simples a manutenção de dados consistentes durante as atualizações. Contrasta com **normalizado**.

```
See Also data warehouse, foreign key, join, normalized.
```

Índice descendente: Um tipo de **índice** disponível em alguns sistemas de banco de dados, onde o armazenamento do índice é otimizado para processar cláusulas `ORDER BY coluna DESC`. Atualmente, embora o MySQL permita a palavra-chave `DESC` na instrução `CREATE TABLE`, ele não utiliza um layout de armazenamento especial para o índice resultante.

```
See Also index.
```

página suja: Uma **página** no **pool de buffer** do `InnoDB` que foi atualizada na memória, onde as alterações ainda não foram escritas (**flushadas**) nos **arquivos de dados**. O oposto de uma **página limpa**.

```
See Also buffer pool, clean page, data files, flush, page.
```

leitura suja: Uma operação que recupera dados não confiáveis, dados que foram atualizados por outra transação, mas ainda não foram **confirmados**. Isso só é possível com o **nível de isolamento** conhecido como **leitura não confirmada**.

```
This kind of operation does not adhere to the **ACID** principle of database design. It is considered very risky, because the data could be **rolled back**, or updated further before being committed; then, the transaction doing the dirty read would be using data that was never confirmed as accurate.

Its opposite is **consistent read**, where `InnoDB` ensures that a transaction does not read information updated by another transaction, even if the other transaction commits in the meantime.

See Also ACID, commit, consistent read, isolation level, READ UNCOMMITTED, rollback.
```

baseada em disco: Um tipo de banco de dados que organiza principalmente os dados em armazenamento em disco (discos rígidos ou equivalentes). Os dados são trazidos para frente e para trás entre o disco e a memória para serem operados. É o oposto de um **banco de dados em memória**. Embora o `InnoDB` seja baseado em disco, ele também contém recursos como o **pool de buffers**, múltiplas instâncias do pool de buffers e o **índice de hash adaptativo** que permitem que certos tipos de cargas de trabalho trabalhem principalmente a partir da memória.

```
See Also adaptive hash index, buffer pool, in-memory database.
```

bound a disco: Um tipo de **carga de trabalho** em que o principal **bottleneck** é o I/O de disco. (Também conhecido como **bound a I/O**.) Geralmente envolve escritas frequentes no disco ou leituras aleatórias de mais dados do que podem caber no **pool de buffer**.

```
See Also bottleneck, buffer pool, workload.
```

DML: Linguagem de manipulação de dados, um conjunto de instruções **SQL** para realizar operações de `INSERT`, `UPDATE` e `DELETE`. A instrução `SELECT` é, por vezes, considerada uma instrução DML, porque a forma `SELECT ... FOR UPDATE` está sujeita às mesmas considerações de **bloqueio** que as instruções `INSERT`, `UPDATE` e `DELETE`.

```
DML statements for an `InnoDB` table operate in the context of a **transaction**, so their effects can be **committed** or **rolled back** as a single unit.

Contrast with **DDL** and **DCL**.

See Also commit, DCL, DDL, locking, rollback, SQL, transaction.
```

ID do documento: Na funcionalidade de **pesquisa full-text** do `InnoDB`, uma coluna especial na tabela que contém o **índice FULLTEXT**, para identificar de forma única o documento associado a cada valor de **ilist**. Seu nome é `FTS_DOC_ID` (deve ser maiúsculo). A própria coluna deve ser do tipo `BIGINT UNSIGNED NOT NULL`, com um índice único chamado `FTS_DOC_ID_INDEX`. De preferência, você define essa coluna ao criar a tabela. Se o `InnoDB` precisar adicionar a coluna à tabela enquanto cria um **índice FULLTEXT**, a operação de indexação é consideravelmente mais cara.

```
See Also full-text search, FULLTEXT index, ilist.
```

Buffer de escrita dupla: o `InnoDB` utiliza uma técnica de esvaziamento de arquivo chamada escrita dupla. Antes de escrever **páginas** nos **arquivos de dados**, o `InnoDB` escreve-as primeiro em uma área de armazenamento chamada buffer de escrita dupla. Somente após a escrita e o esvaziamento para o buffer de escrita dupla terem sido concluídos, o `InnoDB` escreve as páginas em suas posições corretas no arquivo de dados. Se houver um crash do sistema operacional, do subsistema de armazenamento ou do processo **mysqld** durante a escrita de uma página, o `InnoDB` pode encontrar uma boa cópia da página do buffer de escrita dupla durante a **recuperação após o crash**.

```
Although data is always written twice, the doublewrite buffer does not require twice as much I/O overhead or twice as many I/O operations. Data is written to the buffer itself as a large sequential chunk, with a single `fsync()` call to the operating system.

See Also crash recovery, data files, page, purge.
```

drop: Um tipo de operação **DDL** que remove um objeto do esquema, por meio de uma declaração como `DROP TABLE` ou `DROP INDEX`. Internamente, é mapeada para uma declaração `ALTER TABLE`. Do ponto de vista do **InnoDB**, as considerações de desempenho dessas operações envolvem o tempo em que o **dicionário de dados** é bloqueado para garantir que todos os objetos interrelacionados sejam atualizados e o tempo para atualizar estruturas de memória, como o **pool de buffers**. Para uma **tabela**, a operação de drop tem características um pouco diferentes da operação de **truncate** (`TRUNCATE TABLE`).

```
See Also buffer pool, data dictionary, DDL, table, truncate.
```

DSN: Abreviação de "Database Source Name" (Nome da Fonte do Banco de Dados). É o codificação para as informações de **conexão** dentro do **Connector/ODBC**. Veja Configurando um DSN do Connector/ODBC no Windows para obter detalhes completos. É o equivalente à **string de conexão** usada pelo **Connector/NET**.

```
See Also connection, connection string, Connector/NET, Connector/ODBC.
```

cursor dinâmico: Um tipo de **cursor** suportado pelo **ODBC** que pode recuperar novos e alterados resultados quando as linhas são lidas novamente. Se as mudanças são visíveis ou não para o cursor e o quão rapidamente isso acontece depende do tipo de tabela envolvida (transacional ou não transacional) e do nível de isolamento para tabelas transacionais. O suporte para cursors dinâmicos deve ser habilitado explicitamente.

```
See Also cursor, ODBC.
```

formato de linha dinâmico: um formato de linha introduzido no plugin `InnoDB`, disponível como parte do **formato de arquivo Barracuda**. Como os valores de coluna de comprimento variável são armazenados fora da página que contém os dados da linha, é muito eficiente para linhas que incluem grandes objetos. Como os campos grandes geralmente não são acessados para avaliar as condições da consulta, eles não são trazidos para o **pool de buffer** com tanta frequência, resultando em menos operações de E/S e melhor utilização da memória cache.

```
As of MySQL 5.7.9, the default row format is defined by `innodb_default_row_format`, which has a default value of `DYNAMIC`.

For additional information about `InnoDB` `DYNAMIC` row format, see DYNAMIC Row Format.

See Also Barracuda, buffer pool, file format, row format.
```

SQL dinâmico: uma funcionalidade que permite criar e executar **instruções preparadas** usando métodos mais robustos, seguros e eficientes para substituir os valores dos parâmetros do que a técnica ingênua de concatenar as partes da instrução em uma variável de string.

```
See Also prepared statement.
```

declaração dinâmica: Uma **declaração preparada** criada e executada por meio de **SQL dinâmico**.

```
See Also dynamic SQL, prepared statement.
```

### E

adotante precoce: uma fase semelhante à **beta**, quando um produto de software é avaliado em termos de desempenho, funcionalidade e compatibilidade em um ambiente não crítico para a missão.

```
See Also beta.
```

Eiffel: Uma linguagem de programação que inclui muitas características orientada a objetos. Alguns de seus conceitos são familiares aos desenvolvedores de **Java** e **C#**. Para a API de código aberto Eiffel para MySQL, consulte a Seção 27.13, “MySQL Eiffel Wrapper”.

```
See Also API, C#, Java.
```

incorporado: A biblioteca do servidor MySQL incorporada (**libmysqld**) permite executar um servidor MySQL completo dentro de uma aplicação **cliente**. Os principais benefícios são a velocidade aumentada e uma gestão mais simples para aplicações incorporadas.

```
See Also client, libmysqld.
```

registro de erros: um tipo de **log** que mostra informações sobre o início do MySQL e erros críticos durante o runtime e informações sobre **quebra**. Para detalhes, consulte a Seção 5.4.2, “O Registro de Erros”.

```
See Also crash, log.
```

expulsão: O processo de remover um item de um cache ou de outra área de armazenamento temporário, como o **pool de buffers** do **InnoDB**. Muitas vezes, mas nem sempre, utiliza o algoritmo **LRU** para determinar qual item deve ser removido. Quando uma **página suja** é expulsa, seus conteúdos são **limpos** no disco, e quaisquer páginas **vizinhas sujas** também podem ser limpas.

```
See Also buffer pool, dirty page, flush, LRU, neighbor page.
```

Interceptador de exceções: Um tipo de **interceptador** para rastrear, depurar ou ampliar erros SQL encontrados por um aplicativo de banco de dados. Por exemplo, o código do interceptor pode emitir uma declaração `SHOW WARNINGS` para recuperar informações adicionais e adicionar texto descritivo ou até mesmo alterar o tipo da exceção retornada para o aplicativo. Como o código do interceptor é chamado apenas quando os comandos SQL retornam erros, ele não impõe nenhuma penalidade de desempenho ao aplicativo durante a operação normal (sem erros).

```
In **Java** applications using **Connector/J**, setting up this type of interceptor involves implementing the `com.mysql.jdbc.ExceptionInterceptor` interface, and adding a `exceptionInterceptors` property to the **connection string**.

In **Visual Studio** applications using **Connector/NET**, setting up this type of interceptor involves defining a class that inherits from the `BaseExceptionInterceptor` class and specifying that class name as part of the connection string.

See Also Connector/J, Connector/NET, interceptor, Java, Visual Studio.
```

bloqueio exclusivo: Um tipo de **bloqueio** que impede que qualquer outra **transação** bloqueie a mesma linha. Dependendo do nível de **isolamento** da transação, esse tipo de bloqueio pode bloquear outras transações de escrever na mesma linha ou também pode bloquear outras transações de ler a mesma linha. O nível de isolamento padrão do **InnoDB**, **LEIA REPETÍVEL**, permite maior **concorrência** ao permitir que as transações leiam linhas que têm bloqueios exclusivos, uma técnica conhecida como **leitura consistente**.

```
See Also concurrency, consistent read, isolation level, lock, REPEATABLE READ, shared lock, transaction.
```

extensão: Um grupo de **páginas** dentro de um **espaço de tabelas**. Para o tamanho padrão de **página** de 16KB, uma extensão contém 64 páginas. No MySQL 5.6, o tamanho da página para uma instância `InnoDB` pode ser de 4KB, 8KB ou 16KB, controlado pela opção de configuração `innodb_page_size`. Para tamanhos de páginas de 4KB, 8KB e 16KB, o tamanho da extensão é sempre de 1MB (ou 1048576 bytes).

```
Support for 32KB and 64KB `InnoDB` page sizes was added in MySQL 5.7.6. For a 32KB page size, the extent size is 2MB. For a 64KB page size, the extent size is 4MB.

`InnoDB` features such as **segments**, **read-ahead** requests and the **doublewrite buffer** use I/O operations that read, write, allocate, or free data one extent at a time.

See Also doublewrite buffer, page, page size, read-ahead, segment, tablespace.
```

### F

.frm: Um arquivo que contém os metadados, como a definição da tabela, de uma tabela do MySQL.

```
For backups, you must always keep the full set of `.frm` files along with the backup data to be able to restore tables that are altered or dropped after the backup.

Although each `InnoDB` table has a `.frm` file, `InnoDB` maintains its own table metadata in the **system tablespace**.

`.frm` files are backed up by the **MySQL Enterprise Backup** product. These files must not be modified by an `ALTER TABLE` operation while the backup is taking place, which is why backups that include non-`InnoDB` tables perform a `FLUSH TABLES WITH READ LOCK` operation to freeze such activity while backing up `.frm` files. Restoring a backup can result in `.frm` files being created, changed, or removed to match the state of the database at the time of the backup.

See Also data dictionary, MySQL Enterprise Backup, system tablespace.
```

failover: A capacidade de alternar automaticamente para um servidor de espera em caso de falha. No contexto do MySQL, o failover envolve um servidor de banco de dados de espera. Muitas vezes suportado dentro de ambientes **J2EE** pelo servidor ou framework da aplicação.

```
See Also Connector/J, J2EE.
```

Criação rápida de índices: Uma funcionalidade introduzida pela primeira vez no Plugin InnoDB, agora parte do MySQL a partir da versão 5.5 e superior, que acelera a criação de **índices secundários** do **InnoDB** evitando a necessidade de reescrever completamente a tabela associada. O aumento de velocidade também se aplica à remoção de índices secundários.

```
Because index maintenance can add performance overhead to many data transfer operations, consider doing operations such as `ALTER TABLE ... ENGINE=INNODB` or `INSERT INTO ... SELECT * FROM ...` without any secondary indexes in place, and creating the indexes afterward.

In MySQL 5.6, this feature becomes more general. You can read and write to tables while an index is being created, and many more kinds of `ALTER TABLE` operations can be performed without copying the table, without blocking **DML** operations, or both. Thus in MySQL 5.6 and higher, this set of features is referred to as **online DDL** rather than Fast Index Creation.

For related information, see Section 14.13, “InnoDB and Online DDL”.

See Also DML, index, online DDL, secondary index.
```

desligamento rápido: O procedimento de **desligamento** padrão para o `InnoDB`, baseado na configuração `innodb_fast_shutdown=1`. Para economizar tempo, certas operações de **varredura** são ignoradas. Esse tipo de desligamento é seguro durante o uso normal, porque as operações de varredura são realizadas durante a próxima inicialização, usando o mesmo mecanismo que na **recuperação após falha**. Em casos em que o banco de dados está sendo desligado para uma atualização ou downgrade, faça um **desligamento lento** em vez disso para garantir que todas as alterações relevantes sejam aplicadas aos **arquivos de dados** durante o desligamento.

```
See Also crash recovery, data files, flush, shutdown, slow shutdown.
```

formato de arquivo: O formato de arquivo para as tabelas `InnoDB`, habilitado usando a opção de configuração `innodb_file_format`. Os formatos de arquivo suportados são **Antelope** e **Barracuda**. O Antelope é o formato de arquivo original do `InnoDB` e suporta os formatos de linha **REDUNDANT** e **COMPACT**. O Barracuda é o novo formato de arquivo do `InnoDB` e suporta os formatos de linha **COMPRESSED** e **DYNAMIC**.

```
See Also Antelope, Barracuda, file-per-table, .ibd file, ibdata file, row format.
```

arquivo por tabela: um nome genérico para a configuração controlada pela opção `innodb_file_per_table`, que é uma opção de configuração importante que afeta aspectos do armazenamento de arquivos do `InnoDB`, disponibilidade de recursos e características de E/S. A partir do MySQL 5.6.7, `innodb_file_per_table` está habilitado por padrão.

```
With the `innodb_file_per_table` option enabled, you can create a table in its own **.ibd file** rather than in the shared **ibdata files** of the **system tablespace**. When table data is stored in an individual **.ibd file**, you have more flexibility to choose **row formats** required for features such as data **compression**. The `TRUNCATE TABLE` operation is also faster, and reclaimed space can be used by the operating system rather than remaining reserved for `InnoDB`.

The **MySQL Enterprise Backup** product is more flexible for tables that are in their own files. For example, tables can be excluded from a backup, but only if they are in separate files. Thus, this setting is suitable for tables that are backed up less frequently or on a different schedule.

See Also compressed row format, compression, file format, .ibd file, ibdata file, innodb\_file\_per\_table, MySQL Enterprise Backup, row format, system tablespace.
```

fator de preenchimento: Em um **índice InnoDB**, a proporção de uma **página** que é ocupada pelos dados do índice antes de a página ser dividida. O espaço não utilizado quando os dados do índice são divididos pela primeira vez entre páginas permite que as linhas sejam atualizadas com valores de strings mais longos sem exigir operações caras de manutenção do índice. Se o fator de preenchimento for muito baixo, o índice consome mais espaço do que o necessário, causando sobrecarga de E/S extra ao ler o índice. Se o fator de preenchimento for muito alto, qualquer atualização que aumente o comprimento dos valores das colunas pode causar sobrecarga de E/S extra para a manutenção do índice. Consulte a Seção 14.6.2.2, “A Estrutura Física de um Índex InnoDB”, para obter mais informações.

```
See Also index, page.
```

Formato de linha fixo: Este formato de linha é usado pelo mecanismo de armazenamento `MyISAM`, e não pelo `InnoDB`. Se você criar uma tabela `InnoDB` com a opção `ROW_FORMAT=FIXED` no MySQL 5.7.6 ou versões anteriores, o `InnoDB` usa o **formato de linha compactado** em vez disso, embora o valor `FIXED` ainda possa aparecer em saídas como relatórios do `SHOW TABLE STATUS`. A partir do MySQL 5.7.7, o `InnoDB` retorna um erro se `ROW_FORMAT=FIXED` for especificado.

```
See Also compact row format, row format.
```

flush: Para escrever as alterações nos arquivos do banco de dados, que haviam sido armazenados em uma área de memória ou em uma área de armazenamento temporária em disco. As estruturas de armazenamento do **InnoDB** que são periodicamente descarregadas incluem o **log de refazer**, o **log de desfazer** e o **pool de buffers**.

```
Flushing can happen because a memory area becomes full and the system needs to free some space, because a **commit** operation means the changes from a transaction can be finalized, or because a **slow shutdown** operation means that all outstanding work should be finalized. When it is not critical to flush all the buffered data at once, `InnoDB` can use a technique called **fuzzy checkpointing** to flush small batches of pages to spread out the I/O overhead.

See Also buffer pool, commit, fuzzy checkpointing, redo log, slow shutdown, undo log.
```

lista de limpeza: uma estrutura de dados interna do `InnoDB` que rastreia **páginas sujas** no **pool de buffer**: ou seja, **páginas** que foram alteradas e precisam ser escritas de volta no disco. Essa estrutura de dados é atualizada frequentemente pelas **mini-transações** internas do `InnoDB`, e, portanto, é protegida por seu próprio **mutex** para permitir o acesso concorrente ao pool de buffer.

```
See Also buffer pool, dirty page, LRU, mini-transaction, mutex, page, page cleaner.
```

chave estrangeira: um tipo de relação de ponteiro, entre linhas em tabelas separadas do `InnoDB`. A relação de chave estrangeira é definida em uma coluna tanto na **tabela pai** quanto na **tabela filho**.

```
In addition to enabling fast lookup of related information, foreign keys help to enforce **referential integrity**, by preventing any of these pointers from becoming invalid as data is inserted, updated, and deleted. This enforcement mechanism is a type of **constraint**. A row that points to another table cannot be inserted if the associated foreign key value does not exist in the other table. If a row is deleted or its foreign key value changed, and rows in another table point to that foreign key value, the foreign key can be set up to prevent the deletion, cause the corresponding column values in the other table to become **null**, or automatically delete the corresponding rows in the other table.

One of the stages in designing a **normalized** database is to identify data that is duplicated, separate that data into a new table, and set up a foreign key relationship so that the multiple tables can be queried like a single table, using a **join** operation.

See Also child table, FOREIGN KEY constraint, join, normalized, NULL, parent table, referential integrity, relational.
```

Restrição de **chave estrangeira**: O tipo de **restrição** que mantém a consistência do banco de dados por meio de uma relação de **chave estrangeira**. Como outros tipos de restrições, ela pode impedir que dados sejam inseridos ou atualizados se os dados ficarem inconsistentes; nesse caso, a inconsistência que está sendo impedida é entre dados em várias tabelas. Alternativamente, quando uma operação de **DML** é realizada, as restrições de **chave estrangeira** podem fazer com que os dados em **linhas filhas** sejam excluídos, alterados para valores diferentes ou definidos como **nulos**, com base na opção **ON CASCADE** especificada ao criar a chave estrangeira.

```
See Also child table, constraint, DML, foreign key, NULL.
```

FTS: Na maioria dos contextos, um acrônimo para **pesquisa de texto completo**. Às vezes, em discussões sobre desempenho, um acrônimo para **pesquisa completa da tabela**.

```
See Also full table scan, full-text search.
```

backup completo: Um **backup** que inclui todas as **tarefas** em cada **banco de dados** MySQL e todos os bancos de dados em uma **instância** MySQL. Contrasta com o **backup parcial**.

```
See Also backup, database, instance, partial backup, table.
```

varredura completa da tabela: uma operação que exige a leitura de todo o conteúdo de uma tabela, em vez de apenas partes selecionadas usando um **índice**. Normalmente realizada com tabelas de busca pequenas ou em situações de data warehousing com tabelas grandes, onde todos os dados disponíveis são agregados e analisados. A frequência com que essas operações ocorrem e o tamanho das tabelas em relação à memória disponível têm implicações para os algoritmos usados na otimização de consultas e na gestão do **pool de buffers**.

```
The purpose of indexes is to allow lookups for specific values or ranges of values within a large table, thus avoiding full table scans when practical.

See Also buffer pool, index.
```

pesquisa de texto completo: O recurso do MySQL para encontrar palavras, frases, combinações lógicas de palavras, e assim por diante, nos dados da tabela, de uma maneira mais rápida, mais conveniente e mais flexível do que usar o operador `LIKE` do SQL ou escrever seu próprio algoritmo de busca de nível de aplicação. Ele utiliza a função SQL `MATCH()` e **índice FULLTEXT**.

```
See Also FULLTEXT index.
```

ÍNDICE FULLTEXT: O tipo especial de **índice** que contém o **índice de pesquisa** no mecanismo de **pesquisa full-text** do MySQL. Representa as palavras dos valores de uma coluna, omitindo quaisquer que sejam especificadas como **palavras-chave de parada**. Originalmente, estava disponível apenas para tabelas `MyISAM`. A partir do MySQL 5.6.4, também está disponível para tabelas **InnoDB**.

```
See Also full-text search, index, InnoDB, search index, stopword.
```

Checkpointing difuso: uma técnica que **limpa** pequenos lotes de **páginas sujas** do **pool de buffer**, em vez de limpar todas as páginas sujas de uma vez, o que interromperia o processamento do banco de dados.

```
See Also buffer pool, dirty page, flush.
```

### G

GA: “Geralmente disponível”, é o estágio em que um produto de software sai da fase **beta** e está disponível para venda, suporte oficial e uso em produção.

```
See Also beta.
```

GAC: Abreviação de “Cache da Assembleia Global”. Uma área central para armazenar bibliotecas (**assemblies**) em um sistema **.NET**. Fisicamente consiste em pastas aninhadas, tratadas como uma única pasta virtual pelo **.NET** CLR.

```
See Also .NET, assembly.
```

lacuna: Um local na estrutura de dados de um **índice** do `InnoDB` onde novos valores poderiam ser inseridos. Quando você bloqueia um conjunto de linhas com uma instrução como `SELECT ... FOR UPDATE`, o `InnoDB` pode criar bloqueios que se aplicam às lacunas, bem como aos valores reais no índice. Por exemplo, se você selecionar todos os valores maiores que 10 para atualização, um bloqueio de lacuna impede que outra transação insira um novo valor maior que 10. O **registro máximo** e o **registro mínimo** representam as lacunas que contêm todos os valores maiores ou menores que todos os valores atuais do índice.

```
See Also concurrency, gap lock, index, infimum record, isolation level, supremum record.
```

bloqueio de lacuna: Um **bloqueio** em uma **lacuna** entre os registros do índice, ou um bloqueio na lacuna antes do primeiro ou após o último registro do índice. Por exemplo, `SELECT c1 FROM t WHERE c1 BETWEEN 10 e 20 FOR UPDATE;` impede que outras transações insiram um valor de 15 na coluna `t.c1`, independentemente de já existir algum valor desse tipo na coluna, porque as lacunas entre todos os valores existentes na faixa estão bloqueadas. Compare com **bloqueio de registro** e **bloqueio de próxima chave**.

```
Gap locks are part of the tradeoff between performance and **concurrency**, and are used in some transaction **isolation levels** and not others.

See Also gap, infimum record, lock, next-key lock, record lock, supremum record.
```

log geral: Veja o log de consultas gerais.

registro de consultas gerais: um tipo de **log** usado para diagnóstico e solução de problemas de instruções SQL processadas pelo servidor MySQL. Pode ser armazenado em um arquivo ou em uma tabela de banco de dados. Você deve habilitar essa funcionalidade através da opção de configuração `general_log` para usá-la. Você pode desativá-la para uma conexão específica através da opção de configuração `sql_log_off`.

```
Records a broader range of queries than the **slow query log**. Unlike the **binary log**, which is used for replication, the general query log contains `SELECT` statements and does not maintain strict ordering. For more information, see Section 5.4.3, “The General Query Log”.

See Also binary log, log, slow query log.
```

espaço de tabelas geral: Um espaço de tabelas compartilhado `InnoDB` criado usando a sintaxe `CREATE TABLESPACE`. Os espaços de tabelas gerais podem ser criados fora do diretório de dados do MySQL, podem armazenar múltiplas **tabelas** e suportar tabelas de todos os formatos de linhas. Os espaços de tabelas gerais foram introduzidos no MySQL 5.7.6.

```
Tables are added to a general tablespace using `CREATE TABLE tbl_name ... TABLESPACE [=] tablespace_name` or `ALTER TABLE tbl_name TABLESPACE [=] tablespace_name` syntax.

Contrast with **system tablespace** and **file-per-table** tablespace.

For more information, see Section 14.6.3.3, “General Tablespaces”.

See Also file-per-table, system tablespace, table, tablespace.
```

Coluna gerada: Uma coluna cujos valores são calculados a partir de uma expressão incluída na definição da coluna. Uma coluna gerada pode ser **virtual** ou **armazenada**.

```
See Also base column, stored generated column, virtual generated column.
```

coluna gerada armazenada: Veja coluna gerada armazenada.

gerado coluna virtual: Veja a coluna virtual gerada.

Glassfish: Veja também J2EE.

transação global: Um tipo de **transação** envolvida em operações **XA**. Ela consiste em várias ações que são transacionais por si mesmas, mas que todas devem ser concluídas com sucesso como um grupo ou todas devem ser revertidas como um grupo. Em essência, isso estende as propriedades **ACID** “para cima” para que múltiplas transações ACID possam ser executadas em conjunto como componentes de uma operação global que também possui propriedades ACID.

```
See Also ACID, transaction, XA.
```

commit de grupo: Uma otimização do InnoDB que realiza algumas operações de E/S de baixo nível (escrita no log) uma vez para um conjunto de operações de **commit**, em vez de limpar e sincronizar separadamente para cada commit.

```
See Also binary log, commit.
```

GUID: Abreviação de “identificador globalmente único”, um valor de ID que pode ser usado para associar dados em diferentes bancos de dados, idiomas, sistemas operacionais, etc. (Como alternativa ao uso de inteiros sequenciais, onde os mesmos valores poderiam aparecer em diferentes tabelas, bancos de dados, etc., referindo-se a dados diferentes.) Versões mais antigas do MySQL o representavam como `BINARY(16)`. Atualmente, é representado como `CHAR(36)`. O MySQL tem uma função `UUID()` que retorna valores GUID em formato de caracteres e uma função `UUID_SHORT()` que retorna valores GUID em formato de inteiros. Como os valores sucessivos do GUID não estão necessariamente em ordem de classificação ascendente, não é um valor eficiente para ser usado como chave primária para grandes tabelas InnoDB.

### H

índice hash: um tipo de **índice** destinado a consultas que utilizam operadores de igualdade, em vez de operadores de intervalo, como maior que ou `BETWEEN`. Ele está disponível para tabelas `MEMORY`. Embora os índices hash sejam o padrão para tabelas `MEMORY` por razões históricas, esse mecanismo de armazenamento também suporta **índice B-tree**, que é frequentemente uma escolha melhor para consultas de uso geral.

```
MySQL includes a variant of this index type, the **adaptive hash index**, that is constructed automatically for `InnoDB` tables if needed based on runtime conditions.

See Also adaptive hash index, B-tree, index, InnoDB.
```

HDD: Abreviação de “disco rígido”. Refere-se a mídias de armazenamento que utilizam pratos giratórios, geralmente quando se compara e contrasta com **SSD**. Suas características de desempenho podem influenciar o desempenho de uma **carga de trabalho baseada em disco**.

```
See Also disk-based, SSD.
```

batida cardíaca: Uma mensagem periódica enviada para indicar que um sistema está funcionando corretamente. Em um contexto de **replicação**, se a **fonte** parar de enviar essas mensagens, uma das **replicas** pode assumir seu lugar. Técnicas semelhantes podem ser usadas entre os servidores em um ambiente de cluster, para confirmar que todos estão operando corretamente.

```
See Also replication, source.
```

marca de água alta: Um valor que representa um limite superior, seja um limite rígido que não deve ser ultrapassado durante a execução, ou um registro do valor máximo que foi realmente alcançado. Contrasta com **marca de água baixa**.

```
See Also low-water mark.
```

lista de histórico: uma lista de **transações** com registros marcados para exclusão agendados para serem processados pela operação de **purga** do **InnoDB**. Registrada no **log de desfazer**. O comprimento da lista de histórico é relatado pelo comando `SHOW ENGINE INNODB STATUS`. Se a lista de histórico crescer mais do que o valor da opção de configuração `innodb_max_purge_lag`, cada operação **DML** é adiada levemente para permitir que a operação de purga termine **limpando** os registros excluídos.

```
Also known as **purge lag**.

See Also DML, flush, purge, purge lag, rollback segment, transaction, undo log.
```

punção de buracos: Liberar blocos vazios de uma página. O recurso de **compactação transparente de páginas** do **InnoDB** depende do suporte à punção de buracos. Para mais informações, consulte a Seção 14.9.2, “Compactação de Páginas do InnoDB”.

```
See Also sparse file, transparent page compression.
```

anfitrião: O nome da rede de um servidor de banco de dados, usado para estabelecer uma **conexão**. Muitas vezes especificado em conjunto com uma **porta**. Em alguns contextos, o endereço IP `127.0.0.1` funciona melhor do que o nome especial `localhost` para acessar um banco de dados no mesmo servidor que o aplicativo.

```
See Also connection, localhost, port.
```

hot: Uma condição em que uma linha, tabela ou estrutura de dados interna é acessada com tanta frequência que exige algum tipo de bloqueio ou exclusão mútua, resultando em um problema de desempenho ou escalabilidade.

```
Although “hot” typically indicates an undesirable condition, a **hot backup** is the preferred type of backup.

See Also hot backup.
```

backup quente: Um backup feito enquanto o banco de dados está em execução e as aplicações estão lendo e escrevendo nele. O backup envolve mais do que apenas a cópia de arquivos de dados: ele deve incluir quaisquer dados que foram inseridos ou atualizados durante o processo de backup; ele deve excluir quaisquer dados que foram excluídos durante o processo de backup; e ele deve ignorar quaisquer alterações que não foram confirmadas.

```
The Oracle product that performs hot backups, of `InnoDB` tables especially but also tables from `MyISAM` and other storage engines, is known as **MySQL Enterprise Backup**.

The hot backup process consists of two stages. The initial copying of the data files produces a **raw backup**. The **apply** step incorporates any changes to the database that happened while the backup was running. Applying the changes produces a **prepared** backup; these files are ready to be restored whenever necessary.

See Also apply, MySQL Enterprise Backup, prepared backup, raw backup.
```

### Eu

Arquivo .ibd: O arquivo de dados para os espaços de tabelas **file-per-table** e espaços de tabelas gerais. Os arquivos `.ibd` de espaços de tabelas por arquivo contêm uma única tabela e dados de índice associados. Os arquivos `.ibd` de espaços de tabelas gerais podem conter dados de tabela e índice para várias tabelas. Os espaços de tabelas gerais foram introduzidos no MySQL 5.7.6.

```
The `.ibd` file extension does not apply to the **system tablespace**, which consists of one or more **ibdata files**.

If a file-per-table tablespace or general tablespace is created with the `DATA DIRECTORY =` clause, the `.ibd` file is located at the specified path, outside the normal data directory, and is pointed to by a **.isl file**.

When a `.ibd` file is included in a compressed backup by the **MySQL Enterprise Backup** product, the compressed equivalent is a `.ibz` file.

See Also database, file-per-table, general tablespace, ibdata file, .ibz file, innodb\_file\_per\_table, .isl file, MySQL Enterprise Backup, system tablespace.
```

Arquivo .ibz: Quando o produto **MySQL Enterprise Backup** realiza um **backup comprimido**, ele transforma cada arquivo de **tablespace** criado usando a configuração **file-per-table** (arquivo por tabela) de uma extensão `.ibd` para uma extensão `.ibz`.

```
The compression applied during backup is distinct from the **compressed row format** that keeps table data compressed during normal operation. A compressed backup operation skips the compression step for a tablespace that is already in compressed row format, as compressing a second time would slow down the backup but produce little or no space savings.

See Also compressed backup, compressed row format, file-per-table, .ibd file, MySQL Enterprise Backup, tablespace.
```

Arquivo .isl: Um arquivo que especifica a localização de um arquivo .ibd para uma tabela `InnoDB` criada com a cláusula `DATA DIRECTORY =` no MySQL 5.6 e versões posteriores, ou com a cláusula `CREATE TABLESPACE ... ADD DATAFILE` no MySQL 5.7 e versões posteriores. Funciona como um link simbólico, sem as restrições de plataforma do mecanismo de link simbólico real. Você pode armazenar **tablespaces** `InnoDB` fora do diretório **database**, por exemplo, em um dispositivo de armazenamento especialmente grande ou rápido, dependendo do uso da tabela. Para detalhes, consulte a Seção 14.6.1.2, “Criando Tabelas Externamente”, e a Seção 14.6.3.3, “Tablespaces Gerais”.

```
See Also database, .ibd file, table, tablespace.
```

I/O-bound: Veja disk-bound.

conjunto de arquivos gerenciado pelo `InnoDB` dentro de um banco de dados MySQL: o **espaço de tabela do sistema**, os arquivos do **espaço de tabela por arquivo** e os arquivos do **registro de revisão**. Dependendo da versão do MySQL e da configuração do `InnoDB`, também pode incluir os arquivos do **espaço de tabela geral**, **espaço de tabela temporário** e **espaço de tabela de desfazer**. Este termo é usado às vezes em discussões detalhadas sobre as estruturas e formatos de arquivos do `InnoDB` para se referir ao conjunto de arquivos gerenciado pelo `InnoDB` dentro de um banco de dados MySQL.

```
See Also database, file-per-table, general tablespace, redo log, system tablespace, temporary tablespace, undo tablespace.
```

ibbackup\_logfile: Um arquivo de backup suplementar criado pelo produto **MySQL Enterprise Backup** durante uma operação de **backup quente**. Ele contém informações sobre quaisquer alterações de dados que ocorreram enquanto o backup estava sendo executado. Os arquivos de backup iniciais, incluindo o `ibbackup_logfile`, são conhecidos como um **backup bruto**, porque as alterações que ocorreram durante a operação de backup ainda não foram incorporadas. Após você realizar a etapa **aplicar** aos arquivos de backup brutos, os arquivos resultantes incluem essas alterações de dados finais e são conhecidos como um **backup preparado**. Nesta fase, o arquivo `ibbackup_logfile` não é mais necessário.

```
See Also apply, hot backup, MySQL Enterprise Backup, prepared backup, raw backup.
```

arquivo ibdata: Um conjunto de arquivos com nomes como `ibdata1`, `ibdata2`, e assim por diante, que compõem o **espaço de tabela do sistema InnoDB**. Para obter informações sobre as estruturas e os dados que residem nos arquivos do espaço de tabela do sistema `ibdata`, consulte a Seção 14.6.3.1, “O Espaço de Tabela do Sistema”.

```
Growth of the `ibdata` files is influenced by the `innodb_autoextend_increment` configuration option.

See Also change buffer, data dictionary, doublewrite buffer, file-per-table, .ibd file, innodb\_file\_per\_table, system tablespace, undo log.
```

arquivo ibtmp: O **espaço de tabelas temporárias** **de dados** do **InnoDB** para **tabelas temporárias** **não compactadas** do **InnoDB** e objetos relacionados. A opção do arquivo de configuração, `innodb_temp_data_file_path`, permite que os usuários definam um caminho relativo para o arquivo de dados do espaço de tabelas temporárias. Se `innodb_temp_data_file_path` não for especificado, o comportamento padrão é criar um único arquivo de dados de 12 MB que se autoexpande, chamado `ibtmp1`, no diretório de dados, ao lado do `ibdata1`.

```
See Also data files, temporary table, temporary tablespace.
```

ib\_logfile: Um conjunto de arquivos, geralmente nomeados `ib_logfile0` e `ib_logfile1`, que formam o **log de refazer**. Também às vezes referidos como o **grupo de log**. Esses arquivos registram declarações que tentam alterar dados em tabelas do `InnoDB`. Essas declarações são regravadas automaticamente para corrigir dados escritos por transações incompletas, ao inicializar após um crash.

```
This data cannot be used for manual recovery; for that type of operation, use the **binary log**.

See Also binary log, log group, redo log.
```

ilist: Dentro de um índice **FULLTEXT** de `InnoDB`, a estrutura de dados consiste em um ID de documento e informações posicionais para um token (ou seja, uma palavra específica).

```
See Also FULLTEXT index.
```

bloqueio implícito de linha: um bloqueio de linha que o `InnoDB` adquire para garantir a consistência, sem que você o solicite especificamente.

```
See Also row lock.
```

banco de dados em memória: um tipo de sistema de banco de dados que mantém os dados na memória, para evitar o overhead devido ao E/S de disco e à tradução entre blocos de disco e áreas de memória. Alguns bancos de dados em memória sacrificam a durabilidade (o “D” na filosofia de design **ACID**) e são vulneráveis a falhas de hardware, de energia e outros tipos de falhas, tornando-os mais adequados para operações de leitura apenas. Outros bancos de dados em memória utilizam mecanismos de durabilidade, como registrar as alterações no disco ou usar memória não volátil.

```
MySQL features that address the same kinds of memory-intensive processing include the `InnoDB` **buffer pool**, **adaptive hash index**, and **read-only transaction** optimization, the `MEMORY` storage engine, the `MyISAM` key cache, and the MySQL query cache.

See Also ACID, adaptive hash index, buffer pool, disk-based, read-only transaction.
```

backup incremental: Um tipo de **backup quente**, realizado pelo produto **MySQL Enterprise Backup**, que apenas salva os dados alterados desde um determinado ponto no tempo. Ter um backup completo e uma sucessão de backups incrementais permite que você reconstrua os dados do backup ao longo de um longo período, sem o overhead de armazenamento de manter vários backups completos prontos. Você pode restaurar o backup completo e, em seguida, aplicar cada um dos backups incrementais em sucessão, ou você pode manter o backup completo atualizado aplicando cada backup incremental a ele, e depois realizar uma única operação de restauração.

```
The granularity of changed data is at the **page** level. A page might actually cover more than one row. Each changed page is included in the backup.

See Also hot backup, MySQL Enterprise Backup, page.
```

índice: Uma estrutura de dados que oferece uma capacidade de busca rápida para **linhas** de uma **tabela**, geralmente formando uma estrutura de árvore (**árvore B**) que representa todos os valores de uma **coluna** ou conjunto de colunas específicas.

```
`InnoDB` tables always have a **clustered index** representing the **primary key**. They can also have one or more **secondary indexes** defined on one or more columns. Depending on their structure, secondary indexes can be classified as **partial**, **column**, or **composite** indexes.

Indexes are a crucial aspect of **query** performance. Database architects design tables, queries, and indexes to allow fast lookups for data needed by applications. The ideal database design uses a **covering index** where practical; the query results are computed entirely from the index, without reading the actual table data. Each **foreign key** constraint also requires an index, to efficiently check whether values exist in both the **parent** and **child** tables.

Although a B-tree index is the most common, a different kind of data structure is used for **hash indexes**, as in the `MEMORY` storage engine and the `InnoDB` **adaptive hash index**. **R-tree** indexes are used for spatial indexing of multi-dimensional information.

See Also adaptive hash index, B-tree, child table, clustered index, column index, composite index, covering index, foreign key, hash index, parent table, partial index, primary key, query, R-tree, row, secondary index, table.
```

cache de índice: Uma área de memória que armazena os dados do token para a pesquisa **full-text** do `InnoDB`. Ela armazena os dados para minimizar o I/O de disco quando os dados são inseridos ou atualizados em colunas que fazem parte de um **índice FULLTEXT**. Os dados do token são escritos no disco quando o cache de índice fica cheio. Cada índice `FULLTEXT` do `InnoDB` tem seu próprio cache de índice separado, cujo tamanho é controlado pela opção de configuração `innodb_ft_cache_size`.

```
See Also full-text search, FULLTEXT index.
```

pushdown da condição de índice: O pushdown da condição de índice (ICP) é uma otimização que desloca parte de uma condição `WHERE` para o mecanismo de armazenamento se partes da condição puderem ser avaliadas usando campos do **índice**. O ICP pode reduzir o número de vezes que o **mecanismo de armazenamento** deve acessar a tabela base e o número de vezes que o servidor MySQL deve acessar o mecanismo de armazenamento. Para mais informações, consulte a Seção 8.2.1.5, “Otimização de Pushdown da Condição de Índice”.

```
See Also index, storage engine.
```

Dica de índice: Sintaxe SQL estendida para substituir os **índices** recomendados pelo otimizador. Por exemplo, as cláusulas `FORCE INDEX`, `USE INDEX` e `IGNORE INDEX`. Tipicamente usada quando as colunas indexadas têm valores distribuídos de forma desigual, resultando em estimativas de **cardinalidade** imprecisas.

```
See Also cardinality, index.
```

prefixo do índice: Em um **índice** que se aplica a várias colunas (conhecido como **índice composto**), as colunas iniciais ou de liderança do índice. Uma consulta que faz referência às primeiras 1, 2, 3 e assim por diante colunas de um índice composto pode usar o índice, mesmo que a consulta não faça referência a todas as colunas do índice.

```
See Also composite index, index.
```

estatísticas de índice: Veja as estatísticas.

registro infimum: Um **pseudo-registro** em um **índice**, representando o **lacuna** abaixo do menor valor nesse índice. Se uma transação tiver uma declaração como `SELECT ... FROM ... WHERE col < 10 FOR UPDATE;`, e o menor valor na coluna for 5, é um bloqueio no registro infimum que impede outras transações de inserir valores ainda menores, como 0, -10, e assim por diante.

```
See Also gap, index, pseudo-record, supremum record.
```

INFORMATION\_SCHEMA: O nome do **banco de dados** que fornece uma interface de consulta ao **dicionário de dados** do MySQL. (Esse nome é definido pelo padrão ANSI SQL.) Para examinar informações (metadados) sobre o banco de dados, você pode consultar tabelas como `INFORMATION_SCHEMA.TABLES` e `INFORMATION_SCHEMA.COLUMNS`, em vez de usar comandos `SHOW` que produzem saída não estruturada.

```
The `INFORMATION_SCHEMA` database also contains tables specific to **InnoDB** that provide a query interface to the `InnoDB` data dictionary. You use these tables not to see how the database is structured, but to get real-time information about the workings of `InnoDB` tables to help with performance monitoring, tuning, and troubleshooting.

See Also data dictionary, database, InnoDB.
```

InnoDB: Um componente do MySQL que combina alto desempenho com capacidade **transacional** para confiabilidade, robustez e acesso concorrente. Ele incorpora a filosofia de design **ACID**. Representado como um **motor de armazenamento**, ele gerencia tabelas criadas ou alteradas com a cláusula `ENGINE=INNODB`. Veja o Capítulo 14, *O Motor de Armazenamento InnoDB*, para detalhes arquitetônicos e procedimentos de administração, e a Seção 8.5, “Otimizando para Tabelas InnoDB”, para conselhos de desempenho.

```
In MySQL 5.5 and higher, `InnoDB` is the default storage engine for new tables and the `ENGINE=INNODB` clause is not required.

`InnoDB` tables are ideally suited for **hot backups**. See Section 28.1, “MySQL Enterprise Backup Overview” for information about the **MySQL Enterprise Backup** product for backing up MySQL servers without interrupting normal processing.

See Also ACID, hot backup, MySQL Enterprise Backup, storage engine, transaction.
```

innodb\_autoinc\_lock\_mode: A opção `innodb_autoinc_lock_mode` controla o algoritmo usado para o **bloqueio de autoincremento**. Quando você tem uma chave primária com autoincremento, você pode usar a replicação baseada em declarações apenas com a configuração `innodb_autoinc_lock_mode=1`. Esta configuração é conhecida como modo de bloqueio *consecutivo*, porque as inserções de múltiplas linhas dentro de uma transação recebem valores consecutivos de autoincremento. Se você tiver `innodb_autoinc_lock_mode=2`, que permite maior concorrência para operações de inserção, use a replicação baseada em linhas em vez da replicação baseada em declarações. Esta configuração é conhecida como modo de bloqueio *interlaçado*, porque múltiplas declarações de inserção de múltiplas linhas que estão sendo executadas ao mesmo tempo podem receber valores de **autoincremento** que são interligados. A configuração `innodb_autoinc_lock_mode=0` não deve ser usada, exceto para fins de compatibilidade.

```
Consecutive lock mode (`innodb_autoinc_lock_mode=1`) is the default setting prior to MySQL 8.0.3. As of MySQL 8.0.3, interleaved lock mode (`innodb_autoinc_lock_mode=2`) is the default, which reflects the change from statement-based to row-based replication as the default replication type.

See Also auto-increment, auto-increment locking, mixed-mode insert, primary key.
```

innodb\_file\_format: A opção `innodb_file_format` define o **formato de arquivo** a ser usado para novos **tablespaces** de **arquivos InnoDB** por tabela. Atualmente, você pode especificar os formatos de arquivo **Antelope** e **Barracuda**.

```
See Also Antelope, Barracuda, file format, file-per-table, general tablespace, innodb\_file\_per\_table, system tablespace, tablespace.
```

innodb\_file\_per\_table: Uma opção de configuração importante que afeta muitos aspectos do armazenamento de arquivos do `InnoDB`, disponibilidade de recursos e características de E/S. No MySQL 5.6.7 e versões superiores, ela é habilitada por padrão. A opção `innodb_file_per_table` ativa o modo **file-per-table**. Com esse modo habilitado, uma nova tabela `InnoDB` e índices associados podem ser armazenados em um arquivo por tabela **.ibd**, fora do **espaço de tabela do sistema**.

```
This option affects the performance and storage considerations for a number of SQL statements, such as `DROP TABLE` and `TRUNCATE TABLE`.

Enabling the `innodb_file_per_table` option allows you to take advantage of features such as table **compression** and named-table backups in **MySQL Enterprise Backup**.

For more information, see `innodb_file_per_table`, and Section 14.6.3.2, “File-Per-Table Tablespaces”.

See Also compression, file-per-table, .ibd file, MySQL Enterprise Backup, system tablespace.
```

innodb\_lock\_wait\_timeout: A opção `innodb_lock_wait_timeout` define o equilíbrio entre **esperar** que os recursos compartilhados fiquem disponíveis ou **desistir** e lidar com o erro, tentar novamente ou realizar o processamento alternativo em sua aplicação. Reverte qualquer transação `InnoDB` que espera mais de um tempo especificado para adquirir um **bloqueio**. Especialmente útil se **bloqueios** forem causados por atualizações em múltiplas tabelas controladas por diferentes motores de armazenamento; esses bloqueios não são **detectados** automaticamente.

```
See Also deadlock, deadlock detection, lock, wait.
```

innodb\_strict\_mode: A opção `innodb_strict_mode` controla se o `InnoDB` opera no modo **estricto**, onde condições que normalmente são tratadas como avisos causam erros (e as instruções subjacentes falham).

```
See Also strict mode.
```

Série de inovação: As versões de inovação com a mesma versão principal formam uma série de inovação. Por exemplo, MySQL 8.1 a 8.3 formam a série de inovação MySQL 8.

```
See Also LTS Series.
```

inserir: Uma das operações **DML** primárias em **SQL**. O desempenho das inserções é um fator chave em sistemas de **data warehouse** que carregam milhões de linhas em tabelas e em sistemas **OLTP** onde muitas conexões concorrentes podem inserir linhas na mesma tabela, em ordem arbitrária. Se o desempenho das inserções é importante para você, você deve aprender sobre as características do **InnoDB**, como o **buffer de inserção** usado no **bufferamento de alterações** e colunas de **auto-incremento**.

```
See Also auto-increment, change buffering, data warehouse, DML, InnoDB, insert buffer, OLTP, SQL.
```

inserir buffer: O antigo nome do **buffer de alterações**. No MySQL 5.5, foi adicionado suporte para o buffer de alterações em páginas de índice secundário para operações `DELETE` e `UPDATE`. Anteriormente, apenas as alterações resultantes de operações `INSERT` eram buffereadas. O termo preferido agora é *buffer de alterações*.

```
See Also change buffer, change buffering.
```

inserir bufferização: A técnica de armazenar as alterações nas páginas de índice secundário, resultantes das operações de `INSERT`, no **buffer de alterações** em vez de escrever as alterações imediatamente, para que as escritas físicas possam ser realizadas para minimizar o I/O aleatório. É um dos tipos de **bufferização de alterações**: os outros são **bufferização de exclusão** e **bufferização de purga**.

```
Insert buffering is not used if the secondary index is **unique**, because the uniqueness of new values cannot be verified before the new entries are written out. Other kinds of change buffering do work for unique indexes.

See Also change buffer, change buffering, delete buffering, insert buffer, purge buffering, unique index.
```

bloqueio de intenção: Um tipo de **bloqueio de lacuna** que é definido pelas operações `INSERT` antes da inserção de uma linha. Esse tipo de **bloqueio** sinaliza a intenção de inserir de tal forma que múltiplas transações que inserem na mesma lacuna do índice não precisam esperar umas às outras se não estiverem inserindo na mesma posição dentro da lacuna. Para mais informações, consulte a Seção 14.7.1, “Bloqueio InnoDB”.

```
See Also gap lock, lock, next-key lock.
```

Exemplo: Um único **daemon mysqld** gerenciando um **diretório de dados** que representa um ou mais **bancos de dados** com um conjunto de **tabelas**. É comum em cenários de desenvolvimento, teste e **replicação** ter múltiplas instâncias na mesma máquina **servidor**, cada uma gerenciando seu próprio diretório de dados e ouvindo em sua própria porta ou soquete. Com uma instância executando uma carga de trabalho **ligada a disco**, o servidor ainda pode ter capacidade de CPU e memória extra para executar instâncias adicionais.

```
See Also data directory, database, disk-bound, mysqld, replication, server, table.
```

instrumentação: Modificações no nível do código-fonte para coletar dados de desempenho para ajustes e depuração. No MySQL, os dados coletados pela instrumentação são expostos por meio de uma interface SQL usando as bases de dados `INFORMATION_SCHEMA` e `PERFORMANCE_SCHEMA`.

```
See Also INFORMATION\_SCHEMA, Performance Schema.
```

Bloqueio de intenção exclusivo: Veja bloqueio de intenção.

bloqueio de intenção: Um tipo de **bloqueio** que se aplica à tabela, usado para indicar o tipo de bloqueio que a **transação** pretende adquirir nas linhas da tabela. Diferentes transações podem adquirir diferentes tipos de bloqueios de intenção na mesma tabela, mas a primeira transação a adquirir um bloqueio de intenção exclusivo (IX) em uma tabela impede que outras transações adquiram quaisquer bloquios S ou X na tabela. Por outro lado, a primeira transação a adquirir um bloqueio de intenção compartilhada (IS) em uma tabela impede que outras transações adquiram quaisquer bloquios X na tabela. O processo de duas fases permite que os pedidos de bloqueio sejam resolvidos em ordem, sem bloquear bloquios e operações correspondentes que sejam compatíveis. Para mais informações sobre esse mecanismo de bloqueio, consulte a Seção 14.7.1, “Bloqueio do InnoDB”.

```
See Also lock, lock mode, locking, transaction.
```

bloqueio de intenção compartilhada: Veja bloqueio de intenção.

interceptador: Código para instrumentação ou depuração de algum aspecto de uma aplicação, que pode ser ativado sem recompilar ou alterar a fonte da própria aplicação.

```
See Also command interceptor, Connector/J, Connector/NET, exception interceptor.
```

tabela temporária intrínseca: uma tabela temporária interna otimizada do *InnoDB* usada pelo *opinião do otimizador*.

```
See Also optimizer.
```

Índice invertido: uma estrutura de dados otimizada para sistemas de recuperação de documentos, usada na implementação da **pesquisa full-text** do `InnoDB`. O **índice FULLTEXT do InnoDB**, implementado como um índice invertido, registra a posição de cada palavra dentro de um documento, em vez da localização de uma linha de tabela. Um único valor de coluna (um documento armazenado como uma string de texto) é representado por muitas entradas no índice invertido.

```
See Also full-text search, FULLTEXT index, ilist.
```

IOPS: Abreviação de **operações de E/S por segundo**. Uma medida comum para sistemas ocupados, especialmente para aplicações **OLTP**. Se esse valor estiver próximo do máximo que os dispositivos de armazenamento podem suportar, o aplicativo pode se tornar **ligado ao disco**, limitando a **escalabilidade**.

```
See Also disk-bound, OLTP, scalability.
```

nível de isolamento: Um dos fundamentos do processamento de bancos de dados. O isolamento é o **I** do acrônimo **ACID**. O nível de isolamento é a configuração que ajusta o equilíbrio entre desempenho e confiabilidade, consistência e reprodutibilidade dos resultados quando múltiplas **transações** estão fazendo alterações e executando consultas ao mesmo tempo.

```
From highest amount of consistency and protection to the least, the isolation levels supported by InnoDB are: **SERIALIZABLE**, **REPEATABLE READ**, **READ COMMITTED**, and **READ UNCOMMITTED**.

With `InnoDB` tables, many users can keep the default isolation level (*REPEATABLE READ*) for all operations. Expert users might choose the **READ COMMITTED** level as they push the boundaries of scalability with **OLTP** processing, or during data warehousing operations where minor inconsistencies do not affect the aggregate results of large amounts of data. The levels on the edges (**SERIALIZABLE** and **READ UNCOMMITTED**) change the processing behavior to such an extent that they are rarely used.

See Also ACID, OLTP, READ COMMITTED, READ UNCOMMITTED, REPEATABLE READ, SERIALIZABLE, transaction.
```

### J

J2EE: Plataforma Java, Edição Empresarial: A plataforma Java empresarial da Oracle. Ela consiste em uma API e um ambiente de execução para aplicações Java de classe empresarial. Para obter detalhes completos, consulte <http://www.oracle.com/technetwork/java/javaee/overview/index.html>. Com aplicações MySQL, você normalmente usa o **Connector/J** para acessar o banco de dados e um servidor de aplicação como **Tomcat** ou **JBoss** para lidar com o trabalho do nível intermediário, e opcionalmente um framework como **Spring**. As funcionalidades relacionadas ao banco de dados frequentemente oferecidas dentro de uma pilha J2EE incluem um **pool de conexões** e suporte a **failover**.

```
See Also connection pool, Connector/J, failover, Java, JBoss, Spring, Tomcat.
```

Java: Uma linguagem de programação que combina alto desempenho, recursos integrados ricos e tipos de dados, mecanismos orientados a objetos, extensa biblioteca padrão e ampla gama de módulos de terceiros reutilizáveis. O desenvolvimento empresarial é suportado por muitos frameworks, servidores de aplicativos e outras tecnologias. Grande parte de sua sintaxe é familiar para desenvolvedores de **C** e **C++**. Para escrever aplicativos Java com o MySQL, você usa o driver **JDBC**, conhecido como **Connector/J**.

```
See Also C, Connector/J, C++, JDBC.
```

JBoss: Veja também J2EE.

JDBC: Abreviação de “Java Database Connectivity”, uma **API** para acesso a bancos de dados a partir de **aplicativos Java**. Os desenvolvedores Java que escrevem aplicativos MySQL usam o componente **Connector/J** como seu driver JDBC.

```
See Also API, Connector/J, J2EE, Java.
```

JNDI: Veja também Java.

join: Uma **consulta** que recupera dados de mais de uma tabela, referenciando colunas nas tabelas que contêm valores idênticos. Idealmente, essas colunas fazem parte de uma relação de **chave estrangeira** `InnoDB`, que garante a **integridade referencial** e que as colunas de junção estejam **indexadas**. Muitas vezes, é usada para economizar espaço e melhorar o desempenho da consulta, substituindo strings repetidas por IDs numéricos, em um **design de dados normalizado**.

```
See Also foreign key, index, normalized, query, referential integrity.
```

### K

keystore: Veja também SSL.

KEY\_BLOCK\_SIZE: Uma opção para especificar o tamanho das páginas de dados dentro de uma tabela `InnoDB` que usa o **formato de linha comprimido**. O valor padrão é de 8 kilobytes. Valores menores correm o risco de atingir limites internos que dependem da combinação do tamanho da linha e da porcentagem de compressão.

```
For `MyISAM` tables, `KEY_BLOCK_SIZE` optionally specifies the size in bytes to use for index key blocks. The value is treated as a hint; a different size could be used if necessary. A `KEY_BLOCK_SIZE` value specified for an individual index definition overrides a table-level `KEY_BLOCK_SIZE` value.

See Also compressed row format.
```

### L

latche: Uma estrutura leve usada pelo `InnoDB` para implementar um **bloqueio** para suas próprias estruturas de memória internas, geralmente mantidas por um curto período de tempo medido em milissegundos ou microsegundos. Um termo geral que inclui tanto **mutexes** (para acesso exclusivo) quanto **rw-locks** (para acesso compartilhado). Certos latches são o foco do ajuste de desempenho do `InnoDB`. Estatísticas sobre o uso e a concorrência de latches estão disponíveis através da interface do **Schema de Desempenho**.

```
See Also lock, locking, mutex, Performance Schema, rw-lock.
```

libmysql: Nome informal para a biblioteca **libmysqlclient**.

```
See Also libmysqlclient.
```

libmysqlclient: O arquivo da biblioteca, chamado `libmysqlclient.a` ou `libmysqlclient.so`, que é tipicamente vinculado aos programas **client** escritos em **C**. Às vezes conhecido informalmente como **libmysql** ou a biblioteca **mysqlclient**.

```
See Also client, libmysql, mysqlclient.
```

libmysqld: Esta biblioteca de servidor MySQL **incorporada** permite executar um servidor MySQL completo dentro de uma aplicação **cliente**. Os principais benefícios são a velocidade aumentada e uma gestão mais simples para aplicações incorporadas. Você se conecta com a biblioteca `libmysqld` em vez de **libmysqlclient**. A API é idêntica entre as três bibliotecas.

```
See Also client, embedded, libmysql, libmysqlclient.
```

Intérprete do ciclo de vida: Um tipo de **intérprete** suportado pelo **Connector/J**. Envolve a implementação da interface `com.mysql.jdbc.ConnectionLifecycleInterceptor`.

```
See Also Connector/J, interceptor.
```

lista: O **pool de buffers** do **InnoDB** é representado como uma lista de **páginas** de memória. A lista é reorganizada à medida que novas páginas são acessadas e entram no pool de buffers, pois as páginas dentro do pool de buffers são acessadas novamente e são consideradas mais recentes, e as páginas que não são acessadas por um longo tempo são **expulsas** do pool de buffers. O pool de buffers é dividido em **sublistas**, e a política de substituição é uma variação da técnica conhecida **LRU**.

```
See Also buffer pool, eviction, LRU, page, sublist.
```

balanceamento de carga: uma técnica para escalar conexões de leitura somente enviando solicitações de consulta para diferentes servidores escravos em uma configuração de replicação ou cluster. Com o **Connector/J**, o balanceamento de carga é ativado através da classe `com.mysql.jdbc.ReplicationDriver` e controlado pela propriedade de configuração `loadBalanceStrategy`.

```
See Also Connector/J, J2EE.
```

localhost: Veja também conexão.

bloqueio: A noção de alto nível de um objeto que controla o acesso a um recurso, como uma tabela, linha ou estrutura de dados interna, como parte de uma estratégia de **bloqueio**. Para o ajuste intensivo do desempenho, você pode se aprofundar nas estruturas reais que implementam bloqueios, como **mutexos** e **latches**.

```
See Also latch, lock mode, locking, mutex.
```

Escalonamento de bloqueio: Uma operação usada em alguns sistemas de banco de dados que converte muitos **bloques de linha** em um único **bloqueio de tabela**, economizando espaço de memória, mas reduzindo o acesso concorrente à tabela. O `InnoDB` usa uma representação eficiente em termos de espaço para blocos de linha, de modo que o **escalonamento de bloqueio** não é necessário.

```
See Also locking, row lock, table lock.
```

Modo de bloqueio: Um **bloqueio compartilhado (S)** permite que uma **transação** leia uma linha. Várias transações podem adquirir um bloqueio S na mesma linha ao mesmo tempo.

```
An exclusive (X) lock allows a transaction to update or delete a row. No other transaction can acquire any kind of lock on that same row at the same time.

**Intention locks** apply to the table, and are used to indicate what kind of lock the transaction intends to acquire on rows in the table. Different transactions can acquire different kinds of intention locks on the same table, but the first transaction to acquire an intention exclusive (IX) lock on a table prevents other transactions from acquiring any S or X locks on the table. Conversely, the first transaction to acquire an intention shared (IS) lock on a table prevents other transactions from acquiring any X locks on the table. The two-phase process allows the lock requests to be resolved in order, without blocking locks and corresponding operations that are compatible.

See Also intention lock, lock, locking, transaction.
```

bloqueio: O sistema de proteção de uma **transação** para que os dados que estão sendo consultados ou alterados por outras transações não sejam vistos ou alterados. A estratégia de **bloqueio** deve equilibrar a confiabilidade e a consistência das operações de banco de dados (os princípios da filosofia **ACID**) contra o desempenho necessário para uma boa **concorrência**. A otimização da estratégia de bloqueio geralmente envolve a escolha de um **nível de isolamento** e garantir que todas as operações de banco de dados sejam seguras e confiáveis para esse nível de isolamento.

```
See Also ACID, concurrency, isolation level, locking, transaction.
```

bloqueio de leitura: Uma instrução `SELECT` que também realiza uma operação de **bloqueio** em uma tabela `InnoDB`. Pode ser `SELECT ... FOR UPDATE` ou `SELECT ... LOCK IN SHARE MODE`. Tem o potencial de gerar um **embriagueiro**, dependendo do **nível de isolamento** da transação. O oposto de uma **leitura sem bloqueio**. Não é permitido para tabelas globais em uma **transação apenas de leitura**.

```
`SELECT ... FOR SHARE` replaces `SELECT ... LOCK IN SHARE MODE` in MySQL 8.0.1, but `LOCK IN SHARE MODE` remains available for backward compatibility.

See Section 14.7.2.4, “Locking Reads”.

See Also deadlock, isolation level, locking, non-locking read, read-only transaction.
```

log: No contexto do `InnoDB`, “log” ou “arquivos de log” geralmente se refere ao **log de reescrita** representado pelos arquivos **ib\_logfile*N***. Outro tipo de log do `InnoDB` é o **log de desfazer**, que é uma área de armazenamento que contém cópias dos dados modificados por transações ativas.

```
Other kinds of logs that are important in MySQL are the **error log** (for diagnosing startup and runtime problems), **binary log** (for working with replication and performing point-in-time restores), the **general query log** (for diagnosing application problems), and the **slow query log** (for diagnosing performance problems).

See Also binary log, error log, general query log, ib\_logfile, redo log, slow query log, undo log.
```

Buffer de log: Área de memória que armazena os dados a serem escritos nos **arquivos de log** que compõem o **log de recuperação**. É controlado pela opção de configuração `innodb_log_buffer_size`.

```
See Also log file, redo log.
```

arquivo de registro: Um dos arquivos **ib\_logfile*N*** que compõem o **arquivo de recuperação**. Os dados são escritos nesses arquivos a partir da área de memória **buffer de registro**.

```
See Also ib\_logfile, log buffer, redo log.
```

grupo de logs: O conjunto de arquivos que compõem o **log de refazer**, tipicamente nomeados `ib_logfile0` e `ib_logfile1`. (Por essa razão, às vezes referidos coletivamente como **ib\_logfile**.)

```
See Also ib\_logfile, redo log.
```

lógico: Um tipo de operação que envolve aspectos abstratos de alto nível, como tabelas, consultas, índices e outros conceitos do SQL. Tipicamente, os aspectos lógicos são importantes para tornar a administração de bancos de dados e o desenvolvimento de aplicações convenientes e utilizáveis. Contrasta com **físico**.

```
See Also logical backup, physical.
```

backup lógico: Um **backup** que reproduz a estrutura e os dados da tabela, sem copiar os arquivos de dados reais. Por exemplo, o comando **`mysqldump`** produz um backup lógico, porque sua saída contém instruções como `CREATE TABLE` e `INSERT` que podem recriar os dados. Contrasta com o **backup físico**. Um backup lógico oferece flexibilidade (por exemplo, você pode editar definições de tabela ou inserir instruções antes de restaurar), mas pode levar muito mais tempo para **restaurar** do que um backup físico.

```
See Also backup, mysqldump, physical backup, restore.
```

loose\_: Um prefixo adicionado às opções de configuração do `InnoDB` após o **início do servidor**, para que quaisquer novas opções de configuração não reconhecidas pelo nível atual do MySQL não causem falha no início. O MySQL processa as opções de configuração que começam com este prefixo, mas emite um aviso em vez de uma falha se a parte após o prefixo não for uma opção reconhecida.

```
See Also startup.
```

marca de baixa água: Um valor que representa um limite inferior, tipicamente um valor de referência em que alguma ação corretiva começa ou se torna mais agressiva. Contrasta com a **marca de alta água**.

```
See Also high-water mark.
```

LRU: Um acrônimo para “menos recentemente usado”, um método comum para gerenciar áreas de armazenamento. Os itens que não foram usados recentemente são **expulsos** quando há necessidade de espaço para armazenar itens mais recentes. O `InnoDB` usa o mecanismo LRU por padrão para gerenciar as **páginas** dentro do **pool de buffers**, mas faz exceções em casos em que uma página pode ser lida apenas uma vez, como durante uma **pesquisa completa de tabela**. Essa variação do algoritmo LRU é chamada de **estratégia de inserção no ponto médio**. Para mais informações, consulte a Seção 14.5.1, “Pool de Buffers”.

```
See Also buffer pool, eviction, full table scan, midpoint insertion strategy, page.
```

LSN: Abreviação de "número de sequência de registro". Esse valor arbitrário e sempre crescente representa um ponto no tempo correspondente às operações registradas no **log de recuperação**. (Esse ponto no tempo é independente dos limites da **transação**: pode ocorrer no meio de uma ou mais transações.) Ele é usado internamente pelo `InnoDB` durante a **recuperação em caso de falha** e para gerenciar o **pool de buffers**.

```
Prior to MySQL 5.6.3, the LSN was a 4-byte unsigned integer. The LSN became an 8-byte unsigned integer in MySQL 5.6.3 when the redo log file size limit increased from 4GB to 512GB, as additional bytes were required to store extra size information. Applications built on MySQL 5.6.3 or later that use LSN values should use 64-bit rather than 32-bit variables to store and compare LSN values.

In the **MySQL Enterprise Backup** product, you can specify an LSN to represent the point in time from which to take an **incremental backup**. The relevant LSN is displayed by the output of the **mysqlbackup** command. Once you have the LSN corresponding to the time of a full backup, you can specify that value to take a subsequent incremental backup, whose output contains another LSN for the next incremental backup.

See Also buffer pool, crash recovery, incremental backup, MySQL Enterprise Backup, redo log, transaction.
```

Série LTS: As versões LTS com o mesmo número de versão principal formam uma série LTS. Por exemplo, todas as versões do MySQL 8.4.x formam a série LTS MySQL 8.4.

```
Note: MySQL 8.0 is a Bugfix series that preceded the LTS release model.

See Also Innovation Series.
```

### M

Arquivo .MRG: Um arquivo que contém referências a outras tabelas, usado pelo motor de armazenamento `MERGE`. Arquivos com essa extensão são sempre incluídos em backups produzidos pelo comando **mysqlbackup** do produto **MySQL Enterprise Backup**.

```
See Also MySQL Enterprise Backup, mysqlbackup command.
```

Arquivo .MYD: Um arquivo que o MySQL usa para armazenar dados para uma tabela `MyISAM`.

```
See Also .MYI file, MySQL Enterprise Backup, mysqlbackup command.
```

Arquivo .MYI: Um arquivo que o MySQL usa para armazenar índices para uma tabela `MyISAM`.

```
See Also .MYD file, MySQL Enterprise Backup, mysqlbackup command.
```

mestre: Veja a fonte.

Ferramenta principal: Um **thread** do **InnoDB** que realiza várias tarefas em segundo plano. A maioria dessas tarefas está relacionada ao E/S, como a escrita de alterações do **buffer de alterações** para os índices secundários apropriados.

```
To improve **concurrency**, sometimes actions are moved from the master thread to separate background threads. For example, in MySQL 5.6 and higher, **dirty pages** are **flushed** from the **buffer pool** by the **page cleaner** thread rather than the master thread.

See Also buffer pool, change buffer, concurrency, dirty page, flush, page cleaner, thread.
```

MDL: Abreviação de “bloqueio de metadados”.

```
See Also metadata lock.
```

confiança média: Sinônimo de **confiança parcial**. Como a faixa de configurações de confiança é tão ampla, a expressão “confiança parcial” é preferida para evitar a implicação de que existem apenas três níveis (baixo, médio e total).

```
See Also Connector/NET, partial trust.
```

memcached: Um componente popular de muitos pacotes de software MySQL e **NoSQL**, permitindo leituras e escritas rápidas para valores únicos e armazenando os resultados inteiramente na memória. Tradicionalmente, as aplicações precisavam de lógica extra para escrever os mesmos dados em um banco de dados MySQL para armazenamento permanente, ou para ler dados de um banco de dados MySQL quando não estavam armazenados na memória. Agora, as aplicações podem usar o simples protocolo **memcached**, suportado por bibliotecas de clientes para muitas linguagens, para se comunicar diretamente com servidores MySQL usando tabelas `InnoDB` ou `NDB`. Essas interfaces **NoSQL** para tabelas MySQL permitem que as aplicações alcancem um desempenho de leitura e escrita maior do que ao emitir instruções SQL diretamente, e podem simplificar a lógica da aplicação e as configurações de implantação para sistemas que já incorporam **memcached** para cacheamento em memória.

```
See Also NoSQL.
```

fusão: Para aplicar alterações aos dados armazenados em cache na memória, como quando uma página é colocada no **pool de buffers**, e quaisquer alterações aplicáveis registradas no **buffer de alterações** são incorporadas à página no pool de buffers. Os dados atualizados são, eventualmente, escritos no **tablespace** pelo mecanismo de **varredura**.

```
See Also buffer pool, change buffer, flush, tablespace.
```

Bloqueio de metadados: Um tipo de **bloqueio** que impede operações de **DDL** em uma tabela que está sendo usada ao mesmo tempo por outra **transação**. Para mais detalhes, consulte a Seção 8.11.4, “Bloqueio de Metadados”.

```
Enhancements to **online** operations, particularly in MySQL 5.6 and higher, are focused on reducing the amount of metadata locking. The objective is for DDL operations that do not change the table structure (such as `CREATE INDEX` and `DROP INDEX` for `InnoDB` tables) to proceed while the table is being queried, updated, and so on by other transactions.

See Also DDL, lock, online, transaction.
```

contador de métricas: Uma funcionalidade implementada pela tabela `INNODB_METRICS` na **INFORMATION\_SCHEMA**, no MySQL 5.6 e versões posteriores. Você pode consultar **contagens** e totais para operações de nível baixo do `InnoDB` e usar os resultados para ajustes de desempenho em combinação com dados do **Performance Schema**.

```
See Also counter, INFORMATION\_SCHEMA, Performance Schema.
```

Estratégia de inserção no ponto médio: A técnica de inicialmente inserir **páginas** no `InnoDB` **buffer pool** não no extremo “mais novo” da lista, mas sim em algum lugar no meio. A localização exata desse ponto pode variar, com base na configuração da opção `innodb_old_blocks_pct`. A intenção é que as páginas que são lidas apenas uma vez, como durante uma **pesquisa completa da tabela**, possam ser excluídas do buffer pool mais cedo do que com um algoritmo **LRU** estrito. Para mais informações, consulte a Seção 14.5.1, “Buffer Pool”.

```
See Also buffer pool, full table scan, LRU, page.
```

mini-transação: uma fase interna do processamento do `InnoDB`, quando são feitas alterações no nível **físico** das estruturas de dados internas durante operações de **DML**. Uma mini-transação (mtr) não tem noção de **rollback**; várias mini-transações podem ocorrer dentro de uma única **transação**. As mini-transações escrevem informações no **log de revisão** que são usadas durante a **recuperação em caso de falha**. Uma mini-transação também pode ocorrer fora do contexto de uma transação regular, por exemplo, durante o processamento de **purga** por threads de segundo plano.

```
See Also commit, crash recovery, DML, physical, purge, redo log, rollback, transaction.
```

inserção em modo misto: uma instrução `INSERT` onde os valores de **auto-incremento** são especificados para algumas, mas não para todas, das novas linhas. Por exemplo, uma `INSERT` de múltiplos valores pode especificar um valor para a coluna de auto-incremento em alguns casos e `NULL` em outros. O `InnoDB` gera valores de auto-incremento para as linhas onde o valor da coluna foi especificado como `NULL`. Outro exemplo é uma instrução `INSERT ... ON DUPLICATE KEY UPDATE`, onde os valores de auto-incremento podem ser gerados, mas não utilizados, para quaisquer linhas duplicadas que sejam processadas como instruções `UPDATE` em vez de `INSERT`.

```
Can cause consistency issues between **source** and **replica** servers in a **replication** configuration. Can require adjusting the value of the **innodb\_autoinc\_lock\_mode** configuration option.

See Also auto-increment, innodb\_autoinc\_lock\_mode, replica, replication, source.
```

MM. MySQL: Um driver JDBC mais antigo para MySQL que evoluiu para **Connector/J** quando foi integrado ao produto MySQL.

```
See Also Connector/J.
```

Mono: Uma estrutura de código aberto desenvolvida pela Novell, que funciona com aplicativos **Connector/NET** e **C#** em plataformas Linux.

```
See Also Connector/NET, C#.
```

mtr: Veja a mini-transação.

multi-core: Um tipo de processador que pode aproveitar programas multithread, como o servidor MySQL.

controle de concorrência de múltiplas versões: veja MVCC.

mutex: Abreviação informal para “variável de mutex”. (O próprio mutex é uma abreviação de “exclusão mútua”.) O objeto de nível baixo que o `InnoDB` usa para representar e impor **bloques** de acesso exclusivo a estruturas de dados internas em memória. Uma vez que o bloqueio é adquirido, qualquer outro processo, thread, etc., é impedido de adquirir o mesmo bloqueio. Em contraste com os **rw-locks**, que o `InnoDB` usa para representar e impor **bloques** de acesso compartilhado a estruturas de dados internas em memória. Os mutexes e os rw-locks são conhecidos coletivamente como **latches**.

```
See Also latch, lock, Performance Schema, Pthreads, rw-lock.
```

MVCC: Abreviação de “controle de concorrência de múltiplas versões”. Essa técnica permite que as **transações** do `InnoDB` com certos **níveis de isolamento** realizem operações de **leitura consistente**: ou seja, para consultar linhas que estão sendo atualizadas por outras transações e ver os valores antes que essas atualizações ocorressem. Essa é uma técnica poderosa para aumentar a **concorrência**, permitindo que as consultas prossigam sem esperar por causa dos **bloques** mantidos pelas outras transações.

```
This technique is not universal in the database world. Some other database products, and some other MySQL storage engines, do not support it.

See Also ACID, concurrency, consistent read, isolation level, lock, transaction.
```

my.cnf: O nome, em sistemas Unix ou Linux, do arquivo de **opções** do MySQL.

```
See Also my.ini, option file.
```

my.ini: O nome, nos sistemas Windows, do arquivo de **opções** do MySQL.

```
See Also my.cnf, option file.
```

Drivers MyODBC: Nome obsoleto para **Connector/ODBC**.

```
See Also Connector/ODBC.
```

mysql: O programa **mysql** é o interpretador de linha de comando para o banco de dados MySQL. Ele processa instruções **SQL** e também comandos específicos do MySQL, como `SHOW TABLES`, enviando solicitações ao daemon **mysqld**.

```
See Also mysqld, SQL.
```

comando mysqlbackup: uma ferramenta de linha de comando do produto **MySQL Enterprise Backup**. Ele realiza uma operação de **backup quente** para tabelas `InnoDB` e um backup morno para tabelas `MyISAM` e outros tipos de tabelas. Consulte a Seção 28.1, “MySQL Enterprise Backup Overview” para obter mais informações sobre este comando.

```
See Also hot backup, MySQL Enterprise Backup, warm backup.
```

mysqlclient: O nome informal da biblioteca implementada pelo arquivo **libmysqlclient**, com extensão `.a` ou `.so`.

```
See Also libmysqlclient.
```

mysqld: **mysqld**, também conhecido como MySQL Server, é um único programa multithread que realiza a maior parte do trabalho em uma instalação do MySQL. Ele não gera processos adicionais. O MySQL Server gerencia o acesso ao diretório de dados do MySQL, que contém bancos de dados, tabelas e outras informações, como arquivos de log e arquivos de status.

```
**mysqld** runs as a Unix daemon or Windows service, constantly waiting for requests and performing maintenance work in the background.

See Also instance, mysql.
```

MySQLdb: O nome do módulo **Python** de código aberto que forma a base da **API Python** do MySQL.

```
See Also Python, Python API.
```

mysqldump: Um comando que realiza um **backup lógico** de uma combinação de bancos de dados, tabelas e dados de tabelas. Os resultados são instruções SQL que reproduzem os objetos do esquema original, os dados ou ambos. Para grandes quantidades de dados, uma solução de **backup físico**, como o **MySQL Enterprise Backup**, é mais rápida, especialmente para a operação de **restauração**.

```
See Also logical backup, MySQL Enterprise Backup, physical backup, restore.
```

### N

.NET: Veja também ADO.NET, ASP.net, Connector/NET, Mono, Visual Studio.

API nativa C: Sinônimo de **libmysqlclient**.

```
See Also libmysql.
```

chave natural: Uma coluna indexada, tipicamente uma **chave primária**, onde os valores têm algum significado no mundo real. Geralmente é desaconselhável porque:

```
* If the value should ever change, there is potentially a lot of index maintenance to re-sort the **clustered index** and update the copies of the primary key value that are repeated in each **secondary index**.

* Even seemingly stable values can change in unpredictable ways that are difficult to represent correctly in the database. For example, one country can change into two or several, making the original country code obsolete. Or, rules about unique values might have exceptions. For example, even if taxpayer IDs are intended to be unique to a single person, a database might have to handle records that violate that rule, such as in cases of identity theft. Taxpayer IDs and other sensitive ID numbers also make poor primary keys, because they may need to be secured, encrypted, and otherwise treated differently than other columns.

Thus, it is typically better to use arbitrary numeric values to form a **synthetic key**, for example using an **auto-increment** column.

See Also auto-increment, clustered index, primary key, secondary index, synthetic key.
```

página vizinha: Qualquer **página** no mesmo **extensão** que uma página específica. Quando uma página é selecionada para ser **limpa**, as páginas vizinhas que estão **sujas** são tipicamente limpas também, como uma otimização de I/O para discos rígidos tradicionais. No MySQL 5.6 e versões posteriores, esse comportamento pode ser controlado pela variável de configuração `innodb_flush_neighbors`; você pode desativar essa configuração para unidades SSD, que não têm o mesmo overhead para escrever lotes menores de dados em locais aleatórios.

```
See Also dirty page, extent, flush, page.
```

Bloqueio next-key: Uma combinação de um **bloqueio de registro** no registro do índice e um bloqueio de lacuna na lacuna antes do registro do índice.

```
See Also gap lock, locking, record lock.
```

leitura não bloqueável: Uma **consulta** que não utiliza as cláusulas `SELECT ... FOR UPDATE` ou `SELECT ... LOCK IN SHARE MODE`. O único tipo de consulta permitido para tabelas globais em uma **transação apenas de leitura**. O oposto de uma **leitura não bloqueável**. Veja a Seção 14.7.2.3, “Leitura Não Bloqueável Consistente”.

```
`SELECT ... FOR SHARE` replaces `SELECT ... LOCK IN SHARE MODE` in MySQL 8.0.1, but `LOCK IN SHARE MODE` remains available for backward compatibility.

See Also locking read, query, read-only transaction.
```

leitura não reprodutível: A situação em que uma consulta recupera dados, e uma consulta posterior dentro da mesma **transação** recupera os mesmos dados, mas as consultas retornam resultados diferentes (alterados por outra transação que foi concluída no meio do caminho).

```
This kind of operation goes against the **ACID** principle of database design. Within a transaction, data should be consistent, with predictable and stable relationships.

Among different **isolation levels**, non-repeatable reads are prevented by the **serializable read** and **repeatable read** levels, and allowed by the **consistent read**, and **read uncommitted** levels.

See Also ACID, consistent read, isolation level, READ UNCOMMITTED, REPEATABLE READ, SERIALIZABLE, transaction.
```

I/O não bloqueante: um termo da indústria que significa o mesmo que **I/O assíncrono**.

```
See Also asynchronous I/O.
```

Normalizado: Uma estratégia de design de banco de dados em que os dados são divididos em várias tabelas, e os valores duplicados são condensados em linhas únicas representadas por um ID, para evitar o armazenamento, consulta e atualização de valores redundantes ou extensos. É tipicamente usado em aplicações **OLTP**.

```
For example, an address might be given a unique ID, so that a census database could represent the relationship **lives at this address** by associating that ID with each member of a family, rather than storing multiple copies of a complex value such as **123 Main Street, Anytown, USA**.

For another example, although a simple address book application might store each phone number in the same table as a person's name and address, a phone company database might give each phone number a special ID, and store the numbers and IDs in a separate table. This normalized representation could simplify large-scale updates when area codes split apart.

Normalization is not always recommended. Data that is primarily queried, and only updated by deleting entirely and reloading, is often kept in fewer, larger tables with redundant copies of duplicate values. This data representation is referred to as **denormalized**, and is frequently found in data warehousing applications.

See Also denormalized, foreign key, OLTP, relational.
```

NoSQL: Um termo amplo para um conjunto de tecnologias de acesso a dados que não utilizam a linguagem **SQL** como seu mecanismo primário para leitura e escrita de dados. Algumas tecnologias NoSQL atuam como bancos de dados de valores chave-valor, aceitando apenas leituras e escritas de um único valor; outras relaxam as restrições da metodologia **ACID**; ainda outras não exigem um **esquema** pré-planejado. Usuários do MySQL podem combinar o processamento estilo NoSQL para velocidade e simplicidade com operações SQL para flexibilidade e conveniência, usando a **memcached** API para acessar diretamente alguns tipos de tabelas do MySQL.

```
See Also ACID, memcached, schema, SQL.
```

Restrição NOT NULL: Um tipo de **restrição** que especifica que uma **coluna** não pode conter quaisquer valores **NULL**. Ela ajuda a preservar a **integridade referencial**, pois o servidor de banco de dados pode identificar dados com valores ausentes errados. Ela também ajuda na aritmética envolvida na otimização de consultas, permitindo que o otimizador preveja o número de entradas em um índice naquela coluna.

```
See Also column, constraint, NULL, primary key, referential integrity.
```

NULL: Um valor especial em **SQL**, indicando a ausência de dados. Qualquer operação aritmética ou teste de igualdade envolvendo um valor `NULL`, por sua vez, produz um resultado `NULL`. (Assim, é semelhante ao conceito de NaN (Not a Number) do IEEE, "não é um número".) Qualquer cálculo agregado, como `AVG()`, ignora linhas com valores `NULL`, ao determinar quantos registros dividir. O único teste que funciona com valores `NULL` usa os idiomas SQL `IS NULL` ou `IS NOT NULL`.

```
`NULL` values play a part in **index** operations, because for performance a database must minimize the overhead of keeping track of missing data values. Typically, `NULL` values are not stored in an index, because a query that tests an indexed column using a standard comparison operator could never match a row with a `NULL` value for that column. For the same reason, unique indexes do not prevent `NULL` values; those values simply are not represented in the index. Declaring a `NOT NULL` constraint on a column provides reassurance that there are no rows left out of the index, allowing for better query optimization (accurate counting of rows and estimation of whether to use the index).

Because the **primary key** must be able to uniquely identify every row in the table, a single-column primary key cannot contain any `NULL` values, and a multi-column primary key cannot contain any rows with `NULL` values in all columns.

Although the Oracle database allows a `NULL` value to be concatenated with a string, `InnoDB` treats the result of such an operation as `NULL`.

See Also index, primary key, SQL.
```

### O

Arquivo .OPT: Um arquivo que contém informações de configuração do banco de dados. Arquivos com essa extensão estão incluídos em backups produzidos pelo comando **mysqlbackup** do produto **MySQL Enterprise Backup**.

```
See Also MySQL Enterprise Backup, mysqlbackup command.
```

ODBC: Abreviação de Open Database Connectivity, uma API padrão da indústria. Tipicamente usada com servidores baseados em Windows ou aplicações que exigem ODBC para se comunicar com o MySQL. O driver ODBC do MySQL é chamado de **Connector/ODBC**.

```
See Also Connector/ODBC.
```

coluna off-page: Uma coluna que contém dados de comprimento variável (como `BLOB` e `VARCHAR`) que são muito longos para caber em uma página **B-tree**. Os dados são armazenados em páginas **de sobreposição**. O formato de linha **DINÂMICO** é mais eficiente para esse armazenamento do que o formato de linha **COMPACT** mais antigo.

```
See Also B-tree, compact row format, dynamic row format, overflow page.
```

OLTP: Abreviação de “Processamento de Transações Online”. Um sistema de banco de dados ou uma aplicação de banco de dados que executa uma carga de trabalho com muitas **transações**, com escritas e leituras frequentes, geralmente afetando pequenas quantidades de dados de cada vez. Por exemplo, um sistema de reserva de uma companhia aérea ou uma aplicação que processa depósitos bancários. Os dados podem ser organizados em forma **normalizada** para um equilíbrio entre a eficiência da **DML** (inserção/atualização/exclusão) e a eficiência da **consulta**. Contrasta com o **data warehouse**.

```
With its **row-level locking** and **transactional** capability, **InnoDB** is the ideal storage engine for MySQL tables used in OLTP applications.

See Also data warehouse, DML, InnoDB, query, row lock, transaction.
```

online: Um tipo de operação que não envolve tempo de inatividade, bloqueio ou operação restrita para o banco de dados. Tipicamente aplicado ao **DDL**. Operações que reduzem os períodos de operação restrita, como a **criação rápida de índices**, evoluíram para um conjunto mais amplo de operações **DDL online** no MySQL 5.6.

```
In the context of backups, a **hot backup** is an online operation and a **warm backup** is partially an online operation.

See Also DDL, Fast Index Creation, hot backup, online DDL, warm backup.
```

DDL online: Uma funcionalidade que melhora o desempenho, a concorrência e a disponibilidade das tabelas do `InnoDB` durante operações de **DDL** (principalmente `ALTER TABLE`). Consulte a Seção 14.13, “InnoDB e DDL Online”, para obter detalhes.

```
The details vary according to the type of operation. In some cases, the table can be modified concurrently while the `ALTER TABLE` is in progress. The operation might be able to be performed without a table copy, or using a specially optimized type of table copy. DML log space usage for in-place operations is controlled by the `innodb_online_alter_log_max_size` configuration option.

This feature is an enhancement of the **Fast Index Creation** feature in MySQL 5.5.

See Also DDL, Fast Index Creation, online.
```

Otimista: Uma metodologia que orienta as decisões de implementação de nível baixo para um sistema de banco de dados relacional. Os requisitos de desempenho e **concorrência** em um banco de dados relacional significam que as operações devem ser iniciadas ou enviadas rapidamente. Os requisitos de consistência e **integridade referencial** significam que qualquer operação pode falhar: uma transação pode ser revertida, uma operação **DML** pode violar uma restrição, um pedido de bloqueio pode causar um impasse, um erro de rede pode causar um tempo de espera. Uma estratégia otimista é aquela que assume que a maioria das solicitações ou tentativas terá sucesso, de modo que relativamente pouco trabalho é feito para se preparar para o caso de falha. Quando essa suposição é verdadeira, o banco de dados faz pouca coisa desnecessária; quando as solicitações falham, é necessário fazer mais trabalho para limpar e desfazer as alterações.

```
`InnoDB` uses optimistic strategies for operations such as **locking** and **commits**. For example, data changed by a transaction can be written to the data files before the commit occurs, making the commit itself very fast, but requiring more work to undo the changes if the transaction is rolled back.

The opposite of an optimistic strategy is a **pessimistic** one, where a system is optimized to deal with operations that are unreliable and frequently unsuccessful. This methodology is rare in a database system, because so much care goes into choosing reliable hardware, networks, and algorithms.

See Also commit, concurrency, DML, locking, pessimistic, referential integrity.
```

O otimizador: O componente do MySQL que determina os melhores **índices** e **ordens de junção** a serem usados para uma **consulta**, com base nas características e na distribuição dos dados das **tarefas** relevantes.

```
See Also index, join, query, table.
```

Opção: Um parâmetro de configuração para o MySQL, armazenado no arquivo **option** ou passado na linha de comando.

```
For the **options** that apply to **InnoDB** tables, each option name starts with the prefix `innodb_`.

See Also InnoDB, option, option file.
```

arquivo de opções: O arquivo que contém as **opções** de configuração para a instância do MySQL. Tradicionalmente, no Linux e no Unix, esse arquivo é chamado `my.cnf`, e no Windows, é chamado `my.ini`.

```
See Also configuration file, my.cnf, my.ini, option.
```

página de excedente: **Páginas** de disco alocadas separadamente que contêm colunas de comprimento variável (como `BLOB` e `VARCHAR`) que são muito longas para caber em uma **página de árvore B**. As colunas associadas são conhecidas como **colunas fora da página**.

```
See Also B-tree, off-page column, page.
```

### P

.par: Um arquivo que contém definições de partição. Arquivos com essa extensão são incluídos em backups produzidos pelo comando `mysqlbackup` do produto **MySQL Enterprise Backup**.

```
With the introduction of native partitioning support for `InnoDB` tables in MySQL 5.7.6, `.par` files are no longer created for partitioned `InnoDB` tables. Partitioned `MyISAM` tables continue to use `.par` files in MySQL 5.7. In MySQL 8.0, partitioning support is only provided by the `InnoDB` storage engine. As such, `.par` files are no longer used as of MySQL 8.0.

See Also MySQL Enterprise Backup, mysqlbackup command.
```

página: Uma unidade que representa a quantidade de dados que o `InnoDB` transfere de uma só vez entre o disco (os **arquivos de dados**) e a memória (o **pool de buffers**). Uma página pode conter uma ou mais **linhas**, dependendo da quantidade de dados em cada linha. Se uma linha não cabe inteiramente em uma única página, o `InnoDB` cria estruturas de dados adicionais em estilo ponteiro para que as informações sobre a linha possam ser armazenadas em uma única página.

```
One way to fit more data in each page is to use **compressed row format**. For tables that use BLOBs or large text fields, **compact row format** allows those large columns to be stored separately from the rest of the row, reducing I/O overhead and memory usage for queries that do not reference those columns.

When `InnoDB` reads or writes sets of pages as a batch to increase I/O throughput, it reads or writes an **extent** at a time.

All the `InnoDB` disk data structures within a MySQL instance share the same **page size**.

See Also buffer pool, compact row format, compressed row format, data files, extent, page size, row.
```

limpezador de páginas: Um **thread** de plano de fundo do **InnoDB** que **limpa** **páginas sujas** do **pool de buffers**. Antes do MySQL 5.6, essa atividade era realizada pelo **thread mestre**. O número de threads de limpador de páginas é controlado pela opção de configuração `innodb_page_cleaners`, introduzida no MySQL 5.7.4.

```
See Also buffer pool, dirty page, flush, master thread, thread.
```

tamanho da página: Para lançamentos até e incluindo o MySQL 5.5, o tamanho de cada **página** do **InnoDB** é fixo em 16 kilobytes. Esse valor representa um equilíbrio: grande o suficiente para armazenar os dados da maioria das linhas, mas pequeno o suficiente para minimizar o overhead de desempenho da transferência de dados desnecessários para a memória. Outros valores não são testados ou suportados.

```
Starting in MySQL 5.6, the page size for an `InnoDB` **instance** can be either 4KB, 8KB, or 16KB, controlled by the `innodb_page_size` configuration option. As of MySQL 5.7.6, `InnoDB` also supports 32KB and 64KB page sizes. For 32KB and 64KB page sizes, `ROW_FORMAT=COMPRESSED` is not supported and the maximum record size is 16KB.

Page size is set when creating the MySQL instance, and it remains constant afterward. The same page size applies to all `InnoDB` **tablespaces**, including the **system tablespace**, **file-per-table** tablespaces, and **general tablespaces**.

Smaller page sizes can help performance with storage devices that use small block sizes, particularly for **SSD** devices in **disk-bound** workloads, such as for **OLTP** applications. As individual rows are updated, less data is copied into memory, written to disk, reorganized, locked, and so on.

See Also disk-bound, file-per-table, general tablespace, instance, OLTP, page, SSD, system tablespace, tablespace.
```

tabela pai: A tabela em uma relação de **chave estrangeira** que contém os valores iniciais das colunas apontadas a partir da **tabela filho**. As consequências da exclusão ou atualização de linhas na tabela pai dependem das cláusulas `ON UPDATE` e `ON DELETE` na definição da chave estrangeira. Linhas com valores correspondentes na tabela filho podem ser excluídas ou atualizadas automaticamente, ou essas colunas podem ser definidas como `NULL`, ou a operação pode ser impedida.

```
See Also child table, foreign key.
```

backup parcial: Um **backup** que contém algumas das **tarefas** de um banco de dados MySQL ou algumas das bases de dados de uma instância MySQL. Contrasta com o **backup completo**.

```
See Also backup, full backup, table.
```

índice parcial: Um **índice** que representa apenas uma parte do valor de uma coluna, tipicamente os primeiros N caracteres (o **prefixo**) de um valor `VARCHAR` longo.

```
See Also index, index prefix.
```

confiança parcial: Um ambiente de execução tipicamente usado por provedores de hospedagem, onde as aplicações têm algumas permissões, mas não outras. Por exemplo, as aplicações podem ter acesso a um servidor de banco de dados pela rede, mas estar "encaminhadas" em relação à leitura e escrita de arquivos locais.

```
See Also Connector/NET.
```

Schema de desempenho: O esquema `performance_schema`, no MySQL 5.5 e versões posteriores, apresenta um conjunto de tabelas que você pode consultar para obter informações detalhadas sobre as características de desempenho de muitas partes internas do servidor MySQL. Veja o Capítulo 25, *MySQL Performance Schema*.

```
See Also INFORMATION\_SCHEMA, latch, mutex, rw-lock.
```

Perl: Uma linguagem de programação com raízes em scripts Unix e geração de relatórios. Incorpora expressões regulares de alto desempenho e entrada/saída de arquivos. Grande coleção de módulos reutilizáveis disponíveis através de repositórios como o CPAN.

```
See Also Perl API.
```

API do Perl: Uma **API** de código aberto para aplicações MySQL escritas na linguagem **Perl**. Implementada através dos módulos `DBI` e `DBD::mysql`. Para detalhes, consulte a Seção 27.9, “API do Perl para MySQL”.

```
See Also API, Perl.
```

estatísticas persistentes: um recurso que armazena estatísticas de **índice** para **tabelas** do `InnoDB` no disco, proporcionando melhor **estabilidade do plano** para **consultas**. Para mais informações, consulte a Seção 14.8.11.1, “Configurando Parâmetros de Estatísticas do Otimizador Persistente”.

```
See Also index, optimizer, plan stability, query, table.
```

pessimista: Uma metodologia que sacrifica o desempenho ou a concorrência em favor da segurança. É apropriado se uma alta proporção de solicitações ou tentativas pode falhar, ou se as consequências de uma solicitação falha são graves. O `InnoDB` usa o que é conhecido como uma estratégia de **bloqueio** **pessimista**, para minimizar a chance de **embalos**. No nível do aplicativo, você pode evitar embalos usando uma estratégia pessimista de adquirir todas as chaves necessárias por uma transação no início.

```
Many built-in database mechanisms use the opposite **optimistic** methodology.

See Also deadlock, locking, optimistic.
```

fantasma: Uma linha que aparece no conjunto de resultados de uma consulta, mas não no conjunto de resultados de uma consulta anterior. Por exemplo, se uma consulta for executada duas vezes dentro de uma **transação**, e, nesse meio tempo, outra transação for confirmada após inserir uma nova linha ou atualizar uma linha para que ela corresponda à cláusula `WHERE` da consulta.

```
This occurrence is known as a phantom read. It is harder to guard against than a **non-repeatable read**, because locking all the rows from the first query result set does not prevent the changes that cause the phantom to appear.

Among different **isolation levels**, phantom reads are prevented by the **serializable read** level, and allowed by the **repeatable read**, **consistent read**, and **read uncommitted** levels.

See Also consistent read, isolation level, non-repeatable read, READ UNCOMMITTED, REPEATABLE READ, SERIALIZABLE, transaction.
```

PHP: Uma linguagem de programação que surgiu com aplicações web. O código é tipicamente embutido como blocos dentro da fonte de uma página da web, com a saída substituída na página conforme ela é transmitida pelo servidor web. Isso contrasta com aplicações como scripts CGI que imprimem a saída na forma de uma página inteira da web. O estilo de codificação PHP é usado para páginas web altamente interativas e dinâmicas. Programas modernos de PHP também podem ser executados como aplicações de linha de comando ou GUI.

```
MySQL applications are written using one of the **PHP APIs**. Reusable modules can be written in **C** and called from PHP.

Another technology for writing server-side web pages with MySQL is **ASP.net**.

See Also ASP.net, C, PHP API.
```

API do PHP: Várias **APIs** estão disponíveis para escrever aplicativos MySQL na linguagem **PHP**: a API original do MySQL (`Mysql`), a Extensão Melhorada do MySQL (`Mysqli`), o Driver Nativo do MySQL (`Mysqlnd`), as funções do MySQL (`PDO_MYSQL`) e o Connector/PHP. Para obter detalhes, consulte MySQL e PHP.

```
See Also API, PHP.
```

Físico: Um tipo de operação que envolve aspectos relacionados ao hardware, como blocos de disco, páginas de memória, arquivos, bits, leituras de disco, e assim por diante. Tipicamente, os aspectos físicos são importantes durante o ajuste de desempenho em nível de especialista e diagnóstico de problemas. Contrasta com **lógico**.

```
See Also logical, physical backup.
```

backup físico: Um **backup** que copia os arquivos de dados reais. Por exemplo, o comando **`mysqlbackup`** do produto **MySQL Enterprise Backup** produz um backup físico, porque sua saída contém arquivos de dados que podem ser usados diretamente pelo servidor **mysqld**, resultando em uma operação de **restauração** mais rápida. Compare com o **backup lógico**.

```
See Also backup, logical backup, MySQL Enterprise Backup, restore.
```

PITR: Abreviação para **recuperação em um ponto no tempo**.

```
See Also point-in-time recovery.
```

estabilidade do plano: Uma propriedade de um **plano de execução de consulta**, onde o otimizador faz as mesmas escolhas todas as vezes para uma **consulta** específica, de modo que o desempenho seja consistente e previsível.

```
See Also query, query execution plan.
```

recuperação em um ponto no tempo: O processo de restaurar um **backup** para recriar o estado do banco de dados em uma data e hora específicas. Comumente abreviado como **PITR** (Point In Time Recovery). Como é improvável que o horário especificado corresponda exatamente ao momento de um backup, essa técnica geralmente requer uma combinação de um **backup físico** e um **backup lógico**. Por exemplo, com o produto **MySQL Enterprise Backup**, você restaura o último backup que você fez antes do ponto no tempo especificado, e depois retransmite as alterações do **log binário** entre o momento do backup e o horário da PITR.

```
See Also backup, binary log, logical backup, MySQL Enterprise Backup, physical backup.
```

port: O número do socket TCP/IP no qual o servidor de banco de dados escuta, usado para estabelecer uma **conexão**. Muitas vezes especificado em conjunto com um **host**. Dependendo do uso da criptografia de rede, pode haver uma porta para tráfego não criptografado e outra porta para conexões **SSL**.

```
See Also connection, host, SSL.
```

prefixo: Veja o prefixo do índice.

backup preparado: Um conjunto de arquivos de backup, produzido pelo produto **MySQL Enterprise Backup**, após todas as etapas de aplicação de **logs binários** e **backups incrementais** serem concluídas. Os arquivos resultantes estão prontos para serem **restaurados**. Antes das etapas de aplicação, os arquivos são conhecidos como um **backup bruto**.

```
See Also binary log, hot backup, incremental backup, MySQL Enterprise Backup, raw backup, restore.
```

declaração preparada: Uma instrução SQL que é analisada antecipadamente para determinar um plano de execução eficiente. Ela pode ser executada várias vezes, sem o overhead para análise e interpretação de cada vez. Diferentes valores podem ser substituídos por literais na cláusula `WHERE` cada vez, através do uso de marcadores. Essa técnica de substituição melhora a segurança, protegendo contra alguns tipos de ataques de injeção SQL. Você também pode reduzir o overhead para conversão e cópia de valores de retorno para variáveis do programa.

```
Although you can use prepared statements directly through SQL syntax, the various **Connectors** have programming interfaces for manipulating prepared statements, and these APIs are more efficient than going through SQL.

See Also client-side prepared statement, connector, server-side prepared statement.
```

chave primária: Um conjunto de colunas — e, por implicação, o índice baseado neste conjunto de colunas — que pode identificar de forma única cada linha de uma tabela. Como tal, deve ser um índice único que não contenha quaisquer valores `NULL`.

```
`InnoDB` requires that every table has such an index (also called the **clustered index** or **cluster index**), and organizes the table storage based on the column values of the primary key.

When choosing primary key values, consider using arbitrary values (a **synthetic key**) rather than relying on values derived from some other source (a **natural key**).

See Also clustered index, index, natural key, synthetic key.
```

processo: Uma instância de um programa em execução. O sistema operacional troca entre múltiplos processos em execução, permitindo um certo grau de **concorrência**. Na maioria dos sistemas operacionais, os processos podem conter múltiplas **threads** de execução que compartilham recursos. A troca de contexto entre threads é mais rápida do que a troca equivalente entre processos.

```
See Also concurrency, thread.
```

pseudo-registro: Um registro artificial em um índice, usado para **bloquear** valores ou intervalos de chaves que atualmente não existem.

```
See Also infimum record, locking, supremum record.
```

Pthreads: O padrão POSIX threads, que define uma API para operações de threads e bloqueio em sistemas Unix e Linux. Em sistemas Unix e Linux, o `InnoDB` usa essa implementação para **mutexos**.

```
See Also mutex.
```

purga: Um tipo de coleta de lixo realizada por um ou mais threads de fundo separados (controlados por `innodb_purge_threads`) que é executada em um cronograma periódico. A purga analisa e processa as páginas do **log de desfazer** da **lista de histórico** com o propósito de remover registros de índices secundários e agrupados que foram marcados para exclusão (por declarações anteriores de `DELETE`) e que não são mais necessários para **MVCC** ou **rollback**. A purga libera as páginas do log de desfazer da lista de histórico após processá-las.

```
See Also history list, MVCC, rollback, undo log.
```

purga de buffer: A técnica de armazenar as alterações nas páginas de índice secundário, resultantes das operações `DELETE`, no **buffer de alterações** em vez de escrever as alterações imediatamente, para que as escritas físicas possam ser realizadas para minimizar o I/O aleatório. (Como as operações de exclusão são um processo em duas etapas, essa operação armazena a escrita que normalmente purga um registro de índice que foi previamente marcado para exclusão.) É um dos tipos de **bufferização de alterações**: os outros são **bufferização de inserção** e **bufferização de exclusão**.

```
See Also change buffer, change buffering, delete buffering, insert buffer, insert buffering.
```

purga de atraso: Outro nome para a lista de **histórico do InnoDB**. Relacionado à opção de configuração `innodb_max_purge_lag`.

```
See Also history list, purge.
```

purga de tópicos: Um **tópico** dentro do processo `InnoDB` dedicado a realizar a operação de **purga** periódica. No MySQL 5.6 e versões superiores, múltiplos tópicos de purga são habilitados pela opção de configuração `innodb_purge_threads`.

```
See Also purge, thread.
```

Python: Uma linguagem de programação usada em uma ampla gama de áreas, desde scripts Unix até aplicações em grande escala. Inclui tipificação dinâmica, tipos de dados integrados de alto nível, recursos orientados a objetos e uma extensa biblioteca padrão. Muitas vezes usada como uma linguagem de “cola” entre componentes escritos em outras linguagens. A **API Python** do MySQL é o módulo **MySQLdb** de código aberto.

```
See Also MySQLdb, Python API.
```

API do Python: Consulte também API, Python.

### Q

pergunta: Em **SQL**, uma operação que lê informações de uma ou mais **tabelas**. Dependendo da organização dos dados e dos parâmetros da consulta, a pesquisa pode ser otimizada consultando um **índice**. Se várias tabelas estiverem envolvidas, a consulta é conhecida como **join**.

```
For historical reasons, sometimes discussions of internal processing for statements use “query” in a broader sense, including other types of MySQL statements such as **DDL** and **DML** statements.

See Also DDL, DML, index, join, SQL, table.
```

plano de execução da consulta: o conjunto de decisões tomadas pelo otimizador sobre a forma mais eficiente de executar uma **consulta**, incluindo quais **índice** ou índices usar e a ordem em que as tabelas devem ser **conectadas**. A **estabilidade do plano** envolve a mesma escolha sendo feita de forma consistente para uma consulta específica.

```
See Also index, join, plan stability, query.
```

registro de consultas: Veja o registro geral de consultas.

quieto: Para reduzir a quantidade de atividade do banco de dados, muitas vezes em preparação para uma operação como uma **alteração de tabela**, um **backup** ou um **shutdown**. Pode ou não envolver fazer o máximo de **limpeza** possível, para que o **InnoDB** não continue realizando I/O de fundo.

```
In MySQL 5.6 and higher, the syntax `FLUSH TABLES ... FOR EXPORT` writes some data to disk for `InnoDB` tables that make it simpler to back up those tables by copying the data files.

See Also backup, flush, InnoDB, shutdown.
```

### R

R-tree: Uma estrutura de dados em forma de árvore usada para indexação espacial de dados multidimensionais, como coordenadas geográficas, retângulos ou polígonos.

```
See Also B-tree.
```

RAID: Abreviação de “Array Redundante de Unidades Inexpensive”. A distribuição das operações de E/S em múltiplas unidades permite maior **concorrencia** ao nível do hardware e melhora a eficiência das operações de escrita de baixo nível que, de outra forma, seriam realizadas em sequência.

```
See Also concurrency.
```

Mergulho aleatório: uma técnica para estimar rapidamente o número de valores diferentes em uma coluna (a **cardinalidade** da coluna). O `InnoDB` amostra páginas aleatoriamente do índice e usa esses dados para estimar o número de valores diferentes.

```
See Also cardinality.
```

backup bruto: O conjunto inicial de arquivos de backup produzidos pelo produto **MySQL Enterprise Backup**, antes que as alterações refletidas no **log binário** e quaisquer **backups incrementais** sejam aplicadas. Nesta fase, os arquivos não estão prontos para **restauração**. Após essas alterações serem aplicadas, os arquivos são conhecidos como um **backup preparado**.

```
See Also binary log, hot backup, ibbackup\_logfile, incremental backup, MySQL Enterprise Backup, prepared backup, restore.
```

LEIA COM COMPROMISSO: Um **nível de isolamento** que utiliza uma estratégia de **bloqueio** que relaxa parte da proteção entre **transações**, no interesse do desempenho. As transações não podem ver dados não comprometidos de outras transações, mas podem ver dados que foram comprometidos por outra transação após o início da transação atual. Assim, uma transação nunca vê nenhum dado ruim, mas os dados que ela vê podem depender, em certa medida, do momento em que outras transações ocorrem.

```
When a transaction with this isolation level performs `UPDATE ... WHERE` or `DELETE ... WHERE` operations, other transactions might have to wait. The transaction can perform `SELECT ... FOR UPDATE`, and `LOCK IN SHARE MODE` operations without making other transactions wait.

`SELECT ... FOR SHARE` replaces `SELECT ... LOCK IN SHARE MODE` in MySQL 8.0.1, but `LOCK IN SHARE MODE` remains available for backward compatibility.

See Also ACID, isolation level, locking, REPEATABLE READ, SERIALIZABLE, transaction.
```

fenômenos de leitura: Fenômenos como **leitura suja**, **leitura não repetiível** e **leitura fantasma**, que podem ocorrer quando uma transação lê dados que outra transação modificou.

```
See Also dirty read, non-repeatable read, phantom.
```

LEIA SEM COMPROMISSO: O **nível de isolamento** que oferece a menor quantidade de proteção entre as transações. As consultas empregam uma estratégia de **bloqueio** que permite que elas prossigam em situações em que normalmente esperariam por outra transação. No entanto, esse desempenho extra vem ao custo de resultados menos confiáveis, incluindo dados que foram alterados por outras transações e ainda não foram comprometidos (conhecidos como **leitura suja**). Use este nível de isolamento com grande cautela e esteja ciente de que os resultados podem não ser consistentes ou reproduzíveis, dependendo do que outras transações estão fazendo ao mesmo tempo. Tipicamente, as transações com este nível de isolamento realizam apenas consultas, não operações de inserção, atualização ou exclusão.

```
See Also ACID, dirty read, isolation level, locking, transaction.
```

visualização de leitura: Um instantâneo interno usado pelo mecanismo **MVCC** do `InnoDB`. Algumas **transações**, dependendo do seu **nível de isolamento**, veem os valores dos dados como estavam na época em que a transação (ou, em alguns casos, a declaração) começou. Os níveis de isolamento que usam uma visualização de leitura são **LEIA REPETÍVEL**, **LEIA COMITADA** e **LEIA NÃO COMITADA**.

```
See Also isolation level, MVCC, READ COMMITTED, READ UNCOMMITTED, REPEATABLE READ, transaction.
```

leitura antecipada: Um tipo de solicitação de E/S que pré-carrega um grupo de **páginas** (um **extensão** inteiro) no **pool de buffer** de forma assíncrona, caso essas páginas sejam necessárias em breve. A técnica de leitura antecipada linear pré-carrega todas as páginas de uma extensão com base nos padrões de acesso das páginas na extensão anterior. A técnica de leitura antecipada aleatória pré-carrega todas as páginas de uma extensão assim que um certo número de páginas da mesma extensão estiverem no pool de buffer. A leitura antecipada aleatória não faz parte do MySQL 5.5, mas é reintroduzida no MySQL 5.6 sob o controle da opção de configuração `innodb_random_read_ahead`.

```
See Also buffer pool, extent, page.
```

transação de leitura: Um tipo de **transação** que pode ser otimizada para tabelas do **InnoDB** ao eliminar parte da contabilidade envolvida na criação de uma **visualização de leitura** para cada transação. Pode realizar apenas consultas de **leitura sem bloqueio**. Pode ser iniciada explicitamente com a sintaxe `START TRANSACTION READ ONLY`, ou automaticamente sob certas condições. Consulte a Seção 8.5.3, “Otimizando Transações de Leitura do InnoDB”, para obter detalhes.

```
See Also non-locking read, read view, transaction.
```

bloqueio de registro: um bloqueio em um registro de índice. Por exemplo, `SELECT c1 FROM t WHERE c1 = 10 FOR UPDATE;` impede que qualquer outra transação insira, atualize ou exclua linhas onde o valor de `t.c1` é 10. Contrasta com **bloqueio de lacuna** e **bloqueio de próxima chave**.

```
See Also gap lock, lock, next-key lock.
```

redo: Os dados, em unidades de registros, registrados no **log de refazer** quando as instruções DML fazem alterações nas tabelas do **InnoDB**. Ele é usado durante a **recuperação após falhas** para corrigir dados escritos por **transações** incompletas. O valor sempre crescente do **LSN** representa a quantidade cumulativa de dados de refazer que passaram pelo log de refazer.

```
See Also crash recovery, DML, LSN, redo log, transaction.
```

log de refazer: uma estrutura de dados baseada em disco usada durante a **recuperação após falhas**, para corrigir dados escritos por **transações** incompletas. Durante o funcionamento normal, ela codifica solicitações para alterar os dados da tabela do `InnoDB`, que resultam de instruções SQL ou chamadas de API de baixo nível. As modificações que não terminaram de atualizar os **arquivos de dados** antes de um **shutdown** inesperado são regravadas automaticamente.

```
The redo log is physically represented on disk as a set of redo log files. Redo log data is encoded in terms of records affected; this data is collectively referred to as **redo**. The passage of data through the redo log is represented by an ever-increasing **LSN** value.

For more information, see Section 14.6.6, “Redo Log”

See Also crash recovery, data files, ib\_logfile, log buffer, LSN, redo, shutdown, transaction.
```

Arquivamento do log de refazer: Uma funcionalidade do `InnoDB` que, quando ativada, escreve sequencialmente os registros do log de refazer em um arquivo de arquivamento para evitar a perda potencial de dados que pode ocorrer quando uma ferramenta de backup não consegue acompanhar a geração do log de refazer enquanto uma operação de backup está em andamento. Para mais informações, consulte Arquivamento do Log de Refazer.

```
See Also redo log.
```

Formato de linha redundante: O formato de linha mais antigo do **InnoDB**. Antes do MySQL 5.0.3, era o único formato de linha disponível no **InnoDB**. De MySQL 5.0.3 a MySQL 5.7.8, o formato de linha padrão é **COMPACT**. A partir do MySQL 5.7.9, o formato de linha padrão é definido pela opção de configuração `innodb_default_row_format`, que tem um valor padrão de **DINÂMICO**. Você ainda pode especificar o formato de linha **REDUNDANTE** para compatibilidade com tabelas mais antigas do **InnoDB**.

```
For more information, see Section 14.11, “InnoDB Row Formats”.

See Also compact row format, dynamic row format, row format.
```

integridade referencial: A técnica de manter os dados sempre em um formato consistente, parte da filosofia **ACID**. Em particular, os dados em diferentes tabelas são mantidos consistentes através do uso de **restrições de chave estrangeira**, que podem impedir que alterações ocorram ou propagar automaticamente essas alterações para todas as tabelas relacionadas. Mecanismos relacionados incluem a **restrição única**, que impede que valores duplicados sejam inseridos por engano, e a **restrição NOT NULL**, que impede que valores em branco sejam inseridos por engano.

```
See Also ACID, FOREIGN KEY constraint, NOT NULL constraint, unique constraint.
```

relacional: Um aspecto importante dos sistemas de banco de dados modernos. O servidor de banco de dados codifica e reforça relações como um para um, um para muitos, muitos para um e unicidade. Por exemplo, uma pessoa pode ter zero, um ou vários números de telefone em um banco de dados de endereços; um único número de telefone pode estar associado a vários membros da família. Em um banco de dados financeiro, uma pessoa pode ser obrigada a ter exatamente um CPF, e qualquer CPF só pode ser associado a uma pessoa.

```
The database server can use these relationships to prevent bad data from being inserted, and to find efficient ways to look up information. For example, if a value is declared to be unique, the server can stop searching as soon as the first match is found, and it can reject attempts to insert a second copy of the same value.

At the database level, these relationships are expressed through SQL features such as **columns** within a table, unique and `NOT NULL` **constraints**, **foreign keys**, and different kinds of join operations. Complex relationships typically involve data split between more than one table. Often, the data is **normalized**, so that duplicate values in one-to-many relationships are stored only once.

In a mathematical context, the relations within a database are derived from set theory. For example, the `OR` and `AND` operators of a `WHERE` clause represent the notions of union and intersection.

See Also ACID, column, constraint, foreign key, normalized.
```

relevancia: Na funcionalidade de **pesquisa de texto completo**, um número que indica a semelhança entre a string de busca e os dados no **índice FULLTEXT**. Por exemplo, quando você busca uma palavra única, essa palavra geralmente é mais relevante para uma linha onde ela ocorre várias vezes no texto do que para uma linha onde ela aparece apenas uma vez.

```
See Also full-text search, FULLTEXT index.
```

LEITURA REPETÍVEL: O nível de isolamento padrão para o `InnoDB`. Ele impede que quaisquer linhas consultadas sejam alteradas por outras **transações**, bloqueando assim as **leitura não repetiível**, mas não as **leitura fantasma**. Ele usa uma estratégia de **bloqueio** moderadamente rigorosa para que todas as consultas dentro de uma transação vejam dados do mesmo instantâneo, ou seja, os dados como estavam no momento em que a transação começou.

```
When a transaction with this isolation level performs `UPDATE ... WHERE`, `DELETE ... WHERE`, `SELECT ... FOR UPDATE`, and `LOCK IN SHARE MODE` operations, other transactions might have to wait.

`SELECT ... FOR SHARE` replaces `SELECT ... LOCK IN SHARE MODE` in MySQL 8.0.1, but `LOCK IN SHARE MODE` remains available for backward compatibility.

See Also ACID, consistent read, isolation level, locking, phantom, transaction.
```

repertório: Repertório é um termo aplicado a conjuntos de caracteres. Um repertório de conjunto de caracteres é a coleção de caracteres no conjunto. Veja a Seção 10.2.1, “Repertório de Conjunto de Caracteres”.

Um **servidor** de banco de dados em uma topologia de **replicação** que recebe alterações de outro servidor (a **fonte**) e aplica essas mesmas alterações. Assim, ele mantém o mesmo conteúdo da fonte, embora possa estar um pouco atrasado.

```
In MySQL, replicas are commonly used in disaster recovery, to take the place of a source that fails. They are also commonly used for testing software upgrades and new settings, to ensure that database configuration changes do not cause problems with performance or reliability.

Replicas typically have high workloads, because they process all the **DML** (write) operations relayed from the source, as well as user queries. To ensure that replicas can apply changes from the source fast enough, they frequently have fast I/O devices and sufficient CPU and memory to run multiple database instances on the same server. For example, the source might use hard drive storage while the replicas use **SSD**s.

See Also DML, replication, server, source, SSD.
```

replicação: A prática de enviar alterações de uma **fonte** para uma ou mais **replicas**, de modo que todos os bancos de dados tenham os mesmos dados. Essa técnica tem uma ampla gama de usos, como balanceamento de carga para melhor escalabilidade, recuperação em caso de desastre e teste de atualizações de software e alterações de configuração. As alterações podem ser enviadas entre os bancos de dados por métodos chamados **replicação baseada em linhas** e **replicação baseada em instruções**.

```
See Also replica, row-based replication, source, statement-based replication.
```

Restaurar: O processo de colocar um conjunto de arquivos de backup do produto **MySQL Enterprise Backup** em funcionamento para uso pelo MySQL. Esta operação pode ser realizada para corrigir um banco de dados corrompido, para retornar a um ponto anterior no tempo ou (em um contexto de **replicação**) para configurar uma nova **replica**. No produto **MySQL Enterprise Backup**, esta operação é realizada pela opção `copy-back` do comando `mysqlbackup`.

```
See Also hot backup, MySQL Enterprise Backup, mysqlbackup command, prepared backup, replica, replication.
```

rollback: Uma instrução **SQL** que encerra uma **transação**, anulando quaisquer alterações feitas pela transação. É o oposto de **commit**, que torna permanentes quaisquer alterações feitas na transação.

```
By default, MySQL uses the **autocommit** setting, which automatically issues a commit following each SQL statement. You must change this setting before you can use the rollback technique.

See Also ACID, autocommit, commit, SQL, transaction.
```

segmento de rollback: A área de armazenamento que contém os **logs de desfazer**. Os segmentos de rollback tradicionalmente residiam no **espaço de tabela do sistema**. A partir do MySQL 5.6, os segmentos de rollback podem residir nos **espaços de tabela de desfazer**. A partir do MySQL 5.7, os segmentos de rollback também são alocados ao **espaço de tabela temporário global**.

```
See Also system tablespace, undo log, undo tablespace.
```

linha: A estrutura de dados lógica definida por um conjunto de **colunas**. Um conjunto de linhas compõe uma **tabela**. Dentro dos **arquivos de dados do InnoDB**, cada **página** pode conter uma ou mais linhas.

```
Although `InnoDB` uses the term **row format** for consistency with MySQL syntax, the row format is a property of each table and applies to all rows in that table.

See Also column, data files, page, row format, table.
```

Formato de linha: O formato de armazenamento em disco para **linhas** de uma tabela `InnoDB`. À medida que o `InnoDB` ganha novas funcionalidades, como **compressão**, novos formatos de linha são introduzidos para suportar as melhorias resultantes na eficiência e no desempenho do armazenamento.

```
The row format of an `InnoDB` table is specified by the `ROW_FORMAT` option or by the `innodb_default_row_format` configuration option (introduced in MySQL 5.7.9). Row formats include `REDUNDANT`, `COMPACT`, `COMPRESSED`, and `DYNAMIC`. To view the row format of an `InnoDB` table, issue the `SHOW TABLE STATUS` statement or query `InnoDB` table metadata in the `INFORMATION_SCHEMA`.

See Also compact row format, compressed row format, compression, dynamic row format, redundant row format, row, table.
```

Bloqueio de linha: Um **bloqueio** que impede que uma linha seja acessada de maneira incompatível por outra **transação**. Outras linhas da mesma tabela podem ser escritas livremente por outras transações. Esse é o tipo de **bloqueio** realizado por operações **DML** em tabelas **InnoDB**.

```
Contrast with **table locks** used by `MyISAM`, or during **DDL** operations on `InnoDB` tables that cannot be done with **online DDL**; those locks block concurrent access to the table.

See Also DDL, DML, InnoDB, lock, locking, online DDL, table lock, transaction.
```

replicação baseada em linhas: Uma forma de **replicação** em que os eventos são propagados a partir da **fonte**, especificando como alterar linhas individuais na **replica**. É seguro usar para todas as configurações da opção `innodb_autoinc_lock_mode`.

```
See Also auto-increment locking, innodb\_autoinc\_lock\_mode, replica, replication, source, statement-based replication.
```

Bloqueio de nível de linha: O mecanismo de **bloqueio** usado para tabelas **InnoDB**, que depende de **bloques de linha** em vez de **bloques de tabela**. Várias **transações** podem modificar a mesma tabela simultaneamente. Somente se duas transações tentarem modificar a mesma linha, uma das transações aguarda a conclusão da outra (e libera seus blocos de linha).

```
See Also InnoDB, locking, row lock, table lock, transaction.
```

Ruby: Uma linguagem de programação que enfatiza a tipificação dinâmica e a programação orientada a objetos. Algumas sintaxes são familiares aos desenvolvedores de **Perl**.

```
See Also API, Perl, Ruby API.
```

A API Ruby `mysql2`, baseada na biblioteca de API **libmysqlclient**, está disponível para programadores Ruby que desenvolvem aplicativos MySQL. Para obter mais informações, consulte a Seção 27.11, “APIs Ruby MySQL”.

```
See Also libmysql, Ruby.
```

rw-lock: O objeto de nível baixo que o `InnoDB` usa para representar e impor **blocos de acesso compartilhado** a estruturas de dados internas em memória, seguindo certas regras. Em contraste com os **mutexos**, que o `InnoDB` usa para representar e impor acesso exclusivo a estruturas de dados internas em memória. Mutexos e rw-locks são conhecidos coletivamente como **latches**.

```
`rw-lock` types include `s-locks` (shared locks), `x-locks` (exclusive locks), and `sx-locks` (shared-exclusive locks).

* An `s-lock` provides read access to a common resource.

* An `x-lock` provides write access to a common resource while not permitting inconsistent reads by other threads.

* An `sx-lock` provides write access to a common resource while permitting inconsistent reads by other threads. `sx-locks` were introduced in MySQL 5.7 to optimize concurrency and improve scalability for read-write workloads.

The following matrix summarizes rw-lock type compatibility.

<table summary="Compatibility matrix for rw-lock types. Each cell in the matrix is marked as either Compatible or Conflict."><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th scope="col"></th> <th scope="col"><em class="replaceable"><code>S</code></em></th> <th scope="col"><em class="replaceable"><code>SX</code></em></th> <th scope="col"><em class="replaceable"><code>X</code></em></th> </tr></thead><tbody><tr> <th scope="row"><em class="replaceable"><code>S</code></em></th> <td>Compatible</td> <td>Compatible</td> <td>Conflict</td> </tr><tr> <th scope="row"><em class="replaceable"><code>SX</code></em></th> <td>Compatible</td> <td>Conflict</td> <td>Conflict</td> </tr><tr> <th scope="row"><em class="replaceable"><code>X</code></em></th> <td>Conflict</td> <td>Conflict</td> <td>Conflict</td> </tr></tbody></table>

See Also latch, lock, mutex, Performance Schema.
```

### S

savepoint: Os pontos de salvamento ajudam a implementar **transações aninhadas**. Eles podem ser usados para fornecer escopo para operações em tabelas que fazem parte de uma transação maior. Por exemplo, agendar uma viagem em um sistema de reservas pode envolver a reserva de vários voos diferentes; se um voo desejado estiver indisponível, você pode **reverter** as alterações envolvidas na reserva desse trecho, sem reverter os voos anteriores que foram reservados com sucesso.

```
See Also rollback, transaction.
```

escalabilidade: A capacidade de adicionar mais trabalho e emitir mais solicitações simultâneas a um sistema, sem uma queda súbita no desempenho devido ao excedente dos limites da capacidade do sistema. A arquitetura do software, a configuração do hardware, a codificação da aplicação e o tipo de carga de trabalho desempenham um papel na escalabilidade. Quando o sistema atinge sua capacidade máxima, as técnicas populares para aumentar a escalabilidade são **escalar para cima** (aumentar a capacidade do hardware ou software existente) e **escalar para fora** (adicionar novos servidores e mais instâncias do MySQL). Muitas vezes associadas à **disponibilidade** como aspectos críticos de uma implantação em grande escala.

```
See Also availability, scale out, scale up.
```

escalar para fora: Uma técnica para aumentar a **escalabilidade** adicionando novos servidores e mais instâncias do MySQL. Por exemplo, configurar replicação, NDB Cluster, pool de conexões ou outras funcionalidades que distribuem o trabalho entre um grupo de servidores. Contrasta com **escalar para cima**.

```
See Also scalability, scale up.
```

escalar: Uma técnica para aumentar a **escalabilidade** aumentando a capacidade do hardware ou software existente. Por exemplo, aumentar a memória em um servidor e ajustar parâmetros relacionados à memória, como `innodb_buffer_pool_size` e `innodb_buffer_pool_instances`. Contrasta com **escalar para fora**.

```
See Also scalability, scale out.
```

conceitualmente, um esquema é um conjunto de objetos de banco de dados interconectados, como tabelas, colunas de tabelas, tipos de dados das colunas, índices, chaves estrangeiras, e assim por diante. Esses objetos são conectados através da sintaxe SQL, porque as colunas compõem as tabelas, as chaves estrangeiras referenciam tabelas e colunas, e assim por diante. Idealmente, eles também estão conectados logicamente, trabalhando juntos como parte de uma aplicação unificada ou estrutura flexível. Por exemplo, os bancos de dados **INFORMATION\_SCHEMA** e **performance\_schema** usam “esquema” em seus nomes para enfatizar as relações próximas entre as tabelas e colunas que contêm.

```
In MySQL, physically, a **schema** is synonymous with a **database**. You can substitute the keyword `SCHEMA` instead of `DATABASE` in MySQL SQL syntax, for example using `CREATE SCHEMA` instead of `CREATE DATABASE`.

Some other database products draw a distinction. For example, in the Oracle Database product, a **schema** represents only a part of a database: the tables and other objects owned by a single user.

See Also database, INFORMATION\_SCHEMA, Performance Schema.
```

índice de pesquisa: Nas consultas de pesquisa de texto completo do MySQL, são usados um tipo especial de índice, o **índice FULLTEXT**. Nas versões do MySQL 5.6.4 e superiores, as tabelas `InnoDB` e `MyISAM` suportam índices `FULLTEXT`; anteriormente, esses índices estavam disponíveis apenas para tabelas `MyISAM`.

```
See Also full-text search, FULLTEXT index.
```

índice secundário: um tipo de **índice** do `InnoDB` que representa um subconjunto das colunas da tabela. Uma tabela do `InnoDB` pode ter zero, um ou vários índices secundários (em contraste com o **índice agrupado**, que é necessário para cada tabela `InnoDB` e armazena os dados de todas as colunas da tabela).

```
A secondary index can be used to satisfy queries that only require values from the indexed columns. For more complex queries, it can be used to identify the relevant rows in the table, which are then retrieved through lookups using the clustered index.

Creating and dropping secondary indexes has traditionally involved significant overhead from copying all the data in the `InnoDB` table. The **fast index creation** feature makes both `CREATE INDEX` and `DROP INDEX` statements much faster for `InnoDB` secondary indexes.

See Also clustered index, Fast Index Creation, index.
```

segmento: Uma divisão dentro de um **espaço de tabelas** de `InnoDB`. Se um espaço de tabelas é análogo a um diretório, os segmentos são análogos a arquivos dentro desse diretório. Um segmento pode crescer. Novos segmentos podem ser criados.

```
For example, within a **file-per-table** tablespace, table data is in one segment and each associated index is in its own segment. The **system tablespace** contains many different segments, because it can hold many tables and their associated indexes. Prior to MySQL 8.0, the system tablespace also includes one or more **rollback segments** used for **undo logs**.

Segments grow and shrink as data is inserted and deleted. When a segment needs more room, it is extended by one **extent** (1 megabyte) at a time. Similarly, a segment releases one extent's worth of space when all the data in that extent is no longer needed.

See Also extent, file-per-table, rollback segment, system tablespace, tablespace, undo log.
```

seletividade: Uma propriedade da distribuição de dados, o número de valores distintos em uma coluna (sua **cardinalidade**) dividido pelo número de registros na tabela. Alta seletividade significa que os valores da coluna são relativamente únicos e podem ser recuperados de forma eficiente por meio de um índice. Se você (ou o otimizador de consultas) puder prever que um teste em uma cláusula `WHERE` só corresponde a um pequeno número (ou proporção) de linhas em uma tabela, a consulta **geral** tende a ser eficiente se avaliar esse teste primeiro, usando um índice.

```
See Also cardinality, query.
```

leitura semi-consistente: Um tipo de operação de leitura usada para instruções `UPDATE`, que é uma combinação de **leitura comprometida** e **leitura consistente**. Quando uma instrução `UPDATE` examina uma linha que já está bloqueada, o `InnoDB` retorna a versão comprometida mais recente para o MySQL, para que o MySQL possa determinar se a linha corresponde à condição `WHERE` da `UPDATE`. Se a linha corresponder (deve ser atualizada), o MySQL lê a linha novamente, e desta vez o `InnoDB` a bloqueia ou aguarda por um bloqueio nela. Este tipo de operação de leitura só pode ocorrer quando a transação tem o nível de isolamento **isolamento comprometido** ou quando a opção `innodb_locks_unsafe_for_binlog` está habilitada. `innodb_locks_unsafe_for_binlog` foi removido no MySQL 8.0.

```
See Also consistent read, isolation level, READ COMMITTED.
```

SERIALIZÁVEL: O **nível de isolamento** que utiliza a estratégia de bloqueio mais conservadora, para impedir que outras **transações** insiram ou modifiquem dados que foram lidos por essa transação, até que ela seja concluída. Dessa forma, a mesma consulta pode ser executada repetidamente dentro de uma transação, e você pode ter certeza de que obterá o mesmo conjunto de resultados cada vez. Qualquer tentativa de alterar dados que foram comprometidos por outra transação desde o início da transação atual fará com que a transação atual espere.

```
This is the default isolation level specified by the SQL standard. In practice, this degree of strictness is rarely needed, so the default isolation level for `InnoDB` is the next most strict, **REPEATABLE READ**.

See Also ACID, consistent read, isolation level, locking, REPEATABLE READ, transaction.
```

servidor: Um tipo de programa que funciona continuamente, esperando para receber e agir sobre solicitações de outro programa (o **cliente**). Como muitas vezes um computador inteiro é dedicado a executar um ou mais programas de servidor (como um servidor de banco de dados, um servidor web, um servidor de aplicativos ou uma combinação desses), o termo **servidor** também pode se referir ao computador que executa o software do servidor.

```
See Also client, mysqld.
```

instrução preparada no servidor: Uma **instrução preparada** gerenciada pelo servidor MySQL. Historicamente, problemas com instruções preparadas no servidor levaram os desenvolvedores do **Connector/J** e do **Connector/PHP** a, às vezes, usar **instruções preparadas no lado do cliente** em vez disso. Com as versões modernas do servidor MySQL, instruções preparadas no servidor são recomendadas para desempenho, escalabilidade e eficiência de memória.

```
See Also client-side prepared statement, Connector/J, Connector/PHP, prepared statement.
```

servlet: Veja também Connector/J.

bloco compartilhado: Um tipo de **bloco** que permite que outras **transações** leiam o objeto bloqueado e também adquira outros **blocos** compartilhados sobre ele, mas não o escreva. O oposto de **bloco exclusivo**.

```
See Also exclusive lock, lock, transaction.
```

espaço de tabela compartilhado: Outra maneira de se referir ao **espaço de tabela do sistema** ou a um **espaço de tabela geral**. Os espaços de tabela gerais foram introduzidos no MySQL 5.7. Mais de uma tabela pode residir em um espaço de tabela compartilhado. Apenas uma única tabela pode residir em um espaço de tabela *arquivo por tabela*.

```
See Also general tablespace, system tablespace.
```

ponto de verificação agudo: O processo de **lavagem** em disco de todas as páginas do **pool de buffers** **sujas** cujas entradas de refazer estão contidas em uma parte específica do **log de refazer**. Ocorre antes de o **InnoDB** reutilizar uma parte de um arquivo de log; os arquivos de log são usados de forma circular. Geralmente ocorre com cargas de trabalho **intensivas de escrita**.

```
See Also dirty page, flush, redo log, workload.
```

parada: O processo de parada do servidor MySQL. Por padrão, esse processo limpa as operações das tabelas **InnoDB**, então o **InnoDB** pode ser **lento** para ser parado, mas rápido para ser iniciado mais tarde. Se você pular as operações de limpeza, é **rápido** para ser parado, mas a limpeza deve ser realizada durante o próximo reinício.

```
The shutdown mode for `InnoDB` is controlled by the `innodb_fast_shutdown` option.

See Also fast shutdown, InnoDB, slow shutdown, startup.
```

escravo: Veja réplica.

registro de consultas lentas: um tipo de **registro** usado para o ajuste de desempenho de instruções SQL processadas pelo servidor MySQL. As informações do registro são armazenadas em um arquivo. Você deve habilitar essa funcionalidade para usá-la. Você controla quais categorias de instruções SQL "lentas" são registradas. Para mais informações, consulte a Seção 5.4.5, "O Registro de Consultas Lentas".

```
See Also general query log, log.
```

desligamento lento: Um tipo de **desligamento** que realiza operações adicionais de esvaziamento do **InnoDB** antes de concluir. Também conhecido como **desligamento limpo**. Especificado pelo parâmetro de configuração `innodb_fast_shutdown=0` ou pelo comando `SET GLOBAL innodb_fast_shutdown=0;`. Embora o desligamento em si possa levar mais tempo, esse tempo deve ser economizado na inicialização subsequente.

```
See Also clean shutdown, fast shutdown, shutdown.
```

instantâneo: Uma representação dos dados em um momento específico, que permanece a mesma mesmo quando as alterações são **comitadas** por outras **transações**. Utilizado por certos **níveis de isolamento** para permitir **leitura consistente**.

```
See Also commit, consistent read, isolation level, transaction.
```

buffer de ordenação: O buffer usado para ordenar dados durante a criação de um índice `InnoDB`. O tamanho do buffer de ordenação é configurado usando a opção de configuração `innodb_sort_buffer_size`.

fonte: Um servidor de banco de dados em um cenário de **replicação** que processa as solicitações iniciais de inserção, atualização e exclusão de dados. Essas alterações são propagadas e repetidas em outros servidores conhecidos como **replicas**.

```
See Also replica, replication.
```

ID de espaço: um identificador usado para identificar de forma única um **espaço de tabelas** de `InnoDB` dentro de uma instância do MySQL. O ID de espaço para o **espaço de tabelas do sistema** é sempre zero; esse mesmo ID se aplica a todas as tabelas dentro do espaço de tabelas do sistema ou dentro de um espaço de tabelas geral. Cada **espaço de tabelas por arquivo** e **espaço de tabelas geral** tem seu próprio ID de espaço.

```
Prior to MySQL 5.6, this hardcoded value presented difficulties in moving `InnoDB` tablespace files between MySQL instances. Starting in MySQL 5.6, you can copy tablespace files between instances by using the **transportable tablespace** feature involving the statements `FLUSH TABLES ... FOR EXPORT`, `ALTER TABLE ... DISCARD TABLESPACE`, and `ALTER TABLE ... IMPORT TABLESPACE`. The information needed to adjust the space ID is conveyed in the **.cfg file** which you copy along with the tablespace. See Section 14.6.1.3, “Importing InnoDB Tables” for details.

See Also .cfg file, file-per-table, general tablespace, .ibd file, system tablespace, tablespace, transportable tablespace.
```

arquivo esparso: Um tipo de arquivo que utiliza o espaço do sistema de arquivos de forma mais eficiente, escrevendo metadados que representam blocos vazios no disco em vez de escrever o espaço vazio real. O recurso de **compressão transparente de páginas** do **InnoDB** depende do suporte a arquivos esparsos. Para mais informações, consulte a Seção 14.9.2, “Compressão de Páginas do InnoDB”.

```
See Also hole punching, transparent page compression.
```

spin: Um tipo de operação de **espera** que testa continuamente se um recurso fica disponível. Essa técnica é usada para recursos que geralmente são mantidos apenas por curtos períodos, onde é mais eficiente esperar em um "loop ocupado" do que colocar o thread para dormir e realizar uma troca de contexto. Se o recurso não ficar disponível em um curto período de tempo, o loop de espera cessa e outra técnica de espera é usada.

```
See Also latch, lock, mutex, wait.
```

Primavera: Um framework de aplicação baseado em Java projetado para auxiliar no design de aplicações, fornecendo uma maneira de configurar componentes.

```
See Also J2EE.
```

SQL: O Linguagem de Consulta Estruturada que é padrão para realizar operações de banco de dados. Muitas vezes dividida nas categorias **DDL**, **DML** e **consultas**. O MySQL inclui algumas categorias de declarações adicionais, como **replicação**. Veja o Capítulo 9, *Estrutura da Linguagem* para os blocos de construção da sintaxe SQL, o Capítulo 11, *Tipos de Dados* para os tipos de dados a serem usados para as colunas das tabelas do MySQL, o Capítulo 13, *Declarações SQL* para detalhes sobre as declarações SQL e suas categorias associadas, e o Capítulo 12, *Funções e Operadores* para funções padrão e específicas do MySQL a serem usadas em consultas.

```
See Also DDL, DML, query, replication.
```

SQLState: Um código de erro definido pelo padrão **JDBC**, para o gerenciamento de exceções por aplicações que utilizam **Connector/J**.

```
See Also Connector/J, JDBC.
```

SSD: Abreviação de “disco de estado sólido”. Um tipo de dispositivo de armazenamento com características de desempenho diferentes de um disco rígido tradicional (**HDD**): menor capacidade de armazenamento, mais rápido para leituras aleatórias, sem partes móveis e com várias considerações que afetam o desempenho de escrita. Suas características de desempenho podem influenciar o desempenho de uma **carga de trabalho vinculada a disco**.

```
See Also disk-bound, HDD.
```

SSL: Abreviação de “Secure Sockets Layer”. Fornece a camada de criptografia para a comunicação de rede entre uma aplicação e um servidor de banco de dados MySQL.

```
See Also keystore, truststore.
```

início: O processo de inicialização do servidor MySQL. Geralmente feito por um dos programas listados na Seção 4.3, “Programas de Servidor e Inicialização do Servidor”. O oposto de **shutdown**.

```
See Also shutdown.
```

Intérprete de declarações: Um tipo de **intérprete** para rastrear, depurar ou ampliar as declarações SQL emitidas por um aplicativo de banco de dados. Às vezes também conhecido como **intérprete de comandos**.

```
In **Java** applications using **Connector/J**, setting up this type of interceptor involves implementing the `com.mysql.jdbc.StatementInterceptorV2` interface, and adding a `statementInterceptors` property to the **connection string**.

In **Visual Studio** applications using **Connector/NET**, setting up this type of interceptor involves defining a class that inherits from the `BaseCommandInterceptor` class and specifying that class name as part of the connection string.

See Also command interceptor, connection string, Connector/J, Connector/NET, interceptor, Java, Visual Studio.
```

replicação baseada em declarações: Uma forma de **replicação** em que os comandos SQL são enviados a partir da **fonte** e retransmitidos na **replica**. É necessário ter cuidado com a configuração da opção `innodb_autoinc_lock_mode` para evitar potenciais problemas de sincronização com o **bloqueio de autoincremento**.

```
See Also auto-increment locking, innodb\_autoinc\_lock\_mode, replica, replication, row-based replication, source.
```

estatísticas: Valores estimados relacionados a cada **tabela** e **índice** do **InnoDB**, usados para construir um plano de execução de consultas eficiente. Os principais valores são a **cardinalidade** (número de valores distintos) e o número total de linhas da tabela ou entradas de índice. As estatísticas da tabela representam os dados em seu índice de **chave primária**. As estatísticas de um **índice secundário** representam as linhas cobertas por esse índice.

```
The values are estimated rather than counted precisely because at any moment, different **transactions** can be inserting and deleting rows from the same table. To keep the values from being recalculated frequently, you can enable **persistent statistics**, where the values are stored in `InnoDB` system tables, and refreshed only when you issue an `ANALYZE TABLE` statement.

You can control how **NULL** values are treated when calculating statistics through the `innodb_stats_method` configuration option.

Other types of statistics are available for database objects and database activity through the **INFORMATION\_SCHEMA** and **PERFORMANCE\_SCHEMA** tables.

See Also cardinality, index, INFORMATION\_SCHEMA, NULL, Performance Schema, persistent statistics, primary key, query execution plan, secondary index, table, transaction.
```

stemming: A capacidade de procurar diferentes variações de uma palavra com base em uma palavra raiz comum, como singular e plural, ou tempos verbais passado, presente e futuro. Esta funcionalidade é atualmente suportada na funcionalidade de **pesquisa de texto completo** do `MyISAM`, mas não nos **índices FULLTEXT** para tabelas do `InnoDB`.

```
See Also full-text search, FULLTEXT index.
```

\*\*Em um índice **FULLTEXT**, uma palavra considerada comum ou trivial o suficiente para ser omitida do **índice de pesquisa** e ignorada em consultas de pesquisa. Diferentes configurações controlam o processamento de palavras-chave em tabelas `InnoDB` e `MyISAM`. Consulte a Seção 12.9.4, “Palavras-chave de Texto Completo”, para obter detalhes.

```
See Also FULLTEXT index, search index.
```

motor de armazenamento: Um componente do banco de dados MySQL que realiza o trabalho de baixo nível de armazenamento, atualização e consulta de dados. No MySQL 5.5 e versões superiores, o **InnoDB** é o motor de armazenamento padrão para novas tabelas, substituindo o `MyISAM`. Diferentes motores de armazenamento são projetados com diferentes compromissos entre fatores como uso de memória versus uso de disco, velocidade de leitura versus velocidade de escrita e velocidade versus robustez. Cada motor de armazenamento gerencia tabelas específicas, então nos referimos às tabelas `InnoDB`, `MyISAM` e assim por diante.

```
The **MySQL Enterprise Backup** product is optimized for backing up `InnoDB` tables. It can also back up tables handled by `MyISAM` and other storage engines.

See Also InnoDB, MySQL Enterprise Backup, table type.
```

Coluna gerada armazenada: uma coluna cujos valores são calculados a partir de uma expressão incluída na definição da coluna. Os valores da coluna são avaliados e armazenados quando as linhas são inseridas ou atualizadas. Uma coluna gerada armazenada requer espaço de armazenamento e pode ser indexada.

```
Contrast with **virtual generated column**.

See Also base column, generated column, virtual generated column.
```

objeto armazenado: um programa ou visual armazenado.

programa armazenado: uma rotina armazenada (procedimento ou função), um gatilho ou um evento do Agendamento de Eventos.

rotina armazenada: um procedimento ou função armazenada.

modo rigoroso: O nome geral para a configuração controlada pela opção `innodb_strict_mode`. Ativação desta configuração faz com que certas condições que normalmente são tratadas como avisos sejam consideradas erros. Por exemplo, certas combinações inválidas de opções relacionadas ao **formato de arquivo** e **formato de linha**, que normalmente produzem um aviso e continuam com valores padrão, agora causam o falha da operação `CREATE TABLE`. `innodb_strict_mode` é ativado por padrão no MySQL 5.7.

```
MySQL also has something called strict mode. See Section 5.1.10, “Server SQL Modes”.

See Also file format, innodb\_strict\_mode, row format.
```

sublista: Dentro da estrutura da lista que representa o **pool de buffer**, as páginas que são relativamente antigas e relativamente novas são representadas por diferentes partes da **lista**. Um conjunto de parâmetros controla o tamanho dessas partes e o ponto de divisão entre as páginas novas e antigas.

```
See Also buffer pool, eviction, list, LRU.
```

registro máximo: Um **pseudo-registro** em um índice, representando o **gap** acima do maior valor desse índice. Se uma transação tiver uma instrução como `SELECT ... FROM ... WHERE col > 10 FOR UPDATE;`, e o maior valor na coluna for 20, é um bloqueio no registro máximo que impede outras transações de inserir valores ainda maiores, como 50, 100 e assim por diante.

```
See Also gap, infimum record, pseudo-record.
```

chave suplente: Nome sinônimo para **chave sintética**.

```
See Also synthetic key.
```

chave sintética: Uma coluna indexada, tipicamente uma **chave primária**, onde os valores são atribuídos arbitrariamente. Muitas vezes, isso é feito usando uma coluna de **autoincremento**. Ao tratar o valor como completamente arbitrário, você pode evitar regras excessivamente restritivas e suposições incorretas do aplicativo. Por exemplo, uma sequência numérica representando números de funcionários pode ter uma lacuna se um funcionário foi aprovado para contratação, mas nunca realmente se juntou. Ou o número de funcionário 100 pode ter uma data de contratação mais recente do que o número de funcionário 500, se ele saiu da empresa e depois voltou. Os valores numéricos também produzem valores mais curtos de comprimento previsível. Por exemplo, armazenar códigos numéricos que significam “Rodovia”, “Bulevar”, “Autoestrada”, e assim por diante, é mais eficiente em termos de espaço do que repetir essas strings várias vezes.

```
Also known as a **surrogate key**. Contrast with **natural key**.

See Also auto-increment, natural key, primary key, surrogate key.
```

sistema de tablespace: Um ou mais arquivos de dados (arquivos **ibdata**) que contêm metadados para objetos relacionados ao **InnoDB** (o **dicionário de dados** do **InnoDB**) e as áreas de armazenamento para o **buffer de alterações**, o **buffer de escrita dupla** e, possivelmente, os **registros de desfazer**. Ele também pode conter dados de tabelas e índices para tabelas do **InnoDB** se as tabelas foram criadas no tablespace de sistema em vez de **tablespaces por arquivo** ou **tablespaces gerais**. Os dados e metadados no tablespace de sistema aplicam-se a todos os **bancos de dados** em uma **instância** do MySQL.

```
Prior to MySQL 5.6.7, the default was to keep all `InnoDB` tables and indexes inside the system tablespace, often causing this file to become very large. Because the system tablespace never shrinks, storage problems could arise if large amounts of temporary data were loaded and then deleted. In MySQL 5.7, the default is **file-per-table** mode, where each table and its associated indexes are stored in a separate **.ibd file**. This default makes it easier to use `InnoDB` features that rely on the **Barracuda** file format, such as table **compression**, efficient storage of **off-page columns**, and large index key prefixes (`innodb_large_prefix`).

The `innodb_undo_tablespaces` option defines the number of undo tablespaces for undo logs.

Keeping all table data in the system tablespace or in separate `.ibd` files has implications for storage management in general. The **MySQL Enterprise Backup** product might back up a small set of large files, or many smaller files. On systems with thousands of tables, the file system operations to process thousands of `.ibd` files can cause bottlenecks.

`InnoDB` introduced general tablespaces in MySQL 5.7.6, which are also represented by `.ibd` files. General tablespaces are shared tablespaces created using `CREATE TABLESPACE` syntax. They can be created outside of the MySQL data directory, are capable of holding multiple tables, and support tables of all row formats.

See Also Barracuda, change buffer, compression, data dictionary, database, doublewrite buffer, dynamic row format, file-per-table, general tablespace, .ibd file, ibdata file, innodb\_file\_per\_table, instance, MySQL Enterprise Backup, off-page column, tablespace, undo log.
```

### T

Arquivo .TRG: Um arquivo que contém parâmetros de disparo. Arquivos com essa extensão são sempre incluídos em backups produzidos pelo comando `mysqlbackup` do produto **MySQL Enterprise Backup**.

```
See Also MySQL Enterprise Backup, mysqlbackup command, .TRN file.
```

Arquivo .TRN: Um arquivo que contém informações do namespace do gatilho. Arquivos com essa extensão são sempre incluídos em backups produzidos pelo comando `mysqlbackup` do produto **MySQL Enterprise Backup**.

```
See Also MySQL Enterprise Backup, mysqlbackup command, .TRG file.
```

tabela: Cada tabela do MySQL está associada a um **motor de armazenamento** específico. As tabelas **InnoDB** têm características **físicas** e **lógicas** particulares que afetam o desempenho, a **escalabilidade**, o **backup**, a administração e o desenvolvimento de aplicações.

```
In terms of file storage, an `InnoDB` table belongs to one of the following tablespace types:

* The shared `InnoDB` **system tablespace**, which is comprised of one or more **ibdata files**.

* A **file-per-table** tablespace, comprised of an individual **.ibd file**.

* A shared **general tablespace**, comprised of an individual `.ibd` file. General tablespaces were introduced in MySQL 5.7.6.

**`.ibd`** data files contain both table and **index** data.

`InnoDB` tables created in file-per-table tablespaces can use the **Barracuda** file format, and Barracuda tables can use **DYNAMIC** or **COMPRESSED** row format. These row formats enable `InnoDB` features such as **compression**, efficient storage of **off-page columns**, and large index key prefixes (see `innodb_large_prefix`). General tablespaces support all row formats regardless of the `innodb_file_format` setting.

Up to MySQL 5.7.5, `InnoDB` tables inside the system tablespace had to use the **Antelope** file format for backward compatibility with MySQL 5.1 and earlier. The **Antelope** file format supports **COMPACT** and **REDUNDANT** row format. The system tablespace supports tables that use **DYNAMIC** row format as of MySQL 5.7.6.

The **rows** of an `InnoDB` table are organized into an index structure known as the **clustered index**, with entries sorted based on the **primary key** columns of the table. Data access is optimized for queries that filter and sort on the primary key columns, and each index contains a copy of the associated primary key columns for each entry. Modifying values for any of the primary key columns is an expensive operation. Thus an important aspect of `InnoDB` table design is choosing a primary key with columns that are used in the most important queries, and keeping the primary key short, with rarely changing values.

See Also Antelope, backup, Barracuda, clustered index, compact row format, compressed row format, compression, dynamic row format, Fast Index Creation, file-per-table, .ibd file, index, off-page column, primary key, redundant row format, row, system tablespace, tablespace.
```

bloqueio de tabela: um bloqueio que impede que qualquer outra **transação** acesse uma tabela. O `InnoDB` faz um esforço considerável para tornar esses bloqueios desnecessários, usando técnicas como **DDL online**, **bloqueios de linha** e **leitura consistente** para processar **DML** e **consultas**. Você pode criar esse bloqueio através do SQL usando a instrução `LOCK TABLE`; um dos passos na migração de outros sistemas de banco de dados ou motores de armazenamento do MySQL é remover essas instruções sempre que possível.

```
See Also consistent read, DML, lock, locking, online DDL, query, row lock, table, transaction.
```

varredura da tabela: Veja a varredura completa da tabela.

estatísticas da tabela: Veja as estatísticas.

Tipo de tabela: Sinônimo obsoleto para **motor de armazenamento**. Nos referimos às tabelas `InnoDB`, `MyISAM`, e assim por diante.

```
See Also InnoDB, storage engine.
```

tablespace: Um arquivo de dados que pode armazenar dados para uma ou mais tabelas **InnoDB** e **índices** associados.

```
The **system tablespace** contains the `InnoDB` **data dictionary**, and prior to MySQL 5.6 holds all other `InnoDB` tables by default.

The `innodb_file_per_table` option, enabled by default in MySQL 5.6 and higher, allows tables to be created in their own tablespaces. File-per-table tablespaces support features such as efficient storage of **off-page columns**, table compression, and transportable tablespaces. See Section 14.6.3.2, “File-Per-Table Tablespaces” for details.

`InnoDB` introduced general tablespaces in MySQL 5.7.6. General tablespaces are shared tablespaces created using `CREATE TABLESPACE` syntax. They can be created outside of the MySQL data directory, are capable of holding multiple tables, and support tables of all row formats.

MySQL NDB Cluster also groups its tables into tablespaces. See Section 21.6.11.1, “NDB Cluster Disk Data Objects” for details.

See Also compressed row format, data dictionary, data files, file-per-table, general tablespace, index, innodb\_file\_per\_table, system tablespace, table.
```

Tcl: Uma linguagem de programação originária do mundo de scripts do Unix. Às vezes, é estendida por código escrito em **C**, **C++** ou **Java**. Para a **API** do Tcl de código aberto para o MySQL, consulte a Seção 27.12, “API Tcl do MySQL”.

```
See Also API.
```

tabela temporária: Uma **tabela** cujos dados não precisam ser verdadeiramente permanentes. Por exemplo, as tabelas temporárias podem ser usadas como áreas de armazenamento para resultados intermediários em cálculos ou transformações complicados; esses dados intermediários não precisam ser recuperados após um travamento. Os produtos de banco de dados podem adotar vários atalhos para melhorar o desempenho das operações em tabelas temporárias, sendo menos escrupulosos ao gravar dados no disco e outras medidas para proteger os dados em reinicializações.

```
Sometimes, the data itself is removed automatically at a set time, such as when the transaction ends or when the session ends. With some database products, the table itself is removed automatically too.

See Also table.
```

espaço de tabela temporário: O espaço de tabela para tabelas **temporárias** `InnoDB` não compactadas e objetos relacionados, introduzido no MySQL 5.7. A opção de configuração `innodb_temp_data_file_path` define o caminho relativo, nome, tamanho e atributos dos arquivos de dados do espaço de tabela temporário. Se `innodb_temp_data_file_path` não for especificado, o comportamento padrão é criar um único arquivo de dados de 12 MB auto-extensibile chamado `ibtmp1` no diretório de dados. O espaço de tabela temporário é recriado a cada início do servidor e recebe um ID de espaço gerado dinamicamente. O espaço de tabela temporário não pode residir em um dispositivo bruto. O início é recusado se o espaço de tabela temporário não puder ser criado.

```
The temporary tablespace is removed on normal shutdown or on an aborted initialization. The temporary tablespace is not removed when a crash occurs. In this case, the database administrator may remove the temporary tablespace manually or restart the server with the same configuration, which removes and recreates the temporary tablespace.

See Also temporary table.
```

Coleção de texto: o conjunto de colunas incluídas em um índice **FULLTEXT**.

```
See Also FULLTEXT index.
```

fila: Uma unidade de processamento que, normalmente, é mais leve que um **processo**, permitindo maior **concorrência**.

```
See Also concurrency, master thread, process, Pthreads.
```

Tomcat: Um servidor de aplicações **J2EE** de código aberto, que implementa as tecnologias de programação Java Servlet e JavaServer Pages. É composto por um servidor web e um container de servlet Java. Com o MySQL, geralmente usado em conjunto com o **Connector/J**.

```
See Also J2EE.
```

página rasgada: Uma condição de erro que pode ocorrer devido a uma combinação de configuração do dispositivo de E/S e falha de hardware. Se os dados forem escritos em partes menores que o tamanho da **página** do **InnoDB** (padrão, 16 KB), uma falha de hardware durante a escrita pode resultar em apenas parte de uma página ser armazenada no disco. O **buffer de dupla escrita** do **InnoDB** protege contra essa possibilidade.

```
See Also doublewrite buffer.
```

TPS: Abreviação de “**transações** por segundo”, uma unidade de medida usada em benchmarks. Seu valor depende da **carga de trabalho** representada por um teste de benchmark específico, combinada com fatores que você controla, como a capacidade do hardware e a configuração do banco de dados.

```
See Also transaction, workload.
```

transação: As transações são unidades atômicas de trabalho que podem ser **confirmadas** ou **desfeitas**. Quando uma transação realiza múltiplas alterações no banco de dados, todas as alterações têm sucesso quando a transação é confirmada ou todas as alterações são desfeitas quando a transação é desfeita.

```
Database transactions, as implemented by `InnoDB`, have properties that are collectively known by the acronym **ACID**, for atomicity, consistency, isolation, and durability.

See Also ACID, commit, isolation level, lock, rollback.
```

ID da transação: Um campo interno associado a cada **linha**. Este campo é alterado fisicamente pelas operações `INSERT`, `UPDATE` e `DELETE` para registrar qual **transação** bloqueou a linha.

```
See Also implicit row lock, row, transaction.
```

compactação transparente da página: uma funcionalidade adicionada no MySQL 5.7.8 que permite a compactação de nível de página para tabelas `InnoDB` que residem em espaços de tabelas **por arquivo**. A compactação de página é ativada especificando o atributo `COMPRESSION` com `CREATE TABLE` ou `ALTER TABLE`. Para mais informações, consulte a Seção 14.9.2, “Compactação de Página InnoDB”.

```
See Also file-per-table, hole punching, sparse file.
```

espaço de tabela transportable: Uma funcionalidade que permite que um **espaço de tabela** seja movido de uma instância para outra. Tradicionalmente, isso não era possível para os espaços de tabela `InnoDB` porque todos os dados da tabela faziam parte do **espaço de tabela do sistema**. No MySQL 5.6 e versões posteriores, a sintaxe `FLUSH TABLES ... FOR EXPORT` prepara uma tabela `InnoDB` para ser copiada para outro servidor; executar `ALTER TABLE ... DISCARD TABLESPACE` e `ALTER TABLE ... IMPORT TABLESPACE` no outro servidor traz o arquivo de dados copiado para a outra instância. Um arquivo **.cfg** separado, copiado junto com o **.ibd**, é usado para atualizar o metadados da tabela (por exemplo, o **ID de espaço**) à medida que o espaço de tabela é importado. Consulte a Seção 14.6.1.3, “Importando Tabelas InnoDB”, para obter informações de uso.

```
See Also .cfg file, .ibd file, space ID, system tablespace, tablespace.
```

solução de problemas: O processo de determinar a origem de um problema. Alguns dos recursos para solucionar problemas do MySQL incluem:

```
* Section 2.9.2.1, “Troubleshooting Problems Starting the MySQL Server”
* Section 6.2.17, “Troubleshooting Problems Connecting to MySQL”
* Section B.3.3.2, “How to Reset the Root Password”
* Section B.3.2, “Common Errors When Using MySQL Programs”
* Section 14.22, “InnoDB Troubleshooting”.
```

truncate: Uma operação **DDL** que remove todo o conteúdo de uma tabela, mantendo a tabela e os índices relacionados intactos. Contrasta com **drop**. Embora conceitualmente tenha o mesmo resultado que uma instrução `DELETE` sem cláusula `WHERE`, opera de maneira diferente nos bastidores: o `InnoDB` cria uma nova tabela vazia, exclui a tabela antiga e, em seguida, renomeia a nova tabela para ocupar o lugar da antiga. Como se trata de uma operação **DDL**, não pode ser **desfeita**.

```
If the table being truncated contains **foreign keys** that reference another table, the truncation operation uses a slower method of operation, deleting one row at a time so that corresponding rows in the referenced table can be deleted as needed by any `ON DELETE CASCADE` clause. (MySQL 5.5 and higher do not allow this slower form of truncate, and return an error instead if foreign keys are involved. In this case, use a `DELETE` statement instead.

See Also DDL, drop, foreign key, rollback.
```

truststore: Veja também SSL.

tuplo: Um termo técnico que designa um conjunto ordenado de elementos. É uma noção abstrata, usada em discussões formais sobre a teoria de bancos de dados. No campo de bancos de dados, os tuplos são geralmente representados pelas colunas de uma linha de tabela. Eles também podem ser representados pelos conjuntos de resultados de consultas, por exemplo, consultas que recuperaram apenas algumas colunas de uma tabela ou colunas de tabelas unidas.

```
See Also cursor.
```

Comitamento em duas fases: uma operação que faz parte de uma **transação distribuída**, de acordo com a especificação **XA**. (Às vezes abreviado como 2PC.) Quando várias bases de dados participam da transação, todas as bases de dados **confirmam** as alterações ou todas as bases de dados **anulam** as alterações.

```
See Also commit, rollback, transaction, XA.
```

### U

desfazer: Dados que são mantidos ao longo da vida de uma **transação**, registrando todas as alterações para que possam ser desfeitas em caso de uma operação de **rollback**. Eles são armazenados em **logs de desfazer** dentro do **espaço de tabela do sistema** (no MySQL 5.7 ou versões anteriores) ou em espaços de tabela de desfazer separados. A partir do MySQL 8.0, os logs de desfazer residem em espaços de tabela de desfazer por padrão.

```
See Also rollback, rollback segment, system tablespace, transaction, undo log, undo tablespace.
```

desfazer buffer: Veja o registro de desfazer.

Registro de desfazer: uma área de armazenamento que contém cópias dos dados modificados por **transações ativas**. Se outra transação precisar ver os dados originais (como parte de uma operação de **leitura consistente**), os dados não modificados são recuperados dessa área de armazenamento.

```
In MySQL 5.6 and MySQL 5.7, you can use the `innodb_undo_tablespaces` variable have undo logs reside in **undo tablespaces**, which can be placed on another storage device such as an **SSD**. In MySQL 8.0, undo logs reside in two default undo tablespaces that are created when MySQL is initialized, and additional undo tablespaces can be created using `CREATE UNDO TABLESPACE` syntax.

The undo log is split into separate portions, the **insert undo buffer** and the **update undo buffer**.

See Also consistent read, rollback segment, SSD, system tablespace, transaction, undo tablespace.
```

segmento de registro de desfazer: Uma coleção de **registros de desfazer**. Os segmentos de registro de desfazer existem dentro dos **segmentos de rollback**. Um segmento de registro de desfazer pode conter registros de desfazer de várias transações. Um segmento de registro de desfazer só pode ser usado por uma transação de cada vez, mas pode ser reutilizado após ser liberado na **comissão** ou **descomissão** da transação. Também pode ser referido como um "segmento de desfazer".

```
See Also commit, rollback, rollback segment, undo log.
```

desfazer espaço de tabelas: um espaço de tabelas de desfazer contém **registros de desfazer**. Os registros de desfazer existem dentro de **segmentos de registro de desfazer**, que estão contidos em **segmentos de rollback**. Os segmentos de rollback tradicionalmente residiam no espaço de tabelas do sistema. A partir do MySQL 5.6, os segmentos de rollback podem residir em espaços de tabelas de desfazer. No MySQL 5.6 e no MySQL 5.7, o número de espaços de tabelas de desfazer é controlado pela opção de configuração `innodb_undo_tablespaces`. No MySQL 8.0, dois espaços de tabelas de desfazer padrão são criados quando a instância do MySQL é inicializada, e espaços de tabelas de desfazer adicionais podem ser criados usando a sintaxe `CREATE UNDO TABLESPACE`.

```
For more information, see Section 14.6.3.4, “Undo Tablespaces”.

See Also rollback segment, system tablespace, undo log, undo log segment.
```

Unicode: um sistema para suportar caracteres nacionais, conjuntos de caracteres, páginas de código e outros aspectos de internacionalização de maneira flexível e padronizada.

```
Unicode support is an important aspect of the **ODBC** standard. **Connector/ODBC** 5.1 is a Unicode driver, as opposed to Connector/ODBC 3.51, which is an **ANSI** driver.

See Also ANSI, Connector/ODBC, ODBC.
```

restrição exclusiva: Um tipo de **restrição** que afirma que uma coluna não pode conter valores duplicados. Em termos de álgebra **relacional**, é usada para especificar relações 1-para-1. Para garantir a eficiência na verificação de se um valor pode ser inserido (ou seja, o valor não existe já na coluna), uma restrição exclusiva é suportada por um **índice exclusivo** subjacente.

```
See Also constraint, relational, unique index.
```

índice único: um índice em uma coluna ou conjunto de colunas que possui uma **restrição de unicidade**. Como o índice é conhecido por não conter valores duplicados, certos tipos de consultas e operações de contagem são mais eficientes do que no tipo normal de índice. A maioria das consultas contra esse tipo de índice é simplesmente para determinar se um determinado valor existe ou não. O número de valores no índice é o mesmo que o número de linhas na tabela, ou pelo menos o número de linhas com valores não nulos para as colunas associadas.

```
**Change buffering** optimization does not apply to unique indexes. As a workaround, you can temporarily set `unique_checks=0` while doing a bulk data load into an `InnoDB` table.

See Also cardinality, change buffering, unique constraint, unique key.
```

chave única: O conjunto de colunas (uma ou mais) que compõem um **índice único**. Quando você pode definir uma condição `WHERE` que corresponda exatamente a uma única linha e a consulta possa usar um índice único associado, a pesquisa e o tratamento de erros podem ser realizados de forma muito eficiente.

```
See Also cardinality, unique constraint, unique index.
```

### V

tipo de comprimento variável: um tipo de dados de comprimento variável. Os tipos `VARCHAR`, `VARBINARY`, `BLOB` e `TEXT` são tipos de comprimento variável.

```
`InnoDB` treats fixed-length fields greater than or equal to 768 bytes in length as variable-length fields, which can be stored **off-page**. For example, a `CHAR(255)` column can exceed 768 bytes if the maximum byte length of the character set is greater than 3, as it is with `utf8mb4`.

See Also off-page column, overflow page.
```

vítima: A **transação** que é automaticamente escolhida para ser **anulada** quando um **bloqueio de transação** é detectado. O `InnoDB` anula a transação que atualizou o menor número de linhas.

```
**Deadlock detection** can be disabled using the `innodb_deadlock_detect` configuration option.

See Also deadlock, deadlock detection, innodb\_lock\_wait\_timeout, transaction.
```

exibição: Uma consulta armazenada que, quando invocada, produz um conjunto de resultados. Uma exibição funciona como uma tabela virtual.

coluna virtual: Veja a coluna virtual gerada.

coluna gerada virtualmente: uma coluna cujos valores são calculados a partir de uma expressão incluída na definição da coluna. Os valores da coluna não são armazenados, mas são avaliados quando as linhas são lidas, imediatamente após quaisquer gatilhos `BEFORE`. Uma coluna gerada virtualmente não ocupa espaço de armazenamento. O `InnoDB` suporta índices secundários em colunas geradas virtualmente.

```
Contrast with **stored generated column**.

See Also base column, generated column, stored generated column.
```

índice virtual: um índice virtual é um **índice secundário** em uma ou mais **colunas geradas virtualmente** ou em uma combinação de colunas geradas virtualmente e colunas regulares ou colunas geradas armazenadas. Para mais informações, consulte a Seção 13.1.18.8, “Índices Secundários e Colunas Geradas”.

```
See Also secondary index, stored generated column, virtual generated column.
```

Visual Studio: Para versões compatíveis do Visual Studio, consulte as referências a seguir:

```
* Connector/NET: Connector/NET Versions
* Connector/C++ 8.0: Platform Support and Prerequisites

See Also Connector/C++, Connector/NET.
```

### W

espera: Quando uma operação, como a aquisição de um **bloqueio**, **mutex** ou **latch**, não pode ser concluída imediatamente, o `InnoDB` pausa e tenta novamente. O mecanismo para pausar é elaborado o suficiente para que essa operação tenha seu próprio nome, o **espera**. Os threads individuais são pausados usando uma combinação de agendamento interno do `InnoDB`, chamadas `wait()` do sistema operacional e loops de **rotação** de curta duração.

```
On systems with heavy load and many transactions, you might use the output from the `SHOW INNODB STATUS` command or **Performance Schema** to determine whether threads are spending too much time waiting, and if so, how you can improve **concurrency**.

See Also concurrency, latch, lock, mutex, Performance Schema, spin.
```

Backup quente: Um **backup** feito enquanto o banco de dados está em execução, mas que restringe algumas operações do banco de dados durante o processo de backup. Por exemplo, as tabelas podem se tornar somente de leitura. Para aplicações e sites com alta atividade, você pode preferir um **backup quente**.

```
See Also backup, cold backup, hot backup.
```

aquecer: Para executar um sistema sob uma carga de trabalho típica por algum tempo após a inicialização, para que o **pool de buffer** e outras regiões de memória sejam preenchidas como estariam em condições normais. Esse processo acontece naturalmente ao longo do tempo quando um servidor MySQL é reiniciado ou submetido a uma nova carga de trabalho.

```
Typically, you run a workload for some time to warm up the buffer pool before running performance tests, to ensure consistent results across multiple runs; otherwise, performance might be artificially low during the first run.

In MySQL 5.6, you can speed up the warmup process by enabling the `innodb_buffer_pool_dump_at_shutdown` and `innodb_buffer_pool_load_at_startup` configuration options, to bring the contents of the buffer pool back into memory after a restart. These options are enabled by default in MySQL 5.7. See Section 14.8.3.6, “Saving and Restoring the Buffer Pool State”.

See Also buffer pool, workload.
```

carga de trabalho: A combinação e o volume de operações **SQL** e outras operações de banco de dados, realizadas por um aplicativo de banco de dados durante o uso típico ou de pico. Você pode submeter o banco de dados a uma carga de trabalho específica durante testes de desempenho para identificar **obstruções**, ou durante o planejamento de capacidade.

```
See Also bottleneck, CPU-bound, disk-bound, SQL.
```

tecnologia de otimização que reduz as operações de escrita quando as **páginas sujas** são **limpa** do **pool de buffers** do `InnoDB`. Se uma linha em uma página for atualizada várias vezes ou várias linhas na mesma página forem atualizadas, todas essas alterações são armazenadas nos arquivos de dados em uma única operação de escrita, em vez de uma escrita para cada alteração.

```
See Also buffer pool, dirty page, flush.
```

### X

XA: Uma interface padrão para coordenar **transações distribuídas**, permitindo que múltiplas bases de dados participem de uma transação enquanto mantêm a conformidade **ACID**. Para obter detalhes completos, consulte a Seção 13.3.7, “Transações XA”.

```
XA Distributed Transaction support is enabled by default. If you are not using this feature, you can disable the `innodb_support_xa` configuration option, avoiding the performance overhead of an extra fsync for each transaction.

As of MySQL 5.7.10, disabling `innodb_support_xa` is not permitted as it makes replication unsafe and prevents performance gains associated with **binary log** group commit. The `innodb_support_xa` configuration option is removed in MySQL 8.0.

See Also ACID, binary log, commit, transaction, two-phase commit.
```

### Y

jovem: Uma característica de uma **página** no **pool de buffers** do `InnoDB`, o que significa que ela foi acessada recentemente e, portanto, é movida dentro da estrutura de dados do pool de buffers, para que não seja **limpa** muito cedo pelo algoritmo **LRU**. Esse termo é usado em alguns nomes de colunas do **INFORMATION\_SCHEMA** de tabelas relacionadas ao pool de buffers.

```
See Also buffer pool, flush, INFORMATION\_SCHEMA, LRU, page.
```
