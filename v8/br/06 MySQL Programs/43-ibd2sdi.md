### 6.6.1 ibd2sdi  InnoDB Tablespace SDI Extraction Utility

**ibd2sdi** é um utilitário para extrair informações de dicionário serializadas") (SDI) de arquivos de tablespace `InnoDB`. Os dados SDI estão presentes em todos os arquivos de tablespace `InnoDB` persistentes.

\*\* ibd2sdi \*\* pode ser executado em arquivos de tablespace de arquivo por tabela (arquivos `*.ibd`), arquivos de tablespace gerais (arquivos `*.ibd`), arquivos de tablespace de sistema (arquivos `ibdata*`), e o tablespace de dicionário de dados (`mysql.ibd`).

**ibd2sdi** pode ser usado em tempo de execução ou enquanto o servidor está offline. Durante operações DDL, operações `ROLLBACK` e operações de purga de log de anulação relacionadas ao SDI, pode haver um curto intervalo de tempo em que **ibd2sdi** falha em ler os dados do SDI armazenados no tablespace.

**ibd2sdi** executa uma leitura não comprometida de SDI a partir do espaço de tabela especificado.

Invocar o utilitário ibd2sdi assim:

```
ibd2sdi [options] file_name1 [file_name2 file_name3 ...]
```

**ibd2sdi** suporta tablespaces multi-arquivo como o tablespace do sistema `InnoDB`, mas não pode ser executado em mais de um tablespace de cada vez. Para tablespaces multi-arquivo, especifique cada arquivo:

```
ibd2sdi ibdata1 ibdata2
```

Se dois ficheiros sucessivos tiverem o mesmo ID de espaço, o ficheiro posterior deve começar com o último número de página do ficheiro anterior + 1.

**ibd2sdi** produz SDI (contendo campos de identificação, tipo e dados) no formato `JSON`.

#### ibd2sdi Opções

**ibd2sdi** suporta as seguintes opções:

- `--help`, `-h`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--help</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

Exibe uma mensagem de ajuda e saia. Por exemplo:

```
Usage: ./ibd2sdi [-v] [-c <strict-check>] [-d <dump file name>] [-n] filename1 [filenames]
See http://dev.mysql.com/doc/refman/8.4/en/ibd2sdi.html for usage hints.
  -h, --help          Display this help and exit.
  -v, --version       Display version information and exit.
  -#, --debug[=name]  Output debug log. See
                      http://dev.mysql.com/doc/refman/8.4/en/dbug-package.html
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

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--version</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

Informações de versão e saída. Por exemplo:

```
ibd2sdi  Ver 8.4.6 for Linux on x86_64 (Source distribution)
```

- `--debug[=debug_options]`, `-# [debug_options]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--debug=options</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Corda</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

Imprime um log de depuração. Para opções de depuração, consulte a Seção 7.9.4, The DBUG Package.

```
ibd2sdi --debug=d:t /tmp/ibd2sdi.trace
```

Esta opção está disponível apenas se o MySQL foi construído usando `WITH_DEBUG`.

- `--dump-file=`, `-d`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--dump-file=file</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Nome do ficheiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>[none]</code>]]</td> </tr></tbody></table>

Dumps informações do dicionário serializadas (SDI) no arquivo de despejo especificado. Se um arquivo de despejo não for especificado, o SDI do espaço de tabelas é despejado para `stdout`.

```
ibd2sdi --dump-file=file_name ../data/test/t1.ibd
```

- `--skip-data`, `-s`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--skip-data</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

Salta a recuperação de valores de campo `data` a partir da informação de dicionário serializada (SDI) e apenas recupera os valores de campo `id` e `type`, que são chaves primárias para registros de SDI.

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

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--id=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número inteiro</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr></tbody></table>

Recupera informações de dicionário serializadas (SDI) correspondentes ao id de objeto de tabela ou espaço de tabelas especificado. Um id de objeto é exclusivo do tipo de objeto. IDs de objeto de tabela e espaço de tabelas também são encontrados na coluna `id` das tabelas de dicionário de dados `mysql.tables` e `mysql.tablespace`.

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

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--type=#</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>1</code>]]</p><p class="valid-value">[[<code>2</code>]]</p></td> </tr></tbody></table>

Recupera informações de dicionário serializadas (SDI) correspondentes ao tipo de objeto especificado. O SDI é fornecido para objetos de tabela (tipo = 1) e tablespace (tipo = 2).

Este exemplo mostra a saída para um espaço de tabela `ts1` no banco de dados `test`:

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

Devido à maneira como o `InnoDB` lida com os metadados de valores padrão, um valor padrão pode estar presente e não vazio na saída do ibd2sdi para uma determinada coluna de tabela, mesmo que não seja definido usando o `DEFAULT`. Considere as duas tabelas criadas usando as seguintes instruções, no banco de dados chamado `i`:

```
CREATE TABLE t1 (c VARCHAR(16) NOT NULL);

CREATE TABLE t2 (c VARCHAR(16) NOT NULL DEFAULT "Sakila");
```

Usando **ibd2sdi**, podemos ver que o `default_value` para a coluna `c` não é vazio e é, de fato, preenchido com comprimento em ambas as tabelas, assim:

```
$> ibd2sdi ../data/i/t1.ibd  | grep -m1 '\"default_value\"' | cut -b34- | sed -e s/,//
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\nAAAAAAAAAAA="

$> ibd2sdi ../data/i/t2.ibd  | grep -m1 '\"default_value\"' | cut -b34- | sed -e s/,//
"BlNha2lsYQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\nAAAAAAAAAAA="
```

Exame de **ibd2sdi** saída pode ser mais fácil usando um JSON-consciente utilitário como \*\* jq\*\*, como mostrado aqui:

```
$> ibd2sdi ../data/i/t1.ibd  | jq '.[1]["object"]["dd_object"]["columns"][0]["default_value"]'
"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\nAAAAAAAAAAA="

$> ibd2sdi ../data/i/t2.ibd  | jq '.[1]["object"]["dd_object"]["columns"][0]["default_value"]'
"BlNha2lsYQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\nAAAAAAAAAAA="
```

Para mais informações, consulte a documentação MySQL Internals.

- `--strict-check`, `-c`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--strict-check=algorithm</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>crc32</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>crc32</code>]]</p><p class="valid-value">[[<code>innodb</code>]]</p><p class="valid-value">[[<code>none</code>]]</p></td> </tr></tbody></table>

Especifica um algoritmo de checksum rigoroso para validar a soma de verificação de páginas que são lidas.

Neste exemplo, a versão estrita do algoritmo de soma de verificação `innodb` é especificada:

```
ibd2sdi --strict-check=innodb ../data/test/t1.ibd
```

Neste exemplo, a versão estrita do algoritmo de soma de verificação \[`crc32`] é especificada:

```
ibd2sdi -c crc32 ../data/test/t1.ibd
```

Se você não especificar a opção `--strict-check`, a validação é realizada com base em somas de verificação não rígidas `innodb`, `crc32` e `none`.

- `--no-check`, `-n`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--no-check</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

Salta a validação de soma de verificação para páginas que são lidas.

```
ibd2sdi --no-check ../data/test/t1.ibd
```

- `--pretty`, `-p`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--pretty</code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Número booleano</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>false</code>]]</td> </tr></tbody></table>

Outputs SDI data in JSON pretty print format. Ativado por padrão. Se desativado, SDI não é legível por humanos, mas é menor em tamanho. Use `--skip-pretty` para desativar.

```
ibd2sdi --skip-pretty ../data/test/t1.ibd
```
