#### 25.12.15.5 Tabela de Resumo de Espera de Objetos

O Performance Schema mantém a tabela [`objects_summary_global_by_type`](performance-schema-objects-summary-global-by-type-table.html "25.12.15.5 Tabela de Resumo de Espera de Objetos") para agregar eventos de espera de objeto.

Exemplo de informações de resumo de eventos de espera de objeto:

```sql
mysql> SELECT * FROM performance_schema.objects_summary_global_by_type\G
...
*************************** 3. row ***************************
   OBJECT_TYPE: TABLE
 OBJECT_SCHEMA: test
   OBJECT_NAME: t
    COUNT_STAR: 3
SUM_TIMER_WAIT: 263126976
MIN_TIMER_WAIT: 1522272
AVG_TIMER_WAIT: 87708678
MAX_TIMER_WAIT: 258428280
...
*************************** 10. row ***************************
   OBJECT_TYPE: TABLE
 OBJECT_SCHEMA: mysql
   OBJECT_NAME: user
    COUNT_STAR: 14
SUM_TIMER_WAIT: 365567592
MIN_TIMER_WAIT: 1141704
AVG_TIMER_WAIT: 26111769
MAX_TIMER_WAIT: 334783032
...
```

A tabela [`objects_summary_global_by_type`](performance-schema-objects-summary-global-by-type-table.html "25.12.15.5 Tabela de Resumo de Espera de Objetos") possui estas colunas de agrupamento para indicar como a tabela agrega eventos: `OBJECT_TYPE`, `OBJECT_SCHEMA` e `OBJECT_NAME`. Cada linha resume eventos para o objeto fornecido.

A tabela [`objects_summary_global_by_type`](performance-schema-objects-summary-global-by-type-table.html "25.12.15.5 Tabela de Resumo de Espera de Objetos") possui as mesmas colunas de resumo que as tabelas `events_waits_summary_by_xxx`. Consulte [Seção 25.12.15.1, “Tabelas de Resumo de Eventos de Espera”](performance-schema-wait-summary-tables.html "25.12.15.1 Wait Event Summary Tables").

O uso de [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") é permitido para a tabela de resumo de objetos. Ele redefine as colunas de resumo para zero, em vez de remover as linhas.