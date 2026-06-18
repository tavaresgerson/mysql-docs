#### 26.4.4.13 O Procedimento ps_setup_reset_to_default()

Redefine a configuração do Performance Schema para suas definições padrão.

##### Parâmetros

* `in_verbose BOOLEAN`: Indica se deve exibir informações sobre cada estágio de setup durante a execução do procedimento. Isso inclui as instruções SQL executadas.

##### Exemplo

```sql
mysql> CALL sys.ps_setup_reset_to_default(TRUE)\G
*************************** 1. row ***************************
status: Resetting: setup_actors
DELETE
FROM performance_schema.setup_actors
WHERE NOT (HOST = '%' AND USER = '%' AND ROLE = '%')

*************************** 1. row ***************************
status: Resetting: setup_actors
INSERT IGNORE INTO performance_schema.setup_actors
VALUES ('%', '%', '%')

...
```