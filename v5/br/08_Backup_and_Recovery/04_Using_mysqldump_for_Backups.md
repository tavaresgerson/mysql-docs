## 7.4 Usando mysqldump para backups

Esta seção descreve como usar o **mysqldump** para produzir arquivos de dump e como recarregar arquivos de dump. Um arquivo de dump pode ser usado de várias maneiras:

* Como um backup para permitir a recuperação de dados em caso de perda de dados.
* Como uma fonte de dados para configurar réplicas.
* Como uma fonte de dados para experimentação:

+ Para fazer uma cópia de um banco de dados que você pode usar sem alterar os dados originais.

+ Para testar possíveis incompatibilidades de atualização.

O **mysqldump** produz dois tipos de saída, dependendo se a opção `--tab` é fornecida:

* Sem `--tab`, o **mysqldump** escreve instruções SQL no saída padrão. Essa saída consiste em instruções `CREATE` para criar objetos descarregados (bancos de dados, tabelas, rotinas armazenadas, etc.) e instruções `INSERT` para carregar dados em tabelas. A saída pode ser salva em um arquivo e recarregada posteriormente usando **mysql** para recarregar os objetos descarregados. São disponíveis opções para modificar o formato das instruções SQL e para controlar quais objetos são descarregados.

* Com `--tab`, o **mysqldump** produz dois arquivos de saída para cada tabela descarregada. O servidor escreve um arquivo como texto delimitado por tabulação, uma string por string de tabela. Este arquivo é denominado `tbl_name.txt` no diretório de saída. O servidor também envia uma declaração `CREATE TABLE` para a tabela com o **mysqldump**, que a escreve como um arquivo denominado `tbl_name.sql` no diretório de saída.

### 7.4.1 Arranjar dados em formato SQL com mysqldump

Esta seção descreve como usar o **mysqldump** para criar arquivos de dump no formato SQL. Para informações sobre a recarga desses arquivos de dump, consulte a Seção 7.4.2, “Recarga de backups no formato SQL”.

Por padrão, o **mysqldump** escreve informações como instruções SQL no saída padrão. Você pode salvar a saída em um arquivo:

```sql
$> mysqldump [arguments] > file_name
```

Para descartar todos os bancos de dados, invoque o **mysqldump** com a opção `--all-databases`:

```sql
$> mysqldump --all-databases > dump.sql
```

Para descartar apenas bancos de dados específicos, nomeie-os na string de comando e use a opção `--databases`:

```sql
$> mysqldump --databases db1 db2 db3 > dump.sql
```

A opção `--databases` faz com que todos os nomes na string de comando sejam tratados como nomes de banco de dados. Sem essa opção, o **mysqldump** trata o primeiro nome como um nome de banco de dados e os seguintes como nomes de tabela.

Com `--all-databases` ou `--databases`, o **mysqldump** escreve as instruções `CREATE DATABASE` e `USE` antes da saída do dump para cada banco de dados. Isso garante que, quando o arquivo de dump for carregado novamente, ele crie cada banco de dados se ele não existir e o torne o banco de dados padrão, de modo que o conteúdo do banco de dados seja carregado no mesmo banco de dados de onde veio. Se você deseja fazer com que o arquivo de dump force um abandono de cada banco de dados antes de recriá-lo, use também a opção `--add-drop-database`. Nesse caso, o **mysqldump** escreve uma declaração `DROP DATABASE` que precede cada declaração `CREATE DATABASE`.

Para descartar um único banco de dados, nomeie-o na string de comando:

```sql
$> mysqldump --databases test > dump.sql
```

No caso de uma única base de dados, é permitido omitir a opção `--databases`:

```sql
$> mysqldump test > dump.sql
```

A diferença entre os dois comandos anteriores é que, sem `--databases`, a saída do dump não contém declarações de `CREATE DATABASE` ou `USE`. Isso tem várias implicações:

* Ao recarregar o arquivo de dump, você deve especificar um nome de banco de dados padrão para que o servidor saiba qual banco de dados recarregar.

* Para a recarga, você pode especificar um nome de banco de dados diferente do nome original, o que permite recarregar os dados em um banco de dados diferente.

* Se o banco de dados que será recarregado não existir, você deve criá-lo primeiro.

