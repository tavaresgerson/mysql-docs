### 9.4.2 Recarregar backups no formato SQL

Para recarregar um arquivo de dump escrito pelo **mysqldump** que consiste em instruções SQL, use-o como entrada para o cliente **mysql**. Se o arquivo de dump foi criado pelo **mysqldump** com a opção `--all-databases` ou `--databases`, ele contém instruções `CREATE DATABASE` e `USE` e não é necessário especificar um banco de dados padrão para onde carregar os dados:

```
$> mysql < dump.sql
```

Alternativamente, a partir do **mysql**, use o comando `source`:

```
mysql> source dump.sql
```

Se o arquivo for um dump de um único banco de dados que não contém instruções `CREATE DATABASE` e `USE`, crie o banco de dados primeiro (se necessário):

```
$> mysqladmin create db1
```

Em seguida, especifique o nome do banco de dados ao carregar o arquivo de dump:

```
$> mysql db1 < dump.sql
```

Alternativamente, a partir do **mysql**, crie o banco de dados, selecione-o como o banco de dados padrão e carregue o arquivo de dump:

```
mysql> CREATE DATABASE IF NOT EXISTS db1;
mysql> USE db1;
mysql> source dump.sql
```

Observação

Para usuários do Windows PowerShell: Como o caractere `<` é reservado para uso futuro no PowerShell, é necessária uma abordagem alternativa, como usar aspas `cmd.exe /c "mysql < dump.sql"`.