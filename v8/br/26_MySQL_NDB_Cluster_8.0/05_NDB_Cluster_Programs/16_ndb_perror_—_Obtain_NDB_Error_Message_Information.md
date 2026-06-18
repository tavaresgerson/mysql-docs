### 25.5.16 ndb\_perror — Obter informações da mensagem de erro do NDB

O **ndb\_perror** exibe informações sobre um erro do NDB, dado seu código de erro. Isso inclui a mensagem de erro, o tipo de erro e se o erro é permanente ou temporário. Isso é destinado como um substituto direto para **perror** `--ndb`, que não é mais suportado.

#### Uso

```
ndb_perror [options] error_code
```

O **ndb\_perror** não precisa acessar um NDB Cluster em execução ou qualquer nó (incluindo nós SQL). Para visualizar informações sobre um erro específico do NDB, invocando o programa, use o código de erro como argumento, da seguinte forma:

```
$> ndb_perror 323
NDB error code 323: Invalid nodegroup id, nodegroup already existing: Permanent error: Application error
```

Para exibir apenas a mensagem de erro, invocando **ndb\_perror** com a opção `--silent` (forma abreviada `-s`), como mostrado aqui:

```
$> ndb_perror -s 323
Invalid nodegroup id, nodegroup already existing: Permanent error: Application error
```

Assim como **perror**, **ndb\_perror** aceita vários códigos de erro:

```
$> ndb_perror 321 1001
NDB error code 321: Invalid nodegroup id: Permanent error: Application error
NDB error code 1001: Illegal connect string
```

Outras opções de programa para **ndb\_perror** são descritas mais adiante nesta seção.

**ndb\_perror** substitui **perror** `--ndb`, que não é mais suportado pelo NDB Cluster. Para facilitar a substituição em scripts e outras aplicações que possam depender de **perror** para obter informações de erro do NDB, **ndb\_perror** suporta sua própria opção “falsa” `--ndb`, que não faz nada.

A tabela a seguir inclui todas as opções específicas do programa NDB Cluster **ndb\_perror**. Descrições adicionais seguem a tabela.

**Tabela 25.38 Opções de linha de comando usadas com o programa ndb\_perror**

<table frame="box" rules="all"><thead><tr> <th scope="col">Formato</th> <th scope="col">Descrição</th> <th scope="col">Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p> [[PH_HTML_CODE_<code> -s </code>] </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> -s </code>] </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> -V </code>] </p></th> <td>Leia também grupos com concatenação(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[PH_HTML_CODE_<code>--verbose</code>],</p><p> [[PH_HTML_CODE_<code> -v </code>] </p></th> <td>Exibir texto de ajuda</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --login-path=path </code>]] </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --ndb </code>]] </p></th> <td>Para compatibilidade com aplicativos que dependem de versões antigas do perror; não faz nada</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --no-defaults </code>]] </p></th> <td>Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --print-defaults </code>]] </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--silent</code>]],</p><p> [[<code> -s </code>]] </p></th> <td>Mostrar apenas a mensagem de erro</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --defaults-file=path </code><code> -s </code>],</p><p> [[<code> -V </code>]] </p></th> <td>Imprimir as informações da versão do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--verbose</code>]],</p><p> [[<code> -v </code>]] </p></th> <td>Saída verbose; desative com --silent</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

#### Opções adicionais

- `--defaults-extra-file`

  <table summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-extra-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia o arquivo fornecido após a leitura dos arquivos globais.

- `--defaults-file`

  <table summary="Propriedades para arquivo de falhas"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia as opções padrão do arquivo fornecido.

- `--defaults-group-suffix`

  <table summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-group-suffix=string</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia também grupos com concatenação (grupo, sufixo).

- `--help`, `-?`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Exibir o texto de ajuda do programa e sair.

- `--login-path`

  <table summary="Propriedades para o caminho de login"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--login-path=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia o caminho fornecido a partir do arquivo de login.

- `--ndb`

  <table summary="Propriedades para ndb"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ndb</code>]]</td> </tr></tbody></table>

  Para compatibilidade com aplicativos que dependem de versões antigas do **perror** que utilizam a opção `--ndb` desse programa. A opção, quando usada com **ndb\_perror**, não faz nada e é ignorada por ele.

- `--no-defaults`

  <table summary="Propriedades sem penalidades"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--no-defaults</code>]]</td> </tr></tbody></table>

  Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

- `--print-defaults`

  <table summary="Propriedades para padrões de impressão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--print-defaults</code>]]</td> </tr></tbody></table>

  Imprima a lista de argumentos do programa e saia.

- `--silent`, `-s`

  <table summary="Propriedades para silencioso"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--silent</code>]]</td> </tr></tbody></table>

  Mostrar apenas a mensagem de erro.

- `--version`, `-V`

  <table summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-extra-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>0

  Imprima as informações da versão do programa e saia.

- `--verbose`, `-v`

  <table summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-extra-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>1

  Saída verborrágica; desative com `--silent`.