* Como a saída não contém nenhuma declaração `CREATE DATABASE`, a opção `--add-drop-database` não tem efeito. Se você a usar, ela não produz nenhuma declaração `DROP DATABASE`.

Para descartar apenas tabelas específicas de um banco de dados, nomeie-as na string de comando após o nome do banco de dados:

```sql
$> mysqldump test t1 t3 t7 > dump.sql
```

### 7.4.2 Recarga de backups em formato SQL

Para recarregar um arquivo de dump escrito por **mysqldump** que consiste em declarações SQL, use-o como entrada para o cliente **mysql**. Se o arquivo de dump foi criado por **mysqldump** com a opção `--all-databases` ou `--databases`, ele contém declarações `CREATE DATABASE` e `USE` e não é necessário especificar um banco de dados padrão no qual carregar os dados:

```sql
$> mysql < dump.sql
```

Como alternativa, dentro de **mysql**, use o comando `source`:

```sql
mysql> source dump.sql
```

Se o arquivo for um dump de uma única base de dados que não contém as declarações `CREATE DATABASE` e `USE`, crie a base de dados primeiro (se necessário):

```sql
$> mysqladmin create db1
```

Em seguida, especifique o nome do banco de dados ao carregar o arquivo de dump:

```sql
$> mysql db1 < dump.sql
```

Como alternativa, dentro de **mysql**, crie o banco de dados, selecione-o como o banco de dados padrão e carregue o arquivo de dump:

```sql
mysql> CREATE DATABASE IF NOT EXISTS db1;
mysql> USE db1;
mysql> source dump.sql
```

Nota

Para usuários do Windows PowerShell: Como o caractere "<" é reservado para uso futuro no PowerShell, é necessária uma abordagem alternativa, como o uso de aspas `cmd.exe /c "mysql < dump.sql"`.

### 7.4.3 Armazene dados em formato de texto delimitado com mysqldump

Esta seção descreve como usar o **mysqldump** para criar arquivos de dump de texto delimitado. Para informações sobre a recarga desses arquivos de dump, consulte a Seção 7.4.4, “Recarga de backups de formato de texto delimitado”.

Se você invocar o **mysqldump** com a opção `--tab=dir_name`, ele usa *`dir_name`* como o diretório de saída e densa as tabelas individualmente nesse diretório, usando dois arquivos para cada tabela. O nome da tabela é o nome base desses arquivos. Para uma tabela com o nome `t1`, os arquivos são nomeados `t1.sql` e `t1.txt`. O arquivo `.sql` contém uma declaração `CREATE TABLE` para a tabela. O arquivo `.txt` contém os dados da tabela, uma string por string da tabela.

O comando a seguir descarrega o conteúdo do banco de dados `db1` para arquivos no banco de dados `/tmp`:

```sql
$> mysqldump --tab=/tmp db1
```

Os arquivos `.txt` que contêm dados de tabela são escritos pelo servidor, portanto, eles pertencem à conta do sistema usada para executar o servidor. O servidor usa `SELECT ... INTO OUTFILE` para escrever os arquivos, portanto, você deve ter o privilégio `FILE` para realizar essa operação, e um erro ocorre se um arquivo específico `.txt` já existir.

O servidor envia as definições do `CREATE` para as tabelas descarregadas para o **mysqldump**, que as escreve em arquivos do `.sql`. Portanto, esses arquivos são de propriedade do usuário que executa o **mysqldump**.

É melhor que `--tab` seja usado apenas para drenar um servidor local. Se você o usar com um servidor remoto, o diretório `--tab` deve existir nos hosts local e remoto, e os arquivos `.txt` são escritos pelo servidor no diretório remoto (no host do servidor), enquanto os arquivos `.sql` são escritos pelo **mysqldump** no diretório local (no host do cliente).

Para **mysqldump --tab**, o servidor, por padrão, escreve os dados da tabela em arquivos `.txt` uma string por string com tabs entre os valores das colunas, sem aspas ao redor dos valores das colunas e nova string como o terminador de string. (Estes são os mesmos padrões padrão que para `SELECT ... INTO OUTFILE`.)

Para permitir que arquivos de dados sejam escritos usando um formato diferente, o **mysqldump** suporta essas opções:

