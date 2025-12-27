### 29.4.10 Determinando o que é instrumentado

Sempre é possível determinar quais instrumentos o Schema de Desempenho inclui, verificando a tabela `setup_instruments`. Por exemplo, para ver quais eventos relacionados a arquivos são instrumentados para o mecanismo de armazenamento `InnoDB`, use esta consulta:

```
mysql> SELECT NAME, ENABLED, TIMED
       FROM performance_schema.setup_instruments
       WHERE NAME LIKE 'wait/io/file/innodb/%';
+-------------------------------------------------+---------+-------+
| NAME                                            | ENABLED | TIMED |
+-------------------------------------------------+---------+-------+
| wait/io/file/innodb/innodb_tablespace_open_file | YES     | YES   |
| wait/io/file/innodb/innodb_data_file            | YES     | YES   |
| wait/io/file/innodb/innodb_log_file             | YES     | YES   |
| wait/io/file/innodb/innodb_temp_file            | YES     | YES   |
| wait/io/file/innodb/innodb_arch_file            | YES     | YES   |
| wait/io/file/innodb/innodb_clone_file           | YES     | YES   |
+-------------------------------------------------+---------+-------+
```

Uma descrição exaustiva do que é instrumentado não é fornecida nesta documentação, por várias razões:

* O que é instrumentado é o código do servidor. Alterações neste código ocorrem frequentemente, o que também afeta o conjunto de instrumentos.

* Não é prático listar todos os instrumentos porque há centenas deles.

* Como descrito anteriormente, é possível descobrir isso consultando a tabela `setup_instruments`. Esta informação está sempre atualizada para a sua versão do MySQL, inclui também a instrumentação para plugins instrumentados que você pode ter instalado que não fazem parte do servidor central e podem ser usados por ferramentas automatizadas.