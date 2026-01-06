#### 26.4.4.13 O procedimento ps\_setup\_reset\_to\_default()

Redefine a configuração do Schema de Desempenho para as configurações padrão.

##### Parâmetros

- `in_verbose BOOLEAN`: Se deve exibir informações sobre cada etapa de configuração durante a execução do procedimento. Isso inclui as instruções SQL executadas.

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
