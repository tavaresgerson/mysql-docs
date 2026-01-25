# Glossário MySQL

Estes termos são comumente usados em informações sobre o servidor de banco de dados MySQL. Este glossário foi originalmente uma referência para terminologia sobre o motor de armazenamento InnoDB, e a maioria das definições está relacionada ao InnoDB.

### A

.ARM file: Metadados para tabelas `ARCHIVE`. Contraste com **.ARZ file**. Arquivos com esta extensão são sempre incluídos em backups produzidos pelo comando `mysqlbackup` do produto **MySQL Enterprise Backup**.

    Veja Também .ARZ file, MySQL Enterprise Backup, comando mysqlbackup.

.ARZ file: Dados para tabelas ARCHIVE. Contraste com **.ARM file**. Arquivos com esta extensão são sempre incluídos em backups produzidos pelo comando `mysqlbackup` do produto **MySQL Enterprise Backup**.

    Veja Também .ARM file, MySQL Enterprise Backup, comando mysqlbackup.

ACID: Um acrônimo que significa atomicidade, consistência, isolamento e durabilidade (atomicity, consistency, isolation, and durability). Estas propriedades são desejáveis em um sistema de banco de dados e estão todas intimamente ligadas à noção de uma **transaction**. As características transacionais do `InnoDB` aderem aos princípios ACID.

    As Transactions são unidades de trabalho **atômicas** que podem ser **committed** ou **rolled back**. Quando uma transaction faz múltiplas alterações no Database, todas as alterações são bem-sucedidas quando a transaction é committed, ou todas as alterações são desfeitas quando a transaction é rolled back.

    O Database permanece em um estado consistente em todos os momentos — após cada commit ou rollback, e enquanto as transactions estão em andamento. Se dados relacionados estiverem sendo atualizados em múltiplas Tables, as Queries verão todos os valores antigos ou todos os valores novos, e não uma mistura de valores antigos e novos.

    As Transactions são protegidas (isoladas) umas das outras enquanto estão em andamento; elas não podem interferir umas nas outras ou ver os dados não-committed umas das outras. Este isolamento é alcançado através do mecanismo de **locking**. Usuários experientes podem ajustar o **isolation level**, trocando menos proteção por um aumento no desempenho e **concurrency**, quando podem ter certeza de que as transactions realmente não interferem umas nas outras.

    Os resultados das transactions são duráveis: uma vez que uma operação de commit é bem-sucedida, as alterações feitas por essa transaction estão seguras contra falhas de energia, falhas de sistema, race conditions ou outros perigos potenciais aos quais muitas aplicações não relacionadas a bancos de dados são vulneráveis. A durabilidade geralmente envolve a escrita no armazenamento em Disk, com uma certa redundância para proteger contra falhas de energia ou falhas de software durante as operações de escrita. (No `InnoDB`, o **doublewrite buffer** auxilia na durabilidade.)

    Veja Também atomic, commit, concurrency, doublewrite buffer, isolation level, locking, rollback, transaction.

adaptive flushing: Um algoritmo para tabelas **InnoDB** que suaviza a sobrecarga de I/O introduzida pelos **checkpoints**. Em vez de fazer o **flushing** de todas as **pages** modificadas do **buffer pool** para os **data files** de uma só vez, o MySQL periodicamente faz o flushing de pequenos conjuntos de pages modificadas. O algoritmo adaptive flushing estende este processo estimando a taxa ideal para realizar estes flushes periódicos, com base na taxa de flushing e na velocidade com que as informações de **redo** são geradas.

    Veja Também buffer pool, checkpoint, data files, flush, InnoDB, page, redo log.

adaptive hash index: Uma otimização para tabelas `InnoDB` que pode acelerar as lookups usando operadores `=` e `IN`, construindo um **hash index** na memória. O MySQL monitora as buscas de Index para tabelas `InnoDB` e, se as Queries puderem se beneficiar de um hash index, ele o constrói automaticamente para **pages** de Index que são frequentemente acessadas. Em certo sentido, o adaptive hash index configura o MySQL em tempo de execução para aproveitar a ampla memória principal, aproximando-se da arquitetura de bancos de dados in-memory. Este recurso é controlado pela opção de configuração `innodb_adaptive_hash_index`. Como este recurso beneficia algumas workloads e não outras, e a memória usada para o hash index é reservada no **buffer pool**, geralmente você deve fazer um benchmark com este recurso habilitado e desabilitado.

    O hash index é sempre construído com base em um **B-tree** index existente na Table. O MySQL pode construir um hash index em um prefixo de qualquer comprimento da key definida para o B-tree, dependendo do padrão de buscas contra o Index. Um hash index pode ser parcial; o B-tree index inteiro não precisa ser cached no buffer pool.

    Veja Também B-tree, buffer pool, hash index, page, secondary index.

ADO.NET: Um framework de mapeamento objeto-relacional (ORM) para aplicações construídas usando tecnologias .NET, como **ASP.NET**. Tais aplicações podem se comunicar com o MySQL através do componente **Connector/NET**.

    Veja Também .NET, ASP.net, Connector/NET, Mono, Visual Studio.

AIO: Acrônimo para **asynchronous I/O**. Você pode ver este acrônimo em mensagens ou Keywords do `InnoDB`.

    Veja Também asynchronous I/O.

ANSI: No **ODBC**, um método alternativo de suportar character sets e outros aspectos de internacionalização. Contraste com **Unicode**. O **Connector/ODBC** 3.51 é um driver ANSI, enquanto o Connector/ODBC 5.1 é um driver Unicode.

    Veja Também Connector/ODBC, ODBC, Unicode.

Antelope: O code name para o **file format** original do `InnoDB`. Ele suporta os row formats **REDUNDANT** e **COMPACT**, mas não os row formats mais recentes **DYNAMIC** e **COMPRESSED** disponíveis no file format **Barracuda**.

    Veja Também Barracuda, compact row format, compressed row format, dynamic row format, file format, innodb_file_format, redundant row format.

API: As APIs fornecem acesso de baixo nível ao protocolo MySQL e aos recursos MySQL a partir de programas **client**. Contraste com o acesso de nível superior fornecido por um **Connector**.

    Veja Também C API, client, connector, native C API, Perl API, PHP API, Python API, Ruby API.

application programming interface (API): Um conjunto de funções ou procedimentos. Uma API fornece um conjunto estável de nomes e tipos para funções, procedimentos, parâmetros e valores de retorno.

apply: Quando um backup produzido pelo produto **MySQL Enterprise Backup** não inclui as alterações mais recentes que ocorreram enquanto o backup estava em andamento, o processo de atualização dos arquivos de backup para incluir essas alterações é conhecido como a etapa de **apply**. É especificado pela opção `apply-log` do comando `mysqlbackup`.

    Antes que as alterações sejam aplicadas, nos referimos aos arquivos como um **raw backup**. Depois que as alterações são aplicadas, nos referimos aos arquivos como um **prepared backup**. As alterações são registradas no arquivo **ibbackup_logfile**; uma vez que a etapa de apply é concluída, este arquivo não é mais necessário.

    Veja Também hot backup, ibbackup_logfile, MySQL Enterprise Backup, prepared backup, raw backup.

ASP.net: Um framework para desenvolver aplicações baseadas na Web usando tecnologias e linguagens **.NET**. Tais aplicações podem se comunicar com o MySQL através do componente **Connector/NET**.

    Outra tecnologia para escrever páginas Web server-side com MySQL é o **PHP**.

    Veja Também .NET, ADO.NET, Connector/NET, Mono, PHP, Visual Studio.

assembly: Uma library de código compilado em um sistema **.NET**, acessada através do **Connector/NET**. Armazenado no **GAC** para permitir versioning sem conflitos de nomes.

    Veja Também .NET, GAC.

asynchronous I/O: Um tipo de operação de I/O que permite que outro processamento prossiga antes que o I/O seja concluído. Também conhecido como **nonblocking I/O** e abreviado como **AIO**. O `InnoDB` usa este tipo de I/O para certas operações que podem ser executadas em paralelo sem afetar a confiabilidade do Database, como a leitura de pages no **buffer pool** que não foram realmente solicitadas, mas podem ser necessárias em breve.

    Historicamente, o `InnoDB` usava asynchronous I/O apenas em sistemas Windows. A partir do InnoDB Plugin 1.1 e MySQL 5.5, o `InnoDB` usa asynchronous I/O em sistemas Linux. Esta alteração introduz uma dependência do `libaio`. O asynchronous I/O em sistemas Linux é configurado usando a opção `innodb_use_native_aio`, que é habilitada por padrão. Em outros sistemas tipo Unix, o InnoDB usa apenas synchronous I/O.

    Veja Também buffer pool, nonblocking I/O.

atomic: No contexto SQL, as **transactions** são unidades de trabalho que ou são bem-sucedidas inteiramente (quando **committed**) ou não têm efeito algum (quando **rolled back**). A propriedade indivisível ("atomic") das transactions é o “A” no acrônimo **ACID**.

    Veja Também ACID, commit, rollback, transaction.

atomic DDL: Uma instrução *DDL* atômica é aquela que combina as atualizações do *data dictionary*, as operações do *storage engine* e as escritas do *binary log* associadas a uma operação DDL em uma única transaction atômica. A transaction é totalmente committed ou rolled back, mesmo que o Server pare durante a operação. O suporte a atomic DDL foi adicionado no MySQL 8.0. Para mais informações, consulte Atomic Data Definition Statement Support.

    Veja Também binary log, data dictionary, DDL, storage engine.

atomic instruction: Instruções especiais fornecidas pela CPU, para garantir que operações críticas de baixo nível não possam ser interrompidas.

auto-increment: Uma propriedade de uma Column de Table (especificada pela Keyword `AUTO_INCREMENT`) que adiciona automaticamente uma sequência crescente de valores na Column.

    Isso economiza trabalho para o desenvolvedor, por não ter que produzir novos valores únicos ao inserir novas Rows. Ele fornece informações úteis para o Query optimizer, porque se sabe que a Column não é null e tem valores únicos. Os valores de tal Column podem ser usados como lookup keys em vários contextos e, como são gerados automaticamente, não há razão para alterá-los; por esse motivo, as Columns de Primary Key são frequentemente especificadas como auto-incrementing.

    As Columns auto-increment podem ser problemáticas com statement-based replication, porque a repetição das instruções em uma replica pode não produzir o mesmo conjunto de valores de Column que na source, devido a problemas de tempo. Quando você tem uma Primary Key auto-incrementing, você pode usar statement-based replication apenas com a configuração `innodb_autoinc_lock_mode=1`. Se você tiver `innodb_autoinc_lock_mode=2`, que permite maior concurrency para operações de insert, use **row-based replication** em vez de **statement-based replication**. A configuração `innodb_autoinc_lock_mode=0` não deve ser usada, exceto para fins de compatibilidade.

    O consecutive lock mode (`innodb_autoinc_lock_mode=1`) é a configuração padrão antes do MySQL 8.0.3. A partir do MySQL 8.0.3, o interleaved lock mode (`innodb_autoinc_lock_mode=2`) é o padrão, o que reflete a mudança de statement-based para row-based replication como o tipo de replication padrão.

    Veja Também auto-increment locking, innodb_autoinc_lock_mode, primary key, row-based replication, statement-based replication.

auto-increment locking: A conveniência de uma Primary Key **auto-increment** envolve alguma compensação com a concurrency. No caso mais simples, se uma transaction estiver inserindo valores na Table, quaisquer outras transactions devem esperar para fazer suas próprias inserts nessa Table, para que as Rows inseridas pela primeira transaction recebam valores de Primary Key consecutivos. O `InnoDB` inclui otimizações e a opção `innodb_autoinc_lock_mode` para que você possa configurar um equilíbrio ideal entre sequências previsíveis de valores auto-increment e máxima **concurrency** para operações de insert.

    Veja Também auto-increment, concurrency, innodb_autoinc_lock_mode.

autocommit: Uma configuração que causa uma operação de **commit** após cada instrução **SQL**. Este modo não é recomendado para trabalhar com tabelas `InnoDB` com **transactions** que abrangem várias instruções. Pode ajudar o desempenho para **read-only transactions** em tabelas `InnoDB`, onde minimiza a sobrecarga de **locking** e a geração de dados de **undo**, especialmente no MySQL 5.6.4 e superior. Também é apropriado para trabalhar com tabelas `MyISAM`, onde transactions não são aplicáveis.

    Veja Também commit, locking, read-only transaction, SQL, transaction, undo.

availability: A capacidade de lidar e, se necessário, recuperar-se de falhas no Host, incluindo falhas do MySQL, do sistema operacional ou do Hardware e atividades de manutenção que, de outra forma, poderiam causar downtime. Frequentemente emparelhado com **scalability** como aspectos críticos de uma implementação em larga escala.

    Veja Também scalability.

MySQL Enterprise Backup: Um produto licenciado que executa **hot backups** de Databases MySQL. Ele oferece a maior eficiência e flexibilidade ao fazer backup de tabelas `InnoDB`, mas também pode fazer backup de `MyISAM` e outros tipos de tabelas.

    Veja Também hot backup, InnoDB.

### B

B-tree: Uma estrutura de dados em árvore que é popular para uso em Index de Database. A estrutura é mantida classificada em todos os momentos, permitindo lookup rápida para correspondências exatas (operador equals) e Ranges (por exemplo, operadores greater than, less than e `BETWEEN`). Este tipo de Index está disponível para a maioria dos storage engines, como `InnoDB` e `MyISAM`.

    Como os nós B-tree podem ter muitos filhos, um B-tree não é o mesmo que uma binary tree, que é limitada a 2 filhos por nó.

    Contraste com **hash index**, que está disponível apenas no storage engine `MEMORY`. O storage engine `MEMORY` também pode usar B-tree indexes, e você deve escolher B-tree indexes para tabelas `MEMORY` se algumas Queries usarem operadores de Range.

    O uso do termo B-tree destina-se a uma referência à classe geral de design de Index. As estruturas B-tree usadas pelos storage engines MySQL podem ser consideradas variantes devido a sofisticações não presentes em um design B-tree clássico. Para informações relacionadas, consulte a seção InnoDB Page Structure Fil Header do MySQL Internals Manual.

    Veja Também hash index.

