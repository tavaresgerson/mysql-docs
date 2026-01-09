### 25.5.17 ndb_print_backup_file — Imprimir conteúdo do arquivo de backup do NDB

**ndb_print_backup_file** obtém informações de diagnóstico de um arquivo de backup de cluster.

#### Uso

```
ndb_print_backup_file [-P password] file_name
```

* `file_name` é o nome de um arquivo de backup de cluster. Pode ser qualquer um dos arquivos (`.Data`, `.ctl` ou `.log`) encontrados em um diretório de backup de cluster. Esses arquivos são encontrados no diretório de backup do nó de dados sob o subdiretório `BACKUP-#`, onde *`#`* é o número de sequência do backup. Para mais informações sobre arquivos de backup de cluster e seu conteúdo, consulte a Seção 25.6.8.1, “Conceitos de backup de cluster NDB”.

Como **ndb_print_schema_file** e **ndb_print_sys_file** (e ao contrário da maioria das outras ferramentas `NDB` que são destinadas a serem executadas em um host do servidor de gerenciamento ou para se conectar a um servidor de gerenciamento) **ndb_print_backup_file** deve ser executado em um nó de dados de cluster, pois ele acessa diretamente o sistema de arquivos do nó de dados. Como ele não faz uso do servidor de gerenciamento, essa ferramenta pode ser usada quando o servidor de gerenciamento não está em execução, e até mesmo quando o cluster foi completamente desligado.

Este programa também pode ser usado para ler arquivos de log de desfazer.

#### Opções

**ndb_print_backup_file** suporta as opções descritas na lista a seguir.

* `--backup-key`, `-K`

  <table frame="box" rules="all" summary="Propriedades para chave de backup"><tbody><tr><th>Formato de linha de comando</th> <td><code>--backup-key=key</code></td> </tr></tbody></table>

  Especifique a chave necessária para descriptografar um backup criptografado.

* `--backup-key-from-stdin`

<table frame="box" rules="all" summary="Propriedades para backup-chave-de-entrada-padrão">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--backup-chave-de-entrada-padrão</code></td>
  </tr>
</table>

  Permite a entrada da chave de descriptografia de entrada padrão, semelhante a digitar uma senha após invocar o **mysql** `--password` sem fornecer uma senha.

* `--backup-senha`

  <table frame="box" rules="all" summary="Propriedades para backup-senha">
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code>--backup-senha=senha</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>String</td>
    </tr>
    <tr>
      <th>Valor Padrão</th>
      <td><code>[nenhuma]</code></td>
    </tr>
  </table>

  Especifique a senha necessária para descriptografar um backup criptografado.

* `--backup-senha-de-entrada-padrão`

  <table frame="box" rules="all" summary="Propriedades para backup-senha-de-entrada-padrão">
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code>--backup-senha-de-entrada-padrão</code></td>
    </tr>
  </table>

  Permite a entrada da senha de entrada padrão, semelhante a digitar uma senha após invocar o **mysql** `--password` sem fornecer uma senha.

* `--número-diretório-de-controle`

  <table frame="box" rules="all" summary="Propriedades para número-diretório-de-controle">
    <tr>
      <th>Formato de Linha de Comando</th>
      <td><code>--número-diretório-de-controle=#</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Inteiro</td>
    </tr>
    <tr>
      <th>Valor Padrão</th>
      <td><code>0</code></td>
    </tr>
  </table>

  Número do diretório de controle. Usado junto com `--print-restauradas-linhas`.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-extra-file=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Ler o arquivo dado após os arquivos globais serem lidos.

