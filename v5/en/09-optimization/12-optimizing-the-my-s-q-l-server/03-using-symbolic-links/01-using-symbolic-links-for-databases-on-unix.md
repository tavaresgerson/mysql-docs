#### 8.12.3.1 Usando Links Simbólicos para Databases no Unix

No Unix, a maneira de criar um symlink para um Database é primeiro criar um diretório em algum disco onde você tenha espaço livre e, em seguida, criar um soft link para ele a partir do diretório de dados do MySQL.

```sql
$> mkdir /dr1/databases/test
$> ln -s /dr1/databases/test /path/to/datadir
```

O MySQL não oferece suporte para ligar um diretório a múltiplos Databases. Substituir um diretório de Database por um link simbólico funciona, contanto que você não crie um link simbólico entre Databases. Suponha que você tenha um Database `db1` sob o diretório de dados do MySQL e, em seguida, crie um symlink `db2` que aponte para `db1`:

```sql
$> cd /path/to/datadir
$> ln -s db1 db2
```

O resultado é que, para qualquer table `tbl_a` em `db1`, também parece haver uma table `tbl_a` em `db2`. Se um client atualizar `db1.tbl_a` e outro client atualizar `db2.tbl_a`, é provável que ocorram problemas.