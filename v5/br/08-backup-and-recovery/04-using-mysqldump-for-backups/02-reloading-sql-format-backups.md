### 7.4.2 Recarga de backups no formato SQL

Para recarregar um arquivo de dump escrito pelo **mysqldump** que consiste em instruções SQL, use-o como entrada para o cliente **mysql**. Se o arquivo de dump foi criado pelo **mysqldump** com a opção `--all-databases` ou `--databases`, ele contém instruções `CREATE DATABASE` e `USE` e não é necessário especificar uma base de dados padrão para onde carregar os dados:

```sh
$> mysql < dump.sql
```

Alternativamente, dentro do **mysql**, use o comando `source`:

```sh
mysql> source dump.sql
```

Se o arquivo for um dump de uma única base de dados que não contém as instruções `CREATE DATABASE` e `USE`, crie a base de dados primeiro (se necessário):

```sh
$> mysqladmin create db1
```

Em seguida, especifique o nome do banco de dados ao carregar o arquivo de dump:

```sh
$> mysql db1 < dump.sql
```

Alternativamente, dentro do **mysql**, crie o banco de dados, selecione-o como o banco de dados padrão e carregue o arquivo de dump:

```sh
mysql> CREATE DATABASE IF NOT EXISTS db1;
mysql> USE db1;
mysql> source dump.sql
```

Nota

Para usuários do Windows PowerShell: Como o caractere "<" está reservado para uso futuro no PowerShell, é necessário uma abordagem alternativa, como usar aspas `cmd.exe /c "mysql < dump.sql"`.
