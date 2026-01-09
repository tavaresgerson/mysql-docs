### 6.6.1 ibdsdi — Ferramenta de Extração de Espaço de Tabela SDI de InnoDB

**ibdsdi** é uma ferramenta para extrair informações de dicionário serializado (SDI) de arquivos de espaço de tabela `InnoDB`. Os dados SDI estão presentes em todos os arquivos de espaço de tabela `InnoDB` persistentes.

**ibdsdi** pode ser executado em arquivos de espaço de tabela por tabela (`arquivos *.ibd`), arquivos de espaço de tabela gerais (`arquivos *.ibd`), arquivos de espaço de tabela do sistema (`arquivos ibdata*`) e o espaço de tabela do dicionário de dados (`mysql.ibd`). Não é suportado para uso com espaços de tabela temporários ou espaços de tabela de undo.

**ibdsdi** pode ser usado em tempo de execução ou quando o servidor está offline. Durante operações DDL, operações `ROLLBACK` e operações de purga de log de undo relacionadas ao SDI, pode haver um curto intervalo de tempo em que **ibdsdi** não consegue ler os dados SDI armazenados no espaço de tabela.

**ibdsdi** realiza uma leitura não comprometida do SDI do espaço de tabela especificado. Registros de refazer e logs de undo não são acessados.

Inicie a ferramenta **ibdsdi** da seguinte forma:

```
ibd2sdi [options] file_name1 [file_name2 file_name3 ...]
```

**ibdsdi** suporta espaços de tabela de vários arquivos, como o espaço de tabela do sistema `InnoDB`, mas não pode ser executado em mais de um espaço de tabela de cada vez. Para espaços de tabela de vários arquivos, especifique cada arquivo:

```
ibd2sdi ibdata1 ibdata2
```

Os arquivos de um espaço de tabela de vários arquivos devem ser especificados em ordem do número de página ascendente. Se dois arquivos consecutivos tiverem o mesmo ID de espaço, o arquivo mais recente deve começar com o último número de página do arquivo anterior + 1.

**ibdsdi** emite SDI (contendo campos id, tipo e dados) no formato `JSON`.

#### Opções do ibd2sdi

**ibdsdi** suporta as seguintes opções:

* `--help`, `-h`

<table frame="box" rules="all" summary="Propriedades para ajuda"><tbody><tr><th>Formato de linha de comando</th> <td><code>--help</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>false</code></td> </tr></tbody></table>

  Exibir uma mensagem de ajuda e sair. Por exemplo:

  ```
  Usage: ./ibd2sdi [-v] [-c <strict-check>] [-d <dump file name>] [-n] filename1 [filenames]
  See http://dev.mysql.com/doc/refman/9.5/en/ibd2sdi.html for usage hints.
    -h, --help          Display this help and exit.
    -v, --version       Display version information and exit.
    -#, --debug[=name]  Output debug log. See
                        http://dev.mysql.com/doc/refman/9.5/en/dbug-package.html
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

* `--version`, `-v`

  <table frame="box" rules="all" summary="Propriedades para versão"><tbody><tr><th>Formato de linha de comando</th> <td><code>--version</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>false</code></td> </tr></tbody></table>

  Exibir informações de versão e sair. Por exemplo:

  ```
  ibd2sdi  Ver 9.5.0 for Linux on x86_64 (Source distribution)
  ```

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Propriedades para depuração"><tbody><tr><th>Formato de linha de comando</th> <td><code>--debug=options</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Imprime um log de depuração. Para opções de depuração, consulte a Seção 7.9.4, “O Pacote DBUG”.

  ```
  ibd2sdi --debug=d:t /tmp/ibd2sdi.trace
  ```

  Esta opção está disponível apenas se o MySQL foi compilado com `WITH_DEBUG`. Os binários de liberação do MySQL fornecidos pela Oracle *não* são compilados com esta opção.

* `--dump-file=`, `-d`

<table frame="box" rules="all" summary="Propriedades para arquivo de depuração">
  <tr><th>Formato de linha de comando</th> <td><code>--dump-file=arquivo</code></td> </tr>
  <tr><th>Tipo</th> <td>Nome do arquivo</td> </tr>
  <tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr>
</table>

  Depura informações de dicionário serializado (SDI) no arquivo de depuração especificado. Se um arquivo de depuração não for especificado, o SDI do espaço de tabelas é depurado no `stdout`.

  ```
  ibd2sdi --dump-file=file_name ../data/test/t1.ibd
  ```

* `--skip-data`, `-s`

  <table frame="box" rules="all" summary="Propriedades para skip-data">
    <tr><th>Formato de linha de comando</th> <td><code>--skip-data</code></td> </tr>
    <tr><th>Tipo</th> <td>Booleano</td> </tr>
    <tr><th>Valor padrão</th> <td><code>false</code></td> </tr>
  </table>

  Ignora a recuperação dos valores do campo `data` das informações de dicionário serializado (SDI) e recupera apenas os valores dos campos `id` e `type`, que são chaves primárias para os registros de SDI.

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

* `--id=#`, `-i #`

  <table frame="box" rules="all" summary="Propriedades para id">
    <tr><th>Formato de linha de comando</th> <td><code>--id=#</code></td> </tr>
    <tr><th>Tipo</th> <td>Inteiro</td> </tr>
    <tr><th>Valor padrão</th> <td><code>0</code></td> </tr>
  </table>

