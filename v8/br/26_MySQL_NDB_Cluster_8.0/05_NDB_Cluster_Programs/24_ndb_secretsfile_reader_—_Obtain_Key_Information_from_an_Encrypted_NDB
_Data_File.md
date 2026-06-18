### 25.5.24 ndb\_secretsfile\_reader — Obter informações-chave de um arquivo de dados criptografado do NDB

O **ndb\_secretsfile\_reader** obtém a chave de criptografia de um arquivo de segredos de criptografia `NDB`, dado a senha.

#### Uso

```
ndb_secretsfile_reader options file
```

O `options` deve incluir um dos `--filesystem-password` ou `--filesystem-password-from-stdin`, e a senha de criptografia deve ser fornecida, conforme mostrado aqui:

```
> ndb_secretsfile_reader --filesystem-password=54kl14 ndb_5_fs/D1/NDBCNTR/S0.sysfile
ndb_secretsfile_reader: [Warning] Using a password on the command line interface can be insecure.
cac256e18b2ddf6b5ef82d99a72f18e864b78453cc7fa40bfaf0c40b91122d18
```

Essas e outras opções que podem ser usadas com **ndb\_secretsfile\_reader** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

**Tabela 25.45 Opções de linha de comando usadas com o programa ndb\_secretsfile\_reader**

<table frame="box" rules="all"><thead><tr> <th scope="col">Formato</th> <th scope="col">Descrição</th> <th scope="col">Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p> [[PH_HTML_CODE_<code>--usage</code>] </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code>--usage</code>] </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code>--version</code>] </p></th> <td>Leia também grupos com concatenação(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> -V </code>] </p></th> <td>Senha para criptografia do sistema de arquivos do nó; pode ser passada a partir do stdin, tty ou arquivo my.cnf</td> <td><p>ADICIONADO: 8.0.31</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --filesystem-password-from-stdin={TRUE|FALSE} </code>]] </p></th> <td>Obtenha a senha de criptografia do stdin</td> <td><p>ADICIONADO: 8.0.31</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--help</code>]],</p><p> [[<code> -? </code>]] </p></th> <td>Exibir texto de ajuda e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --login-path=path </code>]] </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --no-defaults </code>]] </p></th> <td>Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --print-defaults </code>]] </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--usage</code>]],</p><p> [[<code> --defaults-file=path </code><code>--usage</code>] </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--version</code>]],</p><p> [[<code> -V </code>]] </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

- `--defaults-extra-file`

  <table summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-extra-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia o arquivo fornecido após a leitura dos arquivos globais.

- `--defaults-file`

  <table summary="Propriedades para arquivo de falhas"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia as opções padrão do arquivo fornecido.

- `--defaults-group-suffix`

  <table summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-group-suffix=string</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia também grupos com concatenação (grupo, sufixo).

- `--filesystem-password`

  <table summary="Propriedades para senha do sistema de arquivos"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--filesystem-password=password</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.31</td> </tr></tbody></table>

  Transmita a senha de criptografia e descriptografia do sistema de arquivos para o **ndb\_secretsfile\_reader** usando `stdin`, `tty` ou o arquivo `my.cnf`.

- `--filesystem-password-from-stdin`

  <table summary="Propriedades para senha do sistema de arquivos a partir de entrada padrão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--filesystem-password-from-stdin={TRUE|FALSE}</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.31</td> </tr></tbody></table>

  Transmita a senha de criptografia e descriptografia do sistema de arquivos para **ndb\_secretsfile\_reader** a partir de `stdin` (apenas).

- `--help`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr></tbody></table>

  Exibir texto de ajuda e sair.

- `--login-path`

  <table summary="Propriedades para o caminho de login"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--login-path=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia o caminho fornecido a partir do arquivo de login.

- `--no-defaults`

  <table summary="Propriedades sem penalidades"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--no-defaults</code>]]</td> </tr></tbody></table>

  Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

- `--print-defaults`

  <table summary="Propriedades para padrões de impressão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--print-defaults</code>]]</td> </tr></tbody></table>

  Imprima a lista de argumentos do programa e saia.

- `--usage`

  <table summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-extra-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>0

  Exibir texto de ajuda e sair; o mesmo que --help.

- `--version`

  <table summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-extra-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>1

  Exibir informações da versão e sair.

O **ndb\_secretsfile\_reader** foi adicionado no NDB 8.0.31.
