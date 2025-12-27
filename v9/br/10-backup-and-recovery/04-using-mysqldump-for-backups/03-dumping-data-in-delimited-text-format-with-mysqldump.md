### 9.4.3 Exportação de dados no formato de texto delimitado com mysqldump

Esta seção descreve como usar o **mysqldump** para criar arquivos de exportação de texto delimitado. Para obter informações sobre a recarga desses arquivos de exportação, consulte a Seção 9.4.4, “Recarga de backups no formato de texto delimitado”.

Se você chamar o **mysqldump** com a opção `--tab=nome_diretório`, ele usa *`nome_diretório`* como diretório de saída e exporta as tabelas individualmente nesse diretório, usando dois arquivos para cada tabela. O nome da tabela é o nome base desses arquivos. Para uma tabela chamada `t1`, os arquivos são chamados `t1.sql` e `t1.txt`. O arquivo `.sql` contém uma declaração `CREATE TABLE` para a tabela. O arquivo `.txt` contém os dados da tabela, uma linha por linha de linha de tabela.

O comando a seguir exporta o conteúdo do banco de dados `db1` para arquivos no diretório `/tmp` do banco de dados:

```
$> mysqldump --tab=/tmp db1
```

Os arquivos `.txt` contendo os dados da tabela são escritos pelo servidor, portanto, são de propriedade da conta de sistema usada para executar o servidor. O servidor usa `SELECT ... INTO OUTFILE` para escrever os arquivos, então você deve ter o privilégio `FILE` para realizar essa operação, e um erro ocorre se um determinado arquivo `.txt` já existir.

O servidor envia as definições `CREATE` para as tabelas exportadas para o **mysqldump**, que as escreve em arquivos `.sql`. Portanto, esses arquivos são de propriedade do usuário que executa o **mysqldump**.

É melhor usar `--tab` apenas para a exportação de um servidor local. Se você usá-lo com um servidor remoto, o diretório `--tab` deve existir nos hosts local e remoto, e os arquivos `.txt` são escritos pelo servidor no diretório remoto (no host do servidor), enquanto os arquivos `.sql` são escritos pelo **mysqldump** no diretório local (no host do cliente).

Para **mysqldump --tab**, o servidor, por padrão, escreve os dados da tabela em arquivos `.txt` uma linha por linha com tabs entre os valores das colunas, sem aspas ao redor dos valores das colunas e nova linha como delimitador de linha. (Estes são os mesmos padrões de saída do comando `SELECT ... INTO OUTFILE`.)

Para permitir que os arquivos de dados sejam escritos usando um formato diferente, o **mysqldump** suporta as seguintes opções:

* `--fields-terminated-by=str`

  A string para separar os valores das colunas (padrão: tab).

* `--fields-enclosed-by=char`

  O caractere dentro do qual os valores das colunas devem ser encerrados (padrão: sem caractere).

* `--fields-optionally-enclosed-by=char`

  O caractere dentro do qual os valores das colunas não numéricos devem ser encerrados (padrão: sem caractere).

* `--fields-escaped-by=char`

  O caractere para escapar caracteres especiais (padrão: sem escapamento).

* `--lines-terminated-by=str`

  A string de delimitação de linha (padrão: nova linha).

Dependendo do valor especificado para qualquer uma dessas opções, pode ser necessário na linha de comando especificar a aspas ou escapar o valor apropriadamente para o interpretador de comandos. Alternativamente, especifique o valor usando notação hexadecimal. Suponha que você queira que o **mysqldump** aspas os valores das colunas dentro de aspas duplas. Para isso, especifique aspas duplas como o valor para a opção `--fields-enclosed-by`. Mas este caractere é frequentemente especial para os interpretadores de comandos e deve ser tratado de forma especial. Por exemplo, no Unix, você pode aspas a aspas duplas assim:

```
--fields-enclosed-by='"'
```

Em qualquer plataforma, você pode especificar o valor em hexadecimal:

```
--fields-enclosed-by=0x22
```

É comum usar várias das opções de formatação de dados juntas. Por exemplo, para drenar tabelas no formato de valores separados por vírgula com linhas terminadas por pares de retorno de carro/nova linha (`\r\n`), use este comando (entre-o em uma única linha):

```
$> mysqldump --tab=/tmp --fields-terminated-by=,
         --fields-enclosed-by='"' --lines-terminated-by=0x0d0a db1
```

Se você usar alguma das opções de formatação de dados para descartar os dados da tabela, você precisa especificar o mesmo formato ao recarregar os arquivos de dados posteriormente, para garantir a interpretação correta do conteúdo do arquivo.