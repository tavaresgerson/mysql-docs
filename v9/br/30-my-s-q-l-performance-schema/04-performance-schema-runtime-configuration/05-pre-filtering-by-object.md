### 29.4.5 Pré-filtragem por Objeto

A tabela `setup_objects` controla se o Schema de Desempenho monitora objetos específicos de tabelas e programas armazenados. O conteúdo inicial da `setup_objects` parece assim:

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

A coluna `OBJECT_TYPE` indica o tipo de objeto ao qual uma linha se aplica. O filtro `TABLE` afeta eventos de I/O de tabela (`instrumento wait/io/table/sql/handler`) e eventos de bloqueio de tabela (`instrumento wait/lock/table/sql/handler`).

As colunas `OBJECT_SCHEMA` e `OBJECT_NAME` devem conter um nome literal de esquema ou objeto, ou `%'` para corresponder a qualquer nome.

A coluna `ENABLED` indica se os objetos correspondentes são monitorados, e `TIMED` indica se as informações de tempo devem ser coletadas. A configuração da coluna `TIMED` afeta o conteúdo da tabela do Schema de Desempenho conforme descrito na Seção 29.4.1, “Tempo de Ocorrência de Eventos do Schema de Desempenho”.

O efeito da configuração padrão do objeto é instrumar todos os objetos, exceto aqueles nas bases de dados `mysql`, `INFORMATION_SCHEMA` e `performance_schema`. (As tabelas na base de dados `INFORMATION_SCHEMA` não são instrumentadas, independentemente do conteúdo da `setup_objects`; a linha para `information_schema.%` torna isso explícito por padrão.)

Quando o Schema de Desempenho verifica uma correspondência na `setup_objects`, ele tenta encontrar correspondências mais específicas primeiro. Para linhas que correspondem a um determinado `OBJECT_TYPE`, o Schema de Desempenho verifica as linhas nesta ordem:

* Linhas com `OBJECT_SCHEMA='literal'` e `OBJECT_NAME='literal'`.

* Linhas com `OBJECT_SCHEMA='literal'` e `OBJECT_NAME='%'`.

* Linhas com `OBJECT_SCHEMA='%'` e `OBJECT_NAME='%'`.

Por exemplo, com uma tabela `db1.t1`, o Schema de Desempenho procura nas linhas de `TABLE` para uma correspondência com `'db1'` e `'t1'`, depois com `'db1'` e `'%'`, depois com `'%'` e `'%'`. A ordem em que a correspondência ocorre importa porque diferentes linhas de `setup_objects` podem ter diferentes valores de `ENABLED` e `TIMED`.

Para eventos relacionados a tabelas, o Schema de Desempenho combina o conteúdo de `setup_objects` com `setup_instruments` para determinar se os instrumentos devem ser habilitados e se os instrumentos habilitados devem ser temporizados:

* Para tabelas que correspondem a uma linha em `setup_objects`, os instrumentos de tabela produzem eventos apenas se `ENABLED` for `YES` tanto em `setup_instruments` quanto em `setup_objects`.

* Os valores `TIMED` nas duas tabelas são combinados, de modo que as informações de temporização são coletadas apenas quando ambos os valores são `YES`.

Para objetos de programas armazenados, o Schema de Desempenho toma as colunas `ENABLED` e `TIMED` diretamente da linha de `setup_objects`. Não há combinação de valores com `setup_instruments`.

Suponha que `setup_objects` contenha as seguintes linhas de `TABLE` que se aplicam a `db1`, `db2` e `db3`:

```
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

Se um instrumento relacionado a um objeto em `setup_instruments` tiver um valor `ENABLED` de `NO`, os eventos para o objeto não são monitorados. Se o valor `ENABLED` for `YES`, a monitorização de eventos ocorre de acordo com o valor `ENABLED` na linha relevante de `setup_objects`:

* Eventos de `db1.t1` são monitorados
* Eventos de `db1.t2` não são monitorados
* Eventos de `db2.t3` são monitorados
* Eventos de `db3.t4` não são monitorados
* Eventos de `db4.t5` são monitorados

Uma lógica semelhante se aplica para combinar as colunas `TIMED` das tabelas `setup_instruments` e `setup_objects` para determinar se a informação de temporização dos eventos deve ser coletada.

Se uma tabela persistente e uma tabela temporária tiverem o mesmo nome, a comparação com as linhas de `setup_objects` ocorre da mesma maneira para ambas. Não é possível habilitar o monitoramento para uma tabela e não para a outra. No entanto, cada tabela é instrumentada separadamente.