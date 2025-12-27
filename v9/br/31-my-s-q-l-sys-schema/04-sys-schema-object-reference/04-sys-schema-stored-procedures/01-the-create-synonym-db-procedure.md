#### 30.4.4.1 O procedimento create\_synonym\_db()

Dado o nome de um esquema, este procedimento cria um esquema sinônimo contendo visualizações que referenciam todas as tabelas e visualizações no esquema original. Isso pode ser usado, por exemplo, para criar um nome mais curto pelo qual se pode referenciar um esquema com um nome longo (como `info` em vez de `INFORMATION_SCHEMA`).

##### Parâmetros

* `in_db_name VARCHAR(64)`: O nome do esquema para o qual se deseja criar o sinônimo.

* `in_synonym VARCHAR(64)`: O nome a ser usado para o esquema sinônimo. Este esquema não pode já existir.

##### Exemplo

```
mysql> SHOW DATABASES;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
| world              |
+--------------------+
mysql> CALL sys.create_synonym_db('INFORMATION_SCHEMA', 'info');
+---------------------------------------+
| summary                               |
+---------------------------------------+
| Created 63 views in the info database |
+---------------------------------------+
mysql> SHOW DATABASES;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| info               |
| mysql              |
| performance_schema |
| sys                |
| world              |
+--------------------+
mysql> SHOW FULL TABLES FROM info;
+---------------------------------------+------------+
| Tables_in_info                        | Table_type |
+---------------------------------------+------------+
| character_sets                        | VIEW       |
| collation_character_set_applicability | VIEW       |
| collations                            | VIEW       |
| column_privileges                     | VIEW       |
| columns                               | VIEW       |
...
```