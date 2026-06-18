### 25.5.17 ndb\_print\_backup\_file — Imprimir o conteúdo do arquivo de backup do NDB

O **ndb\_print\_backup\_file** obtém informações de diagnóstico de um arquivo de backup de cluster.

**Tabela 25.39 Opções de linha de comando usadas com o programa ndb\_print\_backup\_file**

<table frame="box" rules="all"><thead><tr> <th scope="col">Formato</th> <th scope="col">Descrição</th> <th scope="col">Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p>[[PH_HTML_CODE_<code> --defaults-group-suffix=string </code>],</p><p> [[PH_HTML_CODE_<code> --defaults-group-suffix=string </code>] </p></th> <td>Use esta senha para descriptografar o arquivo</td> <td><p>ADICIONADO: NDB 8.0.31</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> <a class="link" href="mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_fragment-id">-f
                #</a> </code>] </p></th> <td>Obtenha a chave de descriptografia de forma segura a partir do STDIN</td> <td><p>ADICIONADO: NDB 8.0.31</p></td> </tr></tbody><tbody><tr> <th><p>[[PH_HTML_CODE_<code>--help</code>],</p><p> [[PH_HTML_CODE_<code>--usage</code>] </p></th> <td>Use esta senha para descriptografar o arquivo</td> <td><p>ADICIONADO: NDB 8.0.22</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code>-h</code>] </p></th> <td>Obtenha a senha de descriptografia de forma segura a partir do STDIN</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th><p>[[PH_HTML_CODE_<code> -? </code>],</p><p> [[PH_HTML_CODE_<code> --login-path=path </code>] </p></th> <td>Número do diretório de controle</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --no-defaults </code>] </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code>--no-print-rows</code>] </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --defaults-group-suffix=string </code>]] </p></th> <td>Leia também grupos com concatenação(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> -K password </code><code> --defaults-group-suffix=string </code>],</p><p> [[<code> <a class="link" href="mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_fragment-id">-f
                #</a> </code>]] </p></th> <td>ID do fragmento</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--help</code>]],</p><p>[[<code>--usage</code>]],</p><p>[[<code>-h</code>]],</p><p> [[<code> -? </code>]] </p></th> <td>Informações de uso da impressão</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --login-path=path </code>]] </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --no-defaults </code>]] </p></th> <td>Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--no-print-rows</code>]],</p><p> [[<code> --backup-key-from-stdin </code><code> --defaults-group-suffix=string </code>] </p></th> <td>Não imprima linhas</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --backup-key-from-stdin </code><code> --defaults-group-suffix=string </code>] </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --backup-key-from-stdin </code><code> <a class="link" href="mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_fragment-id">-f
                #</a> </code>],</p><p> [[<code> --backup-key-from-stdin </code><code>--help</code>] </p></th> <td>Imprimir palavras de cabeçalho</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --backup-key-from-stdin </code><code>--usage</code>] </p></th> <td>Imprimir linhas restauradas</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --backup-key-from-stdin </code><code>-h</code>],</p><p> [[<code> --backup-key-from-stdin </code><code> -? </code>] </p></th> <td>Imprimir linhas. Ativado por padrão; desative com --no-print-rows</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --backup-key-from-stdin </code><code> --login-path=path </code>] </p></th> <td>Imprimir linhas por página</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --backup-key-from-stdin </code><code> --no-defaults </code>],</p><p> [[<code> --backup-key-from-stdin </code><code>--no-print-rows</code>] </p></th> <td>Arquivo contendo o ID da linha para verificar</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--backup-password=password</code><code> --defaults-group-suffix=string </code>],</p><p> [[<code>--backup-password=password</code><code> --defaults-group-suffix=string </code>] </p></th> <td>Mostrar linhas ignoradas</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--backup-password=password</code><code> <a class="link" href="mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_fragment-id">-f
                #</a> </code>],</p><p> [[<code>--backup-password=password</code><code>--help</code>] </p></th> <td>Tabela ID; usado com --print-restored rows</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--backup-password=password</code><code>--usage</code>],</p><p> [[<code>--backup-password=password</code><code>-h</code>] </p></th> <td>Exibir texto de ajuda e sair; o mesmo que --help</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--backup-password=password</code><code> -? </code>],</p><p> [[<code>--backup-password=password</code><code> --login-path=path </code>] </p></th> <td>Nível de verbosidade</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--backup-password=password</code><code> --no-defaults </code>],</p><p> [[<code>--backup-password=password</code><code>--no-print-rows</code>] </p></th> <td>Exibir informações da versão e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody></table>

#### Uso

```
ndb_print_backup_file [-P password] file_name
```

`file_name` é o nome de um arquivo de backup de cluster. Pode ser qualquer um dos arquivos (`.Data`, `.ctl` ou `.log`) encontrados em um diretório de backup de cluster. Esses arquivos são encontrados no diretório de backup do nó de dados sob o subdiretório `BACKUP-#`, onde `#` é o número de sequência para o backup. Para mais informações sobre arquivos de backup de cluster e seus conteúdos, consulte a Seção 25.6.8.1, “Conceitos de Backup de Cluster NDB”.

Assim como **ndb\_print\_schema\_file** e **ndb\_print\_sys\_file** (e ao contrário da maioria das outras ferramentas `NDB` que são destinadas a serem executadas em um servidor de gerenciamento ou para se conectar a um servidor de gerenciamento), **ndb\_print\_backup\_file** deve ser executado em um nó de dados do clúster, pois ele acessa diretamente o sistema de arquivos do nó de dados. Como ele não faz uso do servidor de gerenciamento, essa ferramenta pode ser usada quando o servidor de gerenciamento não está em execução e até mesmo quando o clúster foi completamente desligado.

No NDB 8.0, este programa também pode ser usado para ler arquivos de registro de desfazer.

#### Opções

Antes da versão 8.0.24 do NDB, o **ndb\_print\_backup\_file** suportava apenas a opção `-P`. A partir da versão 8.0.24 do NDB, o programa suporta várias opções, que estão descritas na lista a seguir.

- `--backup-key`, `-K`

  <table summary="Propriedades para backup-chave"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-key=key</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>

  Especifique a chave necessária para descriptografar um backup criptografado.

- `--backup-key-from-stdin`

  <table summary="Propriedades para backup-key-from-stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-key-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>

  Permitir a entrada da chave de descriptografia do padrão de entrada, semelhante a inserir uma senha após invocar **mysql** `--password` sem fornecer uma senha.

- `--backup-password`

  <table summary="Propriedades para senha de backup"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password=password</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.22-ndb-8.0.22</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Especifique a senha necessária para descriptografar um backup criptografado.

  A versão longa desta opção está disponível a partir do NDB 8.0.24.

- `--backup-password-from-stdin`

  <table summary="Propriedades para senha de backup a partir de stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-password-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>

  Permitir a entrada da senha pelo padrão de entrada, semelhante à entrada de uma senha após invocar **mysql** `--password` sem senha fornecida.

- `--control-directory-number`

  <table summary="Propriedades para controle de número de diretório"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--control-directory-number=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr></tbody></table>

  Controle o número do diretório do arquivo. Usado junto com `--print-restored-rows`.

- `--defaults-extra-file`

  <table summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-extra-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia o arquivo fornecido após a leitura dos arquivos globais.

- `--defaults-file`

  <table summary="Propriedades para arquivo de falhas"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia as opções padrão do arquivo fornecido.

- `--defaults-group-suffix`

  <table summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-group-suffix=string</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia também grupos com concatenação (grupo, sufixo).

- `--fragment-id`

  <table summary="Propriedades para fragment-id"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--fragment-id=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr></tbody></table>

  ID de fragmento. Usado junto com `--print-restored-rows`.

- `--help`

  <table summary="Propriedades para backup-chave"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-key=key</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>0

  Imprima as informações de uso do programa.

- `--login-path`

  <table summary="Propriedades para backup-chave"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-key=key</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>1

  Leia o caminho fornecido a partir do arquivo de login.

- `--no-defaults`

  <table summary="Propriedades para backup-chave"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-key=key</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>2

  Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

- `--no-print-rows`

  <table summary="Propriedades para backup-chave"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-key=key</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>3

  Não inclua linhas no resultado.

- `--print-defaults`

  <table summary="Propriedades para backup-chave"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-key=key</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>4

  Imprima a lista de argumentos do programa e saia.

- `--print-header-words`

  <table summary="Propriedades para backup-chave"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-key=key</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>5

  Inclua palavras de cabeçalho no resultado.

- `--print-restored-rows`

  <table summary="Propriedades para backup-chave"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-key=key</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>6

  Incluir linhas restauradas na saída, usando o arquivo `LCP/c/TtFf.ctl`, para o qual os valores são definidos da seguinte forma:

  - `c` é o número do arquivo de controle definido usando `--control-directory-number`

  - `t` é o ID da tabela definido usando `--table-id`

  - `f` é o ID de fragmento definido usando `--fragment-id`

- `--print-rows`

  <table summary="Propriedades para backup-chave"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-key=key</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>7

  Imprimir linhas. Esta opção está habilitada por padrão; para desabilitá-la, use `--no-print-rows`.

- `--print-rows-per-page`

  <table summary="Propriedades para backup-chave"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-key=key</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>8

  Imprima linhas por página.

- `--rowid-file`

  <table summary="Propriedades para backup-chave"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-key=key</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>9

  Arquivo para verificar o ID da linha.

- `--show-ignored-rows`

  <table summary="Propriedades para backup-key-from-stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-key-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>0

  Mostrar linhas ignoradas.

- `--table-id`

  <table summary="Propriedades para backup-key-from-stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-key-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>1

  Tabela ID. Usada juntamente com `--print-restored-rows`.

- `--usage`

  <table summary="Propriedades para backup-key-from-stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-key-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>2

  Exibir texto de ajuda e sair; o mesmo que `--help`.

- `--verbose`

  <table summary="Propriedades para backup-key-from-stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-key-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>3

  Nível de verbosidade da saída. Um valor maior indica um aumento na verbosidade.

- `--version`

  <table summary="Propriedades para backup-key-from-stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--backup-key-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>4

  Exibir informações da versão e sair.
