#### 25.12.2.4 A Tabela setup_objects

A tabela [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") controla se o Performance Schema monitora objetos específicos. Por padrão, esta tabela tem um tamanho máximo de 100 linhas. Para alterar o tamanho da tabela, modifique a variável de sistema [`performance_schema_setup_objects_size`](performance-schema-system-variables.html#sysvar_performance_schema_setup_objects_size) na inicialização do servidor.

O conteúdo inicial de [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") é o seguinte:

```sql
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

Modificações na tabela [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") afetam o monitoramento de objetos imediatamente.

Para os tipos de objetos listados em [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table"), o Performance Schema usa a tabela para determinar como monitorá-los. A correspondência de objetos é baseada nas colunas `OBJECT_SCHEMA` e `OBJECT_NAME`. Objetos para os quais não há correspondência não são monitorados.

O efeito da configuração padrão de objetos é instrumentar todas as tables, exceto aquelas nos Databases `mysql`, `INFORMATION_SCHEMA` e `performance_schema`. (Tables no Database `INFORMATION_SCHEMA` não são instrumentadas, independentemente do conteúdo de [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table"); a linha para `information_schema.%` simplesmente torna esse padrão explícito.)

Quando o Performance Schema verifica uma correspondência em [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table"), ele tenta encontrar as correspondências mais específicas primeiro. Por exemplo, com uma table `db1.t1`, ele procura uma correspondência para `'db1'` e `'t1'`, depois para `'db1'` e `'%'`, e então para `'%'` e `'%'`. A ordem em que a correspondência ocorre é importante porque diferentes linhas de [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") correspondentes podem ter valores `ENABLED` e `TIMED` distintos.

Linhas podem ser inseridas ou excluídas de [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") por usuários com o privilégio [`INSERT`](privileges-provided.html#priv_insert) ou [`DELETE`](privileges-provided.html#priv_delete) na tabela. Para linhas existentes, apenas as colunas `ENABLED` e `TIMED` podem ser modificadas, por usuários com o privilégio [`UPDATE`](privileges-provided.html#priv_update) na tabela.

Para mais informações sobre o papel da tabela [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") no filtro de eventos, consulte [Seção 25.4.3, “Pré-Filtragem de Eventos”](performance-schema-pre-filtering.html "25.4.3 Event Pre-Filtering").

A tabela [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") possui as seguintes colunas:

| Coluna | Descrição |
| :--- | :--- |
| `OBJECT_TYPE` | O tipo de objeto a ser instrumentado. O valor é um de `'EVENT'` (evento do Event Scheduler), `'FUNCTION'` (função armazenada), `'PROCEDURE'` (procedimento armazenado), `'TABLE'` (tabela base) ou `'TRIGGER'` (gatilho). A filtragem de `TABLE` afeta eventos de I/O de table (`wait/io/table/sql/handler` instrument) e eventos de Table Lock (`wait/lock/table/sql/handler` instrument). |
| `OBJECT_SCHEMA` | O Schema que contém o objeto. Deve ser um nome literal, ou `'%'` para significar “qualquer Schema.” |
| `OBJECT_NAME` | O nome do objeto instrumentado. Deve ser um nome literal, ou `'%'` para significar “qualquer objeto.” |
| `ENABLED` | Indica se os eventos para o objeto são instrumentados. O valor é `YES` ou `NO`. Esta coluna pode ser modificada. |
| `TIMED` | Indica se os eventos para o objeto têm o tempo registrado (timed). O valor é `YES` ou `NO`. Esta coluna pode ser modificada. |

O comando [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") é permitido para a tabela [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table"). Ele remove as linhas.