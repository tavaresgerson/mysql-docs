#### 26.4.5.4 A Função format_path()

Dado um nome de *path*, retorna o nome de *path* modificado após substituir *subpaths* que correspondam aos valores das seguintes *system variables*, em ordem:

```sql
datadir
tmpdir
slave_load_tmpdir
innodb_data_home_dir
innodb_log_group_home_dir
innodb_undo_directory
basedir
```

Um valor que corresponde ao valor da *system variable* *`sysvar`* é substituído pela *string* `@@GLOBAL.sysvar`.

Antes do MySQL 5.7.14, barras invertidas (*backslashes*) em nomes de *path* do Windows são convertidas para barras normais (*forward slashes*) no resultado.

##### Parâmetros

* `path VARCHAR(512)`: O nome do *path* a ser formatado.

##### Valor de Retorno

Um valor `VARCHAR(512) CHARACTER SET utf8`.

##### Exemplo

```sql
mysql> SELECT sys.format_path('/usr/local/mysql/data/world/City.ibd');
+---------------------------------------------------------+
| sys.format_path('/usr/local/mysql/data/world/City.ibd') |
+---------------------------------------------------------+
| @@datadir/world/City.ibd                                |
+---------------------------------------------------------+
```