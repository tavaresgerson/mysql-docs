#### 29.12.2.4 Tabela `setup_objects`

A tabela `setup_objects` controla se o Schema de Desempenho monitora objetos específicos. Essa tabela tem um tamanho máximo de 100 linhas por padrão. Para alterar o tamanho da tabela, modifique a variável de sistema `performance_schema_setup_objects_size` durante o início do servidor.

O conteúdo inicial da `setup_objects` parece assim:

```
mysql> SELECT * FROM performance_schema.setup_objects;
+-------------+--------------------+-------------+---------+-------+
| OBJECT_TYPE | OBJECT_SCHEMA      | OBJECT_NAME | ENABLED | TIMED |
+-------------+--------------------+-------------+---------+-------+
| EVENT       | mysql              | %           | NO      | NO    |
| EVENT       | performance_schema | %           | NO      | NO    |
| EVENT       | information_schema | %           | NO      | NO    |
| EVENT       | %                  | %           | YES     | YES   |
| FUNCTION    | mysql              | %           | NO      | NO    |
| FUNCTION    | performance_schema | %           | NO      | NO    |
| FUNCTION    | information_schema | %           | NO      | NO    |
| FUNCTION    | %                  | %           | YES     | YES   |
| PROCEDURE   | mysql              | %           | NO      | NO    |
| PROCEDURE   | performance_schema | %           | NO      | NO    |
| PROCEDURE   | information_schema | %           | NO      | NO    |
| PROCEDURE   | %                  | %           | YES     | YES   |
| TABLE       | mysql              | %           | NO      | NO    |
| TABLE       | performance_schema | %           | NO      | NO    |
| TABLE       | information_schema | %           | NO      | NO    |
| TABLE       | %                  | %           | YES     | YES   |
| TRIGGER     | mysql              | %           | NO      | NO    |
| TRIGGER     | performance_schema | %           | NO      | NO    |
| TRIGGER     | information_schema | %           | NO      | NO    |
| TRIGGER     | %                  | %           | YES     | YES   |
+-------------+--------------------+-------------+---------+-------+
```

As modificações na tabela `setup_objects` afetam o monitoramento dos objetos imediatamente.

Para os tipos de objetos listados na `setup_objects`, o Schema de Desempenho usa a tabela para monitorá-los. A correspondência de objetos é baseada nas colunas `OBJECT_SCHEMA` e `OBJECT_NAME`. Os objetos para os quais não há correspondência não são monitorados.

O efeito da configuração padrão do objeto é instrumar todas as tabelas, exceto aquelas nas bases de dados `mysql`, `INFORMATION_SCHEMA` e `performance_schema`. (As tabelas na base de dados `INFORMATION_SCHEMA` não são instrumentadas, independentemente do conteúdo da `setup_objects`; a linha para `information_schema.%` torna isso explícito por padrão.)

Quando o Schema de Desempenho verifica uma correspondência na `setup_objects`, ele tenta encontrar correspondências mais específicas primeiro. Por exemplo, com uma tabela `db1.t1`, ele procura uma correspondência para `'db1'` e `'t1'`, depois para `'db1'` e `'%'`, depois para `'%'` e `'%'`. A ordem em que a correspondência ocorre importa porque diferentes linhas de `setup_objects` de correspondência podem ter diferentes valores de `ENABLED` e `TIMED`.

Linhas podem ser inseridas ou excluídas da `setup_objects` por usuários com o privilégio `INSERT` ou `DELETE` na tabela. Para linhas existentes, apenas as colunas `ENABLED` e `TIMED` podem ser modificadas, por usuários com o privilégio `UPDATE` na tabela.

Para obter mais informações sobre o papel da tabela `setup_objects` na filtragem de eventos, consulte a Seção 29.4.3, “Pre-filtragem de Eventos”.

A tabela `setup_objects` tem as seguintes colunas:

* `OBJECT_TYPE`

  O tipo de objeto a ser instrumentado. O valor é `'EVENT'` (evento do Agendamento de Eventos), `'FUNCTION'` (função armazenada), `'PROCEDURE'` (procedimento armazenado), `'TABLE'` (tabela base) ou `'TRIGGER'` (trigger).

  A filtragem de `TABLE` afeta eventos de E/S de tabela (`instrumento wait/io/table/sql/handler`) e eventos de bloqueio de tabela (`instrumento wait/lock/table/sql/handler`).

* `OBJECT_SCHEMA`

  O esquema que contém o objeto. Isso deve ser um nome literal ou `'%'` para significar “qualquer esquema”.

* `OBJECT_NAME`

  O nome do objeto instrumentado. Isso deve ser um nome literal ou `'%'` para significar “qualquer objeto”.

* `ENABLED`

  Se os eventos do objeto são instrumentados. O valor é `YES` ou `NO`. Esta coluna pode ser modificada.

* `TIMED`

  Se os eventos do objeto são temporizados. Esta coluna pode ser modificada.

A tabela `setup_objects` tem esses índices:

* Índice em (`OBJECT_TYPE`, `OBJECT_SCHEMA`, `OBJECT_NAME`)

O `TRUNCATE TABLE` é permitido para a tabela `setup_objects`. Ele remove as linhas.