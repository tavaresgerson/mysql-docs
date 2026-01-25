### 7.4.1 Despejando Dados em Formato SQL com mysqldump

Esta seção descreve como usar o **mysqldump** para criar arquivos de dump no formato SQL. Para obter informações sobre como recarregar (reloading) tais arquivos de dump, consulte a Seção 7.4.2, “Recarregando Backups em Formato SQL”.

Por padrão, o **mysqldump** grava informações como SQL statements na saída padrão (standard output). Você pode salvar a saída em um arquivo:

```sql
$> mysqldump [arguments] > file_name
```

Para fazer o dump de todos os Databases, invoque o **mysqldump** com a opção `--all-databases`:

```sql
$> mysqldump --all-databases > dump.sql
```

Para fazer o dump apenas de Databases específicos, nomeie-os na linha de comando e use a opção `--databases`:

```sql
$> mysqldump --databases db1 db2 db3 > dump.sql
```

A opção `--databases` faz com que todos os nomes na linha de comando sejam tratados como nomes de Database. Sem esta opção, o **mysqldump** trata o primeiro nome como um nome de Database e os seguintes como nomes de Table.

Com `--all-databases` ou `--databases`, o **mysqldump** grava as statements `CREATE DATABASE` e `USE` antes da saída do dump para cada Database. Isso garante que, quando o arquivo de dump for recarregado (reloaded), ele crie cada Database, caso não exista, e o defina como o Database padrão, para que o conteúdo do Database seja carregado no mesmo Database de onde veio. Se você quiser que o arquivo de dump force um drop (exclusão) de cada Database antes de recriá-lo, use também a opção `--add-drop-database`. Neste caso, o **mysqldump** grava uma statement `DROP DATABASE` precedendo cada statement `CREATE DATABASE`.

Para fazer o dump de um único Database, nomeie-o na linha de comando:

```sql
$> mysqldump --databases test > dump.sql
```

No caso de Database único, é permitido omitir a opção `--databases`:

```sql
$> mysqldump test > dump.sql
```

A diferença entre os dois comandos precedentes é que, sem `--databases`, a saída do dump não contém as statements `CREATE DATABASE` ou `USE`. Isso tem várias implicações:

* Ao recarregar (reload) o arquivo de dump, você deve especificar um nome de Database padrão para que o Server saiba qual Database recarregar.

* Para o reloading, você pode especificar um nome de Database diferente do nome original, o que permite recarregar os dados em um Database distinto.

* Se o Database a ser recarregado não existir, você deve criá-lo primeiro.

* Como a saída não contém a statement `CREATE DATABASE`, a opção `--add-drop-database` não tem efeito. Se você a usar, ela não produzirá nenhuma statement `DROP DATABASE`.

Para fazer o dump apenas de Tables específicas de um Database, nomeie-as na linha de comando após o nome do Database:

```sql
$> mysqldump test t1 t3 t7 > dump.sql
```