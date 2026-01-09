#### 26.4.5.4 A função format_path()

Dada um nome de caminho, retorna o nome de caminho modificado após a substituição de subcaminhos que correspondem aos valores das seguintes variáveis do sistema, na ordem:

```sql
datadir
tmpdir
slave_load_tmpdir
innodb_data_home_dir
innodb_log_group_home_dir
innodb_undo_directory
basedir
```

Um valor que corresponde ao valor da variável do sistema *`sysvar`* é substituído pela string `@@GLOBAL.sysvar`.

Antes do MySQL 5.7.14, os backslashes nos nomes de caminho do Windows são convertidos em barras inclinadas no resultado.

##### Parâmetros

- `path VARCHAR(512)`: O nome do caminho a ser formatado.

##### Valor de retorno

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
