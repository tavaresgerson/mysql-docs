### 25.5.22 ndb_redo_log_reader — Verificar e Imprimir o Conteúdo do Log de Redo do Clúster

Leitura de um arquivo de log de redo, verificando-o quanto a erros, impressão de seu conteúdo em um formato legível para humanos ou ambos. O **ndb_redo_log_reader** é destinado principalmente para uso por desenvolvedores e pessoal de suporte do NDB Cluster na depuração e diagnóstico de problemas.

Este utilitário permanece em desenvolvimento, e sua sintaxe e comportamento estão sujeitos a mudanças em futuras versões do NDB Cluster.

Os arquivos de código-fonte em C++ para **ndb_redo_log_reader** podem ser encontrados no diretório `/storage/ndb/src/kernel/blocks/dblqh/redoLogReader`.

As opções que podem ser usadas com **ndb_redo_log_reader** são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

#### Uso

```
ndb_redo_log_reader file_name [options]
```

*`file_name`* é o nome de um arquivo de log de redo do clúster. Arquivos de log de redo estão localizados nos diretórios numerados sob o diretório de dados do nó de dados (`DataDir`); o caminho sob este diretório para os arquivos de log de redo corresponde ao padrão `ndb_nodeid_fs/D#/DBLQH/S#.FragLog`. *`nodeid`* é o ID de nó do nó de dados. As duas ocorrências de `#` representam cada um um número (não necessariamente o mesmo número); o número que segue `D` está no intervalo de 8 a 39, inclusive; o intervalo do número que segue `S` varia de acordo com o valor do parâmetro de configuração `NoOfFragmentLogFiles`, cujo valor padrão é 16; assim, o intervalo padrão do número no nome do arquivo é de 0 a 15, inclusive. Para mais informações, consulte o Diretório do Sistema de Arquivos de Nó de Dados do NDB Cluster.

O nome do arquivo a ser lido pode ser seguido por uma ou mais das opções listadas aqui:

* `-dump`

<table frame="box" rules="all" summary="Propriedades para dump">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">-dump</code></td> </tr>
</table>

  Imprima as informações do dump.

* `--file-key`, `-K`

  <table frame="box" rules="all" summary="Propriedades para file-key">
    <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--file-key=chave</code></td> </tr>
  </table>

  Forneça a chave de descriptografia do arquivo usando `stdin`, `tty` ou um arquivo `my.cnf`.

* `--file-key-from-stdin`

  <table frame="box" rules="all" summary="Propriedades para file-key-from-stdin">
    <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--file-key-from-stdin</code></td> </tr>
  </table>

  Forneça a chave de descriptografia do arquivo usando `stdin`.

* <table frame="box" rules="all" summary="Propriedades para filedescriptors">
    <tr><th>Formato de Linha de Comando</th> <td><code class="literal">-filedescriptors</code></td> </tr>
  </table>

  `-filedescriptors`: Imprima apenas os descritores de arquivo.

* <table frame="box" rules="all" summary="Propriedades para help">
    <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--help</code></td> </tr>
  </table>

  `--help`: Imprima informações de uso.

* `-lap`

  <table frame="box" rules="all" summary="Propriedades para lap">
    <tr><th>Formato de Linha de Comando</th> <td><code class="literal">-lap</code></td> </tr>
  </table>

  Forneça informações de lap, com GCI máximo iniciado e concluído.
```

Este é o texto traduzido para o português brasileiro, mantendo a estrutura e o conteúdo da versão original em inglês.

* <table frame="box" rules="all" summary="Propriedades para mbyte">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">-mbyte #</code></td> </tr>
  <tr><th>Tipo</th> <td>Numérico</td> </tr>
  <tr><th>Valor Padrão</th> <td><code class="literal">0</code></td> </tr>
  <tr><th>Valor Mínimo</th> <td><code class="literal">0</code></td> </tr>
  <tr><th>Valor Máximo</th> <td><code class="literal">15</code></td> </tr>
  </tr>
</table>

  [`-mbyte
  #`](mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_mbyte): Início de megabyte.

  *`#`* é um inteiro no intervalo de 0 a 15, inclusive.

* <table frame="box" rules="all" summary="Propriedades para mbyteheaders">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">-mbyteheaders</code></td> </tr>
  </tbody></table>

  `-mbyteheaders`: Mostrar apenas o cabeçalho da primeira página de cada megabyte no arquivo.

* <table frame="box" rules="all" summary="Propriedades para noprint">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">-noprint</code></td> </tr>
  </tbody></table>

  `-noprint`: Não imprimir o conteúdo do arquivo de log.

* <table frame="box" rules="all" summary="Propriedades para nocheck">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">-nocheck</code></td> </tr>
  </tbody></table>

  `-nocheck`: Não verificar o arquivo de log em busca de erros.

* <table frame="box" rules="all" summary="Propriedades para file-key">
  <tr><th>Formato de Linha de Comando</th> <td><code class="literal">--file-key=key</code></td> </tr>
  </tbody></table>0

[`-page
  #`](mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_page): Comece nesta página.

  *`#`* é um número inteiro no intervalo de 0 a 31, inclusive.

* <table frame="box" rules="all" summary="Propriedades para file-key"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--file-key=key</code></td> </tr></tbody></table>1

  `-pageheaders`: Mostrar apenas os cabeçalhos da página.

* <table frame="box" rules="all" summary="Propriedades para file-key"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--file-key=key</code></td> </tr></tbody></table>2

  [`-pageindex
  #`](mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_pageindex): Comece neste índice de página.

  *`#`* é um número inteiro entre 12 e 8191, inclusive.

* `-twiddle`

  <table frame="box" rules="all" summary="Propriedades para file-key"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--file-key=key</code></td> </tr></tbody></table>3

  Dump deslocado para a esquerda.

Assim como **ndb\_print\_backup\_file** e **ndb\_print\_schema\_file** (e ao contrário da maioria das ferramentas `NDB` que são destinadas a serem executadas em um host do servidor de gerenciamento ou para se conectar a um servidor de gerenciamento), **ndb\_redo\_log\_reader** deve ser executado em um nó de dados do cluster, pois ele acessa diretamente o sistema de arquivos do nó de dados. Como ele não faz uso do servidor de gerenciamento, essa ferramenta pode ser usada quando o servidor de gerenciamento não está em execução e até mesmo quando o cluster foi completamente desligado.