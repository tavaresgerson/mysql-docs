### 25.5.31 ndbxfrm — Comprimir, descomprimir, criptografar e descriptografar arquivos criados pelo NDB Cluster

O utilitário **ndbxfrm**, introduzido no NDB 8.0.22, pode ser usado para descomprimir, descriptografar e exibir informações sobre arquivos criados pelo NDB Cluster que estão comprimidos, criptografados ou ambos. Também pode ser usado para comprimir ou criptografar arquivos.

**Tabela 25.52 Opções de linha de comando usadas com o programa ndbxfrm**

<table frame="box" rules="all"><thead><tr> <th scope="col">Formato</th> <th scope="col">Descrição</th> <th scope="col">Adicionado, Descontinuado ou Removido</th> </tr></thead><tbody><tr> <th><p>[[PH_HTML_CODE_<code> --encrypt-block-size=# </code>],</p><p> [[PH_HTML_CODE_<code> --encrypt-block-size=# </code>] </p></th> <td>Compressar arquivo</td> <td><p>ADICIONADO: NDB 8.0.22</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code>--encrypt-kdf-iter-count=#</code>] </p></th> <td>Fornecer chave de descriptografia do arquivo</td> <td><p>ADICIONADO: NDB 8.0.31</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> <a class="link" href="mysql-cluster-programs-ndbxfrm.html#option_ndbxfrm_encrypt-kdf-iter-count">-k
                #</a> </code>] </p></th> <td>Forneça a chave de descriptografia do arquivo a partir do stdin</td> <td><p>ADICIONADO: NDB 8.0.31</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --encrypt-key=key </code>] </p></th> <td>Use esta senha para descriptografar o arquivo</td> <td><p>ADICIONADO: NDB 8.0.22</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --encrypt-key-from-stdin </code>] </p></th> <td>Obtenha a senha de descriptografia de forma segura a partir do STDIN</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --encrypt-password=password </code>] </p></th> <td>Leia o arquivo fornecido após os arquivos globais terem sido lidos</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> --encrypt-password-from-stdin </code>] </p></th> <td>Leia também grupos com concatenação(grupo, sufixo)</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code>--help</code>] </p></th> <td>Ler opções padrão a partir do arquivo fornecido apenas</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[PH_HTML_CODE_<code> -? </code>] </p></th> <td>Imprimir informações sobre o arquivo, incluindo o cabeçalho e o trailer do arquivo</td> <td><p>ADICIONADO: NDB 8.0.31</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --encrypt-block-size=# </code>]] </p></th> <td>Tamanho dos blocos de dados de entrada criptografados como uma unidade. Usado com XTS, definido como zero para o modo CBC</td> <td><p>ADICIONADO: NDB 8.0.29</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> -c </code><code> --encrypt-block-size=# </code>] </p></th> <td>Criptografia: 1 para CBC, 2 para XTS</td> <td><p>ADICIONADO: NDB 8.0.29</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--encrypt-kdf-iter-count=#</code>]],</p><p> [[<code> <a class="link" href="mysql-cluster-programs-ndbxfrm.html#option_ndbxfrm_encrypt-kdf-iter-count">-k
                #</a> </code>]] </p></th> <td>Número de iterações usadas na definição de chave</td> <td><p>ADICIONADO: NDB 8.0.22</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --encrypt-key=key </code>]] </p></th> <td>Use esta chave para criptografar o arquivo</td> <td><p>ADICIONADO: NDB 8.0.31</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --encrypt-key-from-stdin </code>]] </p></th> <td>Use a chave fornecida pelo stdin para criptografar o arquivo</td> <td><p>ADICIONADO: NDB 8.0.31</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --encrypt-password=password </code>]] </p></th> <td>Use esta senha para criptografar o arquivo</td> <td><p>ADICIONADO: NDB 8.0.22</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --encrypt-password-from-stdin </code>]] </p></th> <td>Obtenha a senha de criptografia de forma segura a partir do STDIN</td> <td><p>ADICIONADO: NDB 8.0.24</p></td> </tr></tbody><tbody><tr> <th><p>[[<code>--help</code>]],</p><p> [[<code> -? </code>]] </p></th> <td>Informações de uso da impressão</td> <td><p>ADICIONADO: NDB 8.0.22</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --decrypt-key=key </code><code> --encrypt-block-size=# </code>],</p><p> [[<code> --decrypt-key=key </code><code> --encrypt-block-size=# </code>] </p></th> <td>Imprimir informações do arquivo</td> <td><p>ADICIONADO: NDB 8.0.22</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --decrypt-key=key </code><code>--encrypt-kdf-iter-count=#</code>] </p></th> <td>Leia o caminho fornecido a partir do arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --decrypt-key=key </code><code> <a class="link" href="mysql-cluster-programs-ndbxfrm.html#option_ndbxfrm_encrypt-kdf-iter-count">-k
                #</a> </code>] </p></th> <td>Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p> [[<code> --decrypt-key=key </code><code> --encrypt-key=key </code>] </p></th> <td>Imprimir a lista de argumentos do programa e sair</td> <td><p>(Suportado em todas as versões do NDB com base no MySQL 8.0)</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --decrypt-key=key </code><code> --encrypt-key-from-stdin </code>],</p><p> [[<code> --decrypt-key=key </code><code> --encrypt-password=password </code>] </p></th> <td>Imprime informações de uso; sinônimo de --help</td> <td><p>ADICIONADO: NDB 8.0.22</p></td> </tr></tbody><tbody><tr> <th><p>[[<code> --decrypt-key=key </code><code> --encrypt-password-from-stdin </code>],</p><p> [[<code> --decrypt-key=key </code><code>--help</code>] </p></th> <td>Informações da versão de saída</td> <td><p>ADICIONADO: NDB 8.0.22</p></td> </tr></tbody></table>

#### Uso

```
ndbxfrm --info file[ file ...]

ndbxfrm --compress input_file output_file

ndbxfrm --decrypt-password=password input_file output_file

ndbxfrm [--encrypt-ldf-iter-count=#] --encrypt-password=password input_file output_file
```

`input_file` e `output_file` não podem ser o mesmo arquivo.

#### Opções

- `--compress`, `-c`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>

  Compreende o arquivo de entrada, usando o mesmo método de compressão utilizado para comprometer backups do NDB Cluster, e escreve o resultado em um arquivo de saída. Para descomprimir um backup `NDB` comprimido que não está criptografado, é necessário apenas invocar o **ndbxfrm** usando os nomes do arquivo comprimido e um arquivo de saída (sem opções necessárias).

- `--decrypt-key=key`, `-K` `key`

  <table summary="Propriedades para decrypt-key"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--decrypt-key=key</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>

  Descriptografa um arquivo criptografado por `NDB` usando a chave fornecida.

  Nota

  Esta opção não pode ser usada junto com `--decrypt-password`.

- `--decrypt-key-from-stdin`

  <table summary="Propriedades para decrypt-key-from-stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--decrypt-key-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>

  Descriptografa um arquivo criptografado por `NDB` usando a chave fornecida por `stdin`.

- `--decrypt-password=password`

  <table summary="Propriedades para descriptografar senha"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--decrypt-password=password</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.22-ndb-8.0.22</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Descriptografa um arquivo criptografado por `NDB` usando a senha fornecida.

  Nota

  Esta opção não pode ser usada junto com `--decrypt-key`.

- `--decrypt-password-from-stdin[=TRUE|FALSE]`

  <table summary="Propriedades para decifrar senha a partir de stdin"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--decrypt-password-from-stdin</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>

  Descriptografa um arquivo criptografado por `NDB`, usando uma senha fornecida pelo padrão de entrada. Isso é semelhante a digitar uma senha após invocar o **mysql** `--password` sem senha após a opção.

- `--defaults-extra-file`

  <table summary="Propriedades para defaults-extra-file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-extra-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia o arquivo fornecido após a leitura dos arquivos globais.

- `--defaults-file`

  <table summary="Propriedades para arquivo de falhas"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-file=path</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia as opções padrão do arquivo fornecido.

- `--defaults-group-suffix`

  <table summary="Propriedades para defaults-group-suffix"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--defaults-group-suffix=string</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Leia também grupos com `CONCAT(group, suffix)`.

- `--detailed-info`

  <table summary="Propriedades para informações detalhadas"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--encrypt-block-size=#</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.31-ndb-8.0.31</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>FALSE</code>]]</td> </tr></tbody></table>

  Imprima as informações do arquivo, como `--info`, mas inclua o cabeçalho e o trailer do arquivo.

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

- `--encrypt-block-size=#`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>0

  Tamanho dos blocos de dados de entrada que são criptografados como uma unidade. Usado com XTS; definido para `0` (padrão) para o modo CBC.

- `--encrypt-cipher=#`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>1

  Criptografia usada para criptografia. Definido para `1` para o modo CBC (padrão) ou `2` para XTS.

- `--encrypt-kdf-iter-count=#`, `-k #`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>2

  Ao criptografar um arquivo, especifique o número de iterações a serem usadas para a chave de criptografia. Requer a opção `--encrypt-password`.

- `--encrypt-key=key`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>3

  Criptografa um arquivo usando a chave fornecida.

  Nota

  Esta opção não pode ser usada junto com `--encrypt-password`.

- `--encrypt-key-from-stdin`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>4

  Criptografar um arquivo usando a chave fornecida em `stdin`.

- `--encrypt-password=password`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>5

  Criptografa o arquivo de backup usando a senha fornecida pela opção. A senha deve atender aos requisitos listados aqui:

  - Usa qualquer um dos caracteres ASCII imprimíveis, exceto `!`, `'`, `"`, `$`, `%`, `\`, `` ` `` e `^`

  - Não pode ter mais de 256 caracteres

  - É delimitado por aspas simples ou duplas

  Nota

  Esta opção não pode ser usada junto com `--encrypt-key`.

- `--encrypt-password-from-stdin[=TRUE|FALSE]`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>6

  Criptografa um arquivo usando uma senha fornecida pelo padrão de entrada. Isso é semelhante a digitar uma senha após invocar o **mysql** `--password` sem senha após a opção.

- `--help`, `-?`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>7

  Imprime informações de uso do programa.

- `--info`, `-i`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>8

  Imprime as seguintes informações sobre um ou mais arquivos de entrada:

  - O nome do arquivo

  - Se o arquivo está comprimido (`compression=yes` ou `compression=no`)

  - Se o arquivo está criptografado (`encryption=yes` ou `encryption=no`)

  Exemplo:

  ```
  $> ndbxfrm -i BACKUP-10-0.5.Data BACKUP-10.5.ctl BACKUP-10.5.log
  File=BACKUP-10-0.5.Data, compression=no, encryption=yes
  File=BACKUP-10.5.ctl, compression=no, encryption=yes
  File=BACKUP-10.5.log, compression=no, encryption=yes
  ```

  A partir da versão NDB 8.0.31, você também pode ver o cabeçalho e o trailer do arquivo usando a opção `--detailed-info`.

- `--login-path`

  <table summary="Propriedades para comprimir"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--compress</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.22-ndb-8.0.22</td> </tr></tbody></table>9

  Leia o caminho fornecido a partir do arquivo de login.

- `--no-defaults`

  <table summary="Propriedades para decrypt-key"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--decrypt-key=key</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>0

  Não leia as opções padrão de nenhum arquivo de opção, exceto o arquivo de login.

- `--print-defaults`

  <table summary="Propriedades para decrypt-key"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--decrypt-key=key</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>1

  Imprima a lista de argumentos do programa e saia.

- `--usage`, `-?`

  <table summary="Propriedades para decrypt-key"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--decrypt-key=key</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>2

  Sinônimo de `--help`.

- `--version`, `-V`

  <table summary="Propriedades para decrypt-key"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--decrypt-key=key</code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>3

  Imprime as informações da versão.

O **ndbxfrm** pode criptografar backups criados por qualquer versão do NDB Cluster. Os arquivos `.Data`, `.ctl` e `.log` que compõem o backup devem ser criptografados separadamente, e esses arquivos devem ser criptografados separadamente para cada nó de dados. Uma vez criptografados, esses backups só podem ser descriptografados pelo **ndbxfrm**, **ndb\_restore** ou **ndb\_print\_backup** do NDB Cluster 8.0.22 ou posterior.

Um arquivo criptografado pode ser re-criptografado com uma nova senha usando as opções `--encrypt-password` e `--decrypt-password` juntas, assim:

```
ndbxfrm --decrypt-password=old --encrypt-password=new input_file output_file
```

No exemplo mostrado, `old` e `new` são as senhas antigas e novas, respectivamente; ambas devem ser citadas. O arquivo de entrada é descriptografado e, em seguida, criptografado como o arquivo de saída. O próprio arquivo de entrada não é alterado; se você não quiser que ele seja acessível usando a senha antiga, você deve remover o arquivo de entrada manualmente.
