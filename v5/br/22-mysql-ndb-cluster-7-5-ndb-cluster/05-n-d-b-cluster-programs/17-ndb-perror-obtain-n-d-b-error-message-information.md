### 21.5.17 ndb\_perror — Obter informações da mensagem de erro do NDB

**ndb\_perror** mostra informações sobre um erro do NDB, dado seu código de erro. Isso inclui a mensagem de erro, o tipo de erro e se o erro é permanente ou temporário. Adicionada à distribuição do MySQL NDB Cluster no NDB 7.6, é destinada a ser uma substituição direta para **perror**.

#### Uso

```sql
ndb_perror [options] error_code
```

**ndb\_perror** não precisa acessar um NDB Cluster em execução ou qualquer nó (incluindo nós SQL). Para visualizar informações sobre um erro específico do NDB, invocando o programa, use o código de erro como argumento, da seguinte forma:

```sql
$> ndb_perror 323
NDB error code 323: Invalid nodegroup id, nodegroup already existing: Permanent error: Application error
```

Para exibir apenas a mensagem de erro, invoque **ndb\_perror** com a opção `--silent` (forma abreviada `-s`), conforme mostrado aqui:

```sql
$> ndb_perror -s 323
Invalid nodegroup id, nodegroup already existing: Permanent error: Application error
```

Assim como **perror**, **ndb\_perror** aceita vários códigos de erro:

```sql
$> ndb_perror 321 1001
NDB error code 321: Invalid nodegroup id: Permanent error: Application error
NDB error code 1001: Illegal connect string
```

Outras opções de programas para **ndb\_perror** são descritas mais adiante nesta seção.

**ndb\_perror** substitui **perror** `--ndb`, que está desatualizado no NDB 7.6 e está sujeito à remoção em uma futura versão do MySQL NDB Cluster. Para facilitar a substituição em scripts e outras aplicações que possam depender de **perror** para obter informações de erro do NDB, **ndb\_perror** suporta sua própria opção “falsa” `--ndb`, que não faz nada.

A tabela a seguir inclui todas as opções específicas do programa NDB Cluster **ndb\_perror**. Descrições adicionais seguem a tabela.

**Tabela 21.36 Opções de linha de comando usadas com o programa ndb\_perror**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Formato</th> <th scope="col">Descrição</th> <th scope="col">Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_silent">-s</a> </code>] </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_silent">-s</a> </code>] </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_version">-V</a> </code>] </p></th> <td>Leia também grupos com concatenação(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[PH_HTML_CODE_<code class="option"><a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_verbose">--verbose</a></code>],</p><p> [[PH_HTML_CODE_<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_verbose">-v</a> </code>] </p></th> <td>Exibir texto de ajuda</td> <td><p>ADICIONADO: NDB 7.6.4</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="ulink" href="/doc/refman/8.0/en/mysql-cluster-programs-ndb-perror.html#option_ndb_perror_login-path" target="_top">--login-path=path</a> </code>]] </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_ndb">--ndb</a> </code>]] </p></th> <td>Para compatibilidade com aplicativos que dependem de versões antigas do perror; não faz nada</td> <td><p>ADICIONADO: NDB 7.6.4</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="ulink" href="/doc/refman/8.0/en/mysql-cluster-programs-ndb-perror.html#option_ndb_perror_no-defaults" target="_top">--no-defaults</a> </code>]] </p></th> <td>Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p> [[<code class="option"> <a class="ulink" href="/doc/refman/8.0/en/mysql-cluster-programs-ndb-perror.html#option_ndb_perror_print-defaults" target="_top">--print-defaults</a> </code>]] </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_silent">--silent</a></code>]],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_silent">-s</a> </code>]] </p></th> <td>Mostrar apenas a mensagem de erro</td> <td><p>ADICIONADO: NDB 7.6.4</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"> <a class="ulink" href="/doc/refman/8.0/en/mysql-cluster-programs-ndb-perror.html#option_ndb_perror_defaults-file" target="_top">--defaults-file=path</a> </code><code class="option"> <a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_silent">-s</a> </code>],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_version">-V</a> </code>]] </p></th> <td>Imprimir as informações da versão do programa e sair</td> <td><p>ADICIONADO: NDB 7.6.4</p></td> </tr></tbody><tbody><tr> <th scope="row"><p>[[<code class="option"><a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_verbose">--verbose</a></code>]],</p><p> [[<code class="option"> <a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_verbose">-v</a> </code>]] </p></th> <td>Saída verbose; desative com --silent</td> <td><p>ADICIONADO: NDB 7.6.4</p></td> </tr></tbody></table>

#### Opções adicionais

- `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--help</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.4</td> </tr></tbody></table>

  Exibir o texto de ajuda do programa e sair.

- `--ndb`

  <table frame="box" rules="all" summary="Propriedades para ndb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--ndb</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.4</td> </tr></tbody></table>

  Para compatibilidade com aplicativos que dependem de versões antigas do **perror** que utilizam a opção `--ndb` desse programa. A opção, quando usada com **ndb\_perror**, não faz nada e é ignorada por ele.

- `--silent`, `-s`

  <table frame="box" rules="all" summary="Propriedades para silencioso"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--silent</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.4</td> </tr></tbody></table>

  Mostrar apenas a mensagem de erro.

- `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para a versão"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--version</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.4</td> </tr></tbody></table>

  Imprima as informações da versão do programa e saia.

- `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para verbose"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--verbose</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.4</td> </tr></tbody></table>

  Saída verbose; desative com `--silent`.
