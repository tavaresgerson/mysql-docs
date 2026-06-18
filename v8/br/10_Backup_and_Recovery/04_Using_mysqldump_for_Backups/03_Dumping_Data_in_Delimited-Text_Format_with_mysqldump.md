### 9.4.3 Arquivamento de dados no formato de texto delimitado com mysqldump

Esta seção descreve como usar o **mysqldump** para criar arquivos de dump de texto delimitado. Para obter informações sobre a recarga desses arquivos de dump, consulte a Seção 9.4.4, “Recarga de backups em formato de texto delimitado”.

Se você invocar o **mysqldump** com a opção `--tab=dir_name`, ele usa `dir_name` como o diretório de saída e exclui as tabelas individualmente nesse diretório, usando dois arquivos para cada tabela. O nome da tabela é o nome base desses arquivos. Para uma tabela chamada `t1`, os arquivos são chamados de `t1.sql` e `t1.txt`. O arquivo `.sql` contém uma declaração `CREATE TABLE` para a tabela. O arquivo `.txt` contém os dados da tabela, uma linha por linha de tabela.

O comando a seguir descarrega o conteúdo do banco de dados `db1` para arquivos no banco de dados `/tmp`:

```
$> mysqldump --tab=/tmp db1
```

Os arquivos `.txt` que contêm dados de tabela são escritos pelo servidor, portanto, eles pertencem à conta do sistema usada para executar o servidor. O servidor usa `SELECT ... INTO OUTFILE` para escrever os arquivos, então você deve ter o privilégio `FILE` para realizar essa operação, e um erro ocorre se um arquivo específico `.txt` já existir.

O servidor envia as definições `CREATE` para as tabelas descarregadas para o **mysqldump**, que as escreve em arquivos `.sql`. Portanto, esses arquivos são de propriedade do usuário que executa o **mysqldump**.

É melhor que `--tab` seja usado apenas para descartar um servidor local. Se você usá-lo com um servidor remoto, o diretório `--tab` deve existir tanto no host local quanto no remoto, e os arquivos `.txt` são escritos pelo servidor no diretório remoto (no host do servidor), enquanto os arquivos `.sql` são escritos pelo **mysqldump** no diretório local (no host do cliente).

Para **mysqldump --tab**, o servidor escreve, por padrão, os dados da tabela em arquivos `.txt` uma linha por linha com tabs entre os valores das colunas, sem aspas ao redor dos valores das colunas e nova linha como o final da linha. (Estes são os mesmos padrões de `SELECT ... INTO OUTFILE`.)

Para permitir que arquivos de dados sejam escritos usando um formato diferente, o **mysqldump** suporta essas opções:

- `--fields-terminated-by=str`

  A string para separar os valores das colunas (padrão: tabulação).

- `--fields-enclosed-by=char`

  O caractere dentro do qual os valores da coluna devem ser incluídos (padrão: sem caractere).

- `--fields-optionally-enclosed-by=char`

  O caractere dentro do qual os valores das colunas não numéricos serão incluídos (padrão: sem caractere).

- `--fields-escaped-by=char`

  O caractere para escapar de caracteres especiais (padrão: sem escape).

- `--lines-terminated-by=str`

  A string de término de linha (padrão: nova linha).

Dependendo do valor que você especificar para qualquer uma dessas opções, pode ser necessário, na linha de comando, cobrir ou escapar o valor de forma apropriada para o interpretador de comandos. Alternativamente, especifique o valor usando notação hexadecimal. Suponha que você queira que o **mysqldump** cobrira os valores das colunas entre aspas duplas. Para fazer isso, especifique aspas duplas como o valor para a opção `--fields-enclosed-by`. Mas esse caractere é frequentemente especial para os interpretadores de comandos e deve ser tratado de forma especial. Por exemplo, no Unix, você pode cobrir as aspas duplas assim:

```
--fields-enclosed-by='"'
```

Em qualquer plataforma, você pode especificar o valor em hexadecimal:

```
--fields-enclosed-by=0x22
```

É comum usar várias das opções de formatação de dados juntas. Por exemplo, para descartar tabelas no formato de valores separados por vírgula com linhas terminadas por pares de retorno de carro/nova linha (`\r\n`), use este comando (insira-o em uma única linha):

```
$> mysqldump --tab=/tmp --fields-terminated-by=,
         --fields-enclosed-by='"' --lines-terminated-by=0x0d0a db1
```

Se você usar alguma das opções de formatação de dados para descartar os dados da tabela, você precisa especificar o mesmo formato ao recarregar os arquivos de dados posteriormente, para garantir a interpretação correta do conteúdo do arquivo.
