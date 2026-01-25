### 21.5.14 ndb_import — Importar Dados CSV para NDB

[**ndb_import**](mysql-cluster-programs-ndb-import.html "21.5.14 ndb_import — Importar Dados CSV para NDB") importa dados formatados em CSV, como aqueles produzidos por [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") com a opção [`--tab`](mysqldump.html#option_mysqldump_tab), diretamente no `NDB` usando a NDB API. Para funcionar, [**ndb_import**](mysql-cluster-programs-ndb-import.html "21.5.14 ndb_import — Importar Dados CSV para NDB") requer uma conexão com um NDB management server ([**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon")); ele não requer uma conexão com um MySQL Server.

#### Uso

```sql
ndb_import db_name file_name options
```

[**ndb_import**](mysql-cluster-programs-ndb-import.html "21.5.14 ndb_import — Importar Dados CSV para NDB") requer dois argumentos. *`db_name`* é o nome da Database onde a tabela para a qual os dados serão importados está localizada; *`file_name`* é o nome do arquivo CSV de onde os dados serão lidos; isso deve incluir o path para este arquivo se ele não estiver no diretório atual. O nome do arquivo deve corresponder ao nome da tabela; a extensão do arquivo, se houver, não é levada em consideração. As Options suportadas por [**ndb_import**](mysql-cluster-programs-ndb-import.html "21.5.14 ndb_import — Importar Dados CSV para NDB") incluem aquelas para especificar separadores de campo, escapes e terminadores de linha, e são descritas mais adiante nesta seção.

[**ndb_import**](mysql-cluster-programs-ndb-import.html "21.5.14 ndb_import — Importar Dados CSV para NDB") rejeita quaisquer linhas vazias lidas do arquivo CSV.

[**ndb_import**](mysql-cluster-programs-ndb-import.html "21.5.14 ndb_import — Importar Dados CSV para NDB") deve ser capaz de se conectar a um NDB Cluster management server; por esta razão, deve haver um slot `[api]` não utilizado no arquivo `config.ini` do cluster.

Para duplicar uma tabela existente que utiliza um Storage Engine diferente, como [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), como uma tabela `NDB`, use o cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") para executar uma instrução [`SELECT INTO OUTFILE`](select-into.html "13.2.9.1 SELECT ... INTO Statement") para exportar a tabela existente para um arquivo CSV, e então executar uma instrução [`CREATE TABLE LIKE`](create-table-like.html "13.1.18.3 CREATE TABLE ... LIKE Statement") para criar uma nova tabela com a mesma estrutura da tabela existente, e então realizar [`ALTER TABLE ... ENGINE=NDB`](alter-table.html "13.1.8 ALTER TABLE Statement") na nova tabela; após isso, a partir do shell do sistema, invoque [**ndb_import**](mysql-cluster-programs-ndb-import.html "21.5.14 ndb_import — Importar Dados CSV para NDB") para carregar os dados na nova tabela `NDB`. Por exemplo, uma tabela `InnoDB` existente chamada `myinnodb_table` em uma Database chamada `myinnodb` pode ser exportada para uma tabela `NDB` chamada `myndb_table` em uma Database chamada `myndb`, conforme mostrado aqui, assumindo que você já esteja logado como um usuário MySQL com os privilégios apropriados:

1. No cliente [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"):

   ```sql
   mysql> USE myinnodb;

   mysql> SELECT * INTO OUTFILE '/tmp/myndb_table.csv'
        >  FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' ESCAPED BY '\\'
        >  LINES TERMINATED BY '\n'
        >  FROM myinnodbtable;

   mysql> CREATE DATABASE myndb;

   mysql> USE myndb;

   mysql> CREATE TABLE myndb_table LIKE myinnodb.myinnodb_table;

   mysql> ALTER TABLE myndb_table ENGINE=NDB;

   mysql> EXIT;
   Bye
   $>
   ```

   Uma vez que a Database e a tabela alvo tenham sido criadas, não é mais necessário um [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") em execução. Você pode pará-lo usando [**mysqladmin shutdown**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") ou outro método antes de prosseguir, se desejar.

2. No shell do sistema:

   ```sql
   # if you are not already in the MySQL bin directory:
   $> cd path-to-mysql-bin-dir

   $> ndb_import myndb /tmp/myndb_table.csv --fields-optionally-enclosed-by='"' \
       --fields-terminated-by="," --fields-escaped-by='\\'
   ```

   A saída deve ser semelhante ao que é mostrado aqui:

   ```sql
   job-1 import myndb.myndb_table from /tmp/myndb_table.csv
   job-1 [running] import myndb.myndb_table from /tmp/myndb_table.csv
   job-1 [success] import myndb.myndb_table from /tmp/myndb_table.csv
   job-1 imported 19984 rows in 0h0m9s at 2277 rows/s
   jobs summary: defined: 1 run: 1 with success: 1 with failure: 0
   $>
   ```

As Options que podem ser usadas com [**ndb_import**](mysql-cluster-programs-ndb-import.html "21.5.14 ndb_import — Importar Dados CSV para NDB") são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.33 Options de linha de comando usadas com o programa ndb_import**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Formato</th> <th>Descrição</th> <th>Adicionado, Obsoleto ou Removido</th> </tr></thead><tbody><tr> <th><p> <code> --abort-on-error </code> </p></th> <td>Despeja Core file em qualquer erro fatal; usado para debugging</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ai-increment=# </code> </p></th> <td>Para tabela com Primary Key (PK) oculta, especifica o incremento do autoincrement. Veja mysqld</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ai-offset=# </code> </p></th> <td>Para tabela com PK oculta, especifica o offset do autoincrement. Veja mysqld</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ai-prefetch-sz=# </code> </p></th> <td>Para tabela com PK oculta, especifica o número de valores autoincrement que são pré-buscados (prefetched). Veja mysqld</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --character-sets-dir=path </code> </p></th> <td>Diretório contendo Character Sets</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retries=# </code> </p></th> <td>Número de vezes para tentar novamente (retry) a conexão antes de desistir</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retry-delay=# </code> </p></th> <td>Número de segundos a esperar entre as tentativas de contato com o Management Server</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connections=# </code> </p></th> <td>Número de conexões do Cluster a serem criadas</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --continue </code> </p></th> <td>Quando a tarefa falhar, continua para a próxima tarefa</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --core-file </code> </p></th> <td>Escreve Core file em caso de erro; usado em debugging</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --csvopt=opts </code> </p></th> <td>Opção de atalho para definir valores típicos de Options CSV. Consulte a documentação para sintaxe e outras informações</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --db-workers=# </code> </p></th> <td>Número de Threads, por Data Node, executando operações de Database</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-extra-file=path </code> </p></th> <td>Lê o arquivo fornecido após a leitura dos arquivos globais</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-file=path </code> </p></th> <td>Lê Options padrão apenas do arquivo fornecido</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-group-suffix=string </code> </p></th> <td>Também lê grupos com concat(grupo, sufixo)</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --errins-type=name </code> </p></th> <td>Tipo de inserção de erro, para fins de teste; use "list" para obter todos os valores possíveis</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --errins-delay=# </code> </p></th> <td>Atraso de inserção de erro em milissegundos; variação aleatória é adicionada</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --fields-enclosed-by=char </code> </p></th> <td>O mesmo que a Option FIELDS ENCLOSED BY para instruções LOAD DATA. Para Input CSV, é o mesmo que usar --fields-optionally-enclosed-by</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --fields-escaped-by=char </code> </p></th> <td>O mesmo que a Option FIELDS ESCAPED BY para instruções LOAD DATA</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --fields-optionally-enclosed-by=char </code> </p></th> <td>O mesmo que a Option FIELDS OPTIONALLY ENCLOSED BY para instruções LOAD DATA</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --fields-terminated-by=char </code> </p></th> <td>O mesmo que a Option FIELDS TERMINATED BY para instruções LOAD DATA</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code> -? </code> </p></th> <td>Exibe texto de ajuda e sai</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --idlesleep=# </code> </p></th> <td>Número de milissegundos para "dormir" (sleep) esperando por mais tarefas a fazer</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --idlespin=# </code> </p></th> <td>Número de vezes para tentar novamente (retry) antes do idlesleep</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ignore-lines=# </code> </p></th> <td>Ignora as primeiras # linhas no arquivo de Input. Usado para pular um cabeçalho que não contém dados</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --input-type=name </code> </p></th> <td>Tipo de Input: random ou csv</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --input-workers=# </code> </p></th> <td>Número de Threads processando o Input. Deve ser 2 ou mais se --input-type for csv</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --keep-state </code> </p></th> <td>Arquivos de State (exceto arquivos *.rej não vazios) são normalmente removidos ao concluir a tarefa. Usar esta Option faz com que todos os arquivos de State sejam preservados</td> <td><p> ADICIONADO: NDB 7.6.4 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --lines-terminated-by=char </code> </p></th> <td>O mesmo que a Option LINES TERMINATED BY para instruções LOAD DATA</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --login-path=path </code> </p></th> <td>Lê o path fornecido do arquivo de login</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --max-rows=# </code> </p></th> <td>Importa apenas este número de linhas de dados de Input; o default é 0, que importa todas as linhas</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --monitor=# </code> </p></th> <td>Imprime periodicamente o status da tarefa em execução se algo tiver mudado (status, linhas rejeitadas, erros temporários). O valor 0 desabilita. O valor 1 imprime qualquer alteração vista. Valores mais altos reduzem a impressão de status exponencialmente até um limite predefinido</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Define a connect string para conexão com ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Sobrescreve entradas em NDB_CONNECTSTRING e my.cnf</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>O mesmo que --ndb-connectstring</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-nodeid=# </code> </p></th> <td>Define o Node ID para este Node, sobrescrevendo qualquer ID definido por --ndb-connectstring</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-optimized-node-selection </code> </p></th> <td>Habilita otimizações para seleção de Nodes para Transactions. Habilitado por default; use --skip-ndb-optimized-node-selection para desabilitar</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-asynch </code> </p></th> <td>Executa operações de Database como batches, em Transactions únicas</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-defaults </code> </p></th> <td>Não lê Options padrão de nenhum arquivo de Option além do arquivo de login</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-hint </code> </p></th> <td>Informa ao coordenador de Transaction para não usar o hint da Distribution Key ao selecionar o Data Node</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --opbatch=# </code> </p></th> <td>Um batch de execução de db é um conjunto de Transactions e operações enviadas ao kernel NDB. Esta Option limita as operações NDB (incluindo operações blob) em um batch de execução de db. Portanto, também limita o número de Transactions assíncronas (asynch). O valor 0 não é válido</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --opbytes=# </code> </p></th> <td>Limita bytes no batch de execução (default 0 = sem limite)</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --output-type=name </code> </p></th> <td>Tipo de Output: ndb é o default, null usado para teste</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --output-workers=# </code> </p></th> <td>Número de Threads processando o Output ou retransmitindo operações de Database</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --pagesize=# </code> </p></th> <td>Alinha Buffers de I/O ao tamanho fornecido</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --pagecnt=# </code> </p></th> <td>Tamanho dos Buffers de I/O como múltiplo do page size. O worker de Input CSV aloca Buffer de tamanho dobrado</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --polltimeout=# </code> </p></th> <td>Timeout por poll para Transactions assíncronas completadas; o polling continua até que todos os polls sejam concluídos, ou ocorra um erro</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-defaults </code> </p></th> <td>Imprime a lista de argumentos do programa e sai</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --rejects=# </code> </p></th> <td>Limita o número de linhas rejeitadas (linhas com erro permanente) no carregamento de dados. O default é 0, o que significa que qualquer linha rejeitada causa um erro fatal. A linha que excede o limite também é adicionada a *.rej</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --resume </code> </p></th> <td>Se a tarefa for abortada (erro temporário, interrupção do usuário), retoma com as linhas ainda não processadas</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --rowbatch=# </code> </p></th> <td>Limita linhas nas filas de linhas (row queues) (default 0 = sem limite); deve ser 1 ou mais se --input-type for random</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --rowbytes=# </code> </p></th> <td>Limita bytes nas filas de linhas (row queues) (0 = sem limite)</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --state-dir=path </code> </p></th> <td>Onde escrever os arquivos de State; o diretório atual é o default</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --stats </code> </p></th> <td>Salva Options relacionadas a performance e estatísticas internas nos arquivos *.sto e *.stt. Esses arquivos são mantidos após a conclusão bem-sucedida, mesmo que --keep-state não seja usado</td> <td><p> ADICIONADO: NDB 7.6.4 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --tempdelay=# </code> </p></th> <td>Número de milissegundos para "dormir" (sleep) entre erros temporários</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --temperrors=# </code> </p></th> <td>Número de vezes que uma Transaction pode falhar devido a um erro temporário, por batch de execução; 0 significa que qualquer erro temporário é fatal. Tais erros não fazem com que nenhuma linha seja escrita no arquivo .rej</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code> -? </code> </p></th> <td>Exibe texto de ajuda e sai; o mesmo que --help</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--verbose[=#]</code>, </p><p> <code> -v [#] </code> </p></th> <td>Habilita Output detalhado (verbose)</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code> -V </code> </p></th> <td>Exibe informações de versão e sai</td> <td><p> ADICIONADO: NDB 7.6.2 </p></td> </tr></tbody></table>

* `--abort-on-error`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>

  Despeja Core file em qualquer erro fatal; usado apenas para debugging.

* `--ai-increment`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Para uma tabela com uma Primary Key oculta, especifica o incremento do autoincrement, como a variável de sistema [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment) faz no MySQL Server.

* `--ai-offset`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Para uma tabela com Primary Key oculta, especifica o offset do autoincrement. Semelhante à variável de sistema [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset).

* `--ai-prefetch-sz`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1024</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Para uma tabela com uma Primary Key oculta, especifica o número de valores autoincrement que são pré-buscados (prefetched). Comporta-se como a variável de sistema [`ndb_autoincrement_prefetch_sz`](mysql-cluster-options-variables.html#sysvar_ndb_autoincrement_prefetch_sz) faz no MySQL Server.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>

  Diretório contendo Character Sets.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>12</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Número de vezes para tentar novamente (retry) a conexão antes de desistir.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>5</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>5</code></td> </tr></tbody></table>

  Número de segundos a esperar entre as tentativas de contato com o Management Server.

* `--connections`=*`#`*

  <table frame="box" rules="all" summary="Properties for connections"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connections=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Número de conexões do Cluster a serem criadas.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  O mesmo que [`--ndb-connectstring`](mysql-cluster-programs-ndb-import.html#option_ndb_import_ndb-connectstring).

* `--continue`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>

  Quando uma tarefa falhar, continua para a próxima tarefa.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>

  Escreve Core file em caso de erro; usado em debugging.

* `--csvopt`=*`string`*

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>

  Fornece um método de atalho para configurar Options típicas de importação CSV. O argumento para esta Option é uma String consistindo em um ou mais dos seguintes parâmetros:

  + `c`: Campos terminados por vírgula
  + `d`: Usa defaults, exceto onde sobrescrito por outro parâmetro

  + `n`: Linhas terminadas por `\n`

  + `q`: Campos opcionalmente delimitados por aspas duplas (`"`)

  + `r`: Linha terminada por `\r`

  A ordem dos parâmetros não faz diferença, exceto que, se `n` e `r` forem especificados, o último a ocorrer será o parâmetro que entrará em vigor.

  Esta Option destina-se ao uso em testes sob condições em que é difícil transmitir escapes ou aspas.

* `--db-workers`=*`#`*

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>

  Número de Threads, por Data Node, executando operações de Database.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>

  Lê o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>

  Lê Options padrão apenas do arquivo fornecido.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>

  Também lê grupos com concat(grupo, sufixo).

* `--errins-type`=*`name`*

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>

  Tipo de inserção de erro; use `list` como o valor *`name`* para obter todos os valores possíveis. Esta Option é usada apenas para fins de teste.

* `--errins-delay`=*`#`*

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>

  Atraso de inserção de erro em milissegundos; variação aleatória é adicionada. Esta Option é usada apenas para fins de teste.

* `--fields-enclosed-by`=*`char`*

  <table frame="box" rules="all" summary="Properties for abort-on-error"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>

  Isto funciona da mesma forma que a Option `FIELDS ENCLOSED BY` faz para a instrução [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement"), especificando um caractere a ser interpretado como delimitador (quoting) dos valores de campo. Para Input CSV, isso é o mesmo que [`--fields-optionally-enclosed-by`](mysql-cluster-programs-ndb-import.html#option_ndb_import_fields-optionally-enclosed-by).

* `--fields-escaped-by`=*`name`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Especifica um caractere de escape da mesma forma que a Option `FIELDS ESCAPED BY` faz para a instrução SQL [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement").

* `--fields-optionally-enclosed-by`=*`char`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Isto funciona da mesma forma que a Option `FIELDS OPTIONALLY ENCLOSED BY` faz para a instrução [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement"), especificando um caractere a ser interpretado como delimitador opcional (optionally quoting) dos valores de campo. Para Input CSV, isso é o mesmo que [`--fields-enclosed-by`](mysql-cluster-programs-ndb-import.html#option_ndb_import_fields-enclosed-by).

* `--fields-terminated-by`=*`char`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Isto funciona da mesma forma que a Option `FIELDS TERMINATED BY` faz para a instrução [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement"), especificando um caractere a ser interpretado como o separador de campo.

* `--help`

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Exibe texto de ajuda e sai.

* `--idlesleep`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Número de milissegundos para "dormir" (sleep) esperando por mais tarefas a fazer.

* `--idlespin`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Número de vezes para tentar novamente (retry) antes de "dormir" (sleeping).

* `--ignore-lines`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Faz com que o ndb_import ignore as primeiras *`#`* linhas do arquivo de Input. Isso pode ser empregado para pular um cabeçalho de arquivo que não contenha dados.

* `--input-type`=*`name`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Define o tipo de Input. O default é `csv`; `random` destina-se apenas a fins de teste.

* `--input-workers`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Define o número de Threads processando o Input.

* `--keep-state`

  <table frame="box" rules="all" summary="Properties for ai-increment"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Por default, o ndb_import remove todos os arquivos de State (exceto arquivos `*.rej` não vazios) quando conclui uma tarefa. Especifique esta Option (nenhum argumento é necessário) para forçar o programa a reter todos os arquivos de State.

* `--lines-terminated-by`=*`name`*

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Isto funciona da mesma forma que a Option `LINES TERMINATED BY` faz para a instrução [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement"), especificando um caractere a ser interpretado como fim de linha (end-of-line).

* `--login-path`

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Lê o path fornecido do arquivo de login.

* `--log-level`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Realiza o logging interno no nível fornecido. Esta Option destina-se principalmente ao uso interno e de desenvolvimento.

  Apenas em builds de debug do NDB, o nível de logging pode ser definido usando esta Option para um máximo de 4.

* `--max-rows`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Importa apenas este número de linhas de dados de Input; o default é 0, que importa todas as linhas.

* `--monitor`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Imprime periodicamente o status de uma tarefa em execução se algo tiver mudado (status, linhas rejeitadas, erros temporários). Defina como 0 para desabilitar este relatório. Definir como 1 imprime qualquer alteração que for vista. Valores mais altos reduzem a frequência deste relatório de status.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Define a connect string para conexão com ndb_mgmd. Sintaxe: "[nodeid=id;][host=]hostname[:port]". Sobrescreve entradas em NDB_CONNECTSTRING e my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  O mesmo que [`--ndb-connectstring`](mysql-cluster-programs-ndb-import.html#option_ndb_import_ndb-connectstring).

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Define o Node ID para este Node, sobrescrevendo qualquer ID definido por [`--ndb-connectstring`](mysql-cluster-programs-ndb-import.html#option_ndb_import_ndb-connectstring).

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Habilita otimizações para seleção de Nodes para Transactions. Habilitado por default; use `--skip-ndb-optimized-node-selection` para desabilitar.

* `--no-asynch`

  <table frame="box" rules="all" summary="Properties for ai-offset"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Executa operações de Database como batches, em Transactions únicas.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1024</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Não lê Options padrão de nenhum arquivo de Option além do arquivo de login.

* `--no-hint`

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1024</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Não usa o hint da Distribution Key para selecionar um Data Node.

* `--opbatch`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1024</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Define um limite para o número de operações (incluindo operações blob), e consequentemente o número de Transactions assíncronas, por batch de execução.

* `--opbytes`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1024</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Define um limite para o número de bytes por batch de execução. Use 0 para sem limite.

* `--output-type`=*`name`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1024</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Define o tipo de Output. `ndb` é o default. `null` é usado apenas para teste.

* `--output-workers`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1024</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Define o número de Threads processando o Output ou retransmitindo operações de Database.

* `--pagesize`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1024</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Alinha Buffers de I/O ao tamanho fornecido.

* `--pagecnt`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1024</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Define o tamanho dos Buffers de I/O como múltiplo do page size. O worker de Input CSV aloca Buffer que é dobrado em tamanho.

* `--polltimeout`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1024</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Define um Timeout por poll para Transactions assíncronas concluídas; o polling continua até que todos os polls sejam concluídos ou até que ocorra um erro.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1024</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>1</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Imprime a lista de argumentos do programa e sai.

* `--rejects`=*`#`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>

  Limita o número de linhas rejeitadas (linhas com erros permanentes) no carregamento de dados. O default é 0, o que significa que qualquer linha rejeitada causa um erro fatal. Quaisquer linhas que causem a ultrapassagem do limite são adicionadas ao arquivo `.rej`.

  O limite imposto por esta Option é efetivo durante a duração da execução atual. Uma execução reiniciada usando [`--resume`](mysql-cluster-programs-ndb-import.html#option_ndb_import_resume) é considerada uma "nova" execução para este fim.

* `--resume`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>

  Se uma tarefa for abortada (devido a um erro temporário de db ou quando interrompida pelo usuário), retoma com quaisquer linhas ainda não processadas.

* `--rowbatch`=*`#`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>

  Define um limite para o número de linhas por fila de linhas (row queue). Use 0 para sem limite.

* `--rowbytes`=*`#`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>

  Define um limite para o número de bytes por fila de linhas (row queue). Use 0 para sem limite.

* `--stats`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>

  Salva informações sobre Options relacionadas a performance e outras estatísticas internas nos arquivos denominados `*.sto` e `*.stt`. Esses arquivos são sempre mantidos após a conclusão bem-sucedida (mesmo que [`--keep-state`](mysql-cluster-programs-ndb-import.html#option_ndb_import_keep-state) não seja especificado).

* `--state-dir`=*`name`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>

  Onde escrever os arquivos de State (`tbl_name.map`, `tbl_name.rej`, `tbl_name.res` e `tbl_name.stt`) produzidos por uma execução do programa; o default é o diretório atual.

* `--tempdelay`=*`#`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>

  Número de milissegundos para "dormir" (sleep) entre erros temporários.

* `--temperrors`=*`#`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>

  Número de vezes que uma Transaction pode falhar devido a um erro temporário, por batch de execução. O default é 0, o que significa que qualquer erro temporário é fatal. Erros temporários não fazem com que nenhuma linha seja adicionada ao arquivo `.rej`.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>

  Exibe texto de ajuda e sai; o mesmo que [`--help`](mysql-cluster-programs-ndb-import.html#option_ndb_import_help).

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduzido</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>

  Habilita Output detalhado (verbose).

  Note

  Anteriormente, esta Option controlava o nível de logging interno para mensagens de debugging. No NDB 7.6, use a Option [`--log-level`](mysql-cluster-programs-ndb-import.html#option_ndb_import_log-level) para esta finalidade.

* `--version`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Formato da Linha de Comando</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>12</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>12</code></td> </tr></tbody></table>

  Exibe informações de versão e sai.

Assim como com [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement"), as Options para formatação de campo e linha devem coincidir com aquelas usadas para criar o arquivo CSV, seja isso feito usando [`SELECT INTO ... OUTFILE`](select-into.html "13.2.9.1 SELECT ... INTO Statement"), ou por algum outro meio. Não há equivalente para a Option `STARTING WITH` da instrução [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement").

[**ndb_import**](mysql-cluster-programs-ndb-import.html "21.5.14 ndb_import — Importar Dados CSV para NDB") foi adicionado no NDB 7.6.