backticks: Identifiers dentro de instruções MySQL SQL devem ser quoted usando o caractere backtick (`` ` ``) se contiverem caracteres especiais ou reserved words. Por exemplo, para se referir a uma Table chamada `FOO#BAR` ou a uma Column chamada `SELECT`, você especificaria os Identifiers como `` `FOO#BAR` `` e `` `SELECT` ``. Como os backticks fornecem um nível extra de segurança, eles são usados extensivamente em instruções SQL geradas por programas, onde os nomes dos Identifiers podem não ser conhecidos antecipadamente.

    Muitos outros sistemas de Database usam aspas duplas (`"`) em torno de tais nomes especiais. Para portabilidade, você pode habilitar o modo `ANSI_QUOTES` no MySQL e usar aspas duplas em vez de backticks para qualificar os nomes dos Identifiers.

    Veja Também SQL.

backup: O processo de copiar alguns ou todos os table data e metadata de uma Instance MySQL, para segurança. Também pode se referir ao conjunto de arquivos copiados. Esta é uma tarefa crucial para DBAs. O inverso deste processo é a operação de **restore**.

    Com o MySQL, os **physical backups** são realizados pelo produto **MySQL Enterprise Backup**, e os **logical backups** são realizados pelo comando `mysqldump`. Estas técnicas têm características diferentes em termos de tamanho e representação dos dados de backup e velocidade (especialmente velocidade da operação de restore).

    Os Backups são classificados ainda como **hot**, **warm** ou **cold** dependendo de quanto interferem na operação normal do Database. (Hot backups têm a menor interferência, cold backups a maior.)

    Veja Também cold backup, hot backup, logical backup, MySQL Enterprise Backup, mysqldump, physical backup, warm backup.

Barracuda: O code name para um **file format** `InnoDB` que suporta o row format **COMPRESSED** que permite a compression de Table InnoDB, e o row format **DYNAMIC** que melhora o layout de armazenamento para Columns de comprimento variável longas.

    O produto **MySQL Enterprise Backup** versão 3.5 e superior suporta o backup de tablespaces que usam o file format Barracuda.

    Veja Também Antelope, compact row format, compressed row format, dynamic row format, file format, file-per-table, general tablespace, innodb_file_format, MySQL Enterprise Backup, row format, system tablespace.

base column: Uma Column de Table não gerada na qual uma stored generated column ou virtual generated column é baseada. Em outras palavras, uma base column é uma Column de Table não gerada que faz parte de uma generated column definition.

    Veja Também generated column, stored generated column, virtual generated column.

beta: Um estágio inicial na vida de um produto de software, quando está disponível apenas para avaliação, geralmente sem um número de Release definido ou um número menor que 1. O `InnoDB` não usa a designação beta, preferindo uma fase de **early adopter** que pode se estender por várias Releases de ponto, levando a uma Release **GA**.

    Veja Também early adopter, GA.

binary log: Um arquivo contendo um registro de todas as instruções ou alterações de Row que tentam alterar Table data. O conteúdo do binary log pode ser replayed para atualizar replicas em um cenário de **replication**, ou para atualizar um Database após restaurar Table data de um backup. O recurso binary logging pode ser ativado e desativado, embora a Oracle recomende sempre habilitá-lo se você usar replication ou realizar backups.

    Você pode examinar o conteúdo do binary log, ou fazer o replay durante a replication ou recovery, usando o comando **mysqlbinlog**. Para informações completas sobre o binary log, consulte Section 5.4.4, “The Binary Log”. Para as opções de configuração do MySQL relacionadas ao binary log, consulte Section 16.1.6.4, “Binary Logging Options and Variables”.

    Para o produto **MySQL Enterprise Backup**, o File name do binary log e a posição atual dentro do arquivo são detalhes importantes. Para registrar esta informação para a source ao fazer um backup em um contexto de replication, você pode especificar a opção `--slave-info`.

    Antes do MySQL 5.0, uma capacidade semelhante estava disponível, conhecida como update log. No MySQL 5.0 e superior, o binary log substitui o update log.

    Veja Também binlog, MySQL Enterprise Backup, replication.

binlog: Um nome informal para o arquivo **binary log**. Por exemplo, você pode ver esta abreviação usada em mensagens de e-mail ou discussões em fóruns.

    Veja Também binary log.

blind query expansion: Um modo especial de **full-text search** habilitado pela cláusula `WITH QUERY EXPANSION`. Ele realiza a busca duas vezes, onde a frase de busca para a segunda busca é a frase de busca original concatenada com os poucos documentos mais altamente relevantes da primeira busca. Esta técnica é aplicável principalmente para frases de busca curtas, talvez apenas uma única palavra. Pode descobrir correspondências relevantes onde o termo de busca preciso não ocorre no documento.

    Veja Também full-text search.

BLOB: Um data type SQL (`TINYBLOB`, `BLOB`, `MEDIUMBLOB` e `LONGBLOB`) para Objects contendo qualquer tipo de binary data, de tamanho arbitrário. Usado para armazenar documentos, Images, arquivos de som e outros tipos de informação que não podem ser facilmente decompostos em Rows e Columns dentro de uma Table MySQL. As técnicas para lidar com BLOBs dentro de uma aplicação MySQL variam com cada **Connector** e **API**. O MySQL `Connector/ODBC` define valores `BLOB` como `LONGVARBINARY`. Para grandes coleções de character data de forma livre, o termo da indústria é **CLOB**, representado pelos data types MySQL `TEXT`.

    Veja Também API, CLOB, connector, Connector/ODBC.

bottleneck: Uma porção de um sistema que é restrita em tamanho ou capacidade, o que tem o efeito de limitar o throughput geral. Por exemplo, uma Memory Area pode ser menor do que o necessário; o acesso a um único recurso necessário pode impedir que múltiplos núcleos de CPU sejam executados simultaneamente; ou esperar que o Disk I/O seja concluído pode impedir que a CPU seja executada em plena capacidade. A remoção de bottlenecks tende a melhorar a **concurrency**. Por exemplo, a capacidade de ter múltiplas instâncias de **buffer pool** `InnoDB` reduz a contenção quando múltiplas sessions leem e escrevem no buffer pool simultaneamente.

    Veja Também buffer pool, concurrency.

bounce: Uma operação de **shutdown** imediatamente seguida por um restart. Idealmente com um período de **warmup** relativamente curto para que o desempenho e o throughput retornem rapidamente a um nível alto.

    Veja Também shutdown.

buddy allocator: Um mecanismo para gerenciar **pages** de tamanhos diferentes no **buffer pool** do InnoDB.

    Veja Também buffer pool, page, page size.

buffer: Uma área de Memory ou Disk usada para armazenamento temporário. Os dados são buffered na Memory para que possam ser escritos no Disk de forma eficiente, com algumas grandes operações de I/O em vez de muitas pequenas. Os dados são buffered no Disk para maior confiabilidade, para que possam ser recuperados mesmo quando um **crash** ou outra falha ocorre no pior momento possível. Os principais tipos de buffers usados pelo InnoDB são o **buffer pool**, o **doublewrite buffer** e o **change buffer**.

    Veja Também buffer pool, change buffer, crash, doublewrite buffer.

buffer pool: A Memory Area que armazena dados `InnoDB` cached para Tables e Indexes. Para eficiência de operações de read de alto volume, o buffer pool é dividido em **pages** que podem potencialmente conter múltiplas Rows. Para eficiência do cache management, o buffer pool é implementado como uma linked list de pages; dados que são raramente usados são aged out do cache, usando uma variação do algoritmo **LRU**. Em sistemas com grande Memory, você pode melhorar a concurrency dividindo o buffer pool em múltiplas **buffer pool instances**.

    Várias status variables do `InnoDB`, tabelas `INFORMATION_SCHEMA` e tabelas `performance_schema` ajudam a monitorar o funcionamento interno do buffer pool. A partir do MySQL 5.6, você pode evitar um longo período de warmup após reiniciar o Server, particularmente para Instances com large buffer pools, salvando o buffer pool state no shutdown do Server e restaurando o buffer pool para o mesmo estado na startup do Server. Consulte Section 14.8.3.6, “Saving and Restoring the Buffer Pool State”.

    Veja Também buffer pool instance, LRU, page, warm up.

buffer pool instance: Qualquer uma das múltiplas regiões nas quais o **buffer pool** pode ser dividido, controladas pela opção de configuração `innodb_buffer_pool_instances`. O total de Memory size especificado por `innodb_buffer_pool_size` é dividido entre todas as buffer pool instances. Geralmente, ter múltiplas buffer pool instances é apropriado para sistemas que alocam múltiplos gigabytes para o buffer pool `InnoDB`, com cada Instance sendo um gigabyte ou maior. Em sistemas que carregam ou buscam grandes quantidades de dados no buffer pool a partir de muitas sessions concorrentes, ter múltiplas buffer pool instances reduz a contenção por acesso exclusivo a estruturas de dados que gerenciam o buffer pool.

    Veja Também buffer pool.

built-in: O storage engine `InnoDB` built-in dentro do MySQL é a forma original de distribuição para o storage engine. Contraste com o **InnoDB Plugin**. A partir do MySQL 5.5, o InnoDB Plugin é merged de volta à code base do MySQL como o storage engine `InnoDB` built-in (conhecido como InnoDB 1.1).

    Esta distinção é importante principalmente no MySQL 5.1, onde um recurso ou correção de bug pode se aplicar ao InnoDB Plugin, mas não ao `InnoDB` built-in, ou vice-versa.

    Veja Também InnoDB.

business rules: Os relacionamentos e sequências de ações que formam a base do software de negócios, usados para administrar uma empresa comercial. Às vezes, essas Rules são ditadas por lei, outras vezes pela política da empresa. O planejamento cuidadoso garante que os relacionamentos codificados e aplicados pelo Database, e as ações realizadas através da application logic, reflitam com precisão as políticas reais da empresa e possam lidar com situações da vida real.

    Por exemplo, um funcionário que deixa uma empresa pode acionar uma sequência de ações do departamento de recursos humanos. O Database de recursos humanos também pode precisar da flexibilidade para representar dados sobre uma pessoa que foi contratada, mas ainda não começou a trabalhar. Fechar uma account em um serviço online pode resultar na remoção de dados de um Database, ou os dados podem ser movidos ou sinalizados para que possam ser recuperados se a account for reaberta. Uma empresa pode estabelecer políticas sobre salários máximos, mínimos e ajustes, além de verificações básicas de sanidade, como o salário não ser um número negativo. Um Database de varejo pode não permitir que uma compra com o mesmo número de série seja devolvida mais de uma vez, ou pode não permitir compras com cartão de crédito acima de um certo valor, enquanto um Database usado para detectar fraude pode permitir esses tipos de coisas.

    Veja Também relational.

### C

.cfg file: Um arquivo metadata usado com o recurso **transportable tablespace** do `InnoDB`. É produzido pelo comando `FLUSH TABLES ... FOR EXPORT`, coloca uma ou mais Tables em um consistent state que pode ser copiado para outro Server. O `.cfg` file é copiado junto com o **.ibd file** correspondente e usado para ajustar os valores internos do `.ibd` file, como o **space ID**, durante a etapa `ALTER TABLE ... IMPORT TABLESPACE`.

    Veja Também .ibd file, space ID, transportable tablespace.

C: Uma programming language que combina portabilidade com desempenho e acesso a recursos de Hardware de baixo nível, tornando-a uma escolha popular para escrever operating systems, drivers e outros tipos de software de sistema. Muitas aplicações complexas, linguagens e módulos reutilizáveis apresentam peças escritas em C, unidas a componentes de alto nível escritos em outras linguagens. Sua sintaxe principal é familiar aos desenvolvedores **C++**, **Java** e **C#**.

    Veja Também C API, C++, C#, Java.

C API: O código C **API** é distribuído com o MySQL. Está incluído na library **libmysqlclient** e permite que programas **C** acessem um Database.

    Veja Também API, C, libmysqlclient.

C#: Uma programming language que combina tipagem forte e recursos orientados a Objects, executada dentro do framework Microsoft **.NET** ou sua contraparte Open Source **Mono**. Frequentemente usada para criar aplicações com o framework **ASP.net**. Sua sintaxe é familiar aos desenvolvedores **C**, **C++** e **Java**.

    Veja Também .NET, ASP.net, C, Connector/NET, C++, Java, Mono.

C++: Uma programming language com sintaxe principal familiar aos desenvolvedores **C**. Fornece acesso a operações de baixo nível para desempenho, combinado com data types de nível superior, recursos orientados a Objects e garbage collection. Para escrever aplicações C++ para MySQL, você usa o componente **Connector/C++**.

    Veja Também C, Connector/C++.

cache: O termo geral para qualquer Memory Area que armazena cópias de dados para lookup frequente ou de alta velocidade. No `InnoDB`, o principal tipo de estrutura de cache é o **buffer pool**.

    Veja Também buffer, buffer pool.

cardinality: O número de valores diferentes em uma **column** de Table. Quando as Queries se referem a Columns que têm um **index** associado, a cardinality de cada Column influencia qual access method é mais eficiente. Por exemplo, para uma Column com um **unique constraint**, o número de valores diferentes é igual ao número de Rows na Table. Se uma Table tiver um milhão de Rows, mas apenas 10 valores diferentes para uma Column específica, cada valor ocorrerá (em média) 100.000 vezes. Uma Query como `SELECT c1 FROM t1 WHERE c1 = 50;` pode, portanto, retornar 1 Row ou um grande número de Rows, e o Database Server pode processar a Query de forma diferente, dependendo da cardinality de `c1`.

    Se os valores em uma Column tiverem uma distribuição muito desigual, a cardinality pode não ser uma boa maneira de determinar o melhor query plan. Por exemplo, `SELECT c1 FROM t1 WHERE c1 = x;` pode retornar 1 Row quando `x=50` e um milhão de Rows quando `x=30`. Em tal caso, você pode precisar usar **index hints** para transmitir conselhos sobre qual lookup method é mais eficiente para uma Query específica.

    A Cardinality também pode se aplicar ao número de valores distintos presentes em múltiplas Columns, como em um **composite index**.

    Veja Também column, composite index, index, index hint, persistent statistics, random dive, selectivity, unique constraint.

change buffer: Uma estrutura de dados especial que registra alterações em **pages** em **secondary indexes**. Estes valores podem resultar de instruções SQL `INSERT`, `UPDATE` ou `DELETE` (**DML**). O conjunto de recursos que envolve o change buffer é conhecido coletivamente como **change buffering**, consistindo em **insert buffering**, **delete buffering** e **purge buffering**.

    As alterações são registradas no change buffer apenas quando a page relevante do secondary index não está no **buffer pool**. Quando a page de Index relevante é trazida para o buffer pool enquanto as alterações associadas ainda estão no change buffer, as alterações para essa page são aplicadas no buffer pool (**merged**) usando os dados do change buffer. Periodicamente, a operação de **purge** que é executada em momentos em que o sistema está majoritariamente idle, ou durante um slow shutdown, escreve as novas pages de Index no Disk. A operação de purge pode escrever os Disk blocks para uma série de valores de Index de forma mais eficiente do que se cada valor fosse escrito no Disk imediatamente.

    Fisicamente, o change buffer faz parte do **system tablespace**, para que as alterações de Index permaneçam buffered em restarts do Database. As alterações são aplicadas (**merged**) apenas quando as pages são trazidas para o buffer pool devido a alguma outra operação de read.

    Os tipos e a quantidade de dados armazenados no change buffer são regidos pelas opções de configuração `innodb_change_buffering` e `innodb_change_buffer_max_size`. Para ver informações sobre os dados atuais no change buffer, emita o comando `SHOW ENGINE INNODB STATUS`.

    Anteriormente conhecido como **insert buffer**.

    Veja Também buffer pool, change buffering, delete buffering, DML, insert buffer, insert buffering, merge, page, purge, purge buffering, secondary index, system tablespace.

change buffering: O termo geral para os recursos que envolvem o **change buffer**, consistindo em **insert buffering**, **delete buffering** e **purge buffering**. As alterações de Index resultantes de instruções SQL, que normalmente poderiam envolver operações de I/O randômicas, são retidas e executadas periodicamente por uma **thread** de background. Esta sequência de operações pode escrever os Disk blocks para uma série de valores de Index de forma mais eficiente do que se cada valor fosse escrito no Disk imediatamente. Controlado pelas opções de configuração `innodb_change_buffering` e `innodb_change_buffer_max_size`.

    Veja Também change buffer, delete buffering, insert buffering, purge buffering.

checkpoint: À medida que as alterações são feitas nas data pages que são cached no **buffer pool**, essas alterações são escritas nos **data files** em algum momento posterior, um processo conhecido como **flushing**. O checkpoint é um registro das alterações mais recentes (representadas por um valor **LSN**) que foram escritas com sucesso nos data files.

    Veja Também buffer pool, data files, flush, fuzzy checkpointing, LSN.

checksum: No `InnoDB`, um mecanismo de validation para detectar corruption quando uma **page** em um **tablespace** é lida do Disk para o **buffer pool** do `InnoDB`. Este recurso é controlado pela opção de configuração `innodb_checksums` no MySQL 5.5. `innodb_checksums` está deprecated no MySQL 5.6.3, substituída por `innodb_checksum_algorithm`.

    O comando **innochecksum** ajuda a diagnosticar problemas de corruption testando os valores de checksum para um **tablespace** file especificado enquanto o MySQL Server está em shutdown.

    O MySQL também usa checksums para fins de replication. Para detalhes, consulte as opções de configuração `binlog_checksum`, `source_verify_checksum` ou `master_verify_checksum`, e `replica_sql_verify_checksum` ou `slave_sql_verify_checksum`.

    Veja Também buffer pool, page, tablespace.

child table: Em um relacionamento de **foreign key**, uma child table é aquela cujas Rows se referem (ou apontam) para Rows em outra Table com um valor idêntico para uma Column específica. Esta é a Table que contém a cláusula `FOREIGN KEY ... REFERENCES` e, opcionalmente, as cláusulas `ON UPDATE` e `ON DELETE`. A Row correspondente na **parent table** deve existir antes que a Row possa ser criada na child table. Os valores na child table podem impedir operações de delete ou update na parent table, ou podem causar automatic deletion ou updates na child table, com base na opção `ON CASCADE` usada ao criar a foreign key.

    Veja Também foreign key, parent table.

clean page: Uma **page** no **buffer pool** do `InnoDB` onde todas as alterações feitas na Memory também foram escritas (**flushed**) nos data files. O oposto de uma **dirty page**.

    Veja Também buffer pool, data files, dirty page, flush, page.

clean shutdown: Um **shutdown** que é concluído sem erros e aplica todas as alterações às tabelas `InnoDB` antes de finalizar, ao contrário de um **crash** ou um **fast shutdown**. Sinônimo de **slow shutdown**.

    Veja Também crash, fast shutdown, shutdown, slow shutdown.

client: Um programa que é executado fora do Database Server, comunicando-se com o Database enviando Requests através de um **Connector**, ou uma **API** disponibilizada através de **client libraries**. Pode ser executado na mesma máquina física que o Database Server, ou em uma máquina remota conectada por uma Network. Pode ser uma application de Database de propósito especial ou um programa de propósito geral, como o processador de linha de comando **mysql**.

    Veja Também API, client libraries, connector, mysql, server.

client libraries: Arquivos contendo coleções de funções para trabalhar com Databases. Ao compilar seu programa com estas libraries, ou instalá-las no mesmo sistema que sua application, você pode executar uma application de Database (conhecida como **client**) em uma máquina que não tem o MySQL Server instalado; a application acessa o Database por uma Network. Com o MySQL, você pode usar a library **libmysqlclient** do próprio MySQL Server.

    Veja Também client, libmysqlclient.

client-side prepared statement: Um tipo de **prepared statement** onde o caching e o reuse são gerenciados localmente, emulando a funcionalidade de **server-side prepared statements**. Historicamente, usado por alguns desenvolvedores **Connector/J**, **Connector/ODBC** e **Connector/PHP** para contornar problemas com stored procedures server-side. Com as versões modernas do MySQL Server, os server-side prepared statements são recomendados para desempenho, scalability e eficiência de Memory.

    Veja Também Connector/J, Connector/ODBC, Connector/PHP, prepared statement.

CLOB: Um data type SQL (`TINYTEXT`, `TEXT`, `MEDIUMTEXT` ou `LONGTEXT`) para Objects contendo qualquer tipo de character data, de tamanho arbitrário. Usado para armazenar documentos baseados em texto, com character set e collation order associados. As técnicas para lidar com CLOBs dentro de uma aplicação MySQL variam com cada **Connector** e **API**. O MySQL Connector/ODBC define valores `TEXT` como `LONGVARCHAR`. Para armazenar binary data, o equivalente é o tipo **BLOB**.

    Veja Também API, BLOB, connector, Connector/ODBC.

clustered index: O termo `InnoDB` para um **primary key** index. O armazenamento da Table `InnoDB` é organizado com base nos valores das Columns da Primary Key, para acelerar Queries e sorts que envolvem as Columns da Primary Key. Para melhor desempenho, escolha as Columns da Primary Key cuidadosamente com base nas Queries mais críticas para o desempenho. Como a modificação das Columns do clustered index é uma operação cara, escolha Columns primárias que raramente ou nunca são atualizadas.

    No produto Oracle Database, este tipo de Table é conhecido como **index-organized table**.

    Veja Também index, primary key, secondary index.

cold backup: Um **backup** feito enquanto o Database está em shutdown. Para aplicações e Websites ocupados, isso pode não ser prático, e você pode preferir um **warm backup** ou um **hot backup**.

    Veja Também backup, hot backup, warm backup.

column: Um item de dado dentro de uma **row**, cujo armazenamento e semântica são definidos por um data type. Cada **table** e **index** é amplamente definido pelo conjunto de Columns que contém.

    Cada Column tem um valor de **cardinality**. Uma Column pode ser a **primary key** para sua Table, ou parte da Primary Key. Uma Column pode estar sujeita a um **unique constraint**, um **NOT NULL constraint**, ou ambos. Os valores em Columns diferentes, mesmo em Tables diferentes, podem ser linked por um relacionamento de **foreign key**.

    Em discussões sobre operações internas do MySQL, às vezes **field** é usado como sinônimo.

    Veja Também cardinality, foreign key, index, NOT NULL constraint, primary key, row, table, unique constraint.

column index: Um **index** em uma única Column.

    Veja Também composite index, index.

column prefix: Quando um **index** é criado com uma especificação de comprimento, como `CREATE INDEX idx ON t1 (c1(N))`, apenas os primeiros N caracteres do Column value são armazenados no Index. Manter o Index prefix pequeno torna o Index compacto, e a economia de Memory e Disk I/O ajuda o desempenho. (Embora tornar o Index prefix muito pequeno possa dificultar o Query optimization, fazendo com que Rows com valores diferentes pareçam duplicatas para o Query optimizer.)

    Para Columns contendo binary values ou long text strings, onde a classificação não é uma consideração importante e armazenar o valor inteiro no Index desperdiçaria espaço, o Index usa automaticamente os primeiros N (geralmente 768) caracteres do valor para fazer lookups e sorts.

    Veja Também index.

command interceptor: Sinônimo de **statement interceptor**. Um aspecto do design pattern **interceptor** disponível para **Connector/NET** e **Connector/J**. O que o Connector/NET chama de command, o Connector/J se refere como statement. Contraste com **exception interceptor**.

    Veja Também Connector/J, Connector/NET, exception interceptor, interceptor, statement interceptor.

commit: Uma instrução **SQL** que encerra uma **transaction**, tornando permanentes quaisquer alterações feitas pela transaction. É o oposto de **rollback**, que desfaz quaisquer alterações feitas na transaction.

    O `InnoDB` usa um mecanismo **optimistic** para commits, para que as alterações possam ser escritas nos data files antes que o commit realmente ocorra. Esta técnica torna o próprio commit mais rápido, com a compensação de que é necessário mais trabalho em caso de um rollback.

    Por padrão, o MySQL usa a configuração **autocommit**, que emite automaticamente um commit após cada instrução SQL.

    Veja Também autocommit, optimistic, rollback, SQL, transaction.

compact row format: O **row format** padrão do `InnoDB` para tabelas InnoDB de MySQL 5.0.3 a MySQL 5.7.8. A partir do MySQL 5.7.9, o row format padrão é definido pela opção de configuração `innodb_default_row_format`, que tem uma configuração padrão de **DYNAMIC**. O row format **COMPACT** fornece uma representação mais compacta para nulls e Columns de comprimento variável do que o padrão anterior (row format **REDUNDANT**).

    Para informações adicionais sobre o row format `COMPACT` do `InnoDB`, consulte Section 14.11, “InnoDB Row Formats”.

    Veja Também Antelope, dynamic row format, file format, redundant row format, row format.

composite index: Um **index** que inclui múltiplas Columns.

    Veja Também index.

compressed backup: O recurso de compression do produto **MySQL Enterprise Backup** faz uma cópia compressed de cada tablespace, alterando a extensão de `.ibd` para `.ibz`. Comprimir os dados de backup permite que você mantenha mais backups à mão e reduz o tempo para transferir backups para um Server diferente. Os dados são uncompressed durante a operação de restore. Quando uma operação de compressed backup processa uma Table que já está compressed, ela ignere a etapa de compression para essa Table, porque comprimir novamente resultaria em pouca ou nenhuma economia de espaço.

    Um conjunto de arquivos produzidos pelo produto **MySQL Enterprise Backup**, onde cada **tablespace** é compressed. Os arquivos compressed são renomeados com uma extensão de arquivo `.ibz`.

    Aplicar **compression** no início do processo de backup ajuda a evitar overhead de armazenamento durante o processo de compression, e a evitar overhead de Network ao transferir os arquivos de backup para outro Server. O processo de **applying** o **binary log** leva mais tempo e requer uncompressing os arquivos de backup.

    Veja Também apply, binary log, compression, hot backup, MySQL Enterprise Backup, tablespace.

compressed row format: Um **row format** que permite **compression** de dados e Index para tabelas `InnoDB`. Foi introduzido no `InnoDB` Plugin, disponível como parte do file format **Barracuda**. Large fields são armazenados longe da page que contém o resto do Row data, como no **dynamic row format**. Ambas as pages de Index e large fields são compressed, resultando em economia de Memory e Disk. Dependendo da estrutura dos dados, a diminuição no uso de Memory e Disk pode ou não superar a sobrecarga de desempenho de uncompressing os dados à medida que são usados. Consulte Section 14.9, “InnoDB Table and Page Compression” para detalhes de uso.

    Para informações adicionais sobre o row format `COMPRESSED` do `InnoDB`, consulte DYNAMIC Row Format.

    Veja Também Barracuda, compression, dynamic row format, row format.

compressed table: Uma Table para a qual os dados são armazenados em compressed form. Para `InnoDB`, é uma Table criada com `ROW_FORMAT=COMPRESSED`. Consulte Section 14.9, “InnoDB Table and Page Compression” para obter mais informações.

    Veja Também compressed row format, compression.

compression: Um recurso com amplos benefícios, desde o uso de menos Disk space, a execução de menos I/O e o uso de menos Memory para caching.

    O `InnoDB` suporta compression em nível de Table e em nível de Page. A compression de Page `InnoDB` também é referida como **transparent page compression**. Para mais informações sobre a compression `InnoDB`, consulte Section 14.9, “InnoDB Table and Page Compression”.

    Outro tipo de compression é o recurso **compressed backup** do produto **MySQL Enterprise Backup**.

    Veja Também Barracuda, buffer pool, compressed backup, compressed row format, DML, transparent page compression.

compression failure: Na verdade, não é um Error, mas sim uma operação cara que pode ocorrer ao usar **compression** em combinação com operações **DML**. Ocorre quando: updates em uma **page** compressed excedem a área na page reservada para registrar modifications; a page é compressed novamente, com todas as alterações aplicadas ao Table data; os dados re-compressed não cabem na page original, exigindo que o MySQL divida os dados em duas novas pages e comprima cada uma separadamente. Para verificar a frequência desta condição, consulte a tabela `INFORMATION_SCHEMA.INNODB_CMP` e verifique quanto o valor da Column `COMPRESS_OPS` excede o valor da Column `COMPRESS_OPS_OK`. Idealmente, as compression failures não ocorrem com frequência; quando ocorrem, você pode ajustar as opções de configuração `innodb_compression_level`, `innodb_compression_failure_threshold_pct` e `innodb_compression_pad_pct_max`.

    Veja Também compression, DML, page.

concatenated index: Consulte composite index.

concurrency: A capacidade de múltiplas operações (em terminologia de Database, **transactions**) serem executadas simultaneamente, sem interferir umas nas outras. A Concurrency também está envolvida com o desempenho, porque, idealmente, a proteção para múltiplas transactions simultâneas funciona com um mínimo de overhead de desempenho, usando mecanismos eficientes para **locking**.

    Veja Também ACID, locking, transaction.

configuration file: O arquivo que contém os valores de **option** usados pelo MySQL na startup. Tradicionalmente, no Linux e Unix este arquivo é chamado `my.cnf`, e no Windows é chamado `my.ini`. Você pode definir várias options relacionadas ao InnoDB na seção `[mysqld]` do arquivo.

    Consulte Section 4.2.2.2, “Using Option Files” para obter informações sobre onde o MySQL busca configuration files.

    Quando você usa o produto **MySQL Enterprise Backup**, você geralmente usa dois configuration files: um que especifica de onde vêm os dados e como eles são estruturados (que pode ser o configuration file original para seu Server), e um reduzido contendo apenas um pequeno conjunto de options que especificam para onde vão os dados de backup e como eles são estruturados. Os configuration files usados com o produto **MySQL Enterprise Backup** devem conter certas options que geralmente são omitidas dos configuration files regulares, então você pode precisar adicionar options ao seu configuration file existente para usar com o **MySQL Enterprise Backup**.

    Veja Também my.cnf, MySQL Enterprise Backup, option, option file.

connection: O canal de comunicação entre uma application e um MySQL Server. O desempenho e a scalability de uma application de Database são influenciados pela rapidez com que uma Database connection pode ser estabelecida, quantas podem ser feitas simultaneamente e por quanto tempo persistem. Os parâmetros como **host**, **port** e assim por diante são representados como uma **connection string** no **Connector/NET** e como um **DSN** no **Connector/ODBC**. Sistemas de alto tráfego utilizam uma otimização conhecida como **connection pool**.

    Veja Também connection pool, connection string, Connector/NET, Connector/ODBC, DSN, host, port.

connection pool: Uma Cache Area que permite que **connections** de Database sejam reused dentro da mesma application ou em diferentes aplicações, em vez de configurar e encerrar uma nova connection para cada Database operation. Esta técnica é comum em application servers **J2EE**. Aplicações **Java** que usam **Connector/J** podem usar os recursos de connection pool do **Tomcat** e de outros application servers. O reuse é transparente para as aplicações; a application ainda abre e fecha a connection como de costume.

    Veja Também connection, Connector/J, J2EE, Tomcat.

connection string: Uma representação dos parâmetros para uma **connection** de Database, codificada como um String literal para que possa ser usada no código do programa. As partes da String representam parâmetros de connection, como **host** e **port**. Uma connection string contém vários pares Key-value, separados por ponto e vírgula. Cada par Key-value é unido por um sinal de igual. Frequentemente usado com aplicações **Connector/NET**; consulte Creating a Connector/NET Connection String para detalhes.

    Veja Também connection, Connector/NET, host, port.

connector: Os Connectors MySQL fornecem conectividade ao MySQL Server para programas **client**. Várias programming languages e frameworks têm seu próprio Connector associado. Contraste com o acesso de nível inferior fornecido por uma **API**.

    Veja Também API, client, Connector/C++, Connector/J, Connector/NET, Connector/ODBC.

Connector/C++: O Connector/C++ 8.0 pode ser usado para acessar MySQL Servers que implementam um document store, ou de forma tradicional usando Queries SQL. Ele permite o desenvolvimento de aplicações C++ usando X DevAPI, ou aplicações C simples usando X DevAPI para C. Também permite o desenvolvimento de aplicações C++ que usam a API legacy baseada em JDBC do Connector/C++ 1.1. Para mais informações, consulte MySQL Connector/C++ 9.5 Developer Guide.

    Veja Também client, connector, JDBC.

Connector/J: Um driver **JDBC** que fornece conectividade para aplicações **client** desenvolvidas na programming language **Java**. Diferentes versões estão disponíveis que são compatíveis com as especificações JDBC 3.0 e JDBC 4.0. O MySQL Connector/J é um driver JDBC Tipo 4: uma implementação pure-Java do protocolo MySQL que não depende das **client libraries** MySQL. Para detalhes completos, consulte MySQL Connector/J Developer Guide.

    Veja Também client, client libraries, connector, Java, JDBC.

Connector/NET: Um **Connector** MySQL para desenvolvedores que escrevem aplicações usando linguagens, tecnologias e frameworks como **C#**, **.NET**, **Mono**, **Visual Studio**, **ASP.net** e **ADO.net**.

    Veja Também ADO.NET, ASP.net, connector, C#, Mono, Visual Studio.

Connector/ODBC: A família de drivers MySQL ODBC que fornecem acesso a um Database MySQL usando o padrão da indústria Open Database Connectivity (**ODBC**) API. Anteriormente chamados de drivers MyODBC. Para detalhes completos, consulte MySQL Connector/ODBC Developer Guide.

    Veja Também connector, ODBC.

Connector/PHP: Uma versão das **APIs** `mysql` e `mysqli` para **PHP** otimizada para o operating system Windows.

    Veja Também connector, PHP, PHP API.

consistent read: Uma operação de read que usa informações de **snapshot** para apresentar resultados de Query com base em um ponto no tempo, independentemente das alterações realizadas por outras transactions em execução ao mesmo tempo. Se os dados consultados foram alterados por outra transaction, os dados originais são reconstruídos com base no conteúdo do **undo log**. Esta técnica evita alguns dos problemas de **locking** que podem reduzir a **concurrency**, forçando transactions a esperar que outras transactions terminem.

    Com o **isolation level** **REPEATABLE READ**, o snapshot é baseado no tempo em que a primeira operação de read é executada. Com o isolation level **READ COMMITTED**, o snapshot é resetado para o tempo de cada consistent read operation.

    Consistent read é o modo padrão no qual o `InnoDB` processa instruções `SELECT` nos isolation levels **READ COMMITTED** e **REPEATABLE READ**. Como uma consistent read não define nenhum Lock nas Tables que acessa, outras sessions estão livres para modificar essas Tables enquanto uma consistent read está sendo executada na Table.

    Para detalhes técnicos sobre os isolation levels aplicáveis, consulte Section 14.7.2.3, “Consistent Nonlocking Reads”.

    Veja Também concurrency, isolation level, locking, READ COMMITTED, REPEATABLE READ, snapshot, transaction, undo log.

constraint: Um teste automático que pode bloquear alterações de Database para evitar que os dados se tornem inconsistentes. (Em termos de computer science, um tipo de assertion relacionado a uma invariant condition.) Constraints são um componente crucial da filosofia `ACID`, para manter a data consistency. Constraints suportadas pelo MySQL incluem `FOREIGN KEY constraints` e `unique constraints`.

    Veja Também ACID, foreign key, unique constraint.

counter: Um valor que é incrementado por um tipo específico de operação `InnoDB`. Útil para medir o quão ocupado um Server está, solucionar as fontes de problemas de desempenho e testar se as alterações (por exemplo, nas configuration settings ou Indexes usados por Queries) têm os efeitos de baixo nível desejados. Diferentes tipos de counters estão disponíveis através de tabelas `Performance Schema` e tabelas `INFORMATION_SCHEMA`, particularmente `INFORMATION_SCHEMA.INNODB_METRICS`.

    Veja Também INFORMATION_SCHEMA, metrics counter, Performance Schema.

covering index: Um `index` que inclui todas as Columns retrieved por uma Query. Em vez de usar os valores do Index como pointers para encontrar as Rows completas da Table, a Query retorna valores da estrutura do Index, economizando Disk I/O. O `InnoDB` pode aplicar esta optimization technique a mais Indexes do que o MyISAM, porque os **secondary indexes** `InnoDB` também incluem as Columns da **primary key**. O `InnoDB` não pode aplicar esta técnica para Queries contra Tables modificadas por uma transaction, até que essa transaction termine.

    Qualquer **column index** ou **composite index** pode atuar como um covering index, dada a Query certa. Projete seus Indexes e Queries para aproveitar esta optimization technique sempre que possível.

    Veja Também column index, composite index, index, primary key, secondary index.

CPU-bound: Um tipo de `workload` onde o `bottleneck` primário são as operações de CPU na Memory. Geralmente envolve operações read-intensive onde os resultados podem ser todos cached no `buffer pool`.

    Veja Também bottleneck, buffer pool, workload.

crash: O MySQL usa o termo “crash” para se referir geralmente a qualquer operação de `shutdown` inesperada onde o Server não pode fazer sua limpeza normal. Por exemplo, um crash pode acontecer devido a uma falha de Hardware na máquina do Database Server ou storage device; uma falha de energia; uma potencial incompatibilidade de dados que faz com que o MySQL Server pare; um **fast shutdown** iniciado pelo DBA; ou muitas outras razões. O robusto e automático **crash recovery** para tabelas `InnoDB` garante que os dados sejam tornados consistentes quando o Server é reiniciado, sem qualquer trabalho extra para o DBA.

    Veja Também crash recovery, fast shutdown, InnoDB, shutdown.

crash recovery: As atividades de cleanup que ocorrem quando o MySQL é iniciado novamente após um **crash**. Para tabelas `InnoDB`, as alterações de transactions incompletas são replayed usando dados do `redo log`. As alterações que foram `committed` antes do crash, mas ainda não foram escritas nos **data files**, são reconstruídas a partir do **doublewrite buffer**. Quando o Database é desligado normalmente, este tipo de atividade é realizada durante o shutdown pela operação de **purge**.

    Durante a operação normal, os dados committed podem ser armazenados no **change buffer** por um período de tempo antes de serem escritos nos data files. Há sempre uma compensação entre manter os data files atualizados, o que introduz overhead de desempenho durante a operação normal, e fazer o buffering dos dados, o que pode fazer com que o shutdown e o crash recovery demorem mais.

    Veja Também change buffer, commit, crash, data files, doublewrite buffer, InnoDB, purge, redo log.

CRUD: Acrônimo para “create, read, update, delete” (criar, ler, atualizar, excluir), uma sequência comum de operações em aplicações de Database. Frequentemente denota uma classe de aplicações com uso de Database relativamente simples (instruções `DDL`, `DML` e `query` básicas em `SQL`) que podem ser implementadas rapidamente em qualquer linguagem.

    Veja Também DDL, DML, query, SQL.

cursor: Uma estrutura de dados interna do MySQL que representa o result set de uma instrução SQL. Frequentemente usado com `prepared statements` e `dynamic SQL`. Funciona como um iterator em outras linguagens de alto nível, produzindo cada valor do result set conforme solicitado.

    Embora o SQL geralmente lide com o processamento de cursors para você, você pode se aprofundar no funcionamento interno ao lidar com código crítico para o desempenho.

    Veja Também dynamic SQL, prepared statement, query.

### D

data definition language: Consulte DDL.

data dictionary: Metadados que rastreiam Objects relacionados ao InnoDB, como **tables**, **indexes** e **columns** de Table. Estes metadados estão localizados fisicamente no **system tablespace** do `InnoDB`. Por razões históricas, ele se sobrepõe em algum grau às informações armazenadas nos **.frm files**.

    Como o produto **MySQL Enterprise Backup** sempre faz backup do system tablespace, todos os backups incluem o conteúdo do data dictionary.

    Veja Também column, file-per-table, .frm file, index, MySQL Enterprise Backup, system tablespace, table.

data directory: O Directory sob o qual cada **instance** MySQL mantém os **data files** para `InnoDB` e os Directories que representam Databases individuais. Controlado pela opção de configuração `datadir`.

    Veja Também data files, instance.

data files: Os arquivos que contêm fisicamente dados de **table** e **index**.

    O **system tablespace** `InnoDB`, que contém o **data dictionary** `InnoDB` e é capaz de armazenar dados para múltiplas tabelas `InnoDB`, é representado por um ou mais `.ibdata` data files.

    File-per-table tablespaces, que contêm dados para uma única Table `InnoDB`, são representados por um `.ibd` data file.

    General tablespaces (introduzidos no MySQL 5.7.6), que podem conter dados para múltiplas tabelas `InnoDB`, também são representados por um `.ibd` data file.

    Veja Também data dictionary, file-per-table, general tablespace, .ibd file, ibdata file, index, system tablespace, table, tablespace.

data manipulation language: Consulte DML.

data warehouse: Um sistema ou application de Database que executa principalmente **queries** grandes. Os dados read-only ou read-mostly podem ser organizados em forma **denormalized** para eficiência de Query. Pode se beneficiar das otimizações para **read-only transactions** no MySQL 5.6 e superior. Contraste com **OLTP**.

    Veja Também denormalized, OLTP, query, read-only transaction.

database: Dentro do **data directory** MySQL, cada Database é representado por um Directory separado. O **system tablespace** InnoDB, que pode conter Table data de múltiplos Databases dentro de uma **instance** MySQL, é mantido em **data files** que residem fora de Directories de Database individuais. Quando o modo **file-per-table** está habilitado, os **.ibd files** que representam tabelas InnoDB individuais são armazenados dentro dos Directories do Database, a menos que sejam criados em outro lugar usando a cláusula `DATA DIRECTORY`. General tablespaces, introduzidos no MySQL 5.7.6, também contêm Table data em **.ibd files**. Ao contrário dos **.ibd files** file-per-table, os **.ibd files** general tablespace podem conter Table data de múltiplos Databases dentro de uma **instance** MySQL e podem ser atribuídos a Directories relativos ou independentes do data directory MySQL.

    Para usuários de longa data do MySQL, um Database é uma noção familiar. Os usuários que vêm de um background do Oracle Database podem achar que o significado do MySQL de um Database é mais próximo do que o Oracle Database chama de **schema**.

    Veja Também data files, file-per-table, .ibd file, instance, schema, system tablespace.

DCL: Data control language, um conjunto de instruções **SQL** para gerenciar privileges. No MySQL, consiste nas instruções `GRANT` e `REVOKE`. Contraste com **DDL** e **DML**.

    Veja Também DDL, DML, SQL.

DDEX provider: Um recurso que permite que você use as ferramentas de Database design dentro do **Visual Studio** para manipular o schema e os Objects dentro de um Database MySQL. Para aplicações MySQL que usam **Connector/NET**, o MySQL Visual Studio Plugin atua como um DDEX provider com MySQL 5.0 e posterior.

    Veja Também Visual Studio.

DDL: Data definition language, um conjunto de instruções **SQL** para manipular o próprio Database em vez de Rows de Table individuais. Inclui todas as formas das instruções `CREATE`, `ALTER` e `DROP`. Também inclui a instrução `TRUNCATE`, porque funciona de forma diferente de uma instrução `DELETE FROM table_name`, embora o efeito final seja semelhante.

    As instruções DDL automaticamente **commit** a **transaction** atual; elas não podem ser **rolled back**.

    O recurso online DDL do `InnoDB` aumenta o desempenho para `CREATE INDEX`, `DROP INDEX` e muitos tipos de operações `ALTER TABLE`. Consulte Section 14.13, “InnoDB and Online DDL” para obter mais informações. Além disso, a configuração file-per-table do `InnoDB` pode afetar o comportamento das operações `DROP TABLE` e `TRUNCATE TABLE`.

    Contraste com **DML** e **DCL**.

    Veja Também commit, DCL, DML, file-per-table, rollback, SQL, transaction.

deadlock: Uma situação em que diferentes **transactions** não conseguem prosseguir, porque cada uma mantém um **lock** que a outra precisa. Como ambas as transactions estão esperando que um recurso se torne disponível, nenhuma delas jamais libera os Locks que mantém.

    Um deadlock pode ocorrer quando as transactions bloqueiam Rows em múltiplas Tables (através de instruções como `UPDATE` ou `SELECT ... FOR UPDATE`), mas na ordem oposta. Um deadlock também pode ocorrer quando tais instruções bloqueiam Ranges de index records e **gaps**, com cada transaction adquirindo alguns Locks, mas não outros, devido a um problema de tempo.

    Para informações de background sobre como os deadlocks são detectados e tratados automaticamente, consulte Section 14.7.5.2, “Deadlock Detection”. Para dicas sobre como evitar e se recuperar de condições de deadlock, consulte Section 14.7.5.3, “How to Minimize and Handle Deadlocks”.

    Veja Também gap, lock, transaction.

deadlock detection: Um mecanismo que detecta automaticamente quando ocorre um **deadlock** e automaticamente **rolls back** uma das **transactions** envolvidas (a **victim**). A deadlock detection pode ser desabilitada usando a opção de configuração `innodb_deadlock_detect`.

    Veja Também deadlock, rollback, transaction, victim.

delete: Quando o `InnoDB` processa uma instrução `DELETE`, as Rows são imediatamente marcadas para deletion e não são mais retornadas por Queries. O armazenamento é recuperado algum tempo depois, durante a periodic garbage collection conhecida como operação de **purge**. Para remover grandes quantidades de dados, operações relacionadas com suas próprias características de desempenho são **TRUNCATE** e **DROP**.

    Veja Também drop, purge, truncate.

delete buffering: A técnica de armazenar alterações em secondary index pages, resultantes de operações `DELETE`, no **change buffer** em vez de escrever as alterações imediatamente, para que as escritas físicas possam ser realizadas para minimizar o I/O randômico. (Como as operações de delete são um processo de duas etapas, esta operação faz o buffering da escrita que normalmente marca um Index record para deletion.) É um dos tipos de **change buffering**; os outros são **insert buffering** e **purge buffering**.

    Veja Também change buffer, change buffering, insert buffer, insert buffering, purge buffering.

denormalized: Uma estratégia de armazenamento de dados que duplica dados em Tables diferentes, em vez de vincular as Tables com **foreign keys** e Queries de **join**. Geralmente usado em aplicações de **data warehouse**, onde os dados não são atualizados após o loading. Em tais aplicações, o desempenho de Query é mais importante do que simplificar a manutenção de dados consistentes durante updates. Contraste com **normalized**.

    Veja Também data warehouse, foreign key, join, normalized.

descending index: Um tipo de **index** disponível com alguns Database systems, onde o armazenamento de Index é otimizado para processar cláusulas `ORDER BY column DESC`. Atualmente, embora o MySQL permita a Keyword `DESC` na instrução `CREATE TABLE`, ele não usa nenhum layout de armazenamento especial para o Index resultante.

    Veja Também index.

dirty page: Uma **page** no **buffer pool** do `InnoDB` que foi atualizada na Memory, onde as alterações ainda não foram escritas (**flushed**) nos **data files**. O oposto de uma **clean page**.

    Veja Também buffer pool, clean page, data files, flush, page.

dirty read: Uma operação de read que recupera dados não confiáveis, dados que foram atualizados por outra transaction, mas ainda não foram **committed**. Só é possível com o **isolation level** conhecido como **read uncommitted**.

    Este tipo de operação não adere ao princípio **ACID** de Database design. É considerado muito arriscado, porque os dados podem ser **rolled back**, ou atualizados ainda mais antes de serem committed; então, a transaction fazendo o dirty read estaria usando dados que nunca foram confirmados como precisos.

    Seu oposto é **consistent read**, onde o `InnoDB` garante que uma transaction não leia informações atualizadas por outra transaction, mesmo que a outra transaction commit nesse meio tempo.

    Veja Também ACID, commit, consistent read, isolation level, READ UNCOMMITTED, rollback.

disk-based: Um tipo de Database que organiza os dados principalmente em Disk storage (hard drives ou equivalente). Os dados são trazidos e levados entre Disk e Memory para serem operados. É o oposto de um **in-memory database**. Embora o `InnoDB` seja disk-based, ele também contém recursos como o **buffer pool**, múltiplas buffer pool instances e o **adaptive hash index** que permitem que certos tipos de workloads trabalhem principalmente a partir da Memory.

    Veja Também adaptive hash index, buffer pool, in-memory database.

disk-bound: Um tipo de **workload** onde o **bottleneck** primário é o Disk I/O. (Também conhecido como **I/O-bound**.) Geralmente envolve escritas frequentes no Disk, ou reads randômicas de mais dados do que podem caber no **buffer pool**.

    Veja Também bottleneck, buffer pool, workload.

DML: Data manipulation language, um conjunto de instruções **SQL** para executar operações `INSERT`, `UPDATE` e `DELETE`. A instrução `SELECT` é às vezes considerada uma instrução DML, porque o formulário `SELECT ... FOR UPDATE` está sujeito às mesmas considerações de **locking** que `INSERT`, `UPDATE` e `DELETE`.

    As instruções DML para uma Table `InnoDB` operam no contexto de uma **transaction**, para que seus efeitos possam ser **committed** ou **rolled back** como uma única unidade.

    Contraste com **DDL** e **DCL**.

    Veja Também commit, DCL, DDL, locking, rollback, SQL, transaction.

document id: No recurso **full-text search** do `InnoDB`, uma Column especial na Table contendo o **FULLTEXT index**, para identificar unicamente o documento associado a cada valor **ilist**. Seu nome é `FTS_DOC_ID` (maiúsculas necessárias). A Column em si deve ser do tipo `BIGINT UNSIGNED NOT NULL`, com um unique index chamado `FTS_DOC_ID_INDEX`. De preferência, você define esta Column ao criar a Table. Se o `InnoDB` tiver que adicionar a Column à Table ao criar um `FULLTEXT` index, a operação de Indexing é consideravelmente mais cara.

    Veja Também full-text search, FULLTEXT index, ilist.

doublewrite buffer: O `InnoDB` usa uma técnica de file flush chamada doublewrite. Antes de escrever **pages** nos **data files**, o `InnoDB` as escreve primeiro em uma storage area chamada doublewrite buffer. Somente depois que a escrita e o flush para o doublewrite buffer forem concluídos, o `InnoDB` escreve as pages em suas posições adequadas no data file. Se houver um operating system, subsistema de armazenamento ou falha de processo **mysqld** no meio de uma Page write, o `InnoDB` pode encontrar uma boa cópia da page no doublewrite buffer durante o **crash recovery**.

    Embora os dados sejam sempre escritos duas vezes, o doublewrite buffer não requer o dobro de overhead de I/O ou o dobro de operações de I/O. Os dados são escritos no próprio buffer como um grande chunk sequencial, com uma única chamada `fsync()` para o operating system.

    Veja Também crash recovery, data files, page, purge.

drop: Um tipo de operação **DDL** que remove um schema Object, através de uma instrução como `DROP TABLE` ou `DROP INDEX`. Ele mapeia internamente para uma instrução `ALTER TABLE`. De uma perspectiva `InnoDB`, as considerações de desempenho de tais operações envolvem o tempo em que o **data dictionary** é locked para garantir que Objects inter-relacionados sejam todos atualizados, e o tempo para atualizar as Memory structures, como o **buffer pool**. Para uma **table**, a operação de drop tem características um tanto diferentes de uma operação de **truncate** (instrução `TRUNCATE TABLE`).

    Veja Também buffer pool, data dictionary, DDL, table, truncate.

DSN: Acrônimo para “Database Source Name”. É a codificação para informações de **connection** dentro do **Connector/ODBC**. Consulte Configuring a Connector/ODBC DSN on Windows para detalhes completos. É o equivalente da **connection string** usada pelo **Connector/NET**.

    Veja Também connection, connection string, Connector/NET, Connector/ODBC.

dynamic cursor: Um tipo de **cursor** suportado pelo **ODBC** que pode pegar resultados novos e alterados quando as Rows são lidas novamente. Se e com que rapidez as alterações são visíveis para o cursor depende do tipo de Table envolvida (transacional ou não transacional) e do isolation level para Tables transacionais. O suporte para dynamic cursors deve ser explicitamente habilitado.

    Veja Também cursor, ODBC.

dynamic row format: Um row format introduzido no `InnoDB` Plugin, disponível como parte do **file format** **Barracuda**. Como os valores de Columns de comprimento variável longos são armazenados fora da page que contém o Row data, é muito eficiente para Rows que incluem large Objects. Como os large fields geralmente não são acessados para avaliar as condições da Query, eles não são trazidos para o **buffer pool** com tanta frequência, resultando em menos operações de I/O e melhor utilização da Cache Memory.

    A partir do MySQL 5.7.9, o row format padrão é definido por `innodb_default_row_format`, que tem um valor padrão de `DYNAMIC`.

    Para informações adicionais sobre o row format `DYNAMIC` do `InnoDB`, consulte DYNAMIC Row Format.

    Veja Também Barracuda, buffer pool, file format, row format.

dynamic SQL: Um recurso que permite que você crie e execute **prepared statements** usando métodos mais robustos, seguros e eficientes para substituir valores de Parameter do que a técnica ingênua de concatenar as partes da instrução em uma String variable.

    Veja Também prepared statement.

dynamic statement: Um **prepared statement** criado e executado através de **dynamic SQL**.

    Veja Também dynamic SQL, prepared statement.

### E

early adopter: Um estágio semelhante ao **beta**, quando um produto de software é tipicamente avaliado quanto ao desempenho, funcionalidade e compatibilidade em um ambiente não-mission-critical.

    Veja Também beta.

Eiffel: Uma programming language que inclui muitos recursos orientados a Objects. Alguns de seus conceitos são familiares aos desenvolvedores **Java** e **C#**. Para a **API** Eiffel Open Source para MySQL, consulte Section 27.13, “MySQL Eiffel Wrapper”.

    Veja Também API, C#, Java.

embedded: A library do MySQL Server embedded (**libmysqld**) torna possível executar um MySQL Server full-featured dentro de uma application **client**. Os principais benefícios são maior velocidade e gerenciamento mais simples para embedded applications.

    Veja Também client, libmysqld.

error log: Um tipo de **log** mostrando informações sobre a startup do MySQL e erros críticos de tempo de execução e informações de **crash**. Para detalhes, consulte Section 5.4.2, “The Error Log”.

    Veja Também crash, log.

eviction: O processo de remover um item de um cache ou outra storage area temporária, como o **buffer pool** do `InnoDB`. Frequentemente, mas nem sempre, usa o algoritmo **LRU** para determinar qual item remover. Quando uma **dirty page** é evicted, seu conteúdo é **flushed** para o Disk, e quaisquer **neighbor pages** dirty podem ser flushed também.

    Veja Também buffer pool, dirty page, flush, LRU, neighbor page.

exception interceptor: Um tipo de **interceptor** para tracing, debugging ou aumentar erros SQL encontrados por uma application de Database. Por exemplo, o código do interceptor pode emitir uma instrução `SHOW WARNINGS` para recuperar informações adicionais e adicionar texto descritivo ou até mesmo alterar o tipo da exception retornada à application. Como o código do interceptor só é chamado quando as instruções SQL retornam erros, ele não impõe nenhuma penalidade de desempenho na application durante a operação normal (sem erros).

    Em aplicações **Java** que usam **Connector/J**, configurar este tipo de interceptor envolve implementar a interface `com.mysql.jdbc.ExceptionInterceptor` e adicionar uma propriedade `exceptionInterceptors` à **connection string**.

    Em aplicações **Visual Studio** que usam **Connector/NET**, configurar este tipo de interceptor envolve definir uma classe que herda da classe `BaseExceptionInterceptor` e especificar esse nome de classe como parte da connection string.

    Veja Também Connector/J, Connector/NET, interceptor, Java, Visual Studio.

exclusive lock: Um tipo de **lock** que impede que qualquer outra **transaction** bloqueie a mesma Row. Dependendo do transaction **isolation level**, este tipo de Lock pode bloquear outras transactions de escreverem na mesma Row, ou também pode bloquear outras transactions de lerem a mesma Row. O isolation level padrão do `InnoDB`, **REPEATABLE READ**, permite maior **concurrency** permitindo que transactions leiam Rows que têm exclusive locks, uma técnica conhecida como **consistent read**.

    Veja Também concurrency, consistent read, isolation level, lock, REPEATABLE READ, shared lock, transaction.

extent: Um grupo de **pages** dentro de um **tablespace**. Para o **page size** padrão de 16KB, um extent contém 64 pages. No MySQL 5.6, o page size para uma **instance** `InnoDB` pode ser 4KB, 8KB ou 16KB, controlado pela opção de configuração `innodb_page_size`. Para pages sizes de 4KB, 8KB e 16KB, o extent size é sempre 1MB (ou 1048576 bytes).

    O suporte para pages sizes `InnoDB` de 32KB e 64KB foi adicionado no MySQL 5.7.6. Para um page size de 32KB, o extent size é de 2MB. Para um page size de 64KB, o extent size é de 4MB.

    Recursos `InnoDB` como **segments**, Requests de **read-ahead** e o **doublewrite buffer** usam operações de I/O que leem, escrevem, alocam ou liberam dados um extent de cada vez.

    Veja Também doublewrite buffer, page, page size, read-ahead, segment, tablespace.

### F

.frm file: Um arquivo contendo os metadados, como a Table definition, de uma Table MySQL.

    Para backups, você deve sempre manter o conjunto completo de `.frm files` junto com os dados de backup para poder restaurar Tables que são alteradas ou dropped após o backup.

    Embora cada Table `InnoDB` tenha um `.frm file`, o `InnoDB` mantém seus próprios metadados de Table no **system tablespace**.

    Os `.frm files` são backed up pelo produto **MySQL Enterprise Backup**. Estes arquivos não devem ser modificados por uma operação `ALTER TABLE` enquanto o backup está ocorrendo, e é por isso que os backups que incluem tabelas não-`InnoDB` executam uma operação `FLUSH TABLES WITH READ LOCK` para congelar tal atividade durante o backup dos `.frm files`. Restaurar um backup pode resultar na criação, alteração ou remoção de `.frm files` para corresponder ao estado do Database no momento do backup.

    Veja Também data dictionary, MySQL Enterprise Backup, system tablespace.

failover: A capacidade de alternar automaticamente para um Server em Standby no caso de uma falha. No contexto MySQL, failover envolve um Database Server em Standby. Frequentemente suportado em ambientes **J2EE** pelo application server ou framework.

    Veja Também Connector/J, J2EE.

Fast Index Creation: Uma capacidade introduzida pela primeira vez no InnoDB Plugin, agora parte do MySQL em 5.5 e superior, que acelera a criação de **secondary indexes** `InnoDB` evitando a necessidade de reescrever completamente a Table associada. O speedup também se aplica ao dropping de secondary indexes.

    Como a manutenção de Index pode adicionar overhead de desempenho a muitas operações de data transfer, considere fazer operações como `ALTER TABLE ... ENGINE=INNODB` ou `INSERT INTO ... SELECT * FROM ...` sem quaisquer secondary indexes em vigor e criar os Indexes posteriormente.

    No MySQL 5.6, este recurso se torna mais geral. Você pode ler e escrever em Tables enquanto um Index está sendo criado, e muitos mais tipos de operações `ALTER TABLE` podem ser executadas sem copiar a Table, sem bloquear operações **DML** ou ambos. Assim, no MySQL 5.6 e superior, este conjunto de recursos é referido como **online DDL** em vez de Fast Index Creation.

    Para informações relacionadas, consulte Section 14.13, “InnoDB and Online DDL”.

    Veja Também DML, index, online DDL, secondary index.

fast shutdown: O procedimento de **shutdown** padrão para `InnoDB`, baseado na configuration setting `innodb_fast_shutdown=1`. Para economizar tempo, certas operações de **flush** são ignoradas. Este tipo de shutdown é seguro durante o uso normal, porque as operações de flush são realizadas durante a próxima startup, usando o mesmo mecanismo que no **crash recovery**. Nos casos em que o Database está sendo desligado para um upgrade ou downgrade, faça um **slow shutdown** em vez disso para garantir que todas as alterações relevantes sejam aplicadas aos **data files** durante o shutdown.

    Veja Também crash recovery, data files, flush, shutdown, slow shutdown.

file format: O file format para tabelas `InnoDB`, habilitado usando a opção de configuração `innodb_file_format`. Os file formats suportados são **Antelope** e **Barracuda**. Antelope é o file format `InnoDB` original e suporta os row formats **REDUNDANT** e **COMPACT**. Barracuda é o file format `InnoDB` mais recente e suporta os row formats **COMPRESSED** e **DYNAMIC**.

    Veja Também Antelope, Barracuda, file-per-table, .ibd file, ibdata file, row format.

file-per-table: Um nome geral para a configuração controlada pela opção `innodb_file_per_table`, que é uma importante configuration option que afeta aspectos do file storage `InnoDB`, availability de recursos e características de I/O. A partir do MySQL 5.6.7, `innodb_file_per_table` está habilitado por padrão.

    Com a opção `innodb_file_per_table` habilitada, você pode criar uma Table em seu próprio **.ibd file** em vez de nos **ibdata files** compartilhados do **system tablespace**. Quando o Table data é armazenado em um **.ibd file** individual, você tem mais flexibilidade para escolher **row formats** necessários para recursos como **compression** de dados. A operação `TRUNCATE TABLE` também é mais rápida, e o espaço recuperado pode ser usado pelo operating system em vez de permanecer reservado para o `InnoDB`.

    O produto **MySQL Enterprise Backup** é mais flexível para Tables que estão em seus próprios arquivos. Por exemplo, Tables podem ser excluídas de um backup, mas apenas se estiverem em arquivos separados. Assim, esta configuração é adequada para Tables que são backed up com menos frequência ou em um Schedule diferente.

    Veja Também compressed row format, compression, file format, .ibd file, ibdata file, innodb_file_per_table, MySQL Enterprise Backup, row format, system tablespace.

fill factor: Em um **index** `InnoDB`, a proporção de uma **page** que é ocupada por Index data antes que a page seja split. O espaço não utilizado quando o Index data é dividido pela primeira vez entre pages permite que as Rows sejam atualizadas com valores de String mais longos sem exigir operações caras de manutenção de Index. Se o fill factor for muito baixo, o Index consome mais espaço do que o necessário, causando overhead extra de I/O ao ler o Index. Se o fill factor for muito alto, qualquer update que aumente o comprimento dos Column values pode causar overhead extra de I/O para a manutenção de Index. Consulte Section 14.6.2.2, “The Physical Structure of an InnoDB Index” para obter mais informações.

    Veja Também index, page.

fixed row format: Este row format é usado pelo storage engine `MyISAM`, não pelo `InnoDB`. Se você criar uma Table `InnoDB` com a opção `ROW_FORMAT=FIXED` no MySQL 5.7.6 ou anterior, o `InnoDB` usa o **compact row format** em vez disso, embora o valor `FIXED` ainda possa aparecer em output, como relatórios `SHOW TABLE STATUS`. A partir do MySQL 5.7.7, o `InnoDB` retorna um Error se `ROW_FORMAT=FIXED` for especificado.

    Veja Também compact row format, row format.

flush: Escrever alterações nos Database files, que foram buffered em uma Memory Area ou em uma storage area de Disk temporária. As estruturas de armazenamento `InnoDB` que são periodicamente flushed incluem o **redo log**, o **undo log** e o **buffer pool**.

    O Flushing pode acontecer porque uma Memory Area fica cheia e o sistema precisa liberar algum espaço, porque uma operação de **commit** significa que as alterações de uma transaction podem ser finalizadas, ou porque uma operação de **slow shutdown** significa que todo o trabalho pendente deve ser finalizado. Quando não é crítico fazer o flush de todos os dados buffered de uma só vez, o `InnoDB` pode usar uma técnica chamada **fuzzy checkpointing** para fazer o flush de pequenos batches de pages para distribuir o overhead de I/O.

    Veja Também buffer pool, commit, fuzzy checkpointing, redo log, slow shutdown, undo log.

flush list: Uma estrutura de dados interna do `InnoDB` que rastreia **dirty pages** no **buffer pool**: ou seja, **pages** que foram alteradas e precisam ser escritas de volta no Disk. Esta estrutura de dados é atualizada frequentemente por **mini-transactions** internas do `InnoDB` e, portanto, é protegida por seu próprio **mutex** para permitir acesso concorrente ao buffer pool.

    Veja Também buffer pool, dirty page, LRU, mini-transaction, mutex, page, page cleaner.

foreign key: Um tipo de relacionamento de pointer, entre Rows em Tables `InnoDB` separadas. O relacionamento de foreign key é definido em uma Column tanto na **parent table** quanto na **child table**.

    Além de permitir lookup rápida de informações relacionadas, as foreign keys ajudam a aplicar a **referential integrity**, impedindo que qualquer um destes pointers se torne inválido à medida que os dados são inserted, updated e deleted. Este enforcement mechanism é um tipo de **constraint**. Uma Row que aponta para outra Table não pode ser inserted se o valor da foreign key associada não existir na outra Table. Se uma Row for deleted ou seu valor de foreign key for alterado, e Rows em outra Table apontarem para esse valor de foreign key, a foreign key pode ser configurada para impedir a deletion, fazer com que os valores de Column correspondentes na outra Table se tornem **null**, ou deletar automaticamente as Rows correspondentes na outra Table.

    Um dos estágios no design de um Database **normalized** é identificar dados que são duplicated, separar esses dados em uma nova Table e configurar um relacionamento de foreign key para que as múltiplas Tables possam ser queried como uma única Table, usando uma operação de **join**.

    Veja Também child table, FOREIGN KEY constraint, join, normalized, NULL, parent table, referential integrity, relational.

FOREIGN KEY constraint: O tipo de **constraint** que mantém a data consistency através de um relacionamento de **foreign key**. Como outros tipos de constraints, ele pode impedir que dados sejam inserted ou updated se os dados se tornarem inconsistentes; neste caso, a inconsistency que está sendo prevenida é entre dados em múltiplas Tables. Alternativamente, quando uma operação **DML** é executada, os constraints `FOREIGN KEY` podem fazer com que os dados em **child rows** sejam deleted, alterados para valores diferentes ou definidos como **null**, com base na opção `ON CASCADE` especificada ao criar a foreign key.

    Veja Também child table, constraint, DML, foreign key, NULL.

FTS: Na maioria dos contextos, um acrônimo para **full-text search**. Às vezes, em discussões de desempenho, um acrônimo para **full table scan**.

    Veja Também full table scan, full-text search.

full backup: Um **backup** que inclui todas as **tables** em cada **database** MySQL e todos os Databases em uma **instance** MySQL. Contraste com **partial backup**.

    Veja Também backup, database, instance, partial backup, table.

full table scan: Uma operação que requer a leitura do conteúdo inteiro de uma Table, em vez de apenas porções selecionadas usando um **index**. Geralmente realizada com pequenas lookup tables, ou em situações de data warehousing com Tables grandes onde todos os dados disponíveis são aggregated e analyzed. A frequência com que estas operações ocorrem, e os tamanhos das Tables em relação à Memory disponível, têm implicações para os algoritmos usados no Query optimization e no gerenciamento do **buffer pool**.

    O objetivo dos Indexes é permitir lookups para valores específicos ou Ranges de valores dentro de uma Table grande, evitando assim full table scans quando prático.

    Veja Também buffer pool, index.

full-text search: O recurso MySQL para encontrar words, phrases, Boolean combinations of words e assim por diante dentro de Table data, de uma forma mais rápida, conveniente e flexível do que usar o operador SQL `LIKE` ou escrever seu próprio search algorithm em nível de application. Ele usa a função SQL `MATCH()` e **FULLTEXT indexes**.

    Veja Também FULLTEXT index.

FULLTEXT index: O tipo especial de **index** que contém o **search index** no mecanismo **full-text search** do MySQL. Representa as words dos valores de uma Column, omitindo quaisquer que sejam especificadas como **stopwords**. Originalmente, disponível apenas para tabelas `MyISAM`. A partir do MySQL 5.6.4, também está disponível para tabelas **InnoDB**.

    Veja Também full-text search, FULLTEXT index, index, search index, stopword.

fuzzy checkpointing: Uma técnica que **flushes** pequenos batches de **dirty pages** do **buffer pool**, em vez de fazer o flushing de todas as dirty pages de uma vez, o que interromperia o Database processing.

    Veja Também buffer pool, dirty page, flush.

### G

GA: “Geralmente disponível” (Generally available), o estágio em que um produto de software sai do **beta** e está disponível para venda, suporte oficial e uso em produção.

    Veja Também beta.

GAC: Acrônimo para “Global Assembly Cache”. Uma área central para armazenar libraries (**assemblies**) em um sistema **.NET**. Consiste fisicamente em nested folders, tratadas como uma única virtual folder pelo CLR **.NET**.

    Veja Também .NET, assembly.

gap: Um local em uma estrutura de dados **index** `InnoDB` onde novos valores podem ser inserted. Quando você bloqueia um conjunto de Rows com uma instrução como `SELECT ... FOR UPDATE`, o `InnoDB` pode criar Locks que se aplicam aos gaps, bem como aos valores reais no Index. Por exemplo, se você selecionar todos os valores maiores que 10 para update, um gap lock impede que outra transaction insira um novo valor maior que 10. O **supremum record** e o **infimum record** representam os gaps contendo todos os valores maiores ou menores que todos os valores de Index atuais.

    Veja Também concurrency, gap lock, index, infimum record, isolation level, supremum record.

gap lock: Um **lock** em um **gap** entre index records, ou um Lock no gap antes do primeiro ou depois do último index record. Por exemplo, `SELECT c1 FROM t WHERE c1 BETWEEN 10 and 20 FOR UPDATE;` impede que outras transactions insiram um valor de 15 na Column `t.c1`, independentemente de já haver ou não tal valor na Column, porque os gaps entre todos os valores existentes no Range estão locked. Contraste com **record lock** e **next-key lock**.

    Gap locks fazem parte da compensação entre desempenho e **concurrency** e são usados em alguns transaction **isolation levels** e não em outros.

    Veja Também gap, infimum record, lock, next-key lock, record lock, supremum record.

general log: Consulte general query log.

general query log: Um tipo de **log** usado para diagnosis e troubleshooting de instruções SQL processadas pelo MySQL Server. Pode ser armazenado em um arquivo ou em uma Database table. Você deve habilitar este recurso através da opção de configuração `general_log` para usá-lo. Você pode desabilitá-lo para uma connection específica através da opção de configuração `sql_log_off`.

    Registra um Range mais amplo de Queries do que o **slow query log**. Ao contrário do **binary log**, que é usado para replication, o general query log contém instruções `SELECT` e não mantém strict ordering. Para mais informações, consulte Section 5.4.3, “The General Query Log”.

    Veja Também binary log, log, slow query log.

general tablespace: Um **tablespace** `InnoDB` compartilhado criado usando a sintaxe `CREATE TABLESPACE`. Os general tablespaces podem ser criados fora do data directory MySQL, são capazes de armazenar múltiplas **tables** e suportam Tables de todos os row formats. Os general tablespaces foram introduzidos no MySQL 5.7.6.

    As Tables são adicionadas a um general tablespace usando a sintaxe `CREATE TABLE tbl_name ... TABLESPACE [=] tablespace_name` ou `ALTER TABLE tbl_name TABLESPACE [=] tablespace_name`.

    Contraste com **system tablespace** e tablespace **file-per-table**.

    Para mais informações, consulte Section 14.6.3.3, “General Tablespaces”.

    Veja Também file-per-table, system tablespace, table, tablespace.

generated column: Uma Column cujos valores são computados a partir de uma expression incluída na Column definition. Uma generated column pode ser **virtual** ou **stored**.

    Veja Também base column, stored generated column, virtual generated column.

generated stored column: Consulte stored generated column.

generated virtual column: Consulte virtual generated column.

Glassfish: Veja Também J2EE.

global transaction: Um tipo de **transaction** envolvida em operações **XA**. Consiste em várias ações que são transacionais em si, mas que todas devem ser concluídas com sucesso como um grupo, ou todas ser rolled back como um grupo. Em essência, isso estende as propriedades **ACID** “em um nível” para que múltiplas transactions ACID possam ser executadas em conjunto como componentes de uma global operation que também tem propriedades ACID.

    Veja Também ACID, transaction, XA.

group commit: Uma optimization `InnoDB` que executa algumas operações de I/O de baixo nível (log write) uma vez para um conjunto de operações de **commit**, em vez de fazer o flushing e o syncing separadamente para cada commit.

    Veja Também binary log, commit.

GUID: Acrônimo para “globally unique identifier”, um valor de ID que pode ser usado para associar dados em diferentes Databases, linguagens, operating systems e assim por diante. (Como alternativa ao uso de integers sequenciais, onde os mesmos valores poderiam aparecer em Tables, Databases e assim por diante diferentes, referindo-se a dados diferentes.) Versões mais antigas do MySQL o representavam como `BINARY(16)`. Atualmente, é representado como `CHAR(36)`. O MySQL tem uma função `UUID()` que retorna valores GUID em character format e uma função `UUID_SHORT()` que retorna valores GUID em integer format. Como os valores GUID sucessivos não estão necessariamente em ascending sort order, não é um valor eficiente para usar como Primary Key para Tables InnoDB grandes.

### H

hash index: Um tipo de **index** destinado a Queries que usam equality operators, em vez de Range operators, como greater-than ou `BETWEEN`. Está disponível para tabelas `MEMORY`. Embora os hash indexes sejam o padrão para tabelas `MEMORY` por razões históricas, esse storage engine também suporta Indexes **B-tree**, que geralmente são uma escolha melhor para Queries de propósito geral.

    O MySQL inclui uma variante deste tipo de Index, o **adaptive hash index**, que é construído automaticamente para tabelas `InnoDB` se necessário, com base nas condições de tempo de execução.

    Veja Também adaptive hash index, B-tree, index, InnoDB.

HDD: Acrônimo para “hard disk drive” (unidade de disco rígido). Refere-se a storage media que usa platters giratórios, geralmente ao comparar e contrastar com **SSD**. Suas características de desempenho podem influenciar o throughput de uma workload **disk-based**.

    Veja Também disk-based, SSD.

heartbeat: Uma mensagem periódica que é enviada para indicar que um sistema está funcionando corretamente. Em um contexto de **replication**, se a **source** parar de enviar tais mensagens, uma das **replicas** pode tomar seu lugar. Técnicas semelhantes podem ser usadas entre os Servers em um ambiente de Cluster, para confirmar que todos eles estão operando corretamente.

    Veja Também replication, source.

high-water mark: Um valor que representa um limite superior, seja um limite rígido que não deve ser excedido em tempo de execução, ou um registro do valor máximo que foi realmente alcançado. Contraste com **low-water mark**.

    Veja Também low-water mark.

history list: Uma list de **transactions** com records marcados para delete agendados para serem processados pela operação de **purge** `InnoDB`. Registrado no **undo log**. O comprimento da history list é relatado pelo comando `SHOW ENGINE INNODB STATUS`. Se a history list crescer mais do que o valor da opção de configuração `innodb_max_purge_lag`, cada operação **DML** será ligeiramente atrasada para permitir que a operação de purge termine de fazer o **flushing** dos records deleted.

    Também conhecido como **purge lag**.

    Veja Também DML, flush, purge, purge lag, rollback segment, transaction, undo log.

hole punching: Liberar blocos vazios de uma page. O recurso **transparent page compression** do `InnoDB` depende do suporte a hole punching. Para mais informações, consulte Section 14.9.2, “InnoDB Page Compression”.

    Veja Também sparse file, transparent page compression.

host: O Network name de um Database Server, usado para estabelecer uma **connection**. Frequentemente especificado em conjunto com uma **port**. Em alguns contextos, o IP address `127.0.0.1` funciona melhor do que o nome especial `localhost` para acessar um Database no mesmo Server que a application.

    Veja Também connection, localhost, port.

hot: Uma condição em que uma Row, Table ou estrutura de dados interna é acessada com tanta frequência, exigindo alguma forma de locking ou mutual exclusion, que resulta em um problema de desempenho ou scalability.

    Embora “hot” geralmente indique uma condição indesejável, um **hot backup** é o tipo de backup preferido.

    Veja Também hot backup.

hot backup: Um backup feito enquanto o Database está em execução e as aplicações estão lendo e escrevendo nele. O backup envolve mais do que simplesmente copiar data files: deve incluir quaisquer dados que foram inserted ou updated enquanto o backup estava em processo; deve excluir quaisquer dados que foram deleted enquanto o backup estava em processo; e deve ignorar quaisquer alterações que não foram committed.

    O produto Oracle que executa hot backups, de tabelas `InnoDB` especialmente, mas também Tables de `MyISAM` e outros storage engines, é conhecido como **MySQL Enterprise Backup**.

    O processo de hot backup consiste em duas etapas. A cópia inicial dos data files produz um **raw backup**. A etapa de **apply** incorpora quaisquer alterações no Database que aconteceram enquanto o backup estava em execução. Aplicar as alterações produz um backup **prepared**; estes arquivos estão prontos para serem restaurados sempre que necessário.

    Veja Também apply, MySQL Enterprise Backup, prepared backup, raw backup.

### I

.ibd file: O data file para **file-per-table** tablespaces e general tablespaces. Os `.ibd files` do file-per-table tablespace contêm uma única Table e Index data associado. Os `.ibd files` do **general tablespace** podem conter Table e Index data para múltiplas Tables. Os general tablespaces foram introduzidos no MySQL 5.7.6.

    A extensão de arquivo `.ibd` não se aplica ao **system tablespace**, que consiste em um ou mais **ibdata files**.

    Se um file-per-table tablespace ou general tablespace for criado com a cláusula `DATA DIRECTORY =`, o `.ibd` file estará localizado no path especificado, fora do data directory normal, e será apontado por um **.isl file**.

    Quando um `.ibd` file é incluído em um compressed backup pelo produto **MySQL Enterprise Backup**, o equivalente compressed é um `.ibz` file.

    Veja Também database, file-per-table, general tablespace, ibdata file, .ibz file, innodb_file_per_table, .isl file, MySQL Enterprise Backup, system tablespace.

.ibz file: Quando o produto **MySQL Enterprise Backup** executa um **compressed backup**, ele transforma cada **tablespace** file que é criado usando a configuração **file-per-table** de uma extensão `.ibd` para uma extensão `.ibz`.

    A compression aplicada durante o backup é distinta do **compressed row format** que mantém os dados da Table compressed durante a operação normal. Uma operação de compressed backup ignora a etapa de compression para um tablespace que já está em compressed row format, pois comprimir uma segunda vez atrasaria o backup, mas produziria pouca ou nenhuma economia de espaço.

    Veja Também compressed backup, compressed row format, file-per-table, .ibd file, MySQL Enterprise Backup, tablespace.

.isl file: Um arquivo que especifica a localização de um **.ibd file** para uma Table `InnoDB` criada com a cláusula `DATA DIRECTORY =` no MySQL 5.6 e superior, ou com a cláusula `CREATE TABLESPACE ... ADD DATAFILE` no MySQL 5.7 e superior. Funciona como um symbolic link, sem as restrições de plataforma do mecanismo real de symbolic link. Você pode armazenar **tablespaces** `InnoDB` fora do Directory **database**, por exemplo, em um storage device especialmente grande ou rápido, dependendo do uso da Table. Para detalhes, consulte Section 14.6.1.2, “Creating Tables Externally”, e Section 14.6.3.3, “General Tablespaces”.

    Veja Também database, .ibd file, table, tablespace.

I/O-bound: Consulte disk-bound.

ib-file set: O conjunto de arquivos gerenciados pelo `InnoDB` dentro de um Database MySQL: o **system tablespace**, arquivos tablespace **file-per-table** e arquivos **redo log**. Dependendo da versão do MySQL e da configuração do `InnoDB`, também pode incluir arquivos **general tablespace**, **temporary tablespace** e **undo tablespace**. Este termo é às vezes usado em discussões detalhadas de estruturas e formatos de arquivo `InnoDB` para se referir ao conjunto de arquivos gerenciados pelo `InnoDB` dentro de um Database MySQL.

    Veja Também database, file-per-table, general tablespace, redo log, system tablespace, temporary tablespace, undo tablespace.

ibbackup_logfile: Um arquivo de backup suplementar criado pelo produto **MySQL Enterprise Backup** durante uma operação de **hot backup**. Contém informações sobre quaisquer alterações de dados que ocorreram enquanto o backup estava em execução. Os arquivos de backup iniciais, incluindo `ibbackup_logfile`, são conhecidos como **raw backup**, porque as alterações que ocorreram durante a operação de backup ainda não foram incorporadas. Depois de executar a etapa de **apply** nos arquivos raw backup, os arquivos resultantes incluem essas alterações de dados finais e são conhecidos como **prepared backup**. Nesta fase, o arquivo `ibbackup_logfile` não é mais necessário.

    Veja Também apply, hot backup, MySQL Enterprise Backup, prepared backup, raw backup.

ibdata file: Um conjunto de arquivos com nomes como `ibdata1`, `ibdata2` e assim por diante, que compõem o **system tablespace** `InnoDB`. Para obter informações sobre as estruturas e dados que residem nos arquivos `ibdata` do system tablespace, consulte Section 14.6.3.1, “The System Tablespace”.

    O crescimento dos arquivos `ibdata` é influenciado pela opção de configuração `innodb_autoextend_increment`.

    Veja Também change buffer, data dictionary, doublewrite buffer, file-per-table, .ibd file, innodb_file_per_table, system tablespace, undo log.

ibtmp file: O **data file** do **temporary tablespace** `InnoDB` para **temporary tables** `InnoDB` não compressed e Objects relacionados. A opção de configuration file, `innodb_temp_data_file_path`, permite que os usuários definam um path relativo para o data file do temporary tablespace. Se `innodb_temp_data_file_path` não for especificado, o comportamento padrão é criar um único data file `ibtmp1` de 12MB com auto-extensão no data directory, ao lado de `ibdata1`.

    Veja Também data files, temporary table, temporary tablespace.

ib_logfile: Um conjunto de arquivos, geralmente chamados `ib_logfile0` e `ib_logfile1`, que formam o **redo log**. Também às vezes referido como o **log group**. Estes arquivos registram instruções que tentam alterar dados em tabelas `InnoDB`. Estas instruções são replayed automaticamente para corrigir dados escritos por transactions incompletas, na startup após um crash.

    Estes dados não podem ser usados para recovery manual; para esse tipo de operação, use o **binary log**.

    Veja Também binary log, log group, redo log.

ilist: Dentro de um **FULLTEXT index** `InnoDB`, a estrutura de dados que consiste em um document ID e positional information para um token (ou seja, uma palavra específica).

    Veja Também FULLTEXT index.

implicit row lock: Um row lock que o `InnoDB` adquire para garantir a consistency, sem que você o solicite especificamente.

    Veja Também row lock.

in-memory database: Um tipo de Database system que mantém dados na Memory, para evitar overhead devido ao Disk I/O e translation entre Disk blocks e Memory areas. Alguns in-memory databases sacrificam a durabilidade (o “D” na filosofia de design **ACID**) e são vulneráveis a falhas de Hardware, energia e outros tipos de falhas, tornando-os mais adequados para operações read-only. Outros in-memory databases usam mecanismos de durabilidade, como Logging changes para o Disk ou usando Memory não volátil.

    Os recursos do MySQL que abordam os mesmos tipos de processamento intensivo de Memory incluem o **buffer pool** `InnoDB`, **adaptive hash index** e optimization de **read-only transaction**, o storage engine `MEMORY`, o key cache `MyISAM` e o Query cache MySQL.

    Veja Também ACID, adaptive hash index, buffer pool, disk-based, read-only transaction.

incremental backup: Um tipo de **hot backup**, realizado pelo produto **MySQL Enterprise Backup**, que salva apenas os dados alterados desde algum ponto no tempo. Ter um full backup e uma sucessão de incremental backups permite que você reconstrua dados de backup por um longo período, sem o overhead de armazenamento de manter vários full backups à mão. Você pode restaurar o full backup e, em seguida, aplicar cada um dos incremental backups em sucessão, ou pode manter o full backup atualizado aplicando cada incremental backup a ele e, em seguida, executar uma única operação de restore.

    A granularidade dos dados alterados está no nível de **page**. Uma page pode abranger mais de uma Row. Cada page alterada é incluída no backup.

    Veja Também hot backup, MySQL Enterprise Backup, page.

index: Uma estrutura de dados que fornece uma capacidade de lookup rápida para **rows** de uma **table**, tipicamente formando uma estrutura em árvore (**B-tree)** representando todos os valores de uma **column** ou conjunto de Columns específico.

    As tabelas `InnoDB` sempre têm um **clustered index** representando a **primary key**. Elas também podem ter um ou mais **secondary indexes** definidos em uma ou mais Columns. Dependendo de sua estrutura, os secondary indexes podem ser classificados como Indexes **partial**, **column** ou **composite**.

    Indexes são um aspecto crucial do desempenho de **query**. Os arquitetos de Database projetam Tables, Queries e Indexes para permitir lookups rápidas para os dados necessários às aplicações. O Database design ideal usa um **covering index** sempre que prático; os resultados da Query são computados inteiramente a partir do Index, sem ler o Table data real. Cada **foreign key** constraint também requer um Index, para verificar eficientemente se os valores existem tanto na Table **parent** quanto na **child**.

    Embora um B-tree index seja o mais comum, um tipo diferente de estrutura de dados é usado para **hash indexes**, como no storage engine `MEMORY` e no **adaptive hash index** `InnoDB`. Indexes **R-tree** são usados para Indexing espacial de informações multi-dimensionais.

    Veja Também adaptive hash index, B-tree, child table, clustered index, column index, composite index, covering index, foreign key, hash index, parent table, partial index, primary key, query, R-tree, row, secondary index, table.

index cache: Uma Memory Area que armazena os dados de token para **full-text search** `InnoDB`. Ele faz o buffering dos dados para minimizar o Disk I/O quando os dados são inserted ou updated em Columns que fazem parte de um **FULLTEXT index**. Os dados de token são escritos no Disk quando o index cache fica cheio. Cada Index `FULLTEXT` `InnoDB` tem seu próprio index cache separado, cujo tamanho é controlado pela opção de configuração `innodb_ft_cache_size`.

    Veja Também full-text search, FULLTEXT index.

index condition pushdown: Index condition pushdown (ICP) é uma optimization que empurra parte de uma condição `WHERE` para o storage engine se partes da condição puderem ser avaliadas usando fields do **index**. O ICP pode reduzir o número de vezes que o **storage engine** deve acessar a base table e o número de vezes que o MySQL Server deve acessar o storage engine. Para mais informações, consulte Section 8.2.1.5, “Index Condition Pushdown Optimization”.

    Veja Também index, storage engine.

index hint: Extended SQL syntax para substituir os **indexes** recomendados pelo optimizer. Por exemplo, as cláusulas `FORCE INDEX`, `USE INDEX` e `IGNORE INDEX`. Geralmente usado quando Columns indexed têm valores distribuídos de forma desigual, resultando em estimativas de **cardinality** imprecisas.

    Veja Também cardinality, index.

index prefix: Em um **index** que se aplica a múltiplas Columns (conhecido como **composite index**), as Columns iniciais ou líderes do Index. Uma Query que faz referência às primeiras 1, 2, 3 e assim por diante Columns de um composite index pode usar o Index, mesmo que a Query não faça referência a todas as Columns no Index.

    Veja Também composite index, index.

index statistics: Consulte statistics.

infimum record: Um **pseudo-record** em um **index**, representando o **gap** abaixo do menor valor nesse Index. Se uma transaction tiver uma instrução como `SELECT ... FROM ... WHERE col < 10 FOR UPDATE;`, e o menor valor na Column for 5, é um Lock no infimum record que impede que outras transactions insiram valores ainda menores, como 0, -10 e assim por diante.

    Veja Também gap, index, pseudo-record, supremum record.

INFORMATION_SCHEMA: O nome do **database** que fornece uma Query interface para o **data dictionary** MySQL. (Este nome é definido pelo padrão ANSI SQL.) Para examinar informações (metadata) sobre o Database, você pode consultar Tables como `INFORMATION_SCHEMA.TABLES` e `INFORMATION_SCHEMA.COLUMNS`, em vez de usar comandos `SHOW` que produzem output não estruturado.

    O Database `INFORMATION_SCHEMA` também contém Tables específicas do **InnoDB** que fornecem uma Query interface para o data dictionary `InnoDB`. Você usa estas Tables não para ver como o Database está estruturado, mas para obter informações em tempo real sobre o funcionamento das tabelas `InnoDB` para ajudar no performance monitoring, tuning e troubleshooting.

    Veja Também data dictionary, database, InnoDB.

InnoDB: Um componente MySQL que combina high performance com capacidade **transactional** para confiabilidade, robustez e acesso concorrente. Ele incorpora a filosofia de design **ACID**. Representado como um **storage engine**; ele lida com Tables criadas ou alteradas com a cláusula `ENGINE=INNODB`. Consulte Chapter 14, *The InnoDB Storage Engine* para detalhes de arquitetura e procedimentos de administração, e Section 8.5, “Optimizing for InnoDB Tables” para conselhos de desempenho.

    No MySQL 5.5 e superior, o `InnoDB` é o storage engine padrão para novas Tables e a cláusula `ENGINE=INNODB` não é necessária.

    As tabelas `InnoDB` são idealmente adequadas para **hot backups**. Consulte Section 28.1, “MySQL Enterprise Backup Overview” para obter informações sobre o produto **MySQL Enterprise Backup** para fazer backup de MySQL Servers sem interromper o processamento normal.

    Veja Também ACID, hot backup, MySQL Enterprise Backup, storage engine, transaction.

innodb_autoinc_lock_mode: A opção `innodb_autoinc_lock_mode` controla o algoritmo usado para **auto-increment locking**. Quando você tem uma **primary key** auto-incrementing, você pode usar statement-based replication apenas com a configuração `innodb_autoinc_lock_mode=1`. Esta configuração é conhecida como *consecutive* lock mode, porque inserts de múltiplas Rows dentro de uma transaction recebem valores auto-increment consecutivos. Se você tiver `innodb_autoinc_lock_mode=2`, que permite maior concurrency para operações de insert, use row-based replication em vez de statement-based replication. Esta configuração é conhecida como *interleaved* lock mode, porque múltiplas instruções de insert de múltiplas Rows em execução ao mesmo tempo podem receber valores **auto-increment** que são interleaved. A configuração `innodb_autoinc_lock_mode=0` não deve ser usada, exceto para fins de compatibilidade.

    O consecutive lock mode (`innodb_autoinc_lock_mode=1`) é a configuração padrão antes do MySQL 8.0.3. A partir do MySQL 8.0.3, o interleaved lock mode (`innodb_autoinc_lock_mode=2`) é o padrão, o que reflete a mudança de statement-based para row-based replication como o tipo de replication padrão.

    Veja Também auto-increment, auto-increment locking, mixed-mode insert, primary key.

innodb_file_format: A opção `innodb_file_format` define o **file format** a ser usado para novos **tablespaces** file-per-table `InnoDB`. Atualmente, você pode especificar os file formats **Antelope** e **Barracuda**.

    Veja Também Antelope, Barracuda, file format, file-per-table, general tablespace, innodb_file_per_table, system tablespace, tablespace.

innodb_file_per_table: Uma importante configuration option que afeta muitos aspectos do file storage `InnoDB`, availability de recursos e características de I/O. No MySQL 5.6.7 e superior, ele está habilitado por padrão. A opção `innodb_file_per_table` ativa o modo **file-per-table**. Com este modo habilitado, uma Table `InnoDB` recém-criada e Indexes associados podem ser armazenados em um **.ibd file** file-per-table, fora do **system tablespace**.

    Esta opção afeta o desempenho e as considerações de armazenamento para uma série de instruções SQL, como `DROP TABLE` e `TRUNCATE TABLE`.

    Habilitar a opção `innodb_file_per_table` permite que você aproveite recursos como **compression** de Table e named-table backups no **MySQL Enterprise Backup**.

    Para mais informações, consulte `innodb_file_per_table` e Section 14.6.3.2, “File-Per-Table Tablespaces”.

    Veja Também compression, file-per-table, .ibd file, MySQL Enterprise Backup, system tablespace.

innodb_lock_wait_timeout: A opção `innodb_lock_wait_timeout` define o equilíbrio entre **waiting** para que recursos compartilhados se tornem disponíveis, ou desistir e lidar com o Error, retrying, ou fazer processamento alternativo em sua application. Rolls back qualquer transaction `InnoDB` que espere mais de um tempo especificado para adquirir um **lock**. Especialmente útil se **deadlocks** forem causados por updates em múltiplas Tables controladas por diferentes storage engines; tais deadlocks não são **detected** automaticamente.

    Veja Também deadlock, deadlock detection, lock, wait.

innodb_strict_mode: A opção `innodb_strict_mode` controla se o `InnoDB` opera em **strict mode**, onde as condições que são normalmente tratadas como warnings, causam Errors em vez disso (e as instruções subjacentes falham).

    Veja Também strict mode.

Innovation Series: Releases de Innovation com a mesma Major version formam uma Innovation series. Por exemplo, MySQL 8.1 a 8.3 formam a MySQL 8 Innovation series.

    Veja Também LTS Series.

insert: Uma das operações **DML** primárias em **SQL**. O desempenho de inserts é um fator Key em Database systems de **data warehouse** que carregam milhões de Rows em Tables, e sistemas **OLTP** onde muitas connections concorrentes podem inserir Rows na mesma Table, em ordem arbitrária. Se o desempenho de insert for importante para você, você deve aprender sobre os recursos **InnoDB**, como o **insert buffer** usado em **change buffering**, e Columns **auto-increment**.

    Veja Também auto-increment, change buffering, data warehouse, DML, InnoDB, insert buffer, OLTP, SQL.

insert buffer: O nome anterior do **change buffer**. No MySQL 5.5, foi adicionado suporte para buffering changes em secondary index pages para operações `DELETE` e `UPDATE`. Anteriormente, apenas as alterações resultantes de operações `INSERT` eram buffered. O termo preferido agora é *change buffer*.

    Veja Também change buffer, change buffering.

insert buffering: A técnica de armazenar alterações em secondary index pages, resultantes de operações `INSERT`, no **change buffer** em vez de escrever as alterações imediatamente, para que as escritas físicas possam ser realizadas para minimizar o I/O randômico. É um dos tipos de **change buffering**; os outros são **delete buffering** e **purge buffering**.

    O Insert buffering não é usado se o secondary index for **unique**, porque a unicidade dos novos valores não pode ser verificada antes que as novas entries sejam escritas. Outros tipos de change buffering funcionam para unique indexes.

    Veja Também change buffer, change buffering, delete buffering, insert buffer, purge buffering, unique index.

insert intention lock: Um tipo de **gap lock** que é definido por operações `INSERT` antes da Row insertion. Este tipo de **lock** sinaliza a intenção de inserir de tal forma que múltiplas transactions inserindo no mesmo Index gap não precisam esperar umas pelas outras se não estiverem inserindo na mesma posição dentro do gap. Para mais informações, consulte Section 14.7.1, “InnoDB Locking”.

    Veja Também gap lock, lock, next-key lock.

instance: Um único daemon **mysqld** gerenciando um **data directory** que representa um ou mais **databases** com um conjunto de **tables**. É comum em cenários de desenvolvimento, teste e alguns de **replication** ter múltiplas Instances na mesma máquina **server**, cada uma gerenciando seu próprio data directory e ouvindo em sua própria port ou socket. Com uma Instance executando uma workload **disk-bound**, o Server ainda pode ter capacidade extra de CPU e Memory para executar Instances adicionais.

    Veja Também data directory, database, disk-bound, mysqld, replication, server, table.

instrumentation: Modifications no nível do source code para coletar dados de desempenho para tuning e debugging. No MySQL, os dados coletados pela instrumentation são expostos através de uma interface SQL usando os Databases `INFORMATION_SCHEMA` e `PERFORMANCE_SCHEMA`.

    Veja Também INFORMATION_SCHEMA, Performance Schema.

intention exclusive lock: Consulte intention lock.

intention lock: Um tipo de **lock** que se aplica à Table, usado para indicar o tipo de Lock que a **transaction** pretende adquirir nas Rows da Table. Diferentes transactions podem adquirir diferentes tipos de intention locks na mesma Table, mas a primeira transaction a adquirir um Lock *intention exclusive* (IX) em uma Table impede que outras transactions adquiram quaisquer Locks S ou X na Table. Por outro lado, a primeira transaction a adquirir um Lock *intention shared* (IS) em uma Table impede que outras transactions adquiram quaisquer Locks X na Table. O processo de duas fases permite que as Requests de Lock sejam resolvidas em ordem, sem bloquear Locks e operações correspondentes que sejam compatíveis. Para mais informações sobre este mecanismo de locking, consulte Section 14.7.1, “InnoDB Locking”.

    Veja Também lock, lock mode, locking, transaction.

intention shared lock: Consulte intention lock.

interceptor: Código para instrumenting ou debugging algum aspecto de uma application, que pode ser habilitado sem recompilar ou alterar o source da própria application.

    Veja Também command interceptor, Connector/J, Connector/NET, exception interceptor.

intrinsic temporary table: Uma temporary table `InnoDB` interna otimizada usada pelo *optimizer*.

    Veja Também optimizer.

inverted index: Uma estrutura de dados otimizada para sistemas de document retrieval, usada na implementação de **full-text search** `InnoDB`. O **FULLTEXT index** `InnoDB`, implementado como um inverted index, registra a posição de cada word dentro de um documento, em vez da localização de uma Row de Table. Um único Column value (um documento armazenado como uma text string) é representado por muitas entries no inverted index.

    Veja Também full-text search, FULLTEXT index, ilist.

IOPS: Acrônimo para **I/O operations per second**. Uma medição comum para sistemas ocupados, particularmente aplicações **OLTP**. Se este valor estiver próximo do máximo que os storage devices podem suportar, a application pode se tornar **disk-bound**, limitando a **scalability**.

    Veja Também disk-bound, OLTP, scalability.

isolation level: Um dos fundamentos do Database processing. Isolation é o **I** no acrônimo **ACID**; o isolation level é a configuração que ajusta o equilíbrio entre desempenho e confiabilidade, consistency e reprodutibilidade dos resultados quando múltiplas **transactions** estão fazendo alterações e executando Queries ao mesmo tempo.

    Do maior para o menor grau de consistency e proteção, os isolation levels suportados pelo InnoDB são: **SERIALIZABLE**, **REPEATABLE READ**, **READ COMMITTED** e **READ UNCOMMITTED**.

    Com tabelas `InnoDB`, muitos usuários podem manter o isolation level padrão (*REPEATABLE READ*) para todas as operações. Usuários experientes podem escolher o nível **READ COMMITTED** à medida que ultrapassam os limites da scalability com o processamento **OLTP**, ou durante operações de data warehousing onde pequenas inconsistências não afetam os resultados agregados de grandes quantidades de dados. Os níveis nas extremidades (**SERIALIZABLE** e **READ UNCOMMITTED**) alteram o comportamento de processamento a tal ponto que são raramente usados.

    Veja Também ACID, OLTP, READ COMMITTED, READ UNCOMMITTED, REPEATABLE READ, SERIALIZABLE, transaction.

### J

J2EE: Java Platform, Enterprise Edition: a plataforma Java Enterprise da Oracle. Consiste em uma API e um runtime environment para aplicações Java de classe Enterprise. Para detalhes completos, consulte <http://www.oracle.com/technetwork/java/javaee/overview/index.html>. Com aplicações MySQL, você geralmente usa **Connector/J** para acesso ao Database e um application server como **Tomcat** ou **JBoss** para lidar com o trabalho da camada intermediária e, opcionalmente, um framework como **Spring**. Os recursos relacionados ao Database frequentemente oferecidos em uma stack J2EE incluem um **connection pool** e suporte a **failover**.

    Veja Também connection pool, Connector/J, failover, Java, JBoss, Spring, Tomcat.

Java: Uma programming language que combina high performance, recursos built-in e data types ricos, mecanismos orientados a Objects, extensive standard library e uma ampla gama de módulos de terceiros reutilizáveis. O desenvolvimento Enterprise é suportado por muitos frameworks, application servers e outras tecnologias. Grande parte de sua sintaxe é familiar aos desenvolvedores **C** e **C++**. Para escrever aplicações Java com MySQL, você usa o driver **JDBC** conhecido como **Connector/J**.

    Veja Também C, Connector/J, C++, JDBC.

JBoss: Veja Também J2EE.

JDBC: Abreviação de “Java Database Connectivity”, uma **API** para acesso a Database a partir de aplicações **Java**. Os desenvolvedores Java que escrevem aplicações MySQL usam o componente **Connector/J** como seu driver JDBC.

    Veja Também API, Connector/J, J2EE, Java.

JNDI: Veja Também Java.

join: Uma **query** que recupera dados de mais de uma Table, fazendo referência a Columns nas Tables que contêm valores idênticos. Idealmente, estas Columns fazem parte de um relacionamento de **foreign key** `InnoDB`, que garante **referential integrity** e que as Columns de join sejam **indexed**. Frequentemente usado para economizar espaço e melhorar o desempenho da Query, substituindo Strings repetidas por IDs numéricos, em um data design **normalized**.

    Veja Também foreign key, index, normalized, query, referential integrity.

### K

keystore: Veja Também SSL.

KEY_BLOCK_SIZE: Uma option para especificar o tamanho das data pages dentro de uma Table `InnoDB` que usa **compressed row format**. O padrão é 8 kilobytes. Valores mais baixos arriscam atingir limites internos que dependem da combinação de Row size e percentage de compression.

    Para tabelas `MyISAM`, `KEY_BLOCK_SIZE` opcionalmente especifica o tamanho em bytes a ser usado para index key blocks. O valor é tratado como um hint; um tamanho diferente pode ser usado se necessário. Um valor `KEY_BLOCK_SIZE` especificado para uma Index definition individual substitui um valor `KEY_BLOCK_SIZE` no nível da Table.

    Veja Também compressed row format.

### L

latch: Uma estrutura lightweight usada pelo `InnoDB` para implementar um **lock** para suas próprias Memory structures internas, geralmente mantida por um breve tempo medido em milissegundos ou microssegundos. Um termo geral que inclui **mutexes** (para exclusive access) e **rw-locks** (para shared access). Certos latches são o foco do performance tuning `InnoDB`. As statistics sobre o uso e contenção de latch estão disponíveis através da interface **Performance Schema**.

    Veja Também lock, locking, mutex, Performance Schema, rw-lock.

libmysql: Nome informal para a library **libmysqlclient**.

    Veja Também libmysqlclient.

libmysqlclient: O library file, chamado `libmysqlclient.a` ou `libmysqlclient.so`, que é tipicamente linked em programas **client** escritos em **C**. Às vezes conhecido informalmente como **libmysql** ou a library **mysqlclient**.

    Veja Também client, libmysql, mysqlclient.

libmysqld: Esta library do MySQL Server **embedded** torna possível executar um MySQL Server full-featured dentro de uma application **client**. Os principais benefícios são maior velocidade e gerenciamento mais simples para embedded applications. Você faz link com a library `libmysqld` em vez de **libmysqlclient**. A API é idêntica entre todas as três libraries.

    Veja Também client, embedded, libmysql, libmysqlclient.

lifecycle interceptor: Um tipo de **interceptor** suportado pelo **Connector/J**. Envolve a implementação da interface `com.mysql.jdbc.ConnectionLifecycleInterceptor`.

    Veja Também Connector/J, interceptor.

list: O **buffer pool** `InnoDB` é representado como uma list de **pages** de Memory. A list é reordered à medida que novas pages são acessadas e entram no buffer pool, à medida que pages dentro do buffer pool são acessadas novamente e são consideradas mais novas, e à medida que pages que não são acessadas por um longo tempo são **evicted** do buffer pool. O buffer pool é dividido em **sublists**, e a replacement policy é uma variação da familiar técnica **LRU**.

    Veja Também buffer pool, eviction, LRU, page, sublist.

load balancing: Uma técnica para scaling connections read-only, enviando Requests de Query para diferentes slave servers em uma configuração de replication ou Cluster. Com o **Connector/J**, o load balancing é habilitado através da classe `com.mysql.jdbc.ReplicationDriver` e controlado pela configuration property `loadBalanceStrategy`.

    Veja Também Connector/J, J2EE.

localhost: Veja Também connection.

lock: A noção de alto nível de um Object que controla o acesso a um recurso, como uma Table, Row ou estrutura de dados interna, como parte de uma estratégia de **locking**. Para performance tuning intensivo, você pode se aprofundar nas estruturas reais que implementam Locks, como **mutexes** e **latches**.

    Veja Também latch, lock mode, locking, mutex.

lock escalation: Uma operação usada em alguns Database systems que converte muitos **row locks** em um único **table lock**, economizando Memory space, mas reduzindo o acesso concorrente à Table. O `InnoDB` usa uma representação space-efficient para row locks, de modo que o **lock** escalation não é necessário.

    Veja Também locking, row lock, table lock.

lock mode: Um **lock** shared (S) permite que uma **transaction** leia uma Row. Múltiplas transactions podem adquirir um Lock S na mesma Row ao mesmo tempo.

    Um Lock exclusive (X) permite que uma transaction atualize ou delete uma Row. Nenhuma outra transaction pode adquirir qualquer tipo de Lock na mesma Row ao mesmo tempo.

    **Intention locks** se aplicam à Table e são usados para indicar o tipo de Lock que a transaction pretende adquirir nas Rows da Table. Diferentes transactions podem adquirir diferentes tipos de intention locks na mesma Table, mas a primeira transaction a adquirir um Lock intention exclusive (IX) em uma Table impede que outras transactions adquiram quaisquer Locks S ou X na Table. Por outro lado, a primeira transaction a adquirir um Lock intention shared (IS) em uma Table impede que outras transactions adquiram quaisquer Locks X na Table. O processo de duas fases permite que as Requests de Lock sejam resolvidas em ordem, sem bloquear Locks e operações correspondentes que sejam compatíveis.

    Veja Também intention lock, lock, locking, transaction.

locking: O sistema de proteção de uma **transaction** contra a visualização ou alteração de dados que estão sendo queried ou alterados por outras transactions. A estratégia de **locking** deve equilibrar a confiabilidade e a consistency das Database operations (os princípios da filosofia **ACID**) contra o desempenho necessário para uma boa **concurrency**. O ajuste fino da estratégia de locking geralmente envolve a escolha de um **isolation level** e a garantia de que todas as suas Database operations sejam seguras e confiáveis para esse isolation level.

    Veja Também ACID, concurrency, isolation level, lock, transaction.

locking read: Uma instrução `SELECT` que também executa uma operação de **locking** em uma Table `InnoDB`. Ou `SELECT ... FOR UPDATE` ou `SELECT ... LOCK IN SHARE MODE`. Tem o potencial de produzir um **deadlock**, dependendo do **isolation level** da transaction. O oposto de um **non-locking read**. Não permitido para global tables em uma **read-only transaction**.

    `SELECT ... FOR SHARE` substitui `SELECT ... LOCK IN SHARE MODE` no MySQL 8.0.1, mas `LOCK IN SHARE MODE` permanece disponível para backward compatibility.

    Consulte Section 14.7.2.4, “Locking Reads”.

    Veja Também deadlock, isolation level, locking, non-locking read, read-only transaction.

log: No contexto `InnoDB`, “log” ou “log files” geralmente se refere ao **redo log** representado pelos arquivos **ib_logfile*`N`***. Outro tipo de log `InnoDB` é o **undo log**, que é uma storage area que contém cópias de dados modificados por transactions ativas.

    Outros tipos de Logs que são importantes no MySQL são o **error log** (para diagnosticar problemas de startup e tempo de execução), **binary log** (para trabalhar com replication e executar point-in-time restores), o **general query log** (para diagnosticar problemas de application) e o **slow query log** (para diagnosticar problemas de desempenho).

    Veja Também binary log, error log, general query log, ib_logfile, redo log, slow query log, undo log.

log buffer: A Memory Area que contém dados a serem escritos nos **log files** que compõem o **redo log**. É controlado pela opção de configuração `innodb_log_buffer_size`.

    Veja Também log file, redo log.

log file: Um dos arquivos **ib_logfile*`N`*** que compõem o **redo log**. Os dados são escritos nestes arquivos a partir da Memory Area **log buffer**.

    Veja Também ib_logfile, log buffer, redo log.

log group: O conjunto de arquivos que compõem o **redo log**, geralmente chamado `ib_logfile0` e `ib_logfile1`. (Por esse motivo, às vezes referido coletivamente como **ib_logfile**.)

    Veja Também ib_logfile, redo log.

logical: Um tipo de operação que envolve aspectos de alto nível e abstratos, como Tables, Queries, Indexes e outros conceitos SQL. Tipicamente, os aspectos logical são importantes para tornar a Database administration e o application development convenientes e utilizáveis. Contraste com **physical**.

    Veja Também logical backup, physical.

logical backup: Um **backup** que reproduz a Table structure e os dados, sem copiar os data files reais. Por exemplo, o comando **`mysqldump`** produz um logical backup, porque seu output contém instruções como `CREATE TABLE` e `INSERT` que podem recriar os dados. Contraste com **physical backup**. Um logical backup oferece flexibilidade (por exemplo, você pode editar Table definitions ou instruções insert antes de restaurar), mas pode levar substancialmente mais tempo para **restore** do que um physical backup.

    Veja Também backup, mysqldump, physical backup, restore.

loose_: Um prefixo adicionado a configuration options `InnoDB` após a **startup** do Server, para que quaisquer novas configuration options não reconhecidas pelo nível atual do MySQL não causem uma startup failure. O MySQL processa configuration options que começam com este prefixo, mas dá um warning em vez de uma failure se a parte após o prefixo não for uma option reconhecida.

    Veja Também startup.

low-water mark: Um valor que representa um limite inferior, tipicamente um valor de threshold no qual alguma corrective action começa ou se torna mais agressiva. Contraste com **high-water mark**.

    Veja Também high-water mark.

LRU: Um acrônimo para “least recently used” (menos recentemente usado), um método comum para gerenciar storage areas. Os items que não foram usados recentemente são **evicted** quando o espaço é necessário para cachear items mais novos. O `InnoDB` usa o mecanismo LRU por padrão para gerenciar as **pages** dentro do **buffer pool**, mas faz exceções em casos em que uma page pode ser lida apenas uma única vez, como durante um **full table scan**. Esta variação do algoritmo LRU é chamada de **midpoint insertion strategy**. Para mais informações, consulte Section 14.5.1, “Buffer Pool”.

    Veja Também buffer pool, eviction, full table scan, midpoint insertion strategy, page.

LSN: Acrônimo para “log sequence number”. Este valor arbitrário e sempre crescente representa um ponto no tempo correspondente a operações registradas no **redo log**. (Este ponto no tempo é independentemente dos limites de **transaction**; pode cair no meio de uma ou mais transactions.) É usado internamente pelo `InnoDB` durante o **crash recovery** e para gerenciar o **buffer pool**.

    Antes do MySQL 5.6.3, o LSN era um integer unsigned de 4 bytes. O LSN se tornou um integer unsigned de 8 bytes no MySQL 5.6.3 quando o limite de redo log file size aumentou de 4GB para 512GB, pois bytes adicionais eram necessários para armazenar informações de tamanho extra. Aplicações construídas no MySQL 5.6.3 ou posterior que usam valores LSN devem usar variáveis de 64 bits em vez de 32 bits para armazenar e comparar valores LSN.

    No produto **MySQL Enterprise Backup**, você pode especificar um LSN para representar o ponto no tempo a partir do qual fazer um **incremental backup**. O LSN relevante é exibido pelo output do comando **mysqlbackup**. Uma vez que você tenha o LSN correspondente ao tempo de um full backup, você pode especificar esse valor para fazer um incremental backup subsequente, cujo output contém outro LSN para o próximo incremental backup.

    Veja Também buffer pool, crash recovery, incremental backup, MySQL Enterprise Backup, redo log, transaction.

LTS Series: Releases LTS com o mesmo Major version number formam uma LTS series. Por exemplo, todas as Releases MySQL 8.4.x formam a MySQL 8.4 LTS series.

    Note: O MySQL 8.0 é uma Bugfix series que precedeu o modelo de Release LTS.

    Veja Também Innovation Series.

### M

.MRG file: Um arquivo contendo references a outras Tables, usado pelo storage engine `MERGE`. Arquivos com esta extensão são incluídos em backups produzidos pelo comando **mysqlbackup** do produto **MySQL Enterprise Backup**.

    Veja Também MySQL Enterprise Backup, comando mysqlbackup.

.MYD file: Um arquivo que o MySQL usa para armazenar dados para uma Table `MyISAM`.

    Veja Também .MYI file, MySQL Enterprise Backup, comando mysqlbackup.

.MYI file: Um arquivo que o MySQL usa para armazenar Indexes para uma Table `MyISAM`.

    Veja Também .MYD file, MySQL Enterprise Backup, comando mysqlbackup.

master: Consulte source.

master thread: Uma **thread** `InnoDB` que executa várias tarefas em background. A maioria destas tarefas está relacionada a I/O, como escrever alterações do **change buffer** nos secondary indexes apropriados.

    Para melhorar a **concurrency**, às vezes as ações são movidas do master thread para threads de background separadas. Por exemplo, no MySQL 5.6 e superior, **dirty pages** são **flushed** do **buffer pool** pelo **page cleaner** thread em vez do master thread.

    Veja Também buffer pool, change buffer, concurrency, dirty page, flush, page cleaner, thread.

MDL: Acrônimo para “metadata lock”.

    Veja Também metadata lock.

medium trust: Sinônimo de **partial trust**. Como o Range de trust settings é tão amplo, “partial trust” é preferido, para evitar a implicação de que existem apenas três níveis (low, medium e full).

    Veja Também Connector/NET, partial trust.

memcached: Um componente popular de muitas stacks de software MySQL e **NoSQL**, permitindo reads e writes rápidas para valores únicos e caching dos resultados inteiramente na Memory. Tradicionalmente, as aplicações exigiam logic extra para escrever os mesmos dados em um Database MySQL para armazenamento permanente, ou para ler dados de um Database MySQL quando ainda não estavam cached na Memory. Agora, as aplicações podem usar o protocolo **memcached** simples, suportado por client libraries para muitas linguagens, para se comunicar diretamente com MySQL Servers usando tabelas `InnoDB` ou `NDB`. Estas interfaces NoSQL para tabelas MySQL permitem que as aplicações atinjam maior desempenho de read e write do que emitindo instruções SQL diretamente, e podem simplificar a application logic e as deployment configurations para sistemas que já incorporam **memcached** para caching in-memory.

    Veja Também NoSQL.

merge: Aplicar alterações em dados cached na Memory, como quando uma page é trazida para o **buffer pool**, e quaisquer alterações aplicáveis registradas no **change buffer** são incorporadas à page no buffer pool. Os dados atualizados são eventualmente escritos no **tablespace** pelo mecanismo de **flush**.

    Veja Também buffer pool, change buffer, flush, tablespace.

metadata lock: Um tipo de **lock** que impede operações **DDL** em uma Table que está sendo usada ao mesmo tempo por outra **transaction**. Para detalhes, consulte Section 8.11.4, “Metadata Locking”.

    Melhorias nas operações **online**, particularmente no MySQL 5.6 e superior, estão focadas em reduzir a quantidade de metadata locking. O objetivo é que as operações DDL que não alteram a Table structure (como `CREATE INDEX` e `DROP INDEX` para tabelas `InnoDB`) prossigam enquanto a Table está sendo queried, updated e assim por diante por outras transactions.

    Veja Também DDL, lock, online, transaction.

metrics counter: Um recurso implementado pela tabela `INNODB_METRICS` no **INFORMATION_SCHEMA**, no MySQL 5.6 e superior. Você pode consultar **counts** e totals para operações `InnoDB` de baixo nível e usar os resultados para performance tuning em combinação com dados do **Performance Schema**.

    Veja Também counter, INFORMATION_SCHEMA, Performance Schema.

midpoint insertion strategy: A técnica de trazer **pages** inicialmente para o **buffer pool** `InnoDB` não na extremidade “mais nova” da list, mas sim em algum lugar no meio. A localização exata deste ponto pode variar, com base na configuração da opção `innodb_old_blocks_pct`. A intenção é que as pages que são lidas apenas uma vez, como durante um **full table scan**, possam ser aged out do buffer pool mais cedo do que com um algoritmo **LRU** estrito. Para mais informações, consulte Section 14.5.1, “Buffer Pool”.

    Veja Também buffer pool, full table scan, LRU, page.

mini-transaction: Uma fase interna do processamento `InnoDB`, ao fazer alterações no nível **physical** nas estruturas de dados internas durante as operações **DML**. Uma mini-transaction (mtr) não tem noção de **rollback**; múltiplas mini-transactions podem ocorrer dentro de uma única **transaction**. Mini-transactions escrevem informações no **redo log** que são usadas durante o **crash recovery**. Uma mini-transaction também pode acontecer fora do contexto de uma transaction regular, por exemplo, durante o processamento de **purge** por threads de background.

    Veja Também commit, crash recovery, DML, physical, purge, redo log, rollback, transaction.

mixed-mode insert: Uma instrução `INSERT` onde valores **auto-increment** são especificados para algumas, mas não todas, as novas Rows. Por exemplo, um `INSERT` de múltiplos valores pode especificar um valor para a Column auto-increment em alguns casos e `NULL` em outros. O `InnoDB` gera valores auto-increment para as Rows onde o Column value foi especificado como `NULL`. Outro exemplo é uma instrução `INSERT ... ON DUPLICATE KEY UPDATE`, onde valores auto-increment podem ser gerados, mas não usados, para quaisquer Rows duplicadas que são processadas como instruções `UPDATE` em vez de `INSERT`.

    Pode causar problemas de consistency entre Servers **source** e **replica** em uma configuração de **replication**. Pode exigir o ajuste do valor da option de configuração **innodb_autoinc_lock_mode**.

    Veja Também auto-increment, innodb_autoinc_lock_mode, replica, replication, source.

MM.MySQL: Um driver JDBC mais antigo para MySQL que evoluiu para **Connector/J** quando foi integrado ao produto MySQL.

    Veja Também Connector/J.

Mono: Um framework Open Source desenvolvido pela Novell, que funciona com **Connector/NET** e aplicações **C#** em plataformas Linux.

    Veja Também Connector/NET, C#.

mtr: Consulte mini-transaction.

multi-core: Um tipo de processor que pode aproveitar programas multithreaded, como o MySQL Server.

multiversion concurrency control: Consulte MVCC.

mutex: Abreviação informal para “mutex variable”. (Mutex em si é a abreviação de “mutual exclusion”.) O Object de baixo nível que o `InnoDB` usa para representar e aplicar **locks** de exclusive-access a Memory data structures internas. Uma vez que o Lock é adquirido, qualquer outro Process, thread e assim por diante é impedido de adquirir o mesmo Lock. Contraste com **rw-locks**, que o `InnoDB` usa para representar e aplicar **locks** de shared-access a Memory data structures internas. Mutexes e rw-locks são conhecidos coletivamente como **latches**.

    Veja Também latch, lock, Performance Schema, Pthreads, rw-lock.

MVCC: Acrônimo para “multiversion concurrency control”. Esta técnica permite que **transactions** `InnoDB` com certos **isolation levels** executem operações de **consistent read**; ou seja, para consultar Rows que estão sendo updated por outras transactions, e ver os valores de antes que esses updates ocorreram. Esta é uma técnica poderosa para aumentar a **concurrency**, permitindo que as Queries prossigam sem waiting devido a **locks** mantidos pelas outras transactions.

    Esta técnica não é universal no mundo do Database. Alguns outros Database products, e alguns outros MySQL storage engines, não a suportam.

    Veja Também ACID, concurrency, consistent read, isolation level, lock, transaction.

my.cnf: O nome, em sistemas Unix ou Linux, do **option file** MySQL.

    Veja Também my.ini, option file.

my.ini: O nome, em sistemas Windows, do **option file** MySQL.

    Veja Também my.cnf, option file.

MyODBC drivers: Nome obsoleto para **Connector/ODBC**.

    Veja Também Connector/ODBC.

mysql: O programa **mysql** é o command-line interpreter para o Database MySQL. Ele processa instruções **SQL** e também comandos específicos do MySQL, como `SHOW TABLES`, passando Requests para o daemon **mysqld**.

    Veja Também mysqld, SQL.

mysqlbackup command: Uma command-line tool do produto **MySQL Enterprise Backup**. Ele executa uma operação de **hot backup** para tabelas `InnoDB` e um warm backup para `MyISAM` e outros tipos de Tables. Consulte Section 28.1, “MySQL Enterprise Backup Overview” para obter mais informações sobre este comando.

    Veja Também hot backup, MySQL Enterprise Backup, warm backup.

mysqlclient: O nome informal para a library que é implementada pelo arquivo **libmysqlclient**, com extensão `.a` ou `.so`.

    Veja Também libmysqlclient.

mysqld: **mysqld**, também conhecido como MySQL Server, é um único programa multithreaded que faz a maior parte do trabalho em uma instalação MySQL. Ele não gera Processes adicionais. O MySQL Server gerencia o acesso ao data directory MySQL que contém Databases, Tables e outras informações, como log files e status files.

    O **mysqld** é executado como um Unix daemon ou Windows service, esperando constantemente por Requests e executando trabalhos de manutenção em background.

    Veja Também instance, mysql.

MySQLdb: O nome do módulo **Python** Open Source que forma a base da **Python API** MySQL.

    Veja Também Python, Python API.

mysqldump: Um comando que executa um **logical backup** de alguma combinação de Databases, Tables e Table data. Os resultados são instruções SQL que reproduzem os schema Objects originais, dados ou ambos. Para quantidades substanciais de dados, uma solução de **physical backup** como **MySQL Enterprise Backup** é mais rápida, particularmente para a operação de **restore**.

    Veja Também logical backup, MySQL Enterprise Backup, physical backup, restore.

### N

.NET: Veja Também ADO.NET, ASP.net, Connector/NET, Mono, Visual Studio.

native C API: Sinônimo de **libmysqlclient**.

    Veja Também libmysql.

natural key: Uma Column indexed, tipicamente uma **primary key**, onde os valores têm algum significado no mundo real. Geralmente desaconselhado porque:

    *   Se o valor mudar, há potencialmente muita manutenção de Index para re-sort o **clustered index** e atualizar as cópias do valor da Primary Key que são repetidas em cada **secondary index**.

    *   Mesmo valores aparentemente estáveis podem mudar de maneiras imprevisíveis que são difíceis de representar corretamente no Database. Por exemplo, um país pode se transformar em dois ou vários, tornando o country code original obsoleto. Ou, as Rules sobre valores únicos podem ter exceções. Por exemplo, mesmo que os IDs de contribuinte se destinem a ser únicos para uma única pessoa, um Database pode ter que lidar com records que violam essa Rule, como em casos de roubo de identidade. IDs de contribuinte e outros números de ID sensíveis também são Primary Keys ruins, porque podem precisar ser secured, encrypted e tratados de forma diferente de outras Columns.

    Assim, é tipicamente melhor usar valores numéricos arbitrários para formar uma **synthetic key**, por exemplo, usando uma Column **auto-increment**.

    Veja Também auto-increment, clustered index, primary key, secondary index, synthetic key.

neighbor page: Qualquer **page** no mesmo **extent** que uma page específica. Quando uma page é selecionada para ser **flushed**, quaisquer neighbor pages que sejam **dirty** são tipicamente flushed também, como uma optimization de I/O para hard disks tradicionais. No MySQL 5.6 e superior, este comportamento pode ser controlado pela variável de configuração `innodb_flush_neighbors`; você pode desativar essa configuração para SSD drives, que não têm o mesmo overhead para escrever batches menores de dados em localizações Randômicas.

    Veja Também dirty page, extent, flush, page.

next-key lock: Uma combinação de um **record lock** no index record e um gap lock no gap antes do index record.

    Veja Também gap lock, locking, record lock.

non-locking read: Uma **query** que não usa as cláusulas `SELECT ... FOR UPDATE` ou `SELECT ... LOCK IN SHARE MODE`. O único tipo de Query permitido para global tables em uma **read-only transaction**. O oposto de um **locking read**. Consulte Section 14.7.2.3, “Consistent Nonlocking Reads”.

    `SELECT ... FOR SHARE` substitui `SELECT ... LOCK IN SHARE MODE` no MySQL 8.0.1, mas `LOCK IN SHARE MODE` permanece disponível para backward compatibility.

    Veja Também locking read, query, read-only transaction.

non-repeatable read: A situação em que uma Query recupera dados, e uma Query posterior dentro da mesma **transaction** recupera o que deveria ser os mesmos dados, mas as Queries retornam resultados diferentes (alterados por outra transaction que commit nesse meio tempo).

    Este tipo de operação vai contra o princípio **ACID** de Database design. Dentro de uma transaction, os dados devem ser consistentes, com relacionamentos previsíveis e estáveis.

    Entre diferentes **isolation levels**, os non-repeatable reads são impedidos pelos níveis **serializable read** e **repeatable read**, e permitidos pelos níveis **consistent read** e **read uncommitted**.

    Veja Também ACID, consistent read, isolation level, READ UNCOMMITTED, REPEATABLE READ, SERIALIZABLE, transaction.

nonblocking I/O: Um termo da indústria que significa o mesmo que **asynchronous I/O**.

    Veja Também asynchronous I/O.

normalized: Uma estratégia de Database design onde os dados são divididos em múltiplas Tables, e valores duplicados são condensados em Rows únicas representadas por um ID, para evitar o armazenamento, Query e atualização de valores redundantes ou longos. É tipicamente usado em aplicações **OLTP**.

    Por exemplo, um address pode receber um ID único, para que um Database de censo possa representar o relacionamento **lives at this address** associando esse ID a cada membro de uma família, em vez de armazenar múltiplas cópias de um valor complexo, como **123 Main Street, Anytown, USA**.

    Para outro exemplo, embora uma aplicação de address book simples possa armazenar cada phone number na mesma Table que o name e address de uma pessoa, um Database de companhia telefônica pode dar a cada phone number um ID especial e armazenar os números e IDs em uma Table separada. Esta representação normalized pode simplificar updates em larga escala quando os area codes se dividem.

    A Normalization nem sempre é recomendada. Dados que são principalmente queried, e apenas updated deletando inteiramente e reloading, são frequentemente mantidos em Tables menores e maiores com cópias redundantes de valores duplicados. Esta representação de dados é referida como **denormalized** e é frequentemente encontrada em aplicações de data warehousing.

    Veja Também denormalized, foreign key, OLTP, relational.

NoSQL: Um termo amplo para um conjunto de tecnologias de acesso a dados que não usam a linguagem **SQL** como seu principal mecanismo para ler e escrever dados. Algumas tecnologias NoSQL atuam como key-value stores, aceitando apenas reads e writes de valor único; algumas relaxam as restrições da metodologia **ACID**; outras ainda não exigem um **schema** pré-planejado. Os usuários do MySQL podem combinar o processamento estilo NoSQL para velocidade e simplicidade com operações SQL para flexibilidade e conveniência, usando a API **memcached** para acessar diretamente alguns tipos de tabelas MySQL.

    Veja Também ACID, memcached, schema, SQL.

NOT NULL constraint: Um tipo de **constraint** que especifica que uma **column** não pode conter quaisquer valores **NULL**. Ajuda a preservar a **referential integrity**, pois o Database Server pode identificar dados com valores ausentes errôneos. Também ajuda na arithmetic envolvida no Query optimization, permitindo que o optimizer preveja o número de entries em um Index nessa Column.

    Veja Também column, constraint, NULL, primary key, referential integrity.

NULL: Um valor especial em **SQL**, indicando a ausência de dados. Qualquer operação arithmetic ou teste de equality envolvendo um valor `NULL`, por sua vez, produz um resultado `NULL`. (Portanto, é semelhante ao conceito IEEE floating-point de NaN, “not a number”.) Qualquer aggregate calculation como `AVG()` ignora Rows com valores `NULL`, ao determinar por quantas Rows dividir. O único teste que funciona com valores `NULL` usa os idiomas SQL `IS NULL` ou `IS NOT NULL`.

    Os valores `NULL` desempenham um papel nas operações de **index**, porque para desempenho um Database deve minimizar o overhead de rastrear valores de dados ausentes. Tipicamente, os valores `NULL` não são armazenados em um Index, porque uma Query que testa uma Column indexed usando um operador de comparison padrão nunca poderia corresponder a uma Row com um valor `NULL` para essa Column. Pelo mesmo motivo, unique indexes não impedem valores `NULL`; esses valores simplesmente não são representados no Index. Declarar um `NOT NULL` constraint em uma Column fornece a garantia de que não há Rows deixadas de fora do Index, permitindo um melhor Query optimization (contagem precisa de Rows e estimativa de se deve usar o Index).

    Como a **primary key** deve ser capaz de identificar unicamente cada Row na Table, uma Primary Key de coluna única não pode conter quaisquer valores `NULL`, e uma Primary Key de múltiplas Columns não pode conter quaisquer Rows com valores `NULL` em todas as Columns.

    Embora o Oracle Database permita que um valor `NULL` seja concatenated com uma String, o `InnoDB` trata o resultado de tal operação como `NULL`.

    Veja Também index, primary key, SQL.

### O

.OPT file: Um arquivo contendo informações de Database configuration. Arquivos com esta extensão estão incluídos em backups produzidos pelo comando **mysqlbackup** do produto **MySQL Enterprise Backup**.

    Veja Também MySQL Enterprise Backup, comando mysqlbackup.

ODBC: Acrônimo para Open Database Connectivity, uma API padrão da indústria. Tipicamente usado com Servers baseados em Windows, ou aplicações que exigem ODBC para se comunicar com o MySQL. O driver MySQL ODBC é chamado **Connector/ODBC**.

    Veja Também Connector/ODBC.

off-page column: Uma Column contendo variable-length data (como `BLOB` e `VARCHAR`) que é muito longa para caber em uma **B-tree** page. Os dados são armazenados em **overflow pages**. O row format **DYNAMIC** é mais eficiente para tal armazenamento do que o row format **COMPACT** mais antigo.

    Veja Também B-tree, compact row format, dynamic row format, overflow page.

OLTP: Acrônimo para “Online Transaction Processing”. Um Database system, ou uma application de Database, que executa uma workload com muitas **transactions**, com escritas frequentes, bem como reads, tipicamente afetando pequenas quantidades de dados por vez. Por exemplo, um sistema de reserva de companhias aéreas ou uma application que processa Bank deposits. Os dados podem ser organizados em forma **normalized** para um equilíbrio entre a eficiência **DML** (insert/update/delete) e a eficiência **query**. Contraste com **data warehouse**.

    Com seu **row-level locking** e capacidade **transactional**, o **InnoDB** é o storage engine ideal para tabelas MySQL usadas em aplicações OLTP.

    Veja Também data warehouse, DML, InnoDB, query, row lock, transaction.

online: Um tipo de operação que não envolve downtime, blocking ou restricted operation para o Database. Tipicamente aplicado a **DDL**. Operações que encurtam os períodos de restricted operation, como **fast index creation**, evoluíram para um conjunto mais amplo de operações **online DDL** no MySQL 5.6.

    No contexto de backups, um **hot backup** é uma online operation e um **warm backup** é parcialmente uma online operation.

    Veja Também DDL, Fast Index Creation, hot backup, online DDL, warm backup.

online DDL: Um recurso que melhora o desempenho, a concurrency e a availability das tabelas `InnoDB` durante operações **DDL** (principalmente `ALTER TABLE`). Consulte Section 14.13, “InnoDB and Online DDL” para detalhes.

    Os detalhes variam de acordo com o tipo de operação. Em alguns casos, a Table pode ser modificada concurrently enquanto o `ALTER TABLE` está em andamento. A operação pode ser realizada sem uma Table copy, ou usando um tipo de Table copy especialmente otimizado. O uso do DML log space para operações in-place é controlado pela option de configuração `innodb_online_alter_log_max_size`.

    Este recurso é um aprimoramento do recurso **Fast Index Creation** no MySQL 5.5.

    Veja Também DDL, Fast Index Creation, online.

optimistic: Uma metodologia que guia decisões de implementação de baixo nível para um relational database system. Os requisitos de desempenho e **concurrency** em um relational database significam que as operações devem ser iniciadas ou despachadas rapidamente. Os requisitos de consistency e **referential integrity** significam que qualquer operação pode falhar: uma transaction pode ser rolled back, uma operação **DML** pode violar uma constraint, uma Request por um Lock pode causar um deadlock, um Network Error pode causar um timeout. Uma estratégia optimistic é aquela que assume que a maioria das Requests ou tentativas é bem-sucedida, de modo que relativamente pouco trabalho é feito para se preparar para o caso de falha. Quando esta assumption é verdadeira, o Database faz pouco trabalho desnecessário; quando as Requests falham, trabalho extra deve ser feito para fazer o cleanup e undo changes.

    O `InnoDB` usa estratégias optimistic para operações como **locking** e **commits**. Por exemplo, os dados alterados por uma transaction podem ser escritos nos data files antes que o commit ocorra, tornando o próprio commit muito rápido, mas exigindo mais trabalho para desfazer as alterações se a transaction for rolled back.

    O oposto de uma estratégia optimistic é uma **pessimistic**, onde um sistema é otimizado para lidar com operações que não são confiáveis e frequentemente mal sucedidas. Esta metodologia é rara em um Database system, porque tanto cuidado é dedicado à escolha de Hardware, Networks e Algoritmos confiáveis.

    Veja Também commit, concurrency, DML, locking, pessimistic, referential integrity.

optimizer: O componente MySQL que determina os melhores **indexes** e a ordem de **join** a ser usada para uma **query**, com base nas características e distribuição de dados das **tables** relevantes.

    Veja Também index, join, query, table.

option: Um configuration parameter para MySQL, armazenado no **option file** ou passado na command line.

    Para as **options** que se aplicam às tabelas **InnoDB**, cada option name começa com o prefixo `innodb_`.

    Veja Também InnoDB, option, option file.

option file: O arquivo que contém as **options** de configuração para a Instance MySQL. Tradicionalmente, no Linux e Unix este arquivo é chamado `my.cnf`, e no Windows é chamado `my.ini`.

    Veja Também configuration file, my.cnf, my.ini, option.

overflow page: **pages** de Disk alocadas separadamente que contêm Columns de comprimento variável (como `BLOB` e `VARCHAR`) que são muito longas para caber em uma **B-tree** page. As Columns associadas são conhecidas como **off-page columns**.

    Veja Também B-tree, off-page column, page.

### P

.par file: Um arquivo contendo partition definitions. Arquivos com esta extensão estão incluídos em backups produzidos pelo comando `mysqlbackup` do produto **MySQL Enterprise Backup**.

    Com a introdução do suporte de partitioning nativo para tabelas `InnoDB` no MySQL 5.7.6, os `.par files` não são mais criados para tabelas `InnoDB` partitioned. As tabelas `MyISAM` partitioned continuam a usar `.par files` no MySQL 5.7. No MySQL 8.0, o suporte a partitioning é fornecido apenas pelo storage engine `InnoDB`. Como tal, os `.par files` não são mais usados a partir do MySQL 8.0.

    Veja Também MySQL Enterprise Backup, comando mysqlbackup.

page: Uma unidade que representa quantos dados o `InnoDB` transfere a qualquer momento entre o Disk (os **data files**) e a Memory (o **buffer pool**). Uma page pode conter uma ou mais **rows**, dependendo de quantos dados estão em cada Row. Se uma Row não couber inteiramente em uma única page, o `InnoDB` configura estruturas de dados adicionais estilo pointer para que as informações sobre a Row possam ser armazenadas em uma page.

    Uma maneira de encaixar mais dados em cada page é usar o **compressed row format**. Para Tables que usam BLOBs ou large text fields, o **compact row format** permite que essas Columns grandes sejam armazenadas separadamente do resto da Row, reduzindo o overhead de I/O e o uso de Memory para Queries que não fazem referência a essas Columns.

    Quando o `InnoDB` lê ou escreve conjuntos de pages como um batch para aumentar o throughput de I/O, ele lê ou escreve um **extent** de cada vez.

    Todas as estruturas de dados de Disk `InnoDB` dentro de uma Instance MySQL compartilham o mesmo **page size**.

    Veja Também buffer pool, compact row format, compressed row format, data files, extent, page size, row.

page cleaner: Uma **thread** de background `InnoDB` que **flushes** **dirty pages** do **buffer pool**. Antes do MySQL 5.6, esta atividade era realizada pelo **master thread**. O número de page cleaner threads é controlado pela option de configuração `innodb_page_cleaners`, introduzida no MySQL 5.7.4.

    Veja Também buffer pool, dirty page, flush, master thread, thread.

page size: Para Releases até e incluindo o MySQL 5.5, o size de cada **page** `InnoDB` é fixado em 16 kilobytes. Este valor representa um equilíbrio: grande o suficiente para conter os dados para a maioria das Rows, mas pequeno o suficiente para minimizar o overhead de desempenho de transferir dados desnecessários para a Memory. Outros valores não são testados ou suportados.

    A partir do MySQL 5.6, o page size para uma **instance** `InnoDB` pode ser 4KB, 8KB ou 16KB, controlado pela option de configuração `innodb_page_size`. A partir do MySQL 5.7.6, o `InnoDB` também suporta pages sizes de 32KB e 64KB. Para pages sizes de 32KB e 64KB, `ROW_FORMAT=COMPRESSED` não é suportado e o maximum record size é de 16KB.

    O Page size é definido ao criar a Instance MySQL e permanece constante depois. O mesmo page size se aplica a todos os **tablespaces** `InnoDB`, incluindo o **system tablespace**, tablespaces **file-per-table** e **general tablespaces**.

    Pages sizes menores podem ajudar o desempenho com storage devices que usam pequenos Block sizes, particularmente para devices **SSD** em workloads **disk-bound**, como para aplicações **OLTP**. À medida que Rows individuais são updated, menos dados são copiados para a Memory, escritos no Disk, reorganizados, locked e assim por diante.

    Veja Também disk-bound, file-per-table, general tablespace, instance, OLTP, page, SSD, system tablespace, tablespace.

parent table: A Table em um relacionamento de **foreign key** que contém os valores de Column iniciais apontados a partir da **child table**. As consequências de deletar ou atualizar Rows na parent table dependem das cláusulas `ON UPDATE` e `ON DELETE` na foreign key definition. As Rows com valores correspondentes na child table podem ser automaticamente deleted ou updated por sua vez, ou essas Columns podem ser definidas como `NULL`, ou a operação pode ser impedida.

    Veja Também child table, foreign key.

partial backup: Um **backup** que contém algumas das **tables** em um Database MySQL, ou alguns dos Databases em uma Instance MySQL. Contraste com **full backup**.

    Veja Também backup, full backup, table.

partial index: Um **index** que representa apenas parte de um Column value, tipicamente os primeiros N caracteres (o **prefix**) de um valor `VARCHAR` longo.

    Veja Também index, index prefix.

partial trust: Um execution environment tipicamente usado por hosting providers, onde as aplicações têm algumas permissions, mas não outras. Por exemplo, as aplicações podem ser capazes de acessar um Database Server por uma Network, mas serem “sandboxed” em relação à leitura e escrita de arquivos locais.

    Veja Também Connector/NET.

Performance Schema: O schema `performance_schema`, no MySQL 5.5 e superior, apresenta um conjunto de Tables que você pode consultar para obter informações detalhadas sobre as performance characteristics de muitas partes internas do MySQL Server. Consulte Chapter 25, *MySQL Performance Schema*.

    Veja Também INFORMATION_SCHEMA, latch, mutex, rw-lock.

Perl: Uma programming language com raízes em Unix scripting e report generation. Incorpora high-performance regular expressions e file I/O. Grande coleção de módulos reutilizáveis disponíveis através de repositories como CPAN.

    Veja Também Perl API.

Perl API: Uma **API** Open Source para aplicações MySQL escritas na linguagem **Perl**. Implementada através dos módulos `DBI` e `DBD::mysql`. Para detalhes, consulte Section 27.9, “MySQL Perl API”.

    Veja Também API, Perl.

persistent statistics: Um recurso que armazena **index** statistics para **tables** `InnoDB` no Disk, fornecendo melhor **plan stability** para **queries**. Para mais informações, consulte Section 14.8.11.1, “Configuring Persistent Optimizer Statistics Parameters”.

    Veja Também index, optimizer, plan stability, query, table.

pessimistic: Uma metodologia que sacrifica desempenho ou concurrency em favor da segurança. É apropriado se uma alta proporção de Requests ou tentativas puder falhar, ou se as consequências de uma Request falhada forem graves. O `InnoDB` usa o que é conhecido como uma estratégia de **locking** pessimistic, para minimizar a chance de **deadlocks**. No nível da application, você pode evitar deadlocks usando uma estratégia pessimistic de adquirir todos os Locks necessários por uma transaction logo no início.

    Muitos mecanismos de Database built-in usam a metodologia oposta **optimistic**.

    Veja Também deadlock, locking, optimistic.

phantom: Uma Row que aparece no result set de uma Query, mas não no result set de uma Query anterior. Por exemplo, se uma Query for executada duas vezes dentro de uma **transaction**, e nesse meio tempo, outra transaction commit após inserir uma nova Row ou atualizar uma Row para que ela corresponda à cláusula `WHERE` da Query.

    Esta ocorrência é conhecida como phantom read. É mais difícil de se proteger do que um **non-repeatable read**, porque bloquear todas as Rows do primeiro result set de Query não impede as alterações que fazem o phantom aparecer.

    Entre diferentes **isolation levels**, os phantom reads são impedidos pelo nível **serializable read** e permitidos pelos níveis **repeatable read**, **consistent read** e **read uncommitted**.

    Veja Também consistent read, isolation level, non-repeatable read, READ UNCOMMITTED, REPEATABLE READ, SERIALIZABLE, transaction.

PHP: Uma programming language originária de aplicações Web. O código é tipicamente embedded como Blocks dentro do source de uma Web page, com o output substituído na page à medida que é transmitido pelo Web Server. Isso contrasta com aplicações como CGI scripts que imprimem output na forma de uma Web page inteira. O estilo de coding PHP é usado para Web pages altamente interativas e dinâmicas. Os programas PHP modernos também podem ser executados como aplicações command-line ou GUI.

    As aplicações MySQL são escritas usando uma das **PHP APIs**. Os módulos reutilizáveis podem ser escritos em **C** e chamados a partir do PHP.

    Outra tecnologia para escrever Web pages server-side com MySQL é **ASP.net**.

    Veja Também ASP.net, C, PHP API.

PHP API: Várias **APIs** estão disponíveis para escrever aplicações MySQL na linguagem **PHP**: a API MySQL original (`Mysql`), a MySQL Improved Extension (`Mysqli`), o MySQL Native Driver (`Mysqlnd`), as funções MySQL (`PDO_MYSQL`) e o Connector/PHP. Para detalhes, consulte MySQL and PHP.

    Veja Também API, PHP.

physical: Um tipo de operação que envolve aspectos relacionados a Hardware, como Disk blocks, Memory pages, files, bits, Disk reads e assim por diante. Tipicamente, os aspectos physical são importantes durante o performance tuning de nível especialista e o problem diagnosis. Contraste com **logical**.

    Veja Também logical, physical backup.

physical backup: Um **backup** que copia os data files reais. Por exemplo, o comando **`mysqlbackup`** do produto **MySQL Enterprise Backup** produz um physical backup, porque seu output contém data files que podem ser usados diretamente pelo Server `mysqld`, resultando em uma operação de **restore** mais rápida. Contraste com **logical backup**.

    Veja Também backup, logical backup, MySQL Enterprise Backup, restore.

PITR: Acrônimo para **point-in-time recovery**.

    Veja Também point-in-time recovery.

plan stability: Uma propriedade de um **query execution plan**, onde o optimizer faz as mesmas escolhas a cada vez para uma determinada **query**, para que o desempenho seja consistente e previsível.

    Veja Também query, query execution plan.

point-in-time recovery: O processo de restaurar um **backup** para recriar o estado do Database em uma data e hora específicas. Comumente abreviado “PITR”. Como é improvável que o tempo especificado corresponda exatamente ao tempo de um backup, esta técnica geralmente requer uma combinação de um **physical backup** e um **logical backup**. Por exemplo, com o produto **MySQL Enterprise Backup**, você restaura o último backup que você fez antes do ponto no tempo especificado e, em seguida, faz o replay de alterações do **binary log** entre o tempo do backup e o tempo PITR.

    Veja Também backup, binary log, logical backup, MySQL Enterprise Backup, physical backup.

port: O número do socket TCP/IP no qual o Database Server escuta, usado para estabelecer uma **connection**. Frequentemente especificado em conjunto com um **host**. Dependendo do seu uso de Network encryption, pode haver uma port para tráfego não encrypted e outra port para **SSL** connections.

    Veja Também connection, host, SSL.

prefix: Consulte index prefix.

prepared backup: Um conjunto de arquivos de backup, produzidos pelo produto **MySQL Enterprise Backup**, após todas as etapas de aplicação de **binary logs** e **incremental backups** serem concluídas. Os arquivos resultantes estão prontos para serem **restored**. Antes das etapas de apply, os arquivos são conhecidos como **raw backup**.

    Veja Também binary log, hot backup, incremental backup, MySQL Enterprise Backup, raw backup, restore.

prepared statement: Uma instrução SQL que é analisada antecipadamente para determinar um execution plan eficiente. Pode ser executada múltiplas vezes, sem o overhead de parsing e analysis a cada vez. Diferentes valores podem ser substituídos por literals na cláusula `WHERE` a cada vez, através do uso de placeholders. Esta substitution technique melhora a security, protegendo contra alguns tipos de SQL injection attacks. Você também pode reduzir o overhead para converter e copiar valores de retorno para program variables.

    Embora você possa usar prepared statements diretamente através da sintaxe SQL, os vários **Connectors** têm interfaces de programming para manipular prepared statements, e estas APIs são mais eficientes do que passar pelo SQL.

    Veja Também client-side prepared statement, connector, server-side prepared statement.

primary key: Um conjunto de Columns — e, por implicação, o Index baseado neste conjunto de Columns — que pode identificar unicamente cada Row em uma Table. Como tal, deve ser um unique index que não contenha quaisquer valores `NULL`.

    O `InnoDB` exige que cada Table tenha tal Index (também chamado de **clustered index** ou **cluster index**) e organiza o Table storage com base nos Column values da Primary Key.

    Ao escolher os valores da Primary Key, considere usar valores arbitrários (uma **synthetic key**) em vez de confiar em valores derivados de alguma outra source (uma **natural key**).

    Veja Também clustered index, index, natural key, synthetic key.

process: Uma Instance de um programa em execução. O operating system alterna entre múltiplos Processes em execução, permitindo um certo grau de **concurrency**. Na maioria dos operating systems, os Processes podem conter múltiplas **threads** de execution que compartilham recursos. A Context-switching entre threads é mais rápida do que a switching equivalente entre Processes.

    Veja Também concurrency, thread.

pseudo-record: Um record artificial em um Index, usado para **locking** key values ou Ranges que atualmente não existem.

    Veja Também infimum record, locking, supremum record.

Pthreads: O padrão POSIX threads, que define uma API para operações de threading e locking em sistemas Unix e Linux. Em sistemas Unix e Linux, o `InnoDB` usa esta implementação para **mutexes**.

    Veja Também mutex.

purge: Um tipo de garbage collection realizado por uma ou mais threads de background separadas (controladas por `innodb_purge_threads`) que é executado em um Schedule periódico. O Purge faz o parsing e processa **undo log** pages da **history list** com o objetivo de remover index records clustered e secondary que foram marcados para deletion (por instruções `DELETE` anteriores) e não são mais necessários para **MVCC** ou **rollback**. O Purge libera undo log pages da history list após processá-las.

    Veja Também history list, MVCC, rollback, undo log.

purge buffering: A técnica de armazenar alterações em secondary index pages, resultantes de operações `DELETE`, no **change buffer** em vez de escrever as alterações imediatamente, para que as escritas físicas possam ser realizadas para minimizar o I/O randômico. (Como as operações de delete são um processo de duas etapas, esta operação faz o buffering da escrita que normalmente purges um index record que foi previamente marcado para deletion.) É um dos tipos de **change buffering**; os outros são **insert buffering** e **delete buffering**.

    Veja Também change buffer, change buffering, delete buffering, insert buffer, insert buffering.

purge lag: Outro nome para a **history list** `InnoDB`. Relacionado à option de configuração `innodb_max_purge_lag`.

    Veja Também history list, purge.

purge thread: Uma **thread** dentro do Process `InnoDB` que é dedicada a executar a operação periódica de **purge**. No MySQL 5.6 e superior, múltiplas purge threads são habilitadas pela option de configuração `innodb_purge_threads`.

    Veja Também purge, thread.

Python: Uma programming language usada em uma ampla gama de fields, desde Unix scripting até aplicações em larga escala. Inclui runtime typing, built-in high-level data types, recursos orientados a Objects e uma extensive standard library. Frequentemente usada como uma linguagem “glue” entre componentes escritos em outras linguagens. A **Python API** MySQL é o módulo **MySQLdb** Open Source.

    Veja Também MySQLdb, Python API.

Python API: Veja Também API, Python.

### Q

query: Em **SQL**, uma operação que lê informações de uma ou mais **tables**. Dependendo da organização dos dados e dos parâmetros da Query, a lookup pode ser otimizada consultando um **index**. Se múltiplas Tables estiverem envolvidas, a Query é conhecida como um **join**.

    Por razões históricas, às vezes as discussões sobre o processamento interno de instruções usam “query” em um sentido mais amplo, incluindo outros tipos de instruções MySQL, como instruções **DDL** e **DML**.

    Veja Também DDL, DML, index, join, SQL, table.

query execution plan: O conjunto de decisões tomadas pelo optimizer sobre como executar uma **query** da forma mais eficiente, incluindo qual **index** ou Indexes usar e a ordem em que **join** Tables. A **plan stability** envolve as mesmas escolhas sendo feitas consistentemente para uma Query específica.

    Veja Também index, join, plan stability, query.

query log: Consulte general query log.

quiesce: Reduzir a quantidade de Database activity, muitas vezes em preparação para uma operação como um `ALTER TABLE`, um **backup** ou um **shutdown**. Pode ou não envolver fazer o máximo de **flushing** possível, para que o **InnoDB** não continue fazendo I/O de background.

    No MySQL 5.6 e superior, a sintaxe `FLUSH TABLES ... FOR EXPORT` escreve alguns dados no Disk para tabelas `InnoDB` que tornam mais simples fazer backup dessas Tables copiando os data files.

    Veja Também backup, flush, InnoDB, shutdown.

### R

R-tree: Uma estrutura de dados em árvore usada para Indexing espacial de dados multi-dimensionais, como coordenadas geográficas, Retângulos ou Polígonos.

    Veja Também B-tree.

RAID: Acrônimo para “Redundant Array of Inexpensive Drives”. Distribuir operações de I/O por múltiplos Drives permite maior **concurrency** no nível do Hardware e melhora a eficiência das operações de escrita de baixo nível que, de outra forma, seriam realizadas em sequence.

    Veja Também concurrency.

random dive: Uma técnica para estimar rapidamente o número de valores diferentes em uma Column (a **cardinality** da Column). O `InnoDB` samples pages aleatoriamente do Index e usa esses dados para estimar o número de valores diferentes.

    Veja Também cardinality.

raw backup: O conjunto inicial de arquivos de backup produzidos pelo produto **MySQL Enterprise Backup**, antes que as alterações refletidas no **binary log** e quaisquer **incremental backups** sejam aplicadas. Nesta fase, os arquivos não estão prontos para **restore**. Depois que estas alterações são aplicadas, os arquivos são conhecidos como **prepared backup**.

    Veja Também binary log, hot backup, ibbackup_logfile, incremental backup, MySQL Enterprise Backup, prepared backup, restore.

READ COMMITTED: Um **isolation level** que usa uma estratégia de **locking** que relaxa um pouco da proteção entre **transactions**, no interesse do desempenho. As Transactions não podem ver dados não committed de outras transactions, mas podem ver dados que são committed por outra transaction após o início da transaction atual. Assim, uma transaction nunca vê dados ruins, mas os dados que ela vê podem depender, em certa medida, do tempo de outras transactions.

    Quando uma transaction com este isolation level executa operações `UPDATE ... WHERE` ou `DELETE ... WHERE`, outras transactions podem ter que esperar. A transaction pode executar operações `SELECT ... FOR UPDATE` e `LOCK IN SHARE MODE` sem fazer outras transactions esperar.

    `SELECT ... FOR SHARE` substitui `SELECT ... LOCK IN SHARE MODE` no MySQL 8.0.1, mas `LOCK IN SHARE MODE` permanece disponível para backward compatibility.

    Veja Também ACID, isolation level, locking, REPEATABLE READ, SERIALIZABLE, transaction.

read phenomena: Phenomena como **dirty reads**, **non-repeatable reads** e **phantom** reads que podem ocorrer quando uma transaction lê dados que outra transaction modificou.

    Veja Também dirty read, non-repeatable read, phantom.

READ UNCOMMITTED: O **isolation level** que fornece a menor quantidade de proteção entre transactions. As Queries empregam uma estratégia de **locking** que lhes permite prosseguir em situações em que normalmente esperariam por outra transaction. No entanto, este desempenho extra vem ao custo de resultados menos confiáveis, incluindo dados que foram alterados por outras transactions e ainda não committed (conhecido como **dirty read**). Use este isolation level com grande cautela e esteja ciente de que os resultados podem não ser consistentes ou reproduzíveis, dependendo do que outras transactions estão fazendo ao mesmo tempo. Tipicamente, transactions com este isolation level apenas fazem Queries, não operações de insert, update ou delete.

    Veja Também ACID, dirty read, isolation level, locking, transaction.

read view: Um snapshot interno usado pelo mecanismo **MVCC** do `InnoDB`. Certas **transactions**, dependendo de seu **isolation level**, veem os valores de dados como eram no momento em que a transaction (ou em alguns casos, a instrução) começou. Isolation levels que usam um read view são **REPEATABLE READ**, **READ COMMITTED** e **READ UNCOMMITTED**.

    Veja Também isolation level, MVCC, READ COMMITTED, READ UNCOMMITTED, REPEATABLE READ, transaction.

read-ahead: Um tipo de Request de I/O que faz o prefetch de um grupo de **pages** (um **extent** inteiro) para o **buffer pool** asynchronously, caso estas pages sejam necessárias em breve. A técnica linear read-ahead faz o prefetch de todas as pages de um extent com base em Access patterns para pages no extent precedente. A técnica random read-ahead faz o prefetch de todas as pages para um extent quando um certo número de pages do mesmo extent estão no buffer pool. O Random read-ahead não faz parte do MySQL 5.5, mas é reintroduzido no MySQL 5.6 sob o controle da option de configuração `innodb_random_read_ahead`.

    Veja Também buffer pool, extent, page.

read-only transaction: Um tipo de **transaction** que pode ser otimizado para tabelas `InnoDB` eliminando parte da bookkeeping envolvida na criação de um **read view** para cada transaction. Só pode executar Queries **non-locking read**. Pode ser iniciado explicitamente com a sintaxe `START TRANSACTION READ ONLY`, ou automaticamente sob certas condições. Consulte Section 8.5.3, “Optimizing InnoDB Read-Only Transactions” para detalhes.

    Veja Também non-locking read, read view, transaction.

record lock: Um Lock em um index record. Por exemplo, `SELECT c1 FROM t WHERE c1 = 10 FOR UPDATE;` impede que qualquer outra transaction insira, atualize ou delete Rows onde o valor de `t.c1` é 10. Contraste com **gap lock** e **next-key lock**.

    Veja Também gap lock, lock, next-key lock.

redo: Os dados, em unidades de records, registrados no **redo log** quando as instruções DML fazem alterações nas tabelas `InnoDB`. É usado durante o **crash recovery** para corrigir dados escritos por **transactions** incompletas. O valor **LSN** sempre crescente representa a quantidade cumulative de dados redo que passou pelo redo log.

    Veja Também crash recovery, DML, LSN, redo log, transaction.

redo log: Uma estrutura de dados baseada em Disk usada durante o **crash recovery**, para corrigir dados escritos por **transactions** incompletas. Durante a operação normal, ele codifica Requests para alterar `InnoDB` table data, que resultam de instruções SQL ou API calls de baixo nível. Modifications que não terminaram de atualizar os **data files** antes de um **shutdown** inesperado são replayed automaticamente.

    O redo log é fisicamente representado no Disk como um conjunto de redo log files. Os dados do redo log são codificados em termos de records afetados; estes dados são coletivamente referidos como **redo**. A passagem de dados pelo redo log é representada por um valor **LSN** sempre crescente.

    Para mais informações, consulte Section 14.6.6, “Redo Log”

    Veja Também crash recovery, data files, ib_logfile, log buffer, LSN, redo, shutdown, transaction.

redo log archiving: Um recurso `InnoDB` que, quando habilitado, escreve sequencialmente redo log records em um archive file para evitar a potencial perda de dados que pode ocorrer quando um backup utility falha em acompanhar a geração do redo log enquanto uma operação de backup está em andamento. Para mais informações, consulte Redo Log Archiving.

    Veja Também redo log.

redundant row format: O **row format** `InnoDB` mais antigo. Antes do MySQL 5.0.3, era o único row format disponível no `InnoDB`. Do MySQL 5.0.3 ao MySQL 5.7.8, o row format padrão é **COMPACT**. A partir do MySQL 5.7.9, o row format padrão é definido pela option de configuração `innodb_default_row_format`, que tem uma configuração padrão de **DYNAMIC**. Você ainda pode especificar o row format **REDUNDANT** para compatibilidade com tabelas `InnoDB` mais antigas.

    Para mais informações, consulte Section 14.11, “InnoDB Row Formats”.

    Veja Também compact row format, dynamic row format, row format.

referential integrity: A técnica de manter os dados sempre em um format consistente, parte da filosofia **ACID**. Em particular, os dados em Tables diferentes são mantidos consistentes através do uso de **foreign key constraints**, que podem impedir que alterações ocorram ou propagar automaticamente essas alterações para todas as Tables relacionadas. Mecanismos relacionados incluem o **unique constraint**, que impede que valores duplicados sejam inserted por engano, e o **NOT NULL constraint**, que impede que valores em branco sejam inserted por engano.

    Veja Também ACID, FOREIGN KEY constraint, NOT NULL constraint, unique constraint.

relational: Um aspecto importante dos Database systems modernos. O Database Server codifica e aplica relacionamentos como one-to-one, one-to-many, many-to-one e uniqueness. Por exemplo, uma pessoa pode ter zero, um ou muitos phone numbers em um Database de address; um único phone number pode estar associado a vários membros da família. Em um Database financeiro, uma pessoa pode ser obrigada a ter exatamente um ID de contribuinte, e qualquer ID de contribuinte só pode ser associado a uma pessoa.

    O Database Server pode usar estes relacionamentos para impedir que dados ruins sejam inserted e para encontrar maneiras eficientes de buscar informações. Por exemplo, se um valor for declarado único, o Server pode parar de buscar assim que a primeira correspondência for encontrada, e pode rejeitar tentativas de inserir uma segunda cópia do mesmo valor.

    No nível do Database, estes relacionamentos são expressos através de recursos SQL, como **columns** dentro de uma Table, **constraints** unique e `NOT NULL`, **foreign keys** e diferentes tipos de operações de join. Relacionamentos complexos geralmente envolvem dados divididos entre mais de uma Table. Frequentemente, os dados são **normalized**, para que valores duplicados em relacionamentos one-to-many sejam armazenados apenas uma vez.

    Em um contexto matemático, as relations dentro de um Database são derivadas da set theory. Por exemplo, os operadores `OR` e `AND` de uma cláusula `WHERE` representam as noções de union e intersection.

    Veja Também ACID, column, constraint, foreign key, normalized.

relevance: No recurso **full-text search**, um número que significa a similaridade entre a search string e os dados no **FULLTEXT index**. Por exemplo, quando você busca uma única word, essa word é tipicamente mais relevante para uma Row onde ocorre várias vezes no texto do que para uma Row onde aparece apenas uma vez.

    Veja Também full-text search, FULLTEXT index.

REPEATABLE READ: O **isolation level** padrão para `InnoDB`. Impede que quaisquer Rows que são queried sejam alteradas por outras **transactions**, bloqueando assim **non-repeatable reads**, mas não **phantom** reads. Ele usa uma estratégia de **locking** moderadamente rigorosa para que todas as Queries dentro de uma transaction vejam dados do mesmo snapshot, ou seja, os dados como estavam no momento em que a transaction começou.

    Quando uma transaction com este isolation level executa operações `UPDATE ... WHERE`, `DELETE ... WHERE`, `SELECT ... FOR UPDATE` e `LOCK IN SHARE MODE`, outras transactions podem ter que esperar.

    `SELECT ... FOR SHARE` substitui `SELECT ... LOCK IN SHARE MODE` no MySQL 8.0.1, mas `LOCK IN SHARE MODE` permanece disponível para backward compatibility.

    Veja Também ACID, consistent read, isolation level, locking, phantom, transaction.

repertoire: Repertoire é um termo aplicado a character sets. Um character set repertoire é a coleção de caracteres no set. Consulte Section 10.2.1, “Character Set Repertoire”.

replica: Uma máquina **server** de Database em uma topologia de **replication** que recebe alterações de outro Server (a **source**) e aplica essas mesmas alterações. Assim, mantém o mesmo conteúdo que a source, embora possa ficar um pouco atrasada.

    No MySQL, as replicas são comumente usadas em disaster recovery, para ocupar o lugar de uma source que falha. Elas também são comumente usadas para testar software upgrades e novas settings, para garantir que as alterações de Database configuration não causem problemas de desempenho ou confiabilidade.

    As Replicas geralmente têm high workloads, porque processam todas as operações **DML** (write) retransmitidas da source, bem como Queries de usuário. Para garantir que as replicas possam aplicar alterações da source rápido o suficiente, elas frequentemente têm fast I/O devices e CPU e Memory suficientes para executar múltiplas Database Instances no mesmo Server. Por exemplo, a source pode usar armazenamento hard drive enquanto as replicas usam **SSD**s.

    Veja Também DML, replication, server, source, SSD.

replication: A prática de enviar alterações de uma **source** para uma ou mais **replicas**, para que todos os Databases tenham os mesmos dados. Esta técnica tem uma ampla gama de usos, como load-balancing para melhor scalability, disaster recovery e teste de software upgrades e configuration changes. As alterações podem ser enviadas entre os Databases por métodos chamados **row-based replication** e **statement-based replication**.

    Veja Também replica, row-based replication, source, statement-based replication.

restore: O processo de colocar um conjunto de arquivos de backup do produto **MySQL Enterprise Backup** no lugar para uso pelo MySQL. Esta operação pode ser realizada para corrigir um Database corrupted, para retornar a algum ponto anterior no tempo ou (em um contexto de **replication**) para configurar uma nova **replica**. No produto **MySQL Enterprise Backup**, esta operação é realizada pela opção `copy-back` do comando `mysqlbackup`.

    Veja Também hot backup, MySQL Enterprise Backup, mysqlbackup command, prepared backup, replica, replication.

rollback: Uma instrução **SQL** que encerra uma **transaction**, desfazendo quaisquer alterações feitas pela transaction. É o oposto de **commit**, que torna permanentes quaisquer alterações feitas na transaction.

    Por padrão, o MySQL usa a configuração **autocommit**, que emite automaticamente um commit após cada instrução SQL. Você deve alterar esta configuração antes de poder usar a técnica de rollback.

    Veja Também ACID, autocommit, commit, SQL, transaction.

rollback segment: A storage area contendo os **undo logs**. Os rollback segments tradicionalmente residem no **system tablespace**. A partir do MySQL 5.6, os rollback segments podem residir em **undo tablespaces**. A partir do MySQL 5.7, os rollback segments também são alocados para o *global temporary tablespace*.

    Veja Também system tablespace, undo log, undo tablespace.

row: A estrutura de dados logical definida por um conjunto de **columns**. Um conjunto de Rows compõe uma **table**. Dentro dos **data files** `InnoDB`, cada **page** pode conter uma ou mais Rows.

    Embora o `InnoDB` use o termo **row format** para consistency com a sintaxe MySQL, o row format é uma propriedade de cada Table e se aplica a todas as Rows dessa Table.

    Veja Também column, data files, page, row format, table.

row format: O format de armazenamento em Disk para **rows** de uma **table** `InnoDB`. À medida que o `InnoDB` ganha novas capabilities, como **compression**, novos row formats são introduzidos para suportar as melhorias resultantes na storage efficiency e no desempenho.

    O row format de uma Table `InnoDB` é especificado pela option `ROW_FORMAT` ou pela option de configuração `innodb_default_row_format` (introduzida no MySQL 5.7.9). Os row formats incluem `REDUNDANT`, `COMPACT`, `COMPRESSED` e `DYNAMIC`. Para visualizar o row format de uma Table `InnoDB`, emita a instrução `SHOW TABLE STATUS` ou consulte os metadados da Table `InnoDB` no `INFORMATION_SCHEMA`.

    Veja Também compact row format, compressed row format, compression, dynamic row format, redundant row format, row, table.

row lock: Um **lock** que impede que uma Row seja acessada de forma incompatível por outra **transaction**. Outras Rows na mesma Table podem ser livremente escritas por outras transactions. Este é o tipo de **locking** feito por operações **DML** em tabelas **InnoDB**.

    Contraste com **table locks** usados pelo `MyISAM`, ou durante operações **DDL** em tabelas `InnoDB` que não podem ser feitas com **online DDL**; esses Locks bloqueiam o acesso concorrente à Table.

    Veja Também DDL, DML, InnoDB, lock, locking, online DDL, table lock, transaction.

row-based replication: Uma forma de **replication** onde os events são propagados da **source**, especificando como alterar Rows individuais na **replica**. É seguro usar para todas as settings da opção `innodb_autoinc_lock_mode`.

    Veja Também auto-increment locking, innodb_autoinc_lock_mode, replica, replication, source, statement-based replication.

row-level locking: O mecanismo de **locking** usado para tabelas **InnoDB**, contando com **row locks** em vez de **table locks**. Múltiplas **transactions** podem modificar a mesma Table concurrently. Somente se duas transactions tentarem modificar a mesma Row, uma das transactions espera que a outra seja concluída (e libere seus row locks).

    Veja Também InnoDB, locking, row lock, table lock, transaction.

Ruby: Uma programming language que enfatiza a dynamic typing e a Object-oriented programming. Alguma sintaxe é familiar aos desenvolvedores **Perl**.

    Veja Também API, Perl, Ruby API.

Ruby API: `mysql2`, baseado na library **libmysqlclient API**, está disponível para programadores Ruby que desenvolvem aplicações MySQL. Para mais informações, consulte Section 27.11, “MySQL Ruby APIs”.

    Veja Também libmysql, Ruby.

rw-lock: O Object de baixo nível que o `InnoDB` usa para representar e aplicar **locks** de shared-access a Memory data structures internas seguindo certas Rules. Contraste com **mutexes**, que o `InnoDB` usa para representar e aplicar exclusive access a Memory data structures internas. Mutexes e rw-locks são conhecidos coletivamente como **latches**.

    Os tipos `rw-lock` incluem `s-locks` (shared locks), `x-locks` (exclusive locks) e `sx-locks` (shared-exclusive locks).

    *   Um `s-lock` fornece read access a um common resource.

    *   Um `x-lock` fornece write access a um common resource enquanto não permite inconsistent reads por outras threads.

    *   Um `sx-lock` fornece write access a um common resource enquanto permite inconsistent reads por outras threads. `sx-locks` foram introduzidos no MySQL 5.7 para otimizar a concurrency e melhorar a scalability para workloads read-write.

    A matriz a seguir resume a compatibility de tipo rw-lock.

    | | *`S`* | *`SX`* | *`X`* |
    |---|---|---|---|
    | *`S`* | Compatível | Compatível | Conflito |
    | *`SX`* | Compatível | Conflito | Conflito |
    | *`X`* | Conflito | Conflito | Conflito |

    Veja Também latch, lock, mutex, Performance Schema.

### S

savepoint: Savepoints ajudam a implementar **transactions** nested. Eles podem ser usados para fornecer scope a operações em Tables que fazem parte de uma transaction maior. Por exemplo, agendar uma trip em um reservation system pode envolver o booking de vários flights diferentes; se um flight desejado estiver unavailable, você pode **roll back** as alterações envolvidas no booking dessa perna, sem fazer o rollback dos flights anteriores que foram booked com sucesso.

    Veja Também rollback, transaction.

scalability: A capacidade de adicionar mais trabalho e emitir mais Requests simultâneas para um sistema, sem uma queda repentina no desempenho devido ao excesso dos limites de system capacity. A software architecture, hardware configuration, application coding e o tipo de workload desempenham um papel na scalability. Quando o sistema atinge sua capacity máxima, as técnicas populares para aumentar a scalability são **scale up** (aumentar a capacity do Hardware ou software existente) e **scale out** (adicionar novos Servers e mais Instances de MySQL). Frequentemente emparelhado com **availability** como aspectos críticos de uma implementação em larga escala.

    Veja Também availability, scale out, scale up.

scale out: Uma técnica para aumentar a **scalability** adicionando novos Servers e mais Instances de MySQL. Por exemplo, configurar replication, NDB Cluster, connection pooling ou outros recursos que distribuem o trabalho por um grupo de Servers. Contraste com **scale up**.

    Veja Também scalability, scale up.

scale up: Uma técnica para aumentar a **scalability** aumentando a capacity do Hardware ou software existente. Por exemplo, aumentar a Memory em um Server e ajustar parâmetros relacionados à Memory, como `innodb_buffer_pool_size` e `innodb_buffer_pool_instances`. Contraste com **scale out**.

    Veja Também scalability, scale out.

schema: Conceitualmente, um schema é um conjunto de Database Objects inter-relacionados, como Tables, Columns de Table, data types das Columns, Indexes, foreign keys e assim por diante. Estes Objects estão conectados através da sintaxe SQL, porque as Columns compõem as Tables, as foreign keys referem-se a Tables e Columns e assim por diante. Idealmente, eles também estão conectados logicamente, trabalhando juntos como parte de uma application unificada ou framework flexível. Por exemplo, os Databases **INFORMATION_SCHEMA** e **performance_schema** usam “schema” em seus nomes para enfatizar os relacionamentos estreitos entre as Tables e Columns que contêm.

    No MySQL, fisicamente, um **schema** é sinônimo de um **database**. Você pode substituir a Keyword `SCHEMA` em vez de `DATABASE` na sintaxe SQL do MySQL, por exemplo, usando `CREATE SCHEMA` em vez de `CREATE DATABASE`.

    Alguns outros Database products fazem uma distinção. Por exemplo, no produto Oracle Database, um **schema** representa apenas uma parte de um Database: as Tables e outros Objects de propriedade de um único usuário.

    Veja Também database, INFORMATION_SCHEMA, Performance Schema.

search index: No MySQL, as Queries de **full-text search** usam um tipo especial de Index, o **FULLTEXT index**. No MySQL 5.6.4 e superior, as tabelas `InnoDB` e `MyISAM` suportam Indexes `FULLTEXT`; anteriormente, estes Indexes estavam disponíveis apenas para tabelas `MyISAM`.

    Veja Também full-text search, FULLTEXT index.

secondary index: Um tipo de **index** `InnoDB` que representa um subset de Columns de Table. Uma Table `InnoDB` pode ter zero, um ou muitos secondary indexes. (Contraste com o **clustered index**, que é necessário para cada Table `InnoDB` e armazena os dados para todas as Columns da Table.)

    Um secondary index pode ser usado para satisfazer Queries que exigem apenas valores das Columns indexed. Para Queries mais complexas, pode ser usado para identificar as Rows relevantes na Table, que são então retrieved através de lookups usando o clustered index.

    Criar e droppar secondary indexes tradicionalmente envolve overhead significativo de cópia de todos os dados na Table `InnoDB`. O recurso **fast index creation** torna as instruções `CREATE INDEX` e `DROP INDEX` muito mais rápidas para secondary indexes `InnoDB`.

    Veja Também clustered index, Fast Index Creation, index.

segment: Uma divisão dentro de um **tablespace** `InnoDB`. Se um tablespace for análogo a um Directory, os segments são análogos a arquivos dentro desse Directory. Um segment pode crescer. Novos segments podem ser criados.

    Por exemplo, dentro de um tablespace **file-per-table**, os dados da Table estão em um segment e cada Index associado está em seu próprio segment. O **system tablespace** contém muitos segments diferentes, porque pode conter muitas Tables e seus Indexes associados. Antes do MySQL 8.0, o system tablespace também inclui um ou mais **rollback segments** usados para **undo logs**.

    Os Segments crescem e diminuem à medida que os dados são inserted e deleted. Quando um segment precisa de mais espaço, ele é extended por um **extent** (1 megabyte) de cada vez. Da mesma forma, um segment libera o espaço de um extent quando todos os dados nesse extent não são mais necessários.

    Veja Também extent, file-per-table, rollback segment, system tablespace, tablespace, undo log.

selectivity: Uma propriedade da data distribution, o número de valores distintos em uma Column (sua **cardinality**) dividido pelo número de records na Table. Alta selectivity significa que os Column values são relativamente únicos e podem ser retrieved eficientemente através de um Index. Se você (ou o Query optimizer) puder prever que um teste em uma cláusula `WHERE` corresponde apenas a um pequeno número (ou proporção) de Rows em uma Table, a **query** geral tende a ser eficiente se avaliar esse teste primeiro, usando um Index.

    Veja Também cardinality, query.

semi-consistent read: Um tipo de operação de read usada para instruções `UPDATE`, que é uma combinação de **READ COMMITTED** e **consistent read**. Quando uma instrução `UPDATE` examina uma Row que já está locked, o `InnoDB` retorna a versão committed mais recente para o MySQL para que o MySQL possa determinar se a Row corresponde à condição `WHERE` do `UPDATE`. Se a Row corresponder (deve ser updated), o MySQL lê a Row novamente, e desta vez o `InnoDB` a bloqueia ou espera por um Lock nela. Este tipo de operação de read só pode acontecer quando a transaction tem o **isolation level** READ COMMITTED, ou quando a opção `innodb_locks_unsafe_for_binlog` está habilitada. `innodb_locks_unsafe_for_binlog` foi removido no MySQL 8.0.

    Veja Também consistent read, isolation level, READ COMMITTED.

SERIALIZABLE: O **isolation level** que usa a estratégia de locking mais conservadora, para impedir que quaisquer outras **transactions** insiram ou alterem dados que foram lidos por esta transaction, até que ela termine. Desta forma, a mesma Query pode ser executada repetidamente dentro de uma transaction, e ter certeza de recuperar o mesmo conjunto de resultados a cada vez. Qualquer tentativa de alterar dados que foram committed por outra transaction desde o início da transaction atual, faz com que a transaction atual espere.

    Este é o isolation level padrão especificado pelo padrão SQL. Na prática, este grau de strictness é raramente necessário, então o isolation level padrão para `InnoDB` é o próximo mais rigoroso, **REPEATABLE READ**.

    Veja Também ACID, consistent read, isolation level, locking, REPEATABLE READ, transaction.

server: Um tipo de programa que é executado continuamente, esperando para receber e agir sobre Requests de outro programa (o **client**). Como muitas vezes um computador inteiro é dedicado a executar um ou mais programas Server (como um Database Server, um Web Server, um Application Server ou alguma combinação destes), o termo **server** também pode se referir ao computador que executa o software Server.

    Veja Também client, mysqld.

server-side prepared statement: Um **prepared statement** gerenciado pelo MySQL Server. Historicamente, problemas com server-side prepared statements levaram os desenvolvedores **Connector/J** e **Connector/PHP** a usar às vezes **client-side prepared statements** em vez disso. Com as versões modernas do MySQL Server, os server-side prepared statements são recomendados para desempenho, scalability e eficiência de Memory.

    Veja Também client-side prepared statement, Connector/J, Connector/PHP, prepared statement.

servlet: Veja Também Connector/J.

shared lock: Um tipo de **lock** que permite que outras **transactions** leiam o Object locked, e também adquiram outros shared locks nele, mas não escrevam nele. O oposto de **exclusive lock**.

    Veja Também exclusive lock, lock, transaction.

shared tablespace: Outra forma de se referir ao **system tablespace** ou a um **general tablespace**. General tablespaces foram introduzidos no MySQL 5.7. Mais de uma Table pode residir em um shared tablespace. Apenas uma única Table pode residir em um tablespace *file-per-table*.

    Veja Também general tablespace, system tablespace.

sharp checkpoint: O processo de **flushing** para o Disk de todas as **dirty** buffer pool pages cujas redo entries estão contidas em certa porção do **redo log**. Ocorre antes que o `InnoDB` reutilize uma porção de um log file; os log files são usados de forma circular. Tipicamente ocorre com **workloads** write-intensive.

    Veja Também dirty page, flush, redo log, workload.

shutdown: O processo de parar o MySQL Server. Por padrão, este processo faz o cleanup de operações para tabelas **InnoDB**, então o `InnoDB` pode ser **slow** para fazer o shutdown, mas rápido para iniciar mais tarde. Se você ignorar as operações de cleanup, é **fast** para fazer o shutdown, mas o cleanup deve ser realizado durante o próximo restart.

    O modo de shutdown para `InnoDB` é controlado pela opção `innodb_fast_shutdown`.

    Veja Também fast shutdown, InnoDB, slow shutdown, startup.

slave: Consulte replica.

slow query log: Um tipo de **log** usado para performance tuning de instruções SQL processadas pelo MySQL Server. A informação do log é armazenada em um arquivo. Você deve habilitar este recurso para usá-lo. Você controla quais categories de instruções SQL “slow” são logged. Para mais informações, consulte Section 5.4.5, “The Slow Query Log”.

    Veja Também general query log, log.

slow shutdown: Um tipo de **shutdown** que faz operações de flushing `InnoDB` adicionais antes de ser concluído. Também conhecido como **clean shutdown**. Especificado pelo configuration parameter `innodb_fast_shutdown=0` ou o comando `SET GLOBAL innodb_fast_shutdown=0;`. Embora o shutdown em si possa levar mais tempo, esse tempo deve ser economizado na startup subsequente.

    Veja Também clean shutdown, fast shutdown, shutdown.

snapshot: Uma representação de dados em um momento específico, que permanece a mesma mesmo quando as alterações são **committed** por outras **transactions**. Usado por certos **isolation levels** para permitir **consistent reads**.

    Veja Também commit, consistent read, isolation level, transaction.

sort buffer: O buffer usado para classificar dados durante a criação de um Index `InnoDB`. O Sort buffer size é configurado usando a option de configuração `innodb_sort_buffer_size`.

source: Uma máquina Database Server em um cenário de **replication** que processa as Requests iniciais de insert, update e delete para dados. Estas alterações são propagadas e repetidas em outros Servers conhecidos como **replicas**.

    Veja Também replica, replication.

space ID: Um Identifier usado para identificar unicamente um **tablespace** `InnoDB` dentro de uma Instance MySQL. O space ID para o **system tablespace** é sempre zero; este mesmo ID se aplica a todas as Tables dentro do system tablespace ou dentro de um general tablespace. Cada tablespace **file-per-table** e **general tablespace** tem seu próprio space ID.

    Antes do MySQL 5.6, este valor hardcoded apresentava dificuldades na movimentação de arquivos tablespace `InnoDB` entre MySQL Instances. A partir do MySQL 5.6, você pode copiar arquivos tablespace entre Instances usando o recurso **transportable tablespace**, envolvendo as instruções `FLUSH TABLES ... FOR EXPORT`, `ALTER TABLE ... DISCARD TABLESPACE` e `ALTER TABLE ... IMPORT TABLESPACE`. A informação necessária para ajustar o space ID é transmitida no **.cfg file** que você copia junto com o tablespace. Consulte Section 14.6.1.3, “Importing InnoDB Tables” para detalhes.

    Veja Também .cfg file, file-per-table, general tablespace, .ibd file, system tablespace, tablespace, transportable tablespace.

sparse file: Um tipo de arquivo que usa o file system space de forma mais eficiente, escrevendo metadata que representa blocos vazios no Disk em vez de escrever o espaço vazio real. O recurso **transparent page compression** do `InnoDB` depende do suporte a sparse file. Para mais informações, consulte Section 14.9.2, “InnoDB Page Compression”.

    Veja Também hole punching, transparent page compression.

spin: Um tipo de operação de **wait** que testa continuamente se um recurso se torna disponível. Esta técnica é usada para recursos que são tipicamente mantidos apenas por breves períodos, onde é mais eficiente esperar em um “busy loop” do que colocar a thread para sleep e executar um context switch. Se o recurso não se tornar disponível em um curto espaço de tempo, o spin loop cessa e outra wait technique é usada.

    Veja Também latch, lock, mutex, wait.

Spring: Um framework de application baseado em Java projetado para auxiliar no application design, fornecendo uma maneira de configurar componentes.

    Veja Também J2EE.

SQL: A Structured Query Language que é padrão para executar Database operations. Frequentemente dividida nas categories **DDL**, **DML** e **queries**. O MySQL inclui algumas categories de instruções adicionais, como **replication**. Consulte Chapter 9, *Language Structure* para os Building Blocks da sintaxe SQL, Chapter 11, *Data Types* para os data types a serem usados para Columns de Table MySQL, Chapter 13, *SQL Statements* para detalhes sobre instruções SQL e suas categories associadas, e Chapter 12, *Functions and Operators* para funções padrão e específicas do MySQL a serem usadas em Queries.

    Veja Também DDL, DML, query, replication.

SQLState: Um Error code definido pelo padrão **JDBC**, para exception handling por aplicações que usam **Connector/J**.

    Veja Também Connector/J, JDBC.

SSD: Acrônimo para “solid-state drive” (unidade de estado sólido). Um tipo de storage device com diferentes performance characteristics de um hard disk drive tradicional (**HDD**): menor storage capacity, mais rápido para reads randômicas, sem moving parts e com várias considerações que afetam o desempenho de write. Suas performance characteristics podem influenciar o throughput de uma workload **disk-bound**.

    Veja Também disk-bound, HDD.

SSL: Acrônimo para “secure sockets layer”. Fornece a encryption layer para Network communication entre uma application e um Database Server MySQL.

    Veja Também keystore, truststore.

startup: O processo de iniciar o MySQL Server. Tipicamente feito por um dos programas listados em Section 4.3, “Server and Server-Startup Programs”. O oposto de **shutdown**.

    Veja Também shutdown.

statement interceptor: Um tipo de **interceptor** para tracing, debugging ou aumentar instruções SQL emitidas por uma application de Database. Às vezes também conhecido como **command interceptor**.

    Em aplicações **Java** que usam **Connector/J**, configurar este tipo de interceptor envolve implementar a interface `com.mysql.jdbc.StatementInterceptorV2` e adicionar uma propriedade `statementInterceptors` à **connection string**.

    Em aplicações **Visual Studio** que usam **Connector/NET**, configurar este tipo de interceptor envolve definir uma classe que herda da classe `BaseCommandInterceptor` e especificar esse nome de classe como parte da connection string.

    Veja Também command interceptor, connection string, Connector/J, Connector/NET, interceptor, Java, Visual Studio.

statement-based replication: Uma forma de **replication** onde as instruções SQL são enviadas da **source** e replayed na **replica**. Requer algum cuidado com a setting para a opção `innodb_autoinc_lock_mode`, para evitar potenciais problemas de tempo com **auto-increment locking**.

    Veja Também auto-increment locking, innodb_autoinc_lock_mode, replica, replication, row-based replication, source.

statistics: Valores estimados relacionados a cada **table** e **index** `InnoDB`, usados para construir um **query execution plan** eficiente. Os principais valores são a **cardinality** (número de valores distintos) e o número total de Rows de Table ou Index entries. As statistics para a Table representam os dados em seu **primary key** index. As statistics para um **secondary index** representam as Rows cobertas por esse Index.

    Os valores são estimados em vez de contados precisamente porque a qualquer momento, diferentes **transactions** podem estar inserindo e deletando Rows da mesma Table. Para evitar que os valores sejam recalculados frequentemente, você pode habilitar **persistent statistics**, onde os valores são armazenados em tabelas de sistema `InnoDB` e atualizados apenas quando você emite uma instrução `ANALYZE TABLE`.

    Você pode controlar como os valores **NULL** são tratados ao calcular statistics através da option de configuração `innodb_stats_method`.

    Outros tipos de statistics estão disponíveis para Database Objects e Database activity através das tabelas **INFORMATION_SCHEMA** e **PERFORMANCE_SCHEMA**.

    Veja Também cardinality, index, INFORMATION_SCHEMA, NULL, Performance Schema, persistent statistics, primary key, query execution plan, secondary index, table, transaction.

stemming: A capacidade de buscar diferentes variations de uma word com base em uma root word comum, como singular e plural, ou verb tense passado, presente e futuro. Este recurso é atualmente suportado no recurso **full-text search** `MyISAM`, mas não em **FULLTEXT indexes** para tabelas `InnoDB`.

    Veja Também full-text search, FULLTEXT index.

stopword: Em um **FULLTEXT index**, uma word que é considerada comum ou trivial o suficiente para ser omitida do **search index** e ignorada em search queries. Diferentes configuration settings controlam o processamento de stopword para tabelas `InnoDB` e `MyISAM`. Consulte Section 12.9.4, “Full-Text Stopwords” para detalhes.

    Veja Também FULLTEXT index, search index.

storage engine: Um componente do Database MySQL que executa o trabalho de baixo nível de armazenar, atualizar e consultar dados. No MySQL 5.5 e superior, o **InnoDB** é o storage engine padrão para novas Tables, superando o `MyISAM`. Diferentes storage engines são projetados com diferentes compensações entre fatores como uso de Memory versus uso de Disk, read speed versus write speed e speed versus robustness. Cada storage engine gerencia Tables específicas, então nos referimos a tabelas `InnoDB`, tabelas `MyISAM` e assim por diante.

    O produto **MySQL Enterprise Backup** é otimizado para fazer backup de tabelas `InnoDB`. Ele também pode fazer backup de Tables manipuladas por `MyISAM` e outros storage engines.

    Veja Também InnoDB, MySQL Enterprise Backup, table type.

stored generated column: Uma Column cujos valores são computados a partir de uma expression incluída na Column definition. Os Column values são avaliados e armazenados quando as Rows são inserted ou updated. Uma stored generated column requer storage space e pode ser indexed.

    Contraste com **virtual generated column**.

    Veja Também base column, generated column, virtual generated column.

stored object: Um stored program ou view.

stored program: Uma stored routine (procedure ou function), trigger ou Event Scheduler event.

stored routine: Uma stored procedure ou function.

strict mode: O nome geral para a configuração controlada pela opção `innodb_strict_mode`. Ativar esta configuração faz com que certas condições que são normalmente tratadas como warnings sejam consideradas Errors. Por exemplo, certas combinações inválidas de options relacionadas a **file format** e **row format**, que normalmente produzem um warning e continuam com valores padrão, agora fazem com que a operação `CREATE TABLE` falhe. `innodb_strict_mode` está habilitado por padrão no MySQL 5.7.

    O MySQL também tem algo chamado strict mode. Consulte Section 5.1.10, “Server SQL Modes”.

    Veja Também file format, innodb_strict_mode, row format.

sublist: Dentro da list structure que representa o **buffer pool**, as pages que são relativamente antigas e relativamente novas são representadas por diferentes porções da **list**. Um conjunto de parâmetros controla o size destas porções e o ponto de divisão entre as pages novas e antigas.

    Veja Também buffer pool, eviction, list, LRU.

supremum record: Um **pseudo-record** em um Index, representando o **gap** acima do maior valor nesse Index. Se uma transaction tiver uma instrução como `SELECT ... FROM ... WHERE col > 10 FOR UPDATE;`, e o maior valor na Column for 20, é um Lock no supremum record que impede que outras transactions insiram valores ainda maiores, como 50, 100 e assim por diante.

    Veja Também gap, infimum record, pseudo-record.

surrogate key: Sinônimo de **synthetic key**.

    Veja Também synthetic key.

synthetic key: Uma Column indexed, tipicamente uma **primary key**, onde os valores são atribuídos arbitrariamente. Frequentemente feito usando uma Column **auto-increment**. Ao tratar o valor como completamente arbitrário, você pode evitar Rules excessivamente restritivas e faulty application assumptions. Por exemplo, uma numeric sequence representando employee numbers pode ter um gap se um employee foi aprovado para contratação, mas nunca se juntou. Ou o employee number 100 pode ter uma hiring date posterior ao employee number 500, se eles deixaram a empresa e voltaram mais tarde. Os valores numéricos também produzem valores mais curtos de comprimento previsível. Por exemplo, armazenar numeric codes que significam “Road”, “Boulevard”, “Expressway” e assim por diante é mais space-efficient do que repetir essas Strings repetidamente.

    Também conhecido como **surrogate key**. Contraste com **natural key**.

    Veja Também auto-increment, natural key, primary key, surrogate key.

system tablespace: Um ou mais data files (**ibdata files**) contendo metadata para Objects relacionados ao `InnoDB` (o **data dictionary** `InnoDB`), e as storage areas para o **change buffer**, o **doublewrite buffer** e possivelmente **undo logs**. Ele também pode conter Table e Index data para tabelas `InnoDB` se as Tables foram criadas no system tablespace em vez de **file-per-table** ou **general tablespaces**. Os dados e metadados no system tablespace se aplicam a todos os **databases** em uma **instance** MySQL.

    Antes do MySQL 5.6.7, o padrão era manter todas as tabelas `InnoDB` e Indexes dentro do system tablespace, muitas vezes fazendo com que este arquivo se tornasse muito grande. Como o system tablespace nunca diminui, problemas de armazenamento podem surgir se grandes quantidades de temporary data forem loaded e, em seguida, deleted. No MySQL 5.7, o padrão é o modo **file-per-table**, onde cada Table e seus Indexes associados são armazenados em um **.ibd file** separado. Este padrão torna mais fácil usar recursos `InnoDB` que dependem do file format **Barracuda**, como **compression** de Table, armazenamento eficiente de **off-page columns** e large index key prefixes (`innodb_large_prefix`).

    A opção `innodb_undo_tablespaces` define o número de undo tablespaces para undo logs.

    Manter todos os Table data no system tablespace ou em arquivos `.ibd` separados tem implicações para o storage management em geral. O produto **MySQL Enterprise Backup** pode fazer backup de um pequeno conjunto de arquivos grandes ou de muitos arquivos menores. Em sistemas com milhares de Tables, as file system operations para processar milhares de arquivos `.ibd` podem causar bottlenecks.

    O `InnoDB` introduziu general tablespaces no MySQL 5.7.6, que também são representados por arquivos `.ibd`. General tablespaces são shared tablespaces criados usando a sintaxe `CREATE TABLESPACE`. Eles podem ser criados fora do data directory MySQL, são capazes de armazenar múltiplas Tables e suportam Tables de todos os row formats.

    Veja Também Barracuda, change buffer, compression, data dictionary, database, doublewrite buffer, dynamic row format, file-per-table, general tablespace, .ibd file, ibdata file, innodb_file_per_table, instance, MySQL Enterprise Backup, off-page column, tablespace, undo log.

### T

.TRG file: Um arquivo contendo trigger parameters. Arquivos com esta extensão são sempre incluídos em backups produzidos pelo comando `mysqlbackup` do produto **MySQL Enterprise Backup**.

    Veja Também MySQL Enterprise Backup, comando mysqlbackup, .TRN file.

.TRN file: Um arquivo contendo trigger namespace information. Arquivos com esta extensão são sempre incluídos em backups produzidos pelo comando `mysqlbackup` do produto **MySQL Enterprise Backup**.

    Veja Também MySQL Enterprise Backup, comando mysqlbackup, .TRG file.

table: Cada Table MySQL está associada a um **storage engine** específico. As tabelas **InnoDB** têm características **physical** e **logical** particulares que afetam o desempenho, a **scalability**, o **backup**, a administration e o application development.

    Em termos de file storage, uma Table `InnoDB` pertence a um dos seguintes tipos de tablespace:

    *   O **system tablespace** `InnoDB` compartilhado, que é composto por um ou mais **ibdata files**.

    *   Um tablespace **file-per-table**, composto por um **.ibd file** individual.

    *   Um **general tablespace** compartilhado, composto por um `.ibd` file individual. General tablespaces foram introduzidos no MySQL 5.7.6.

    Os **`.ibd`** data files contêm Table e **index** data.

    As tabelas `InnoDB` criadas em tablespaces file-per-table podem usar o file format **Barracuda**, e as tabelas Barracuda podem usar **DYNAMIC** ou **COMPRESSED** row format. Estes row formats habilitam recursos `InnoDB` como **compression**, armazenamento eficiente de **off-page columns** e large index key prefixes (consulte `innodb_large_prefix`). General tablespaces suportam todos os row formats independentemente da configuração `innodb_file_format`.

    Até o MySQL 5.7.5, as tabelas `InnoDB` dentro do system tablespace tinham que usar o file format **Antelope** para backward compatibility com o MySQL 5.1 e anterior. O file format **Antelope** suporta **COMPACT** e **REDUNDANT** row format. O system tablespace suporta Tables que usam **DYNAMIC** row format a partir do MySQL 5.7.6.

    As **rows** de uma Table `InnoDB` são organizadas em uma Index structure conhecida como **clustered index**, com entries classificadas com base nas Columns da **primary key** da Table. O Table Access é otimizado para Queries que filter e sort nas Columns da Primary Key, e cada Index contém uma cópia das Columns da Primary Key associadas para cada entry. Modificar valores para qualquer uma das Columns da Primary Key é uma operação cara. Assim, um aspecto importante do Table design `InnoDB` é escolher uma Primary Key com Columns que são usadas nas Queries mais importantes e manter a Primary Key curta, com valores raramente alterados.

    Veja Também Antelope, backup, Barracuda, clustered index, compact row format, compressed row format, compression, dynamic row format, Fast Index Creation, file-per-table, .ibd file, index, off-page column, primary key, redundant row format, row, system tablespace, tablespace.

table lock: Um Lock que impede que qualquer outra **transaction** acesse uma Table. O `InnoDB` faz um esforço considerável para tornar tais Locks desnecessários, usando técnicas como **online DDL**, **row locks** e **consistent reads** para processar instruções **DML** e **queries**. Você pode criar tal Lock através de SQL usando a instrução `LOCK TABLE`; uma das etapas na migração de outros Database systems ou storage engines MySQL é remover tais instruções sempre que prático.

    Veja Também consistent read, DML, lock, locking, online DDL, query, row lock, table, transaction.

table scan: Consulte full table scan.

table statistics: Consulte statistics.

table type: Sinônimo obsoleto para **storage engine**. Nos referimos a tabelas `InnoDB`, tabelas `MyISAM` e assim por diante.

    Veja Também InnoDB, storage engine.

tablespace: Um data file que pode conter dados para uma ou mais **tables** `InnoDB` e **indexes** associados.

    O **system tablespace** contém o **data dictionary** `InnoDB` e, antes do MySQL 5.6, armazena todas as outras tabelas `InnoDB` por padrão.

    A opção `innodb_file_per_table`, habilitada por padrão no MySQL 5.6 e superior, permite que Tables sejam criadas em seus próprios tablespaces. Os tablespaces file-per-table suportam recursos como armazenamento eficiente de **off-page columns**, Table compression e transportable tablespaces. Consulte Section 14.6.3.2, “File-Per-Table Tablespaces” para detalhes.

    O `InnoDB` introduziu general tablespaces no MySQL 5.7.6. General tablespaces são shared tablespaces criados usando a sintaxe `CREATE TABLESPACE`. Eles podem ser criados fora do data directory MySQL, são capazes de armazenar múltiplas Tables e suportam Tables de todos os row formats.

    O MySQL NDB Cluster também agrupa suas Tables em tablespaces. Consulte Section 21.6.11.1, “NDB Cluster Disk Data Objects” para detalhes.

    Veja Também compressed row format, data dictionary, data files, file-per-table, general tablespace, index, innodb_file_per_table, system tablespace, table.

Tcl: Uma programming language originária do mundo Unix scripting. Às vezes estendida por código escrito em **C**, **C++** ou **Java**. Para a **API** Tcl Open Source para MySQL, consulte Section 27.12, “MySQL Tcl API”.

    Veja Também API.

temporary table: Uma **table** cujos dados não precisam ser verdadeiramente permanentes. Por exemplo, temporary tables podem ser usadas como storage areas para intermediate results em cálculos ou transformations complicadas; estes dados intermediate não precisariam ser recovered após um crash. Os Database products podem tomar vários shortcuts para melhorar o desempenho das operações em temporary tables, sendo menos escrupulosos em relação à escrita de dados no Disk e outras medidas para proteger os dados em restarts.

    Às vezes, os dados em si são removidos automaticamente em um horário definido, como quando a transaction termina ou quando a session termina. Com alguns Database products, a Table em si também é removida automaticamente.

    Veja Também table.

temporary tablespace: O tablespace para **temporary tables** `InnoDB` não compressed e Objects relacionados, introduzido no MySQL 5.7. A option de configuration file, `innodb_temp_data_file_path`, define o path relativo, name, size e attributes para temporary tablespace data files. Se `innodb_temp_data_file_path` não for especificado, o comportamento padrão é criar um único data file `ibtmp1` de 12MB com auto-extensão no data directory. O temporary tablespace é recriado em cada Server start e recebe um space ID gerado dinamicamente. O temporary tablespace não pode residir em um raw device. A Startup é recusada se o temporary tablespace não puder ser criado.

    O temporary tablespace é removido no normal shutdown ou em uma aborted initialization. O temporary tablespace não é removido quando ocorre um crash. Neste caso, o Database administrator pode remover o temporary tablespace manualmente ou reiniciar o Server com a mesma configuration, o que remove e recria o temporary tablespace.

    Veja Também temporary table.

text collection: O conjunto de Columns incluídas em um **FULLTEXT index**.

    Veja Também FULLTEXT index.

thread: Uma unidade de processamento que é tipicamente mais lightweight do que um **process**, permitindo maior **concurrency**.

    Veja Também concurrency, master thread, process, Pthreads.

Tomcat: Um application server **J2EE** Open Source, implementando as tecnologias de programming Java Servlet e JavaServer Pages. Consiste em um Web Server e Java servlet container. Com o MySQL, tipicamente usado em conjunto com **Connector/J**.

    Veja Também J2EE.

torn page: Uma Error condition que pode ocorrer devido a uma combinação de I/O device configuration e falha de Hardware. Se os dados forem escritos em chunks menores que o **page size** `InnoDB` (por padrão, 16KB), uma falha de Hardware durante a escrita pode resultar em apenas parte de uma page sendo stored no Disk. O **doublewrite buffer** `InnoDB` protege contra esta possibility.

    Veja Também doublewrite buffer.

TPS: Acrônimo para “**transactions** per second” (transactions por segundo), uma unidade de medição às vezes usada em benchmarks. Seu valor depende da **workload** representada por um teste de benchmark específico, combinado com fatores que você controla, como a Hardware capacity e a Database configuration.

    Veja Também transaction, workload.

transaction: Transactions são unidades de trabalho atômicas que podem ser **committed** ou **rolled back**. Quando uma transaction faz múltiplas alterações no Database, todas as alterações são bem-sucedidas quando a transaction é committed, ou todas as alterações são desfeitas quando a transaction é rolled back.

    As Database transactions, conforme implementadas pelo `InnoDB`, têm propriedades que são coletivamente conhecidas pelo acrônimo **ACID**, para atomicidade, consistência, isolamento e durabilidade.

    Veja Também ACID, commit, isolation level, lock, rollback.

transaction ID: Um field interno associado a cada **row**. Este field é alterado fisicamente por operações `INSERT`, `UPDATE` e `DELETE` para registrar qual **transaction** bloqueou a Row.

    Veja Também implicit row lock, row, transaction.

transparent page compression: Um recurso adicionado no MySQL 5.7.8 que permite compression em nível de page para tabelas `InnoDB` que residem em tablespaces **file-per-table**. A Page compression é habilitada especificando o attribute `COMPRESSION` com `CREATE TABLE` ou `ALTER TABLE`. Para mais informações, consulte Section 14.9.2, “InnoDB Page Compression”.

    Veja Também file-per-table, hole punching, sparse file.

transportable tablespace: Um recurso que permite que um **tablespace** seja movido de uma Instance para outra. Tradicionalmente, isso não era possível para tablespaces `InnoDB` porque todos os Table data faziam parte do **system tablespace**. No MySQL 5.6 e superior, a sintaxe `FLUSH TABLES ... FOR EXPORT` prepara uma Table `InnoDB` para ser copiada para outro Server; executar `ALTER TABLE ... DISCARD TABLESPACE` e `ALTER TABLE ... IMPORT TABLESPACE` no outro Server traz o data file copiado para a outra Instance. Um **.cfg file** separado, copiado junto com o **.ibd file**, é usado para atualizar os metadados da Table (por exemplo, o **space ID**) à medida que o tablespace é imported. Consulte Section 14.6.1.3, “Importing InnoDB Tables” para obter informações de uso.

    Veja Também .cfg file, .ibd file, space ID, system tablespace, tablespace.

troubleshooting: O processo de determinar a source de um problema. Alguns dos recursos para troubleshooting problemas do MySQL incluem:

    *   Section 2.9.2.1, “Troubleshooting Problems Starting the MySQL Server”
    *   Section 6.2.17, “Troubleshooting Problems Connecting to MySQL”
    *   Section B.3.3.2, “How to Reset the Root Password”
    *   Section B.3.2, “Common Errors When Using MySQL Programs”
    *   Section 14.22, “InnoDB Troubleshooting”.

truncate: Uma operação **DDL** que remove o conteúdo inteiro de uma Table, deixando a Table e os Indexes relacionados intactos. Contraste com **drop**. Embora conceitualmente tenha o mesmo resultado que uma instrução `DELETE` sem cláusula `WHERE`, ela opera de forma diferente nos bastidores: o `InnoDB` cria uma nova Table vazia, drops a Table antiga e, em seguida, renomeia a nova Table para ocupar o lugar da antiga. Como esta é uma operação DDL, ela não pode ser **rolled back**.

    Se a Table que está sendo truncated contiver **foreign keys** que façam referência a outra Table, a operação de truncation usará um método de operação mais lento, deletando uma Row por vez para que as Rows correspondentes na Table referenciada possam ser deleted conforme necessário pela cláusula `ON DELETE CASCADE`. (O MySQL 5.5 e superior não permitem esta forma mais lenta de truncate e, em vez disso, retornam um Error se foreign keys estiverem envolvidas. Neste caso, use uma instrução `DELETE` em vez disso.

    Veja Também DDL, drop, foreign key, rollback.

truststore: Veja Também SSL.

tuple: Um termo técnico que designa um ordered set de elements. É uma noção abstrata, usada em discussões formais sobre Database theory. No campo do Database, os tuples são geralmente representados pelas Columns de uma Table row. Eles também podem ser representados pelos result sets de Queries, por exemplo, Queries que recuperaram apenas algumas Columns de uma Table, ou Columns de Tables joined.

    Veja Também cursor.

two-phase commit: Uma operação que faz parte de uma **transaction** distributed, sob a especificação **XA**. (Às vezes abreviado como 2PC.) Quando múltiplos Databases participam da transaction, todos os Databases **commit** as alterações, ou todos os Databases **roll back** as alterações.

    Veja Também commit, rollback, transaction, XA.

### U

undo: Dados que são mantidos durante toda a vida de uma **transaction**, registrando todas as alterações para que possam ser desfeitas em caso de uma operação de **rollback**. É armazenado em **undo logs** dentro do **system tablespace** (no MySQL 5.7 ou anterior) ou em **undo tablespaces** separados. A partir do MySQL 8.0, os undo logs residem em undo tablespaces por padrão.

    Veja Também rollback, rollback segment, system tablespace, transaction, undo log, undo tablespace.

undo buffer: Consulte undo log.

undo log: Uma storage area que contém cópias de dados modificados por **transactions** ativas. Se outra transaction precisar ver os dados originais (como parte de uma operação de **consistent read**), os dados não modificados são retrieved desta storage area.

    No MySQL 5.6 e MySQL 5.7, você pode usar a variável `innodb_undo_tablespaces` para que os undo logs residam em **undo tablespaces**, que podem ser colocados em outro storage device, como um **SSD**. No MySQL 8.0, dois undo tablespaces padrão são criados quando o MySQL é initialized, e undo tablespaces adicionais podem ser criados usando a sintaxe `CREATE UNDO TABLESPACE`.

    O undo log é dividido em porções separadas, o **insert undo buffer** e o **update undo buffer**.

    Veja Também consistent read, rollback segment, SSD, system tablespace, transaction, undo tablespace.

undo log segment: Uma coleção de **undo logs**. Os Undo log segments existem dentro de **rollback segments**. Um undo log segment pode conter undo logs de múltiplas transactions. Um undo log segment só pode ser usado por uma transaction por vez, mas pode ser reused depois de ser liberado no **commit** ou **rollback** da transaction. Também pode ser referido como um “undo segment”.

    Veja Também commit, rollback, rollback segment, undo log.

undo tablespace: Um undo tablespace contém **undo logs**. Os Undo logs existem dentro de **undo log segments**, que estão contidos em **rollback segments**. Os Rollback segments tradicionalmente residem no system tablespace. A partir do MySQL 5.6, os rollback segments podem residir em undo tablespaces. No MySQL 5.6 e MySQL 5.7, o número de undo tablespaces é controlado pela option de configuração `innodb_undo_tablespaces`. No MySQL 8.0, dois undo tablespaces padrão são criados quando a Instance MySQL é initialized, e undo tablespaces adicionais podem ser criados usando a sintaxe `CREATE UNDO TABLESPACE`.

    Para mais informações, consulte Section 14.6.3.4, “Undo Tablespaces”.

    Veja Também rollback segment, system tablespace, undo log, undo log segment.

Unicode: Um sistema para suportar national characters, character sets, code pages e outros aspectos de internacionalização de forma flexível e padronizada.

    O Suporte Unicode é um aspecto importante do padrão **ODBC**. O