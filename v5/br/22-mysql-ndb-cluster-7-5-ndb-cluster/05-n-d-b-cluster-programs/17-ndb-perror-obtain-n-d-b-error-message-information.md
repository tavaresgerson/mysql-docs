### 21.5.17 ndb_perror — Obter Informações de Mensagens de Erro NDB

[**ndb_perror**](mysql-cluster-programs-ndb-perror.html "21.5.17 ndb_perror — Obtain NDB Error Message Information") exibe informações sobre um erro NDB, dado o seu Error Code. Isso inclui a mensagem de erro, o tipo de erro e se o erro é permanente ou temporário. Adicionado à distribuição do MySQL NDB Cluster no NDB 7.6, ele se destina a ser um substituto direto (drop-in replacement) para [**perror**](perror.html "4.8.2 perror — Display MySQL Error Message Information") [`--ndb`](perror.html#option_perror_ndb).

#### Uso

```sql
ndb_perror [options] error_code
```

[**ndb_perror**](mysql-cluster-programs-ndb-perror.html "21.5.17 ndb_perror — Obtain NDB Error Message Information") não precisa acessar um NDB Cluster em execução, nem quaisquer nodes (incluindo nodes SQL). Para visualizar informações sobre um determinado erro NDB, invoque o programa, usando o Error Code como argumento, assim:

```sql
$> ndb_perror 323
NDB error code 323: Invalid nodegroup id, nodegroup already existing: Permanent error: Application error
```

Para exibir apenas a mensagem de erro, invoque [**ndb_perror**](mysql-cluster-programs-ndb-perror.html "21.5.17 ndb_perror — Obtain NDB Error Message Information") com a Option [`--silent`](mysql-cluster-programs-ndb-perror.html#option_ndb_perror_silent) (forma abreviada `-s`), conforme mostrado aqui:

```sql
$> ndb_perror -s 323
Invalid nodegroup id, nodegroup already existing: Permanent error: Application error
```

Assim como [**perror**](perror.html "4.8.2 perror — Display MySQL Error Message Information"), [**ndb_perror**](mysql-cluster-programs-ndb-perror.html "21.5.17 ndb_perror — Obtain NDB Error Message Information") aceita múltiplos Error Codes:

```sql
$> ndb_perror 321 1001
NDB error code 321: Invalid nodegroup id: Permanent error: Application error
NDB error code 1001: Illegal connect string
```

Options de programa adicionais para [**ndb_perror**](mysql-cluster-programs-ndb-perror.html "21.5.17 ndb_perror — Obtain NDB Error Message Information") são descritas mais adiante nesta seção.

[**ndb_perror**](mysql-cluster-programs-ndb-perror.html "21.5.17 ndb_perror — Obtain NDB Error Message Information") substitui [**perror**](perror.html "4.8.2 perror — Display MySQL Error Message Information") `--ndb`, que está deprecated no NDB 7.6 e sujeito à remoção em um futuro release do MySQL NDB Cluster. Para facilitar a substituição em scripts e outros aplicativos que possam depender de [**perror**](perror.html "4.8.2 perror — Display MySQL Error Message Information") para obter informações de erro NDB, [**ndb_perror**](mysql-cluster-programs-ndb-perror.html "21.5.17 ndb_perror — Obtain NDB Error Message Information") suporta sua própria Option "dummy" (fictícia) [`--ndb`](mysql-cluster-programs-ndb-perror.html#option_ndb_perror_ndb), que não faz nada.

A tabela a seguir inclui todas as options que são específicas do programa NDB Cluster [**ndb_perror**](mysql-cluster-programs-ndb-perror.html "21.5.17 ndb_perror — Obtain NDB Error Message Information"). Descrições adicionais seguem a tabela.

**Tabela 21.36 Options de linha de comando usadas com o programa ndb_perror**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Formato</th> <th>Descrição</th> <th>Adicionado, Obsoleto (Deprecated) ou Removido</th> </tr></thead><tbody><tr> <th><p> <code> --defaults-extra-file=path </code> </p></th> <td>Lê o arquivo fornecido após a leitura dos arquivos globais</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-file=path </code> </p></th> <td>Lê as Options padrão apenas do arquivo fornecido</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-group-suffix=string </code> </p></th> <td>Também lê grupos com concat(grupo, sufixo)</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code> -? </code> </p></th> <td>Exibe o texto de ajuda</td> <td><p> ADICIONADO: NDB 7.6.4 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --login-path=path </code> </p></th> <td>Lê o caminho fornecido a partir do login file</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb </code> </p></th> <td>Para compatibilidade com aplicativos que dependem de versões antigas do perror; não faz nada</td> <td><p> ADICIONADO: NDB 7.6.4 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-defaults </code> </p></th> <td>Não lê Options padrão de nenhum arquivo de Option além do login file</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-defaults </code> </p></th> <td>Imprime a lista de argumentos do programa e sai</td> <td><p> (Suportado em todos os releases NDB baseados no MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--silent</code>, </p><p> <code> -s </code> </p></th> <td>Mostra apenas a mensagem de erro</td> <td><p> ADICIONADO: NDB 7.6.4 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code> -V </code> </p></th> <td>Imprime as informações de versão do programa e sai</td> <td><p> ADICIONADO: NDB 7.6.4 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--verbose</code>, </p><p> <code> -v </code> </p></th> <td>Verbose output; desabilite com --silent</td> <td><p> ADICIONADO: NDB 7.6.4 </p></td> </tr></tbody></table>

#### Options Adicionais

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.4</td> </tr></tbody></table>

  Exibe o texto de ajuda do programa e sai.

* `--ndb`

  <table frame="box" rules="all" summary="Properties for ndb"><tbody><tr><th>Command-Line Format</th> <td><code>--ndb</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.4</td> </tr></tbody></table>

  Para compatibilidade com aplicativos que dependem de versões antigas do [**perror**](perror.html "4.8.2 perror — Display MySQL Error Message Information") que usam a Option [`--ndb`](perror.html#option_perror_ndb) desse programa. A Option, quando usada com [**ndb_perror**](mysql-cluster-programs-ndb-perror.html "21.5.17 ndb_perror — Obtain NDB Error Message Information"), não faz nada e é ignorada por ele.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Properties for silent"><tbody><tr><th>Command-Line Format</th> <td><code>--silent</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.4</td> </tr></tbody></table>

  Mostra apenas a mensagem de erro.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for version"><tbody><tr><th>Command-Line Format</th> <td><code>--version</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.4</td> </tr></tbody></table>

  Imprime informações de versão do programa e sai.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for verbose"><tbody><tr><th>Command-Line Format</th> <td><code>--verbose</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.4</td> </tr></tbody></table>

  Verbose output; desabilite com [`--silent`](mysql-cluster-programs-ndb-perror.html#option_ndb_perror_silent).