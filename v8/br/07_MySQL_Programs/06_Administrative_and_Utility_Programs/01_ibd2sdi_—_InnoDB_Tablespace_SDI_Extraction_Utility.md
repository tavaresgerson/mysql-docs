### 6.6.1 ibdsdi — Ferramenta de extração de espaço de tabela InnoDB SDI

O **ibd2sdi** é uma ferramenta para extrair informações de dicionário serializado (SDI) dos arquivos do espaço de tabelas `InnoDB`. Os dados SDI estão presentes em todos os arquivos de espaço de tabelas `InnoDB` persistentes.

O **ibd2sdi** pode ser executado em arquivos de espaço de tabela por arquivo (arquivos `*.ibd`), arquivos de espaço de tabela geral (arquivos `*.ibd`), arquivos de espaço de tabela do sistema (arquivos `ibdata*`), e o espaço de tabela do dicionário de dados (`mysql.ibd`). Ele não é suportado para uso com espaços de tabela temporários ou espaços de tabela de desfazer.

O **ibd2sdi** pode ser usado em tempo de execução ou quando o servidor está offline. Durante operações de DDL, operações `ROLLBACK` e operações de purga do log de desfazer relacionadas ao SDI, pode haver um curto intervalo de tempo em que o **ibd2sdi** não consegue ler os dados do SDI armazenados no espaço de tabelas.

O **ibd2sdi** realiza uma leitura não comprometida do SDI das tabelas especificadas. Os logs de refazer e os logs de desfazer não são acessados.

Invoque o utilitário **ibd2sdi** da seguinte forma:

```
ibd2sdi [options] file_name1 [file_name2 file_name3 ...]
```

O **ibd2sdi** suporta espaços de tabela de vários arquivos, como o espaço de tabela `InnoDB` do sistema, mas não pode ser executado em mais de um espaço de tabela de cada vez. Para espaços de tabela de vários arquivos, especifique cada arquivo:

```
ibd2sdi ibdata1 ibdata2
```

Os arquivos de um espaço de tabela de vários arquivos devem ser especificados em ordem do número de página ascendente. Se dois arquivos consecutivos tiverem o mesmo ID de espaço, o arquivo mais recente deve começar com o último número de página do arquivo anterior + 1.

O **ibd2sdi** emite SDI (contendo campos id, tipo e dados) no formato `JSON`.

#### ibd2sdi Opções

O **ibd2sdi** suporta as seguintes opções:

- `--help`, `-h`

  <table summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--help</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

  Exiba uma mensagem de ajuda e saia. Por exemplo:

  ```
  Usage: ./ibd2sdi [-v] [-c <strict-check>] [-d <dump file name>] [-n] filename1 [filenames]
  See http://dev.mysql.com/doc/refman/8.0/en/ibd2sdi.html for usage hints.
    -h, --help          Display this help and exit.
    -v, --version       Display version information and exit.
    -#, --debug[=name]  Output debug log. See
                        http://dev.mysql.com/doc/refman/8.0/en/dbug-package.html
    -d, --dump-file=name
                        Dump the tablespace SDI into the file passed by user.
                        Without the filename, it will default to stdout
    -s, --skip-data     Skip retrieving data from SDI records. Retrieve only id
                        and type.
    -i, --id=#          Retrieve the SDI record matching the id passed by user.
    -t, --type=#        Retrieve the SDI records matching the type passed by
                        user.
    -c, --strict-check=name
                        Specify the strict checksum algorithm by the user.
                        Allowed values are innodb, crc32, none.
    -n, --no-check      Ignore the checksum verification.
    -p, --pretty        Pretty format the SDI output.If false, SDI would be not
                        human readable but it will be of less size
                        (Defaults to on; use --skip-pretty to disable.)

  Variables (--variable-name=value)
  and boolean options {FALSE|TRUE}  Value (after reading options)
  --------------------------------- ----------------------------------------
  debug                             (No default value)
  dump-file                         (No default value)
  skip-data                         FALSE
  id                                0
  type                              0
  strict-check                      crc32
  no-check                          FALSE
  pretty                            TRUE
  ```

