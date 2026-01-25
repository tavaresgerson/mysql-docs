### 25.4.5 Pré-Filtragem por Objeto

A tabela [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") controla se o Performance Schema monitora objetos específicos de table e Stored Program. O conteúdo inicial de [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") é o seguinte:

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

A coluna `OBJECT_TYPE` indica o tipo de objeto ao qual uma linha se aplica. A filtragem `TABLE` afeta eventos de I/O de table (Instrument `wait/io/table/sql/handler`) e eventos de Lock de table (Instrument `wait/lock/table/sql/handler`).

As colunas `OBJECT_SCHEMA` e `OBJECT_NAME` devem conter um Schema literal ou nome de objeto literal, ou `'%'` para corresponder a qualquer nome.

A coluna `ENABLED` indica se objetos correspondentes são monitorados, e `TIMED` indica se deve ser coletada informação de tempo (timing information). A configuração da coluna `TIMED` afeta o conteúdo da tabela do Performance Schema conforme descrito na [Seção 25.4.1, “Performance Schema Event Timing”](performance-schema-timing.html "25.4.1 Performance Schema Event Timing").

O efeito da configuração padrão de objetos é instrumentar todos os objetos, exceto aqueles nos Databases `mysql`, `INFORMATION_SCHEMA` e `performance_schema`. (Tables no Database `INFORMATION_SCHEMA` não são instrumentadas, independentemente do conteúdo de [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table"); a linha para `information_schema.%` simplesmente torna esse padrão explícito.)

Quando o Performance Schema verifica por uma correspondência em [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table"), ele tenta encontrar as correspondências mais específicas primeiro. Para linhas que correspondem a um dado `OBJECT_TYPE`, o Performance Schema verifica as linhas nesta ordem:

* Linhas com `OBJECT_SCHEMA='literal'` e `OBJECT_NAME='literal'`.

* Linhas com `OBJECT_SCHEMA='literal'` e `OBJECT_NAME='%'`.

* Linhas com `OBJECT_SCHEMA='%'` e `OBJECT_NAME='%'`.

Por exemplo, com uma table `db1.t1`, o Performance Schema procura nas linhas `TABLE` por uma correspondência para `'db1'` e `'t1'`, depois para `'db1'` e `'%'`, e então para `'%'` e `'%'`. A ordem em que a correspondência ocorre é importante porque diferentes linhas correspondentes em [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") podem ter valores `ENABLED` e `TIMED` distintos.

Para eventos relacionados a tables, o Performance Schema combina o conteúdo de [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") com [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") para determinar se deve habilitar Instruments e se deve medir o tempo (time) dos Instruments habilitados:

* Para tables que correspondem a uma linha em [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table"), os Instruments de table produzem eventos somente se `ENABLED` for `YES` em ambas as tabelas [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") e [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table").

* Os valores `TIMED` nas duas tabelas são combinados, de modo que a informação de timing é coletada apenas quando ambos os valores são `YES`.

Para objetos Stored Program, o Performance Schema utiliza as colunas `ENABLED` e `TIMED` diretamente da linha em [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table"). Não há combinação de valores com [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table").

Suponha que [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") contenha as seguintes linhas `TABLE` que se aplicam a `db1`, `db2` e `db3`:

```sql
+-------------+---------------+-------------+---------+-------+
| OBJECT_TYPE | OBJECT_SCHEMA | OBJECT_NAME | ENABLED | TIMED |
+-------------+---------------+-------------+---------+-------+
| TABLE       | db1           | t1          | YES     | YES   |
| TABLE       | db1           | t2          | NO      | NO    |
| TABLE       | db2           | %           | YES     | YES   |
| TABLE       | db3           | %           | NO      | NO    |
| TABLE       | %             | %           | YES     | YES   |
+-------------+---------------+-------------+---------+-------+
```

Se um Instrument relacionado a objetos em [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") tiver um valor `ENABLED` como `NO`, os eventos para o objeto não são monitorados. Se o valor `ENABLED` for `YES`, o monitoramento de eventos ocorre de acordo com o valor `ENABLED` na linha relevante de [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table"):

* Eventos de `db1.t1` são monitorados
* Eventos de `db1.t2` não são monitorados
* Eventos de `db2.t3` são monitorados
* Eventos de `db3.t4` não são monitorados
* Eventos de `db4.t5` são monitorados

Lógica semelhante se aplica para a combinação das colunas `TIMED` das tabelas [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") e [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") para determinar se deve ser coletada informação de timing de eventos.

Se uma table persistente e uma table temporária tiverem o mesmo nome, a correspondência contra as linhas de [`setup_objects`](performance-schema-setup-objects-table.html "25.12.2.4 The setup_objects Table") ocorre da mesma maneira para ambas. Não é possível habilitar o monitoramento para uma table e não para a outra. No entanto, cada table é instrumentada separadamente.