### 25.4.10 Determinando O Que É Instrumentado

É sempre possível determinar quais *instruments* o *Performance Schema* inclui verificando a *table* [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table"). Por exemplo, para ver quais *events* relacionados a arquivos são *instrumented* para o *storage engine* `InnoDB`, use esta *query*:

```sql
mysql> SELECT * FROM performance_schema.setup_instruments
       WHERE NAME LIKE 'wait/io/file/innodb/%';
+--------------------------------------+---------+-------+
| NAME                                 | ENABLED | TIMED |
+--------------------------------------+---------+-------+
| wait/io/file/innodb/innodb_data_file | YES     | YES   |
| wait/io/file/innodb/innodb_log_file  | YES     | YES   |
| wait/io/file/innodb/innodb_temp_file | YES     | YES   |
+--------------------------------------+---------+-------+
```

Uma descrição exaustiva do que exatamente é *instrumented* não é fornecida nesta documentação, por várias razões:

* O que é *instrumented* é o código do *server*. Mudanças neste código ocorrem frequentemente, o que também afeta o conjunto de *instruments*.

* Não é prático listar todos os *instruments* porque existem centenas deles.

* Conforme descrito anteriormente, é possível descobrir realizando uma *query* na *table* [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table"). Esta informação está sempre atualizada para a sua versão do MySQL, inclui também a instrumentação para *plugins* *instrumented* que você possa ter instalado e que não fazem parte do *core server*, e pode ser usada por ferramentas automatizadas.