- `--version`, `-v`

  <table summary="Propriedades para a versão"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--version</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

  Exibir informações da versão e sair. Por exemplo:

  ```
  ibd2sdi  Ver 8.0.3-dmr for Linux on x86_64 (Source distribution)
  ```

- `--debug[=debug_options]`, `-# [debug_options]`

  <table summary="Propriedades para depuração"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--debug=options</code>]]</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Imprime um log de depuração. Para opções de depuração, consulte a Seção 7.9.4, “O Pacote DBUG”.

  ```
  ibd2sdi --debug=d:t /tmp/ibd2sdi.trace
  ```

  Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`. Os binários de lançamento do MySQL fornecidos pela Oracle *não* são construídos usando essa opção.

- `--dump-file=`, `-d`

  <table summary="Propriedades para arquivo de depuração"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--dump-file=file</code>]]</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

  Descarrega informações serializadas do dicionário (SDI) no arquivo de dump especificado. Se um arquivo de dump não for especificado, o SDI do espaço de tabelas será descarregado em `stdout`.

  ```
  ibd2sdi --dump-file=file_name ../data/test/t1.ibd
  ```

- `--skip-data`, `-s`

  <table summary="Propriedades para dados de salto"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--skip-data</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

  Ignora a recuperação dos valores do campo `data` das informações do dicionário serializado (SDI) e apenas recupera os valores dos campos `id` e `type`, que são chaves primárias para os registros do SDI.

  ```
  $> ibd2sdi --skip-data ../data/test/t1.ibd
  ["ibd2sdi"
  ,
  {
  	"type": 1,
  	"id": 330
  }
  ,
  {
  	"type": 2,
  	"id": 7
  }
  ]
  ```

- `--id=#`, `-i #`

  <table summary="Propriedades para id"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--id=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr></tbody></table>

  Recupera informações do dicionário serializado (SDI) que correspondem ao ID especificado do objeto de tabela ou espaço de tabelas. Um ID de objeto é único para o tipo de objeto. Os IDs de tabelas e espaços de tabelas também estão na coluna `id` das tabelas de dicionário de dados `mysql.tables` e `mysql.tablespace`. Para obter informações sobre as tabelas de dicionário de dados, consulte a Seção 16.1, “Esquema do Dicionário de Dados”.

  ```
  $> ibd2sdi --id=7 ../data/test/t1.ibd
  ["ibd2sdi"
  ,
  {
  	"type": 2,
  	"id": 7,
  	"object":
  		{
      "mysqld_version_id": 80003,
      "dd_version": 80003,
      "sdi_version": 1,
      "dd_object_type": "Tablespace",
      "dd_object": {
          "name": "test/t1",
          "comment": "",
          "options": "",
          "se_private_data": "flags=16417;id=2;server_version=80003;space_version=1;",
          "engine": "InnoDB",
          "files": [
              {
                  "ordinal_position": 1,
                  "filename": "./test/t1.ibd",
                  "se_private_data": "id=2;"
              }
          ]
      }
  }
  }
  ]
  ```

