### 7.4.3 Realizando Dump de Dados em Formato de Texto Delimitado com mysqldump

Esta seção descreve como usar o **mysqldump** para criar arquivos de dump em formato de texto delimitado. Para informações sobre como recarregar (reloading) tais arquivos de dump, consulte a Seção 7.4.4, “Recarregando Backups em Formato de Texto Delimitado”.

Se você invocar o **mysqldump** com a opção `--tab=dir_name`, ele usará *`dir_name`* como o diretório de saída e fará o dump de tabelas individualmente nesse diretório, utilizando dois arquivos para cada tabela. O nome da tabela é o nome base para esses arquivos. Para uma tabela chamada `t1`, os arquivos serão nomeados `t1.sql` e `t1.txt`. O arquivo `.sql` contém uma instrução `CREATE TABLE` para a tabela. O arquivo `.txt` contém os dados da tabela, uma linha por row da tabela.

O seguinte comando faz o dump do conteúdo do Database `db1` para arquivos no diretório `/tmp`:

```sql
$> mysqldump --tab=/tmp db1
```

Os arquivos `.txt` contendo os dados da tabela são escritos pelo Server, portanto, pertencem à conta de sistema usada para executar o Server. O Server usa `SELECT ... INTO OUTFILE` para escrever os arquivos, de modo que você deve ter o privilégio `FILE` para realizar esta operação, e um erro ocorrerá se um determinado arquivo `.txt` já existir.

O Server envia as definições `CREATE` para as tabelas que sofreram dump ao **mysqldump**, que as escreve nos arquivos `.sql`. Portanto, esses arquivos pertencem ao usuário que executa o **mysqldump**.

É melhor que `--tab` seja usado apenas para fazer dump em um Server local. Se você o usar com um Server remoto, o diretório `--tab` deve existir tanto nos Hosts local quanto remoto, e os arquivos `.txt` são escritos pelo Server no diretório remoto (no Host do Server), enquanto os arquivos `.sql` são escritos pelo **mysqldump** no diretório local (no Host do Client).

Para **mysqldump --tab**, o Server por padrão escreve os dados da tabela em arquivos `.txt` com uma linha por row, tabulações entre os valores das colunas, sem aspas ao redor dos valores das colunas e newline (nova linha) como terminador de linha. (Estes são os mesmos padrões de `SELECT ... INTO OUTFILE`.)

Para permitir que os arquivos de dados sejam escritos usando um formato diferente, o **mysqldump** suporta estas opções:

*   `--fields-terminated-by=str`

    A string para separar os valores das colunas (padrão: tabulação).

*   `--fields-enclosed-by=char`

    O caractere dentro do qual delimitar os valores das colunas (padrão: nenhum caractere).

*   `--fields-optionally-enclosed-by=char`

    O caractere dentro do qual delimitar opcionalmente valores de colunas não numéricos (padrão: nenhum caractere).

*   `--fields-escaped-by=char`

    O caractere para escapar caracteres especiais (padrão: sem escape).

*   `--lines-terminated-by=str`

    A string de terminação de linha (padrão: newline).

Dependendo do valor que você especificar para qualquer uma dessas opções, pode ser necessário, na linha de comando, citar (quote) ou escapar o valor apropriadamente para o seu interpretador de comandos. Alternativamente, especifique o valor usando a notação hexadecimal. Suponha que você queira que o **mysqldump** cite os valores das colunas entre aspas duplas. Para fazer isso, especifique aspas duplas como valor para a opção `--fields-enclosed-by`. No entanto, este caractere é frequentemente especial para interpretadores de comandos e deve ser tratado de forma especial. Por exemplo, no Unix, você pode citar as aspas duplas desta forma:

```sql
--fields-enclosed-by='"'
```

Em qualquer plataforma, você pode especificar o valor em hexadecimal:

```sql
--fields-enclosed-by=0x22
```

É comum usar várias das opções de formatação de dados em conjunto. Por exemplo, para fazer o dump de tabelas no formato de valores separados por vírgulas (comma-separated values) com linhas terminadas por pares carriage-return/newline (`\r\n`), use este comando (digite-o em uma única linha):

```sql
$> mysqldump --tab=/tmp --fields-terminated-by=,
         --fields-enclosed-by='"' --lines-terminated-by=0x0d0a db1
```

Caso você use qualquer uma das opções de formatação de dados para fazer o dump de dados da tabela, você deve especificar o mesmo formato ao recarregar (reload) os arquivos de dados posteriormente, para garantir a interpretação adequada do conteúdo do arquivo.