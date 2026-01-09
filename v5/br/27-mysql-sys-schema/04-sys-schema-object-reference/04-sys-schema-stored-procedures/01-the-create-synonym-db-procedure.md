#### 26.4.4.1 O procedimento create_synonym_db()

Dada um nome de esquema, este procedimento cria um esquema sinônimo contendo visualizações que fazem referência a todas as tabelas e visualizações no esquema original. Isso pode ser usado, por exemplo, para criar um nome mais curto para se referir a um esquema com um nome longo (como `info` em vez de `INFORMATION_SCHEMA`).

##### Parâmetros

- `in_db_name VARCHAR(64)`: O nome do esquema para o qual você deseja criar o sinônimo.

- `in_synonym VARCHAR(64)`: O nome a ser usado para o esquema de sinônimos. Esse esquema não pode já existir.

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
