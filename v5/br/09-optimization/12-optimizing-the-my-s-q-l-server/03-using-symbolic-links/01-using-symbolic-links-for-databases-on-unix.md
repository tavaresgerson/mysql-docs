#### 8.12.3.1 Uso de Links Simbólicos para Bancos de Dados no Unix

No Unix, a maneira de criar um symlink para um banco de dados é criar primeiro um diretório em algum disco onde você tenha espaço livre e, em seguida, criar um link simbólico para ele a partir do diretório de dados do MySQL.

```sql
$> mkdir /dr1/databases/test
$> ln -s /dr1/databases/test /path/to/datadir
```

O MySQL não suporta a vinculação de um diretório a múltiplos bancos de dados. Substituir um diretório de banco de dados por um link simbólico funciona desde que você não crie um link simbólico entre os bancos de dados. Suponha que você tenha um banco de dados `db1` sob o diretório de dados do MySQL e, em seguida, crie um symlink `db2` que aponta para `db1`:

```sql
$> cd /path/to/datadir
$> ln -s db1 db2
```

O resultado é que, para qualquer tabela `tbl_a` em `db1`, parece haver também uma tabela `tbl_a` em `db2`. Se um cliente atualizar `db1.tbl_a` e outro cliente atualizar `db2.tbl_a`, problemas provavelmente ocorrerão.
