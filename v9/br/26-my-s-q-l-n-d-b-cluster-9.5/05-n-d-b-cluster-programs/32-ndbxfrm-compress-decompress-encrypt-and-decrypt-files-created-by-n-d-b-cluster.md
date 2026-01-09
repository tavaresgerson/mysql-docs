### 25.5.32 ndbxfrm — Descompactar, Decriptar e Decifrar Arquivos Criados pelo NDB Cluster

A ferramenta **ndbxfrm** pode ser usada para descompactar, descriptografar e exibir informações sobre arquivos criados pelo NDB Cluster que estão compactados, criptografados ou ambos. Também pode ser usada para compactar ou criptografar arquivos.

#### Uso

```
ndbxfrm --info file[ file ...]

ndbxfrm --compress input_file output_file

ndbxfrm --decrypt-password=password input_file output_file

ndbxfrm [--encrypt-ldf-iter-count=#] --encrypt-password=password input_file output_file
```

*`input_file`* e *`output_file`* não podem ser o mesmo arquivo.

#### Opções

* `--compress`, `-c`

  <table frame="box" rules="all" summary="Propriedades para compress"><tr><th>Formato de Linha de Comando</th> <td><code>--compress</code></td></tr></table>

  Compacta o arquivo de entrada, usando o mesmo método de compactação usado para compactuar backups do NDB Cluster, e escreve o resultado em um arquivo de saída. Para descriptografar um arquivo de backup `NDB` compactado que não está criptografado, é necessário apenas invocar **ndbxfrm** usando os nomes do arquivo compactado e um arquivo de saída (sem opções necessárias).

* `--decrypt-key=key`, `-K` *`key`*

  <table frame="box" rules="all" summary="Propriedades para decrypt-key"><tr><th>Formato de Linha de Comando</th> <td><code>--decrypt-key=key</code></td> </tr></table>

  Descriptografa um arquivo criptografado pelo `NDB` usando a chave fornecida.

  Nota

  Esta opção não pode ser usada juntamente com `--decrypt-password`.

* `--decrypt-key-from-stdin`

  <table frame="box" rules="all" summary="Propriedades para decrypt-key-from-stdin"><tr><th>Formato de Linha de Comando</th> <td><code>--decrypt-key-from-stdin</code></td> </tr></table>

  Descriptografa um arquivo criptografado pelo `NDB` usando a chave fornecida a partir de `stdin`.

* `--decrypt-password=senha`

  <table frame="box" rules="all" summary="Propriedades para decrypt-password"><tr><th>Formato de linha de comando</th> <td><code>--decrypt-password=senha</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhuma]</code></td> </tr></table>

  Descripta um arquivo criptografado pelo `NDB` usando a senha fornecida.

  Nota

  Esta opção não pode ser usada juntamente com `--decrypt-key`.

* `--decrypt-password-from-stdin[=TRUE|FALSE]`

  <table frame="box" rules="all" summary="Propriedades para decrypt-password-from-stdin"><tr><th>Formato de linha de comando</th> <td><code>--decrypt-password-from-stdin</code></td> </tr></table>

  Descripta um arquivo criptografado pelo `NDB`, usando uma senha fornecida pelo padrão de entrada. Isso é semelhante a inserir uma senha após invocar o **mysql** `--password` sem senha após a opção.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Propriedades para defaults-extra-file"><tr><th>Formato de linha de comando</th> <td><code>--defaults-extra-file=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhuma]</code></td> </tr></table>

  Leia o arquivo dado após os arquivos globais serem lidos.

* `--defaults-file`

Leia opções padrão de um arquivo específico.

* `--defaults-file=caminho`

  <table frame="box" rules="all" summary="Propriedades para defaults-file"><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-file=caminho</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Leia opções padrão apenas do arquivo especificado.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato de linha de comando</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Leia também grupos com `CONCAT(grupo, sufixo)`.

