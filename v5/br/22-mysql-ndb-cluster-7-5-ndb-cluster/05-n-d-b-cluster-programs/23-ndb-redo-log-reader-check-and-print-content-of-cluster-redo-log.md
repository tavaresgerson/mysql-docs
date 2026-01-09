### 21.5.23 ndb\_redo\_log\_reader — Verificar e imprimir o conteúdo do log de refazer do cluster

Leitura de um arquivo de log de refazer, verificando-o quanto a erros, imprimindo seu conteúdo em um formato legível para humanos ou ambos. **ndb\_redo\_log\_reader** é destinado principalmente para uso por desenvolvedores do NDB Cluster e pessoal de suporte na depuração e diagnóstico de problemas.

Este utilitário continua em desenvolvimento e sua sintaxe e comportamento estão sujeitos a mudanças em futuras versões do NDB Cluster.

Os arquivos de código-fonte em C++ para **ndb\_redo\_log\_reader** podem ser encontrados no diretório `/storage/ndb/src/kernel/blocks/dblqh/redoLogReader`.

As opções que podem ser usadas com **ndb\_redo\_log\_reader** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 21.37 Opções de linha de comando usadas com o programa ndb\_redo\_log\_reader**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Formato</th> <th scope="col">Descrição</th> <th scope="col">Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_pageindex">-pageindex
                #</a> </code>] </p></th> <td>Informações de exclusão de impressão</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_pageindex">-pageindex
                #</a> </code>] </p></th> <td>Imprimir descritores de arquivo apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_help">--help</a> </code>]] </p></th> <td>Informações de uso da impressão (não tem forma abreviada)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_lap">-lap</a> </code>]] </p></th> <td>Forneça informações sobre a volta, incluindo o máximo de GCI iniciado e concluído</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_mbyte">-mbyte
                #</a> </code>]] </p></th> <td>Começando em megabytes</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_mbyteheaders">-mbyteheaders</a> </code>]] </p></th> <td>Mostrar apenas o cabeçalho da primeira página de cada megabyte no arquivo</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_nocheck">-nocheck</a> </code>]] </p></th> <td>Não verifique os registros em busca de erros</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_noprint">-noprint</a> </code>]] </p></th> <td>Não imprima registros</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_page">-page
                #</a> </code>]] </p></th> <td>Comece por esta página</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_pageheaders">-pageheaders</a> </code>]] </p></th> <td>Mostrar apenas os cabeçalhos da página</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_pageindex">-pageindex
                #</a> </code>]] </p></th> <td>Comece com este índice da página</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_filedescriptors">-filedescriptors</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_pageindex">-pageindex
                #</a> </code>] </p></th> <td>Dump com deslocamento de bits</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody></table>

#### Uso

```sql
ndb_redo_log_reader file_name [options]
```

*`file_name`* é o nome de um arquivo de log de redo de um cluster. Os arquivos de log de redo estão localizados nos diretórios numerados sob o diretório de dados do nó de dados (`DataDir`); o caminho sob este diretório para os arquivos de log de redo corresponde ao padrão `ndb_nodeid_fs/D#/DBLQH/S#.FragLog`. *`nodeid`* é o ID do nó do nó de dados. As duas ocorrências de *`#`* representam cada um um número (não necessariamente o mesmo número); o número que segue `D` está no intervalo de 8 a 39, inclusive; o intervalo do número que segue `S` varia de acordo com o valor do parâmetro de configuração `NoOfFragmentLogFiles`, cujo valor padrão é 16; assim, o intervalo padrão do número no nome do arquivo é de 0 a 15, inclusive. Para mais informações, consulte Diretório do Sistema de Arquivos do Nó de Dados do Cluster NDB.

O nome do arquivo a ser lido pode ser seguido por uma ou mais das opções listadas aqui:

- `-dump`

  <table frame="box" rules="all" summary="Propriedades para aterro"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">-dump</code>]]</td> </tr></tbody></table>

  Imprima as informações do dump de impressão.

- <table frame="box" rules="all" summary="Propriedades para filedescriptors"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">-filedescriptors</code>]]</td> </tr></tbody></table>

  `-filedescriptors`: Imprima apenas os descritores de arquivo.

- <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--help</code>]]</td> </tr></tbody></table>

  `--help`: Imprima informações de uso.

- `-lap`

  <table frame="box" rules="all" summary="Propriedades para volta"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">-lap</code>]]</td> </tr></tbody></table>

  Forneça informações sobre a volta, incluindo o GCI máximo iniciado e concluído.

- <table frame="box" rules="all" summary="Propriedades para mbyte"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">-mbyte #</code>]]</td> </tr><tr><th>Tipo</th> <td>Numérico</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">15</code>]]</td> </tr></tbody></table>

  `-mbyte #`: Início em megabytes.

  *`#`* é um número inteiro no intervalo de 0 a 15, inclusive.

- <table frame="box" rules="all" summary="Propriedades para mbyteheaders"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">-mbyteheaders</code>]]</td> </tr></tbody></table>

  `-mbyteheaders`: Mostrar apenas o cabeçalho da primeira página de cada megabyte no arquivo.

- <table frame="box" rules="all" summary="Propriedades para noprint"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">-noprint</code>]]</td> </tr></tbody></table>

  `-noprint`: Não imprima o conteúdo do arquivo de log.

- <table frame="box" rules="all" summary="Propriedades para nocheck"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">-nocheck</code>]]</td> </tr></tbody></table>

  `-nocheck`: Não verifique o arquivo de log em busca de erros.

- <table frame="box" rules="all" summary="Propriedades para a página"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">-page #</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">31</code>]]</td> </tr></tbody></table>

  `-página #`: Comece nesta página.

  *`#`* é um número inteiro no intervalo de 0 a 31, inclusive.

- <table frame="box" rules="all" summary="Propriedades para aterro"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">-dump</code>]]</td> </tr></tbody></table>0

  `-pageheaders`: Mostrar apenas os cabeçalhos das páginas.

- <table frame="box" rules="all" summary="Propriedades para aterro"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">-dump</code>]]</td> </tr></tbody></table>1

  `-pageindex #`: Comece nesta página de índice.

  *`#`* é um número inteiro entre 12 e 8191, inclusive.

- `-twiddle`

  <table frame="box" rules="all" summary="Propriedades para aterro"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">-dump</code>]]</td> </tr></tbody></table>2

  Dump com deslocamento de bits.

Assim como **ndb\_print\_backup\_file** e **ndb\_print\_schema\_file** (e ao contrário da maioria das ferramentas de `**NDB**` que são destinadas a serem executadas em um servidor de gerenciamento ou para se conectar a um servidor de gerenciamento), **ndb\_redo\_log\_reader** deve ser executado em um nó de dados do cluster, pois ele acessa diretamente o sistema de arquivos do nó de dados. Como ele não faz uso do servidor de gerenciamento, essa ferramenta pode ser usada quando o servidor de gerenciamento não está em execução e até mesmo quando o cluster foi completamente desligado.
