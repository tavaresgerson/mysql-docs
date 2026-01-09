### 25.5.16 ndb_perror — Obter informações da mensagem de erro do NDB

O **ndb_perror** exibe informações sobre um erro do NDB, dado seu código de erro. Isso inclui a mensagem de erro, o tipo de erro e se o erro é permanente ou temporário. Isso é destinado como um substituto direto para **perror** `--ndb`, que não é mais suportado.

#### Uso

```
ndb_perror [options] error_code
```

O **ndb_perror** não precisa acessar um NDB Cluster em execução, ou quaisquer nós (incluindo nós SQL). Para visualizar informações sobre um erro específico do NDB, inicie o programa, usando o código de erro como argumento, assim:

```
$> ndb_perror 323
NDB error code 323: Invalid nodegroup id, nodegroup already existing: Permanent error: Application error
```

Para exibir apenas a mensagem de erro, inicie o **ndb_perror** com a opção `--silent` (forma abreviada `-s`), como mostrado aqui:

```
$> ndb_perror -s 323
Invalid nodegroup id, nodegroup already existing: Permanent error: Application error
```

Como o **perror**, o **ndb_perror** aceita múltiplos códigos de erro:

```
$> ndb_perror 321 1001
NDB error code 321: Invalid nodegroup id: Permanent error: Application error
NDB error code 1001: Illegal connect string
```

Outras opções de programa para o **ndb_perror** são descritas mais adiante nesta seção.

O **ndb_perror** substitui **perror** `--ndb`, que não é mais suportado pelo NDB Cluster. Para facilitar a substituição em scripts e outras aplicações que possam depender do **perror** para obter informações de erro do NDB, o **ndb_perror** suporta sua própria opção "falsa" `--ndb`, que não faz nada.

A tabela a seguir inclui todas as opções específicas do programa do NDB Cluster **ndb_perror**. Descrições adicionais seguem a tabela.

#### Opções Adicionais

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--defaults-extra-file=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

Leia o arquivo fornecido após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-file=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Leia as opções padrão do arquivo fornecido apenas.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Leia também os grupos com concatenação de (grupo, sufixo).

* `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr></tbody></table>

  Exibir o texto de ajuda do programa e sair.

* `--login-path`

  <table frame="box" rules="all" summary="Propriedades para login-path"><tbody><tr><th>Formato de linha de comando</th> <td><code>--login-path=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Leia o caminho fornecido no arquivo de login.

* `--no-login-paths`

<table frame="box" rules="all" summary="Propriedades para caminhos sem login">
  <tr><th>Formato de linha de comando</th> <td><code>--no-login-paths</code></td> </tr>
</table>

  Ignora a leitura de opções do arquivo de caminho de login.

* `--ndb`

  <table frame="box" rules="all" summary="Propriedades para ndb">
    <tr><th>Formato de linha de comando</th> <td><code>--ndb</code></td> </tr>
  </table>

  Para compatibilidade com aplicativos que dependem de versões antigas do **perror** que usam a opção `--ndb` desse programa. A opção, quando usada com **ndb_perror**, não faz nada e é ignorada por ele.

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para no-defaults">
    <tr><th>Formato de linha de comando</th> <td><code>--no-defaults</code></td> </tr>
  </table>

  Não leia opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para print-defaults">
    <tr><th>Formato de linha de comando</th> <td><code>--print-defaults</code></td> </tr>
  </table>

  Imprima a lista de argumentos do programa e saia.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Propriedades para silent">
    <tr><th>Formato de linha de comando</th> <td><code>--silent</code></td> </tr>
  </table>

  Mostre apenas a mensagem de erro.

* `--version`, `-V`

<table frame="box" rules="all" summary="Propriedades para defaults-file"><tr><th>Formato de linha de comando</th> <td><code>--defaults-file=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr></table>

  Imprime informações da versão do programa e encerra.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><tr><th>Formato de linha de comando</th> <td><code>--defaults-file=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr></table>

  Saída verbose; desative com `--silent`.