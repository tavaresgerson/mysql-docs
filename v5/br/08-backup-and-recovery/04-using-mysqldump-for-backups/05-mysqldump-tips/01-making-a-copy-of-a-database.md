#### 7.4.5.1 Fazer uma cópia de um banco de dados

```sql
$> mysqldump db1 > dump.sql
$> mysqladmin create db2
$> mysql db2 < dump.sql
```

Não use `--databases` na linha de comando do **mysqldump**, pois isso faz com que `USE db1` seja incluído no arquivo de dump, o que anula o efeito de nomear `db2` na linha de comando do **mysql**.
