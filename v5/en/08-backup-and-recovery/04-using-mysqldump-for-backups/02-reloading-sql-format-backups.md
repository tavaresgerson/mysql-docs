### 7.4.2 Recarregando Backups em Formato SQL

Para recarregar um dump file escrito pelo **mysqldump** que consiste em comandos SQL, use-o como input para o client **mysql**. Se o dump file foi criado pelo **mysqldump** com a opção `--all-databases` ou `--databases`, ele contém comandos `CREATE DATABASE` e `USE` e não é necessário especificar um Database padrão no qual carregar os dados:

```sql
$> mysql < dump.sql
```

Alternativamente, de dentro do **mysql**, use um comando `source`:

```sql
mysql> source dump.sql
```

Se o arquivo for um dump de um único Database que não contenha comandos `CREATE DATABASE` e `USE`, crie o Database primeiro (se necessário):

```sql
$> mysqladmin create db1
```

Em seguida, especifique o nome do Database ao carregar o dump file:

```sql
$> mysql db1 < dump.sql
```

Alternativamente, de dentro do **mysql**, crie o Database, selecione-o como o Database padrão e carregue o dump file:

```sql
mysql> CREATE DATABASE IF NOT EXISTS db1;
mysql> USE db1;
mysql> source dump.sql
```

Nota

Para usuários do Windows PowerShell: Como o caractere "<" é reservado para uso futuro no PowerShell, é necessária uma abordagem alternativa, como usar aspas `cmd.exe /c "mysql < dump.sql"`.