* `--detailed-info`

  <table frame="box" rules="all" summary="Propriedades para detailed-info"><tbody><tr><th>Formato de linha de comando</th> <td><code>--encrypt-block-size=#</code></td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Imprima informações do arquivo como `--info`, mas inclua o cabeçalho e o trailer do arquivo.

  Exemplo:

  ```
  $> ndbxfrm --detailed-info S0.sysfile
  File=/var/lib/cluster-data/ndb_7_fs/D1/NDBCNTR/S0.sysfile, compression=no, encryption=yes
  header: {
    fixed_header: {
      magic: {
        magic: { 78, 68, 66, 88, 70, 82, 77, 49 },
        endian: 18364758544493064720,
        header_size: 32768,
        fixed_header_size: 160,
        zeros: { 0, 0 }
      },
      flags: 73728,
      flag_extended: 0,
      flag_zeros: 0,
      flag_file_checksum: 0,
      flag_data_checksum: 0,
      flag_compress: 0,
      flag_compress_method: 0,
      flag_compress_padding: 0,
      flag_encrypt: 18,
      flag_encrypt_cipher: 2,
      flag_encrypt_krm: 1,
      flag_encrypt_padding: 0,
      flag_encrypt_key_selection_mode: 0,
      dbg_writer_ndb_version: 524320,
      octets_size: 32,
      file_block_size: 32768,
      trailer_max_size: 80,
      file_checksum: { 0, 0, 0, 0 },
      data_checksum: { 0, 0, 0, 0 },
      zeros01: { 0 },
      compress_dbg_writer_header_version: { ... },
      compress_dbg_writer_library_version: { ... },
      encrypt_dbg_writer_header_version: { ... },
      encrypt_dbg_writer_library_version: { ... },
      encrypt_key_definition_iterator_count: 100000,
      encrypt_krm_keying_material_size: 32,
      encrypt_krm_keying_material_count: 1,
      encrypt_key_data_unit_size: 32768,
      encrypt_krm_keying_material_position_in_octets: 0,
    },
    octets: {
       102, 68, 56, 125, 78, 217, 110, 94, 145, 121, 203, 234, 26, 164, 137, 180,
       100, 224, 7, 88, 173, 123, 209, 110, 185, 227, 85, 174, 109, 123, 96, 156,
    }
  }
  trailer: {
    fixed_trailer: {
      flags: 48,
      flag_extended: 0,
      flag_zeros: 0,
      flag_file_checksum: 0,
      flag_data_checksum: 3,
      data_size: 512,
      file_checksum: { 0, 0, 0, 0 },
      data_checksum: { 226, 223, 102, 207 },
      magic: {
        zeros: { 0, 0 }
        fixed_trailer_size: 56,
        trailer_size: 32256,
        endian: 18364758544493064720,
        magic: { 78, 68, 66, 88, 70, 82, 77, 49 },
      },
    }
  }
  ```

* `--encrypt-block-size=#`

<table frame="box" rules="all" summary="Propriedades para encrypt-block-size">
  <tr><th>Formato de linha de comando</th> <td><code>--encrypt-block-size=#</code></td> </tr>
  <tr><th>Tipo</th> <td>Inteiro</td> </tr>
  <tr><th>Valor padrão</th> <td><code>0</code></td> </tr>
  <tr><th>Valor mínimo</th> <td><code>0</code></td> </tr>
  <tr><th>Valor máximo</th> <td><code>2147483647</code></td> </tr>
</table>

  Tamanho dos blocos de dados de entrada que são criptografados como uma unidade. Usado com XTS; definido como `0` (o padrão) para o modo CBC.

* `--encrypt-cipher=#`

  <table frame="box" rules="all" summary="Propriedades para decrypt-key">
    <tr><th>Formato de linha de comando</th> <td><code>--decrypt-key=key</code></td> </tr>
  </table>

  Criptografia usada para criptografia. Definido como `1` para o modo CBC (o padrão), ou `2` para XTS.

* `--encrypt-kdf-iter-count=#`, `-k #`

  <table frame="box" rules="all" summary="Propriedades para decrypt-key">
    <tr><th>Formato de linha de comando</th> <td><code>--decrypt-key=key</code></td> </tr>
  </table>

  Ao criptografar um arquivo, especifica o número de iterações a serem usadas para a chave de criptografia. Requer a opção `--encrypt-password`.

* `--encrypt-key=key`

  <table frame="box" rules="all" summary="Propriedades para decrypt-key">
    <tr><th>Formato de linha de comando</th> <td><code>--decrypt-key=key</code></td> </tr>
  </table>

  Criptografa um arquivo usando a chave fornecida.

  Nota

  Esta opção não pode ser usada juntamente com `--encrypt-password`.

* `--encrypt-key-from-stdin`

  <table frame="box" rules="all" summary="Propriedades para decrypt-key"><tr><th>Formato de linha de comando</th> <td><code>--decrypt-key=chave</code></td> </tr></table>

  Criptografar um arquivo usando a chave fornecida pelo `stdin`.

* `--encrypt-password=senha`

  <table frame="box" rules="all" summary="Propriedades para decrypt-key"><tr><th>Formato de linha de comando</th> <td><code>--decrypt-key=chave</code></td> </tr></table>

  Criptografa o arquivo de backup usando a senha fornecida pela opção. A senha deve atender aos requisitos listados aqui:

  + Usa qualquer um dos caracteres ASCII imprimíveis, exceto `!`, `'`, `"`, `$`, `%`, `\`, `` ` `` e `^`

  + Tem no máximo 256 caracteres de comprimento
  + Está entre aspas simples ou duplas

  Observação

  Esta opção não pode ser usada juntamente com `--encrypt-key`.