* `--fields-terminated-by=str`

A string para separar os valores das colunas (padrão: tab).

* `--fields-enclosed-by=char`

O caractere no qual os valores da coluna devem ser inseridos (padrão: sem caractere).

* `--fields-optionally-enclosed-by=char`

O caractere no qual os valores das colunas não numéricas devem ser inseridos (padrão: sem caractere).

* `--fields-escaped-by=char`

O caractere para escapar de caracteres especiais (padrão: sem escapamento).

* `--lines-terminated-by=str`

A string de término de string (padrão: nova string).

Dependendo do valor que você especificar para qualquer uma dessas opções, pode ser necessário, na string de comando, cobrir ou escapar o valor de forma apropriada para o seu interpretador de comandos. Alternativamente, especifique o valor usando notação hexadecimal. Suponha que você queira que **mysqldump** cobrir os valores das colunas dentro de aspas duplas. Para fazer isso, especifique aspas duplas como o valor para a opção `--fields-enclosed-by`. Mas esse caractere é frequentemente especial para interpretadores de comandos e deve ser tratado de forma especial. Por exemplo, no Unix, você pode cobrir as aspas duplas assim:

```sql
--fields-enclosed-by='"'
```

Em qualquer plataforma, você pode especificar o valor em hexadecimal:

```sql
--fields-enclosed-by=0x22
```

É comum usar várias das opções de formatação de dados juntas. Por exemplo, para descartar tabelas em formato de valores separados por vírgula com strings terminadas por pares de retorno de carro/nova string (`\r\n`), use este comando (entre-o em uma única string):

```sql
$> mysqldump --tab=/tmp --fields-terminated-by=,
         --fields-enclosed-by='"' --lines-terminated-by=0x0d0a db1
```

Se você usar alguma das opções de formatação de dados para descartar dados de tabela, você deve especificar o mesmo formato ao recarregar os arquivos de dados posteriormente, para garantir a interpretação adequada dos conteúdos do arquivo.

### 7.4.4 Recarga de backups em formato de texto delimitado

Para backups produzidos com **mysqldump --tab**, cada tabela é representada no diretório de saída por um arquivo `.sql` contendo a declaração `CREATE TABLE` para a tabela, e um arquivo `.txt` contendo os dados da tabela. Para recarregar uma tabela, primeiro mude a localização para o diretório de saída. Em seguida, processe o arquivo `.sql` com o **mysql** para criar uma tabela vazia e processe o arquivo `.txt` para carregar os dados na tabela:

```sql
$> mysql db1 < t1.sql
$> mysqlimport db1 t1.txt
```

Uma alternativa para usar **mysqlimport** para carregar o arquivo de dados é usar a declaração `LOAD DATA` dentro do cliente **mysql**:

```sql
mysql> USE db1;
mysql> LOAD DATA INFILE 't1.txt' INTO TABLE t1;
```

Se você usou alguma opção de formatação de dados com **mysqldump** quando você inicialmente drenou a tabela, você deve usar as mesmas opções com **mysqlimport** ou `LOAD DATA` para garantir a interpretação adequada dos conteúdos do arquivo de dados:

```sql
$> mysqlimport --fields-terminated-by=,
         --fields-enclosed-by='"' --lines-terminated-by=0x0d0a db1 t1.txt
```

Ou:

```sql
mysql> USE db1;
mysql> LOAD DATA INFILE 't1.txt' INTO TABLE t1
       FIELDS TERMINATED BY ',' FIELDS ENCLOSED BY '"'
       LINES TERMINATED BY '\r\n';
```

### 7.4.5 Dicas do mysqldump

Esta seção descreve técnicas que permitem que você use o **mysqldump** para resolver problemas específicos:

* Como fazer uma cópia de um banco de dados
* Como copiar um banco de dados de um servidor para outro
* Como fazer o dump de programas armazenados (procedimentos e funções armazenados, gatilhos e eventos)

* Como descartar definições e dados separadamente

#### 7.4.5.1 Fazer uma cópia de um banco de dados

```sql
$> mysqldump db1 > dump.sql
$> mysqladmin create db2
$> mysql db2 < dump.sql
```

