### 21.5.17 ndb_perror — Obter informações da mensagem de erro do NDB

**ndb_perror** mostra informações sobre um erro do NDB, dado seu código de erro. Isso inclui a mensagem de erro, o tipo de erro e se o erro é permanente ou temporário. Adicionada à distribuição do MySQL NDB Cluster no NDB 7.6, é destinada a ser uma substituição direta para **perror**.

#### Uso

```sql
ndb_perror [options] error_code
```

**ndb_perror** não precisa acessar um NDB Cluster em execução ou qualquer nó (incluindo nós SQL). Para visualizar informações sobre um erro específico do NDB, invocando o programa, use o código de erro como argumento, da seguinte forma:

```sql
$> ndb_perror 323
NDB error code 323: Invalid nodegroup id, nodegroup already existing: Permanent error: Application error
```

Para exibir apenas a mensagem de erro, invoque **ndb_perror** com a opção `--silent` (forma abreviada `-s`), conforme mostrado aqui:

```sql
$> ndb_perror -s 323
Invalid nodegroup id, nodegroup already existing: Permanent error: Application error
```

Assim como **perror**, **ndb_perror** aceita vários códigos de erro:

```sql
$> ndb_perror 321 1001
NDB error code 321: Invalid nodegroup id: Permanent error: Application error
NDB error code 1001: Illegal connect string
```

Outras opções de programas para **ndb_perror** são descritas mais adiante nesta seção.

**ndb_perror** substitui **perror** `--ndb`, que está desatualizado no NDB 7.6 e está sujeito à remoção em uma futura versão do MySQL NDB Cluster. Para facilitar a substituição em scripts e outras aplicações que possam depender de **perror** para obter informações de erro do NDB, **ndb_perror** suporta sua própria opção “falsa” `--ndb`, que não faz nada.

A tabela a seguir inclui todas as opções específicas do programa NDB Cluster **ndb_perror**. Descrições adicionais seguem a tabela.

**Tabela 21.36 Opções de linha de comando usadas com o programa ndb_perror**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Formato</th> <th>Descrição</th> <th>Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p> [[PH_HTML_CODE_<code> -s </code>] </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> -s </code>] </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> -V </code>] </p></th> <td>Leia também grupos com concatenação(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[PH_HTML_CODE_<code>--verbose</code>],</p><p> [[PH_HTML_CODE_<code> -v </code>] </p></th> <td>Exibir texto de ajuda</td> <td><p>ADICIONADO: NDB 7.6.4</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --login-path=path </code>]] </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --ndb </code>]] </p></th> <td>Para compatibilidade com aplicativos que dependem de versões antigas do perror; não faz nada</td> <td><p>ADICIONADO: NDB 7.6.4</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --no-defaults </code>]] </p></th> <td>Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --print-defaults </code>]] </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 5.7)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--silent</code>]],</p><p> [[<code> -s </code>]] </p></th> <td>Mostrar apenas a mensagem de erro</td> <td><p>ADICIONADO: NDB 7.6.4</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --defaults-file=path </code><code> -s </code>],</p><p> [[<code> -V </code>]] </p></th> <td>Imprimir as informações da versão do programa e sair</td> <td><p>ADICIONADO: NDB 7.6.4</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--verbose</code>]],</p><p> [[<code> -v </code>]] </p></th> <td>Saída verbose; desative com --silent</td> <td><p>ADICIONADO: NDB 7.6.4</p></td> </tr></tbody></table>

#### Opções adicionais

- `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.4</td> </tr></tbody></table>

  Exibir o texto de ajuda do programa e sair.

- `--ndb`

  <table frame="box" rules="all" summary="Propriedades para ndb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.4</td> </tr></tbody></table>

  Para compatibilidade com aplicativos que dependem de versões antigas do **perror** que utilizam a opção `--ndb` desse programa. A opção, quando usada com **ndb_perror**, não faz nada e é ignorada por ele.

- `--silent`, `-s`

  <table frame="box" rules="all" summary="Propriedades para silencioso"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--silent</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.4</td> </tr></tbody></table>

  Mostrar apenas a mensagem de erro.

- `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para a versão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--version</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.4</td> </tr></tbody></table>

  Imprima as informações da versão do programa e saia.

- `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para verbose"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--verbose</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.19-ndb-7.6.4</td> </tr></tbody></table>

  Saída verbose; desative com `--silent`.
