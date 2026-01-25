### 21.5.23 ndb_redo_log_reader — Verificar e Imprimir Conteúdo do Redo Log do Cluster

Lê um arquivo de Redo Log, verificando se há erros, imprimindo seu conteúdo em um formato legível por humanos, ou ambos. O [**ndb_redo_log_reader**](mysql-cluster-programs-ndb-redo-log-reader.html "21.5.23 ndb_redo_log_reader — Check and Print Content of Cluster Redo Log") destina-se ao uso principal por desenvolvedores do NDB Cluster e pessoal de Suporte para depurar e diagnosticar problemas.

Este utilitário permanece em desenvolvimento, e sua sintaxe e comportamento estão sujeitos a alterações em futuras versões do NDB Cluster.

Os arquivos fonte C++ para o [**ndb_redo_log_reader**](mysql-cluster-programs-ndb-redo-log-reader.html "21.5.23 ndb_redo_log_reader — Check and Print Content of Cluster Redo Log") podem ser encontrados no diretório `/storage/ndb/src/kernel/blocks/dblqh/redoLogReader`.

As opções que podem ser usadas com o [**ndb_redo_log_reader**](mysql-cluster-programs-ndb-redo-log-reader.html "21.5.23 ndb_redo_log_reader — Check and Print Content of Cluster Redo Log") são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.37 Opções de linha de comando usadas com o programa ndb_redo_log_reader**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Formato</th> <th>Descrição</th> <th>Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p> <code> -dump </code> </p></th> <td>Imprime informações de dump</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> -filedescriptors </code> </p></th> <td>Imprime apenas file descriptors</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --help </code> </p></th> <td>Imprime informações de uso (não tem forma abreviada)</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> -lap </code> </p></th> <td>Fornece informações de lap, com GCI máximo iniciado e concluído</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_mbyte">-mbyte
                #</a> </code> </p></th> <td>Megabyte inicial</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> -mbyteheaders </code> </p></th> <td>Mostra apenas o primeiro page header de cada megabyte no arquivo</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> -nocheck </code> </p></th> <td>Não verifica records quanto a erros</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> -noprint </code> </p></th> <td>Não imprime records</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_page">-page
                #</a> </code> </p></th> <td>Começa com esta page</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> -pageheaders </code> </p></th> <td>Mostra apenas page headers</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_pageindex">-pageindex
                #</a> </code> </p></th> <td>Começa com este page index</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> -twiddle </code> </p></th> <td>Dump com deslocamento de bit (Bit-shifted dump)</td> <td><p> (Suportado em todas as versões NDB baseadas no MySQL 5.7) </p></td> </tr></tbody></table>

#### Uso

```sql
ndb_redo_log_reader file_name [options]
```

*`file_name`* é o nome de um arquivo de Redo Log do Cluster. Os arquivos de Redo Log estão localizados nos diretórios numerados sob o diretório de dados do Data Node ([`DataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datadir)); o path sob este diretório para os arquivos de Redo Log corresponde ao padrão `ndb_nodeid_fs/D#/DBLQH/S#.FragLog`. *`nodeid`* é o Node ID do Data Node. As duas ocorrências de *`#`* representam, cada uma, um número (não necessariamente o mesmo número); o número seguinte a `D` está no intervalo de 8 a 39, inclusive; o intervalo do número seguinte a `S` varia de acordo com o valor do parâmetro de configuração [`NoOfFragmentLogFiles`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-nooffragmentlogfiles), cujo valor padrão é 16; portanto, o intervalo padrão do número no nome do arquivo é de 0 a 15, inclusive. Para mais informações, consulte [NDB Cluster Data Node File System Directory](/doc/ndb-internals/en/ndb-internals-ndbd-filesystemdir-files.html).

O nome do arquivo a ser lido pode ser seguido por uma ou mais das opções listadas aqui:

* `-dump`

  <table frame="box" rules="all" summary="Properties for dump"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>-dump</code></td> </tr></tbody></table>

  Imprime informações de dump.

* <table frame="box" rules="all" summary="Properties for filedescriptors"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>-filedescriptors</code></td> </tr></tbody></table>

  `-filedescriptors`: Imprime apenas file descriptors.

* <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--help</code></td> </tr></tbody></table>

  `--help`: Imprime informações de uso.

* `-lap`

  <table frame="box" rules="all" summary="Properties for lap"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>-lap</code></td> </tr></tbody></table>

  Fornece informações de lap, com GCI máximo iniciado e concluído.

* <table frame="box" rules="all" summary="Properties for mbyte"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>-mbyte #</code></td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>15</code></td> </tr></tbody></table>

  `-mbyte #`: Megabyte inicial.

  *`#`* é um Integer no intervalo de 0 a 15, inclusive.

* <table frame="box" rules="all" summary="Properties for mbyteheaders"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>-mbyteheaders</code></td> </tr></tbody></table>

  `-mbyteheaders`: Mostra apenas o primeiro page header de cada megabyte no arquivo.

* <table frame="box" rules="all" summary="Properties for noprint"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>-noprint</code></td> </tr></tbody></table>

  `-noprint`: Não imprime o conteúdo do arquivo de log.

* <table frame="box" rules="all" summary="Properties for nocheck"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>-nocheck</code></td> </tr></tbody></table>

  `-nocheck`: Não verifica o arquivo de log quanto a erros.

* <table frame="box" rules="all" summary="Properties for page"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>-page #</code></td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>31</code></td> </tr></tbody></table>

  `-page #`: Começa nesta page.

  *`#`* é um Integer no intervalo de 0 a 31, inclusive.

* <table frame="box" rules="all" summary="Properties for dump"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>-dump</code></td> </tr></tbody></table>

  `-pageheaders`: Mostra apenas page headers.

* <table frame="box" rules="all" summary="Properties for dump"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>-dump</code></td> </tr></tbody></table>

  `-pageindex #`: Começa neste page index.

  *`#`* é um Integer entre 12 e 8191, inclusive.

* `-twiddle`

  <table frame="box" rules="all" summary="Properties for dump"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>-dump</code></td> </tr></tbody></table>

  Dump com deslocamento de bit (Bit-shifted dump).

Assim como [**ndb_print_backup_file**](mysql-cluster-programs-ndb-print-backup-file.html "21.5.18 ndb_print_backup_file — Print NDB Backup File Contents") e [**ndb_print_schema_file**](mysql-cluster-programs-ndb-print-schema-file.html "21.5.21 ndb_print_schema_file — Print NDB Schema File Contents") (e diferentemente da maioria dos utilitários [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") que se destinam a serem executados em um host de management server ou a se conectar a um management server), o [**ndb_redo_log_reader**](mysql-cluster-programs-ndb-redo-log-reader.html "21.5.23 ndb_redo_log_reader — Check and Print Content of Cluster Redo Log") deve ser executado em um Data Node do Cluster, visto que ele acessa o file system do Data Node diretamente. Por não fazer uso do management server, este utilitário pode ser usado quando o management server não está em execução e até mesmo quando o Cluster foi totalmente encerrado.