Retorna informações serializadas do dicionário (SDI) que correspondem ao ID especificado do objeto de tabela ou espaço de tabelas. Um ID de objeto é único para o tipo de objeto. Os IDs de tabelas e espaços de tabelas também são encontrados na coluna `id` das tabelas de dicionário de dados `mysql.tables` e `mysql.tablespace`. Para obter informações sobre as tabelas de dicionário de dados, consulte a Seção 16.1, “Esquema do Dicionário de Dados”.

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

* `--type=#`, `-t #`

  <table frame="box" rules="all" summary="Propriedades para o formato de linha de comando"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--type=#</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valores Válidos</th> <td><p class="valid-value"><code>1</code></p><p class="valid-value"><code>2</code></p></td> </tr></tbody></table>

  Retorna informações serializadas do dicionário (SDI) que correspondem ao tipo de objeto especificado. A SDI é fornecida para objetos de tabela (tipo=1) e espaço de tabelas (tipo=2).

  Este exemplo mostra a saída para um espaço de tabelas `ts1` no banco de dados `test`:

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

  Devido à maneira como o `InnoDB` lida com o metadados do valor padrão, um valor padrão pode estar presente e não vazio na saída **ibd2sdi** para uma coluna de tabela específica, mesmo que não seja definido usando `DEFAULT`. Considere as duas tabelas criadas usando as seguintes instruções, no banco de dados chamado `i`:

  ```
  CREATE TABLE t1 (c VARCHAR(16) NOT NULL);

  CREATE TABLE t2 (c VARCHAR(16) NOT NULL DEFAULT "Sakila");
  ```

  Usando **ibd2sdi**, podemos ver que o `default_value` para a coluna `c` não está vazio e, de fato, é preenchido até o comprimento em ambas as tabelas, assim:

  ```
  $> ibd2sdi ../data/i/t1.ibd  | grep -m1 '\"default_value\"' | cut -b34- | sed -e s/,//
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\nAAAAAAAAAAA="

  $> ibd2sdi ../data/i/t2.ibd  | grep -m1 '\"default_value\"' | cut -b34- | sed -e s/,//
  "BlNha2lsYQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\nAAAAAAAAAAA="
  ```

  A análise da saída **ibd2sdi** pode ser mais fácil usando uma ferramenta consciente de JSON como **[jq](https://stedolan.github.io/jq/)**, como mostrado aqui:

  ```
  $> ibd2sdi ../data/i/t1.ibd  | jq '.[1]["object"]["dd_object"]["columns"][0]["default_value"]'
  "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\nAAAAAAAAAAA="

  $> ibd2sdi ../data/i/t2.ibd  | jq '.[1]["object"]["dd_object"]["columns"][0]["default_value"]'
  "BlNha2lsYQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\nAAAAAAAAAAA="
  ```

Para obter mais informações, consulte a documentação sobre os recursos internos do MySQL.

* `--strict-check`, `-c`

  <table frame="box" rules="all" summary="Propriedades para strict-check"><tbody><tr><th>Formato de linha de comando</th> <td><code>--strict-check=algorithm</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td><code>crc32</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>crc32</code></p><p class="valid-value"><code>innodb</code></p><p class="valid-value"><code>none</code></p></td> </tr></tbody></table>

  Especifica um algoritmo de verificação de checksum rigoroso para validar o checksum das páginas que são lidas. As opções incluem `innodb`, `crc32` e `none`.

  Neste exemplo, é especificado o algoritmo de checksum rigoroso do checksum `innodb`:

  ```
  ibd2sdi --strict-check=innodb ../data/test/t1.ibd
  ```

  Neste exemplo, é especificado o algoritmo de checksum `crc32` rigoroso:

  ```
  ibd2sdi -c crc32 ../data/test/t1.ibd
  ```

  Se você não especificar a opção `--strict-check`, a validação é realizada com base em checksums não rigorosos `innodb`, `crc32` e `none`.

* `--no-check`, `-n`

  <table frame="box" rules="all" summary="Propriedades para no-check"><tbody><tr><th>Formato de linha de comando</th> <td><code>--no-check</code></td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>false</code></td> </tr></tbody></table>

  Ignora a validação de checksum para páginas que são lidas.

  ```
  ibd2sdi --no-check ../data/test/t1.ibd
  ```

* `--pretty`, `-p`

<table frame="box" rules="all" summary="Propriedades para formatação bonita">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--pretty</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Booleano</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>false</code></td>
  </tr>
</table>

  Exibe os dados do SDI no formato de impressão bonita em JSON. Ativado por padrão. Se desativado, o SDI não é legível para humanos, mas é menor em tamanho. Use `--skip-pretty` para desativá-lo.

  ```
  ibd2sdi --skip-pretty ../data/test/t1.ibd
  ```