* `--encrypt-password-from-stdin[=TRUE|FALSE]`

  <table frame="box" rules="all" summary="Propriedades para decrypt-key"><tr><th>Formato de linha de comando</th> <td><code>--decrypt-key=chave</code></td> </tr></table>

  Criptografa um arquivo usando uma senha fornecida pelo padrão de entrada. Isso é semelhante a inserir uma senha quando o **mysql** é invocado com `--password` sem senha após a opção.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Propriedades para decrypt-key"><tr><th>Formato de linha de comando</th> <td><code>--decrypt-key=chave</code></td> </tr></table>

  Imprime informações de uso para o programa.

* `--info`, `-i`

<table frame="box" rules="all" summary="Propriedades para decrypt-key">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--decrypt-key=chave</code></td>
  </tr>
</table>

Imprime as seguintes informações sobre um ou mais arquivos de entrada:

+ O nome do arquivo
+ Se o arquivo está comprimido (`compression=sim` ou `compression=não`)

+ Se o arquivo está criptografado (`encryption=sim` ou `encryption=não`)

Exemplo:

```
  $> ndbxfrm -i BACKUP-10-0.5.Data BACKUP-10.5.ctl BACKUP-10.5.log
  File=BACKUP-10-0.5.Data, compression=no, encryption=yes
  File=BACKUP-10.5.ctl, compression=no, encryption=yes
  File=BACKUP-10.5.log, compression=no, encryption=yes
  ```

Você também pode ver o cabeçalho e o trailer do arquivo usando a opção `--informações detalhadas`.

* `--caminho-de-login`

<table frame="box" rules="all" summary="Propriedades para decrypt-key"><tr>
  <th>Formato de linha de comando</th>
  <td><code>--decrypt-key=chave</code></td>
</tr></table>

Leia o caminho fornecido a partir do arquivo de login.

* `--sem-caminhos-de-login`

<table frame="box" rules="all" summary="Propriedades para decrypt-key"><tr>
  <th>Formato de linha de comando</th>
  <td><code>--decrypt-key=chave</code></td>
</tr></table>

Ignora a leitura das opções do caminho de login.

* `--sem-padrões`

<table frame="box" rules="all" summary="Propriedades para decrypt-key-de-stdin"><tr>
  <th>Formato de linha de comando</th>
  <td><code>--decrypt-key-de-stdin</code></td>
</tr></table>

Não leia as opções padrão de qualquer arquivo de opção, exceto o arquivo de login.

* `--imprimir-padrões`

<table frame="box" rules="all" summary="Propriedades para decrypt-key-from-stdin">
  <tr><th>Formato de Linha de Comando</th> <td><code>--decrypt-key-from-stdin</code></td> </tr>
</table>

  Imprime a lista de argumentos do programa e encerra.

* `--usage`, `-?`

  <table frame="box" rules="all" summary="Propriedades para decrypt-from-stdin">
    <tr><th>Formato de Linha de Comando</th> <td><code>--decrypt-key-from-stdin</code></td> </tr>
  </table>

  Símbolo para `--help`.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Propriedades para decrypt-key-from-stdin">
    <tr><th>Formato de Linha de Comando</th> <td><code>--decrypt-key-from-stdin</code></td> </tr>
  </table>

  Imprime informações sobre a versão.

O **ndbxfrm** pode criptografar backups criados por qualquer versão do NDB Cluster. Os arquivos `.Data`, `.ctl` e `.log` que compõem o backup devem ser criptografados separadamente, e esses arquivos devem ser criptografados separadamente para cada nó de dados. Uma vez criptografados, tais backups só podem ser descriptografados pelo **ndbxfrm**, **ndb\_restore** ou **ndb\_print\_backup**.

Um arquivo criptografado pode ser re-criptografado com uma nova senha usando as opções `--encrypt-password` e `--decrypt-password` juntas, assim:

```
ndbxfrm --decrypt-password=old --encrypt-password=new input_file output_file
```

No exemplo mostrado, *`old`* e *`new`* são as senhas antigas e novas, respectivamente; ambas devem ser citadas. O arquivo de entrada é descriptografado e depois criptografado como o arquivo de saída. O próprio arquivo de entrada não é alterado; se você não quiser que ele seja acessível usando a senha antiga, você deve remover o arquivo de entrada manualmente.