### 25.4.10 Determinar o que é instrumentado

É sempre possível determinar quais instrumentos o Schema de Desempenho inclui, verificando a tabela `setup_instruments`. Por exemplo, para ver quais eventos relacionados a arquivos estão instrumentados para o motor de armazenamento `InnoDB`, use esta consulta:

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

Uma descrição exaustiva do que exatamente está instrumentado não é fornecida nesta documentação, por várias razões:

- O que é instrumentado é o código do servidor. As alterações neste código ocorrem frequentemente, o que também afeta o conjunto de instrumentos.

- Não é prático listar todos os instrumentos, pois há centenas deles.

- Como descrito anteriormente, é possível descobrir isso consultando a tabela `setup_instruments`. Essas informações estão sempre atualizadas para a sua versão do MySQL, incluem também a instrumentação para plugins instrumentados que você pode ter instalado e que não fazem parte do servidor principal, e podem ser usadas por ferramentas automatizadas.
