### 25.5.24 ndb\_secretsfile\_reader — Obter informações-chave de um arquivo de segredos de criptografia NDB

O **ndb\_secretsfile\_reader** obtém a chave de criptografia de um arquivo de segredos de criptografia NDB, dado a senha.

#### Uso

```
ndb_secretsfile_reader options file
```

Os *`options`* devem incluir uma das opções `--filesystem-password` ou `--filesystem-password-from-stdin`, e a senha de criptografia deve ser fornecida, como mostrado aqui:

```
> ndb_secretsfile_reader --filesystem-password=54kl14 ndb_5_fs/D1/NDBCNTR/S0.sysfile
ndb_secretsfile_reader: [Warning] Using a password on the command line interface can be insecure.
cac256e18b2ddf6b5ef82d99a72f18e864b78453cc7fa40bfaf0c40b91122d18
```

Essas e outras opções que podem ser usadas com **ndb\_secretsfile\_reader** estão mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--defaults-extra-file=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>

  Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--defaults-file=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>

  Leia as opções padrão do arquivo fornecido.

* `--defaults-group-suffix`

<table frame="box" rules="all" summary="Propriedades para defaults-group-suffix">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--defaults-group-suffix=string</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code class="literal">[none]</code></td>
  </tr>
</table>

  Leia também grupos com concatenação(grupo, sufixo).

* `--filesystem-password`

  <table frame="box" rules="all" summary="Propriedades para filesystem-password">
  <tbody>
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--filesystem-password=password</code></td>
    </tr>
  </tbody></table>

  Transmita a senha de criptografia e descriptografia do sistema de arquivos para **ndb\_secretsfile\_reader** usando `stdin`, `tty` ou o arquivo `my.cnf`.

* `--filesystem-password-from-stdin`

  <table frame="box" rules="all" summary="Propriedades para filesystem-password-from-stdin">
  <tbody>
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--filesystem-password-from-stdin={TRUE|FALSE}</code></td>
    </tr>
  </tbody></table>

  Transmita a senha de criptografia e descriptografia do sistema de arquivos para **ndb\_secretsfile\_reader** a partir de `stdin` (apenas).

* `--help`

  <table frame="box" rules="all" summary="Propriedades para help">
  <tbody>
    <tr>
      <th>Formato de linha de comando</th>
      <td><code class="literal">--help</code></td>
    </tr>
  </tbody></table>

  Exibir texto de ajuda e sair.

* `--login-path`

Leia o caminho de login fornecido no arquivo de login.

* `--no-caminhos-de-login`

  <table frame="box" rules="all" summary="Propriedades para no-caminhos-de-login"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--no-login-paths</code></td> </tr></tbody></table>

  Ignora a leitura das opções do arquivo de caminho de login.

* `--no-padrões`

  <table frame="box" rules="all" summary="Propriedades para no-padrões"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--no-defaults</code></td> </tr></tbody></table>

  Não leia opções padrão de nenhum arquivo de opções, exceto o arquivo de login.

* `--imprimir-padrões`

  <table frame="box" rules="all" summary="Propriedades para imprimir-padrões"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--print-defaults</code></td> </tr></tbody></table>

  Imprima a lista de argumentos do programa e saia.

* `--ajuda`

  <table frame="box" rules="all" summary="Propriedades para arquivos-de-padrões"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--defaults-file=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code class="literal">[nenhum]</code></td> </tr></tbody></table>0

  Exiba texto de ajuda e saia; o mesmo que `--help`.

* `--versão`

<table frame="box" rules="all" summary="Propriedades para defaults-file">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code class="literal">--defaults-file=caminho</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code class="literal">[nenhum]</code></td>
  </tr>
</table>1

Exibir informações da versão e sair.