Não use `--databases` na string de comando do comando `USE db1` porque isso faz com que `USE db1` seja incluído no arquivo de dump, o que anula o efeito do nomeação de `db2` na string de comando do **mysql**.

#### 7.4.5.2 Copiar um banco de dados de um servidor para outro

No servidor 1:

```sql
$> mysqldump --databases db1 > dump.sql
```

Copie o arquivo de depuração do Servidor 1 para o Servidor 2.

No servidor 2:

```sql
$> mysql < dump.sql
```

O uso de `--databases` com o comando de string de comando **mysqldump** faz com que o arquivo de dump inclua as instruções `CREATE DATABASE` e `USE` que criam o banco de dados, se ele existir, e o tornam o banco de dados padrão para os dados recarregados.

Como alternativa, você pode omitir `--databases` do comando **mysqldump**. Em seguida, você precisa criar o banco de dados no servidor 2 (se necessário) e especificá-lo como o banco de dados padrão ao recarregar o arquivo de dump.

No servidor 1:

```sql
$> mysqldump db1 > dump.sql
```

No servidor 2:

```sql
$> mysqladmin create db1
$> mysql db1 < dump.sql
```

Você pode especificar um nome de banco de dados diferente neste caso, então omitindo `--databases` do comando **mysqldump**, você pode drenar dados de um banco de dados e carregá-los em outro.

#### 7.4.5.3 Descarte de programas armazenados

Várias opções controlam como o **mysqldump** lida com programas armazenados (procedimentos e funções armazenados, gatilhos e eventos):

* `--events`: Eventos do Cronômetro de Eventos de Dump

* `--routines`: Exporta procedimentos e funções armazenados

* `--triggers`: Descargas de dados para tabelas

A opção `--triggers` é habilitada por padrão, para que, quando as tabelas são descarregadas, elas sejam acompanhadas por quaisquer gatilhos que elas tenham. As outras opções são desabilitadas por padrão e devem ser especificadas explicitamente para descarregar os objetos correspondentes. Para desabilitar explicitamente qualquer uma dessas opções, use sua forma de pular: `--skip-events`, `--skip-routines` ou `--skip-triggers`.

#### 7.4.5.4 Definições e conteúdo da tabela de descarte separadamente

A opção `--no-data` indica ao **mysqldump** que não deve drenar os dados da tabela, resultando em um arquivo de implantação que contém apenas instruções para criar as tabelas. Por outro lado, a opção `--no-create-info` indica ao **mysqldump** que ignore as instruções `CREATE` do resultado, de modo que o arquivo de implantação contenha apenas dados de tabela.

Por exemplo, para descartar as definições e os dados da tabela separadamente para o banco de dados `test`, use esses comandos:

```sql
$> mysqldump --no-data test > dump-defs.sql
$> mysqldump --no-create-info test > dump-data.sql
```

Para um descarte apenas de definição, adicione as opções `--routines` e `--events` para incluir também as definições de rotinas e eventos armazenados:

```sql
$> mysqldump --no-data --routines --events test > dump-defs.sql
```

#### 7.4.5.5 Usando mysqldump para testar incompatibilidades de atualização

Ao considerar uma atualização do MySQL, é prudente instalar a versão mais recente separadamente da sua versão atual de produção. Em seguida, você pode descartar as definições do banco de dados e dos objetos do banco de dados do servidor de produção e carregá-las no novo servidor para verificar se elas são tratadas corretamente. (Isso também é útil para testar reduções de versão.)

No servidor de produção:

```sql
$> mysqldump --all-databases --no-data --routines --events > dump-defs.sql
```

No servidor atualizado:

```sql
$> mysql < dump-defs.sql
```

Como o arquivo de depuração não contém dados de tabela, ele pode ser processado rapidamente. Isso permite que você identifique potenciais incompatibilidades sem esperar por operações de carregamento de dados demoradas. Procure por avisos ou erros enquanto o arquivo de depuração está sendo processado.

Depois de verificar que as definições são tratadas corretamente, descarte os dados e tente carregá-los no servidor atualizado.

No servidor de produção:

```sql
$> mysqldump --all-databases --no-create-info > dump-data.sql
```

No servidor atualizado:

```sql
$> mysql < dump-data.sql
```

Agora, verifique o conteúdo da tabela e execute algumas consultas de teste.