* `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-file=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Ler as opções padrão do arquivo dado apenas.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Ler também os grupos com concatenação(grupo, sufixo).

* `--fragment-id`

  <table frame="box" rules="all" summary="Propriedades para fragment-id"><tbody><tr><th>Formato de linha de comando</th> <td><code>--fragment-id=#</code></td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>0</code></td> </tr></tbody></table>

  ID do fragmento. Usado junto com `--print-restored-rows`.

* `--help`

<table frame="box" rules="all" summary="Propriedades para ajuda">
  <tr><th>Formato de linha de comando</th> <td><p class="valor_válido"><code>--help</code></p><p class="valor_válido"><code>--usage</code></p></td></tr>
</table>

  Imprima informações de uso do programa.

* `--caminho_de_login`

  <table frame="box" rules="all" summary="Propriedades para backup-key-from-stdin"><tbody><tr><th>Formato de linha de comando</th> <td><code>--backup-key-from-stdin</code></td> </tr></tbody></table>

  Leia o caminho fornecido a partir do arquivo de login.

* `--sem_caminhos_de_login`

  <table frame="box" rules="all" summary="Propriedades para backup-key-from-stdin"><tbody><tr><th>Formato de linha de comando</th> <td><code>--backup-key-from-stdin</code></td> </tr></tbody></table>

  Ignora a leitura de opções a partir do arquivo de caminho de login.

* `--sem_configurações_padrão`

  <table frame="box" rules="all" summary="Propriedades para backup-key-from-stdin"><tbody><tr><th>Formato de linha de comando</th> <td><code>--backup-key-from-stdin</code></td> </tr></tbody></table>

  Não leia opções padrão a partir de qualquer arquivo de opções, exceto o arquivo de login.

* `--sem_exibir_linhas`

  <table frame="box" rules="all" summary="Propriedades para backup-key-from-stdin"><tbody><tr><th>Formato de linha de comando</th> <td><code>--backup-key-from-stdin</code></td> </tr></tbody></table>

  Não inclua linhas na saída.

* `--exibir_configurações_padrão`

<table frame="box" rules="all" summary="Propriedades para backup-key-from-stdin">
  <tr><th>Formato de Linha de Comando</th> <td><code>--backup-key-from-stdin</code></td> </tr>
</table>

  Imprimir a lista de argumentos do programa e sair.

* `--print-header-words`

  <table frame="box" rules="all" summary="Propriedades para backup-key-from-stdin">
    <tr><th>Formato de Linha de Comando</th> <td><code>--backup-key-from-stdin</code></td> </tr>
  </table>

  Incluir palavras de cabeçalho no resultado.

* `--print-restored-rows`

  <table frame="box" rules="all" summary="Propriedades para backup-key-from-stdin">
    <tr><th>Formato de Linha de Comando</th> <td><code>--backup-key-from-stdin</code></td> </tr>
  </table>

  Incluir as linhas restauradas no resultado, usando o arquivo `LCP/c/TtFf.ctl`, para o qual os valores são definidos da seguinte forma:

  + *`c`* é o número do arquivo de controle definido usando `--control-directory-number`

  + *`t`* é o ID da tabela definido usando `--table-id`

  + *`f`* é o ID do fragmento definido usando `--fragment-id`

* `--print-rows`

  <table frame="box" rules="all" summary="Propriedades para backup-key-from-stdin">
    <tr><th>Formato de Linha de Comando</th> <td><code>--backup-key-from-stdin</code></td> </tr>
  </table>

  Imprimir as linhas. Esta opção está habilitada por padrão; para desabilitá-la, use `--no-print-rows`.

* `--print-rows-per-page`

<table frame="box" rules="all" summary="Propriedades para backup-chave-de-entrada-de-stdin">
  <tr><th>Formato de linha de comando</th> <td><code>--backup-key-from-stdin</code></td> </tr>
</table>

Imprimir linhas por página.

* `--rowid-file`

<table frame="box" rules="all" summary="Propriedades para backup-chave-de-stdin">
  <tr><th>Formato de linha de comando</th> <td><code>--backup-key-from-stdin</code></td> </tr>
</table>

Arquivo para verificar o ID da linha.

* `--show-rows-ignores`

<table frame="box" rules="all" summary="Propriedades para backup-senha">
  <tr><th>Formato de linha de comando</th> <td><code>--backup-password=senha</code></td> </tr>
  <tr><th>Tipo</th> <td>String</td> </tr>
  <tr><th>Valor padrão</th> <td><code>[nenhuma]</code></td> </tr>
</table>

Mostrar linhas ignoradas.

* `--id-tabela`

<table frame="box" rules="all" summary="Propriedades para backup-senha">
  <tr><th>Formato de linha de comando</th> <td><code>--backup-password=senha</code></td> </tr>
  <tr><th>Tipo</th> <td>String</td> </tr>
  <tr><th>Valor padrão</th> <td><code>[nenhuma]</code></td> </tr>
</table>

ID da tabela. Usado junto com `--print-rows-restauradas`.

* `--uso`

<table frame="box" rules="all" summary="Propriedades para senha de backup">
  <tr><th>Formato de linha de comando</th> <td><code>--backup-password=senha</code></td> </tr>
  <tr><th>Tipo</th> <td>String</td> </tr>
  <tr><th>Valor padrão</th> <td><code>[nenhuma]</code></td> </tr>
</table>

  Exibir texto de ajuda e sair; o mesmo que `--help`.

* `--verbose`

  <table frame="box" rules="all" summary="Propriedades para senha de backup">
    <tr><th>Formato de linha de comando</th> <td><code>--backup-password=senha</code></td> </tr>
    <tr><th>Tipo</th> <td>String</td> </tr>
    <tr><th>Valor padrão</th> <td><code>[nenhuma]</code></td> </tr>
  </table>

  Nível de verbosidade da saída. Um valor maior indica um nível de verbosidade maior.

* `--version`

  <table frame="box" rules="all" summary="Propriedades para senha de backup">
    <tr><th>Formato de linha de comando</th> <td><code>--backup-password=senha</code></td> </tr>
    <tr><th>Tipo</th> <td>String</td> </tr>
    <tr><th>Valor padrão</th> <td><code>[nenhuma]</code></td> </tr>
  </table>

  Exibir informações da versão e sair.