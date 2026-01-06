### 7.4.1 Arquivamento de dados no formato SQL com mysqldump

Esta seção descreve como usar o **mysqldump** para criar arquivos de backup no formato SQL. Para obter informações sobre a recarga desses arquivos de backup, consulte a Seção 7.4.2, “Recarga de backups no formato SQL”.

Por padrão, o **mysqldump** escreve informações como instruções SQL no saída padrão. Você pode salvar a saída em um arquivo:

```sql
$> mysqldump [arguments] > file_name
```

Para descartar todas as bases de dados, invoque o **mysqldump** com a opção `--all-databases`:

```sql
$> mysqldump --all-databases > dump.sql
```

Para descartar apenas bancos de dados específicos, nomeie-os na linha de comando e use a opção `--databases`:

```sql
$> mysqldump --databases db1 db2 db3 > dump.sql
```

A opção `--databases` faz com que todos os nomes na linha de comando sejam tratados como nomes de banco de dados. Sem essa opção, o **mysqldump** trata o primeiro nome como um nome de banco de dados e os seguintes como nomes de tabelas.

Com `--all-databases` ou `--databases`, o **mysqldump** escreve as instruções `CREATE DATABASE` e `USE` antes da saída do dump para cada banco de dados. Isso garante que, quando o arquivo de dump for recarregado, ele crie cada banco de dados se ele não existir e o torne o banco de dados padrão, de modo que o conteúdo do banco de dados seja carregado no mesmo banco de dados de onde veio. Se você quiser que o arquivo de dump force a eliminação de cada banco de dados antes de recriá-lo, use a opção `--add-drop-database`. Nesse caso, o **mysqldump** escreve uma instrução `DROP DATABASE` antes de cada instrução `CREATE DATABASE`.

Para descartar um único banco de dados, nomeie-o na linha de comando:

```sql
$> mysqldump --databases test > dump.sql
```

No caso de uma única base de dados, é permitido omitir a opção `--databases`:

```sql
$> mysqldump test > dump.sql
```

A diferença entre os dois comandos anteriores é que, sem a opção `--databases`, a saída do dump não contém instruções `CREATE DATABASE` ou `USE`. Isso tem várias implicações:

- Ao recarregar o arquivo de dump, você deve especificar um nome de banco de dados padrão para que o servidor saiba qual banco de dados recarregar.

- Para a recarga, você pode especificar um nome de banco de dados diferente do nome original, o que permite recarregar os dados em um banco de dados diferente.

- Se o banco de dados a ser recarregado não existir, você deve criá-lo primeiro.

- Como a saída não contém a instrução `CREATE DATABASE`, a opção `--add-drop-database` não tem efeito. Se você a usar, ela não produz a instrução `DROP DATABASE`.

Para descartar apenas tabelas específicas de um banco de dados, nomeie-as na linha de comando após o nome do banco de dados:

```sql
$> mysqldump test t1 t3 t7 > dump.sql
```
