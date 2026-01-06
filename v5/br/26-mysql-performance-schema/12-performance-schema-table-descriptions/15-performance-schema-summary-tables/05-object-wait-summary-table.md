#### 25.12.15.5 Resumo da tabela de espera do objeto

O Schema de Desempenho mantém a tabela `objects_summary_global_by_type` para agregação de eventos de espera de objetos.

Resumo das informações do evento de espera do objeto exemplo:

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

A tabela `objects_summary_global_by_type` possui essas colunas de agrupamento para indicar como a tabela agrega eventos: `OBJECT_TYPE`, `OBJECT_SCHEMA` e `OBJECT_NAME`. Cada linha resume os eventos para o objeto especificado.

`objetos_resumo_global_por_tipo` tem as mesmas colunas de resumo das tabelas `eventos_waits_summary_by_xxx`. Veja Seção 25.12.15.1, “Tabelas de Resumo de Eventos de Espera”.

A opção `TRUNCATE TABLE` é permitida para a tabela de resumo do objeto. Ela redefini o número de colunas de resumo para zero, em vez de remover linhas.
