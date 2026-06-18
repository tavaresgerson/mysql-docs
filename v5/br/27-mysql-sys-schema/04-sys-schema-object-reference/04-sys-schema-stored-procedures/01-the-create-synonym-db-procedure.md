#### 26.4.4.1 O Procedure create_synonym_db()

Dado um nome de schema, este procedure cria um schema de sinônimo contendo views que se referem a todas as tables e views no schema original. Isso pode ser usado, por exemplo, para criar um nome mais curto pelo qual se referir a um schema com um nome longo (como `info` em vez de `INFORMATION_SCHEMA`).

##### Parâmetros

* `in_db_name VARCHAR(64)`: O nome do schema para o qual criar o sinônimo.

* `in_synonym VARCHAR(64)`: O nome a ser usado para o schema de sinônimo. Este schema não deve existir previamente.

##### Exemplo

```sql
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