#### 30.4.5.4 A função format_path()

Dado um nome de caminho, retorna o nome de caminho modificado após a substituição de subcaminhos que correspondem aos valores das seguintes variáveis do sistema, na ordem:

```
datadir
tmpdir
replica_load_tmpdir
innodb_data_home_dir
innodb_log_group_home_dir
innodb_undo_directory
basedir
```

Um valor que corresponde ao valor da variável do sistema *`sysvar`* é substituído pela string `@@GLOBAL.sysvar`.

##### Parâmetros

* `path VARCHAR(512)`: O nome de caminho a ser formatado.

##### Valor de retorno

Um valor `VARCHAR(512)` na sequência de caracteres `utf8mb3`.

##### Exemplo

```
mysql> SELECT sys.format_path('/usr/local/mysql/data/world/City.ibd');
+---------------------------------------------------------+
| sys.format_path('/usr/local/mysql/data/world/City.ibd') |
+---------------------------------------------------------+
| @@datadir/world/City.ibd                                |
+---------------------------------------------------------+
```