- `--type=#`, `-t #`

  <table summary="Propriedades para tipo"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--type=#</code>]]</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>1</code>]]</p><p class="valid-value">[[<code>2</code>]]</p></td> </tr></tbody></table>

  Recupera informações do dicionário serializado (SDI) que correspondem ao tipo de objeto especificado. O SDI é fornecido para objetos de tabela (tipo=1) e espaços de tabela (tipo=2).

  Este exemplo mostra a saída para um tablespace `ts1` no banco de dados `test`:

  ```
  $> ibd2sdi --type=2 ../data/test/ts1.ibd
  ["ibd2sdi"
  ,
  {
  	"type": 2,
  	"id": 7,
  	"object":
  		{
      "mysqld_version_id": 80003,
      "dd_version": 80003,
      "sdi_version": 1,
      "dd_object_type": "Tablespace",
      "dd_object": {
          "name": "test/ts1",
          "comment": "",
          "options": "",
          "se_private_data": "flags=16417;id=2;server_version=80003;space_version=1;",
          "engine": "InnoDB",
          "files": [
              {
                  "ordinal_position": 1,
                  "filename": "./test/ts1.ibd",
                  "se_private_data": "id=2;"
              }
          ]
      }
  }
  }
  ]
  ```

  Devido à forma como o `InnoDB` lida com metadados de valor padrão, um valor padrão pode estar presente e não estar vazio na saída do **ibd2sdi** para uma coluna de tabela específica, mesmo que ele não seja definido usando `DEFAULT`. Considere as duas tabelas criadas usando as seguintes declarações, no banco de dados denominado `i`:

  ```
  CREATE TABLE t1 (c VARCHAR(16) NOT NULL);

  CREATE TABLE t2 (c VARCHAR(16) NOT NULL DEFAULT "Sakila");
  ```

  Usando **ibd2sdi**, podemos ver que o `default_value` para a coluna `c` não está vazio e, de fato, é preenchido até o comprimento em ambas as tabelas, da seguinte forma:

  ```
  $> ibd2sdi ../data/i/t1.ibd  | grep -m1 '\"default_value\"' | cut -b34- | sed -e s/,//
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\nAAAAAAAAAAA="

  $> ibd2sdi ../data/i/t2.ibd  | grep -m1 '\"default_value\"' | cut -b34- | sed -e s/,//
  "BlNha2lsYQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\nAAAAAAAAAAA="
  ```

  A análise da saída do **ibd2sdi** pode ser mais fácil usando uma ferramenta que suporte JSON, como o **jq**, como mostrado aqui:

  ```
  $> ibd2sdi ../data/i/t1.ibd  | jq '.[1]["object"]["dd_object"]["columns"][0]["default_value"]'
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\nAAAAAAAAAAA="

  $> ibd2sdi ../data/i/t2.ibd  | jq '.[1]["object"]["dd_object"]["columns"][0]["default_value"]'
  "BlNha2lsYQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\nAAAAAAAAAAA="
  ```

  Para obter mais informações, consulte a documentação do MySQL Internals.

- `--strict-check`, `-c`

  <table summary="Propriedades para verificação rigorosa"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--strict-check=algorithm</code>]]</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>crc32</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>crc32</code>]]</p><p class="valid-value">[[<code>innodb</code>]]</p><p class="valid-value">[[<code>none</code>]]</p></td> </tr></tbody></table>

  Especifica um algoritmo de verificação de checksum rigoroso para validar o checksum das páginas que são lidas. As opções incluem `innodb`, `crc32` e `none`.

  Neste exemplo, é especificada a versão rigorosa do algoritmo de verificação de checksum `innodb`:

  ```
  ibd2sdi --strict-check=innodb ../data/test/t1.ibd
  ```

  Neste exemplo, é especificado o algoritmo de verificação de checksum estrito da versão `crc32`:

  ```
  ibd2sdi -c crc32 ../data/test/t1.ibd
  ```

  Se você não especificar a opção `--strict-check`, a validação será realizada com base em verificação de integridade de dados não estritos `innodb`, `crc32` e `none`.

- `--no-check`, `-n`

  <table summary="Propriedades sem verificação"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--no-check</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

  Ignora a validação do checksum para páginas que são lidas.

  ```
  ibd2sdi --no-check ../data/test/t1.ibd
  ```

- `--pretty`, `-p`

  <table summary="Propriedades para bonito"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--pretty</code>]]</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

  Exibe os dados SDI no formato de formatação bonita em JSON. Ativado por padrão. Se desativado, o SDI não é legível para humanos, mas é menor em tamanho. Use `--skip-pretty` para desativá-lo.

  ```
  ibd2sdi --skip-pretty ../data/test/t1.ibd
  ```
